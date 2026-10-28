// Piezas premium de la 2ª pasada (28-oct, vara del creador: «el stickman de un lado y del otro una pizarra o
// componentes nuevos muy creativos, explicativos… perfectamente encajados en inglés y en español»). A diferencia de
// Piezas.tsx (pantalla entera con la escena desenfocada), éstas viven AL COSTADO: la escena sigue viva y el personaje
// queda del otro lado; entran girando en 3D con resorte desde su lado, respiran, y salen yéndose en profundidad.
// Todos los tiempos llegan ya mapeados al idioma (F del bloque). Ninguna se repite con las de Piezas.tsx.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { useF } from "../../anikit/camara";
import { F_MANO } from "../../anikit/pantalla";
import { cl, M_ } from "./kit";
import { eo, sp } from "./Piezas";

type Lado = "der" | "izq" | "centro";
const CX: Record<Lado, number> = { der: 1400, izq: 520, centro: 960 };

// ── el escenario lateral: sombra suave de su lado (la escena sigue viva del otro), entrada girando, salida en profundidad ──
const Lateral: React.FC<{ a: number; b: number; lado?: Lado; y?: number; children: (t: number) => React.ReactNode }> = ({ a, b, lado = "der", y = 520, children }) => {
  const f = useF();
  if (f < a - 1 || f > b + 14) return null;
  const t = f - a;
  const e = sp(t, 13, 140, 0.9);
  const sal = interpolate(f, [b, b + 14], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const dir = lado === "izq" ? -1 : 1;
  const vis = Math.min(1, t / 8) * (1 - sal);
  const ry = (1 - e) * -38 * dir + Math.sin(t * 0.04) * 2.5;
  const grad = lado === "centro" ? "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(24,14,8,0.45), transparent 75%)"
    : `linear-gradient(${lado === "der" ? "270deg" : "90deg"}, rgba(24,14,8,0.55) 0%, rgba(24,14,8,0.3) 38%, transparent 62%)`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: grad, opacity: vis }} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible", opacity: 1 - sal,
          transform: `translateX(${(1 - e) * 520 * dir}px) rotateY(${ry}deg) translateZ(${-sal * 380}px) translateY(${Math.sin(t * 0.05) * 6}px)`,
          transformOrigin: `${CX[lado]}px ${y}px`, filter: sal > 0.01 ? `blur(${sal * 8}px)` : undefined }}>
          <g transform={`translate(${CX[lado]},${y}) scale(1.12)`}>{children(t)}</g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// texto a mano que se escribe de izquierda a derecha (tiza / tinta): clip que avanza + polvo en la punta
const Escribe: React.FC<{ id: string; t: number; t0: number; dur: number; x: number; y: number; txt: string; tam: number; color: string; ancho: number; polvo?: boolean }> = ({ id, t, t0, dur, x, y, txt, tam, color, ancho, polvo }) => {
  const u = interpolate(t, [t0, t0 + dur], [0, 1], cl);
  if (u <= 0) return null;
  const px = x - ancho / 2 + ancho * u;
  return (
    <g>
      <clipPath id={id}><rect x={x - ancho / 2 - 20} y={y - tam} width={ancho * u + 20} height={tam * 1.5} /></clipPath>
      <text x={x} y={y} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={color} clipPath={`url(#${id})`} style={{ letterSpacing: 1 }}>{txt}</text>
      {polvo && u < 1 && <g>
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={px + Math.sin(t * 1.3 + i * 2) * 8} cy={y - tam * 0.3 + ((t * 3 + i * 9) % 26)} r={2.2} fill={color} opacity={0.55} />)}
        <g transform={`translate(${px + 6},${y - tam * 0.35 + Math.sin(t * 1.7) * 6}) rotate(-35)`}><rect x={-6} y={-34} width={12} height={40} rx={4} fill="#f6f2e8" stroke={M_} strokeWidth={2} /></g>
      </g>}
    </g>
  );
};

// ═══ b01 · LA BOLA DE CRISTAL: «tienes una ventaja enorme: sabes lo que va a pasar» — la niebla se abre y adentro, una
//     rata con pulgas (lo que viene). Al centro, sobre la escena. ═══
export const PBola: React.FC<{ a: number; b: number; ve: number; rotulo: string }> = ({ a, b, ve, rotulo }) => {
  const f = useF();
  return (
    <Lateral a={a} b={b} lado="der" y={520}>
      {(t) => {
        const abre = interpolate(f, [ve, ve + 20], [0, 1], { ...cl, easing: eo });
        return (
          <g>
            <defs>
              <radialGradient id="pbV" cx="0.38" cy="0.32"><stop offset="0" stopColor="#d8f0ff" /><stop offset="0.6" stopColor="#7aa8d0" /><stop offset="1" stopColor="#3a5a88" /></radialGradient>
              <clipPath id="pbC"><circle r={196} /></clipPath>
            </defs>
            <ellipse cy={262} rx={210} ry={30} fill="rgba(20,10,4,0.4)" />
            <path d="M-150 250 Q-130 180 -110 172 H110 Q130 180 150 250 Z" fill="#8a5a2a" stroke={M_} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-120 210 H120" stroke="#c8904a" strokeWidth={6} />
            <circle r={200} fill="url(#pbV)" stroke={M_} strokeWidth={8} />
            <g clipPath="url(#pbC)">
              <g opacity={abre} transform={`translate(0,${30 - abre * 20}) scale(${0.7 + abre * 0.3})`}>
                <ellipse cx={0} cy={40} rx={110} ry={50} fill="#4a4a52" stroke={M_} strokeWidth={6} />
                <circle cx={95} cy={10} r={42} fill="#4a4a52" stroke={M_} strokeWidth={6} />
                <circle cx={110} cy={-24} r={16} fill="#e8a0b0" stroke={M_} strokeWidth={4} />
                <circle cx={112} cy={4} r={7} fill="#c8202a" />
                <path d="M-110 50 Q-170 30 -180 -20" stroke="#e8a0b0" strokeWidth={8} fill="none" strokeLinecap="round" />
                {[0, 1, 2, 3, 4].map((i) => { const u = ((t + i * 9) % 30) / 30; return <circle key={i} cx={-60 + i * 34 + (u - 0.5) * 20} cy={-10 - Math.sin(u * Math.PI) * 70} r={6} fill="#5a2a14" />; })}
              </g>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <ellipse key={i} cx={Math.sin(t * 0.03 + i * 1.1) * 90 + (i % 2 ? 1 : -1) * abre * 230} cy={-60 + i * 30 + Math.cos(t * 0.04 + i) * 16} rx={150} ry={46} fill="#eef6ff" opacity={0.75 * (1 - abre * 0.9)} style={{ filter: "blur(8px)" }} />
              ))}
            </g>
            <ellipse cx={-80} cy={-110} rx={60} ry={26} fill="#fff" opacity={0.55} transform="rotate(-30 -80 -110)" />
            <text y={-240} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={74} fill="#fff6e6" stroke="#1d1410" strokeWidth={3} paintOrder="stroke" opacity={abre}>{rotulo}</text>
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b02 · CASAS QUE SE COMEN EL SOL: corte de una calle; cada piso sobresale más que el de abajo (se apilan de a uno)
//     y al final se tocan arriba: el sol queda afuera. A la derecha. ═══
export const PCasas: React.FC<{ a: number; b: number; pisos: [number, number, number]; tapa: number }> = ({ a, b, pisos, tapa }) => {
  const f = useF();
  return (
    <Lateral a={a} b={b} lado="der" y={560}>
      {(t) => {
        const k = pisos.map((p) => sp(f - p, 11, 170, 0.8));
        const c = sp(f - tapa, 14, 120, 1);
        const G = 300; // suelo de la calle
        const ancho = (i: number) => 170 + i * 58 * k[i] + (i === 2 ? c * 34 : 0);
        const piso = (i: number, dir: 1 | -1) => {
          const w = ancho(i), y = G - (i + 1) * 130, x = dir === -1 ? -340 : 340 - w;
          return (
            <g key={`${i}${dir}`} opacity={Math.min(1, k[i] * 1.6)} transform={`translate(0,${(1 - k[i]) * -50})`}>
              <rect x={x} y={y} width={w} height={130} fill={["#f2dcb4", "#ecd2a6", "#e6c898"][i]} stroke={M_} strokeWidth={6} />
              <path d={`M${x} ${y + 8} H${x + w} M${x} ${y + 122} H${x + w}`} stroke="#7a4a24" strokeWidth={7} />
              <path d={`M${x + 16} ${y + 8} L${x + w * 0.45} ${y + 122} M${x + w - 16} ${y + 8} L${x + w * 0.55} ${y + 122}`} stroke="#7a4a24" strokeWidth={6} />
              <rect x={x + w / 2 - 22} y={y + 40} width={44} height={44} fill="#3a4a5a" stroke={M_} strokeWidth={4} />
            </g>
          );
        };
        const hueco = Math.max(0, 680 - 2 * ancho(2)); // lo que queda de cielo arriba
        const luz = hueco / 340;
        return (
          <g>
            <clipPath id="pcC"><rect x={-360} y={-280} width={720} height={600} rx={18} /></clipPath>
            <g clipPath="url(#pcC)">
              <rect x={-360} y={-280} width={720} height={600} fill={`rgb(${120 + luz * 120},${150 + luz * 80},${200 - luz * 10})`} />
              <g transform={`translate(0,${-200 + (1 - luz) * 30})`}>
                <circle r={46} fill="#ffd23c" stroke={M_} strokeWidth={6} />
                {Array.from({ length: 8 }).map((_, i) => <path key={i} d="M0 -62 V-84" stroke="#e8a020" strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 45 + t})`} />)}
              </g>
              <path d={`M${-hueco / 2} -90 L${hueco / 2} -90 L${hueco * 0.9} ${G} L${-hueco * 0.9} ${G} Z`} fill="#fff2a8" opacity={0.55 * Math.min(1, luz * 1.5)} />
              <rect x={-360} y={G} width={720} height={30} fill={luz > 0.3 ? "#8a6a3a" : "#4a3a28"} />
              {[0, 1, 2].map((i) => [piso(i, -1), piso(i, 1)])}
            </g>
            <rect x={-360} y={-280} width={720} height={600} rx={18} fill="none" stroke={M_} strokeWidth={7} />
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b04 · UN PENIQUE = UN DÍA: la moneda de plata gira de canto y, detrás, el sol hace su arco de amanecer a noche.
//     A la izquierda (Tiza y el panadero quedan a la derecha). ═══
export const PPenique: React.FC<{ a: number; b: number; dia: string }> = ({ a, b, dia }) => {
  return (
    <Lateral a={a} b={b} lado="izq" y={540}>
      {(t) => {
        const u = interpolate(t, [10, 64], [0, 1], { ...cl, easing: Easing.inOut(Easing.sin) });
        const ang = Math.PI * (1 - u), sx = Math.cos(ang) * 300, sy = 120 - Math.sin(ang) * 300;
        const cielo = u < 0.5 ? interpolate(u, [0, 0.5], [0, 1]) : interpolate(u, [0.5, 1], [1, 0]);
        const gira = Math.cos(t * 0.16 * Math.exp(-t * 0.012));
        return (
          <g>
            <clipPath id="ppC"><rect x={-370} y={-260} width={740} height={420} rx={20} /></clipPath>
            <g clipPath="url(#ppC)">
              <rect x={-370} y={-260} width={740} height={420} fill={`rgb(${40 + cielo * 200},${50 + cielo * 170},${90 + cielo * 140})`} />
              <path d="M-300 120 A300 300 0 0 1 300 120" fill="none" stroke="#fff6e6" strokeWidth={4} strokeDasharray="10 14" opacity={0.6} />
              <circle cx={sx} cy={sy} r={40} fill={u < 0.85 ? "#ffd23c" : "#f0f0ff"} stroke={M_} strokeWidth={5} />
              <rect x={-370} y={120} width={740} height={60} fill="#5a3a20" />
            </g>
            <rect x={-370} y={-260} width={740} height={420} rx={20} fill="none" stroke={M_} strokeWidth={7} />
            <g transform={`translate(0,${190}) scale(${0.18 + 0.82 * Math.abs(gira)},1)`}>
              <circle r={110} fill="#d8dce0" stroke={M_} strokeWidth={8} />
              <circle r={84} fill="none" stroke="#9aa2a8" strokeWidth={6} />
              <path d="M-20 -50 V50 M20 -50 V50 M-50 -20 H50 M-50 20 H50" stroke="#8a929a" strokeWidth={6} opacity={gira > 0 ? 1 : 0} />
              <ellipse cx={-40} cy={-50} rx={26} ry={12} fill="#fff" opacity={0.7} transform="rotate(-30 -40 -50)" />
            </g>
            <text x={0} y={-210} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={64} fill="#fff6e6" stroke="#1d1410" strokeWidth={3} paintOrder="stroke" opacity={interpolate(t, [40, 52], [0, 1], cl)}>{dia}</text>
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b06 · LA CAMA COMPARTIDA: vista de arriba; las cabezas de los desconocidos aparecen de a una y Tiza queda aplastado
//     en el medio. A la derecha. ═══
export const PCama: React.FC<{ a: number; b: number; cabezas: number }> = ({ a, b, cabezas }) => {
  const f = useF();
  return (
    <Lateral a={a} b={b} lado="der" y={540}>
      {(t) => {
        const xs = [-210, -125, 125, 210, -40, 40];
        const aplasta = sp(f - cabezas - 14, 9, 160, 0.8);
        return (
          <g transform="rotate(-6)">
            <rect x={-300} y={-230} width={600} height={470} rx={26} fill="#8a5a2a" stroke={M_} strokeWidth={8} />
            <rect x={-270} y={-200} width={540} height={410} rx={18} fill="#e8cf8a" stroke={M_} strokeWidth={5} />
            {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M${-250 + ((i * 97) % 500)} ${-180 + ((i * 61) % 370)} l${14} ${-6}`} stroke="#c8a858" strokeWidth={4} strokeLinecap="round" />)}
            <rect x={-270} y={-200} width={540} height={70} fill="#f4efe4" stroke={M_} strokeWidth={5} />
            <rect x={-270} y={-60} width={540} height={270} fill="#a8b4c8" stroke={M_} strokeWidth={5} />
            {Array.from({ length: 18 }).map((_, i) => { const c = i % 6, r = Math.floor(i / 6);
              return <rect key={`q${i}`} x={-270 + c * 90} y={-60 + r * 90} width={90} height={90} fill={["#c8564a", "#e0b04a", "#5a8ab0", "#7aa060", "#b07ab0", "#e8d8b0"][(c + r * 2) % 6]} stroke={M_} strokeWidth={3} strokeDasharray="7 6" opacity={0.85} />; })}
            {/* los bultos de los seis cuerpos bajo la manta, apretados */}
            {xs.slice(0, 5).concat([0]).map((x, i) => <ellipse key={`c${i}`} cx={x + (x > 0 ? -1 : x < 0 ? 1 : 0) * aplasta * 14} cy={60} rx={i === 5 ? 30 * (1 - aplasta * 0.3) : 38} ry={120} fill="#000" opacity={0.12} />)}
            {xs.slice(0, 5).map((x, i) => {
              const s = sp(f - cabezas - i * 4, 9, 220, 0.6);
              const dx = x + (x > 0 ? -1 : 1) * aplasta * 14;
              return <g key={i} transform={`translate(${dx},${-120}) scale(${s})`}>
                <circle r={34} fill={["#e8c8a8", "#c89878", "#f0d0b0", "#d8b090", "#b88868"][i]} stroke={M_} strokeWidth={5} />
                <path d={i % 2 ? "M-14 0 h8 M6 0 h8" : "M-12 -2 q4 4 8 0 M6 -2 q4 4 8 0"} stroke={M_} strokeWidth={4} fill="none" />
                {i === 1 && <text x={30} y={-34} fontFamily={F_MANO} fontWeight={700} fontSize={34} fill="#3a5a8a">z</text>}
              </g>;
            })}
            <g transform={`translate(0,${-122}) scale(${1 - aplasta * 0.3},${1 + aplasta * 0.08})`}>
              <circle r={36} fill="#f6f6f2" stroke={M_} strokeWidth={6} />
              <path d="M-14 -6 l6 6 l-6 6 M14 -6 l-6 6 l6 6" stroke={M_} strokeWidth={4} fill="none" />
            </g>
            <text x={0} y={300} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={70} fill="#fff6e6" stroke="#1d1410" strokeWidth={3} paintOrder="stroke" opacity={sp(f - cabezas - 6)}>1 + 5</text>
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b08 · LA PIZARRA DE LA LECCIÓN: baja colgada de un clavo, se balancea, y la tiza escribe la lección. A la derecha;
//     Tiza queda solo bajo la lluvia del otro lado. ═══
export const PPizarra: React.FC<{ a: number; b: number; t1: string; t2: string; dos: number }> = ({ a, b, t1, t2, dos }) => {
  return (
    <Lateral a={a} b={b} lado="der" y={500}>
      {(t) => {
        const col = sp(t, 6, 90, 1);
        const ang = (1 - col) * 14 + Math.sin(t * 0.09) * 1.2 * Math.exp(-t * 0.02);
        const t2s = dos - a;
        return (
          <g transform={`translate(0,${(1 - sp(t, 11, 130, 0.9)) * -620}) rotate(${ang} 0 -330)`}>
            <path d="M0 -330 L-260 -190 M0 -330 L260 -190" stroke="#6a4a2a" strokeWidth={6} />
            <circle cy={-330} r={12} fill="#9aa2a8" stroke={M_} strokeWidth={4} />
            <rect x={-380} y={-200} width={760} height={470} rx={14} fill="#8a5a2a" stroke={M_} strokeWidth={8} />
            <rect x={-350} y={-172} width={700} height={414} rx={8} fill="#2f4a3a" stroke={M_} strokeWidth={4} />
            <path d="M-320 200 q120 -14 260 4 M60 -150 q120 10 230 -2" stroke="#ffffff" strokeWidth={10} opacity={0.06} strokeLinecap="round" />
            <Escribe id="pz1" t={t} t0={4} dur={20} x={0} y={-60} txt={t1} tam={88} color="#f4f0e4" ancho={560} polvo />
            <path d={`M-240 -30 H${-240 + 480 * interpolate(t, [22, 30], [0, 1], cl)}`} stroke="#f4d860" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
            <Escribe id="pz2" t={t} t0={t2s} dur={26} x={0} y={110} txt={t2} tam={64} color="#ffe6a0" ancho={620} polvo />
            <rect x={-120} y={258} width={240} height={22} rx={4} fill="#6a4a2a" stroke={M_} strokeWidth={4} />
            <rect x={60} y={248} width={60} height={14} rx={5} fill="#f6f2e8" stroke={M_} strokeWidth={3} />
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b10 · EL MEJOR NEGOCIO: un gráfico de valor; la barra del gorro apenas asoma y la del gato sale disparada hasta
//     romper el techo del cuadro (vale una vida). A la izquierda. ═══
export const PNegocio: React.FC<{ a: number; b: number; gato: number; gorro: string; gatoTxt: string }> = ({ a, b, gato, gorro, gatoTxt }) => {
  const f = useF();
  return (
    <Lateral a={a} b={b} lado="izq" y={560}>
      {(t) => {
        const g1 = sp(t - 4, 12, 170, 0.8), g2 = sp(f - gato, 8, 120, 0.9);
        const h2 = 60 + g2 * 470;
        return (
          <g>
            <rect x={-330} y={-280} width={660} height={540} rx={18} fill="#fbf3e2" stroke={M_} strokeWidth={7} />
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M-290 ${200 - i * 110} H290`} stroke="#d8c8a8" strokeWidth={3} strokeDasharray="8 10" />)}
            <path d="M-290 -260 V200 H300" stroke={M_} strokeWidth={6} fill="none" />
            <rect x={-200} y={200 - 70 * g1} width={140} height={70 * g1} fill="#9a7a5a" stroke={M_} strokeWidth={5} />
            <g transform={`translate(-130,${200 - 70 * g1 - 50}) scale(${g1})`}><path d="M-46 20 Q-40 -26 0 -30 Q40 -26 46 20 Z" fill="#5a4030" stroke={M_} strokeWidth={5} /></g>
            <rect x={60} y={200 - h2} width={140} height={h2} fill="#e8a020" stroke={M_} strokeWidth={5} />
            <g transform={`translate(130,${200 - h2 - 56}) scale(${0.4 + g2 * 0.6})`}>
              <ellipse rx={50} ry={38} fill="#8a8a86" stroke={M_} strokeWidth={5} />
              <path d="M-40 -24 L-30 -62 L-10 -34 M40 -24 L30 -62 L10 -34" fill="#8a8a86" stroke={M_} strokeWidth={5} strokeLinejoin="round" />
              <path d="M-18 -6 l10 4 M18 -6 l-10 4 M0 8 v6" stroke={M_} strokeWidth={4} />
            </g>
            {g2 > 0.6 && Array.from({ length: 6 }).map((_, i) => <path key={i} d="M0 -70 V-100" stroke="#ffd23c" strokeWidth={7} strokeLinecap="round" transform={`translate(130,${200 - h2 - 56}) rotate(${i * 60 + t * 2})`} opacity={interpolate(g2, [0.6, 1], [0, 1], cl)} />)}
            <text x={-130} y={250} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={46} fill={M_}>{gorro}</text>
            <text x={130} y={250} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={46} fill={M_}>{gatoTxt}</text>
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b13 · A UN DEDO: corte del montón de heno con Tiza adentro; la lanza baja, entra y frena a un dedo de la oreja
//     (la regla aparece entre la punta y la oreja). A la derecha. ═══
export const PDedo: React.FC<{ a: number; b: number; pincha: number; frena: number; rotulo: string }> = ({ a, b, pincha, frena, rotulo }) => {
  const f = useF();
  return (
    <Lateral a={a} b={b} lado="der" y={430}>
      {(t) => {
        const baja = interpolate(f, [pincha, frena], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
        const tiembla = f >= frena ? Math.sin((f - frena) * 2.2) * 5 * Math.exp(-(f - frena) / 6) : 0;
        const ly = -420 + baja * 330 + tiembla;
        const regla = sp(f - frena - 4, 12, 180, 0.7);
        return (
          <g>
            <path d="M-330 260 Q-300 -60 -120 -170 Q0 -220 120 -170 Q300 -60 330 260 Z" fill="#e8c860" stroke={M_} strokeWidth={8} />
            {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M${-260 + ((i * 89) % 520)} ${-120 + ((i * 53) % 360)} l${(i % 2 ? 1 : -1) * 22} ${-10}`} stroke="#c8a040" strokeWidth={5} strokeLinecap="round" />)}
            <g transform="translate(-30,120)">
              <circle r={70} fill="#f6f6f2" stroke={M_} strokeWidth={7} />
              <ellipse cx={58} cy={-6} rx={14} ry={22} fill="#f6f6f2" stroke={M_} strokeWidth={6} />
              <circle cx={-20} cy={-10} r={10} fill={M_} /><circle cx={16} cy={-10} r={10} fill={M_} />
              <ellipse cx={0} cy={26} rx={10} ry={14} fill={M_} />
              {f >= frena && <path d="M84 -40 q8 -14 0 -26" stroke="#7fc8f0" strokeWidth={6} fill="none" />}
            </g>
            <g transform={`translate(${30 + 36},${ly}) rotate(4)`}>
              <rect x={-9} y={-480} width={18} height={480} fill="#8a5a2a" stroke={M_} strokeWidth={5} />
              <path d="M-22 0 L0 70 L22 0 Z" fill="#c8ccd2" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
            </g>
            <g opacity={regla} transform={`translate(${130},${(ly + 70 + 120 - 30) / 2 + 30}) scale(${regla})`}>
              <path d="M-20 -26 H20 M-20 26 H20 M0 -26 V26" stroke="#ff5a3c" strokeWidth={6} />
              <text x={34} y={14} fontFamily={F_MANO} fontWeight={700} fontSize={84} fill="#fff6e6" stroke="#1d1410" strokeWidth={3} paintOrder="stroke">{rotulo}</text>
            </g>
          </g>
        );
      }}
    </Lateral>
  );
};

// ═══ b14 · EL PODIO DE LO QUE TE SALVÓ: tres escalones; 3º el agua del río tachada, 2º la paja tachada, y en el oro el
//     señor Bigotes con su medalla. Al centro, sobre el carro. ═══
export const PPodio: React.FC<{ a: number; b: number; m: [number, number, number] }> = ({ a, b, m }) => {
  const f = useF();
  return (
    <Lateral a={a} b={b} lado="der" y={560}>
      {(t) => {
        const k = m.map((x) => sp(f - x, 10, 160, 0.8));
        const esc = [[230, 120, "#c88a5a", "3"], [-230, 190, "#c8ccd2", "2"], [0, 270, "#ffd23c", "1"]] as const;
        const no = (x: number, y: number, s: number) => <path d={`M${x - 46} ${y - 46} L${x + 46} ${y + 46} M${x + 46} ${y - 46} L${x - 46} ${y + 46}`} stroke="#c8282a" strokeWidth={12} strokeLinecap="round" opacity={s} />;
        return (
          <g>
            {esc.map(([x, h, c, n], i) => (
              <g key={i} transform={`translate(${x},${200 - h * k[i]})`}>
                <rect x={-110} y={0} width={220} height={h * k[i] + 2} fill={c} stroke={M_} strokeWidth={7} />
                <text y={Math.min(70, h * k[i] - 10)} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={70} fill={M_} opacity={k[i]}>{n}</text>
              </g>
            ))}
            <g transform={`translate(230,${200 - 120 * k[0] - 70}) scale(${k[0]})`}>
              <path d="M0 -50 Q34 0 34 18 A34 34 0 0 1 -34 18 Q-34 0 0 -50 Z" fill="#7fc8f0" stroke={M_} strokeWidth={6} />
              {no(0, 0, sp(f - m[0] - 8))}
            </g>
            <g transform={`translate(-230,${200 - 190 * k[1] - 60}) scale(${k[1]})`}>
              {[-30, -10, 10, 30].map((x) => <path key={x} d={`M${x} 30 L${x * 1.6} -40`} stroke="#d8b040" strokeWidth={10} strokeLinecap="round" />)}
              {no(0, 0, sp(f - m[1] - 8))}
            </g>
            <g transform={`translate(0,${200 - 270 * k[2] - 64}) scale(${k[2]})`}>
              <ellipse rx={56} ry={44} fill="#8a8a86" stroke={M_} strokeWidth={6} />
              <path d="M-44 -26 L-34 -70 L-12 -38 M44 -26 L34 -70 L12 -38" fill="#8a8a86" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
              <path d="M-20 -6 l12 4 M20 -6 l-12 4" stroke={M_} strokeWidth={5} />
              <g transform={`translate(0,40) rotate(${Math.sin(t * 0.12) * 8})`}><path d="M-14 -16 L0 6 L14 -16" stroke="#c8282a" strokeWidth={6} fill="none" /><circle cy={20} r={20} fill="#ffd23c" stroke={M_} strokeWidth={5} /></g>
              {Array.from({ length: 6 }).map((_, i) => <path key={i} d="M0 -90 V-112" stroke="#ffd23c" strokeWidth={7} strokeLinecap="round" transform={`rotate(${i * 60 - 150 + Math.sin(t * 0.05) * 10})`} opacity={sp(f - m[2] - 6)} />)}
            </g>
          </g>
        );
      }}
    </Lateral>
  );
};
