// SET 1 · CALLE DE NOCHE (Awaken «Corner Café»): una cuadra entera de ~5.700 px para recorrer con la cámara.
// Piso de los personajes: y = CALLE_PISO (la vereda). x útil: -900 … 4800.
// Puntos de interés (x): casa 12 = 560, café = 1250, farol = 1760, persiana CLOSED = 2150, mercado = 2950,
// edificio de departamentos = 3900. variante: "zombi" (vidrios rotos, basura, luz que falla), "lluvia".
import React from "react";
import { random } from "remotion";
import { Farol, Halo, Lluvia } from "../luz";
import { F_HUD, F_MANO } from "../pantalla";
import { Arbusto, Cielo, Ladrillos, Planta, SetProps, Ventana, acl, osc, grisar } from "./comun";

export const CALLE_PISO = 900;
// paleta monocroma (parabola): los colores fijos del set pasan a gris. Se fija al dibujar CalleNoche (un solo set
// de calle por cuadro) y lo leen también los ayudantes de este archivo.
let MONO = false;
const T = (c: string) => (MONO ? grisar(c) : c);
export const CALLE_PUNTOS = { casa: 560, cafe: 1250, farol: 1760, persiana: 2150, mercado: 2950, depto: 3900 };

const Edificio: React.FC<{ x: number; w: number; top: number; color: string; pal: SetProps["pal"]; pisos: number; seed: number; f: number; zombi?: boolean; ventW?: number }> = ({ x, w, top, color, pal, pisos, seed, f, zombi, ventW = 110 }) => {
  const P = CALLE_PISO;
  const altoPiso = 190;
  const cols = Math.max(2, Math.floor(w / 200));
  return (
    <g>
      <rect x={x} y={top} width={w} height={P - top + 6} fill={color} />
      <Ladrillos x={x} y={top} w={w} h={P - top} color={pal.ladrillo} o={0.45} />
      {/* cornisa */}
      <rect x={x - 10} y={top - 16} width={w + 20} height={22} fill={osc(color, 0.75)} />
      <rect x={x - 4} y={top + 4} width={w + 8} height={8} fill={acl(color, 0.12)} />
      {Array.from({ length: pisos }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const vx = x + (w / cols) * (c + 0.5) - ventW / 2;
          const vy = top + 50 + r * altoPiso;
          if (vy + 140 > P - 330) return null;
          const on = random(`v${seed}${r}${c}`) > (zombi ? 0.72 : 0.38);
          return <g key={`${r}${c}`}>{on && <Halo x={vx + ventW / 2} y={vy + 70} r={150} color={pal.ventana} fuerza={0.22} />}<Ventana key={`${r}${c}`} x={vx} y={vy} w={ventW} h={140} luz={pal.ventana} apagada={pal.ventanaApagada} prendida={on} marco={acl(color, 0.55)} cortina={on && random(`c${seed}${r}${c}`) > 0.5 ? osc(pal.ventana, 0.7) : undefined} persona={on && random(`pp${seed}${r}${c}`) > 0.8} f={f} seed={r * 7 + c} /></g>;
        }),
      )}
      {/* maceteros en los balcones */}
      {Array.from({ length: cols }).map((_, c) => <rect key={c} x={x + (w / cols) * (c + 0.5) - 62} y={top + 200} width={124} height={14} rx={4} fill={osc(color, 0.6)} />)}
    </g>
  );
};

export const CalleNoche: React.FC<SetProps & { lluvia?: boolean }> = ({ capa, f, pal, variante, lluvia }) => {
  const P = CALLE_PISO;
  const zombi = variante === "zombi";
  const llueve = lluvia || variante === "lluvia";
  MONO = pal.nombre === "parabola";
  if (capa === "lejos") {
    return (
      <g>
        <Cielo c={pal.cielo} />
        <Halo x={2600} y={60} r={260} color={pal.luzFria} fuerza={0.35} />
        <circle cx={2600} cy={60} r={46} fill={acl(pal.luzFria, 0.5)} opacity={0.9} />
        {/* skyline lejano: torres claras, con ventanitas */}
        {Array.from({ length: 34 }).map((_, i) => {
          const w = 120 + random(`sk${i}`) * 160, h = 260 + random(`sh${i}`) * 420, x = -1400 + i * 210;
          return (
            <g key={i}>
              <rect x={x} y={P - 220 - h} width={w} height={h + 220} fill={acl(pal.cielo[1], 0.1 + random(`sc${i}`) * 0.1)} opacity={0.85} />
              {Array.from({ length: 6 }).map((_, k) => random(`sw${i}${k}`) > 0.6 && <rect key={k} x={x + 16 + (k % 3) * (w / 3.3)} y={P - 180 - h + 30 + Math.floor(k / 3) * 60} width={14} height={18} fill={pal.ventana} opacity={0.5} />)}
            </g>
          );
        })}
      </g>
    );
  }
  if (capa === "frente") {
    return (
      <g>
        {llueve && <g transform="translate(0,-450)"><Lluvia f={f} w={6000} h={1600} x0={-1000} n={900} seed={7} color={acl(pal.luzFria, 0.4)} largo={2.2} /></g>}
      </g>
    );
  }
  // ---- capa media: la cuadra ----
  const cafeX = 900;
  return (
    <g>
      {/* calle y vereda */}
      <rect x={-1500} y={P} width={7600} height={600} fill={pal.calle} />
      <rect x={-1500} y={P} width={7600} height={70} fill={pal.vereda} />
      {Array.from({ length: 60 }).map((_, i) => <rect key={`b${i}`} x={-1500 + i * 128} y={P} width={3} height={70} fill={osc(pal.vereda, 0.85)} />)}
      <rect x={-1500} y={P + 66} width={7600} height={10} fill={acl(pal.vereda, 0.25)} />
      {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={-1400 + i * 190} y={P + 170} width={110} height={8} fill={acl(pal.calle, 0.25)} opacity={0.55} />)}
      {llueve && Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-1400 + i * 260 + random(`ch${i}`) * 80} y={P + 56 + random(`cy${i}`) * 60} width={90 + random(`cw${i}`) * 90} height={5} rx={2} fill={pal.luz} opacity={0.22} />)}

      {/* edificios de la izquierda */}
      <Edificio x={-900} w={620} top={-260} color={pal.fachada[2]} pal={pal} pisos={5} seed={1} f={f} zombi={zombi} />
      <Edificio x={-280} w={700} top={-120} color={pal.fachada[0]} pal={pal} pisos={5} seed={2} f={f} zombi={zombi} />
      {/* casa 12: puerta con arco y número */}
      <g>
        <path d={`M${480},${P} L${480},${P - 300} Q${560},${P - 380} ${640},${P - 300} L${640},${P} Z`} fill={acl(pal.fachada[0], 0.6)} />
        <rect x={498} y={P - 290} width={124} height={290} rx={4} fill={T("#2b1714")} />
        <rect x={510} y={P - 278} width={100} height={120} rx={3} fill="none" stroke={T("#3d241f")} strokeWidth={4} />
        <rect x={538} y={P - 190} width={44} height={8} rx={3} fill={T("#d9a441")} />
        <circle cx={604} cy={P - 130} r={6} fill={T("#d9a441")} />
        <text x={560} y={P - 318} fontFamily={F_HUD} fontSize={22} fill={T("#3a2a22")} textAnchor="middle">12</text>
        <rect x={660} y={P - 200} width={26} height={44} rx={3} fill={T("#c9b48a")} />
        {[0, 1, 2].map((k) => <circle key={k} cx={673} cy={P - 192 + k * 13} r={4} fill={T("#5b4a33")} />)}
        <Halo x={560} y={P - 330} r={140} color={pal.luz} fuerza={0.35} />
        <rect x={360} y={P - 64} width={50} height={64} rx={6} fill={T("#1f3d2c")} />
        <rect x={354} y={P - 72} width={62} height={12} rx={4} fill={T("#28503a")} />
      </g>

      {/* CORNER CAFÉ */}
      <g>
        <rect x={cafeX - 20} y={-60} width={760} height={P + 66} fill={pal.fachada[1]} />
        <Ladrillos x={cafeX - 20} y={-60} w={760} h={P + 60} color={pal.ladrillo} o={0.4} />
        {[0, 1, 2].map((k) => <Ventana key={k} x={cafeX + 40 + k * 240} y={40} w={150} h={150} luz={pal.ventana} apagada={pal.ventanaApagada} prendida={k !== 1 || !zombi} marco={acl(pal.fachada[1], 0.55)} f={f} seed={k} />)}
        <rect x={cafeX} y={P - 520} width={720} height={520} fill={T("#21463a")} />
        <rect x={cafeX + 20} y={P - 640} width={680} height={100} rx={6} fill={T("#1d3f34")} />
        <text x={cafeX + 360} y={P - 573} fontFamily={F_HUD} fontWeight={600} fontSize={56} letterSpacing={4} fill={T("#f4ecd8")} textAnchor="middle" opacity={zombi && Math.floor(f / 5) % 9 === 0 ? 0.3 : 1}>{zombi ? "CORNER CAFÉ" : "CORNER CAFÉ"}</text>
        {/* toldo a rayas con festón */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${cafeX + i * 60},${P - 530} L${cafeX + (i + 1) * 60},${P - 530} L${cafeX + (i + 1) * 60 + 4},${P - 440} Q${cafeX + i * 60 + 32},${P - 412} ${cafeX + i * 60 - 4},${P - 440} Z`} fill={T(i % 2 ? "#f3ece0" : "#d9352e")} />
        ))}
        {/* vidriera con estantes de tazas y frascos */}
        <rect x={cafeX + 30} y={P - 400} width={430} height={300} fill={acl(pal.luz, 0.1)} opacity={zombi ? 0.45 : 1} />
        <Halo x={cafeX + 245} y={P - 250} r={420} color={pal.luz} fuerza={zombi ? 0.25 : 0.55} />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={cafeX + 40} y={P - 330 + r * 70} width={410} height={7} fill={T("#8a5a36")} />
            {Array.from({ length: 9 }).map((_, k) => {
              const cx = cafeX + 60 + k * 44;
              const t = (k + r) % 3;
              const col = T(["#f2efe8", "#5b8fd6", "#e07a52"][t]);
              return t === 0 ? <rect key={k} x={cx} y={P - 358 + r * 70} width={28} height={28} rx={4} fill={col} /> : <rect key={k} x={cx} y={P - 362 + r * 70} width={22} height={32} rx={3} fill={col} />;
            })}
          </g>
        ))}
        <rect x={cafeX + 150} y={P - 170} width={110} height={60} rx={4} fill={T("#f6f2e8")} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={cafeX + 300 + k * 22} y={P - 150} width={14} height={14} fill={T("#f6f2e8")} />)}
        <rect x={cafeX + 30} y={P - 400} width={430} height={300} fill="none" stroke={T("#173328")} strokeWidth={10} />
        <rect x={cafeX + 240} y={P - 400} width={8} height={300} fill={T("#173328")} />
        {zombi && <path d={`M${cafeX + 330},${P - 380} l30,60 l-40,30 l50,50 M${cafeX + 360},${P - 320} l40,-20`} stroke={T("#e9f2ee")} strokeWidth={3} fill="none" opacity={0.7} />}
        {/* cartel OPEN y puerta */}
        <rect x={cafeX + 340} y={P - 380} width={90} height={40} rx={8} fill="none" stroke={T(zombi ? "#663a4a" : "#ff6fa0")} strokeWidth={4} />
        <text x={cafeX + 385} y={P - 350} fontFamily={F_HUD} fontWeight={600} fontSize={24} fill={T(zombi ? "#663a4a" : "#ff8ab4")} textAnchor="middle">{zombi ? "CLOSED" : "OPEN"}</text>
        <rect x={cafeX + 500} y={P - 400} width={180} height={400} fill={T("#173328")} />
        <rect x={cafeX + 514} y={P - 386} width={152} height={250} fill={acl(pal.luz, 0.05)} opacity={zombi ? 0.4 : 0.9} />
        <rect x={cafeX + 600} y={P - 240} width={50} height={64} rx={3} fill={T("#f4eee0")} />
        <text x={cafeX + 625} y={P - 214} fontFamily={F_HUD} fontSize={11} fill="#333" textAnchor="middle">OPEN 7-7</text>
        {/* pizarrón de vereda */}
        <path d={`M${cafeX + 690},${P} L${cafeX + 720},${P - 170} L${cafeX + 800},${P - 170} L${cafeX + 830},${P} Z`} fill={T("#3b2a20")} />
        <rect x={cafeX + 722} y={P - 160} width={76} height={120} fill={T("#2a2b2a")} />
        <text x={cafeX + 760} y={P - 128} fontFamily={F_MANO} fontSize={22} fill="#eee" textAnchor="middle">TODAY</text>
        <text x={cafeX + 760} y={P - 102} fontFamily={F_MANO} fontSize={18} fill="#eee" textAnchor="middle">flat white</text>
        <text x={cafeX + 760} y={P - 80} fontFamily={F_MANO} fontSize={18} fill="#eee" textAnchor="middle">croissant</text>
        {/* mesitas afuera */}
        {[cafeX + 120, cafeX + 380].map((tx, i) => (
          <g key={i}>
            <ellipse cx={tx} cy={P - 104} rx={56} ry={10} fill={T("#f0ebe0")} />
            <rect x={tx - 3} y={P - 100} width={6} height={100} fill={T("#232323")} />
            <rect x={tx - 26} y={P - 4} width={52} height={5} fill={T("#232323")} />
            <rect x={tx - 10} y={P - 122} width={18} height={18} rx={3} fill={T("#f8f5ee")} />
            {!zombi && <path d={`M${tx - 2},${P - 128} q6,-14 0,-24 q-6,-10 2,-22`} stroke="#fff" strokeWidth={2} fill="none" opacity={0.35 + 0.15 * Math.sin(f / 10)} />}
          </g>
        ))}
        <Planta x={cafeX + 250} y={P} s={0.9} f={f} seed={1} />
        <Planta x={cafeX - 60} y={P} s={1.05} f={f} seed={2} />
      </g>

      {/* buzón rojo */}
      <g>
        <rect x={1640} y={P - 170} width={70} height={170} rx={12} fill={T("#d4382d")} />
        <path d={`M1636,${P - 168} Q1675,${P - 210} 1714,${P - 168} Z`} fill={T("#b72d24")} />
        <rect x={1652} y={P - 138} width={46} height={8} rx={3} fill={T("#3a1410")} />
        <rect x={1660} y={P - 100} width={30} height={18} rx={3} fill={T("#f6ead0")} />
      </g>
      <Farol x={1790} piso={P} alto={560} color={pal.luz} lado={-1} fuerza={zombi ? (random(`fz${Math.floor(f / 4)}`) > 0.85 ? 0.25 : 0.9) : 1} />

      {/* local con persiana CLOSED */}
      <g>
        <rect x={1880} y={-40} width={560} height={P + 46} fill={pal.fachada[2]} />
        <Ladrillos x={1880} y={-40} w={560} h={P + 40} color={pal.ladrillo} o={0.45} />
        {[0, 1].map((k) => <Ventana key={k} x={1940 + k * 260} y={60} w={180} h={160} luz={pal.ventana} apagada={pal.ventanaApagada} prendida={k === 0 && !zombi} marco={acl(pal.fachada[2], 0.5)} f={f} />)}
        <rect x={1920} y={P - 420} width={420} height={420} fill={T("#3a3a48")} />
        {Array.from({ length: 21 }).map((_, i) => <rect key={i} x={1920} y={P - 420 + i * 20} width={420} height={3} fill={T("#2a2a34")} />)}
        <rect x={2350} y={P - 340} width={70} height={30} rx={4} fill={T("#c23a3a")} />
        <text x={2385} y={P - 319} fontFamily={F_HUD} fontSize={16} fill="#ffe" textAnchor="middle">CLOSED</text>
        {/* bici apoyada */}
        <g stroke={T("#3fb3a2")} strokeWidth={6} fill="none">
          <circle cx={2010} cy={P - 40} r={40} /><circle cx={2140} cy={P - 40} r={40} />
          <path d={`M2010,${P - 40} L2060,${P - 100} L2140,${P - 40} M2060,${P - 100} L2110,${P - 100} L2140,${P - 40} M2055,${P - 112} L2075,${P - 112} M2110,${P - 100} L2118,${P - 125}`} />
        </g>
      </g>

      {/* MERCADO (para la serie zombie: vidriera grande y puertas de vidrio) */}
      <g>
        <Edificio x={2480} w={900} top={-200} color={pal.fachada[3]} pal={pal} pisos={4} seed={5} f={f} zombi={zombi} ventW={130} />
        <rect x={2520} y={P - 470} width={820} height={470} fill={osc(pal.fachada[3], 0.7)} />
        <rect x={2540} y={P - 560} width={780} height={80} rx={6} fill={T("#f2ede1")} />
        <text x={2930} y={P - 504} fontFamily={F_HUD} fontWeight={600} fontSize={52} letterSpacing={6} fill={T(zombi ? "#b0302a" : "#2f6b4a")} textAnchor="middle" opacity={zombi && random(`mk${Math.floor(f / 3)}`) > 0.8 ? 0.35 : 1}>FRESH MARKET</text>
        <rect x={2560} y={P - 430} width={740} height={430} fill={zombi ? osc(pal.luzFria, 0.35) : acl(pal.luzFria, 0.2)} opacity={0.9} />
        {/* estantes que se ven a través del vidrio */}
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({ length: 22 }).map((_, k) => <rect key={k} x={2580 + k * 32} y={P - 360 + r * 80} width={24} height={36} rx={3} fill={T(["#e0563a", "#f1c24a", "#5aa0d8", "#7fc46a", "#f2efe6"][(k + r * 2) % 5])} opacity={0.85} />)}
            <rect x={2570} y={P - 322 + r * 80} width={720} height={6} fill={T("#8a8f96")} />
          </g>
        ))}
        <rect x={2560} y={P - 430} width={740} height={430} fill="none" stroke={T("#e9ece8")} strokeWidth={8} />
        {[2805, 3055].map((x) => <rect key={x} x={x} y={P - 430} width={8} height={430} fill={T("#e9ece8")} />)}
        <Halo x={2930} y={P - 250} r={520} color={pal.luzFria} fuerza={zombi ? 0.18 : 0.3} />
        {zombi && (
          <>
            {/* manos y caras contra el vidrio */}
            {[2620, 2700, 3110, 3200].map((x, i) => <circle key={i} cx={x} cy={P - 200 - (i % 2) * 30} r={34} fill={T("#62735d")} opacity={0.85} />)}
            {[2600, 2680, 3090, 3230].map((x, i) => <rect key={i} x={x} y={P - 300 + (i % 2) * 20} width={18} height={44} rx={9} fill={T("#62735d")} opacity={0.85} />)}
            <path d="M2600,830 l80,-120 l40,90 l60,-60" stroke={T("#e8efe9")} strokeWidth={3} fill="none" opacity={0.6} />
          </>
        )}
      </g>
      <Farol x={3460} piso={P} alto={560} color={pal.luz} lado={1} fuerza={zombi ? 0 : 1} />

      {/* edificio de departamentos con escalera de incendio */}
      <Edificio x={3400} w={1000} top={-320} color={pal.fachada[0]} pal={pal} pisos={5} seed={9} f={f} zombi={zombi} />
      <g stroke={osc(pal.fachada[0], 0.45)} strokeWidth={5} fill="none">
        {[0, 1, 2].map((k) => <path key={k} d={`M3640,${-40 + k * 190} h300 M3640,${30 + k * 190} h300 M3660,${-40 + k * 190} l260,190`} />)}
      </g>
      <Arbusto x={3480} y={P} w={260} h={70} color="#2f5a42" seed={3} />
      {/* banco y tacho */}
      <g>
        <rect x={3800} y={P - 80} width={220} height={14} rx={4} fill={T("#7a4e30")} />
        <rect x={3800} y={P - 120} width={220} height={12} rx={4} fill={T("#7a4e30")} />
        <rect x={3815} y={P - 70} width={10} height={70} fill={T("#2a2a2a")} /><rect x={3995} y={P - 70} width={10} height={70} fill={T("#2a2a2a")} />
        <path d={`M4120,${P} L4110,${P - 110} L4190,${P - 110} L4180,${P} Z`} fill={T("#3a4a3e")} transform={zombi ? `rotate(-78 4150 ${P})` : undefined} />
      </g>
      {zombi && (
        <g>
          {/* basura y papeles en la vereda */}
          {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-600 + i * 330 + random(`bp${i}`) * 100} y={P + 6 + random(`by${i}`) * 26} width={26} height={18} rx={2} fill={T("#d9d6cc")} opacity={0.6} transform={`rotate(${random(`br${i}`) * 60 - 30} ${-600 + i * 330} ${P + 10})`} />)}
          {/* auto abandonado con balizas */}
          <g transform={`translate(4300,${P + 180})`}>
            <path d="M-260,0 L-250,-70 Q-200,-90 -150,-92 L-90,-150 L120,-150 L190,-92 Q250,-88 270,-60 L275,0 Z" fill={T("#6c7378")} />
            <rect x={-80} y={-138} width={90} height={46} rx={6} fill={T("#25313a")} /><rect x={20} y={-138} width={90} height={46} rx={6} fill={T("#25313a")} />
            <circle cx={-160} cy={0} r={40} fill={T("#151515")} /><circle cx={170} cy={0} r={40} fill={T("#151515")} />
            <Halo x={-250} y={-40} r={120} color="#ffae3a" fuerza={Math.floor(f / 15) % 2 ? 0.7 : 0.05} />
            <Halo x={268} y={-40} r={120} color="#ff5a3a" fuerza={Math.floor(f / 15) % 2 ? 0.7 : 0.05} />
          </g>
        </g>
      )}
    </g>
  );
};
