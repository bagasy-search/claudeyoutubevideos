// cl2mezcla · componentes de Don Ramón al cierre (el balde con la raya, el cemento de más, el escalón de treinta años, las
// bolsas por rayos, las etiquetas del corralón, los cloruros y el hierro, la receta por trabajo, el cortafierro, los hilitos
// del polímero, el vaso en el agua, el ticket, el hilo de respuestas, pelo o abierta, la bolsa en alto, el grumo, qué
// arreglás). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, BODY, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, num, shake } from "./kit";
import { Balde, Bolsa, Gota } from "./comps1";

const mk = (m: Record<string, number>, k: string, d: number) => m[k] ?? d;

// 39 · el balde de Ramón: la raya de brea a un cuarto; cemento hasta la raya, arena hasta arriba; queda «1 : 3»
export const BaldeRamon: React.FC<FxP> = ({ t, a, m }) => {
  const ra = mk(m, "raya", a + 1), ce = mk(m, "cem", ra + 2.5), ar = mk(m, "are", ce + 1.2);
  const lc = 0.25 * e(t, ce, ce + 0.8), la = 0.75 * e(t, ar, ar + 1.2);
  return (
    <>
      <Svg>
        <defs><clipPath id="bram"><path d="M720,300 L782,860 L1138,860 L1200,300 Z" /></clipPath></defs>
        <g clipPath="url(#bram)">
          <rect x={700} y={860 - 560 * lc} width={520} height={560 * lc} fill="#8f8b83" />
          <rect x={700} y={860 - 560 * (lc + la)} width={520} height={560 * la} fill={C.sand} />
        </g>
        <Balde x={960} y={860} w={480} h={560} raya={e(t, ra, ra + 0.6) > 0.5 ? 0.25 : undefined} />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={760 + hash(i, 1) * 400} y1={360 + hash(i, 2) * 480} x2={780 + hash(i, 1) * 400} y2={370 + hash(i, 2) * 480} stroke="rgba(255,255,255,.12)" strokeWidth={4} />)}
      </Svg>
      <Lbl t={t} at={ra + 0.3} text="la raya de brea" x={1500} y={720} col={C.honey} size={52} />
      <Pop t={t} at={ar + 1.4} x={1500} y={420}><Big size={150} col={C.ink}>1 : 3</Big></Pop>
      <Lbl t={t} at={ar + 1.8} text="sin medir nada" x={1500} y={560} col={C.dim} size={44} />
    </>
  );
};

// 40 · el cemento de más: cada palada extra sube el precio y la raja a la vez; cae la frase de Ramón
export const CementoDeMas: React.FC<FxP> = ({ t, a, b }) => {
  const pal = Math.floor(5 * e(t, a + 0.6, a + 3.2)), qa = Math.min(b - 2, a + 3.4);
  return (
    <>
      <Svg>
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={360} y={760 - i * 90} width={300} height={80} rx={8} fill="#8f8b83" opacity={pal > i ? 1 : 0.12} stroke="#55524d" strokeWidth={3} />)}
        <g transform="translate(1000,0)">
          <rect x={0} y={260} width={70} height={520} rx={35} fill="rgba(255,255,255,.08)" /><rect x={0} y={780 - 104 * pal} width={70} height={104 * pal} rx={35} fill={C.honey} />
          <rect x={260} y={260} width={70} height={520} rx={35} fill="rgba(255,255,255,.08)" /><rect x={260} y={780 - 104 * pal} width={70} height={104 * pal} rx={35} fill={C.red} />
          <text x={35} y={840} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={60} fill={C.honey}>$</text>
          <path d="M295,820 l-20,20 l30,10 l-20,24" stroke={C.red} strokeWidth={6} fill="none" />
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="más cemento" x={510} y={900} col={C.cem} size={52} />
      {t > qa && <Pop t={t} at={qa} x={1100} y={160}><div style={{ background: "#f2e3bf", color: "#2a2418", fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "20px 36px", borderRadius: 24, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>«más cara y más rajada»</div></Pop>}
    </>
  );
};

// 41 · el escalón de treinta años: los años corren, pasa la lluvia y el sol, y las esquinas siguen enteras
export const EscalonTreinta: React.FC<FxP> = ({ t, a, b }) => {
  const k = e(t, a + 0.5, b - 1), yr = Math.round(lerp(1994, 2026, k)), rain = Math.sin(k * Math.PI * 6) > 0.3;
  return (
    <>
      <Svg>
        <path d="M360,820 L1560,820 L1560,700 L1260,700 L1260,580 L960,580 L960,460 L660,460 L660,820 Z" fill="#9a958d" stroke="#5f5b55" strokeWidth={6} />
        {[[660, 460], [960, 580], [1260, 700]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={30} fill="none" stroke={C.ok} strokeWidth={5} opacity={e(t, b - 1.6, b - 1.2)} />)}
        {rain && Array.from({ length: 30 }, (_, i) => { const u = ((t * 1.8 + hash(i, 1)) % 1); return <line key={i} x1={400 + hash(i, 2) * 1200} x2={392 + hash(i, 2) * 1200} y1={120 + u * 380} y2={150 + u * 380} stroke={C.water} strokeWidth={4} opacity={0.6} />; })}
      </Svg>
      <Pop t={t} at={a + 0.3} x={1460} y={300}><Big size={140} col={C.ink}>{`${yr}`}</Big></Pop>
      <Lbl t={t} at={b - 1.4} text="ni una esquina rota" x={960} y={930} col={C.ok} size={56} />
    </>
  );
};

// 42 · las dos bolsas por rayos: el portland es todo cemento; la de albañilería trae caliza molida y burbujitas de aire
export const RayosBolsa: React.FC<FxP> = ({ t, a, m }) => {
  const po = mk(m, "port", a + 0.6), al = mk(m, "alba", po + 3), bu = mk(m, "burb", al + 2), xr = (k: number) => e(t, k, k + 0.6);
  const inside = (x: number, k: number, mix: boolean) => <g opacity={xr(k)}><rect x={x - 120} y={420} width={240} height={300} rx={14} fill="#121a22" />{Array.from({ length: 70 }, (_, i) => { const lime = mix && hash(i, 7) < 0.35; return <circle key={i} cx={x - 105 + hash(i, 1) * 210} cy={435 + hash(i, 2) * 270} r={lime ? 9 : 7} fill={lime ? "#f1efe6" : "#8f8b83"} />; })}{mix && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={x - 100 + hash(i, 4) * 200} cy={440 + hash(i, 5) * 260} r={14 * e(t, bu, bu + 0.6)} fill="none" stroke={C.water} strokeWidth={3} />)}</g>;
  return (
    <>
      <Svg>
        <Bolsa x={560} y={570} s={1.2} txt="PORTLAND" o={1 - 0.75 * xr(po)} />
        <Bolsa x={1360} y={570} s={1.2} txt="ALBAÑILERÍA" band={C.cemf} o={1 - 0.75 * xr(al)} />
        {inside(560, po, false)}{inside(1360, al, true)}
      </Svg>
      <Lbl t={t} at={po + 0.6} text="da fuerza" x={560} y={900} col={C.ok} size={60} />
      <Lbl t={t} at={al + 0.8} text="caliza y aire" x={1360} y={900} col={C.honey} size={60} />
      <Lbl t={t} at={bu + 0.8} text="más cremosa, menos fuerte" x={1360} y={220} col={C.dim} size={44} />
    </>
  );
};

// 43 · el corralón: dos pilas de bolsas en el estante y sus etiquetas, que cambian el nombre según el país
export const EtiquetasCorralon: React.FC<FxP> = ({ t, a, b }) => {
  const P = ["cemento portland", "cemento normal", "cemento gris", "uso general"], A = ["plasticor", "hidralit", "de mampostería", "mortero tipo N", "mortero tipo S"];
  const span = Math.max(4, b - a - 1), ip = Math.min(P.length - 1, Math.floor(((t - a) / span) * P.length)), ia = Math.min(A.length - 1, Math.floor(((t - a) / span) * A.length));
  const pila = (x: number, band: string) => [0, 1, 2].map((i) => <Bolsa key={i} x={x + (i % 2) * 14} y={700 - i * 150} s={0.8} rot={(i % 2 ? 2 : -2)} band={band} txt="" />);
  return (
    <>
      <Svg>
        <rect x={240} y={860} width={1440} height={30} fill={C.wood} />
        {pila(560, C.cem2)}{pila(1360, C.cemf)}
      </Svg>
      <Pop t={t} at={a + 0.3} x={560} y={180}><Txt size={34} col={C.ok}>FUERZA</Txt></Pop>
      <Pop t={t} at={a + 0.5} x={1360} y={180}><Txt size={34} col={C.honey}>TRABAJABLE</Txt></Pop>
      <Lbl key={"p" + ip} t={t} at={a + 0.4 + (ip * span) / P.length} text={P[ip]} x={560} y={960} col={C.ink} size={50} />
      <Lbl key={"a" + ia} t={t} at={a + 0.6 + (ia * span) / A.length} text={A[ia]} x={1360} y={960} col={C.ink} size={50} />
    </>
  );
};

// 44 · el hierro: en la mezcla porosa entran agua y cloruros y el óxido crece; en la compacta rebotan en la superficie
export const ClorurosHierro: React.FC<FxP> = ({ t, a, m }) => {
  const cl0 = mk(m, "cl", a + 1), co = mk(m, "compacta", cl0 + 3), rust = e(t, cl0 + 1, cl0 + 3.5);
  const bloque = (x: number, poroso: boolean) => (
    <g>
      <rect x={x - 320} y={300} width={640} height={480} fill={poroso ? "#8a857c" : "#9a958d"} />
      {poroso && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={x - 300 + hash(i, 1) * 600} cy={320 + hash(i, 2) * 440} r={6 + 8 * hash(i, 3)} fill="#2a2724" />)}
      <rect x={x - 280} y={520} width={560} height={40} rx={20} fill={poroso ? `rgb(${Math.round(lerp(110, 181, rust))},${Math.round(lerp(114, 83, rust))},${Math.round(lerp(120, 42, rust))})` : "#6e7277"} />
      {Array.from({ length: 12 }, (_, i) => { const u = ((t - cl0) * 0.5 + i / 12) % 1, depth = poroso ? u : Math.min(u, 0.12), y = lerp(250, 540, depth); const vis = t > cl0 && (poroso || co < t || true); return vis ? <g key={i}>{i % 2 ? <Gota x={x - 260 + i * 46} y={y} r={11} o={poroso ? 1 - u * 0.5 : 1 - e(u, 0.1, 0.3)} /> : <text x={x - 260 + i * 46} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.sun} opacity={poroso ? 1 - u * 0.5 : 1 - e(u, 0.1, 0.3)}>Cl</text>}</g> : null; })}
    </g>
  );
  return (
    <>
      <Svg>{bloque(560, true)}<g opacity={e(t, co - 0.3, co + 0.3)}>{bloque(1360, false)}</g></Svg>
      <Lbl t={t} at={cl0 + 0.4} text="agua y cloruros" x={560} y={220} col={C.sun} size={54} />
      <Lbl t={t} at={cl0 + 2.6} text="aguada: se oxida" x={560} y={880} col={C.red} size={52} />
      <Lbl t={t} at={co + 0.6} text="compacta: lo protege" x={1360} y={880} col={C.ok} size={52} />
    </>
  );
};

// 45 · la receta por trabajo: filas con baldes dibujados (gris portland, blanco cal, amarillo arena)
export const RecetaPorTrabajo: React.FC<FxP> = ({ t, a, m }) => {
  const rows: [string, string, number[]][] = [["amurar y remendar", "r1", [1, 0, 3]], ["pared de ladrillo", "r2", [1, 1, 5.5]], ["revoque grueso", "r3", [1, 1, 5]], ["contrapiso", "r4", [0, 0, 0]]];
  const mini = (x: number, y: number, col: string, half = false) => <g><path d={`M${x - 26},${y - 56} L${x - 20},${y} L${x + 20},${y} L${x + 26},${y - 56} Z`} fill={col} stroke="#1d1c1b" strokeWidth={4} />{half && <rect x={x - 2} y={y - 60} width={32} height={64} fill={C.night} />}</g>;
  return (
    <>
      <Svg>
        {rows.map(([w, k, [p, c, ar]], i) => { const at = mk(m, k, a + 0.5 + i * 2.2), o = cl(spr(t, at, 1.1) * 2), y = 280 + i * 170; return (
          <g key={k} opacity={o} transform={`translate(${(1 - spr(t, at, 1.1)) * 120},0)`}>
            <rect x={240} y={y - 70} width={1440} height={140} rx={20} fill="rgba(40,30,18,.6)" stroke="rgba(255,236,200,.25)" strokeWidth={2} />
            <text x={290} y={y + 18} fontFamily={FONT} fontWeight={800} fontSize={50} fill={C.ink}>{w.toUpperCase()}</text>
            {i === 3 ? <text x={1050} y={y + 18} fontFamily={FONT} fontWeight={800} fontSize={46} fill={C.honey}>OTRA RECETA</text> : <>
              {Array.from({ length: p }, (_, j) => mini(1000 + j * 70, y + 30, "#8f8b83"))}
              {Array.from({ length: c }, (_, j) => mini(1090 + j * 70, y + 30, "#ecebe5"))}
              {Array.from({ length: Math.ceil(ar) }, (_, j) => mini(1180 + j * 70, y + 30, C.sand, j === Math.ceil(ar) - 1 && ar % 1 > 0))}
            </>}
          </g>); })}
      </Svg>
      <Lbl t={t} at={mk(m, "r1", a + 0.5) + 0.4} text="siempre en baldes" x={960} y={970} col={C.honey} size={50} />
    </>
  );
};

// 46 · el cortafierro: dos ladrillos viejos con su parche; el golpe despega entero al de la izquierda y rompe al de la derecha
export const Cortafierro: React.FC<FxP> = ({ t, a, m }) => {
  const go = mk(m, "golpe", a + 2), sx = shake(t, go, 12), l = e(t, go + 0.1, go + 0.8), r = e(t, go + 0.1, go + 0.6);
  const lad = (x: number) => <rect x={x - 260} y={600} width={520} height={200} rx={8} fill="#8e4a2b" stroke="#5c2c17" strokeWidth={5} />;
  const chisel = (x: number) => <g transform={`translate(${x + 280},${lerp(420, 560, e(t, go - 0.3, go))}) rotate(-35)`} opacity={e(t, go - 0.8, go - 0.5) * (1 - e(t, go + 0.8, go + 1.1))}><rect x={-10} y={-200} width={20} height={200} fill="#6b6e73" /><polygon points="-10,0 10,0 0,30" fill="#9a9da2" /></g>;
  return (
    <>
      <Svg>
        <g transform={`translate(${sx},0)`}>
          {lad(560)}
          <rect x={360} y={460} width={400} height={140} rx={6} fill="#8f8b83" transform={`translate(${l * 150},${-l * 90}) rotate(${l * 14} 560 600)`} />
          {lad(1360)}
          <rect x={1160} y={530} width={400} height={70} rx={4} fill="#857f76" />
          <rect x={1160} y={460} width={400} height={70} rx={4} fill="#8f8b83" transform={`translate(${r * 90},${-r * 140}) rotate(${r * 22} 1360 530)`} />
          <path d="M1160,532 L1240,520 L1300,540 L1380,522 L1460,538 L1560,526" stroke="#1d1c1b" strokeWidth={5} fill="none" opacity={r} />
        </g>
        {chisel(560)}{chisel(1360)}
      </Svg>
      <Lbl t={t} at={a + 0.3} text="1 a 3 sola" x={560} y={880} col={C.cem} size={52} />
      <Lbl t={t} at={a + 0.6} text="con cola vinílica" x={1360} y={880} col={C.glue} size={52} />
      <Lbl t={t} at={go + 0.9} text="se despega entero" x={560} y={200} col={C.red} size={50} />
      <Lbl t={t} at={go + 1.3} text="queda agarrado" x={1360} y={200} col={C.ok} size={50} />
    </>
  );
};

// 47 · los hilitos del polímero: entre los cristales crecen hebras blandas que bajan y se agarran a la superficie vieja
export const HilitosPolimero: React.FC<FxP> = ({ t, a }) => {
  const h = e(t, a + 1, a + 3.4);
  return (
    <>
      <Svg>
        <rect x={240} y={700} width={1440} height={200} fill="#7a6a58" />
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={260 + i * 48} cy={700} r={10 + 6 * hash(i, 3)} fill="#5c4f40" />)}
        {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={320 + hash(i, 1) * 1280} cy={380 + hash(i, 2) * 220} rx={50 + 30 * hash(i, 3)} ry={40} fill={C.sand} />)}
        {Array.from({ length: 40 }, (_, i) => { const x = 280 + hash(i, 5) * 1360, y = 360 + hash(i, 6) * 260, g = e(t, a + 0.3 + i * 0.01, a + 1 + i * 0.01); return <line key={i} x1={x} y1={y} x2={x + 30 * g} y2={y - 26 * g} stroke="rgba(235,245,255,.75)" strokeWidth={3} />; })}
        {Array.from({ length: 18 }, (_, i) => { const x = 300 + i * 78, d = `M${x},${430 + hash(i, 7) * 120} C${x + 40},${520} ${x - 40},${600} ${x + 10},${700}`; return <Draw key={i} d={d} p={cl(h * 1.3 - hash(i, 8) * 0.3)} col={C.glue} w={5} />; })}
      </Svg>
      <Lbl t={t} at={a + 1.2} text="hilitos de plástico" x={1500} y={240} col={C.glue} size={52} />
      <Lbl t={t} at={a + 3} text="se agarran a lo viejo" x={960} y={960} col={C.ok} size={52} />
    </>
  );
};

// 48 · el vaso en el agua: la cola va al agua antes de la mezcla; si te pasás, la mezcla se estira como goma
export const VasoEnElAgua: React.FC<FxP> = ({ t, a, m }) => {
  const va = mk(m, "vaso", a + 0.8), go = mk(m, "gomosa", va + 3), p = e(t, va, va + 1.4), st = e(t, go, go + 1.2);
  return (
    <>
      <Svg>
        <Balde x={760} y={840} w={420} h={400} lv={0.6} col={`rgba(${Math.round(lerp(124, 220, p))},${Math.round(lerp(200, 228, p))},${Math.round(lerp(255, 240, p))},.75)`} />
        <g transform={`translate(${lerp(1180, 900, e(t, va - 0.4, va))},${360}) rotate(${lerp(0, -80, e(t, va - 0.2, va + 0.3))})`}>
          <path d="M-60,-90 L-50,90 L50,90 L60,-90 Z" fill="rgba(255,255,255,.12)" stroke={C.edge} strokeWidth={4} />
          <rect x={-50} y={90 - 170 * (1 - p)} width={100} height={170 * (1 - p)} fill={C.glue} />
        </g>
        <g opacity={st} transform="translate(1420,560)">
          <ellipse cx={-90} cy={0} rx={70} ry={50} fill="#8f8b83" /><ellipse cx={lerp(0, 160, st)} cy={0} rx={70} ry={50} fill="#8f8b83" />
          {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M-30,${-30 + i * 20} Q${lerp(0, 60, st)},${-10 + i * 20 + 30 * st} ${lerp(0, 120, st)},${-30 + i * 20}`} stroke="#8f8b83" strokeWidth={8} fill="none" />)}
        </g>
      </Svg>
      <Lbl t={t} at={va + 0.6} text="un vaso por balde" x={760} y={300} col={C.glue} size={52} />
      <Lbl t={t} at={go + 0.5} text="de más: gomosa" x={1460} y={760} col={C.red} size={50} />
    </>
  );
};

// 49 · el ticket: renglones que se imprimen (cemento, arena, agua, cola), el total; al lado el mortero en bolsa, 3 o 4 veces
export const TicketCorralon: React.FC<FxP> = ({ t, a, m }) => {
  const ks = ["cem", "arena", "agua", "cola", "total"].map((k, i) => mk(m, k, a + 0.6 + i * 1.6)), al = mk(m, "albanil", ks[4] + 3);
  const rows: [string, string][] = [["1/5 bolsa portland", "1,80"], ["arena, 1 balde", "0,10"], ["agua", "0,00"], ["cola vinílica", "0,10"]];
  const printed = ks.filter((k) => t > k).length;
  return (
    <>
      <Svg>
        <g transform={`translate(${lerp(960, 640, e(t, al, al + 0.8))},0)`}>
          <path d={`M-260,140 L260,140 L260,${220 + printed * 110} l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 l-26,26 l-26,-26 Z`} fill="#f4efe2" />
          <text x={0} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#3d3424">CORRALÓN</text>
          {rows.map(([w, v], i) => t > ks[i] && <g key={w} opacity={e(t, ks[i], ks[i] + 0.3)}><text x={-230} y={290 + i * 90} fontFamily={BODY} fontWeight={700} fontSize={34} fill="#3d3424">{w}</text><text x={230} y={290 + i * 90} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#3d3424">{v}</text></g>)}
          {t > ks[4] && <g opacity={e(t, ks[4], ks[4] + 0.3)}><line x1={-230} x2={230} y1={640} y2={640} stroke="#3d3424" strokeWidth={4} strokeDasharray="10 8" /><text x={-230} y={710} fontFamily={FONT} fontWeight={800} fontSize={54} fill="#3d3424">TOTAL</text><text x={230} y={710} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={60} fill={C.brick2}>US$ 2</text></g>}
        </g>
        <g opacity={e(t, al, al + 0.6)}>
          <rect x={1100} y={780 - 120} width={140} height={120} rx={10} fill={C.ok} />
          <rect x={1340} y={780 - 420} width={140} height={420} rx={10} fill={C.red} />
          <text x={1170} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.ink}>VOS</text>
          <text x={1410} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.ink}>EN BOLSA</text>
        </g>
      </Svg>
      <Pop t={t} at={al + 0.8} x={1410} y={300}><Big size={90} col={C.red}>×3 o ×4</Big></Pop>
    </>
  );
};

// 50 · el hilo de respuestas: cada pregunta con su país entra como comentario y se le cuelga la respuesta corta
export const HiloRespuestas: React.FC<FxP> = ({ t, a, m }) => {
  const Q: [string, string, string][] = [["mex", "México", "el gris normal"], ["col", "Colombia", "cemento, caliza y aire"], ["esp", "España", "cemento cola = adhesivo"], ["rd", "Rep. Dominicana", "piso chico, sí"], ["arg", "Argentina", "tres de arena, una"], ["ven", "Venezuela", "sí: es el pego"]];
  const ks = Q.map(([k], i) => mk(m, k, a + 0.5 + i * 3.5));
  const cur = Math.max(0, ks.filter((k) => t >= k).length - 1);
  return (
    <>
      {Q.map(([k, pais, resp], i) => { if (i < cur - 2 || t < ks[i]) return null; const slot = i - Math.max(0, cur - 2), y = 220 + slot * 270; return (
        <React.Fragment key={k}>
          <Pop t={t} at={ks[i]} x={760} y={y}><div style={{ display: "flex", alignItems: "center", gap: 18, background: "#f2e3bf", color: "#2a2418", borderRadius: 26, padding: "16px 30px", boxShadow: "0 16px 36px rgba(0,0,0,.45)", whiteSpace: "nowrap" }}><span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, background: C.brick, color: "#fff", borderRadius: 12, padding: "4px 14px" }}>{pais.toUpperCase()}</span><span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38 }}>pregunta</span></div></Pop>
          <Pop t={t} at={ks[i] + 0.9} x={1240} y={y + 100}><div style={{ background: "#2e4a5c", color: C.ink, fontFamily: FONT, fontWeight: 800, fontSize: 44, borderRadius: 26, borderTopLeftRadius: 4, padding: "14px 30px", whiteSpace: "nowrap", textTransform: "uppercase", boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>{resp}</div></Pop>
        </React.Fragment>); })}
    </>
  );
};

// 51 · ¿pelo o abierta?: la fisura finita se tapa con lechada; la abierta muestra lo que empuja de abajo
export const PeloOAbierta: React.FC<FxP> = ({ t, a, m }) => {
  const pe = mk(m, "pelo", a + 0.8), ab = mk(m, "abre", pe + 4), tapa = e(t, pe + 1.6, pe + 2.6), op = e(t, ab, ab + 1);
  return (
    <>
      <Svg>
        <rect x={260} y={300} width={620} height={480} fill="#a6a198" />
        <Draw d="M340,360 L420,450 L400,520 L480,600 L460,700" p={e(t, pe, pe + 0.8)} col="#2a2724" w={3} />
        <rect x={260} y={300} width={620 * tapa} height={480} fill="rgba(143,139,131,.55)" />
        <rect x={1040} y={300} width={620} height={480} fill="#a6a198" />
        <path d={`M1300,300 L${1330 + 30 * op},420 L${1290 - 20 * op},540 L${1340 + 30 * op},660 L1310,780 L${1310 - 30 * op},780 L${1280 - 20 * op},660 L${1260 - 30 * op},540 L${1300 - 30 * op},420 Z`} fill="#141210" opacity={e(t, ab - 0.4, ab)} />
        {op > 0.5 && [["raíz", 1140], ["hierro", 1350], ["base", 1560]].map(([w, x], i) => <g key={i} opacity={e(t, ab + 1 + i * 0.4, ab + 1.4 + i * 0.4)}><path d={`M${x},900 L${x},820`} stroke={C.red} strokeWidth={10} markerEnd="" /><polygon points={`${(x as number) - 22},830 ${(x as number) + 22},830 ${x},800`} fill={C.red} /></g>)}
      </Svg>
      <Lbl t={t} at={pe + 0.5} text="como un pelo" x={570} y={220} col={C.ok} size={52} />
      <Lbl t={t} at={pe + 2.4} text="lechada y listo" x={570} y={880} col={C.ok} size={48} />
      <Lbl t={t} at={ab + 0.4} text="se abre: algo empuja" x={1350} y={220} col={C.red} size={52} />
      <Lbl t={t} at={ab + 1.4} text="raíz · hierro · base" x={1350} y={960} col={C.dim} size={44} />
    </>
  );
};

// 52 · la bolsa en alto: en el piso chupa la humedad y se llena de grumos; doble bolsa sobre tarima, seca
export const BolsaEnAlto: React.FC<FxP> = ({ t, a, m }) => {
  const pi = mk(m, "piso", a + 0.6), ta = mk(m, "tarima", pi + 3.5), hum = e(t, pi + 0.4, pi + 2.6);
  return (
    <>
      <Svg>
        <rect x={160} y={820} width={1600} height={120} fill="#3a352e" />
        <g><Bolsa x={560} y={660} s={0.95} />
          {Array.from({ length: 10 }, (_, i) => { const u = ((t - pi) * 0.6 + i / 10) % 1; return t > pi ? <Gota key={i} x={430 + i * 28} y={lerp(860, 700, u)} r={10} o={Math.sin(u * Math.PI)} /> : null; })}
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={470 + hash(i, 1) * 180} cy={620 + hash(i, 2) * 160} r={16 * hum} fill="#5f5b55" stroke="#3a3836" strokeWidth={3} />)}
        </g>
        <g opacity={e(t, ta - 0.3, ta + 0.3)} transform={`translate(0,${(1 - spr(t, ta, 0.9)) * 120})`}>
          <rect x={1180} y={760} width={360} height={30} fill={C.wood} /><rect x={1200} y={790} width={40} height={40} fill={C.wood} /><rect x={1340} y={790} width={40} height={40} fill={C.wood} /><rect x={1480} y={790} width={40} height={40} fill={C.wood} />
          <Bolsa x={1360} y={580} s={0.85} />
          <path d="M1210,400 Q1360,370 1510,400 L1530,770 L1190,770 Z" fill="rgba(200,220,240,.18)" stroke="rgba(200,220,240,.55)" strokeWidth={4} />
        </g>
      </Svg>
      <Lbl t={t} at={pi + 1.8} text="en el piso: piedra" x={560} y={250} col={C.red} size={52} />
      <Lbl t={t} at={ta + 0.6} text="doble bolsa, en alto" x={1360} y={250} col={C.ok} size={52} />
    </>
  );
};

// 53 · el grumo: dos dedos aprietan; el que se deshace sirve, el que es piedrita se tira
export const GrumoTest: React.FC<FxP> = ({ t, a, m }) => {
  const de = mk(m, "deshace", a + 0.8), pi = mk(m, "piedra", de + 2.5), sq = e(t, de, de + 0.6), sq2 = e(t, pi, pi + 0.6);
  const dedos = (x: number, k: number) => <g><ellipse cx={x - 140 + 70 * k} cy={540} rx={70} ry={40} fill="#d9a77f" /><ellipse cx={x + 140 - 70 * k} cy={540} rx={70} ry={40} fill="#d9a77f" /></g>;
  return (
    <>
      <Svg>
        {sq < 0.8 ? <circle cx={600} cy={540} r={60} fill="#9a958d" /> : Array.from({ length: 16 }, (_, i) => <circle key={i} cx={600 + (hash(i, 1) - 0.5) * 220 * e(t, de + 0.5, de + 1.2)} cy={540 + 200 * e(t, de + 0.5, de + 1.2) * hash(i, 2)} r={8} fill="#9a958d" />)}
        {dedos(600, sq * (1 - e(t, de + 0.8, de + 1.2)))}
        <circle cx={1320} cy={540} r={58} fill="#77736c" stroke="#4a4743" strokeWidth={5} transform={`translate(${shake(t, pi + 0.5, 6)},0)`} />
        {dedos(1320, 0.55 * sq2)}
      </Svg>
      <Lbl t={t} at={de + 1} text="se deshace: sirve" x={600} y={820} col={C.ok} size={52} />
      <Lbl t={t} at={pi + 0.8} text="piedrita: se tira" x={1320} y={820} col={C.red} size={52} />
    </>
  );
};

// 54 · ¿qué vas a arreglar?: el escalón, la reja, el caño; el globo de comentario con tu país
export const QueArreglas: React.FC<FxP> = ({ t, a }) => {
  const it: [string, React.ReactNode][] = [
    ["el escalón", <path d="M-120,80 L120,80 L120,0 L20,0 L20,-80 L-120,-80 Z" fill="#9a958d" />],
    ["la reja", <g>{[-90, -45, 0, 45, 90].map((x) => <line key={x} x1={x} x2={x} y1={-90} y2={90} stroke="#3f4245" strokeWidth={12} />)}<line x1={-110} x2={110} y1={-60} y2={-60} stroke="#3f4245" strokeWidth={12} /></g>],
    ["el caño", <g>{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={-110 + i * 20} cy={0} rx={10} ry={50} fill="#e3a63a" stroke="#9b6c1a" strokeWidth={3} />)}</g>],
  ];
  return (
    <>
      <Svg>
        {it.map(([, el], i) => { const p = spr(t, a + 0.3 + i * 0.5, 1.1); return <g key={i} opacity={cl(p * 2)} transform={`translate(${460 + i * 500},${480 + (1 - p) * 100}) rotate(${(1 - p) * 10})`}><rect x={-180} y={-180} width={360} height={360} rx={30} fill="rgba(40,30,18,.6)" stroke="rgba(255,236,200,.3)" strokeWidth={2} />{el}</g>; })}
      </Svg>
      {it.map(([w], i) => <Lbl key={w} t={t} at={a + 0.6 + i * 0.5} text={w} x={460 + i * 500} y={730} col={C.honey} size={50} />)}
      <Pop t={t} at={a + 2.2} x={960} y={900}><div style={{ background: "#f2e3bf", color: "#2a2418", fontFamily: FONT, fontWeight: 800, fontSize: 48, padding: "16px 40px", borderRadius: 30, borderBottomLeftRadius: 4, textTransform: "uppercase", boxShadow: "0 16px 36px rgba(0,0,0,.45)" }}>tu país y tu arreglo</div></Pop>
    </>
  );
};
