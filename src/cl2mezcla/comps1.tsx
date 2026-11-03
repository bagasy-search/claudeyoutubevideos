// cl2mezcla · componentes del gancho a la medida (maza contra ladrillo hueco, lo que le sacás, las tres intrigas colgadas,
// la mitad de la fuerza, la pelea de la bolsa, Don Ramón a dos cuadras, el equipo, la botella que decanta, granos bajo la
// lupa, el barro que engaña al cemento, las dos bolsas mezcladas, el tablero de herramientas, el alero, los cuatro baldes,
// la contracción, al ras, las paladas que mienten, cuánto alcanza). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, num, shake } from "./kit";

const mk = (m: Record<string, number>, k: string, d: number) => m[k] ?? d;

// ---------- formas que usan las tres hojas ----------
// balde de albañil de goma negra, de costado: (x, y = base), ancho de boca w, alto h; nivel 0..1 con su color; colmo = montañita
export const Balde: React.FC<{ x: number; y: number; w: number; h: number; lv?: number; col?: string; colmo?: number; o?: number; raya?: number }> = ({ x, y, w, h, lv = 0, col = C.sand, colmo = 0, o = 1, raya }) => {
  const wb = w * 0.78, top = y - h, yl = y - h * lv, wl = lerp(wb, w, lv) * 0.94;
  return (
    <g opacity={o}>
      {lv > 0.01 && <path d={`M${x - wb * 0.47},${y - 6} L${x - wl / 2},${yl} ${colmo > 0 ? `Q${x},${yl - h * 0.5 * colmo} ${x + wl / 2},${yl}` : `L${x + wl / 2},${yl}`} L${x + wb * 0.47},${y - 6} Z`} fill={col} />}
      <path d={`M${x - w / 2},${top} L${x - wb / 2},${y} L${x + wb / 2},${y} L${x + w / 2},${top}`} fill="none" stroke="#1d1c1b" strokeWidth={14} strokeLinejoin="round" />
      <path d={`M${x - w / 2},${top} L${x - wb / 2},${y} L${x + wb / 2},${y} L${x + w / 2},${top}`} fill="none" stroke="#3a3836" strokeWidth={8} strokeLinejoin="round" />
      <rect x={x - w / 2 - 10} y={top - 10} width={w + 20} height={18} rx={9} fill="#2a2928" />
      <path d={`M${x - w / 2 + 6},${top} Q${x},${top - h * 0.5} ${x + w / 2 - 6},${top}`} fill="none" stroke="#2a2928" strokeWidth={7} opacity={0.6} />
      {raya !== undefined && <line x1={lerp(x - wb / 2, x - w / 2, raya) + 8} x2={lerp(x + wb / 2, x + w / 2, raya) - 8} y1={y - h * raya} y2={y - h * raya} stroke={C.honey} strokeWidth={6} strokeDasharray="14 8" />}
    </g>
  );
};
// ladrillo cerámico hueco de frente (los agujeros a la vista)
export const Hueco: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={6} fill={C.brick} stroke={C.brick2} strokeWidth={5} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x - w / 2 + 14 + (i % 3) * ((w - 28) / 3) + 6} y={y - h / 2 + 14 + Math.floor(i / 3) * ((h - 28) / 2) + 6} width={(w - 28) / 3 - 12} height={(h - 28) / 2 - 12} rx={4} fill="#3b1a0c" />)}
  </g>
);
// bolsa de cemento de papel, de frente; texto corto en la etiqueta
export const Bolsa: React.FC<{ x: number; y: number; s?: number; txt?: string; band?: string; o?: number; rot?: number }> = ({ x, y, s = 1, txt = "CEMENTO", band = C.cem2, o = 1, rot = 0 }) => (
  <g opacity={o} transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-120,-170 Q0,-186 120,-170 L132,160 Q0,176 -132,160 Z" fill="#cdbf9f" stroke="#7d6f55" strokeWidth={4} />
    <path d="M-120,-170 L-112,-140 Q0,-150 112,-140 L120,-170" fill="#b9ab8b" />
    <rect x={-104} y={-60} width={208} height={96} rx={8} fill={band} />
    <text x={0} y={4} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">{txt}</text>
    <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#5e5340">25 kg</text>
  </g>
);
// gota de agua
export const Gota: React.FC<{ x: number; y: number; r: number; o?: number; col?: string }> = ({ x, y, r, o = 1, col = C.water }) => (
  <path d={`M${x},${y - r * 1.6} Q${x + r * 1.05},${y - r * 0.2} ${x},${y + r} Q${x - r * 1.05},${y - r * 0.2} ${x},${y - r * 1.6} Z`} fill={col} opacity={o} stroke="rgba(255,255,255,.5)" strokeWidth={2} />
);
// sol con rayos que giran
export const Sol: React.FC<{ t: number; x: number; y: number; r: number; o?: number }> = ({ t, x, y, r, o = 1 }) => (
  <g opacity={o} transform={`translate(${x},${y}) rotate(${t * 12})`}>
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={r * 1.3} x2={0} y2={r * 1.75} stroke={C.sun} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
    <circle r={r} fill={C.sun} />
  </g>
);

// 1 · la maza: el ladrillo hueco se abre en tres, el bloque de mezcla queda con una marquita blanca
export const MazaLadrillo: React.FC<FxP> = ({ t, a, m }) => {
  const g = mk(m, "golpe", a + 2), mm = mk(m, "marca", g + 2.5), br = e(t, g, g + 0.5), sx = shake(t, g, 18);
  const piezas = [[-1, -0.6, -30], [0.1, -1.1, 18], [1, -0.4, 40]] as const;
  const maza = (at: number, x: number) => { const u = t - at; const ang = u < -0.6 ? -70 : u < 0 ? lerp(-70, 0, ((u + 0.6) / 0.6) ** 2) : -10 * Math.exp(-u * 6) * Math.sin(u * 28); return <g transform={`translate(${x + 230},430) rotate(${ang})`} opacity={cl((u + 1) * 3) * (1 - e(t, at + 0.9, at + 1.3))}><rect x={-420} y={-12} width={380} height={24} rx={11} fill="#b9873f" stroke="#5e3a1c" strokeWidth={3} /><rect x={-500} y={-62} width={100} height={124} rx={12} fill="#55585d" stroke="#25272a" strokeWidth={4} /></g>; };
  return (
    <>
      <Svg>
        <g transform={`translate(${sx},0)`}>
          {br < 0.02 ? <Hueco x={560} y={610} w={420} h={230} o={cl(spr(t, a + 0.1) * 2)} /> : piezas.map(([dx, dy, rot], i) => (
            <g key={i} transform={`translate(${560 + dx * 150 * br},${610 + dy * 60 * br + 160 * br * br}) rotate(${rot * br})`} opacity={1 - 0.2 * br}>
              <clipPath id={`mz${i}`}><polygon points={i === 0 ? "-210,-115 -60,-115 -110,0 -40,115 -210,115" : i === 1 ? "-60,-115 90,-115 40,10 -110,0" : "90,-115 210,-115 210,115 -40,115 -110,0 40,10"} /></clipPath>
              <g clipPath={`url(#mz${i})`}><Hueco x={0} y={0} w={420} h={230} /></g>
            </g>
          ))}
          {maza(g, 560)}
        </g>
        <g transform={`translate(${shake(t, mm, 6)},0)`} opacity={cl(spr(t, a + 0.5) * 2)}>
          <rect x={1160} y={500} width={440} height={220} rx={10} fill="#a6a198" stroke="#5f5b55" strokeWidth={5} />
          {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={1175 + hash(i, 3) * 410} cy={515 + hash(i, 4) * 190} r={3 + 4 * hash(i, 5)} fill={hash(i, 6) > 0.5 ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.14)"} />)}
          <ellipse cx={1380} cy={512} rx={46 * e(t, mm, mm + 0.2)} ry={9 * e(t, mm, mm + 0.2)} fill="rgba(255,255,255,.85)" />
        </g>
        {maza(mm, 1380)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="ladrillo hueco" x={560} y={860} col={C.brick} size={56} />
      <Lbl t={t} at={a + 0.8} text="mezcla de 2 dólares" x={1380} y={860} col={C.cem} size={56} />
      <Pop t={t} at={g + 0.5} x={560} y={300}><Big size={110} col={C.red}>3 pedazos</Big></Pop>
      <Pop t={t} at={mm + 0.4} x={1380} y={300}><Big size={110} col={C.ok}>una marquita</Big></Pop>
    </>
  );
};

// 2 · lo que le agregás no es: los frascos de aditivo caen y se tachan; del balde sube una gota con un signo menos
export const AgregaSaca: React.FC<FxP> = ({ t, a, m }) => {
  const sa = mk(m, "saca", a + 3), up = e(t, sa, sa + 1.4);
  const fr = ["ADITIVO", "PRODUCTO", "IMPORTADO"];
  return (
    <>
      <Svg>
        {fr.map((w, i) => { const at = a + 0.3 + i * 0.35, p = spr(t, at, 1.1); return (
          <g key={w} transform={`translate(${420},${300 + i * 200 + (1 - p) * -200})`} opacity={cl(p * 2) * (1 - 0.6 * e(t, sa - 0.3, sa))}>
            <rect x={-150} y={-70} width={300} height={140} rx={22} fill="#3a4b5e" stroke="#8fb0cf" strokeWidth={4} />
            <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#dce9f5">{w}</text>
          </g>); })}
        {fr.map((_, i) => <Cross key={i} t={t} at={a + 1.4 + i * 0.25} x={610} y={300 + i * 200} r={44} />)}
        <Balde x={1180} y={860} w={420} h={400} lv={0.82} col="#8a857c" />
        {Array.from({ length: 6 }, (_, i) => { const k = cl(up * 1.4 - i * 0.08); return <Gota key={i} x={1180 + (hash(i, 7) - 0.5) * 220} y={lerp(560, 200, k) - i * 20} r={lerp(14, 34, k)} o={k > 0 ? 1 - e(k, 0.85, 1) : 0} />; })}
        <g opacity={up} transform={`translate(1180,${lerp(560, 260, up)})`}><circle r={70} fill="rgba(255,85,70,.18)" stroke={C.red} strokeWidth={5} /><rect x={-38} y={-8} width={76} height={16} rx={8} fill={C.red} /></g>
      </Svg>
      <Lbl t={t} at={sa + 0.6} text="lo que le sacás" x={1580} y={560} col={C.water} size={64} />
    </>
  );
};

// 3 · tres etiquetas colgadas de clavos en la pared de ladrillo: el agua, la bolsa, el chorrito; se balancean al entrar
export const GanchosIntriga: React.FC<FxP> = ({ t, a, m }) => {
  const ks = [mk(m, "i1", a + 0.5), mk(m, "i2", a + 4), mk(m, "i3", a + 8)], fin = mk(m, "fin", a + 11);
  const icon = (i: number) => i === 0 ? <Gota x={0} y={60} r={40} /> : i === 1 ? <Bolsa x={0} y={70} s={0.42} /> : <g transform="translate(0,70)"><rect x={-34} y={-60} width={68} height={120} rx={14} fill={C.glue} stroke="#a8a28f" strokeWidth={4} /><rect x={-14} y={-90} width={28} height={34} rx={6} fill={C.honey} /></g>;
  const txt = ["el agua", "la bolsa", "el chorrito"];
  return (
    <>
      <Svg>
        {ks.map((k, i) => { const u = t - k, sw = u < 0 ? 0 : 22 * Math.exp(-u * 2.2) * Math.sin(u * 7), o = cl(u * 5), x = 480 + i * 480, cov = i === 2 ? e(t, fin, fin + 0.6) : 0; return (
          <g key={i} opacity={o} transform={`translate(${x},250) rotate(${sw})`}>
            <circle r={12} fill="#888" stroke="#333" strokeWidth={3} />
            <line x1={0} y1={0} x2={-80} y2={110} stroke="#d8cdb4" strokeWidth={4} /><line x1={0} y1={0} x2={80} y2={110} stroke="#d8cdb4" strokeWidth={4} />
            <rect x={-150} y={110} width={300} height={380} rx={24} fill="#efe3c4" stroke="#8a7a58" strokeWidth={5} />
            <text x={0} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={80} fill={C.brick2}>{i + 1}</text>
            <g transform="translate(0,250)" opacity={1 - cov}>{icon(i)}</g>
            <text x={0} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#3d3424" opacity={1 - cov}>{txt[i].toUpperCase()}</text>
            {cov > 0 && <text x={0} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={170} fill={C.honey} opacity={cov}>?</text>}
          </g>); })}
      </Svg>
      <Lbl t={t} at={fin + 0.4} text="eso, para el final" x={1440} y={930} col={C.honey} size={56} />
    </>
  );
};

// 4 · el manómetro de la fuerza: la aguja cae de 100 a 50 de un tirón y tiembla
export const Manometro: React.FC<FxP> = ({ t, a, m }) => {
  const mi = mk(m, "mitad", a + 1.5), v = lerp(100, 50, e(t, mi, mi + 0.5)) + shake(t, mi + 0.5, 3), ang = lerp(-120, 120, v / 100);
  const p = spr(t, a + 0.1, 0.9);
  return (
    <>
      <Svg>
        <g transform={`translate(960,${560 + (1 - p) * 80}) scale(${0.8 + 0.2 * p})`} opacity={cl(p * 2)}>
          <circle r={330} fill="#24221f" stroke="#8d887e" strokeWidth={14} />
          {Array.from({ length: 11 }, (_, i) => { const g = (lerp(-120, 120, i / 10) - 90) * Math.PI / 180; return <g key={i}><line x1={Math.cos(g) * 250} y1={Math.sin(g) * 250} x2={Math.cos(g) * 295} y2={Math.sin(g) * 295} stroke={i < 5 ? C.red : C.ok} strokeWidth={i % 5 ? 5 : 10} />{i % 5 === 0 && <text x={Math.cos(g) * 200} y={Math.sin(g) * 200 + 14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.ink}>{i * 10}</text>}</g>; })}
          <path d={`M${Math.cos((-210) * Math.PI / 180) * 270},${Math.sin((-210) * Math.PI / 180) * 270} A270,270 0 0 1 0,-270`} fill="none" stroke="rgba(255,85,70,.35)" strokeWidth={30} />
          <g transform={`rotate(${ang})`}><polygon points="-14,0 0,-280 14,0" fill={C.honey} /><circle r={30} fill="#55585d" stroke="#222" strokeWidth={4} /></g>
          <text x={0} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={90} fill={v < 75 ? C.red : C.ink}>{Math.round(v)} %</text>
        </g>
      </Svg>
      <Lbl t={t} at={mi + 0.4} text="la mitad de la fuerza" x={1560} y={760} col={C.red} size={56} />
    </>
  );
};

// 5 · la pelea de la bolsa: burbujas de comentarios que saltan de una bolsa a la otra
export const BurbujasPelea: React.FC<FxP> = ({ t, a, b }) => {
  const frases = ["esta sí", "tiene cal", "oxida el hierro", "esta no", "¿qué es?", "acá no existe", "es una marca"];
  const dt = Math.max(0.55, (b - a - 1.5) / frases.length);
  return (
    <>
      <Svg>
        <Bolsa x={520} y={640} s={1.1} rot={-4} o={cl(spr(t, a) * 2)} />
        <Bolsa x={1400} y={640} s={1.1} rot={4} o={cl(spr(t, a + 0.2) * 2)} txt="CEMENTO" band={C.cemf} />
        <text x={960} y={660} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={130} fill={C.honey} opacity={e(t, a + 0.5, a + 1)}>VS</text>
      </Svg>
      {frases.map((w, i) => { const at = a + 0.8 + i * dt, izq = i % 2 === 0; return (
        <Pop key={w} t={t} at={at} out={at + dt * 2.4} x={izq ? 600 + (i % 3) * 30 : 1320 - (i % 3) * 30} y={260 + (i % 3) * 90}>
          <div style={{ background: izq ? "#f2e3bf" : "#dfe9f2", color: "#2a2418", fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "14px 30px", borderRadius: 30, borderBottomLeftRadius: izq ? 4 : 30, borderBottomRightRadius: izq ? 30 : 4, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,.4)", textTransform: "uppercase" }}>{w}</div>
        </Pop>); })}
    </>
  );
};

// 6 · Don Ramón a dos cuadras: plano de manzanas visto de arriba; el camino se dibuja de casa a casa
export const DosCuadras: React.FC<FxP> = ({ t, a }) => {
  const p = e(t, a + 0.8, a + 2.6);
  return (
    <>
      <Svg>
        <g opacity={e(t, a, a + 0.5)} transform="translate(960,540) rotate(-8) translate(-960,-540)">
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={260 + (i % 4) * 360} y={180 + Math.floor(i / 4) * 260} width={300} height={200} rx={16} fill="#2e2a24" stroke="#4d463b" strokeWidth={3} />)}
          <Draw d="M410,430 L410,470 L1110,470 L1110,440" p={p} col={C.honey} w={14} dash={`${p * 0.98} 1`} />
          <g transform="translate(410,380)"><polygon points="-60,0 0,-60 60,0" fill={C.brick} /><rect x={-48} y={0} width={96} height={70} fill={C.cream} /></g>
          <g transform={`translate(1110,380) scale(${spr(t, a + 2.6, 1.2)})`}><polygon points="-60,0 0,-60 60,0" fill={C.brick2} /><rect x={-48} y={0} width={96} height={70} fill={C.cem} /><line x1={70} y1={-40} x2={70} y2={70} stroke={C.wood} strokeWidth={8} /><rect x={56} y={50} width={30} height={30} fill={C.iron} /></g>
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="mi casa" x={430} y={760} col={C.ink} size={52} />
      <Lbl t={t} at={a + 2.8} text="Don Ramón, albañil" x={1150} y={760} col={C.honey} size={56} />
      <Pop t={t} at={a + 1.8} x={760} y={940}><Txt size={44} col={C.sand}>dos cuadras</Txt></Pop>
    </>
  );
};

// 7 · la silueta se va equipando: guantes, mangas, barbijo, anteojos; el viento le pega de espaldas
export const EquipoSilueta: React.FC<FxP> = ({ t, a, m }) => {
  const g = mk(m, "guan", a + 0.6), mg = mk(m, "mang", g + 0.8), ba = mk(m, "barb", mg + 2), an = mk(m, "ante", ba + 2), vi = mk(m, "viento", ba - 0.5);
  const on = (k: number) => spr(t, k, 1.2);
  return (
    <>
      <Svg>
        <g transform="translate(860,560)">
          <circle cx={0} cy={-260} r={90} fill="#3b3a38" stroke={C.dim} strokeWidth={4} />
          <path d="M-150,-150 Q0,-185 150,-150 L190,250 L-190,250 Z" fill="#3b3a38" stroke={C.dim} strokeWidth={4} />
          <path d="M-150,-140 L-260,120 L-215,140 L-130,-20" fill={on(mg) > 0.5 ? "#556b3d" : "#3b3a38"} stroke={C.dim} strokeWidth={4} />
          <path d="M150,-140 L260,120 L215,140 L130,-20" fill={on(mg) > 0.5 ? "#556b3d" : "#3b3a38"} stroke={C.dim} strokeWidth={4} />
          <g opacity={cl(on(g) * 2)}><ellipse cx={-245} cy={165} rx={48} ry={58} fill="#e2b33a" /><ellipse cx={245} cy={165} rx={48} ry={58} fill="#e2b33a" /></g>
          <path d="M-62,-238 Q0,-205 62,-238 L56,-200 Q0,-170 -56,-200 Z" fill="#e9eef2" opacity={cl(on(ba) * 2)} />
          <g opacity={cl(on(an) * 2)}><rect x={-72} y={-298} width={62} height={38} rx={14} fill="rgba(143,211,255,.45)" stroke="#e9eef2" strokeWidth={5} /><rect x={10} y={-298} width={62} height={38} rx={14} fill="rgba(143,211,255,.45)" stroke="#e9eef2" strokeWidth={5} /></g>
        </g>
        {Array.from({ length: 6 }, (_, i) => { const u = ((t - vi) * 0.9 + i / 6) % 1, o = e(t, vi, vi + 0.4); return <path key={i} d={`M${lerp(1700, 1140, u)},${360 + i * 60} q-60,-20 -120,0`} fill="none" stroke="rgba(230,240,255,.6)" strokeWidth={6} strokeLinecap="round" opacity={o * Math.sin(u * Math.PI)} />; })}
      </Svg>
      <Lbl t={t} at={g} text="guantes de goma" x={1500} y={300} col={C.honey} size={50} align="left" />
      <Lbl t={t} at={mg} text="mangas largas" x={1500} y={400} col={C.ok} size={50} align="left" />
      <Lbl t={t} at={ba} text="de espaldas al viento" x={1360} y={820} col={C.water} size={50} align="left" />
      <Lbl t={t} at={an} text="anteojos para la maza" x={1360} y={920} col={C.ink} size={50} align="left" />
    </>
  );
};

// 8 · la botella que decanta: sacudida, la arena baja rápido, el barro se asienta despacio; uña contra dedo
export const BotellaDecanta: React.FC<FxP> = ({ t, a, m }) => {
  const sa = mk(m, "sacude", a + 1), qu = mk(m, "quieta", sa + 3), ca = mk(m, "capa", qu + 6), de = mk(m, "dedo", ca + 4);
  const shk = t > sa && t < qu ? 24 * Math.sin((t - sa) * 30) : 0, turb = e(t, sa, sa + 0.6) * (1 - e(t, qu, qu + 1.5));
  const arena = e(t, qu, qu + 1.4), barro = e(t, qu + 1, ca);
  const bot = (x: number, gruesa: number, o: number, rot = 0) => (
    <g opacity={o} transform={`translate(${x},${560}) rotate(${rot})`}>
      <rect x={-110} y={-300} width={220} height={560} rx={50} fill="rgba(124,200,255,.16)" />
      <rect x={-108} y={260 - 180 * (t > qu ? 1 : 1 - turb)} width={216} height={180 * (t > qu ? arena : 1 - turb)} fill={C.sand} opacity={0.95} />
      <rect x={-108} y={-280} width={216} height={540} fill="rgba(140,110,70,.6)" opacity={turb} />
      <rect x={-108} y={80 - gruesa * barro} width={216} height={gruesa * barro} fill="#6b4e2e" />
      <rect x={-110} y={-300} width={220} height={560} rx={50} fill="none" stroke={C.edge} strokeWidth={6} />
      <rect x={-50} y={-360} width={100} height={64} rx={10} fill="#3c7bbf" />
    </g>
  );
  return (
    <>
      <Svg>
        {bot(t < de ? 960 : lerp(960, 640, e(t, de, de + 0.7)), 10, 1, shk)}
        {bot(1300, 70, e(t, de, de + 0.7))}
        {t > qu + 0.5 && <g opacity={e(t, ca - 0.4, ca)}><line x1={t < de ? 1090 : lerp(1090, 770, e(t, de, de + 0.7))} x2={t < de ? 1200 : lerp(1200, 880, e(t, de, de + 0.7))} y1={636} y2={636} stroke={C.ok} strokeWidth={5} /></g>}
      </Svg>
      <Pop t={t} at={sa} out={qu} x={960} y={160}><Big size={90} col={C.sand}>sacudís fuerte</Big></Pop>
      <Pop t={t} at={qu + 0.2} out={ca - 0.2} x={1500} y={900}><Txt size={46} col={C.sand}>la arena cae rápido</Txt></Pop>
      <Lbl t={t} at={ca} text="fina como uña: sirve" x={t < de ? 1520 : 640} y={t < de ? 640 : 940} col={C.ok} size={50} />
      <Lbl t={t} at={de + 0.4} text="un dedo: tiene tierra" x={1300} y={940} col={C.red} size={50} />
    </>
  );
};

// 9 · granos bajo la lupa: la lente pasa de la arena gruesa (granitos) a la fina (talco)
export const LupaGranos: React.FC<FxP> = ({ t, a, m }) => {
  const fi = mk(m, "fina", a + 3), lx = lerp(620, 1300, e(t, fi - 0.3, fi + 0.6)), ly = 520;
  const grano = (gx: number, i: number, fino: boolean) => { const r = fino ? 3 + 2 * hash(i, 2) : 10 + 12 * hash(i, 2); return <circle key={i} cx={gx + (hash(i, 3) - 0.5) * 380} cy={620 + hash(i, 4) * 180} r={r} fill={`rgb(${200 + 30 * hash(i, 5)},${165 + 30 * hash(i, 5)},${100 + 30 * hash(i, 6)})`} />; };
  return (
    <>
      <Svg>
        <defs><clipPath id="lupaG"><circle cx={lx} cy={ly} r={190} /></clipPath></defs>
        <path d="M400,820 Q620,560 840,820 Z" fill={C.sand2} /><path d="M1080,820 Q1300,600 1520,820 Z" fill="#e6d3a9" />
        <g clipPath="url(#lupaG)">
          <rect x={lx - 200} y={ly - 200} width={400} height={400} fill="#1e1b17" />
          {Array.from({ length: lx < 960 ? 40 : 260 }, (_, i) => { const fino = lx >= 960, r = fino ? 4 + 3 * hash(i, 2) : 18 + 18 * hash(i, 2); return <circle key={i} cx={lx + (hash(i, 3) - 0.5) * 400} cy={ly + (hash(i, 4) - 0.5) * 400} r={r} fill={`rgb(${200 + 30 * hash(i, 5)},${165 + 30 * hash(i, 5)},${100 + 30 * hash(i, 6)})`} stroke="rgba(60,40,10,.4)" strokeWidth={fino ? 1 : 3} />; })}
        </g>
        <circle cx={lx} cy={ly} r={190} fill="none" stroke="#c9c2b2" strokeWidth={18} />
        <line x1={lx + 134} y1={ly + 134} x2={lx + 260} y2={ly + 260} stroke={C.wood} strokeWidth={34} strokeLinecap="round" />
        {Array.from({ length: 30 }, (_, i) => grano(620, i, false))}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="mediana o gruesa" x={620} y={900} col={C.ok} size={54} />
      <Lbl t={t} at={fi + 0.5} text="talco: para terminar" x={1300} y={900} col={C.honey} size={54} />
    </>
  );
};

// 10 · el barro engaña al cemento: las manitos de cristal se agarran a la película de barro, y el barro se desliza
export const BarroPelicula: React.FC<FxP> = ({ t, a, m }) => {
  const ba = mk(m, "barro", a + 2), film = e(t, ba, ba + 0.8), slide = e(t, ba + 1.6, ba + 3);
  const grano = (x: number, y: number, con: boolean) => {
    const f = con ? film : 0, sl = con ? slide : 0;
    return (
      <g>
        <ellipse cx={x} cy={y} rx={170} ry={130} fill={C.sand} stroke={C.sand2} strokeWidth={6} />
        {f > 0 && <ellipse cx={x} cy={y + sl * 200} rx={186} ry={146} fill="none" stroke="#6b4e2e" strokeWidth={22 * f} opacity={1 - sl * 0.6} />}
        {Array.from({ length: 8 }, (_, i) => { const g = (i / 8) * Math.PI * 2, r0 = con ? 200 : 178, ln = 70 * e(t, a + 0.5 + i * 0.08, a + 1 + i * 0.08); const ox = x + Math.cos(g) * r0, oy = y + Math.sin(g) * r0 * 0.78 + (con ? sl * 200 : 0); return <line key={i} x1={ox} y1={oy} x2={ox + Math.cos(g) * ln} y2={oy + Math.sin(g) * ln} stroke="rgba(235,245,255,.9)" strokeWidth={6} strokeLinecap="round" />; })}
      </g>
    );
  };
  return (
    <>
      <Svg>{grano(560, 520, false)}{grano(1360, 520, true)}</Svg>
      <Lbl t={t} at={a + 0.6} text="arena limpia" x={560} y={860} col={C.ok} size={56} />
      <Lbl t={t} at={ba + 0.3} text="se agarra al barro" x={1360} y={860} col={C.red} size={56} />
      {slide > 0.5 && <Cross t={t} at={ba + 2.6} x={1360} y={520} r={60} />}
    </>
  );
};

// 11 · las dos bolsas se mezclan como en el juego de los vasitos; después cada una muestra lo que da
export const TrileroBolsas: React.FC<FxP> = ({ t, a, m }) => {
  const fu = mk(m, "fuerza", a + 4), co = mk(m, "comodo", fu + 1.2);
  const swaps = [a + 0.8, a + 1.6, a + 2.4];
  let pos = 0; swaps.forEach((s) => { pos += e(t, s, s + 0.6); });
  const px = (k: number) => { const n = Math.floor(pos), f = pos - n, side = (k + n) % 2, nside = (k + n + 1) % 2; return { x: lerp(side ? 1360 : 560, nside ? 1360 : 560, f), y: 600 + (k ? -1 : 1) * Math.sin(f * Math.PI) * 120 }; };
  const A = px(0), B = px(1);
  return (
    <>
      <Svg>
        <Bolsa x={A.x} y={A.y} s={1.1} txt="CEMENTO" o={cl(spr(t, a) * 2)} />
        <Bolsa x={B.x} y={B.y} s={1.1} txt="CEMENTO" band={C.cem2} o={cl(spr(t, a + 0.1) * 2)} />
        {t < fu && <text x={960} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={150} fill={C.honey} opacity={e(t, swaps[2] + 0.6, swaps[2] + 1)}>?</text>}
      </Svg>
      <Lbl t={t} at={fu} text="una: fuerza" x={A.x} y={900} col={C.ok} size={60} />
      <Lbl t={t} at={co} text="otra: comodidad" x={B.x} y={900} col={C.honey} size={60} />
    </>
  );
};

// 12 · el tablero de herramientas: siluetas pintadas que se llenan con la herramienta a medida que la nombra
export const TableroSiluetas: React.FC<FxP> = ({ t, a, m }) => {
  const ks = ["baldes", "pala", "carre", "agua", "guan", "maza"].map((k, i) => mk(m, k, a + 0.6 + i * 1.6));
  const sl = (i: number, el: React.ReactNode) => { const f = e(t, ks[i], ks[i] + 0.35), p = spr(t, ks[i], 1.2); return <g><g opacity={0.5 * (1 - f)} style={{ filter: "brightness(0) invert(.85)" }}>{el}</g><g opacity={f} style={{ transform: `scale(${0.9 + 0.1 * p})`, transformBox: "fill-box", transformOrigin: "center" }}>{el}</g></g>; };
  return (
    <>
      <Svg>
        <rect x={240} y={150} width={1440} height={760} rx={20} fill="#6e5032" stroke="#3d2a17" strokeWidth={8} />
        {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={280 + (i % 20) * 72} cy={190 + Math.floor(i / 20) * 92} r={7} fill="#3d2a17" />)}
        {sl(0, <><Balde x={420} y={520} w={180} h={200} /><Balde x={640} y={520} w={180} h={200} /></>)}
        {sl(1, <g><rect x={850} y={220} width={26} height={360} rx={10} fill={C.wood} /><path d="M810,580 L916,580 L900,700 Q863,740 826,700 Z" fill="#8a8d92" /></g>)}
        {sl(2, <g><path d="M1050,330 L1350,330 L1300,480 L1100,480 Z" fill="#56708a" /><circle cx={1110} cy={520} r={40} fill="#222" /><line x1={1350} y1={330} x2={1500} y2={280} stroke="#8a8d92" strokeWidth={14} /></g>)}
        {sl(3, <g><path d="M380,820 q120,-90 240,0 q120,90 240,0" fill="none" stroke="#2f7a3a" strokeWidth={26} strokeLinecap="round" /></g>)}
        {sl(4, <g><ellipse cx={1000} cy={790} rx={60} ry={80} fill="#e2b33a" /><ellipse cx={1140} cy={790} rx={60} ry={80} fill="#e2b33a" /></g>)}
        {sl(5, <g><rect x={1300} y={700} width={300} height={26} rx={11} fill="#b9873f" /><rect x={1260} y={650} width={90} height={126} rx={12} fill="#55585d" /></g>)}
      </Svg>
      <Lbl t={t} at={ks[0] + 0.3} text="dos baldes iguales" x={1500} y={990} col={C.honey} size={52} />
    </>
  );
};

// 13 · el sol y el viento le arrancan el agua a la mezcla y la cuartean; el alero entra y la sombra la protege
export const AleroSombra: React.FC<FxP> = ({ t, a, m }) => {
  const so = mk(m, "sol", a + 0.5), sb = mk(m, "sombra", so + 3), al = e(t, sb, sb + 0.8), crack = e(t, so + 1.2, sb) * (1 - al);
  return (
    <>
      <Svg>
        <Sol t={t} x={1540} y={230} r={80} o={e(t, so, so + 0.4)} />
        <path d="M600,820 Q960,480 1320,820 Z" fill="#7d7870" />
        {Array.from({ length: 10 }, (_, i) => { const u = ((t - so) * 0.7 + i / 10) % 1, o = t < so ? 0 : (1 - al) * Math.sin(u * Math.PI); return <Gota key={i} x={lerp(760 + i * 40, 1500, u)} y={lerp(700 - (i % 4) * 30, 260, u)} r={14} o={o} />; })}
        {crack > 0.02 && <Draw d="M820,770 L880,720 L860,680 L930,640 M1050,760 L1010,700 L1060,660 M1160,780 L1120,740" p={crack} col="#2a2826" w={6} />}
        <g transform={`translate(${lerp(-900, 0, spr(t, sb, 0.9))},0)`}>
          <polygon points="420,380 1420,330 1440,370 440,420" fill="#9da3a8" stroke="#55595d" strokeWidth={4} />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={440 + i * 70} y1={410 - i * 3.5} x2={440 + i * 70} y2={380 - i * 3.5} stroke="#6d7276" strokeWidth={4} />)}
          <polygon points="440,420 1440,370 1500,840 380,840" fill="rgba(0,0,0,.35)" opacity={al} />
        </g>
      </Svg>
      <Lbl t={t} at={so + 0.8} text="el sol roba el agua" x={1560} y={560} col={C.sun} size={52} />
      <Lbl t={t} at={sb + 0.6} text="a la sombra" x={960} y={930} col={C.ok} size={60} />
    </>
  );
};

// 14 · cuatro baldes: uno gris de cemento y tres de arena; se vuelcan en la carretilla y queda «1 + 3»
export const CuatroBaldes: React.FC<FxP> = ({ t, a, m }) => {
  const un = mk(m, "uno", a + 0.4), tr = mk(m, "tres", un + 1);
  const bx = [420, 760, 1100, 1440];
  return (
    <>
      <Svg>
        {bx.map((x, i) => { const at = i === 0 ? un : tr + (i - 1) * 0.3, p = spr(t, at, 1.1); return <g key={i} transform={`translate(0,${(1 - p) * 140})`} opacity={cl(p * 2)}><Balde x={x} y={760} w={240} h={260} lv={0.95} col={i === 0 ? "#8f8b83" : C.sand} /></g>; })}
      </Svg>
      <Pop t={t} at={un + 0.2} x={420} y={360}><Big size={150} col={C.cem}>1</Big></Pop>
      <Pop t={t} at={tr + 0.8} x={1100} y={360}><Big size={150} col={C.sand}>3</Big></Pop>
      <Lbl t={t} at={tr + 1.2} text="cemento portland, arena limpia" x={960} y={930} col={C.ink} size={52} />
    </>
  );
};

// 15 · la contracción: dos losetas fraguan; la rica (1 a 2) se achica más y se raja, la 1 a 3 apenas
export const Contraccion: React.FC<FxP> = ({ t, a, m }) => {
  const ac = mk(m, "achica", a + 1.5), k = e(t, ac, ac + 2), cr = e(t, ac + 1.4, ac + 2.4);
  const losa = (x: number, enc: number, rico: boolean) => { const w = 560 * (1 - enc * k), h = 240 * (1 - enc * k * 0.5); return <g><rect x={x - 280} y={460} width={560} height={240} rx={8} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={3} strokeDasharray="12 10" /><rect x={x - w / 2} y={580 - h / 2} width={w} height={h} rx={8} fill={rico ? "#77736c" : "#9a958d"} />{rico && <Draw d={`M${x - 40},${580 - h / 2} L${x + 10},${560} L${x - 30},${600} L${x + 20},${580 + h / 2}`} p={cr} col="#1c1b19" w={8} />}</g>; };
  return (
    <>
      <Svg>{losa(560, 0.14, true)}{losa(1360, 0.03, false)}</Svg>
      <Lbl t={t} at={a + 0.4} text="1 a 2" x={560} y={340} col={C.honey} size={80} />
      <Lbl t={t} at={a + 0.7} text="1 a 3" x={1360} y={340} col={C.ok} size={80} />
      <Lbl t={t} at={ac + 1.6} text="se achica y se raja" x={560} y={850} col={C.red} size={50} />
      {cr > 0.8 && <Svg><Tick t={t} at={ac + 2.4} x={1360} y={850} r={44} /></Svg>}
    </>
  );
};

// 16 · al ras: el balde colmado como montaña; una regla pasa y barre lo que sobra
export const AlRas: React.FC<FxP> = ({ t, a, m }) => {
  const ra = mk(m, "ras", a + 1.5), sw = e(t, ra, ra + 1.2), colmo = 1 - sw;
  return (
    <>
      <Svg>
        <Balde x={960} y={820} w={420} h={420} lv={0.98} col="#8f8b83" colmo={colmo} />
        <g transform={`translate(${lerp(560, 1360, sw)},${400 - 2}) rotate(-6)`} opacity={e(t, ra - 0.4, ra) * (1 - e(t, ra + 1.3, ra + 1.6))}><rect x={-14} y={-130} width={28} height={190} rx={6} fill={C.wood} /></g>
        {Array.from({ length: 12 }, (_, i) => { const u = cl((t - ra - 0.2 - i * 0.06) / 0.9); return u > 0 && u < 1 ? <circle key={i} cx={lerp(1150, 1300, u) + i * 6} cy={400 + u * u * 400} r={10} fill="#8f8b83" opacity={1 - u} /> : null; })}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="colmado: no" x={1500} y={400} col={C.red} size={56} />
      <Lbl t={t} at={ra + 1.2} text="al ras: sí" x={1500} y={600} col={C.ok} size={56} />
    </>
  );
};

// 17 · las paladas mienten: la balanza se va al lado de la arena mojada; la palada de cemento pierde la mitad en el aire
export const BalanzaPaladas: React.FC<FxP> = ({ t, a, m }) => {
  const mo = mk(m, "moj", a + 1), vu = mk(m, "vuela", mo + 3), tilt = 14 * spr(t, mo, 0.8);
  return (
    <>
      <Svg>
        <g transform="translate(760,520)">
          <polygon points="-40,330 40,330 0,0" fill="#55585d" />
          <g transform={`rotate(${-tilt})`}>
            <rect x={-360} y={-10} width={720} height={20} rx={10} fill="#8a8d92" />
            <g transform="translate(-330,0)"><line x1={0} y1={0} x2={0} y2={110} stroke="#8a8d92" strokeWidth={4} /><path d="M-90,110 L90,110 L70,150 L-70,150 Z" fill="#6b5a3e" /><path d="M-70,110 Q0,40 70,110 Z" fill="#a0784a" /></g>
            <g transform="translate(330,0)"><line x1={0} y1={0} x2={0} y2={110} stroke="#8a8d92" strokeWidth={4} /><path d="M-90,110 L90,110 L70,150 L-70,150 Z" fill="#6b5a3e" /><path d="M-70,110 Q0,70 70,110 Z" fill={C.sand} /></g>
          </g>
        </g>
        <g transform="translate(1480,600)" opacity={e(t, vu - 0.5, vu)}>
          <rect x={-20} y={-300} width={30} height={260} rx={10} fill={C.wood} /><path d="M-90,-40 L80,-40 L60,80 Q-5,120 -70,80 Z" fill="#8a8d92" />
          <path d={`M-70,-40 Q-5,${-120 + 60 * e(t, vu, vu + 2)} 70,-40 Z`} fill="#8f8b83" />
          {Array.from({ length: 30 }, (_, i) => { const u = ((t - vu) * 0.8 + hash(i, 1)) % 1; return t > vu ? <circle key={i} cx={-20 + u * 320} cy={-80 - u * 120 + hash(i, 2) * 60} r={4 + 6 * hash(i, 3)} fill="#b9b4ab" opacity={(1 - u) * 0.8} /> : null; })}
        </g>
      </Svg>
      <Lbl t={t} at={mo + 0.4} text="mojada pesa el doble" x={430} y={900} col={C.water} size={50} />
      <Lbl t={t} at={vu + 0.5} text="se vuela la mitad" x={1480} y={900} col={C.red} size={50} />
    </>
  );
};

// 18 · cuánto alcanza: la cuenta «1 + 3» se reparte en los caños de un baño o en una fila de bloques
export const AlcanzaPara: React.FC<FxP> = ({ t, a, m }) => {
  const ba = mk(m, "bano", a + 0.6), bl = mk(m, "bloq", ba + 2.4);
  return (
    <>
      <Svg>
        <g opacity={e(t, ba, ba + 0.4)}>
          <rect x={300} y={260} width={600} height={520} rx={10} fill="#e9e2d2" stroke="#9b917c" strokeWidth={5} />
          <Draw d="M380,760 L380,420 L640,420 L640,300 M520,420 L520,600 L820,600" p={e(t, ba + 0.2, ba + 1.6)} col="#c9a646" w={22} />
          <Draw d="M380,760 L380,420 L640,420 L640,300 M520,420 L520,600 L820,600" p={e(t, ba + 1, ba + 2.2)} col="#8f8b83" w={10} />
        </g>
        {Array.from({ length: 5 }, (_, i) => { const p = spr(t, bl + i * 0.25, 1.2); return <g key={i} opacity={cl(p * 2)} transform={`translate(${1120 + i * 120},${720 - (1 - p) * 160})`}><rect x={-50} y={-60} width={100} height={60} rx={4} fill="#a6a198" stroke="#5f5b55" strokeWidth={3} /><rect x={-50} y={-120} width={100} height={60} rx={4} fill="#9a958d" stroke="#5f5b55" strokeWidth={3} opacity={i < 4 ? 0 : 0} /></g>; })}
      </Svg>
      <Lbl t={t} at={ba + 0.5} text="los caños de un baño" x={600} y={880} col={C.honey} size={52} />
      <Pop t={t} at={bl + 1.2} x={1360} y={520}><Big size={110} col={C.cem}>4 o 5</Big></Pop>
      <Lbl t={t} at={bl + 1.4} text="bloques para la maza" x={1360} y={880} col={C.ink} size={44} />
    </>
  );
};
