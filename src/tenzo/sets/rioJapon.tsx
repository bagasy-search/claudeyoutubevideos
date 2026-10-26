// SETS tz04 · JAPÓN ANTIGUO (parábola de Tanzan y Ekido). Cálidos pero húmedos: tres días de lluvia, niebla dorada.
//   CaminoMontana: camino embarrado entre cedros, niebla, charcos. Puntos: inicio 0, curva 1400, cedros 2200.
//   RioCrecido:    el río marrón y rápido corta el camino. Orilla izquierda hasta RIO.orillaI, agua hasta RIO.orillaD.
//                  Quien cruza baja (y = PISO + hundir) dentro del agua; usar `<RioFrente>` en `frente` para tapar las piernas.
//   PortonMonasterio: portón de madera con techo curvo al atardecer (`hora` 0 = tarde gris, 1 = naranja); escalones.
import React from "react";
import { interpolate, random } from "remotion";
import { Charco, Halo, Haces, Lluvia, Polvo } from "../../anikit/luz";
import { Cielo, SetProps, mezclar, osc } from "../../anikit/sets/comun";

export const JAPON_PISO = 900;
export const MONTANA_PUNTOS = { inicio: 0, curva: 1400, cedros: 2200, fin: 3600 };
export const RIO = { orillaI: 1100, orillaD: 2300, chica: 1000, hundir: 100, sup: JAPON_PISO - 30 }; // sup = superficie del agua
export const PORTON = { x: 1600, escalones: 1600 };

const BARRO = "#7a5232";

const Cedro: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#5a5a2e" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-10} y={-160} width={20} height={160} fill="#4a2e1c" />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M0,${-420 + k * 70} L${70 + k * 18},${-300 + k * 70} L${-70 - k * 18},${-300 + k * 70} Z`} fill={k % 2 ? c : osc(c, 0.86)} />)}
  </g>
);

const Montes: React.FC<{ f: number; tarde?: number }> = ({ f, tarde = 0 }) => (
  <g>
    <Cielo c={[mezclar("#b98a62", "#d0603a", tarde), mezclar("#e2b98a", "#f2a056", tarde), mezclar("#f2dcb4", "#ffd48a", tarde)]} />
    <path d="M-1500,520 Q-800,180 -100,470 Q500,140 1200,440 Q1900,160 2600,450 Q3300,200 4600,470 L4600,900 L-1500,900 Z" fill={mezclar("#b39071", "#b87454", tarde)} />
    <path d="M-1500,620 Q-600,420 200,600 Q1000,400 1800,590 Q2600,420 4600,600 L4600,900 L-1500,900 Z" fill={mezclar("#9a7a5c", "#9a5c44", tarde)} />
    {[0, 1, 2].map((k) => <rect key={k} x={-1500} y={430 + k * 90 + Math.sin(f / 90 + k) * 8} width={6200} height={50} fill="#f6e6c8" opacity={0.22} />)}
  </g>
);

export const CaminoMontana: React.FC<SetProps> = ({ capa, f }) => {
  const P = JAPON_PISO;
  if (capa === "lejos") return <Montes f={f} />;
  if (capa === "frente") {
    return (
      <g>
        <Lluvia f={f} w={4200} h={1100} n={90} color="#f3dfb8" seed={4} x0={-300} largo={0.7} />
        {[-700, 3700, 4300].map((x, i) => <Cedro key={i} x={x} y={P + 260} s={1.5} c="#3e3e20" />)}
      </g>
    );
  }
  return (
    <g>
      {Array.from({ length: 16 }).map((_, i) => <Cedro key={i} x={-700 + i * 300 + random(`cm${i}`) * 120} y={P - 140} s={0.8 + random(`cs${i}`) * 0.4} />)}
      {/* banco de niebla baja */}
      <rect x={-900} y={P - 210} width={5400} height={120} fill="#f4e4c4" opacity={0.35} />
      <rect x={-900} y={P - 40} width={5400} height={900} fill={BARRO} />
      <rect x={-900} y={P - 44} width={5400} height={12} fill={osc(BARRO, 0.8)} />
      {/* charcos que reflejan el cielo y tiemblan con la lluvia */}
      {Array.from({ length: 12 }).map((_, i) => {
        const cx = -700 + i * 420 + random(`ch${i}`) * 140, cy = P + 30 + random(`cy${i}`) * 90;
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={90 + random(`cr${i}`) * 60} ry={14} fill="#d8b98a" opacity={0.7} />
            <ellipse cx={cx + 20} cy={cy} rx={(f * 1.4 + i * 13) % 40} ry={((f * 1.4 + i * 13) % 40) / 5} fill="none" stroke="#f6e2bc" strokeWidth={2} opacity={1 - ((f * 1.4 + i * 13) % 40) / 40} />
          </g>
        );
      })}
      {/* huellas de sandalias */}
      {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={-600 + i * 150} cy={P + 12 + (i % 2) * 20} rx={12} ry={5} fill={osc(BARRO, 0.7)} />)}
    </g>
  );
};

// agua que corre: bandas que se desplazan (en coordenadas del mundo)
const Agua: React.FC<{ f: number; x: number; w: number; y: number; h: number; seed: number; frente?: boolean }> = ({ f, x, w, y, h, seed, frente }) => (
  <g>
    <path d={`M${x},${y + 8} ${Array.from({ length: 12 }).map((_, k) => `Q${x + (k + 0.5) * w / 12},${y + (k % 2 ? -10 : 14) + Math.sin(f / 6 + k) * 5} ${x + (k + 1) * w / 12},${y + 8}`).join(" ")} L${x + w},${y + h} L${x},${y + h} Z`} fill="#a06a38" />
    {Array.from({ length: frente ? 10 : 18 }).map((_, i) => {
      const yy = y + 10 + random(`ay${seed}${i}`) * (h - 20);
      const L = 90 + random(`al${seed}${i}`) * 160;
      const xx = x + ((random(`ax${seed}${i}`) * w + f * (7 + random(`av${seed}${i}`) * 5)) % w);
      return <rect key={i} x={xx} y={yy} width={Math.min(L, x + w - xx)} height={frente ? 6 : 5} rx={3} fill="#e9c08a" opacity={0.55} />;
    })}
  </g>
);

export const RioCrecido: React.FC<SetProps> = ({ capa, f }) => {
  const P = JAPON_PISO;
  const W = RIO.orillaD - RIO.orillaI;
  if (capa === "lejos") return <Montes f={f} />;
  if (capa === "frente") {
    return (
      <g>
        <Lluvia f={f} w={4200} h={1100} n={70} color="#f3dfb8" seed={6} x0={-300} largo={0.7} />
        <Polvo x={RIO.orillaI} y={P - 260} w={W} h={260} n={30} color="#fff4dc" f={f} seed={8} tam={3} />
      </g>
    );
  }
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => <Cedro key={i} x={-700 + i * 420 + random(`rc${i}`) * 160} y={P - 150} s={0.9} />)}
      {/* lecho: el agua llena el hueco entre las dos orillas en pendiente */}
      <Agua f={f} x={RIO.orillaI - 200} w={W + 400} y={RIO.sup} h={900} seed={1} />
      {/* espuma en las piedras */}
      {[1400, 1720, 2020].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={RIO.sup + 10} rx={46} ry={18} fill="#6a5040" />
          <ellipse cx={x - 30 + (f * 3 + i * 20) % 40} cy={RIO.sup - 2} rx={30} ry={9} fill="#f7e8cc" opacity={0.7} />
        </g>
      ))}
      {/* orillas embarradas en pendiente (la izquierda baja hacia el agua, la derecha sube) */}
      <path d={`M-900,${P - 40} L${RIO.orillaI},${P - 40} Q${RIO.orillaI + 90},${P - 30} ${RIO.orillaI + 160},${P + 900} L-900,${P + 900} Z`} fill={BARRO} />
      <path d={`M${RIO.orillaI - 10},${P - 44} L${RIO.orillaI + 10},${P - 44} Q${RIO.orillaI + 100},${P - 34} ${RIO.orillaI + 170},${P + 900}`} stroke={osc(BARRO, 0.75)} strokeWidth={10} fill="none" />
      <path d={`M${RIO.orillaD},${P - 40} L4500,${P - 40} L4500,${P + 900} L${RIO.orillaD - 160},${P + 900} Q${RIO.orillaD - 90},${P - 30} ${RIO.orillaD},${P - 40} Z`} fill={BARRO} />
      <Charco x={RIO.orillaI + W / 2} y={P - 40} rx={W / 2} ry={30} color="#ffe2a8" fuerza={0.35} />
    </g>
  );
};

// franja de agua que tapa a quien está dentro del río: va en `medio` DESPUÉS de los actores (misma paralaje del set).
export const RioFrente: React.FC<{ f: number }> = ({ f }) => (
  <Agua f={f} x={RIO.orillaI + 60} w={RIO.orillaD - RIO.orillaI - 120} y={RIO.sup} h={170} seed={2} frente />
);


export const PortonMonasterio: React.FC<SetProps & { hora?: number }> = ({ capa, f, hora = 1 }) => {
  const P = JAPON_PISO;
  if (capa === "lejos") return <Montes f={f} tarde={hora} />;
  if (capa === "frente") return <Haces x={2600} y={150} ang={-30} largo={1300} n={5} ancho={70} color="#ffd890" fuerza={0.12 * hora} f={f} />;
  const X = PORTON.x;
  const sol = interpolate(hora, [0, 1], [0.15, 0.6]);
  return (
    <g>
      {/* muro del monasterio */}
      <rect x={-900} y={P - 300} width={5400} height={300} fill="#d9c3a0" />
      <rect x={-900} y={P - 330} width={5400} height={36} fill="#5a3a26" />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-900 + i * 180} y={P - 300} width={6} height={300} fill="#c4ab86" />)}
      {/* portón */}
      <g transform={`translate(${X},${P})`}>
        <rect x={-230} y={-520} width={46} height={520} fill="#7a2e1e" />
        <rect x={184} y={-520} width={46} height={520} fill="#7a2e1e" />
        <rect x={-270} y={-470} width={540} height={34} fill="#6a2618" />
        <path d="M-360,-520 Q-180,-540 0,-600 Q180,-540 360,-520 Q380,-548 350,-552 Q180,-572 0,-640 Q-180,-572 -350,-552 Q-380,-548 -360,-520 Z" fill="#3e2a22" />
        <rect x={-184} y={-436} width={368} height={436} fill="#5a3422" />
        <rect x={-4} y={-436} width={8} height={436} fill="#3a2016" />
        {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 4 }).map((__, c) => <circle key={`${r}${c}`} cx={-150 + c * 44 + (c > 1 ? 120 : 0)} cy={-380 + r * 90} r={6} fill="#c9933a" />))}
        <rect x={-50} y={-500} width={100} height={30} rx={3} fill="#e9d6a8" />
      </g>
      {/* escalones de piedra */}
      {[0, 1, 2].map((k) => <rect key={k} x={X - 300 - k * 40} y={P - 30 + k * 30} width={600 + k * 80} height={32} fill={osc("#b9a688", 1 - k * 0.06)} />)}
      <rect x={-900} y={P + 60} width={5400} height={900} fill={BARRO} />
      {/* faroles de piedra con la última luz */}
      {[X - 520, X + 520].map((x, i) => (
        <g key={i} transform={`translate(${x},${P + 60})`}>
          <rect x={-16} y={-140} width={32} height={140} fill="#9a8a72" />
          <rect x={-46} y={-200} width={92} height={60} fill="#a99a80" />
          <path d="M-60,-200 L0,-240 L60,-200 Z" fill="#8a7a62" />
          <rect x={-20} y={-188} width={40} height={36} fill="#ffcf7a" opacity={0.4 + 0.5 * hora} />
          <Halo x={0} y={-170} r={110} color="#ffcf7a" fuerza={0.4 * hora} />
        </g>
      ))}
      <Charco x={X} y={P + 80} rx={600} color="#ffb860" fuerza={sol} />
    </g>
  );
};
