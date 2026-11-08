// ap6nd — únicas 15-29 (los leones de Tsavo, 1898): la trampa, el éxodo, el fin, los números y el porqué.
// Ninguna repite apex01-07, ap6na, ap6nb ni ap6nc. Dibujado por código, sin IA. Todo sale de useCurrentFrame().
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, GOLD, Scene, Tag, ez, lin, sp, rnd, at, Fig } from "./ukit";
import { SV } from "./pkit";
import { NIGHT, SAV, LION, LRIM, AMB, CANVAS, THORN, IRON, FL, Lion, LPaw, Tent, Flame, polyAt, polyD } from "./o10a";

type UP = { d: number; p: any };
type Pt = [number, number];

// 15 · LA TRAMPA Y EL PERNO: caja de vigas y rieles, barrotes al medio, la puerta cae, los tiros fallan, uno pega en el perno
export const TrapBolt: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), br = at(p, "bars", 40), dr = at(p, "door", 120), fi = at(p, "fire", 170), bo = at(p, "bolt", 230), ou = at(p, "out", 270);
  const lionIn = f > dr - 30, doorY = f < dr ? -300 : f < bo ? -300 + 300 * ez(f, dr, dr + 6) : 0 + 60 * ez(f, bo + 4, bo + 16);
  const doorRot = f > bo ? 24 * ez(f, bo + 4, bo + 16) : 0, lx = f < dr ? lin(f, dr - 30, dr, 1800, 1300) : f < ou ? 1300 + Math.sin(f / 3) * 30 : lin(f, ou, ou + 30, 1300, 2200);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={0} y1={820} x2={1920} y2={820} stroke="#3a2416" strokeWidth={6} />
        <rect x={420} y={420} width={1080} height={400} fill="rgba(40,26,16,.55)" stroke="#6b4529" strokeWidth={22} />
        {[520, 640, 760, 1240, 1360].map((x) => <rect key={x} x={x} y={420} width={16} height={400} fill="#6b4529" />)}
        <g opacity={ez(f, br, br + 10)}>{Array.from({ length: 9 }).map((_, i) => <rect key={i} x={952} y={430 + i * 44} width={16} height={34} fill={IRON} />)}<rect x={950} y={420} width={20} height={400} fill="none" stroke={GOLD} strokeWidth={f > br && f < br + 30 ? 4 : 0} /></g>
        {[560, 700, 840].map((x, i) => <Fig key={i} x={x} y={800} s={1.2} c="#e9dcc2" lean={f > fi && f < bo + 20 ? -4 : 0} arm={f > fi ? 1 : 0} />)}
        {f > fi && f < bo + 30 && [600, 740, 880].map((x, i) => { const on = Math.floor((f - fi) / 5 + i) % 3 === 0; return on ? <circle key={i} cx={x + 80} cy={670} r={22} fill="#ffe7a6" /> : null; })}
        {f > fi && f < bo && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={1000 + rnd(i + Math.floor(f / 6), 2) * 480} cy={440 + rnd(i + Math.floor(f / 6), 3) * 360} r={6} fill="none" stroke={RED} strokeWidth={3} opacity={0.8} />)}
        {lionIn && <Lion x={lx} y={800} s={0.62} step={f / 3} />}
        <g transform={`translate(1500,${420 + doorY}) rotate(${doorRot})`}><rect x={-14} y={0} width={28} height={400} fill="#4a3322" stroke="#2a1a10" strokeWidth={4} />{[60, 160, 260, 360].map((y) => <rect key={y} x={-18} y={y} width={36} height={10} fill={IRON} />)}</g>
        <g transform="translate(1500,420)"><circle r={18} fill={f > bo ? RED : IRON} />{f > bo && f < bo + 14 && Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i) * 60} y2={Math.sin(i) * 60} stroke="#ffd27a" strokeWidth={5} />)}</g>
      </SV>
      <Tag a={6} t="TIMBER AND RAILWAY IRON" x={960} y={155} size={56} w={1300} />
      {f > br && f < dr && <Tag a={br + 4} t="MEN AS BAIT · BEHIND BARS" x={700} y={300} size={42} color={GOLD} w={800} />}
      {f > dr && f < fi && <Tag a={dr + 2} t="THE DOOR SLAMS" x={1300} y={300} size={48} color={RED} w={700} />}
      {f > fi && f < bo && <Tag a={fi + 4} t="SHOTS IN THE DARK · MOST MISS" x={960} y={300} size={46} color={RED} w={1200} />}
      {f > bo && <Tag a={bo + 4} t="ONE HITS THE BOLT" x={1300} y={300} size={50} color={GOLD} w={800} />}
      {f > ou && <Tag a={ou + 4} t="IT GOT OUT" x={960} y={900} size={64} color={RED} w={800} />}
    </Scene>
  );
};

// 16 · EL TREN: cientos paran un tren que pasa, se suben y se van de Tsavo
export const TrainRush: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), bd = at(p, "board", 60);
  const tx = f < bd ? lin(f, 0, 40, 2100, 760) : lin(f, bd + 30, d, 760, -900);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={0} y1={800} x2={1920} y2={800} stroke={IRON} strokeWidth={8} />
        <g transform={`translate(${tx},800)`}>
          <rect x={-40} y={-200} width={300} height={170} fill="#2b2f33" stroke="#111" strokeWidth={4} /><rect x={180} y={-290} width={60} height={90} fill="#2b2f33" />
          <circle cx={30} cy={-24} r={34} fill="#111" /><circle cx={200} cy={-24} r={34} fill="#111" />
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${300 + i * 330},0)`}><rect x={0} y={-180} width={300} height={150} fill="#5a3a22" stroke="#2a1a10" strokeWidth={4} />{[30, 110, 190].map((x) => <rect key={x} x={x} y={-160} width={60} height={50} fill={AMB} opacity={0.5} />)}<circle cx={50} cy={-24} r={26} fill="#111" /><circle cx={250} cy={-24} r={26} fill="#111" /></g>)}
          {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={210 - (f % 30) * 3 - i * 40} cy={-310 - i * 30} r={30 + i * 8} fill="rgba(200,200,200,.25)" />)}
        </g>
        {Array.from({ length: 18 }).map((_, i) => { const x0 = 120 + rnd(i, 2) * 500, k = ez(f, 20 + i * 3, bd + i * 2); const on = k > 0.95 && f > bd, x = on ? tx + 330 + (i % 9) * 108 : lin(k, 0, 1, x0, 330 + (i % 9) * 46 + Math.floor(i / 9) * 20), y = on ? 620 : 790;
          return <Fig key={i} x={x} y={y} s={0.75} c="#e9dcc2" step={f / 3 + i} lean={on ? 0 : 8} />; })}
      </SV>
      <Tag a={6} t="HUNDREDS STOPPED WORK" x={960} y={155} size={62} w={1300} />
      <Tag a={bd + 4} t="AND LEFT TSAVO" x={960} y={900} size={60} color={RED} w={1000} />
    </Scene>
  );
};

// 17 · DORMIR ARRIBA: tanques, techos, árboles, pozos tapados, vigas del puente; la línea del salto del león
export const HighGround: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "tank", 0), at(p, "roof", 30), at(p, "tree", 50), at(p, "pit", 80), at(p, "beam", 140)];
  const lab = ["WATER TANKS", "ROOFS", "TREES", "PITS UNDER LOGS", "BRIDGE BEAMS"], X = [260, 610, 960, 1310, 1660];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={0} y1={820} x2={1920} y2={820} stroke="#3a2416" strokeWidth={6} />
        <line x1={60} y1={560} x2={1860} y2={560} stroke={RED} strokeWidth={4} strokeDasharray="18 14" opacity={ez(f, 20, 30)} />
        {A.map((a, i) => { const k = sp(f, a + 2, 0.8, 12), x = X[i];
          return <g key={i} opacity={Math.min(1, k * 1.4)} transform={`translate(0,${(1 - k) * 80})`}>
            {i === 0 && <><rect x={x - 90} y={330} width={180} height={130} fill={IRON} /><path d={`M${x - 80},460 L${x - 80},820 M${x + 80},460 L${x + 80},820`} stroke={IRON} strokeWidth={12} /><Fig x={x} y={330} s={0.6} c={SAV} lean={80} /></>}
            {i === 1 && <><rect x={x - 110} y={560} width={220} height={260} fill="#4a3322" /><path d={`M${x - 140},560 L${x},430 L${x + 140},560 Z`} fill="#6b4529" /><Fig x={x - 20} y={470} s={0.6} c={SAV} lean={70} /></>}
            {i === 2 && <><path d={`M${x},820 L${x},420`} stroke="#4a3322" strokeWidth={26} /><ellipse cx={x} cy={380} rx={150} ry={80} fill="#2c3a1e" /><Fig x={x + 30} y={420} s={0.6} c={SAV} lean={60} /></>}
            {i === 3 && <><rect x={x - 90} y={820} width={180} height={110} fill="#1a0f08" stroke="#5a3a22" strokeWidth={4} />{[0, 1, 2].map((j) => <rect key={j} x={x - 110} y={806 + j * 0} width={220} height={16} fill="#6b4529" transform={`rotate(${j * 3 - 3} ${x} 812)`} />)}<Fig x={x} y={910} s={0.45} c={SAV} lean={80} /></>}
            {i === 4 && <><path d={`M${x - 150},470 L${x + 150},470 M${x - 150},470 L${x - 150},820 M${x + 150},470 L${x + 150},820 M${x - 150},560 L${x + 150},470 M${x - 150},470 L${x + 150},560`} stroke={IRON} strokeWidth={12} fill="none" /><Fig x={x} y={470} s={0.55} c={SAV} lean={80} /></>}
          </g>; })}
      </SV>
      {A.map((a, i) => <Tag key={i} a={a + 6} t={lab[i]} x={X[i]} y={950} size={34} color={GOLD} w={340} />)}
      <Tag a={22} t="HOW HIGH A LION CAN REACH" x={1500} y={500} size={30} color={RED} w={700} />
      <Tag a={4} t="SLEEPING WHERE A LION CAN'T REACH" x={960} y={155} size={56} w={1600} />
    </Scene>
  );
};

// 18 · LA PLATAFORMA Y EL BÚHO: dos ojos dan vueltas abajo, se acercan; algo le pega en la nuca… era un búho
export const OwlPlatform: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), tw = at(p, "toward", 80), ht = at(p, "hit", 150);
  const r = lin(f, 0, ht, 520, 180), a = f / 22, ex = 960 + Math.cos(a) * r, ey = 860 + Math.sin(a) * r * 0.22;
  const ow = ez(f, ht - 12, ht + 2), ox = lin(ow, 0, 1, -200, 900), oy = lin(ow, 0, 1, 200, 400), jolt = f > ht && f < ht + 10 ? Math.sin(f * 3) * 10 : 0;
  return (
    <Scene d={d} bg={p.bg} tint="#05060a" floor="90,100,140">
      <SV>
        <path d="M900,820 L900,500 M1020,820 L1020,500" stroke="#3a2a1c" strokeWidth={14} />
        <rect x={860} y={480} width={200} height={24} fill="#6b4529" />
        <g transform={`translate(${jolt},0)`}><Fig x={960} y={480} s={1} c="#cdbfa4" lean={-6} arm={0.6} /></g>
        <line x1={990} y1={410} x2={1160} y2={380} stroke="#3b3f44" strokeWidth={10} />
        {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={200 + i * 130 + rnd(i, 2) * 40} cy={900 + rnd(i, 3) * 60} rx={110} ry={55} fill="#141a10" />)}
        <g transform={`translate(${ex},${ey})`} opacity={0.9}><circle cx={-14} cy={0} r={7} fill={AMB} /><circle cx={14} cy={0} r={7} fill={AMB} /><circle r={40} fill={AMB} opacity={0.12} /></g>
        {f > tw && <ellipse cx={960} cy={860} rx={r} ry={r * 0.22} fill="none" stroke={RED} strokeWidth={3} strokeDasharray="10 12" opacity={0.6} />}
        {ow > 0 && <g transform={`translate(${ox},${oy})`}><path d="M-80,0 C-40,-50 -10,-30 0,0 C10,-30 40,-50 80,0 C40,-10 10,10 0,20 C-10,10 -40,-10 -80,0 Z" fill="#8a7a62" /><circle cx={0} cy={-6} r={16} fill="#8a7a62" /><circle cx={-6} cy={-8} r={4} fill={GOLD} /><circle cx={6} cy={-8} r={4} fill={GOLD} /></g>}
      </SV>
      <Tag a={6} t="ALONE ON A FLIMSY PLATFORM" x={960} y={155} size={54} w={1400} />
      {f > tw && f < ht && <Tag a={tw + 4} t="NOT TOWARD THE BAIT. TOWARD HIM." x={960} y={245} size={48} color={RED} w={1500} />}
      {f > ht && <Tag a={ht + 10} t="IT WAS AN OWL" x={960} y={250} size={64} color={GOLD} w={900} />}
    </Scene>
  );
};

// 19 · OCHO HOMBRES: el primer león medido de nariz a cola, y la vara que cargan ocho hombres hasta el campamento
export const NineFeetEight: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), cr = at(p, "carry", 90), k = ez(f, 10, 50), walk = f > cr ? (f - cr) * 2.2 : 0;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <g transform={`translate(${walk},0)`}>
          <g transform={`translate(960,${f > cr ? 640 : 760})`}><Lion x={0} y={0} s={0.95} step={0} low={0.2} /></g>
          {f < cr && <g opacity={ez(f, 10, 18)}><path d={`M600,880 L${600 + 790 * k},880`} stroke={GOLD} strokeWidth={8} /><path d="M600,860 L600,900" stroke={GOLD} strokeWidth={6} />{k > 0.98 && <path d="M1390,860 L1390,900" stroke={GOLD} strokeWidth={6} />}</g>}
          {f > cr && <><line x1={500} y1={560} x2={1460} y2={560} stroke="#6b4529" strokeWidth={14} />
            {Array.from({ length: 8 }).map((_, i) => <Fig key={i} x={560 + i * 120} y={820} s={0.9} c="#e9dcc2" step={f / 4 + i} load={false} arm={1.4} />)}</>}
        </g>
      </SV>
      <Tag a={30} t="9 FT 8 IN · NOSE TO TAIL" x={960} y={140} size={66} color={GOLD} w={1300} />
      {f > cr && <Tag a={cr + 6} t="EIGHT MEN TO CARRY IT" x={960} y={930} size={60} w={1200} />}
    </Scene>
  );
};

// 20 · DICIEMBRE DE 1898: el calendario; el 9 ya tachado, el 27 se marca, el 29 se cierra
export const DecemberMarks: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), m27 = at(p, "d27", 10), m29 = at(p, "d29", 120);
  const start = 4; // 1 de diciembre de 1898 = jueves (columna 4 con lunes=0... domingo=6 → jueves=3; usamos L-D)
  const cell = (n: number): Pt => { const i = n - 1 + (start - 1); return [330 + (i % 7) * 210, 330 + Math.floor(i / 7) * 130]; };
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <g transform="translate(960,590) scale(0.86) translate(-960,-590)">
        <rect x={210} y={180} width={1500} height={820} rx={18} fill="#e9dfc6" />
        <rect x={210} y={180} width={1500} height={100} rx={18} fill={RED} />
        <text x={960} y={250} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff">DECEMBER 1898</text>
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((w, i) => <text key={w} x={330 + i * 210} y={320} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={26} fill="#7a6a50">{w}</text>)}
        {Array.from({ length: 31 }).map((_, i) => { const [x, y] = cell(i + 1); return <text key={i} x={x} y={y + 60} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill="#2a1d12">{i + 1}</text>; })}
        {(() => { const [x, y] = cell(9); return <g transform={`translate(${x},${y + 42})`}><path d="M-50,-40 L50,40 M50,-40 L-50,40" stroke={RED} strokeWidth={10} strokeLinecap="round" /></g>; })()}
        {[[27, m27], [29, m29]].map(([n, a], i) => { const [x, y] = cell(n); return <circle key={i} cx={x} cy={y + 42} r={62} fill="none" stroke={i ? RED : GOLD} strokeWidth={10} strokeDasharray="400" strokeDashoffset={400 * (1 - ez(f, a, a + 14))} />; })}
        </g>
      </SV>
      <Tag a={6} t="DEC 9 · THE FIRST LION" x={480} y={995} size={36} color={RED} w={700} />
      {f > m29 && <Tag a={m29 + 12} t="DEC 29 · THE SECOND" x={1440} y={995} size={36} color={RED} w={700} />}
    </Scene>
  );
};

// 21 · DOS CUENTAS: 28 trabajadores indios en el registro; «decenas» de africanos sin anotar; y la cifra sube a 135
export const TwoCounts: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), sc = at(p, "scores", 60), bg = at(p, "big", 130);
  const n = Math.round(lin(f, 6, sc - 6, 0, 28)), big = Math.round(lin(f, bg, bg + 40, 28, 135));
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <rect x={180} y={260} width={760} height={560} rx={14} fill="#e9dfc6" />
        {Array.from({ length: n }).map((_, i) => { const g = Math.floor(i / 5), j = i % 5, x = 250 + (g % 3) * 230, y = 340 + Math.floor(g / 3) * 150;
          return j < 4 ? <line key={i} x1={x + j * 30} y1={y} x2={x + j * 30} y2={y + 100} stroke="#1e2a4a" strokeWidth={8} strokeLinecap="round" /> : <line key={i} x1={x - 16} y1={y + 80} x2={x + 110} y2={y + 20} stroke="#1e2a4a" strokeWidth={8} strokeLinecap="round" />; })}
        {f > sc && <g opacity={ez(f, sc, sc + 14)}>{Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={1080 + rnd(i, 2) * 640} cy={300 + rnd(i, 3) * 500} r={14 + rnd(i, 4) * 26} fill="rgba(217,178,124,.18)" />)}
          <text x={1400} y={580} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="rgba(240,235,229,.55)">?</text></g>}
      </SV>
      <Tag a={6} t={`IN THE RECORDS: ${n}`} x={560} y={160} size={52} color={GOLD} w={800} />
      {f > sc && <Tag a={sc + 4} t="AFRICAN VICTIMS: NOT RECORDED" x={1400} y={160} size={40} w={800} />}
      {f > bg && <div style={{ position: "absolute", left: 460, top: 830, width: 1000, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 170, color: RED, textShadow: "0 0 18px rgba(0,0,0,.85)" }}>{big}</div>}
    </Scene>
  );
};

// 22 · EL VIAJE DE LAS PIELES: de Kenia a Chicago, 1924, US$5.000, y una vitrina que se arma
export const SkinsVoyage: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), mu = at(p, "museum", 60), sci = at(p, "sci", 140), k = ez(f, 8, mu);
  const A: Pt = [1250, 640], B: Pt = [420, 330];
  const arc = (u: number): Pt => [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u - Math.sin(u * Math.PI) * 280];
  const pts: Pt[] = Array.from({ length: 41 }).map((_, i) => arc(i / 40)), [bx, by] = polyAt(pts, k);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <path d={polyD(pts, 1)} fill="none" stroke="rgba(240,235,229,.18)" strokeWidth={5} strokeDasharray="12 12" />
        <path d={polyD(pts, k)} fill="none" stroke={GOLD} strokeWidth={8} />
        <circle cx={A[0]} cy={A[1]} r={14} fill={RED} /><circle cx={B[0]} cy={B[1]} r={14} fill={INK} />
        <g transform={`translate(${bx},${by - 30})`}><rect x={-46} y={-30} width={92} height={60} rx={8} fill="#6b4529" stroke="#2a1a10" strokeWidth={4} /><line x1={-46} y1={-6} x2={46} y2={-6} stroke="#2a1a10" strokeWidth={4} /></g>
        {f > mu && <g transform="translate(420,640)" opacity={ez(f, mu, mu + 12)}><rect x={-200} y={-170} width={400} height={300} fill="rgba(156,196,224,.12)" stroke="#9cc4e0" strokeWidth={6} /><Lion x={-30} y={110} s={0.42} /><Lion x={70} y={120} s={0.36} flip low={0.5} /></g>}
        {f > sci && Array.from({ length: 5 }).map((_, i) => { const a = f / 20 + i * 1.256; return <circle key={i} cx={420 + Math.cos(a) * 260} cy={600 + Math.sin(a) * 120} r={10} fill={GOLD} opacity={ez(f, sci, sci + 10)} />; })}
      </SV>
      <Tag a={8} t="TSAVO" x={A[0]} y={A[1] + 40} size={44} color={RED} w={400} />
      <Tag a={mu - 10} t="CHICAGO · FIELD MUSEUM" x={B[0]} y={B[1] + 75} size={42} w={700} />
      <Tag a={20} t="1924 · $5,000" x={1250} y={210} size={84} color={GOLD} w={900} />
      {f > sci && <Tag a={sci + 6} t="NOW SCIENCE COULD STUDY THEM" x={1200} y={900} size={46} w={1200} />}
    </Scene>
  );
};

// 23 · LO QUE DICEN LOS HUESOS: un gráfico de carbono y nitrógeno; pastadores, ramoneadores, personas… y dos puntos que caen entre ellos
export const IsotopePlot: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), cl = at(p, "groups", 60), li = at(p, "lions", 150);
  const G: [string, number, number, string][] = [["GRAZERS", 1350, 700, SAV], ["BROWSERS", 620, 690, "#7fae6a"], ["PEOPLE", 1000, 340, RED]];
  const L1: Pt = [1050, 470], L2: Pt = [920, 510];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <path d="M360,880 L1660,880 M360,880 L360,200" stroke={INK} strokeWidth={6} />
        <text x={1010} y={950} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={34} fill={INK}>CARBON  →</text>
        <text x={300} y={540} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={34} fill={INK} transform="rotate(-90 300 540)">NITROGEN  →</text>
        {G.map(([n, x, y, c], gi) => <g key={n} opacity={ez(f, cl + gi * 10, cl + gi * 10 + 10)}>
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={x + (rnd(i + gi * 20, 2) - 0.5) * 220} cy={y + (rnd(i + gi * 20, 3) - 0.5) * 120} r={9} fill={c} opacity={0.75} />)}
          <text x={x} y={n === "PEOPLE" ? y - 78 : y + 110} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={c}>{n}</text></g>)}
        {[L1, L2].map(([x, y], i) => { const k = sp(f, li + i * 12, 0.9, 10); return <g key={i} transform={`translate(${x},${lin(k, 0, 1, 120, y)})`} opacity={Math.min(1, k * 2)}><circle r={22} fill={GOLD} stroke="#fff" strokeWidth={4} /><text y={58} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill={GOLD}>{`LION ${i + 1}`}</text></g>; })}
      </SV>
      <Tag a={4} t="CHEMICAL TRACES IN BONE AND HAIR" x={960} y={155} size={52} w={1500} />
    </Scene>
  );
};

// 24 · 10 + 24 ≈ 35: dos barras se apilan con su margen de error, al lado la sombra de 135
export const TenAndTwentyFour: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), tw = at(p, "two", 60), sm = at(p, "sum", 120), vs = at(p, "vs", 180);
  const U = 4.2, b1 = 10 * U * ez(f, 6, 30), b2 = 24 * U * ez(f, tw, tw + 24), g = 135 * U * ez(f, vs, vs + 30);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <line x1={300} y1={900} x2={1620} y2={900} stroke={INK} strokeWidth={5} />
        <rect x={420} y={900 - b1} width={200} height={b1} fill={GOLD} /><text x={520} y={890 - b1} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill={GOLD}>~10</text>
        <rect x={720} y={900 - b2} width={200} height={b2} fill={GOLD} /><text x={820} y={890 - b2} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill={GOLD}>~24</text>
        {f > sm && <g opacity={ez(f, sm, sm + 10)}><rect x={1020} y={900 - 35 * U} width={200} height={35 * U} fill={RED} />
          <path d={`M1120,${900 - 45 * U} L1120,${900 - 27 * U} M1090,${900 - 45 * U} L1150,${900 - 45 * U} M1090,${900 - 27 * U} L1150,${900 - 27 * U}`} stroke={INK} strokeWidth={5} />
          <text x={1120} y={880 - 46 * U} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={72} fill={RED}>~35</text></g>}
        {f > vs && <g><rect x={1320} y={900 - g} width={200} height={g} fill="none" stroke="rgba(240,235,229,.6)" strokeWidth={6} strokeDasharray="16 10" />
          <text x={1420} y={880 - g} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="rgba(240,235,229,.8)">135</text></g>}
      </SV>
      <Tag a={8} t="LION 1" x={520} y={930} size={36} w={300} />
      <Tag a={tw} t="LION 2" x={820} y={930} size={36} w={300} />
      {f > sm && <Tag a={sm + 4} t="TOGETHER" x={1120} y={930} size={36} color={RED} w={300} />}
      {f > vs && <Tag a={vs + 4} t="THE LEGEND" x={1420} y={930} size={36} w={300} />}
    </Scene>
  );
};

// 25 · EL COLMILLO ROTO: mandíbula de perfil, un canino partido con el nervio expuesto; el búfalo se tacha, el hombre queda
export const CrackedCanine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), gr = at(p, "grip", 90), mn = at(p, "man", 160), pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <g transform={`translate(720,560) scale(${0.9 + 0.1 * sp(f, 4)})`}>
          <path d="M-400,-20 C-410,-120 -330,-210 -200,-236 C-80,-258 60,-230 150,-180 C220,-150 300,-110 370,-70 C392,-56 394,-18 372,0 L-360,0 C-390,0 -400,-10 -400,-20 Z" fill="#e9e1cf" stroke="#9a8f78" strokeWidth={6} />
          <path d="M-390,-110 C-300,-236 -140,-266 40,-242" fill="none" stroke="#f6f0e2" strokeWidth={12} strokeLinecap="round" />
          <ellipse cx={-150} cy={-112} rx={118} ry={62} fill="#cfc4ab" opacity={0.75} />
          <path d="M-170,-36 C-60,-92 80,-62 170,-44" fill="none" stroke="#9a8f78" strokeWidth={34} strokeLinecap="round" />
          <path d="M-170,-36 C-60,-92 80,-62 170,-44" fill="none" stroke="#efe8d8" strokeWidth={24} strokeLinecap="round" />
          <ellipse cx={100} cy={-118} rx={64} ry={54} fill="#2a1d12" />
          <ellipse cx={334} cy={-62} rx={20} ry={28} fill="#2a1d12" />
          <path d="M-300,40 C-312,-10 -282,-44 -240,-34 L-216,20 L330,20 C352,40 342,82 310,102 C200,142 -120,150 -262,112 C-302,98 -302,70 -300,40 Z" fill="#e2d8c2" stroke="#9a8f78" strokeWidth={6} />
          {[40, 84, 128, 172, 210].map((x, i) => <path key={i} d={`M${x - 18},0 L${x - 4},${i < 2 ? 22 : 34} L${x + 6},12 L${x + 18},0 Z`} fill="#f4eee0" stroke="#9a8f78" strokeWidth={3} />)}
          {[330, 352].map((x) => <rect key={x} x={x - 8} y={0} width={14} height={26} rx={5} fill="#f4eee0" stroke="#9a8f78" strokeWidth={3} />)}
          <path d="M296,20 L310,-26 L324,20 Z" fill="#f4eee0" stroke="#9a8f78" strokeWidth={3} />
          <path d="M246,0 L292,0 L284,58 L270,46 L258,68 L250,40 Z" fill="#f4eee0" stroke="#9a8f78" strokeWidth={4} />
          <path d="M258,68 L270,150 L284,58" fill="none" stroke={RED} strokeWidth={4} strokeDasharray="10 8" opacity={0.6 * ez(f, 14, 24)} />
          <circle cx={268} cy={56} r={18 + 8 * pulse} fill={RED} opacity={ez(f, 20, 30) * (0.5 + 0.5 * pulse)} />
          <path d="M268,44 C230,-8 150,-20 60,-12" fill="none" stroke={RED} strokeWidth={6} opacity={ez(f, 26, 36)} />
        </g>
        <g transform="translate(1520,420)" opacity={ez(f, gr, gr + 10)}>
          <ellipse rx={150} ry={80} fill="#2a2420" /><path d="M-150,-30 C-200,-80 -150,-110 -110,-80 M-150,-30 C-190,10 -170,40 -130,20" stroke="#cfc6b8" strokeWidth={10} fill="none" />
          {f > gr + 20 && <path d="M-160,-100 L160,100 M160,-100 L-160,100" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={ez(f, gr + 20, gr + 30)} />}
        </g>
        {f > mn && <Fig x={1520} y={880} s={1.2} c={SAV} />}
      </SV>
      <Tag a={20} t="BROKEN CANINE · NERVE EXPOSED" x={720} y={150} size={50} color={RED} w={1200} />
      {f > gr && <Tag a={gr + 6} t="BIG PREY: PAINFUL TO HOLD" x={1520} y={580} size={36} w={700} />}
      {f > mn && <Tag a={mn + 6} t="SMALLER. SLOWER." x={1520} y={930} size={42} color={GOLD} w={600} />}
    </Scene>
  );
};

// 26 · PESTE Y SEQUÍA: la manada se apaga en ola y el suelo se agrieta bajo un sol que crece
export const RinderpestDrain: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), dr = at(p, "drought", 120);
  const wave = lin(f, 20, dr, -200, 2100), sun = ez(f, dr, dr + 40);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <circle cx={1730} cy={420} r={60 + 70 * sun} fill={AMB} opacity={0.35 + 0.5 * sun} />
        {Array.from({ length: 30 }).map((_, i) => { const x = 200 + (i % 10) * 160 + (Math.floor(i / 10) % 2) * 60, y = 520 + Math.floor(i / 10) * 120; const gone = x < wave;
          return <g key={i} transform={`translate(${x},${y})`} opacity={gone ? 0.15 : 1}>
            <ellipse rx={50} ry={26} fill={gone ? "#555" : "#8a6a4a"} /><circle cx={50} cy={-18} r={18} fill={gone ? "#555" : "#8a6a4a"} />
            <path d="M-34,20 L-34,52 M34,20 L34,52" stroke={gone ? "#555" : "#8a6a4a"} strokeWidth={9} />
          </g>; })}
        {f > dr && Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${rnd(i, 2) * 1920},${880 + rnd(i, 3) * 160} l${(rnd(i, 4) - 0.5) * 200},${-30 + rnd(i, 5) * 60} l${(rnd(i, 6) - 0.5) * 160},${rnd(i, 7) * 50}`} stroke="#3a2416" strokeWidth={5} fill="none" opacity={ez(f, dr + i * 2, dr + i * 2 + 10)} />)}
      </SV>
      <Tag a={6} t="RINDERPEST · 1890s" x={960} y={155} size={64} color={RED} w={1100} />
      <Tag a={60} t="CATTLE, BUFFALO, ANTELOPE: GONE" x={960} y={245} size={42} w={1300} />
      {f > dr && <Tag a={dr + 6} t="THEN DROUGHT" x={1300} y={400} size={54} color={AMB} w={700} />}
    </Scene>
  );
};

// 27 · EL CRUCE DE LAS CARAVANAS: la ruta de la costa al interior cruza el río en Tsavo, generación tras generación
export const CaravanTrail: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), lr = at(p, "learned", 150);
  const R: Pt[] = [[1800, 820], [1560, 760], [1300, 700], [1060, 600], [800, 520], [520, 420], [220, 330]];
  const k = ez(f, 6, 70), [cx, cy] = polyAt(R, 0.3), yr = Math.round(lin(f, 10, lr, 1800, 1898));
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        <path d="M1100,0 C1180,260 1060,520 1250,760 S1300,980 1260,1080" fill="none" stroke="#5f8fb4" strokeWidth={22} opacity={0.8} />
        <path d={polyD(R, k)} fill="none" stroke={SAV} strokeWidth={8} strokeDasharray="20 14" strokeDashoffset={-f * 1.5} />
        {Array.from({ length: 14 }).map((_, i) => { const u = ((i / 14 + f / 600) % 1) * k; const [x, y] = polyAt(R, u); return <circle key={i} cx={x} cy={y - 8} r={6} fill={SAV} opacity={0.7} />; })}
        <g transform={`translate(${cx},${cy})`} opacity={ez(f, 40, 50)}><circle r={36 + 8 * Math.sin(f / 6)} fill="none" stroke={RED} strokeWidth={6} /><circle r={10} fill={RED} /></g>
        {f > lr && <LPaw x={cx + 120} y={cy - 110} s={1.2} c={RED} o={ez(f, lr, lr + 10)} />}
      </SV>
      <Tag a={10} t="COAST" x={1760} y={880} size={38} w={300} />
      <Tag a={30} t="INTERIOR" x={260} y={250} size={38} w={300} />
      <Tag a={44} t="THE TSAVO CROSSING" x={cx} y={cy + 50} size={42} color={RED} w={600} />
      <Tag a={10} t={`CARAVAN ROUTE · ${yr < 1898 ? "1800s" : "1898"}`} x={960} y={155} size={50} w={1100} />
    </Scene>
  );
};

// 28 · CUATRO HILOS: diente, presas, sendero, campamento — cuatro hilos que se trenzan en un nudo
export const FourStrands: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "s1", 20), at(p, "s2", 60), at(p, "s3", 100), at(p, "s4", 140)];
  const lab = ["A BROKEN TOOTH", "FEWER PREY", "A TRAIL OF DEATH", "A CAMP THAT STAYED"], col = [RED, AMB, SAV, GOLD];
  const S: Pt[] = [[160, 200], [1760, 200], [160, 880], [1760, 880]], C: Pt = [960, 560];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor={FL}>
      <SV>
        {S.map(([x, y], i) => { const k = ez(f, A[i], A[i] + 30); const w = Math.sin(f / 8 + i) * 40;
          return <path key={i} d={`M${x},${y} C${x + (C[0] - x) * 0.4 + w},${y} ${C[0] + (x - C[0]) * 0.3},${C[1] + (y - C[1]) * 0.3 + w} ${C[0]},${C[1]}`} fill="none" stroke={col[i]} strokeWidth={14} strokeLinecap="round" strokeDasharray="1600" strokeDashoffset={1600 * (1 - k)} />; })}
        {(() => { const k = sp(f, A[3] + 30, 0.9, 9); return <g transform={`translate(${C[0]},${C[1]}) scale(${k})`}><circle r={110} fill="rgba(12,8,6,.9)" stroke={INK} strokeWidth={6} /><text y={-6} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={INK}>TSAVO</text><text y={42} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={36} fill={RED}>1898</text></g>; })()}
      </SV>
      {S.map(([x, y], i) => <Tag key={i} a={A[i] + 4} t={lab[i]} x={x < 960 ? 400 : 1520} y={y < 560 ? y - 50 : y + 30} size={44} color={col[i]} w={760} />)}
    </Scene>
  );
};

// 29 · LA VITRINA: los dos leones de Tsavo en su vidrio de Chicago, un visitante al lado para la escala
export const GlassCase: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), sm = at(p, "small", 90), k = ez(f, 6, 30), glare = (f * 6) % 2400 - 400;
  return (
    <Scene d={d} bg={p.bg} tint="#0a0c10" floor="150,180,210">
      <SV>
        <rect x={360} y={300} width={1100} height={560} fill="rgba(156,196,224,.08)" stroke="#9cc4e0" strokeWidth={8} opacity={k} />
        <rect x={340} y={860} width={1140} height={60} fill="#2a2420" />
        <path d="M420,860 C600,780 900,800 1100,820 L1400,860 Z" fill="#7a5a3a" opacity={0.6} />
        <Lion x={760} y={850} s={0.62} step={0.4} />
        <Lion x={1170} y={858} s={0.56} flip low={0.6} />
        <path d={`M${glare},300 L${glare + 140},300 L${glare - 140},860 L${glare - 280},860 Z`} fill="rgba(255,255,255,.07)" />
        {f > sm && <Fig x={1620} y={920} s={2.1} c="#3a4048" />}
        {f > sm && <path d="M1700,700 L1700,920" stroke={GOLD} strokeWidth={0} />}
      </SV>
      <Tag a={8} t="FIELD MUSEUM · CHICAGO" x={910} y={170} size={58} w={1300} />
      {f > sm && <Tag a={sm + 6} t="SMALLER THAN YOU'D EXPECT" x={910} y={960} size={52} color={GOLD} w={1300} />}
    </Scene>
  );
};

export const _unused = { LION, LRIM, CANVAS, THORN, Tent, Flame };
