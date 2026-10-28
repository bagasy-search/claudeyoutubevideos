// Piezas premium del video 1 (28-oct, «un componente premium ultra creativo por cada minuto, que no se repita»).
// Cada una es el OBJETO que la idea es (forma = idea), dibujado a mano con la misma tinta del mundo, con profundidad,
// entrada propia, elementos de a uno con resorte, cámara curva y salida que se aleja y se funde. Ninguna se repite.
// Todas reciben cuadros ya mapeados al idioma (F de su bloque), así ES y EN caen en su palabra.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { useF } from "../../anikit/camara";
import { F_MANO } from "../../anikit/pantalla";
import { DibujoIcono, TipoIcono } from "../iconos";
import { cl, M_ } from "./kit";

const sp = (fr: number, damping = 12, stiffness = 150, mass = 0.8) => (fr <= 0 ? 0 : spring({ frame: fr, fps: 30, config: { damping, stiffness, mass } }));
const eo = Easing.out(Easing.cubic);
const ei = Easing.inOut(Easing.cubic);
const rotulo = (tam: number, color = "#fff6e6"): React.CSSProperties => ({ fontFamily: F_MANO, fontWeight: 700, fontSize: tam, color, lineHeight: 1, whiteSpace: "pre", textAlign: "center", WebkitTextStroke: "3px #1d1410", textShadow: "0 6px 0 #1d1410" });
const Txt: React.FC<{ x: number; y: number; t: string; tam: number; color?: string; s?: number; rot?: number }> = ({ x, y, t, tam, color, s = 1, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, s * 1.4), ...rotulo(tam, color) }}>{t}</div>
);

// ── escenario común: la escena queda atrás desenfocada y más oscura, haz de luz que respira, motas al frente,
//    cámara que deriva en curva; sale alejándose en profundidad y se funde con el plano siguiente ──
const Pieza: React.FC<{ a: number; b: number; luz?: string; children: (t: number) => React.ReactNode }> = ({ a, b, luz = "255,226,170", children }) => {
  const f = useF();
  if (f < a - 1 || f > b + 16) return null;
  const t = f - a;
  const ent = interpolate(t, [0, 14], [0, 1], { ...cl, easing: eo });
  const sal = interpolate(f, [b, b + 16], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const vis = ent * (1 - sal);
  const rx = Math.sin(t * 0.031) * 2.4, ry = Math.sin(t * 0.023 + 1.3) * 4.2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backdropFilter: `blur(${14 * vis}px)`, background: `rgba(34,20,10,${0.5 * vis})` }} />
      <AbsoluteFill style={{ opacity: vis, background: `radial-gradient(ellipse 46% 16% at 50% 88%, rgba(${luz},0.32), transparent 70%)` }} />
      <AbsoluteFill style={{ opacity: 0.55 * vis * (0.85 + 0.15 * Math.sin(t * 0.07)), mixBlendMode: "screen", background: `conic-gradient(from 166deg at 50% -12%, transparent 0deg, rgba(${luz},0.42) 14deg, transparent 28deg)` }} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <AbsoluteFill style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${-sal * 420}px)`, opacity: 1 - sal, filter: sal > 0.01 ? `blur(${sal * 9}px)` : undefined }}>
          {children(t)}
        </AbsoluteFill>
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: vis }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const x = (i * 241 + t * (0.6 + (i % 3) * 0.25)) % 1980 - 30, y = 120 + ((i * 397) % 860) + Math.sin(t * 0.03 + i) * 22;
          return <circle key={i} cx={x} cy={y} r={3 + (i % 4) * 2.2} fill={`rgba(${luz},0.5)`} style={{ filter: "blur(2px)" }} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
const Sombra: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 0.35 }) => <ellipse cx={x} cy={y} rx={w} ry={w * 0.12} fill={`rgba(20,10,4,${o})`} />;

// ═══ 1 · b03 · LA BALANZA DEL TRUEQUE: tus zapatillas de 2026 contra capa + botas + gorro de 1348; con el gorro queda pareja ═══
export const PBalanza: React.FC<{ a: number; b: number; m: [number, number, number, number]; trato: string }> = ({ a, b, m, trato }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b}>
      {(t) => {
        const llega = sp(t, 11, 120, 0.9); // la balanza baja colgando desde arriba
        const caida = (k: number) => 1 - sp(f - m[k] + 8, 13, 170, 0.7); // 1 → 0 al apoyarse (aterriza ~8 cuadros después de la palabra)
        const golpe = (k: number) => sp(f - m[k], 5, 90, 1); // el brazo se pasa y vuelve (poco amortiguado)
        const ang = 15 * golpe(0) - 7 * golpe(1) - 6 * golpe(2) - 2 * golpe(3) + Math.sin(t * 0.09) * 0.6;
        const th = (ang * Math.PI) / 180, R = 400, CH = 250, PX = 960, PY = 330 - (1 - llega) * 700;
        const L = [PX - R * Math.cos(th), PY + R * Math.sin(th)], Rr = [PX + R * Math.cos(th), PY - R * Math.sin(th)];
        const pl = (c: number[]) => [c[0], c[1] + CH];
        const plato = (c: number[], et: string, k: string) => {
          const [cx, cy] = pl(c);
          return (
            <g key={k}>
              <path d={`M${c[0]} ${c[1]} L${cx - 118} ${cy} M${c[0]} ${c[1]} L${cx} ${cy - 4} M${c[0]} ${c[1]} L${cx + 118} ${cy}`} stroke="#5a4632" strokeWidth={4} strokeDasharray="10 6" />
              <path d={`M${cx - 135} ${cy} Q${cx} ${cy + 92} ${cx + 135} ${cy} Z`} fill="#d9a441" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
              <path d={`M${cx - 96} ${cy + 18} Q${cx - 40} ${cy + 46} ${cx + 10} ${cy + 44}`} fill="none" stroke="#ffe39a" strokeWidth={7} strokeLinecap="round" />
              <ellipse cx={cx} cy={cy} rx={135} ry={14} fill="#b8862c" stroke={M_} strokeWidth={5} />
              <g transform={`translate(${cx + 150},${cy + 30}) rotate(${Math.sin(t * 0.11 + cx) * 6})`}>
                <path d="M0 -40 V-6" stroke="#5a4632" strokeWidth={3} />
                <rect x={-50} y={-8} width={100} height={46} rx={6} fill="#f3e3bd" stroke={M_} strokeWidth={4} />
                <text y={26} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={36} fill={M_}>{et}</text>
              </g>
            </g>
          );
        };
        const [lx, ly] = pl(L), [rx_, ry_] = pl(Rr);
        const item = (k: number, x: number, y: number, el: React.ReactNode) => f < m[k] - 2 ? null : <g key={k} transform={`translate(${x},${y - caida(k) * 620}) rotate(${caida(k) * 40})`}>{el}</g>;
        const fin = sp(f - m[3] - 10, 9, 160, 0.7);
        return (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
             <g transform="translate(960,560) scale(1.25) translate(-960,-560)">
              <Sombra x={960} y={948} w={260} />
              <Sombra x={lx} y={948} w={150 - Math.max(0, ly - 600) * 0.1} o={0.2} />
              <Sombra x={rx_} y={948} w={150} o={0.2} />
              <g transform={`translate(0,${-(1 - llega) * 700})`}>
                <path d="M840 940 L1080 940 L1040 890 L880 890 Z" fill="#7a4a28" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
                <rect x={928} y={340} width={64} height={552} fill="#8a5a2e" stroke={M_} strokeWidth={6} />
                <path d="M944 360 V880" stroke="#b07a46" strokeWidth={6} />
              </g>
              <path d={`M${L[0]} ${L[1]} L${Rr[0]} ${Rr[1]}`} stroke={M_} strokeWidth={34} strokeLinecap="round" />
              <path d={`M${L[0]} ${L[1]} L${Rr[0]} ${Rr[1]}`} stroke="#9a6434" strokeWidth={22} strokeLinecap="round" />
              <path d={`M${L[0] + 10} ${L[1] - 4} L${Rr[0] - 10} ${Rr[1] - 4}`} stroke="#c8925a" strokeWidth={5} strokeLinecap="round" />
              {plato(L, "2026", "i")}
              {plato(Rr, "1348", "d")}
              <circle cx={PX} cy={PY} r={30} fill="#d9a441" stroke={M_} strokeWidth={6} />
              <circle cx={PX - 8} cy={PY - 8} r={8} fill="#ffe39a" />
              {/* la aguja que marca el equilibrio */}
              <path d={`M${PX} ${PY} L${PX + 120 * Math.sin(-th)} ${PY - 120 * Math.cos(th)}`} stroke={M_} strokeWidth={8} strokeLinecap="round" />
              {item(0, lx, ly - 34, <g transform="scale(0.85)"><DibujoIcono tipo="zapatilla" f={f} /></g>)}
              {item(1, rx_ - 55, ry_ - 30, <g><path d="M-74 -46 Q0 -70 74 -46 L96 28 Q0 50 -96 28 Z" fill="#7a4a28" stroke={M_} strokeWidth={6} strokeLinejoin="round" /><path d="M-36 -50 L-46 32 M10 -56 L8 38 M48 -48 L58 30" stroke="#5a3418" strokeWidth={5} /><path d="M-24 -62 Q0 -50 24 -62" fill="none" stroke="#d9a441" strokeWidth={8} /></g>)}
              {item(2, rx_ + 78, ry_ - 58, <g>{[-26, 26].map((d) => <path key={d} d={`M${d - 20} -64 h34 v58 h22 q10 0 10 12 v6 h-66 Z`} fill="#4a2e18" stroke={M_} strokeWidth={6} strokeLinejoin="round" />)}</g>)}
              {item(3, rx_ - 55, ry_ - 100, <g><ellipse rx={62} ry={22} fill="#6a4428" stroke={M_} strokeWidth={6} /><path d="M-56 -4 Q0 -48 56 -4" fill="#6a4428" stroke={M_} strokeWidth={6} /><circle cy={-30} r={8} fill="#6a4428" stroke={M_} strokeWidth={5} /></g>)}
             </g>
            </svg>
            {fin > 0 && <Txt x={960} y={150} t={trato} tam={120} color="#ffd23c" s={fin} rot={-4 + (1 - fin) * 12} />}
          </>
        );
      }}
    </Pieza>
  );
};

// ═══ 2 · b05 · LA LUPA SOBRE EL AGUA DEL RÍO: bichos nadando; la llama la hierve y revientan… casi todos ═══
const BICHOS = [[-170, -90, "#8bc34a"], [60, -150, "#cddc39"], [170, 10, "#9ccc65"], [-40, 40, "#aed581"], [-200, 110, "#c0ca33"], [110, 150, "#7cb342"], [-60, -210, "#d4e157"]] as const;
export const PLupa: React.FC<{ a: number; b: number; fuego: number; muere: number }> = ({ a, b, fuego, muere }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b} luz="255,214,150">
      {(t) => {
        const iris = sp(t, 14, 110, 0.9), CX = 960, CY = 470, R = 330 * iris;
        const calor = interpolate(f, [fuego, fuego + 40], [0, 1], cl);
        const llama = sp(f - fuego, 10, 140, 0.7);
        return (
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <defs><clipPath id="lupaC"><circle cx={CX} cy={CY} r={Math.max(1, R - 18)} /></clipPath>
              <radialGradient id="aguaR"><stop offset="0" stopColor="#8a8a48" /><stop offset="1" stopColor="#3e4422" /></radialGradient></defs>
            <Sombra x={CX + 40} y={990} w={300} o={0.3} />
            {/* la llama abajo: 3 lenguas lentas (≤2 Hz) */}
            {llama > 0 && <g transform={`translate(${CX},${960}) scale(${llama})`}>
              {[-90, 0, 90].map((d, i) => { const k = 1 + 0.1 * Math.sin(t * 0.35 + i * 2); return <g key={i} transform={`translate(${d},0) scale(${k},${k * (i === 1 ? 1.25 : 1)})`}>
                <path d="M-48 0 Q-60 -70 -10 -150 Q0 -90 30 -110 Q66 -60 48 0 Z" fill="#ff7a1c" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
                <path d="M-22 0 Q-30 -46 0 -90 Q22 -50 22 0 Z" fill="#ffd23c" /></g>; })}
            </g>}
            <g clipPath="url(#lupaC)">
              <circle cx={CX} cy={CY} r={340} fill="url(#aguaR)" />
              <circle cx={CX} cy={CY} r={340} fill={`rgba(255,120,40,${0.22 * calor})`} />
              {Array.from({ length: 22 }).map((_, i) => { const v = 2 + calor * 9, y = CY + 330 - (((t * v + i * 61) % 680)); return <circle key={i} cx={CX - 300 + ((i * 137) % 600)} cy={y} r={4 + (i % 5) * 3} fill="none" stroke="#e8f0c8" strokeWidth={3} opacity={0.25 + 0.6 * calor} />; })}
              {BICHOS.map(([bx, by, col], i) => {
                const vive = i === 3; // «casi todos»: uno se salva
                const dt = f - (muere + i * 4);
                const muerto = !vive && dt > 0;
                const sube = muerto ? interpolate(dt, [0, 14], [0, -60], cl) : 0, fad = muerto ? interpolate(dt, [6, 16], [1, 0], cl) : 1;
                const x = CX + bx + Math.sin(t * 0.09 + i) * 34, y = CY + by + Math.cos(t * 0.07 + i * 2) * 22 + sube;
                const cola = Math.sin(t * 0.5 + i) * 18;
                return (
                  <g key={i} transform={`translate(${x},${y}) rotate(${muerto ? 180 : Math.sin(t * 0.09 + i) * 20})`} opacity={fad}>
                    <path d={`M-38 0 Q-62 ${cola} -80 ${-cola}`} fill="none" stroke={M_} strokeWidth={6} strokeLinecap="round" />
                    <ellipse rx={42} ry={26} fill={col} stroke={M_} strokeWidth={6} />
                    {[-1, 1].map((s) => <path key={s} d={`M${s * 14 - 10} 20 l-6 14 M${s * 14 + 6} 20 l4 14`} stroke={M_} strokeWidth={4} />)}
                    {muerto ? [8, 26].map((ex) => <path key={ex} d={`M${ex - 7} -15 l14 14 M${ex + 7} -15 l-14 14`} stroke={M_} strokeWidth={5} strokeLinecap="round" />)
                      : [8, 26].map((ex) => <g key={ex}><circle cx={ex} cy={-8} r={9} fill="#fff" stroke={M_} strokeWidth={3} /><circle cx={ex + 2} cy={-8} r={4} fill={M_} /></g>)}
                    {vive && calor > 0.5 && <path d="M40 -30 q8 -14 0 -26 q-8 12 0 26" fill="#7fc8f8" stroke={M_} strokeWidth={3} />}
                    {muerto && dt < 10 && <circle r={40 + dt * 7} fill="none" stroke="#fff6e6" strokeWidth={5} opacity={1 - dt / 10} />}
                  </g>
                );
              })}
            </g>
            {/* el aro de bronce, el reflejo del vidrio y el mango */}
            <path d={`M${CX + R * 0.7} ${CY + R * 0.7} L${CX + R * 0.7 + 190 * iris} ${CY + R * 0.7 + 190 * iris}`} stroke={M_} strokeWidth={62} strokeLinecap="round" />
            <path d={`M${CX + R * 0.7} ${CY + R * 0.7} L${CX + R * 0.7 + 190 * iris} ${CY + R * 0.7 + 190 * iris}`} stroke="#7a4a28" strokeWidth={46} strokeLinecap="round" />
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={M_} strokeWidth={46} />
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#d9a441" strokeWidth={32} />
            <circle cx={CX} cy={CY} r={R - 6} fill="none" stroke="#ffe39a" strokeWidth={5} strokeDasharray={`${R * 1.1} ${R * 9}`} transform={`rotate(200 ${CX} ${CY})`} />
            <path d={`M${CX - R * 0.62} ${CY - R * 0.2} Q${CX - R * 0.55} ${CY - R * 0.62} ${CX - R * 0.18} ${CY - R * 0.66}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={16} strokeLinecap="round" />
          </svg>
        );
      }}
    </Pieza>
  );
};

// ═══ 3 · b07 · EL MAPA QUE SE DESENROLLA: la ruta punteada del barco desde Francia hasta Londres y la mancha roja que se abre ═══
const bez = (p: number[][], u: number) => { const v = 1 - u; return [0, 1].map((k) => v * v * v * p[0][k] + 3 * v * v * u * p[1][k] + 3 * v * u * u * p[2][k] + u * u * u * p[3][k]); };
const RUTA = [[[470, 640], [700, 470], [1000, 480], [1290, 330]], [[1290, 330], [1210, 270], [1130, 250], [1050, 238]]];
const RUTA_P = [...Array.from({ length: 40 }, (_, i) => bez(RUTA[0], i / 39)), ...Array.from({ length: 20 }, (_, i) => bez(RUTA[1], (i + 1) / 20))];
export const PMapa: React.FC<{ a: number; b: number; llega: number; muerte: number; londres: string; francia: string }> = ({ a, b, llega, muerte, londres, francia }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b} luz="255,220,170">
      {(t) => {
        const abre = interpolate(t, [2, 22], [0, 1], { ...cl, easing: ei }), W = 160 + 1340 * abre, H = 800;
        const ruta = interpolate(f, [a + 18, llega], [0, 1], { ...cl, easing: ei });
        const n = Math.max(1, Math.round(ruta * (RUTA_P.length - 1)));
        const pts = RUTA_P.slice(0, n + 1), cab = pts[pts.length - 1], prev = pts[Math.max(0, pts.length - 2)];
        const rumbo = Math.atan2(cab[1] - prev[1], cab[0] - prev[0]);
        const mancha = (k: number) => sp(f - muerte - k * 3, 16, 60, 1.2);
        const cuerda = sp(t, 12, 140, 0.8);
        return (
          <div style={{ position: "absolute", left: 960 - W / 2, top: 140 + (1 - cuerda) * 90, width: W, height: H }}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(170deg,#f3e2b8,#e3c690 60%,#d8b678)", border: `6px solid ${M_}`, borderRadius: 8, boxShadow: "0 30px 40px rgba(20,10,4,0.45)" }}>
              <svg width={1500} height={H} style={{ position: "absolute", left: (W - 1500) / 2 }}>
                <rect width={1500} height={H} fill="#a9c6bc" opacity={0.75} />
                {[0, 1, 2, 3].map((i) => <path key={i} d={`M${200 + i * 260} ${420 + (i % 2) * 70} q30 -14 60 0 t60 0`} fill="none" stroke="#6f9a90" strokeWidth={4} />)}
                {/* Inglaterra (arriba) con la boca del Támesis, Francia (abajo) */}
                <path d="M0 0 H1500 V250 Q1440 300 1380 286 Q1320 300 1300 330 Q1240 300 1180 262 L1130 252 Q1110 290 1060 300 Q980 330 900 316 Q820 350 700 340 Q600 368 480 350 Q380 380 260 360 Q150 380 0 350 Z" fill="#e6cf98" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
                <path d="M0 800 V600 Q120 590 240 620 Q330 640 420 620 Q520 600 600 632 Q720 590 860 610 Q1000 640 1120 600 Q1260 580 1500 620 V800 Z" fill="#dcc08a" stroke={M_} strokeWidth={6} strokeLinejoin="round" />
                <path d="M1050 238 Q1120 244 1180 262" fill="none" stroke="#6f9a90" strokeWidth={10} strokeLinecap="round" />
                {/* la mancha que entra a Londres: tinta roja que se abre en borbotones */}
                {[[0, 0, 120], [60, -30, 90], [-70, 20, 100], [20, 70, 80], [-30, -60, 70], [110, 40, 70], [-120, -40, 60], [70, 90, 50]].map(([dx, dy, r], k) => <circle key={k} cx={1050 + dx * 1.4} cy={262 + dy} r={r * 1.1 * mancha(k)} fill="#a8201a" opacity={0.82} />)}
                {/* Londres: la torre con su bandera */}
                <g transform="translate(1050,232)"><rect x={-26} y={-70} width={52} height={70} fill="#c8b48a" stroke={M_} strokeWidth={5} /><path d="M-30 -70 h60 v-14 h-12 v8 h-12 v-8 h-12 v8 h-12 v-8 h-12 Z" fill="#c8b48a" stroke={M_} strokeWidth={4} /><path d="M0 -84 V-120 l26 8 -26 8" fill="#c8392b" stroke={M_} strokeWidth={4} /></g>
                <text x={1050} y={120} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={60} fill={M_} stroke="#f3e2b8" strokeWidth={10} paintOrder="stroke">{londres}</text>
                <text x={380} y={730} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={60} fill={M_}>{francia}</text>
                {/* la rosa de los vientos */}
                <g transform={`translate(170,520) rotate(${Math.sin(t * 0.03) * 4})`}><path d="M0 -70 L12 -12 L70 0 L12 12 L0 70 L-12 12 L-70 0 L-12 -12 Z" fill="#f3e2b8" stroke={M_} strokeWidth={4} /><path d="M0 -70 L12 -12 L0 0 Z M70 0 L12 12 L0 0 Z M0 70 L-12 12 L0 0 Z M-70 0 L-12 -12 L0 0 Z" fill="#9a6434" /><text y={-82} textAnchor="middle" fontFamily={F_MANO} fontWeight={700} fontSize={34} fill={M_}>N</text></g>
                <path d={pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ")} fill="none" stroke={M_} strokeWidth={7} strokeDasharray="18 14" strokeLinecap="round" />
                {ruta > 0 && <g transform={`translate(${cab[0]},${cab[1] - 26}) rotate(${(rumbo * 180) / Math.PI * 0.25}) scale(${(Math.cos(rumbo) < 0 ? -1 : 1) * 0.42},0.42)`}><DibujoIcono tipo="barco" f={f} /></g>}
                {/* las ratas bajando por la cuerda: tres puntitos negros que siguen la ruta */}
                {ruta >= 1 && [1, 2, 3].map((k) => { const p = RUTA_P[Math.max(0, RUTA_P.length - 1 - k * 3 + Math.floor(((f - llega) * 0.2) % 3))]; return <g key={k} transform={`translate(${p[0]},${p[1]})`}><ellipse rx={13} ry={8} fill="#2a2024" /><path d="M-12 0 q-14 4 -20 -6" fill="none" stroke="#2a2024" strokeWidth={3} /></g>; })}
              </svg>
            </div>
            {/* los rollos del pergamino a los costados */}
            {[-1, 1].map((s) => <div key={s} style={{ position: "absolute", top: -22, height: H + 44, width: 64, [s < 0 ? "left" : "right"]: -40, borderRadius: 32, border: `6px solid ${M_}`, background: "linear-gradient(90deg,#b8925a,#f3e2b8 45%,#c8a46a 70%,#8a6a3a)" }} />)}
          </div>
        );
      }}
    </Pieza>
  );
};

// ═══ 4 · b09 · LA RUEDA DE LA FORTUNA DE LOS REMEDIOS: entra rodando, gira chocando las clavijas y frena en «?» ═══
const GAJOS: TipoIcono[] = ["flor", "sangre", "olor", "cruz", "gato", "pregunta"];
export const PRueda: React.FC<{ a: number; b: number; para: number; remedios: string }> = ({ a, b, para, remedios }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b} luz="255,210,160">
      {(t) => {
        const CX = 960, CY = 560, R = 320;
        const u = interpolate(f, [a, para], [0, 1], cl);
        const th = 1140 * (1 - (1 - u) ** 3); // termina con el «?» (gajo 5) bajo la flecha
        const entra = sp(t, 14, 90, 1), x = CX + (1 - entra) * 1100;
        const fr = ((th % 30) + 30) % 30 / 30, flap = u < 1 ? -24 * Math.max(0, 1 - fr * 3) : 0;
        const gana = sp(f - para, 8, 170, 0.6);
        return (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              <Sombra x={x} y={985} w={330} />
              <path d={`M${x - 250} 990 L${x} ${CY} L${x + 250} 990`} fill="none" stroke={M_} strokeWidth={40} strokeLinejoin="round" />
              <path d={`M${x - 250} 990 L${x} ${CY} L${x + 250} 990`} fill="none" stroke="#7a4a28" strokeWidth={26} strokeLinejoin="round" />
              <g transform={`translate(${x},${CY}) rotate(${th - (1 - entra) * 220})`}>
                <circle r={R + 26} fill="#7a4a28" stroke={M_} strokeWidth={8} />
                {GAJOS.map((g, k) => {
                  const a0 = ((k * 60 - 30 - 90) * Math.PI) / 180, a1 = ((k * 60 + 30 - 90) * Math.PI) / 180;
                  const am = ((k * 60 - 90) * Math.PI) / 180, brilla = k === 5 ? gana : 0;
                  return (
                    <g key={k}>
                      <path d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill={k % 2 ? "#f1e2bf" : "#c8392b"} stroke={M_} strokeWidth={6} />
                      {brilla > 0 && <path d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`} fill={`rgba(255,226,120,${0.55 * brilla})`} />}
                      <g transform={`translate(${210 * Math.cos(am)},${210 * Math.sin(am)}) rotate(${k * 60}) scale(${0.46 * (1 + 0.25 * brilla)})`}><DibujoIcono tipo={g} f={f} /></g>
                    </g>
                  );
                })}
                {Array.from({ length: 12 }).map((_, k) => <circle key={k} cx={(R + 12) * Math.cos((k * 30 * Math.PI) / 180)} cy={(R + 12) * Math.sin((k * 30 * Math.PI) / 180)} r={10} fill="#d9a441" stroke={M_} strokeWidth={4} />)}
                <circle r={50} fill="#d9a441" stroke={M_} strokeWidth={7} /><circle cx={-12} cy={-12} r={12} fill="#ffe39a" />
              </g>
              {/* la lengüeta de cuero que golpean las clavijas */}
              <g transform={`translate(${x},${CY - R - 46}) rotate(${flap})`}><path d="M-30 -40 L30 -40 L0 50 Z" fill="#5a3418" stroke={M_} strokeWidth={6} strokeLinejoin="round" /><circle cy={-26} r={9} fill="#d9a441" stroke={M_} strokeWidth={4} /></g>
            </svg>
            <Txt x={960} y={1010} t={remedios} tam={84} color="#ffd23c" s={sp(t - 8, 11, 150)} />
          </>
        );
      }}
    </Pieza>
  );
};

// ═══ 5 · b11 · EL RELOJ DE ARENA DE CRUCES: entra dándose vuelta; en vez de arena caen cruces, y en «cientos» el chorro se desata ═══
export const PReloj: React.FC<{ a: number; b: number; cientos: number; rot: string }> = ({ a, b, cientos, rot }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b} luz="210,220,255">
      {(t) => {
        const vuelta = sp(t, 9, 110, 1), CX = 960, CY = 540;
        const caidas: number[] = []; // cuadro (relativo) en que sale cada cruz
        for (let s = 6, k = 0; s < t + 1 && k < 400; k++) { caidas.push(s); s += a + s < cientos ? 5 : 1.2; }
        const N = caidas.filter((s) => t - s > 16).length;
        const pila = Math.min(150, 14 + N * 2.4), arriba = Math.max(30, 190 - N * 2.2);
        const cruz = (x: number, y: number, k: number, s = 1) => <path key={k} d={`M${x - 9 * s} ${y} h${18 * s} M${x} ${y - 12 * s} v${26 * s}`} stroke="#8a1f1a" strokeWidth={6 * s} strokeLinecap="round" />;
        return (
          <>
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              <Sombra x={CX} y={930} w={260} />
              <g transform={`translate(0,${(1 - Math.min(1, vuelta)) * -500}) rotate(${(1 - vuelta) * 180} ${CX} ${CY})`}>
                <defs><clipPath id="vidrioA"><path d={`M${CX - 170} 200 H${CX + 170} Q${CX + 170} 430 ${CX + 18} 538 Q${CX + 170} 650 ${CX + 170} 880 H${CX - 170} Q${CX - 170} 650 ${CX - 18} 538 Q${CX - 170} 430 ${CX - 170} 200 Z`} /></clipPath></defs>
                <path d={`M${CX - 170} 200 H${CX + 170} Q${CX + 170} 430 ${CX + 18} 538 Q${CX + 170} 650 ${CX + 170} 880 H${CX - 170} Q${CX - 170} 650 ${CX - 18} 538 Q${CX - 170} 430 ${CX - 170} 200 Z`} fill="rgba(220,236,255,0.28)" stroke={M_} strokeWidth={7} />
                <g clipPath="url(#vidrioA)">
                  {/* arriba: la montaña que baja */}
                  <path d={`M${CX - 170} ${530 - arriba} Q${CX} ${500 - arriba - 30} ${CX + 170} ${530 - arriba} L${CX + 170} 560 L${CX - 170} 560 Z`} fill="#e9d6b0" />
                  {Array.from({ length: 30 }).map((_, k) => { const y = 520 - (k % 6) * 30, x = CX - 120 + ((k * 53) % 240); return y > 530 - arriba ? cruz(x, y, 1000 + k, 0.8) : null; })}
                  {/* abajo: la pila que crece */}
                  <path d={`M${CX - 170} 880 L${CX - 170} ${880 - pila * 0.5} Q${CX} ${880 - pila * 1.5} ${CX + 170} ${880 - pila * 0.5} L${CX + 170} 880 Z`} fill="#e9d6b0" />
                  {Array.from({ length: Math.min(40, Math.floor(N / 2)) }).map((_, k) => cruz(CX - 130 + ((k * 71) % 260), 870 - ((k * 37) % Math.max(10, pila * 0.9)), 2000 + k, 0.8))}
                  {caidas.map((s, k) => { const e = t - s; if (e < 0 || e > 16) return null; const y = 545 + (e / 16) ** 1.6 * (330 - pila); return cruz(CX + Math.sin(k * 2.3) * 8, y, k, 0.9); })}
                </g>
                <path d={`M${CX - 120} 230 Q${CX - 150} 380 ${CX - 60} 470`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={10} strokeLinecap="round" />
                {[170, 880].map((y) => <rect key={y} x={CX - 220} y={y - (y < 500 ? 0 : 30)} width={440} height={34} rx={10} fill="#8a5a2e" stroke={M_} strokeWidth={7} />)}
                {[-205, 205].map((d) => <rect key={d} x={CX + d - 12} y={196} width={24} height={688} fill="#7a4a28" stroke={M_} strokeWidth={6} />)}
              </g>
            </svg>
            <Txt x={1500} y={540} t={rot} tam={96} color="#ffd23c" s={sp(f - cientos, 10, 160)} rot={-6} />
          </>
        );
      }}
    </Pieza>
  );
};

// ═══ 6 · b12 · LA CADENA DEL RUMOR: caras en fila hacia el fondo; cada una le pasa el hilo rojo a la siguiente y, todas a la vez, miran a Tiza ═══
const CARAS = [["#4a2a6a", "boina"], ["#e8b830", "paja"], ["#3a8a3a", "gorro"], ["#7a4a28", "capucha"], ["#2a5a8a", "boina"], ["#f4efe4", "cofia"]] as const;
export const PRumor: React.FC<{ a: number; b: number; todos: number }> = ({ a, b, todos }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b} luz="255,190,160">
      {(t) => {
        const T0 = [960, 610], paso = Math.max(4, (todos - a - 6) / CARAS.length);
        const pos = CARAS.map((_, i) => { const k = i / (CARAS.length - 1); return [260 + k * 1000 + Math.sin(k * 3) * 40, 420 + Math.sin(k * 2.6 + 0.4) * 120, 0.55 + k * 0.4]; });
        const giro = sp(f - todos, 10, 170, 0.6);
        const tiza = [1620, 640];
        return (
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {pos.slice(0, -1).map((p, i) => { const q = pos[i + 1], u = interpolate(t, [6 + (i + 1) * paso - paso * 0.8, 6 + (i + 1) * paso], [0, 1], { ...cl, easing: eo }); if (u <= 0) return null; const mx = (p[0] + q[0]) / 2, my = Math.min(p[1], q[1]) - 90; return <path key={i} d={`M${p[0]} ${p[1] - 30} Q${mx} ${my} ${p[0] + (q[0] - p[0]) * u} ${p[1] - 30 + (q[1] - p[1]) * u - Math.sin(u * Math.PI) * 60}`} fill="none" stroke="#e8352a" strokeWidth={7} strokeDasharray="4 10" strokeLinecap="round" />; })}
            {giro > 0 && pos.map((p, i) => { const dx = tiza[0] - p[0], dy = tiza[1] - p[1], d = Math.hypot(dx, dy), L = 70 * p[2] * giro; return <g key={`b${i}`} stroke={M_} strokeWidth={9 * p[2]} strokeLinecap="round"><path d={`M${p[0] + (dx / d) * 50 * p[2]} ${p[1] + 40 * p[2]} l${(dx / d) * L} ${(dy / d) * L}`} /><circle cx={p[0] + (dx / d) * (50 * p[2] + L)} cy={p[1] + 40 * p[2] + (dy / d) * L} r={11 * p[2]} fill="#f1ece2" strokeWidth={4} /></g>; })}
            {CARAS.map(([col, som], i) => {
              const [x, y, s] = pos[i];
              const on = sp(t - 6 - i * paso, 9, 170, 0.6), entra = sp(t - i * 2, 12, 150);
              if (entra <= 0) return null;
              const mira = giro > 0 ? [Math.sign(tiza[0] - x) * 6 * giro, 2] : [Math.sin(t * 0.1 + i) * 4, 0];
              return (
                <g key={i} transform={`translate(${x},${y + (1 - entra) * 300}) scale(${s * (1 + 0.12 * on)})`}>
                  {on > 0 && <circle r={96} fill={`rgba(232,53,42,${0.32 * on})`} />}
                  <path d="M-46 66 Q0 46 46 66 L58 130 H-58 Z" fill={col} stroke={M_} strokeWidth={6} />
                  <circle r={64} fill="#f1ece2" stroke={M_} strokeWidth={6} />
                  {som === "boina" && <ellipse cy={-52} rx={70} ry={22} fill={col} stroke={M_} strokeWidth={6} />}
                  {som === "paja" && <g><ellipse cy={-40} rx={96} ry={16} fill={col} stroke={M_} strokeWidth={6} /><rect x={-42} y={-80} width={84} height={42} rx={10} fill={col} stroke={M_} strokeWidth={6} /></g>}
                  {som === "gorro" && <path d="M-60 -36 Q0 -110 60 -36 Z" fill={col} stroke={M_} strokeWidth={6} />}
                  {som === "capucha" && <path d="M-74 40 Q-84 -84 0 -84 Q84 -84 74 40 L56 30 Q60 -50 0 -54 Q-60 -50 -56 30 Z" fill={col} stroke={M_} strokeWidth={6} />}
                  {som === "cofia" && <path d="M-68 -10 Q-70 -84 0 -86 Q70 -84 68 -10 Q40 -50 0 -50 Q-40 -50 -68 -10 Z" fill={col} stroke={M_} strokeWidth={6} />}
                  {[-22, 22].map((ex) => <g key={ex}><ellipse cx={ex} cy={-2} rx={13} ry={15} fill="#fff" stroke={M_} strokeWidth={4} /><circle cx={ex + mira[0]} cy={mira[1]} r={6} fill={M_} /></g>)}
                  <path d={`M-36 ${-26 + on * 4} L-10 ${-20 + on * 10} M36 ${-26 + on * 4} L10 ${-20 + on * 10}`} stroke={M_} strokeWidth={6} strokeLinecap="round" />
                  <ellipse cy={34} rx={14 + on * 4} ry={4 + on * 10} fill="#5a1a14" stroke={M_} strokeWidth={4} />
                </g>
              );
            })}
            {/* Tiza al frente a la derecha: traga saliva */}
            {(() => { const e = sp(t - 4, 12, 140), g = giro > 0 ? 1 + Math.sin(Math.min(1, (f - todos) / 10) * Math.PI) * 0.1 : 1; return (
              <g transform={`translate(${tiza[0] + (1 - e) * 400},${tiza[1]}) scale(${1.25 * g},${1.25 / g})`}>
                <path d="M-40 70 V200 M40 70 V200" stroke={M_} strokeWidth={34} strokeLinecap="round" /><path d="M-40 70 V200 M40 70 V200" stroke="#f1ece2" strokeWidth={22} strokeLinecap="round" />
                <circle r={72} fill="#f1ece2" stroke={M_} strokeWidth={6} />
                <ellipse cx={-6} cy={-58} rx={78} ry={24} fill="#6a4428" stroke={M_} strokeWidth={6} />
                {[-22, 22].map((ex) => <g key={ex}><ellipse cx={ex} cy={0} rx={15} ry={19} fill="#fff" stroke={M_} strokeWidth={4} /><circle cx={ex - 5 * giro} cy={2} r={6} fill={M_} /></g>)}
                <path d="M-16 40 Q0 30 16 40" fill="none" stroke={M_} strokeWidth={5} strokeLinecap="round" />
                {giro > 0 && <path d={`M62 -30 q14 -22 0 -40 q-14 18 0 40`} fill="#7fc8f8" stroke={M_} strokeWidth={4} transform={`translate(0,${Math.min(30, (f - todos) * 2)})`} />}
              </g>
            ); })()}
          </svg>
        );
      }}
    </Pieza>
  );
};

// ═══ 7 · b14 · EL CUADERNO DE VIAJE: se abre, sello de Londres; la hoja gira y aparece el barco vikingo que se dibuja solo, sello «AÑO 900» y 40 rayitas ═══
export const PCuaderno: React.FC<{ a: number; b: number; hoja: number; sello: number; cuarenta: number; tx: { londres: string; dias: string; anio: string } }> = ({ a, b, hoja, sello, cuarenta, tx }) => {
  const f = useF();
  return (
    <Pieza a={a} b={b} luz="255,226,170">
      {(t) => {
        const sube = sp(t, 13, 120, 0.9), tapa = interpolate(t, [10, 28], [0, -180], { ...cl, easing: ei });
        const gira = interpolate(f, [hoja, hoja + 20], [0, -180], { ...cl, easing: ei });
        const sl = sp(t - 30, 9, 200, 0.6), s9 = sp(f - sello, 9, 200, 0.6);
        const dib = interpolate(f, [hoja + 14, sello], [0, 1], cl);
        const rayas = Math.round(interpolate(f, [cuarenta, cuarenta + 24], [0, 40], cl));
        const W = 600, H = 760, X0 = 960, Y0 = 160 + (1 - sube) * 900;
        const papel: React.CSSProperties = { position: "absolute", top: 0, width: W, height: H, background: "linear-gradient(90deg,#e8d3a4,#f4e5c2 12%,#f4e5c2 88%,#e3cc98)", border: `5px solid ${M_}`, boxSizing: "border-box" };
        return (
          <div style={{ position: "absolute", left: X0 - W, top: Y0, width: W * 2, height: H, perspective: 2200 }}>
            <div style={{ position: "absolute", left: -22, top: -18, width: W * 2 + 44, height: H + 36, background: "#6a3a1c", border: `6px solid ${M_}`, borderRadius: 18, boxShadow: "0 40px 50px rgba(20,10,4,0.5)" }} />
            {/* página izquierda: Londres 1348, sobrevivido */}
            <div style={{ ...papel, left: 0 }}>
              <svg width={W} height={H} style={{ position: "absolute" }}>
                <g transform="translate(300,330) scale(1.4)"><rect x={-60} y={-90} width={120} height={150} fill="#d8c49a" stroke={M_} strokeWidth={4} /><path d="M-68 -90 h136 v-22 h-17 v12 h-17 v-12 h-17 v12 h-17 v-12 h-17 v12 h-17 v-12 h-17 v12 h-17 Z" fill="#d8c49a" stroke={M_} strokeWidth={4} /><path d="M-24 60 v-46 q24 -26 48 0 v46" fill="#6a4428" stroke={M_} strokeWidth={4} /><path d="M0 -112 v-50 l40 12 -40 12" fill="#c8392b" stroke={M_} strokeWidth={4} /></g>
              </svg>
              {sl > 0 && <div style={{ position: "absolute", left: W / 2, top: 560, transform: `translate(-50%,-50%) rotate(${-12 + (1 - sl) * 20}deg) scale(${2.4 - 1.4 * sl})`, opacity: Math.min(1, sl * 1.5), border: "8px solid #c0281e", borderRadius: 22, padding: "10px 26px", color: "#c0281e", fontFamily: F_MANO, fontWeight: 700, fontSize: 64, lineHeight: 1, textAlign: "center", whiteSpace: "pre" }}>{`${tx.londres}\n${tx.dias} ✓`}</div>}
            </div>
            {/* página derecha: el barco vikingo que se dibuja solo */}
            <div style={{ ...papel, left: W }}>
              <svg width={W} height={H} style={{ position: "absolute" }}>
                <g transform="translate(300,430) scale(0.92)" fill="none" stroke={M_} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M-240 40 Q0 150 240 40 Q250 -40 210 -110 Q240 -150 200 -170 Q170 -150 190 -110 Q190 -10 -190 30 Q-260 -60 -220 -120" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - dib} fill={dib > 0.9 ? "#9a6434" : "none"} />
                  <path d="M0 30 V-260" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, dib * 1.4)} />
                  {dib > 0.5 && <path d="M-130 -230 H130 L110 -40 H-110 Z" fill="#f4efe4" opacity={Math.min(1, (dib - 0.5) * 3)} />}
                  {dib > 0.6 && [-1, 0, 1].map((k) => <path key={k} d={`M${-120 + 20} ${-200 + 0} H${120 - 20}`} transform={`translate(0,${(k + 1) * 50})`} stroke="#c8392b" strokeWidth={22} opacity={Math.min(1, (dib - 0.6) * 3)} />)}
                  {[-150, -90, -30, 30, 90, 150].map((x, k) => dib > 0.7 + k * 0.04 ? <circle key={x} cx={x} cy={52 - Math.abs(x) * 0.18} r={22} fill={k % 2 ? "#d9a441" : "#c8392b"} /> : null)}
                </g>
                <g>{Array.from({ length: rayas }).map((_, k) => { const gx = 70 + Math.floor(k / 5) * 60, x = gx + (k % 5) * 9; return k % 5 === 4 ? <path key={k} d={`M${gx - 6} 668 L${gx + 44} 618`} stroke={M_} strokeWidth={5} strokeLinecap="round" /> : <path key={k} d={`M${x} 610 V676`} stroke={M_} strokeWidth={5} strokeLinecap="round" />; })}</g>
              </svg>
              {s9 > 0 && <div style={{ position: "absolute", left: W / 2, top: 92, whiteSpace: "nowrap", transform: `translate(-50%,-50%) rotate(${8 - (1 - s9) * 16}deg) scale(${2.4 - 1.4 * s9})`, opacity: Math.min(1, s9 * 1.5), border: "8px solid #c0281e", borderRadius: 22, padding: "8px 28px", color: "#c0281e", fontFamily: F_MANO, fontWeight: 700, fontSize: 72, lineHeight: 1 }}>{tx.anio}</div>}
            </div>
            {/* la hoja que gira (con un «?» grande) y la tapa de cuero */}
            {gira > -179 && <div style={{ ...papel, left: W, transformOrigin: "left center", transform: `rotateY(${gira}deg)`, backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: gira < -2 ? "-20px 0 40px rgba(20,10,4,0.3)" : undefined }}><span style={{ ...rotulo(300, "#c8a46a") }}>?</span></div>}
            {tapa > -179 && <div style={{ position: "absolute", left: W - 4, top: -18, width: W + 26, height: H + 36, transformOrigin: "left center", transform: `rotateY(${tapa}deg)`, backfaceVisibility: "hidden", background: "linear-gradient(120deg,#7a4424,#5a2e14)", border: `6px solid ${M_}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ ...rotulo(110, "#d9a441") }}>✦</span></div>}
          </div>
        );
      }}
    </Pieza>
  );
};
