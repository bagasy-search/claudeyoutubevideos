// SET · SUPERIOR STREET a nivel de vereda: fachadas de ladrillo de 2-4 pisos con vidrieras, la Holiday con surtidores,
// el cine NORSHOR (cartel vertical + marquesina), policía, bomberos, farmacia, dentista y ferretería. Autos quietos en
// la calle (capa frente, abajo), faroles y semáforos que cambian para nadie. Piso de la vereda: SUP_PISO.
// props: hora · luces 0..1 · nieve 0..1 · cae · rotulos (false = sin carteles)
import React from "react";
import { random } from "remotion";
import { Halo } from "../../anikit/luz";
import { Cielo, Ladrillos, SetProps, acl, osc } from "../../anikit/sets/comun";
import { AMBAR } from "../elenco";
import { Auto, Banco, COLORES_AUTO, Edificio, Estrellas, Farola, NieveCae, Semaforo, prendida } from "./comun";
import { Hora, LUCES } from "./hora";

export const SUP_PISO = 900;
export const SUP_PUNTOS = { holiday: 500, norshor: 1700, policia: 2500, bomberos: 3150, farmacia: 3850, dentista: 4450, ferreteria: 5050, semaforo1: 1150, semaforo2: 3500 };
// autos de la calle (frente): x y color. Exportado para encuadrar el del saco doblado.
export const SUP_AUTOS = Array.from({ length: 22 }).map((_, i) => ({ x: -500 + i * 290 + random(`sa${i}`) * 60, c: COLORES_AUTO[i % COLORES_AUTO.length], t: (["sedan", "suv", "pickup"] as const)[Math.floor(random(`st${i}`) * 3)], dir: (random(`sd${i}`) > 0.5 ? 1 : -1) as 1 | -1 }));

type P = SetProps & { hora?: Hora; luces?: number; nieve?: number; cae?: boolean; rotulos?: boolean };

const Cartel: React.FC<{ x: number; y: number; txt: string; fondo: string; color: string; on: number; tam?: number; w?: number }> = ({ x, y, txt, fondo, color, on, tam = 34, w }) => {
  const W = w ?? txt.length * tam * 0.68 + 40;
  return (
    <g>
      <rect x={x - W / 2} y={y - tam - 10} width={W} height={tam + 22} rx={6} fill={fondo} />
      <text x={x} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={tam} letterSpacing={3} fill={on > 0.3 ? color : osc(color, 0.45)}>{txt}</text>
      {on > 0.3 && <Halo x={x} y={y - tam / 2} r={W * 0.7} color={color} fuerza={0.25 * on} />}
    </g>
  );
};

const Fachada: React.FC<{ x: number; w: number; pisos: number; color: string; luces: number; seed: string; vidriera?: string; nieve: number }> = ({ x, w, pisos, color, luces, seed, vidriera = "#ffe2a0", nieve }) => {
  const P = SUP_PISO, h = 150 + pisos * 120;
  const on = prendida(`${seed}v`, luces, 0.95);
  return (
    <g>
      <rect x={x} y={P - h} width={w} height={h} fill={color} />
      <Ladrillos x={x} y={P - h} w={w} h={h - 150} color={osc(color, 0.8)} o={0.45} />
      <rect x={x - 8} y={P - h - 16} width={w + 16} height={20} fill={osc(color, 0.7)} />
      {nieve > 0 && <rect x={x - 10} y={P - h - 26} width={w + 20} height={12 * nieve} rx={5} fill="#eef2fa" />}
      {Array.from({ length: pisos }).map((_, r) => Array.from({ length: Math.floor((w - 40) / 110) }).map((__, c) => {
        const lit = prendida(`${seed}${r}${c}`, luces, 0.45);
        const wx = x + 40 + c * 110, wy = P - h + 40 + r * 120;
        return <g key={`${r}${c}`}><rect x={wx - 6} y={wy - 6} width={72} height={92} fill={osc(color, 0.7)} /><rect x={wx} y={wy} width={60} height={80} fill={lit ? AMBAR : "#221c2a"} opacity={lit ? 0.85 : 1} /><rect x={wx + 28} y={wy} width={4} height={80} fill={osc(color, 0.7)} /></g>;
      }))}
      {/* vidriera de planta baja */}
      <rect x={x + 20} y={P - 140} width={w - 40} height={130} fill={on ? vidriera : "#1e1a24"} opacity={on ? 0.75 : 1} />
      <rect x={x + 20} y={P - 150} width={w - 40} height={12} fill={osc(color, 0.6)} />
      {on && <Halo x={x + w / 2} y={P - 60} r={w * 0.6} color={vidriera} fuerza={0.3} />}
      {Array.from({ length: 3 }).map((_, k) => <rect key={k} x={x + 20 + ((w - 40) / 3) * (k + 1) - 3} y={P - 140} width={6} height={130} fill={osc(color, 0.6)} />)}
    </g>
  );
};

export const Superior: React.FC<P> = ({ capa, f, pal, hora = "dia", luces = 1, nieve = 0, cae = false, rotulos = true }) => {
  const L = LUCES[hora];
  const P = SUP_PISO;
  const noche = hora === "noche" || hora === "tormenta";
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={L.cielo} />
        <Estrellas f={f} o={L.estrellas} />
        {/* la colina de Duluth detrás, con casas */}
        <path d="M-2000,620 Q0,380 2000,450 Q4000,520 6000,380 L6000,1200 L-2000,1200 Z" fill={osc(L.tinte, 0.55)} />
        {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={-1500 + i * 150} y={520 + random(`hc${i}`) * 140} width={60} height={50} fill={osc(L.tinte, 0.45)} />)}
        {Array.from({ length: 50 }).map((_, i) => prendida(`hl${i}`, luces, 0.6) ? <rect key={`l${i}`} x={-1480 + i * 150} y={540 + random(`hc${i}`) * 140} width={14} height={14} fill={AMBAR} opacity={0.8} /> : null)}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {/* cordón y calle */}
        <rect x={-1500} y={P + 34} width={8000} height={14} fill={osc(pal.vereda, 0.7)} />
        <rect x={-1500} y={P + 48} width={8000} height={400} fill={noche ? "#1a1620" : osc(pal.calle, 1.3)} />
        <rect x={-1500} y={P + 448} width={8000} height={900} fill={nieve > 0.2 ? L.nieve : osc(pal.vereda, 0.85)} />
        <rect x={-1500} y={P + 440} width={8000} height={10} fill={osc(pal.vereda, 0.6)} />
        {nieve > 0 && <Banco x={-1500} w={8000} piso={P + 60} alto={50 * nieve} color={L.nieve} seed="sf" />}
        {SUP_AUTOS.map((a, i) => <Auto key={i} x={a.x} y={P + 190} color={a.c} tipo={a.t} dir={a.dir} nieve={nieve} s={1.15} />)}
        {cae && <NieveCae f={f} n={170} x0={-800} w={6600} y0={-200} h={1400} />}
      </g>
    );
  }
  // medio: fachadas + carteles + faroles
  const cols = [osc("#6a3a34", 0.85), osc("#5a4a5e", 0.9), osc("#7a4a3a", 0.85), osc("#4a3a4e", 0.95), osc("#6a5040", 0.85)];
  const tramos = [
    { x: -700, w: 520, p: 3 }, { x: 1100, w: 340, p: 2 }, { x: 1450, w: 480, p: 4 }, { x: 1950, w: 360, p: 3 }, { x: 2330, w: 420, p: 2 }, { x: 2770, w: 300, p: 3 },
    { x: 3640, w: 420, p: 2 }, { x: 4080, w: 300, p: 3 }, { x: 4250, w: 400, p: 3 }, { x: 4670, w: 300, p: 2 }, { x: 4850, w: 460, p: 2 }, { x: 5330, w: 420, p: 3 },
  ];
  const on = luces;
  return (
    <g>
      {/* vereda */}
      <rect x={-1500} y={P - 10} width={8000} height={50} fill={noche ? osc(pal.vereda, 0.7) : acl(pal.vereda, 0.15)} />
      {nieve > 0 && <rect x={-1500} y={P - 12} width={8000} height={10} fill={L.nieve} opacity={nieve * 0.8} />}
      {tramos.map((t, i) => <Fachada key={i} x={t.x} w={t.w} pisos={t.p} color={cols[i % cols.length]} luces={luces} seed={`sp${i}`} nieve={nieve} />)}
      {/* Holiday: playa abierta con techo y surtidores */}
      <g>
        <rect x={-180} y={P - 420} width={1260} height={40} fill="#e8e2d8" />
        <rect x={-180} y={P - 384} width={1260} height={14} fill="#c0352c" />
        {rotulos && <Cartel x={450} y={P - 392} txt="HOLIDAY" fondo="#c0352c" color="#ffffff" on={on} tam={30} />}
        {[100, 800].map((x) => <rect key={x} x={x} y={P - 380} width={22} height={380} fill="#d8d2c8" />)}
        {on > 0.3 && <Halo x={450} y={P - 360} r={500} color="#fff4dc" fuerza={0.35 * on} />}
        {[250, 650].map((x) => (
          <g key={x}>
            <rect x={x - 30} y={P - 150} width={60} height={150} rx={6} fill="#ece6dc" />
            <rect x={x - 20} y={P - 136} width={40} height={30} fill={on > 0.3 ? "#9fe0ff" : "#2a3040"} />
            <rect x={x - 30} y={P - 70} width={60} height={14} fill="#c0352c" />
            <path d={`M${x + 30},${P - 110} q24,10 18,60`} stroke="#222" strokeWidth={5} fill="none" />
          </g>
        ))}
        <rect x={880} y={P - 300} width={200} height={300} fill="#e8e2d8" /><rect x={900} y={P - 240} width={160} height={150} fill={on > 0.3 ? "#ffe8b0" : "#262030"} />
      </g>
      {/* carteles */}
      {rotulos && <>
        <g>
          <rect x={1660} y={P - 820} width={80} height={330} rx={8} fill="#2a1a20" />
          {"NORSHOR".split("").map((c, i) => <text key={i} x={1700} y={P - 776 + i * 44} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={38} fill={on > 0.3 ? "#ffcf6e" : "#6a5040"}>{c}</text>)}
          {on > 0.3 && <Halo x={1700} y={P - 650} r={260} color="#ffcf6e" fuerza={0.4 * on} />}
          <rect x={1480} y={P - 300} width={440} height={70} rx={6} fill="#2a1a20" />
          {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={1495 + i * 19.5} cy={P - 296} r={4} fill={on > 0.3 && (Math.floor(f / 6) + i) % 3 ? "#ffe9b0" : "#5a4040"} />)}
          <text x={1700} y={P - 252} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={30} fill={on > 0.3 ? "#ffffff" : "#5a5060"}>NOW SHOWING</text>
        </g>
        <Cartel x={2540} y={P - 470} txt="POLICE" fondo="#1d2a4a" color="#cfe0ff" on={on} />
        <g>
          <rect x={3030} y={P - 520} width={600} height={520} fill="#7a3a30" />
          <Ladrillos x={3030} y={P - 520} w={600} h={520} color="#5a2a24" />
          {[3080, 3340].map((x) => <g key={x}><rect x={x} y={P - 300} width={220} height={300} fill="#a8302a" />{Array.from({ length: 5 }).map((_, k) => <rect key={k} x={x} y={P - 300 + k * 60} width={220} height={4} fill="#7a2420" />)}</g>)}
          <Cartel x={3330} y={P - 380} txt="FIRE HALL 1" fondo="#f2e6c8" color="#a8302a" on={1} tam={30} />
        </g>
        <Cartel x={3850} y={P - 300} txt="DRUGS" fondo="#2f6a5a" color="#ffffff" on={on} />
        <Cartel x={4450} y={P - 300} txt="DENTAL" fondo="#e8e2d8" color="#2a5a7a" on={1} />
        <Cartel x={5080} y={P - 300} txt="HARDWARE" fondo="#c0352c" color="#ffffff" on={on} />
      </>}
      {[-400, 1000, 2200, 3700, 4900].map((x, i) => <Farola key={x} x={x} piso={P + 30} on={on > 0.05 ? Math.min(1, on * (noche ? 1 : 0.25)) : 0} lado={i % 2 ? -1 : 1} />)}
      <Semaforo x={SUP_PUNTOS.semaforo1} piso={P + 30} f={f} on={on} />
      <Semaforo x={SUP_PUNTOS.semaforo2} piso={P + 30} f={f} on={on} fase={3} />
    </g>
  );
};
