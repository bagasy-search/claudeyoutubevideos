import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd, clamp } from "../soot/lib";
import { C, fontFamily, ent } from "./kit";
import { Persona, Ropa, CIVIL, Expr } from "./persona";
import { SUELO } from "./mundo";

// Actores y gráficos de pantalla de soot11.
export const FRANZ: Ropa = { tunica: "#7a1f3d", tunica2: "#4a0f26", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2414" };
export const HEINRICH: Ropa = { tunica: "#5c8f3e", tunica2: "#3a6224", cinto: "#5a3418", piel: "#e9a77e", piel2: "#c98660", pelo: "#6a4a2a" };
type FP = Omit<React.ComponentProps<typeof Persona>, "ropa">;
// Franz, el verdugo: gorro granate con pluma, barba, capa negra. Siempre igual: el espectador lo reconoce en todo plano.
export const Franz: React.FC<FP & { viejoF?: boolean }> = ({ viejoF, ...p }) => (
  <Persona h={300} seed={7} gorro="verdugo" barba={viejoF ? "#d8d2cc" : "#3a2414"} capa="#2b0a14" ropa={FRANZ} viejo={viejoF} {...p} />
);
// multitud: n personas en fila con ropa, gorro y expresión sorteados; `mira` = hacia dónde miran; `aleja` = se apartan
const GORROS = [undefined, "campesino", "toca", undefined, "noble", undefined, "toca", "campesino"] as const;
export const Gente: React.FC<{ t: number; x0: number; x1: number; n: number; y?: number; h?: number; seed?: number; expr?: Expr | ((i: number) => Expr); mira?: number; flipDe?: number; aleja?: { desde: number; dx: number; t0: number }; habla?: boolean; salta?: number; brazos?: number }> = ({ t, x0, x1, n, y = SUELO - 10, h = 270, seed = 1, expr = "neutro", mira = 0, flipDe, aleja, habla, salta, brazos }) => {
  const r = rnd(seed * 13 + 1);
  const ps = Array.from({ length: n }, (_, i) => ({ x: x0 + ((x1 - x0) * (i + 0.5)) / n + (r() - 0.5) * 30, dy: (r() - 0.5) * 16, dh: r() * 40 - 20, g: GORROS[Math.floor(r() * GORROS.length)], s: Math.floor(r() * 50) }));
  return (
    <>
      {ps.map((p, i) => {
        const huye = aleja ? interpolate(t, [aleja.t0 + i * 0.04, aleja.t0 + 0.5 + i * 0.04], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
        const dx = aleja ? huye * aleja.dx * Math.sign(p.x - aleja.desde || 1) : 0;
        return (
          <Persona key={i} x={p.x + dx} y={y + p.dy} h={h + p.dh} t={t} seed={seed * 100 + p.s + i} ropa={CIVIL(p.s + i)} gorro={p.g as never}
            expr={typeof expr === "function" ? expr(i) : expr} mira={mira} flip={flipDe !== undefined ? p.x > flipDe : false} habla={habla && i % 2 === 0}
            salta={salta !== undefined ? salta + i * 0.05 : undefined} bD={brazos} bI={brazos} inclina={huye * -8 * Math.sign(p.x - (aleja?.desde ?? 0))} />
        );
      })}
    </>
  );
};

// ── gráficos de pantalla
// cartel colgante de taberna que baja balanceándose: "TRAP 1 · YOU DON'T APPLY"
export const CartelTrampa: React.FC<{ t: number; t0: number; t1: number; n: number; titulo: string; color?: string }> = ({ t, t0, t1, n, titulo, color = C.rojo }) => {
  if (t < t0 || t > t1 + 0.5) return null;
  const lt = t - t0;
  const baja = interpolate(lt, [0, 0.45], [-700, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const sube = interpolate(t, [t1, t1 + 0.45], [0, -800], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const bal = Math.sin(lt * 4.2) * 9 * Math.exp(-lt * 1.1);
  return (
    <div style={{ position: "absolute", left: 960, top: 0, transform: `translateY(${baja + sube}px) rotate(${bal}deg) scale(0.74)`, transformOrigin: "0 0" }}>
      <svg style={{ position: "absolute", left: -520, top: -60, overflow: "visible" }} width={1040} height={560}>
        <line x1={300} y1={0} x2={330} y2={170} stroke="#3b2a1a" strokeWidth={10} />
        <line x1={740} y1={0} x2={710} y2={170} stroke="#3b2a1a" strokeWidth={10} />
        <rect x={110} y={160} width={820} height={330} rx={36} fill="#5a3418" />
        <rect x={130} y={176} width={780} height={296} rx={28} fill="#8a5a2a" />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={140} y1={226 + i * 66} x2={900} y2={232 + i * 66} stroke="#7a4a20" strokeWidth={6} />)}
        <circle cx={330} cy={176} r={12} fill="#c8ccd4" /><circle cx={710} cy={176} r={12} fill="#c8ccd4" />
        <rect x={360} y={126} width={320} height={96} rx={48} fill={color} stroke="#fff" strokeWidth={7} />
        <text x={520} y={192} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={58} fill="#fff">TRAP {n}</text>
        <text x={520} y={360} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={titulo.length > 16 ? 72 : 88} fill={C.crema} stroke="#3b1a08" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round">{titulo}</text>
        <text x={520} y={440} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} fontSize={34} fill="#f7c548">{Array.from({ length: 7 }, (_, i) => (i < n ? "●" : "○")).join("  ")}</text>
      </svg>
    </div>
  );
};
// contador fijo de apretones de mano (la broma que vuelve en todo el video)
export const HUD: React.FC<{ t: number; t0: number; t1: number; valor: number; tGolpe?: number; x?: number; y?: number }> = ({ t, t0, t1, valor, tGolpe = -9, x = 1860, y = 50 }) => {
  if (t < t0 || t > t1 + 0.4) return null;
  const e = ent(t, t0, 0, { damping: 12, stiffness: 160 }) * interpolate(t, [t1, t1 + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g = t > tGolpe ? 1 + 0.35 * Math.exp(-(t - tGolpe) * 6) * Math.abs(Math.cos((t - tGolpe) * 12)) : 1;
  return (
    <div style={{ position: "absolute", right: 1920 - x, top: y, transform: `scale(${e * g * 0.78})`, transformOrigin: "100% 0", display: "flex", alignItems: "center", gap: 14, background: "rgba(27,18,64,.88)", padding: "10px 22px 10px 14px", borderRadius: 24, boxShadow: "0 8px 0 rgba(10,5,30,.4)", fontFamily, fontWeight: 700 }}>
      <svg width={84} height={84} viewBox="-32 -32 64 64"><path d="M -26 6 L -6 -12 L 10 -6 L 26 -18 M -26 6 L -8 20 L 6 10 M 0 14 L 12 4 M 6 20 L 16 10" stroke="#fff3d6" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{ color: "#fff3d6", fontSize: 36, lineHeight: 1 }}>HANDSHAKES<div style={{ fontSize: 70, color: valor > 0 ? C.lima : C.rojo }}>{valor}</div></div>
    </div>
  );
};
// sello que golpea en pantalla
export const Sello: React.FC<{ t: number; t0: number; t1?: number; text: string; x: number; y: number; color?: string; rot?: number; size?: number }> = ({ t, t0, t1 = 1e9, text, x, y, color = C.rojo, rot = -12, size = 90 }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const s = interpolate(t, [t0, t0 + 0.12], [2.6, 1], { extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const o = interpolate(t, [t0, t0 + 0.08], [0, 1], { extrapolateRight: "clamp" }) * interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, border: `${size * 0.09}px solid ${color}`, color, borderRadius: size * 0.2, padding: `${size * 0.05}px ${size * 0.3}px`, fontFamily, fontWeight: 700, fontSize: size, letterSpacing: 4, whiteSpace: "nowrap", background: "rgba(255,243,214,.55)" }}>{text}</div>
  );
};
// barras comparativas (crecen)
export const Barras: React.FC<{ t: number; t0: number; t1?: number; items: { label: string; v: number; color: string; t0?: number }[]; x: number; y: number; alto?: number; ancho?: number; max?: number }> = ({ t, t0, t1 = 1e9, items, x, y, alto = 420, ancho = 140, max }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const M = max ?? Math.max(...items.map((i) => i.v));
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${ent(t, t0) * out})`, transformOrigin: "50% 100%", display: "flex", alignItems: "flex-end", gap: 36, background: "rgba(27,18,64,.85)", padding: "30px 40px 20px", borderRadius: 30 }}>
      {items.map((it, i) => {
        const u = clamp((t - (it.t0 ?? t0 + 0.2 + i * 0.25)) / 0.6, 0, 1);
        const e = 1 - Math.pow(1 - u, 3);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily, fontWeight: 700 }}>
            <div style={{ width: ancho, height: (alto * it.v * e) / M, background: it.color, borderRadius: 16, boxShadow: "inset 0 -10px 0 rgba(0,0,0,.18)" }} />
            <div style={{ color: "#fff3d6", fontSize: 44, whiteSpace: "nowrap" }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};
// número que cuenta
export const Cuenta: React.FC<{ t: number; t0: number; t1?: number; de: number; a: number; dur?: number; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string }> = ({ t, t0, t1 = 1e9, de, a, dur = 1.2, x, y, size = 200, color = C.crema, pre = "", suf = "" }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const u = clamp((t - t0) / dur, 0, 1);
  const v = Math.round(de + (a - de) * (1 - Math.pow(1 - u, 3)));
  const s = ent(t, t0, 0, { damping: 10, stiffness: 190 }) * interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px ${C.noche}`, paintOrder: "stroke fill", textShadow: `0 ${size * 0.06}px 0 ${C.noche}`, whiteSpace: "nowrap" }}>
      {pre}{v.toLocaleString("en-US")}{suf}
    </div>
  );
};
// globo de diálogo (en pantalla)
export const Globo: React.FC<{ t: number; t0: number; t1: number; text: string; x: number; y: number; size?: number; cola?: "izq" | "der"; color?: string; tinta?: string }> = ({ t, t0, t1, text, x, y, size = 54, cola = "izq", color = "#fff", tinta = C.noche }) => {
  if (t < t0 || t > t1 + 0.2) return null;
  const s = ent(t, t0, 0, { damping: 10, stiffness: 220 }) * interpolate(t, [t1, t1 + 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: cola === "izq" ? "10% 100%" : "90% 100%" }}>
      <div style={{ position: "relative", background: color, color: tinta, fontFamily, fontWeight: 700, fontSize: size, padding: `${size * 0.25}px ${size * 0.5}px`, borderRadius: size * 0.6, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(20,10,50,.3)" }}>
        {text}
        <div style={{ position: "absolute", bottom: -size * 0.4, [cola === "izq" ? "left" : "right"]: size * 0.7, width: 0, height: 0, borderLeft: `${size * 0.3}px solid transparent`, borderRight: `${size * 0.3}px solid transparent`, borderTop: `${size * 0.45}px solid ${color}` }} />
      </div>
    </div>
  );
};
// tachar en pantalla (línea roja que se dibuja)
export const Tacha: React.FC<{ t: number; t0: number; x: number; y: number; w: number; rot?: number; g?: number }> = ({ t, t0, x, y, w, rot = -8, g = 16 }) => {
  if (t < t0) return null;
  const u = clamp((t - t0) / 0.25, 0, 1);
  return <div style={{ position: "absolute", left: x - w / 2, top: y - g / 2, width: w * u, height: g, background: C.rojo, borderRadius: g / 2, transform: `rotate(${rot}deg)`, transformOrigin: `${w / 2}px 50%`, boxShadow: "0 4px 0 rgba(0,0,0,.25)" }} />;
};
export const vig = (t: number, a: number, b: number) => t >= a && t < b;
// globito EN el mundo (sigue a la cámara): texto corto sobre una cabeza
export const BurbujaM: React.FC<{ t: number; t0: number; t1: number; x: number; y: number; text: string; size?: number; color?: string; tinta?: string }> = ({ t, t0, t1, x, y, text, size = 40, color = "#fff", tinta = C.noche }) => {
  if (t < t0 || t > t1 + 0.2) return null;
  const s = ent(t, t0, 0, { damping: 10, stiffness: 220 }) * interpolate(t, [t1, t1 + 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = text.length * size * 0.62 + size * 0.9;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-w / 2} y={-size * 1.5} width={w} height={size * 1.4} rx={size * 0.6} fill={color} />
        <path d={`M -10 -4 L 0 ${size * 0.4} L 14 -4 Z`} transform={`translate(0 ${-size * 0.12})`} fill={color} />
        <text x={0} y={-size * 0.5} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={tinta}>{text}</text>
      </g>
    </svg>
  );
};
// pin numerado del mapa del viaje (en el mundo)
export const Pin: React.FC<{ t: number; t0: number; x: number; y: number; n: number; s?: number; color?: string; label?: string }> = ({ t, t0, x, y, n, s = 1, color = C.rojo, label }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 9, stiffness: 200 });
  const cae = interpolate(t, [t0, t0 + 0.25], [-600, 0], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
      <g transform={`translate(${x} ${y + cae * s}) scale(${s * e})`}>
        <ellipse cx={0} cy={6} rx={70} ry={20} fill="rgba(20,10,40,.35)" />
        <path d="M 0 0 Q -120 -170 -120 -260 A 120 120 0 1 1 120 -260 Q 120 -170 0 0 Z" fill={color} stroke="#fff" strokeWidth={16} />
        <circle cx={0} cy={-262} r={84} fill="#fff" />
        <text x={0} y={-222} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={120} fill={color}>{n}</text>
        {label && <text x={0} y={-420} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={90} fill="#fff" stroke={C.noche} strokeWidth={16} paintOrder="stroke">{label}</text>}
      </g>
    </svg>
  );
};
// título grande con contorno que entra con resorte y SALE (t1)
export const Titulo: React.FC<{ t: number; t0: number; t1: number; text: string; x?: number; y: number; size?: number; color?: string; borde?: string; rot?: number }> = ({ t, t0, t1, text, x = 960, y, size = 150, color = C.crema, borde = C.noche, rot = 0 }) => {
  if (t < t0 || t > t1 + 0.02) return null;
  const s = ent(t, t0, 0, { damping: 9, stiffness: 190 }) * interpolate(t, [t1 - 0.12, t1 + 0.02], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${borde}`, paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 2, textShadow: `0 ${size * 0.07}px 0 ${borde}`, textAlign: "center", lineHeight: 1.05 }}>
      {text}
    </div>
  );
};
