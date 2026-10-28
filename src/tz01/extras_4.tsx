// tz01 · vuelta estructural 28-oct: piezas nuevas (mundo y pantalla) para re-animar las escenas que estaban <8.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { Halo } from "../anikit/luz";
import { EXPRESIONES } from "../anikit/personaje";
import { ACENTO, ORO } from "../tenzo/elenco";
import { PrincipeAsoma } from "./extras_3b";
import { FarolMano } from "../tenzo/utileria";
import { lerp } from "./extras";

const TINTA = "#221c18";
const PIEL_T = "#f2bf8f";

// ojos cerrados (párpado entero): se agrega SÓLO en el bundle de tz01, sin tocar el kit común
export const DORMIDO = (() => {
  const E0 = EXPRESIONES.cansado;
  if (!(EXPRESIONES as Record<string, unknown>).dormido) (EXPRESIONES as Record<string, typeof E0>).dormido = { ...E0, parpado: 1, ceja: -4, cejaY: 3, bocaC: -0.5 };
  return "dormido";
})();

// ---------- reloj de pared (MUNDO): 3:20, el segundero corre ----------
export const RelojPared: React.FC<{ x: number; y: number; r?: number; h?: number; m?: number }> = ({ x, y, r = 46, h = 3, m = 20 }) => {
  const f = useF();
  const seg = (f * 6) % 360;
  const am = m * 6, ah = (h % 12) * 30 + m * 0.5;
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={-r - 30} x2={0} y2={-r} stroke="#3a3f48" strokeWidth={3} />
      <circle r={r + 6} fill="#2c3038" />
      <circle r={r} fill="#e9e4da" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-1.6} y={-r + 4} width={3.2} height={i % 3 ? 6 : 11} fill="#3a3f48" transform={`rotate(${i * 30})`} />)}
      <rect x={-3} y={-r * 0.55} width={6} height={r * 0.6} rx={3} fill={TINTA} transform={`rotate(${ah})`} />
      <rect x={-2.2} y={-r * 0.82} width={4.4} height={r * 0.86} rx={2} fill={TINTA} transform={`rotate(${am})`} />
      <rect x={-1} y={-r * 0.86} width={2} height={r * 0.96} fill={ACENTO} transform={`rotate(${seg})`} />
      <circle r={4} fill={ACENTO} />
    </g>
  );
};

// ---------- tubo fluorescente que titila, colgado del techo (MUNDO) ----------
export const TuboTitila: React.FC<{ x: number; y: number; w?: number; on: number }> = ({ x, y, w = 260, on }) => (
  <g>
    <line x1={x - w * 0.35} y1={y - 120} x2={x - w * 0.35} y2={y} stroke="#4a505a" strokeWidth={3} />
    <line x1={x + w * 0.35} y1={y - 120} x2={x + w * 0.35} y2={y} stroke="#4a505a" strokeWidth={3} />
    <rect x={x - w / 2 - 8} y={y - 6} width={w + 16} height={22} rx={6} fill="#3a3f48" />
    <rect x={x - w / 2} y={y + 10} width={w} height={12} rx={6} fill={on > 0.5 ? "#f4fbff" : "#8a9099"} />
    <Halo x={x} y={y + 30} r={260} color="#e8f4ff" fuerza={0.45 * on} />
  </g>
);

// ---------- LA OLA en el MUNDO: pantalla opaca colgada sobre las máquinas, curva naranja plena, rótulos grandes ----------
export const OlaMundo: React.FC<{ x: number; y: number; w: number; h: number; p: number; seg: number; titulo: string }> = ({ x, y, w, h, p, seg, titulo }) => {
  const X0 = x + 90, Y0 = y + h - 96, W = w - 180, H = h - 196;
  const curva = (u: number) => Math.exp(-Math.pow((u - 0.45) / 0.2, 2));
  const n = 80, k = Math.max(2, Math.round(n * Math.max(0.06, p)));
  const pts = Array.from({ length: k }).map((_, i) => `${X0 + (i / n) * W},${Y0 - curva(i / n) * H}`);
  const u = (k - 1) / n, px = X0 + u * W, py = Y0 - curva(u) * H;
  return (
    <g>
      <rect x={x + 8} y={y + 12} width={w} height={h} rx={26} fill="#000" opacity={0.35} />
      <rect x={x} y={y} width={w} height={h} rx={26} fill="#101217" stroke="#4a505a" strokeWidth={5} />
      <text x={x + 44} y={y + 74} fontFamily={F_HUD} fontWeight={700} fontSize={50} fill="#ffe2a6" letterSpacing={2}>{titulo}</text>
      <text x={x + w - 44} y={y + 74} fontFamily={F_HUD} fontWeight={700} fontSize={56} fill="#f4efe6" textAnchor="end" style={{ fontVariantNumeric: "tabular-nums" }}>{Math.floor(seg / 60)}:{String(seg % 60).padStart(2, "0")}</text>
      <line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke="#8a909a" strokeWidth={5} />
      {[0, 30, 60, 90].map((t) => { const tx = X0 + (t / 90) * W * 0.92; return <g key={t}><line x1={tx} y1={Y0} x2={tx} y2={Y0 + 18} stroke="#8a909a" strokeWidth={5} /><text x={tx} y={Y0 + 70} fill="#d8dce2" fontFamily={F_HUD} fontWeight={600} fontSize={48} textAnchor="middle">{t}s</text></g>; })}
      <polyline points={pts.join(" ")} fill="none" stroke="#ff7a2b" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={px} cy={py} r={46} fill="#ff7a2b" opacity={0.3} />
      <circle cx={px} cy={py} r={22} fill="#ff7a2b" />
    </g>
  );
};

// ---------- INSERTO: la hoja de palma con los versos; la mano vieja escribe; su cara en el círculo de la esquina ----------
const VERSOS = ["My hair was black as bees,", "curled at the tips.", "Now, with age,", "it is white like hemp."];
export const PapelVersos: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF() - desde;
  const total = VERSOS.join("").length;
  const n = Math.max(0, f * 1.15); // letras escritas
  let acc = 0;
  // la punta del estilete sigue a la última letra escrita
  let li = 0, lc = 0;
  for (let i = 0; i < VERSOS.length; i++) { if (n <= acc + VERSOS[i].length) { li = i; lc = n - acc; break; } acc += VERSOS[i].length; li = i; lc = VERSOS[i].length; }
  const tx = 470 + Math.min(lc, VERSOS[li].length) * 25.5, ty = 430 + li * 110;
  const cara = n >= total - 6 ? 1 : 0; // al terminar, sonríe
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 45% 50%, #f0c483, #b9773c 80%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* hoja de palma: larga, con los dos agujeros del cordel */}
        <g transform="rotate(-3 960 560)">
          <rect x={360} y={300} width={1240} height={520} rx={40} fill="#e9d29a" stroke="#8a6a3a" strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((k) => <line key={k} x1={400} y1={390 + k * 110} x2={1560} y2={390 + k * 110} stroke="#d2b678" strokeWidth={3} />)}
          <circle cx={520} cy={330} r={14} fill="#b9773c" /><circle cx={1440} cy={330} r={14} fill="#b9773c" />
          {VERSOS.map((v, i) => {
            const antes = VERSOS.slice(0, i).join("").length;
            const vis = Math.max(0, Math.min(v.length, n - antes));
            return <text key={i} x={470} y={430 + i * 110} fontFamily="Georgia, serif" fontStyle="italic" fontSize={58} fill="#4a2a14">{v.slice(0, Math.floor(vis))}</text>;
          })}
          {/* mano vieja con el estilete */}
          <g transform={`translate(${tx + 10},${ty - 8 + 4 * Math.sin(f / 2.3)})`}>
            <line x1={0} y1={0} x2={70} y2={-150} stroke="#5a3a1a" strokeWidth={10} strokeLinecap="round" />
            <path d="M40,-80 Q90,-120 150,-100 L330,-40 L320,60 L120,30 Q50,10 40,-80 Z" fill="#c98e5e" stroke={TINTA} strokeWidth={5} />
            <path d="M300,-46 L560,40 L540,150 L300,64 Z" fill="#e9dcc4" stroke={TINTA} strokeWidth={5} />
            <path d="M70,-60 Q100,-70 120,-50 M90,-30 Q120,-36 140,-16" stroke="#9a6a44" strokeWidth={4} fill="none" />
          </g>
        </g>
        {/* su cara en el círculo de la esquina (vieja, pelo blanco) */}
        <g transform="translate(1700,190)">
          <circle r={130} fill="#f4e6c8" stroke="#ffe2a6" strokeWidth={8} />
          <circle cx={0} cy={22} r={74} fill="#c98e5e" stroke={TINTA} strokeWidth={5} />
          <path d="M-80,30 Q-86,-62 0,-66 Q86,-62 80,30 Q70,-20 0,-30 Q-70,-20 -80,30 Z" fill="#d8d2c6" stroke={TINTA} strokeWidth={4} />
          <circle cx={-24} cy={20} r={7} fill={TINTA} /><circle cx={24} cy={20} r={7} fill={TINTA} />
          <path d={`M-22,52 Q0,${52 + 6 + 10 * cara} 22,52`} stroke={TINTA} strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M-40,40 q6,6 12,0 M28,40 q6,6 12,0" stroke="#9a6a44" strokeWidth={3} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- INSERTO a pantalla completa: el príncipe que nunca vio un teléfono se asoma a la puerta del palacio ----------
export const PrincipeFull: React.FC<{ abre: number; desde: number }> = ({ abre, desde }) => {
  const f = useF();
  const o = lerp(f, desde, desde + 6, 0, 1);
  const z = 1 + 0.03 * lerp(f, desde, desde + 90, 0, 1);
  return (
    <AbsoluteFill style={{ background: "#f3dcae", opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(960,540) scale(${2 * z}) translate(-480,-270)`}><PrincipeAsoma w={960} h={540} abre={abre} /></g>
        <Halo x={1500} y={600} r={420} color={ORO} fuerza={0.3 * abre} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- el feed reflejado en las pupilas (pantalla): dos rectangulitos de color que cambian con cada video ----------
export const ReflejoPupilas: React.FC<{ ojos: { x: number; y: number }[]; color: string; o: number; s?: number }> = ({ ojos, color, o, s = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {ojos.map((p, i) => (
        <g key={i} opacity={o} transform={`translate(${p.x},${p.y}) scale(${s})`}>
          <rect x={-9} y={-13} width={18} height={26} rx={4} fill={color} />
          <rect x={-6} y={-9} width={12} height={4} rx={2} fill="#ffffff" opacity={0.85} />
          <rect x={-6} y={-2} width={12} height={9} rx={2} fill="#ffffff" opacity={0.35} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

export { PIEL_T };

// ---------- primer término: la pila de toallas ya dobladas sobre la mesa (pantalla, abajo a la izquierda) ----------
export const PilaToallas: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 5 }) => {
  const cols = ["#f4efe6", "#e7dccb", "#f7f3ec", "#dfe6ea", "#efe6d6", "#f4efe6"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g transform={`translate(${x},${y}) scale(${s})`}>
          <rect x={-460} y={0} width={980} height={60} fill="#b9bcc2" stroke={TINTA} strokeWidth={5} />
          <rect x={-460} y={56} width={980} height={400} fill="#8d9097" />
          {Array.from({ length: n }).map((_, i) => (
            <g key={i} transform={`translate(${(i % 2) * 8 - 4},${-62 * (i + 1)})`}>
              <rect x={-300} y={0} width={600} height={64} rx={26} fill={cols[i % cols.length]} stroke={TINTA} strokeWidth={5} />
              <path d={`M-270,22 Q0,${30 + (i % 2) * 6} 270,22`} stroke="#c9bfae" strokeWidth={4} fill="none" />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- MUNDO: las dos manos tapando la boca (para planos donde el brazo del actor queda detrás de la cabeza de al lado) ----------
export const ManosBoca: React.FC<{ x: number; y: number; s?: number; desde: number; piel?: string }> = ({ x, y, s = 1, desde, piel = "#b47c52" }) => {
  const f = useF();
  if (f < desde) return null;
  const t = lerp(f, desde, desde + 4, 0, 1);
  const dy = (1 - t) * 60;
  const mano = (dx: number, dyy: number, k: number) => (
    <g key={k} transform={`translate(${dx},${dyy})`}>
      <rect x={-46} y={-22} width={92} height={44} rx={22} fill={piel} stroke={TINTA} strokeWidth={4} />
      {[-12, 2, 16].map((yy) => <path key={yy} d={`M-30,${yy - 6} L34,${yy - 6}`} stroke="#8a5a36" strokeWidth={3} strokeLinecap="round" />)}
    </g>
  );
  return <g transform={`translate(${x},${y + dy}) scale(${s})`} opacity={t}>{mano(-6, 10, 0)}{mano(4, -14, 1)}</g>;
};

// ---------- INSERTO «every night»: noche, nieve, la mano vieja sostiene el farol que se hamaca (péndulo real) ----------
export const FarolNoche: React.FC<{ desde: number }> = ({ desde }) => {
  const f = useF() - desde;
  const ang = 9 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2a2f3a, #090a0e 75%)" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Halo x={960 + 300 * Math.sin((ang * Math.PI) / 180)} y={560} r={520} color={ORO} fuerza={0.45} />
        {Array.from({ length: 40 }).map((_, i) => { const x = (i * 211) % 1920, y = ((i * 97 + f * (2 + (i % 3))) % 1120) - 20; return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#e8eef6" opacity={0.55} />; })}
        {/* manga gris y mano vieja desde arriba a la derecha */}
        <path d="M1230,-40 L1500,-40 L1110,210 L960,150 Z" fill="#6e6a63" stroke={TINTA} strokeWidth={6} />
        <g transform={`translate(960,170) rotate(${ang})`}>
          <g transform="scale(3.2)"><FarolMano luz={1.4} /></g>
        </g>
        <circle cx={980} cy={162} r={44} fill="#c98e5e" stroke={TINTA} strokeWidth={6} />
        <path d="M950,150 q20,-8 44,2 M948,172 q22,-6 46,4" stroke="#9a6a44" strokeWidth={4} fill="none" />
      </svg>
    </AbsoluteFill>
  );
};
