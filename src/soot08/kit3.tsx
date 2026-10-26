import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd, clamp } from "../soot/lib";
import { C, ent, prog, fontFamily } from "./kit";

// Kit de la fábrica victoriana (soot08): todo vector plano en código, cero imágenes.
// Cada pieza se dibuja en coordenadas de MUNDO con origen abajo al centro (x, y = donde apoya en el piso),
// así el mismo objeto sirve de fondo, de primer plano o de detalle al que la cámara se mete.
type P = { x: number; y: number; s?: number };
export const T = "#2a1530"; // tinta
export const V = {
  ladrillo: "#b5452c", ladrillo2: "#8c3424", junta: "#6e2a1f", hollin: "#3a2a44", hollin2: "#251a30",
  luz: "#ffd27a", luz2: "#ffb347", hierro: "#4a4458", hierro2: "#2e2a3a", acero: "#9aa3b5", madera: "#8a5a2c", madera2: "#5e3a1a",
  algodon: "#fbf6ec", piso: "#6b4a2e", piso2: "#4e3420", pared: "#e8c9a0", pared2: "#c9a274", cielo: "#2d1b69",
};

export const Pie: React.FC<P & { w: number; h: number; children: React.ReactNode; op?: number; rot?: number; style?: React.CSSProperties }> = ({ x, y, s = 1, w, h, children, op = 1, rot = 0, style }) => (
  <svg style={{ position: "absolute", left: x - (w / 2) * s, top: y - h * s, overflow: "visible", opacity: op, transform: rot ? `rotate(${rot}deg)` : undefined, transformOrigin: "50% 100%", ...style }} width={w * s} height={h * s} viewBox={`${-w / 2} ${-h} ${w} ${h}`}>
    {children}
  </svg>
);
const Brillo: React.FC<{ d: string; w?: number; o?: number }> = ({ d, w = 10, o = 0.5 }) => <path d={d} stroke="#fff" strokeOpacity={o} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ── ladrillos: patrón por id (mismo dibujo en todos lados, así repetir el id no importa)
export const DefsLadrillo: React.FC<{ id?: string; base?: string; junta?: string }> = ({ id = "lad", base = V.ladrillo, junta = V.junta }) => (
  <defs>
    <pattern id={id} width={80} height={40} patternUnits="userSpaceOnUse">
      <rect width={80} height={40} fill={base} />
      <path d="M 0 20 L 80 20 M 0 40 L 80 40 M 40 0 L 40 20 M 0 20 L 0 40 M 80 20 L 80 40" stroke={junta} strokeWidth={4} />
      <rect x={6} y={4} width={22} height={6} rx={3} fill="#fff" opacity={0.07} />
    </pattern>
  </defs>
);

// humo que sale de una chimenea: bocanadas que suben, crecen y se apagan
export const Humo: React.FC<{ t: number; x: number; y: number; n?: number; color?: string; vel?: number; s?: number; viento?: number }> = ({ t, x, y, n = 9, color = "#5b4a6e", vel = 1, s = 1, viento = 70 }) => (
  <svg style={{ position: "absolute", left: x - 700 * s, top: y - 1400 * s, overflow: "visible", pointerEvents: "none" }} width={1400 * s} height={1400 * s} viewBox="-700 -1400 1400 1400">
    {Array.from({ length: n }, (_, i) => {
      const k = ((t * 0.16 * vel + i / n) % 1);
      const r = 40 + k * 230;
      return <circle key={i} cx={k * viento * 6 + Math.sin(t + i) * 20} cy={-k * 1250} r={r} fill={color} opacity={(1 - k) * 0.75} />;
    })}
  </svg>
);

// ── reloj de fábrica: horas en decimal (5.5 = 5:30). Números romanos en marcas, agujas con rebote.
export const Reloj: React.FC<P & { hora: number; marco?: string }> = ({ hora, marco = "#2e2a3a", ...p }) => {
  const am = (hora % 12) * 30, mm = (hora % 1) * 360;
  return (
    <Pie {...p} w={440} h={440}>
      <g transform="translate(0 -220)">
        <circle r={214} fill={marco} />
        <circle r={190} fill="#fff6dc" />
        <circle r={190} fill="none" stroke="#e8d6a8" strokeWidth={14} />
        {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} y1={-176} x2={0} y2={i % 5 ? -166 : -150} stroke={T} strokeWidth={i % 5 ? 4 : 10} transform={`rotate(${i * 6})`} />)}
        {["XII", "III", "VI", "IX"].map((n, i) => <text key={n} x={Math.sin((i * Math.PI) / 2) * 118} y={-Math.cos((i * Math.PI) / 2) * 118 + 16} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill={T}>{n}</text>)}
        <line x1={0} y1={20} x2={0} y2={-96} stroke={T} strokeWidth={16} strokeLinecap="round" transform={`rotate(${am})`} />
        <line x1={0} y1={26} x2={0} y2={-150} stroke={C.rojo} strokeWidth={9} strokeLinecap="round" transform={`rotate(${mm})`} />
        <circle r={16} fill={T} />
        <Brillo d="M -130 -110 Q -60 -170 20 -170" w={12} o={0.6} />
      </g>
    </Pie>
  );
};

// ── casa adosada (back-to-back) con ventana de arriba (dormitorio) y de abajo
export const CasaObrera: React.FC<P & { t: number; luzArriba?: number; luzAbajo?: number; seed?: number; humo?: boolean }> = ({ t, luzArriba = 0, luzAbajo = 0, seed = 1, humo = true, ...p }) => {
  const r = rnd(seed);
  const tono = ["#a3412c", "#9a3b2a", "#b04a30", "#8f3a28"][Math.floor(r() * 4)];
  const puerta = [C.violeta, C.teal, "#3f6b3a", C.rojo][Math.floor(r() * 4)];
  return (
    <>
      <Pie {...p} w={380} h={640}>
        <DefsLadrillo id={`lc${seed % 4}`} base={tono} />
        <rect x={110} y={-640} width={50} height={110} fill={V.hollin} />
        <rect x={100} y={-650} width={70} height={20} fill={V.hollin2} />
        <path d="M -200 -520 L 0 -600 L 200 -520 Z" fill="#3b2a4a" />
        <rect x={-180} y={-530} width={360} height={530} fill={`url(#lc${seed % 4})`} />
        <rect x={-180} y={-530} width={360} height={24} fill="#3b2a4a" opacity={0.6} />
        {/* ventana de arriba */}
        <rect x={-120} y={-460} width={110} height={130} rx={6} fill={luzArriba > 0 ? V.luz : "#20183a"} opacity={0.35 + 0.65 * Math.max(luzArriba, luzArriba ? 0 : 1)} />
        <path d="M -65 -460 L -65 -330 M -120 -395 L -10 -395" stroke="#e8d6b0" strokeWidth={8} />
        <rect x={-130} y={-334} width={130} height={14} fill="#d9c9a8" />
        {/* puerta y ventana de abajo */}
        <rect x={40} y={-230} width={100} height={230} rx={8} fill={puerta} />
        <circle cx={120} cy={-110} r={8} fill={C.oro} />
        <rect x={-120} y={-220} width={110} height={120} rx={6} fill={luzAbajo > 0 ? V.luz2 : "#20183a"} />
        <path d="M -65 -220 L -65 -100 M -120 -160 L -10 -160" stroke="#e8d6b0" strokeWidth={8} />
        <rect x={30} y={0} width={120} height={14} fill="#8a8494" />
      </Pie>
      {humo && <Humo t={t + seed} x={p.x + 135 * (p.s ?? 1)} y={p.y - 650 * (p.s ?? 1)} n={6} s={(p.s ?? 1) * 0.6} color="#4a3d5e" />}
    </>
  );
};

// ── farol de gas con halo
export const Farol: React.FC<P & { t: number; on?: number }> = ({ t, on = 1, ...p }) => (
  <Pie {...p} w={300} h={760}>
    <defs><radialGradient id="halofarol"><stop offset="0" stopColor="#ffe6a0" stopOpacity={0.7} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient></defs>
    {on > 0 && <circle cx={0} cy={-640} r={260 + Math.sin(t * 9) * 6} fill="url(#halofarol)" opacity={on} />}
    <rect x={-12} y={-600} width={24} height={600} fill={V.hollin2} />
    <rect x={-40} y={-20} width={80} height={20} rx={6} fill={V.hollin2} />
    <path d="M -50 -600 L 50 -600 L 40 -700 L -40 -700 Z" fill={on > 0 ? "#ffe39a" : "#5a5070"} />
    <path d="M -60 -700 L 60 -700 L 0 -740 Z" fill={V.hollin2} />
    <rect x={-56} y={-604} width={112} height={12} fill={V.hollin2} />
  </Pie>
);

// ── adoquines
export const Adoquines: React.FC<{ x: number; y: number; w: number; h?: number; color?: string }> = ({ x, y, w, h = 300, color = "#4a3d5e" }) => {
  const filas = Math.ceil(h / 40);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h}>
      <rect width={w} height={h} fill={color} />
      {Array.from({ length: filas }, (_, i) => (
        <g key={i}>
          {Array.from({ length: Math.ceil(w / 90) + 1 }, (_, k) => <rect key={k} x={k * 90 - (i % 2) * 45 + 6} y={i * 40 + 6} width={78} height={30} rx={12} fill="#5d4f72" opacity={0.6 + ((i * 7 + k * 3) % 5) * 0.08} />)}
        </g>
      ))}
    </svg>
  );
};

// ── fábrica: fachada de ladrillo con hileras de ventanas encendidas, torre del reloj, campana y chimenea.
// `abre` (0-1) desvanece la fachada para mostrar el corte de adentro (la casa de muñecas).
export const FachadaFabrica: React.FC<P & { t: number; w: number; pisos: number; abre?: number; hora: number; tCampana?: number; portonAbre?: number }> = ({ t, w, pisos, abre = 0, hora, tCampana = 1e9, portonAbre = 0, ...p }) => {
  const H = pisos * 1000;
  const col = Math.floor(w / 260);
  const sw = t > tCampana ? Math.sin((t - tCampana) * 16) * 24 * Math.exp(-(t - tCampana) * 1.6) : 0;
  return (
    <>
      <Pie {...p} w={w} h={H + 1400} op={1 - abre}>
        <DefsLadrillo id="ladfab" />
        <rect x={-w / 2} y={-H} width={w} height={H} fill="url(#ladfab)" />
        {/* cornisas entre pisos */}
        {Array.from({ length: pisos + 1 }, (_, i) => <rect key={i} x={-w / 2 - 20} y={-i * 1000 - 30} width={w + 40} height={34} fill="#e2c69a" />)}
        {/* ventanas */}
        {Array.from({ length: pisos }, (_, f) => Array.from({ length: col }, (_, c) => {
          const cx = -w / 2 + 130 + c * ((w - 260) / Math.max(1, col - 1));
          const cy = -f * 1000 - 760;
          if (f === 0 && Math.abs(cx) < 330) return null;
          const parpa = 0.85 + 0.15 * Math.sin(t * 3 + c * 1.7 + f);
          return (
            <g key={`${f}-${c}`}>
              <rect x={cx - 80} y={cy} width={160} height={520} rx={80} fill={V.luz} opacity={parpa} />
              <path d={`M ${cx} ${cy + 10} L ${cx} ${cy + 520} M ${cx - 80} ${cy + 200} L ${cx + 80} ${cy + 200} M ${cx - 80} ${cy + 360} L ${cx + 80} ${cy + 360}`} stroke="#6e2a1f" strokeWidth={10} />
              <rect x={cx - 92} y={cy + 512} width={184} height={22} fill="#e2c69a" />
            </g>
          );
        }))}
        {/* portón */}
        <path d="M -300 0 L -300 -560 Q 0 -760 300 -560 L 300 0 Z" fill="#2a1f38" />
        <g transform={`translate(-300 0) scale(${1 - portonAbre * 0.85} 1)`}><rect x={0} y={-600} width={300} height={600} fill={V.hierro} />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={20 + i * 46} y={-580} width={14} height={580} fill={V.hierro2} />)}</g>
        <g transform={`translate(300 0) scale(${-(1 - portonAbre * 0.85)} 1)`}><rect x={0} y={-600} width={300} height={600} fill={V.hierro} />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={20 + i * 46} y={-580} width={14} height={580} fill={V.hierro2} />)}</g>
        <rect x={-280} y={-780} width={560} height={86} rx={12} fill="#e2c69a" />
        <text x={0} y={-718} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={54} fill={T} letterSpacing={6}>COTTON MILL</text>
        {/* torre del reloj */}
        <rect x={-260} y={-H - 900} width={520} height={900} fill="url(#ladfab)" />
        <path d="M -300 -900 L 0 -1300 L 300 -900 Z" transform={`translate(0 ${-H})`} fill="#3b2a4a" />
        <rect x={-300} y={-H - 30} width={600} height={40} fill="#e2c69a" />
        {/* campana en su arco */}
        <g transform={`translate(0 ${-H - 1020})`}>
          <path d="M -110 -120 L -110 120 M 110 -120 L 110 120" stroke="#e2c69a" strokeWidth={24} />
          <g transform={`rotate(${sw} 0 -110)`}>
            <path d="M -70 50 Q -70 -90 0 -90 Q 70 -90 70 50 L 86 66 L -86 66 Z" fill="#ffcf5a" />
            <circle cx={0} cy={80} r={18} fill="#e9a92a" />
          </g>
        </g>
      </Pie>
      {abre < 1 && <Reloj x={p.x} y={p.y - (H + 220) * (p.s ?? 1)} s={1.1 * (p.s ?? 1)} hora={hora} />}
    </>
  );
};

// chimenea alta de fábrica (va aparte: queda visible con la fachada abierta)
export const Chimenea: React.FC<P & { t: number; alto?: number }> = ({ t, alto = 2600, ...p }) => (
  <>
    <Pie {...p} w={360} h={alto}>
      <DefsLadrillo id="ladchim" base="#9a3b2a" />
      <path d={`M -150 0 L -100 ${-alto} L 100 ${-alto} L 150 0 Z`} fill="url(#ladchim)" />
      <rect x={-130} y={-alto - 10} width={260} height={70} fill={V.hollin} />
      {[0.3, 0.6].map((k) => <rect key={k} x={-140 + k * 30} y={-alto * k} width={280 - k * 60} height={30} fill="#e2c69a" />)}
    </Pie>
    <Humo t={t} x={p.x} y={p.y - alto * (p.s ?? 1)} n={12} s={(p.s ?? 1) * 1.4} color="#3b2f4e" vel={1.4} />
  </>
);

// ── máquina de vapor: volante con rayos que gira, biela que va y viene, bocanadas
export const MaquinaVapor: React.FC<P & { t: number; vel?: number }> = ({ t, vel = 1, ...p }) => {
  const a = t * 140 * vel;
  const ang = (a * Math.PI) / 180;
  const px = Math.cos(ang) * 150;
  return (
    <Pie {...p} w={1100} h={900}>
      <rect x={-520} y={-60} width={1040} height={60} fill={V.hierro2} />
      {/* cilindro */}
      <rect x={-500} y={-380} width={330} height={200} rx={20} fill={V.acero} />
      <rect x={-500} y={-380} width={330} height={40} rx={14} fill="#c8cfdc" />
      <rect x={-440} y={-180} width={60} height={120} fill={V.hierro} />
      {/* biela */}
      <line x1={-170 + px * 0.4} y1={-280} x2={250 + px} y2={-420 + Math.sin(ang) * 150} stroke={V.hierro} strokeWidth={30} strokeLinecap="round" />
      <circle cx={-170 + px * 0.4} cy={-280} r={26} fill={C.oro} />
      {/* volante */}
      <g transform={`translate(250 -420) rotate(${a})`}>
        <circle r={380} fill="none" stroke={V.hierro} strokeWidth={56} />
        <circle r={380} fill="none" stroke="#6b647e" strokeWidth={12} />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={0} x2={0} y2={-360} stroke={V.hierro} strokeWidth={26} transform={`rotate(${i * 60})`} />)}
        <circle r={60} fill={V.hierro2} />
        <circle r={22} fill={C.oro} />
        <circle cx={0} cy={-380} r={14} fill={C.rojo} />
      </g>
      <rect x={180} y={-60} width={140} height={60} fill={V.hierro} />
      {[0, 1, 2].map((i) => { const k = ((t * 0.9 * vel + i / 3) % 1); return <circle key={i} cx={-560 - k * 160} cy={-330 - k * 260} r={40 + k * 110} fill="#f4f0ff" opacity={(1 - k) * 0.55} />; })}
    </Pie>
  );
};

// ── eje de transmisión del techo: poleas que giran y correas (rayadas que corren) hacia abajo
export const EjeTecho: React.FC<{ t: number; x: number; y: number; w: number; poleas: number[]; bajan?: number; vel?: number }> = ({ t, x, y, w, poleas, bajan = 520, vel = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y - 60, overflow: "visible" }} width={w} height={bajan + 120}>
    <rect x={0} y={44} width={w} height={22} rx={11} fill={V.hierro} />
    {Array.from({ length: Math.floor(w / 320) }, (_, i) => <path key={i} d={`M ${160 + i * 320} 0 L ${160 + i * 320} 44`} stroke={V.hierro2} strokeWidth={14} />)}
    {poleas.map((px, i) => (
      <g key={i}>
        <line x1={px - 44} y1={55} x2={px - 44} y2={bajan + 60} stroke="#6b3a1f" strokeWidth={18} strokeDasharray="30 18" strokeDashoffset={-t * 300 * vel} />
        <line x1={px + 44} y1={55} x2={px + 44} y2={bajan + 60} stroke="#6b3a1f" strokeWidth={18} strokeDasharray="30 18" strokeDashoffset={t * 300 * vel} />
        <g transform={`translate(${px} 55) rotate(${t * 360 * vel})`}>
          <circle r={52} fill={V.acero} stroke={V.hierro2} strokeWidth={8} />
          {[0, 90].map((a) => <line key={a} x1={-44} y1={0} x2={44} y2={0} stroke={V.hierro2} strokeWidth={10} transform={`rotate(${a})`} />)}
        </g>
      </g>
    ))}
  </svg>
);

// ── engranaje que gira (dientes de verdad)
export const Engranaje: React.FC<{ t: number; x: number; y: number; r: number; dientes?: number; vel?: number; color?: string; fase?: number }> = ({ t, x, y, r, dientes = 14, vel = 1, color = V.hierro, fase = 0 }) => {
  const d: string[] = [];
  for (let i = 0; i < dientes * 2; i++) {
    const a0 = (i / (dientes * 2)) * Math.PI * 2, a1 = ((i + 1) / (dientes * 2)) * Math.PI * 2;
    const R = i % 2 ? r : r * 1.16;
    d.push(`${i ? "L" : "M"} ${Math.cos(a0) * R} ${Math.sin(a0) * R} L ${Math.cos(a1) * R} ${Math.sin(a1) * R}`);
  }
  return (
    <svg style={{ position: "absolute", left: x - r * 1.2, top: y - r * 1.2, overflow: "visible" }} width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`}>
      <g transform={`rotate(${fase + t * 90 * vel})`}>
        <path d={d.join(" ") + " Z"} fill={color} />
        <circle r={r * 0.78} fill="#6b647e" />
        <circle r={r * 0.6} fill={color} />
        {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={Math.cos((i / 5) * Math.PI * 2) * r * 0.42} cy={Math.sin((i / 5) * Math.PI * 2) * r * 0.42} r={r * 0.11} fill="#20183a" />)}
        <circle r={r * 0.14} fill={C.oro} />
      </g>
    </svg>
  );
};

// ── la mula de hilar: cabezal fijo + carro con husos que sale (u=1) y vuelve (u=0); hilos que se estiran
export const Mula: React.FC<P & { t: number; u: number; n?: number; corta?: number[] }> = ({ t, u, n = 22, corta = [], ...p }) => {
  const W = 2400, sale = 520 * u;
  return (
    <Pie {...p} w={W} h={760}>
      {/* rieles en el piso */}
      <rect x={-W / 2} y={-26} width={W} height={14} fill={V.hierro2} />
      <rect x={-W / 2} y={-14} width={W} height={14} fill="#5d5670" />
      {/* cabezal (rollos de entrada con las bobinas de mecha arriba) */}
      <rect x={-W / 2} y={-640} width={W} height={150} rx={14} fill={V.madera} />
      <rect x={-W / 2} y={-640} width={W} height={30} rx={14} fill="#b27a42" />
      {Array.from({ length: n }, (_, i) => <g key={i}><rect x={-W / 2 + 40 + i * ((W - 80) / n)} y={-720} width={44} height={80} rx={14} fill={V.algodon} /><rect x={-W / 2 + 52 + i * ((W - 80) / n)} y={-700} width={20} height={60} fill="#e3d9c4" /></g>)}
      {[-W / 2 + 40, 0, W / 2 - 80].map((lx) => <rect key={lx} x={lx} y={-490} width={40} height={490} fill={V.madera2} />)}
      {/* hilos: del cabezal al carro */}
      {Array.from({ length: n }, (_, i) => {
        const hx = -W / 2 + 62 + i * ((W - 80) / n);
        if (corta.includes(i)) return <path key={i} d={`M ${hx} -490 q 10 40 -6 ${80 + Math.sin(t * 9 + i) * 10}`} stroke={V.algodon} strokeWidth={4} fill="none" />;
        return <line key={i} x1={hx} y1={-490} x2={hx + 6} y2={-330 + sale * 0.02} stroke={V.algodon} strokeWidth={4} opacity={0.9} />;
      })}
      {/* carro con husos: avanza HACIA cámara (más abajo y más grande) */}
      <g transform={`translate(0 ${sale * 0.35}) scale(${1 + u * 0.06})`}>
        <rect x={-W / 2 - 10} y={-330} width={W + 20} height={70} rx={16} fill={V.madera} />
        <rect x={-W / 2 - 10} y={-330} width={W + 20} height={18} rx={10} fill="#c48a4c" />
        {Array.from({ length: n }, (_, i) => {
          const hx = -W / 2 + 62 + i * ((W - 80) / n);
          const g = (t * 30 + i) % 1;
          return (
            <g key={i}>
              <rect x={hx - 5} y={-420} width={10} height={100} fill={V.acero} />
              <ellipse cx={hx} cy={-372} rx={22} ry={44} fill={V.algodon} />
              <path d={`M ${hx - 20} ${-380 + g * 16} L ${hx + 20} ${-372 + g * 16}`} stroke="#ddd2bc" strokeWidth={4} />
            </g>
          );
        })}
        {[-W / 2 + 60, -W / 4, 0, W / 4, W / 2 - 60].map((rx) => <circle key={rx} cx={rx} cy={-240} r={30} fill={V.hierro2} />)}
        <rect x={-W / 2} y={-262} width={W} height={20} fill={V.hierro2} />
      </g>
    </Pie>
  );
};

// ── cardadora: tambor grande con púas que gira + rollos chicos + velo de algodón que sale
export const Cardadora: React.FC<P & { t: number }> = ({ t, ...p }) => (
  <Pie {...p} w={1200} h={700}>
    <rect x={-560} y={-90} width={1120} height={90} fill={V.hierro2} />
    <g transform={`translate(-60 -360) rotate(${t * 120})`}>
      <circle r={260} fill={V.acero} />
      {Array.from({ length: 48 }, (_, i) => <line key={i} x1={0} y1={-252} x2={0} y2={-286} stroke="#c8cfdc" strokeWidth={6} transform={`rotate(${i * 7.5})`} />)}
      <circle r={200} fill="#7d8796" />
      {[0, 120, 240].map((a) => <rect key={a} x={-10} y={-200} width={20} height={200} fill="#5d6577" transform={`rotate(${a})`} />)}
      <circle r={30} fill={C.oro} />
    </g>
    {[[-420, -520, 70], [300, -540, 80], [380, -240, 60]].map(([cx, cy, r], i) => (
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${-t * 220})`}><circle r={r} fill={V.hierro} />{Array.from({ length: 12 }, (_, k) => <line key={k} x1={0} y1={-r} x2={0} y2={-r - 14} stroke={V.acero} strokeWidth={5} transform={`rotate(${k * 30})`} />)}</g>
    ))}
    <path d={`M 400 -240 Q 520 ${-200 + Math.sin(t * 3) * 10} 600 -160 L 600 -120 Q 520 -150 400 -200 Z`} fill={V.algodon} opacity={0.9} />
    <rect x={-560} y={-110} width={1120} height={30} fill={V.madera2} />
  </Pie>
);

// ── pelusa de algodón en el aire (más densa en la sala de cardas)
export const Pelusa: React.FC<{ t: number; x: number; y: number; w: number; h: number; n?: number; seed?: number; dens?: number }> = ({ t, x, y, w, h, n = 90, seed = 5, dens = 1 }) => {
  const r = React.useMemo(() => { const q = rnd(seed); return Array.from({ length: n }, () => [q() * w, q() * h, 0.4 + q(), q() * 6, q()]); }, [n, seed, w, h]);
  return (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none", overflow: "visible" }} width={w} height={h}>
      {r.map(([px, py, v, f, s], i) => {
        const xx = (px + t * 24 * v + Math.sin(t * 0.8 + f) * 50) % w;
        const yy = (py + Math.sin(t * 0.6 + f) * 40 + t * 10 * v) % h;
        return <circle key={i} cx={xx} cy={yy} r={3 + s * 7} fill="#fff8ec" opacity={(0.25 + 0.45 * s) * dens} />;
      })}
    </svg>
  );
};

// ── termómetro (°F) con el mercurio que sube
export const Termometro: React.FC<P & { nivel: number; marcas?: number[]; unidad?: string }> = ({ nivel, marcas = [60, 70, 80, 90], unidad = "", ...p }) => (
  <Pie {...p} w={260} h={900}>
    <rect x={-70} y={-880} width={140} height={760} rx={70} fill="#fff6dc" stroke={T} strokeWidth={10} />
    <rect x={-22} y={-820 + 640 * (1 - nivel)} width={44} height={640 * nivel + 30} rx={22} fill={C.rojo} />
    <circle cx={0} cy={-110} r={100} fill={C.rojo} stroke={T} strokeWidth={10} />
    {marcas.map((m, i) => <g key={m}><line x1={30} y1={-760 + i * 170} x2={64} y2={-760 + i * 170} stroke={T} strokeWidth={8} /><text x={-104} y={-746 + i * 170} textAnchor="end" fontFamily={fontFamily} fontWeight={700} fontSize={48} fill="#fff">{marcas[marcas.length - 1 - i]}°{unidad}</text></g>)}
    <Brillo d="M -40 -830 L -40 -260" w={14} o={0.6} />
  </Pie>
);

// ── cartel de multas impreso (aviso de fábrica): renglones que entran, monto en rojo, sello opcional
export const Aviso: React.FC<{ t: number; t0: number; x: number; y: number; w?: number; titulo: string; items: { txt: string; t0: number; monto?: string }[]; foco?: number }> = ({ t, t0, x, y, w = 1180, titulo, items, foco = -1 }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  const H = 190 + items.length * 92;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - H / 2, width: w, height: H, transform: `scale(${e}) rotate(${(1 - e) * 8 - 1}deg)` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #fbf3dc, #eadbb2)", borderRadius: 8, boxShadow: "16px 18px 0 rgba(20,8,40,.4)", border: `8px double ${T}` }} />
      <div style={{ position: "absolute", top: 22, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 64, color: T, letterSpacing: 6 }}>{titulo}</div>
      <div style={{ position: "absolute", top: 108, left: 60, right: 60, height: 6, background: T }} />
      {items.map((it, i) => {
        if (t < it.t0) return null;
        const a = ent(t, it.t0);
        const f = foco === i;
        return (
          <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 140 + i * 92, height: 80, opacity: a, transform: `translateX(${(1 - a) * -60}px) scale(${f ? 1.04 : 1})`, transformOrigin: "0 50%", fontFamily, fontWeight: 700, fontSize: 46, color: f ? T : "#5a4630", display: "flex", justifyContent: "space-between", alignItems: "center", background: f ? "rgba(255,176,32,.35)" : "transparent", borderRadius: 10, padding: "0 14px" }}>
            <span>{it.txt}</span>
            {it.monto && <span style={{ color: C.rojo, fontSize: 52 }}>{it.monto}</span>}
          </div>
        );
      })}
    </div>
  );
};

// ── correa del capataz (cuero con hebilla) — se dibuja colgando de la mano (origen = puño)
export const Correa: React.FC<{ t: number; golpe?: number }> = ({ t, golpe = 0 }) => {
  const k = Math.sin(t * 6) * 10 + golpe * 60;
  return (
    <g>
      <path d={`M 0 0 Q ${-30 + k * 0.4} 90 ${-10 + k} 200`} stroke="#5a2e14" strokeWidth={22} fill="none" strokeLinecap="round" />
      <rect x={-22} y={-14} width={44} height={36} rx={8} fill={C.oro} />
    </g>
  );
};
export const Rodillo: React.FC = () => (
  <g transform="rotate(-20)"><rect x={-14} y={-250} width={28} height={300} rx={14} fill="#7a4a22" /><rect x={-18} y={-250} width={36} height={40} rx={10} fill={V.hierro} /></g>
);
// palo largo del despertador (knocker-up): sale de la mano hacia arriba
export const Pertiga: React.FC<{ largo?: number; ang?: number }> = ({ largo = 720, ang = 0 }) => (
  <g transform={`rotate(${180 + ang})`}><line x1={0} y1={30} x2={0} y2={largo} stroke="#7a4a22" strokeWidth={14} strokeLinecap="round" /><circle cx={0} cy={largo} r={14} fill={V.hierro} /></g>
);

// ── tanque de agua fría
export const Cisterna: React.FC<P & { t: number; chapuzon?: number }> = ({ t, chapuzon = -9, ...p }) => {
  const c = t - chapuzon;
  return (
    <Pie {...p} w={620} h={520}>
      <rect x={-280} y={-420} width={560} height={420} rx={18} fill={V.hierro} />
      <rect x={-260} y={-380} width={520} height={60} fill="#3fa7d6" />
      <path d={`M -260 -380 Q -130 ${-396 + Math.sin(t * 5) * 8} 0 -380 T 260 -380`} fill="#7fd6ff" />
      {[-200, 0, 200].map((x) => <rect key={x} x={x - 8} y={-420} width={16} height={420} fill={V.hierro2} />)}
      {c > 0 && c < 1 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i) * 180 * c} cy={-400 - Math.sin(c * Math.PI) * (120 + i * 12)} r={18} fill="#7fd6ff" />)}
    </Pie>
  );
};

// ── carro de los aprendices
export const Carro: React.FC<P & { t: number; rueda?: number }> = ({ t, rueda = 0, ...p }) => (
  <Pie {...p} w={900} h={560}>
    <path d="M -380 -420 Q 0 -560 380 -420 L 380 -200 L -380 -200 Z" fill="#e8dcc0" />
    {[-260, -90, 90, 260].map((x) => <line key={x} x1={x} y1={-470} x2={x} y2={-200} stroke="#c9b48a" strokeWidth={10} />)}
    <rect x={-400} y={-220} width={800} height={80} rx={10} fill={V.madera} />
    {[-260, 260].map((x) => (
      <g key={x} transform={`translate(${x} -120) rotate(${rueda * 180})`}>
        <circle r={110} fill="none" stroke={V.madera2} strokeWidth={22} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={0} x2={0} y2={-110} stroke={V.madera2} strokeWidth={10} transform={`rotate(${i * 45})`} />)}
        <circle r={20} fill={V.hierro} />
      </g>
    ))}
  </Pie>
);

// ── íconos de las promesas a Blincoe y otros objetos chicos (centro en x, y)
type Ic = { x: number; y: number; s?: number; t: number; t0: number; t1?: number };
const Icono: React.FC<Ic & { children: React.ReactNode; w?: number }> = ({ x, y, s = 1, t, t0, t1 = 1e9, children, w = 300 }) => {
  if (t < t0 || t > t1 + 0.3) return null;
  const e = ent(t, t0, 0, { damping: 10, stiffness: 190 });
  const out = interpolate(t, [t1, t1 + 0.3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", left: x - (w / 2) * s, top: y - (w / 2) * s, overflow: "visible", transform: `scale(${e * out}) rotate(${(1 - e) * -16}deg)` }} width={w * s} height={w * s} viewBox={`${-w / 2} ${-w / 2} ${w} ${w}`}>
      {children}
    </svg>
  );
};
export const Rosbif: React.FC<Ic> = (p) => (
  <Icono {...p}>
    <ellipse cx={0} cy={60} rx={140} ry={40} fill="#e8e4f0" />
    <path d="M -110 40 Q -120 -70 0 -80 Q 120 -70 110 40 Z" fill="#a8452c" />
    <path d="M -80 -10 Q 0 -60 80 -10" stroke="#e98a5a" strokeWidth={14} fill="none" />
    <rect x={60} y={-120} width={16} height={90} rx={8} fill="#fff" transform="rotate(30 68 -75)" />
  </Icono>
);
export const Pudin: React.FC<Ic> = (p) => (
  <Icono {...p}>
    <ellipse cx={0} cy={70} rx={130} ry={34} fill="#e8e4f0" />
    <path d="M -100 60 Q -110 -80 0 -84 Q 110 -80 100 60 Z" fill="#5a2a18" />
    <path d="M -80 -50 Q -40 -20 0 -50 Q 40 -20 80 -50 Q 60 -90 0 -90 Q -60 -90 -80 -50 Z" fill="#fff6e0" />
    {[-50, 10, 50, -20].map((x, i) => <circle key={i} cx={x} cy={10 + (i % 2) * 30} r={9} fill="#2a0f08" />)}
    <path d="M -10 -90 l -20 -26 M 10 -90 l 22 -24" stroke="#3f8f3a" strokeWidth={12} strokeLinecap="round" /><circle cx={0} cy={-96} r={12} fill={C.rojo} />
  </Icono>
);
export const RelojBolsillo: React.FC<Ic> = (p) => (
  <Icono {...p}>
    <path d="M 0 -120 Q 60 -170 120 -130" stroke="#d8dce6" strokeWidth={8} fill="none" />
    <circle cx={0} cy={0} r={110} fill="#d8dce6" /><circle cx={0} cy={0} r={86} fill="#fff6dc" />
    <rect x={-14} y={-136} width={28} height={30} rx={8} fill="#d8dce6" />
    <line x1={0} y1={0} x2={0} y2={-60} stroke={T} strokeWidth={8} strokeLinecap="round" /><line x1={0} y1={0} x2={44} y2={10} stroke={T} strokeWidth={8} strokeLinecap="round" />
    <Brillo d="M -70 -50 Q -40 -90 10 -90" w={10} />
  </Icono>
);
export const Moneda3: React.FC<Ic & { txt?: string; oro?: boolean }> = ({ txt = "1s", oro, ...p }) => (
  <Icono {...p} w={220}>
    <circle cx={0} cy={8} r={92} fill={oro ? "#a8650f" : "#7d8796"} />
    <circle r={92} fill={oro ? C.oro : "#dfe3ea"} />
    <circle r={72} fill="none" stroke={oro ? "#d99a1e" : "#aab2c0"} strokeWidth={8} />
    <text y={24} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill={oro ? "#a8650f" : "#5d6577"}>{txt}</text>
    <Brillo d="M -60 -40 Q -40 -70 0 -72" w={10} />
  </Icono>
);
export const Ficha: React.FC<Ic> = (p) => (
  <Icono {...p} w={220}>
    <path d="M 0 -90 L 78 -45 L 78 45 L 0 90 L -78 45 L -78 -45 Z" fill="#b87a3a" />
    <path d="M 0 -70 L 60 -35 L 60 35 L 0 70 L -60 35 L -60 -35 Z" fill="#d9a05a" />
    <text y={18} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={46} fill="#7a4a1a">SHOP</text>
  </Icono>
);

// ── piernas comparadas (sana vs «factory cripple»)
export const Piernas: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; dobla: number; color?: string }> = ({ t, t0, x, y, s = 1, dobla, color = "#f6ecd8" }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  const k = dobla * 70;
  return (
    <svg style={{ position: "absolute", left: x - 160 * s, top: y - 640 * s, overflow: "visible", transform: `scale(${e})` }} width={320 * s} height={640 * s} viewBox="-160 -640 320 640">
      <path d="M -90 -620 Q 0 -660 90 -620 L 80 -560 L -80 -560 Z" fill={color} />
      {[-1, 1].map((d) => (
        <g key={d}>
          <path d={`M ${d * 60} -560 Q ${d * (60 - k)} -300 ${d * (40 - k * 0.9)} -320 Q ${d * (40 - k * 0.5)} -150 ${d * 60} -30`} stroke={color} strokeWidth={34} fill="none" strokeLinecap="round" />
          <circle cx={d * (40 - k * 0.7)} cy={-320} r={26} fill={color} />
          <path d={`M ${d * 60} -30 L ${d * 110} -10`} stroke={color} strokeWidth={30} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

// ── mapa estilizado del Atlántico Norte: Gran Bretaña + costa este de EE. UU. (formas a mano), rutas animadas
export const ISLA = "M 300 70 Q 330 40 360 60 L 380 110 Q 420 120 410 170 L 440 230 Q 470 300 440 330 L 470 380 Q 500 420 470 440 L 400 450 Q 340 470 300 455 L 330 420 Q 300 400 320 360 L 290 330 Q 300 280 270 250 L 300 210 Q 250 190 270 150 L 250 120 Q 270 80 300 70 Z";
export const EEUU = "M -700 120 Q -600 90 -520 120 L -470 170 Q -440 200 -470 240 L -440 300 Q -420 360 -470 400 L -500 470 Q -540 520 -520 580 Q -500 640 -540 660 Q -600 640 -640 590 L -700 600 L -900 620 L -900 100 Z";
export const AtlanticoMapa: React.FC<{ t: number; ruta?: [number, number]; bloqueo?: number; marcas?: { n: string; x: number; y: number; t0: number; color?: string }[] }> = ({ t, ruta, bloqueo = 1e9, marcas = [] }) => {
  const u = ruta ? prog(t, ruta[0], ruta[1]) : 0;
  return (
    <svg style={{ position: "absolute", left: -1100, top: -100, overflow: "visible" }} width={1800} height={900} viewBox="-1000 0 1800 900">
      <rect x={-1000} y={0} width={1800} height={900} fill="#1d3f7a" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${-1000 + ((i * 137 + t * 20) % 1800)} ${60 + i * 60} q 20 -12 40 0 t 40 0`} stroke="#3a64a8" strokeWidth={6} fill="none" />)}
      <path d={EEUU} fill="#5c8f3e" stroke="#2f5a22" strokeWidth={10} />
      <path d={ISLA} fill="#9be15d" stroke="#3f7a2a" strokeWidth={10} transform="translate(80 40)" />
      {ruta && <path d="M -500 520 Q 0 120 400 300" stroke="#fff" strokeWidth={8} strokeDasharray="20 16" fill="none" pathLength={1000} style={{ strokeDasharray: `${u * 1000} 1000` }} />}
      {t > bloqueo && [-520, -500, -470, -455].map((y, i) => <g key={i} transform={`translate(${-430 + i * 30} ${380 + i * 70}) scale(${ent(t, bloqueo, i * 0.12)})`}><path d="M -30 0 L 30 0 L 20 16 L -20 16 Z" fill="#2e2a3a" /><rect x={-3} y={-34} width={6} height={34} fill="#2e2a3a" /><path d="M 3 -32 L 24 -24 L 3 -16 Z" fill="#2b4fb0" /></g>)}
      {marcas.map((m) => t >= m.t0 && (
        <g key={m.n} transform={`translate(${m.x} ${m.y}) scale(${ent(t, m.t0)})`}>
          <circle r={18} fill={m.color ?? C.rojo} stroke="#fff" strokeWidth={6} />
          <circle r={18 + ((t - m.t0) % 1.2) * 40} fill="none" stroke={m.color ?? C.rojo} strokeWidth={5} opacity={1 - ((t - m.t0) % 1.2) / 1.2} />
          <text x={0} y={-36} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#fff" stroke={T} strokeWidth={8} paintOrder="stroke">{m.n}</text>
        </g>
      ))}
    </svg>
  );
};

// ── planta de algodón (capullos blancos) para el campo
export const PlantaAlgodon: React.FC<P & { t: number; seed?: number }> = ({ t, seed = 1, ...p }) => {
  const r = rnd(seed);
  const caps = Array.from({ length: 6 }, () => [r() * 160 - 80, -120 - r() * 200, 22 + r() * 14]);
  return (
    <Pie {...p} w={260} h={360}>
      <path d={`M 0 0 Q ${Math.sin(t + seed) * 8} -160 0 -320`} stroke="#3f6b3a" strokeWidth={12} fill="none" />
      {caps.map(([cx, cy], i) => <line key={`l${i}`} x1={0} y1={cy + 40} x2={cx} y2={cy} stroke="#3f6b3a" strokeWidth={8} />)}
      {caps.map(([cx, cy, cr], i) => <g key={i}>{[0, 1, 2].map((k) => <circle key={k} cx={cx + Math.cos(k * 2.1) * cr * 0.6} cy={cy + Math.sin(k * 2.1) * cr * 0.6} r={cr} fill={V.algodon} />)}<path d={`M ${cx - cr} ${cy + cr} L ${cx} ${cy + cr * 0.4} L ${cx + cr} ${cy + cr}`} fill="#6b3a1f" /></g>)}
    </Pie>
  );
};

// ── carta sellada (de Washington) que se abre
export const Carta: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; abre: number; lineas?: string[] }> = ({ t, t0, x, y, s = 1, abre, lineas = [] }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  return (
    <div style={{ position: "absolute", left: x - 520 * s, top: y - 360 * s, width: 1040 * s, height: 720 * s, transform: `scale(${e}) rotate(${(1 - e) * 12 - 2}deg)` }}>
      <svg width={1040 * s} height={720 * s} viewBox="0 0 1040 720" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={20} y={40} width={1000} height={660} rx={14} fill="#f6ecd0" />
        <rect x={20} y={40} width={1000} height={660} rx={14} fill="none" stroke="#c9a96a" strokeWidth={10} />
        <path d={`M 20 40 L 520 ${40 + 330 * (1 - abre)} L 1020 40`} fill="#eadbb2" stroke="#c9a96a" strokeWidth={8} />
        {abre < 0.5 && <g transform="translate(520 330)"><circle r={70} fill={C.rojo} /><circle r={50} fill="none" stroke="#a81d2e" strokeWidth={8} /><text y={18} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#ffd0d0">A.L.</text></g>}
      </svg>
      {abre > 0.5 && lineas.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: 90 * s, right: 90 * s, top: (150 + i * 92) * s, fontFamily, fontWeight: 600, fontSize: 50 * s, color: "#3a2a14", opacity: clamp((abre - 0.5) * 4 - i * 0.6, 0, 1), fontStyle: "italic" }}>{l}</div>
      ))}
    </div>
  );
};

// ── estatua (Lincoln en Manchester): pedestal + figura de bronce con levita y barba
export const Estatua: React.FC<P & { t: number }> = ({ t, ...p }) => (
  <Pie {...p} w={700} h={1500}>
    <rect x={-300} y={-420} width={600} height={420} fill="#b9b2a6" />
    <rect x={-340} y={-460} width={680} height={60} fill="#d4cdc0" />
    <rect x={-340} y={-40} width={680} height={40} fill="#9a9488" />
    <text x={0} y={-320} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill="#6e675c" letterSpacing={6}>LINCOLN</text>
    <g fill="#4f6b5a">
      <path d="M -60 -460 L -70 -820 L 70 -820 L 60 -460 Z" />
      <path d="M -130 -820 Q -150 -1100 0 -1120 Q 150 -1100 130 -820 L 160 -700 L -160 -700 Z" />
      <path d="M -130 -1080 Q -200 -950 -150 -820 L -120 -830 Q -150 -960 -100 -1060 Z" />
      <path d="M 130 -1080 Q 190 -1000 170 -900 L 140 -900 Q 150 -990 100 -1060 Z" />
      <ellipse cx={0} cy={-1220} rx={90} ry={110} />
      <path d="M -88 -1200 Q -80 -1090 0 -1080 Q 80 -1090 88 -1200 Q 60 -1140 0 -1136 Q -60 -1140 -88 -1200 Z" fill="#3a5244" />
      {/* rasgos: pelo, cejas pesadas, ojos hundidos, nariz larga, boca seria (Lincoln) */}
      <path d="M -92 -1250 Q -70 -1340 0 -1336 Q 80 -1336 94 -1252 Q 60 -1300 0 -1296 Q -50 -1300 -92 -1250 Z" fill="#3a5244" />
      <path d="M -62 -1236 L -18 -1228 M 18 -1228 L 62 -1236" stroke="#2c4034" strokeWidth={12} strokeLinecap="round" />
      <ellipse cx={-38} cy={-1208} rx={16} ry={10} fill="#2c4034" /><ellipse cx={38} cy={-1208} rx={16} ry={10} fill="#2c4034" />
      <path d="M 0 -1222 L -10 -1172 Q 0 -1164 12 -1172" stroke="#2c4034" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M -26 -1150 Q 0 -1144 26 -1150" stroke="#2c4034" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M -40 -760 L 40 -760 L 52 -700 L -52 -700 Z" fill="#3a5244" />
    </g>
    <path d="M -50 -1290 Q -10 -1320 40 -1300" stroke="#8fb3a0" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M -110 -1000 Q -100 -900 -90 -800" stroke="#8fb3a0" strokeWidth={10} fill="none" opacity={0.5} />
  </Pie>
);

// ── barco de vapor/velero mercante cargado de fardos
export const Velero: React.FC<P & { t: number; fardos?: boolean }> = ({ t, fardos = true, ...p }) => (
  <Pie {...p} w={900} h={900}>
    <g transform={`rotate(${Math.sin(t * 1.3) * 2.5} 0 -100)`}>
      <path d="M -420 -160 L 420 -160 L 330 0 L -330 0 Z" fill="#3b2a4a" />
      <rect x={-420} y={-180} width={840} height={30} fill="#e2c69a" />
      {fardos && [-260, -130, 0, 130].map((x) => <rect key={x} x={x} y={-260} width={110} height={80} rx={12} fill={V.algodon} stroke="#c9b48a" strokeWidth={8} />)}
      {[-150, 160].map((x, i) => <g key={x}><rect x={x - 10} y={-820} width={20} height={660} fill={V.madera2} /><path d={`M ${x - 200} ${-760 + i * 40} Q ${x} ${-800 + i * 40} ${x + 200} ${-760 + i * 40} L ${x + 180} ${-420} Q ${x} ${-450} ${x - 180} ${-420} Z`} fill="#f6efe0" /></g>)}
    </g>
  </Pie>
);
// olas en bandas
export const Mar: React.FC<{ t: number; x: number; y: number; w: number; h?: number }> = ({ t, x, y, w, h = 500 }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h}>
    <rect width={w} height={h} fill="#1d3f7a" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={Array.from({ length: Math.ceil(w / 120) + 2 }, (_, k) => `${k ? "Q" : "M"} ${k * 120 - 60 - ((t * (40 + i * 12)) % 120)} ${i * 80 + (k % 2 ? -16 : 16)} ${k * 120 - ((t * (40 + i * 12)) % 120)} ${i * 80}`).join(" ")} stroke={i % 2 ? "#3a64a8" : "#6f9be0"} strokeWidth={10} fill="none" opacity={0.8} />)}
  </svg>
);

// interpolación por tramos con suavizado (cámara y otras curvas)
export const tramos = (t: number, ks: [number, number][], ease = Easing.inOut(Easing.cubic)) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [a, va] = ks[i], [b, vb] = ks[i + 1];
    if (t <= b) return va + (vb - va) * ease(clamp((t - a) / Math.max(1e-6, b - a), 0, 1));
  }
  return ks[ks.length - 1][1];
};

// retrete compartido de la calle (casilla de madera con la media luna)
export const Retrete: React.FC<P & { t: number; abre?: number }> = ({ t, abre = 0, ...p }) => (
  <Pie {...p} w={360} h={560}>
    <path d="M -170 -470 L 0 -540 L 170 -470 Z" fill={V.madera2} />
    <rect x={-150} y={-480} width={300} height={480} fill={V.madera} />
    {[-90, -30, 30, 90].map((x) => <line key={x} x1={x} y1={-470} x2={x} y2={0} stroke={V.madera2} strokeWidth={6} />)}
    <g transform={`translate(-110 0) scale(${1 - abre * 0.8} 1)`}><rect x={0} y={-400} width={220} height={400} fill="#a8723c" stroke={V.madera2} strokeWidth={8} /><path d="M 120 -330 a 30 30 0 1 0 0 50 a 22 22 0 1 1 0 -50 Z" fill={V.madera2} /></g>
    {Array.from({ length: 4 }, (_, i) => { const k = ((t * 0.5 + i / 4) % 1); return <path key={i} d={`M ${-40 + i * 25} ${-560 - k * 160} q 12 -14 0 -28 q -12 -14 0 -28`} stroke="#9be15d" strokeWidth={8} fill="none" opacity={(1 - k) * 0.7} />; })}
  </Pie>
);
