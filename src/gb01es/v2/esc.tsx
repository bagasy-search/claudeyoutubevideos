// gb01 v2 · infraestructura de las escenas entre ventanas (cada una es un mundo propio con su cámara, mismo neón).
import React from "react";
import { Img, staticFile } from "remotion";
import { N, SANS, SERIF, Toma, easeOut, makeCam, pop, ramp, useT, vis } from "../../kits/neon/base";
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

// HÉROE (molde del reel): UN objeto fotorreal grande que llena el escenario. Halo radial + bloom + reflejo en el piso +
// polvo de luz + inclinación 3D lenta. Entra con destello; `latidos` = golpes de brillo; `apagar` = se desatura (vacío).
const polvo = Array.from({ length: 46 }, (_, i) => ({ x: ((i * 7919) % 1000) / 1000, y: ((i * 104729) % 1000) / 1000, r: 1 + (i % 4) * 0.8, v: 0.4 + ((i * 31) % 10) / 12, f: (i * 1.7) % 6.28 }));
export const Heroe: React.FC<{ id: string; x: number; y: number; h: number; t0: number; t1?: number; glow?: string; tilt?: number; latidos?: number[]; apagar?: number; reflejo?: boolean; carpeta?: string; luz?: number; rot?: number; children?: React.ReactNode }> = ({ id, x, y, h, t0, t1 = Infinity, glow = N.cian, tilt = 6, latidos = [], apagar, reflejo = true, carpeta = "hero", luz = 1, rot = 0, children }) => {
  const t = useT();
  if (!vis(t, t0, t1, 0.7)) return null;
  const k = ramp(t, t0, 0.9, easeOut), out = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.5, 0.5);
  const lat = Math.max(0, ...latidos.map((tp) => (t >= tp && t < tp + 0.55 ? 1 - (t - tp) / 0.55 : 0)));
  const gris = apagar === undefined ? 0 : ramp(t, apagar, 0.9);
  const ry = Math.sin((t - t0) * 0.45) * tilt, rx = Math.cos((t - t0) * 0.37) * tilt * 0.45;
  const s = (0.86 + 0.14 * k) * (1 + 0.035 * lat) * (1 + Math.min(8, t - t0) * 0.006);
  const flash = 1 - ramp(t, t0, 0.8);
  const src = staticFile(`gb01/${carpeta}/${id}.png`);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: k * out, transform: `translate(-50%,-50%) perspective(1800px) rotateY(${ry}deg) rotateX(${rx}deg) rotate(${rot}deg) scale(${s})`, filter: `saturate(${1 - 0.85 * gris}) brightness(${1 - 0.4 * gris})` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: h * 2, height: h * 1.5, transform: "translate(-50%,-50%)", background: `radial-gradient(closest-side, ${glow}66, ${glow}22 45%, transparent 75%)`, opacity: 0.5 + 0.5 * lat + 0.4 * flash }} />
      <Img src={src} style={{ display: "block", height: h, position: "relative", filter: `brightness(${(1.05 + 0.9 * flash + 0.45 * lat) * luz}) contrast(1.1)` }} />
      <Img src={src} style={{ position: "absolute", left: 0, top: 0, height: h, filter: `blur(${Math.round(h * 0.035)}px) brightness(1.5)`, mixBlendMode: "screen", opacity: 0.4 + 0.45 * lat + 0.3 * flash }} />
      {reflejo && <Img src={src} style={{ position: "absolute", left: 0, top: h * 0.985, height: h, transform: "scaleY(-1)", opacity: 0.17, filter: "blur(2px)", WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 38%)", maskImage: "linear-gradient(to top, #000 0%, transparent 38%)" }} />}
      <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {polvo.map((p, i) => {
          const yy = (((p.y - (t - t0) * 0.03 * p.v) % 1) + 1) % 1;
          return <circle key={i} cx={(p.x * 1.6 - 0.3) * h} cy={(yy * 1.3 - 0.15) * h} r={p.r} fill={i % 3 ? glow : "#fff"} opacity={(0.25 + 0.5 * Math.abs(Math.sin(t * p.v * 2 + p.f))) * k} style={{ filter: `drop-shadow(0 0 4px ${glow})` }} />;
        })}
      </svg>
      {children}
    </div>
  );
};

// onda de choque en el mundo (golpe): anillo que se expande y se apaga
export const Onda: React.FC<{ x: number; y: number; t0: number; r?: number; color?: string; d?: number }> = ({ x, y, t0, r = 400, color = N.cian, d = 0.9 }) => {
  const t = useT();
  if (t < t0 || t > t0 + d) return null;
  const k = ramp(t, t0, d, easeOut);
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <circle r={r * (0.15 + 0.85 * k)} fill="none" stroke={color} strokeWidth={10 * (1 - k) + 1} opacity={1 - k} style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
    </svg>
  );
};

// ESCENA DE HÉROES: una idea por frase = un héroe grande. La cámara vuela de uno al siguiente (arco de zoom en el viaje)
// y empuja despacio mientras se habla de él; título sans + *serif* fijo arriba; golpe de luz + onda al llegar.
export type Beat = { t: number; id: string; glow: string; tit: string; carpeta?: string; luz?: number };
const PASO = 1150;
export const EscenaHeroes: React.FC<{ ini: number; fin: number; beats: Beat[]; h?: number; children?: React.ReactNode }> = ({ ini, fin, beats, h = 720, children }) => {
  const tomas = React.useMemo(() => {
    const k: Toma[] = [];
    beats.forEach((b, i) => {
      const x = i * PASO, a = i === 0 ? Math.min(ini, b.t) : b.t + 0.2;
      const z = i === beats.length - 1 ? fin : beats[i + 1].t - 0.45;
      k.push([a, x, 0, 1.0, 0, i === 0 ? "io" : "io"]);
      k.push([Math.max(a + 0.5, z), x, i % 2 ? -14 : 10, i === beats.length - 1 ? 1.2 : 1.12, 0, "in"]);
    });
    return k;
  }, [ini, fin, beats]);
  const pantalla = (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 260, background: "radial-gradient(ellipse 760px 170px at 960px 100px, rgba(0,0,0,0.78), rgba(0,0,0,0.45) 55%, transparent 100%)" }} />
      {beats.map((b, i) => <Texto key={i} x={960} y={105} t0={i === 0 ? Math.max(ini, b.t - 0.1) : b.t + 0.15} t1={i === beats.length - 1 ? Infinity : beats[i + 1].t + 0.1} texto={b.tit} size={78} color={b.glow === N.oro ? N.oroClaro : b.glow === N.cian ? N.cianClaro : "#fff"} />)}
    </>
  );
  return (
    <EscenaMundo tomas={tomas} pantalla={pantalla}>
      {beats.map((b, i) => (
        <React.Fragment key={i}>
          <Heroe id={b.id} carpeta={b.carpeta} luz={b.luz} x={i * PASO} y={i % 2 ? 10 : -6} h={h} t0={i === 0 ? ini - 0.6 : b.t - 0.55} t1={i === beats.length - 1 ? Infinity : beats[i + 1].t + 0.9} glow={b.glow} tilt={3 + (i % 3)} latidos={[b.t + (i === 0 ? 0 : 0.2)]} />
          <Onda x={i * PASO} y={0} t0={b.t + (i === 0 ? 0 : 0.2)} r={460} color={b.glow} />
        </React.Fragment>
      ))}
      {children}
    </EscenaMundo>
  );
};
// registro de beats (para el sonido: vuelo + golpe al llegar a cada héroe)
export const BEATS: Beat[][] = [];
export const reg = (b: Beat[]) => (BEATS.push(b), b);
