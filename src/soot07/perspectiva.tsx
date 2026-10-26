import React from "react";
import { Persona, LUCIUS, CIVIL, Ropa, Expr } from "./persona";
import { Lampara } from "./piezas";
import { ESC, Esc } from "./guion07";

// OJO v4: el set del molde. Calle EN PERSPECTIVA con punto de fuga (Coliseo al fondo), fachadas de piedra cálida
// a los costados, adoquines que corren, tabernas y antorchas que derraman luz, primer plano, y el nene caminando
// HACIA cámara mientras la cámara retrocede. Cada trampa es un plano de acción armado acá (anticipa → golpe → reacción).
const K = "#1a0d24";
const F = 1000, HOR = 455, CAMH = 120, HW = 430, KH = 175;
const h = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lp = (t: number, a: number, b: number, va: number, vb: number) => va + (vb - va) * cl((t - a) / (b - a));
type Pt = [number, number];
const P = (x: number, y: number, d: number): Pt => [960 + (F * x) / d, HOR + (F * (CAMH - y)) / d];
const poly = (pts: Pt[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
const quadL = (x: number, y0: number, y1: number, d0: number, d1: number) => poly([P(x, y0, d0), P(x, y1, d0), P(x, y1, d1), P(x, y0, d1)]);

const MURO = ["#7a5a3e", "#6a4c36", "#86644a", "#5f4632", "#74553c", "#8c6a48"];
type Ed = { lado: -1 | 1; d0: number; d1: number; pisos: number; col: string; lit: boolean; seed: number };
const edificios = (seed: number): Ed[] => {
  const out: Ed[] = [];
  ([-1, 1] as const).forEach((lado) => {
    let d = 80 + h(seed + lado) * 120;
    let k = 0;
    while (d < 6200) {
      const L = 420 + h(seed * 3 + k * 7 + lado) * 380;
      out.push({ lado, d0: d, d1: d + L, pisos: 4 + Math.floor(h(seed + k * 13 + lado * 5) * 3), col: MURO[Math.floor(h(seed + k * 17 + lado) * MURO.length)], lit: h(seed * 7 + k * 3 + lado) > 0.35, seed: seed * 31 + k * 11 + (lado > 0 ? 5 : 0) });
      d += L; k++;
    }
  });
  return out;
};
const PISO = 225;

/** La calle (fondo): cielo, Coliseo, fachadas, adoquines. cz = cuánto retrocedió la cámara. */
const Calle: React.FC<{ t: number; e: Esc; cz: number; eds: Ed[]; fuego: number }> = ({ t, e, cz, eds, fuego }) => {
  const D = (d: number) => d + cz;
  const vis = eds.filter((b) => D(b.d0) < 7000).sort((a, b) => D(b.d1) - D(a.d1));
  const colX = 960, colY = HOR, colS = F / D(5600);
  const lineas: React.ReactNode[] = [];
  for (let k = 0; k < 70; k++) {
    const d = 60 + k * 85 - (cz % 85);
    if (D(d) < 40 || d < 40) continue;
    const a = P(-HW, 0, d), b = P(HW, 0, d);
    lineas.push(<line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#2a1c14" strokeWidth={Math.max(1, 900 / d)} opacity={0.5} />);
  }
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs>
        <linearGradient id="pcielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#040820" /><stop offset="0.6" stopColor="#12245a" /><stop offset="1" stopColor={fuego > 0 ? "#7a2a2a" : "#2c3f78"} /></linearGradient>
        <linearGradient id="psuelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c140f" /><stop offset="1" stopColor="#4a3426" /></linearGradient>
        <radialGradient id="pglow"><stop offset="0" stopColor="#ffb54a" stopOpacity="0.85" /><stop offset="0.4" stopColor="#ff8a2a" stopOpacity="0.35" /><stop offset="1" stopColor="#ff8a2a" stopOpacity="0" /></radialGradient>
        <radialGradient id="pfuego"><stop offset="0" stopColor="#ffd23a" stopOpacity="0.9" /><stop offset="0.5" stopColor="#ff5a1f" stopOpacity="0.45" /><stop offset="1" stopColor="#ff3a1f" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={1920} height={HOR + 40} fill="url(#pcielo)" />
      {Array.from({ length: 60 }, (_, k) => <circle key={k} cx={h(k + 1) * 1920} cy={h(k + 99) * 380} r={1 + h(k + 7) * 2} fill="#fff8e0" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * (0.5 + h(k)) + k))} />)}
      <circle cx={1380} cy={150} r={46} fill="#fff3c4" /><circle cx={1380} cy={150} r={90} fill="#fff3c4" opacity={0.12} />
      {/* el Coliseo al final de la calle, encendido */}
      <g transform={`translate(${colX} ${colY}) scale(${colS * 9})`}>
        <path d="M -60 0 L -60 -38 Q 0 -50 60 -38 L 60 0 Z" fill="#6a4a3a" stroke={K} strokeWidth={1.5} />
        {Array.from({ length: 3 }, (_, r) => Array.from({ length: 8 }, (_, c) => <rect key={r * 9 + c} x={-54 + c * 14} y={-34 + r * 11} width={7} height={8} rx={3} fill="#ffb04a" opacity={0.9} />))}
      </g>
      {/* el suelo */}
      <polygon points={poly([P(-HW, 0, 30), P(HW, 0, 30), P(HW, 0, 8000), P(-HW, 0, 8000)])} fill="url(#psuelo)" />
      {Array.from({ length: 13 }, (_, j) => { const x = -HW + (j * 2 * HW) / 12; const a = P(x, 0, 40), b = P(x, 0, 8000); return <line key={j} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#2a1c14" strokeWidth={3} opacity={0.45} />; })}
      {lineas}
      <polygon points={poly([P(-25, 0, 40), P(25, 0, 40), P(25, 0, 8000), P(-25, 0, 8000)])} fill="#1e140e" opacity={0.6} />
      {/* fachadas, de lejos a cerca */}
      {vis.map((b, i) => {
        const x = b.lado * HW, d0 = Math.max(D(b.d0), 25), d1 = D(b.d1);
        if (d1 < 30) return null;
        const alto = b.pisos * PISO;
        const L = b.d1 - b.d0;
        const ven: React.ReactNode[] = [];
        for (let p = 1; p < b.pisos; p++) for (let c = 0; c < 2; c++) {
          const da = D(b.d0 + L * (0.18 + c * 0.45)), db = da + L * 0.2;
          if (da < 240) continue;
          const y0 = p * PISO + 60, y1 = y0 + 110;
          const ard = fuego > 0 && b.lado > 0 && h(b.seed + p * 3 + c) < fuego;
          const luz = ard || h(b.seed + p * 5 + c * 2) > 0.68;
          ven.push(<polygon key={`${p}-${c}`} points={quadL(x, y0, y1, da, db)} fill={ard ? "#ff7a1f" : luz ? "#ffcf6a" : "#2a1a2a"} stroke={K} strokeWidth={Math.max(1, 1600 / da)} />);
          if (ard) { const q = P(x, y1, (da + db) / 2); ven.push(<path key={`f${p}-${c}`} d={`M ${q[0] - 3000 / da} ${q[1]} Q ${q[0]} ${q[1] - (9000 + Math.sin(t * 9 + p) * 2000) / da} ${q[0] + 3000 / da} ${q[1]} Z`} fill="#ffd23a" stroke="#ff5a1f" strokeWidth={4} />); }
          if (p === 2 && c === 1) { const y = y0 - 10; ven.push(<polygon key={`b${p}`} points={poly([P(x, y, da - 20), P(x - b.lado * 70, y, da - 20), P(x - b.lado * 70, y, db + 20), P(x, y, db + 20)])} fill="#5a3a26" stroke={K} strokeWidth={2} />, <polygon key={`r${p}`} points={poly([P(x - b.lado * 70, y, da - 20), P(x - b.lado * 70, y + 50, da - 20), P(x - b.lado * 70, y + 50, db + 20), P(x - b.lado * 70, y, db + 20)])} fill="none" stroke="#3a2416" strokeWidth={Math.max(1, 2400 / da)} />); }
        }
        const pa = D(b.d0 + L * 0.2), pb = D(b.d0 + L * 0.8);
        return (
          <g key={i}>
            <polygon points={quadL(x, 0, alto, d0, d1)} fill={b.col} stroke={K} strokeWidth={2} />
            {/* hiladas de piedra */}
            {Array.from({ length: b.pisos * 3 }, (_, r) => { const y = r * (PISO / 3); const a = P(x, y, d0), c = P(x, y, d1); return <line key={r} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="#5a3e2a" strokeWidth={1.5} opacity={0.45} />; })}
            <polygon points={quadL(x, alto - 20, alto, d0, d1)} fill="#6a4a32" />
            {ven}
            {/* la taberna o el portón de planta baja */}
            {pa > 30 && <polygon points={quadL(x, 0, 170, pa, pb)} fill={b.lit ? "#e8a648" : "#4a2e1c"} stroke={K} strokeWidth={Math.max(1.5, 2200 / pa)} />}
            {pa > 30 && b.lit && <polygon points={quadL(x, 0, 70, pa + (pb - pa) * 0.1, pb - (pb - pa) * 0.1)} fill="#7a4a26" />}
            {pa > 30 && !b.lit && Array.from({ length: 4 }, (_, k) => { const dd = pa + ((pb - pa) * (k + 1)) / 5; const a = P(x, 0, dd), c = P(x, 170, dd); return <line key={k} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="#2a180e" strokeWidth={Math.max(1, 1200 / dd)} />; })}
          </g>
        );
      })}
    </svg>
  );
};

/** Luces cálidas (antorchas de pared + tabernas) en modo pantalla, encima de la calle. */
const Luces: React.FC<{ t: number; cz: number; eds: Ed[]; extra: { x: number; y: number; d: number; r: number; fuego?: boolean }[]; tenue: number }> = ({ t, cz, eds, extra, tenue }) => {
  const D = (d: number) => d + cz;
  const L: { x: number; y: number; d: number; r: number; fuego?: boolean; antorcha?: boolean }[] = [];
  eds.forEach((b) => {
    const dd = D(b.d0 + (b.d1 - b.d0) * 0.5);
    if (dd < 40 || dd > 6500) return;
    if (b.lit) L.push({ x: b.lado * (HW - 60), y: 60, d: dd, r: 320 });
    if (h(b.seed + 77) > 0.4) L.push({ x: b.lado * (HW - 8), y: 290, d: D(b.d0 + 30), r: 300, antorcha: true });
  });
  extra.forEach((x) => L.push(x));
  return (
    <svg style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: tenue }} width={1920} height={1080}>
      {L.map((l, i) => {
        if (l.d < 40) return null;
        const q = P(l.x, l.y, l.d), s = F / l.d;
        const g = P(l.x * 0.7, 0, l.d);
        const fl = 1 + Math.sin(t * 11 + i * 1.7) * 0.05;
        return (
          <g key={i}>
            <circle cx={q[0]} cy={q[1]} r={l.r * s * fl} fill={`url(#${l.fuego ? "pfuego" : "pglow"})`} />
            <ellipse cx={g[0]} cy={g[1]} rx={l.r * 1.3 * s} ry={l.r * 0.32 * s} fill="url(#pglow)" opacity={0.55} />
          </g>
        );
      })}
    </svg>
  );
};
const Antorchas: React.FC<{ t: number; cz: number; eds: Ed[] }> = ({ t, cz, eds }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {eds.map((b, i) => {
      const dd = b.d0 + 30 + cz;
      if (dd < 40 || dd > 6500 || h(b.seed + 77) <= 0.4) return null;
      const q = P(b.lado * (HW - 8), 290, dd), s = F / dd;
      return <g key={i} transform={`translate(${q[0]} ${q[1]}) scale(${s * 1.1})`}><rect x={-6} y={-10} width={12} height={70} fill="#6b3a1f" stroke={K} strokeWidth={4} /><path d={`M -18 -6 Q -14 ${-52 - Math.sin(t * 13 + i) * 10} 0 -74 Q 14 ${-46 + Math.sin(t * 9 + i) * 8} 18 -6 Z`} fill="#ffd23a" stroke="#ff8a2a" strokeWidth={4} /></g>;
    })}
  </svg>
);

// ---- gente y cosas en el espacio de la calle ----
type Ac = { x: number; d: number; h?: number; seed?: number; ropa?: Ropa; expr?: Expr; camina?: number; bI?: number; bD?: number; cI?: number; cD?: number; mira?: number; salta?: number; inclina?: number; sombra?: string; casco?: "no" | "legion" | "centurion"; manoD?: React.ReactNode; manoI?: React.ReactNode; habla?: boolean; flip?: boolean; viejo?: boolean };
const VIGIL: Ropa = { tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#c98b62", piel2: "#a2643f", pelo: "#2a1a10" };
const BaldeM = <g><path d="M -26 -10 L 26 -10 L 20 40 L -20 40 Z" fill="#a8743c" stroke={K} strokeWidth={6} /><path d="M -26 -10 Q 0 -44 26 -10" fill="none" stroke={K} strokeWidth={5} /><ellipse cx={0} cy={-8} rx={24} ry={6} fill="#5ac8e8" /></g>;
const AntorchaM = (t: number) => <g><rect x={-7} y={-80} width={14} height={100} fill="#6b3a1f" stroke={K} strokeWidth={5} /><path d={`M -20 -76 Q -16 ${-122 - Math.sin(t * 13) * 10} 0 -144 Q 16 ${-116 + Math.sin(t * 9) * 8} 20 -76 Z`} fill="#ffd23a" stroke="#ff8a2a" strokeWidth={5} /></g>;

const Gente: React.FC<{ t: number; ac: Ac[] }> = ({ t, ac }) => (
  <>
    {ac.filter((a) => a.d > 60).sort((a, b) => b.d - a.d).map((a, i) => {
      const q = P(a.x, 0, a.d);
      const hp = (F * (a.h ?? 165)) / a.d;
      return (
        <React.Fragment key={i}>
          <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><ellipse cx={q[0]} cy={q[1]} rx={hp * 0.22} ry={hp * 0.04} fill="#000" opacity={0.35} /></svg>
          <Persona x={q[0]} y={q[1]} h={hp} t={t} seed={a.seed ?? 50 + i} ropa={a.ropa ?? CIVIL(i)} expr={a.expr ?? "neutro"} camina={a.camina ?? 0} bI={a.bI} bD={a.bD} cI={a.cI} cD={a.cD} mira={a.mira} salta={a.salta} inclina={a.inclina} sombra={a.sombra} casco={a.casco} manoD={a.manoD} manoI={a.manoI} habla={a.habla} flip={a.flip} viejo={a.viejo} />
        </React.Fragment>
      );
    })}
  </>
);

/** Carro de frente (mula + caja + ruedas) a profundidad d. */
const CarroF: React.FC<{ t: number; x: number; d: number; carga?: string }> = ({ t, x, d, carga = "#d8d2c4" }) => {
  if (d < 50) return null;
  const q = P(x, 0, d), s = F / d;
  const b = Math.sin(t * 14) * 4;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <g transform={`translate(${q[0]} ${q[1]}) scale(${s})`}>
        <ellipse cx={0} cy={4} rx={150} ry={18} fill="#000" opacity={0.35} />
        {/* caja y carga detrás */}
        <rect x={-130} y={-250 + b} width={260} height={130} fill="#8a5a2e" stroke={K} strokeWidth={8} />
        <rect x={-110} y={-330 + b} width={220} height={90} rx={10} fill={carga} stroke={K} strokeWidth={7} />
        {[-1, 1].map((k) => <g key={k} transform={`translate(${k * 140} -75)`}><ellipse rx={26} ry={78} fill="#5a3418" stroke={K} strokeWidth={8} /><line x1={0} y1={-70} x2={0} y2={70} stroke="#2a180e" strokeWidth={6} transform={`rotate(${(t * 400) % 180})`} /></g>)}
        {/* la mula de frente */}
        <g transform={`translate(0 ${b * 1.5})`}>
          <rect x={-34} y={-140} width={22} height={140} fill="#6b4226" stroke={K} strokeWidth={6} transform={`rotate(${Math.sin(t * 14) * 6} -23 -140)`} />
          <rect x={12} y={-140} width={22} height={140} fill="#6b4226" stroke={K} strokeWidth={6} transform={`rotate(${-Math.sin(t * 14) * 6} 23 -140)`} />
          <ellipse cx={0} cy={-170} rx={62} ry={60} fill="#7a4e2e" stroke={K} strokeWidth={7} />
          <path d="M -40 -280 Q 0 -300 40 -280 L 30 -170 Q 0 -150 -30 -170 Z" fill="#8a5a36" stroke={K} strokeWidth={7} />
          <path d="M -36 -284 L -60 -340 L -20 -296 Z M 36 -284 L 60 -340 L 20 -296 Z" fill="#7a4e2e" stroke={K} strokeWidth={6} />
          <ellipse cx={0} cy={-185} rx={30} ry={22} fill="#c9a07a" stroke={K} strokeWidth={5} />
          <circle cx={-20} cy={-250} r={13} fill="#fff" stroke={K} strokeWidth={4} /><circle cx={20} cy={-250} r={13} fill="#fff" stroke={K} strokeWidth={4} />
          <circle cx={-18} cy={-247} r={6} fill={K} /><circle cx={18} cy={-247} r={6} fill={K} />
          <path d="M -70 -200 Q 0 -230 70 -200" fill="none" stroke="#3a2416" strokeWidth={8} />
        </g>
      </g>
    </svg>
  );
};

/** Vecino asomado a una ventana de la fachada (lado, piso, d) que vuelca un balde. */
const Asoma: React.FC<{ t: number; lado: -1 | 1; piso: number; d: number; lt: number; tVuelca: number; cosa: "sopa" | "basura" | "maceta" }> = ({ t, lado, piso, d, lt, tVuelca, cosa }) => {
  if (d < 60) return null;
  const y = piso * PISO + 10;
  const q = P(lado * HW, y, d), s = F / d;
  const sale = cl(lt / 0.5);
  const vuelca = cl((lt - tVuelca) / 0.35);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <g transform={`translate(${q[0] - lado * 40 * s * sale} ${q[1]}) scale(${s})`}>
        {/* la cabeza y los brazos */}
        <circle cx={0} cy={-50} r={46} fill="#f2b48a" stroke={K} strokeWidth={6} />
        <path d="M -46 -60 Q -40 -110 0 -104 Q 44 -108 46 -60 Q 30 -84 0 -80 Q -30 -84 -46 -60 Z" fill="#4a2a17" stroke={K} strokeWidth={5} />
        <circle cx={-16} cy={-52} r={7} fill={K} /><circle cx={16} cy={-52} r={7} fill={K} />
        <path d={lt > tVuelca ? "M -14 -26 Q 0 -14 14 -26" : "M -12 -24 Q 0 -30 12 -24"} stroke={K} strokeWidth={5} fill="none" />
        <rect x={-60} y={-4} width={120} height={50} rx={18} fill="#7a5bd1" stroke={K} strokeWidth={6} />
        <g transform={`translate(${-lado * 70} 0) rotate(${-lado * vuelca * 120})`}>
          {cosa === "maceta" ? <g><path d="M -36 -30 L 36 -30 L 26 30 L -26 30 Z" fill="#c9673f" stroke={K} strokeWidth={6} /><path d="M -20 -30 Q -30 -80 0 -90 Q 30 -80 20 -30" fill="#4fa85a" stroke={K} strokeWidth={5} /></g>
            : <g><path d="M -40 -28 L 40 -28 L 30 34 L -30 34 Z" fill={cosa === "sopa" ? "#8a8a96" : "#a8743c"} stroke={K} strokeWidth={6} /><ellipse cx={0} cy={-26} rx={38} ry={10} fill={cosa === "sopa" ? "#b58a3a" : "#6a7a3a"} /></g>}
        </g>
      </g>
    </svg>
  );
};

/** Chorro que cae de una ventana al suelo (partículas), con salpicadura. */
const Chorro: React.FC<{ t: number; x0: number; y0: number; d: number; lt: number; t0: number; col: string; trozos?: boolean }> = ({ x0, y0, d, lt, t0, col, trozos }) => {
  const u = lt - t0;
  if (u < 0 || u > 2.4 || d < 60) return null;
  const pts: React.ReactNode[] = [];
  for (let k = 0; k < 46; k++) {
    const tk = u - k * 0.018;
    if (tk < 0) continue;
    const yy = y0 - 0.5 * 2400 * tk * tk;
    if (yy < 0) continue;
    const xx = x0 + (h(k) - 0.5) * 40 - Math.sign(x0) * 60 * tk;
    const q = P(xx, yy, d + (h(k + 9) - 0.5) * 30);
    pts.push(trozos ? <rect key={k} x={q[0]} y={q[1]} width={(F * 14) / d} height={(F * 9) / d} fill={k % 3 ? col : "#d8c27a"} stroke={K} strokeWidth={2} transform={`rotate(${k * 47} ${q[0]} ${q[1]})`} /> : <circle key={k} cx={q[0]} cy={q[1]} r={(F * (7 + h(k + 3) * 7)) / d} fill={col} />);
  }
  const tc = Math.sqrt((2 * y0) / 2400);
  const sp = u - tc;
  const g = P(x0 - Math.sign(x0) * 60 * tc, 0, d);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      {pts}
      {sp > 0 && <>
        <ellipse cx={g[0]} cy={g[1]} rx={(F * 120 * cl(sp / 0.3)) / d} ry={(F * 22 * cl(sp / 0.3)) / d} fill={col} opacity={0.85} />
        {Array.from({ length: 14 }, (_, k) => { const a = -Math.PI * (0.1 + 0.8 * h(k + 40)); const r = sp * (600 + h(k) * 500); const yy = g[1] + Math.sin(a) * r * (F / d) * 0.6 + 900 * sp * sp * (F / d); return sp < 0.9 && <circle key={k} cx={g[0] + Math.cos(a) * r * (F / d)} cy={yy} r={(F * 8) / d} fill={col} />; })}
      </>}
    </svg>
  );
};

/** Ojos que brillan en la negrura (portales). */
const Ojos: React.FC<{ t: number; pares: [number, number, number][] }> = ({ t, pares }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {pares.map(([x, y, d], i) => { const q = P(x, y, d), s = F / d; const b = (t * 1.1 + i * 0.7) % 3 < 0.12 ? 0.1 : 1; return <g key={i}>{[-1, 1].map((k) => <ellipse key={k} cx={q[0] + k * 14 * s} cy={q[1]} rx={7 * s} ry={7 * s * b} fill="#ffe14a" />)}</g>; })}
  </svg>
);

/** Agua que sube por la calle, con cosas flotando. */
const Agua: React.FC<{ t: number; nivel: number; cz: number }> = ({ t, nivel, cz }) => {
  if (nivel <= 0) return null;
  const a = P(-HW, nivel, 260), b = P(HW, nivel, 260), c = P(HW, nivel, 8000), d = P(-HW, nivel, 8000);
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <defs><linearGradient id="aguaG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#1f4f5c" stopOpacity={0.55} /><stop offset="1" stopColor="#3a7f8e" stopOpacity={0.8} /></linearGradient></defs><polygon points={poly([a, b, c, d])} fill="url(#aguaG)" />
      {Array.from({ length: 12 }, (_, k) => { const dd = 300 + k * 260 - ((cz + t * 40) % 260); if (dd < 60) return null; const q1 = P(-HW, nivel, dd), q2 = P(HW, nivel, dd); return <path key={k} d={`M ${q1[0]} ${q1[1]} Q ${(q1[0] + q2[0]) / 2} ${q1[1] - 8 + Math.sin(t * 3 + k) * 6} ${q2[0]} ${q2[1]}`} stroke="#9fd6e0" strokeWidth={Math.max(1.5, 900 / dd)} fill="none" opacity={0.45} />; })}
      {[[-200, 900, "#c9673f"], [150, 1500, "#d8c27a"], [-60, 600, "#8a5a2e"]].map(([x, dd, col], k) => { const q = P((x as number) + Math.sin(t + k) * 30, nivel, (dd as number) + cz * 0.2), s = F / ((dd as number) + cz * 0.2); return <ellipse key={k} cx={q[0]} cy={q[1]} rx={40 * s} ry={14 * s} fill={col as string} stroke={K} strokeWidth={3} transform={`rotate(${Math.sin(t * 2 + k) * 12} ${q[0]} ${q[1]})`} />; })}
    </svg>
  );
};

/** Llamas que salen de la fachada derecha (incendio), de lejos a cerca. */
const Llamas: React.FC<{ t: number; cz: number; u: number }> = ({ t, cz, u }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    {[3200, 2600, 2100, 1700, 1350].map((d0, k) => {
      if (u < k * 0.15) return null;
      const d = d0 + cz, a = P(HW - 5, 0, d), b = P(HW - 5, 0, d + 260), s = F / d;
      const hgt = (520 + 160 * Math.sin(t * 7 + k * 2)) * s * cl((u - k * 0.15) / 0.3);
      const xm = (a[0] + b[0]) / 2, y0 = (a[1] + b[1]) / 2 - 160 * s;
      return <g key={k}>
        <path d={`M ${a[0]} ${y0} Q ${xm - 60 * s} ${y0 - hgt * 0.6} ${xm} ${y0 - hgt} Q ${xm + 40 * s} ${y0 - hgt * 0.5} ${b[0]} ${y0} Z`} fill="#ff6a1f" stroke="#c23a12" strokeWidth={3} />
        <path d={`M ${a[0] + (b[0] - a[0]) * 0.2} ${y0} Q ${xm - 30 * s} ${y0 - hgt * 0.4} ${xm} ${y0 - hgt * 0.65} Q ${xm + 20 * s} ${y0 - hgt * 0.3} ${a[0] + (b[0] - a[0]) * 0.8} ${y0} Z`} fill="#ffd23a" />
      </g>;
    })}
    {Array.from({ length: 24 }, (_, k) => { const ph = (t * 0.6 + h(k)) % 1; return <circle key={k} cx={1300 + h(k + 5) * 500 + Math.sin(t * 2 + k) * 30} cy={700 - ph * 650} r={3 + h(k) * 4} fill="#ffb54a" opacity={1 - ph} />; })}
  </svg>
);
/** Humo del incendio (fondo). */
const Humo: React.FC<{ t: number; u: number }> = ({ t, u }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080} opacity={cl(u) * 0.75}>
    <defs><filter id="humoB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter></defs>
    <g filter="url(#humoB)">{Array.from({ length: 10 }, (_, k) => <circle key={k} cx={1150 + h(k) * 700 + Math.sin(t * 0.4 + k) * 40} cy={420 - ((t * 30 + k * 60) % 420)} r={90 + h(k + 3) * 80} fill="#2a1a22" opacity={0.5} />)}</g>
  </svg>
);

// ---- cada escena ----
const plan = (e: Esc, t: number) => {
  const lt = t - e.t;
  const cz = 40 * lt; // la cámara retrocede
  const ac: Ac[] = [];
  const luz: { x: number; y: number; d: number; r: number; fuego?: boolean }[] = [];
  let osc = 0, nivel = 0, fuego = 0;
  const extra: React.ReactNode[] = [];
  const s = Math.round(e.t * 10);
  // el nene: camina hacia cámara (d baja), con su lámpara
  let kx = -40 + Math.sin(lt * 0.6) * 20, kd = 760 - 95 * lt, kc = 1.6, kexpr: Expr = "neutro", kmira = Math.sin(lt * 0.9) * 0.6, kbD: number | undefined = 55, kcD: number | undefined = 55, kbI: number | undefined, kcI: number | undefined, ksalta: number | undefined, kinc = 0;
  const lam = e.tipo !== "fuego" && e.tipo !== "huida" && e.tipo !== "vigiles" && e.tipo !== "cadena";
  const tt = (x: number) => e.t + x;
  switch (e.tipo) {
    case "camina": case "gente": {
      const n = e.tipo === "gente" ? 9 : 4;
      for (let k = 0; k < n; k++) {
        const ida = h(s + k) > 0.5;
        const v = 70 + h(s + k * 3) * 50;
        ac.push({ x: (h(s + k * 7) > 0.5 ? 1 : -1) * (150 + h(s + k * 5) * 190), d: (ida ? 300 + k * 260 + v * lt : 2200 + k * 300 - v * lt) + cz, seed: 60 + s % 40 + k, camina: 1.2, ropa: CIVIL(k + s), expr: (["neutro", "feliz", "orgullo"] as Expr[])[k % 3], manoD: k % 4 === 1 ? AntorchaM(t) : undefined, bD: k % 4 === 1 ? 70 : undefined, cD: k % 4 === 1 ? 40 : undefined, habla: k % 3 === 0 });
      }
      if (e.tipo === "gente") ac.push({ x: 300, d: 900 + cz, seed: 88, ropa: { ...CIVIL(1), tunica: "#f2ead8", tunica2: "#c9bfa8" }, expr: "feliz", habla: true, bD: 120, cD: 60, manoD: <g><ellipse cx={0} cy={-20} rx={70} ry={18} fill="#c9673f" stroke={K} strokeWidth={5} />{[-40, 0, 40].map((x) => <ellipse key={x} cx={x} cy={-38} rx={22} ry={14} fill="#e8b45a" stroke={K} strokeWidth={4} />)}</g> });
      kexpr = e.tipo === "gente" ? "sorpresa" : "neutro";
      break;
    }
    case "oscuro": {
      osc = 0.93; kc = 1.0; kd = 640 - 70 * lt; kexpr = lt > 2.5 ? "miedo" : "neutro"; kmira = Math.sin(lt * 1.6) * 0.9;
      extra.push(<Ojos key="o" t={t} pares={[[-HW + 30, 90, 1400 + cz], [HW - 30, 130, 2100 + cz], [-HW + 30, 70, 2900 + cz], [HW - 40, 240, 1000 + cz]]} />);
      break;
    }
    case "linterna": {
      osc = 0.82;
      const dl = 520 - 80 * lt;
      ac.push({ x: 120, d: dl + cz, seed: 41, ropa: { ...CIVIL(0), tunica: "#8a8a7a", tunica2: "#5a5a4a" }, camina: 1.6, manoD: AntorchaM(t), bD: 120, cD: 30, expr: "neutro" });
      ac.push({ x: 200, d: dl + 140 + cz, seed: 42, ropa: { ...CIVIL(1), tunica: "#f2ead8", tunica2: "#c9bfa8" }, camina: 1.6, expr: "orgullo", viejo: true });
      luz.push({ x: 120, y: 250, d: dl + cz, r: 520 });
      kx = -260; kd = 1100 - 80 * lt; kexpr = "triste";
      break;
    }
    case "carro": case "carro2": {
      const pega = e.tipo === "carro2";
      const tl = pega ? 2.2 : 2.8; // cuando el carro llega a la altura del nene
      kd = pega ? 520 - 10 * lt : 700 - 90 * lt;
      kx = pega ? -340 : lp(lt, tl - 0.7, tl - 0.2, -30, -330);
      if (!pega) ksalta = tt(tl - 0.7);
      const dCar = kd + (tl - lt) * 900;
      extra.push(<CarroF key="c" t={t} x={pega ? -110 : 90} d={dCar + cz} carga={pega ? "#cfc8ba" : "#d8d2c4"} />);
      if (lt > tl - 1.2) { kexpr = "miedo"; kbD = 150; kcD = 40; kbI = 150; kcI = 40; kinc = -10; kc = 0; }
      // otro carro más atrás
      extra.unshift(<CarroF key="c2" t={t + 0.3} x={-60} d={kd + (tl + 3.2 - lt) * 700 + cz} carga="#b5452c" />);
      break;
    }
    case "ventanas": {
      kexpr = lt > 1.5 ? "triste" : "neutro";
      [[1, 1, 700], [-1, 1, 950], [1, 2, 1500], [-1, 2, 1900]].forEach(([lado, piso, d], k) => extra.push(<Asoma key={k} t={t} lado={lado as -1 | 1} piso={piso} d={d + cz} lt={lt - k * 0.4} tVuelca={99} cosa="sopa" />));
      break;
    }
    case "baldazo": case "basura": {
      const sopa = e.tipo === "baldazo";
      const tV = 2.3, dW = 500;
      kd = 760 - 95 * Math.min(lt, tV + 0.2) + 60 * Math.max(0, lt - tV - 0.2);
      extra.push(<Asoma key="a" t={t} lado={1} piso={1} d={dW + cz} lt={lt} tVuelca={tV} cosa={sopa ? "sopa" : "basura"} />);
      extra.push(<Chorro key="ch" t={t} x0={HW - 130} y0={PISO + 110} d={dW + cz} lt={lt} t0={tV + 0.15} col={sopa ? "#b58a3a" : "#6a7a3a"} trozos={!sopa} />);
      if (!sopa) { extra.push(<Asoma key="a2" t={t} lado={-1} piso={1} d={900 + cz} lt={lt - 0.6} tVuelca={tV + 0.7} cosa="basura" />); extra.push(<Chorro key="ch2" t={t} x0={-HW + 130} y0={PISO + 110} d={900 + cz} lt={lt} t0={tV + 0.85} col="#8a5a2e" trozos />); }
      kx = lp(lt, 0, tV, -60, 130);
      if (lt > tV) { ksalta = tt(tV + 0.1); kexpr = "miedo"; kbD = 165; kcD = 70; kbI = 165; kcI = 70; kc = 0; kx = lp(lt, tV, tV + 0.4, 130, -120); }
      else kmira = lt > 1.4 ? 0.8 : kmira;
      break;
    }
    case "maceta": {
      const tC = e.p ?? 4.3, dW = 620;
      kd = 900 - 60 * lt;
      ac.push({ x: -150, d: lp(lt, 0, tC, 1200, 700) + cz, seed: 31, camina: lt < tC ? 1.3 : 0, ropa: CIVIL(4), expr: lt > tC ? "sorpresa" : "feliz", salta: tt(tC), bD: lt > tC ? 150 : undefined, bI: lt > tC ? 150 : undefined });
      // la maceta tambalea en el balcón y cae
      const u = lt - tC + 0.7;
      const yM = u < 0 ? PISO + 90 : Math.max(0, PISO + 90 - 0.5 * 2400 * u * u);
      const q = P(-HW + 60, yM, dW + cz), sc = F / (dW + cz);
      const rot = u < 0 ? Math.sin(t * 14) * (lt > 1 ? 8 : 0) : u * 400;
      { const b0 = P(-HW, PISO + 50, dW + cz - 120), b1 = P(-HW + 110, PISO + 50, dW + cz - 120), b2 = P(-HW + 110, PISO + 50, dW + cz + 160), b3 = P(-HW, PISO + 50, dW + cz + 160); extra.push(<svg key="bal" style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><polygon points={poly([b0, b1, b2, b3])} fill="#5a3a26" stroke={K} strokeWidth={4} />{[-60, 80].map((dd) => { const qq = P(-HW + 60, PISO + 90, dW + cz + dd), ss = F / (dW + cz + dd); return <g key={dd} transform={`translate(${qq[0]} ${qq[1]}) scale(${ss})`}><path d="M -40 -34 L 40 -34 L 30 34 L -30 34 Z" fill="#c9673f" stroke={K} strokeWidth={7} /><path d="M -24 -34 Q -36 -96 0 -110 Q 36 -96 24 -34" fill="#4fa85a" stroke={K} strokeWidth={6} /></g>; })}</svg>); }
      extra.push(<svg key="m" style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{yM > 0 ? <g transform={`translate(${q[0]} ${q[1]}) scale(${sc}) rotate(${rot})`}><path d="M -40 -34 L 40 -34 L 30 34 L -30 34 Z" fill="#c9673f" stroke={K} strokeWidth={7} /><path d="M -24 -34 Q -36 -96 0 -110 Q 36 -96 24 -34" fill="#4fa85a" stroke={K} strokeWidth={6} /></g> : Array.from({ length: 10 }, (_, k) => { const sp = lt - tC; const g = P(-HW + 60 + Math.cos(k) * sp * 300, 0, dW + cz + Math.sin(k * 3) * 60), r = sc * 18; return <polygon key={k} points={`${g[0]},${g[1] - r - sp * 200 * (1 - sp)} ${g[0] + r},${g[1]} ${g[0] - r},${g[1]}`} fill={k % 3 ? "#c9673f" : "#4fa85a"} stroke={K} strokeWidth={3} />; })}</svg>);
      if (lt > tC - 0.3) { kexpr = "miedo"; kc = 0; kbD = 150; kbI = 150; kcD = 40; kcI = 40; }
      break;
    }
    case "ladron": {
      osc = 0.6;
      kd = 760 - 80 * lt;
      const sale = 1.4, ve = 3.0;
      ac.push({ x: lp(lt, sale, sale + 1, HW - 40, 120), d: kd + 260, seed: 17, sombra: "#0e0716", camina: lt > sale ? 1.4 : 0, h: 190, bD: 100, cD: 60, manoD: <path d="M 0 0 L 8 -60 L 16 0 Z" fill="#e8eef8" stroke={K} strokeWidth={3} opacity={(t * 3) % 1 < 0.5 ? 1 : 0.6} /> });
      extra.push(<Ojos key="o" t={t} pares={[[lp(lt, sale, sale + 1, HW - 40, 120), 150, kd + 255]]} />);
      if (lt > ve) { kexpr = "miedo"; kc = 3.0; kd = 760 - 80 * ve - 260 * (lt - ve); kmira = 0.9; kbI = 90; kcI = 60; }
      break;
    }
    case "oscuro2": {
      osc = 0.88; kexpr = "miedo"; kmira = Math.sin(lt * 2) * 1;
      ac.push({ x: 60, d: kd + 420, seed: 17, sombra: "#0e0716", camina: 1.6, h: 185 });
      ac.push({ x: -120, d: kd + 900, seed: 18, sombra: "#0e0716", camina: 1.6, h: 180 });
      extra.push(<Ojos key="o" t={t} pares={[[60, 150, kd + 418], [-120, 145, kd + 898]]} />);
      break;
    }
    case "agua": {
      nivel = Math.min(32, 6 + lt * 8);
      kc = 0.8; kd = 700 - 50 * lt; kexpr = "miedo"; kbD = 140; kbI = 140; kcD = 50; kcI = 50; kinc = Math.sin(t * 2.2) * 5;
      ac.push({ x: 220, d: 1200 - 40 * lt + cz, seed: 35, ropa: CIVIL(2), camina: 0.8, expr: "triste", bD: 140, bI: 140 });
      break;
    }
    case "fuego": {
      fuego = lp(lt, 0, 3, 0.15, 0.85);
      extra.unshift(<Humo key="h" t={t} u={lt / 1.5} />, <Llamas key="ll" t={t} cz={cz} u={lt / 2} />);
      for (let k = 0; k < 5; k++) ac.push({ x: -200 + k * 95, d: 2400 - lt * (380 + k * 40) + k * 180 + cz, seed: 70 + k, camina: 2.6, ropa: CIVIL(k + 2), expr: "miedo", bD: 150, bI: 150, cD: 40, cI: 40 });
      luz.push({ x: HW - 50, y: 600, d: 1800 + cz, r: 1400, fuego: true }, { x: HW - 50, y: 500, d: 900 + cz, r: 900, fuego: true });
      kx = -300; kd = 600; kc = 0; kexpr = "miedo"; kbD = 120; kcD = 40;
      break;
    }
    case "huida": {
      fuego = 0.7;
      extra.unshift(<Humo key="h" t={t} u={1} />, <Llamas key="ll" t={t} cz={cz} u={1} />);
      for (let k = 0; k < 9; k++) ac.push({ x: -330 + (k % 5) * 160, d: 1900 - lt * (420 + (k % 3) * 60) + k * 140 + cz, seed: 140 + k, camina: 2.8, ropa: CIVIL(k), expr: "miedo", bD: 150, bI: 150, cD: 30, cI: 30 });
      luz.push({ x: 0, y: 500, d: 3000 + cz, r: 2200, fuego: true });
      kc = 2.8; kd = 900 - 140 * lt; kexpr = "miedo"; kbD = 150; kbI = 150; kcD = 30; kcI = 30;
      break;
    }
    case "vigiles": case "cadena": {
      fuego = e.tipo === "cadena" ? 0.6 : 0.3;
      if (e.tipo === "vigiles") {
        for (let k = 0; k < 6; k++) ac.push({ x: -150 + (k % 3) * 150, d: 1700 - lt * 420 + k * 130 + cz, seed: 90 + k, ropa: VIGIL, casco: "legion", camina: 2, expr: k === 0 ? "enojado" : "orgullo", manoD: k === 0 ? AntorchaM(t) : BaldeM, bD: k === 0 ? 120 : 30, cD: 40 });
        kx = -330; kd = 600; kc = 0; kexpr = lt > 1.5 ? "feliz" : "sorpresa"; kbD = 120; kcD = 40;
        if (lt > 1.5) { kbI = 150; kcI = 30; }
      } else {
        for (let k = 0; k < 7; k++) ac.push({ x: -340 + k * 113, d: 900 + cz, seed: 90 + k, ropa: VIGIL, casco: "legion", expr: "enojado", bD: 120 + Math.sin(t * 5 + k) * 30, cD: 50, bI: 120 - Math.sin(t * 5 + k) * 30, cI: 50, flip: k % 2 === 1 });
        const u = (lt * 1.6) % 1, kk = Math.floor(lt * 1.6) % 7;
        const bx = -340 + (kk + u) * 113;
        const q = P(bx, 140 + Math.sin(u * Math.PI) * 30, 900 + cz);
        extra.push(<svg key="b" style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><g transform={`translate(${q[0]} ${q[1]}) scale(${F / (900 + cz) * 1.2})`}>{BaldeM}</g></svg>);
        kx = -200; kd = 560; kc = 0; kexpr = "sorpresa"; kbD = 120; kcD = 40;
      }
      luz.push({ x: HW - 60, y: 600, d: 2600 + cz, r: 1500, fuego: true });
      extra.unshift(<Humo key="h" t={t} u={0.8} />, <Llamas key="ll" t={t} cz={cz} u={0.7} />);
      break;
    }
  }
  const kid: Ac = { x: kx, d: kd + cz - cz, h: KH, seed: 1, ropa: LUCIUS, expr: kexpr, camina: kc, mira: kmira, bD: kbD, cD: kcD, bI: kbI, cI: kcI, salta: ksalta, inclina: kinc, manoD: lam && kbD === 55 ? <Lampara t={t} on={1} /> : undefined };
  // el nene está en coordenadas de cámara (su d ya es relativo a la cámara)
  ac.push(kid);
  if (lam) luz.push({ x: kx + 40, y: 110, d: kid.d, r: osc > 0.5 ? 340 : 220 });
  return { lt, cz, ac, luz, osc, nivel, fuego, extra };
};

/** Oscuridad con huecos donde hay luz (sin anillos: el borde del hueco es transparente). */
const Negrura: React.FC<{ a: number; luces: { x: number; y: number; d: number; r: number }[]; id: string }> = ({ a, luces, id }) => a <= 0 ? null : (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <defs>
      <radialGradient id={`${id}g`}><stop offset="0" stopColor="#000" stopOpacity="1" /><stop offset="0.55" stopColor="#000" stopOpacity="0.85" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      <mask id={`${id}m`}><rect width={1920} height={1080} fill="#fff" />{luces.map((l, i) => { const q = P(l.x, l.y, l.d); return l.d > 40 && <circle key={i} cx={q[0]} cy={q[1]} r={(l.r * F) / l.d} fill={`url(#${id}g)`} />; })}</mask>
    </defs>
    <rect width={1920} height={1080} fill="#05040f" opacity={a} mask={`url(#${id}m)`} />
  </svg>
);

/** Primer plano: barril y ánforas oscuros en los bordes (profundidad). */
const Frente: React.FC<{ t: number; e: Esc; lt: number }> = ({ e, lt }) => {
  const izq = Math.round(e.t) % 2 === 0;
  const dx = -lt * 18;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <g transform={`translate(${(izq ? 90 : 1830) + dx * (izq ? 1 : -1)} 1120) scale(2.4)`} opacity={0.96}>
        <ellipse cx={0} cy={-80} rx={70} ry={90} fill="#2a1810" stroke="#0e0608" strokeWidth={6} />
        <rect x={-72} y={-130} width={144} height={14} fill="#120a06" /><rect x={-72} y={-50} width={144} height={14} fill="#120a06" />
      </g>
      <g transform={`translate(${(izq ? 1790 : 140) + dx * (izq ? -1 : 1)} 1110) scale(2)`} opacity={0.95}>
        <path d="M -40 0 Q -70 -80 -30 -150 L -20 -190 L 20 -190 L 30 -150 Q 70 -80 40 0 Z" fill="#3a1e12" stroke="#0e0608" strokeWidth={6} />
      </g>
    </svg>
  );
};

/** La escena en perspectiva vigente (o nada). Entra con barrido alternado; sale por corte. */
export const escEn = (t: number) => ESC.find((e) => t >= e.t && t < e.t + e.d);
export const Perspectiva: React.FC<{ t: number }> = ({ t }) => {
  const e = escEn(t);
  if (!e) return null;
  const pl = plan(e, t);
  const eds = edificios(Math.round(e.t * 7));
  const k = ESC.indexOf(e);
  const entra = cl(pl.lt / 0.28);
  const clip = k % 3 === 0 ? `inset(0 ${(1 - entra) * 100}% 0 0)` : k % 3 === 1 ? `inset(0 0 0 ${(1 - entra) * 100}%)` : `circle(${entra * 1300}px at 960px 540px)`;
  const sway = Math.sin(t * 0.7) * 0.35;
  const luces = [...pl.luz];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", clipPath: entra < 1 ? clip : undefined, background: "#05040f" }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${sway}deg) scale(1.03)` }}>
        <Calle t={t} e={e} cz={pl.cz} eds={eds} fuego={pl.fuego} />
        <Antorchas t={t} cz={pl.cz} eds={eds} />
        <Luces t={t} cz={pl.cz} eds={eds} extra={pl.luz} tenue={pl.osc > 0.85 ? 0.22 : 0.6} />
        <Agua t={t} nivel={pl.nivel} cz={pl.cz} />
        {pl.extra}
        <Gente t={t} ac={pl.ac} />
        {pl.nivel > 0 && <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>{pl.ac.filter((a) => a.d > 60).map((a, i) => { const q = P(a.x, pl.nivel * 0.6, a.d), hp = (F * (a.h ?? 165)) / a.d; return <g key={i}><ellipse cx={q[0]} cy={q[1]} rx={hp * 0.26} ry={hp * 0.07} fill="#3a8ea0" /><ellipse cx={q[0]} cy={q[1]} rx={hp * (0.3 + 0.05 * Math.sin(t * 4 + i))} ry={hp * 0.08} fill="none" stroke="#bff0f8" strokeWidth={3} /></g>; })}</svg>}
        <Negrura a={pl.osc} luces={luces} id={`ng${k}`} />
        <Frente t={t} e={e} lt={pl.lt} />
      </div>
      {entra < 1 && k % 3 < 2 && <div style={{ position: "absolute", top: 0, bottom: 0, width: 26, background: "#fff8e0", left: k % 3 === 0 ? `${entra * 100}%` : undefined, right: k % 3 === 1 ? `${entra * 100}%` : undefined }} />}
    </div>
  );
};
