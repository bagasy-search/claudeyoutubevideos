import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, fontFamily, Grande, Chip } from "./kit";
import { PARADAS, gy } from "./mundo";

// Piezas de pantalla compartidas por todas las partes de soot12.
// Texto grande con salida (Grande no tiene t1)
export const G: React.FC<{ t: number; t0: number; t1?: number; text: string; x?: number; y: number; size?: number; color?: string; borde?: string }> = ({ t1 = 1e9, ...p }) =>
  p.t < p.t0 || p.t > t1 ? null : <Grande {...p} />;
export const Ch: typeof Chip = Chip;

// cartel de trampa: «TRAP #n» + nombre + las 7 bolitas
export const Cartel: React.FC<{ t: number; t0: number; t1: number; n: number; nombre: string }> = ({ t, t0, t1, n, nombre }) => {
  if (t < t0 || t > t1) return null;
  const e = ent(t, t0, 0, { damping: 12, stiffness: 160 });
  const out = interpolate(t, [t1 - 0.3, t1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 960, top: 300, transform: `translate(-50%,-50%) scale(${e * out}) rotate(${(1 - e) * -10}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 64, color: C.noche, background: C.ambar, padding: "6px 34px", borderRadius: 18, letterSpacing: 4, boxShadow: "0 8px 0 rgba(10,5,30,.5)" }}>TRAP #{n}</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 150, color: C.crema, WebkitTextStroke: `13px ${C.noche}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${C.noche}`, marginTop: 6, whiteSpace: "nowrap" }}>{nombre}</div>
        <div style={{ display: "flex", gap: 22, marginTop: 18 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ width: 46, height: 46, borderRadius: 23, border: "6px solid #fff", background: i < n ? C.rojo : "rgba(255,255,255,.15)", transform: `scale(${ent(t, t0, 0.15 + i * 0.05) * (i === n - 1 ? 1 + 0.2 * Math.sin(t * 9) : 1)})`, boxShadow: i === n - 1 ? `0 0 30px ${C.rojo}` : undefined }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// la ruta del ataque dibujada SOBRE el mundo (va como hijo de <Mundo>, en coordenadas de mundo)
export const Ruta: React.FC<{ t: number; t0: number; dur?: number; hasta?: number; activa?: number; escala?: number }> = ({ t, t0, dur = 5, hasta = 7, activa, escala = 1 }) => {
  if (t < t0) return null;
  const xs = [1250, 2300, 3500, 4700, 5500, 6600, 7700, 8800, 9900];
  const pts = xs.map((x) => [x, Math.min(gy(Math.min(x, 7400)), 860) - 90]);
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const u = Math.min(1, (t - t0) / dur);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <path d={d} stroke="#fff" strokeWidth={18 * escala} fill="none" strokeDasharray={`${40 * escala} ${30 * escala}`} strokeDashoffset={-t * 120} opacity={0.9} pathLength={1000} style={{ strokeDasharray: `${u * 1000} 1000` }} strokeLinecap="round" />
      </svg>
      {PARADAS.filter((p) => p.n <= hasta).map((p) => {
        const tp = t0 + ((p.x - 1250) / (9900 - 1250)) * dur;
        if (t < tp) return null;
        const e = ent(t, tp, 0, { damping: 10, stiffness: 200 });
        const act = activa === p.n;
        return (
          <div key={p.n} style={{ position: "absolute", left: p.x, top: p.y - 120, transform: `scale(${e * escala * (act ? 1.25 + 0.08 * Math.sin(t * 8) : 1)})`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: -75, top: -75, width: 150, height: 150, borderRadius: 75, background: act ? C.rojo : C.ambar, border: "12px solid #fff", boxSizing: "border-box", fontFamily, fontWeight: 700, fontSize: 92, color: act ? "#fff" : C.noche, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: act ? `0 0 60px ${C.rojo}` : "0 12px 0 rgba(10,5,30,.5)" }}>{p.n}</div>
            <div style={{ position: "absolute", left: 0, top: p.n % 2 ? 120 : -120, transform: "translate(-50%,-50%)", fontFamily, fontWeight: 700, fontSize: 56, color: "#fff", background: "rgba(27,18,64,.85)", padding: "4px 22px", borderRadius: 14, whiteSpace: "nowrap" }}>{p.txt}</div>
          </div>
        );
      })}
    </>
  );
};

// bocadillo (habla / susurro) en pantalla
export const Globo: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; text: string; size?: number; cola?: "izq" | "der"; color?: string; tinta?: string }> = ({ t, t0, t1 = 1e9, x, y, text, size = 54, cola = "izq", color = "#fff", tinta = C.noche }) => {
  if (t < t0 || t > t1) return null;
  const e = ent(t, t0, 0, { damping: 11, stiffness: 190 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${e})`, transformOrigin: cola === "izq" ? "20% 120%" : "80% 120%" }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: color, padding: `${size * 0.3}px ${size * 0.55}px`, borderRadius: size * 0.6, boxShadow: "0 8px 0 rgba(10,5,30,.4)", whiteSpace: "nowrap", position: "relative" }}>
        {text}
        <div style={{ position: "absolute", bottom: -size * 0.5, [cola === "izq" ? "left" : "right"]: size * 0.8, width: 0, height: 0, borderLeft: `${size * 0.35}px solid transparent`, borderRight: `${size * 0.35}px solid transparent`, borderTop: `${size * 0.6}px solid ${color}` }} />
      </div>
    </div>
  );
};

// número que cuenta
export const Cuenta: React.FC<{ t: number; t0: number; t1?: number; de: number; a: number; dur?: number; y: number; x?: number; size?: number; color?: string; sufijo?: string; prefijo?: string }> = ({ t, t0, t1 = 1e9, de, a, dur = 0.8, y, x = 960, size = 260, color = C.crema, sufijo = "", prefijo = "" }) => {
  if (t < t0 || t > t1) return null;
  const v = Math.round(interpolate(t, [t0, t0 + dur], [de, a], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <Grande t={t} t0={t0} text={`${prefijo}${v.toLocaleString("en-US")}${sufijo}`} x={x} y={y} size={size} color={color} />;
};

// sello que cae (STAMP)
export const Sello: React.FC<{ t: number; t0: number; t1?: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number }> = ({ t, t0, t1 = 1e9, text, x, y, size = 90, color = C.rojo, rot = -12 }) => {
  if (t < t0 || t > t1) return null;
  const u = Math.min(1, (t - t0) / 0.14);
  const s = 2.4 - 1.4 * u + (u >= 1 ? 0.06 * Math.exp(-(t - t0 - 0.14) * 12) : 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, u * 2), fontFamily, fontWeight: 700, fontSize: size, color, border: `${size * 0.1}px solid ${color}`, borderRadius: size * 0.2, padding: `0 ${size * 0.3}px`, whiteSpace: "nowrap", letterSpacing: 4, background: "rgba(255,255,255,.08)" }}>{text}</div>
  );
};

// destello blanco de corte (para golpes)
export const Flash: React.FC<{ t: number; t0: number; dur?: number; color?: string }> = ({ t, t0, dur = 0.25, color = "#fff" }) =>
  t < t0 || t > t0 + dur ? null : <AbsoluteFill style={{ background: color, opacity: 1 - (t - t0) / dur, pointerEvents: "none" }} />;

// lanza en la mano (contra-rota el brazo para quedar parada)
export const LanzaMano: React.FC<{ a: number; inclina?: number; largo?: number }> = ({ a, inclina = 0, largo = 520 }) => (
  <g transform={`rotate(${a + inclina})`}>
    <rect x={-7} y={-largo * 0.7} width={14} height={largo} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} />
    <path d={`M 0 ${-largo * 0.7 - 70} L 20 ${-largo * 0.7 + 4} L 0 ${-largo * 0.7 + 30} L -20 ${-largo * 0.7 + 4} Z`} fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} />
  </g>
);

// ── mapa de puntos del Mar del Norte (tierra real, world-atlas 50m) con su propia cámara
import NORTE from "./mapa_norte.json";
import { camEn, Key } from "./mundo";
const MN = NORTE as { paso: number; pts: [number, number, number][]; lugares: { n: string; x: number; y: number }[] };
export const lugarN = (n: string) => MN.lugares.find((l) => l.n === n)!;
export const MapaN: React.FC<{
  t: number; cam?: Key[]; enciende?: [number, number]; desde?: string; brillo?: string;
  pulsa?: { n: string; t0: number; color?: string; label?: string; lado?: "der" | "izq" | "arr" | "aba" }[];
  rutas?: { de: string; a: string; t0: number; color?: string; curva?: number; dur?: number; ancho?: number }[];
  zona?: { n: string; t0: number; r: number; color?: string }[];
  children?: React.ReactNode; tinte?: string;
}> = ({ t, cam = [[0, 960, 540, 1]], enciende, desde = "DENMARK", brillo = "#7a64d8", pulsa = [], rutas = [], zona = [], children, tinte = "#3a2d7a" }) => {
  const c = camEn(t, cam);
  const o = lugarN(desde);
  const u = enciende ? interpolate(t, enciende, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const k = 1 / c.z;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d2a6a 0%, #0c0f30 75%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - c.x * c.z}px, ${540 - c.y * c.z}px) scale(${c.z})` }}>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
          {/* olas del mar */}
          {Array.from({ length: 30 }, (_, i) => {
            const x = (i * 211) % 1920, y = (i * 137) % 1080;
            return <path key={i} d={`M ${x} ${y} q 12 -8 24 0 q 12 8 24 0`} stroke="#3a5aa8" strokeWidth={3} fill="none" opacity={0.35 + 0.2 * Math.sin(t * 2 + i)} transform={`translate(${Math.sin(t * 0.7 + i) * 6} 0)`} />;
          })}
          {zona.map((z, i) => t >= z.t0 && <circle key={i} cx={lugarN(z.n).x} cy={lugarN(z.n).y} r={z.r * ent(t, z.t0)} fill={z.color ?? C.rojo} opacity={0.28 + 0.06 * Math.sin(t * 4)} />)}
          {MN.pts.map(([x, y], i) => {
            const d = Math.hypot(x - o.x, y - o.y) / 1400;
            const on = u > d;
            return <circle key={i} cx={x} cy={y} r={on ? 4.2 : 3.2} fill={on ? brillo : tinte} />;
          })}
          {rutas.map((r, i) => {
            if (t < r.t0) return null;
            const A = lugarN(r.de), B = lugarN(r.a);
            const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - (r.curva ?? 120);
            const v = interpolate(t, [r.t0, r.t0 + (r.dur ?? 0.8)], [0, 1], { extrapolateRight: "clamp" });
            const col = r.color ?? "#fff";
            return (
              <g key={i}>
                <path d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} stroke={col} strokeWidth={(r.ancho ?? 6) * Math.max(1, k * 0.8)} fill="none" pathLength={1000} strokeDasharray={`${v * 1000} 1000`} strokeLinecap="round" />
                {v >= 1 && <circle cx={B.x} cy={B.y} r={11 * Math.max(1, k * 0.8)} fill={col} />}
              </g>
            );
          })}
          {pulsa.map((p, i) => {
            if (t < p.t0) return null;
            const l = lugarN(p.n);
            const q = ((t - p.t0) % 1.3) / 1.3;
            const col = p.color ?? C.rojo;
            return (
              <g key={i}>
                <circle cx={l.x} cy={l.y} r={(12 + q * 50) * k} fill="none" stroke={col} strokeWidth={5 * k} opacity={1 - q} />
                <circle cx={l.x} cy={l.y} r={11 * k * ent(t, p.t0)} fill={col} stroke="#fff" strokeWidth={4 * k} />
              </g>
            );
          })}
        </svg>
        {children}
        {pulsa.map((p, i) => {
          if (t < p.t0 || !p.label) return null;
          const l = lugarN(p.n);
          const lado = p.lado ?? "der";
          const dx = lado === "der" ? 30 : lado === "izq" ? -30 : 0, dy = lado === "arr" ? -40 : lado === "aba" ? 40 : 0;
          const tr = lado === "der" ? "translate(0,-50%)" : lado === "izq" ? "translate(-100%,-50%)" : lado === "arr" ? "translate(-50%,-100%)" : "translate(-50%,0)";
          return (
            <div key={"l" + i} style={{ position: "absolute", left: l.x + dx * k, top: l.y + dy * k, transform: `${tr} scale(${k * ent(t, p.t0 + 0.1)})`, transformOrigin: lado === "izq" ? "100% 50%" : lado === "der" ? "0 50%" : "50% 50%", fontFamily, fontWeight: 700, fontSize: 44, color: "#fff", background: p.color ?? C.rojo, padding: "4px 18px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(10,5,30,.45)" }}>{p.label}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// nieve que cae (pantalla)
export const Nieve: React.FC<{ t: number; n?: number; seed?: number; op?: number }> = ({ t, n = 90, seed = 2, op = 0.8 }) => {
  const r = React.useMemo(() => { const q = rnd(seed); return Array.from({ length: n }, () => [q() * 1920, q(), 0.5 + q(), 2 + q() * 5]); }, [n, seed]);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {r.map(([x0, ph, v, s], i) => {
        const y = ((t * 90 * v + ph * 1200) % 1200) - 60, x = x0 + Math.sin(t * 1.2 * v + ph * 9) * 40;
        return <circle key={i} cx={x} cy={y} r={s} fill="#fff" opacity={op * (0.5 + 0.5 * ph)} />;
      })}
    </svg>
  );
};
