// dur5nd — componentes únicos de las paradas 9-5 (Doggerland, Chauvet, África, pampa, llanuras) + lo que perdió + el trato.
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { F, INK, RED, ORA, GOLD, SAND, Scene, Tag, Motes, ez, lin, sp, rnd, at, cl } from "./ukit";
import { SV, Tu } from "./pkit";
import { Perro, Lobo } from "./dkit";
import { Land, Thermo, T, lp, UP } from "./dhelp";

// 17 · EL PAÍS QUE SE HUNDIÓ: mapa del mar del Norte; la tierra de Doggerland se va bajo el agua y queda una red con un hueso
export const PaisHundido: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 40, 150), net = ez(f, 160, 200);
  return (
    <Scene d={d} tint="#08121a" floor="140,200,255">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#16384f" />
        <path d="M200,80 L520,120 L560,420 L470,700 L540,980 L240,1060 L120,700 Z" fill="#5f7a4a" />
        <path d="M1300,320 L1600,260 L1820,380 L1760,820 L1420,880 L1320,640 Z" fill="#5f7a4a" />
        <path d="M1380,120 L1560,60 L1640,250 L1440,290 Z" fill="#5f7a4a" />
        <path d="M520,420 Q900,300 1320,520 L1360,720 Q900,820 480,700 Z" fill="#7b8f52" opacity={1 - k} />
        <path d="M520,420 Q900,300 1320,520 L1360,720 Q900,820 480,700 Z" fill="#2b5a7a" opacity={k * 0.9} />
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${560 + i * 80},${500 + (i % 3) * 60} q20,-10 40,0 t40,0`} stroke="#cfe8ff" strokeWidth={3} fill="none" opacity={k * 0.6} transform={`translate(${Math.sin(f / 20 + i) * 8},0)`} />)}
        <text x={180} y={300} fontFamily={F} fontWeight={800} fontSize={36} fill={INK}>INGLATERRA</text>
        <text x={1360} y={560} fontFamily={F} fontWeight={800} fontSize={36} fill={INK}>HOLANDA</text>
        <text x={1400} y={200} fontFamily={F} fontWeight={800} fontSize={30} fill={INK}>DINAMARCA</text>
        <g opacity={net} transform={`translate(900,${lp(720, 600, net)})`}><path d="M-120,-60 L120,-60 L80,80 L-80,80 Z" fill="none" stroke={SAND} strokeWidth={4} /><path d="M-100,-30 L100,-30 M-90,10 L90,10 M-80,50 L80,50 M-60,-60 L-40,80 M0,-60 L0,80 M60,-60 L40,80" stroke={SAND} strokeWidth={2} /><path d="M-50,20 q-14,-14 0,-20 q10,8 20,4 l60,0 q10,4 20,-4 q14,6 0,20 q-14,8 -20,0 l-60,0 q-10,8 -20,0" fill="#efe6d2" /></g>
      </SV>
      <Tag a={20} t="DOGGERLAND" x={920} y={460} size={76} color={GOLD} w={700} />
      <Tag a={150} t="HOY: MAR DEL NORTE" x={920} y={880} size={60} color="#9fd8ff" w={900} />
    </Scene>
  );
};

// 18 · EL CORTE TIENE RAZÓN: caniche con flechas — bolitas en articulaciones y pecho = calor; lo demás rapado = nada ligero
export const CortePoodle: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const L: [number, number, string, number][] = [[620, 470, "PECHO", 30], [500, 760, "ARTICULACIONES", 60], [1060, 560, "CADERAS", 90]];
  return (
    <Scene d={d} bg={p.bg} tint="#0c0f12" floor="160,210,255">
      <SV>
        <rect x={0} y={760} width={1920} height={320} fill="#2a4a5a" opacity={0.7} />
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${i * 200 + ((f * 2) % 200)},800 q50,-14 100,0 t100,0`} stroke="#9fd8ff" strokeWidth={4} fill="none" opacity={0.5} />)}
        <Perro x={820} y={780} s={3.2} b="caniche" />
        {L.map(([x, y, t, a], i) => { const k = ez(f, a, a + 16); return <g key={i} opacity={k}><circle cx={x} cy={y} r={38 + Math.sin(f / 6) * 4} fill="none" stroke={GOLD} strokeWidth={6} /><line x1={x + 38} y1={y - 10} x2={x + 380} y2={y - 140 + i * 40} stroke={GOLD} strokeWidth={4} /><text x={x + 390} y={y - 130 + i * 40} fontFamily={F} fontWeight={900} fontSize={44} fill={GOLD}>{t}</text></g>; })}
      </SV>
      <Tag a={120} t="PERRO DE AGUA" x={960} y={110} size={84} color="#9fd8ff" />
      <Tag a={140} t="«PUDELN» = CHAPOTEAR" x={960} y={210} size={50} color={INK} />
    </Scene>
  );
};

// 19 · NUDOS QUE PESAN: día 1 → 3; el pelo se apelmaza y una aguja de peso sube; de noche brillan ojos en el pantano
export const NudosPeso: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 10, d - 40), day = 1 + Math.min(2, Math.floor(k * 3)), night = ez(f, d - 90, d - 50);
  return (
    <Scene d={d} tint="#0a0d0c" floor="140,200,160">
      <SV>
        <Land top={night > 0.5 ? "#0b1420" : "#6f8a8a"} mid={night > 0.5 ? "#1a2a30" : "#9fb3a8"} ground="#2a3a2a" gy={760} />
        <rect x={0} y={0} width={1920} height={1080} fill="#050810" opacity={night * 0.6} />
        <Perro x={760} y={860} s={3} b="caniche" shiver={k} head={-6 * k} />
        {Array.from({ length: Math.floor(k * 14) }).map((_, i) => <circle key={i} cx={620 + rnd(i, 3) * 280} cy={640 + rnd(i, 4) * 140} r={14 + rnd(i) * 10} fill="#141414" stroke="#2a2a2a" strokeWidth={3} />)}
        {Array.from({ length: Math.floor(k * 10) }).map((_, i) => <circle key={i} cx={640 + rnd(i, 6) * 260} cy={760 + ((f * 2 + i * 30) % 90)} r={4} fill="#9fd8ff" opacity={0.7} />)}
        {[0, 1, 2].map((i) => <g key={i} opacity={night}><circle cx={1500 + i * 120} cy={680 - (i % 2) * 30} r={6} fill="#ffdc78" /><circle cx={1522 + i * 120} cy={680 - (i % 2) * 30} r={6} fill="#ffdc78" /></g>)}
        <Thermo x={1260} y={820} h={380} k={k} col={ORA} label={`+${Math.round(k * 4)} KG`} />
      </SV>
      <Tag a={6} t={`DÍA ${day}`} x={300} y={110} size={92} color={INK} w={400} />
    </Scene>
  );
};

// 20 · LA ANTORCHA QUE PINTA: pared de la cueva; con la luz de la antorcha aparecen los trazos de león, rinoceronte y caballo
export const AntorchaPinta: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const tx = lin(f, 0, d, 300, 1600), fl = 0.85 + Math.sin(f / 2.3) * 0.08 + Math.sin(f / 5.1) * 0.06;
  const A: [string, number][] = [["M260,520 q60,-80 180,-60 q60,10 90,40 l30,-10 l10,30 l-30,20 q10,50 -20,80 m-200,-10 l-10,90 m60,-90 l0,90 m120,-90 l10,90", 400], ["M760,560 q30,-90 160,-80 q80,10 120,60 l40,-50 l10,40 l-20,40 q-20,50 -80,60 l-180,0 q-60,-10 -50,-70 m40,70 l-10,80 m160,-80 l10,80", 900], ["M1260,500 q40,-60 140,-50 l40,-40 l20,20 l-10,40 q20,40 0,90 l-160,10 q-40,-10 -30,-70 m10,70 l-20,90 m140,-90 l10,90", 1400]];
  return (
    <Scene d={d} tint="#0b0604" floor="255,150,70" drift={0.6}>
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#4a3424" />
        {Array.from({ length: 40 }).map((_, i) => <ellipse key={i} cx={rnd(i, 1) * 1920} cy={rnd(i, 2) * 1080} rx={60 + rnd(i, 3) * 120} ry={20 + rnd(i, 4) * 50} fill={i % 2 ? "#5a4230" : "#3c2a1c"} opacity={0.6} />)}
        {A.map(([dd, x], i) => { const k = interpolate(Math.abs(tx - x), [0, 500], [1, 0.08], cl); return <path key={i} d={dd} stroke="#2a0c04" strokeWidth={13} fill="none" strokeLinecap="round" opacity={Math.max(0.35, k)} strokeDasharray={1400} strokeDashoffset={1400 * (1 - ez(f, 20 + i * 50, 80 + i * 50))} />; })}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#luz)" />
        <defs><radialGradient id="luz" cx={tx / 1920} cy={0.55} r={0.6}><stop offset="0" stopColor={`rgba(255,180,90,${0.28 * fl})`} /><stop offset="1" stopColor="rgba(0,0,0,.72)" /></radialGradient></defs>
        <g transform={`translate(${tx},880)`}><rect x={-10} y={-10} width={20} height={190} fill="#3a2414" /><ellipse cx={0} cy={-40} rx={26 * fl} ry={60 * fl} fill="#ffb648" /><ellipse cx={0} cy={-30} rx={12} ry={30} fill="#fff1c0" /></g>
      </SV>
      <Tag a={60} t="CHAUVET · 36.000 AÑOS" x={960} y={110} size={72} color={ORA} w={1100} />
    </Scene>
  );
};

// 21 · EL NIÑO Y EL CÁNIDO: dos hileras de huellas que caminan juntas por el barro de la cueva
export const HuellasNino: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  return (
    <Scene d={d} bg={p.bg} tint="#0e0905" floor="255,170,90">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#5a4330" opacity={0.85} />
        {Array.from({ length: 9 }).map((_, i) => { const k = ez(f, 10 + i * 12, 22 + i * 12); const x = 200 + i * 190, y = 420 + (i % 2) * 70;
          return <g key={i} opacity={k}><path d={`M${x - 50},${y} q0,-26 30,-28 q50,-6 64,10 q8,14 -8,22 q-30,14 -60,18 q-26,2 -26,-22 Z`} fill="#2a1d12" />{[0, 1, 2, 3, 4].map((t) => <circle key={t} cx={x + 54 + Math.sin(t * 0.7) * 8} cy={y - 26 + t * 11} r={6 - t * 0.6} fill="#2a1d12" />)}</g>; })}
        {Array.from({ length: 12 }).map((_, i) => { const k = ez(f, 40 + i * 9, 50 + i * 9); const x = 180 + i * 140, y = 720 + (i % 2) * 40;
          return <g key={i} opacity={k}><ellipse cx={x} cy={y} rx={22} ry={18} fill="#2a1d12" />{[-18, -6, 6, 18].map((t, j) => <ellipse key={j} cx={x + 24} cy={y + t} rx={8} ry={6} fill="#2a1d12" />)}</g>; })}
      </SV>
      <Tag a={20} t="NIÑO" x={240} y={300} size={52} color={INK} w={300} />
      <Tag a={60} t="CÁNIDO GRANDE" x={360} y={840} size={52} color={SAND} w={500} />
      <Tag a={130} t="¿LOBO O PERRO? AÚN SE DISCUTE" x={1120} y={130} size={58} color={GOLD} w={1300} />
    </Scene>
  );
};

// 22 · EL OSO QUE COMÍA PLANTAS: oso de las cavernas dormido; el golden se acerca con una rama moviendo la cola; un ojo se abre
export const OsoVegetariano: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const gx = lin(f, 0, d - 50, 300, 900), eye = ez(f, d - 50, d - 40), br = Math.sin(f / 18) * 6;
  return (
    <Scene d={d} tint="#090605" floor="255,160,80">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#2a1d14" />
        <path d="M0,0 L1920,0 L1920,220 Q960,120 0,260 Z" fill="#140d08" />
        <rect x={0} y={820} width={1920} height={260} fill="#3a2a1c" />
        <g transform={`translate(1360,820)`}>
          <path d={`M-360,0 Q-380,${-200 - br} -120,${-250 - br} Q120,${-280 - br} 260,${-170 - br} Q340,-110 330,0 Z`} fill="#4a3020" />
          <ellipse cx={300} cy={-90} rx={90} ry={70} fill="#4a3020" /><circle cx={260} cy={-160} r={26} fill="#4a3020" />
          <path d="M320,-110 q16,6 30,0" stroke="#1a0f08" strokeWidth={5} fill="none" opacity={1 - eye} />
          <circle cx={335} cy={-108} r={8} fill="#ffdc78" opacity={eye} />
        </g>
        <Perro x={gx} y={830} s={2} b="golden" walk={1} wag={1.4} />
        <path d={`M${gx + 70},${720} l120,-30 m-40,10 l20,-30`} stroke="#6a4a2a" strokeWidth={8} strokeLinecap="round" />
        <g transform="translate(1520,300)" opacity={ez(f, 20, 40)}><path d="M0,0 q60,-60 120,0 q-60,60 -120,0" fill="#7fbf5a" /><line x1={0} y1={0} x2={120} y2={0} stroke="#3a6a2a" strokeWidth={4} /></g>
      </SV>
      <Tag a={30} t="400 KG · CASI SOLO PLANTAS" x={1260} y={160} size={56} color={INK} w={900} />
      <Tag a={d - 44} t="CASI" x={1300} y={460} size={110} color={RED} w={400} />
    </Scene>
  );
};

// 23 · LA HIENA DOBLE: hiena manchada de hoy al lado de la hiena gigante, con barras de peso 55 contra 110 kg
export const HienaDoble: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 40, 100);
  const hy = (x: number, s: number, c: string) => <g transform={`translate(${x},800) scale(${s})`}><path d="M-120,0 L-110,-90 Q-80,-150 40,-160 L90,-150 L130,-170 L160,-140 L170,-110 L140,-100 L120,-60 L110,0 L90,0 L80,-60 L-60,-80 L-80,0 Z" fill={c} />{Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={-70 + (i % 4) * 36} cy={-110 + Math.floor(i / 4) * 30} r={9} fill="rgba(0,0,0,.35)" />)}</g>;
  return (
    <Scene d={d} bg={p.bg} tint="#140d06" floor="255,190,100">
      <SV>
        <Land top="#e6c48a" mid="#d7a35e" ground="#9a7a3e" gy={800} />
        {hy(560, 1.1, "#7a6040")}
        {hy(1280, lp(1.1, 1.75, k), "#4a3420")}
        <rect x={420} y={880} width={240} height={30} fill={SAND} /><rect x={1080} y={880} width={lp(240, 480, k)} height={30} fill={RED} />
        <text x={540} y={970} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={INK} stroke="rgba(0,0,0,.8)" strokeWidth={8} style={{ paintOrder: "stroke" }}>HOY · 55 KG</text>
        <text x={1300} y={970} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={GOLD} stroke="rgba(0,0,0,.8)" strokeWidth={8} style={{ paintOrder: "stroke" }}>{`GIGANTE · +${Math.round(lp(55, 100, k))} KG`}</text>
      </SV>
      <Tag a={110} t="×2" x={1300} y={240} size={150} color={RED} w={400} />
    </Scene>
  );
};

// 24 · KILÓMETROS DE CARRUAJE: el dálmata trota al lado de una rueda que gira y un odómetro que no para
export const CarruajeKm: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const km = Math.floor(lin(f, 0, d, 0, 42));
  return (
    <Scene d={d} tint="#100c08" floor="255,200,130" drift={0.4}>
      <SV>
        <Land top="#cfb48a" mid="#e0c79a" ground="#8a6a44" gy={780} />
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={((i * 180 - f * 14) % 2520 + 2520) % 2520 - 300} x2={((i * 180 - f * 14) % 2520 + 2520) % 2520 - 220} y1={900} y2={900} stroke="#6a5034" strokeWidth={6} />)}
        <g transform={`translate(1220,760) rotate(${f * 9})`}><circle r={160} fill="none" stroke="#3a2614" strokeWidth={18} />{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * Math.PI / 6) * 160} y2={Math.sin(i * Math.PI / 6) * 160} stroke="#3a2614" strokeWidth={8} />)}<circle r={26} fill="#3a2614" /></g>
        <rect x={1020} y={440} width={560} height={180} rx={14} fill="#2a1a10" />
        <Perro x={640} y={880} s={2.3} b="dalmata" run />
      </SV>
      <div style={{ position: "absolute", left: 1140, top: 200, fontFamily: F, fontWeight: 900, fontSize: 110, color: INK, fontVariantNumeric: "tabular-nums", background: "rgba(0,0,0,.6)", padding: "4px 26px", borderRadius: 12 }}>{`${String(km).padStart(3, "0")} KM`}</div>
      <Tag a={50} t="PUEDE TROTAR TODO EL DÍA" x={560} y={150} size={58} color={GOLD} w={900} />
    </Scene>
  );
};

// 25 · LO QUE NO OYE: ondas que vienen de atrás y chocan con un oído tachado; 3 de cada 10 dálmatas
export const OidoSordo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  return (
    <Scene d={d} tint="#0b0906" floor="255,210,150">
      <SV>
        <Land top="#2a2a3a" mid="#5a4a3a" ground="#3a2e1e" gy={800} />
        {Array.from({ length: 7 }).map((_, i) => { const ph = ((f + i * 18) % 120) / 120; return <path key={i} d={`M${120 + ph * 600},${560 - 120} q60,120 0,240`} stroke="#ffdc78" strokeWidth={8} fill="none" opacity={(1 - ph) * 0.9} />; })}
        <Perro x={1080} y={880} s={2.4} b="dalmata" walk={0.5} />
        <g transform="translate(1180,540)" opacity={ez(f, 40, 56)}><circle r={70} fill="none" stroke={RED} strokeWidth={10} /><line x1={-50} y1={-50} x2={50} y2={50} stroke={RED} strokeWidth={10} /></g>
        {Array.from({ length: 10 }).map((_, i) => <g key={i} transform={`translate(${560 + i * 90},180)`} opacity={ez(f, 70 + i * 4, 80 + i * 4)}><circle r={30} fill={i < 3 ? RED : "rgba(240,235,229,.25)"} />{Array.from({ length: 4 }).map((_, j) => <circle key={j} cx={-10 + (j % 2) * 18} cy={-8 + Math.floor(j / 2) * 16} r={5} fill="#111" />)}</g>)}
      </SV>
      <Tag a={110} t="3 DE CADA 10 · SORDOS DE UN OÍDO O MÁS" x={1010} y={250} size={46} color={INK} w={1200} />
    </Scene>
  );
};

// 26 · LAS 5 COSAS QUE PERDIÓ: un lobo en silueta; de él se desprenden cinco piezas con su nombre, y queda un perro
export const CincoPerdidas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const L: [string, number][] = [["LA CARA", at(p, "uno", 40)], ["EL TAMAÑO", at(p, "dos", 120)], ["EL PELO", at(p, "tres", 200)], ["LOS SENTIDOS", at(p, "cuatro", 280)], ["EL MIEDO CORRECTO", at(p, "cinco", 360)]];
  return (
    <Scene d={d} tint="#0c0a09" floor="255,200,140">
      <SV>
        <Lobo x={560} y={800} s={4} c="#6a5e52" eyes={1} />
        {L.map(([t, a], i) => { const k = ez(f, a, a + 30); const y = 220 + i * 140;
          return <g key={i} opacity={ez(f, a, a + 8)}>
            <circle cx={lp(780, 1060, k)} cy={lp(520, y, k)} r={16} fill={i === 4 ? RED : GOLD} />
            <text x={1100} y={y + 16} fontFamily={F} fontWeight={900} fontSize={52} fill={INK}>{`${i + 1}. ${t}`}</text>
            <line x1={1090} x2={1090 + 560 * ez(f, a + 30, a + 60)} y1={y + 2} y2={y + 2} stroke={RED} strokeWidth={6} />
          </g>; })}
      </SV>
      <Tag a={6} t="MISMO ADN · OTRA VIDA" x={620} y={120} size={60} color={SAND} w={900} />
    </Scene>
  );
};

// 27 · GIGANTES DE LA PAMPA: el megaterio parado (6 m), un gliptodonte como un auto y tú, a escala
export const GigantesPampa: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 10, 70), g = ez(f, 60, 110);
  return (
    <Scene d={d} bg={p.bg} tint="#0e0c08" floor="255,210,140">
      <SV>
        <Land top="#a7b6c4" mid="#d8cfae" ground="#8d8a54" gy={880} />
        <g transform={`translate(560,880) scale(1,${k})`}><path d="M-120,0 L-90,-180 Q-150,-300 -120,-460 Q-80,-600 0,-640 Q60,-660 80,-600 Q90,-540 60,-520 Q120,-440 110,-300 Q100,-180 70,-120 L90,0 L40,0 L20,-120 L-40,-120 L-60,0 Z" fill="#4a3a28" /><path d="M60,-500 L180,-560 L200,-540 L190,-520" stroke="#4a3a28" strokeWidth={22} strokeLinecap="round" fill="none" /></g>
        <g transform={`translate(1260,880)`} opacity={g}><path d="M-200,0 Q-210,-200 0,-220 Q210,-200 200,0 Z" fill="#6a5a3a" />{Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={-160 + (i % 8) * 46} cy={-40 - Math.floor(i / 8) * 54} r={18} fill="none" stroke="#3a2e1a" strokeWidth={4} />)}<ellipse cx={230} cy={-40} rx={46} ry={34} fill="#6a5a3a" /></g>
        <line x1={300} x2={300} y1={880} y2={880 - 640 * k} stroke={GOLD} strokeWidth={6} />
        <text x={280} y={880 - 640 * k - 20} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={54} fill={GOLD}>6 M</text>
      </SV>
      <Tu x={820} y={880} s={0.95} />
      <Tag a={80} t="GLIPTODONTE · TAMAÑO DE UN AUTO" x={1320} y={500} size={44} color={INK} w={700} />
    </Scene>
  );
};

// 28 · VELOCIDADES: tres barras — el galgo pasa los 60 km/h, la mara corre como liebre, el dientes de sable no corre: espera
export const VelocidadMara: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R: [string, number, string, number][] = [["GALGO", 0.95, "+60 KM/H", 10], ["MARA", 0.72, "COMO LIEBRE", 40], ["DIENTES DE SABLE", 0.15, "EMBOSCADA", 70]];
  return (
    <Scene d={d} tint="#0d0b08" floor="255,210,150">
      <SV>
        {R.map(([n, v, t, a], i) => { const k = ez(f, a, a + 40); const y = 300 + i * 220;
          return <g key={n}>
            <text x={200} y={y - 20} fontFamily={F} fontWeight={900} fontSize={50} fill={INK} opacity={ez(f, a - 6, a + 6)}>{n}</text>
            <rect x={200} y={y} width={1500} height={70} rx={35} fill="rgba(240,235,229,.1)" />
            <rect x={200} y={y} width={1500 * v * k} height={70} rx={35} fill={i === 2 ? RED : i === 0 ? GOLD : SAND} />
            <text x={220 + 1500 * v * k} y={y + 52} fontFamily={F} fontWeight={900} fontSize={44} fill={INK} opacity={k}>{t}</text>
          </g>; })}
        <g transform={`translate(${200 + 1500 * 0.95 * ez(f, 10, 50) - 60},300)`}><Perro x={0} y={0} s={1} b="galgo" run /></g>
      </SV>
      <Tag a={120} t="SI LO VE PRIMERO, NO LO ALCANZA" x={960} y={920} size={60} color={GOLD} w={1400} />
    </Scene>
  );
};

// 29 · LO QUE GANA DE DÍA, LO GASTA DE NOCHE: barra de energía que sube con el sol y baja con la luna; galgo hecho bolita
export const NocheFrio: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const c = (f % 150) / 150, day = c < 0.5, e = day ? 0.3 + c * 1.2 : 0.9 - (c - 0.5) * 1.2;
  const ang = c * Math.PI * 2;
  return (
    <Scene d={d} tint="#07090d" floor="190,210,255">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill={day ? "#8fa6b8" : "#0c1424"} />
        <circle cx={200 + ((c * 2) % 1) * 1520} cy={760 - Math.sin(((c * 2) % 1) * Math.PI) * 560} r={70} fill={day ? "#ffe08a" : "#e6ecf5"} />
        <rect x={0} y={760} width={1920} height={320} fill={day ? "#8d8a54" : "#1a1c18"} />
        <Perro x={760} y={860} s={2.4} b="galgo" lie={!day} curl={!day} shiver={day ? 0 : 1} run={day} />
        <rect x={1560} y={300} width={80} height={420} rx={14} fill="rgba(255,255,255,.12)" stroke={INK} strokeWidth={4} />
        <rect x={1572} y={312 + 396 * (1 - e)} width={56} height={396 * e} rx={8} fill={day ? GOLD : "#9fd8ff"} />
        <text x={1600} y={780} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={36} fill={INK}>ENERGÍA</text>
      </SV>
      <Tag a={10} t={day ? "DE DÍA: CAZA" : "DE NOCHE: TIEMBLA"} x={760} y={150} size={74} color={day ? GOLD : "#9fd8ff"} w={1000} />
    </Scene>
  );
};

// 30 · CAMELLOS EN AMÉRICA: mapa de Norteamérica con bisontes, caballos y... un camello que aparece con su signo
export const CamellosAmerica: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const c = sp(f, 70, 1, 8);
  return (
    <Scene d={d} bg={p.bg} tint="#0c0a08" floor="255,210,150">
      <SV>
        <path d="M300,120 L900,80 L1300,160 L1500,380 L1300,560 L1160,720 L1000,900 L860,860 L700,700 L520,640 L420,480 L300,340 Z" fill="#a89a6a" opacity={0.9} />
        <path d="M300,120 L900,80 L1300,160 L1500,380 L1300,560 L1160,720 L1000,900 L860,860 L700,700 L520,640 L420,480 L300,340 Z" fill="none" stroke={INK} strokeWidth={4} />
        <g transform={`translate(880,520) scale(${c})`}><path d="M-120,0 L-110,-90 Q-100,-160 -40,-150 Q0,-210 40,-150 Q80,-120 90,-90 L140,-170 L170,-160 L160,-120 L110,-50 L100,0 L80,0 L70,-60 L-80,-60 L-90,0 Z" fill="#6a4a28" /></g>
        {[[560, 360], [760, 300], [1100, 400]].map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`} opacity={ez(f, 10 + i * 10, 24 + i * 10)}><path d="M-60,0 Q-70,-70 0,-70 L50,-60 L70,-30 L60,0 Z" fill="#3a2a1a" /><path d="M50,-60 q20,-20 40,-10" stroke="#e8dcc4" strokeWidth={5} fill="none" /></g>)}
      </SV>
      <Tag a={84} t="¿CAMELLOS? SÍ." x={960} y={140} size={96} color={GOLD} />
    </Scene>
  );
};

// 31 · UN CUARTO MÁS GRANDE: león africano y león americano superpuestos; el americano crece +25 %
export const LeonCuarto: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 40, 100);
  const leon = (s: number, c: string, o: number) => <g transform={`translate(860,860) scale(${s})`} opacity={o}><path d="M-220,0 L-200,-150 Q-160,-230 40,-230 L120,-260 Q200,-280 230,-220 L250,-170 L220,-140 L190,-140 L170,-100 L150,0 L120,0 L110,-90 L-120,-110 L-150,0 Z M-210,-150 Q-290,-160 -320,-90" fill={c} stroke={c} strokeWidth={10} /></g>;
  return (
    <Scene d={d} tint="#0e0a06" floor="255,190,110">
      <SV>
        <Land top="#d9b07a" mid="#e6c48c" ground="#8e7444" gy={860} />
        <g transform={`translate(${lp(0, 260, k)},0)`}>{leon(lp(1, 1.25, k), "#4a2e18", 0.95)}</g>
        {leon(1, "#c89a5a", 0.85)}
      </SV>
      <Tag a={6} t="LEÓN AFRICANO" x={760} y={520} size={46} color={INK} w={600} />
      <Tag a={100} t="LEÓN AMERICANO · +25 %" x={1100} y={160} size={70} color={RED} w={1100} />
    </Scene>
  );
};

// 32 · TERRITORIO: el círculo de la manada; el pastor alemán adentro; cada prueba deja la barra de fuerza más corta
export const TerritorioManada: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const t1 = at(p, "una", 70), t2 = at(p, "dos", 130);
  const e = 1 - 0.3 * ez(f, t1, t1 + 10) - 0.3 * ez(f, t2, t2 + 10);
  return (
    <Scene d={d} tint="#0b0a07" floor="255,200,140">
      <SV>
        <Land top="#6a7a8a" mid="#b7a77a" ground="#6e6a3e" gy={600} />
        <ellipse cx={960} cy={800} rx={760} ry={220} fill="rgba(241,69,54,.12)" stroke={RED} strokeWidth={6} strokeDasharray="22 14" opacity={ez(f, 4, 24)} />
        {[0, 1, 2, 3, 4].map((i) => { const a = i / 5 * Math.PI * 2 + f / 120; return <Lobo key={i} x={960 + Math.cos(a) * 640} y={800 + Math.sin(a) * 170} s={1.1} flip={Math.sin(a) > 0} walk={1} eyes={0.8} />; })}
        <Perro x={960} y={830} s={2} b="pastor" head={-4} />
        <rect x={760} y={960} width={400} height={30} rx={15} fill="rgba(255,255,255,.15)" />
        <rect x={760} y={960} width={400 * e} height={30} rx={15} fill={e > 0.6 ? GOLD : RED} />
      </SV>
      <Tag a={t1} t="PRUEBA 1" x={500} y={160} size={60} color={INK} w={500} />
      <Tag a={t2} t="PRUEBA 2" x={1420} y={160} size={60} color={RED} w={500} />
    </Scene>
  );
};

// 33 · EL TRATO DEL FUEGO: campamento de noche; un lobo se acerca a la luz, recibe sobras y se queda de guardia
export const TratoFuego: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const wx = lin(f, 0, 140, 1900, 1240), fl = 0.9 + Math.sin(f / 2.1) * 0.07 + Math.sin(f / 4.7) * 0.05;
  const L: [string, number][] = [["SOBRAS", 80], ["CALOR", 120], ["PROTECCIÓN", 160], ["AVISA DE NOCHE", 210]];
  return (
    <Scene d={d} tint="#050302" floor="255,150,60">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#07060a" />
        <defs><radialGradient id="fg" cx={0.5} cy={0.75} r={0.55}><stop offset="0" stopColor={`rgba(255,150,60,${0.45 * fl})`} /><stop offset="1" stopColor="rgba(0,0,0,0)" /></radialGradient></defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#fg)" />
        <rect x={0} y={860} width={1920} height={220} fill="#1a120a" />
        <g transform="translate(960,860)"><path d="M-60,0 L60,-20 M-60,-20 L60,0" stroke="#3a2414" strokeWidth={16} /><path d={`M-50,-10 Q-40,${-120 * fl} 0,${-180 * fl} Q30,${-110 * fl} 50,-10 Z`} fill="#ff9a3a" /><path d={`M-20,-10 Q-10,${-70 * fl} 0,${-100 * fl} Q14,${-60 * fl} 20,-10 Z`} fill="#ffe0a0" /></g>
        <Lobo x={wx} y={880} s={1.6} flip walk={f < 140 ? 1 : 0} eyes={1} />
      </SV>
      <Tu x={660} y={880} s={1.5} />
      {L.map(([t, a], i) => <Tag key={t} a={a} t={t} x={i % 2 ? 1500 : 420} y={200 + i * 100} size={52} color={i === 3 ? GOLD : INK} w={600} />)}
      <Tag a={20} t="EL TRATO" x={960} y={80} size={84} color={ORA} w={800} />
      <Motes c="255,170,80" up />
    </Scene>
  );
};
