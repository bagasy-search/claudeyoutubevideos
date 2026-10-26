// Mapa: tarjeta-mapa (tierra, agua, rutas) o plano (azul con grilla y ambientes) donde caen los pines con rebote,
// una línea punteada se va dibujando detrás de un viajero que la recorre (se inclina en las curvas) y la distancia
// rueda al lado. Los puntos van en coordenadas LOCALES del mapa (0..w, 0..h). Va en el hud.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, curva, easeInOut, num, Sombra, useReloj } from "./comun";

export type MapaProps = {
  x: number; y: number; w?: number; h?: number; desde: number; hasta?: number;
  puntos: { x: number; y: number; rotulo?: string; via?: boolean; lado?: "arriba" | "der" | "izq" }[]; // lado = dónde va el rótulo del pin (arriba por defecto) // via = la ruta pasa por ahí pero sin pin (puertas, esquinas)
  estilo?: "mapa" | "plano"; dur?: number; // cuadros del recorrido (arranca a los 30)
  distancia?: { total: number; unidad: string; dec?: number };
  titulo?: string; acento?: string; seed?: number;
  viajero?: React.ReactNode; // dibujo que recorre la ruta (por defecto, un punto con halo)
  // plano: habitaciones. `dibujo` = muebles en coordenadas locales del ambiente (0..w, 0..h); `puertas` = huecos en
  // la pared con su arco (lado n/s/e/o, pos 0..1 a lo largo de esa pared)
  ambientes?: { x: number; y: number; w: number; h: number; rotulo?: string; dibujo?: React.ReactNode; puertas?: { lado: "n" | "s" | "e" | "o"; pos: number; ancho?: number }[] }[];
};

const T0 = 30;
// cuándo (0..1 del recorrido) el viajero pasa por la fracción `fr` de la ruta: inversa de easeInOut por bisección
const tiempoDe = (fr: number) => { let a = 0, b = 1; for (let k = 0; k < 18; k++) { const m = (a + b) / 2; if (easeInOut(m) < fr) a = m; else b = m; } return (a + b) / 2; };
// costa deterministica: radio que varía con senos (cada seed una isla distinta)
const costa = (cx: number, cy: number, r: number, seed: number, rx = r * 1.35) => {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const k = 1 + 0.13 * Math.sin(3 * a + seed) + 0.07 * Math.sin(7 * a + seed * 2.1) + 0.035 * Math.sin(13 * a + seed * 0.7);
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * r * k).toFixed(1)}`);
  }
  return "M" + pts.join(" L") + " Z";
};

export const Mapa: React.FC<MapaProps> = ({ x, y, w = 980, h = 600, desde, hasta, puntos, estilo = "mapa", dur = 100, distancia, titulo, acento = "#ff4a3d", seed = 3, viajero, ambientes }) => {
  const { f, ent, suave, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  const plano = estilo === "plano";
  const e = ent(0, { damping: 15 });
  const ruta = curva(puntos, 28);
  const u = interpolate(f, [T0, T0 + dur], [0, 1], { ...clamp, easing: easeInOut });
  const cab = ruta.en(u);
  // inclinación del viajero según la velocidad (se adelanta en la curva): diferencia del ángulo
  const prev = ruta.en(Math.max(0, u - 0.01));
  const id = `map${desde}`;
  const frac = (i: number) => {
    // fracción de la ruta en la que se llega al punto i (por largo acumulado aproximado)
    let L = 0, Li = 0;
    for (let k = 1; k < puntos.length; k++) { const d = Math.hypot(puntos[k].x - puntos[k - 1].x, puntos[k].y - puntos[k - 1].y); L += d; if (k <= i) Li += d; }
    return L ? Li / L : 0;
  };
  const colTierra = "#e7dcc0", colAgua = "#9cc9d8";
  // la isla se agranda para que TODOS los pines queden en tierra (la costa varía ±24 %: radio con margen)
  const xs = puntos.map((p) => p.x), ys = puntos.map((p) => p.y);
  const icx = (Math.min(...xs) + Math.max(...xs)) / 2, icy = (Math.min(...ys) + Math.max(...ys)) / 2 + 10;
  const ir = Math.min(h * 0.6, Math.max(h * 0.36, ((Math.max(...ys) - Math.min(...ys)) / 2 + 60) / 0.8));
  const irx = Math.min(w * 0.6, Math.max(ir * 1.35, ((Math.max(...xs) - Math.min(...xs)) / 2 + 60) / 0.8));
  const islote = irx < w * 0.4; // el islote sólo si queda agua para él
  // el marcador de distancia va en la esquina más lejos de los pines (no tapa ningún rótulo)
  const esquinas = [[w - 150, 62], [w - 150, h - 62], [150, h - 62]];
  const esq = esquinas.reduce((m, c) => { const d = Math.min(...puntos.map((p) => Math.hypot(p.x - c[0], p.y - 60 - c[1]))); return d > m.d ? { c, d } : m; }, { c: esquinas[0], d: -1 }).c;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      <defs>
        <clipPath id={id + "c"}><rect width={w} height={h} rx={24} /></clipPath>
        <mask id={id + "m"}><path d={ruta.d} stroke="#fff" strokeWidth={30} fill="none" strokeDasharray={`${ruta.largo * u} ${ruta.largo + 10}`} strokeLinecap="round" /></mask>
        <pattern id={id + "g"} width={40} height={40} patternUnits="userSpaceOnUse"><path d="M40,0 H0 V40" fill="none" stroke="#7fa6e8" strokeOpacity={0.35} strokeWidth={1.5} /></pattern>
      </defs>
      {/* el mapa se despliega: entra con escala y una leve rotación */}
      <g transform={`translate(${x},${y}) scale(${0.86 + 0.14 * e}) rotate(${(1 - e) * 4}) translate(${-w / 2},${-h / 2})`} opacity={Math.min(1, e * 1.5)}>
        <Sombra dy={14} o={0.3}><rect width={w} height={h} rx={24} /></Sombra>
        <g clipPath={`url(#${id}c)`}>
          {plano ? (
            <>
              <rect width={w} height={h} fill="#1d3a78" />
              <rect width={w} height={h} fill={`url(#${id}g)`} />
              {(ambientes ?? []).map((a, i) => {
                const k = suave(6 + i * 4, 14);
                return (
                  <g key={i} opacity={k}>
                    {a.dibujo && <g transform={`translate(${a.x},${a.y})`} opacity={suave(14 + i * 4, 14)}>{a.dibujo}</g>}
                    <rect x={a.x} y={a.y} width={a.w * k} height={a.h} fill="none" stroke="#e8f0ff" strokeWidth={6} />
                    {(a.puertas ?? []).map((pu, j) => {
                      const an = pu.ancho ?? 56, hor = pu.lado === "n" || pu.lado === "s";
                      const px = hor ? a.x + a.w * pu.pos : a.x + (pu.lado === "e" ? a.w : 0);
                      const py = hor ? a.y + (pu.lado === "s" ? a.h : 0) : a.y + a.h * pu.pos;
                      const giro = { n: 1, s: -1, e: -1, o: 1 }[pu.lado];
                      return (
                        <g key={j}>
                          {/* hueco: se tapa la pared con el fondo del plano */}
                          <rect x={hor ? px - an / 2 : px - 6} y={hor ? py - 6 : py - an / 2} width={hor ? an : 12} height={hor ? 12 : an} fill="#1d3a78" />
                          <path d={hor ? `M${px - an / 2},${py} L${px - an / 2},${py + giro * an} A${an},${an} 0 0 ${giro > 0 ? 0 : 1} ${px + an / 2},${py}` : `M${px},${py - an / 2} L${px + giro * an},${py - an / 2} A${an},${an} 0 0 ${giro > 0 ? 1 : 0} ${px},${py + an / 2}`} stroke="#cfe0ff" strokeOpacity={0.7} strokeWidth={3} fill="none" />
                        </g>
                      );
                    })}
                    {/* rótulo arriba a la izquierda del ambiente: el centro queda libre para pines y ruta */}
                    {a.rotulo && <text x={a.x + 18} y={a.y + 38} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill="#cfe0ff" letterSpacing={3}>{a.rotulo}</text>}
                  </g>
                );
              })}
            </>
          ) : (
            <>
              <rect width={w} height={h} fill={colAgua} />
              {[0, 1, 2].map((i) => <path key={i} d={`M-20,${90 + i * 190} q60,-14 120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0`} stroke="#fff" strokeOpacity={0.25} strokeWidth={3} fill="none" transform={`translate(${((f * 0.4) % 120) - 120},0)`} />)}
              <path d={costa(icx, icy, ir, seed, irx)} fill="#cdbf9e" transform="translate(0,8)" />
              <path d={costa(icx, icy, ir, seed, irx)} fill={colTierra} stroke="#b9a984" strokeWidth={4} />
              {islote && <path d={costa(w * 0.78, h * 0.2, h * 0.07, seed + 2)} fill={colTierra} stroke="#b9a984" strokeWidth={3} />}
              <ellipse cx={w * 0.38} cy={h * 0.42} rx={46} ry={26} fill={colAgua} stroke="#b9a984" strokeWidth={3} />
              {/* rutas secundarias y manzanas */}
              <path d={`M${w * 0.18},${h * 0.6} Q${w * 0.45},${h * 0.5} ${w * 0.82},${h * 0.62} M${w * 0.5},${h * 0.2} Q${w * 0.55},${h * 0.5} ${w * 0.46},${h * 0.86}`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" />
              {[[0.3, 0.32], [0.62, 0.36], [0.68, 0.72], [0.28, 0.74], [0.56, 0.6]].map(([a, b], i) => (
                <g key={i}>{[0, 1, 2].map((k) => <rect key={k} x={w * a + k * 22} y={h * b} width={16} height={16} rx={3} fill="#cdbf9e" />)}</g>
              ))}
              {[[0.24, 0.46], [0.72, 0.5], [0.4, 0.66], [0.6, 0.26]].map(([a, b], i) => <circle key={i} cx={w * a} cy={h * b} r={10} fill="#9cbf7a" />)}
            </>
          )}
          {/* ruta: guía tenue + punteado revelado detrás del viajero */}
          <path d={ruta.d} stroke={plano ? "#ffffff" : "#2a2420"} strokeOpacity={0.12} strokeWidth={8} fill="none" strokeDasharray="2 14" strokeLinecap="round" />
          <g mask={`url(#${id}m)`}>
            <path d={ruta.d} stroke={acento} strokeWidth={8} fill="none" strokeDasharray="18 12" strokeLinecap="round" />
          </g>
        </g>
        {/* pines: cada uno cae con rebote cuando el viajero llega (el primero al empezar) */}
        {puntos.map((p, i) => {
          if (p.via) return null;
          const llega = i === 0 ? 10 : T0 + dur * tiempoDe(frac(i));
          const ep = ent(llega, { damping: 8, stiffness: 180 });
          if (ep <= 0.001) return null;
          const caida = (1 - Math.min(1, ep)) * -60;
          const fin = i === puntos.length - 1;
          return (
            <g key={i} transform={`translate(${p.x},${p.y + caida})`} opacity={Math.min(1, ep * 2)}>
              <ellipse cx={0} cy={4} rx={14 * ep} ry={5 * ep} fill="#000" opacity={0.25} />
              <path d="M0,0 C-10,-18 -24,-28 -24,-44 A24,24 0 1 1 24,-44 C24,-28 10,-18 0,0 Z" fill={fin || i === 0 ? acento : "#2a2420"} stroke="#fff" strokeWidth={4} />
              <circle cx={0} cy={-44} r={9} fill="#fff" />
              {p.rotulo && (
                <g transform={`translate(${p.lado === "der" ? p.rotulo.length * 9.5 + 50 : p.lado === "izq" ? -p.rotulo.length * 9.5 - 50 : 0},${p.lado && p.lado !== "arriba" ? -40 : -86}) scale(${Math.min(1, ep)})`}>
                  <rect x={-p.rotulo.length * 9.5 - 18} y={-30} width={p.rotulo.length * 19 + 36} height={44} rx={22} fill="#2a2420" opacity={0.9} />
                  <text y={2} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={28} fill="#fff">{p.rotulo}</text>
                </g>
              )}
            </g>
          );
        })}
        {/* viajero */}
        {u > 0 && u < 1 && (
          <g transform={`translate(${cab.x},${cab.y}) rotate(${(cab.ang - prev.ang) * 0.6})`}>
            {viajero ?? (
              <>
                <circle r={26 + 4 * Math.sin(f / 3)} fill={acento} opacity={0.25} />
                <circle r={14} fill={acento} stroke="#fff" strokeWidth={5} />
              </>
            )}
          </g>
        )}
        {/* distancia: marcador fijo arriba a la derecha (no tapa los rótulos de los pines); late al llegar */}
        {distancia && (() => {
          const eD = ent(T0 - 6, { damping: 12 });
          const late = 1 + 0.12 * Math.exp(-Math.max(0, f - T0 - dur) / 5) * (f >= T0 + dur ? 1 : 0);
          const txt = `${num(distancia.total * u, distancia.dec ?? 0)} ${distancia.unidad}`;
          return (
            <g transform={`translate(${esq[0]},${esq[1]}) scale(${eD * late})`}>
              <rect x={-122} y={-36} width={244} height={70} rx={20} fill="#fff" stroke={acento} strokeWidth={5} />
              <text y={14} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={42} fill="#2a2420">{txt}</text>
            </g>
          );
        })()}
        {titulo && (
          <g transform="translate(28,28)">
            <rect width={titulo.length * 21 + 48} height={56} rx={14} fill={plano ? "#e8f0ff" : "#2a2420"} />
            <text x={24} y={39} fontFamily={F_HUD} fontWeight={600} fontSize={32} fill={plano ? "#1d3a78" : "#fff"} letterSpacing={2}>{titulo}</text>
          </g>
        )}
      </g>
    </svg>
  );
};

export const foleyMapa = (p: Pick<MapaProps, "desde" | "dur" | "puntos">): Cue[] => {
  const d = p.desde, dur = p.dur ?? 100, pts = p.puntos, n = pts.length;
  const c: Cue[] = [cue(d, "paper", -6), cue(d + 10, "pop", -8), cue(d + T0, "whoosh", -10)];
  // el pop cae cuando el viajero llega a cada pin (mismo reparto por largo que el dibujo); las «via» no suenan
  let L = 0; const acc = [0];
  for (let k = 1; k < n; k++) { L += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y); acc.push(L); }
  for (let i = 1; i < n; i++) {
    if (pts[i].via) continue;
    const t = tiempoDe(L ? acc[i] / L : 0);
    c.push(cue(d + T0 + dur * t, i === n - 1 ? "ding" : "pop", i === n - 1 ? -6 : -9));
  }
  return c;
};
