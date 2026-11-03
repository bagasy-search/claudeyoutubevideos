// cl2resina · RONDA 2 del ojo del director: los siete que sacaron 5 rehechos con piezas con cuerpo (pro.tsx).
// Mismo nombre que el original → Body los toma de acá (K4 pisa a K1-K3). Cada uno es f(t) y sigue la voz (m.*).
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, num, shake } from "./kit";
import { Cubo3, Gota3, GotaCae, Lata3, Pincel, Tabla3, Vapor, Vaso3 } from "./pro";

// 2 · la gota que perla: cae, rebota apenas y queda redondita sobre la tabla laqueada (que refleja la ventana);
// el ángulo alto se marca con un arco de luz; la tabla se inclina y la gota rueda sin dejar ni una marca
export const GotaPerla: React.FC<FxP> = ({ t, a, m }) => {
  const f = cl((t - a - 0.25) / 0.55), land = a + 0.8, bo = t > land ? Math.exp(-(t - land) * 6) * Math.sin((t - land) * 26) : 0;
  const tilt = e(t, m.res - 0.5, m.res + 0.5), roll = e(t, m.res, m.res + 1.6), gx = 960 + roll * 820;
  const sq = t < land ? 0 : 0.18 * bo;
  return (
    <>
      <Svg>
        <g transform={`rotate(${-5 * tilt} 960 700)`}>
          <Tabla3 u="perla" x={960} y={760} w={1500} d={300} th={60} lac={1} sh={0.25 * e(t, a, a + 6)} />
          {t > land && <circle cx={960} cy={690} r={70} fill="none" stroke="rgba(169,230,108,.0)" />}
          {/* donde estuvo la gota: limpio */}
          {roll > 0.4 && <g opacity={e(t, m.res + 0.8, m.res + 1.3)}><ellipse cx={960} cy={690} rx={150} ry={34} fill="none" stroke={C.ok} strokeWidth={5} strokeDasharray="14 10" /></g>}
          {f < 1 ? <GotaCae x={960} y={lerp(80, 620, f * f)} r={62} /> : <Gota3 u="perla" x={gx} y={690} r={130} sq={sq} />}
          {/* ángulo de contacto: el arco que dice «queda parada» */}
          {f >= 1 && roll < 0.05 && <g opacity={e(t, a + 1.2, a + 1.6)}>
            <Draw d="M760,690 L1160,690" p={e(t, a + 1.2, a + 1.6)} col={C.sun} w={5} dash="12 10" />
            <Draw d="M836,690 C 836,610 860,560 900,540" p={e(t, a + 1.5, a + 2.1)} col={C.sun} w={7} glow />
          </g>}
        </g>
      </Svg>
      <Lbl t={t} at={a + 1.4} out={m.res} text="queda redondita" x={960} y={930} col={C.solv} size={78} />
      <Lbl t={t} at={m.res + 0.3} text="no entra, no mancha" x={960} y={930} col={C.ok} size={78} />
      {roll > 0.4 && <Tick t={t} at={m.res + 1} x={960} y={560} r={46} />}
    </>
  );
};

// 7 · los vapores: la lata abierta suelta cintas de vapor que viajan a la hornalla y se prenden en un fogonazo;
// se abren ventana y puerta y el vapor sale por ahí; después, los tres fuegos prohibidos, grandes y tachados
export const VaporFuego: React.FC<FxP> = ({ t, a, m }) => {
  const ab = e(t, m.abiertas - 0.3, m.abiertas + 1.2), flash = Math.exp(-Math.max(0, t - (a + 2.6)) * 2.2) * (t > a + 2.6 ? 1 : 0) * (1 - ab);
  const H = m.horn, fuegos = t > H - 0.4;
  const llama = (x: number, y: number, s: number) => { const w = 1 + 0.08 * Math.sin(t * 13 + x); return <g transform={`translate(${x},${y}) scale(${s * w},${s / w})`}><path d="M0,40 C -46,0 -14,-60 0,-100 C 14,-60 46,0 0,40 Z" fill="#ff9a2a" /><path d="M0,40 C -22,10 -8,-30 0,-56 C 8,-30 22,10 0,40 Z" fill="#ffe08a" /></g>; };
  return (
    <>
      <Svg>
        <g opacity={1 - e(t, H - 0.5, H)}>
          <Lata3 x={430} y={820} w={210} h={300} />
          {Array.from({ length: 7 }, (_, i) => { const u = ((t - a) * 0.28 + i / 7) % 1; return <Vapor key={i} w={46} col="rgba(205,232,255,.75)" x0={470} y0={500} x1={ab > 0.5 ? 1640 : 1250} y1={ab > 0.5 ? 330 : 600} u={u} seed={i * 1.9} />; })}
          {/* hornalla con su llama */}
          <g opacity={1 - ab}>
            <ellipse cx={1250} cy={760} rx={170} ry={40} fill="#2c2a27" stroke="#121110" strokeWidth={4} />
            <ellipse cx={1250} cy={748} rx={110} ry={24} fill="none" stroke="#5a5650" strokeWidth={8} />
            {llama(1250, 720, 1.1)}
            <circle cx={1250} cy={640} r={60 + 420 * (1 - flash)} fill="rgba(255,140,40,.35)" opacity={flash} />
            <circle cx={1250} cy={640} r={40 + 220 * (1 - flash)} fill="rgba(255,230,140,.55)" opacity={flash} />
          </g>
          {/* ventana y puerta que se abren */}
          <g opacity={ab}>
            <rect x={1540} y={220} width={240} height={260} fill="rgba(170,220,160,.55)" stroke="#e9dcc0" strokeWidth={12} />
            <path d={`M1540,220 L${1540 - 110 * ab},250 L${1540 - 110 * ab},450 L1540,480 Z`} fill="rgba(220,240,255,.35)" stroke="#e9dcc0" strokeWidth={8} />
            <rect x={1560} y={560} width={200} height={340} fill="rgba(170,220,160,.45)" stroke="#9a6233" strokeWidth={12} />
            <path d={`M1560,560 L${1560 - 120 * ab},590 L${1560 - 120 * ab},880 L1560,900 Z`} fill="#9a6233" stroke="#5e3a1c" strokeWidth={6} />
          </g>
        </g>
        {/* los tres fuegos prohibidos */}
        {fuegos && [0, 1, 2].map((i) => { const x = 480 + i * 480, p = spr(t, H - 0.3 + i * 0.5, 1); return (
          <g key={i} transform={`translate(${x},560) scale(${p})`} opacity={cl(p * 2)}>
            {i === 0 && <g><ellipse cx={0} cy={80} rx={190} ry={50} fill="#2c2a27" /><ellipse cx={0} cy={66} rx={120} ry={30} fill="none" stroke="#5a5650" strokeWidth={10} />{llama(0, 40, 1.3)}</g>}
            {i === 1 && <g transform="rotate(-18)"><rect x={-170} y={20} width={260} height={44} rx={8} fill="#f4f1ea" /><rect x={90} y={20} width={70} height={44} rx={6} fill="#d98a3a" /><circle cx={-176} cy={42} r={24} fill="#ff6a2a" /><circle cx={-176} cy={42} r={12} fill="#ffe08a" /><Vapor x0={-180} y0={10} x1={-120} y1={-180} u={0.6 + 0.4 * Math.sin(t)} col="rgba(220,220,220,.5)" w={16} /></g>}
            {i === 2 && <g><rect x={-130} y={-120} width={260} height={230} rx={22} fill="#7b7f86" stroke="#34373b" strokeWidth={5} />{[0, 1, 2, 3].map((k) => <rect key={k} x={-100} y={-92 + k * 50} width={200} height={26} rx={13} fill="#ff6a2a" opacity={0.75 + 0.25 * Math.sin(t * 6 + k)} />)}<rect x={-110} y={110} width={40} height={30} fill="#34373b" /><rect x={70} y={110} width={40} height={30} fill="#34373b" /></g>}
          </g>); })}
        {fuegos && [0, 1, 2].map((i) => <Cross key={i} t={t} at={H + 0.1 + i * 0.5} x={480 + i * 480 + 150} y={420} r={58} />)}
      </Svg>
      <Lbl t={t} at={a + 2.7} out={m.abiertas - 0.2} text="se prenden fuego" x={960} y={950} col={C.red} size={80} />
      <Lbl t={t} at={m.abiertas + 0.4} out={H - 0.5} text="ventana y puerta abiertas" x={960} y={950} col={C.ok} size={72} />
      {fuegos && ["ni la hornalla", "ni un cigarrillo", "ni la estufa"].map((s, i) => <Lbl key={i} t={t} at={H + 0.2 + i * 0.5} text={s} x={480 + i * 480} y={830} col={C.cream} size={58} />)}
    </>
  );
};

// 8 · reacciona o se evapora. Izquierda (EPOXI): A y B caen en un molde hondo, se mezclan y se vuelven piedra (golpe).
// Derecha (ESTA): el pincel deja una capa, el disolvente sube en vapor y queda una lámina fina que brilla.
// Al final: el molde hondo con ESTA = piel arriba y líquido adentro (tachado) vs. capas finas (tilde).
export const ReaccionVsEvapora: React.FC<FxP> = ({ t, a, m }) => {
  const pA = e(t, a + 0.5, a + 2.5), mix = e(t, a + 2.5, a + 4), piedra = e(t, a + 7, a + 8.5);
  const pin = e(t, m.otra + 0.8, m.otra + 3.5), ev = e(t, m.evap, m.evap + 6), molde = t > m.molde - 0.3, mk = e(t, m.molde, m.molde + 2.5);
  const lvl = 0.62 * pA, col = `rgb(${lerp(240, 205, mix)},${lerp(205, 175, mix)},${lerp(120, 105, mix)})`;
  return (
    <>
      <Svg>
        {/* EPOXI: dos frascos que vuelcan en el molde */}
        <g opacity={1 - e(t, m.molde - 0.6, m.molde)} transform={`translate(${shake(t, a + 8.4, 12)},0)`}>
          {pA < 1 && <>
            <g transform={`rotate(${lerp(0, 55, e(t, a, a + 0.6))} 300 360)`}><Vaso3 u="ra" x={300} y={440} w={110} h={150} lv={0.6 * (1 - pA)} liq="rgba(240,240,255,.8)" /></g>
            <g transform={`rotate(${-lerp(0, 55, e(t, a, a + 0.6))} 760 360)`}><Vaso3 u="rb" x={760} y={440} w={110} h={150} lv={0.6 * (1 - pA)} liq="rgba(240,169,58,.85)" /></g>
            <path d={`M380,${400} Q470,${500} 520,620`} stroke="rgba(240,240,255,.8)" strokeWidth={10 * (1 - pA)} fill="none" />
            <path d={`M680,${400} Q590,${500} 540,620`} stroke="rgba(240,169,58,.9)" strokeWidth={10 * (1 - pA)} fill="none" />
          </>}
          <Vaso3 u="rm" x={530} y={880} w={300} h={260} lv={lvl} liq={col} turb={0} />
          {piedra > 0 && <g opacity={piedra}><path d={`M${530 - 146},${880 - 260 * lvl} L${530 + 146},${880 - 260 * lvl} L${530 + 146},880 L${530 - 146},880 Z`} fill="#b8935a" /><ellipse cx={530} cy={880 - 260 * lvl} rx={146} ry={36} fill="#d2ad70" />{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={420 + hash(k, 3) * 220} cy={780 - hash(k, 4) * 120} r={6 + 6 * hash(k, 5)} fill="rgba(80,55,25,.4)" />)}</g>}
        </g>
        {/* ESTA: tabla, pincel, vapor que sube y la lámina que queda */}
        <g opacity={e(t, m.otra, m.otra + 0.6) * (1 - e(t, m.molde - 0.6, m.molde))}>
          <Tabla3 u="rv" x={1390} y={840} w={700} d={220} th={50} lac={e(t, m.evap + 3, m.evap + 6)} sh={0.2 * ev}>
            <path d={`M${1070},${780} L${1070 + 560 * pin},${780} L${1070 + 560 * pin - 60},${640} L${1130},${640} Z`} fill="rgba(240,169,58,.75)" opacity={1 - 0.6 * ev} />
          </Tabla3>
          {pin > 0 && pin < 1 && <Pincel x={1080 + 560 * pin} y={720} rot={30} s={0.75} />}
          {t > m.evap && Array.from({ length: 12 }, (_, i) => { const u = ((t - m.evap) * 0.35 + i / 12) % 1; return <Vapor key={i} x0={1120 + hash(i, 2) * 520} y0={700} x1={1120 + hash(i, 2) * 520 + 80} y1={300} u={u} w={20} seed={i} col={`rgba(143,211,255,${0.55 * (1 - ev * 0.7)})`} />; })}
        </g>
        {/* el molde hondo con ESTA: piel arriba, líquido adentro */}
        {molde && <g opacity={e(t, m.molde - 0.3, m.molde + 0.3)}>
          <Vaso3 u="rh" x={600} y={860} w={340} h={360} lv={0.75} liq="rgba(240,180,80,.6)">
            <path d={`M${600 - 166},${860 - 270} L${600 + 166},${860 - 270}`} stroke="#c98a2a" strokeWidth={18 * mk} />
          </Vaso3>
          <Tabla3 u="rf" x={1380} y={820} w={640} d={200} th={44} lac={1} sh={0.1} />
        </g>}
        {molde && <Cross t={t} at={m.molde + 1.6} x={600} y={360} r={60} />}
        {molde && <Tick t={t} at={m.molde + 2.4} x={1380} y={480} r={60} />}
      </Svg>
      <Lbl t={t} at={a + 0.3} out={m.molde - 0.6} text="epoxi: reacciona" x={530} y={180} col={C.solv} size={72} />
      <Lbl t={t} at={a + 7.6} out={m.molde - 0.6} text="dura como piedra" x={530} y={980} col={C.cream} size={60} />
      <Lbl t={t} at={m.otra + 0.4} out={m.molde - 0.6} text="esta: se evapora" x={1390} y={180} col={C.honey} size={72} />
      <Lbl t={t} at={m.evap + 4} out={m.molde - 0.6} text="queda una lámina" x={1390} y={980} col={C.cream} size={60} />
      <Lbl t={t} at={m.molde + 0.6} text="molde hondo: no" x={600} y={980} col={C.red} size={66} />
      <Lbl t={t} at={m.molde + 2.4} text="capas finas: sí" x={1380} y={980} col={C.ok} size={66} />
    </>
  );
};

// 11 · casi todo aire: una caja de zapatos (de verdad, con tapa) llena de telgopor se aplasta, el aire escapa en
// burbujas y en la cuchara quedan dos cucharadas color miel; el número sube a 98 % aire
export const CasiTodoAire: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, m.cuch - 1.2, m.cuch + 0.6), cx = 640, by = 800, w = lerp(560, 90, k), h = lerp(300, 40, k), dz = lerp(140, 30, k);
  const tapa = e(t, a + 0.3, a + 1.1);
  return (
    <>
      <Svg>
        {/* caja: frente, costado, interior con bloques de telgopor, tapa que se levanta */}
        <g opacity={1 - e(t, m.cuch + 0.3, m.cuch + 0.8)}>
          <path d={`M${cx - w / 2},${by - h} L${cx - w / 2 + dz},${by - h - dz * 0.6} L${cx + w / 2 + dz},${by - h - dz * 0.6} L${cx + w / 2},${by - h} Z`} fill="#f6f5ef" stroke="#a49f93" strokeWidth={3} />
          {Array.from({ length: 10 }, (_, i) => <Cubo3 key={i} x={cx - w / 2 + 50 + (i % 5) * (w - 60) / 5} y={by - h - 10 - Math.floor(i / 5) * 30} s={Math.max(10, 70 * (1 - k))} />)}
          <path d={`M${cx + w / 2},${by - h} L${cx + w / 2 + dz},${by - h - dz * 0.6} L${cx + w / 2 + dz},${by - dz * 0.6} L${cx + w / 2},${by} Z`} fill="#b06a3a" stroke="#5e3a1c" strokeWidth={3} />
          <path d={`M${cx - w / 2},${by - h} L${cx + w / 2},${by - h} L${cx + w / 2},${by} L${cx - w / 2},${by} Z`} fill="#c97c45" stroke="#5e3a1c" strokeWidth={3} />
          {k < 0.5 && <rect x={cx - 90} y={by - h * 0.6} width={180} height={h * 0.3} rx={8} fill="#f2e3bf" opacity={1 - k * 2} />}
          <g transform={`translate(${-60 * tapa},${-200 * tapa}) rotate(${-12 * tapa} ${cx} ${by - h})`} opacity={1 - k}>
            <path d={`M${cx - w / 2 - 12},${by - h - 26} L${cx - w / 2 + dz - 12},${by - h - dz * 0.6 - 26} L${cx + w / 2 + dz + 12},${by - h - dz * 0.6 - 26} L${cx + w / 2 + 12},${by - h - 26} Z`} fill="#e39a62" stroke="#5e3a1c" strokeWidth={3} />
            <path d={`M${cx - w / 2 - 12},${by - h - 26} L${cx + w / 2 + 12},${by - h - 26} L${cx + w / 2 + 12},${by - h + 14} L${cx - w / 2 - 12},${by - h + 14} Z`} fill="#c97c45" stroke="#5e3a1c" strokeWidth={3} />
          </g>
        </g>
        {/* el aire que se va */}
        {t > m.cuch - 1.2 && Array.from({ length: 26 }, (_, i) => { const u = cl((t - (m.cuch - 1.2) - hash(i, 7) * 1.4) / 1.6); return u > 0 && u < 1 ? <circle key={i} cx={cx - 220 + hash(i, 1) * 440} cy={by - 160 - u * 520} r={10 + 22 * hash(i, 2)} fill="rgba(200,230,255,.12)" stroke="rgba(220,240,255,.7)" strokeWidth={2.5} opacity={1 - u} /> : null; })}
        {/* dos cucharadas */}
        {[0, 1].map((i) => { const p = spr(t, m.cuch + 0.2 + i * 0.35, 1.1); return (
          <g key={i} transform={`translate(${1240 + i * 300},${720 + (1 - p) * 60})`} opacity={cl(p * 2)}>
            <path d="M60,0 L330,-30 Q345,-30 345,-18 Q345,-8 330,-6 L64,26 Z" fill="#cfcac0" stroke="#6d6a63" strokeWidth={3} />
            <ellipse cx={0} cy={6} rx={110} ry={46} fill="#cfcac0" stroke="#6d6a63" strokeWidth={4} />
            <ellipse cx={0} cy={0} rx={92} ry={34} fill="#e2a447" />
            <ellipse cx={-28} cy={-10} rx={34} ry={10} fill="rgba(255,250,230,.75)" />
          </g>); })}
      </Svg>
      <Pop t={t} at={m.aire} x={960} y={240}><Big size={170} col={C.solv}>{num(t, m.aire, m.aire + 1.2, 0, 98)} % aire</Big></Pop>
      <Lbl t={t} at={a + 0.6} out={m.cuch - 0.6} text="una caja de zapatos" x={cx} y={940} col={C.cream} size={72} />
      <Lbl t={t} at={m.cuch + 0.5} text="dos cucharadas" x={1390} y={940} col={C.honey} size={76} />
    </>
  );
};

// 23 · la prueba de la gota en un vidrio: el palito deja caer una gota; primero se desparrama chata (falta telgopor),
// después queda redonda como miel (llegaste); al final la serie: cada gota un poco más parada que la anterior
export const GotaExpande: React.FC<FxP> = ({ t, a, m }) => {
  const g1 = e(t, m.abre - 1.2, m.abre + 0.8), g2 = cl((t - m.redonda + 0.9) / 0.5), serie = t > m.serie - 0.2;
  const plato = (
    <g>
      <path d="M360,700 L1560,700 L1420,520 L500,520 Z" fill="rgba(210,235,250,.18)" stroke="rgba(230,245,255,.8)" strokeWidth={4} />
      <path d="M360,700 L1560,700 L1560,716 L360,716 Z" fill="rgba(190,225,245,.45)" />
      <path d="M560,690 L700,530 M640,690 L760,530" stroke="rgba(255,255,255,.35)" strokeWidth={10} />
    </g>
  );
  const palito = (x: number, y: number) => <g><rect x={x - 7} y={y - 330} width={14} height={300} rx={6} fill="#d9b27a" stroke="#7a5a30" strokeWidth={2} /><ellipse cx={x} cy={y - 24} rx={12} ry={18} fill="#e2a447" /></g>;
  return (
    <>
      <Svg>
        {plato}
        {!serie && <>
          {/* 1ª gota: se abre */}
          <g opacity={1 - e(t, m.redonda - 1.2, m.redonda - 0.8)}>
            {t < m.abre - 0.4 && palito(760, 470)}
            {cl((t - m.abre + 1.2) / 0.5) < 1 ? <GotaCae x={760} y={lerp(450, 600, cl((t - m.abre + 1.2) / 0.5))} r={22} col="#e2a447" /> : <Gota3 u="ge1" x={760} y={610} r={46} sq={g1} col="#e2a447" />}
          </g>
          {/* 2ª gota: redonda */}
          <g opacity={e(t, m.redonda - 1.2, m.redonda - 0.9)}>
            {g2 < 1 && palito(1160, 470)}
            {g2 < 1 ? <GotaCae x={1160} y={lerp(450, 600, g2)} r={22} col="#e2a447" /> : <Gota3 u="ge2" x={1160} y={610} r={58} sq={0} col="#e2a447" />}
          </g>
        </>}
        {serie && [0, 1, 2, 3, 4].map((i) => { const p = spr(t, m.serie + i * 0.45, 1.2); return <g key={i} opacity={cl(p * 2)}><Gota3 u={`gs${i}`} x={600 + i * 180} y={640 - i * 18} r={30 + 6 * i} sq={0.8 - 0.2 * i} col="#e2a447" /></g>; })}
        {serie && <Draw d="M560,470 C 800,420 1100,400 1420,330" p={e(t, m.serie + 2, m.serie + 3)} col={C.ok} w={8} glow />}
        {!serie && <Cross t={t} at={m.abre + 0.6} x={760} y={380} r={52} />}
        {!serie && <Tick t={t} at={m.redonda + 0.4} x={1160} y={380} r={52} />}
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.abre - 0.3} text="una gota en un vidrio" x={960} y={900} col={C.cream} size={72} />
      <Lbl t={t} at={m.abre + 0.4} out={m.redonda - 0.6} text="se abre: falta telgopor" x={960} y={900} col={C.red} size={72} />
      <Lbl t={t} at={m.redonda + 0.3} out={m.serie - 0.3} text="redonda: llegaste" x={960} y={900} col={C.ok} size={76} />
      <Lbl t={t} at={m.serie + 0.6} text="cada vez más paradita" x={960} y={900} col={C.honey} size={72} />
    </>
  );
};

// 25 · tres vasitos: alcohol, aguarrás, thinner para poliuretano; el mismo cubito cae en los tres a la vez:
// en el alcohol flota como barquito, en el aguarrás se ablanda y queda gomoso, en el thinner desaparece con burbujas
export const TresVasitos: React.FC<FxP> = ({ t, a, m }) => {
  const V = [{ at: m.alc, x: 480, lab: "alcohol", liq: "rgba(200,230,255,.45)" }, { at: m.agu, x: 960, lab: "aguarrás", liq: "rgba(235,215,150,.5)" }, { at: m.thin, x: 1440, lab: "thinner poliuretano", liq: "rgba(170,215,255,.5)" }];
  const fall = cl((t - m.mete) / 0.6), yS = 860 - 360 * 0.6;
  return (
    <>
      <Svg>
        {V.map((v, i) => {
          const p = spr(t, Math.min(v.at, a + 0.4 + i * 0.3), 1);
          let cube: React.ReactNode = null;
          if (t > m.mete - 0.8) {
            const y0 = lerp(260, yS, fall * fall);
            if (i === 0) cube = <Cubo3 x={v.x} y={fall < 1 ? y0 : yS - 18 + 6 * Math.sin(t * 2.4)} s={78} rot={fall < 1 ? 0 : 5 * Math.sin(t * 1.7)} />;
            if (i === 1) { const g = e(t, m.gom - 0.5, m.gom + 1.2); cube = <Cubo3 x={v.x} y={fall < 1 ? y0 : yS + 10 + 40 * g} s={78 * (1 - 0.15 * g)} soft={g} />; }
            if (i === 2) { const d = e(t, m.nada - 0.2, m.nada + 1.4); cube = d < 0.98 ? <Cubo3 x={v.x} y={fall < 1 ? y0 : yS + 20} s={78 * (1 - d)} o={1 - d * 0.6} /> : null; }
          }
          const burb = i === 2 && t > m.nada ? Array.from({ length: 14 }, (_, k) => { const u = ((t - m.nada) * 0.8 + hash(k, 2)) % 1; return <circle key={k} cx={v.x - 90 + hash(k, 1) * 180} cy={860 - u * 210} r={4 + 6 * hash(k, 3)} fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.75)" strokeWidth={2} opacity={1 - u} />; }) : null;
          return (
            <g key={i} opacity={cl(p * 2)} transform={`translate(0,${(1 - p) * 80})`}>
              <Vaso3 u={`tv${i}`} x={v.x} y={860} w={260} h={360} lv={0.6} liq={v.liq}>{cube}{burb}</Vaso3>
            </g>
          );
        })}
        <Cross t={t} at={m.nada + 0.2} x={480} y={380} r={46} />
        <Cross t={t} at={m.gom + 0.8} x={960} y={380} r={46} />
        <Tick t={t} at={m.des} x={1440} y={380} r={52} />
      </Svg>
      {V.map((v, i) => <Lbl key={i} t={t} at={v.at + 0.2} text={v.lab} x={v.x} y={960} col={C.cream} size={i === 2 ? 50 : 62} />)}
      <Lbl t={t} at={m.nada + 0.3} text="flota" x={480} y={280} col={C.solv} size={64} />
      <Lbl t={t} at={m.gom + 0.4} text="gomoso" x={960} y={280} col={C.red} size={64} />
      <Lbl t={t} at={m.des - 0.2} text="desaparece" x={1440} y={280} col={C.ok} size={64} />
    </>
  );
};

// 33 · una pasada: el pincel apoya la resina en el centro de la tabla y la tira hacia cada borde en una sola pasada;
// si vuelve atrás sobre lo que ya empezó a secar, arrastra y quedan marcas (zona en rojo)
export const UnaPasada: React.FC<FxP> = ({ t, a, m }) => {
  const c = m.centro, pool = e(t, c - 0.3, c + 0.5), L = e(t, c + 0.7, c + 3), R = e(t, c + 3.3, c + 5.6);
  const back = e(t, m.atras + 0.3, m.atras + 2.6), x0 = 960;
  const brushX = t < c + 3 ? lerp(x0, 300, L) : t < c + 5.6 ? lerp(x0, 1620, R) : t < m.atras ? 1620 : lerp(1500, 1000, back);
  const brushY = 650;
  return (
    <>
      <Svg>
        <Tabla3 u="pa" x={960} y={760} w={1500} d={280} th={56} lac={0}>
          {/* el charco del centro y la película que se estira hacia cada lado (brilla) */}
          <ellipse cx={x0} cy={620} rx={60 + 50 * pool} ry={30 + 20 * pool} fill="#e2a447" opacity={pool * (1 - 0.6 * L)} />
          <path d={`M${x0},${700} L${lerp(x0, 260, L)},${700} L${lerp(x0, 380, L)},${530} L${x0},${530} Z`} fill="rgba(240,169,58,.62)" />
          <path d={`M${x0},${700} L${lerp(x0, 1660, R)},${700} L${lerp(x0, 1540, R)},${530} L${x0},${530} Z`} fill="rgba(240,169,58,.62)" />
          <path d={`M${lerp(x0, 420, L)},${690} L${lerp(x0, 1500, R)},${690} L${lerp(x0, 1420, R)},${545} L${lerp(x0, 500, L)},${545} Z`} fill="rgba(255,248,225,.16)" />
          {/* marcas por volver atrás */}
          {back > 0 && Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${1520 - 50 * i * back},${560 + i * 14} q 30,-12 60,0 t 60,0 t 60,0`} stroke="rgba(120,70,20,.75)" strokeWidth={5} fill="none" opacity={back} />)}
        </Tabla3>
        {back > 0 && <ellipse cx={1260} cy={620} rx={300} ry={110} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="22 14" opacity={back} />}
        {/* flechas centro → bordes */}
        <Draw d={`M${x0 - 60},780 L380,780`} p={e(t, c + 0.7, c + 2.6)} col={C.honey} w={10} />
        <Draw d={`M${x0 + 60},780 L1540,780`} p={e(t, c + 3.3, c + 5.2)} col={C.honey} w={10} />
        <Pincel x={brushX} y={brushY} rot={t < c + 3 ? 24 : -24} s={0.95} />
      </Svg>
      <Lbl t={t} at={c + 0.2} out={m.atras - 0.2} text="del centro a los bordes" x={960} y={940} col={C.honey} size={74} />
      <Lbl t={t} at={m.atras + 0.6} text="volver atrás: marcas" x={960} y={940} col={C.red} size={74} />
      <Lbl t={t} at={c + 5.8} out={m.atras + 0.2} text="una sola pasada" x={960} y={200} col={C.ok} size={74} />
      <Cross t={t} at={m.atras + 2} x={1260} y={430} r={50} />
    </>
  );
};
