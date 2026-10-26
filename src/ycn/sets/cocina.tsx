// SET · COCINA del snack bar (detrás del mostrador) con la PUERTA del freezer walk-in.
//   x 150…700 mesa de preparación · 800…1320 estantería de alambre (~40 objetos) · 1400…1950 freidoras + plancha bajo campana
//   x 2050…3000 frente del freezer walk-in: puerta 2180…2580 con manija grande, display «-10°F», escarcha
// Piso: COCINA_YCN_PISO. props: luz "prendida" | "noche"; puerta 0..1 (abre hacia cámara); golpes [cuadros] (la puerta tiembla)
import React from "react";
import { random } from "remotion";
import { golpe } from "../../anikit/camara";
import { Cono, Halo, Polvo } from "../../anikit/luz";
import { F_HUD } from "../../anikit/pantalla";
import { SetProps, osc } from "../../anikit/sets/comun";

export const COCINA_YCN_PISO = 900;
export const COCINA_YCN_PUNTOS = { mesa: 430, estante: 1060, freidora: 1560, puerta: 2380, manija: 2540 };
const P = COCINA_YCN_PISO;

export const CocinaYcn: React.FC<SetProps & { luz?: "prendida" | "noche"; puerta?: number | ((f: number) => number); golpes?: number[] }> = ({ capa, f, luz = "prendida", puerta = 0, golpes = [] }) => {
  const oscuro = luz === "noche";
  const ab = Math.max(0, Math.min(1, typeof puerta === "function" ? puerta(f) : puerta));
  const tiembla = golpes.reduce((a, t) => a + golpe(f, t, 6), 0);
  if (capa === "lejos") return <rect x={-3000} y={-1500} width={9000} height={4000} fill="#141a1e" />;
  if (capa === "frente") return <g>{ab > 0.2 && <Polvo x={2150} y={P - 560} w={500} h={560} n={30} color="#d8f2ff" f={f} seed={4} tam={3} />}</g>;
  return (
    <g>
      {/* azulejos blancos */}
      <rect x={-800} y={-1500} width={4200} height={P + 1500} fill={oscuro ? "#2a3236" : "#e2ddd0"} />
      {Array.from({ length: 60 }).map((_, i) => <rect key={`h${i}`} x={-800} y={-1500 + i * 46} width={4200} height={2} fill={oscuro ? "#222a2e" : "#cfc8b8"} />)}
      {Array.from({ length: 70 }).map((_, i) => <rect key={`v${i}`} x={-800 + i * 62} y={-1500} width={2} height={P + 1500} fill={oscuro ? "#222a2e" : "#cfc8b8"} />)}
      <rect x={-800} y={P - 260} width={4200} height={14} fill={oscuro ? "#3a2a26" : "#3f9a55"} />
      {/* tubo fluorescente */}
      <rect x={700} y={-260} width={900} height={18} rx={9} fill={oscuro ? "#3a4a4e" : "#f4fbff"} />
      {!oscuro && <Cono x={1150} y={-240} alto={1150} ancho={1600} boca={900} color="#f4fbff" fuerza={0.16} />}
      {/* mesa de preparación */}
      <rect x={150} y={P - 230} width={550} height={18} rx={4} fill="#b9c4c8" />
      <rect x={170} y={P - 212} width={12} height={212} fill="#8a959a" /><rect x={668} y={P - 212} width={12} height={212} fill="#8a959a" />
      <rect x={170} y={P - 80} width={510} height={10} fill="#8a959a" />
      <rect x={240} y={P - 262} width={140} height={32} rx={4} fill="#c98a4a" /><rect x={420} y={P - 290} width={50} height={60} rx={6} fill="#e2483a" /><rect x={490} y={P - 280} width={46} height={50} rx={6} fill="#f2c230" />
      {/* estantería de alambre con ~40 objetos */}
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={800} y={P - 120 - r * 150} width={520} height={8} fill="#a9b2b6" />
          {Array.from({ length: 10 }).map((_, k) => {
            const x = 812 + k * 50, y = P - 120 - r * 150;
            const t = Math.floor(random(`ck${r}${k}`) * 4);
            const c = ["#e2483a", "#f2c230", "#c98a4a", "#f4efe4", "#3fa36a", "#2f6fd0"][Math.floor(random(`cc${r}${k}`) * 6)];
            return <g key={k}>{t === 0 ? <rect x={x} y={y - 56} width={42} height={56} rx={4} fill={c} /> : t === 1 ? <rect x={x + 8} y={y - 70} width={26} height={70} rx={8} fill={c} /> : t === 2 ? <ellipse cx={x + 21} cy={y - 22} rx={22} ry={22} fill={c} /> : <path d={`M${x},${y} L${x + 6},${y - 46} L${x + 40},${y - 46} L${x + 44},${y} Z`} fill={c} />}</g>;
          })}
        </g>
      ))}
      {[800, 1312].map((x) => <rect key={x} x={x} y={P - 600} width={8} height={600} fill="#a9b2b6" />)}
      {/* freidoras + plancha bajo la campana */}
      <path d="M1380,-40 L1970,-40 L2010,90 L1340,90 Z" fill={oscuro ? "#3a4448" : "#b9c4c8"} />
      <rect x={1400} y={P - 300} width={260} height={300} rx={6} fill="#a9b2b6" />
      <rect x={1420} y={P - 296} width={100} height={40} fill="#2a2a2a" /><rect x={1540} y={P - 296} width={100} height={40} fill="#2a2a2a" />
      <rect x={1680} y={P - 280} width={270} height={280} rx={6} fill="#8a959a" /><rect x={1680} y={P - 296} width={270} height={20} fill="#2a2a2a" />
      {!oscuro && [0, 1, 2].map((k) => <path key={k} d={`M${1450 + k * 70},${P - 310} q14,-30 0,-60`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.3} transform={`translate(${Math.sin(f / 12 + k) * 5},${-((f * 1.2 + k * 30) % 40)})`} />)}
      {/* frente del freezer walk-in */}
      <rect x={2050} y={P - 720} width={950} height={720} fill={oscuro ? "#4a5458" : "#c4ccd0"} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={2050 + i * 120} y={P - 720} width={3} height={720} fill={oscuro ? "#3a4448" : "#aab4b8"} />)}
      <rect x={2240} y={P - 790} width={280} height={56} rx={6} fill="#22303a" /><text x={2380} y={P - 750} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={36} fill="#e9f4ff">WALK-IN</text>
      <rect x={2640} y={P - 640} width={130} height={56} rx={6} fill="#0c0c10" /><text x={2705} y={P - 600} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={32} fill="#ff4a3d">-10°F</text>
      <Halo x={2705} y={P - 612} r={120} color="#ff4a3d" fuerza={oscuro ? 0.35 : 0.15} />
      {/* hueco y puerta: abre hacia la cámara (se angosta y se corre a la izquierda) */}
      <rect x={2180} y={P - 580} width={400} height={580} fill={ab > 0 ? "#bfe8ff" : "#2a3236"} />
      {ab > 0 && <>
        <rect x={2180} y={P - 580} width={400} height={580} fill="#6aa8c8" opacity={0.6} />
        {[0, 1, 2].map((r) => <rect key={r} x={2200} y={P - 470 + r * 130} width={360} height={8} fill="#e9f4ff" opacity={0.7} />)}
        <Halo x={2380} y={P - 400} r={500} color="#d8f2ff" fuerza={0.4 * ab} />
      </>}
      <g transform={`translate(${tiembla},0)`}>
        {(() => {
          const w = 400 * (1 - 0.85 * ab), x = 2180 - (400 - w) * 0 - 340 * ab;
          return (
            <g>
              <rect x={x} y={P - 580} width={w + 340 * ab * 0.25} height={580} rx={6} fill={oscuro ? "#5a6468" : "#d6dde0"} stroke="#8a959a" strokeWidth={6} />
              {ab < 0.5 && <>
                {/* manija grande + bisagras */}
                <rect x={x + w - 60} y={P - 340} width={36} height={130} rx={10} fill="#5a6468" />
                <rect x={x + w - 82} y={P - 300} width={70} height={26} rx={6} fill="#3a4448" />
                {[P - 520, P - 120].map((y) => <rect key={y} x={x - 4} y={y} width={20} height={60} rx={4} fill="#8a959a" />)}
                {/* escarcha en el borde */}
                {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={x + random(`fr${i}`) * w} cy={P - 580 + (i % 2 ? 6 : 574)} r={6 + random(`fs${i}`) * 10} fill="#f4fbff" opacity={0.6} />)}
              </>}
            </g>
          );
        })()}
      </g>
      {/* piso de baldosas rojas */}
      <rect x={-800} y={P} width={4200} height={900} fill={oscuro ? "#3a2420" : "#9a3a2e"} />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-800 + i * 110} y={P} width={3} height={900} fill={osc("#9a3a2e", 0.8)} />)}
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-800} y={P + 30 + i * 40} width={4200} height={3} fill={osc("#9a3a2e", 0.8)} />)}
      {oscuro && <rect x={-800} y={-1500} width={4200} height={3000} fill="#05080c" opacity={0.45} />}
    </g>
  );
};
