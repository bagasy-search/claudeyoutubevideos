// ortega01 · piezas NUEVAS del resto del video (1:08 → final), una familia por minuto, todas con at() desde Rest.tsx.
// m2: esposas, miedo→oficio, suscribirse+campanita, "calcula", tienda de evidencia, cajita atornillada, todo-en-una-caja, tele vieja
// m3: ficha de detenido, un minuto, la regla en la tarjeta, los tres enemigos, la tríada, la libreta
// m4: letrero de talavera, barras, la lista de 25, pasos, la balanza, los enemigos que vence cada escondite
// m5: la alacena de dos filas, el candado de polvo, la costura   · m6: casas revisadas, el tubo en corte, lo invisible
// m7: el calendario de 11 meses, el cajón en corte  · m8: la maceta en corte  · m9: el corcho de errores, la huella, grande/diario, la lista del súper
// m10: el detector de humo, dividir, nadie lo sabe, papeles, casa/banco  · m11: la tarea, el comentario, el próximo video, la frase final
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

const op = (t: number, at: number, out: number, a = 0.12, b = 0.25) => e(t, at, at + a) * (1 - e(t, out, out + b));
const pop = (t: number, at: number, k = 1) => Math.min(1.08, spr(t, at, k));
const HAND = "'Segoe Print', 'Comic Sans MS', cursive";
const card = (border: string): React.CSSProperties => ({ background: "rgba(12,14,18,.86)", borderRadius: 18, boxShadow: `0 26px 60px rgba(0,0,0,.6), inset 0 0 0 2px ${border}`, fontFamily: FONT });

// ================= m2 =================
// esposas que se cierran (dos aros que giran y hacen clic) + texto
export const Esposas: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub?: string }> = ({ t, at, out, x, y, text, sub }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), cl = ei(t, at + 0.35, at + 0.6), snap = e(t, at + 0.58, at + 0.62) * (1 - e(t, at + 0.62, at + 0.9));
  const ring = (cx: number, rot: number) => (
    <g transform={`translate(${cx} 120) rotate(${rot})`}>
      <circle r={62} fill="none" stroke="#c9ced6" strokeWidth={18} />
      <circle r={62} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="40 360" opacity={0.6} />
      <rect x={-12} y={-82} width={24} height={30} rx={6} fill="#9aa1ab" />
    </g>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k}) rotate(${-6 + snap * 3}deg)`, textAlign: "center" }}>
      <svg width={420} height={240} style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,.7))" }}>
        <path d="M150 120 Q 210 150 270 120" fill="none" stroke="#aab1bb" strokeWidth={10} strokeDasharray="14 6" />
        {ring(110, -120 + 120 * cl)}{ring(310, 120 - 120 * cl)}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(7, "rgba(0,0,0,.7)"), marginTop: -10 }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: COL.gold, whiteSpace: "nowrap", opacity: e(t, at + 0.6, at + 0.8) }}>{sub}</div>}
    </div>
  );
};

// MIEDO (se tacha y cae) → OFICIO (sello de tinta azul de comisaría)
export const MiedoOficio: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const s1 = e(t, at + 0.3, at + 0.5), fall = ei(t, at2 - 0.1, at2 + 0.5), k2 = pop(t, at2, 1.1);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 470, top: 300 + fall * 700, transform: `translate(-50%,-50%) rotate(${fall * 25}deg)`, opacity: 1 - fall, fontFamily: FONT, fontWeight: 900, fontSize: 150, color: "#c8c2b6", textShadow: extrude(10, "#333") }}>
        MIEDO
        <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 18, background: COL.red, transform: `scaleX(${s1}) rotate(-4deg)`, transformOrigin: "0 50%", boxShadow: "0 0 18px rgba(255,60,40,.7)" }} />
      </div>
      {t > at2 && <div style={{ position: "absolute", left: 1440, top: 300, transform: `translate(-50%,-50%) rotate(-8deg) scale(${2.2 - 1.2 * Math.min(1, k2)})`, opacity: e(t, at2, at2 + 0.08), padding: "10px 40px", border: "10px solid #3f7ee8", borderRadius: 16, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: "#3f7ee8", letterSpacing: 6,
        maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.75) 61%, #000 75%)", textShadow: "0 0 2px #3f7ee8" } as React.CSSProperties}>OFICIO</div>}
    </AbsoluteFill>
  );
};

// botón SUSCRIBIRSE que se presiona + campanita que se mece (sin links)
export const SubBell: React.FC<{ t: number; at: number; bellAt: number; out: number; x?: number; y?: number }> = ({ t, at, bellAt, out, x = 1460, y = 860 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 1), press = e(t, at + 0.6, at + 0.7) * (1 - e(t, at + 0.75, at + 0.9)), done = t > at + 0.75;
  const sw = t > bellAt ? Math.sin((t - bellAt) * 18) * 22 * Math.exp(-(t - bellAt) * 1.5) : 0;
  const cur = { x: 330 - 260 * ei(t, at + 0.2, at + 0.6), y: 90 - 40 * ei(t, at + 0.2, at + 0.6) };
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ padding: "22px 46px", borderRadius: 999, background: done ? "#3a3a3a" : "#e62117", transform: `scale(${1 - press * 0.08})`, fontFamily: "Roboto, Arial, sans-serif", fontWeight: 700, fontSize: 44, color: "#fff", boxShadow: "0 18px 40px rgba(0,0,0,.6)" }}>{done ? "SUSCRITO ✓" : "SUSCRIBIRSE"}</div>
        <svg width={110} height={110} viewBox="0 0 100 100" style={{ transform: `rotate(${sw}deg)`, transformOrigin: "50% 12%", opacity: e(t, bellAt - 0.3, bellAt), filter: "drop-shadow(0 10px 18px rgba(0,0,0,.7))" }}>
          <path d="M50 10 C 30 10 24 28 24 44 L 24 62 L 14 74 L 86 74 L 76 62 L 76 44 C 76 28 70 10 50 10 Z" fill={t > bellAt ? COL.gold : "#ddd"} />
          <circle cx={50} cy={84} r={9} fill={t > bellAt ? COL.gold : "#ddd"} />
          {t > bellAt && [0, 1].map((i) => <path key={i} d={i ? "M88 30 Q 96 44 88 58" : "M12 30 Q 4 44 12 58"} fill="none" stroke={COL.gold} strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 20)} />)}
        </svg>
      </div>
      <svg width={60} height={60} style={{ position: "absolute", left: cur.x, top: cur.y, opacity: e(t, at + 0.1, at + 0.2) * (1 - e(t, at + 1.0, at + 1.2)) }}><path d="M8 4 L 8 46 L 20 36 L 28 54 L 36 50 L 28 33 L 44 33 Z" fill="#fff" stroke="#000" strokeWidth={3} /></svg>
    </div>
  );
};

// "NO BUSCA" tachado → "CALCULA" con cifras de libreta que corren
export const Calcula: React.FC<{ t: number; at: number; at2: number; out: number; y?: number }> = ({ t, at, at2, out, y = 170 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const s1 = e(t, at + 0.25, at + 0.45), k2 = pop(t, at2, 1);
  const nums = ["3 min", "1 cuarto", "lo seguro"];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 70, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "relative", fontWeight: 900, fontSize: 96, color: "#bdb7aa", textShadow: extrude(7, "#222") }}>NO BUSCA
        <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 14, background: COL.red, transform: `scaleX(${s1})`, transformOrigin: "0 50%" }} /></div>
      {t > at2 && <div style={{ transform: `scale(${0.5 + 0.5 * k2})`, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 120, color: COL.gold, textShadow: extrude(9, "#5a4316") }}>CALCULA</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>{nums.map((n, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 34, color: COL.ink, opacity: e(t, at2 + 0.4 + i * 0.35, at2 + 0.55 + i * 0.35), padding: "2px 14px", background: "rgba(0,0,0,.55)", borderRadius: 8 }}>{n}</div>)}</div>
      </div>}
    </div>
  );
};

// TIENDA DE EVIDENCIA (marcador de escena del crimen) con número + nombre del lugar
export const EvTent: React.FC<{ t: number; at: number; out: number; n: number; label: string; sub?: string; col?: "r" | "g"; x?: number; y?: number }> = ({ t, at, out, n, label, sub, col = "g", x = 70, y = 870 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 1), c = col === "r" ? "#ff4a3d" : "#ffd23a", ink = col === "r" ? "#fff" : "#141414";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translateY(-100%)", display: "flex", alignItems: "flex-end", gap: 26 }}>
      <div style={{ perspective: 900 }}>
        <div style={{ transform: `rotateX(${(1 - Math.min(1, k)) * 85}deg)`, transformOrigin: "50% 100%" }}>
          <svg width={200} height={190} viewBox="0 0 200 190" style={{ filter: "drop-shadow(0 18px 18px rgba(0,0,0,.7))" }}>
            <path d="M18 186 L 70 14 L 130 14 L 182 186 Z" fill={c} />
            <path d="M70 14 L 130 14 L 120 34 L 80 34 Z" fill="rgba(0,0,0,.2)" />
            <path d="M18 186 L 182 186 L 178 176 L 22 176 Z" fill="rgba(0,0,0,.3)" />
            <text x={100} y={142} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={n > 9 ? 88 : 104} fill={ink}>{n}</text>
          </svg>
        </div>
      </div>
      <div style={{ paddingBottom: 18, opacity: e(t, at + 0.15, at + 0.3), transform: `translateX(${(1 - e(t, at + 0.15, at + 0.4)) * -30}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(6, "rgba(0,0,0,.75)") }}>{label}</div>
        {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: c, whiteSpace: "nowrap", textShadow: "0 2px 8px #000" }}>{sub}</div>}
      </div>
    </div>
  );
};

// cajita fuerte con 4 tornillos; "o ni la atornilló" → los tornillos saltan
export const Cajita: React.FC<{ t: number; at: number; looseAt: number; out: number; x: number; y: number }> = ({ t, at, looseAt, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9);
  const sc = [[40, 40], [260, 40], [40, 230], [260, 230]];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${(1 - Math.min(1, k)) * -70 + 12}deg) scale(${0.6 + 0.4 * k})` }}>
      <svg width={300} height={280} style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.7))" }}>
        <rect x={20} y={20} width={260} height={240} rx={18} fill="#5d6570" /><rect x={36} y={36} width={228} height={208} rx={10} fill="#737c88" />
        <circle cx={150} cy={140} r={50} fill="#2c3138" /><circle cx={150} cy={140} r={36} fill="#9aa3ad" />
        <g transform={`rotate(${(t - at) * 120} 150 140)`}>{Array.from({ length: 12 }, (_, i) => <line key={i} x1={150} y1={108} x2={150} y2={116} stroke="#2c3138" strokeWidth={3} transform={`rotate(${i * 30} 150 140)`} />)}</g>
        <rect x={232} y={120} width={14} height={44} rx={5} fill="#2c3138" />
        {sc.map(([cx, cy], i) => {
          const fl = e(t, looseAt + i * 0.08, looseAt + 0.5 + i * 0.08), dx = (i % 2 ? 1 : -1) * 160 * fl, dy = -120 * fl + 600 * fl * fl;
          return <g key={i} transform={`translate(${cx + dx} ${cy + dy}) rotate(${fl * 400})`}><circle r={11} fill="#c9ced6" /><line x1={-7} y1={0} x2={7} y2={0} stroke="#555" strokeWidth={3} /></g>;
        })}
      </svg>
    </div>
  );
};

// todo junto en una caja: billetes que vuelan desde varios lados a UNA caja
export const Junta: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {Array.from({ length: 9 }, (_, i) => {
        const a0 = at + 0.1 + i * 0.12, k = ei(t, a0, a0 + 0.6), ang = (i / 9) * Math.PI * 2;
        const sx = Math.cos(ang) * 620, sy = Math.sin(ang) * 380 - 100;
        return k > 0 && k < 1 ? <div key={i} style={{ position: "absolute", left: sx * (1 - k) - 70, top: sy * (1 - k) - 34 - Math.sin(k * Math.PI) * 140, width: 140, height: 68, borderRadius: 6, background: "linear-gradient(135deg,#d9c58f,#a9b980)", border: "3px solid #6d7a4a", transform: `rotate(${(1 - k) * 300 + i * 20}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} /> : null;
      })}
      <svg width={300} height={220} style={{ position: "absolute", left: -150, top: -60, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.7))" }}>
        <path d="M20 70 L 280 70 L 260 210 L 40 210 Z" fill="#8a5a32" /><path d="M20 70 L 150 30 L 280 70 Z" fill="#a8723f" />
        <text x={150} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill="#f4efe6">$$$</text>
      </svg>
      <div style={{ position: "absolute", left: 0, top: 190, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(7, "rgba(0,0,0,.75)"), opacity: e(t, at + 1.2, at + 1.4) }}>{text}</div>
    </div>
  );
};

// tele vieja de bulbo: lo que "pasan en la tele" (con nieve y línea de barrido)
export const TeleVieja: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; icon?: string }> = ({ t, at, out, x, y, text, icon = "❄" }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), on = e(t, at + 0.25, at + 0.45);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1100px) rotateY(${(1 - Math.min(1, k)) * 70 - 14}deg) scale(${0.6 + 0.4 * k})` }}>
      <div style={{ width: 520, height: 400, borderRadius: 30, background: "linear-gradient(160deg,#6b4a2e,#3e2a19)", padding: 30, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,.7)", position: "relative" }}>
        <div style={{ width: 360, height: 300, borderRadius: 40, overflow: "hidden", background: "#111", position: "relative", boxShadow: "inset 0 0 40px #000" }}>
          <div style={{ position: "absolute", inset: 0, background: `repeating-radial-gradient(circle at ${(t * 997) % 100}% ${(t * 613) % 100}%, #888 0 1px, #222 1px 3px)`, opacity: 0.4 * (1 - on) + 0.1 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: on, transform: `scaleY(${0.05 + 0.95 * on})`, background: "radial-gradient(circle,#2a5b8a,#0c1e33)" }}>
            <div style={{ fontSize: 120, color: COL.ice2, textShadow: "0 0 30px #8fd6ff" }}>{icon}</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", letterSpacing: 3 }}>{text}</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, height: 30, top: `${((t * 60) % 120) - 10}%`, background: "linear-gradient(transparent, rgba(255,255,255,.08), transparent)" }} />
        </div>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", right: 34, top: 60 + i * 90, width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ccc, #555)", transform: `rotate(${i * 120 + t * 10}deg)` }} />)}
      </div>
    </div>
  );
};

// ================= m3 =================
// ficha de detenido: regla de estaturas + tablilla "19 AÑOS"
export const FichaDetenido: React.FC<{ t: number; at: number; out: number; x: number; y: number; big: string; l2: string; l2At: number }> = ({ t, at, out, x, y, big, l2, l2At }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), flash = 1 - e(t, at + 0.05, at + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(-3deg) scale(${0.6 + 0.4 * k})` }}>
      <div style={{ width: 520, height: 560, background: "#d9d6cf", borderRadius: 8, position: "relative", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.75)" }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 40, height: 2, background: "rgba(0,0,0,.35)" }}><span style={{ position: "absolute", left: 8, top: -16, fontFamily: FONT, fontWeight: 800, fontSize: 14, color: "#333" }}>{190 - i * 10}</span></div>)}
        <svg width={520} height={560} style={{ position: "absolute", inset: 0 }}><path d="M260 120 C 200 120 190 190 200 230 C 150 250 130 320 120 560 L 400 560 C 390 320 370 250 320 230 C 330 190 320 120 260 120 Z" fill="#2b2e33" /><ellipse cx={260} cy={190} rx={58} ry={70} fill="#121316" /></svg>
        <div style={{ position: "absolute", left: 70, right: 70, bottom: 40, padding: "14px 0", background: "#111", border: "4px solid #eee", textAlign: "center", fontFamily: "'Courier New', monospace", color: "#fff" }}>
          <div style={{ fontSize: 20, letterSpacing: 4 }}>DETENIDO · GDL</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1 }}>{big}</div>
          <div style={{ fontSize: 22, letterSpacing: 2, opacity: e(t, l2At, l2At + 0.2) }}>{l2}</div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </div>
    </div>
  );
};

// UN MINUTO: reloj de arena que se vacía de golpe + "TODO AL PISO"
export const UnMinuto: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; sub: string }> = ({ t, at, out, x, y, text, sub }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), f = ei(t, at + 0.2, at + 1.4), flip = ei(t, at, at + 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, textAlign: "center" }}>
      <svg width={220} height={300} viewBox="0 0 220 300" style={{ transform: `rotate(${180 - 180 * flip}deg)`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.7))" }}>
        <rect x={20} y={6} width={180} height={20} rx={6} fill="#6b4a2e" /><rect x={20} y={274} width={180} height={20} rx={6} fill="#6b4a2e" />
        <path d="M40 26 L 180 26 C 180 100 120 130 116 150 C 120 170 180 200 180 274 L 40 274 C 40 200 100 170 104 150 C 100 130 40 100 40 26 Z" fill="rgba(200,230,255,.18)" stroke="#d8e6f2" strokeWidth={4} />
        <path d={`M${60 + 40 * f} ${40 + 90 * f} L ${160 - 40 * f} ${40 + 90 * f} L 110 146 Z`} fill={COL.amber} opacity={1 - f * 0.95} />
        <path d={`M48 270 L 172 270 L ${110 + 50 * (1 - f)} ${270 - 100 * f} L ${110 - 50 * (1 - f)} ${270 - 100 * f} Z`} fill={COL.amber} />
        {f < 1 && f > 0 && <line x1={110} y1={150} x2={110} y2={265} stroke={COL.amber} strokeWidth={4} />}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, color: COL.amber, textShadow: extrude(8, "#5a3410"), whiteSpace: "nowrap" }}>{text}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: COL.ink, whiteSpace: "nowrap", opacity: e(t, at + 0.8, at + 1.0) }}>{sub}</div>
    </div>
  );
};

// la REGLA escrita en una tarjeta de archivo (palabra por palabra) con subrayado rojo
export const ReglaCard: React.FC<{ t: number; at: number; out: number; head: string; words: { at: number; w: string; hl?: boolean }[]; x?: number; y?: number }> = ({ t, at, out, head, words, x = 1380, y = 540 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotate(3deg)` }}>
      <div style={{ width: 760, padding: "30px 44px 40px", background: "#fbf8ef", borderRadius: 8, boxShadow: "0 40px 80px rgba(0,0,0,.7)", backgroundImage: "repeating-linear-gradient(transparent 0 58px, rgba(80,120,200,.3) 58px 60px)", borderTop: "14px solid #c94a3a" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 6, color: "#c94a3a" }}>{head}</div>
        <div style={{ fontFamily: HAND, fontSize: 56, lineHeight: "60px", color: "#1d2733", marginTop: 6 }}>
          {words.map((w, i) => <span key={i} style={{ opacity: e(t, w.at, w.at + 0.1), position: "relative", marginRight: 14, display: "inline-block", fontWeight: w.hl ? 900 : 400, color: w.hl ? "#b3261e" : undefined }}>{w.w}
            {w.hl && <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 6, background: "#b3261e", transform: `scaleX(${e(t, w.at + 0.15, w.at + 0.4)})`, transformOrigin: "0 50%", borderRadius: 3 }} />}</span>)}
        </div>
      </div>
    </div>
  );
};

const ICON: Record<string, (c: string) => React.ReactNode> = {
  tiempo: (c) => <g><circle cx={50} cy={52} r={36} fill="none" stroke={c} strokeWidth={8} /><line x1={50} y1={52} x2={50} y2={30} stroke={c} strokeWidth={7} strokeLinecap="round" /><line x1={50} y1={52} x2={66} y2={60} stroke={c} strokeWidth={7} strokeLinecap="round" /></g>,
  ruido: (c) => <g><path d="M16 38 L 34 38 L 56 18 L 56 86 L 34 66 L 16 66 Z" fill={c} /><path d="M68 34 Q 80 52 68 70 M78 24 Q 96 52 78 80" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" /></g>,
  suciedad: (c) => <g><path d="M30 90 L 30 44 Q 30 36 37 36 Q 44 36 44 44 L 44 26 Q 44 18 51 18 Q 58 18 58 26 L 58 40 Q 58 32 65 32 Q 72 32 72 40 L 72 66 Q 72 92 50 92 Z" fill={c} /><circle cx={40} cy={70} r={7} fill="#5a4024" /><circle cx={58} cy={58} r={5} fill="#5a4024" /><circle cx={56} cy={80} r={6} fill="#5a4024" /></g>,
};
// los TRES ENEMIGOS del ratero: tres carteles de "SE BUSCA" que caen (al revés: los que buscan al ratero)
export const Enemigos: React.FC<{ t: number; items: { at: number; txt: string; ic: string }[]; out: number; lit?: number[]; y?: number }> = ({ t, items, out, lit = [], y = 540 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, transform: "translateY(-50%)", display: "flex", justifyContent: "center", gap: 50, perspective: 1300 }}>
    {items.map((it, i) => {
      const k = pop(t, it.at, 0.9), o = op(t, it.at, out + i * 0.05), L = lit[i] ?? 0;
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * -500}px) rotate(${(i - 1) * 4 + (1 - Math.min(1, k)) * 30}deg) scale(${1 + 0.06 * L})`, width: 360, padding: "22px 20px 28px", background: "linear-gradient(180deg,#efe2bf,#d8c493)", borderRadius: 6, textAlign: "center", fontFamily: FONT,
          boxShadow: `0 30px 60px rgba(0,0,0,.7), 0 0 ${60 * L}px rgba(255,200,90,${0.8 * L})` }}>
          <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 8, color: "#5a3410" }}>ENEMIGO {i + 1}</div>
          <svg width={160} height={160} viewBox="0 0 100 100" style={{ margin: "8px auto" }}>{ICON[it.ic]("#3a2410")}</svg>
          <div style={{ fontWeight: 900, fontSize: 64, color: "#2a1a0c", lineHeight: 1 }}>{it.txt}</div>
        </div>
      );
    })}
  </div>
);

// TRÍADA: triángulo con los tres enemigos; un escondite bueno prende AL MENOS UNO
export const Triada: React.FC<{ t: number; at: number; out: number; lit: number[]; x?: number; y?: number; title: string }> = ({ t, at, out, lit, x = 1380, y = 560, title }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8), pts = [[260, 40], [40, 420], [480, 420]], names = ["tiempo", "ruido", "suciedad"], lab = ["TIEMPO", "RUIDO", "SUCIEDAD"];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k}) rotate(${(1 - Math.min(1, k)) * -20}deg)` }}>
      <svg width={520} height={520} style={{ overflow: "visible" }}>
        <path d="M260 40 L 40 420 L 480 420 Z" fill="rgba(10,12,16,.75)" stroke={COL.gold} strokeWidth={5} strokeDasharray={1400} strokeDashoffset={1400 * (1 - e(t, at, at + 0.6))} />
        {pts.map(([px, py], i) => { const L = lit[i] ?? 0; return (
          <g key={i} transform={`translate(${px - 60} ${py - 60})`}>
            <circle cx={60} cy={60} r={64} fill={L > 0.5 ? COL.gold : "#2a2d33"} style={{ filter: L > 0.5 ? `drop-shadow(0 0 ${20 * L}px ${COL.gold})` : undefined }} />
            <svg x={10} y={10} width={100} height={100} viewBox="0 0 100 100">{ICON[names[i]](L > 0.5 ? "#2a1a0c" : "#d9d2c4")}</svg>
            <text x={60} y={i === 0 ? -14 : 160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={COL.ink}>{lab[i]}</text>
          </g>); })}
        <text x={260} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={COL.gold}>{title}</text>
      </svg>
    </div>
  );
};

// libreta del comandante: "MIS ESCONDITES" con renglones que se escriben solos
export const Libreta: React.FC<{ t: number; at: number; out: number; x: number; y: number; title: string; lines: { at: number; txt: string }[] }> = ({ t, at, out, x, y, title, lines }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${(1 - Math.min(1, k)) * -80 - 8}deg) rotate(-4deg)` }}>
      <div style={{ width: 480, height: 560, background: "#f6f1e3", borderRadius: "6px 14px 14px 6px", boxShadow: "0 40px 80px rgba(0,0,0,.7), inset 26px 0 0 #2c3d5c", padding: "40px 30px 30px 70px", boxSizing: "border-box", backgroundImage: "repeating-linear-gradient(transparent 0 62px, rgba(80,120,200,.3) 62px 64px)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#2c3d5c", letterSpacing: 3 }}>{title}</div>
        {lines.map((l, i) => { const w = e(t, l.at, l.at + 0.6); return <div key={i} style={{ fontFamily: HAND, fontSize: 44, lineHeight: "64px", color: "#1d2733", whiteSpace: "nowrap", overflow: "hidden", width: `${w * 100}%` }}>{l.txt}</div>; })}
        <svg width={120} height={30} style={{ position: "absolute", right: 30, bottom: 40, opacity: e(t, at + 0.4, at + 0.6) }}><path d="M0 15 L 120 15" stroke="#1d2733" strokeWidth={5} strokeDasharray="10 8" /></svg>
      </div>
    </div>
  );
};

// ================= m4 =================
// letrero de TALAVERA con el nombre del cuarto (azulejos que se voltean uno por uno)
export const Letrero: React.FC<{ t: number; at: number; out: number; text: string; sub?: string; y?: number }> = ({ t, at, out, text, sub, y = 150 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const ch = text.split("");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", perspective: 1200 }}>
      <div style={{ display: "flex", gap: 6, padding: 14, background: "#f3ecdc", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 0 0 6px #1f4fa0" }}>
        {ch.map((c, i) => { const k = ei(t, at + i * 0.05, at + 0.3 + i * 0.05); return (
          <div key={i} style={{ width: c === " " ? 30 : 92, height: 112, transform: `rotateY(${(1 - k) * 180}deg)`, background: c === " " ? "transparent" : "radial-gradient(circle at 50% 50%, #fff 0 34%, transparent 35%), repeating-conic-gradient(from 45deg, #1f4fa0 0 25%, #f7f1e1 0 50%)", backgroundSize: "100% 100%, 46px 46px", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 76, color: "#1f3c74", boxShadow: c === " " ? undefined : "inset 0 0 0 3px #1f4fa0" }}>{c}</div>); })}
      </div>
      {sub && <div style={{ marginTop: 14, fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: COL.ink, textShadow: "0 3px 10px #000", opacity: e(t, at + 0.5, at + 0.7) }}>{sub}</div>}
    </div>
  );
};

// barras horizontales de "esfuerzo vs premio"
export const Barras: React.FC<{ t: number; out: number; rows: { at: number; label: string; v: number; col: string }[]; x?: number; y?: number }> = ({ t, out, rows, x = 1300, y = 760 }) => {
  const o = op(t, rows[0].at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o, padding: "24px 30px", ...card("rgba(255,255,255,.15)") }}>
      {rows.map((r, i) => { const w = ei(t, r.at, r.at + 0.6) * r.v; return (
        <div key={i} style={{ marginBottom: i < rows.length - 1 ? 18 : 0 }}>
          <div style={{ fontWeight: 900, fontSize: 34, color: COL.ink, letterSpacing: 2, opacity: e(t, r.at, r.at + 0.15) }}>{r.label}</div>
          <div style={{ width: 640, height: 34, borderRadius: 17, background: "rgba(255,255,255,.08)", marginTop: 6 }}><div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 17, background: r.col, boxShadow: `0 0 18px ${r.col}` }} /></div>
        </div>); })}
    </div>
  );
};

// LISTA DE 25: barra inferior con 25 casillas que se van llenando con cada lugar
export const Lista25: React.FC<{ t: number; at: number; out: number; marks: number[] }> = ({ t, at, out, marks }) => {
  const o = op(t, at, out, 0.3, 0.4); if (o <= 0.01) return null;
  const n = marks.filter((m) => t >= m).length;
  return (
    <div style={{ position: "absolute", right: 60, top: 54, opacity: o * 0.95, display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderRadius: 14, background: "rgba(10,12,16,.72)", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(25, 14px)", gap: 4 }}>
        {marks.map((m, i) => { const on = e(t, m, m + 0.2), cur = i === n - 1 ? 0.5 + 0.5 * Math.sin(t * 8) : 0; return <div key={i} style={{ width: 14, height: 22, borderRadius: 3, background: on > 0.5 ? "#ffd23a" : "rgba(255,255,255,.14)", transform: `scaleY(${1 + 0.3 * cur})`, boxShadow: on > 0.5 ? `0 0 ${6 + 10 * cur}px #ffd23a` : "none" }} />; })}
      </div>
      <div style={{ fontWeight: 900, fontSize: 34, color: "#ffd23a", minWidth: 80, fontVariantNumeric: "tabular-nums" }}>{n}<span style={{ fontSize: 22, color: COL.dim }}>/25</span></div>
    </div>
  );
};

// PASOS numerados unidos por flechas que se dibujan
export const Pasos: React.FC<{ t: number; out: number; steps: { at: number; txt: string }[]; y?: number }> = ({ t, out, steps, y = 860 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
    {steps.map((s, i) => { const k = pop(t, s.at, 1), o = op(t, s.at, out + i * 0.05); return (
      <React.Fragment key={i}>
        {i > 0 && <svg width={90} height={40} style={{ opacity: o }}><path d="M5 20 L 70 20 M58 8 L 76 20 L 58 32" fill="none" stroke={COL.gold} strokeWidth={6} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - e(t, s.at - 0.1, s.at + 0.2))} /></svg>}
        <div style={{ opacity: o, transform: `scale(${0.5 + 0.5 * k})`, padding: "16px 26px", display: "flex", gap: 14, alignItems: "center", ...card(COL.gold + "88") }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: COL.gold, color: "#2a1a0c", fontWeight: 900, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontWeight: 900, fontSize: 36, color: COL.ink, whiteSpace: "nowrap" }}>{s.txt}</div>
        </div>
      </React.Fragment>); })}
  </div>
);

// BALANZA de platillos que se equilibra
export const Balanza: React.FC<{ t: number; at: number; out: number; x: number; y: number; l: string; r: string; title: string }> = ({ t, at, out, x, y, l, r, title }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8), tilt = (1 - ei(t, at + 0.3, at + 1.3)) * 16 * Math.cos((t - at) * 6);
  const pan = (dx: number, lab: string, dy: number) => (
    <g transform={`translate(${250 + dx} ${80 + dy})`}>
      <line x1={0} y1={0} x2={-60} y2={120} stroke="#c9ced6" strokeWidth={3} /><line x1={0} y1={0} x2={60} y2={120} stroke="#c9ced6" strokeWidth={3} />
      <path d="M-90 120 Q 0 175 90 120 Z" fill="#c9a14a" />
      <text x={0} y={112} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={COL.ink}>{lab}</text>
    </g>
  );
  const a = (tilt * Math.PI) / 180, dyL = -Math.sin(a) * 170, dyR = Math.sin(a) * 170;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, textAlign: "center" }}>
      <svg width={500} height={380} style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.7))" }}>
        <rect x={240} y={80} width={20} height={250} fill="#8a6a1e" /><path d="M170 340 L 330 340 L 300 320 L 200 320 Z" fill="#8a6a1e" />
        <g transform={`rotate(${tilt} 250 80)`}><rect x={70} y={74} width={360} height={12} rx={6} fill="#c9a14a" /></g>
        {pan(-170, l, dyL)}{pan(170, r, dyR)}
        <circle cx={250} cy={80} r={14} fill="#e9c46a" />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COL.gold, whiteSpace: "nowrap", textShadow: extrude(7, "#5a4316"), opacity: e(t, at + 1.0, at + 1.2) }}>{title}</div>
    </div>
  );
};

// qué ENEMIGO del ratero activa este escondite (chips con ícono)
export const EnemyChips: React.FC<{ t: number; at: number; out: number; which: ("tiempo" | "ruido" | "suciedad")[]; x?: number; y?: number }> = ({ t, at, out, which, x = 1540, y = 960 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", gap: 12, opacity: o }}>
      {which.map((w, i) => { const k = pop(t, at + i * 0.15, 1.2); return (
        <div key={w} style={{ transform: `scale(${0.4 + 0.6 * k})`, display: "flex", alignItems: "center", gap: 8, padding: "8px 18px 8px 10px", borderRadius: 999, background: COL.gold, boxShadow: "0 12px 30px rgba(0,0,0,.6)", fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#2a1a0c" }}>
          <svg width={42} height={42} viewBox="0 0 100 100">{ICON[w]("#2a1a0c")}</svg>{w.toUpperCase()} ✓
        </div>); })}
    </div>
  );
};

// ================= m5 =================
// la ALACENA en corte: fila de adelante (latas de verdad) y fila de atrás (la lata del escondite)
export const Alacena: React.FC<{ t: number; at: number; backAt: number; out: number }> = ({ t, at, backAt, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const sep = ei(t, backAt, backAt + 0.6), hi = e(t, backAt + 0.5, backAt + 0.8);
  const can = (i: number, back: boolean, gold: boolean) => (
    <div key={(back ? "b" : "f") + i} style={{ width: 110, height: 150, borderRadius: 10, background: gold ? "linear-gradient(90deg,#b9b9b9,#f3f3f3 40%,#9c9c9c)" : "linear-gradient(90deg,#9a9a9a,#e3e3e3 40%,#888)", position: "relative", boxShadow: gold ? `0 0 ${40 * hi}px ${COL.green}` : "0 10px 20px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, height: 76, background: ["#c0392b", "#d35400", "#27ae60", "#2980b9", "#c0392b", "#8e44ad"][i % 6], opacity: 0.92 }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse at 50% 40%, #3b2a1c, #120b06)" }}>
      <div style={{ position: "absolute", left: 260, right: 260, top: 300, height: 24, background: "#7a5638", transform: `translateY(${sep * 120}px)`, boxShadow: "0 10px 20px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 300, top: 150 - sep * 60, display: "flex", gap: 30, transform: `scale(${0.9 - 0.08 * sep})`, transformOrigin: "50% 100%" }}>{Array.from({ length: 8 }, (_, i) => can(i, true, i === 5))}</div>
      <div style={{ position: "absolute", left: 270, top: 170 + sep * 270, display: "flex", gap: 36 }}>{Array.from({ length: 8 }, (_, i) => can(i + 2, false, false))}</div>
      <div style={{ position: "absolute", left: 120, top: 220 - sep * 60, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: COL.green, opacity: hi }}>FILA DE ATRÁS ↓</div>
      <div style={{ position: "absolute", left: 120, top: 360 + sep * 270, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: COL.dim, opacity: sep }}>FILA DE ADELANTE</div>
    </AbsoluteFill>
  );
};

// CANDADO DE POLVO: partículas que forman un candado
const POLVO_PTS: [number, number][] = (() => { const p: [number, number][] = []; for (let i = 0; i < 260; i++) { const a = (i * 137.5) % 360, u = (i * 0.618) % 1; if (i < 170) p.push([40 + u * 220, 150 + ((i * 7.3) % 150)]); else { const th = Math.PI + (i - 170) / 90 * Math.PI; p.push([150 + Math.cos(th) * 80 + Math.sin(a) * 4, 150 + Math.sin(th) * 100 + Math.cos(a) * 4]); } } return p; })();
export const CandadoPolvo: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 1.0);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <svg width={300} height={320} style={{ overflow: "visible" }}>
        {POLVO_PTS.map(([px, py], i) => { const sx = 150 + Math.sin(i * 12.9898) * 500, sy = 160 + Math.cos(i * 78.233) * 400; return <circle key={i} cx={sx + (px - sx) * k} cy={sy + (py - sy) * k} r={3 + (i % 3)} fill="#cfc7b8" opacity={0.85} />; })}
        <circle cx={150} cy={215} r={14} fill="#3a3530" opacity={k} /><rect x={144} y={215} width={12} height={36} fill="#3a3530" opacity={k} />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(7, "rgba(0,0,0,.75)"), opacity: e(t, at + 0.9, at + 1.1) }}>{text}</div>
    </div>
  );
};

// COSTURA: la orilla se descose, entra el sobre plano y se vuelve a coser
export const Costura: React.FC<{ t: number; at: number; inAt: number; closeAt: number; out: number; x: number; y: number }> = ({ t, at, inAt, closeAt, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const open = ei(t, at + 0.2, at + 0.8) * (1 - ei(t, closeAt, closeAt + 0.8)), ins = ei(t, inAt, inAt + 0.7);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={640} height={360} style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.7))" }}>
        <defs><pattern id="flor" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#e9d9e8" /><circle cx="30" cy="30" r="10" fill="#c76b8a" /><circle cx="0" cy="0" r="7" fill="#7fae6b" /><circle cx="60" cy="60" r="7" fill="#7fae6b" /></pattern></defs>
        <rect x={20} y={100} width={600} height={200} rx={20} fill="url(#flor)" />
        <rect x={420 - 300 * ins} y={140 + 40 * (1 - open)} width={260} height={120} rx={6} fill="#fbf8f0" stroke="#bbb" strokeWidth={2} opacity={e(t, inAt - 0.1, inAt + 0.1)} />
        <path d={`M20 ${100 - 40 * open} Q 320 ${100 - 70 * open} 620 ${100 - 40 * open}`} fill="none" stroke="#c76b8a" strokeWidth={22} />
        {Array.from({ length: 22 }, (_, i) => { const cut = i / 22 < open; return <line key={i} x1={40 + i * 26} y1={100 - 40 * open - 6} x2={52 + i * 26} y2={cut ? 100 - 40 * open - 6 : 106} stroke="#2a2a2a" strokeWidth={4} strokeLinecap="round" opacity={cut ? 0.25 : 1} />; })}
      </svg>
    </div>
  );
};

// ================= m6 =================
// CASAS REVISADAS: cuadrícula de casitas, casi todas con el tanque revisado (✓ rojo)
export const CasasGrid: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; n?: number; skip?: number[] }> = ({ t, at, out, x, y, text, n = 24, skip = [7, 18] }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 80px)", gap: 14 }}>
        {Array.from({ length: n }, (_, i) => { const a = at + 0.05 * i, k = pop(t, a, 1.3), chk = !skip.includes(i) && t > a + 0.25; return (
          <div key={i} style={{ position: "relative", transform: `scale(${0.3 + 0.7 * k})` }}>
            <svg width={80} height={76} viewBox="0 0 80 76"><path d="M8 34 L 40 6 L 72 34 L 72 74 L 8 74 Z" fill={["#e39bb4", "#f2c45a", "#7fb7d9", "#9fc79a", "#e98b5a"][i % 5]} /><rect x={32} y={48} width={16} height={26} fill="#5a3a24" /></svg>
            {chk && <div style={{ position: "absolute", right: -6, top: -6, width: 34, height: 34, borderRadius: 17, background: COL.red, color: "#fff", fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>✓</div>}
          </div>); })}
      </div>
      <div style={{ marginTop: 20, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(6, "rgba(0,0,0,.75)"), opacity: e(t, at + 1.0, at + 1.2) }}>{text}</div>
    </div>
  );
};

// TUBO EN CORTE: barra hueca de la cortina, el rollo entra y se pone la tapita
export const TuboCorte: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const cap = ei(t, at + 0.1, at + 0.6), roll = ei(t, at + 0.7, at + 1.6), back = ei(t, at + 1.8, at + 2.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
      <svg width={900} height={220} style={{ overflow: "visible", filter: "drop-shadow(0 20px 26px rgba(0,0,0,.7))" }}>
        <rect x={0} y={70} width={760} height={80} rx={40} fill="#b8bec6" /><rect x={10} y={84} width={740} height={52} rx={26} fill="#2a2d33" />
        <rect x={10} y={70} width={740} height={14} fill="rgba(255,255,255,.35)" />
        <rect x={820 - 380 * roll} y={88} width={220} height={44} rx={22} fill="#a9b980" stroke="#6d7a4a" strokeWidth={3} />
        <g transform={`translate(${760 + 120 * cap * (1 - back)} 0)`}><rect x={0} y={64} width={40} height={92} rx={14} fill="#8a6a1e" /></g>
      </svg>
    </div>
  );
};

// LO ABURRIDO ES INVISIBLE: la frase se va volviendo transparente letra por letra
export const Invisible: React.FC<{ t: number; at: number; out: number; text: string }> = ({ t, at, out, text }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 50%, #2b2f36, #0b0c0f)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textAlign: "center", lineHeight: 1.05, maxWidth: 1500 }}>
        {text.split("").map((c, i) => { const f = e(t, at + 0.9 + i * 0.04, at + 1.4 + i * 0.04); return <span key={i} style={{ opacity: 1 - 0.92 * f, filter: `blur(${f * 6}px)`, WebkitTextStroke: f > 0.5 ? "2px rgba(244,239,230,.35)" : undefined } as React.CSSProperties}>{c}</span>; })}
      </div>
    </AbsoluteFill>
  );
};

// ================= m7 =================
// CALENDARIO: 11 meses tachados, diciembre se prende
export const Calendario: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; textAt: number }> = ({ t, at, out, x, y, text, textAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const M = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"], k = pop(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, padding: 24, ...card("rgba(255,255,255,.15)") }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 130px)", gap: 12 }}>
        {M.map((m, i) => { const x1 = e(t, at + 0.3 + i * 0.09, at + 0.45 + i * 0.09), dec = i === 11; return (
          <div key={m} style={{ position: "relative", height: 90, borderRadius: 10, background: dec ? `rgba(46,160,90,${0.4 + 0.4 * e(t, at + 1.5, at + 1.8)})` : "#f3ecdc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, color: dec ? "#fff" : "#2a2a2a", boxShadow: dec ? `0 0 ${30 * e(t, at + 1.5, at + 1.8)}px #43e07f` : undefined }}>
            {dec ? "🎄 " + m : m}
            {!dec && <svg width={130} height={90} style={{ position: "absolute", inset: 0 }}><path d="M14 14 L 116 76 M116 14 L 14 76" stroke={COL.red} strokeWidth={8} strokeLinecap="round" strokeDasharray={130} strokeDashoffset={130 * (1 - x1)} /></svg>}
          </div>); })}
      </div>
      <div style={{ marginTop: 16, textAlign: "center", fontWeight: 900, fontSize: 46, color: COL.ink, opacity: e(t, textAt, textAt + 0.15) }}>{text}</div>
    </div>
  );
};

// CAJÓN EN CORTE: el sobre pegado ARRIBA por dentro (✓); abajo (✗) es donde miran
export const CajonCorte: React.FC<{ t: number; at: number; out: number; x: number; y: number; okAt: number; noAt: number }> = ({ t, at, out, x, y, okAt, noAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), drop = ei(t, at + 0.3, at + 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})` }}>
      <svg width={620} height={460} style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.7))" }}>
        <rect x={20} y={40} width={580} height={30} fill="#6b4a2e" /><rect x={20} y={40} width={20} height={380} fill="#6b4a2e" /><rect x={580} y={40} width={20} height={380} fill="#6b4a2e" />
        <g transform={`translate(0 ${drop * 60})`}><rect x={50} y={200} width={520} height={130} fill="#9c7048" /><rect x={50} y={200} width={520} height={16} fill="#b5885c" /><rect x={260} y={250} width={100} height={20} rx={10} fill="#3a2a1e" /></g>
        <rect x={180} y={74} width={260} height={50} rx={4} fill="#fbf8f0" stroke="#888" strokeWidth={2} />
        <rect x={160} y={70} width={60} height={20} fill="#9aa1ab" opacity={0.9} /><rect x={400} y={70} width={60} height={20} fill="#9aa1ab" opacity={0.9} />
        <g opacity={e(t, okAt, okAt + 0.2)}><circle cx={500} cy={100} r={34} fill={COL.green} /><text x={500} y={114} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#0d3a1f">✓</text></g>
        <g opacity={e(t, noAt, noAt + 0.2)}><circle cx={500} cy={420} r={34} fill={COL.red} /><text x={500} y={434} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill="#fff">✗</text>
          <text x={440} y={432} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={34} fill={COL.ink}>ABAJO SÍ MIRAN</text></g>
        <text x={150} y={110} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={30} fill={COL.ink} opacity={e(t, okAt, okAt + 0.2)}>ARRIBA</text>
      </svg>
    </div>
  );
};

// ================= m8 =================
// MACETA EN CORTE: planta / tierra / plato de plástico / el sobre envuelto abajo
export const MacetaCorte: React.FC<{ t: number; at: number; out: number; x: number; y: number; steps: number[] }> = ({ t, at, out, x, y, steps }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), [sPlato, sSobre, sTierra] = steps.map((s) => ei(t, s, s + 0.5));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})` }}>
      <svg width={520} height={620} style={{ overflow: "visible", filter: "drop-shadow(0 24px 34px rgba(0,0,0,.7))" }}>
        <path d="M40 200 L 480 200 L 420 600 L 100 600 Z" fill="#b4613a" />
        <path d="M70 220 L 450 220 L 400 580 L 120 580 Z" fill="#3b2a1f" />
        <rect x={150} y={470 - 30 * (1 - sSobre)} width={220} height={70} rx={8} fill="#fbf8f0" opacity={sSobre} stroke="#9fd0ff" strokeWidth={4} />
        <path d={`M100 ${420} Q 260 ${400} 420 420`} fill="none" stroke="#e8e8e8" strokeWidth={14} opacity={sPlato} transform={`translate(0 ${(1 - sPlato) * -200})`} />
        <rect x={70} y={220} width={380} height={190} fill="#4a3426" opacity={sTierra} />
        <g opacity={sTierra} transform={`translate(260 ${220 - 10 * (1 - sTierra)})`}><rect x={-6} y={-150} width={12} height={150} fill="#5b4230" />{[[0, -200, 90], [-70, -160, 60], [70, -165, 64]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={["#2f6b34", "#3a7d3c", "#336f36"][i]} />)}{[[-30, -210], [40, -180], [-60, -140], [20, -240]].map(([cx, cy], i) => <circle key={"n" + i} cx={cx} cy={cy} r={14} fill="#ff8c1a" />)}</g>
        {[["PLANTA", 160, sTierra], ["TIERRA", 310, sTierra], ["PLATO", 420, sPlato], ["SOBRE", 505, sSobre]].map(([l, yy, v], i) => <text key={i} x={500} y={yy as number} fontFamily={FONT} fontWeight={900} fontSize={34} fill={i === 3 ? COL.green : COL.ink} opacity={v as number}>← {l}</text>)}
      </svg>
    </div>
  );
};

// ================= m9 =================
// CORCHO de los errores: tres fichas con chinche que se voltean
export const Corcho: React.FC<{ t: number; at: number; out: number; cards: { at: number; n: string; txt: string }[] }> = ({ t, at, out, cards }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(ellipse at 50% 45%, #b98a5a, #6e4a2a)", backgroundImage: "radial-gradient(rgba(0,0,0,.18) 1px, transparent 1.5px), radial-gradient(ellipse at 50% 45%, #b98a5a, #6e4a2a)", backgroundSize: "7px 7px, 100% 100%" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#fff7e8", textShadow: extrude(6, "rgba(0,0,0,.6)"), opacity: e(t, at, at + 0.3) }}>3 ERRORES QUE ECHAN A PERDER EL ESCONDITE</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 70, perspective: 1400 }}>
        {cards.map((c, i) => { const f = ei(t, c.at, c.at + 0.5), dim = cards.some((d, j) => j > i && t > d.at) ? 0.55 : 1; return (
          <div key={i} style={{ width: 400, height: 470, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${180 - 180 * f}deg) rotate(${(i - 1) * 3}deg)`, opacity: e(t, at + 0.2 + i * 0.12, at + 0.4 + i * 0.12) * dim }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "#fbf8ef", borderRadius: 6, boxShadow: "0 30px 50px rgba(0,0,0,.5)", padding: 30, boxSizing: "border-box", textAlign: "center", fontFamily: FONT } as React.CSSProperties}>
              <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 6, color: "#b3261e" }}>ERROR</div>
              <div style={{ fontWeight: 900, fontSize: 170, color: "#b3261e", lineHeight: 1 }}>{c.n}</div>
              <div style={{ fontFamily: HAND, fontSize: 50, color: "#1d2733", marginTop: 20, lineHeight: 1.1 }}>{c.txt}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "repeating-linear-gradient(45deg,#2c3d5c 0 20px,#253451 20px 40px)", borderRadius: 6, boxShadow: "0 30px 50px rgba(0,0,0,.5)" } as React.CSSProperties} />
            <div style={{ position: "absolute", left: "50%", top: -14, width: 34, height: 34, borderRadius: 17, background: "radial-gradient(circle at 35% 35%, #ff8a7a, #b3261e)", transform: "translateX(-50%) translateZ(2px)", boxShadow: "0 6px 10px rgba(0,0,0,.5)" }} />
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

// HUELLA digital que se escanea y brilla
export const Huella: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const scan = ((t - at) * 0.8) % 1, k = pop(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, textAlign: "center" }}>
      <svg width={260} height={320} viewBox="0 0 260 320" style={{ filter: `drop-shadow(0 0 20px ${COL.amber})` }}>
        {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={130} cy={170} rx={20 + i * 12} ry={30 + i * 15} fill="none" stroke={COL.amber} strokeWidth={5} strokeDasharray={`${60 + i * 10} ${10 + (i % 3) * 8}`} transform={`rotate(${i * 7} 130 170)`} opacity={0.85} />)}
        <rect x={0} y={20 + scan * 280} width={260} height={8} fill={COL.amber} opacity={0.8} />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(6, "rgba(0,0,0,.75)") }}>{text}</div>
    </div>
  );
};

// GRANDE (casi nunca se abre) / DIARIO (aparte)
export const GrandeDiario: React.FC<{ t: number; at: number; at2: number; out: number }> = ({ t, at, at2, out }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const box = (k: number, title: string, sub: string, col: string, ic: string) => (
    <div style={{ opacity: e(k, 0, 0.3), transform: `scale(${0.5 + 0.5 * Math.min(1, k)}) translateY(${(1 - Math.min(1, k)) * 80}px)`, width: 520, padding: "34px 30px", textAlign: "center", ...card(col) }}>
      <div style={{ fontSize: 110 }}>{ic}</div>
      <div style={{ fontWeight: 900, fontSize: 66, color: col }}>{title}</div>
      <div style={{ fontWeight: 800, fontSize: 32, color: COL.ink, letterSpacing: 2 }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 540, transform: "translateY(-50%)", display: "flex", justifyContent: "center", gap: 80, opacity: o }}>
      {box(pop(t, at, 0.9), "ESCONDITE GRANDE", "SAQUE Y META LO MENOS POSIBLE", COL.green, "🔒")}
      {t > at2 && box(pop(t, at2, 0.9), "LO DE DIARIO", "APARTE", COL.gold, "👛")}
    </div>
  );
};

// la lista "en clave": se escribe como lista del súper
export const ListaSuper: React.FC<{ t: number; at: number; out: number; items: { at: number; txt: string }[]; superAt: number; x?: number; y?: number }> = ({ t, at, out, items, superAt, x = 1380, y = 540 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8), sp = e(t, superAt, superAt + 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${4 - 2 * sp}deg) perspective(1100px) rotateX(${(1 - Math.min(1, k)) * 70}deg)` }}>
      <div style={{ width: 480, minHeight: 560, background: "#fffdf4", padding: "34px 40px", boxSizing: "border-box", boxShadow: "0 40px 70px rgba(0,0,0,.7)", clipPath: "polygon(0 2%, 6% 0, 12% 2%, 18% 0, 24% 2%, 30% 0, 36% 2%, 42% 0, 48% 2%, 54% 0, 60% 2%, 66% 0, 72% 2%, 78% 0, 84% 2%, 90% 0, 96% 2%, 100% 0, 100% 100%, 0 100%)" }}>
        <div style={{ fontFamily: HAND, fontSize: 46, color: "#1d2733", borderBottom: "3px solid #1d2733", paddingBottom: 6, position: "relative" }}>
          <span style={{ opacity: 1 - sp }}>Mis escondites</span>
          <span style={{ position: "absolute", left: 0, opacity: sp, color: "#b3261e" }}>Lista del súper 🛒</span>
        </div>
        {items.map((it, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 54, color: "#1d2733", marginTop: 22, whiteSpace: "nowrap", overflow: "hidden", width: `${e(t, it.at, it.at + 0.5) * 100}%` }}>☐ {it.txt}</div>)}
      </div>
    </div>
  );
};

// ================= m10 =================
// DETECTOR DE HUMO: se abre la tapa, entra la pila nueva; "1 VEZ AL AÑO"
export const Detector: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string }> = ({ t, at, out, x, y, text }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), lid = ei(t, at + 0.3, at + 0.7) * (1 - ei(t, at + 1.6, at + 2.0)), bat = ei(t, at + 0.8, at + 1.4), led = Math.sin(t * 8) > 0.6 ? 1 : 0.2;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, textAlign: "center" }}>
      <svg width={360} height={360} style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,.7))" }}>
        <circle cx={180} cy={180} r={150} fill="#ecebe6" /><circle cx={180} cy={180} r={110} fill="#dcdad3" />
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={174} y={86} width={12} height={40} rx={6} fill="#c6c3ba" transform={`rotate(${i * 22.5} 180 180)`} />)}
        <circle cx={250} cy={120} r={10} fill={`rgba(255,40,30,${led})`} />
        <g transform={`translate(0 ${lid * 45})`}><rect x={110} y={250} width={140} height={60} rx={10} fill="#cfcac0" opacity={lid > 0.05 ? 1 : 0} /></g>
        <rect x={130 + (1 - bat) * 260} y={262} width={100} height={36} rx={6} fill="#2a2d33" opacity={lid > 0.05 ? 1 : 0} /><rect x={130 + (1 - bat) * 260} y={262} width={26} height={36} fill="#c9a14a" opacity={lid > 0.05 ? 1 : 0} />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: COL.ink, whiteSpace: "nowrap", marginTop: 30, textShadow: extrude(6, "rgba(0,0,0,.75)") }}>{text}</div>
    </div>
  );
};

// DIVIDIR: un fajo que se parte en 4; uno se pierde, los otros 3 quedan
export const Divide: React.FC<{ t: number; at: number; splitAt: number; lossAt: number; out: number; x: number; y: number }> = ({ t, at, splitAt, lossAt, out, x, y }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const sp = ei(t, splitAt, splitAt + 0.6), loss = ei(t, lossAt, lossAt + 0.6), k = pop(t, at, 0.9);
  const pos = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})` }}>
      {pos.map(([px, py], i) => { const gone = i === 1 ? loss : 0; return (
        <div key={i} style={{ position: "absolute", left: px * 150 * sp - 110 + gone * 400, top: py * 110 * sp - 60 - gone * 300, width: 220, height: 120, opacity: 1 - gone, transform: `rotate(${gone * 60}deg)` }}>
          {Array.from({ length: 4 }, (_, j) => <div key={j} style={{ position: "absolute", left: j * 3, top: -j * 6, width: 220, height: 104, borderRadius: 8, background: "linear-gradient(135deg,#d9c58f,#a9b980)", border: "3px solid #6d7a4a", boxShadow: "0 8px 16px rgba(0,0,0,.4)" }} />)}
          {sp > 0.9 && i !== 1 && <div style={{ position: "absolute", right: -10, top: -30, width: 40, height: 40, borderRadius: 20, background: COL.green, color: "#0d3a1f", fontFamily: FONT, fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", opacity: loss }}>✓</div>}
        </div>); })}
      <div style={{ position: "absolute", left: 0, top: 260, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(6, "rgba(0,0,0,.75)"), opacity: loss }}>UNA PARTE, NO TODO</div>
    </div>
  );
};

// NADIE LO SABE: tres siluetas; a cada una se le cierra un cierre en la boca
export const Nadie: React.FC<{ t: number; items: { at: number; txt: string }[]; out: number; finalAt: number; final: string }> = ({ t, items, out, finalAt, final }) => {
  const o = op(t, items[0].at, out); if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", gap: 110 }}>
        {items.map((it, i) => { const k = pop(t, it.at, 0.9), z = e(t, it.at + 0.4, it.at + 0.8); return (
          <div key={i} style={{ textAlign: "center", opacity: e(t, it.at, it.at + 0.15), transform: `translateY(${(1 - Math.min(1, k)) * 120}px)` }}>
            <svg width={260} height={330} viewBox="0 0 260 330">
              <circle cx={130} cy={100} r={70} fill="#e9e2d2" /><path d="M20 330 C 20 220 60 180 130 180 C 200 180 240 220 240 330 Z" fill="#e9e2d2" />
              <rect x={95} y={120} width={70 * z} height={14} rx={4} fill="#2a2d33" />{Array.from({ length: 7 }, (_, j) => <rect key={j} x={97 + j * 10} y={116} width={5} height={22} fill="#c9a14a" opacity={j / 7 < z ? 1 : 0} />)}
            </svg>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink, marginTop: 10, whiteSpace: "nowrap", textShadow: extrude(5, "rgba(0,0,0,.7)") }}>NI {it.txt}</div>
          </div>); })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 66, color: COL.gold, textShadow: extrude(7, "#5a4316"), opacity: e(t, finalAt, finalAt + 0.2), transform: `scale(${0.8 + 0.2 * Math.min(1, spr(t, finalAt, 1))})` }}>{final}</div>
    </AbsoluteFill>
  );
};

// PAPELES: escrituras / actas / banco → "NO SE ESCONDEN" (tachado) → escudo "SE PROTEGEN"
export const Papeles: React.FC<{ t: number; at: number; protAt: number; out: number; x: number; y: number; docs: string[] }> = ({ t, at, protAt, out, x, y, docs }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const sh = pop(t, protAt, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
      <div style={{ position: "relative", width: 560, height: 360 }}>
        {docs.map((d, i) => { const k = pop(t, at + i * 0.2, 1); return (
          <div key={i} style={{ position: "absolute", left: 60 + i * 90, top: 30 + i * 40, width: 300, height: 220, background: "#fbf8ef", borderRadius: 6, boxShadow: "0 20px 40px rgba(0,0,0,.6)", transform: `rotate(${(i - 1) * 6}deg) scale(${0.5 + 0.5 * k})`, opacity: e(t, at + i * 0.2, at + i * 0.2 + 0.1), padding: 20, boxSizing: "border-box", fontFamily: FONT }}>
            <div style={{ fontWeight: 900, fontSize: 30, color: "#1d2733" }}>{d}</div>
            {Array.from({ length: 5 }, (_, j) => <div key={j} style={{ height: 8, borderRadius: 4, background: "rgba(29,39,51,.18)", margin: "14px 0", width: `${90 - j * 10}%` }} />)}
            <div style={{ position: "absolute", right: 20, bottom: 16, width: 60, height: 60, borderRadius: 30, border: "4px solid #b3261e", opacity: 0.6 }} />
          </div>); })}
        {t > protAt && <svg width={300} height={320} viewBox="0 0 300 310" style={{ position: "absolute", left: 130, top: 20, transform: `scale(${Math.min(1.05, sh)})`, filter: `drop-shadow(0 0 30px ${COL.green})` }}>
          <path d="M150 8 L270 48 C 270 170 230 250 150 300 C 70 250 30 170 30 48 Z" fill="rgba(46,160,90,.85)" stroke="#d9ffe6" strokeWidth={8} />
          <path d="M95 150 L 135 190 L 210 110" fill="none" stroke="#fff" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, whiteSpace: "nowrap", textShadow: extrude(6, "rgba(0,0,0,.75)") }}>
        <span style={{ color: "#bdb7aa", position: "relative", marginRight: 30 }}>SE ESCONDEN<span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 10, background: COL.red, transform: `scaleX(${e(t, protAt - 0.3, protAt)})`, transformOrigin: "0 50%" }} /></span>
        <span style={{ color: COL.green, opacity: e(t, protAt, protAt + 0.2) }}>SE PROTEGEN</span>
      </div>
    </div>
  );
};

// CASA vs BANCO: la barra del dinero se parte
export const CasaBanco: React.FC<{ t: number; at: number; out: number; rows: { at: number; txt: string; v: number; col: string; where: string }[] }> = ({ t, at, out, rows }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 960, top: 860, transform: "translate(-50%,-50%)", opacity: o, padding: "22px 30px", ...card("rgba(255,255,255,.15)") }}>
      <div style={{ display: "flex", width: 1300, height: 70, borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,.06)" }}>
        {rows.map((r, i) => { const w = ei(t, r.at, r.at + 0.6) * r.v; return <div key={i} style={{ width: `${w * 100}%`, background: r.col, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 28, color: "#111", whiteSpace: "nowrap", overflow: "hidden" }}>{r.txt}</div>; })}
      </div>
      <div style={{ display: "flex", marginTop: 10 }}>{rows.map((r, i) => <div key={i} style={{ width: `${r.v * 100}%`, textAlign: "center", fontWeight: 900, fontSize: 30, color: r.col, opacity: e(t, r.at + 0.4, r.at + 0.6) }}>{r.where}</div>)}</div>
    </div>
  );
};

// ================= m11 =================
// TAREA de la semana: 2 renglones que se tildan
export const Tarea: React.FC<{ t: number; at: number; out: number; items: { at: number; txt: string; ok: number }[]; title: string }> = ({ t, at, out, items, title }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9);
  return (
    <div style={{ position: "absolute", left: 1400, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k}) rotate(-2deg)`, width: 760, padding: "30px 40px", ...card(COL.gold + "99") }}>
      <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 6, color: COL.gold }}>{title}</div>
      {items.map((it, i) => { const ok = e(t, it.ok, it.ok + 0.3); return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 24, opacity: e(t, it.at, it.at + 0.15) }}>
          <svg width={70} height={70}><rect x={4} y={4} width={62} height={62} rx={10} fill="none" stroke={COL.ink} strokeWidth={5} /><path d="M16 36 L 30 52 L 58 18" fill="none" stroke={COL.green} strokeWidth={9} strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - ok)} /></svg>
          <div style={{ fontWeight: 900, fontSize: 48, color: COL.ink }}>{it.txt}</div>
        </div>); })}
    </div>
  );
};

// COMENTARIO: caja de comentarios que se escribe sola (sin link, sólo la pregunta)
export const Comentario: React.FC<{ t: number; at: number; out: number; q: string; a: string; aAt: number }> = ({ t, at, out, q, a, aAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), n = Math.floor(Math.max(0, t - aAt) * 18);
  return (
    <div style={{ position: "absolute", left: 1380, top: 470, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, width: 820, padding: "26px 32px", background: "#0f0f0f", borderRadius: 16, boxShadow: "0 30px 70px rgba(0,0,0,.7)", fontFamily: "Roboto, Arial, sans-serif" }}>
      <div style={{ color: "#f1f1f1", fontSize: 40, fontWeight: 700 }}>{q}</div>
      <div style={{ display: "flex", gap: 18, marginTop: 22, alignItems: "flex-start" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#6b4a2e", flexShrink: 0 }} />
        <div style={{ flex: 1, borderBottom: "2px solid #aaa", paddingBottom: 8, color: "#ddd", fontSize: 34, minHeight: 44 }}>{a.slice(0, n)}<span style={{ opacity: Math.sin(t * 10) > 0 ? 1 : 0 }}>|</span></div>
      </div>
    </div>
  );
};

// PRÓXIMO VIDEO: teléfono que suena y se cuelga a los 3 segundos
export const Proximo: React.FC<{ t: number; at: number; out: number; hangAt: number; title: string; sub: string }> = ({ t, at, out, hangAt, title, sub }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8), ring = t < hangAt ? Math.sin(t * 40) * 8 : 0, hung = e(t, hangAt, hangAt + 0.3);
  const secs = Math.min(3, Math.max(0, (t - at - 0.3) / Math.max(0.5, hangAt - at - 0.3) * 3));
  return (
    <div style={{ position: "absolute", left: 1300, top: 520, opacity: o, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * k})`, textAlign: "center" }}>
      <div style={{ display: "inline-block", width: 300, height: 560, borderRadius: 44, background: "#141518", boxShadow: "0 40px 80px rgba(0,0,0,.75), inset 0 0 0 8px #2a2c31", transform: `rotate(${ring}deg)`, padding: 30, boxSizing: "border-box", fontFamily: FONT, color: "#fff" }}>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#aaa", marginTop: 40 }}>LLAMADA ENTRANTE</div>
        <div style={{ fontSize: 40, fontWeight: 900, marginTop: 14 }}>NÚMERO<br />DESCONOCIDO</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 64, fontWeight: 900, color: hung > 0.5 ? COL.red : COL.ink, marginTop: 40 }}>0:0{Math.floor(secs)}</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}><div style={{ width: 110, height: 110, borderRadius: 55, background: COL.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, transform: `scale(${1 + 0.2 * hung})`, boxShadow: `0 0 ${40 * hung}px ${COL.red}` }}>📵</div></div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.ink, marginTop: 24, whiteSpace: "nowrap", textShadow: extrude(6, "rgba(0,0,0,.75)") }}>{title}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: COL.gold, whiteSpace: "nowrap", opacity: e(t, at + 1.5, at + 1.8) }}>{sub}</div>
    </div>
  );
};

// la FRASE del comandante, grande, palabra por palabra (cierre)
export const Frase: React.FC<{ t: number; out: number; words: { at: number; w: string; hl?: boolean }[]; y?: number; size?: number }> = ({ t, out, words, y = 860, size = 74 }) => {
  const o = op(t, words[0].at, out); if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, transform: "translateY(-50%)", textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.1 }}>
      {words.map((w, i) => { const k = Math.min(1, spr(t, w.at, 1.2)); return <span key={i} style={{ display: "inline-block", marginRight: size * 0.28, opacity: e(t, w.at, w.at + 0.08), transform: `translateY(${(1 - k) * 40}px)`, color: w.hl ? COL.gold : COL.ink, textShadow: extrude(7, w.hl ? "#5a4316" : "rgba(0,0,0,.75)") }}>{w.w}</span>; })}
    </div>
  );
};

// foto chica de papel (cuando hace falta citar una toma sin cambiar la base)
export const Polaroid: React.FC<{ t: number; at: number; out: number; id: string; x: number; y: number; w: number; h: number; rot?: number; cap?: string }> = ({ t, at, out, id, x, y, w, h, rot = 5, cap }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot + (1 - Math.min(1, k)) * 30}deg) scale(${0.5 + 0.5 * k})`, background: "#fbf8ef", padding: "16px 16px 60px", boxShadow: "0 30px 60px rgba(0,0,0,.7)" }}>
      <Img src={staticFile(P + id + ".jpg")} style={{ width: w, height: h, objectFit: "cover", display: "block" }} />
      {cap && <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontFamily: HAND, fontSize: 34, color: "#1d2733" }}>{cap}</div>}
    </div>
  );
};

// PREGUNTA para comentar (CTA sin guía): hoja de la libreta del comandante, la pregunta se escribe a mano y baja una flecha a los comentarios
export const Pregunta: React.FC<{ t: number; at: number; out: number; pre: string; q: string; hl: string; qAt: number; x?: number; y?: number }> = ({ t, at, out, pre, q, hl, qAt, x = 1340, y = 560 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = pop(t, at, 0.9), n = Math.floor(Math.max(0, t - qAt) * 26), shown = q.slice(0, n), i = q.indexOf(hl);
  const parts = i < 0 || n <= i ? [shown, "", ""] : [q.slice(0, i), shown.slice(i, i + hl.length), shown.slice(i + hl.length)];
  const arrow = e(t, qAt + q.length / 26, qAt + q.length / 26 + 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${-3 + (1 - Math.min(1, k)) * 12}deg) scale(${0.6 + 0.4 * k})` }}>
      <div style={{ width: 760, padding: "40px 46px 50px", background: "repeating-linear-gradient(#fbf8f0 0 58px, #b9cbe0 58px 60px)", borderRadius: 8, boxShadow: "0 40px 90px rgba(0,0,0,.7)", borderLeft: "6px solid #e07a6a", fontFamily: HAND, color: "#1d2a44" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 5, color: COL.red }}>{pre}</div>
        <div style={{ fontSize: 66, lineHeight: 1.12, marginTop: 14, minHeight: 230 }}>
          {parts[0]}<span style={{ background: parts[1] ? "rgba(255,210,58,.55)" : undefined }}>{parts[1]}</span>{parts[2]}
          <span style={{ opacity: n < q.length && Math.sin(t * 10) > 0 ? 1 : 0 }}>|</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "100%", transform: `translate(-50%, ${20 + arrow * 40}px)`, opacity: arrow, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(5, "rgba(0,0,0,.75)") }}>
        ESCRÍBAMELO EN LOS COMENTARIOS ↓
      </div>
    </div>
  );
};
