import React from "react";
import { interpolate, Easing } from "remotion";
import { C, ent, fontFamily } from "./kit";
import { Persona, LUCIUS, CIVIL, Ropa, Expr } from "./persona";
import { ICO } from "./iconos";
import { INS, Ins, Pose, M } from "./guion07";

// Insertos: el nene "se mete" en un plano gráfico (fondo plano saturado con rayos, como el video 1 del canal)
// y actúa al lado del concepto: documento con sello, comparación, barras, pictogramas, corte de insula, laberinto, retrato.
// Entra por un iris que nace de su cabeza y vuelve a cerrarse sobre él → el mundo sigue sin corte.
const K = "#1a0d24";
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const pr = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
const Tx: React.FC<{ x: number; y: number; s?: number; col?: string; a?: "middle" | "start" | "end"; children: React.ReactNode; op?: number }> = ({ x, y, s = 48, col = C.crema, a = "middle", children, op = 1 }) => (
  <text x={x} y={y} textAnchor={a} fontFamily={fontFamily} fontWeight={700} fontSize={s} fill={col} stroke={K} strokeWidth={s * 0.18} paintOrder="stroke" opacity={op}>{children}</text>
);
const Ico: React.FC<{ k: string; x: number; y: number; s: number; disco?: string }> = ({ k, x, y, s, disco = "#fff3d6" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><circle r={104} fill={disco} stroke={K} strokeWidth={8} />{ICO[k]}</g>
);

// ── poses del nene (y de cualquiera): brazos/codos/inclinación según lo que siente
const pose = (p: Pose, lt: number): Partial<React.ComponentProps<typeof Persona>> & { expr: Expr } => {
  switch (p) {
    case "senala": return { expr: "sorpresa", bD: 105 + Math.sin(lt * 5) * 6, cD: 5, bI: 20, habla: true, mira: 0.7 };
    case "cabeza": return { expr: "miedo", bI: 150, cI: 115, bD: 150, cD: 115, ladea: Math.sin(lt * 9) * 5 };
    case "celebra": return { expr: "feliz", bI: 165 + Math.sin(lt * 10) * 10, bD: 165 - Math.sin(lt * 10) * 10, cI: 0, cD: 0, salta: Math.floor(lt / 0.9) * 0.9 };
    case "piensa": return { expr: "neutro", bD: 35, cD: 150, bI: 25, cI: 60, mira: 0.5, miraY: -0.4, ladea: 8 };
    case "tiembla": return { expr: "miedo", bI: 28, cI: 125, bD: 28, cD: 125, ladea: Math.sin(lt * 40) * 3, inclina: Math.sin(lt * 37) * 1.5 };
    case "corre": return { expr: "miedo", camina: 2.4, inclina: 12, bI: 60, bD: 60 };
    case "lee": return { expr: "neutro", bD: 70, cD: 70, bI: 50, cI: 60, mira: 0.8, miraY: 0.3 };
    case "enojo": return { expr: "enojado", bI: 40, cI: 140, bD: 40, cD: 140, salta: Math.floor(lt / 1.2) * 1.2 };
    case "triste": return { expr: "triste", bI: 4, bD: 4, inclina: 6, ladea: -10 };
    case "camina": return { expr: "neutro", camina: 1.3, mira: 0.4 };
  }
};

// ── fondos: plano saturado + rayos que giran + motas (el molde)
const Fondo: React.FC<{ t: number; col: string; col2: string }> = ({ t, col, col2 }) => (
  <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
    <rect width={1920} height={1080} fill={col} />
    <g transform={`translate(560 720) rotate(${t * 9})`}>
      {Array.from({ length: 16 }, (_, k) => <path key={k} d="M 0 0 L 2400 -240 L 2400 240 Z" transform={`rotate(${k * 22.5})`} fill={col2} opacity={k % 2 ? 0 : 0.55} />)}
    </g>
    {Array.from({ length: 26 }, (_, k) => { const u = ((t * 0.08 + k * 0.137) % 1); return <circle key={k} cx={(k * 331) % 1920} cy={1080 - u * 1180} r={5 + (k % 4) * 3} fill="#fff" opacity={0.16 * Math.sin(u * Math.PI)} />; })}
    <rect width={1920} height={1080} fill="url(#insVin)" />
    <defs><radialGradient id="insVin" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></radialGradient></defs>
  </svg>
);

// ── componentes de concepto (dibujan en 1920x1080, mitad derecha; el nene va a la izquierda)
const Doc: React.FC<{ t: number; i: Extract<Ins, { v: "doc" }> }> = ({ t, i }) => {
  const abre = pr(t, i.t + 0.15, i.t + 0.75);
  const sello = i.sello && i.tSello !== undefined ? ent(t, i.tSello, 0, { damping: 9, stiffness: 260 }) : 0;
  const H = 120 + 520 * abre;
  return (
    <g transform={`translate(1240 560) rotate(${Math.sin(t * 0.8) * 0.6})`}>
      <rect x={-430} y={-H / 2} width={860} height={H} rx={18} fill={i.bronce ? "#c98a3a" : "#f3e2b8"} stroke={K} strokeWidth={9} />
      {i.bronce && <rect x={-400} y={-H / 2 + 28} width={800} height={H - 56} rx={10} fill="none" stroke="#7a4a18" strokeWidth={6} />}
      {[-1, 1].map((d) => <rect key={d} x={-460} y={d * H / 2 - 26} width={920} height={52} rx={26} fill={i.bronce ? "#8a5a24" : "#c9a46a"} stroke={K} strokeWidth={8} />)}
      {abre > 0.9 && Array.from({ length: Math.max(0, Math.floor((H - 260) / 100) - i.lineas.length) }, (_, k) => {
        const e = pr(t, i.t + 1.0 + (i.lineas.length + k) * 0.35, i.t + 1.4 + (i.lineas.length + k) * 0.35);
        const y = -H / 2 + 130 + (i.lineas.length + k) * 100;
        return <g key={`r${k}`} opacity={e * 0.5}>{[0, 1].map((f) => <rect key={f} x={-370} y={y - 34 + f * 40} width={(f ? 420 + ((k * 97) % 260) : 700 - ((k * 61) % 180)) * e} height={14} rx={7} fill={i.bronce ? "#5a3410" : "#9a7a4a"} />)}</g>;
      })}
      {abre > 0.9 && (
        <g transform={`translate(-330 ${H / 2 + 70}) scale(${0.8 * ent(t, i.t + 1.2, 0, { damping: 10, stiffness: 200 })})`}>
          <path d="M 0 -70 C 40 -72 72 -40 70 0 C 74 44 38 72 0 70 C -42 74 -72 40 -70 0 C -74 -40 -40 -70 0 -70 Z" fill="#b0202e" stroke={K} strokeWidth={6} />
          <circle r={46} fill="none" stroke="#7a1018" strokeWidth={5} />
          <text y={14} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={34} fill="#ffd9a0">SPQR</text>
          <path d="M -30 66 L -44 120 L -20 106 L -8 128 L 6 70 Z" fill="#b0202e" stroke={K} strokeWidth={5} />
        </g>
      )}
      {abre > 0.9 && i.lineas.map(([lt0, txt], k) => {
        const lt = Math.min(lt0, i.t + 0.9 + k * 0.6);
        const e = pr(t, lt, lt + 0.45);
        if (e <= 0) return null;
        const y = -H / 2 + 130 + k * 100;
        return (
          <g key={k} opacity={e} transform={`translate(${(1 - e) * 30} 0)`}>
            <text x={-370} y={y} fontFamily={fontFamily} fontWeight={700} fontSize={k === 0 && i.encabezado ? 60 : 52} fill={i.bronce ? "#2a1608" : "#3a2410"}>{txt}</text>
            <line x1={-370} y1={y + 18} x2={-370 + Math.min(760, txt.length * 31) * e} y2={y + 18} stroke={i.bronce ? "#5a3410" : "#c9a46a"} strokeWidth={4} />
          </g>
        );
      })}
      {sello > 0.02 && (
        <g transform={`translate(250 ${H / 2 - 120}) rotate(-14) scale(${2.4 - 1.4 * sello})`} opacity={cl(sello * 1.4)}>
          <rect x={-190} y={-62} width={380} height={124} rx={14} fill="none" stroke={C.rojo} strokeWidth={12} />
          <text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={64} fill={C.rojo}>{i.sello}</text>
        </g>
      )}
    </g>
  );
};

const Vs: React.FC<{ t: number; i: Extract<Ins, { v: "vs" }> }> = ({ t, i }) => (
  <g>
    {[i.a, i.b].map((c, k) => {
      const t0 = k ? i.tb ?? i.t + 0.9 : i.t + 0.25;
      const e = ent(t, t0, 0, { damping: 11, stiffness: 170 });
      const x = k ? 1560 : 1000;
      const mal = (k === 1 && i.gana === "a") || (k === 0 && i.gana === "b");
      const tMarca = i.tMarca ?? i.t1 - 1.2;
      const m = pr(t, tMarca, tMarca + 0.35);
      return (
        <g key={k} transform={`translate(${x} 560) scale(${e}) rotate(${(k ? 3 : -3) + Math.sin(t * 1.3 + k) * 1})`}>
          <rect x={-240} y={-300} width={480} height={600} rx={30} fill={k ? "#fff3d6" : "#fff3d6"} stroke={K} strokeWidth={10} />
          <rect x={-240} y={-300} width={480} height={110} rx={30} fill={c.col ?? (k ? C.rojo : C.teal)} stroke={K} strokeWidth={10} />
          <Tx x={0} y={-226} s={50} col="#fff">{c.titulo}</Tx>
          <Ico k={c.ico} x={0} y={-30} s={1.05} />
          {c.lineas.map((l, j) => <text key={j} x={0} y={140 + j * 58} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={c.lineas.length > 1 ? 42 : 50} fill={K}>{l}</text>)}
          {i.gana && m > 0 && (mal
            ? <g stroke={C.rojo} strokeWidth={24} strokeLinecap="round" opacity={0.92}><line x1={-110} y1={-140} x2={-110 + 220 * Math.min(1, m * 2)} y2={-140 + 220 * Math.min(1, m * 2)} />{m > 0.5 && <line x1={110} y1={-140} x2={110 - 220 * (m - 0.5) * 2} y2={-140 + 220 * (m - 0.5) * 2} />}</g>
            : <path d="M 130 -150 L 175 -105 L 250 -200" stroke={C.lima} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${m} 1`} />)}
        </g>
      );
    })}
    <g transform={`translate(1280 560) scale(${ent(t, i.tb ?? i.t + 0.9, 0.15, { damping: 8, stiffness: 240 })}) rotate(-8)`}>
      <path d="M -70 -90 L 40 -90 L 0 -10 L 80 -10 L -50 110 L -10 20 L -90 20 Z" fill={C.ambar} stroke={K} strokeWidth={8} />
      <Tx x={0} y={18} s={56} col="#fff">VS</Tx>
    </g>
  </g>
);

const Barras: React.FC<{ t: number; i: Extract<Ins, { v: "barras" }> }> = ({ t, i }) => {
  const max = Math.max(...i.items.map((b) => b[1]), 1);
  const n = i.items.length;
  const W = 820, x0 = 860;
  const bw = Math.min(200, (W - (n - 1) * 50) / n);
  return (
    <g>
      <line x1={x0 - 30} y1={860} x2={x0 + W + 40} y2={860} stroke={K} strokeWidth={10} strokeLinecap="round" />
      {i.items.map(([lab, val, col, ico], k) => {
        const t0 = i.tItems?.[k] ?? i.t + 0.4 + k * 0.45;
        const u = pr(t, t0, t0 + 0.9);
        const h = (val / max) * 430 * u;
        const x = x0 + k * (bw + 50);
        const v = Math.round(val * u);
        return (
          <g key={k}>
            <rect x={x} y={860 - Math.max(h, 6)} width={bw} height={Math.max(h, 6)} rx={14} fill={col} stroke={K} strokeWidth={8} />
            <rect x={x + 14} y={860 - Math.max(h, 6) + 12} width={16} height={Math.max(0, h - 30)} rx={8} fill="#fff" opacity={0.3} />
            {u > 0.05 && <Tx x={x + bw / 2} y={860 - h - 30} s={58}>{`${i.pre ?? ""}${v.toLocaleString("en-US")}${i.suf ?? ""}`}</Tx>}
            {ico && u > 0.05 && <Ico k={ico} x={x + bw / 2} y={860 - h - 150} s={0.5} />}
            <Tx x={x + bw / 2} y={920} s={n > 3 ? 34 : 40}>{lab}</Tx>
          </g>
        );
      })}
    </g>
  );
};

const Pictos: React.FC<{ t: number; i: Extract<Ins, { v: "pictos" }> }> = ({ t, i }) => {
  const cols = i.cols ?? 10, n = i.n;
  const u = pr(t, i.t + 0.3, (i.tFin ?? i.t1 - 1));
  const vis = Math.floor(u * n + 0.0001);
  const valor = Math.round((i.de ?? 0) + ((i.a ?? n) - (i.de ?? 0)) * u);
  const paso = Math.min(86, 800 / cols);
  return (
    <g>
      {Array.from({ length: n }, (_, k) => {
        const x = 900 + (k % cols) * paso + paso / 2, y = 380 + Math.floor(k / cols) * paso;
        const on = i.baja ? k >= n - vis : k < vis;
        const e = i.baja ? 1 : on ? 1 : 0;
        return <g key={k} transform={`translate(${x} ${y}) scale(${e * (paso / 240)})`} opacity={i.baja && !on ? 1 : 1}><circle r={104} fill={i.baja && on ? "#3a2a44" : "#fff3d6"} stroke={K} strokeWidth={10} />{(!i.baja || !on) && ICO[i.ico]}</g>;
      })}
      <Tx x={1300} y={300} s={120} col={i.col ?? C.ambar}>{`${i.pre ?? ""}${valor.toLocaleString("en-US")}${i.suf ?? ""}`}</Tx>
    </g>
  );
};

// corte transversal de una insula de 5 pisos (tienda abajo, pobres arriba)
const PISOS = ["SHOP", "1ST · RICH", "2ND", "3RD", "4TH", "5TH · POOR"];
const Corte: React.FC<{ t: number; i: Extract<Ins, { v: "corte" }> }> = ({ t, i }) => {
  const x0 = 900, W = 600, PH = 128, y0 = 960;
  const fuego = i.modo === "fuego" ? pr(t, i.tFuego ?? i.t + 1, (i.tFuego ?? i.t + 1) + (i.durFuego ?? 4)) * 6 : 0;
  const dib = pr(t, i.t + 0.1, i.t + 1.2);
  return (
    <g>
      {PISOS.map((n, k) => {
        const y = y0 - (k + 1) * PH;
        const e = cl(dib * 6 - k);
        const arde = fuego - k;
        return (
          <g key={k} opacity={e} transform={`translate(0 ${(1 - e) * 40})`}>
            <rect x={x0} y={y} width={W} height={PH} fill={k === 0 ? "#b5674a" : k === 1 ? "#d9a679" : ["#a87a5a", "#9a6a52", "#8c5e4c", "#7a5248"][(k - 2) % 4]} stroke={K} strokeWidth={8} />
            <rect x={x0 + 30} y={y + 30} width={70} height={74} fill={arde > 0 ? "#ff8a2a" : "#ffcf6a"} stroke={K} strokeWidth={6} />
            {i.modo === "materiales" && <g>{Array.from({ length: 9 }, (_, j) => <rect key={j} x={x0 + 130 + j * 56} y={y + PH - 22} width={50} height={16} fill="#8a5a2c" stroke={K} strokeWidth={3} />)}</g>}
            {/* gente en cada piso */}
            {k > 0 && <g transform={`translate(${x0 + 230 + (k % 2) * 160 - 300 * 112 / 560} ${y + PH - 8 - 640 * 112 / 560})`}><Persona x={0} y={0} h={112} t={t} seed={200 + k} ropa={CIVIL(k)} expr={arde > 0.3 ? "miedo" : k === 5 && i.modo === "fuego" ? "dormido" : "neutro"} bI={arde > 0.3 ? 150 : undefined} bD={arde > 0.3 ? 150 : undefined} /></g>}
            {arde > 0 && Array.from({ length: 6 }, (_, j) => { const h = PH * 0.85 * cl(arde) * (0.6 + 0.4 * Math.sin(t * 8 + j * 1.9 + k)); const fx = x0 + 60 + j * 100; return <path key={j} d={`M ${fx - 40} ${y + PH} Q ${fx - 30} ${y + PH - h * 0.6} ${fx} ${y + PH - h} Q ${fx + 30} ${y + PH - h * 0.6} ${fx + 40} ${y + PH} Z`} fill={j % 2 ? "#ff8a2a" : "#ffd23a"} opacity={0.9} />; })}
            <Tx x={x0 + W + 30} y={y + PH / 2 + 16} s={40} a="start" col={k === 5 ? C.rosa : C.crema}>{i.etiquetas?.[k] ?? n}</Tx>
          </g>
        );
      })}
      <path d={`M ${x0 - 30} ${y0 - 6 * PH} L ${x0 + W / 2} ${y0 - 6 * PH - 110} L ${x0 + W + 30} ${y0 - 6 * PH} Z`} fill="#b5452c" stroke={K} strokeWidth={8} opacity={dib} />
      {/* humo cuando arde */}
      {fuego > 0.5 && Array.from({ length: 10 }, (_, j) => { const u = ((t * 0.5 + j * 0.1) % 1); return <circle key={j} cx={x0 + 200 + j * 30 + u * 120} cy={y0 - fuego * PH - u * 300} r={40 + u * 70} fill="#5a4a5a" opacity={0.45 * (1 - u)} />; })}
      {/* lo que se tira por la ventana: arco y estallido en la calle */}
      {i.modo === "tira" && (() => {
        const ts = i.tTira ?? i.t + 1.4;
        const u = cl((t - ts) / 1.1);
        if (t < ts) return null;
        const sx = x0 + 65, sy = y0 - 5.6 * PH, ex = x0 - 260, ey = y0 - 20;
        const x = sx + (ex - sx) * u, y = sy + (ey - sy) * u * u;
        return (
          <g>
            <path d={`M ${sx} ${sy} Q ${sx - 60} ${sy + 80} ${x} ${y}`} stroke="#fff" strokeWidth={6} strokeDasharray="16 14" fill="none" opacity={0.7} />
            {u < 1 ? <g transform={`translate(${x} ${y}) rotate(${u * 400}) scale(0.5)`}>{ICO[i.objeto ?? "orinal"]}</g>
              : Array.from({ length: 10 }, (_, j) => { const s = t - ts - 1.1; return <circle key={j} cx={ex + Math.cos(j * 0.7) * (40 + s * 300)} cy={ey - Math.abs(Math.sin(j * 1.3)) * (30 + s * 200) + s * s * 300} r={14} fill="#b09a3a" opacity={cl(1 - s)} />; })}
          </g>
        );
      })()}
    </g>
  );
};

// mapa cenital de callejones: todos iguales, el nene como punto que se pierde
const Laberinto: React.FC<{ t: number; i: Extract<Ins, { v: "laberinto" }> }> = ({ t, i }) => {
  const N = 7, P = 104, x0 = 900, y0 = 220;
  const cam = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [1, 2], [1, 3], [2, 3], [3, 3], [3, 2], [4, 2], [4, 3], [4, 4], [3, 4], [3, 5], [2, 5], [2, 4], [1, 4], [1, 5], [0, 5], [0, 6]];
  const lt = t - i.t - 0.6;
  const u = cl(lt / Math.max(1, i.t1 - i.t - 1.2)) * (cam.length - 1);
  const a = cam[Math.floor(u)], b = cam[Math.min(cam.length - 1, Math.floor(u) + 1)], f = u % 1;
  const px = x0 + (a[0] + (b[0] - a[0]) * f) * P + P / 2, py = y0 + (a[1] + (b[1] - a[1]) * f) * P + P / 2;
  const dib = pr(t, i.t + 0.1, i.t + 0.9);
  return (
    <g>
      <rect x={x0 - 20} y={y0 - 20} width={N * P + 40} height={N * P + 40} rx={20} fill="#3a2a4a" stroke={K} strokeWidth={8} opacity={dib} />
      {Array.from({ length: N * N }, (_, k) => {
        const cx = k % N, cy = Math.floor(k / N);
        if ((cx + cy * 3) % 4 === 0) return null;
        return <rect key={k} x={x0 + cx * P + 14} y={y0 + cy * P + 14} width={P - 28} height={P - 28} rx={8} fill="#8a5a6a" stroke={K} strokeWidth={5} opacity={cl(dib * 3 - (k % 7) * 0.2)} />;
      })}
      {/* rastro */}
      <path d={cam.slice(0, Math.floor(u) + 1).map((c, k) => `${k ? "L" : "M"} ${x0 + c[0] * P + P / 2} ${y0 + c[1] * P + P / 2}`).join(" ") + ` L ${px} ${py}`} stroke={C.ambar} strokeWidth={8} strokeDasharray="14 12" fill="none" />
      <circle cx={px} cy={py} r={22 + Math.sin(t * 8) * 3} fill={C.rojo} stroke="#fff" strokeWidth={6} />
      {i.pines.map(([tp, ico, lab, cx, cy], k) => {
        const e = ent(t, tp, 0, { damping: 10, stiffness: 200 });
        return <g key={k} transform={`translate(${x0 + cx * P + P / 2} ${y0 + cy * P + P / 2 - 60}) scale(${e})`}><path d="M 0 60 L -26 0 A 34 34 0 1 1 26 0 Z" fill={C.teal} stroke={K} strokeWidth={6} /><g transform="translate(0 -14) scale(0.3)">{ICO[ico]}</g><Tx x={0} y={-62} s={32}>{lab}</Tx></g>;
      })}
      {lt > 1 && <Tx x={x0 + N * P / 2} y={y0 + N * P + 80} s={44} col={C.ambar} op={pr(t, i.t + 1.4, i.t + 1.8)}>{i.pie}</Tx>}
    </g>
  );
};

const Retrato: React.FC<{ t: number; i: Extract<Ins, { v: "retrato" }>; parte: "fondo" | "frente" }> = ({ t, i, parte }) => {
  const e = ent(t, i.t + 0.2, 0, { damping: 10, stiffness: 150 });
  const rot = Math.sin(t * 0.9) * 1.5;
  if (parte === "fondo") return (
    <g transform={`translate(1200 500) scale(${e}) rotate(${rot})`}>
      <circle r={270} fill={C.oro} stroke={K} strokeWidth={12} />
      <circle r={236} fill={i.fondo ?? "#6d4466"} stroke={K} strokeWidth={6} />
    </g>
  );
  return (
    <g>
      {i.laurel && <g transform={`translate(1200 500) scale(${e}) rotate(${rot})`}>{Array.from({ length: 9 }, (_, k) => { const a = -2.9 + k * 0.33; const x = Math.cos(a) * 120, y = Math.sin(a) * 60 - 150; return <ellipse key={k} cx={x} cy={y} rx={30} ry={13} fill="#6fae4a" stroke={K} strokeWidth={4} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />; })}</g>}
      <g transform={`translate(1200 830) scale(${ent(t, i.t + 0.5)})`}>
        <path d="M -380 -50 L 380 -50 L 420 0 L 380 50 L -380 50 L -420 0 Z" fill={C.rojo} stroke={K} strokeWidth={9} />
        <Tx x={0} y={18} s={i.nombre.length > 22 ? 44 : 56} col="#fff">{i.nombre}</Tx>
      </g>
      {i.datos.map(([td, txt], k) => {
        const e2 = ent(t, td, 0, { damping: 11, stiffness: 190 });
        return <g key={k} transform={`translate(1200 ${948 + k * 62}) scale(${e2})`}><Tx x={0} y={0} s={42} col={C.crema}>{txt}</Tx></g>;
      })}
      {i.ico && <g transform={`translate(1560 300) scale(${ent(t, i.tIco ?? i.t + 0.9)}) rotate(${Math.sin(t * 3) * 8})`}><Ico k={i.ico} x={0} y={0} s={0.85} /></g>}
    </g>
  );
};
const RetratoCara: React.FC<{ t: number; i: Extract<Ins, { v: "retrato" }> }> = ({ t, i }) => {
  const e = ent(t, i.t + 0.2, 0, { damping: 10, stiffness: 150 });
  return (
    <div style={{ position: "absolute", left: 1200 - 236, top: 500 - 236, width: 472, height: 472, borderRadius: "50%", overflow: "hidden", transform: `scale(${e}) rotate(${Math.sin(t * 0.9) * 1.5}deg)` }}>
      <Persona x={236} y={236 + 620} h={900} t={t} seed={i.seed ?? 300} ropa={i.ropa ?? CIVIL(2)} expr={i.expr ?? "orgullo"} habla={i.habla ?? true} viejo={i.viejo} casco={i.casco} />
    </div>
  );
};

const Linea: React.FC<{ t: number; i: Extract<Ins, { v: "linea" }> }> = ({ t, i }) => {
  const x0 = 860, x1 = 1660, y = 600;
  const dib = pr(t, i.t + 0.2, i.t + 1);
  const r = pr(t, i.tRango ?? i.t + 1.2, (i.tRango ?? i.t + 1.2) + 0.8);
  const ra = x0 + (x1 - x0) * i.rango[0], rb = x0 + (x1 - x0) * i.rango[1];
  return (
    <g>
      <line x1={x0} y1={y} x2={x0 + (x1 - x0) * dib} y2={y} stroke={C.crema} strokeWidth={14} strokeLinecap="round" />
      <rect x={ra} y={y - 70} width={(rb - ra) * r} height={140} rx={20} fill={C.rojo} stroke={K} strokeWidth={6} />
      {r > 0.6 && <Tx x={(ra + rb) / 2} y={y + 18} s={56} col="#fff">{i.rotulo}</Tx>}
      {i.marcas.map(([u, ico, lab], k) => {
        const e = ent(t, i.t + 0.4 + k * 0.3);
        const x = x0 + (x1 - x0) * u;
        return <g key={k} transform={`translate(${x} ${y})`}><g transform={`translate(0 -190) scale(${e})`}><Ico k={ico} x={0} y={0} s={0.55} /></g><Tx x={0} y={150} s={38} op={e}>{lab}</Tx><line x1={0} y1={-30} x2={0} y2={30} stroke={C.crema} strokeWidth={8} /></g>;
      })}
      {i.extra && <Tx x={(x0 + x1) / 2} y={y + 300} s={50} col={C.lima} op={pr(t, i.extra[0], i.extra[0] + 0.4)}>{i.extra[1]}</Tx>}
    </g>
  );
};


// CTA: suscribirse (clic de verdad), campana que suena, próxima noche y las 7 trampas para comentar
const TRAMPAS = ["farol", "rueda", "orinal", "daga", "olas", "llama", "cubo"];
const Cta: React.FC<{ t: number }> = ({ t }) => {
  const sb = ent(t, M.suscribe - 0.2, 0, { damping: 10, stiffness: 190 });
  const clic = M.suscribe + 0.9;
  const hecho = t > clic;
  const pres = t > clic && t < clic + 0.15 ? 0.92 : 1;
  const cur = pr(t, M.suscribe + 0.2, clic);
  const bell = t > M.campana ? Math.sin((t - M.campana) * 18) * 20 * Math.exp(-(t - M.campana) * 2) : 0;
  const prox = ent(t, M.proximo, 0, { damping: 12, stiffness: 150 }) * (1 - pr(t, M.cual - 0.3, M.cual));
  return (
    <g>
      <g transform={`translate(1180 330) scale(${sb * pres})`}>
        <rect x={-320} y={-90} width={640} height={180} rx={90} fill={hecho ? "#5a5a6a" : C.rojo} stroke={K} strokeWidth={10} />
        <Tx x={0} y={30} s={hecho ? 76 : 92} col="#fff">{hecho ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</Tx>
      </g>
      {sb > 0.5 && t < clic + 0.6 && <g transform={`translate(${1500 - cur * 290} ${520 - cur * 150})`}><path d="M 0 0 L 0 80 L 20 62 L 36 96 L 50 90 L 34 56 L 62 56 Z" fill="#fff" stroke={K} strokeWidth={6} /></g>}
      <g transform={`translate(1640 330) scale(${ent(t, M.campana - 0.3)}) rotate(${bell})`}>
        <path d="M -70 56 Q -70 -70 0 -80 Q 70 -70 70 56 L 88 80 L -88 80 Z" fill={C.oro} stroke={K} strokeWidth={9} />
        <circle cx={0} cy={98} r={20} fill={C.oro} stroke={K} strokeWidth={7} />
        {t > M.campana && [-1, 1].map((d) => <path key={d} d={`M ${d * 110} -40 q ${d * 24} 40 0 80`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" opacity={cl(1 - (t - M.campana) / 1.5)} />)}
      </g>
      {prox > 0.01 && <g transform={`translate(1330 700) scale(${prox})`}>
        <rect x={-430} y={-150} width={860} height={300} rx={30} fill="#2a1d44" stroke={K} strokeWidth={10} />
        {[[-330, 170], [-250, 210], [-170, 180]].map(([x, h], k) => <g key={k}><rect x={x} y={90 - h} width={36} height={h} fill="#6a5070" stroke={K} strokeWidth={5} />{Array.from({ length: 4 }, (_, j) => { const u = (t * 0.6 + j * 0.25 + k * 0.13) % 1; return <circle key={j} cx={x + 18 + u * 60} cy={90 - h - 20 - u * 120} r={14 + u * 26} fill="#a898b0" opacity={0.6 * (1 - u)} />; })}</g>)}
        <rect x={-380} y={10} width={290} height={80} fill="#4a3448" stroke={K} strokeWidth={5} />
        {Array.from({ length: 5 }, (_, k) => <rect key={k} x={-366 + k * 56} y={30} width={34} height={40} fill={Math.sin(t * 3 + k) > -0.3 ? "#ffcf6a" : "#2a1a20"} />)}
        <Tx x={150} y={-30} s={46} col={C.crema}>NEXT NIGHT:</Tx>
        <Tx x={150} y={40} s={50} col={C.ambar}>THE VICTORIAN</Tx>
        <Tx x={150} y={104} s={50} col={C.ambar}>FACTORY</Tx>
      </g>}
      {t > M.cual - 0.3 && <Tx x={1300} y={620} s={64} col={C.ambar} op={pr(t, M.cual - 0.3, M.cual + 0.1)}>WHICH TRAP GETS YOU FIRST?</Tx>}
      {t > M.cual && TRAMPAS.map((k, j) => {
        const e = ent(t, M.cual + 0.2 + j * 0.22, 0, { damping: 9, stiffness: 220 });
        return <g key={k} transform={`translate(${850 + j * 150} 780) scale(${e})`}><Ico k={k} x={0} y={0} s={0.62} /><Tx x={0} y={120} s={44}>{`${j + 1}`}</Tx></g>;
      })}
    </g>
  );
};

export const PALETA: Record<string, [string, string]> = {
  rojo: ["#d62f45", "#ee4a5f"], azul: ["#2948b8", "#3b5fd6"], teal: ["#139aa8", "#22b5c2"], violeta: ["#5b2bb5", "#7444cf"], ambar: ["#e8921a", "#f7aa33"],
  verde: ["#3f8f3a", "#55aa4c"], rosa: ["#e0507e", "#f06a94"], noche: ["#21184f", "#2f2470"], naranja: ["#e2602a", "#f37a42"],
};

// inserto pegado al siguiente: no cierra el iris (el siguiente abre encima) → nunca asoma la calle entre los dos
const sigue = (i: Ins) => INS.some((j) => j !== i && j.t >= i.t1 - 0.6 && j.t <= i.t1 + 0.6);
const finDe = (i: Ins) => { const j = INS.find((k) => k !== i && k.t >= i.t1 - 0.6 && k.t <= i.t1 + 0.6); return j ? j.t + 0.45 : i.t1 + 0.45; };
export const insEn = (t: number) => INS.find((i) => t >= i.t && t < finDe(i));

/** Los insertos vigentes (o nada). px/py = cabeza del nene en pantalla, de donde nace el iris. */
export const Inserto: React.FC<{ t: number; px: number; py: number; sopa?: boolean }> = (p) => (
  <>{INS.filter((i) => p.t >= i.t && p.t < finDe(i)).map((i) => <Uno key={i.t} i={i} {...p} />)}</>
);
const Uno: React.FC<{ i: Ins; t: number; px: number; py: number; sopa?: boolean }> = ({ i, t, px, py, sopa }) => {
  const abre = interpolate(t, [i.t, i.t + 0.36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cierra = sigue(i) ? 1 : interpolate(t, [i.t1, i.t1 + 0.42], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const R = 2300 * Math.min(abre, cierra);
  if (R <= 1) return null;
  const [c1, c2] = PALETA[i.fondo] ?? PALETA.violeta;
  const lt = t - i.t;
  const ps = pose(i.pose, lt);
  const tituloE = ent(t, i.t + 0.25, 0, { damping: 11, stiffness: 190 });
  // OJO v3: rompe la plantilla: uno sí y uno no, el nene a la derecha y el componente corrido a la izquierda
  const espejo = i.v !== "cta" && !i.otro && i.nx === undefined && INS.indexOf(i) % 2 === 1;
  const NX = i.nx ?? (espejo ? 1500 : 420);
  const DX = espejo ? -560 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `circle(${R}px at ${px}px ${py}px)` }}>
      <Fondo t={t} col={c1} col2={c2} />
      {/* el nene grande, actuando */}
      <Persona x={NX + (i.pose === "corre" ? Math.sin(lt * 1.3) * 40 : 0)} y={1010} h={600} t={t} seed={1} ropa={LUCIUS} {...ps} flip={espejo || undefined} />
      {sopa && <svg style={{ position: "absolute", left: NX - 150, top: 1010 - 600, overflow: "visible" }} width={300} height={600} viewBox="-150 -560 300 560"><g transform="scale(2.074)">
        <path d="M -40 -262 Q -30 -282 0 -284 Q 30 -282 40 -262 Q 30 -256 22 -262 Q 10 -254 0 -262 Q -12 -254 -24 -262 Q -32 -256 -40 -262 Z" fill="#d9a83a" stroke="#8a5a18" strokeWidth={3} />
        <path d={`M -44 -258 Q -50 -230 -46 ${-206 + ((t * 20) % 10)}`} stroke="#d9a83a" strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d={`M 44 -256 Q 50 -232 46 ${-212 + ((t * 24) % 10)}`} stroke="#d9a83a" strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d="M 12 -282 l 14 -8 l 6 10 l -14 6 Z" fill="#4fa85a" /><path d="M -22 -280 l 10 -10 l 8 8 l -12 8 Z" fill="#3f8f4a" />
        <path d="M -30 -150 Q -10 -158 6 -146 L 4 -96 Q 0 -86 -4 -96 L -6 -130 Q -20 -124 -24 -132 Z" fill="#d9a83a" stroke="#8a5a18" strokeWidth={3} opacity={0.85} />
      </g></svg>}
      {i.otro && <Persona x={i.otro.x} y={1010} h={i.otro.h ?? 520} t={t} seed={i.otro.seed ?? 400} ropa={i.otro.ropa ?? CIVIL(1)} {...pose(i.otro.pose, lt)} flip={i.otro.flip} />}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}><g transform={`translate(${DX} 0)`}>
        {i.v === "doc" && <Doc t={t} i={i} />}
        {i.v === "vs" && <Vs t={t} i={i} />}
        {i.v === "barras" && <Barras t={t} i={i} />}
        {i.v === "pictos" && <Pictos t={t} i={i} />}
        {i.v === "corte" && <Corte t={t} i={i} />}
        {i.v === "laberinto" && <Laberinto t={t} i={i} />}
        {i.v === "retrato" && <Retrato t={t} i={i} parte="fondo" />}
        {i.v === "linea" && <Linea t={t} i={i} />}
        {i.v === "cta" && <Cta t={t} />}
      </g></svg>
      {i.v === "retrato" && <div style={{ position: "absolute", inset: 0, transform: `translateX(${DX}px)` }}><RetratoCara t={t} i={i} /></div>}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1920} height={1080}>
        {i.v === "retrato" && <g transform={`translate(${DX} 0)`}><Retrato t={t} i={i} parte="frente" /></g>}
        <g transform={`translate(960 118) scale(${tituloE})`}>
          <Tx x={0} y={0} s={i.tamTitulo ?? 92} col="#fff">{i.titulo}</Tx>
        </g>
      </svg>
      {R < 2200 && <div style={{ position: "absolute", left: px - R, top: py - R, width: R * 2, height: R * 2, borderRadius: "50%", border: "14px solid #fff8e0", boxSizing: "border-box" }} />}
    </div>
  );
};
export type { Ropa };
