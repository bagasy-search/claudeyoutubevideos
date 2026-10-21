// hal01 · MINUTO 1 (0-75,7 s). Un solo hilo visual, sin cortes secos:
// avatar (suena el teléfono) → (portal desde el teléfono del avatar) → toma del llamado + identificador "UNKNOWN" + globo
// → corazón ECG → (la toma se encoge en el teléfono 3D) → cocina 3D: campo de contraseña tachado, cronómetro 3-2-1
// → (portal desde el teléfono) → avatar con el odómetro de $4,9 mil millones → (el agua sube) → témpano "NEVER REPORTED"
// → (portal) → cocina 3D: suena, plano casa de muñecas, el calendario pasa a TUESDAY → (portal desde la silla) → avatar + rótulo
// → (carpetas de casos lo tapan) → BURGLARY / FRAUD → (zoom por la carpeta) → interrogatorio → (portal) → cintas + contador
// → onda del llamado con la 1ª frase en rojo → (portal desde el tramo rojo) → avatar, CLICK → (portal desde la libreta)
// → libreta 3D que se escribe sola → (portal) → Hal escribiendo + fichas → (se encoge en la libreta) → círculo rojo al #4
// → (portal desde la taza) → avatar con credenciales "RETIRED ENGINEER / BOOKKEEPER" → (la tarjeta del banco lo cubre) → saldo a $0.
// Audio fuera de Remotion (la voz se mezcla en encfin). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { KitchenWorld, EV, KEYS, PT, screenOf, camSpeed, TABLE_Y } from "./kitchen3d";
import { BigNum, COL, Chips, DrawX, Flash, FONT, LowerThird, P, Portal, Tag, Vid, at, e, ei, extrude, s, spr } from "./lib";
import AVW from "./avwin.json";

export const MIN1_END = at("And before you think it");
export const MIN1_FRAMES = s(MIN1_END);

// ---------- qué tomas LTX ya llegaron (si falta, va la foto del primer cuadro con zoom lento) ----------
export const HAS: Record<string, boolean> = { pickup: true, listen: false, interro: false, tapes: false, write: false };
const REEL = true;   // true cuando llega el reel del avatar (public/hal01/reel0.mp4)

export const Shot: React.FC<{ k: string; t: number; a: number; from?: number; z?: [number, number] }> = ({ k, t, a, from = 0, z = [1.03, 1.12] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + 8);
  return <AbsoluteFill style={{ transform: `scale(${sc})` }}>{HAS[k] ? <Vid id={"ltx_" + k} from={from} at={a} /> : <Vid id={"img_" + k} />}</AbsoluteFill>;
};

// ---------- AVATAR: ventanas pagadas (avwin.json), preroll de 10 cuadros. Borde NÍTIDO: nada de blur/halo alrededor ----------
export const WIN = (AVW as { win: { ms: number; me: number; off: number }[] }).win;
export const Avatar: React.FC<{ t: number; dark?: number; style?: React.CSSProperties }> = ({ t, dark = 0, style }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
    <AbsoluteFill style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>
      {REEL ? WIN.map((w, i) => (
        <Sequence key={i} from={s(w.ms) - 24} durationInFrames={s(w.me - w.ms) + 32} layout="none">
          {/* visible 0,5 s antes/0,2 s después: el portal que lo abre o lo cierra nunca muestra negro */}
          <AbsoluteFill style={{ opacity: t >= w.ms - 0.5 && t < w.me + 0.2 && (i === 0 || t >= (WIN[i - 1].me + w.ms) / 2) && (i === WIN.length - 1 || t < (w.me + WIN[i + 1].ms) / 2) ? 1 : 0 }}>
            <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 24)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      )) : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.01 + 0.01 * Math.sin(t * 0.7)})` }} />}
    </AbsoluteFill>
  </AbsoluteFill>
);
// puntos del cuadro del avatar (1920x1080, el mismo encuadre de la ref)
export const AVP = { phone: { x: 1700, y: 1000 }, pad: { x: 960, y: 1040 }, mug: { x: 1375, y: 940 }, door: { x: 1500, y: 300 } };

// mundo 3D con blur de movimiento real (velocidad de cámara proyectada)
export const World: React.FC<{ t: number; ct?: number }> = ({ t, ct }) => {
  const v0 = camSpeed(ct ?? t), v = { bx: Math.min(5, v0.bx * 0.5), by: Math.min(3.5, v0.by * 0.5) };
  const id = "mb" + Math.round((ct ?? t) * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><KitchenWorld t={t} ct={ct} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================= COMPONENTES NUEVOS DEL MINUTO 1 =======================
// ondas de timbre sobre el teléfono del avatar (anillos dorados que salen del aparato)
const RingPulse: React.FC<{ t: number; x: number; y: number; a: number; b: number }> = ({ t, x, y, a, b }) => {
  const o = e(t, a, a + 0.1) * (1 - e(t, b, b + 0.2));
  if (o <= 0.01) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      {[0, 1, 2, 3].map((k) => { const ph = ((t - a) * 1.7 + k / 4) % 1; return <ellipse key={k} cx={x} cy={y} rx={60 + ph * 300} ry={(60 + ph * 300) * 0.55} fill="none" stroke="#ffd27a" strokeWidth={8 * (1 - ph) + 2} opacity={(1 - ph) * 0.9} style={{ filter: "drop-shadow(0 0 12px rgba(255,200,90,.8))" }} />; })}
      <text x={x - 40} y={y - 190} fontFamily={FONT} fontWeight={900} fontSize={64} fill="#ffe2a0" transform={`rotate(${Math.sin(t * 40) * 4} ${x} ${y - 200})`} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.7))" }}>RING</text>
    </svg>
  );
};
// identificador de llamada (pantallita LCD verde del teléfono, en 3D) + globo de texto que se tipea
const CallerID: React.FC<{ t: number; at: number; out: number }> = ({ t, at: a, out }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const blink = Math.sin(t * 14) > 0 ? 1 : 0.35;
  return (
    <div style={{ position: "absolute", left: 120, top: 120, opacity: o, perspective: 1000 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70 + 12}deg) rotateX(8deg)`, padding: 18, borderRadius: 22, background: "linear-gradient(180deg,#efe4c9,#d9c9a4)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.6)" }}>
        <div style={{ width: 560, padding: "18px 26px", borderRadius: 10, background: "linear-gradient(180deg,#9fb98a,#86a372)", boxShadow: "inset 0 4px 14px rgba(0,0,0,.45)", fontFamily: "'Courier New',monospace", color: "#1d2a14", fontWeight: 900 }}>
          <div style={{ fontSize: 30, letterSpacing: 4, opacity: blink }}>☎ INCOMING CALL</div>
          <div style={{ fontSize: 58, letterSpacing: 3, marginTop: 6 }}>UNKNOWN CALLER</div>
          <div style={{ fontSize: 30, letterSpacing: 3, marginTop: 4 }}>OCT 20 · 10:42 AM</div>
        </div>
      </div>
    </div>
  );
};
export const Bubble: React.FC<{ t: number; at: number; text: string; x: number; y: number; out: number; cps?: number }> = ({ t, at: a, text, x, y, out, cps = 16 }) => {
  const k = spr(t, a, 1.1), o = e(t, a, a + 0.08) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const n = Math.min(text.length, Math.floor((t - a) * cps));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${Math.min(1.04, k)})`, transformOrigin: "100% 100%" }}>
      <div style={{ position: "relative", maxWidth: 820, padding: "26px 40px", borderRadius: 40, background: "#fdfaf2", boxShadow: "0 30px 60px rgba(0,0,0,.55)", fontFamily: FONT, fontWeight: 800, fontSize: 62, color: "#1b1b1b", lineHeight: 1.12 }}>
        {text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0 }}>▌</span>
        <div style={{ position: "absolute", right: 70, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "40px solid #fdfaf2" }} />
      </div>
    </div>
  );
};
// línea de ECG que acelera: 72 → 131 pulsaciones (el corazón en la garganta)
const ECG: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const bpm = Math.round(72 + 59 * ei(t, a + 0.3, b));
  const per = 60 / bpm;
  const pts: string[] = [];
  for (let i = 0; i <= 400; i++) {
    const x = i * 4.8, tt = t - (400 - i) * 0.006;  // la traza corre hacia la izquierda
    const lp = 60 / Math.round(72 + 59 * ei(tt, a + 0.3, b));
    const ph = ((tt % lp) + lp) % lp / lp;
    const y = ph < 0.08 ? -18 * Math.sin(ph / 0.08 * Math.PI) : ph < 0.12 ? 30 : ph < 0.16 ? -170 : ph < 0.2 ? 60 : ph < 0.4 ? -26 * Math.sin((ph - 0.2) / 0.2 * Math.PI) : 0;
    pts.push(`${x},${560 + y}`);
  }
  void per;
  const vis = 400 * e(t, a, a + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <polyline points={pts.slice(0, Math.max(2, Math.round(vis))).join(" ")} fill="none" stroke={bpm > 110 ? COL.red : "#6fe39a"} strokeWidth={7} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${bpm > 110 ? "rgba(255,74,61,.9)" : "rgba(111,227,154,.9)"})` }} />
      </svg>
      <div style={{ position: "absolute", right: 140, top: 200, textAlign: "right", fontFamily: FONT, fontWeight: 900, color: bpm > 110 ? COL.red : "#6fe39a", textShadow: extrude(8, "rgba(0,0,0,.7)") }}>
        <div style={{ fontSize: 200, lineHeight: 1, transform: `scale(${1 + 0.06 * Math.max(0, Math.cos(((t % per) / per) * Math.PI * 2))})`, transformOrigin: "100% 50%" }}>♥ {bpm}</div>
        <div style={{ fontSize: 40, letterSpacing: 10 }}>BPM</div>
      </div>
    </div>
  );
};
// campo de contraseña 3D: "••••••" que se tacha (no la necesitan)
const PassField: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const dots = Math.min(8, Math.floor((t - a) * 22));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", perspective: 1100 }}>
      <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 70 + 10}deg) rotateY(-12deg)`, width: 700, padding: "26px 34px", borderRadius: 22, background: "linear-gradient(180deg,rgba(255,255,255,.96),rgba(232,236,242,.96))", boxShadow: "0 40px 80px rgba(0,0,0,.55)", fontFamily: FONT }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 6, color: "#586274" }}>PASSWORD</div>
        <div style={{ marginTop: 10, padding: "14px 22px", borderRadius: 12, border: "3px solid #9aa6b8", fontSize: 76, fontWeight: 900, letterSpacing: 18, color: "#1e2633", height: 92, lineHeight: "92px" }}>{"•".repeat(dots)}</div>
      </div>
    </div>
  );
};
// cronómetro 3D de 3 segundos (aguja que barre + número que cae)
export const Stopwatch: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at: a, out, x, y }) => {
  const k = spr(t, a, 1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const el = Math.max(0, Math.min(3, (t - a) * 3 / 0.9)), n = Math.max(1, 3 - Math.floor(el));
  const ang = (el / 3) * 360;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * 80 - 10}deg) scale(${Math.min(1.05, k)})` }}>
      <svg width={380} height={440} viewBox="0 0 380 440" style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={160} y={0} width={60} height={50} rx={10} fill="#c9ccd2" />
        <circle cx={190} cy={250} r={180} fill="url(#swg)" stroke="#9aa0a8" strokeWidth={14} />
        <defs><radialGradient id="swg" cx="40%" cy="35%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#dfe3ea" /></radialGradient></defs>
        <path d={`M190 250 L190 92 A158 158 0 ${ang > 180 ? 1 : 0} 1 ${190 + 158 * Math.sin((ang * Math.PI) / 180)} ${250 - 158 * Math.cos((ang * Math.PI) / 180)} Z`} fill="rgba(255,74,61,.35)" />
        <line x1={190} y1={250} x2={190 + 150 * Math.sin((ang * Math.PI) / 180)} y2={250 - 150 * Math.cos((ang * Math.PI) / 180)} stroke={COL.red} strokeWidth={9} strokeLinecap="round" />
        <circle cx={190} cy={250} r={14} fill="#222" />
        <text x={190} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#1b1b1b">{n}</text>
      </svg>
      <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 8, color: COL.ink, textShadow: extrude(6, "rgba(0,0,0,.7)") }}>3 SECONDS</div>
    </div>
  );
};
// odómetro: tambores que ruedan hasta $4.9 BILLION
const Odometer: React.FC<{ t: number; a: number; b: number; out: number; x: number; y: number }> = ({ t, a, b, out, x, y }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const v = 4.9 * ei(t, a + 0.2, b);
  const digs = [Math.floor(v), Math.floor((v * 10) % 10 + 1e-6)];
  const roll = [v, v * 10];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, k)) * 60 + 14}deg) rotateX(6deg)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 30px", borderRadius: 24, background: "linear-gradient(180deg,#1b1e24,#0b0c0f)", boxShadow: "0 40px 80px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,255,255,.12), 0 0 0 3px #3b3f47", fontFamily: FONT, fontWeight: 900 }}>
        <div style={{ fontSize: 130, color: "#9df0b4", textShadow: "0 0 20px rgba(120,240,170,.5)" }}>$</div>
        {[0, 1].map((i) => {
          const frac = roll[i] - Math.floor(roll[i]); const d = digs[i];
          return (
            <React.Fragment key={i}>
              {i === 1 && <div style={{ fontSize: 130, color: "#9df0b4" }}>.</div>}
              <div style={{ width: 104, height: 160, overflow: "hidden", borderRadius: 12, background: "linear-gradient(180deg,#05070a,#1b2129 50%,#05070a)", boxShadow: "inset 0 10px 20px rgba(0,0,0,.8)" }}>
                <div style={{ transform: `translateY(${-(frac > 0.85 && t < b ? (frac - 0.85) / 0.15 : 0) * 160}px)` }}>
                  {[d, (d + 1) % 10].map((q, j) => <div key={j} style={{ height: 160, lineHeight: "160px", textAlign: "center", fontSize: 130, color: "#f4efe6" }}>{q}</div>)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ marginLeft: 16, fontSize: 64, color: "#9df0b4", letterSpacing: 4 }}>BILLION</div>
      </div>
      <div style={{ marginTop: 18, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: COL.ink, textShadow: extrude(4, "#000") }}>AGE 60+ · ONE YEAR · FBI IC3</div>
    </div>
  );
};
// sello rojo que cae girando
export const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, at: a, text, x, y, out = 1e9, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: "0 0 30px rgba(255,60,40,.45)", textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};
// el témpano: la puntita "REPORTED" sobre el agua, la mole "NEVER REPORTED" abajo (el agua sube y tapa al avatar)
const Iceberg: React.FC<{ t: number; a: number; out: number; water: number }> = ({ t, a, out, water }) => {
  const wy = 1080 - water * 640;                                       // línea de agua que sube desde abajo
  const rise = ei(t, a, a + 1.1), o = 1 - e(t, out, out + 0.3);
  const bob = Math.sin(t * 1.3) * 6;
  const lab = e(t, a + 0.9, a + 1.2);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f5c86" /><stop offset="100%" stopColor="#06182b" /></linearGradient>
          <linearGradient id="ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#b9dcf0" /></linearGradient>
          <linearGradient id="iceU" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7fc0e4" stopOpacity={0.95} /><stop offset="100%" stopColor="#245a80" stopOpacity={0.9} /></linearGradient>
        </defs>
        <rect x={0} y={wy} width={1920} height={1080 - wy + 10} fill="url(#sea)" />
        <g transform={`translate(0 ${(1 - rise) * 500 + bob})`}>
          <polygon points="960,395 1030,440 1075,470 1110,450 1160,470 845,470 880,445 915,430" fill="url(#ice)" />
          <polygon points="845,470 1160,470 1330,560 1420,720 1360,890 1150,1010 860,1030 600,930 520,760 600,580" fill="url(#iceU)" />
        </g>
        <rect x={0} y={wy - 3} width={1920} height={6} fill="rgba(255,255,255,.55)" />
      </svg>
      <div style={{ position: "absolute", left: 1180, top: 330 + bob, opacity: lab, fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 6, color: "#fff", textShadow: extrude(5, "rgba(0,0,0,.6)") }}>← REPORTED</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690 + bob, textAlign: "center", opacity: e(t, a + 1.5, a + 1.9), fontFamily: FONT, fontWeight: 900, fontSize: 110, letterSpacing: 10, color: "#dff3ff", textShadow: extrude(10, "#06233a"), transform: `scale(${0.9 + 0.1 * Math.min(1, spr(t, a + 1.5))})` }}>NEVER REPORTED</div>
    </AbsoluteFill>
  );
};
// carpetas de caso manila que entran en abanico y se sellan (BURGLARY / FRAUD); la de FRAUD se abre hacia cámara
const CaseFiles: React.FC<{ t: number; a: number; s1: number; s2: number; zoom: number }> = ({ t, a, s1, s2, zoom }) => {
  const files = [{ lab: "BURGLARY", x: 600, rot: -7, st: s1 }, { lab: "FRAUD", x: 1320, rot: 6, st: s2 }];
  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      {files.map((f, i) => {
        const k = spr(t, a + i * 0.18, 0.9), z = i === 1 ? zoom : 0, fade = i === 0 ? 1 - e(t, a + 2.0, a + 2.3) : 1;
        const open = i === 1 ? zoom : 0;
        return (
          <div key={i} style={{ position: "absolute", left: f.x, top: 560, opacity: fade, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 900}px) rotate(${f.rot * (1 - z)}deg) translateZ(${z * 1250}px)`, transformStyle: "preserve-3d" }}>
            <div style={{ position: "relative", width: 640, height: 470 }}>
              <div style={{ position: "absolute", left: 0, top: -46, width: 230, height: 60, borderRadius: "14px 14px 0 0", background: "#e3c98a" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "0 14px 14px 14px", background: "linear-gradient(180deg,#f0d898,#d9bd78)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
              <div style={{ position: "absolute", left: 40, top: 40, right: 40, height: 380, background: "#fbf8ef", transformOrigin: "50% 0%", transform: `rotateX(${-open * 40}deg)`, boxShadow: "0 6px 14px rgba(0,0,0,.2)", fontFamily: "'Courier New',monospace", fontWeight: 700, fontSize: 24, color: "#333", padding: 26, lineHeight: 1.6 }}>
                CHICAGO · CASE FILE<br />DET. H. BRODY<br />─────────────<br />STATUS: CLOSED
              </div>
              <div style={{ position: "absolute", left: 30, bottom: 30, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#3a2a12", letterSpacing: 4 }}>{f.lab}</div>
              <Stamp t={t} at={f.st} text="CLOSED" x={460} y={130} rot={-14} size={58} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// contador de cinta (casete): horas de grabaciones que corren
const TapeCounter: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const hrs = Math.floor(1 + 1499 * ei(t, a + 0.1, a + 2.0));
  const spin = (t - a) * 540;
  return (
    <div style={{ position: "absolute", left: 1460, top: 790, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * -70 - 10}deg) rotateX(8deg)` }}>
      <div style={{ width: 560, height: 340, borderRadius: 20, background: "linear-gradient(180deg,#2c2f35,#141518)", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.1)", padding: 24 }}>
        <div style={{ height: 120, borderRadius: 12, background: "#e9e1cf", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[0, 1].map((i) => <svg key={i} width={96} height={96} viewBox="-50 -50 100 100"><circle r={44} fill="#3a2a1e" /><g transform={`rotate(${spin})`}>{[0, 60, 120, 180, 240, 300].map((r) => <rect key={r} x={-4} y={-30} width={8} height={14} fill="#e9e1cf" transform={`rotate(${r})`} />)}</g><circle r={10} fill="#e9e1cf" /></svg>)}
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 18, fontFamily: "'Courier New',monospace", fontWeight: 900 }}>
          <div style={{ fontSize: 110, color: COL.amber, textShadow: "0 0 16px rgba(255,178,87,.6)", letterSpacing: 6 }}>{String(hrs).padStart(4, "0")}</div>
          <div style={{ fontSize: 40, color: COL.ink, letterSpacing: 6 }}>HOURS</div>
        </div>
      </div>
    </div>
  );
};
// la onda del llamado entero: la PRIMERA frase se pinta de rojo con corchete "3 SEC"
const Wave: React.FC<{ t: number; a: number; hi: number; out: number }> = ({ t, a, hi, out }) => {
  const o = e(t, a, a + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const N = 150, draw = ei(t, a, a + 1.4), H = e(t, hi, hi + 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: N }, (_, i) => {
          const u = i / N; if (u > draw) return null;
          const amp = (0.25 + 0.75 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11))) * (u < 0.13 ? 1.15 : 0.8) * 220;
          const red = u < 0.13 && H > 0;
          return <rect key={i} x={160 + i * 10.7} y={560 - amp / 2} width={7} height={amp} rx={3} fill={red ? `rgba(255,74,61,${0.4 + 0.6 * H})` : "rgba(244,239,230,.75)"} />;
        })}
        {H > 0 && <g opacity={H}>
          <path d="M160 410 L160 390 L370 390 L370 410" fill="none" stroke={COL.red} strokeWidth={6} />
        </g>}
      </svg>
      {H > 0 && <div style={{ position: "absolute", left: 265, top: 300, transform: `translateX(-50%) scale(${Math.min(1.05, spr(t, hi))})`, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.red, textShadow: extrude(6, "rgba(0,0,0,.7)"), whiteSpace: "nowrap" }}>3 SEC</div>}
      <div style={{ position: "absolute", left: 160, top: 720, opacity: H, fontFamily: FONT, fontWeight: 900, fontSize: 48, letterSpacing: 8, color: COL.red, textShadow: extrude(5, "#000") }}>THE FIRST SENTENCE</div>
      <div style={{ position: "absolute", right: 160, top: 720, opacity: e(t, a + 0.6, a + 1), fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: COL.dim }}>THE REST OF THE CALL →</div>
    </div>
  );
};
// credencial de jubilado (tarjeta con foto silueta, cargo y casilla "NOT ME")
const Badge: React.FC<{ t: number; at: number; x: number; y: number; role: string; yrs: string; out: number; rot?: number }> = ({ t, at: a, x, y, role, yrs, out, rot = 0 }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * 80 + rot}deg) translateZ(${(1 - Math.min(1, k)) * -600}px)` }}>
      <div style={{ width: 430, borderRadius: 18, overflow: "hidden", background: "#fbfaf6", boxShadow: "0 40px 70px rgba(0,0,0,.6)", fontFamily: FONT }}>
        <div style={{ background: "#26415e", color: "#fff", fontWeight: 900, fontSize: 24, letterSpacing: 6, padding: "10px 20px" }}>RETIREE · ID</div>
        <div style={{ display: "flex", gap: 18, padding: 20, alignItems: "center" }}>
          <svg width={110} height={130} viewBox="0 0 110 130"><rect width={110} height={130} rx={8} fill="#cfd6df" /><circle cx={55} cy={48} r={26} fill="#8794a5" /><path d="M12 130 C16 92 94 92 98 130 Z" fill="#8794a5" /></svg>
          <div>
            <div style={{ fontWeight: 900, fontSize: 38, color: "#1b1b1b", lineHeight: 1.05 }}>{role}</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: "#5a6372", marginTop: 8, letterSpacing: 3 }}>{yrs}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
// app del banco: el saldo de toda la jubilación cae a $0 mientras el reloj va de la 1 a las 5 de la tarde
const BankDrain: React.FC<{ t: number; a: number; b: number; grow: number }> = ({ t, a, b, grow }) => {
  const k = spr(t, a - 0.5, 0.9);
  const v = 412650 * (1 - ei(t, a + 0.3, b));
  const hr = 1 + 4 * ei(t, a + 0.3, b), ang = (hr % 12) / 12 * 360, mang = ((hr % 1) * 360);
  const sc = 0.55 + 0.45 * grow;
  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1a2333, #070a10)", opacity: grow }} />
      <div style={{ position: "absolute", left: 960, top: 540, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 900}px) rotateX(${(1 - grow) * 12}deg) scale(${sc})` }}>
        <div style={{ width: 1100, padding: "40px 56px", borderRadius: 34, background: "linear-gradient(180deg,#ffffff,#eef2f7)", boxShadow: "0 50px 100px rgba(0,0,0,.6)", fontFamily: FONT }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 6, color: "#26415e" }}>RETIREMENT SAVINGS</div>
            <svg width={120} height={120} viewBox="-60 -60 120 120"><circle r={54} fill="#fff" stroke="#26415e" strokeWidth={6} />
              <line x1={0} y1={0} x2={30 * Math.sin((ang * Math.PI) / 180)} y2={-30 * Math.cos((ang * Math.PI) / 180)} stroke="#1b1b1b" strokeWidth={7} strokeLinecap="round" />
              <line x1={0} y1={0} x2={44 * Math.sin((mang * Math.PI) / 180)} y2={-44 * Math.cos((mang * Math.PI) / 180)} stroke="#1b1b1b" strokeWidth={4} strokeLinecap="round" /></svg>
          </div>
          <div style={{ fontWeight: 900, fontSize: 190, color: v < 1000 ? COL.red : "#16243a", lineHeight: 1.05, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>${Math.round(v).toLocaleString("en-US")}</div>
          <div style={{ fontWeight: 800, fontSize: 40, color: "#5a6372", letterSpacing: 4 }}>{Math.floor(hr)}:{String(Math.floor((hr % 1) * 60)).padStart(2, "0")} PM · {v < 1000 ? "ACCOUNT EMPTY" : "TRANSFER IN PROGRESS"}</div>
        </div>
      </div>
      <BigNum t={t} at={at("one afternoon") + 0.2} text="ONE AFTERNOON" y={900} size={120} col={COL.red} edge="#4a0e0a" />
    </AbsoluteFill>
  );
};

// ======================= TIEMPOS (todos de la voz) =======================
export const T = {
  rings: at("rings"), pick: at("You pick it up"), grandpa: at("Grandpa"), mad: at("Please don't be mad"), heart: at("your heart is"), throat: at("throat"),
  trick: at("That's the whole trick"), pass: at("password"), pound: at("pounding"), three: at("three seconds"),
  last: at("Last year"), five: at("almost $5"), billion: at("billion to scams"), five2: at("Five billion"), brave: at("brave enough"),
  most: at("Most of that money"), ring2: at("ringing phone"), quiet: at("quiet kitchen"), tues: at("Tuesday morning"),
  name: at("My name is Hal"), det: at("detective with"), cpd: at("Chicago Police"), yrs: at("31 years"), burg: at("burglary"), fraud: at("and fraud"),
  sat: at("I sat across"), rec: at("recordings"), hours: at("hours of them"), nobody: at("nobody tells you"), every: at("Every single one"),
  first: at("first sentence"), three2: at("Three seconds", 50), hang: at("hang up before"), wrote: at("So I wrote"), pad: at("this pad"), twelve: at("Twelve calls"),
  line: at("The exact first line"), why: at("Why it works"), back: at("what I say back"), four: at("number four"), smart: at("smart ones"),
  eng: at("retired engineers"), book: at("bookkeepers"), never: at("never happen"), watched: at("I watched that call"), aft: at("one afternoon"),
};
// avatar: ventanas
const W0 = WIN[0], W1 = WIN[1], W2 = WIN[2], W3 = WIN[3], W4 = WIN[4];

// ======================= EL MUNDO: cámara y eventos (una sola cámara) =======================
const padP = (fz: number): [number, number, number] => [-0.147, TABLE_Y + 0.009, 0.1 - 0.176 + 0.352 * fz];
EV.ring = [[T.rings - 0.3, T.pick], [T.ring2 - 0.3, T.quiet + 0.4]];
EV.cal = T.tues - 0.1;
EV.write = [T.pad, T.back + 0.6];
EV.circle = T.four;
KEYS.length = 0;
KEYS.push(
  // W1 · el teléfono de cerca (contraseña, cronómetro)
  { t: T.trick - 0.4, p: [1.05, 1.22, 0.95], l: [0.22, 0.82, 0.0], fov: 32 },
  { t: W1.ms, p: [0.8, 1.08, 0.66], l: [0.3, 0.84, 0.01], fov: 30, lin: true },
  // W2 · suena otra vez → la cocina entera en corte → el calendario y la silla
  { t: T.most - 0.3, p: [0.95, 1.12, 0.85], l: [0.3, 0.86, 0.0], fov: 34 },
  { t: T.quiet - 0.1, p: [0.82, 1.08, 0.68], l: [0.3, 0.84, 0.01], fov: 32 },
  { t: T.tues - 0.5, p: [3.1, 2.9, 3.6], l: [-0.5, 1.0, -1.0], fov: 40, arc: 0.4 },
  { t: W2.ms, p: [-0.35, 1.5, -0.55], l: [-1.05, 1.62, -2.17], fov: 36 },
  // W3 · se zambulle a la libreta
  { t: W3.me - 0.05, p: [0.35, 1.7, 1.0], l: [-0.12, 0.76, 0.08], fov: 38 },
  { t: T.twelve, p: [-0.12, 1.26, 0.34], l: [-0.14, 0.76, 0.06], fov: 34 },
  { t: T.line - 0.1, p: [-0.13, 1.14, 0.24], l: [-0.145, 0.76, 0.06], fov: 32 },
  { t: T.back + 0.1, p: [-0.13, 1.1, 0.22], l: [-0.145, 0.76, 0.055], fov: 32 },
  { t: T.four + 0.2, p: [-0.14, 1.02, 0.17], l: [-0.147, 0.76, 0.05], fov: 30 },
  { t: W4.ms, p: [0.25, 1.12, 0.62], l: [0.02, 0.84, -0.2], fov: 34 },
);

export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0 → W0.me · avatar; el teléfono suena (anillos) =====
  if (t < W0.me + 0.6) {
    L.push(<Avatar key="avA" t={t} />);
    L.push(<RingPulse key="rp" t={t} x={AVP.phone.x} y={AVP.phone.y - 40} a={T.rings - 0.25} b={T.pick} />);
  }
  // ===== B · portal desde el teléfono del avatar → toma del llamado; identificador; globo; ECG =====
  if (t >= W0.me - 0.4 && t < T.trick + 0.3) {
    const r = ei(t, W0.me - 0.4, W0.me + 0.2);
    const shrink = ei(t, T.trick - 0.25, T.trick + 0.25);
    const ph = screenOf(T.trick + 0.25, [0.34, 0.85, 0.02]);
    const shot = (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: `brightness(${1 - 0.45 * e(t, T.heart - 0.4, T.heart)})` }}><Shot k="listen" t={t} a={W0.me - 0.4} /></AbsoluteFill>
        <CallerID t={t} at={W0.me - 0.1} out={T.heart - 0.6} />
        <Bubble t={t} at={T.grandpa} text={"“Grandpa? It’s me. Please don’t be mad.”"} x={900} y={560} out={T.heart - 0.4} cps={18} />
        <ECG t={t} a={T.heart - 0.4} b={T.throat + 0.2} out={T.trick - 0.35} />
      </AbsoluteFill>
    );
    if (shrink > 0) L.push(<World key="wB" t={t} />);
    L.push(shrink > 0 ? <Portal key="pB2" x={ph.x} y={ph.y} r={1 - shrink}>{shot}</Portal> : <Portal key="pB" x={AVP.phone.x} y={AVP.phone.y} r={r}>{shot}</Portal>);
  }
  // ===== C · cocina 3D: el teléfono; contraseña tachada; cronómetro; portal al avatar =====
  if (t >= T.trick + 0.25 && t < W1.ms + 0.5) {
    L.push(<World key="wC" t={t} />);
    const ph = screenOf(t, [0.34, 0.86, 0.02]);
    L.push(<Tag key="tTr" t={t} at={T.trick + 0.2} x={ph.x} y={ph.y} dx={-330} dy={-200} text="THE WHOLE TRICK" col={COL.amber} out={T.pass - 0.3} />);
    L.push(<PassField key="pf" t={t} at={T.pass - 0.5} out={T.pound - 0.2} x={640} y={330} />);
    if (t < T.pound - 0.2) L.push(<DrawX key="pfx" t={t} at={T.pass + 0.25} x={330} y={240} w={620} h={190} />);
    L.push(<Tag key="tHt" t={t} at={T.pound - 0.3} x={ph.x} y={ph.y - 30} dx={-380} dy={-120} text="YOUR HEART" sub="POUNDING" col={COL.red} out={W1.ms - 0.4} />);
    L.push(<Stopwatch key="sw" t={t} at={T.three - 0.1} out={W1.ms + 1.2} x={430} y={700} />);
    const r = ei(t, W1.ms - 0.4, W1.ms + 0.25);
    if (r > 0) L.push(<Portal key="pC" x={ph.x} y={ph.y} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== D · avatar + odómetro $4,9 B; sale con el agua que sube =====
  if (t >= W1.ms + 0.25 && t < W1.me + 1.3) {
    L.push(<Avatar key="avD" t={t} />);
    L.push(<Odometer key="od" t={t} a={T.last - 0.2} b={T.billion} out={W1.me + 0.8} x={470} y={330} />);
    L.push(<Stopwatch key="sw2" t={t} at={T.three - 0.1} out={W1.ms + 0.7} x={430} y={700} />);
  }
  // ===== E · el témpano (el agua tapa al avatar); sello FIVE BILLION =====
  if (t >= W1.me - 0.6 && t < T.most + 0.6) {
    const water = ei(t, W1.me - 0.6, W1.me + 0.5);
    L.push(<Iceberg key="ice" t={t} a={T.five2 - 0.2} out={T.most + 0.2} water={water} />);
    L.push(<Stamp key="st5" t={t} at={T.five2} text="$5,000,000,000" x={960} y={200} out={T.brave - 0.3} size={96} />);
    L.push(<Tag key="brv" t={t} at={T.brave} x={1010} y={420} dx={260} dy={-160} text="ONLY THE ONES" sub="BRAVE ENOUGH TO REPORT IT" col={COL.ice2} out={T.most} size={40} />);
  }
  // ===== F · portal desde la punta del témpano → cocina: suena, corte casa de muñecas, calendario; portal al avatar =====
  if (t >= T.most - 0.2 && t < W2.ms + 0.5) {
    const r = ei(t, T.most - 0.2, T.most + 0.45);
    const world = (
      <AbsoluteFill>
        <World t={t} />
        {(() => { const c = screenOf(t, [-1.05, 1.62, -2.17]); return <Tag t={t} at={T.tues} x={c.x} y={c.y} dx={170} dy={-120} text="A NORMAL TUESDAY" col={COL.ink} out={W2.ms - 0.3} size={42} />; })()}
        {(() => { const c = screenOf(t, [0.34, 0.86, 0.02]); return <Tag t={t} at={T.ring2} x={c.x} y={c.y} dx={-260} dy={-170} text="RING… RING…" col="#ffd27a" out={T.quiet + 0.3} size={50} />; })()}
        {(() => { const c = screenOf(t, [0.1, 1.2, 0.0]); return <Tag t={t} at={T.quiet + 0.2} x={c.x} y={c.y} dx={260} dy={-200} text="A QUIET KITCHEN" col={COL.ink} out={T.tues - 0.2} size={42} />; })()}
      </AbsoluteFill>
    );
    L.push(r < 1 ? <Portal key="pF" x={960} y={420} r={r}>{world}</Portal> : <AbsoluteFill key="wF">{world}</AbsoluteFill>);
    const r2 = ei(t, W2.ms - 0.4, W2.ms + 0.25);
    if (r2 > 0) L.push(<Portal key="pF2" x={960} y={540} r={r2}><Avatar t={t} /></Portal>);
  }
  // ===== G · avatar + rótulo; carpetas BURGLARY/FRAUD que lo tapan; zoom a través de FRAUD =====
  if (t >= W2.ms + 0.25 && t < T.sat + 0.4) {
    L.push(<Avatar key="avG" t={t} />);
    L.push(<LowerThird key="lt" t={t} at={T.name} out={W2.me - 0.3} name="HAL BRODY" l2="DETECTIVE · CHICAGO · 31 YEARS" l2at={T.det} />);
    const z = ei(t, T.sat - 0.5, T.sat + 0.35);
    L.push(<AbsoluteFill key="cfbg" style={{ background: "rgba(10,8,6,.82)", opacity: e(t, W2.me - 0.4, W2.me) }} />);
    L.push(<CaseFiles key="cf" t={t} a={W2.me - 0.4} s1={T.burg + 0.2} s2={T.fraud + 0.1} zoom={z} />);
  }
  // ===== H · interrogatorio (toma) → portal → cintas + contador de horas =====
  if (t >= T.sat - 0.05 && t < T.nobody + 0.5) {
    L.push(<AbsoluteFill key="int" style={{ opacity: e(t, T.sat - 0.05, T.sat + 0.25) }}><Shot k="interro" t={t} a={T.sat - 0.05} /></AbsoluteFill>);
    L.push(<Tag key="tg" t={t} at={T.sat + 0.6} x={1150} y={460} dx={220} dy={-170} text="THESE GUYS" col={COL.amber} out={T.rec - 0.6} />);
    const r = ei(t, T.rec - 0.6, T.rec + 0.05);
    if (r > 0) L.push(<Portal key="pH" x={1300} y={700} r={r}><AbsoluteFill><Shot k="tapes" t={t} a={T.rec - 0.6} /><TapeCounter t={t} a={T.rec - 0.1} out={T.nobody + 0.2} /></AbsoluteFill></Portal>);
  }
  // ===== I · la onda del llamado; la 1ª frase en rojo; portal desde el tramo rojo al avatar =====
  if (t >= T.nobody - 0.4 && t < W3.ms + 0.5) {
    L.push(<AbsoluteFill key="ibg" style={{ background: "radial-gradient(circle at 50% 50%, #18202c, #06080c)", opacity: e(t, T.nobody - 0.4, T.nobody + 0.2) }} />);
    L.push(<Wave key="wv" t={t} a={T.nobody - 0.2} hi={T.first} out={W3.ms + 0.3} />);
    L.push(<BigNum key="every" t={t} at={T.every} text="EVERY CALL" y={210} size={96} out={T.first - 0.2} />);
    L.push(<Stopwatch key="sw3" t={t} at={T.three2 - 0.1} out={W3.ms + 0.6} x={1550} y={330} />);
    const r = ei(t, W3.ms - 0.4, W3.ms + 0.25);
    if (r > 0) L.push(<Portal key="pI" x={265} y={560} r={r}><Avatar t={t} /></Portal>);
  }
  // ===== J · avatar; CLICK (cuelga); portal desde la libreta del avatar → libreta 3D =====
  if (t >= W3.ms + 0.25 && t < W3.me + 0.5) {
    L.push(<Avatar key="avJ" t={t} />);
    L.push(<Stamp key="clk" t={t} at={T.hang + 0.15} text="CLICK." x={1460} y={330} out={W3.me - 0.5} rot={7} size={100} col={COL.amber} />);
    const r = ei(t, W3.me - 0.4, W3.me + 0.25);
    if (r > 0) L.push(<Portal key="pJ" x={AVP.pad.x} y={AVP.pad.y} r={r}><World t={t} /></Portal>);
  }
  // ===== K · libreta 3D que se escribe sola; portal a Hal escribiendo + fichas; se encoge en la libreta; círculo al #4 =====
  if (t >= W3.me + 0.25 && t < W4.ms + 0.5) {
    L.push(<World key="wK" t={t} />);
    const pc = screenOf(t, padP(0.5));
    L.push(<BigNum key="12" t={t} at={T.twelve} text="12 CALLS" x={1500} y={260} size={150} col="#f6e27a" edge="#5a4a10" out={T.line - 0.4} />);
    const r = ei(t, T.line - 0.35, T.line + 0.25) * (1 - ei(t, T.back + 0.2, T.back + 0.7));
    if (r > 0) L.push(<Portal key="pK" x={pc.x} y={pc.y} r={r}><AbsoluteFill><Shot k="write" t={t} a={T.line - 0.35} /><Chips t={t} at={T.line} items={["FIRST LINE", "WHY IT WORKS", "WHAT I SAY"]} out={T.back + 0.1} y={720} /></AbsoluteFill></Portal>);
    const l4 = screenOf(t, padP(0.352));
    L.push(<Tag key="t4" t={t} at={T.four + 0.4} x={l4.x + 140} y={l4.y} dx={300} dy={-140} text="#4" sub="GETS THE SMART ONES" col={COL.red} out={W4.ms - 0.3} size={70} />);
    const r2 = ei(t, W4.ms - 0.4, W4.ms + 0.25);
    const mg = screenOf(t, [0.02, 0.86, -0.2]);
    if (r2 > 0) L.push(<Portal key="pK2" x={mg.x} y={mg.y} r={r2}><Avatar t={t} /></Portal>);
  }
  // ===== L · avatar + credenciales; la tarjeta del banco sube y lo cubre =====
  if (t >= W4.ms + 0.25 && t < W4.me + 0.5) {
    L.push(<Avatar key="avL" t={t} />);
    L.push(<Badge key="b1" t={t} at={T.eng - 0.1} x={360} y={330} role="RETIRED ENGINEER" yrs="38 YEARS · AEROSPACE" out={W4.me - 0.6} rot={14} />);
    L.push(<Badge key="b2" t={t} at={T.book - 0.1} x={360} y={700} role="BOOKKEEPER" yrs="41 YEARS · NEVER MISSED A CENT" out={W4.me - 0.6} rot={10} />);
    L.push(<Stamp key="nm" t={t} at={T.never} text={"“NOT ME.”"} x={1480} y={300} out={W4.me - 0.4} rot={8} size={96} />);
  }
  // ===== M · el saldo de la jubilación a $0 en una tarde =====
  if (t >= W4.me - 0.6) {
    const grow = ei(t, W4.me - 0.2, W4.me + 0.4);
    L.push(<BankDrain key="bank" t={t} a={T.watched} b={T.aft + 0.4} grow={grow} />);
  }
  L.push(<Flash key="fl1" t={t} at={T.hang + 0.15} peak={0.35} w={0.18} />);

  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
