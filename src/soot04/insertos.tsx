import React from "react";
import { interpolate, Easing } from "remotion";
import { C, ent, prog, fontFamily, seguro, anchoTxt } from "./kit";

// Insertos a pantalla completa (vara del molde de Soot): fondo limpio de rayos o degradé, personaje GRANDE actuando,
// un texto fuerte. Entran y salen por iris sobre el mundo continuo. Cada inserto vive en [a, b) en tiempo absoluto.
export type Ins = { a: number; b: number; fondo: (t: number) => React.ReactNode; d: (t: number) => React.ReactNode; z?: number };

export const Rayos2: React.FC<{ t: number; c1: string; c2: string; cx?: number; cy?: number; n?: number; vel?: number }> = ({ t, c1, c2, cx = 960, cy = 540, n = 16, vel = 6 }) => {
  const g = 360 / n;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `repeating-conic-gradient(from ${t * vel}deg at ${cx}px ${cy}px, ${c1} 0deg ${g / 2}deg, ${c2} ${g / 2}deg ${g}deg)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 38%, rgba(10,6,30,.38) 100%)` }} />
    </>
  );
};
export const Grad: React.FC<{ c1: string; c2: string; ang?: number }> = ({ c1, c2, ang = 180 }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${ang}deg, ${c1}, ${c2})` }} />
);
// cielo arriba + mar abajo (horizonte en y)
export const Mar: React.FC<{ t: number; y?: number; cielo?: [string, string]; mar?: [string, string] }> = ({ t, y = 640, cielo = ["#7fc8f0", "#d8f0ff"], mar = ["#2a7fb8", "#123c6a"] }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: y, background: `linear-gradient(180deg, ${cielo[0]}, ${cielo[1]})` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${mar[0]}, ${mar[1]})` }} />
    <svg style={{ position: "absolute", left: 0, top: y - 14, overflow: "visible" }} width={1920} height={40}>
      {Array.from({ length: 9 }, (_, i) => {
        const x = ((i * 260 - t * 60) % 2340 + 2340) % 2340 - 200;
        return <path key={i} d={`M ${x} 20 Q ${x + 60} 4 ${x + 120} 20 Q ${x + 180} 36 ${x + 240} 20`} stroke="rgba(255,255,255,.55)" strokeWidth={6} fill="none" />;
      })}
    </svg>
  </>
);

// monto que rueda por saltos: ks = [[t, valor], ...]
export const Monto: React.FC<{ t: number; ks: [number, number][]; x: number; y: number; size?: number; color?: string; pre?: string; suf?: string; t0?: number; signo?: boolean }> = ({ t, ks, x, y, size = 150, color = C.crema, pre = "$", suf = "", t0, signo }) => {
  if (t < (t0 ?? ks[0][0])) return null;
  let v = ks[0][1];
  for (let i = 1; i < ks.length; i++) v += (ks[i][1] - ks[i - 1][1]) * prog(t, ks[i][0], ks[i][0] + 0.45);
  const n = Math.round(v);
  const golpe = ks.slice(1).reduce((m, k) => (t > k[0] && t < k[0] + 0.5 ? 1 + 0.18 * Math.sin(((t - k[0]) / 0.5) * Math.PI) : m), 1);
  const txt = `${n < 0 ? "-" : signo && n > 0 ? "+" : ""}${pre}${Math.abs(n).toLocaleString("en-US")}${suf}`;
  const fin = `${pre}${Math.abs(ks[ks.length - 1][1]).toLocaleString("en-US")}${suf}-`;
  const z = seguro(x, y, anchoTxt(fin, size) + size * 0.2, size * 1.25);
  return (
    <div style={{ position: "absolute", left: z.x, top: z.y, transform: `translate(-50%, -50%) scale(${ent(t, t0 ?? ks[0][0]) * golpe * z.k})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.08}px ${C.noche}`, paintOrder: "stroke fill", textShadow: `0 ${size * 0.07}px 0 ${C.noche}`, whiteSpace: "nowrap" }}>{txt}</div>
  );
};
// sello que cae y golpea
export const Sello: React.FC<{ t: number; t0: number; text: string; x: number; y: number; color?: string; rot?: number; size?: number }> = ({ t, t0, text, x, y, color = C.rojo, rot = -8, size = 90 }) => {
  if (t < t0) return null;
  const k = interpolate(t, [t0, t0 + 0.14], [2.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const op = interpolate(t, [t0, t0 + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = seguro(x, y, anchoTxt(text, size) * 1.08 + size * 0.8, size * 1.5);
  return (
    <div style={{ position: "absolute", left: z.x, top: z.y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${k * z.k})`, opacity: op, fontFamily, fontWeight: 700, fontSize: size, color, border: `${size * 0.1}px solid ${color}`, borderRadius: size * 0.18, padding: `${size * 0.04}px ${size * 0.3}px`, background: "rgba(255,248,230,.92)", whiteSpace: "nowrap", letterSpacing: 3, boxShadow: "0 10px 0 rgba(20,10,50,.3)" }}>{text}</div>
  );
};
// globo de diálogo
export const Dice: React.FC<{ t: number; t0: number; t1?: number; text: string; x: number; y: number; size?: number; cola?: "izq" | "der"; color?: string; tinta?: string }> = ({ t, t0, t1 = 1e9, text, x, y, size = 64, cola = "izq", color = "#fff", tinta = C.noche }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const w = anchoTxt(text, size) + size, h = size * 1.7, z = seguro(x, y - h / 2, w, h);
  const s = z.k * ent(t, t0, 0, { damping: 10, stiffness: 200 }) * interpolate(t, [t1, t1 + 0.25], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: z.x, top: z.y + h / 2, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: cola === "izq" ? "20% 100%" : "80% 100%", fontFamily, fontWeight: 700, fontSize: size, color: tinta, background: color, padding: `${size * 0.25}px ${size * 0.5}px`, borderRadius: size * 0.6, border: `${size * 0.08}px solid ${C.noche}`, whiteSpace: "nowrap", boxShadow: "0 8px 0 rgba(20,10,50,.3)" }}>
      {text}
      <div style={{ position: "absolute", bottom: -size * 0.42, [cola === "izq" ? "left" : "right"]: size * 0.6, width: 0, height: 0, borderLeft: `${size * 0.3}px solid transparent`, borderRight: `${size * 0.3}px solid transparent`, borderTop: `${size * 0.45}px solid ${C.noche}` }} />
    </div>
  );
};
// rótulo grande con salida
export const Rot: React.FC<{ t: number; t0: number; t1?: number; text: string; x?: number; y: number; size?: number; color?: string; tiembla?: boolean }> = ({ t, t0, t1 = 1e9, text, x = 960, y, size = 130, color = C.crema, tiembla }) => {
  if (t < t0 || t > t1 + 0.2) return null;
  const s = ent(t, t0, 0, { damping: 9, stiffness: 190 }) * interpolate(t, [t1, t1 + 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dx = tiembla ? Math.sin(t * 47) * 6 : 0, dy = tiembla ? Math.cos(t * 53) * 5 : 0;
  const z = seguro(x, y, anchoTxt(text, size) * 1.05 + size * 0.2, size * 1.3);
  return (
    <div style={{ position: "absolute", left: z.x + dx, top: z.y + dy, transform: `translate(-50%, -50%) scale(${s * z.k})`, fontFamily, fontWeight: 700, fontSize: size, color, WebkitTextStroke: `${size * 0.09}px ${C.noche}`, paintOrder: "stroke fill", whiteSpace: "nowrap", letterSpacing: 2, textShadow: `0 ${size * 0.07}px 0 ${C.noche}` }}>{text}</div>
  );
};
// vuela de (x0,y0) a (x1,y1) entre t0 y t1 girando; los hijos son SVG centrado en el origen
export const Vuela: React.FC<{ t: number; t0: number; t1: number; x0: number; y0: number; x1: number; y1: number; s?: number; giro?: number; arco?: number; queda?: boolean; children: React.ReactNode }> = ({ t, t0, t1, x0, y0, x1, y1, s = 1, giro = 0, arco = 200, queda = true, children }) => {
  if (t < t0 || (!queda && t > t1)) return null;
  const u = interpolate(t, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * arco;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`rotate(${giro * u}) scale(${s})`}>{children}</g>
    </svg>
  );
};

// montaje: el inserto activo entra con una de 4 transiciones (iris / barrido / zoom / corte seco, alternadas
// para que no sea siempre el mismo círculo) y sale por corte seco (el iris de salida dejaba cuadros vacíos); empuje lento adentro
export const MostrarInsertos: React.FC<{ t: number; lista: Ins[] }> = ({ t, lista }) => {
  // vuelta 4: un hueco ≤0,35 s entre dos insertos dejaba ver 2-3 cuadros del mundo (fantasmas): se sostiene el anterior
  let idx = lista.findIndex((k) => t >= k.a && t < k.b);
  let tt = t;
  if (idx < 0) {
    const prev = lista.findIndex((k, j) => t >= k.b && t < k.b + 0.35 && lista[j + 1] && lista[j + 1].a - k.b <= 0.35);
    if (prev < 0) return null;
    idx = prev;
    tt = t; // sigue corriendo (congelarlo daba cuadros duplicados = lageo)
  }
  const i = lista[idx];
  // el contenido arranca ya armado (los elementos que entraban en `a` dejaban el primer cuadro vacío o un disco oscuro)
  const tc = Math.max(tt, i.a + 0.3);
  // vuelta 5: el iris/barrido muestreado a mitad parecía un disco negro o una mancha tapando la escena → corte seco siempre
  const tipo = "corte" as "iris" | "barrido" | "zoom" | "corte";
  const IN = 0.2;
  const r = tipo === "corte" ? 1 : Math.min(1, (tt - i.a) / IN);
  const e = Easing.out(Easing.cubic)(Math.max(0, r));
  // cadencia del molde (~3,5 s): en insertos largos, corte seco a un plano más cerrado y vuelta (punch-in alternado)
  const tramo = Math.floor((t - i.a) / 3.4), largo = i.b - i.a > 5.5;
  const punch = largo && tramo % 2 === 1 && i.b - t > 1.2 ? 1.08 : 1;
  const z = punch * (1 + (i.z ?? 0.05) * ((t - i.a) / (i.b - i.a)) + (tipo === "zoom" ? 0.25 * (1 - e) : 0));
  const clip = r >= 1 ? undefined : tipo === "iris" ? `circle(${18 + e * 64}% at 50% 52%)` : tipo === "barrido" ? `inset(0 ${(1 - e) * 100}% 0 0)` : undefined;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", clipPath: clip }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 55%" }}>
        {i.fondo(tc)}
        {i.d(tc)}
      </div>
      {r < 1 && tipo === "iris" && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 ${18 * (1 - e)}px #fff` }} />}
      {r < 1 && tipo === "barrido" && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${e * 100}%`, width: 26, marginLeft: -13, background: C.oro, boxShadow: `0 0 0 6px ${C.noche}` }} />}
    </div>
  );
};
