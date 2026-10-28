// Sets 2D planos de Londres 1348 (canales del stickman blanco). Mismo patrón que anikit/sets: 3 capas, coordenadas
// del mundo en px, piso de los personajes en y = PISO. Todo plano, sin texturas ni filtros, determinista por cuadro.
//   CalleMedieval  x -800 … 6400 · trapero 900, panadería 2050, fuente 2650, taberna 3500, posada 4300, río 5600
//                  variante: "dia" | "peste" (cruces, persianas, carro)   momento: "noche" | "amanecer" (de anikit)
//   Taberna        x -300 … 2700 · barra 600, mesa 1250, fogón 2050 · variante "posada": cama de paja 1500
//   Puerto         x -400 … 4200 · muelle hasta 2500, barco 3000, soga 2300-2900
//   Muralla        x -600 … 5200 · puerta de Aldgate 900, camino al campo 1800-5000 · `hora` 0 (tarde) … 1 (ocaso)
import React from "react";
import { interpolate, random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo, Colinas, Nube, Pajaros, SetProps, acl, osc } from "../../anikit/sets/comun";
import { Paleta } from "../../anikit/paletas";

export const PISO = 900;
export const CALLE_M = { trapero: 900, panaderia: 2050, fuente: 2650, taberna: 3500, posada: 4300, rio: 5600 };
export const TABERNA_M = { barra: 600, mesa: 1250, cama: 1500, fogon: 2050 };
export const PUERTO_M = { muelle: 1400, soga: 2300, barco: 3000 };
export const MURALLA_M = { puerta: 900, carro: 1700, colina: 3600 };

export const PAL_LONDRES: Paleta = {
  nombre: "londres", cielo: ["#7fa9c4", "#c3d4cf", "#f1e2c0"], fachada: ["#e8d6ae", "#dcc49a", "#efe0bf", "#d6b98c"], ladrillo: "#6b4a32",
  piso: "#6e5238", vereda: "#8c6b4a", calle: "#5b4431", luz: "#ffcf7a", luzFria: "#a9c4e0", ventana: "#ffd98a", ventanaApagada: "#3a2a20",
  acento: "#ff5a3c", texto: "#fff6e6", sombra: "#2a1a10",
};

const VIGA = "#4a3020";
const s = (k: string) => random(k);
const lento = (f: number, hz: number, fase = 0) => Math.sin((f / 30) * hz * 2 * Math.PI + fase); // ≤2 Hz siempre

// ── piezas ─────────────────────────────────────────────────────────────────────────────────────────────────────────
// casa de entramado con pisos que sobresalen (jettying): cada piso un poco más ancho y corrido
const CasaEntramado: React.FC<{ x: number; w: number; pisos: number; seed: number; pal: Paleta; f: number; peste?: boolean; noche?: boolean; tienda?: React.ReactNode }> = ({ x, w, pisos, seed, pal, f, peste, noche, tienda }) => {
  const alto = 175;
  const yoko = (r: number) => r * 18; // cuánto sobresale el piso r
  const rev = pal.fachada[Math.floor(s(`cf${seed}`) * pal.fachada.length)];
  const techo = ["#7a3f2a", "#5c4636", "#8a5a3a"][Math.floor(s(`ct${seed}`) * 3)];
  const top = PISO - pisos * alto;
  const inclina = (s(`ci${seed}`) - 0.5) * 3; // casas torcidas
  return (
    <g transform={`rotate(${inclina} ${x + w / 2} ${PISO})`}>
      {Array.from({ length: pisos }).map((_, r) => {
        const y0 = PISO - (r + 1) * alto, ww = w + yoko(r) * 2, xx = x - yoko(r);
        return (
          <g key={r}>
            <rect x={xx} y={y0} width={ww} height={alto} fill={rev} />
            {/* entramado: postes, travesaño y cruces */}
            {Array.from({ length: Math.max(2, Math.round(ww / 120)) + 1 }).map((__, c, arr) => {
              const px = xx + (ww / (arr.length - 1)) * c;
              return <rect key={c} x={px - 6} y={y0} width={12} height={alto} fill={VIGA} />;
            })}
            <rect x={xx} y={y0} width={ww} height={12} fill={VIGA} />
            <rect x={xx} y={y0 + alto / 2 - 5} width={ww} height={10} fill={VIGA} opacity={0.9} />
            {r > 0 && <path d={`M${xx} ${y0 + alto} L${xx + 28} ${y0 + alto + 22} L${xx + ww - 28} ${y0 + alto + 22} L${xx + ww} ${y0 + alto} Z`} fill={osc(VIGA, 0.8)} />}
            {/* ventanas de postigo */}
            {r > 0 && Array.from({ length: Math.max(1, Math.round(ww / 190)) }).map((__, c, arr) => {
              const vx = xx + (ww / arr.length) * (c + 0.5) - 34, vy = y0 + 34;
              const on = noche ? s(`vn${seed}${r}${c}`) > 0.55 : false;
              const cerrada = peste && s(`vp${seed}${r}${c}`) > 0.3;
              return (
                <g key={c}>
                  {on && <Halo x={vx + 34} y={vy + 45} r={120} color={pal.ventana} fuerza={0.25} />}
                  <rect x={vx} y={vy} width={68} height={90} rx={4} fill={on ? pal.ventana : osc(rev, 0.35)} />
                  {!cerrada && <path d={`M${vx + 34} ${vy} V${vy + 90} M${vx} ${vy + 45} H${vx + 68}`} stroke={VIGA} strokeWidth={6} />}
                  {cerrada ? <rect x={vx - 2} y={vy - 2} width={72} height={94} rx={3} fill="#6a4a30" stroke={VIGA} strokeWidth={5} />
                    : <><rect x={vx - 30} y={vy} width={28} height={90} fill="#7a5436" stroke={VIGA} strokeWidth={4} /><rect x={vx + 70} y={vy} width={28} height={90} fill="#7a5436" stroke={VIGA} strokeWidth={4} /></>}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* techo a dos aguas */}
      <path d={`M${x - yoko(pisos - 1) - 40} ${top + 4} L${x + w / 2} ${top - 150 - s(`th${seed}`) * 60} L${x + w + yoko(pisos - 1) + 40} ${top + 4} Z`} fill={techo} />
      <path d={`M${x - yoko(pisos - 1) - 40} ${top + 4} L${x + w / 2} ${top - 150 - s(`th${seed}`) * 60}`} stroke={osc(techo, 0.7)} strokeWidth={10} />
      {/* chimenea con humo */}
      <rect x={x + w * 0.7} y={top - 120} width={34} height={90} fill="#6d5a4a" />
      {[0, 1, 2].map((k) => {
        const u = ((f / 30) * 0.18 + k / 3 + s(`hm${seed}`)) % 1;
        return <circle key={k} cx={x + w * 0.7 + 17 + u * 60 + lento(f, 0.3, k) * 8} cy={top - 130 - u * 220} r={18 + u * 40} fill="#d9d2c6" opacity={0.45 * (1 - u)} />;
      })}
      {/* planta baja: puerta y tienda */}
      <rect x={x + w * 0.12} y={PISO - 150} width={70} height={150} rx={30} fill="#4b3020" />
      <circle cx={x + w * 0.12 + 58} cy={PISO - 72} r={5} fill="#c9a04a" />
      {peste && s(`cz${seed}`) > 0.35 && (
        <g transform={`translate(${x + w * 0.12 + 35},${PISO - 92})`}>
          <path d="M-26 -6 H26 M0 -40 V40" stroke={pal.acento} strokeWidth={12} strokeLinecap="round" />
        </g>
      )}
      {tienda}
    </g>
  );
};

const Toldo: React.FC<{ x: number; w: number; y: number; c1: string; c2: string; f: number }> = ({ x, w, y, c1, c2, f }) => {
  const n = Math.round(w / 40), ond = lento(f, 0.4) * 3;
  return (
    <g>
      <path d={`M${x} ${y} L${x + w} ${y} L${x + w + 30} ${y + 70 + ond} L${x - 30} ${y + 70 + ond} Z`} fill={c1} />
      {Array.from({ length: n }).map((_, i) => i % 2 === 0 && (
        <path key={i} d={`M${x + (w / n) * i} ${y} L${x + (w / n) * (i + 1)} ${y} L${x - 30 + ((w + 60) / n) * (i + 1)} ${y + 70 + ond} L${x - 30 + ((w + 60) / n) * i} ${y + 70 + ond} Z`} fill={c2} />
      ))}
      {Array.from({ length: n }).map((_, i) => <circle key={i} cx={x - 30 + ((w + 60) / n) * (i + 0.5)} cy={y + 72 + ond} r={13} fill={i % 2 ? c1 : c2} />)}
    </g>
  );
};

const Puesto: React.FC<{ x: number; w?: number; tipo: "pan" | "repollo" | "trapos" | "pescado"; f: number }> = ({ x, w = 260, tipo, f }) => {
  const col = { pan: ["#c0392b", "#f3e3c3"], repollo: ["#3c7a4a", "#e9e2c6"], trapos: ["#5a4a8a", "#e8dcc0"], pescado: ["#2f6a8a", "#e8e0c8"] }[tipo];
  return (
    <g>
      <rect x={x + 6} y={PISO - 250} width={10} height={250} fill={VIGA} /><rect x={x + w - 16} y={PISO - 250} width={10} height={250} fill={VIGA} />
      <Toldo x={x} w={w} y={PISO - 270} c1={col[0]} c2={col[1]} f={f} />
      <rect x={x - 10} y={PISO - 110} width={w + 20} height={20} rx={4} fill="#8a5a36" />
      <rect x={x} y={PISO - 90} width={w} height={90} fill="#6e4a2e" />
      {Array.from({ length: 6 }).map((_, i) => {
        const cx = x + 30 + i * ((w - 60) / 5), cy = PISO - 122;
        if (tipo === "pan") return <ellipse key={i} cx={cx} cy={cy} rx={24} ry={15} fill="#c98a3c" stroke="#8a5420" strokeWidth={3} />;
        if (tipo === "repollo") return <g key={i}><circle cx={cx} cy={cy} r={20} fill="#7cc46a" /><path d={`M${cx - 12} ${cy} Q${cx} ${cy - 14} ${cx + 12} ${cy}`} stroke="#3c7a3a" strokeWidth={3} fill="none" /></g>;
        if (tipo === "pescado") return <path key={i} d={`M${cx - 26} ${cy} Q${cx} ${cy - 14} ${cx + 18} ${cy} Q${cx} ${cy + 14} ${cx - 26} ${cy} M${cx + 18} ${cy} L${cx + 30} ${cy - 10} L${cx + 30} ${cy + 10} Z`} fill="#9fb8c4" />;
        return <rect key={i} x={cx - 22} y={cy - 18 + (i % 2) * 6} width={44} height={30} rx={6} fill={["#8a4a4a", "#4a6a8a", "#8a7a4a"][i % 3]} />;
      })}
    </g>
  );
};

const Cartel: React.FC<{ x: number; y: number; dibujo: "pan" | "jarra" | "cama" | "trapo"; f: number }> = ({ x, y, dibujo, f }) => {
  const r = lento(f, 0.5) * 4;
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <rect x={x - 70} y={y - 6} width={140} height={10} fill={VIGA} />
      <path d={`M${x - 40} ${y} V${y + 30} M${x + 40} ${y} V${y + 30}`} stroke="#2a1a10" strokeWidth={3} />
      <rect x={x - 60} y={y + 30} width={120} height={84} rx={10} fill="#e9c98a" stroke={VIGA} strokeWidth={6} />
      {dibujo === "pan" && <ellipse cx={x} cy={y + 72} rx={36} ry={20} fill="#c98a3c" />}
      {dibujo === "jarra" && <g><rect x={x - 22} y={y + 46} width={40} height={52} rx={6} fill="#b5763a" /><path d={`M${x + 18} ${y + 56} q22 14 0 30`} stroke="#b5763a" strokeWidth={7} fill="none" /><ellipse cx={x - 2} cy={y + 46} rx={24} ry={9} fill="#fff6e0" /></g>}
      {dibujo === "cama" && <g><rect x={x - 40} y={y + 70} width={80} height={18} rx={4} fill="#8a5a36" /><rect x={x - 40} y={y + 58} width={30} height={16} rx={6} fill="#fff" /><path d={`M${x - 44} ${y + 98} V${y + 54} M${x + 44} ${y + 98} V${y + 66}`} stroke="#5a3a20" strokeWidth={6} /></g>}
      {dibujo === "trapo" && <path d={`M${x - 30} ${y + 50} L${x + 30} ${y + 50} L${x + 24} ${y + 100} L${x - 24} ${y + 100} Z`} fill="#8a4a6a" />}
    </g>
  );
};

const Fuente: React.FC<{ x: number; f: number }> = ({ x, f }) => (
  <g>
    <rect x={x - 90} y={PISO - 90} width={180} height={90} rx={10} fill="#9a9488" />
    <rect x={x - 90} y={PISO - 96} width={180} height={16} rx={6} fill="#b8b2a4" />
    <rect x={x - 14} y={PISO - 220} width={28} height={130} fill="#8a8478" />
    <path d={`M${x + 14} ${PISO - 190} q40 0 44 40`} stroke="#8a8478" strokeWidth={12} fill="none" />
    {[0, 1, 2, 3].map((k) => { const u = ((f / 30) * 1.5 + k / 4) % 1; return <circle key={k} cx={x + 58} cy={PISO - 150 + u * 60} r={6 - u * 2} fill="#9fd0e8" opacity={0.9 - u * 0.5} />; })}
    <ellipse cx={x} cy={PISO - 88} rx={80} ry={8} fill="#7fb8d4" />
  </g>
);

const Horno: React.FC<{ x: number; f: number }> = ({ x, f }) => {
  const b = 0.75 + 0.25 * lento(f, 1.2) * lento(f, 0.7, 1);
  return (
    <g>
      <path d={`M${x - 110} ${PISO} V${PISO - 140} Q${x} ${PISO - 260} ${x + 110} ${PISO - 140} V${PISO} Z`} fill="#a4543a" />
      <path d={`M${x - 50} ${PISO - 40} V${PISO - 90} Q${x} ${PISO - 140} ${x + 50} ${PISO - 90} V${PISO - 40} Z`} fill="#2a120a" />
      <Halo x={x} y={PISO - 80} r={160} color="#ff9a3c" fuerza={0.35 * b} />
      <path d={`M${x - 36} ${PISO - 44} Q${x} ${PISO - 100 - b * 14} ${x + 36} ${PISO - 44} Z`} fill="#ffb347" opacity={b} />
    </g>
  );
};

// barro con charcos
const Barro: React.FC<{ x0: number; x1: number; pal: Paleta; luz?: string }> = ({ x0, x1, pal, luz }) => (
  <g>
    <rect x={x0} y={PISO - 4} width={x1 - x0} height={900} fill={pal.calle} />
    <rect x={x0} y={PISO - 4} width={x1 - x0} height={14} fill={osc(pal.calle, 0.75)} />
    {Array.from({ length: Math.round((x1 - x0) / 420) }).map((_, i) => (
      <ellipse key={i} cx={x0 + 200 + i * 420 + s(`ch${i}`) * 120} cy={PISO + 40 + s(`cy${i}`) * 60} rx={70 + s(`cr${i}`) * 60} ry={12} fill={luz ?? acl(pal.cielo[1], 0.1)} opacity={0.55} />
    ))}
    {Array.from({ length: Math.round((x1 - x0) / 160) }).map((_, i) => (
      <ellipse key={`p${i}`} cx={x0 + i * 160 + s(`pp${i}`) * 80} cy={PISO + 20 + s(`py${i}`) * 120} rx={10 + s(`pr${i}`) * 10} ry={5} fill={osc(pal.calle, 0.7)} />
    ))}
  </g>
);

// ── animales 2D (los personajes son 3D; los bichos van planos y caminan en ciclo) ─────────────────────────────────
export const Cerdo: React.FC<{ x: number; y?: number; dir?: 1 | -1; f: number; s?: number }> = ({ x, y = PISO, dir = 1, f, s: k = 1 }) => {
  const p = lento(f, 1.6) * 6;
  return (
    <g transform={`translate(${x},${y}) scale(${dir * k},${k})`}>
      <rect x={-40} y={-20} width={10} height={22} rx={4} fill="#d98a8a" transform={`rotate(${p} -35 -20)`} /><rect x={24} y={-20} width={10} height={22} rx={4} fill="#d98a8a" transform={`rotate(${-p} 29 -20)`} />
      <ellipse cx={0} cy={-46} rx={62} ry={38} fill="#f2a7a7" />
      <circle cx={56} cy={-56} r={28} fill="#f2a7a7" /><ellipse cx={80} cy={-52} rx={12} ry={10} fill="#e58f8f" />
      <circle cx={77} cy={-54} r={2.5} fill="#7a3a3a" /><circle cx={84} cy={-54} r={2.5} fill="#7a3a3a" />
      <circle cx={60} cy={-66} r={4} fill="#2a1a1a" /><path d="M46 -80 l-8 -16 l18 8 Z" fill="#e58f8f" />
      <path d={`M-62 -52 q-18 ${-10 + p} -8 -24`} stroke="#e58f8f" strokeWidth={5} fill="none" />
      <path d="M-50 -24 q30 10 80 0" stroke="#a96a5a" strokeWidth={3} fill="none" opacity={0.4} />
    </g>
  );
};
export const Gallina: React.FC<{ x: number; dir?: 1 | -1; f: number; fase?: number }> = ({ x, dir = 1, f, fase = 0 }) => {
  const pica = Math.max(0, lento(f, 0.7, fase)) * 20;
  return (
    <g transform={`translate(${x},${PISO}) scale(${dir},1)`}>
      <path d="M-6 0 V-20 M8 0 V-20" stroke="#e0a030" strokeWidth={4} />
      <ellipse cx={0} cy={-38} rx={30} ry={22} fill="#f4efe4" />
      <g transform={`rotate(${pica} 18 -46)`}><circle cx={24} cy={-60} r={14} fill="#f4efe4" /><path d="M36 -62 l12 4 l-12 4 Z" fill="#e0a030" /><path d="M18 -74 q4 -10 10 0 q4 -8 8 2" fill="#d6453a" /><circle cx={28} cy={-63} r={2.5} fill="#222" /></g>
      <path d="M-28 -44 q-16 -16 -6 -26 q6 10 14 14" fill="#e8e0d0" />
    </g>
  );
};
export const Rata: React.FC<{ x: number; y: number; ang?: number; f: number; fase?: number; s?: number }> = ({ x, y, ang = 0, f, fase = 0, s: k = 1 }) => {
  const p = lento(f, 2, fase) * 5;
  return (
    <g transform={`translate(${x},${y}) rotate(${ang}) scale(${k})`}>
      <path d={`M-30 -10 q-30 ${8 + p} -54 -4`} stroke="#8a6e6e" strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-14} rx={32} ry={15} fill="#5e5354" />
      <path d="M24 -20 q22 2 26 10 q-14 6 -28 2 Z" fill="#5e5354" /><circle cx={50} cy={-10} r={3} fill="#e8a0a8" />
      <circle cx={20} cy={-28} r={8} fill="#7a6e6f" /><circle cx={20} cy={-28} r={4} fill="#e8a0a8" /><circle cx={36} cy={-18} r={2.5} fill="#ff4a3d" />
      <path d={`M-14 0 v${4 + p} M14 0 v${4 - p}`} stroke="#4a4041" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
export const Gato: React.FC<{ x: number; y: number; dir?: 1 | -1; f: number; s?: number; enojado?: boolean }> = ({ x, y, dir = 1, f, s: k = 1, enojado = true }) => {
  const c = lento(f, 0.8) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${dir * k},${k})`}>
      <path d={`M-30 -20 q-34 ${-10 + c} -26 -60`} stroke="#c8833a" strokeWidth={9} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-26} rx={34} ry={20} fill="#d8933f" />
      <path d="M-10 -40 l6 22 M4 -42 l6 22" stroke="#a8632a" strokeWidth={4} />
      <circle cx={30} cy={-50} r={20} fill="#d8933f" /><path d="M16 -64 l2 -20 l12 12 Z M34 -66 l10 -18 l4 18 Z" fill="#d8933f" />
      <path d={enojado ? "M22 -56 l10 4 M42 -56 l-8 4" : "M22 -54 h8 M36 -54 h8"} stroke="#3a2010" strokeWidth={3} />
      <circle cx={27} cy={-50} r={3} fill="#2a2a10" /><circle cx={39} cy={-50} r={3} fill="#2a2a10" />
      <path d="M40 -40 h18 M40 -36 l16 4" stroke="#3a2010" strokeWidth={1.5} />
      <path d="M20 -46 l8 10" stroke="#fff" strokeWidth={2} opacity={0.6} />
      <path d="M-18 -8 v8 M14 -8 v8" stroke="#a8632a" strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};
export const Perro: React.FC<{ x: number; dir?: 1 | -1; f: number; anda?: boolean }> = ({ x, dir = 1, f, anda = true }) => {
  const p = anda ? lento(f, 1.8) * 14 : 0, cola = lento(f, 1.5) * 18;
  return (
    <g transform={`translate(${x},${PISO}) scale(${dir},1)`}>
      <path d={`M-40 -50 q-24 -20 ${-20 + cola * 0.4} -48`} stroke="#8a6a4a" strokeWidth={8} fill="none" strokeLinecap="round" />
      <rect x={-40} y={-30} width={9} height={30} rx={4} fill="#7a5a3a" transform={`rotate(${p} -36 -30)`} /><rect x={22} y={-30} width={9} height={30} rx={4} fill="#7a5a3a" transform={`rotate(${-p} 26 -30)`} />
      <ellipse cx={-4} cy={-50} rx={46} ry={22} fill="#9a7a56" />
      <circle cx={46} cy={-72} r={22} fill="#9a7a56" /><ellipse cx={66} cy={-64} rx={14} ry={9} fill="#9a7a56" /><circle cx={78} cy={-66} r={5} fill="#2a1a10" />
      <path d="M36 -90 q-14 10 -8 34 q10 -6 14 -26 Z" fill="#6a4a30" /><circle cx={52} cy={-76} r={3.5} fill="#1a1a1a" />
    </g>
  );
};

// carro de madera (tirado a mano o con heno); `heno` 0..1 = cuánto lleva; `carga` opcional (bultos tapados)
export const Carro: React.FC<{ x: number; f: number; heno?: boolean; tapado?: boolean; ruedaGira?: number }> = ({ x, f, heno, tapado, ruedaGira = 0 }) => (
  <g transform={`translate(${x},${PISO})`}>
    <rect x={-170} y={-120} width={340} height={60} rx={6} fill="#8a5a36" stroke={VIGA} strokeWidth={6} />
    {heno && <path d={`M-180 -120 Q-150 -230 -40 -236 Q60 -262 150 -214 Q196 -180 180 -120 Z`} fill="#e9c35a" />}
    {heno && Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${-160 + i * 21} ${-150 - s(`hy${i}`) * 70} l${(s(`hx${i}`) - 0.5) * 30} -26`} stroke="#c99a30" strokeWidth={4} strokeLinecap="round" />)}
    {tapado && <path d="M-160 -120 Q-120 -190 -20 -186 Q80 -200 160 -120 Z" fill="#6e6a5e" />}
    <path d="M170 -90 L300 -70" stroke={VIGA} strokeWidth={10} strokeLinecap="round" />
    {[-100, 100].map((cx) => (
      <g key={cx} transform={`translate(${cx},-44) rotate(${ruedaGira})`}>
        <circle r={44} fill="none" stroke="#5a3a20" strokeWidth={10} />
        {[0, 45, 90, 135].map((a) => <path key={a} d="M-40 0 H40" stroke="#5a3a20" strokeWidth={6} transform={`rotate(${a})`} />)}
        <circle r={9} fill="#3a2414" />
      </g>
    ))}
  </g>
);

// ── SET: calle medieval (Cheapside) ────────────────────────────────────────────────────────────────────────────────
export const CalleMedieval: React.FC<SetProps & { peste?: boolean }> = ({ capa, f, pal, variante }) => {
  const peste = variante === "peste";
  const noche = pal.cielo[0] < "#30";
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={pal.cielo} x={-3000} w={14000} />
        {!noche && [0, 1, 2, 3].map((k) => <Nube key={k} x={-600 + k * 1500 + ((f * 0.2) % 400)} y={140 + k * 40} s={1 + (k % 2) * 0.4} color={acl(pal.cielo[2], 0.5)} />)}
        {/* silueta de techos y la vieja catedral de San Pablo con su aguja altísima */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = -1500 + i * 300, h = 200 + s(`sk${i}`) * 160;
          return <path key={i} d={`M${x} ${PISO - 140} V${PISO - h} L${x + 140} ${PISO - h - 110} L${x + 290} ${PISO - h} V${PISO - 140} Z`} fill={osc(pal.cielo[2], 0.72)} />;
        })}
        <g fill={osc(pal.cielo[2], 0.62)}>
          <rect x={1700} y={PISO - 640} width={620} height={500} />
          <rect x={1900} y={PISO - 900} width={220} height={300} />
          <path d={`M1900 ${PISO - 900} L2010 ${PISO - 1500} L2120 ${PISO - 900} Z`} />
        </g>
        {peste && [0, 1, 2].map((k) => {
          const u = ((f / 30) * 0.05 + k / 3) % 1;
          return <circle key={k} cx={3600 + k * 900 + u * 200} cy={PISO - 500 - u * 500} r={140 + u * 220} fill="#4a4440" opacity={0.25 * (1 - u)} />;
        })}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        <rect x={-900} y={PISO + 150} width={8000} height={600} fill={osc(pal.calle, 0.6)} />
        {[400, 2350, 4000].map((x, i) => <rect key={i} x={x} y={PISO - 520} width={34} height={760} fill={osc(VIGA, 0.65)} />)}
      </g>
    );
  }
  // medio
  const casas: [number, number, number][] = [[-700, 380, 3], [-260, 300, 2], [120, 420, 3], [620, 360, 2], [1080, 400, 3], [1560, 330, 2], [1990, 380, 3], [3000, 330, 2], [3420, 420, 3], [3920, 360, 2], [4380, 420, 3], [4880, 300, 2]];
  return (
    <g>
      {casas.map(([x, w, p], i) => <CasaEntramado key={i} x={x} w={w} pisos={p} seed={i + 1} pal={pal} f={f} peste={peste} noche={noche} />)}
      {/* trapero, panadería, fuente, taberna, posada */}
      {!peste && <Puesto x={CALLE_M.trapero - 140} tipo="trapos" f={f} />}
      {!peste && <Puesto x={1500} tipo="repollo" f={f} />}
      <Horno x={CALLE_M.panaderia + 110} f={f} />
      <Cartel x={CALLE_M.panaderia - 40} y={PISO - 400} dibujo="pan" f={f} />
      {!peste && <Puesto x={CALLE_M.panaderia - 250} tipo="pan" f={f} w={220} />}
      <Fuente x={CALLE_M.fuente} f={f} />
      <Cartel x={CALLE_M.taberna} y={PISO - 420} dibujo="jarra" f={f} />
      <Cartel x={CALLE_M.posada} y={PISO - 420} dibujo="cama" f={f} />
      {!peste && <Puesto x={3100} tipo="pescado" f={f} />}
      {/* el río al final de la calle */}
      <rect x={5250} y={PISO - 60} width={2400} height={500} fill="#5f7f74" />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${5300 + i * 230 + lento(f, 0.3, i) * 20} ${PISO - 30 + (i % 3) * 30} h90`} stroke="#8fae9f" strokeWidth={5} strokeLinecap="round" />)}
      <rect x={5200} y={PISO - 70} width={80} height={80} fill="#7a6a5a" />
      <Barro x0={-1200} x1={5260} pal={pal} />
      {peste && <Carro x={3800} f={f} tapado />}
    </g>
  );
};

// ── SET: taberna / posada (interior) ───────────────────────────────────────────────────────────────────────────────
export const Taberna: React.FC<SetProps> = ({ capa, f, pal, variante }) => {
  const posada = variante === "posada";
  const noche = pal.cielo[0] < "#30";
  const fuego = 0.75 + 0.25 * lento(f, 1.3) * lento(f, 0.8, 2);
  if (capa === "lejos") return <rect x={-3000} y={-2000} width={9000} height={5000} fill={noche ? "#1c140e" : "#3a2818"} />;
  if (capa === "frente") return <g><rect x={-1000} y={-200} width={5000} height={60} fill={osc(VIGA, 0.6)} />{[-200, 2500].map((x) => <rect key={x} x={x} y={-200} width={60} height={2000} fill={osc(VIGA, 0.6)} />)}</g>;
  return (
    <g>
      <rect x={-600} y={-300} width={3800} height={PISO + 300} fill="#8a6440" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-600} y={-300 + i * 90} width={3800} height={4} fill="#6e4e30" opacity={0.6} />)}
      {[-300, 400, 1100, 1800, 2500].map((x) => <rect key={x} x={x} y={-300} width={44} height={PISO + 300} fill={VIGA} />)}
      <rect x={-600} y={120} width={3800} height={40} fill={VIGA} />
      {/* ventana con luna o sol */}
      <rect x={880} y={260} width={220} height={260} rx={110} fill={noche ? "#1d2a44" : "#cfe2ea"} stroke={VIGA} strokeWidth={14} />
      {noche ? <circle cx={1030} cy={340} r={34} fill="#fff4cf" /> : <circle cx={960} cy={330} r={30} fill="#fff7d0" />}
      <path d="M990 260 V520 M880 390 H1100" stroke={VIGA} strokeWidth={8} />
      {/* fogón */}
      <rect x={TABERNA_M.fogon - 200} y={PISO - 420} width={400} height={420} fill="#8a8478" />
      <rect x={TABERNA_M.fogon - 230} y={PISO - 440} width={460} height={40} fill="#a49e90" />
      <path d={`M${TABERNA_M.fogon - 120} ${PISO} V${PISO - 200} Q${TABERNA_M.fogon} ${PISO - 300} ${TABERNA_M.fogon + 120} ${PISO - 200} V${PISO} Z`} fill="#1e120c" />
      <Halo x={TABERNA_M.fogon} y={PISO - 90} r={520} color="#ff9a40" fuerza={0.35 * fuego} />
      {[-40, 0, 40].map((dx, k) => <path key={k} d={`M${TABERNA_M.fogon + dx - 34} ${PISO - 20} Q${TABERNA_M.fogon + dx} ${PISO - 130 - fuego * 50 * (k === 1 ? 1.3 : 1)} ${TABERNA_M.fogon + dx + 34} ${PISO - 20} Z`} fill={k === 1 ? "#ffd27a" : "#ff8a3a"} opacity={0.95} />)}
      <path d={`M${TABERNA_M.fogon - 40} ${PISO - 380} q20 -40 0 -80`} stroke="#3a3a3a" strokeWidth={8} fill="none" />
      {/* estantes con jarras */}
      <rect x={-500} y={360} width={700} height={16} fill={VIGA} />
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={-480 + i * 96} y={300} width={50} height={60} rx={8} fill={["#b5763a", "#8a8a8a", "#a46a3a"][i % 3]} />)}
      {/* barriles */}
      {[[-380, 1], [-200, 1], [-290, 0]].map(([x, b], i) => (
        <g key={i} transform={`translate(${x},${PISO - (b ? 0 : 170)})`}>
          <rect x={-80} y={-170} width={160} height={170} rx={40} fill="#9a6a3a" />
          <path d="M-80 -130 H80 M-80 -40 H80" stroke="#5a5048" strokeWidth={10} />
          <circle cx={0} cy={-85} r={14} fill="#5a3a20" />
        </g>
      ))}
      {/* barra */}
      {!posada && <g><rect x={TABERNA_M.barra - 250} y={PISO - 200} width={500} height={200} fill="#7a4e2c" /><rect x={TABERNA_M.barra - 270} y={PISO - 220} width={540} height={28} rx={6} fill="#a46a3a" /></g>}
      {/* mesa con bancos */}
      {!posada && <g>
        <rect x={TABERNA_M.mesa - 260} y={PISO - 180} width={520} height={26} rx={6} fill="#a46a3a" />
        <rect x={TABERNA_M.mesa - 220} y={PISO - 154} width={22} height={154} fill="#7a4e2c" /><rect x={TABERNA_M.mesa + 198} y={PISO - 154} width={22} height={154} fill="#7a4e2c" />
        <rect x={TABERNA_M.mesa - 140} y={PISO - 236} width={44} height={56} rx={7} fill="#b5763a" /><ellipse cx={TABERNA_M.mesa - 118} cy={PISO - 236} rx={24} ry={8} fill="#fff4dc" />
        <circle cx={TABERNA_M.mesa + 120} cy={PISO - 196} r={22} fill="#c98a3c" />
      </g>}
      {/* cama compartida de paja */}
      {posada && <g>
        <rect x={TABERNA_M.cama - 420} y={PISO - 150} width={840} height={110} rx={12} fill="#7a4e2c" />
        <path d={`M${TABERNA_M.cama - 410} ${PISO - 150} Q${TABERNA_M.cama} ${PISO - 220} ${TABERNA_M.cama + 410} ${PISO - 150} Z`} fill="#e2c062" />
        {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M${TABERNA_M.cama - 400 + i * 38} ${PISO - 160 - s(`pj${i}`) * 30} l${(s(`pq${i}`) - 0.5) * 30} -18`} stroke="#c49a3a" strokeWidth={4} strokeLinecap="round" />)}
        {/* los cinco desconocidos: bultos bajo la manta que respiran (uno ronca más fuerte) */}
        {[0, 1, 2, 3, 4].map((k) => {
          const r = 1 + 0.06 * lento(f, k === 2 ? 0.35 : 0.25, k) ;
          return <g key={k} transform={`translate(${TABERNA_M.cama - 330 + k * 165},${PISO - 172}) scale(1,${r})`}>
            <ellipse cx={0} cy={0} rx={78} ry={34} fill={["#8a4a3a", "#4a6a7a", "#7a7a4a", "#6a4a7a", "#4a7a5a"][k]} />
            <circle cx={-70} cy={-14} r={26} fill={["#d6a27a", "#c08a5a", "#e2b48a", "#a8744a", "#d8a07a"][k]} />
          </g>;
        })}
      </g>}
      <rect x={-600} y={PISO - 6} width={3800} height={700} fill="#5a3e26" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-600 + i * 320} y={PISO - 6} width={6} height={700} fill="#4a321e" />)}
    </g>
  );
};

// ── SET: puerto del Támesis ────────────────────────────────────────────────────────────────────────────────────────
export const Puerto: React.FC<SetProps & { cuerda?: boolean }> = ({ capa, f, pal }) => {
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={pal.cielo} x={-3000} w={12000} />
        {[0, 1, 2].map((k) => <Nube key={k} x={-200 + k * 1700 + ((f * 0.25) % 300)} y={180 + k * 50} s={1.3} color={acl(pal.cielo[2], 0.5)} />)}
        <Pajaros x={600} y={260} f={f} />
        {/* la otra orilla: Southwark */}
        {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-1200 + i * 280} y={PISO - 240 - s(`so${i}`) * 120} width={220} height={260} fill={osc(pal.cielo[2], 0.7)} />)}
        <rect x={-3000} y={PISO - 30} width={12000} height={900} fill="#5f7f74" />
      </g>
    );
  }
  if (capa === "frente") return <g>{[600, 2600].map((x) => <rect key={x} x={x} y={PISO - 40} width={46} height={600} fill={osc(VIGA, 0.6)} />)}</g>;
  const ola = (i: number) => lento(f, 0.25, i) * 14;
  const bx = PUERTO_M.barco, by = PISO + 60 + lento(f, 0.2) * 8; // el barco cabecea apenas
  return (
    <g>
      {/* agua */}
      <rect x={-1000} y={PISO + 20} width={6000} height={800} fill="#4f6f66" />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${-800 + i * 380 + ola(i)} ${PISO + 70 + (i % 4) * 50} h120`} stroke="#86a597" strokeWidth={6} strokeLinecap="round" />)}
      {/* barco (coca) */}
      <g transform={`translate(${bx},${by}) rotate(${lento(f, 0.2, 1) * 1.2})`}>
        <path d="M-520 -260 L520 -260 L420 0 L-420 0 Z" fill="#6a4228" />
        <path d="M-520 -260 L520 -260 L510 -230 L-510 -230 Z" fill="#8a5a36" />
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M${-500 + i * 10} ${-200 + i * 45} H${500 - i * 20}`} stroke="#4a2c18" strokeWidth={5} />)}
        <rect x={-560} y={-380} width={200} height={130} fill="#7a4e2c" /><rect x={360} y={-360} width={180} height={110} fill="#7a4e2c" />
        <rect x={-14} y={-1050} width={28} height={800} fill="#5a3a20" />
        <path d={`M-12 -1000 Q${-330 + lento(f, 0.3) * 20} -800 -12 -560 Z`} fill="#efe6cc" />
        <path d="M-12 -1000 L-12 -560" stroke="#c9b98a" strokeWidth={4} />
        <path d={`M-12 -980 L-480 -380 M14 -980 L460 -360`} stroke="#3a2a1a" strokeWidth={3} />
        <rect x={-20} y={-1080} width={40} height={30} fill="#c0392b" />
        <path d={`M20 -1074 l${60 + lento(f, 0.5) * 6} 10 l-60 10 Z`} fill="#3a6aa8" />
      </g>
      {/* muelle de tablas */}
      <rect x={-1000} y={PISO - 6} width={3600} height={50} fill="#8a6440" />
      {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-1000 + i * 150} y={PISO - 6} width={5} height={50} fill="#5a3e26" />)}
      {[-700, -100, 500, 1100, 1700, 2300].map((x) => <rect key={x} x={x} y={PISO + 40} width={34} height={500} fill="#5a3e26" />)}
      {/* cajones y barriles */}
      {[[200, 0], [330, 0], [265, 1]].map(([x, l], i) => <g key={i}><rect x={x - 60} y={PISO - 120 - l * 120} width={120} height={120} fill="#a47a4a" stroke="#6a4a2a" strokeWidth={6} /><path d={`M${x - 60} ${PISO - 120 - l * 120} L${x + 60} ${PISO - l * 120}`} stroke="#6a4a2a" strokeWidth={5} /></g>)}
      {[1900, 2050].map((x) => <g key={x}><rect x={x - 60} y={PISO - 150} width={120} height={150} rx={34} fill="#9a6a3a" /><path d={`M${x - 60} ${PISO - 115} h120 M${x - 60} ${PISO - 40} h120`} stroke="#5a5048" strokeWidth={9} /></g>)}
      {/* bolardo y soga al barco */}
      <rect x={PUERTO_M.soga - 30} y={PISO - 70} width={60} height={70} rx={10} fill="#3a3a3a" />
      <path d={`M${PUERTO_M.soga} ${PISO - 60} Q${(PUERTO_M.soga + bx - 380) / 2} ${PISO - 90} ${bx - 380} ${by - 250}`} stroke="#c9a46a" strokeWidth={9} fill="none" />
    </g>
  );
};
// punto sobre la soga (u 0 = bolardo, 1 = borda): para las ratas que bajan
export const puntoSoga = (u: number, f: number) => {
  const bx = PUERTO_M.barco, by = PISO + 60 + lento(f, 0.2) * 8;
  const p0 = [PUERTO_M.soga, PISO - 60], p2 = [bx - 380, by - 250], p1 = [(PUERTO_M.soga + bx - 380) / 2, PISO - 90];
  const x = (1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u ** 2 * p2[0];
  const y = (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u ** 2 * p2[1];
  const dx = 2 * (1 - u) * (p1[0] - p0[0]) + 2 * u * (p2[0] - p1[0]), dy = 2 * (1 - u) * (p1[1] - p0[1]) + 2 * u * (p2[1] - p1[1]);
  return { x, y, ang: (Math.atan2(dy, dx) * 180) / Math.PI };
};

// ── SET: muralla, puerta de Aldgate y el campo ─────────────────────────────────────────────────────────────────────
export const Muralla: React.FC<SetProps & { hora?: number }> = ({ capa, f, pal, hora = 0 }) => {
  const cielo: [string, string, string] = [
    interpolate(hora, [0, 1], [0, 1]) > 0.5 ? "#3b2c5a" : "#6f8fb8", hora > 0.5 ? "#e0786a" : "#c9b9b0", hora > 0.5 ? "#ffc27a" : "#f6d9a8",
  ];
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={cielo} x={-3000} w={12000} />
        <circle cx={3800} cy={PISO - 260 + hora * 200} r={120} fill="#ffe3a0" opacity={0.95} />
        <Halo x={3800} y={PISO - 260 + hora * 200} r={700} color="#ffb060" fuerza={0.35} />
        <Colinas y={PISO - 60} alto={220} color={osc("#7a9a5a", 0.8)} />
        <Pajaros x={2600} y={300} f={f} />
      </g>
    );
  }
  if (capa === "frente") return <g>{Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${1800 + i * 500} ${PISO + 260} q20 -90 40 0 q16 -70 34 0`} fill="#4f6a36" />)}</g>;
  const P = MURALLA_M.puerta;
  return (
    <g>
      {/* campo */}
      <rect x={1200} y={PISO - 6} width={6000} height={800} fill="#7a9a4a" />
      <path d={`M1300 ${PISO + 4} L5200 ${PISO - 10} L5200 ${PISO + 60} L1300 ${PISO + 90} Z`} fill="#b08a5a" />
      {Array.from({ length: 10 }).map((_, i) => <g key={i} transform={`translate(${1900 + i * 380},${PISO - 4})`}><rect x={-6} y={-60} width={12} height={60} fill="#6a4a2a" /><circle cy={-90} r={46 + s(`ar${i}`) * 20} fill={i % 2 ? "#5f8a3f" : "#6f9a47"} /></g>)}
      {/* puente sobre el foso */}
      <rect x={1150} y={PISO - 30} width={420} height={36} fill="#8a6440" />
      <path d={`M1150 ${PISO} Q1360 ${PISO + 90} 1570 ${PISO}`} stroke="#6a6458" strokeWidth={26} fill="none" />
      <rect x={1150} y={PISO + 40} width={420} height={200} fill="#4f6f66" />
      {/* muralla de piedra con almenas y la puerta */}
      <rect x={-1200} y={PISO - 620} width={1950 + 300} height={620} fill="#a39a88" />
      {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-1200 + i * 95} y={PISO - 680} width={60} height={70} fill="#a39a88" />)}
      {Array.from({ length: 60 }).map((_, i) => <rect key={`b${i}`} x={-1180 + (i % 15) * 150 + (Math.floor(i / 15) % 2) * 75} y={PISO - 600 + Math.floor(i / 15) * 150} width={130} height={6} fill="#8a8272" />)}
      <rect x={P - 220} y={PISO - 820} width={440} height={820} fill="#958c7a" />
      {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={P - 220 + i * 100} y={PISO - 880} width={60} height={70} fill="#958c7a" />)}
      <path d={`M${P - 150} ${PISO} V${PISO - 330} Q${P} ${PISO - 500} ${P + 150} ${PISO - 330} V${PISO} Z`} fill="#2a2018" />
      {/* rastrillo levantado */}
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={P - 140 + i * 45} y={PISO - 470} width={10} height={90} fill="#3a3a3a" />)}
      <rect x={P - 150} y={PISO - 400} width={300} height={10} fill="#3a3a3a" />
      <rect x={P - 60} y={PISO - 700} width={120} height={60} rx={8} fill="#c0392b" />
      <path d={`M${P - 30} ${PISO - 670} h60 M${P} ${PISO - 696} v52`} stroke="#f4e3a0" strokeWidth={8} />
      <rect x={-1200} y={PISO - 6} width={2400} height={800} fill="#6e5238" />
    </g>
  );
};
