// ortega01 · piezas NUEVAS del minuto 1 (oficio de policía: cronómetro de evidencia, fichas de cuarto, foto vieja,
// credencial, expedientes, sello de tinta, sobre de ahorros, dial de 25 pines, ficha de apuesta, placa 3D).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

const mmss = (sec: number) => { const v = Math.max(0, Math.round(sec)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`; };

// ---------- CRONÓMETRO de evidencia: dial con 60 marcas, arco que se vacía/llena, dígitos LCD ----------
export const Crono: React.FC<{ t: number; at: number; out: number; x: number; y: number; size?: number; val: number; max: number; label: string; col?: string; freeze?: boolean }> =
  ({ t, at, out, x, y, size = 300, val, max, label, col = COL.red, freeze }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const R = size / 2 - 18, C = 2 * Math.PI * R, f = Math.max(0, Math.min(1, val / max));
  const pulse = freeze ? 0.5 + 0.5 * Math.sin(t * 14) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * 70}deg) scale(${0.55 + 0.45 * k})` }}>
      <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #2a2d33, #0c0d10 70%)", boxShadow: `0 30px 70px rgba(0,0,0,.7), inset 0 0 0 6px #3b3e44, inset 0 0 0 9px #16171a, 0 0 ${30 + 40 * pulse}px rgba(255,60,40,${0.25 + 0.5 * pulse})` }}>
        <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * 2 * Math.PI - Math.PI / 2, r1 = R + 6, r2 = R + (i % 5 ? 11 : 15);
            return <line key={i} x1={size / 2 + Math.cos(a) * r1} y1={size / 2 + Math.sin(a) * r1} x2={size / 2 + Math.cos(a) * r2} y2={size / 2 + Math.sin(a) * r2} stroke="rgba(255,255,255,.55)" strokeWidth={i % 5 ? 1.5 : 3} />; })}
          <circle cx={size / 2} cy={size / 2} r={R - 8} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={14} />
          <circle cx={size / 2} cy={size / 2} r={R - 8} fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - f)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ filter: `drop-shadow(0 0 10px ${col})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: size * 0.27, color: col, letterSpacing: 2, textShadow: `0 0 18px ${col}`, lineHeight: 1 }}>{mmss(val)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.058, color: COL.dim, letterSpacing: 3, marginTop: 8, whiteSpace: "nowrap" }}>{label}</div>
        </div>
      </div>
    </div>
  );
};

// ---------- FICHA de cuarto que se tacha: tarjeta de plano con el nombre del cuarto, X roja de plumón ----------
export const FichaX: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub?: string; rot?: number }> = ({ t, at, out, x, y, text, sub = "NI LA MIRA", rot = -4 }) => {
  const k = Math.min(1.1, spr(t, at, 1.1)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const a = e(t, at + 0.3, at + 0.46), b = e(t, at + 0.42, at + 0.58);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1100px) rotateX(${(1 - Math.min(1, k)) * -80}deg) rotate(${rot}deg) scale(${0.7 + 0.3 * k})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "relative", width: 430, padding: "26px 30px 22px", background: "linear-gradient(180deg,#f5f0e4,#e4dccb)", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6)", fontFamily: FONT, textAlign: "center",
        backgroundImage: "linear-gradient(rgba(60,110,170,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(60,110,170,.18) 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 6, color: "#45607e" }}>PLANTA BAJA</div>
        <div style={{ fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: "#1d2733" }}>{text}</div>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 5, color: COL.red, opacity: e(t, at + 0.55, at + 0.7) }}>{sub}</div>
        <svg width={430} height={200} viewBox="0 0 430 200" style={{ position: "absolute", left: 0, top: 10, filter: "drop-shadow(0 0 8px rgba(255,60,40,.6))" }}>
          <path d="M60 30 Q 210 100 372 172" fill="none" stroke={COL.red} strokeWidth={16} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - a)} />
          <path d="M372 26 Q 220 96 56 176" fill="none" stroke={COL.red} strokeWidth={16} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - b)} />
        </svg>
      </div>
    </div>
  );
};

// ---------- FOTO vieja de papel que cae girando sobre la mesa, con cinta y borde blanco ----------
export const FotoVieja: React.FC<{ t: number; at: number; out: number; id: string; x: number; y: number; w: number; h: number; rot?: number; caption?: string }> = ({ t, at, out, id, x, y, w, h, rot = 6, caption }) => {
  const k = spr(t, at, 0.75), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const fall = 1 - Math.min(1, k);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1400px) translateY(${-fall * 500}px) rotateX(${fall * 35}deg) rotate(${rot + fall * -40}deg) scale(${1 + fall * 0.4})` }}>
      <div style={{ padding: "18px 18px 70px", background: "linear-gradient(170deg,#fbf6ea,#e9dfc8)", boxShadow: `0 ${30 + fall * 60}px ${60 + fall * 60}px rgba(0,0,0,.6)`, borderRadius: 3 }}>
        <Img src={staticFile(P + id + ".jpg")} style={{ width: w, height: h, objectFit: "cover", display: "block", filter: "sepia(.18) contrast(.96) saturate(.85)" }} />
        {caption && <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, textAlign: "center", fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 34, color: "#2b3a66" }}>{caption}</div>}
      </div>
      {[[-0.06, -0.04, -14], [0.9, -0.03, 12]].map(([fx, fy, r], i) => (
        <div key={i} style={{ position: "absolute", left: (w + 36) * fx, top: (h + 88) * fy, width: 130, height: 38, background: "rgba(240,228,190,.75)", transform: `rotate(${r}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,.25)" }} />
      ))}
    </div>
  );
};

// ---------- CREDENCIAL de servicio que sube y se escribe ----------
export const Credencial: React.FC<{ t: number; at: number; out: number; l1: string; big: string; l2: string; l2at: number }> = ({ t, at, out, l1, big, l2, l2at }) => {
  const k = Math.min(1.05, spr(t, at, 0.8)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n = Math.round(l2.length * e(t, l2at, l2at + 0.8));
  return (
    <div style={{ position: "absolute", left: 90, bottom: 90, opacity: o, perspective: 1200 }}>
      <div style={{ transformOrigin: "0 100%", transform: `rotateX(${(1 - Math.min(1, k)) * 75}deg) rotateY(14deg)`, width: 620, borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.3)", fontFamily: FONT }}>
        <div style={{ background: "linear-gradient(90deg,#16305c,#1f4a8a)", padding: "12px 24px", fontWeight: 900, fontSize: 24, letterSpacing: 6, color: "#e9c46a" }}>{l1}</div>
        <div style={{ background: "linear-gradient(180deg,#f3efe6,#dcd5c6)", padding: "14px 24px 18px", display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ fontWeight: 900, fontSize: 118, lineHeight: 0.9, color: "#16305c", textShadow: extrude(5, "#9aa6b8", 0.5, 0.8) }}>{big}</div>
          <div style={{ fontWeight: 900, fontSize: 34, lineHeight: 1.1, color: "#1d2733", letterSpacing: 2, minHeight: 80 }}>{l2.slice(0, n)}<span style={{ opacity: n > 0 && n < l2.length ? 1 : 0 }}>▌</span></div>
        </div>
      </div>
    </div>
  );
};

// ---------- EXPEDIENTES: carpetas de manila que caen en abanico + contador ----------
export const Expedientes: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const N = 9;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      {Array.from({ length: N }, (_, i) => {
        const a = at + i * 0.05, k = Math.min(1, spr(t, a, 1.2)), r = -40 + i * 10;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "50% 120%", transform: `translate(-50%,-50%) translateY(${(1 - k) * -700}px) rotate(${r * k}deg) rotateX(28deg)`, opacity: e(t, a, a + 0.05) }}>
            <div style={{ position: "relative", width: 400, height: 280, background: `linear-gradient(180deg, hsl(40,${55 + i * 2}%,${72 - i * 1.5}%), hsl(38,50%,${62 - i}%))`, borderRadius: "4px 10px 6px 6px", boxShadow: "0 18px 30px rgba(0,0,0,.45)" }}>
              <div style={{ position: "absolute", left: 22 + (i % 3) * 80, top: -26, width: 110, height: 30, background: "inherit", borderRadius: "8px 8px 0 0", fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 16, color: "#4a3a20", textAlign: "center", lineHeight: "30px" }}>{`#${(3417 + i * 137) % 9000}`}</div>
              <div style={{ position: "absolute", left: 24, top: 30, fontFamily: "'Courier New',monospace", fontWeight: 900, fontSize: 22, color: "rgba(60,40,15,.7)" }}>ROBO A CASA HAB.</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 210, transform: `translate(-50%,0) scale(${Math.min(1.05, spr(t, at + 0.15, 1))})`, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(8, "rgba(0,0,0,.65)"), opacity: e(t, at + 0.12, at + 0.25) }}>{text}</div>
    </div>
  );
};

// ---------- SELLO DE TINTA con bordes comidos (turbulencia), entra golpeando ----------
export const SelloTinta: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub?: string; col?: string; rot?: number; size?: number }> = ({ t, at, out, x, y, text, sub, col = "#e0261b", rot = -8, size = 120 }) => {
  const k = spr(t, at, 1.4), o = e(t, at, at + 0.05) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const id = "ink" + text.replace(/[^A-Za-z]/g, "");
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.6 - 1.6 * Math.min(1, k)})` }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={7} />
        <feComponentTransfer><feFuncA type="discrete" tableValues="0 1 1 1 1 0.85" /></feComponentTransfer></filter></svg>
      <div style={{ filter: `url(#${id})`, border: `9px double ${col}`, borderRadius: 8, padding: "8px 34px 10px", fontFamily: FONT, color: col, textAlign: "center", mixBlendMode: "normal", background: "rgba(255,240,230,.06)" }}>
        <div style={{ fontWeight: 900, fontSize: size, letterSpacing: 6, lineHeight: 1 }}>{text}</div>
        {sub && <div style={{ fontWeight: 800, fontSize: size * 0.24, letterSpacing: 10, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---------- SOBRE de ahorros: sobre de papel con billetes azules asomando; salen papelitos con el destino ----------
export const Sobre: React.FC<{ t: number; at: number; out: number; x: number; y: number; big?: { at: number; text: string }; slips: { at: number; text: string; col?: string }[] }> = ({ t, at, out, x, y, big, slips }) => {
  const k = Math.min(1.06, spr(t, at, 0.85)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const tilt = Math.sin((t - at) * 1.1) * 4;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400, transform: "translate(-50%,-50%)" }}>
      <div style={{ position: "relative", transform: `rotateY(${(1 - Math.min(1, k)) * -80 + tilt}deg) rotateX(8deg) scale(${0.6 + 0.4 * k})`, transformStyle: "preserve-3d" }}>
        {/* billetes */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 40 + i * 18, top: -70 + i * 6 - e(t, at + 0.2, at + 0.7) * 30, width: 420, height: 180, borderRadius: 6, transform: `rotate(${-8 + i * 4}deg)`,
            background: "linear-gradient(135deg,#5b8fd6,#2f5fa8 60%,#6aa0e0)", boxShadow: "0 6px 14px rgba(0,0,0,.35), inset 0 0 0 6px rgba(255,255,255,.18)", fontFamily: FONT, fontWeight: 900, color: "rgba(255,255,255,.85)" }}>
            <div style={{ position: "absolute", right: 20, top: 12, fontSize: 52 }}>500</div>
            <div style={{ position: "absolute", left: 22, bottom: 10, fontSize: 26, letterSpacing: 3 }}>$500</div>
            <div style={{ position: "absolute", left: 150, top: 40, width: 90, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
          </div>
        ))}
        {/* sobre */}
        <div style={{ position: "relative", width: 560, height: 330, borderRadius: 8, background: "linear-gradient(170deg,#f2e8d2,#d9cba9)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", overflow: "hidden" }}>
          <svg width={560} height={330} style={{ position: "absolute", inset: 0 }}><path d="M0 0 L280 170 L560 0" fill="none" stroke="rgba(120,95,55,.35)" strokeWidth={3} /><path d="M0 330 L230 150 M560 330 L330 150" stroke="rgba(120,95,55,.25)" strokeWidth={3} /></svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontWeight: 700, fontSize: 64, color: "#253a7a", transform: "rotate(-4deg)" }}>Ahorros</div>
        </div>
        {big && <div style={{ position: "absolute", left: 280, top: 410, transform: `translate(-50%,0) scale(${Math.min(1.08, spr(t, big.at, 1))})`, opacity: e(t, big.at, big.at + 0.08), fontFamily: FONT, fontWeight: 900, fontSize: 120, color: COL.gold, whiteSpace: "nowrap", textShadow: extrude(10, "#5a4316") }}>{big.text}</div>}
      </div>
      {slips.map((s, i) => {
        const kk = Math.min(1, spr(t, s.at, 1)), oo = e(t, s.at, s.at + 0.08);
        const side = i % 2 ? 1 : -1;
        return oo > 0.01 ? (
          <div key={i} style={{ position: "absolute", left: 280 + side * (180 + 230 * kk), top: 40 + i * 90 - 120 * kk, opacity: oo, transform: `translate(-50%,-50%) rotate(${side * (12 - 6 * kk)}deg)`, background: "#fffdf6", padding: "10px 26px", borderRadius: 4, boxShadow: "0 16px 30px rgba(0,0,0,.5)",
            fontFamily: FONT, fontWeight: 900, fontSize: 56, color: s.col ?? "#1d2733", whiteSpace: "nowrap", backgroundImage: "repeating-linear-gradient(transparent 0 30px, rgba(80,120,200,.25) 30px 32px)" }}>{s.text}</div>
        ) : null;
      })}
    </div>
  );
};

// ---------- DIAL de 25: número gigante y 25 pines verdes que se prenden en círculo ----------
export const Dial25: React.FC<{ t: number; at: number; out: number; x: number; y: number; label: string }> = ({ t, at, out, x, y, label }) => {
  const k = Math.min(1.08, spr(t, at, 0.9)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const R = 250;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, k)) * -60 - 10}deg) scale(${0.6 + 0.4 * k})` }}>
      <div style={{ position: "relative", width: 2 * R + 80, height: 2 * R + 80 }}>
        {Array.from({ length: 25 }, (_, i) => {
          const a = (i / 25) * 2 * Math.PI - Math.PI / 2, on = e(t, at + 0.15 + i * 0.045, at + 0.25 + i * 0.045);
          return <div key={i} style={{ position: "absolute", left: R + 40 + Math.cos(a) * R - 15, top: R + 40 + Math.sin(a) * R - 15, width: 30, height: 30, borderRadius: "50%", transform: `scale(${0.4 + 0.6 * on})`,
            background: on > 0.5 ? COL.green : "rgba(255,255,255,.12)", boxShadow: on > 0.5 ? `0 0 18px ${COL.green}, 0 0 4px #fff inset` : "none" }} />;
        })}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 900, fontSize: 250, lineHeight: 0.9, color: COL.green, textShadow: extrude(14, "#13502d") }}>25</div>
          <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 8, color: COL.ink, textShadow: extrude(4, "#000"), marginTop: 10 }}>{label}</div>
        </div>
      </div>
    </div>
  );
};

// ---------- contador HUD de pines (arriba a la izquierda) ----------
export const PinHUD: React.FC<{ t: number; at: number; out: number; n: number; of: number; text: string; col: string }> = ({ t, at, out, n, of, text, col }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 70, opacity: o, transform: `translateX(${(1 - e(t, at, at + 0.35)) * -60}px)`, display: "flex", alignItems: "center", gap: 20, padding: "14px 28px", borderRadius: 16, background: "rgba(10,14,22,.82)", boxShadow: `0 20px 40px rgba(0,0,0,.5), inset 0 0 0 2px ${col}66`, fontFamily: FONT }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: col, boxShadow: `0 0 16px ${col}` }} />
      <div style={{ fontWeight: 900, fontSize: 70, color: col, lineHeight: 1, minWidth: 150, fontVariantNumeric: "tabular-nums" }}>{n}<span style={{ fontSize: 36, color: COL.dim }}>/{of}</span></div>
      <div style={{ fontWeight: 800, fontSize: 28, color: COL.ink, letterSpacing: 3, maxWidth: 330, lineHeight: 1.15 }}>{text}</div>
    </div>
  );
};

// ---------- los CINCO de siempre: fichas rojas numeradas 5→1 ----------
export const Cinco: React.FC<{ t: number; at: number; out: number; items: string[]; y?: number; hi?: number }> = ({ t, at, out, items, y = 820, hi = -1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 22, perspective: 1200 }}>
    {items.map((it, i) => {
      const a = at + i * 0.13, k = Math.min(1.1, spr(t, a, 1.1)), o = e(t, a, a + 0.08) * (1 - e(t, out + i * 0.04, out + i * 0.04 + 0.25));
      const lit = hi === i ? 0.5 + 0.5 * Math.sin(t * 10) : 0;
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 140}px) rotateX(${(1 - Math.min(1, k)) * -70}deg)`, width: 250, padding: "14px 0 12px", borderRadius: 16, textAlign: "center", fontFamily: FONT,
          background: "linear-gradient(180deg, rgba(60,10,10,.95), rgba(25,5,5,.95))", boxShadow: `0 24px 46px rgba(0,0,0,.6), inset 0 0 0 3px ${COL.red}${lit > 0.5 ? "" : "88"}, 0 0 ${20 + 30 * lit}px rgba(255,60,40,${0.2 + 0.5 * lit})` }}>
          <div style={{ fontWeight: 900, fontSize: 70, color: COL.red, lineHeight: 1, textShadow: extrude(5, "#3a0705") }}>#{items.length - i}</div>
          <div style={{ fontWeight: 900, fontSize: 25, color: COL.ink, letterSpacing: 2, marginTop: 6 }}>{it}</div>
        </div>
      );
    })}
  </div>
);

// ---------- FICHA DE APUESTA: ficha de póker 3D que gira y cae + pregunta ----------
export const Apuesta: React.FC<{ t: number; at: number; out: number; x: number; y: number; q: string; qAt: number }> = ({ t, at, out, x, y, q, qAt }) => {
  const k = Math.min(1, spr(t, at, 0.7)), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const spin = (1 - k) * 900 + Math.sin((t - at) * 1.5) * 12;
  const D = 260, layers = 10;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", perspective: 1100 }}>
      <div style={{ position: "relative", width: D, height: D, margin: "0 auto", transformStyle: "preserve-3d", transform: `translateY(${(1 - k) * -400}px) rotateX(14deg) rotateY(${spin}deg)` }}>
        {Array.from({ length: layers }, (_, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", transform: `translateZ(${i - layers / 2}px)`, background: i === layers - 1 || i === 0
            ? `repeating-conic-gradient(${COL.red} 0 15deg, #f4efe6 15deg 30deg)` : "#b8261c" }}>
            {(i === layers - 1 || i === 0) && <div style={{ position: "absolute", inset: 34, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e0342a, #a51a12)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 5px #f4efe6",
              fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", transform: i === 0 ? "rotateY(180deg)" : undefined }}>$</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 66, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(7, "rgba(0,0,0,.7)"), opacity: e(t, qAt, qAt + 0.12), transform: `scale(${Math.min(1.06, spr(t, qAt, 1))})` }}>{q}</div>
    </div>
  );
};

// ---------- PLACA de comandante: escudo dorado 3D con canto (capas), gira y queda; nombre debajo ----------
export const Placa: React.FC<{ t: number; at: number; out: number; x: number; y: number; name: string; nameAt: number; rank: string; rankAt: number }> = ({ t, at, out, x, y, name, nameAt, rank, rankAt }) => {
  const k = Math.min(1, spr(t, at, 0.6)), o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const ry = (1 - k) * 540 + Math.sin((t - at) * 1.2) * 14;
  const shine = ((ry % 360) + 360) % 360;
  const shield = "M150 8 L270 48 C 270 170 230 250 150 300 C 70 250 30 170 30 48 Z";
  const layers = 12;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", perspective: 1200, textAlign: "center" }}>
      <div style={{ position: "relative", width: 300, height: 310, margin: "0 auto", transformStyle: "preserve-3d", transform: `rotateX(8deg) rotateY(${ry}deg) scale(${0.5 + 0.5 * k})` }}>
        {Array.from({ length: layers }, (_, i) => (
          <svg key={i} width={300} height={310} viewBox="0 0 300 310" style={{ position: "absolute", inset: 0, transform: `translateZ(${i * 1.4 - layers * 0.7}px)` }}>
            <defs><linearGradient id={"pg" + i} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2b0" /><stop offset={`${0.2 + 0.6 * (shine / 360)}`} stopColor="#e9c46a" /><stop offset="1" stopColor="#8a6a1e" /></linearGradient></defs>
            <path d={shield} fill={i === layers - 1 ? `url(#pg${i})` : "#6b4f14"} stroke={i === layers - 1 ? "#5a4210" : "none"} strokeWidth={6} />
            {i === layers - 1 && <>
              <path d="M150 30 L 250 62 C 248 165 214 232 150 274 C 86 232 52 165 50 62 Z" fill="none" stroke="#7a5a14" strokeWidth={3} />
              <path d="M150 92 L163 130 L203 130 L171 154 L183 192 L150 169 L117 192 L129 154 L97 130 L137 130 Z" fill="#1f3c74" stroke="#fff2b0" strokeWidth={3} />
              <text x={150} y={78} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill="#4a3608" letterSpacing={3}>COMANDANTE</text>
              <text x={150} y={232} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#4a3608" letterSpacing={2}>R. ORTEGA</text>
            </>}
          </svg>
        ))}
      </div>
      <div style={{ marginTop: 24, fontFamily: FONT, fontWeight: 900, fontSize: 78, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(7, "rgba(0,0,0,.7)"), opacity: e(t, nameAt, nameAt + 0.12), transform: `translateY(${(1 - e(t, nameAt, nameAt + 0.3)) * 30}px)` }}>{name}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 7, color: COL.gold, whiteSpace: "nowrap", textShadow: "0 3px 10px #000", opacity: e(t, rankAt, rankAt + 0.15) }}>{rank}</div>
    </div>
  );
};

// ---------- latigazo vertical (subir la escalera) ----------
export const WhipV: React.FC<{ k: number; children: React.ReactNode; dir?: 1 | -1 }> = ({ k, children, dir = 1 }) => {
  const mb = Math.sin(Math.min(1, Math.max(0, k)) * Math.PI) * 60;
  return <AbsoluteFill style={{ transform: `translateY(${dir * k * 1080}px)`, filter: mb > 1 ? `blur(${mb * 0.15}px)` : undefined }}>{children}</AbsoluteFill>;
};
export { ei };
