import React from "react";
import { rnd } from "../soot/lib";
import { C, fontFamily, ent, prog } from "./kit";

// Kit del ballenero (Soot 04): barco con corte (se ve por dentro), bote ballenero, cachalote, tiburón,
// gradas de tryworks, barriles, isla, pueblo de Nantucket, muelle, oficina, torre de petróleo y utilería.
// Todo vector en código: cero imágenes. Coordenadas locales; `Svg` lo monta en (x, y) de su capa.

export const Svg: React.FC<{ x: number; y: number; s?: number; rot?: number; op?: number; flip?: boolean; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, op = 1, flip, children }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: op }} width={1} height={1}>
    <g transform={`rotate(${rot}) scale(${flip ? -s : s} ${s})`}>{children}</g>
  </svg>
);

const MADERA = "#7a4a26", MADERA2 = "#5a3418", MADERA3 = "#9a6a3a", CASCO = "#2a1e24", VELA = "#f4ead2", VELA2 = "#d8c8a4";

// ── barco ballenero (popa a la izquierda, proa a la derecha). Origen = línea de flotación en el centro.
// velas 0 (aferradas) → 1 (hinchadas) · corte 0 → 1 muestra el interior · botes: cuáles cuelgan de los pescantes
// fuego: la tryworks encendida · bodega: 0 → 1 barriles llenos · nombre en la popa · roto: escora y se hunde
export type BarcoP = { t: number; velas?: number; corte?: number; botes?: [boolean, boolean, boolean]; fuego?: number; bodega?: number; nombre?: string; roto?: number; escala?: number; vigia?: boolean; bandera?: boolean };
export const Ballenero: React.FC<BarcoP & { x: number; y: number; delante?: React.ReactNode; dentro?: React.ReactNode }> = ({ x, y, t, velas = 1, corte = 0, botes = [true, true, true], fuego = 0, bodega = 0, nombre = "", roto = 0, escala = 1, delante, dentro }) => {
  const balanceo = Math.sin(t * 0.8) * 1.4 * (1 - roto) + roto * 14;
  const sube = Math.sin(t * 1.1) * 6 + roto * 260;
  const casco = `M -820 -250 Q -800 -200 -790 -150 L -760 90 Q -600 150 0 150 Q 560 150 700 70 L 860 -230 Q 700 -205 0 -195 Q -500 -200 -820 -250 Z`;
  const velasMastil = (mx: number, alto: number, ancho: number) =>
    [0, 1, 2].map((k) => {
      const yy = -alto + 120 + k * ((alto - 380) / 3);
      const w = ancho * (0.68 + k * 0.16);
      const h = (alto - 420) / 3 - 18;
      const panza = 40 * velas + Math.sin(t * 1.3 + k + mx) * 6 * velas;
      return (
        <g key={k}>
          <line x1={mx - w / 2 - 20} y1={yy} x2={mx + w / 2 + 20} y2={yy} stroke={MADERA2} strokeWidth={12} strokeLinecap="round" />
          {velas > 0.02 ? (
            <path d={`M ${mx - w / 2} ${yy} L ${mx + w / 2} ${yy} Q ${mx + w / 2 + panza} ${yy + h * velas * 0.5} ${mx + w / 2 - 6} ${yy + h * velas} Q ${mx} ${yy + h * velas + panza * 0.5} ${mx - w / 2 + 6} ${yy + h * velas} Q ${mx - w / 2 + panza * 0.6} ${yy + h * velas * 0.5} ${mx - w / 2} ${yy} Z`} fill={VELA} stroke={VELA2} strokeWidth={5} />
          ) : null}
          {velas < 0.98 && <rect x={mx - w / 2} y={yy - 4} width={w} height={18} rx={9} fill={VELA2} opacity={1 - velas} />}
          {velas > 0.02 && <line x1={mx} y1={yy + 10} x2={mx} y2={yy + h * velas} stroke={VELA2} strokeWidth={4} opacity={0.6} />}
        </g>
      );
    });
  const mastiles: [number, number, number][] = [[-450, 1120, 470], [0, 1380, 600], [420, 1260, 540]];
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`scale(${escala}) translate(0 ${sube}) rotate(${balanceo})`}>
        {/* jarcia */}
        {mastiles.map(([mx, alto], i) => (
          <g key={`j${i}`} stroke="#3a2a22" strokeWidth={3.5} opacity={0.8}>
            <line x1={mx} y1={-alto} x2={mx - 260} y2={-215} /><line x1={mx} y1={-alto} x2={mx + 260} y2={-205} />
            <line x1={mx} y1={-alto * 0.75} x2={mx - 200} y2={-215} /><line x1={mx} y1={-alto * 0.75} x2={mx + 200} y2={-205} />
          </g>
        ))}
        <line x1={420} y1={-1260} x2={1140} y2={-420} stroke="#3a2a22" strokeWidth={4} />
        <line x1={0} y1={-1380} x2={420} y2={-1260} stroke="#3a2a22" strokeWidth={4} />
        {/* mástiles */}
        {mastiles.map(([mx, alto], i) => <rect key={`m${i}`} x={mx - 14} y={-alto} width={28} height={alto - 200} fill={MADERA2} />)}
        {/* aros del vigía en el palo mayor */}
        <g><rect x={-50} y={-1250} width={100} height={12} rx={6} fill={MADERA} /><path d="M -46 -1250 Q 0 -1320 46 -1250" stroke={MADERA} strokeWidth={8} fill="none" /></g>
        {/* bandera */}
        <path d={`M 0 -1380 L 0 -1460 L ${110 + Math.sin(t * 5) * 8} ${-1440 + Math.sin(t * 6) * 6} L 0 -1410`} fill={C.rojo} />
        {mastiles.map(([mx, alto, ancho]) => velasMastil(mx, alto, ancho))}
        {/* bauprés */}
        <line x1={760} y1={-250} x2={1150} y2={-420} stroke={MADERA2} strokeWidth={22} strokeLinecap="round" />
        {/* botes en los pescantes */}
        {[-470, -80, 300].map((bx2, i) => botes[i] && (
          <g key={`b${i}`} transform={`translate(${bx2} -300)`}>
            <line x1={-120} y1={-60} x2={-120} y2={30} stroke="#3a2a22" strokeWidth={5} /><line x1={120} y1={-60} x2={120} y2={30} stroke="#3a2a22" strokeWidth={5} />
            <path d="M -170 -60 Q -150 -90 -120 -70 M 170 -60 Q 150 -90 120 -70" stroke={MADERA2} strokeWidth={10} fill="none" />
            <path d="M -175 0 Q 0 10 175 0 Q 150 60 0 66 Q -150 60 -175 0 Z" fill="#f2efe4" stroke="#8a7a66" strokeWidth={5} />
            <line x1={-160} y1={10} x2={160} y2={10} stroke="#3a6ab0" strokeWidth={8} />
          </g>
        ))}
        {/* interior (visible con el corte) */}
        {corte > 0.01 && (
          <g opacity={Math.min(1, corte * 1.4)}>
            <path d={casco} fill="#3a2418" />
            <path d="M -780 -180 L 840 -180" stroke={MADERA3} strokeWidth={10} />
            <line x1={-760} y1={-30} x2={760} y2={-30} stroke={MADERA3} strokeWidth={14} />
            {/* tablones de fondo */}
            {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-770} y1={-160 + i * 34} x2={800} y2={-160 + i * 34} stroke="#2a180e" strokeWidth={3} opacity={0.6} />)}
            {/* mamparos */}
            {[-440, 420].map((mx) => <rect key={mx} x={mx - 9} y={-190} width={18} height={330} fill={MADERA2} />)}
            {/* camarote del capitán (popa): ventana, mesa, carta */}
            <rect x={-700} y={-160} width={90} height={70} rx={8} fill="#9ad8ff" opacity={0.8} />
            <rect x={-600} y={-90} width={140} height={14} fill={MADERA3} /><rect x={-590} y={-76} width={10} height={46} fill={MADERA3} /><rect x={-480} y={-76} width={10} height={46} fill={MADERA3} />
            {/* castillo de proa: literas */}
            {[0, 1].map((r) => [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={450 + k * 95} y={-170 + r * 66} width={84} height={50} fill="#4a2c18" stroke={MADERA3} strokeWidth={5} />))}
            {/* bodega: barriles */}
            {Array.from({ length: 22 }, (_, i) => {
              const col = i % 11, fila = Math.floor(i / 11);
              const on = bodega * 22 > i;
              return on ? <g key={`r${i}`} transform={`translate(${-390 + col * 72} ${110 - fila * 66})`}><Barril0 /></g> : null;
            })}
            {dentro}
          </g>
        )}
        {/* casco exterior (se desvanece con el corte) */}
        <g opacity={1 - corte}>
          <path d={casco} fill={CASCO} />
          {/* fondo forrado de cobre bajo la flotación */}
          <path d="M -776 20 L -760 90 Q -600 150 0 150 Q 560 150 700 70 L 734 6 Q 400 30 0 30 Q -400 30 -776 20 Z" fill="#b8733a" />
          <path d="M -776 20 Q -400 30 0 30 Q 400 30 734 6" stroke="#e8a060" strokeWidth={6} fill="none" />
          {/* franja pintada con portas falsas */}
          <path d="M -805 -175 Q 0 -140 838 -180 L 830 -150 Q 0 -110 -800 -146 Z" fill="#e8dcc0" />
          {Array.from({ length: 13 }, (_, i) => <rect key={i} x={-700 + i * 116} y={-166 + Math.abs(i - 6) * 1.2} width={44} height={22} fill={CASCO} />)}
          {Array.from({ length: 6 }, (_, i) => <line key={`t${i}`} x1={-780} y1={-110 + i * 22} x2={800} y2={-120 + i * 22} stroke="#1a1218" strokeWidth={3} />)}
          {/* brillo */}
          <path d="M -700 -200 Q 0 -180 760 -214" stroke="#5a4450" strokeWidth={8} fill="none" />
          {nombre && <text x={-650} y={-60} fontFamily={fontFamily} fontWeight={700} fontSize={54} fill="#f7c548" letterSpacing={6}>{nombre}</text>}
        </g>
        {/* borda */}
        <path d="M -830 -262 Q -500 -212 0 -207 Q 700 -217 870 -244" stroke={MADERA} strokeWidth={18} fill="none" strokeLinecap="round" />
        {/* tryworks sobre cubierta */}
        <g transform="translate(130 -210)">
          <rect x={-130} y={-120} width={260} height={120} fill="#b5452c" />
          {Array.from({ length: 4 }, (_, r) => Array.from({ length: 6 }, (_, k) => <rect key={`${r}${k}`} x={-130 + k * 44 + (r % 2) * 22} y={-118 + r * 30} width={40} height={26} fill="none" stroke="#7a2a1a" strokeWidth={3} />))}
          <ellipse cx={-60} cy={-122} rx={56} ry={16} fill="#2a2a30" /><ellipse cx={60} cy={-122} rx={56} ry={16} fill="#2a2a30" />
          {fuego > 0 && (
            <g>
              <rect x={-110} y={-46} width={220} height={40} rx={6} fill="#1a0808" />
              {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${-100 + i * 32} -8 Q ${-90 + i * 32 + Math.sin(t * 13 + i) * 8} ${-40 - 14 * Math.abs(Math.sin(t * 9 + i * 2)) * fuego} ${-76 + i * 32} -8 Z`} fill={i % 2 ? "#ffb020" : "#ff5a2a"} />)}
              <ellipse cx={0} cy={-128} rx={150} ry={20} fill="#ffb347" opacity={0.25 * fuego} />
            </g>
          )}
        </g>
        {delante}
      </g>
    </svg>
  );
};

export const Barril0: React.FC = () => (
  <g>
    <path d="M -28 -30 Q -36 0 -28 30 L 28 30 Q 36 0 28 -30 Z" fill="#a8703a" stroke="#5a3418" strokeWidth={4} />
    <line x1={-32} y1={-14} x2={32} y2={-14} stroke="#4a4a52" strokeWidth={6} /><line x1={-32} y1={14} x2={32} y2={14} stroke="#4a4a52" strokeWidth={6} />
  </g>
);
export const Barril: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => <Svg x={x} y={y} s={s} rot={rot}><Barril0 /></Svg>;

// ── bote ballenero con remeros. Origen = flotación al centro, proa a la derecha.
export const Bote: React.FC<{ x: number; y: number; t: number; s?: number; rema?: number; arponero?: number; roto?: number; flip?: boolean; gente?: React.ReactNode; rot?: number }> = ({ x, y, t, s = 1, rema = 1, arponero = 0, roto = 0, flip, gente, rot = 0 }) => {
  const f = Math.sin(t * 5.5) * rema;
  const bob = Math.sin(t * 2.2 + x * 0.01) * 5;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`scale(${flip ? -s : s} ${s}) translate(0 ${bob}) rotate(${Math.sin(t * 1.7) * 2.5 + rot})`}>
        {/* remos */}
        {roto < 0.5 && [-150, -80, -10, 60, 130].map((ox, i) => (
          <line key={i} x1={ox} y1={-40} x2={ox - 90 - f * 50} y2={50 + Math.max(0, f) * 10} stroke={MADERA3} strokeWidth={9} strokeLinecap="round" />
        ))}
        {/* remeros (cabezas y torsos sencillos, de espaldas a la proa) */}
        {roto < 0.5 && [-150, -80, -10, 60, 130].map((ox, i) => (
          <g key={`r${i}`} transform={`translate(${ox + f * 10} -40) rotate(${-f * 14})`}>
            <rect x={-18} y={-62} width={36} height={56} rx={14} fill={["#3b7fd8", "#e8e2d0", "#7a3a2a", "#3d6e5a", "#c9a23f"][i]} />
            <circle cx={0} cy={-84} r={22} fill={["#f2b48a", "#c98b62", "#8d5a3b", "#f5c7a0", "#6e4128"][i]} />
            <path d="M -22 -92 Q 0 -118 22 -92 Z" fill={["#d8343a", "#1d1410", "#2b6ad0", "#d8343a", "#2a1c14"][i]} />
            <circle cx={-8} cy={-86} r={3.5} fill="#2a1a10" />
          </g>
        ))}
        {/* arponero de pie en la proa */}
        {arponero > 0 && roto < 0.5 && (
          <g transform="translate(205 -40)">
            <rect x={-20} y={-110} width={40} height={104} rx={14} fill="#2f5fa8" />
            <circle cx={0} cy={-134} r={26} fill="#8d5a3b" />
            <path d="M -26 -142 Q 0 -172 26 -142 Z" fill="#1d1410" />
            <circle cx={9} cy={-136} r={4} fill="#2a1a10" />
            <g transform={`translate(10 -96) rotate(${-50 + arponero * 70})`}>
              <line x1={0} y1={0} x2={0} y2={-180} stroke={MADERA3} strokeWidth={8} />
              <path d="M -12 -180 L 0 -222 L 12 -180 L 0 -190 Z" fill="#c8ccd4" />
            </g>
          </g>
        )}
        {gente}
        {/* casco del bote */}
        {roto < 0.5 ? (
          <g>
            <path d="M -250 -40 Q -270 -70 -280 -84 Q -150 -46 0 -44 Q 150 -46 280 -84 Q 270 -70 250 -40 Q 160 30 0 34 Q -160 30 -250 -40 Z" fill="#f2efe4" stroke="#8a7a66" strokeWidth={6} />
            <path d="M -262 -54 Q 0 -30 262 -54" stroke="#3a6ab0" strokeWidth={10} fill="none" />
            {/* tina de la línea */}
            <ellipse cx={-200} cy={-50} rx={26} ry={9} fill="#c8a070" />
          </g>
        ) : (
          <g>
            {[[-200, -20, -24], [-60, 0, 18], [90, -10, -12], [210, 6, 30]].map(([px, py, r], i) => (
              <g key={i} transform={`translate(${px + (i - 1.5) * 60 * roto} ${py + Math.sin(t * 2 + i) * 6}) rotate(${r * roto})`}>
                <path d="M -70 -20 Q 0 -10 70 -20 L 60 16 Q 0 24 -60 16 Z" fill="#f2efe4" stroke="#8a7a66" strokeWidth={5} />
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
};

// ── cachalote. Origen = centro; mira a la derecha. L ≈ 1500 a s = 1.
// cola: aleteo · boca 0 → 1 · chorro: soplo (vapor) · sangre: chorro rojo · arpones: cuántos clavados · ojo: miedo/enojo
export const Cachalote: React.FC<{ x: number; y: number; t: number; s?: number; rot?: number; flip?: boolean; boca?: number; chorro?: number; sangre?: number; arpones?: number; nada?: number; enojo?: boolean }> = ({ x, y, t, s = 1, rot = 0, flip, boca = 0, chorro = 0, sangre = 0, arpones = 0, nada = 1, enojo }) => {
  const a = Math.sin(t * 2.6 * nada) * 14 * nada;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
        {/* cola */}
        <g transform={`translate(-640 0) rotate(${a})`}>
          <path d="M 0 -30 Q -120 -40 -200 -20 L -200 20 Q -120 40 0 30 Z" fill="#3a4a6a" />
          <g transform="translate(-190 0)">
            <path d="M 0 0 Q -40 -110 -150 -170 Q -110 -60 -160 -10 Q -80 -10 0 0 Z" fill="#33425f" />
            <path d="M 0 0 Q -40 110 -150 170 Q -110 60 -160 10 Q -80 10 0 0 Z" fill="#2c3a55" />
          </g>
        </g>
        {/* cuerpo */}
        <path d="M -660 -40 Q -400 -150 -40 -210 Q 300 -250 560 -230 Q 760 -210 780 -60 Q 790 80 700 130 Q 400 190 0 170 Q -400 140 -660 40 Z" fill="#45577a" />
        <path d="M -660 40 Q -400 140 0 170 Q 400 190 600 150 Q 300 120 0 110 Q -360 90 -660 30 Z" fill="#8a9ab8" opacity={0.7} />
        {/* arrugas del lomo */}
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${-500 + i * 70} ${-120 + i * -8} q 14 40 0 80`} stroke="#33425f" strokeWidth={6} fill="none" opacity={0.7} />)}
        {/* joroba y nudillos */}
        {[-380, -300, -240].map((hx, i) => <ellipse key={i} cx={hx} cy={-148 + i * 6} rx={34} ry={14} fill="#3a4a6a" />)}
        {/* aleta */}
        <path d="M 260 120 Q 220 220 120 260 Q 200 180 180 120 Z" fill="#33425f" />
        {/* mandíbula */}
        <g transform={`rotate(${boca * 22} 120 140)`}>
          <path d="M 120 120 Q 400 150 640 130 Q 640 160 600 170 Q 360 190 120 150 Z" fill="#e8e2d6" />
          {boca > 0.05 && Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${200 + i * 42} 122 l 10 -22 l 10 22 Z`} fill="#fff" />)}
        </g>
        {boca > 0.05 && <path d="M 140 128 Q 400 150 640 128 L 640 116 Q 400 136 140 116 Z" fill="#7a2a3a" />}
        {/* ojo */}
        <ellipse cx={230} cy={40} rx={20} ry={enojo ? 10 : 16} fill="#fff" />
        <circle cx={236} cy={42} r={9} fill="#101018" />
        {enojo && <line x1={196} y1={14} x2={262} y2={30} stroke="#202a40" strokeWidth={9} strokeLinecap="round" />}
        {/* espiráculo */}
        <ellipse cx={680} cy={-226} rx={18} ry={6} fill="#202a40" />
        {/* arpones clavados */}
        {Array.from({ length: arpones }, (_, i) => (
          <g key={i} transform={`translate(${-60 + i * 140} ${-190 - i * 8}) rotate(${-60 + i * 12})`}>
            <line x1={0} y1={0} x2={0} y2={-200} stroke={MADERA3} strokeWidth={9} />
            <path d={`M 0 -200 Q ${-60} -300 ${-180 + i * 30} -360`} stroke="#e8dcc0" strokeWidth={5} fill="none" />
          </g>
        ))}
        {/* soplo */}
        {chorro > 0 && <g transform="translate(690 -232)" opacity={chorro}>
          {Array.from({ length: 9 }, (_, i) => {
            const k = ((t * 1.4 + i / 9) % 1);
            return <circle key={i} cx={-30 - k * 120 + Math.sin(i * 3) * 30} cy={-k * 360} r={26 + k * 50} fill={sangre > 0.5 ? "#d6283a" : "#eaf6ff"} opacity={0.75 * (1 - k)} />;
          })}
        </g>}
      </g>
    </svg>
  );
};

// ── tiburón (silueta azul acero), nada a la derecha
export const Tiburon: React.FC<{ x: number; y: number; t: number; s?: number; flip?: boolean; boca?: number }> = ({ x, y, t, s = 1, flip, boca = 0 }) => {
  const a = Math.sin(t * 7 + x * 0.01) * 12;
  return (
    <Svg x={x} y={y} s={s} flip={flip}>
      <g transform={`translate(-150 0) rotate(${a})`}><path d="M 0 0 L -110 -80 L -80 0 L -110 70 Z" fill="#4a6078" /></g>
      <path d="M -160 0 Q -40 -70 120 -40 Q 210 -20 230 0 Q 210 30 120 40 Q -40 60 -160 0 Z" fill="#5a7490" />
      <path d="M -60 40 Q 60 54 180 26 Q 60 30 -60 24 Z" fill="#c8d4e0" />
      <path d="M -10 -52 L 30 -140 L 70 -46 Z" fill="#4a6078" />
      <path d="M 40 30 L 10 90 L 90 34 Z" fill="#4a6078" />
      <circle cx={170} cy={-6} r={7} fill="#101018" />
      <path d={`M 150 16 Q 190 ${22 + boca * 20} 226 6`} stroke="#2a3a4a" strokeWidth={5} fill={boca > 0.2 ? "#7a2a3a" : "none"} />
      {boca > 0.2 && [0, 1, 2, 3].map((i) => <path key={i} d={`M ${160 + i * 16} 16 l 6 10 l 6 -10 Z`} fill="#fff" />)}
      {[0, 1, 2].map((i) => <line key={i} x1={100 + i * 12} y1={-14} x2={96 + i * 12} y2={12} stroke="#3a4e66" strokeWidth={4} />)}
    </Svg>
  );
};

// ── isla tropical en la línea del horizonte (origen = base en el agua)
export const Isla: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number; humo?: boolean }> = ({ x, y, t, s = 1, seed = 1, humo }) => {
  const r = rnd(seed);
  const palmas = Array.from({ length: 5 }, () => [r() * 700 - 350, 0.7 + r() * 0.5, r() * 6]);
  return (
    <Svg x={x} y={y} s={s}>
      <path d="M -600 10 Q -420 -120 -150 -200 Q 40 -380 220 -230 Q 450 -110 600 10 Z" fill="#2f8a4a" />
      <path d="M -150 -200 Q 40 -380 220 -230 Q 80 -260 -150 -200 Z" fill="#46a85a" />
      <path d="M -640 14 Q 0 -40 640 14 Z" fill="#f2d79a" />
      {palmas.map(([px, k, f], i) => (
        <g key={i} transform={`translate(${px} ${-60 - Math.abs(px) * 0.1}) scale(${k})`}>
          <path d="M 0 0 Q 20 -120 60 -230" stroke="#7a5a2a" strokeWidth={16} fill="none" />
          {[0, 1, 2, 3, 4].map((h) => <path key={h} transform={`translate(60 -230) rotate(${h * 72 + Math.sin(t * 1.5 + f) * 6})`} d="M 0 0 Q 60 -30 120 10 Q 60 -6 0 0 Z" fill="#2a7a3a" />)}
        </g>
      ))}
      {humo && Array.from({ length: 6 }, (_, i) => { const k = (t * 0.3 + i / 6) % 1; return <circle key={i} cx={80 + k * 80} cy={-300 - k * 300} r={20 + k * 50} fill="#e8e2d6" opacity={0.5 * (1 - k)} />; })}
    </Svg>
  );
};

// ── casas grises de Nantucket (tejuela gris, marcos blancos). Origen = base al centro.
export const CasaNan: React.FC<{ x: number; y: number; s?: number; tono?: string; luz?: boolean; rica?: boolean }> = ({ x, y, s = 1, tono = "#9aa0a8", luz, rica }) => (
  <Svg x={x} y={y} s={s}>
    <rect x={-150} y={-260} width={300} height={260} fill={tono} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-150} y1={-240 + i * 28} x2={150} y2={-240 + i * 28} stroke="#7a8088" strokeWidth={3} />)}
    <path d="M -175 -258 L 0 -400 L 175 -258 Z" fill="#4a4e58" />
    <rect x={60} y={-430} width={40} height={90} fill="#8a4a3a" />
    {rica && <g><rect x={-60} y={-470} width={120} height={40} fill="#f4f0e8" /><line x1={-60} y1={-470} x2={60} y2={-470} stroke="#f4f0e8" strokeWidth={6} />{[-50, -20, 10, 40].map((px) => <line key={px} x1={px} y1={-470} x2={px} y2={-500} stroke="#f4f0e8" strokeWidth={5} />)}<line x1={-56} y1={-500} x2={56} y2={-500} stroke="#f4f0e8" strokeWidth={5} /></g>}
    {[[-100, -200], [40, -200], [-100, -110], [40, -110]].map(([wx, wy], i) => (
      <g key={i}><rect x={wx} y={wy} width={60} height={64} fill={luz ? "#ffd27a" : "#5a8ab0"} stroke="#f4f0e8" strokeWidth={7} /><line x1={wx + 30} y1={wy} x2={wx + 30} y2={wy + 64} stroke="#f4f0e8" strokeWidth={4} /></g>
    ))}
    <rect x={-22} y={-90} width={44} height={90} fill="#2a4a6a" stroke="#f4f0e8" strokeWidth={6} />
  </Svg>
);
// molino viejo de Nantucket + campanario
export const Molino: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <Svg x={x} y={y} s={s}>
    <path d="M -90 0 L -60 -300 L 60 -300 L 90 0 Z" fill="#8a7a6a" />
    <path d="M -80 -300 L 0 -360 L 80 -300 Z" fill="#5a4a3a" />
    <g transform={`translate(0 -310) rotate(${t * 30})`}>{[0, 90, 180, 270].map((a) => <g key={a} transform={`rotate(${a})`}><rect x={-10} y={-260} width={20} height={260} fill={MADERA2} /><rect x={8} y={-250} width={60} height={200} fill="#e8dcc0" opacity={0.85} /></g>)}</g>
    <circle cx={0} cy={-310} r={16} fill={MADERA2} />
  </Svg>
);
export const Iglesia: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <Svg x={x} y={y} s={s}>
    <rect x={-160} y={-300} width={320} height={300} fill="#f4f0e8" />
    <path d="M -180 -300 L 0 -420 L 180 -300 Z" fill="#d8d0c4" />
    <rect x={-50} y={-640} width={100} height={260} fill="#f4f0e8" />
    <path d="M -60 -640 L 0 -820 L 60 -640 Z" fill="#d8d0c4" />
    <circle cx={0} cy={-560} r={28} fill="#3a4a6a" />
    {[-110, 50].map((wx) => <path key={wx} d={`M ${wx} -120 L ${wx} -220 Q ${wx + 30} -260 ${wx + 60} -220 L ${wx + 60} -120 Z`} fill="#5a8ab0" />)}
  </Svg>
);

// ── muelle de madera con pilotes (origen = borde del muelle sobre el agua, se extiende a la izquierda)
export const Muelle: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 2200 }) => (
  <Svg x={x} y={y}>
    {Array.from({ length: Math.ceil(w / 160) }, (_, i) => <rect key={i} x={-w + i * 160 + 40} y={-10} width={26} height={220} fill={MADERA2} />)}
    <rect x={-w} y={-60} width={w} height={54} fill={MADERA3} />
    {Array.from({ length: Math.ceil(w / 60) }, (_, i) => <line key={`l${i}`} x1={-w + i * 60} y1={-60} x2={-w + i * 60} y2={-6} stroke={MADERA} strokeWidth={4} />)}
    <rect x={-w} y={-10} width={w} height={14} fill={MADERA2} />
  </Svg>
);

// ── oficina del "land shark" en Nueva York: fachada de ladrillo con corte (se ve el escritorio)
export const Oficina: React.FC<{ x: number; y: number; t: number; corte?: number }> = ({ x, y, t, corte = 1 }) => (
  <Svg x={x} y={y}>
    <rect x={-700} y={-900} width={1400} height={900} fill="#8a3a2a" />
    {Array.from({ length: 30 }, (_, r) => <line key={r} x1={-700} y1={-900 + r * 30} x2={700} y2={-900 + r * 30} stroke="#6a2a1e" strokeWidth={3} />)}
    <rect x={-640} y={-840} width={1280} height={780} fill="#e8c898" opacity={corte} />
    <rect x={-640} y={-180} width={1280} height={120} fill="#9a6a3a" opacity={corte} />
    {/* afiche */}
    <g opacity={corte} transform="translate(-380 -620)">
      <rect x={-170} y={-200} width={340} height={420} fill="#f4ead2" stroke="#5a3418" strokeWidth={8} />
      <text x={0} y={-130} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#2a1530">WANTED</text>
      <text x={0} y={-70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#8a2a2a">WHALEMEN</text>
      <g transform="translate(0 40) scale(0.16)"><path d="M -660 -40 Q -400 -150 -40 -210 Q 300 -250 560 -230 Q 760 -210 780 -60 Q 790 80 700 130 Q 400 190 0 170 Q -400 140 -660 40 Z" fill="#2a1530" /><path d="M -660 0 L -900 -150 L -860 0 L -900 150 Z" fill="#2a1530" /></g>
      <text x={0} y={160} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={28} fill="#2a1530">GOOD PAY!</text>
    </g>
    {/* ventana con la calle */}
    <g opacity={corte}><rect x={180} y={-760} width={340} height={300} fill="#8ac8f0" stroke={MADERA2} strokeWidth={14} /><line x1={350} y1={-760} x2={350} y2={-460} stroke={MADERA2} strokeWidth={10} /></g>
    {/* escritorio */}
    <g opacity={corte} transform="translate(160 -250)">
      <rect x={-300} y={-30} width={600} height={40} fill={MADERA} />
      <rect x={-280} y={10} width={30} height={200} fill={MADERA2} /><rect x={250} y={10} width={30} height={200} fill={MADERA2} />
      <rect x={-200} y={-48} width={180} height={18} fill="#f4ead2" />
      <rect x={120} y={-90} width={30} height={60} fill="#1a1420" />
    </g>
    {/* cartel */}
    <rect x={-360} y={-1000} width={720} height={110} rx={12} fill="#1a1420" />
    <text x={0} y={-925} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={60} fill="#f7c548" letterSpacing={4}>SHIPPING AGENT</text>
  </Svg>
);

// ── torre de petróleo (Pensilvania 1859) con chorro
export const Torre: React.FC<{ x: number; y: number; t: number; s?: number; chorro?: number }> = ({ x, y, t, s = 1, chorro = 0 }) => (
  <Svg x={x} y={y} s={s}>
    <path d="M -140 0 L -30 -620 L 30 -620 L 140 0" stroke={MADERA2} strokeWidth={18} fill="none" />
    {Array.from({ length: 6 }, (_, i) => { const yy = -i * 100 - 40; const w = 140 - (i * 100 + 40) * 0.18; return <g key={i}><line x1={-w} y1={yy} x2={w} y2={yy} stroke={MADERA2} strokeWidth={10} /><line x1={-w} y1={yy} x2={w - 18} y2={yy - 100} stroke={MADERA2} strokeWidth={6} /></g>; })}
    <rect x={-220} y={-110} width={150} height={110} fill={MADERA} />
    {chorro > 0 && <g opacity={Math.min(1, chorro * 2)}>
      <path d={`M -16 -620 Q ${-30 + Math.sin(t * 9) * 10} ${-620 - 500 * chorro} 0 ${-640 - 600 * chorro} Q ${30 + Math.sin(t * 8) * 10} ${-620 - 500 * chorro} 16 -620 Z`} fill="#1a1414" />
      {Array.from({ length: 16 }, (_, i) => { const k = (t * 0.9 + i / 16) % 1; const d = i % 2 ? 1 : -1; return <circle key={i} cx={d * k * 420} cy={-640 - 600 * chorro + k * k * 900} r={14 + k * 16} fill="#1a1414" opacity={chorro * (1 - k * 0.6)} />; })}
    </g>}
  </Svg>
);

// ── farola/farol del sereno
export const Farol: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <Svg x={x} y={y} s={s}>
    <circle cx={0} cy={0} r={140} fill="#ffd27a" opacity={0.18 + 0.04 * Math.sin(t * 9)} />
    <rect x={-26} y={-40} width={52} height={70} rx={8} fill="#ffe7a0" stroke="#3a2a1a" strokeWidth={6} />
    <path d="M -30 -40 L 0 -64 L 30 -40 Z" fill="#3a2a1a" />
    <path d="M 0 -64 Q 0 -90 -20 -96" stroke="#3a2a1a" strokeWidth={5} fill="none" />
  </Svg>
);

// ── utilería chica (todas centradas en su origen)
export const Galleta: React.FC<{ x: number; y: number; s?: number; rot?: number; rota?: boolean }> = ({ x, y, s = 1, rot = 0, rota }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <rect x={-90} y={-90} width={180} height={180} rx={22} fill="#e2b874" stroke="#b5874a" strokeWidth={8} />
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-54 + (i % 4) * 36} cy={-54 + Math.floor(i / 4) * 36} r={6} fill="#a8783e" />)}
    {rota && <path d="M -90 -20 L -20 10 L 10 -40 L 90 20" stroke="#5a3418" strokeWidth={7} fill="none" />}
  </Svg>
);
export const Rata: React.FC<{ x: number; y: number; t: number; s?: number; flip?: boolean }> = ({ x, y, t, s = 1, flip }) => (
  <Svg x={x} y={y} s={s} flip={flip}>
    <path d={`M -60 0 Q -130 ${-10 + Math.sin(t * 8) * 16} -190 ${10 + Math.sin(t * 8 + 1) * 16}`} stroke="#c88a8a" strokeWidth={8} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-26} rx={70} ry={36} fill="#6a6470" />
    <path d="M 50 -40 Q 110 -36 120 -14 Q 90 -4 50 -10 Z" fill="#6a6470" />
    <circle cx={40} cy={-58} r={16} fill="#8a8490" /><circle cx={40} cy={-58} r={8} fill="#e8a0a0" />
    <circle cx={88} cy={-30} r={6} fill="#101010" /><circle cx={120} cy={-16} r={6} fill="#e87a8a" />
    {[-30, 20].map((lx, i) => <line key={i} x1={lx} y1={4} x2={lx + Math.sin(t * 16 + i * 3) * 10} y2={14} stroke="#6a6470" strokeWidth={8} strokeLinecap="round" />)}
  </Svg>
);
export const Cucaracha: React.FC<{ x: number; y: number; t: number; s?: number; rot?: number }> = ({ x, y, t, s = 1, rot = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    {[-1, 1].map((d) => [-14, 0, 14].map((ly, i) => <line key={`${d}${i}`} x1={0} y1={ly} x2={d * (34 + Math.sin(t * 20 + i) * 6)} y2={ly + 12} stroke="#3a1a0a" strokeWidth={4} />))}
    <ellipse cx={0} cy={0} rx={18} ry={30} fill="#7a3a14" /><line x1={0} y1={-26} x2={0} y2={28} stroke="#4a200a" strokeWidth={3} />
    <path d={`M -6 -30 Q -20 -60 -30 ${-70 + Math.sin(t * 9) * 6} M 6 -30 Q 20 -60 30 ${-70 + Math.cos(t * 9) * 6}`} stroke="#3a1a0a" strokeWidth={3} fill="none" />
  </Svg>
);
export const Lampara: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <Svg x={x} y={y} s={s} rot={Math.sin(t * 0.8) * 8}>
    <line x1={0} y1={-120} x2={0} y2={-40} stroke="#3a2a1a" strokeWidth={5} />
    <circle cx={0} cy={0} r={170} fill="#ffcf6a" opacity={0.14 + 0.05 * Math.sin(t * 11)} />
    <path d="M -34 -40 L 34 -40 L 26 30 L -26 30 Z" fill="#c8a040" stroke="#5a4020" strokeWidth={5} />
    <path d={`M 0 ${-30 + Math.sin(t * 13) * 3} Q 12 -4 0 10 Q -12 -4 0 ${-30 + Math.sin(t * 13) * 3} Z`} fill="#ffb020" />
    {/* hollín */}
    {[0, 1, 2].map((i) => { const k = (t * 0.6 + i / 3) % 1; return <circle key={i} cx={Math.sin(i * 2 + t) * 10} cy={-50 - k * 120} r={8 + k * 18} fill="#2a2020" opacity={0.4 * (1 - k)} />; })}
  </Svg>
);
export const Pistola: React.FC<{ x: number; y: number; s?: number; rot?: number; humo?: number }> = ({ x, y, s = 1, rot = 0, humo = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <rect x={-20} y={-30} width={200} height={34} rx={8} fill="#4a4e58" />
    <path d="M -20 -30 L -40 -30 Q -110 -10 -120 70 L -60 80 Q -50 20 -10 4 Z" fill={MADERA} />
    <path d="M 10 -30 L 26 -60 L 40 -30" fill="#4a4e58" />
    {humo > 0 && <g opacity={humo}>{[0, 1, 2, 3].map((i) => <circle key={i} cx={200 + i * 50} cy={-14 - i * 20} r={30 + i * 18} fill="#e8e2d6" opacity={0.7 - i * 0.12} />)}<path d="M 190 -14 L 260 -60 L 250 -14 L 300 10 Z" fill="#ffd27a" /></g>}
  </Svg>
);
// puño con pajitas (sorteo): una corta
export const Pajitas: React.FC<{ x: number; y: number; s?: number; saca?: number }> = ({ x, y, s = 1, saca = 0 }) => (
  <Svg x={x} y={y} s={s}>
    {[-48, -16, 16, 48].map((px, i) => <rect key={i} x={px - 8} y={i === 2 ? -150 - saca * 60 : -260} width={16} height={i === 2 ? 110 : 220} rx={6} fill="#f2d27e" stroke="#b58a3a" strokeWidth={4} transform={i === 2 ? `translate(${saca * 120} ${-saca * 80}) rotate(${saca * 30})` : undefined} />)}
    <path d="M -90 -60 Q -100 60 -40 100 L 60 100 Q 100 40 90 -60 Q 0 -90 -90 -60 Z" fill="#c98b62" />
    {[-60, -24, 12, 48].map((px) => <path key={px} d={`M ${px} -60 Q ${px + 18} -80 ${px + 36} -60`} stroke="#a2643f" strokeWidth={6} fill="none" />)}
  </Svg>
);
export const Arpon: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <line x1={-260} y1={0} x2={120} y2={0} stroke={MADERA3} strokeWidth={14} strokeLinecap="round" />
    <rect x={110} y={-8} width={140} height={16} fill="#8a8e98" />
    <path d="M 250 -36 L 320 0 L 250 36 L 270 0 Z" fill="#c8ccd4" />
  </Svg>
);
export const Lanza: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <line x1={-320} y1={0} x2={160} y2={0} stroke={MADERA3} strokeWidth={12} strokeLinecap="round" />
    <rect x={150} y={-6} width={220} height={12} fill="#8a8e98" />
    <path d="M 370 -22 Q 430 0 370 22 Z" fill="#c8ccd4" />
  </Svg>
);
export const Hacha: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <line x1={0} y1={-120} x2={0} y2={120} stroke={MADERA3} strokeWidth={18} strokeLinecap="round" />
    <path d="M -6 -120 L 90 -150 Q 110 -90 90 -30 L -6 -60 Z" fill="#c8ccd4" stroke="#7a7e88" strokeWidth={5} />
  </Svg>
);
export const Pala: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <Svg x={x} y={y} s={s} rot={rot}>
    <line x1={0} y1={0} x2={0} y2={-420} stroke={MADERA3} strokeWidth={12} />
    <path d="M -36 0 L 36 0 L 30 80 L -30 80 Z" fill="#c8ccd4" stroke="#7a7e88" strokeWidth={4} />
  </Svg>
);
export const Gaviota: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const a = Math.sin(t * 9 + x) * 22;
  return (
    <Svg x={x} y={y} s={s}>
      <path d={`M -70 ${-a} Q -30 -10 0 0 Q 30 -10 70 ${-a}`} stroke="#f4f0e8" strokeWidth={12} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={2} r={9} fill="#f4f0e8" />
    </Svg>
  );
};
export const Nube: React.FC<{ x: number; y: number; s?: number; col?: string; op?: number }> = ({ x, y, s = 1, col = "#fff", op = 0.9 }) => (
  <Svg x={x} y={y} s={s} op={op}>
    <path d="M -220 40 Q -240 -30 -150 -40 Q -120 -120 -20 -100 Q 50 -160 130 -90 Q 230 -100 230 0 Q 260 40 200 50 Z" fill={col} />
  </Svg>
);
// sol/luna en capa lejana
export const Sol: React.FC<{ x: number; y: number; r?: number; col?: string }> = ({ x, y, r = 110, col = "#fff0b0" }) => (
  <Svg x={x} y={y}>
    <circle cx={0} cy={0} r={r * 2.6} fill={col} opacity={0.18} />
    <circle cx={0} cy={0} r={r * 1.6} fill={col} opacity={0.25} />
    <circle cx={0} cy={0} r={r} fill={col} />
  </Svg>
);
// humo grasiento (columna) en coordenadas locales: sube desde (x, y)
export const Humo: React.FC<{ x: number; y: number; t: number; s?: number; n?: number; op?: number; col?: string; viento?: number }> = ({ x, y, t, s = 1, n = 14, op = 0.8, col = "#2a2228", viento = -260 }) => (
  <Svg x={x} y={y} s={s}>
    {Array.from({ length: n }, (_, i) => {
      const k = (t * 0.32 + i / n) % 1;
      return <circle key={i} cx={k * viento * 3 + Math.sin(i * 2.3 + t) * 40} cy={-k * 1300} r={60 + k * 260} fill={col} opacity={op * (1 - k) * 0.9} />;
    })}
  </Svg>
);
// salpicadura (anillo de gotas) que nace en t0
export const Splash: React.FC<{ x: number; y: number; t: number; t0: number; s?: number; col?: string }> = ({ x, y, t, t0, s = 1, col = "#eaf8ff" }) => {
  const k = (t - t0) / 1.1;
  if (k < 0 || k > 1) return null;
  return (
    <Svg x={x} y={y} s={s}>
      {Array.from({ length: 18 }, (_, i) => {
        const a = -Math.PI * (0.1 + 0.8 * (i / 17));
        const v = 380 + (i % 3) * 140;
        return <circle key={i} cx={Math.cos(a) * v * k} cy={-Math.sin(-a) * v * k * 1.3 + 900 * k * k} r={(20 - k * 14) * (1 + (i % 2))} fill={col} opacity={Math.min(1, k * 10) * (1 - k)} />; // vuelta 7: en k≈0 era un disco blanco pegado
      })}
      <ellipse cx={0} cy={0} rx={200 * Math.sqrt(k) + 40} ry={30} fill="none" stroke={col} strokeWidth={10 * (1 - k)} opacity={Math.min(1, k * 10)} />
    </Svg>
  );
};

// ── tarjetas en pantalla (HUD)
// recorte de diario
export const Diario: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; rot?: number; tPay?: number; tWorld?: number; t1?: number }> = ({ t, t0, x, y, s = 1, rot = -4, tPay, tWorld, t1 = 1e9 }) => {
  if (t < t0 || t > t1 + 0.35) return null;
  const tp = tPay ?? t0 + 0.9, tw = tWorld ?? t0 + 1.6;
  const sal = prog(t, t1, t1 + 0.35);
  const e = ent(t, t0, 0, { damping: 13, stiffness: 140 });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 760, transform: `translate(-50%,-50%) scale(${s * e * (1 - sal)}) rotate(${rot + (1 - e) * 20 + sal * 30}deg)`, background: "#f2ead6", padding: "34px 44px", boxShadow: "0 18px 0 rgba(20,10,40,.35)", fontFamily, color: "#2a1a20", textAlign: "center", border: "6px solid #d8ccb0" }}>
      <div style={{ fontSize: 30, letterSpacing: 6, borderBottom: "4px solid #2a1a20", paddingBottom: 8 }}>THE DAILY HERALD · 1841</div>
      <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, marginTop: 16 }}>WANTED!</div>
      <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>YOUNG MEN FOR<br />WHALING VOYAGES</div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20, fontSize: 40, fontWeight: 700 }}>
        <span style={{ opacity: prog(t, tp, tp + 0.2), transform: `scale(${t > tp ? ent(t, tp) : 0})`, display: "inline-block", color: "#1a6a3a" }}>GOOD PAY</span>
        <span style={{ opacity: prog(t, tw, tw + 0.2), transform: `scale(${t > tw ? ent(t, tw) : 0})`, display: "inline-block", color: "#1a4a8a" }}>SEE THE WORLD</span>
      </div>
    </div>
  );
};
// contrato con la X
export const Articulos: React.FC<{ t: number; t0: number; x: number; y: number; s?: number; tx?: number; lay?: string; tLay?: number; t1?: number; borroso?: [number, number] }> = ({ t, t0, x, y, s = 1, tx = 1e9, lay, tLay = 1e9, t1 = 1e9, borroso }) => {
  if (t < t0 || t > t1 + 0.35) return null;
  const sal = prog(t, t1, t1 + 0.35);
  const bl = borroso && t > borroso[0] && t < borroso[1] ? 4 + 3 * Math.sin(t * 9) : 0;
  const e = ent(t, t0, 0, { damping: 13, stiffness: 140 });
  const k = prog(t, tx, tx + 0.5);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 720, height: 860, transform: `translate(-50%,-50%) scale(${s * e * (1 - sal)}) rotate(${2 + (1 - e) * -14 - sal * 40}deg)`, background: "linear-gradient(180deg,#f4e6c4,#e6d2a4)", boxShadow: "0 18px 0 rgba(20,10,40,.35)", fontFamily, color: "#3a2418", borderRadius: 10 }}>
      <div style={{ textAlign: "center", fontSize: 52, fontWeight: 700, marginTop: 40 }}>SHIPPING ARTICLES</div>
      <div style={{ textAlign: "center", fontSize: 28, marginTop: 6, letterSpacing: 4 }}>SHIP · NANTUCKET · 1841</div>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ filter: bl ? `blur(${bl}px)` : undefined, transform: bl ? `translateX(${Math.sin(t * 7 + i) * 14}px)` : undefined, margin: "26px 60px 0", height: 10, borderRadius: 5, background: "#b89a6a", width: `${78 - (i % 3) * 12}%` }} />)}
      {lay && t >= tLay && <div style={{ position: "absolute", left: 360, top: 560, transform: `translate(-50%,-50%) scale(${ent(t, tLay)}) rotate(-6deg)`, fontSize: 92, fontWeight: 700, color: C.rojo, border: `8px solid ${C.rojo}`, padding: "0 26px", borderRadius: 16 }}>{lay}</div>}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 110, borderBottom: "5px solid #3a2418" }} />
      <svg style={{ position: "absolute", left: 250, bottom: 100 }} width={220} height={200} viewBox="0 0 220 200">
        <line x1={30} y1={30} x2={30 + 160 * Math.min(1, k * 2)} y2={30 + 150 * Math.min(1, k * 2)} stroke="#1a1020" strokeWidth={16} strokeLinecap="round" />
        {k > 0.5 && <line x1={190} y1={30} x2={190 - 160 * (k * 2 - 1)} y2={30 + 150 * (k * 2 - 1)} stroke="#1a1020" strokeWidth={16} strokeLinecap="round" />}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", fontSize: 26, letterSpacing: 3 }}>HIS MARK</div>
    </div>
  );
};
// porción de torta: 1/N del total (el lay)
export const Torta: React.FC<{ t: number; t0: number; x: number; y: number; r?: number; n: number; saca?: number; col?: string; label?: string }> = ({ t, t0, x, y, r = 300, n, saca = 1e9, col = C.oro, label }) => {
  if (t < t0) return null;
  const e = ent(t, t0, 0, { damping: 12, stiffness: 150 });
  const a = (Math.PI * 2) / n;
  const k = prog(t, saca, saca + 0.6);
  return (
    <svg style={{ position: "absolute", left: x - r * 1.6, top: y - r * 1.6, overflow: "visible" }} width={r * 3.2} height={r * 3.2} viewBox={`${-r * 1.6} ${-r * 1.6} ${r * 3.2} ${r * 3.2}`}>
      <g transform={`scale(${e})`}>
        <circle cx={0} cy={0} r={r} fill={col} stroke="#2a1530" strokeWidth={10} />
        {n <= 400 && Array.from({ length: Math.min(n, 400) }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * a - Math.PI / 2) * r} y2={Math.sin(i * a - Math.PI / 2) * r} stroke="#2a1530" strokeWidth={n > 100 ? 1.2 : 3} opacity={0.5} />)}
        {n > 1 && <g transform={`translate(${k * r * 1.1} ${-k * r * 0.4})`}>
          <path d={`M 0 0 L 0 ${-r} A ${r} ${r} 0 0 1 ${Math.sin(a) * r} ${-Math.cos(a) * r} Z`} fill={C.rojo} stroke="#fff" strokeWidth={6} />
        </g>}
        {label && <text x={0} y={r + 90} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff" stroke="#2a1530" strokeWidth={10} paintOrder="stroke">{label}</text>}
      </g>
    </svg>
  );
};

export const Moneda0: React.FC<{ r?: number }> = ({ r = 40 }) => (
  <g>
    <circle r={r} fill="#f7c548" stroke="#a8781a" strokeWidth={r * 0.14} />
    <circle r={r * 0.66} fill="none" stroke="#d8a030" strokeWidth={r * 0.08} />
    <text y={r * 0.34} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={r} fill="#a8781a">$</text>
  </g>
);
