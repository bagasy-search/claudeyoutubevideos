// gb01 v2 · infraestructura de las escenas entre ventanas (cada una es un mundo propio con su cámara, mismo neón).
import React from "react";
import { Img, staticFile } from "remotion";
import { N, SANS, SERIF, Toma, makeCam, pop, ramp, useT, vis } from "../../kits/neon/base";
import { Escenario } from "../../kits/neon/Layout";
import { Glifo, Trazo } from "./glifo";

// zoom general de las escenas: los objetos se dibujan en px de mundo y a 1:1 quedaban chicos en 1920
export const ZOOM_ESC = 1.3;
export const EscenaMundo: React.FC<{ tomas: Toma[]; children: React.ReactNode; pantalla?: React.ReactNode }> = ({ tomas, children, pantalla }) => {
  const cam = React.useMemo(() => makeCam(tomas.map(([t, x, y, z]) => [t, x, y, z * ZOOM_ESC] as Toma)), [tomas]);
  return <Escenario cam={cam} w={1920} mundo={<>{children}</>} pantalla={pantalla} />;
};

// un objeto de neón en el mundo: trazos que se dibujan en t0 (y se van en t1)
export const Obj: React.FC<{ x: number; y: number; t0: number; t1?: number; tam?: number; trazos: Trazo[] | ((t: number) => Trazo[]); color?: string; rot?: number; children?: React.ReactNode; dur?: number }> = ({ x, y, t0, t1 = Infinity, tam = 200, trazos, color, rot = 0, children, dur }) => {
  const t = useT();
  if (!vis(t, t0, t1, 0.4)) return null;
  const out = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.35, 0.35);
  const s = 0.82 + 0.18 * pop(t, t0, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: out, transform: `rotate(${rot}deg) scale(${s})` }}>
      <Glifo t={t} t0={t0} on={1} tam={tam} trazos={typeof trazos === "function" ? trazos(t) : trazos} color={color} dur={dur}>{children}</Glifo>
    </div>
  );
};

// texto en el mundo: sans negra + *itálica serif*
export const Texto: React.FC<{ x: number; y: number; t0: number; t1?: number; texto: string; size?: number; color?: string; ancla?: "c" | "i" }> = ({ x, y, t0, t1 = Infinity, texto, size = 56, color = "#fff", ancla = "c" }) => {
  const t = useT();
  if (!vis(t, t0, t1, 0.4)) return null;
  const k = pop(t, t0, 12), out = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.3, 0.3);
  const segs = texto.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${ancla === "c" ? "-50%" : "0"},-50%) scale(${0.85 + 0.15 * k})`, transformOrigin: ancla === "c" ? "50% 50%" : "0 50%", opacity: Math.min(1, k * 1.5) * out, whiteSpace: "nowrap", color, textShadow: `0 0 20px ${color === "#fff" ? "rgba(255,255,255,.35)" : color}` }}>
      {segs.map((p, i) => p.startsWith("*")
        ? <span key={i} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: size * 1.12 }}>{p.slice(1, -1)}</span>
        : <span key={i} style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: -1 }}>{p}</span>)}
    </div>
  );
};

// contador que rueda de a0 a a1 entre t0 y t0+d
export const Contador: React.FC<{ x: number; y: number; t0: number; d: number; a0?: number; a1: number; t1?: number; size?: number; color?: string; sufijo?: string }> = ({ x, y, t0, d, a0 = 0, a1, t1 = Infinity, size = 140, color = N.cianClaro, sufijo = "" }) => {
  const t = useT();
  if (!vis(t, t0, t1, 0.4)) return null;
  const k = ramp(t, t0, d, (u) => 1 - Math.pow(1 - u, 3));
  const out = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.3, 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: Math.min(1, ramp(t, t0, 0.2)) * out, fontFamily: SANS, fontWeight: 900, fontSize: size, color, letterSpacing: -4, textShadow: `0 0 18px ${color}, 0 0 60px ${color}`, whiteSpace: "nowrap" }}>
      {Math.round(a0 + (a1 - a0) * k)}<span style={{ fontSize: size * 0.4, letterSpacing: 0, marginLeft: 10 }}>{sufijo}</span>
    </div>
  );
};

// curva de Bézier cuadrática entre dos puntos (para hilos dentro de un Obj)
export const arco = (a: [number, number], b: [number, number], sag = 0) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return `M${a[0]},${a[1]} Q${mx - ((b[1] - a[1]) / L) * sag},${my + ((b[0] - a[0]) / L) * sag} ${b[0]},${b[1]}`;
};
export const circ = (cx: number, cy: number, r: number) => `M${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy}`;

// objeto de vidrio con neón adentro (PNG sin fondo, public/gb01/png/<id>.png): entra con pop + brillo, flota leve y se va en t1
export const Png: React.FC<{ id: string; x: number; y: number; t0: number; t1?: number; w?: number; rot?: number; glow?: string; flota?: number; giro?: number; op?: number }> = ({ id, x, y, t0, t1 = Infinity, w = 420, rot = 0, glow = N.cian, flota = 10, giro = 0, op = 1 }) => {
  const t = useT();
  if (!vis(t, t0, t1, 0.5)) return null;
  const k = pop(t, t0, 10), out = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.35, 0.35);
  const dy = Math.sin((t - t0) * 1.3) * flota, r = rot + Math.sin((t - t0) * 0.9) * 1.5 + (t - t0) * giro;
  const brillo = 1 + 0.9 * (1 - ramp(t, t0, 0.6));
  return (
    <Img src={staticFile(`gb01/png/${id}.png`)} style={{ position: "absolute", left: x, top: y + dy, width: w, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.4) * out * op, filter: `brightness(${brillo}) drop-shadow(0 0 12px ${glow}77)` }} />
  );
};
