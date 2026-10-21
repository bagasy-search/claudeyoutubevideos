// anselmo01 · piezas NUEVAS del resto (1:48 → 14:26). Mismo idioma visual del minuto 1 (madera, lápiz de carpintero, quemado,
// latón, cal), pero cada paso trae las suyas: cartel de paso, sello quemado HT/MB, conteo de tablas, clavo de espiral, cutaway
// del botador, calibrador, escalera de grosores, luz bajo la regla, rendija contra la luz, escuadra, despiece 80×60, tarugos,
// prensa de cuñas, bisagra de dientes, ménsula, dos tercios, lata de linaza, gris→miel, trapos que arden, taquete que se
// desmorona, teja/anillos, calendario del fin de semana, repaso en tablas quemadas.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CH, FONT, HAND, SERIF, e, ei, extrude, spr } from "./lib";

const LAPIZ = "#2b2622";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const R = (i: number, n: number) => { const x = Math.sin(i * 91.7 + n * 47.3) * 43758.5; return x - Math.floor(x); };
// envoltorio: entra con resorte (escala + caída), sale con fundido
const Pop: React.FC<{ t: number; at: number; out: number; x: number; y: number; sc?: number; rot?: number; drop?: number; children: React.ReactNode }> = ({ t, at, out, x, y, sc = 1, rot = 0, drop = 120, children }) => {
  const k = Math.min(1.08, spr(t, at, 0.85)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -drop}px) rotate(${rot + (1 - Math.min(1, k)) * 6}deg) scale(${sc * (0.7 + 0.3 * k)})` }}>{children}</div>;
};
// tabla de madera clara (fondo de casi todas las piezas)
const tabla = (r = 10): React.CSSProperties => ({ position: "relative", borderRadius: r, background: "repeating-linear-gradient(178deg, rgba(120,80,40,.10) 0 2px, transparent 2px 13px), linear-gradient(180deg,#e9cfa4,#d3b07c)", boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 -6px 0 rgba(90,55,25,.25), inset 0 2px 0 rgba(255,255,255,.3)" });
const Clavito: React.FC<{ l?: number | string; r?: number | string; top?: number }> = ({ l, r, top = 14 }) => <div style={{ position: "absolute", top, left: l, right: r, width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#d8d2c8,#6a6258)" }} />;

// ---------- CARTEL DE PASO: tabla colgada de dos mecates que baja columpiándose; número quemado + título a lápiz ----------
export const PasoCartel: React.FC<{ t: number; at: number; out: number; n: number; title: string; x?: number; y?: number; titleAt?: number }> = ({ t, at, out, n, title, x = 960, y = 250, titleAt }) => {
  const k = spr(t, at, 0.7), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  const sw = 7 * Math.sin((t - at) * 3.2) * Math.exp(-(t - at) * 1.2), drop = (1 - Math.min(1, k)) * -700 - e(t, out, out + 0.35) * 500;
  const w = e(t, titleAt ?? at + 0.45, (titleAt ?? at + 0.45) + 0.8), burn = e(t, at + 0.15, at + 0.6);
  return <div style={{ position: "absolute", left: x, top: y + drop, opacity: o, transformOrigin: "50% -400px", transform: `translate(-50%,-50%) rotate(${sw}deg)` }}>
    {[-1, 1].map((sg) => <div key={sg} style={{ position: "absolute", left: `calc(50% + ${sg * 260}px)`, top: -600, width: 6, height: 610, background: "repeating-linear-gradient(170deg,#b89060 0 6px,#8a6440 6px 12px)" }} />)}
    <div style={{ ...tabla(8), padding: "26px 70px 24px", display: "flex", alignItems: "center", gap: 40, minWidth: 640 }}>
      <Clavito l={18} /><Clavito r={18} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 160, lineHeight: 1, color: `rgb(${60 - 30 * burn},${32 - 16 * burn},${14})`, textShadow: `0 0 ${18 * (1 - burn)}px rgba(255,120,40,${0.9 * (1 - burn)}), 0 2px 0 rgba(255,255,255,.25)` }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 8, color: "#6b4a2c" }}>PASO {n}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 74, lineHeight: "80px", color: LAPIZ, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * w}% -20% 0)` }}>{title}</div>
      </div>
    </div>
  </div>;
};

// ---------- SELLO QUEMADO de la tarima (espiga + letras) que se marca a fuego; HT = palomita, MB = tache + veneno ----------
export const SelloFuego: React.FC<{ t: number; at: number; letters: number; out: number; x: number; y: number; code: "HT" | "MB"; verdict?: number; sub?: string; sc?: number }> = ({ t, at, letters, out, x, y, code, verdict, sub, sc = 1 }) => {
  const b = e(t, at + 0.1, at + 0.7), L = e(t, letters, letters + 0.5), v = verdict !== undefined ? spr(t, verdict, 1.1) : 0;
  const ok = code === "HT", burn = (q: number) => `rgba(${40 + 200 * (1 - q)},${20 + 90 * (1 - q)},${10},${0.25 + 0.7 * q})`;
  return <Pop t={t} at={at} out={out} x={x} y={y} sc={sc}>
    <div style={{ ...tabla(6), width: 620, height: 420, background: "repeating-linear-gradient(176deg, rgba(90,60,30,.16) 0 3px, transparent 3px 17px), linear-gradient(180deg,#b9a690,#9c8a72)" }}>
      <svg width={620} height={420} style={{ position: "absolute", inset: 0 }}>
        <rect x={70} y={60} width={480} height={300} rx={14} fill="none" stroke={burn(b)} strokeWidth={14} style={{ filter: `drop-shadow(0 0 ${10 * (1 - b)}px #ff7a2a)` }} />
        {/* la espiga (trigo) */}
        <g transform="translate(170 210)" stroke={burn(b)} strokeWidth={9} fill="none" strokeLinecap="round" opacity={b}>
          <path d="M0 110 L0 -100" />
          {[-80, -50, -20, 10, 40].map((yy, i) => <g key={i}><path d={`M0 ${yy} q -34 -6 -46 -40`} /><path d={`M0 ${yy} q 34 -6 46 -40`} /></g>)}
        </g>
        <line x1={260} y1={95} x2={260} y2={325} stroke={burn(b)} strokeWidth={6} opacity={b} />
        <text x={410} y={250} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={150} fill={burn(L)} style={{ filter: `drop-shadow(0 0 ${16 * (1 - L)}px #ff8a3a)` }} opacity={L}>{code}</text>
        {L < 0.95 && L > 0.05 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={330 + R(i, 1) * 170} cy={260 - ((t * 120 + R(i, 2) * 200) % 160)} r={3 + R(i, 3) * 5} fill="#ffb060" opacity={0.6 * (1 - L)} />)}
      </svg>
    </div>
    {v > 0.01 && <div style={{ position: "absolute", right: -70, top: -60, width: 170, height: 170, borderRadius: "50%", background: ok ? CH.nopal : "#c8301e", transform: `scale(${Math.min(1.1, v)})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#fff" }}>{ok ? "✓" : "✗"}</div>}
    {sub && v > 0.01 && <div style={{ position: "absolute", left: "50%", bottom: -96, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 900, fontSize: 48, letterSpacing: 4, color: ok ? CH.maiz : "#ff6a4a", textShadow: extrude(5, "rgba(0,0,0,.6)"), opacity: e(t, verdict!, verdict! + 0.3) }}>{sub}</div>}
  </Pop>;
};

// ---------- CONTEO: 7 tablas de arriba + 3 patines, numeradas una por una con gis de carpintero ----------
export const Conteo: React.FC<{ t: number; at: number; dt?: number; patines: number; out: number; x?: number; y?: number }> = ({ t, at, dt = 0.32, patines, out, x = 960, y = 820 }) => {
  return <Pop t={t} at={at} out={out} x={x} y={y} drop={60}>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, padding: "22px 34px", borderRadius: 14, background: "rgba(30,16,8,.72)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 7 }, (_, i) => { const k = spr(t, at + i * dt, 1.2); return <div key={i} style={{ width: 58, height: 150, borderRadius: 4, transform: `scaleY(${Math.min(1.05, k)})`, transformOrigin: "50% 100%", background: "repeating-linear-gradient(180deg, rgba(90,60,30,.18) 0 3px, transparent 3px 14px), linear-gradient(90deg,#d9c19c,#bfa07a)", display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: "0 2px 0 rgba(0,0,0,.4)", opacity: e(t, at + i * dt, at + i * dt + 0.1) }}>{i + 1}</div>; })}
      <div style={{ width: 4, height: 150, background: "rgba(255,255,255,.25)", margin: "0 14px" }} />
      {Array.from({ length: 3 }, (_, i) => { const k = spr(t, patines + i * 0.25, 1.2); return <div key={i} style={{ width: 92, height: 92, borderRadius: 6, transform: `scale(${Math.min(1.05, k)})`, background: "repeating-linear-gradient(180deg, rgba(90,60,30,.2) 0 4px, transparent 4px 16px), linear-gradient(90deg,#a88a68,#8a6e50)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 44, color: "#fff", opacity: e(t, patines + i * 0.25, patines + i * 0.25 + 0.1) }}>P{i + 1}</div>; })}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 40px 0", fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 4, color: CH.crema, textShadow: "0 2px 10px #000" }}>
      <span style={{ opacity: e(t, at + 7 * dt, at + 7 * dt + 0.3) }}>7 TABLAS SANAS</span><span style={{ opacity: e(t, patines + 0.6, patines + 0.9) }}>3 PATINES</span>
    </div>
  </Pop>;
};

// ---------- ¡CRACK!: la tabla se raja en zigzag y salta la astilla ----------
export const Crack: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.25);
  if (t < at || o <= 0.01) return null;
  const k = e(t, at, at + 0.18), s = Math.min(1.15, spr(t, at, 1.4));
  const pts = "0,0 60,-30 110,20 170,-40 230,15 290,-25 350,10";
  return <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
    <svg width={900} height={500} viewBox="-450 -250 900 500" style={{ position: "absolute", left: -450, top: -250, overflow: "visible" }}>
      <polyline points={pts} transform="translate(-175 0)" fill="none" stroke="#1a0c04" strokeWidth={14} strokeDasharray={600} strokeDashoffset={600 * (1 - k)} strokeLinejoin="bevel" />
      <polyline points={pts} transform="translate(-175 0)" fill="none" stroke="#ffd9a0" strokeWidth={4} strokeDasharray={600} strokeDashoffset={600 * (1 - k)} opacity={0.6} />
      {Array.from({ length: 10 }, (_, i) => { const a = R(i, 1) * Math.PI * 2, d = (t - at) * (300 + R(i, 2) * 400); return <rect key={i} x={Math.cos(a) * d} y={Math.sin(a) * d + (t - at) ** 2 * 600} width={8 + R(i, 3) * 26} height={4 + R(i, 4) * 6} fill="#c9a272" transform={`rotate(${(t - at) * 700 * R(i, 5)} ${Math.cos(a) * d} ${Math.sin(a) * d})`} opacity={1 - e(t, at + 0.4, at + 0.9)} />; })}
    </svg>
    <div style={{ position: "absolute", left: 0, top: -170, transform: `translate(-50%,-50%) rotate(-9deg) scale(${s})`, fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: CH.maiz, textShadow: extrude(14, "#5a2a10"), whiteSpace: "nowrap" }}>¡CRACK!</div>
  </div>;
};

// ---------- CLAVO DE ESPIRAL: el clavo gira mostrando su rosca torcida; "no se sale nunca" ----------
export const ClavoEspiral: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const ph = (t - at) * 2.6;
  return <Pop t={t} at={at} out={out} x={x} y={y} rot={-12}>
    <svg width={260} height={660} viewBox="-130 -60 260 660" style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.7))" }}>
      <defs><linearGradient id="acero" x1="0" x2="1"><stop offset="0" stopColor="#4a4a4a" /><stop offset=".45" stopColor="#e8e8e8" /><stop offset=".6" stopColor="#9a9a9a" /><stop offset="1" stopColor="#3a3a3a" /></linearGradient></defs>
      <ellipse cx={0} cy={0} rx={70} ry={18} fill="url(#acero)" />
      <rect x={-20} y={0} width={40} height={500} fill="url(#acero)" />
      {Array.from({ length: 16 }, (_, i) => { const yy = 40 + i * 28 + ((ph * 28) % 28); return yy < 500 ? <path key={i} d={`M -20 ${yy} Q 0 ${yy - 16} 20 ${yy - 22}`} stroke="#2a2a2a" strokeWidth={5} fill="none" opacity={0.7} /> : null; })}
      <path d="M -20 500 L 0 580 L 20 500 Z" fill="url(#acero)" />
    </svg>
    <div style={{ position: "absolute", left: 150, top: 300, whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CH.crema, textShadow: "0 4px 14px #000", clipPath: `inset(-20% ${100 - 100 * e(t, at + 0.4, at + 1.2)}% -20% 0)` }}>de espiral:<br />no se sale nunca</div>
  </Pop>;
};

// ---------- RELOJ de taller (carátula de lámina) que barre los minutos ----------
export const Reloj: React.FC<{ t: number; at: number; out: number; x: number; y: number; label: string; sub?: string; mins?: number }> = ({ t, at, out, x, y, label, sub, mins = 4 }) => {
  const sweep = e(t, at + 0.3, at + 1.8) * mins * 6;
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={340} height={340} viewBox="-170 -170 340 340" style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,.65))" }}>
      <circle r={160} fill="#efe3c6" stroke="#6b4a2c" strokeWidth={16} />
      <path d={`M 0 0 L 0 -140 A 140 140 0 ${sweep > 30 ? 1 : 0} 1 ${140 * Math.sin(sweep * Math.PI / 30)} ${-140 * Math.cos(sweep * Math.PI / 30)} Z`} fill="rgba(194,85,45,.45)" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-140} x2={0} y2={-118} stroke="#3b2414" strokeWidth={6} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-128} stroke="#3b2414" strokeWidth={8} strokeLinecap="round" transform={`rotate(${sweep * 6})`} />
      <circle r={12} fill="#3b2414" />
    </svg>
    <div style={{ textAlign: "center", marginTop: 8, fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CH.maiz, textShadow: extrude(8, "#5a2a10"), whiteSpace: "nowrap" }}>{label}</div>
    {sub && <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 5, color: CH.crema, textShadow: "0 2px 10px #000" }}>{sub}</div>}
  </Pop>;
};

// ---------- CORTE DE LA TABLA: el botador empuja el pedazo de clavo y sale por el otro lado ----------
export const Botador: React.FC<{ t: number; at: number; hit: number; out: number; x: number; y: number }> = ({ t, at, hit, out, x, y }) => {
  const sh = (1 - e(t, hit - 0.25, hit)) * -60 + e(t, hit + 0.15, hit + 0.6) * -40, push = e(t, hit, hit + 0.12) * 110 + e(t, hit + 0.12, hit + 0.9) * 140;
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={700} height={620} viewBox="-350 -320 700 620" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <defs><pattern id="veta" width="700" height="18" patternUnits="userSpaceOnUse"><rect width="700" height="18" fill="#cfae80" /><path d="M0 9 Q 175 3 350 9 T 700 9" stroke="#a8875a" strokeWidth={2} fill="none" /></pattern></defs>
      <rect x={-330} y={-40} width={660} height={120} fill="url(#veta)" stroke="#6b4a2c" strokeWidth={5} rx={6} />
      <text x={-310} y={-60} fontFamily={HAND} fontWeight={700} fontSize={44} fill={CH.crema}>la tabla, por dentro</text>
      {/* pedazo de clavo */}
      <rect x={-10} y={-30 + push} width={20} height={90} fill="#8a8a8a" stroke="#333" strokeWidth={3} />
      {/* botador + martillo */}
      <g transform={`translate(0 ${-150 + push + sh})`}><rect x={-12} y={-120} width={24} height={210} fill="#555" stroke="#222" strokeWidth={3} rx={4} /><path d="M -12 90 L 0 110 L 12 90 Z" fill="#555" /></g>
      <g transform={`translate(0 ${-290 + push + sh * 2.2}) rotate(${-25 + 25 * e(t, hit - 0.25, hit)})`}><rect x={-90} y={-28} width={180} height={56} rx={10} fill="#3a3a3a" /><rect x={60} y={-10} width={220} height={20} fill="#8a5a30" /></g>
      {t > hit && <circle cx={0} cy={-40} r={30 + 120 * e(t, hit, hit + 0.4)} fill="none" stroke={CH.maiz} strokeWidth={6} opacity={1 - e(t, hit, hit + 0.4)} />}
    </svg>
  </Pop>;
};

// ---------- CALIBRADOR (vernier de latón) que mide 19 → 17 → 20 mm ----------
export const Calibrador: React.FC<{ t: number; at: number; vals: { at: number; mm: number }[]; out: number; x: number; y: number }> = ({ t, at, vals, out, x, y }) => {
  let mm = vals[0].mm;
  for (let i = 1; i < vals.length; i++) mm = mm + (vals[i].mm - mm) * ei(t, vals[i].at, vals[i].at + 0.35);
  const cur = vals.filter((v) => t >= v.at - 0.05).pop() ?? vals[0], jaw = 60 + mm * 9;
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={760} height={420} viewBox="-60 -40 760 420" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <defs><linearGradient id="laton" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0b8" /><stop offset=".4" stopColor="#d8a84a" /><stop offset="1" stopColor="#7a5418" /></linearGradient></defs>
      <rect x={0} y={60} width={680} height={56} fill="url(#laton)" stroke="#5a3a0c" strokeWidth={3} rx={4} />
      {Array.from({ length: 41 }, (_, i) => <line key={i} x1={20 + i * 16} y1={60} x2={20 + i * 16} y2={i % 5 ? 76 : 88} stroke="#3a2408" strokeWidth={2} />)}
      <path d="M 0 60 L 0 290 L 50 290 L 50 116" fill="url(#laton)" stroke="#5a3a0c" strokeWidth={3} />
      {/* la tabla entre las mandíbulas */}
      <rect x={50} y={200} width={jaw - 50} height={150} fill="#cfae80" stroke="#6b4a2c" strokeWidth={4} />
      <g transform={`translate(${jaw} 0)`}><path d="M 0 40 L 120 40 L 120 136 L 50 136 L 50 290 L 0 290 Z" fill="url(#laton)" stroke="#5a3a0c" strokeWidth={3} /></g>
    </svg>
    <div style={{ position: "absolute", left: 470, top: 250, fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CH.maiz, textShadow: extrude(10, "#5a2a10"), whiteSpace: "nowrap", transform: `scale(${Math.min(1.1, spr(t, cur.at, 1.3))})` }}>{Math.round(mm)} mm</div>
  </Pop>;
};

// ---------- ESCALERA: tres tablas de distinto grueso juntas y el vaso que se va de lado ----------
export const Escalera: React.FC<{ t: number; at: number; tip: number; out: number; x: number; y: number }> = ({ t, at, tip, out, x, y }) => {
  const hs = [19, 17, 20], g = e(t, tip, tip + 0.5), fall = e(t, tip + 0.4, tip + 1.0);
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={900} height={500} viewBox="-450 -330 900 500" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      {hs.map((h, i) => <rect key={i} x={-330 + i * 220} y={-h * 7} width={216} height={h * 7 + 40} fill={["#d9c19c", "#cbb08a", "#e0c8a4"][i]} stroke="#6b4a2c" strokeWidth={4} />)}
      {hs.map((h, i) => <text key={"t" + i} x={-222 + i * 220} y={70} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={56} fill={LAPIZ}>{h}</text>)}
      {/* el vaso */}
      <g transform={`translate(${-110 + 60 * g + 120 * fall} ${-122 - 20 * g + 260 * fall * fall}) rotate(${-14 * g + 80 * fall})`}>
        <path d="M -40 -130 L 40 -130 L 32 0 L -32 0 Z" fill="rgba(200,230,255,.35)" stroke="#e8f4ff" strokeWidth={5} />
        <path d="M -36 -80 L 36 -80 L 32 0 L -32 0 Z" fill="rgba(120,190,255,.45)" />
      </g>
      {[-110, 110].map((xx) => <line key={xx} x1={xx} y1={-160} x2={xx} y2={-110} stroke={CH.maiz} strokeWidth={6} opacity={e(t, at + 0.4, at + 0.7)} />)}
    </svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: CH.crema, textShadow: "0 4px 14px #000", marginTop: 20, clipPath: `inset(-20% ${100 - 100 * e(t, tip, tip + 0.8)}% -20% 0)` }}>…y el vaso se le cae</div>
  </Pop>;
};

// ---------- LUZ BAJO LA REGLA: perfil de la tabla con una panza; la luz pasa por debajo y se cierra al cepillar ----------
export const LuzRegla: React.FC<{ t: number; at: number; fix: number; out: number; x: number; y: number }> = ({ t, at, fix, out, x, y }) => {
  const gap = 26 * (1 - e(t, fix, fix + 1.6)), glow = 0.5 + 0.5 * Math.sin(t * 6);
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={1100} height={360} viewBox="-550 -200 1100 360" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-520} y={-130} width={1040} height={24} fill="#c8c8c8" stroke="#555" strokeWidth={3} />
      <path d={`M -500 -106 Q 0 ${-106 + gap * 2} 500 -106 L 500 60 L -500 60 Z`} fill="#cfae80" stroke="#6b4a2c" strokeWidth={4} />
      {gap > 1 && <path d={`M -400 -106 Q 0 ${-106 + gap * 2.0} 400 -106 Z`} fill={`rgba(255,240,190,${0.7 + 0.3 * glow})`} style={{ filter: "blur(3px)" }} />}
      {gap > 1 && Array.from({ length: 7 }, (_, i) => <line key={i} x1={-300 + i * 100} y1={-104} x2={-300 + i * 100 + 40} y2={-200} stroke="rgba(255,236,170,.5)" strokeWidth={6} />)}
    </svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CH.crema, textShadow: "0 4px 14px #000", marginTop: 10 }}>{gap > 1 ? "donde pasa la luz, ahí falta" : "ya no pasa luz ✓"}</div>
  </Pop>;
};

// ---------- ESCUADRA de carpintero que se asienta en el canto con el arco de 90° ----------
export const Escuadra: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const a = e(t, at + 0.3, at + 0.9);
  return <Pop t={t} at={at} out={out} x={x} y={y} rot={-6}>
    <svg width={520} height={520} viewBox="-60 -460 520 520" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={0} y={-440} width={60} height={440} fill="#6b4224" stroke="#3a2010" strokeWidth={3} />
      <rect x={0} y={-60} width={440} height={36} fill="#cfd3d6" stroke="#555" strokeWidth={3} />
      {Array.from({ length: 22 }, (_, i) => <line key={i} x1={70 + i * 17} y1={-60} x2={70 + i * 17} y2={i % 5 ? -48 : -40} stroke="#333" strokeWidth={2} />)}
      <path d={`M 160 -60 A 100 100 0 0 0 60 -160`} fill="none" stroke={CH.maiz} strokeWidth={8} strokeDasharray={160} strokeDashoffset={160 * (1 - a)} />
      <text x={150} y={-150} fontFamily={SERIF} fontWeight={900} fontSize={84} fill={CH.maiz} opacity={a} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.7))" }}>90°</text>
    </svg>
  </Pop>;
};

// ---------- RENDIJA CONTRA LA LUZ: dos cantos juntos; la luz pasa por en medio o por las puntas o ya no pasa ----------
export const Rendija: React.FC<{ t: number; at: number; out: number; x: number; y: number; mode: "medio" | "puntas" | "cierra"; close?: number; label?: string; sc?: number }> = ({ t, at, out, x, y, mode, close = 1e9, label, sc = 1 }) => {
  const c = 1 - e(t, close, close + 0.8), pul = 0.75 + 0.25 * Math.sin(t * 7);
  const d = mode === "medio" ? `M -380 0 Q 0 ${-22 * c} 380 0 Q 0 ${22 * c} -380 0` : `M -400 ${-20 * c} L -380 0 L -400 ${20 * c} Z M 400 ${-20 * c} L 380 0 L 400 ${20 * c} Z`;
  return <Pop t={t} at={at} out={out} x={x} y={y} sc={sc}>
    <div style={{ position: "relative", width: 900, height: 360, borderRadius: 18, overflow: "hidden", background: "radial-gradient(ellipse at 50% 50%, #fff6dc, #f3c98a 55%, #b77a3c)" }}>
      <svg width={900} height={360} viewBox="-450 -180 900 360" style={{ position: "absolute", inset: 0 }}>
        <rect x={-400} y={-170} width={800} height={170} fill="#5a3a22" />
        <rect x={-400} y={0} width={800} height={170} fill="#4f321d" />
        {mode !== "cierra" && <path d={d} fill={`rgba(255,250,220,${pul})`} style={{ filter: "blur(4px)" }} />}
        <rect x={-400} y={-1} width={800} height={2} fill="#2a180c" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#fff4d6", textShadow: "0 3px 10px #000" }}>{label}</div>
    </div>
  </Pop>;
};

// ---------- DESPIECE: las 7 tablas de 9 cm se juntan (vista de arriba) y salen las cotas 80 × 60 ----------
export const Despiece: React.FC<{ t: number; at: number; out: number; x: number; y: number; cotas: number }> = ({ t, at, out, x, y, cotas }) => {
  const W = 640, Hh = 480, c = e(t, cotas, cotas + 0.5);
  return <Pop t={t} at={at} out={out} x={x} y={y} drop={0}>
    <div style={{ position: "relative", width: W + 260, height: Hh + 200 }}>
      {Array.from({ length: 7 }, (_, i) => { const k = ei(t, at + 0.2 + i * 0.16, at + 0.7 + i * 0.16); return <div key={i} style={{ position: "absolute", left: 130, top: 80 + i * (Hh / 7) - (1 - k) * (300 + i * 40), width: W, height: Hh / 7 - 3, opacity: k, borderRadius: 3,
        background: `repeating-linear-gradient(90deg, rgba(90,60,30,.16) 0 3px, transparent 3px ${17 + i * 3}px), linear-gradient(180deg,${["#d9c19c", "#cbb08a", "#e0c8a4", "#d2b994", "#c9ad86", "#dcc29e", "#cfb48e"][i]},#b89a72)`, boxShadow: "0 8px 16px rgba(0,0,0,.45)" }} />; })}
      <svg width={W + 260} height={Hh + 200} style={{ position: "absolute", inset: 0, opacity: c }}>
        <line x1={130} y1={40} x2={130 + W} y2={40} stroke={CH.crema} strokeWidth={4} /><path d={`M 130 40 l 18 -10 v 20 Z M ${130 + W} 40 l -18 -10 v 20 Z`} fill={CH.crema} />
        <line x1={80} y1={80} x2={80} y2={80 + Hh} stroke={CH.crema} strokeWidth={4} /><path d={`M 80 80 l -10 18 h 20 Z M 80 ${80 + Hh} l -10 -18 h 20 Z`} fill={CH.crema} />
      </svg>
      <div style={{ position: "absolute", left: 130 + W / 2, top: 0, transform: "translate(-50%,-50%)", opacity: c, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CH.maiz, textShadow: extrude(6, "#5a2a10") }}>80 cm</div>
      <div style={{ position: "absolute", left: 30, top: 80 + Hh / 2, transform: "translate(-50%,-50%) rotate(-90deg)", opacity: c, fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CH.maiz, textShadow: extrude(6, "#5a2a10"), whiteSpace: "nowrap" }}>60 cm</div>
      <div style={{ position: "absolute", left: 150 + W, top: 80 + Hh / 14, transform: "translateY(-50%)", opacity: e(t, at + 1.4, at + 1.8), fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CH.crema, textShadow: "0 3px 10px #000", whiteSpace: "nowrap" }}>← 9 cm</div>
    </div>
  </Pop>;
};

// ---------- TARUGOS en el canto: dos agujeros a 15 cm de cada punta, 2 cm de hondo; el tarugo entra con cola ----------
export const TarugoCanto: React.FC<{ t: number; at: number; out: number; x: number; y: number; holes: number; dowels: number }> = ({ t, at, out, x, y, holes, dowels }) => {
  const hx = [-300, 300];
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={1000} height={420} viewBox="-500 -230 1000 420" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-460} y={-40} width={920} height={110} fill="#d3b688" stroke="#6b4a2c" strokeWidth={4} rx={4} />
      <text x={-450} y={100} fontFamily={HAND} fontWeight={700} fontSize={44} fill={CH.crema}>el canto de la tabla</text>
      {hx.map((xx, i) => { const h = e(t, holes + i * 0.3, holes + i * 0.3 + 0.3), d = ei(t, dowels + i * 0.3, dowels + i * 0.3 + 0.6); return <g key={i}>
        <rect x={xx - 14} y={-40} width={28} height={70 * h} fill="#5a3a20" />
        <g transform={`translate(${xx} ${-200 + 170 * d})`}><rect x={-12} y={0} width={24} height={110} rx={6} fill="#e8cf9e" stroke="#8a6440" strokeWidth={3} />{[20, 45, 70, 95].map((yy) => <line key={yy} x1={-12} y1={yy} x2={12} y2={yy - 8} stroke="#b08a5a" strokeWidth={2} />)}</g>
        {d > 0.95 && <circle cx={xx} cy={-40} r={22} fill="rgba(255,255,255,.85)" />}
      </g>; })}
      <g opacity={e(t, holes, holes + 0.4)} stroke={CH.maiz} strokeWidth={4} fill={CH.maiz} fontFamily={SERIF} fontWeight={900} fontSize={46}>
        <line x1={-460} y1={-120} x2={-300} y2={-120} /><text x={-380} y={-135} textAnchor="middle" stroke="none">15 cm</text>
        <line x1={300} y1={-120} x2={460} y2={-120} /><text x={380} y={-135} textAnchor="middle" stroke="none">15 cm</text>
      </g>
      <text x={0} y={-235} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={54} fill={CH.crema} opacity={e(t, holes + 0.6, holes + 1)}>2 cm de hondo · tarugo de 8 mm</text>
    </svg>
  </Pop>;
};

// ---------- PRENSA DE CUÑAS (vista de arriba): dos tiras, 7 tablas, el hueco, las dos cuñas al revés y los golpecitos ----------
export const PrensaCunas: React.FC<{ t: number; at: number; out: number; x: number; y: number; hueco: number; cunas: number; golpes: number[]; gotas: number; sc?: number }> = ({ t, at, out, x, y, hueco, cunas, golpes, gotas, sc = 1 }) => {
  const g = golpes.filter((q) => t >= q).length, squeeze = Math.min(1, g / golpes.length), cIn = ei(t, cunas, cunas + 0.6);
  const hit = golpes.reduce((m, q) => Math.max(m, t >= q ? Math.exp(-(t - q) * 12) : 0), 0);
  const bw = 66, gap = 3 * (1 - squeeze);
  return <Pop t={t} at={at} out={out} x={x} y={y} sc={sc}>
    <svg width={900} height={640} viewBox="-450 -320 900 640" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-440} y={-300} width={880} height={600} rx={12} fill="#7a5a3c" />
      {[-380, 380].map((xx) => <rect key={xx} x={xx - 18} y={-280} width={36} height={560} fill="#4f321d" stroke="#2a180c" strokeWidth={3} />)}
      {[-250, 0, 250].map((yy) => [-380, 380].map((xx) => <circle key={xx + "" + yy} cx={xx} cy={yy} r={7} fill="#bbb" />))}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-362 + i * (bw + gap) + squeeze * 2} y={-250} width={bw} height={500} fill={["#d9c19c", "#cbb08a", "#e0c8a4", "#d2b994", "#c9ad86", "#dcc29e", "#cfb48e"][i]} stroke="#8a6440" strokeWidth={2} />)}
      {/* gotitas de cola en las juntas */}
      {t > gotas && Array.from({ length: 6 }, (_, i) => Array.from({ length: 5 }, (_, j) => <circle key={i + "-" + j} cx={-362 + (i + 1) * (bw + gap) - 1} cy={-200 + j * 100 + R(i, j) * 30} r={7 * e(t, gotas + j * 0.08, gotas + 0.3 + j * 0.08)} fill="#fdfdf6" stroke="#ccc" strokeWidth={1} />))}
      {/* el hueco y las dos cuñas al revés */}
      <rect x={-362 + 7 * (bw + gap)} y={-250} width={742 - 7 * (bw + gap) - 18} height={500} fill="rgba(0,0,0,.25)" opacity={e(t, hueco, hueco + 0.3) * (1 - cIn)} />
      <g transform={`translate(${118 + 7 * gap + squeeze * 10} 0)`}>
        <path d={`M 0 ${-250 - 300 * (1 - cIn) + squeeze * 40} L 44 ${-250 - 300 * (1 - cIn) + squeeze * 40} L 18 ${250 - 300 * (1 - cIn) + squeeze * 40} L 0 ${250 - 300 * (1 - cIn) + squeeze * 40} Z`} fill="#b07a46" stroke="#5a3a20" strokeWidth={3} />
        <path d={`M 44 ${-250 + 300 * (1 - cIn)} L 62 ${-250 + 300 * (1 - cIn)} L 62 ${250 + 300 * (1 - cIn)} L 18 ${250 + 300 * (1 - cIn)} Z`} fill="#c48c52" stroke="#5a3a20" strokeWidth={3} />
      </g>
      {/* el martillo que golpea la cuña de arriba */}
      {t > golpes[0] - 0.4 && <g transform={`translate(${130} ${-300 + squeeze * 40}) rotate(${-40 + 40 * (hit > 0.3 ? 1 : 0)})`} opacity={1 - e(t, golpes[golpes.length - 1] + 0.6, golpes[golpes.length - 1] + 1)}><rect x={-26} y={-110} width={52} height={70} rx={8} fill="#3a3a3a" /><rect x={-8} y={-300} width={16} height={200} fill="#8a5a30" /></g>}
      {hit > 0.05 && <circle cx={140} cy={-260 + squeeze * 40} r={40 + 60 * (1 - hit)} fill="none" stroke={CH.maiz} strokeWidth={6} opacity={hit} />}
    </svg>
  </Pop>;
};

// ---------- BISAGRA DE DIENTES: la tira de la pared (1º y 3º), la de la mesa (el del medio), se entrelazan, agujero y palo de escoba ----------
export const Dientes: React.FC<{ t: number; at: number; out: number; x: number; y: number; cotas?: number; corte?: number; junta?: number; broca?: number; palo?: number; sc?: number }> = ({ t, at, out, x, y, cotas = 1e9, corte = 1e9, junta = 1e9, broca = 1e9, palo = 1e9, sc = 1 }) => {
  const tw = 140, cut = e(t, corte, corte + 0.6), j = ei(t, junta, junta + 1.0), bl = e(t, broca, broca + 0.8), p = ei(t, palo, palo + 0.9);
  const pared = "#b9935f", mesa = "#d9b47e";
  return <Pop t={t} at={at} out={out} x={x} y={y} sc={sc}>
    <svg width={900} height={620} viewBox="-450 -310 900 620" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      {/* tira de la pared: dientes 1 y 3 (el de en medio se va) */}
      <g transform={`translate(0 ${-130 + 130 * j})`}>
        <rect x={-210} y={-60} width={420} height={50} fill={pared} stroke="#5a3a20" strokeWidth={3} />
        {[0, 1, 2].map((i) => <rect key={i} x={-210 + i * tw} y={-10} width={tw} height={110} fill={pared} stroke="#5a3a20" strokeWidth={3} opacity={i === 1 ? 1 - cut : 1} transform={i === 1 ? `translate(0 ${cut * 80})` : undefined} />)}
      </g>
      {/* tira de la mesa: sólo el diente del medio, entra desde abajo */}
      <g transform={`translate(0 ${170 - 170 * j})`} opacity={e(t, corte + 0.3, corte + 0.7)}>
        <rect x={-210} y={110} width={420} height={50} fill={mesa} stroke="#5a3a20" strokeWidth={3} />
        <rect x={-210 + tw} y={0} width={tw} height={110} fill={mesa} stroke="#5a3a20" strokeWidth={3} />
      </g>
      {/* agujero de 22 mm de punta a punta y el palo de escoba */}
      {bl > 0 && <line x1={-210} y1={50} x2={-210 + 420 * bl} y2={50} stroke="#2a180c" strokeWidth={26} strokeLinecap="round" />}
      {bl > 0 && bl < 1 && <line x1={-330} y1={50} x2={-210 + 420 * bl} y2={50} stroke={CH.maiz} strokeWidth={3} strokeDasharray="12 8" />}
      {p > 0 && <rect x={-460 + 250 * p} y={38} width={420} height={24} rx={12} fill="#e2c48e" stroke="#8a6440" strokeWidth={3} />}
      {/* cotas 21 cm / 7 cm */}
      <g opacity={e(t, cotas, cotas + 0.4) * (1 - e(t, corte, corte + 0.3))} fill={CH.maiz} stroke={CH.maiz} fontFamily={SERIF} fontWeight={900}>
        <line x1={-210} y1={-210} x2={210} y2={-210} strokeWidth={4} /><text x={0} y={-226} textAnchor="middle" fontSize={56} stroke="none">21 cm</text>
        {[0, 1, 2].map((i) => <text key={i} x={-140 + i * tw} y={120} textAnchor="middle" fontSize={44} stroke="none" fill={CH.crema}>7</text>)}
      </g>
      <text x={0} y={290} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={58} fill={CH.crema} opacity={e(t, junta + 0.8, junta + 1.2) * (1 - e(t, broca, broca + 0.3))}>como los dedos entrelazados</text>
      <text x={0} y={290} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={58} fill={CH.crema} opacity={e(t, broca + 0.2, broca + 0.6) * (1 - e(t, palo, palo + 0.3))}>un solo agujero · 22 mm</text>
      <text x={0} y={290} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={58} fill={CH.maiz} opacity={e(t, palo + 0.5, palo + 0.9)}>el perno: un palo de escoba</text>
    </svg>
  </Pop>;
};

// ---------- MÉNSULA: el triángulo se dibuja tabla por tabla con sus medidas ----------
export const Triangulo: React.FC<{ t: number; at: number; out: number; x: number; y: number; p45: number; p40: number; pdiag: number }> = ({ t, at, out, x, y, p45, p40, pdiag }) => {
  const a = e(t, p45, p45 + 0.6), b = e(t, p40, p40 + 0.6), c = e(t, pdiag, pdiag + 0.7);
  const board = (x1: number, y1: number, x2: number, y2: number, k: number, col: string) => <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={col} strokeWidth={42} strokeLinecap="butt" />;
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={760} height={680} viewBox="-120 -80 760 680" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-110} y={-70} width={60} height={640} fill="#e9dcc4" opacity={0.85} />
      {board(0, 0, 0, 450, a, "#c9a272")}{board(0, 0, 400, 0, b, "#d9b47e")}{board(0, 380, 360, 20, c, "#b98a58")}
      <g fontFamily={SERIF} fontWeight={900} fill={CH.maiz} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.8))" }}>
        <text x={44} y={250} fontSize={64} opacity={a}>45</text>
        <text x={200} y={-40} fontSize={64} textAnchor="middle" opacity={b}>40</text>
        <text x={230} y={250} fontSize={50} opacity={c} fill={CH.crema}>diagonal</text>
      </g>
      <path d="M 0 60 A 60 60 0 0 0 60 0" fill="none" stroke={CH.crema} strokeWidth={5} opacity={b} />
    </svg>
  </Pop>;
};

// ---------- DOS TERCIOS: la cubierta de 60 con la punta de la ménsula a 40; menos = cabecea, más = no cierra ----------
export const DosTercios: React.FC<{ t: number; at: number; out: number; x: number; y: number; menos?: number; mas?: number; sc?: number }> = ({ t, at, out, x, y, menos = 1e9, mas = 1e9, sc = 1 }) => {
  const m = e(t, at + 0.3, at + 0.9), wob = t > menos && t < mas ? Math.sin((t - menos) * 14) * 5 * Math.exp(-(t - menos) * 0.8) : 0;
  const tip = 400 * m - 140 * e(t, menos, menos + 0.4) * (1 - e(t, mas, mas + 0.3)) + 160 * e(t, mas, mas + 0.4);
  return <Pop t={t} at={at} out={out} x={x} y={y} sc={sc}>
    <svg width={760} height={420} viewBox="-60 -200 760 420" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-50} y={-190} width={44} height={400} fill="#e9dcc4" />
      <g transform={`rotate(${wob} 0 -100)`}><rect x={0} y={-120} width={600} height={34} fill="#d9b47e" stroke="#6b4a2c" strokeWidth={3} /></g>
      <rect x={0} y={-86} width={Math.max(0, tip)} height={26} fill="#b98a58" stroke="#5a3a20" strokeWidth={3} />
      <line x1={400} y1={-150} x2={400} y2={60} stroke={CH.maiz} strokeWidth={4} strokeDasharray="14 10" opacity={m} />
      <g fontFamily={SERIF} fontWeight={900} fill={CH.maiz} opacity={m} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.8))" }}>
        <text x={300} y={-140} fontSize={52} textAnchor="middle">60</text><text x={400} y={110} fontSize={64} textAnchor="middle">40 = ⅔</text>
      </g>
      {t > menos && t < mas + 0.2 && <text x={620} y={-40} fontFamily={HAND} fontWeight={700} fontSize={58} fill="#ff8a6a">cabecea</text>}
      {t > mas && <text x={620} y={-40} fontFamily={HAND} fontWeight={700} fontSize={58} fill="#ff8a6a" opacity={e(t, mas, mas + 0.3)}>no cierra</text>}
    </svg>
  </Pop>;
};

// ---------- LATA de aceite de linaza COCIDO (sin marca) ----------
export const Lata: React.FC<{ t: number; at: number; out: number; x: number; y: number; cocido: number }> = ({ t, at, out, x, y, cocido }) => {
  const c = Math.min(1.1, spr(t, cocido, 1.2));
  return <Pop t={t} at={at} out={out} x={x} y={y} rot={4}>
    <div style={{ position: "relative", width: 300, height: 380, borderRadius: "18px 18px 12px 12px", background: "linear-gradient(90deg,#6a6a6a,#d8d8d8 30%,#9a9a9a 60%,#4a4a4a)", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 230, background: "linear-gradient(180deg,#e9c24a,#c99a2a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#3b2414", textAlign: "center" }}>
        <div style={{ fontSize: 30, letterSpacing: 3 }}>ACEITE DE</div><div style={{ fontFamily: SERIF, fontSize: 62 }}>LINAZA</div>
        {t > cocido && <div style={{ marginTop: 6, padding: "4px 18px", border: "5px solid #b3261e", borderRadius: 8, color: "#b3261e", fontSize: 40, transform: `rotate(-6deg) scale(${c})` }}>COCIDO</div>}
      </div>
    </div>
  </Pop>;
};

// ---------- GRIS → MIEL: la misma tabla con 0, 1, 2 y 3 manos; una cortina de aceite la va pintando ----------
export const GrisMiel: React.FC<{ t: number; at: number; manos: number[]; out: number; x: number; y: number }> = ({ t, at, manos, out, x, y }) => {
  const n = manos.reduce((a, q) => a + e(t, q, q + 0.8), 0) / manos.length;
  const col = (k: number) => `rgb(${Math.round(160 + (214 - 160) * k)},${Math.round(150 + (150 - 150) * k - 20 * k)},${Math.round(136 - 70 * k)})`;
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <div style={{ position: "relative", width: 900, height: 230, borderRadius: 8, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)", background: `repeating-linear-gradient(178deg, rgba(60,30,10,${0.12 + 0.12 * n}) 0 3px, transparent 3px 15px), linear-gradient(180deg,${col(n)},${col(n * 0.9)})` }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${0.25 * n}) 45%, transparent 60%)` }} />
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: 18 }}>
      {manos.map((q, i) => <div key={i} style={{ padding: "8px 24px", borderRadius: 30, background: t >= q ? CH.maiz : "rgba(0,0,0,.5)", color: t >= q ? "#3b2414" : CH.crema, fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 2, transform: `scale(${t >= q ? Math.min(1.08, spr(t, q, 1.2)) : 1})` }}>{i + 1}ª MANO · DÍA {i + 1}</div>)}
    </div>
    <div style={{ position: "absolute", left: 30, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,.8)" }}>{n < 0.5 ? "gris y triste" : "color miel"}</div>
  </Pop>;
};

// ---------- TRAPOS QUE ARDEN: el termómetro de la bola de trapos sube y prende ----------
export const TraposFuego: React.FC<{ t: number; at: number; fire: number; out: number; x: number; y: number }> = ({ t, at, fire, out, x, y }) => {
  const heat = e(t, at + 0.2, fire), f = e(t, fire, fire + 0.6);
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={300} height={560} viewBox="-150 -40 300 560" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-34} y={0} width={68} height={420} rx={34} fill="rgba(255,255,255,.85)" stroke="#555" strokeWidth={4} />
      <circle cx={0} cy={450} r={60} fill="#d8402c" />
      <rect x={-18} y={420 - 400 * heat} width={36} height={400 * heat + 20} fill="#d8402c" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={34} y1={40 + i * 48} x2={60} y2={40 + i * 48} stroke="#333" strokeWidth={4} />)}
      {f > 0 && Array.from({ length: 9 }, (_, i) => { const ph = t * (3 + R(i, 1) * 3) + i; return <path key={i} d={`M ${-90 + i * 22} 520 Q ${-110 + i * 22 + Math.sin(ph) * 20} ${470 - 120 * f * (0.6 + R(i, 2))} ${-90 + i * 22} ${400 - 160 * f * (0.6 + R(i, 3))} Q ${-70 + i * 22} ${470 - 100 * f} ${-60 + i * 22} 520 Z`} fill={i % 2 ? "#ffb02e" : "#ff5a1e"} opacity={0.85} />; })}
    </svg>
    <div style={{ position: "absolute", left: 200, top: 140, whiteSpace: "nowrap", fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: f > 0.2 ? "#ff7a3a" : CH.crema, textShadow: extrude(8, "#3a0c04") }}>{f > 0.2 ? "¡SE PRENDEN SOLOS!" : "se calientan…"}</div>
  </Pop>;
};

// ---------- TAQUETE DE PLÁSTICO EN ADOBE: entra y la pared se desmorona ----------
export const Desmorona: React.FC<{ t: number; at: number; crumble: number; out: number; x: number; y: number }> = ({ t, at, crumble, out, x, y }) => {
  const k = e(t, at + 0.2, crumble), c = t - crumble;
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={700} height={520} viewBox="-350 -260 700 520" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      <rect x={-340} y={-250} width={420} height={500} fill="#c9a77e" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-330 + R(i, 1) * 400} cy={-240 + R(i, 2) * 480} r={2 + R(i, 3) * 4} fill="#9a7a52" />)}
      <rect x={60 - 260 * k} y={-22} width={200} height={44} rx={8} fill="#e8e8e8" stroke="#888" strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={70 - 260 * k + i * 30} y1={-22} x2={70 - 260 * k + i * 30} y2={22} stroke="#aaa" strokeWidth={3} />)}
      {c > 0 && Array.from({ length: 26 }, (_, i) => <rect key={"d" + i} x={-200 + R(i, 4) * 120 + c * (R(i, 5) - 0.3) * 120} y={-40 + R(i, 6) * 80 + c * c * 500} width={10 + R(i, 7) * 22} height={8 + R(i, 8) * 16} fill="#a8875a" transform={`rotate(${c * 300 * R(i, 9)})`} />)}
      {c > 0 && <path d="M -200 -60 l 30 30 l -20 25 l 35 30 l -25 30" fill="none" stroke="#3a2414" strokeWidth={5} opacity={e(t, crumble, crumble + 0.2)} />}
    </svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CH.crema, textShadow: "0 4px 14px #000", opacity: e(t, crumble, crumble + 0.4) }}>taquete de plástico en adobe: se desmorona</div>
  </Pop>;
};

// ---------- ANILLOS: la punta de las tablas; todas iguales = teja; alternadas (sonrisa/tristeza) = plana ----------
export const Anillos: React.FC<{ t: number; at: number; alt: number; out: number; x: number; y: number; teja?: number }> = ({ t, at, alt, out, x, y, teja = at + 0.6 }) => {
  const a = ei(t, alt, alt + 0.9), cup = e(t, teja, teja + 0.8) * (1 - a);
  return <Pop t={t} at={at} out={out} x={x} y={y}>
    <svg width={1000} height={440} viewBox="-500 -220 1000 440" style={{ overflow: "visible", filter: "drop-shadow(0 26px 40px rgba(0,0,0,.6))" }}>
      {Array.from({ length: 5 }, (_, i) => { const xx = -380 + i * 190, flip = i % 2 === 1 ? 1 - 2 * a : 1, yy = cup * (Math.abs(i - 2) * -26);
        return <g key={i} transform={`translate(${xx} ${yy}) rotate(${cup * (i - 2) * -6})`}>
          <rect x={-90} y={-50} width={180} height={100} fill="#d9b47e" stroke="#6b4a2c" strokeWidth={4} />
          <g transform={`scale(1 ${flip})`}>{[30, 60, 90, 120].map((r) => <path key={r} d={`M ${-r * 0.7} ${60 - r * 0.25} Q 0 ${60 - r * 1.15} ${r * 0.7} ${60 - r * 0.25}`} fill="none" stroke="#8a6440" strokeWidth={4} clipPath="none" />)}</g>
        </g>; })}
    </svg>
    <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: CH.crema, textShadow: "0 4px 14px #000" }}>{a < 0.5 ? "todas para el mismo lado = se tuerce como teja" : "una sonrisa, una tristeza = queda plana ✓"}</div>
  </Pop>;
};

// ---------- CALENDARIO del fin de semana: hojas que caen con lo que se hace cada día ----------
export const Calendario: React.FC<{ t: number; at: number; out: number; x: number; y: number; dias: { at: number; d: string; items: string[] }[]; sc?: number }> = ({ t, at, out, x, y, dias, sc = 1 }) => (
  <Pop t={t} at={at} out={out} x={x} y={y} sc={sc}>
    <div style={{ display: "flex", gap: 34 }}>
      {dias.map((dd, i) => { const k = Math.min(1.06, spr(t, dd.at, 0.9)); return <div key={i} style={{ width: 420, opacity: e(t, dd.at, dd.at + 0.1), transform: `translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${(i - 1) * 2}deg)`, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)", background: "#f6eedc" }}>
        <div style={{ background: CH.guinda, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 6, textAlign: "center", padding: "12px 0" }}>{dd.d}</div>
        <div style={{ padding: "16px 26px 22px" }}>{dd.items.map((it, j) => <div key={j} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: LAPIZ, lineHeight: "60px", clipPath: `inset(-10% ${100 - 100 * e(t, dd.at + 0.3 + j * 0.35, dd.at + 0.8 + j * 0.35)}% -10% 0)` }}>· {it}</div>)}</div>
      </div>; })}
    </div>
  </Pop>
);

// ---------- REPASO: los 7 pasos quemados en 7 tablitas clavadas en la pared, una por una ----------
export const Repaso: React.FC<{ t: number; at: number; out: number; x: number; y: number; items: { at: number; txt: string }[]; sc?: number }> = ({ t, at, out, x, y, items, sc = 1 }) => (
  <Pop t={t} at={at} out={out} x={x} y={y} sc={sc} drop={40}>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((it, i) => { const k = Math.min(1.06, spr(t, it.at, 1.0)), burn = e(t, it.at + 0.1, it.at + 0.6), live = t >= it.at && (i === items.length - 1 || t < items[i + 1].at);
        return <div key={i} style={{ ...tabla(6), width: 980, padding: "10px 30px 10px 24px", display: "flex", alignItems: "center", gap: 26, opacity: e(t, it.at, it.at + 0.1), transform: `translateX(${(1 - Math.min(1, k)) * -500}px) rotate(${(R(i, 1) - 0.5) * 2}deg) scale(${live ? 1.04 : 1})`, outline: live ? `4px solid ${CH.maiz}` : undefined }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, width: 54, textAlign: "center", color: `rgb(${70 - 30 * burn},${36 - 16 * burn},14)`, textShadow: `0 0 ${14 * (1 - burn)}px rgba(255,120,40,.9)` }}>{i + 1}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: LAPIZ, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - 100 * e(t, it.at + 0.15, it.at + 0.8)}% -20% 0)` }}>{it.txt}</div>
        </div>; })}
    </div>
  </Pop>
);

// ---------- PALOMITAS QUEMADAS: lista corta que se marca a fuego renglón por renglón ----------
export const Quemadas: React.FC<{ t: number; out: number; x: number; y: number; rows: { at: number; txt: string; ok?: boolean }[]; size?: number }> = ({ t, out, x, y, rows, size = 58 }) => (
  <Pop t={t} at={rows[0].at - 0.15} out={out} x={x} y={y} drop={60}>
    <div style={{ ...tabla(10), padding: "26px 44px", display: "flex", flexDirection: "column", gap: 10 }}>
      <Clavito l={16} /><Clavito r={16} />
      {rows.map((r, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: e(t, r.at, r.at + 0.15) }}>
        <div style={{ width: 62, height: 62, borderRadius: 10, background: r.ok === false ? "#c8301e" : CH.nopal, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.min(1.1, spr(t, r.at + 0.1, 1.3))})` }}>{r.ok === false ? "✗" : "✓"}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color: LAPIZ, whiteSpace: "nowrap" }}>{r.txt}</div>
      </div>)}
    </div>
  </Pop>
);

// ---------- capa de calor/fuego anaranjado (trapos de noche) ----------
export const Brasa: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = e(t, a, a + 0.8) * (1 - e(t, b, b + 0.4));
  if (k <= 0.01) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `radial-gradient(ellipse 60% 50% at 55% 75%, rgba(255,${110 + 30 * Math.sin(t * 9)},30,${0.55 * k}), transparent 70%)` }} />;
};
