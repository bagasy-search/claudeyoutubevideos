// cl2mezcla · componentes de la mezcla al curado (vetas en la carretilla, granos vestidos, el volcán, el jarro según la arena,
// la cuchara de costado, el punto, el litro y medio, el balde que cuenta, los cristales que rompe la pala, los cinco usos,
// la canaleta, la grampa, la humedad en la unión, la lechada, el calendario de rocío, la telaraña, el molde, las capas,
// el camino del patio, las facturas que llegan tarde). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, num, shake } from "./kit";
import { Balde, Gota, Sol } from "./comps1";

const mk = (m: Record<string, number>, k: string, d: number) => m[k] ?? d;

// 19 · la carretilla vista de arriba: vetas amarillas y grises que se funden vuelta a vuelta
export const VetasVueltas: React.FC<FxP> = ({ t, a, b, m }) => {
  const v0 = mk(m, "vuelta", a + 1), co = mk(m, "color", v0 + 3), mix = e(t, v0, Math.min(b - 1, co + 4));
  const n = Math.min(4, Math.floor(mix * 4.2) + (t > v0 ? 1 : 0));
  const pala = ((t - v0) * 0.6) % 1;
  return (
    <>
      <Svg>
        <defs><clipPath id="carr"><path d="M560,300 L1360,300 L1260,800 L660,800 Z" /></clipPath></defs>
        <path d="M540,286 L1380,286 L1270,820 L650,820 Z" fill="#3e5468" stroke="#24313d" strokeWidth={10} />
        <g clipPath="url(#carr)">
          <rect x={540} y={280} width={840} height={560} fill={`rgb(${Math.round(lerp(170, 150, mix))},${Math.round(lerp(150, 146, mix))},${Math.round(lerp(110, 138, mix))})`} />
          {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${520 + hash(i, 1) * 900},${300 + i * 24} q${120 + 80 * hash(i, 2)},${-30 + 60 * hash(i, 3)} ${300 + 200 * hash(i, 4)},${10}`} fill="none" stroke={i % 2 ? C.sand : "#8a8780"} strokeWidth={18 + 14 * hash(i, 5)} strokeLinecap="round" opacity={(1 - mix) * 0.9} />)}
        </g>
        {t > v0 && <g transform={`translate(${lerp(640, 1280, Math.sin(pala * Math.PI))},${lerp(720, 380, pala)}) rotate(${lerp(-30, 30, pala)})`}><path d="M-60,0 L60,0 L50,90 Q0,120 -50,90 Z" fill="#8a8d92" /><rect x={-10} y={-260} width={20} height={260} rx={8} fill={C.wood} /></g>}
      </Svg>
      <Pop t={t} at={v0} x={1620} y={480}><Big size={120} col={C.honey}>{`${Math.max(1, n)}`}</Big></Pop>
      <Lbl t={t} at={v0 + 0.3} text="vueltas en seco" x={1620} y={620} col={C.honey} size={44} />
      <Lbl t={t} at={co + 0.4} text="ni una veta" x={960} y={930} col={C.ok} size={60} />
    </>
  );
};

// 20 · granos vestidos: en seco cada grano queda con su capa gris; con el agua de entrada, pelotitas y granos pelados
export const GranoVestido: React.FC<FxP> = ({ t, a, m }) => {
  const pe = mk(m, "pelot", a + 2.5);
  const grains = (x0: number, ok: boolean, at: number) => Array.from({ length: 16 }, (_, i) => { const x = x0 + (i % 4) * 110 - 165, y = 380 + Math.floor(i / 4) * 110, coat = ok ? e(t, at + i * 0.04, at + 0.5 + i * 0.04) : (hash(i, 9) > 0.55 ? e(t, at, at + 0.5) : 0); return <g key={i}><circle cx={x} cy={y} r={34} fill={C.sand} />{coat > 0 && <circle cx={x} cy={y} r={44} fill="none" stroke="#8f8b83" strokeWidth={14 * coat} />}</g>; });
  return (
    <>
      <Svg>
        {grains(560, true, a + 0.5)}
        {grains(1360, false, pe)}
        {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={1260 + hash(i, 4) * 260} cy={420 + hash(i, 5) * 300} r={46 * spr(t, pe + 0.3 + i * 0.15)} fill="#77736c" stroke="#55524d" strokeWidth={4} />)}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="en seco: todos vestidos" x={560} y={880} col={C.ok} size={50} />
      <Lbl t={t} at={pe + 0.4} text="con agua: pelotitas" x={1360} y={880} col={C.red} size={50} />
    </>
  );
};

// 21 · el volcán: la mezcla seca vista de arriba con su pozo; el agua entra a chorros y los bordes se doblan hacia adentro
export const VolcanPozo: React.FC<FxP> = ({ t, a, b, m }) => {
  const ch = mk(m, "chorro", a + 1.2), pulses = [0, 1, 2, 3].map((i) => ch + i * Math.max(1.4, (b - ch - 1) / 4));
  const lv = pulses.reduce((s, p) => s + 0.22 * e(t, p, p + 0.6), 0), fold = pulses.reduce((s, p) => s + e(t, p + 0.6, p + 1.2), 0);
  return (
    <>
      <Svg>
        <circle cx={960} cy={540} r={380} fill="#8f8b83" />
        {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={960} cy={540} r={380 - i * 50} fill="none" stroke="rgba(0,0,0,.12)" strokeWidth={6} />)}
        <circle cx={960} cy={540} r={160} fill="#5f5b55" />
        <circle cx={960} cy={540} r={150 * Math.sqrt(cl(lv))} fill="rgba(124,200,255,.65)" />
        {Array.from({ length: 8 }, (_, i) => { const g = (i / 8) * Math.PI * 2 + fold * 0.3, r = lerp(360, 170, (fold % 1)); return <path key={i} d={`M${960 + Math.cos(g) * (r + 40)},${540 + Math.sin(g) * (r + 40)} L${960 + Math.cos(g) * r},${540 + Math.sin(g) * r}`} stroke={C.honey} strokeWidth={8} strokeLinecap="round" opacity={fold > 0 && fold < 4 ? 0.8 : 0} markerEnd="" />; })}
        {pulses.map((p, i) => { const u = cl((t - p) / 0.6); return u > 0 && u < 1 ? <Gota key={i} x={960} y={lerp(80, 520, u * u)} r={30} /> : null; })}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="un pozo, como volcán" x={1580} y={420} col={C.honey} size={50} />
      <Lbl t={t} at={ch + 0.5} text="de a poco" x={1580} y={560} col={C.water} size={56} />
    </>
  );
};

// 22 · el jarro según la arena: arena mojada por la lluvia pide un jarrito, arena seca al sol pide más
export const JarroSegunArena: React.FC<FxP> = ({ t, a, m }) => {
  const ll = mk(m, "lluvia", a + 0.6), so = mk(m, "sol", ll + 2);
  const jarro = (x: number, lv: number, at: number) => <g opacity={cl(spr(t, at) * 2)}><path d={`M${x - 70},640 L${x - 60},860 L${x + 60},860 L${x + 70},640 Z`} fill="rgba(124,200,255,.12)" stroke={C.edge} strokeWidth={5} /><rect x={x - 62} y={860 - 210 * lv * e(t, at, at + 0.8)} width={124} height={210 * lv * e(t, at, at + 0.8)} fill="rgba(124,200,255,.55)" /><path d={`M${x + 70},680 q60,10 50,90 q-10,40 -54,40`} fill="none" stroke={C.edge} strokeWidth={8} /></g>;
  return (
    <>
      <Svg>
        <g opacity={e(t, ll - 0.2, ll + 0.3)}>
          <path d="M360,560 Q560,300 760,560 Z" fill="#a8854a" />
          {Array.from({ length: 14 }, (_, i) => { const u = ((t * 1.4 + hash(i, 1)) % 1); return <line key={i} x1={400 + hash(i, 2) * 320} x2={392 + hash(i, 2) * 320} y1={140 + u * 300} y2={170 + u * 300} stroke={C.water} strokeWidth={4} opacity={0.7} />; })}
          <ellipse cx={560} cy={150} rx={170} ry={60} fill="#8e9aa3" />
          {jarro(560, 0.3, ll + 0.6)}
        </g>
        <g opacity={e(t, so - 0.2, so + 0.3)}>
          <path d="M1160,560 Q1360,300 1560,560 Z" fill="#e6c98a" />
          <Sol t={t} x={1360} y={170} r={60} />
          {jarro(1360, 0.8, so + 0.6)}
        </g>
      </Svg>
      <Lbl t={t} at={ll + 1} text="mojada: mucho menos" x={560} y={960} col={C.water} size={48} />
      <Lbl t={t} at={so + 1} text="seca: un poco más" x={1360} y={960} col={C.honey} size={48} />
    </>
  );
};

// 23 · la cuchara de costado: la buena se queda parada como un flan; la pasada se resbala y chorrea
export const CucharaCostado: React.FC<FxP> = ({ t, a, m }) => {
  const fl = mk(m, "flan", a + 1), ch = mk(m, "chorrea", fl + 2), tilt = e(t, a + 0.4, a + 1.2) * 60;
  const cuch = (x: number, ok: boolean, at: number) => {
    const sl = ok ? 0 : e(t, at, at + 1.2), wob = ok ? 6 * Math.exp(-Math.max(0, t - at) * 3) * Math.sin((t - at) * 14) : 0;
    return (
      <g transform={`translate(${x},560) rotate(${tilt})`}>
        <path d="M-220,0 L160,0 L60,60 L-220,40 Z" fill="#a9adb2" stroke="#55595d" strokeWidth={4} />
        <rect x={160} y={-10} width={160} height={24} rx={10} fill={C.wood} transform="rotate(-12 160 0)" />
        <g transform={`translate(${-40 - sl * 260},${-sl * 20}) skewX(${wob})`}><path d={ok ? "M-110,0 Q-100,-120 0,-130 Q100,-120 110,0 Z" : "M-130,0 Q-60,-60 0,-60 Q80,-50 140,0 Z"} fill="#7d7870" /></g>
        {!ok && sl > 0.3 && Array.from({ length: 4 }, (_, i) => { const u = cl((t - at - 0.6 - i * 0.2) / 0.8); return <circle key={i} cx={-240} cy={30 + u * 260} r={14} fill="#7d7870" opacity={1 - u} />; })}
      </g>
    );
  };
  return (
    <>
      <Svg>{cuch(620, true, fl)}{cuch(1360, false, ch)}</Svg>
      <Lbl t={t} at={fl + 0.3} text="parada: está bien" x={620} y={880} col={C.ok} size={52} />
      <Lbl t={t} at={ch + 0.6} text="chorrea: te pasaste" x={1360} y={880} col={C.red} size={52} />
    </>
  );
};

// 24 · el punto: una regla de tres zonas (le falta / el punto / te pasaste) y la aguja que avanza chorro a chorro
export const PuntoSlider: React.FC<FxP> = ({ t, a, m }) => {
  const fa = mk(m, "falta", a + 1.5), pa = mk(m, "pasa", fa + 1.5), x = lerp(420, 1500, 0.5 * e(t, a + 0.4, a + 1.6) - 0.3 * e(t, fa, fa + 0.6) + 0.75 * e(t, pa, pa + 0.6) - 0.45 * e(t, pa + 1.2, pa + 1.9));
  const zona = x < 780 ? 0 : x < 1140 ? 1 : 2;
  return (
    <>
      <Svg>
        <rect x={420} y={520} width={360} height={60} rx={30} fill="rgba(217,185,122,.55)" />
        <rect x={780} y={520} width={360} height={60} fill="rgba(169,230,108,.75)" />
        <rect x={1140} y={520} width={360} height={60} rx={30} fill="rgba(124,200,255,.55)" />
        <g transform={`translate(${x},550)`}><polygon points="-26,-80 26,-80 0,-36" fill={C.ink} /><line x1={0} y1={-36} x2={0} y2={40} stroke={C.ink} strokeWidth={6} /></g>
        {[[600, "#c6a86f", 0], [960, "#7d7870", 1], [1320, "#6c6862", 2]].map(([cx, col, k]) => <g key={k as number} opacity={zona === k ? 1 : 0.35} transform={`translate(${cx},760)`}>{k === 0 ? Array.from({ length: 9 }, (_, i) => <circle key={i} cx={(hash(i, 1) - 0.5) * 140} cy={(hash(i, 2) - 0.5) * 60} r={14 + 10 * hash(i, 3)} fill={col as string} />) : k === 1 ? <><ellipse rx={110} ry={62} fill={col as string} />{[-50, -15, 20, 55].map((d) => <path key={d} d={`M${d},-58 q10,58 0,116`} stroke="rgba(0,0,0,.25)" strokeWidth={8} fill="none" />)}</> : <><ellipse rx={150} ry={34} cy={30} fill={col as string} /><ellipse rx={70} ry={40} fill={col as string} /></>}</g>)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="se desarma" x={600} y={420} col={C.sand} size={46} />
      <Lbl t={t} at={a + 0.7} text="mantiene la forma" x={960} y={420} col={C.ok} size={46} />
      <Lbl t={t} at={a + 1} text="chorrea" x={1320} y={420} col={C.water} size={46} />
      <Lbl t={t} at={pa + 2} text="cremosa pero gorda" x={960} y={950} col={C.honey} size={56} />
    </>
  );
};

// 25 · el litro y medio de más: la jarra medidora se vacía en el balde y la cuenta queda escrita
export const LitroYMedio: React.FC<FxP> = ({ t, a }) => {
  const p = e(t, a + 0.8, a + 2.4);
  return (
    <>
      <Svg>
        <Balde x={1120} y={840} w={440} h={420} lv={0.7 + 0.12 * p} col="#7d7870" />
        <g transform={`translate(${lerp(560, 760, e(t, a + 0.3, a + 0.8))},${380}) rotate(${lerp(0, 70, e(t, a + 0.6, a + 1.2))})`}>
          <path d="M-90,-160 L-80,160 L80,160 L90,-160 Z" fill="rgba(124,200,255,.12)" stroke={C.edge} strokeWidth={5} />
          <rect x={-80} y={160 - 300 * (1 - p)} width={160} height={300 * (1 - p)} fill="rgba(124,200,255,.55)" />
          {[0.33, 0.66, 1].map((k, i) => <g key={i}><line x1={-80} x2={-40} y1={160 - 300 * k * 0.95} y2={160 - 300 * k * 0.95} stroke={C.ink} strokeWidth={4} /><text x={-34} y={170 - 300 * k * 0.95} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.ink}>{(k * 1.5).toFixed(1).replace(".", ",")}</text></g>)}
        </g>
        {p > 0.02 && p < 0.98 && <path d={`M880,400 Q980,${420} 1040,${520}`} stroke="rgba(124,200,255,.7)" strokeWidth={20} fill="none" strokeLinecap="round" />}
      </Svg>
      <Pop t={t} at={a + 2.4} x={1120} y={240}><Big size={130} col={C.red}>+1,5 L</Big></Pop>
      <Lbl t={t} at={a + 2.8} text="por balde" x={1520} y={540} col={C.dim} size={52} />
    </>
  );
};

// 26 · el balde que cuenta para atrás: un anillo de dos horas alrededor; en verano el anillo se achica
export const BaldeCuentaAtras: React.FC<FxP> = ({ t, a, m }) => {
  const ho = mk(m, "hora", a + 0.8), ve = mk(m, "verano", ho + 2.5), tot = lerp(1, 0.6, e(t, ve, ve + 0.8)), run = e(t, ho, ho + 5) * 0.75;
  const R = 320, ang = 360 * tot * (1 - run), rad = (g: number) => ((g - 90) * Math.PI) / 180;
  const arc = (g: number) => `M960,${540 - R} A${R},${R} 0 ${g > 180 ? 1 : 0} 1 ${960 + R * Math.cos(rad(g))},${540 + R * Math.sin(rad(g))}`;
  return (
    <>
      <Svg>
        <circle cx={960} cy={540} r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={34} />
        {ang > 1 && <path d={arc(Math.min(359.9, ang))} fill="none" stroke={tot < 0.9 ? C.honey : C.ok} strokeWidth={34} strokeLinecap="round" />}
        <Balde x={960} y={700} w={300} h={300} lv={0.75} col="#7d7870" />
        <Sol t={t} x={1380} y={240} r={54} o={e(t, ve, ve + 0.4)} />
      </Svg>
      <Pop t={t} at={ho} x={960} y={140}><Big size={90} col={C.ink}>1 h 30 a 2 h</Big></Pop>
      <Lbl t={t} at={ve + 0.6} text="en verano, menos" x={1560} y={560} col={C.honey} size={50} />
      <Lbl t={t} at={ve + 2} text="hacé de a poco" x={960} y={970} col={C.ok} size={52} />
    </>
  );
};

// 27 · retemplar: los cristalitos que unen dos granos, la pala que los parte, el chorro de agua que deja poros
export const CristalesRotos: React.FC<FxP> = ({ t, a, m }) => {
  const re = mk(m, "retem", a + 1.5), ro = mk(m, "rompe", re + 1.5), cut = e(t, ro, ro + 0.4), pr = e(t, ro + 1, ro + 2);
  return (
    <>
      <Svg>
        <ellipse cx={600} cy={540} rx={210} ry={170} fill={C.sand} stroke={C.sand2} strokeWidth={6} />
        <ellipse cx={1320} cy={540} rx={210} ry={170} fill={C.sand} stroke={C.sand2} strokeWidth={6} />
        {Array.from({ length: 9 }, (_, i) => { const y = 420 + i * 30, g = e(t, a + 0.3 + i * 0.06, a + 1 + i * 0.06), br = cut * (hash(i, 3) > 0.15 ? 1 : 0); return <g key={i}><line x1={800} y1={y} x2={lerp(800, 960 - 10 * br, g)} y2={y + (hash(i, 1) - 0.5) * 30} stroke="rgba(235,245,255,.9)" strokeWidth={6} strokeLinecap="round" /><line x1={1120} y1={y} x2={lerp(1120, 960 + 10 * br, g)} y2={y + (hash(i, 2) - 0.5) * 30} stroke="rgba(235,245,255,.9)" strokeWidth={6} strokeLinecap="round" transform={`translate(0,${br * 30 * (hash(i, 4) - 0.5)})`} /></g>; })}
        <g transform={`translate(${lerp(960, 960, 0)},${lerp(80, 760, e(t, ro - 0.2, ro + 0.3))})`} opacity={e(t, ro - 0.4, ro - 0.2) * (1 - e(t, ro + 0.6, ro + 0.9))}><path d="M-80,-60 L80,-60 L70,40 Q0,70 -70,40 Z" fill="#8a8d92" /></g>
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={900 + hash(i, 5) * 120} cy={430 + hash(i, 6) * 220} r={14 * pr} fill="#1b1916" />)}
      </Svg>
      <Lbl t={t} at={re + 0.3} text="retemplar" x={960} y={220} col={C.honey} size={70} />
      <Lbl t={t} at={ro + 0.5} text="no se vuelven a armar" x={960} y={880} col={C.red} size={52} />
      {pr > 0.5 && <Svg><Cross t={t} at={ro + 1.6} x={1460} y={220} r={46} /></Svg>}
    </>
  );
};

// 28 · la pared de los usos: una fachada con cinco puntos que se encienden: caño, grampa, escalón, poste, bloque
export const ParedUsos: React.FC<FxP> = ({ t, a, m }) => {
  const ks = [1, 2, 3, 4, 5].map((i) => mk(m, "u" + i, a + i * 1.6));
  const pts: [number, number, string][] = [[520, 420, "caños"], [940, 420, "grampas"], [700, 820, "remiendos"], [1380, 760, "bases chicas"], [1560, 860, "piezas"]];
  return (
    <>
      <Svg>
        <rect x={300} y={220} width={1000} height={560} fill="#a65a36" />
        {Array.from({ length: 14 }, (_, r) => Array.from({ length: 9 }, (_, c) => <rect key={r * 9 + c} x={300 + c * 112 - (r % 2) * 56} y={220 + r * 40} width={108} height={36} fill="none" stroke="#7a3f22" strokeWidth={3} />))}
        <rect x={840} y={300} width={220} height={480} fill="#3b3226" stroke="#7a7d82" strokeWidth={10} />
        <path d="M400,780 L1000,780 L1000,840 L460,840 L460,900 L400,900 Z" fill="#9a958d" />
        <line x1={1380} y1={760} x2={1380} y2={300} stroke="#7a7d82" strokeWidth={14} /><line x1={1380} y1={330} x2={1700} y2={330} stroke="#cfcac0" strokeWidth={3} />
        <rect x={1340} y={760} width={80} height={60} fill="#8f8b83" />
        <rect x={1480} y={850} width={160} height={50} fill="#a6a198" stroke="#5f5b55" strokeWidth={3} />
        <rect x={500} y={300} width={40} height={400} fill="#5f5b55" opacity={0.6} />
        {pts.map(([x, y], i) => { const p = spr(t, ks[i], 1.2); return <g key={i} opacity={cl(p * 2)}><circle cx={x} cy={y} r={56 * p} fill="rgba(240,169,58,.25)" stroke={C.honey} strokeWidth={6} /><text x={x} y={y + 18} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill={C.ink}>{i + 1}</text></g>; })}
      </Svg>
      {pts.map(([, , w], i) => <Lbl key={w} t={t} at={ks[i] + 0.2} text={w} x={1500} y={240 + i * 90} col={C.honey} size={44} align="left" />)}
    </>
  );
};

// 29 · la canaleta: corte de pared, el caño corrugado en su zanja, la mezcla la llena y el revoque cierra arriba
export const CanaletaCorrugado: React.FC<FxP> = ({ t, a }) => {
  const f = e(t, a + 1, a + 2.6), rv = e(t, a + 2.8, a + 3.6);
  return (
    <>
      <Svg>
        <rect x={360} y={300} width={1200} height={480} fill="#a65a36" />
        <rect x={360} y={260} width={1200} height={40} fill="#d8d0c0" opacity={rv} />
        <path d="M760,300 L760,520 Q760,560 800,560 L1120,560 Q1160,560 1160,520 L1160,300 Z" fill="#2b2420" />
        <g>{Array.from({ length: 20 }, (_, i) => <ellipse key={i} cx={830 + i * 14} cy={430} rx={10} ry={110} fill="#e3a63a" stroke="#9b6c1a" strokeWidth={3} />)}</g>
        <path d={`M760,${560 - 260 * f} L1160,${560 - 260 * f} L1160,560 L760,560 Z`} fill="#8f8b83" opacity={0.95} />
      </Svg>
      <Lbl t={t} at={a + 0.4} text="caño corrugado" x={960} y={180} col={C.honey} size={52} />
      <Lbl t={t} at={a + 2.6} text="firme y sin fisura" x={960} y={900} col={C.ok} size={56} />
    </>
  );
};

// 30 · la grampa: la pata de hierro del marco entra en el hueco y la mezcla se aprieta a cucharazos; el aire sale
export const GrampaApretada: React.FC<FxP> = ({ t, a, b }) => {
  const hits = [0, 1, 2, 3].map((i) => a + 1.2 + i * Math.max(0.7, (b - a - 2) / 4)), f = hits.reduce((s, h) => s + 0.25 * e(t, h, h + 0.3), 0);
  return (
    <>
      <Svg>
        <rect x={300} y={240} width={1320} height={600} fill="#a65a36" />
        <rect x={760} y={380} width={420} height={300} fill="#2b2420" />
        <path d={`M760,680 L760,${680 - 300 * f} L1180,${680 - 300 * f} L1180,680 Z`} fill="#8f8b83" />
        <rect x={300} y={300} width={140} height={480} fill="#6b6e73" stroke="#3f4245" strokeWidth={6} />
        <path d="M440,520 L980,520 L980,470 L1040,560 L980,640 L980,580 L440,580 Z" fill="#6b6e73" stroke="#3f4245" strokeWidth={5} />
        {hits.map((h, i) => { const u = cl((t - h) / 1); return u > 0 && u < 1 ? Array.from({ length: 4 }, (_, j) => <circle key={i * 4 + j} cx={820 + j * 100} cy={lerp(660 - 300 * f, 200, u)} r={10 + 6 * hash(j, i)} fill="none" stroke="rgba(230,240,255,.8)" strokeWidth={3} opacity={1 - u} />) : null; })}
        {hits.map((h, i) => <g key={i} transform={`translate(${1260 + shake(t, h, 10)},${lerp(260, 380, e(t, h - 0.25, h))})`} opacity={t > h - 0.4 && t < h + 0.4 ? 1 : 0}><path d="M-120,0 L60,-20 L60,20 Z" fill="#a9adb2" /><rect x={60} y={-12} width={110} height={24} rx={10} fill={C.wood} /></g>)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="la grampa del marco" x={1360} y={940} col={C.honey} size={50} />
      <Lbl t={t} at={hits[3]} text="apretada, sin aire" x={960} y={170} col={C.ok} size={56} />
    </>
  );
};

// 31 · la unión: el ladrillo seco le chupa el agua a la mezcla (aguja de humedad que cae, costra floja); mojado, se sostiene
export const InterfazHumedad: React.FC<FxP> = ({ t, a, m }) => {
  const se = mk(m, "seco", a + 0.8), mo = mk(m, "moja", se + 4), wet = e(t, mo, mo + 1), hum = lerp(lerp(90, 25, e(t, se, se + 2.5)), 85, wet);
  return (
    <>
      <Svg>
        <rect x={300} y={560} width={1000} height={240} fill={`rgb(${Math.round(lerp(196, 140, wet))},${Math.round(lerp(104, 72, wet))},${Math.round(lerp(63, 46, wet))})`} />
        <rect x={300} y={360} width={1000} height={200} fill="#7d7870" />
        <rect x={300} y={530} width={1000} height={30} fill="#d9d0bf" opacity={e(t, se + 1.4, se + 2.6) * (1 - wet)} />
        {Array.from({ length: 10 }, (_, i) => { const u = ((t - se) * 0.6 + i / 10) % 1; return t > se && t < mo ? <Gota key={i} x={360 + i * 95} y={lerp(470, 760, u)} r={12} o={Math.sin(u * Math.PI)} /> : null; })}
        <g transform="translate(1520,580)">
          <rect x={-40} y={-260} width={80} height={520} rx={40} fill="rgba(255,255,255,.08)" stroke={C.edge} strokeWidth={4} />
          <rect x={-30} y={250 - 500 * hum / 100} width={60} height={500 * hum / 100} rx={30} fill={hum < 50 ? C.red : C.water} />
          <text x={0} y={-290} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.ink}>{Math.round(hum)} %</text>
        </g>
      </Svg>
      <Lbl t={t} at={se + 1.6} text="costrita floja" x={800} y={300} col={C.red} size={56} />
      <Lbl t={t} at={mo + 0.6} text="húmedo, no empapado" x={800} y={900} col={C.ok} size={52} />
    </>
  );
};

// 32 · la lechada: superficie vieja y lisa vista de cerca; la brocha deja un gris líquido que se mete en los poros y hace puente
export const PuenteLechada: React.FC<FxP> = ({ t, a, m }) => {
  const le = mk(m, "lech", a + 0.8), po = mk(m, "pobres", le + 4), br = e(t, le, le + 1.8), mz = e(t, le + 2, le + 3);
  return (
    <>
      <Svg>
        <rect x={260} y={600} width={1400} height={260} fill="#bfb3a0" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${300 + i * 62},600 q10,${30 + 30 * hash(i, 1)} 0,${60 + 40 * hash(i, 2)}`} stroke="#3a3226" strokeWidth={10} fill="none" />)}
        {Array.from({ length: 22 }, (_, i) => { const on = br > (i / 22) ? 1 : 0; return <path key={i} d={`M${300 + i * 62},600 q10,${30 + 30 * hash(i, 1)} 0,${60 + 40 * hash(i, 2)}`} stroke="#8a857c" strokeWidth={10} fill="none" opacity={on} />; })}
        <rect x={260} y={584} width={1400 * br} height={18} fill="#8a857c" />
        <g transform={`translate(${260 + 1400 * br},540)`} opacity={br > 0 && br < 1 ? 1 : 0}><rect x={-60} y={-30} width={120} height={50} rx={8} fill="#c9b48a" /><rect x={-14} y={-150} width={28} height={130} rx={10} fill={C.wood} /></g>
        <rect x={260} y={584 - 200 * mz} width={1400} height={200 * mz} fill="#7d7870" />
      </Svg>
      <Lbl t={t} at={le + 0.4} text="cemento con agua, sin arena" x={960} y={240} col={C.cem} size={48} />
      {t > po && <Pop t={t} at={po} x={960} y={380}><Txt size={54} col={C.honey} style={{ fontStyle: "italic" }}>«la imprimación de los pobres»</Txt></Pop>}
      <Lbl t={t} at={le + 2.4} text="puente entre viejo y nuevo" x={960} y={940} col={C.ok} size={48} />
    </>
  );
};

// 33 · el calendario del curado: siete días, cada uno con dos rocíos (mañana y tarde); la barra de fuerza llega a dos tercios
export const CalendarioRocio: React.FC<FxP> = ({ t, a, b, m }) => {
  const ro = mk(m, "rocia", a + 1), si = mk(m, "siete", ro + 4), me = mk(m, "mes", si + 2), d = Math.min(7, Math.max(0, (t - ro) / Math.max(0.3, (si - ro) / 7)));
  const fuerza = lerp(0, 0.66, cl(d / 7)) + 0.34 * e(t, me, me + 1.5);
  return (
    <>
      <Svg>
        {Array.from({ length: 7 }, (_, i) => { const on = d > i ? 1 : 0, p = spr(t, a + 0.2 + i * 0.08, 1.2); return (
          <g key={i} transform={`translate(${330 + i * 180},${400 + (1 - p) * 80})`} opacity={cl(p * 2)}>
            <rect x={-80} y={-110} width={160} height={210} rx={16} fill={on ? "#2e4a5c" : "#2a2622"} stroke={on ? C.water : "#5a5248"} strokeWidth={4} />
            <text x={0} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill={C.ink}>{i + 1}</text>
            <Gota x={-34} y={40} r={18} o={d > i + 0.3 ? 1 : 0.15} /><Gota x={34} y={40} r={18} o={d > i + 0.8 ? 1 : 0.15} />
          </g>); })}
        <rect x={250} y={700} width={1420} height={50} rx={25} fill="rgba(255,255,255,.08)" />
        <rect x={250} y={700} width={1420 * fuerza} height={50} rx={25} fill={fuerza > 0.65 ? C.ok : C.honey} />
        <line x1={250 + 1420 * 0.66} x2={250 + 1420 * 0.66} y1={680} y2={770} stroke={C.ink} strokeWidth={4} strokeDasharray="8 6" />
      </Svg>
      <Lbl t={t} at={ro} text="nylon y rocío" x={960} y={220} col={C.water} size={60} />
      <Lbl t={t} at={si + 0.2} text="2/3 de la fuerza" x={250 + 1420 * 0.66} y={840} col={C.ok} size={50} />
      <Lbl t={t} at={me + 0.6} text="sigue hasta el mes" x={1500} y={940} col={C.dim} size={44} />
    </>
  );
};

// 34 · la telaraña: superficie vista de arriba; sol y viento la secan y le crecen fisuritas como tela de araña
export const TelaranaSol: React.FC<FxP> = ({ t, a }) => {
  const g = e(t, a + 0.8, a + 3.5);
  const lines = Array.from({ length: 26 }, (_, i) => { const x = 460 + hash(i, 1) * 1000, y = 300 + hash(i, 2) * 480, ang = hash(i, 3) * Math.PI * 2, L = 80 + 160 * hash(i, 4); return `M${x},${y} l${Math.cos(ang) * L * 0.5},${Math.sin(ang) * L * 0.5} l${Math.cos(ang + 0.6) * L * 0.5},${Math.sin(ang + 0.6) * L * 0.5}`; });
  return (
    <>
      <Svg>
        <rect x={420} y={260} width={1080} height={560} rx={10} fill={`rgb(${Math.round(lerp(125, 168, g))},${Math.round(lerp(120, 162, g))},${Math.round(lerp(112, 152, g))})`} />
        {lines.map((d, i) => <Draw key={i} d={d} p={cl(g * 1.6 - hash(i, 5) * 0.6)} col="#3a3632" w={3} />)}
        <Sol t={t} x={1640} y={220} r={60} o={e(t, a, a + 0.5)} />
      </Svg>
      <Lbl t={t} at={a + 1.6} text="fisuras como telaraña" x={960} y={920} col={C.red} size={56} />
    </>
  );
};

// 35 · el molde: cuatro tablas que se atornillan sobre un nylon; la medida y el trapo con aceite por dentro
export const CajaTablas: React.FC<FxP> = ({ t, a, m }) => {
  const me = mk(m, "medida", a + 2), ac = mk(m, "aceite", me + 2.5);
  const tab = (i: number) => { const p = spr(t, a + 0.3 + i * 0.3, 0.9), off = (1 - p) * 300; const pos = [[960, 420 - off, 600, 40], [960, 700 + off, 600, 40], [660 - off, 560, 40, 320], [1260 + off, 560, 40, 320]][i]; return <rect key={i} x={pos[0] - pos[2] / 2} y={pos[1] - pos[3] / 2} width={pos[2]} height={pos[3]} rx={4} fill={C.wood} stroke="#5e3a1c" strokeWidth={4} opacity={cl(p * 2)} />; };
  return (
    <>
      <Svg>
        <rect x={500} y={360} width={920} height={400} rx={8} fill="rgba(200,220,240,.12)" stroke="rgba(200,220,240,.3)" strokeWidth={3} />
        {[0, 1, 2, 3].map(tab)}
        <rect x={682} y={442} width={556} height={236} fill={`rgba(240,169,58,${0.3 * e(t, ac, ac + 1)})`} />
        <g opacity={e(t, ac, ac + 0.3) * (1 - e(t, ac + 1.8, ac + 2.2))} transform={`translate(${lerp(720, 1180, e(t, ac, ac + 1.6))},560)`}><ellipse rx={60} ry={40} fill="#d9c9a5" /></g>
        <g opacity={e(t, me, me + 0.4)}><Draw d="M682,800 L1238,800" p={e(t, me, me + 0.6)} col={C.honey} w={5} /><Draw d="M1320,442 L1320,678" p={e(t, me + 0.3, me + 0.9)} col={C.honey} w={5} /></g>
      </Svg>
      <Pop t={t} at={me + 0.4} x={960} y={860}><Big size={70} col={C.honey}>20 cm</Big></Pop>
      <Pop t={t} at={me + 0.8} x={1460} y={560}><Big size={70} col={C.honey}>10 cm</Big></Pop>
      <Lbl t={t} at={ac + 0.4} text="trapo con aceite usado" x={960} y={250} col={C.ink} size={50} />
    </>
  );
};

// 36 · tres capas: el molde en corte se llena por capas; en cada una la varilla pincha y el costado recibe golpecitos
export const CapasVarilla: React.FC<FxP> = ({ t, a, b }) => {
  const step = Math.max(1.4, (b - a - 1) / 3), cap = [0, 1, 2].map((i) => a + 0.5 + i * step);
  const lv = cap.reduce((s, c) => s + e(t, c, c + 0.6) / 3, 0);
  return (
    <>
      <Svg>
        <g transform={`translate(${cap.reduce((s, c) => s + shake(t, c + 0.9, 8) + shake(t, c + 1.2, 8), 0)},0)`}>
          <rect x={660} y={280} width={40} height={520} fill={C.wood} /><rect x={1220} y={280} width={40} height={520} fill={C.wood} /><rect x={660} y={800} width={600} height={20} fill="rgba(200,220,240,.4)" />
          <rect x={700} y={800 - 500 * lv} width={520} height={500 * lv} fill="#7d7870" />
          {[1, 2].map((k) => lv * 3 > k && <line key={k} x1={700} x2={1220} y1={800 - 500 * k / 3} y2={800 - 500 * k / 3} stroke="rgba(0,0,0,.25)" strokeWidth={3} strokeDasharray="10 8" />)}
          {cap.map((c, i) => Array.from({ length: 5 }, (_, j) => { const u = cl((t - c - 0.9 - j * 0.15) / 1.1); return u > 0 && u < 1 ? <circle key={i * 5 + j} cx={760 + j * 100} cy={lerp(800 - 500 * (i + 0.5) / 3, 800 - 500 * lv, u)} r={8 + 4 * hash(j, i)} fill="none" stroke="rgba(230,240,255,.85)" strokeWidth={3} opacity={1 - u * 0.5} /> : null; }))}
        </g>
        {cap.map((c, i) => { const u = t - c - 0.6; return u > 0 && u < 0.9 ? <rect key={i} x={940 + 60 * Math.sin(u * 10)} y={lerp(160, 800 - 500 * lv + 40, Math.abs(Math.sin(u * 8)))} width={14} height={300} rx={7} fill="#8a8d92" /> : null; })}
      </Svg>
      <Pop t={t} at={a + 0.4} x={1520} y={420}><Big size={130} col={C.honey}>{`${Math.min(3, Math.max(1, Math.ceil(lv * 3 - 0.01)))} / 3`}</Big></Pop>
      <Lbl t={t} at={cap[0] + 1} text="cada burbuja, un hueco" x={1520} y={620} col={C.water} size={44} />
    </>
  );
};

// 37 · el camino del patio: vista de arriba, un bloque por día hasta el fondo; el contador de días corre
export const CaminoMes: React.FC<FxP> = ({ t, a, b }) => {
  const n = Math.floor(30 * e(t, a + 0.5, b - 0.6));
  const pos = (i: number) => { const u = i / 29; return [lerp(360, 1560, u) + 80 * Math.sin(u * 5), lerp(900, 260, u)]; };
  return (
    <>
      <Svg>
        <rect x={200} y={180} width={1520} height={780} rx={20} fill="#3c5a2c" />
        {Array.from({ length: 80 }, (_, i) => <path key={i} d={`M${220 + hash(i, 1) * 1480},${200 + hash(i, 2) * 740} l6,-18 l6,18`} stroke="#5d8a42" strokeWidth={3} fill="none" />)}
        <rect x={1500} y={190} width={200} height={120} fill="#8e4426" />
        {Array.from({ length: n }, (_, i) => { const [x, y] = pos(i), p = spr(t, a + 0.5 + (i / 30) * (b - a - 1.1), 1.4); return <rect key={i} x={x - 34} y={y - 18} width={68} height={36} rx={4} fill="#a6a198" stroke="#5f5b55" strokeWidth={3} transform={`rotate(${-30 + 20 * Math.cos(i)} ${x} ${y}) scale(1)`} opacity={cl(p * 2)} />; })}
      </Svg>
      <Pop t={t} at={a + 0.4} x={1560} y={760}><Big size={100} col={C.ink}>{`día ${Math.max(1, n)}`}</Big></Pop>
      <Lbl t={t} at={a + 0.8} text="uno por día" x={1560} y={880} col={C.honey} size={48} />
    </>
  );
};

// 38 · las facturas que llegan tarde: cinco tickets con el error; a cada uno le cae el sello «se paga después»
export const FacturasTarde: React.FC<FxP> = ({ t, a, m }) => {
  const ks = [1, 2, 3, 4, 5].map((i) => mk(m, "e" + i, a + i * 2.5)), vi = mk(m, "viejo", ks[4] + 4);
  const err = ["agua de más", "arena con tierra", "no mojar antes", "retemplar", "no curar"];
  return (
    <>
      <Svg>
        {err.map((w, i) => { const at = ks[i], p = spr(t, at, 1), st = e(t, at + 0.8, at + 1); const x = 300 + i * 330, y = 520 + (i % 2) * 40; return (
          <g key={w} opacity={cl(p * 2) * (1 - 0.6 * e(t, vi, vi + 0.6))} transform={`translate(${x},${y + (1 - p) * -260}) rotate(${(hash(i, 1) - 0.5) * 10})`}>
            <path d="M-140,-220 L140,-220 L140,200 l-20,20 l-20,-20 l-20,20 l-20,-20 l-20,20 l-20,-20 l-20,20 l-20,-20 l-20,20 l-20,-20 l-20,20 l-20,-20 l-20,20 l-20,-20 Z" fill="#f2ead8" />
            <text x={0} y={-150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#3d3424">{`ERROR ${i + 1}`}</text>
            {[0, 1, 2, 3].map((r) => <line key={r} x1={-110} x2={110 - r * 30} y1={-90 + r * 34} y2={-90 + r * 34} stroke="#c9bfa6" strokeWidth={8} />)}
            <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.brick2}>{w.toUpperCase()}</text>
            <g opacity={st} transform={`rotate(-14) scale(${lerp(1.6, 1, st)})`}><rect x={-120} y={-10} width={240} height={70} rx={8} fill="none" stroke={C.red} strokeWidth={6} /><text x={0} y={38} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.red}>SE PAGA DESPUÉS</text></g>
          </g>); })}
      </Svg>
      {t > vi && <Pop t={t} at={vi} x={960} y={540}><div style={{ background: "#f2e3bf", color: "#2a2418", fontFamily: FONT, fontWeight: 800, fontSize: 52, padding: "26px 44px", borderRadius: 26, maxWidth: 1300, textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}>«Hoy me toca pagar a mí esos errores»</div></Pop>}
    </>
  );
};
