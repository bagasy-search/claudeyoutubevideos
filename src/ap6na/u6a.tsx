// ap6na — componentes únicos 1-7 (la aldea al atardecer, el relieve de Kumaon, la casa en corte, el tamaño, el acecho, las causas, la gripe).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, Fig, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Leo, Eyes, KHouse, Ridges, Tree } from "./lkit";

type UP = { d: number; p: any };

// 1 · DISTRICT DUSK: una ladera con 7 casas; el sol baja y las puertas se cierran una por una, la última luz se apaga; dos ojos en la cresta
export const DistrictDusk: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const sun = ez(f, 0, d * 0.8), night = ez(f, d * 0.25, d * 0.9);
  const H = [[300, 760, 0.8], [560, 700, 0.7], [820, 780, 0.9], [1080, 690, 0.65], [1320, 760, 0.85], [1560, 710, 0.7], [1760, 790, 0.9]];
  const t0 = at(p, "doors", 40);
  return (
    <Scene d={d} bg={p.bg} floor="255,150,80" tint="#0b1622">
      <AbsoluteFill style={{ background: `linear-gradient(rgb(${20 + 30 * (1 - night)},${30 + 20 * (1 - night)},${60 - 10 * night}) 0%, rgb(${230 - 140 * night},${120 - 70 * night},${60 - 30 * night}) 62%, #120c0a 100%)` }} />
      <SV>
        <circle cx={1500} cy={380 + sun * 260} r={80} fill="#ffd48a" opacity={1 - night * 0.8} />
        <Ridges n={3} base={760} col={[30, 34, 48]} pan={-f * 0.3} fog={0.15} />
        <path d="M0,820 Q500,640 980,720 T1920,700 L1920,1080 L0,1080 Z" fill="#17120f" />
        {H.map(([x, y, s], i) => { const k = ez(f, t0 + i * 10, t0 + i * 10 + 8); return <KHouse key={i} x={x} y={y} s={s} lit={1 - ez(f, t0 + 80 + i * 6, t0 + 90 + i * 6)} door={1 - k} bar={k} dark={night > 0.6} />; })}
        <Eyes x={1180} y={560} k={ez(f, d - 70, d - 50) * (0.6 + 0.4 * Math.sin(f / 9))} s={0.7} />
      </SV>
      <Motes n={18} c="255,200,150" />
      <Tag a={at(p, "tag", 12)} t="EASTERN KUMAON · SPRING 1910" x={960} y={90} size={52} />
      <Tag a={t0 + 80} t="DOORS BARRED BEFORE DARK" x={960} y={930} size={44} color={ORA} />
    </Scene>
  );
};

// 2 · KUMAON RELIEF: crestas en capas que se apilan; rótulos Uttarakhand / Nepal / Almora / río Panar que baja serpenteando
export const KumaonRelief: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const riv = ez(f, at(p, "panar", 200) - 10, at(p, "panar", 200) + 50);
  const L = [["UTTARAKHAND", 380, 210, at(p, "utt", 30)], ["HIMALAYA", 960, 150, at(p, "him", 90)], ["NEPAL ▸", 1640, 300, at(p, "nep", 120)], ["ALMORA", 720, 520, at(p, "alm", 180)]] as const;
  const rpath = "M640,1080 C700,960 820,900 800,820 C780,740 900,700 960,640 C1010,590 1000,540 1060,500";
  return (
    <Scene d={d} bg={p.bg} floor="160,190,255" tint="#09121c" push={0.06}>
      <AbsoluteFill style={{ background: "linear-gradient(#0f2033 0%, #2a3550 45%, #c87a44 100%)" }} />
      <SV>
        <path d="M0,330 L160,250 L300,300 L460,190 L640,260 L820,140 L980,230 L1160,120 L1340,240 L1520,170 L1700,260 L1920,200 L1920,420 L0,420 Z" fill="#e9eef5" opacity={0.85} />
        <Ridges n={6} base={1020} col={[26, 44, 60]} pan={-f * 0.4} fog={0.3} />
        <path d={rpath} stroke="#6fd0ff" strokeWidth={10} fill="none" strokeDasharray={1400} strokeDashoffset={1400 * (1 - riv)} strokeLinecap="round" />
        <path d={rpath} stroke="#6fd0ff" strokeWidth={28} fill="none" opacity={0.18 * riv} strokeDasharray={1400} strokeDashoffset={1400 * (1 - riv)} />
        {Array.from({ length: 9 }).map((_, i) => { const x = 300 + rnd(i, 2) * 1300, y = 640 + rnd(i, 3) * 300, k = ez(f, 60 + i * 9, 80 + i * 9);
          return <g key={i} opacity={k}><rect x={x - 10} y={y - 10} width={20} height={14} fill="#c9b79a" /><path d={`M${x - 14},${y - 10} L${x},${y - 22} L${x + 14},${y - 10} Z`} fill="#555a62" /></g>; })}
        <circle cx={720} cy={600} r={14} fill={RED} opacity={ez(f, at(p, "alm", 180), at(p, "alm", 180) + 8)} />
      </SV>
      {L.map(([t, x, y, a]) => <Tag key={t} a={a} t={t} x={x} y={y} size={t === "HIMALAYA" ? 40 : 48} color={t === "ALMORA" ? RED : INK} />)}
      <Tag a={at(p, "panar", 200) + 20} t="PANAR RIVER" x={1180} y={560} size={42} color="#8fdcff" />
    </Scene>
  );
};

// 3 · HOUSE SECTION: corte lateral de la casa: abajo el cuarto de los animales (vaca, cabra), arriba la familia durmiendo;
//     la puerta abierta por el calor y afuera, en la oscuridad, la silueta que se acerca
export const HouseSection: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const cut = ez(f, 6, 40), open = ez(f, at(p, "open", 60), at(p, "open", 60) + 20), leo = ez(f, at(p, "leo", 200), d - 20);
  const br = Math.sin(f / 22) * 2;
  return (
    <Scene d={d} bg={p.bg} floor="255,180,110" tint="#0a0f17">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, #1a2840 0%, #05080d 80%)" }} />
      <SV>
        {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={rnd(i, 1) * 1920} cy={rnd(i, 2) * 380} r={1 + rnd(i, 3) * 2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 30 + i))} />)}
        <rect x={0} y={900} width={1920} height={180} fill="#16110d" />
        <g transform={`translate(560,900) scale(${0.9 + 0.1 * cut})`} opacity={cut}>
          <rect x={-300} y={-560} width={600} height={560} fill="#3a342c" />
          <path d="M-350,-556 L0,-760 L350,-556 Z" fill="#2c2f36" />
          <rect x={-270} y={-530} width={540} height={230} fill="#2a1f16" />
          <rect x={-270} y={-270} width={540} height={250} fill="#1d1610" />
          <line x1={-300} y1={-285} x2={300} y2={-285} stroke="#6b4a2a" strokeWidth={14} />
          <rect x={-200} y={-350} width={300} height={30} rx={10} fill="#6a4a30" />
          {[-150, -60, 30].map((x, i) => <g key={i} transform={`translate(${x},${-372 + br * (i % 2 ? 1 : -1)})`}><ellipse cx={0} cy={0} rx={46} ry={16} fill="#c9b79a" /><circle cx={-50} cy={-8} r={13} fill="#7d6450" /></g>)}
          <rect x={200} y={-420} width={40} height={60} fill="rgba(255,190,100,.5)" />
          <g transform="translate(-140,-40)"><ellipse cx={0} cy={-60} rx={90} ry={44} fill="#5b4433" /><path d="M80,-80 L130,-96 L134,-70 L86,-56 Z" fill="#5b4433" /><rect x={-70} y={-24} width={14} height={24} fill="#5b4433" /><rect x={50} y={-24} width={14} height={24} fill="#5b4433" /></g>
          <g transform="translate(110,-30)"><ellipse cx={0} cy={-40} rx={50} ry={26} fill="#8a7a66" /><circle cx={50} cy={-58} r={16} fill="#8a7a66" /></g>
          <rect x={270} y={-240} width={30} height={220} fill="#5a3a22" transform={`rotate(${-open * 70},300,-20)`} />
        </g>
        <Leo x={1500 - leo * 320} y={900} s={0.9} crouch={0.5} walk={f / 6} eye={leo} />
      </SV>
      <Tag a={at(p, "animals", 30)} t="ANIMALS BELOW" x={560} y={760} size={40} color={GOLD} />
      <Tag a={at(p, "family", 80)} t="FAMILY ABOVE" x={560} y={410} size={40} color={GOLD} />
      <Tag a={at(p, "open", 60) + 10} t="DOOR LEFT OPEN FOR AIR" x={1360} y={520} size={40} color={ORA} />
    </Scene>
  );
};

// 4 · NOT A GIANT: báscula de siluetas: el leopardo (~150 lb) al lado de un hombre de altura media; la barra del peso sube y se queda corta
export const NotAGiant: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a = at(p, "lb", 70), k = ez(f, a - 10, a + 40), m = ez(f, at(p, "man", 160) - 6, at(p, "man", 160) + 30);
  const lb = Math.round(150 * k), man = Math.round(180 * m);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,90" tint="#0b1622">
      <AbsoluteFill style={{ background: "linear-gradient(#0f1d2c 0%, #24324a 60%, #3a2a1f 100%)" }} />
      <SV>
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={160} y1={860 - i * 70} x2={1760} y2={860 - i * 70} stroke="rgba(255,255,255,.06)" strokeWidth={2} />)}
        <rect x={0} y={860} width={1920} height={220} fill="#2a1f17" />
        <Leo x={520} y={860} s={1.1} c="#120d09" spots eye={0.5 + 0.5 * Math.sin(f / 20)} />
        <g opacity={m}><Fig x={1340} y={704} s={2.6} c="#0e0a08" /></g>
        <rect x={430} y={950} width={360 * k} height={34} rx={8} fill={ORA} /><rect x={430} y={950} width={360} height={34} rx={8} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth={3} />
        <rect x={1180} y={950} width={360 * (man / 150)} height={34} rx={8} fill={INK} opacity={m} />
      </SV>
      <div style={{ position: "absolute", left: 430, top: 880, fontFamily: F, fontWeight: 900, fontSize: 56, color: ORA }}>~{lb} lb</div>
      <div style={{ position: "absolute", left: 1180, top: 880, fontFamily: F, fontWeight: 900, fontSize: 56, color: INK, opacity: m }}>~{man} lb</div>
      <Tag a={at(p, "giant", 10)} t="NOT A GIANT" x={960} y={90} size={110} color={RED} />
    </Scene>
  );
};

// 5 · COVER HOP: vista lateral de una ladera con rocas y matas; el leopardo salta de cubierta en cubierta hacia una figura en el sendero;
//     la línea de puntos marca la ruta y el último tramo es «one short rush»
export const CoverHop: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const C = [[220, 860, "rock"], [520, 830, "bush"], [820, 860, "rock"], [1110, 840, "bush"]] as const;
  const seg = Math.min(3.999, lin(f, 20, at(p, "rush", d - 60)) * 4), i = Math.floor(seg), u = seg - i;
  const [x0, y0] = C[Math.min(i, 3)], [x1, y1] = C[Math.min(i + 1, 3)];
  const hop = ez(u, 0.55, 1);
  let lx = x0 + (x1 - x0) * hop, ly = y0 + (y1 - y0) * hop - Math.sin(hop * Math.PI) * 26;
  const r = ez(f, at(p, "rush", d - 60), at(p, "rush", d - 60) + 16);
  if (r > 0) { lx = 1110 + r * 330; ly = 840; }
  return (
    <Scene d={d} bg={p.bg} floor="255,160,90" tint="#0d1218">
      <AbsoluteFill style={{ background: "linear-gradient(#1a2638 0%, #4a3a3a 55%, #2c2219 100%)" }} />
      <SV>
        <path d="M0,880 Q700,820 1920,880 L1920,1080 L0,1080 Z" fill="#241a12" />
        <path d={`M${C.map(([x, y]) => `${x},${y - 30}`).join(" L")} L1480,830`} stroke={ORA} strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" fill="none" opacity={0.8 * ez(f, 10, 30)} />
        <Leo x={lx - 160} y={ly} s={0.6} crouch={r > 0 ? 0.1 : 0.85} walk={f / (r > 0 ? 2 : 5)} eye={0.6} />
        {C.map(([x, y, k], j) => k === "rock"
          ? <path key={j} d={`M${x - 110},${y + 10} Q${x - 90},${y - 90} ${x},${y - 100} Q${x + 100},${y - 90} ${x + 110},${y + 10} Z`} fill="#3d3a36" />
          : <g key={j}>{Array.from({ length: 7 }).map((_, q) => <path key={q} d={`M${x - 70 + q * 22},${y + 10} Q${x - 80 + q * 24 + Math.sin(f / 15 + q) * 6},${y - 80 - rnd(q, j) * 40} ${x - 60 + q * 22},${y + 10}`} fill="#1f3020" />)}</g>)}
        <Fig x={1600} y={772} s={1.3} c="#0b0806" step={f / 8} load />
      </SV>
      <Tag a={at(p, "low", 20)} t="LOW · SLOW · FROM COVER" x={960} y={110} size={64} />
      <Tag a={at(p, "rush", d - 60)} t="ONE SHORT RUSH" x={1300} y={560} size={70} color={RED} />
    </Scene>
  );
};

// 6 · CAUSE TABS: tres fichas que salen del fichero: INJURY (pata vendada), AGE (diente gastado), DISEASE (humo de la pira), cada una con su icono
export const CauseTabs: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const T = [["INJURY", "a wounded cat can't catch its normal prey", at(p, "inj", 20)], ["AGE", "worn teeth, a failing body", at(p, "age", 200)], ["DISEASE", "epidemics left the dead on the hills", at(p, "dis", 320)]] as const;
  return (
    <Scene d={d} bg={p.bg} floor="255,190,120" tint="#120d0a">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, #3a2616 0%, #0b0806 78%)" }} />
      <SV>
        <rect x={210} y={820} width={1500} height={160} rx={18} fill="#4a3220" /><rect x={210} y={800} width={1500} height={40} rx={10} fill="#5a3e28" />
      </SV>
      {T.map(([t, sub, a], i) => {
        const s = sp(f, a, 0.9, 12), on = f >= a ? 1 : 0, hot = i === T.filter(([, , aa]) => f >= aa).length - 1;
        return (
          <div key={t} style={{ position: "absolute", left: 270 + i * 480, top: 820 - 560 * s, width: 420, height: 520, borderRadius: 18, background: hot ? "#f4efe6" : "#d9cfbf", opacity: on * (hot ? 1 : 0.75),
            boxShadow: "0 30px 60px rgba(0,0,0,.6)", transform: `rotate(${(i - 1) * 3 * (1 - s * 0.6)}deg)`, padding: 34, boxSizing: "border-box", fontFamily: F }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#7a6a58" }}>CAUSE {i + 1}</div>
            <div style={{ fontSize: 76, fontWeight: 900, color: hot ? RED : "#3a2c20", marginTop: 10 }}>{t}</div>
            <svg width={352} height={170} viewBox="0 0 352 170" style={{ marginTop: 18 }}>
              {i === 0 && <g stroke="#3a2c20" strokeWidth={8} fill="none" strokeLinecap="round"><path d="M80,160 L110,40 L150,40 L170,160" /><path d="M100,90 L162,82 M98,110 L165,104 M96,130 L168,126" stroke={RED} /></g>}
              {i === 1 && <g fill="none" stroke="#3a2c20" strokeWidth={8} strokeLinecap="round"><path d="M70,40 Q176,0 282,40" /><path d="M110,40 L124,110 L140,40 M200,40 L210,80 L222,40" /><path d="M150,40 L160,64" stroke={RED} /></g>}
              {i === 2 && <g fill="none" stroke="#3a2c20" strokeWidth={8} strokeLinecap="round"><path d="M100,150 L250,150 M120,150 L176,110 L232,150" />{[0, 1, 2].map((q) => <path key={q} d={`M${150 + q * 26},100 q${Math.sin(f / 10 + q) * 14},-30 0,-60 q${-Math.sin(f / 10 + q) * 14},-20 0,-40`} stroke="#7a6a58" />)}</g>}
            </svg>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#4a3c2e", lineHeight: 1.2, marginTop: 6 }}>{sub}</div>
          </div>
        );
      })}
      <Tag a={6} t="WHY A LEOPARD TURNS" x={960} y={60} size={60} />
    </Scene>
  );
};

// 7 · FLU WAVE: línea de muertes por epidemia en Kumaon 1900-1920 (esquemática): ondas de cólera chicas y el pico de 1918;
//     debajo de la curva, una ladera con piras que humean
export const FluWave: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const k = ez(f, 10, at(p, "flu", 200) + 30);
  const Y = (yr: number) => { const c = [1903, 1906, 1909, 1913].reduce((s, y0) => s + 70 * Math.exp(-((yr - y0) ** 2) / 0.6), 0); return 820 - (c + 420 * Math.exp(-((yr - 1918.6) ** 2) / 0.35) + 20); };
  const X = (yr: number) => 200 + (yr - 1900) * 76;
  const N = 200, pts = Array.from({ length: Math.max(2, Math.round(N * k)) }).map((_, i) => { const yr = 1900 + (i / N) * 20; return `${X(yr)},${Y(yr)}`; });
  return (
    <Scene d={d} bg={p.bg} floor="255,120,80" tint="#08090c">
      <AbsoluteFill style={{ background: "linear-gradient(#090c12 0%, #14141c 70%, #241815 100%)" }} />
      <SV>
        {[1900, 1905, 1910, 1915, 1920].map((y) => <g key={y}><line x1={X(y)} y1={300} x2={X(y)} y2={840} stroke="rgba(255,255,255,.08)" strokeWidth={2} /><text x={X(y)} y={890} fill="rgba(244,239,230,.7)" fontFamily={F} fontWeight={800} fontSize={34} textAnchor="middle">{y}</text></g>)}
        <line x1={200} y1={840} x2={1720} y2={840} stroke="rgba(255,255,255,.4)" strokeWidth={3} />
        <path d={`M${pts.join(" L")}`} stroke={RED} strokeWidth={7} fill="none" strokeLinejoin="round" />
        <path d={`M200,840 L${pts.join(" L")} L${pts[pts.length - 1].split(",")[0]},840 Z`} fill="rgba(241,69,54,.14)" />
        {k > 0.98 && <circle cx={X(1918.6)} cy={Y(1918.6)} r={14 + Math.sin(f / 5) * 4} fill={RED} />}
        {Array.from({ length: 6 }).map((_, i) => <g key={i} opacity={ez(f, at(p, "rites", 300) + i * 6, at(p, "rites", 300) + i * 6 + 10)}>
          <path d={`M${320 + i * 230},1010 l30,-26 l30,26`} stroke="#5a4a3a" strokeWidth={6} fill="none" />
          {[0, 1].map((q) => <path key={q} d={`M${350 + i * 230 + q * 10},984 q${Math.sin(f / 12 + i + q) * 16},-40 0,-80 q${-Math.sin(f / 12 + i) * 16},-30 0,-60`} stroke="rgba(200,200,200,.35)" strokeWidth={5} fill="none" />)}
        </g>)}
      </SV>
      <Tag a={at(p, "chol", 60)} t="CHOLERA" x={X(1906)} y={Y(1906) - 120} size={44} color={ORA} />
      <Tag a={at(p, "flu", 200)} t="1918 INFLUENZA" x={X(1918.6) - 180} y={Y(1918.6) - 90} size={54} color={RED} />
      <Tag a={4} t="EPIDEMICS IN THE HILLS" x={600} y={120} size={50} />
      <div style={{ position: "absolute", left: 200, top: 920, fontFamily: F, fontWeight: 700, fontSize: 22, color: "rgba(244,239,230,.5)" }}>schematic · not to scale</div>
    </Scene>
  );
};
