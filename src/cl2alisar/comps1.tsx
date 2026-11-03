// cl2alisar · componentes del gancho a mojar la pared (la mitad y mitad que la mano recorre, la moneda parada, los tres
// dólares por metro, las tres intrigas, los fines de semana de la pieza, el presupuesto que se tacha, mirar de costado, los
// cuatro cuidados, grueso-fino-yeso contra el alisado, una pasta con cinco nombres, el terrón de azúcar, las señales de
// humedad, la prueba de la mano, la luz bajo la regla, la llana que copia, la regla en cruz, la plomada, el tablero de
// herramientas, el cortafrío acostado, fila por fila, la esponja del mismo día, la figurita sobre harina, el pozo aparte,
// el ladrillo esponja y el trapo escurrido). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, shake } from "./kit";

export const mk = (m: Record<string, number>, k: string, d: number) => m[k] ?? d;

// ---------- formas que usan las tres hojas ----------
// pared de ladrillo hueco de frente (x, y = esquina sup. izq.), w × h; liso: 0..1 cuánto está cubierto (de izquierda a derecha)
export const Muro: React.FC<{ x: number; y: number; w: number; h: number; liso?: number; moja?: number; seed?: number; pego?: number; tapa?: string }> = ({ x, y, w, h, liso = 0, moja = 0, seed = 0, pego = 0, tapa = C.end }) => {
  const rh = 54, bw = 150, rows = Math.ceil(h / rh), cid = `mu${seed}${Math.round(w)}${Math.round(h)}`;
  const f = (k: number) => `rgb(${Math.round(lerp(181, 118, moja) + k * 18)},${Math.round(lerp(83, 50, moja) + k * 8)},${Math.round(lerp(47, 28, moja) + k * 5)})`;
  return (
    <g>
      <defs><clipPath id={cid}><rect x={x} y={y} width={w} height={h} rx={6} /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>
        <rect x={x} y={y} width={w} height={h} fill={C.mort} />
        {Array.from({ length: rows }, (_, r) => Array.from({ length: Math.ceil(w / bw) + 2 }, (_, c) => {
          const bx = x + c * bw - (r % 2 ? bw / 2 : 0);
          return <rect key={r + "_" + c} x={bx + 4} y={y + r * rh + 4} width={bw - 8} height={rh - 8} fill={f(hash(seed * 97 + r * 13 + c, 1) - 0.5)} />;
        }))}
        {pego > 0.01 && Array.from({ length: Math.round(w * h / 9000) }, (_, i) => <ellipse key={i} cx={x + hash(seed + i, 3) * w} cy={y + (1 + Math.floor(hash(seed + i, 4) * (rows - 1))) * rh} rx={10 + 14 * hash(seed + i, 5)} ry={6 + 5 * hash(seed + i, 6)} fill={C.mort2} stroke="#46423d" strokeWidth={2} opacity={pego} />)}
        {liso > 0.001 && <rect x={x} y={y} width={w * liso} height={h} fill={tapa} />}
        {liso > 0.001 && liso < 0.999 && <line x1={x + w * liso} x2={x + w * liso} y1={y} y2={y + h} stroke="rgba(0,0,0,.25)" strokeWidth={3} />}
      </g>
    </g>
  );
};
// llana de acero (x, y centro de la hoja), ángulo en grados, carga 0..1
export const Llana: React.FC<{ x: number; y: number; rot?: number; carga?: number; s?: number; col?: string }> = ({ x, y, rot = 0, carga = 0, s = 1, col = C.prim }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-46} width={300} height={92} rx={10} fill={C.alu} stroke={C.alu2} strokeWidth={3} />
    {carga > 0.01 && <path d={`M-140,${46} Q-60,${46 + 30 * carga} 40,${46 + 18 * carga} L40,46 Z`} fill={col} />}
    <rect x={-20} y={-80} width={40} height={36} fill={C.alu2} /><rect x={-90} y={-112} width={180} height={40} rx={20} fill={C.wood} />
  </g>
);
// espátula (x, y = centro del filo), ancho w
export const Espatula: React.FC<{ x: number; y: number; w: number; rot?: number; carga?: number; col?: string }> = ({ x, y, w, rot = 0, carga = 0, col = C.end }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <path d={`M${-w / 2},0 L${w / 2},0 L${w * 0.16},-90 L${-w * 0.16},-90 Z`} fill={C.alu} stroke={C.alu2} strokeWidth={3} />
    {carga > 0.01 && <rect x={-w / 2 + 4} y={-16 * carga} width={w - 8} height={16 * carga} rx={6} fill={col} />}
    <rect x={-18} y={-210} width={36} height={124} rx={12} fill={C.wood} />
  </g>
);
// balde (x centro, y base) con contenido de color
export const Balde: React.FC<{ x: number; y: number; w?: number; h?: number; lv?: number; col?: string; o?: number; tag?: string }> = ({ x, y, w = 170, h = 190, lv = 0, col = C.prim, o = 1 }) => {
  const wb = w * 0.8, yl = y - h * lv, wl = lerp(wb, w, lv);
  return (
    <g opacity={o}>
      <ellipse cx={x + 6} cy={y + 6} rx={wb * 0.6} ry={12} fill="rgba(0,0,0,.4)" />
      {lv > 0.01 && <path d={`M${x - wb / 2 + 6},${y - 4} L${x - wl / 2 + 6},${yl} L${x + wl / 2 - 6},${yl} L${x + wb / 2 - 6},${y - 4} Z`} fill={col} />}
      <path d={`M${x - w / 2},${y - h} L${x - wb / 2},${y} L${x + wb / 2},${y} L${x + w / 2},${y - h}`} fill="rgba(140,170,190,.18)" stroke="#7d98ac" strokeWidth={6} strokeLinejoin="round" />
      <path d={`M${x - w / 2},${y - h} Q${x},${y - h - 70} ${x + w / 2},${y - h}`} fill="none" stroke="#5c6f7e" strokeWidth={4} />
    </g>
  );
};
// regla de aluminio (x0,y0)→(x1,y1)
export const Regla: React.FC<{ x0: number; y0: number; x1: number; y1: number; o?: number }> = ({ x0, y0, x1, y1, o = 1 }) => {
  const a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, L = Math.hypot(x1 - x0, y1 - y0);
  return <g opacity={o} transform={`translate(${x0},${y0}) rotate(${a})`}><rect x={0} y={-13} width={L} height={26} rx={4} fill={C.alu} stroke={C.alu2} strokeWidth={2} /><rect x={0} y={-13} width={L} height={7} fill="rgba(255,255,255,.35)" /></g>;
};

// 1 · mitad ladrillo, mitad lisa: un dedo recorre la pared; del lado liso corre, del lado del ladrillo salta en cada junta
export const MitadYMitad: React.FC<FxP> = ({ t, a, m }) => {
  const pasa = mk(m, "pasa", a + 2), u = e(t, pasa, pasa + 3.2), px = lerp(360, 1560, u);
  const enLad = px > 960, salto = enLad ? Math.abs(Math.sin((px - 960) / 150 * Math.PI)) * 18 : 0;
  return (
    <>
      <Svg>
        <Muro x={300} y={160} w={1320} h={700} liso={0.5} seed={2} pego={1} />
        <line x1={960} x2={960} y1={160} y2={860} stroke="rgba(255,236,200,.5)" strokeWidth={3} strokeDasharray="12 10" opacity={e(t, a + 0.5, a + 1)} />
        {t > pasa && <g opacity={cl((t - pasa) * 4)}><path d={`M360,520 L${px},${520}`} stroke={enLad ? C.red : C.ok} strokeWidth={6} strokeDasharray="4 12" opacity={0.6} /><circle cx={px} cy={520 - salto} r={34} fill="rgba(255,236,200,.92)" stroke={C.wood} strokeWidth={4} /></g>}
      </Svg>
      <Lbl t={t} at={pasa + 1} text="corre sola" x={630} y={960} size={54} col={C.ok} />
      <Lbl t={t} at={pasa + 2.4} text="se traba" x={1290} y={960} size={54} col={C.red} />
    </>
  );
};

// 2 · menos que una moneda parada: la capa que separa una mitad de la otra, al lado de una moneda de canto
export const MonedaParada: React.FC<FxP> = ({ t, a, m }) => {
  const mo = mk(m, "moneda", a + 1.6), p = spr(t, mo, 0.9);
  return (
    <>
      <Svg>
        <rect x={360} y={260} width={240} height={560} fill={C.lad} /><rect x={600} y={260} width={34 * e(t, a + 0.4, a + 1.4)} height={560} fill={C.end} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={380} y={280 + i * 92} width={200} height={70} fill="#1c1410" opacity={0.6} />)}
        <g transform={`translate(1100,${820 - 160 * p})`} opacity={cl((t - mo) * 4)}><rect x={-18} y={-160} width={36} height={320} rx={18} fill="#c9a24a" stroke="#8a6a22" strokeWidth={4} /><rect x={-6} y={-150} width={12} height={300} fill="rgba(255,255,255,.35)" /></g>
        <Draw d="M640,540 L1060,540" p={e(t, mo + 0.6, mo + 1.4)} col={C.honey} w={4} dash={undefined} />
      </Svg>
      <Lbl t={t} at={a + 1.2} text="unos milímetros" x={617} y={200} size={48} col={C.end} />
      <Lbl t={t} at={mo + 1} text="menos que una moneda" x={1100} y={960} size={50} col={C.honey} />
    </>
  );
};

// 3 · tres dólares el metro: un metro cuadrado de pared que se llena y un contador que sube hasta 3
export const TresPorMetro: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "tres", a + 1.2), f = e(t, a + 0.3, k), v = Math.min(3, 3 * e(t, k - 0.4, k + 1));
  return (
    <>
      <Svg>
        <Muro x={460} y={240} w={600} h={600} liso={f} seed={3} />
        <rect x={460} y={240} width={600} height={600} fill="none" stroke={C.honey} strokeWidth={6} strokeDasharray="20 12" />
        <Draw d="M460,880 L1060,880" p={e(t, a + 0.5, a + 1.2)} col={C.honey} w={4} /><Draw d="M1100,240 L1100,840" p={e(t, a + 0.7, a + 1.4)} col={C.honey} w={4} />
      </Svg>
      <Lbl t={t} at={a + 1.2} text="1 m" x={760} y={930} size={44} col={C.honey} />
      <Pop t={t} at={k - 0.4} x={1440} y={500}><Big size={240} col={C.ok} style={{ whiteSpace: "nowrap" }}>US$ {v.toFixed(0)}</Big></Pop>
      <Lbl t={t} at={k + 0.6} text="en materiales" x={1440} y={700} size={50} col={C.ink} />
    </>
  );
};

// 4 · tres intrigas en tres tarjetas: la pared que no sirve, la linterna, la rajadura de un mes
export const TresIntrigas: React.FC<FxP> = ({ t, a, m }) => {
  const ks = [mk(m, "i1", a + 0.6), mk(m, "i2", a + 4), mk(m, "i3", a + 8)];
  return (
    <>
      <Svg>
        {ks.map((at, i) => {
          const x = 380 + i * 580, p = spr(t, at, 0.9), dim = i < 2 && t > ks[i + 1] ? 0.45 : 1;
          return <g key={i} opacity={cl((t - at) * 4) * dim} transform={`translate(${x},${540 + (1 - p) * 140})`}>
            <rect x={-230} y={-260} width={460} height={430} rx={26} fill="rgba(24,22,20,.86)" stroke="rgba(255,236,200,.3)" strokeWidth={2} />
            {i === 0 && <g><Muro x={-170} y={-200} w={340} h={240} seed={4} /><Regla x0={-190} y0={-70} x1={190} y1={-70} /><path d="M-150,-56 Q0,-20 150,-56" stroke={C.luz} strokeWidth={5} fill="none" /></g>}
            {i === 1 && <g><rect x={-170} y={-200} width={340} height={240} fill={C.end2} />{Array.from({ length: 4 }, (_, q) => <rect key={q} x={-170} y={-190 + q * 60} width={340} height={22} fill="rgba(20,16,10,.45)" opacity={e(t, at + 0.5, at + 1.5)} />)}<rect x={-200} y={-100} width={60} height={30} rx={8} fill="#5b5f63" /><path d="M-140,-85 L170,-200 L170,40 Z" fill={C.luz} opacity={0.25 * e(t, at + 0.3, at + 1)} /></g>}
            {i === 2 && <g><rect x={-170} y={-200} width={240} height={240} fill={C.end} /><rect x={70} y={-200} width={100} height={240} fill={C.horm} /><polyline points="70,-200 66,-150 74,-100 67,-50 73,0 70,40" fill="none" stroke="#1a1714" strokeWidth={5} strokeDasharray={`${e(t, at + 0.5, at + 2) * 260} 999`} /></g>}
            <text x={0} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={[C.red, C.luz, C.honey][i]}>{["LA PARED QUE NO", "LA LINTERNA", "AL MES"][i]}</text>
          </g>;
        })}
      </Svg>
    </>
  );
};

// 5 · la pieza del fondo, ladrillo por ladrillo, los fines de semana: la pared sube por hileras y cuenta sábados
export const FinesDeSemana: React.FC<FxP> = ({ t, a, b }) => {
  const sube = e(t, a + 0.5, b - 1.5), filas = Math.floor(sube * 12), finde = Math.max(1, Math.round(sube * 16));
  return (
    <>
      <Svg>
        <rect x={360} y={880} width={1200} height={20} fill={C.mort2} />
        {Array.from({ length: filas }, (_, r) => Array.from({ length: 8 }, (_, c) => <rect key={r + "_" + c} x={380 + c * 146 - (r % 2 ? 73 : 0) + (r % 2 && c === 0 ? 73 : 0)} y={826 - r * 54} width={r % 2 && c === 0 ? 65 : 138} height={46} fill={C.lad} stroke={C.lad2} strokeWidth={2} opacity={r === filas - 1 ? cl((sube * 12 - filas + 1) * 3 + 0.3) : 1} />))}
      </Svg>
      <Pop t={t} at={a + 0.8} x={1640} y={300}><Big size={140} col={C.honey}>{finde}</Big></Pop>
      <Lbl t={t} at={a + 1} text="fines de semana" x={1640} y={430} size={44} col={C.ink} />
    </>
  );
};

// 6 · el presupuesto: revoque grueso, fino y yeso, renglón por renglón, y se tacha todo
export const PresupuestoTachado: React.FC<FxP> = ({ t, a, m }) => {
  const rs = ["revoque grueso", "revoque fino", "yeso"], tacha = mk(m, "tacha", a + 4);
  return (
    <>
      <Svg>
        <g transform={`translate(960,520) rotate(${-3 + 2 * spr(t, a, 0.7)})`}>
          <rect x={-380} y={-330} width={760} height={640} rx={10} fill={C.cream} />
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={-340} x2={340} y1={-200 + i * 52} y2={-200 + i * 52} stroke="rgba(80,110,160,.25)" strokeWidth={2} />)}
          <text x={-330} y={-240} fontFamily={FONT} fontWeight={800} fontSize={54} fill="#3a2c1c">PRESUPUESTO</text>
          {rs.map((w, i) => <g key={w} opacity={e(t, a + 0.6 + i * 0.6, a + 1 + i * 0.6)}><text x={-320} y={-130 + i * 110} fontFamily={FONT} fontWeight={700} fontSize={56} fill="#3a2c1c">{w}</text><text x={300} y={-130 + i * 110} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={56} fill="#3a2c1c">$ ???</text><Draw d={`M-330,${-148 + i * 110} L320,${-140 + i * 110}`} p={e(t, tacha + i * 0.3, tacha + 0.4 + i * 0.3)} col={C.red} w={9} /></g>)}
        </g>
      </Svg>
      <Lbl t={t} at={tacha + 1.4} text="sin las tres" x={960} y={950} size={60} col={C.ok} />
    </>
  );
};

// 7 · la pared se mira de costado: un ojo que gira de frente a de costado y la pared lisa se vuelve ondulada
export const MirarDeCostado: React.FC<FxP> = ({ t, a, m }) => {
  const g = mk(m, "costado", a + 2), k = e(t, g, g + 1.6), sk = lerp(0, 62, k);
  return (
    <>
      <Svg>
        <g transform={`translate(1060,540) skewY(${-sk * 0.35}) scale(${lerp(1, 0.45, k)},1)`}>
          <rect x={-300} y={-300} width={600} height={600} fill={C.end} />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-300} y={-270 + i * 100} width={600} height={34} fill="rgba(20,16,10,.5)" opacity={k} />)}
        </g>
        <g transform={`translate(${lerp(420, 300, k)},540)`}><ellipse rx={90} ry={54} fill="#f6f1e6" /><circle cx={lerp(0, 40, k)} r={34} fill="#3e5a6a" /><circle cx={lerp(0, 40, k)} r={14} fill="#0d0c0b" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="de frente" x={1060} y={180} size={50} col={C.ink} out={g} />
      <Lbl t={t} at={g + 1} text="de costado" x={1060} y={180} size={56} col={C.luz} />
    </>
  );
};

// 8 · los cuatro cuidados: anteojos, barbijo, guantes de goma, ventana abierta (cada uno entra con su motivo)
export const CuatroCuidados: React.FC<FxP> = ({ t, a, m }) => {
  const it = [["anteojos", "an", C.celeste], ["barbijo", "ba", C.end], ["guantes de goma", "gu", C.honey], ["ventana abierta", "ve", C.ok]] as const;
  return (
    <>
      <Svg>
        {it.map(([, k, col], i) => {
          const at = mk(m, k, a + 0.6 + i * 1.5), x = 330 + i * 420, p = spr(t, at);
          return <g key={k} opacity={cl((t - at) * 5)} transform={`translate(${x},${470 + (1 - p) * 90})`}>
            <circle r={150} fill="rgba(24,22,20,.86)" stroke={col} strokeWidth={6} />
            {i === 0 && <g fill="none" stroke={col} strokeWidth={10}><rect x={-100} y={-34} width={84} height={64} rx={20} /><rect x={16} y={-34} width={84} height={64} rx={20} /><path d="M-16,-6 L16,-6" /></g>}
            {i === 1 && <g><path d="M-90,-30 Q0,-70 90,-30 L80,40 Q0,90 -80,40 Z" fill={col} />{[-10, 10, 30].map((yy) => <line key={yy} x1={-60} x2={60} y1={yy} y2={yy} stroke="#b9b3a6" strokeWidth={4} />)}</g>}
            {i === 2 && <path d="M-50,90 L-50,-20 L-60,-70 Q-55,-90 -38,-75 L-30,-30 L-25,-90 Q-15,-105 -5,-90 L0,-30 L8,-95 Q20,-108 30,-92 L28,-28 L45,-70 Q60,-80 62,-60 L45,20 L40,90 Z" fill={col} />}
            {i === 3 && <g><rect x={-90} y={-90} width={180} height={180} fill="none" stroke={C.alu} strokeWidth={10} /><rect x={-90} y={-90} width={60 + 60 * e(t, at + 0.3, at + 1)} height={180} fill="rgba(160,210,255,.3)" stroke={C.alu} strokeWidth={6} />{[0, 1, 2].map((q) => <path key={q} d={`M${20 + q * 10},${-50 + q * 40} q30,-12 60,0`} stroke={col} strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 5 + q)} />)}</g>}
          </g>;
        })}
      </Svg>
      {it.map(([w, k, col], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.5) + 0.3} text={w} x={330 + i * 420} y={720} size={42} col={col} />)}
    </>
  );
};

// 9 · tres capas de obra contra una: revoque grueso + fino + yeso en corte, y al lado el alisado de milímetros
export const GruesoFinoYeso: React.FC<FxP> = ({ t, a, m }) => {
  const al = mk(m, "alisa", a + 5), cs = [["grueso: 2 cm", 120, C.prim2], ["fino", 30, C.prim], ["yeso", 16, C.end]] as const;
  let acc = 0;
  return (
    <>
      <Svg>
        <rect x={300} y={240} width={180} height={560} fill={C.lad} /><rect x={1140} y={240} width={180} height={560} fill={C.lad} />
        {cs.map(([, w, col], i) => { const x = 480 + acc; acc += w; return <rect key={i} x={x} y={240} width={w * e(t, a + 0.6 + i * 1.2, a + 1.4 + i * 1.2)} height={560} fill={col} />; })}
        <rect x={1320} y={240} width={22 * e(t, al, al + 1)} height={560} fill={C.end} />
      </Svg>
      {cs.map(([w], i) => <Lbl key={w} t={t} at={a + 1 + i * 1.2} text={w} x={760} y={320 + i * 90} size={44} col={[C.prim2, C.prim, C.end][i]} align="left" />)}
      <Lbl t={t} at={al + 0.6} text="alisado: milímetros" x={1500} y={880} size={48} col={C.ok} />
    </>
  );
};

// 10 · una pasta, cinco nombres: el mismo balde blanco y la etiqueta que cambia con el país
export const UnaPastaCincoNombres: React.FC<FxP> = ({ t, a, m }) => {
  const ns = [["Argentina", "enduido", "ar"], ["Uruguay", "enduido plástico", "uy"], ["Colombia y Perú", "estuco", "co"], ["México", "pasta", "mx"], ["España", "aguaplast", "es"]] as const;
  let cur = 0;
  ns.forEach(([, , k], i) => { if (t >= mk(m, k, a + 0.5 + i * 1.6)) cur = i; });
  const at = mk(m, ns[cur][2], a + 0.5 + cur * 1.6);
  return (
    <>
      <Svg>
        <Balde x={760} y={820} w={420} h={460} lv={0.85} col={C.end} />
        <g transform={`translate(760,${600 + shake(t, at, 6)})`}><rect x={-170} y={-60} width={340} height={120} rx={10} fill={C.cream} /><text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={ns[cur][1].length > 10 ? 40 : 58} fill="#3a2c1c">{ns[cur][1].toUpperCase()}</text></g>
      </Svg>
      {ns.map(([pais, , k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.5 + i * 1.6)} text={pais} x={1260} y={260 + i * 130} size={46} col={i === cur ? C.honey : C.dim} align="left" />)}
    </>
  );
};

// 11 · el agua sube por el ladrillo como por un terrón de azúcar: dos columnas que se oscurecen desde abajo
export const TerronDeAzucar: React.FC<FxP> = ({ t, a, m }) => {
  const az = mk(m, "azucar", a + 1.5), lv = e(t, a + 0.6, a + 6), lz = e(t, az, az + 4);
  return (
    <>
      <Svg>
        <rect x={360} y={860} width={1200} height={60} fill={C.agua} opacity={0.45} />
        <g><rect x={480} y={300} width={300} height={560} fill={C.lad} />{[0, 1, 2, 3].map((q) => <rect key={q} x={500} y={320 + q * 135} width={260} height={110} fill="#1c1410" opacity={0.5} />)}<rect x={480} y={860 - 300 * lv} width={300} height={300 * lv} fill={C.hum} opacity={0.6} /></g>
        <g opacity={e(t, az - 0.3, az + 0.3)}><rect x={1140} y={600} width={260} height={260} fill="#f8f6f0" />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={1150 + hash(i, 1) * 240} cy={610 + hash(i, 2) * 240} r={3} fill="#e0dbd0" />)}<rect x={1140} y={860 - 260 * lz} width={260} height={260 * lz} fill="#b48a5a" opacity={0.55} /></g>
        <Draw d="M630,840 L630,560" p={lv} col={C.agua} w={6} />
      </Svg>
      <Lbl t={t} at={a + 1.2} text="sube desde el piso" x={630} y={220} size={46} col={C.agua} />
      <Lbl t={t} at={az + 0.6} text="como el azúcar" x={1270} y={500} size={46} col={C.honey} />
    </>
  );
};

// 12 · las cuatro señales de humedad, abajo de la pared: mancha, sal, ampolla, frío
export const SenalesHumedad: React.FC<FxP> = ({ t, a, m }) => {
  const ss = [["mancha oscura", "s1"], ["polvito de sal", "s2"], ["ampolla", "s3"], ["frío al tacto", "s4"]] as const;
  return (
    <>
      <Svg>
        <Muro x={260} y={200} w={1400} h={640} seed={12} />
        <line x1={260} x2={1660} y1={840 - 270} y2={840 - 270} stroke={C.honey} strokeWidth={4} strokeDasharray="16 10" opacity={e(t, a + 0.4, a + 1)} />
        {ss.map(([, k], i) => {
          const at = mk(m, k, a + 1 + i * 1.6), x = 430 + i * 350, o = e(t, at, at + 0.8);
          return <g key={k} opacity={o}>
            {i === 0 && <path d={`M${x - 120},840 Q${x - 60},640 ${x},700 Q${x + 80},620 ${x + 120},840 Z`} fill={C.hum} opacity={0.7} />}
            {i === 1 && Array.from({ length: 40 }, (_, q) => <circle key={q} cx={x - 110 + hash(q, 5) * 220} cy={700 + hash(q, 6) * 130} r={2 + 3 * hash(q, 7)} fill={C.sal} />)}
            {i === 2 && <g><ellipse cx={x} cy={720} rx={90 * o} ry={60 * o} fill={C.end2} stroke="#8d877c" strokeWidth={3} /><ellipse cx={x - 20} cy={700} rx={30} ry={16} fill="rgba(255,255,255,.6)" /></g>}
            {i === 3 && <g><rect x={x - 14} y={630} width={28} height={150} rx={14} fill="#eef3f6" /><rect x={x - 8} y={700} width={16} height={74} rx={8} fill={C.celeste} /><circle cx={x} cy={790} r={26} fill={C.celeste} /></g>}
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={a + 0.8} text="primeros 50 cm" x={1500} y={530} size={42} col={C.honey} />
      {ss.map(([w, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 1 + i * 1.6) + 0.3} text={w} x={430 + i * 350} y={920} size={40} col={C.ink} />)}
    </>
  );
};

// 13 · la prueba de la mano: abajo y arriba, el mismo calor; un termómetro doble que queda parejo
export const PruebaDeLaMano: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "mano", a + 1.4), p = e(t, k, k + 1.4);
  return (
    <>
      <Svg>
        <Muro x={420} y={160} w={560} h={760} seed={13} />
        {[[300, "arriba"], [820, "abajo"]].map(([yy], i) => <g key={i} opacity={e(t, k + i * 0.5, k + 0.5 + i * 0.5)}><circle cx={700} cy={yy as number} r={58} fill="rgba(255,236,200,.85)" stroke={C.wood} strokeWidth={4} /></g>)}
        {[0, 1].map((i) => <g key={i} transform={`translate(${1260 + i * 220},540)`}><rect x={-26} y={-240} width={52} height={420} rx={26} fill="#eef3f6" /><rect x={-14} y={140 - 330 * 0.55 * p} width={28} height={330 * 0.55 * p + 30} rx={14} fill={C.honey} /><circle cy={200} r={44} fill={C.honey} /></g>)}
      </Svg>
      <Lbl t={t} at={k + 0.6} text="arriba" x={1260} y={860} size={40} col={C.dim} />
      <Lbl t={t} at={k + 0.8} text="abajo" x={1480} y={860} size={40} col={C.dim} />
      <Lbl t={t} at={k + 2} text="seca y tibia" x={1370} y={960} size={54} col={C.ok} />
    </>
  );
};

// 14 · la luz bajo la regla: la regla se apoya, aparece la rayita de luz, y al lado el grueso de un dedo como vara
export const LuzBajoLaRegla: React.FC<FxP> = ({ t, a, m }) => {
  const ap = mk(m, "apoya", a + 1), luz = e(t, ap + 0.8, ap + 1.6), dedo = mk(m, "dedo", a + 4);
  return (
    <>
      <Svg>
        <path d="M300,700 Q960,660 1620,700 L1620,900 L300,900 Z" fill={C.lad} />
        <g transform={`translate(0,${(1 - spr(t, ap)) * -120})`}><Regla x0={320} y0={672} x1={1600} y1={672} /></g>
        <path d={`M360,686 Q960,${686 + 26 * luz} 1560,686`} stroke={C.luz} strokeWidth={8} fill="none" opacity={luz} style={{ filter: `drop-shadow(0 0 10px ${C.luz})` }} />
        <g opacity={e(t, dedo, dedo + 0.8)} transform="translate(960,420)"><rect x={-60} y={-70} width={120} height={140} rx={60} fill="#d9a07a" /><Draw d="M-90,-90 L-90,90" p={1} col={C.honey} w={4} /><Draw d="M90,-90 L90,90" p={1} col={C.honey} w={4} /></g>
      </Svg>
      <Lbl t={t} at={ap + 1.8} text="4 a 5 mm: se puede" x={960} y={960} size={52} col={C.ok} />
      <Lbl t={t} at={dedo + 0.5} text="un dedo: el límite" x={960} y={240} size={50} col={C.honey} />
    </>
  );
};

// 15 · la llana copia la panza: una pared con panza recibe la capa finita y la capa copia la curva
export const LaLlanaCopia: React.FC<FxP> = ({ t, a, m }) => {
  const cp = mk(m, "copia", a + 2), p = e(t, cp, cp + 2.4), panza = (y: number) => 60 * Math.sin(((y - 200) / 680) * Math.PI);
  const path = (d: number) => `M${700 + d},200 ` + Array.from({ length: 18 }, (_, i) => { const y = 200 + i * 40; return `L${700 + d + panza(y)},${y}`; }).join(" ");
  return (
    <>
      <Svg>
        <path d={`${path(0)} L400,880 L400,200 Z`} fill={C.lad} />
        <path d={path(26)} stroke={C.end} strokeWidth={26} fill="none" strokeDasharray={`${p * 760} 2000`} />
        <line x1={760} x2={760} y1={180} y2={900} stroke={C.alu} strokeWidth={6} strokeDasharray="14 10" opacity={e(t, a + 0.6, a + 1.2)} />
        <Llana x={790 + panza(200 + 680 * p)} y={200 + 680 * p} rot={90} carga={0.6} s={0.6} col={C.end} />
      </Svg>
      <Lbl t={t} at={a + 0.8} text="panza de 2 cm" x={1300} y={420} size={50} col={C.red} />
      <Lbl t={t} at={cp + 2.6} text="queda ondulada" x={1300} y={560} size={50} col={C.honey} />
    </>
  );
};

// 16 · la regla en cruz: parada, acostada, cruzada, en tres lugares de la misma pared
export const ReglaEnCruz: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [[960, 540, 90, "parada", "pa"], [960, 540, 0, "acostada", "ac"], [960, 540, 38, "cruzada", "cr"]] as const;
  let cur = 0;
  ps.forEach(([, , , , k], i) => { if (t >= mk(m, k, a + 0.6 + i * 1.6)) cur = i; });
  const at = mk(m, ps[cur][4], a + 0.6 + cur * 1.6), [x, y, ang] = ps[cur], L = 560, r = (ang as number) * Math.PI / 180;
  return (
    <>
      <Svg>
        <Muro x={420} y={150} w={1080} h={780} seed={16} />
        {ps.slice(0, cur).map(([xx, yy, aa], i) => { const rr = (aa as number) * Math.PI / 180; return <line key={i} x1={(xx as number) - Math.cos(rr) * L / 2} y1={(yy as number) - Math.sin(rr) * L / 2} x2={(xx as number) + Math.cos(rr) * L / 2} y2={(yy as number) + Math.sin(rr) * L / 2} stroke={C.ok} strokeWidth={6} strokeDasharray="12 10" opacity={0.6} />; })}
        <g transform={`translate(0,${(1 - spr(t, at)) * -60})`}><Regla x0={(x as number) - Math.cos(r) * L / 2} y0={(y as number) - Math.sin(r) * L / 2} x1={(x as number) + Math.cos(r) * L / 2} y1={(y as number) + Math.sin(r) * L / 2} /></g>
      </Svg>
      {ps.map(([, , , w, k], i) => <Lbl key={k} t={t} at={mk(m, k, a + 0.6 + i * 1.6) + 0.2} text={w} x={1700} y={360 + i * 120} size={48} col={i === cur ? C.honey : C.dim} />)}
    </>
  );
};

// 17 · la plomada: un hilo con su peso que se balancea y se aquieta; dos distancias que se miden arriba y abajo
export const PlomadaHilo: React.FC<FxP> = ({ t, a, m }) => {
  const q = mk(m, "quieta", a + 2.5), sw = 14 * Math.sin((t - a) * 3.2) * Math.exp(-Math.max(0, t - a) * 0.9), d1 = e(t, q, q + 0.8), d2 = e(t, q + 1, q + 1.8);
  return (
    <>
      <Svg>
        <path d="M600,140 L660,140 L640,940 L580,940 Z" fill={C.lad} /><rect x={560} y={130} width={140} height={20} fill={C.mort2} />
        <g transform={`rotate(${sw} 760 150)`}><line x1={760} y1={150} x2={760} y2={880} stroke={C.ink} strokeWidth={3} /><path d="M740,880 L780,880 L760,940 Z" fill={C.honey} /></g>
        <Draw d="M664,250 L758,250" p={d1} col={C.ok} w={6} /><Draw d="M640,820 L758,820" p={d2} col={C.ok} w={6} />
      </Svg>
      <Lbl t={t} at={q + 0.6} text="arriba" x={1000} y={250} size={46} col={C.ok} align="left" />
      <Lbl t={t} at={q + 1.6} text="abajo, parecido" x={1000} y={820} size={46} col={C.ok} align="left" />
    </>
  );
};

// 18 · el tablero de herramientas: siluetas que se llenan de a una (la espátula ancha se queda brillando)
export const TableroHerramientas: React.FC<FxP> = ({ t, a, m }) => {
  const hs = ["llana", "espátula chica", "espátula ancha", "cortafrío", "cepillo", "pincel", "lija y taco", "linterna"];
  const an = mk(m, "ancha", a + 9);
  return (
    <>
      <Svg>
        <rect x={260} y={140} width={1400} height={800} rx={14} fill="#6b4a2a" />
        {Array.from({ length: 140 }, (_, i) => <circle key={i} cx={300 + (i % 20) * 68} cy={180 + Math.floor(i / 20) * 110} r={6} fill="#4a321c" />)}
        {hs.map((w, i) => {
          const x = 440 + (i % 4) * 340, y = 380 + Math.floor(i / 4) * 340, at = a + 0.5 + i * 0.7, on = e(t, at, at + 0.3), glow = i === 2 && t > an;
          return <g key={w}>
            <rect x={x - 110} y={y - 140} width={220} height={200} rx={16} fill="none" stroke={glow ? C.luz : "rgba(255,236,200,.5)"} strokeWidth={glow ? 6 : 3} strokeDasharray="12 8" />
            <g opacity={on} transform={`translate(${x},${y - 30}) scale(${0.6 + 0.4 * spr(t, at)})`}>
              {i === 0 && <Llana x={0} y={10} s={0.55} />}
              {i === 1 && <Espatula x={0} y={60} w={70} />}
              {i === 2 && <Espatula x={0} y={60} w={190} />}
              {i === 3 && <g><rect x={-12} y={-90} width={24} height={170} fill={C.alu2} /><path d="M-12,80 L12,80 L0,110 Z" fill={C.alu} /></g>}
              {i === 4 && <g><rect x={-80} y={-20} width={160} height={40} rx={8} fill={C.wood} />{Array.from({ length: 12 }, (_, q) => <line key={q} x1={-70 + q * 13} x2={-70 + q * 13} y1={20} y2={50} stroke={C.alu} strokeWidth={3} />)}</g>}
              {i === 5 && <g><rect x={-14} y={-100} width={28} height={110} rx={8} fill={C.wood} /><path d="M-40,10 L40,10 L34,80 L-34,80 Z" fill="#e0c79a" /></g>}
              {i === 6 && <g><rect x={-80} y={-40} width={160} height={80} rx={8} fill={C.wood} /><rect x={-80} y={30} width={160} height={14} fill="#c9b27a" /></g>}
              {i === 7 && <g><rect x={-90} y={-26} width={150} height={52} rx={10} fill="#5b5f63" /><path d="M60,-36 L100,-50 L100,50 L60,36 Z" fill="#8a8f94" /><path d="M100,-40 L240,-90 L240,90 L100,40 Z" fill={C.luz} opacity={0.3} /></g>}
            </g>
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={an + 0.4} text="la que más cambia" x={1120} y={980} size={50} col={C.luz} />
    </>
  );
};

// 19 · el cortafrío: de frente rompe la cara del ladrillo hueco; acostado, pela el pegote entero
export const CortafrioAcostado: React.FC<FxP> = ({ t, a, m }) => {
  const fr = mk(m, "frente", a + 1), ac = mk(m, "costado", a + 4), salta = e(t, ac + 0.6, ac + 1.4);
  return (
    <>
      <Svg>
        {[0, 1].map((i) => <g key={i} transform={`translate(${520 + i * 880},560)`}>
          <rect x={-300} y={-150} width={600} height={300} fill={C.lad} />{[0, 1, 2].map((q) => <rect key={q} x={-270 + q * 190} y={-120} width={160} height={240} fill="#1c1410" />)}
          <rect x={-300} y={-160} width={600} height={14} fill={C.mort} />
        </g>)}
        <g opacity={e(t, fr, fr + 0.3)}>
          <g transform={`translate(${520 + shake(t, fr + 0.8, 10)},${380 - 40 * e(t, fr + 0.4, fr + 0.8)}) rotate(90)`}><rect x={-12} y={-150} width={24} height={150} fill={C.alu2} /><path d="M-12,0 L12,0 L0,30 Z" fill={C.alu} /></g>
          <path d="M470,410 L520,470 L560,420 L590,480 L640,415 Z" fill="#1c1410" opacity={e(t, fr + 0.8, fr + 1)} />
          <Cross t={t} at={fr + 1.1} x={520} y={260} r={40} />
        </g>
        <g opacity={e(t, ac, ac + 0.3)}>
          <ellipse cx={1400 - 120 * salta} cy={396 - 160 * salta} rx={60} ry={26} fill={C.mort2} stroke="#46423d" strokeWidth={3} transform={`rotate(${-50 * salta} ${1400 - 120 * salta} ${396 - 160 * salta})`} />
          <g transform={`translate(${1560 - 100 * e(t, ac + 0.2, ac + 0.6)},400) rotate(${-8})`}><rect x={0} y={-12} width={220} height={24} fill={C.alu2} /><path d="M0,-12 L0,12 L-30,0 Z" fill={C.alu} /></g>
          <Tick t={t} at={ac + 1.3} x={1400} y={260} r={40} />
        </g>
      </Svg>
      <Lbl t={t} at={fr + 1.2} text="de frente rompe" x={520} y={820} size={46} col={C.red} />
      <Lbl t={t} at={ac + 1.4} text="acostado, pela" x={1400} y={820} size={46} col={C.ok} />
    </>
  );
};

// 20 · fila por fila: la pared con pegotes se limpia de a una hilera, de punta a punta, con la barra de progreso al costado
export const FilaPorFila: React.FC<FxP> = ({ t, a, b }) => {
  const rows = 8, p = e(t, a + 0.6, b - 1) * rows;
  return (
    <>
      <Svg>
        <Muro x={300} y={160} w={1200} h={432} seed={20} />
        {Array.from({ length: rows }, (_, r) => Array.from({ length: 7 }, (_, c) => { const cx = 360 + c * 170 + 40 * hash(r * 7 + c, 1), done = p > r + (c + 1) / 7; return <ellipse key={r + "_" + c} cx={cx} cy={160 + (r + 1) * 54} rx={22} ry={9} fill={C.mort2} stroke="#46423d" strokeWidth={2} opacity={done ? 0 : 1} />; }))}
        <rect x={300} y={160 + Math.min(rows - 1, Math.floor(p)) * 54} width={1200} height={54} fill="none" stroke={C.honey} strokeWidth={5} />
        <rect x={1560} y={160} width={40} height={432} rx={20} fill="rgba(255,236,200,.15)" /><rect x={1560} y={160} width={40} height={432 * p / rows} rx={20} fill={C.ok} />
      </Svg>
      <Lbl t={t} at={a + 1} text="una fila entera" x={900} y={720} size={52} col={C.honey} />
      <Lbl t={t} at={a + 3} text="después la de abajo" x={900} y={820} size={44} col={C.dim} />
    </>
  );
};

// 21 · la esponja del mismo día: la junta fresca, una esponja que pasa, y el pegote que no llega a existir
export const EsponjaMismoDia: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "esponja", a + 1), u = e(t, k, k + 2.6);
  return (
    <>
      <Svg>
        <Muro x={300} y={260} w={1320} h={540} seed={21} />
        {Array.from({ length: 9 }, (_, i) => { const x = 360 + i * 140; return <ellipse key={i} cx={x} cy={530} rx={26} ry={12} fill="#8e8a83" opacity={x < 300 + 1320 * u ? 0 : 1} />; })}
        <g transform={`translate(${300 + 1320 * u},530)`} opacity={cl((t - k) * 4) * (1 - e(t, k + 2.6, k + 3))}><rect x={-70} y={-50} width={140} height={100} rx={22} fill="#f0d54a" stroke="#b49a20" strokeWidth={4} />{Array.from({ length: 8 }, (_, q) => <circle key={q} cx={-50 + hash(q, 1) * 100} cy={-30 + hash(q, 2) * 60} r={5} fill="#c9ad2a" />)}</g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="mezcla todavía fresca" x={960} y={180} size={48} col={C.honey} />
      <Lbl t={t} at={k + 2.8} text="no hay pegote" x={960} y={900} size={52} col={C.ok} />
    </>
  );
};

// 22 · la figurita sobre harina: la mezcla se pega al polvo, el polvo no está pegado a nada; se cae entera
export const FiguritaHarina: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "figu", a + 1.4), cae = e(t, k + 1.2, k + 2.4);
  return (
    <>
      <Svg>
        <rect x={360} y={240} width={560} height={600} fill={C.lad} />
        <rect x={360} y={240} width={560} height={600} fill="#efe9dc" opacity={0.75} />
        {Array.from({ length: 80 }, (_, i) => <circle key={i} cx={360 + hash(i, 1) * 560} cy={240 + hash(i, 2) * 600} r={2 + 3 * hash(i, 3)} fill="#fffaf0" />)}
        <g transform={`translate(${640 + 60 * cae},${540 + 420 * cae * cae}) rotate(${-4 + 30 * cae})`} opacity={e(t, k, k + 0.4)}><rect x={-160} y={-200} width={320} height={400} rx={14} fill={C.prim} /><rect x={-140} y={-180} width={280} height={360} rx={10} fill="none" stroke={C.prim2} strokeWidth={4} /></g>
        <Draw d="M1080,540 L1480,540" p={e(t, a + 0.4, a + 1)} col={C.dim} w={3} />
      </Svg>
      <Lbl t={t} at={a + 0.6} text="pared con polvo" x={1300} y={460} size={48} col={C.dim} />
      <Lbl t={t} at={k + 2} text="se cae entera" x={1300} y={640} size={54} col={C.red} />
    </>
  );
};

// 23 · el pozo aparte: un agujero de 3 cm relleno con la primera mano tarda más, se hunde y se raja; relleno antes, no
export const PozoAparte: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "pozo", a + 1), hunde = e(t, k + 1.4, k + 3.4);
  return (
    <>
      <Svg>
        {[0, 1].map((i) => <g key={i} transform={`translate(${560 + i * 800},540)`}>
          <rect x={-240} y={-260} width={180} height={520} fill={C.lad} />
          <path d={`M-60,-260 L-60,-60 Q30,0 -60,60 L-60,260`} fill="none" stroke={C.lad2} strokeWidth={4} />
          <path d={`M-60,-260 L-30,-260 L-30,-80 Q${i ? 40 : 40 - 30 * hunde},0 -30,80 L-30,260 L-60,260 L-60,60 Q30,0 -60,-60 Z`} fill={C.prim} />
          {i === 0 && <polyline points="-20,-60 -6,-20 -22,10 -4,50" fill="none" stroke="#1a1714" strokeWidth={4} strokeDasharray={`${hunde * 140} 999`} />}
        </g>)}
      </Svg>
      <Lbl t={t} at={k + 0.4} text="todo de una" x={560} y={900} size={48} col={C.red} />
      <Lbl t={t} at={k + 2} text="relleno antes" x={1360} y={900} size={48} col={C.ok} />
    </>
  );
};

// 24 · el ladrillo esponja: le apoyás mezcla húmeda, le chupa el agua en segundos y la mezcla se cuartea como barro seco
export const LadrilloEsponja: React.FC<FxP> = ({ t, a, m }) => {
  const k = mk(m, "chupa", a + 1), q = mk(m, "quema", a + 4), w = e(t, k, k + 2.4), cr = e(t, q, q + 2);
  return (
    <>
      <Svg>
        <rect x={360} y={260} width={600} height={560} fill={C.lad} />{[0, 1, 2].map((i) => <rect key={i} x={390 + i * 190} y={290} width={160} height={500} fill="#1c1410" opacity={0.55} />)}
        <rect x={960} y={260} width={140} height={560} fill={`rgb(${Math.round(lerp(120, 201, w))},${Math.round(lerp(118, 196, w))},${Math.round(lerp(112, 184, w))})`} />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={1030 - 300 * e(t, k + i * 0.15, k + 1 + i * 0.15)} cy={300 + i * 52} r={9} fill={C.agua} opacity={1 - e(t, k + 0.8 + i * 0.15, k + 1.1 + i * 0.15)} />)}
        {Array.from({ length: 9 }, (_, i) => <polyline key={i} points={`${970 + hash(i, 1) * 120},${270 + i * 60} ${980 + hash(i, 2) * 110},${300 + i * 60} ${970 + hash(i, 3) * 120},${330 + i * 60}`} fill="none" stroke="#3a3632" strokeWidth={3} strokeDasharray={`${cr * 80} 999`} />)}
      </Svg>
      <Lbl t={t} at={k + 0.6} text="le chupa el agua" x={1460} y={420} size={50} col={C.agua} />
      <Lbl t={t} at={q + 0.6} text="se quema" x={1460} y={600} size={58} col={C.red} />
    </>
  );
};

// 25 · ni seca ni chorreando: tres paños de pared con su gota; el del medio, húmedo y oscuro, es el que va
export const TrapoEscurrido: React.FC<FxP> = ({ t, a, m }) => {
  const ps = [["seca", 0, C.red], ["húmeda", 0.45, C.ok], ["chorreando", 0.8, C.red]] as const, k = mk(m, "justo", a + 3);
  return (
    <>
      <Svg>
        {ps.map(([, mo], i) => <g key={i} opacity={e(t, a + 0.4 + i * 0.6, a + 0.8 + i * 0.6)} transform={`translate(${380 + i * 580},0)`}>
          <Muro x={-200} y={260} w={400} h={460} moja={mo} seed={25 + i} />
          {i === 2 && Array.from({ length: 5 }, (_, q) => <path key={q} d={`M${-160 + q * 80},300 l0,${200 + 100 * ((t * 0.6 + q * 0.3) % 1)}`} stroke={C.agua} strokeWidth={6} opacity={0.6} />)}
          {i === 1 && <rect x={-212} y={248} width={424} height={484} rx={10} fill="none" stroke={C.ok} strokeWidth={8} opacity={e(t, k, k + 0.4)} />}
        </g>)}
      </Svg>
      {ps.map(([w, , col], i) => <Lbl key={w} t={t} at={a + 0.8 + i * 0.6} text={w} x={380 + i * 580} y={800} size={50} col={col} />)}
      <Lbl t={t} at={k + 0.4} text="como trapo escurrido" x={960} y={920} size={46} col={C.ok} />
    </>
  );
};
export const _k1 = [Txt, FONT];
