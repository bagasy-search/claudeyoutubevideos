// SETS tz03/tz04 · Chicago (paleta PAL de ./elenco: frío; el farol de Tenzo es la única luz cálida).
//   PasilloWilson: pasillo del edificio de Leo en Wilson Ave, 3 a.m. Puerta de Leo en WILSON.puerta; ventana al fondo
//                  con nieve; foco de techo frío que titila. La puerta se abre con `apertura` 0..1 (prop del set).
//   FachadaWilson: el edificio de 3 pisos de noche con nieve: todas las ventanas apagadas menos UNA azul (la de Leo).
//   Colectivo36:   el 36 de Broadway por dentro: asientos, pasamanos, ventanas con Broadway que pasa (`vel` px/cuadro).
import React from "react";
import { random } from "remotion";
import { Cono, Halo } from "../../anikit/luz";
import { Cielo, SetProps, acl, osc } from "../../anikit/sets/comun";

export const WILSON_PISO = 900;
export const WILSON = { puerta: 1300, ventana: 2500, foco: 1500, tenzo: 1480, leo: 1240 };

const Nieve: React.FC<{ f: number; seed: number; n?: number; x0?: number; w?: number }> = ({ f, seed, n = 120, x0 = -300, w = 4400 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 1.2 + random(`nv${seed}${i}`) * 1.6;
      const y = (random(`ny${seed}${i}`) * 1300 + f * sp) % 1300 - 150;
      const x = x0 + random(`nx${seed}${i}`) * w + Math.sin(f / 40 + i) * 14;
      return <circle key={i} cx={x} cy={y} r={2 + random(`nr${seed}${i}`) * 3} fill="#e9eef6" opacity={0.75} />;
    })}
  </g>
);

export const PasilloWilson: React.FC<SetProps & { apertura?: number; titila?: boolean }> = ({ capa, f, pal, apertura = 0, titila = true }) => {
  const P = WILSON_PISO;
  const on = titila ? (random(`tt${Math.floor(f / 3)}`) > 0.06 ? 1 : 0.55) : 1;
  if (capa === "lejos") {
    // lo que se ve por la ventana del fondo: noche con nieve y techos
    return (
      <g>
        <Cielo c={["#0b0e15", "#141a26", "#1f2836"]} />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={1900 + k * 220} y={420 - (k % 2) * 60} width={200} height={600} fill={osc(pal.fachada[k % 4], 0.8)} />)}
        <Nieve f={f} seed={1} n={60} x0={1800} w={1400} />
      </g>
    );
  }
  if (capa === "frente") return <Halo x={WILSON.foco} y={60} r={260} color={pal.luzFria} fuerza={0.18 * on} />;
  const D = WILSON.puerta;
  return (
    <g>
      {/* paredes del pasillo con zócalo y ventana al fondo (el hueco deja ver lejos) */}
      <defs><clipPath id="wpared"><path clipRule="evenodd" d={`M-800,-400 H4400 V${P} H-800 Z M2340,240 V640 H2660 V240 Z`} /></clipPath></defs>
      <g clipPath="url(#wpared)">
        <rect x={-800} y={-400} width={5200} height={P + 400} fill="#3a3f48" />
        <rect x={-800} y={P - 140} width={5200} height={140} fill="#2a2e35" />
        <rect x={-800} y={P - 146} width={5200} height={8} fill="#4a505a" />
        {/* manchas de humedad y una grieta */}
        <ellipse cx={600} cy={120} rx={160} ry={60} fill="#33373f" />
        <path d="M3000,-200 l20,90 l-14,60 l26,80" stroke="#2a2e35" strokeWidth={4} fill="none" />
      </g>
      <rect x={2330} y={230} width={340} height={420} fill="none" stroke="#4e545e" strokeWidth={20} />
      <rect x={2490} y={230} width={14} height={420} fill="#4e545e" />
      {/* radiador viejo */}
      <g transform={`translate(2500,${P - 30})`}>{Array.from({ length: 9 }).map((_, k) => <rect key={k} x={-140 + k * 32} y={-150} width={24} height={150} rx={10} fill="#5a5f68" />)}</g>
      {/* puertas vecinas (cerradas) */}
      {[-200, 2950].map((x, i) => (
        <g key={i}><rect x={x} y={P - 470} width={220} height={470} fill="#4a3a30" /><circle cx={x + 190} cy={P - 230} r={9} fill="#b9a688" /><rect x={x + 80} y={P - 420} width={60} height={22} rx={3} fill="#c9b99a" /></g>
      ))}
      {/* la puerta de Leo: el hueco interior es azul (pantalla) y la hoja gira hacia adentro */}
      <g>
        <rect x={D - 120} y={P - 480} width={240} height={480} fill="#0e1a30" />
        <Halo x={D} y={P - 260} r={240} color="#4f8ae8" fuerza={0.35 * apertura} />
        <rect x={D - 120 + 240 * apertura * 0.82} y={P - 480} width={240 * (1 - apertura * 0.82)} height={480} fill="#5a4636" />
        <circle cx={D - 120 + 240 * apertura * 0.82 + 22} cy={P - 230} r={9} fill="#c9b99a" opacity={1 - apertura} />
        <rect x={D - 132} y={P - 492} width={264} height={14} fill="#2e2620" />
        <rect x={D - 24} y={P - 440} width={48} height={20} rx={3} fill="#c9b99a" />
        <text x={D} y={P - 425} fontSize={16} textAnchor="middle" fill="#3a2a20" fontFamily="sans-serif">3B</text>
        {/* rendija de luz azul bajo la puerta cuando está cerrada */}
        <rect x={D - 110} y={P - 6} width={220} height={6} fill="#4f8ae8" opacity={0.8 * (1 - apertura)} />
      </g>
      {/* piso de baldosas gastadas */}
      <rect x={-800} y={P} width={5200} height={900} fill="#2c2f36" />
      {Array.from({ length: 50 }).map((_, i) => <rect key={i} x={-800 + i * 110} y={P} width={3} height={300} fill="#24272d" />)}
      {/* foco del techo, frío */}
      <rect x={WILSON.foco - 4} y={-400} width={8} height={420} fill="#22252b" />
      <circle cx={WILSON.foco} cy={30} r={22} fill={acl(pal.luzFria, 0.5)} opacity={on} />
      <Cono x={WILSON.foco} y={40} alto={P - 40} ancho={900} color={pal.luzFria} fuerza={0.14 * on} />
    </g>
  );
};

export const FachadaWilson: React.FC<SetProps> = ({ capa, f, pal }) => {
  const P = WILSON_PISO;
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={pal.cielo} />
        {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={-600 + k * 520} y={260 + random(`sk${k}`) * 160} width={380} height={900} fill={osc(pal.fachada[k % 4], 0.7)} />)}
      </g>
    );
  }
  if (capa === "frente") return <Nieve f={f} seed={3} n={160} />;
  const X0 = 900, W = 1500;
  return (
    <g>
      <rect x={X0} y={P - 820} width={W} height={820} fill="#3a2e2a" />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={X0} y={P - 820 + i * 21} width={W} height={2} fill="#2e2420" />)}
      <rect x={X0 - 20} y={P - 840} width={W + 40} height={30} fill="#2a201c" />
      <rect x={X0 - 20} y={P - 846} width={W + 40} height={10} fill="#e9eef6" opacity={0.8} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => {
        const leo = r === 1 && c === 3;
        const x = X0 + 90 + c * 280, y = P - 760 + r * 240;
        return (
          <g key={`${r}${c}`}>
            <rect x={x} y={y} width={150} height={170} fill={leo ? "#4f8ae8" : "#14171d"} />
            {leo && <Halo x={x + 75} y={y + 85} r={260} color="#4f8ae8" fuerza={0.5 + 0.1 * Math.sin(f / 7)} />}
            <rect x={x + 72} y={y} width={6} height={170} fill="#2a201c" />
            <rect x={x - 10} y={y + 166} width={170} height={14} fill="#e9eef6" opacity={0.75} />
          </g>
        );
      }))}
      <rect x={X0 + W / 2 - 90} y={P - 260} width={180} height={260} fill="#2a201c" />
      <text x={X0 + W / 2} y={P - 280} fontSize={34} textAnchor="middle" fill="#c9c4b8" fontFamily="sans-serif">1043 W WILSON</text>
      <rect x={-800} y={P} width={5000} height={900} fill={pal.vereda} />
      <rect x={-800} y={P} width={5000} height={24} fill="#e9eef6" opacity={0.85} />
    </g>
  );
};

export const COLECTIVO_PISO = 900;
export const COLECTIVO = { ventanas: [600, 1100, 1600, 2100, 2600], asientoLeo: 1350, asientoMaya: 1530, puerta: 2900, asiento: 60 };

// Broadway que pasa por la ventana: fachadas, el cartel del Green Mill, la parada de Lawrence
export const Colectivo36: React.FC<SetProps & { vel?: number; dia?: boolean }> = ({ capa, f, pal, vel = 6, dia = true }) => {
  const P = COLECTIVO_PISO;
  if (capa === "lejos") {
    const off = (f * vel) % 2600;
    return (
      <g>
        <Cielo c={dia ? ["#7d858f", "#9aa1aa", "#b9bec5"] : pal.cielo} />
        {Array.from({ length: 16 }).map((_, k) => {
          const x = -1200 + k * 360 - off + (k * 360 - off < -1500 ? 5760 : 0);
          return (
            <g key={k}>
              <rect x={x} y={180 + (k % 3) * 40} width={330} height={900} fill={pal.fachada[k % 4]} />
              {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 50 + c * 140} y={240 + (k % 3) * 40 + r * 120} width={90} height={80} fill={dia ? "#9aa3ae" : pal.ventana} />))}
              {k === 5 && (
                <g transform={`translate(${x + 165},${300})`}>
                  <rect x={-120} y={-40} width={240} height={70} rx={8} fill="#1a1d23" />
                  <text x={0} y={10} fontSize={34} textAnchor="middle" fill={dia ? "#c9c4b8" : "#7fd3ff"} fontFamily="sans-serif">GREEN MILL</text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  }
  if (capa === "frente") {
    // pasamanos verticales que pasan por delante
    return <g>{[300, 1900, 3300].map((x, i) => <rect key={i} x={x} y={-400} width={18} height={1700} rx={9} fill="#c9a23a" />)}</g>;
  }
  return (
    <g>
      {/* carrocería interior: paneles bajo y sobre las ventanas (los huecos dejan ver la calle) */}
      <defs>
        <clipPath id="c36"><path clipRule="evenodd" d={`M-800,-400 H4400 V${P + 900} H-800 Z ${COLECTIVO.ventanas.map((x) => `M${x - 200},180 V560 H${x + 200} V180 Z`).join(" ")}`} /></clipPath>
      </defs>
      <g clipPath="url(#c36)">
        <rect x={-800} y={-400} width={5200} height={P + 1300} fill="#5f6670" />
        <rect x={-800} y={560} width={5200} height={P - 560} fill="#4a5059" />
        <rect x={-800} y={-60} width={5200} height={120} fill="#e9e6e0" opacity={0.15} />
      </g>
      {COLECTIVO.ventanas.map((x, i) => <rect key={i} x={x - 206} y={174} width={412} height={392} rx={18} fill="none" stroke="#2c3038" strokeWidth={14} />)}
      {/* cartel de paradas y timbre */}
      <rect x={700} y={40} width={540} height={60} rx={6} fill="#14171d" />
      <text x={970} y={82} fontSize={34} textAnchor="middle" fill="#ffb84a" fontFamily="sans-serif">36 BROADWAY</text>
      {/* barra horizontal */}
      <rect x={-800} y={130} width={5200} height={14} rx={7} fill="#c9a23a" />
      {/* asientos azules de dos plazas */}
      {[300, 900, 1440, 2000, 2550].map((x, i) => (
        <g key={i} transform={`translate(${x},${P})`}>
          <rect x={-150} y={-150} width={300} height={40} rx={12} fill="#2f4a7a" />
          <rect x={-170} y={-330} width={40} height={210} rx={14} fill="#2f4a7a" />
          <rect x={-150} y={-110} width={12} height={110} fill="#2c3038" />
          <rect x={138} y={-110} width={12} height={110} fill="#2c3038" />
        </g>
      ))}
      <rect x={-800} y={P} width={5200} height={900} fill="#3a3d44" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-700 + i * 180} cy={P + 40} r={5} fill="#2e3036" />)}
      {/* puerta trasera plegable */}
      <g transform={`translate(${COLECTIVO.puerta},${P})`}>
        <rect x={-130} y={-620} width={260} height={620} fill="#2c3038" />
        <rect x={-118} y={-600} width={112} height={580} fill="#7d858f" opacity={0.6} />
        <rect x={6} y={-600} width={112} height={580} fill="#7d858f" opacity={0.6} />
      </g>
      {/* luz fría de los tubos */}
      <Cono x={1500} y={-60} alto={P + 60} ancho={3400} boca={2400} color={dia ? "#eef2f6" : pal.luzFria} fuerza={0.08} />
    </g>
  );
};
