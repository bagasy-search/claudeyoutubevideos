// dur5nd — componentes únicos del gancho y las paradas 12-10 (La Brea, Australia, Yakutia). Todo dibujado por código.
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { F, INK, RED, ORA, GOLD, SAND, Scene, Tag, Motes, ez, lin, sp, rnd, at, cl } from "./ukit";
import { SV } from "./pkit";
import { Perro, Ave, Lobo, BR } from "./dkit";
import { Land, Thermo, T, MiniWatch, lp, UP } from "./dhelp";

// 1 · CHAPOTE QUE BRILLA: charco negro con reflejo de sol, burbujas lentas, el chihuahua temblando al borde
export const ChapoteBrilla: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const a = at(p, "huele", 60);
  return (
    <Scene d={d} bg={p.bg} tint="#1a120a" floor="255,190,110">
      <SV>
        <Land top="#f2c48a" mid="#e8a866" ground="#a27a4c" gy={600} haze={1} />
        <ellipse cx={1050} cy={800} rx={640} ry={150} fill="#0d0b0a" />
        <ellipse cx={1150 + Math.sin(f / 30) * 30} cy={770} rx={180} ry={22} fill="rgba(255,240,200,.55)" style={{ filter: "blur(8px)" }} />
        <ellipse cx={900} cy={760} rx={90} ry={8} fill="rgba(255,255,255,.25)" style={{ filter: "blur(4px)" }} />
        {Array.from({ length: 5 }).map((_, i) => { const ph = ((f + i * 37) % 110) / 110; return <circle key={i} cx={700 + i * 170} cy={830 - ph * 20} r={6 + ph * 18} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={3} opacity={1 - ph} />; })}
        {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={520 + rnd(i, 2) * 1080} cy={720 + rnd(i, 3) * 150} rx={12} ry={5} fill={["#7a5a2a", "#9a7a3a", "#5a6a2a"][i % 3]} transform={`rotate(${rnd(i) * 180} ${520 + rnd(i, 2) * 1080} ${720 + rnd(i, 3) * 150})`} />)}
        <Perro x={330} y={900} s={2.4} b="chihuahua" shiver={1} head={-6} />
      </SV>
      <Tag a={a} t="NO ES AGUA" x={1060} y={430} size={86} color={INK} />
      <Tag a={a + 26} t="ES ASFALTO" x={1060} y={530} size={86} color={ORA} />
      <Motes c="255,230,190" />
    </Scene>
  );
};

// 2 · ALAS MÁS LARGAS QUE TU SALA: plano de una sala a escala y el teratornis encima, 3,5 m contra 3 m
export const AlasSala: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 70), s2 = ez(f, 80, 120);
  return (
    <Scene d={d} tint="#1d3346" floor="200,230,255">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#244a66" />
        {Array.from({ length: 20 }).map((_, i) => <line key={i} x1={i * 100} x2={i * 100} y1={0} y2={1080} stroke="rgba(240,235,229,.06)" strokeWidth={2} />)}
        <g opacity={ez(f, 4, 20)}>
          <rect x={560} y={380} width={800} height={460} fill="none" stroke={INK} strokeWidth={8} />
          <rect x={620} y={720} width={360} height={90} rx={20} fill="rgba(240,235,229,.25)" />
          <rect x={1100} y={440} width={180} height={120} fill="rgba(240,235,229,.18)" />
          <circle cx={1240} cy={760} r={34} fill="rgba(240,235,229,.25)" />
          <text x={960} y={900} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={44} fill={INK}>TU SALA · 3 M</text>
        </g>
        <g transform={`translate(${lp(-300, 960, k)},${lp(240, 600, k)}) scale(${lp(1, 2.6, k)})`}><Ave x={0} y={0} s={1} c="#0b0806" /></g>
        <g opacity={s2}>
          <line x1={960 - 468} x2={960 + 468} y1={300} y2={300} stroke={GOLD} strokeWidth={6} />
          <line x1={960 - 468} x2={960 - 468} y1={280} y2={320} stroke={GOLD} strokeWidth={6} />
          <line x1={960 + 468} x2={960 + 468} y1={280} y2={320} stroke={GOLD} strokeWidth={6} />
        </g>
      </SV>
      <Tag a={84} t="ALAS · 3,5 M" x={960} y={190} size={84} color={GOLD} />
    </Scene>
  );
};

// 3 · RAZAS JÓVENES: 15.000 años de perro en una línea; casi todas las razas se amontonan en los últimos 200
export const RazasJovenes: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const X = (y: number) => 200 + (1 - y / 15000) * 1520;
  const zoom = ez(f, 120, 170);
  return (
    <Scene d={d} tint="#0e0c0a" floor="255,200,120">
      <SV>
        <line x1={200} x2={1720} y1={640} y2={640} stroke={INK} strokeWidth={6} opacity={ez(f, 0, 14)} />
        {[15000, 10000, 5000, 0].map((y) => <g key={y} opacity={ez(f, 8, 24)}><line x1={X(y)} x2={X(y)} y1={620} y2={660} stroke={INK} strokeWidth={5} /><text x={X(y)} y={712} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill={INK}>{y === 0 ? "HOY" : `${y / 1000}.000`}</text></g>)}
        <g transform={`translate(${X(14000)},620)`} opacity={ez(f, 20, 40)}><Perro x={0} y={0} s={1.3} b="sinraza" /></g>
        <text x={X(14000)} y={500} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={36} fill={SAND} opacity={ez(f, 26, 40)}>PRIMEROS PERROS</text>
        {Array.from({ length: 34 }).map((_, i) => { const y = rnd(i, 4) * (i < 30 ? 200 : 2500); const k = sp(f, 50 + i * 2); const col = Math.floor(i / 6);
          return <circle key={i} cx={X(y) - (i % 6) * 26 * zoom} cy={640 - 34 - col * 36} r={15} fill={i < 30 ? RED : ORA} opacity={k} transform={`translate(0,${(1 - k) * -80})`} />; })}
        <rect x={X(200) - 6} y={380} width={X(0) - X(200) + 30} height={300} fill="rgba(241,69,54,.12)" stroke={RED} strokeWidth={4} strokeDasharray="14 10" opacity={zoom} />
      </SV>
      <Tag a={130} t="LA MAYORÍA: MENOS DE 200 AÑOS" x={1100} y={250} size={66} color={RED} w={1300} />
    </Scene>
  );
};

// 4 · LA REGLA: tres viñetas — se mete en problemas, lo cargas, el reloj se congela con escarcha
export const ReglaCargar: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k1 = ez(f, 10, 30), k2 = ez(f, 50, 70), k3 = ez(f, 90, 110);
  const lift = ez(f, 60, 90);
  return (
    <Scene d={d} tint="#0d0b09" floor="200,230,255">
      <SV>
        {[0, 1, 2].map((i) => <rect key={i} x={140 + i * 560} y={240} width={520} height={560} rx={26} fill="rgba(240,235,229,.06)" stroke="rgba(240,235,229,.35)" strokeWidth={4} opacity={[k1, k2, k3][i]} />)}
        <g opacity={k1}><Perro x={400} y={700} s={1.7} b="golden" shiver={1} head={-10} /><path d="M270,420 l30,-60 l30,60 Z" fill={GOLD} /><text x={300} y={410} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#000">!</text></g>
        <g opacity={k2}>
          <g transform={`translate(0,${-lift * 120})`}><Perro x={960} y={700} s={1.5} b="golden" wag={1} /></g>
          <path d={`M860,${720 - lift * 120} q100,50 200,0`} stroke={SAND} strokeWidth={30} strokeLinecap="round" fill="none" />
        </g>
        <g opacity={k3}><MiniWatch x={1520} y={520} s={1.5} sec={47} frozen={f > 105} /></g>
      </SV>
      <Tag a={14} t="SE METE EN PROBLEMAS" x={400} y={820} size={40} w={500} />
      <Tag a={54} t="LO CARGAS" x={960} y={820} size={40} w={500} color={GOLD} />
      <Tag a={94} t="EL CRONÓMETRO SE CONGELA" x={1520} y={820} size={40} w={500} color="#9fd8ff" />
      <Tag a={4} t="LA ÚNICA REGLA" x={960} y={110} size={78} color={INK} />
    </Scene>
  );
};

// 5 · EL QUE NO MIRAS: desfilan once razas iluminadas y al final queda una silueta en sombra con un signo
export const SinRazaSombra: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const L = ["chihuahua", "bulldog", "teckel", "caniche", "golden", "dalmata", "galgo", "pastor", "husky", "kangal", "mastin"];
  const cam = lin(f, 0, d * 0.7, 0, -1640);
  return (
    <Scene d={d} tint="#0c0a09" floor="255,200,140" drift={0.4}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${cam}px)` }}>
        <SV>
          <rect x={-200} y={820} width={4000} height={300} fill="#1b1612" />
          {L.map((b, i) => <Perro key={b} x={200 + i * 260} y={820} s={1.3} b={b} walk={1} wag={0.5} />)}
          <g opacity={ez(f, 60, 90)} style={{ filter: "brightness(0.12)" }}><Perro x={200 + 11 * 260 + 80} y={820} s={1.6} b="sinraza" op={1} /></g>
          <text x={200 + 11 * 260 + 80} y={640} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={160} fill={GOLD} opacity={ez(f, 70, 90)}>?</text>
        </SV>
      </div>
      <Tag a={80} t="LA HAS VISTO HOY MISMO" x={960} y={140} size={70} color={GOLD} w={1200} />
    </Scene>
  );
};

// 6 · LA TRAMPA EN CADENA: corte del suelo; un ciervo se pega, llega un lobo terrible, se pega; contador de fósiles
export const TrampaAsfalto: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const s1 = ez(f, 20, 80), s2 = ez(f, 100, 160);
  const n1 = Math.round(interpolate(f, [150, d - 30], [0, 4000], cl)), n2 = Math.round(interpolate(f, [170, d - 20], [0, 2000], cl));
  return (
    <Scene d={d} tint="#100c08" floor="255,170,90">
      <SV>
        <Land top="#e9b77c" mid="#d79358" ground="#3a2a1a" gy={620} />
        <rect x={-100} y={620} width={2120} height={460} fill="#0b0908" />
        {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={rnd(i, 9) * 1920} cy={626} rx={22} ry={6} fill={["#8a6a3a", "#6a7a3a"][i % 2]} />)}
        <g transform={`translate(600,${620 + s1 * 70})`}><ellipse cx={0} cy={-120} rx={150} ry={80} fill="#4a3020" /><ellipse cx={-70} cy={-160} rx={90} ry={70} fill="#4a3020" /><ellipse cx={-170} cy={-110} rx={50} ry={46} fill="#3a2414" /><path d="M-200,-150 q-20,-30 6,-40 M-150,-150 q20,-30 -6,-40" stroke="#e8dcc4" strokeWidth={8} fill="none" />{[-110, -60, 60, 110].map((x) => <rect key={x} x={x - 14} y={-70} width={28} height={80} fill="#3a2414" />)}</g>
        <Lobo x={lp(2100, 1260, ez(f, 60, 110))} y={620 + s2 * 70} s={2} walk={1 - s2} flip />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${120 + i * 130},${760 + rnd(i) * 220} l40,-10 l10,30 l-30,14 Z`} fill="rgba(230,220,200,.35)" opacity={ez(f, 140 + i * 4, 160 + i * 4)} />)}
      </SV>
      <Tag a={150} t={`${n1.toLocaleString("es")} LOBOS TERRIBLES`} x={960} y={130} size={68} color={INK} w={1300} />
      <Tag a={170} t={`${n2.toLocaleString("es")} DIENTES DE SABLE`} x={960} y={220} size={68} color={ORA} w={1300} />
    </Scene>
  );
};

// 7 · DEL TAMAÑO DE UN CONEJO: balanza con el chihuahua y un conejo, la sombra del pájaro pasa por encima
export const ConejoTamano: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 60), sh = lin(f, 60, d, -500, 2400);
  return (
    <Scene d={d} tint="#15100b" floor="255,200,120">
      <SV>
        <Land top="#e8c08e" mid="#d9a46a" ground="#8f6a42" gy={760} />
        <line x1={560} x2={1360} y1={600} y2={600} stroke={INK} strokeWidth={10} />
        <path d="M960,600 L900,760 L1020,760 Z" fill={INK} />
        <Perro x={720} y={590} s={2.4} b="chihuahua" shiver={1} op={k} />
        <g opacity={k} transform="translate(1200,590) scale(1.5)"><ellipse cx={0} cy={-40} rx={70} ry={42} fill="#b59a7a" /><ellipse cx={58} cy={-74} rx={30} ry={26} fill="#b59a7a" /><ellipse cx={58} cy={-130} rx={10} ry={40} fill="#b59a7a" /><ellipse cx={74} cy={-126} rx={10} ry={38} fill="#a58a6a" /><circle cx={-70} cy={-48} r={16} fill="#efe6da" /></g>
        <text x={960} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={GOLD} opacity={ez(f, 50, 66)}>=</text>
        <ellipse cx={sh} cy={700} rx={420} ry={60} fill="rgba(0,0,0,.45)" style={{ filter: "blur(10px)" }} />
      </SV>
      <Tag a={60} t="2 KILOS · TAMAÑO DE PRESA" x={960} y={120} size={70} color={INK} w={1300} />
    </Scene>
  );
};

// 8 · EL LADRIDO QUE NADIE ENTIENDE: ondas que salen del chihuahua y se deshacen antes de llegar a la sombra; la pata toca el asfalto
export const LadridoInutil: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const pas = ez(f, d - 60, d - 30);
  return (
    <Scene d={d} tint="#120d09" floor="255,190,110">
      <SV>
        <Land top="#d8a56c" mid="#c88a50" ground="#7f5c38" gy={760} />
        <ellipse cx={1500} cy={900} rx={700} ry={130} fill="#0b0908" />
        <ellipse cx={lin(f, 0, d, 1900, 200)} cy={820} rx={420} ry={60} fill="rgba(0,0,0,.6)" style={{ filter: "blur(8px)" }} />
        {Array.from({ length: 6 }).map((_, i) => { const ph = ((f + i * 14) % 60) / 60; return <path key={i} d={`M${560 + ph * 400},${560 - ph * 150} q40,${60 + ph * 40} 0,${140 + ph * 80}`} stroke={GOLD} strokeWidth={8 * (1 - ph)} fill="none" opacity={1 - ph} transform={`rotate(-20 560 600)`} />; })}
        <g transform={`translate(${-pas * 80},0)`}><Perro x={460} y={800} s={2.1} b="chihuahua" pant={1} head={-14} shiver={0.6} /></g>
        <text x={900} y={420} fontFamily={F} fontWeight={900} fontSize={90} fill={GOLD} opacity={1 - ez(f, 70, 110)} transform={`rotate(-8 900 420)`}>¡GUAU!</text>
      </SV>
      <Tag a={90} t="AQUÍ NO ES UNA AMENAZA" x={1240} y={260} size={62} color={INK} w={900} />
    </Scene>
  );
};

// 9 · 40 GRADOS: tierra roja que vibra, eucaliptos, termómetro que sube, el bulldog echado bajo la única sombra
export const TermometroCalor: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 10, 90);
  return (
    <Scene d={d} bg={p.bg} tint="#1c0d06" floor="255,120,60">
      <SV>
        <Land top="#f5d29a" mid="#e9965a" ground="#a8482a" gy={720} haze={2} />
        {[260, 640, 1540].map((x, i) => <g key={x}><path d={`M${x},720 q-10,-180 ${10 + i * 6},-340`} stroke="#d9cbb4" strokeWidth={22} fill="none" /><ellipse cx={x + 10} cy={360} rx={150} ry={70} fill="#5f7a4a" opacity={0.85} /></g>)}
        <ellipse cx={680} cy={740} rx={210} ry={30} fill="rgba(0,0,0,.4)" />
        <Perro x={680} y={740} s={2.2} b="bulldog" lie pant={1} />
        <Thermo x={1340} y={760} h={480} k={k} col={RED} label={`${Math.round(lp(22, 40, k))}°`} />
      </SV>
      <Motes c="255,180,120" up />
    </Scene>
  );
};

// 10 · EL TUBO APRETADO: dos vías de aire en corte, la del lobo ancha y la del bulldog estrecha; el aire pasa lento
export const TuboJadeo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 90, 130);
  const tubo = (y: number, h: number, sp2: number, col: string) => (
    <g>
      <rect x={300} y={y - h / 2} width={1320} height={h} rx={h / 2} fill="rgba(255,255,255,.07)" stroke={col} strokeWidth={6} />
      {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={300 + (((f * sp2 + i * 85) % 1320))} cy={y + Math.sin(i * 1.7) * h * 0.25} r={8} fill="#cdeeff" opacity={0.8} />)}
    </g>
  );
  return (
    <Scene d={d} tint="#0c0b0b" floor="200,220,255">
      <SV>
        <text x={300} y={290} fontFamily={F} fontWeight={800} fontSize={44} fill={INK} opacity={ez(f, 4, 20)}>LOBO</text>
        {tubo(380, 150, 9, "#7fe0c3")}
        <text x={300} y={600} fontFamily={F} fontWeight={800} fontSize={44} fill={INK} opacity={ez(f, 30, 46)}>BULLDOG</text>
        <g opacity={ez(f, 30, 46)}>{tubo(680, 46, 2.4, RED)}</g>
      </SV>
      <Tag a={100} t="×14 RIESGO DE GOLPE DE CALOR" x={960} y={830} size={72} color={RED} w={1500} />
      <Tag a={110} t="(Real Colegio Veterinario, Londres)" x={960} y={930} size={34} color={SAND} w={1200} />
    </Scene>
  );
};

// 11 · EL LEÓN QUE TREPABA: rama de eucalipto con el tilacoleo echado; medidor de mordida que se dispara
export const TilacoleoRama: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 50, 110), eye = ez(f, 30, 40);
  return (
    <Scene d={d} bg={p.bg} tint="#140a06" floor="255,140,80">
      <SV>
        <Land top="#e4a36c" mid="#b9623a" ground="#5a2a18" gy={900} />
        <path d="M-50,420 Q600,360 1250,470 L1260,500 Q600,400 -50,460 Z" fill="#3a2a1c" />
        <path d="M1250,470 L1400,1080 L1300,1080 L1180,480 Z" fill="#3a2a1c" />
        <g transform={`translate(640,${400 + Math.sin(f / 20) * 3})`}>
          <path d="M-210,10 Q-120,-80 60,-60 L120,-90 L170,-60 L160,-20 L80,0 L60,40 L-40,40 L-180,60 Q-260,90 -290,170" fill="#1b120c" stroke="#1b120c" strokeWidth={10} />
          <circle cx={135} cy={-62} r={6} fill={`rgba(255,220,120,${eye})`} />
        </g>
        <g transform="translate(1480,760)">
          <path d="M-220,0 A220,220 0 0 1 220,0" stroke="rgba(240,235,229,.25)" strokeWidth={34} fill="none" />
          <path d="M-220,0 A220,220 0 0 1 220,0" stroke={RED} strokeWidth={34} fill="none" strokeDasharray={`${k * 690} 900`} />
          <line x1={0} y1={0} x2={Math.cos(Math.PI * (1 - k * 0.97)) * 190} y2={-Math.sin(Math.PI * (1 - k * 0.97)) * 190} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <text y={70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={INK}>MORDIDA</text>
        </g>
      </SV>
      <Tag a={60} t="100 KG · TREPABA" x={660} y={600} size={64} color={ORA} w={800} />
    </Scene>
  );
};

// 12 · LA ESTEPA DEL MAMUT: franja de pasto helado de España a Alaska sobre el mapa, y −40°
export const EstepaMamut: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 110);
  return (
    <Scene d={d} tint="#0b1016" floor="190,220,255">
      <SV>
        <Land top="#a9c3d8" mid="#dfe7ee" ground="#e8eef3" gy={700} />
        <path d={`M-20,560 ${Array.from({ length: 12 }).map((_, i) => `Q${i * 170 + 85},${520 + (i % 2) * 40} ${(i + 1) * 170},560`).join(" ")} L1940,700 L-20,700 Z`} fill="#c8b98e" opacity={0.6} />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${((f * 1.2 + i * 640) % 2400) - 300},700) scale(${0.9 + i * 0.15})`}>{[-80, -40, 40, 80].map((x) => <rect key={x} x={x - 18} y={-90} width={36} height={92} rx={10} fill="#2a1e14" />)}<ellipse cx={0} cy={-130} rx={130} ry={80} fill="#3a2a1c" /><ellipse cx={-30} cy={-170} rx={80} ry={50} fill="#3a2a1c" /><circle cx={120} cy={-160} r={56} fill="#3a2a1c" /><circle cx={130} cy={-214} r={26} fill="#3a2a1c" /><path d="M160,-140 q30,60 6,130" stroke="#3a2a1c" strokeWidth={24} fill="none" strokeLinecap="round" /><path d="M150,-120 q80,20 70,-50" stroke="#efe6d2" strokeWidth={11} fill="none" strokeLinecap="round" />{Array.from({ length: 10 }).map((_, j) => <line key={j} x1={-110 + j * 22} y1={-70} x2={-114 + j * 22} y2={-40} stroke="#3a2a1c" strokeWidth={6} />)}</g>)}
        <rect x={0} y={0} width={1920} height={1080} fill="#e8f2ff" opacity={0.15 + 0.1 * Math.sin(f / 12)} />
        {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(rnd(i, 2) * 2000 + f * 3) % 1960} cy={(rnd(i, 3) * 1080 + f * (2 + rnd(i) * 2)) % 1080} r={2 + rnd(i, 5) * 3} fill="#fff" opacity={0.8} />)}
        <path d={`M200,900 L${200 + 1500 * k},900`} stroke="#9fd8ff" strokeWidth={10} strokeLinecap="round" />
        <text x={200} y={970} fontFamily={F} fontWeight={800} fontSize={40} fill="#0c1a26">ESPAÑA</text>
        <text x={1700} y={970} textAnchor="end" fontFamily={F} fontWeight={800} fontSize={40} fill="#0c1a26" opacity={k}>ALASKA</text>
      </SV>
      <Tag a={70} t="−40 °C" x={1500} y={160} size={120} color="#9fd8ff" w={600} />
    </Scene>
  );
};

// 13 · ESPARTA EN EL HIELO: bloque de permafrost que se aclara y deja ver al cachorro de león de las cavernas
export const CachorroHielo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 90), n = Math.round(interpolate(f, [60, 140], [0, 28000], cl));
  return (
    <Scene d={d} bg={p.bg} tint="#0a1218" floor="170,220,255">
      <SV>
        <rect x={460} y={260} width={1000} height={560} rx={30} fill="#bfe3f5" opacity={0.85 - 0.45 * k} />
        <g transform="translate(960,620)" opacity={0.3 + 0.7 * k}>
          <path d="M-260,40 Q-250,-60 -120,-80 Q0,-90 120,-70 L190,-110 L250,-90 L260,-30 L200,0 L180,50 L-200,60 Z" fill="#c8a272" />
          <path d="M-260,40 Q-320,20 -340,70" stroke="#c8a272" strokeWidth={20} fill="none" strokeLinecap="round" />
          <circle cx={220} cy={-70} r={7} fill="#2a1a10" />
          {[260, 266, 272].map((x, i) => <line key={i} x1={x - 20} y1={-40 + i * 6} x2={x + 40} y2={-50 + i * 10} stroke="#f5ead8" strokeWidth={2} />)}
        </g>
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${500 + i * 120},270 l${30 - i * 5},${60 + rnd(i) * 80} l-20,40`} stroke="#e8f6ff" strokeWidth={3} fill="none" opacity={0.6 * (1 - k)} />)}
      </SV>
      <Tag a={40} t="«ESPARTA»" x={960} y={140} size={84} color="#9fd8ff" />
      <Tag a={70} t={`+${n.toLocaleString("es")} AÑOS`} x={960} y={860} size={70} color={INK} />
    </Scene>
  );
};

// 14 · NIEVE AL PECHO: el teckel avanza y la nieve le sube hasta el pecho; la panza deja un surco
export const NieveAlPecho: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const x = lin(f, 0, d, 300, 1400), lvl = ez(f, 20, 80);
  return (
    <Scene d={d} tint="#0d1218" floor="200,230,255">
      <SV>
        <Land top="#8fa8bf" mid="#cfdbe6" ground="#eef3f7" gy={760} />
        <Perro x={x} y={860} s={2.4} b="teckel" walk={0.6} shiver={0.6} />
        <path d={`M200,${860 - 50 * lvl} L${x - 60},${860 - 52 * lvl} L${x - 60},1080 L200,1080 Z`} fill="#dfe8f0" />
        <path d={`M200,${860 - 50 * lvl} L${x - 60},${860 - 52 * lvl}`} stroke="#a9bccd" strokeWidth={6} />
        <path d={`M0,${860 - 64 * lvl} ${Array.from({ length: 12 }).map((_, j) => `Q${j * 160 + 80},${860 - 64 * lvl - 14 - (j % 2) * 8} ${(j + 1) * 160},${860 - 64 * lvl}`).join(" ")} L1920,1080 L0,1080 Z`} fill="#f4f8fb" />
        <line x1={x + 110} x2={x + 240} y1={860 - 64 * lvl} y2={860 - 64 * lvl} stroke="#3a6a9a" strokeWidth={5} strokeDasharray="10 8" opacity={lvl} />
        {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(rnd(i, 2) * 2000 - f * 2) % 1960 + 40} cy={(rnd(i, 3) * 1080 + f * 3) % 1080} r={3} fill="#fff" />)}
      </SV>
      <Tag a={50} t="NIEVE AL PECHO" x={960} y={140} size={92} color="#2a4a6a" />
    </Scene>
  );
};

// 15 · EL GEN EXTRA: doble hélice con una copia de más que encoge las patas (lobo → teckel)
export const GenPatas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 70, 130);
  return (
    <Scene d={d} tint="#0c0b10" floor="200,180,255">
      <SV>
        {Array.from({ length: 30 }).map((_, i) => { const x = 160 + i * 54, y1 = 300 + Math.sin(i / 2.4 + f / 20) * 70, y2 = 300 - Math.sin(i / 2.4 + f / 20) * 70; const hot = i === 16;
          return <g key={i}><line x1={x} x2={x} y1={y1} y2={y2} stroke={hot ? GOLD : "rgba(240,235,229,.4)"} strokeWidth={hot ? 10 : 5} /><circle cx={x} cy={y1} r={9} fill="#9a8cff" /><circle cx={x} cy={y2} r={9} fill="#7fe0c3" /></g>; })}
        <g opacity={ez(f, 30, 50)} transform={`translate(${1024},${300 - 120 - 30 * ez(f, 30, 50)})`}><rect x={-40} y={-24} width={80} height={48} rx={10} fill={GOLD} /><text y={14} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill="#000">+1</text></g>
        <Perro x={760} y={900} s={2.2} b="galgo" op={1 - k} />
        <Perro x={760} y={900} s={2.2} b="teckel" op={k} />
      </SV>
      <Tag a={40} t="UN GEN DE MÁS FRENA LOS HUESOS LARGOS" x={1200} y={700} size={48} color={GOLD} w={900} />
    </Scene>
  );
};

// 16 · TRES DISEÑOS: un bolso, un trofeo y un agujero, cada uno con su perro adentro, y el sello
export const TresDisenos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const st = sp(f, 120, 1, 9);
  return (
    <Scene d={d} tint="#100d0b" floor="255,200,140">
      <SV>
        {[["chihuahua", "UN BOLSO", 380], ["bulldog", "UN CONCURSO", 960], ["teckel", "UN AGUJERO", 1540]].map(([b, t, x], i) => { const k = ez(f, 10 + i * 30, 30 + i * 30); const X = x as number;
          return <g key={i} opacity={k}>
            {i === 0 && <path d={`M${X - 170},560 L${X + 170},560 L${X + 140},780 L${X - 140},780 Z M${X - 80},560 Q${X},430 ${X + 80},560`} fill="none" stroke={SAND} strokeWidth={10} />}
            {i === 1 && <path d={`M${X - 140},460 L${X + 140},460 Q${X + 130},640 ${X},660 Q${X - 130},640 ${X - 140},460 Z M${X - 40},660 L${X - 60},760 L${X + 60},760 L${X + 40},660`} fill="none" stroke={GOLD} strokeWidth={10} />}
            {i === 2 && <ellipse cx={X} cy={720} rx={190} ry={90} fill="#050403" stroke="#5a4632" strokeWidth={10} />}
            <Perro x={X} y={i === 2 ? 760 : i === 1 ? 470 : 640} s={i === 1 ? 1.3 : 1.4} b={b as string} />
            <text x={X} y={880} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill={INK}>{t as string}</text>
          </g>; })}
      </SV>
      <div style={{ position: "absolute", left: 560, top: 70, width: 800, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: RED, border: `8px solid ${RED}`, borderRadius: 14, opacity: st, transform: `rotate(-6deg) scale(${2 - st})` }}>NO PARA LA PREHISTORIA</div>
    </Scene>
  );
};
