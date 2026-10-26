import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, ent, prog, fontFamily } from "./kit";
import { T, V } from "./kit3";

// Capas de pantalla de soot08 (encima del mundo): contador, sello, tachado, tilde, carretes de los 7 horrores,
// barra del día, lista con tildes y globo de diálogo. Todas entran con rebote y se pueden sacar con t1.
const sale = (t: number, t1: number) => interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Cuenta: React.FC<{ t: number; t0: number; t1: number; de: number; a: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string; fuera?: number; sep?: boolean }> = ({ t, t0, t1, de, a, x, y, size = 150, color = "#fff", pre = "", suf = "", fuera = 1e9, sep }) => {
  if (t < t0 || t > fuera + 0.25) return null;
  const v = Math.round(de + (a - de) * prog(t, t0, t1));
  const txt = sep ? v.toLocaleString("en-US") : String(v);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${ent(t, t0) * sale(t, fuera)})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px ${T}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 ${size * 0.06}px 0 ${T}` }}>{pre}{txt}{suf}</div>;
};

// sello de goma que cae girando (FINED, LEGAL, BANNED…)
export const Sello: React.FC<{ t: number; t0: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number; t1?: number }> = ({ t, t0, text, x, y, size = 130, color = C.rojo, rot = -10, t1 = 1e9 }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const k = t - t0;
  const s = k < 0.12 ? 2.4 - (k / 0.12) * 1.4 : 1 + Math.sin((k - 0.12) * 30) * 0.05 * Math.exp(-(k - 0.12) * 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s * sale(t, t1)})`, opacity: Math.min(1, k * 10), fontFamily, fontWeight: 700, fontSize: size, color, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.18, padding: `${size * 0.02}px ${size * 0.3}px`, letterSpacing: size * 0.06, background: "rgba(27,18,64,.82)", boxShadow: "10px 12px 0 rgba(20,8,40,.4)", whiteSpace: "nowrap", lineHeight: 1.1 }}>
      {text}
    </div>
  );
};

export const Tachado: React.FC<{ t: number; t0: number; x: number; y: number; w?: number; h?: number; t1?: number }> = ({ t, t0, x, y, w = 600, h = 400, t1 = 1e9 }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  return (
    <svg style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible", opacity: sale(t, t1) }} width={w} height={h}>
      <path d={`M 20 20 L ${w - 20} ${h - 20} M ${w - 20} 20 L 20 ${h - 20}`} stroke={C.rojo} strokeWidth={Math.min(w, h) / 9} strokeLinecap="round" strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - prog(t, t0, t0 + 0.25))} />
    </svg>
  );
};
export const Tilde: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; t1?: number }> = ({ t, t0, x, y, s = 1, t1 = 1e9 }) => (t < t0 || t > t1 + 0.25 ? null : (
  <svg style={{ position: "absolute", left: x - 60 * s, top: y - 60 * s, overflow: "visible", opacity: sale(t, t1) }} width={120 * s} height={120 * s} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={56 * ent(t, t0)} fill={C.lima} />
    <path d="M 30 62 L 52 84 L 92 40" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - prog(t, t0 + 0.1, t0 + 0.35))} />
  </svg>
));

// ── los 7 carretes (horrores): cada uno se llena de hilo rojo; el actual late
export const Carretes: React.FC<{ t: number; t0: number; n: number; x?: number; y?: number; s?: number; t1?: number; llena?: number }> = ({ t, t0, n, x = 960, y = 900, s = 1, t1 = 1e9, llena }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s * sale(t, t1)})` }}>
      <svg width={7 * 120} height={180} viewBox={`0 0 ${7 * 120} 180`} style={{ overflow: "visible" }}>
        {Array.from({ length: 7 }, (_, i) => {
          const e = ent(t, t0, i * 0.07, { damping: 9, stiffness: 200 });
          const act = i === n - 1;
          const f = i < n - 1 ? 1 : act ? (llena !== undefined ? prog(t, llena, llena + 0.8) : 1) : 0;
          return (
            <g key={i} transform={`translate(${60 + i * 120} 90) scale(${e * (act ? 1.12 + 0.06 * Math.sin(t * 8) : 1)})`}>
              <rect x={-44} y={-74} width={88} height={20} rx={8} fill={V.madera} />
              <rect x={-44} y={54} width={88} height={20} rx={8} fill={V.madera} />
              <rect x={-14} y={-56} width={28} height={112} fill="#e3d9c4" />
              <rect x={-36 * Math.max(0.4, f)} y={-56} width={72 * Math.max(0.4, f)} height={112} rx={10} fill={i < n ? C.rojo : "rgba(255,255,255,.25)"} opacity={i < n ? 1 : 1} />
              {i < n && Array.from({ length: 6 }, (_, k) => <line key={k} x1={-34 * f} y1={-46 + k * 18} x2={34 * f} y2={-40 + k * 18} stroke="#a81d2e" strokeWidth={4} />)}
              <text x={0} y={120} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#fff" stroke={T} strokeWidth={7} paintOrder="stroke">{i + 1}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ── cartel esmaltado del horror: «HORROR #3» + nombre, entra de costado con golpe
export const Horror: React.FC<{ t: number; t0: number; n: number; nombre: string; t1?: number }> = ({ t, t0, n, nombre, t1 = t0 + 2.6 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 160 });
  const e2 = ent(t, t0 + 0.35, 0, { damping: 9, stiffness: 190 });
  const fondo = prog(t, t0, t0 + 0.15) * (1 - prog(t, t1, t1 + 0.3));
  return (
    <>
      {/* tarjeta a pantalla limpia: el mundo de atrás se apaga y salen rayos rojos */}
      <AbsoluteFill style={{ opacity: fondo, background: "radial-gradient(circle at 50% 45%, #6e1a2a 0%, #2a0f2e 55%, #160a22 100%)" }} />
      <AbsoluteFill style={{ opacity: fondo * 0.35, background: `repeating-conic-gradient(from ${t * 12}deg at 50% 45%, rgba(255,90,90,.5) 0deg 6deg, transparent 6deg 20deg)` }} />
      <div style={{ position: "absolute", left: 960, top: 390, transform: `translate(-50%,-50%) translateX(${(1 - e) * -1400}px) rotate(${(1 - e) * -12 - 2}deg) scale(${sale(t, t1)})`, background: C.rojo, border: "10px solid #fff3d6", borderRadius: 26, padding: "10px 60px", boxShadow: "14px 16px 0 rgba(20,8,40,.45)", fontFamily, fontWeight: 700, fontSize: 92, color: "#fff3d6", letterSpacing: 8, whiteSpace: "nowrap" }}>
        HORROR #{n}
      </div>
      <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) scale(${e2 * sale(t, t1)})`, fontFamily, fontWeight: 700, fontSize: 170, color: C.crema, WebkitTextStroke: `16px ${T}`, paintOrder: "stroke fill", whiteSpace: "nowrap", textShadow: `0 12px 0 ${T}` }}>
        {nombre}
      </div>
      <Carretes t={t} t0={t0 + 0.2} n={n} y={800} s={0.9} t1={t1} llena={t0 + 0.6} />
    </>
  );
};

// ── barra de un día (0-24 h) con tramos pintados y marcas de hora
export const BarraDia: React.FC<{ t: number; t0: number; x?: number; y?: number; w?: number; tramos: { de: number; a: number; t0: number; t1: number; color: string; txt?: string }[]; t1?: number; titulo?: string }> = ({ t, t0, x = 960, y = 860, w = 1600, tramos, t1 = 1e9, titulo }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const e = ent(t, t0);
  const px = (h: number) => (h / 24) * w;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 60, width: w, height: 120, transform: `scaleX(${e}) scaleY(${sale(t, t1)})` }}>
      {titulo && <div style={{ position: "absolute", top: -78, left: 0, fontFamily, fontWeight: 700, fontSize: 48, color: "#fff", WebkitTextStroke: `7px ${T}`, paintOrder: "stroke fill" }}>{titulo}</div>}
      <div style={{ position: "absolute", inset: 0, background: "#20183a", borderRadius: 20, border: "6px solid #fff" }} />
      {tramos.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: px(r.de), top: 10, height: 100, width: px(r.a - r.de) * prog(t, r.t0, r.t1), background: r.color, borderRadius: 12, overflow: "hidden", fontFamily, fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: "100px", textAlign: "center", whiteSpace: "nowrap" }}>{r.txt}</div>
      ))}
      {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => <div key={h} style={{ position: "absolute", left: px(h) - 40, top: 128, width: 80, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 38, color: "#fff", WebkitTextStroke: `6px ${T}`, paintOrder: "stroke fill" }}>{h === 24 ? "" : `${h % 12 || 12}${h < 12 ? "a" : "p"}`}</div>)}
    </div>
  );
};

// ── lista con tildes (renglones que entran)
export const Lista: React.FC<{ t: number; t0: number; x: number; y: number; items: { txt: string; t0: number; ok?: boolean }[]; t1?: number; size?: number; titulo?: string; color?: string; previa?: boolean }> = ({ t, t0, x, y, items, t1 = 1e9, size = 56, titulo, previa, color = C.violeta }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${e * sale(t, t1)})`, transformOrigin: "0 0", background: "rgba(27,18,64,.88)", borderRadius: 28, padding: "26px 44px 18px", boxShadow: "12px 14px 0 rgba(10,5,30,.45)", border: `6px solid ${color}` }}>
      {titulo && <div style={{ fontFamily, fontWeight: 700, fontSize: size * 0.8, color: C.ambar, marginBottom: 12, letterSpacing: 3 }}>{titulo}</div>}
      {items.map((it, i) => {
        if (t < it.t0) return previa
          ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: size * 1.35, fontFamily, fontWeight: 700, fontSize: size, color: "#fff", opacity: 0.32, whiteSpace: "nowrap" }}><span style={{ display: "inline-block", width: size * 0.9 - 10, height: size * 0.9 - 10, borderRadius: size * 0.45, border: "5px solid #fff" }} />{it.txt}</div>
          : <div key={i} style={{ height: size * 1.35 }} />;
        const a = ent(t, it.t0);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: size * 1.35, fontFamily, fontWeight: 700, fontSize: size, color: "#fff", transform: `translateX(${(1 - a) * -80}px)`, opacity: a, whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", width: size * 0.9, height: size * 0.9, borderRadius: size * 0.45, background: it.ok === false ? C.rojo : C.lima, color: "#fff", textAlign: "center", lineHeight: `${size * 0.9}px`, fontSize: size * 0.62 }}>{it.ok === false ? "✕" : "✓"}</span>
            {it.txt}
          </div>
        );
      })}
    </div>
  );
};

// ── globo de diálogo (testigos, cartas, citas)
export const Globo: React.FC<{ t: number; t0: number; x: number; y: number; text: string; t1?: number; size?: number; cola?: "izq" | "der"; w?: number }> = ({ t, t0, x, y, text, t1 = 1e9, size = 50, cola = "izq", w = 760 }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 200 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translate(-50%,-100%) scale(${e * sale(t, t1)})`, transformOrigin: cola === "izq" ? "15% 100%" : "85% 100%" }}>
      <div style={{ background: "#fff", borderRadius: 34, padding: "22px 34px", fontFamily, fontWeight: 600, fontSize: size, color: T, border: `6px solid ${T}`, lineHeight: 1.18, textAlign: "center" }}>{text}</div>
      <svg width={80} height={60} style={{ position: "absolute", bottom: -50, left: cola === "izq" ? 90 : w - 170 }}><path d="M 0 0 L 70 0 L 10 54 Z" fill="#fff" stroke={T} strokeWidth={6} /><rect x={4} y={-6} width={62} height={10} fill="#fff" /></svg>
    </div>
  );
};

// ── viñeta oscura de lectura (para que el texto se lea sobre mundos cargados), NO es filtro: es un velo plano
export const Velo: React.FC<{ t: number; t0: number; t1: number; op?: number }> = ({ t, t0, t1, op = 0.45 }) => {
  const a = prog(t, t0, t0 + 0.3) * (1 - prog(t, t1, t1 + 0.3));
  return a > 0 ? <div style={{ position: "absolute", inset: 0, background: "#140c2e", opacity: a * op }} /> : null;
};
// destello blanco en golpes (dura 0,15 s)
export const Flash: React.FC<{ t: number; at: number[]; color?: string }> = ({ t, at, color = "#fff" }) => {
  const a = at.reduce((m, g) => Math.max(m, t >= g ? Math.exp(-(t - g) * 14) : 0), 0);
  return a > 0.02 ? <div style={{ position: "absolute", inset: 0, background: color, opacity: a * 0.7, pointerEvents: "none" }} /> : null;
};
// sacudón de pantalla (envuelve todo) — decae rápido
export const sacudon = (t: number, at: number[], k = 18) => {
  const a = at.reduce((m, g) => m + (t >= g ? Math.exp(-(t - g) * 9) : 0), 0);
  return { x: Math.sin(t * 90) * k * a, y: Math.cos(t * 77) * k * a * 0.7 };
};

// texto grande con contorno y SALIDA (el Grande del kit no se va nunca)
export const Gran: React.FC<{ t: number; t0: number; t1: number; text: string; x?: number; y: number; size?: number; color?: string; borde?: string; rot?: number }> = ({ t, t0, t1, text, x = 960, y, size = 150, color = C.crema, borde = T, rot = 0 }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const s = ent(t, t0, 0, { damping: 9, stiffness: 190 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s * sale(t, t1)}) rotate(${rot}deg)`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 2, textShadow: `0 ${size * 0.07}px 0 ${borde}` }}>
      {text}
    </div>
  );
};

// latigazo de cámara entre dos lugares del mundo: estelas horizontales + barrido de color (0,32 s alrededor de tc)
export const Latigo: React.FC<{ t: number; at: number[]; color?: string; vertical?: boolean }> = ({ t, at, color = "#fff3d6", vertical }) => {
  const tc = at.find((g) => t > g - 0.2 && t < g + 0.2);
  if (tc === undefined) return null;
  const k = (t - tc + 0.2) / 0.4; // 0..1
  const a = Math.sin(k * Math.PI);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <rect width={1920} height={1080} fill="#1b1240" opacity={a * 0.55} />
      {Array.from({ length: 26 }, (_, i) => {
        const p = ((i * 97) % 1080);
        const L = 400 + ((i * 53) % 700);
        const x = (k * 3200 - 900 + ((i * 211) % 600)) % 3000 - 500;
        return vertical
          ? <rect key={i} x={(i * 77) % 1920} y={-x} width={10 + (i % 3) * 8} height={L} rx={6} fill={i % 4 ? color : C.ambar} opacity={a * 0.75} />
          : <rect key={i} x={x} y={p} width={L} height={10 + (i % 3) * 8} rx={6} fill={i % 4 ? color : C.ambar} opacity={a * 0.75} />;
      })}
    </svg>
  );
};

// semana de trabajo: 6 días rojos + domingo que se da vuelta
export const Semana: React.FC<{ t: number; t0: number; tDom?: number; t1?: number; y?: number }> = ({ t, t0, tDom = 1e9, t1 = 1e9, y = 860 }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const D = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return (
    <div style={{ position: "absolute", left: 960, top: y, transform: `translate(-50%,-50%) scale(${sale(t, t1)})`, display: "flex", gap: 16 }}>
      {D.map((d, i) => {
        const e = ent(t, t0, i * 0.09, { damping: 9, stiffness: 200 });
        const dom = i === 6;
        const giro = dom ? prog(t, tDom, tDom + 0.3) : 0;
        const sx = Math.abs(Math.cos(giro * Math.PI));
        const lim = dom && giro > 0.5;
        return (
          <div key={d} style={{ width: 190, height: 190, borderRadius: 26, transform: `scale(${e}) scaleX(${dom ? Math.max(0.05, sx) : 1})`, background: dom ? (lim ? C.naranja : C.lima) : C.rojo, border: "8px solid #fff", fontFamily, fontWeight: 700, color: "#fff", textAlign: "center", boxShadow: "8px 10px 0 rgba(20,8,40,.4)" }}>
            <div style={{ fontSize: 50, marginTop: 22 }}>{d}</div>
            <div style={{ fontSize: dom ? 30 : 38, marginTop: 14 }}>{dom ? (lim ? "CLEANING" : "OFF") : "WORK"}</div>
          </div>
        );
      })}
    </div>
  );
};
