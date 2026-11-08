// dur5nc — componentes únicos 1-13 (gancho, Flores, Luzón, Lucy). Cada uno es «tú» midiéndote contra algo que dicen los huesos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, SAND, Scene, Tag, Motes, ez, lin, sp, rnd, at, cl } from "./ukit";
import { SV, Tu, Sting } from "./pkit";
import { Rival, Fosil, Lasca } from "./hkit";
import { interpolate } from "remotion";

type UP = { d: number; p: any };
const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// 1 · CARA A CARA: selva de noche, tú y el rival frente a frente; la distancia se marca y arranca el contador
export const CaraACara: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const a5 = at(p, "cinco", 40), k = ez(f, a5, a5 + 22), run = at(p, "corre", 200);
  const dist = lp(1120, 1120, k), s = Math.max(0, (f - run) / 30);
  return (
    <Scene d={d} bg={p.bg} tint="#07120c" floor="120,220,140">
      <SV>
        {Array.from({ length: 16 }).map((_, i) => { const x = rnd(i, 2) * 1920, w = 40 + rnd(i, 3) * 70; return <rect key={i} x={x} y={0} width={w} height={830} fill={`rgba(8,${30 + rnd(i) * 26},18,.9)`} />; })}
        {Array.from({ length: 24 }).map((_, i) => { const x = rnd(i, 7) * 1920, sw = Math.sin(f / 40 + i) * 8; return <path key={i} d={`M${x},60 q${40 + sw},${60} ${10},${150 + rnd(i, 2) * 100}`} stroke="#12331f" strokeWidth={9} fill="none" />; })}
        <rect x={0} y={826} width={1920} height={260} fill="#14241a" />
        <Rival x={1320} y={850} s={2.6} h={0.72} w={0.82} brow={0.9} arm={1.14} flip tool="lasca" lean={Math.sin(f / 24) * 1.4} c="#7c5536" />
        <path d={`M640,900 L${dist + 200},900`} stroke={GOLD} strokeWidth={5} strokeDasharray="20 14" opacity={k} />
      </SV>
      <Tu x={560} y={880} s={2.15} />
      <Tag a={a5 + 6} t="5 METROS" x={960} y={920} size={76} color={GOLD} />
      {f >= run && <div style={{ position: "absolute", left: 660, top: 80, width: 600, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 130, color: RED, fontVariantNumeric: "tabular-nums", textShadow: "0 0 26px rgba(241,69,54,.6)" }}>{`00:${String(Math.floor(s)).padStart(2, "0")}`}</div>}
      <Motes c="190,255,190" />
    </Scene>
  );
};

// 2 · VIVIERON JUNTOS: barras horizontales de cada especie en un eje de 3,5 millones de años, las que se pisan se encienden
export const BarrasJuntos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const E: [string, number, number, string][] = [["Afarensis", 3.9, 2.9, SAND], ["Boisei", 2.3, 1.3, ORA], ["Habilis", 2.4, 1.4, ORA], ["Erectus", 1.9, 0.11, GOLD], ["Heidelberg", 0.7, 0.2, GOLD], ["Naledi", 0.34, 0.24, RED], ["Neandertal", 0.4, 0.04, RED], ["Denisovano", 0.3, 0.05, RED], ["Flores", 0.19, 0.05, RED], ["Luzón", 0.13, 0.05, RED], ["Sapiens", 0.3, 0, "#7fe0c3"]];
  const X = (m: number) => 340 + (1 - m / 4) * 1460, hoy = at(p, "hoy", d - 80);
  return (
    <Scene d={d} bg={p.bg} tint="#0e0b09" floor="255,200,120">
      <SV>
        {[4, 3, 2, 1, 0].map((m) => <g key={m}><line x1={X(m)} y1={140} x2={X(m)} y2={960} stroke="rgba(240,235,229,.16)" strokeWidth={2} /><text x={X(m)} y={1006} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={38} fill="rgba(240,235,229,.8)">{m === 0 ? "HOY" : `${m} M`}</text></g>)}
        {E.map(([n, a, b, c], i) => { const y = 160 + i * 72, k = ez(f, 8 + i * 9, 36 + i * 9); return <g key={n}><text x={300} y={y + 40} textAnchor="end" fontFamily={F} fontWeight={800} fontSize={40} fill={INK} opacity={k}>{n}</text><rect x={X(a)} y={y} width={Math.max(14, (X(b) - X(a)) * k)} height={52} rx={10} fill={c} /></g>; })}
        <rect x={X(0.3)} y={150} width={X(0.05) - X(0.3)} height={800} fill="rgba(255,240,180,.1)" opacity={ez(f, 130, 160)} />
      </SV>
      <Tag a={Math.min(hoy, d - 70)} t="HOY: SOLO TÚ" x={1420} y={60} size={70} color="#7fe0c3" />
      <Tag a={140} t="AL MISMO TIEMPO" x={1000} y={60} size={70} color={GOLD} w={760} />
    </Scene>
  );
};

// 3 · LA FILA: once rivales de menos a más, de izquierda a derecha, y tú al frente mirando para arriba
export const FilaOnce: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R: [number, number, boolean?][] = [[0.68, 0.72], [0.72, 0.74], [0.8, 0.85], [0.78, 0.78], [0.86, 0.84], [0.84, 1.1, true], [1.08, 0.92], [1.12, 1.26], [1.14, 1.22], [1.08, 1.48], [1.12, 1]];
  const cam = lin(f, 20, d - 10, 0, -780);
  return (
    <Scene d={d} bg={p.bg} tint="#100c09" floor="255,180,100" drift={0.5}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${cam}px)` }}>
        <SV>
          <rect x={0} y={880} width={3000} height={210} fill="#2a1d12" />
          {R.map(([h, w, cr], i) => { const k = sp(f, 6 + i * 7, 1, 12); return <g key={i} opacity={Math.min(1, k * 2)}><Rival x={520 + i * 220} y={880 + (1 - k) * 110} s={2.3} h={h} w={w} crest={cr} flip brow={0.8} c={i === 10 ? "#a4714c" : "#6f4a2d"} tool={i > 6 ? "lanza" : undefined} /><text x={520 + i * 220} y={965} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill={i === 10 ? RED : ORA}>{11 - i}</text></g>; })}
        </SV>
      </div>
      <Tu x={230} y={890} s={1.9} />
      <Tag a={20} t="ONCE RIVALES" x={960} y={70} size={92} color={INK} />
      <Tag a={Math.max(50, d - 110)} t="DE FÁCIL A IMPOSIBLE" x={960} y={180} size={62} color={RED} />
    </Scene>
  );
};

// 4 · LO DICEN LOS HUESOS: un fémur fósil bajo el calibre; las mordazas se cierran, salen los números y un sello de ESTIMACIÓN
export const CalibreFemur: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const e = at(p, "estim", d - 70), k = ez(f, 18, 74);
  const open = lp(420, 96, k), cx = 960;
  return (
    <Scene d={d} bg={p.bg} tint="#141009" floor="255,210,140">
      <SV>
        <Fosil x={cx} y={560} w={1040} h={94} curve={14} />
        <ellipse cx={cx - 556} cy={548} rx={80} ry={70} fill="#c9b184" stroke="#6d5a39" strokeWidth={3} />
        <ellipse cx={cx + 556} cy={560} rx={62} ry={82} fill="#c9b184" stroke="#6d5a39" strokeWidth={3} />
        <g transform={`translate(${cx},0)`}>
          <rect x={-470} y={230} width={940} height={36} rx={6} fill="#cfd4d8" />
          {Array.from({ length: 48 }).map((_, i) => <rect key={i} x={-460 + i * 19.5} y={230} width={3} height={i % 5 ? 12 : 22} fill="#2f3438" />)}
          <path d={`M${-open},266 v230 l36,40 l-36,-16 Z`} fill="#b0b6bb" stroke="#585f64" strokeWidth={3} />
          <path d={`M${open},266 v230 l-36,40 l36,-16 Z`} fill="#b0b6bb" stroke="#585f64" strokeWidth={3} />
        </g>
      </SV>
      <div style={{ position: "absolute", left: 660, top: 110, width: 600, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 104, color: GOLD, fontVariantNumeric: "tabular-nums" }}>{(lp(42, 28.4, k)).toFixed(1).replace(".", ",")} mm</div>
      <Tag a={e} t="ESTIMACIÓN" x={1340} y={760} size={96} color={RED} rot={-8} bg="rgba(10,6,4,.85)" w={800} />
      <Tag a={50} t="HUESO → CUERPO" x={560} y={790} size={66} color={INK} w={860} />
    </Scene>
  );
};

// 5 · LA REGLA: el rival junto a ti contra una regla de pared; después la báscula doble
export const ReglaFlores: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const pe = at(p, "peso", 150), k = ez(f, 14, 56), kk = ez(f, pe, pe + 26);
  const ym = (cm: number) => 930 - cm * 4.4;
  return (
    <Scene d={d} bg={p.bg} tint="#14100b" floor="255,190,110">
      <SV>
        <rect x={960} y={150} width={92} height={790} fill="#ded2b4" stroke="#7a6b4c" strokeWidth={3} />
        {Array.from({ length: 19 }).map((_, i) => <g key={i}><line x1={960} x2={i % 2 ? 985 : 1006} y1={ym(i * 10)} y2={ym(i * 10)} stroke="#4a3f2a" strokeWidth={3} />{i % 2 === 0 && <text x={1014} y={ym(i * 10) + 12} fontFamily={F} fontWeight={800} fontSize={30} fill="#332a1a">{i * 10}</text>}</g>)}
        <Rival x={760} y={932} s={k * 2.37} h={0.78} w={0.82} brow={0.9} arm={1.12} c="#7c5536" tool="lasca" />
        <rect x={1120} y={930} width={560} height={14} fill="#55452e" />
        <line x1={960} x2={1040} y1={ym(106)} y2={ym(106)} stroke={GOLD} strokeWidth={6} opacity={k} />
        <line x1={960} x2={1040} y1={ym(170)} y2={ym(170)} stroke={RED} strokeWidth={6} opacity={k} />
      </SV>
      <Tu x={1280} y={932} s={2.2} />
      <Tag a={30} t="1,06 M" x={450} y={ym(106) - 36} size={92} color={GOLD} w={500} />
      <Tag a={44} t="TÚ 1,70 M" x={1640} y={ym(170) - 40} size={72} color={RED} w={500} />
      <div style={{ position: "absolute", left: 60, top: 560, width: 420, fontFamily: F, fontWeight: 900, opacity: kk, color: INK, fontSize: 62, lineHeight: 1.1 }}>≈ 30 KG<div style={{ fontSize: 40, color: ORA }}>calculado</div></div>
      <Tag a={pe + 20} t="MÁS DEL DOBLE" x={1540} y={520} size={60} color={INK} w={620} />
    </Scene>
  );
};

// 6 · TORONJA: tres cerebros (ilustrados) sobre una mesa, de la toronja al tuyo, medidor del volumen
export const CerebroFruta: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k1 = sp(f, 16), k2 = sp(f, at(p, "tercio", 70));
  const Br = ({ x, y, r, c, o = 1 }: any) => <g transform={`translate(${x},${y})`} opacity={o}><ellipse rx={r} ry={r * 0.78} fill={c} stroke="#6f3b3b" strokeWidth={4} />{[-0.55, -0.2, 0.2, 0.55].map((u, i) => <path key={i} d={`M${r * u},${-r * 0.65} q${(i % 2 ? 1 : -1) * r * 0.28},${r * 0.35} ${0},${r * 0.7} q${(i % 2 ? -1 : 1) * r * 0.26},${r * 0.3} ${r * 0.05},${r * 0.55}`} stroke="#8e5151" strokeWidth={5} fill="none" />)}</g>;
  return (
    <Scene d={d} bg={p.bg} tint="#17110d" floor="255,180,150">
      <SV>
        <rect x={0} y={780} width={1920} height={300} fill="#2d1f14" />
        <g transform={`translate(0,${(1 - k1) * 120})`} opacity={Math.min(1, k1 * 2)}><Br x={600} y={720} r={120} c="#db9a91" /></g>
        <circle cx={600} cy={500} r={0} />
        <g transform={`translate(0,${(1 - k2) * 150})`} opacity={Math.min(1, k2 * 2)}><Br x={1270} y={630} r={230} c="#e5ada3" /></g>
      </SV>
      <Tag a={22} t="FLORES ≈ 420 cm³" x={600} y={840} size={66} color={GOLD} w={720} />
      <Tag a={at(p, "tercio", 70) + 8} t="TÚ ≈ 1.350 cm³" x={1270} y={880} size={70} color={INK} w={760} />
      <Tag a={at(p, "tercio", 70) + 26} t="UN TERCIO" x={960} y={110} size={120} color={RED} />
    </Scene>
  );
};

// 7 · LOS VECINOS DE FLORES: en un diorama aparecen, de uno en uno, dragón, cigüeña y estegodonte; él en el medio
export const VecinosFlores: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const a = at(p, "dragon", 20), b = at(p, "ciguena", 70), c = at(p, "ele", 120);
  const ka = sp(f, a, 1, 11), kb = sp(f, b, 1, 11), kc = sp(f, c, 1.2, 12), sn = Math.sin(f / 7);
  return (
    <Scene d={d} bg={p.bg} tint="#101a10" floor="170,235,150">
      <SV>
        <rect x={0} y={800} width={1920} height={280} fill="#26331a" />
        <g transform={`translate(${260},${830 + (1 - ka) * 200}) scale(1.9)`} opacity={Math.min(1, ka * 2)}>
          <path d={`M-140,6 Q-60,-34 60,-22 Q90,-20 118,-8 Q130,0 112,8 Q80,16 60,10 Q-40,18 -140,6 Z`} fill="#5b5a3c" stroke="#2c2b1a" strokeWidth={4} />
          <path d={`M124,3 l${40 + sn * 18},${-6 + sn * 4} l-8,6 l12,8 Z`} fill="#d05a4a" />
          {[-90, -20, 34, 76].map((x, i) => <path key={i} d={`M${x},12 l-12,24 l18,0`} stroke="#3b3a24" strokeWidth={9} fill="none" strokeLinecap="round" />)}
        </g>
        <g transform={`translate(1500,${810 + (1 - kb) * 300}) scale(2)`} opacity={Math.min(1, kb * 2)}>
          <path d="M-14,0 L-14,-70 M14,0 L14,-70" stroke="#d8c8a0" strokeWidth={8} />
          <ellipse cx={0} cy={-120} rx={50} ry={66} fill="#3a3a3f" /><path d="M-10,-170 Q-24,-240 12,-260" stroke="#ece4cc" strokeWidth={15} fill="none" />
          <path d="M14,-260 L92,-246 L14,-246 Z" fill="#c9a03a" />
        </g>
        <g transform={`translate(1000,${800 + (1 - kc) * 240}) scale(1.8)`} opacity={Math.min(1, kc * 2)}>
          <ellipse cx={0} cy={-110} rx={150} ry={84} fill="#6a5f55" /><circle cx={140} cy={-132} r={52} fill="#6a5f55" /><path d="M184,-118 Q222,-60 206,-2" stroke="#6a5f55" strokeWidth={26} fill="none" /><path d="M170,-108 Q250,-96 270,-152" stroke="#e9e0c8" strokeWidth={12} fill="none" />
          {[-100, -40, 40, 100].map((x, i) => <rect key={i} x={x - 18} y={-60} width={36} height={60} fill="#5a5147" />)}
        </g>
        <Rival x={640} y={840} s={1.3} h={0.78} w={0.82} tool="lasca" c="#7c5536" />
      </SV>
      <Tag a={a + 12} t="DRAGONES" x={340} y={540} size={76} color={GOLD} w={520} />
      <Tag a={b + 12} t="CIGÜEÑA · 1,8 M" x={1500} y={230} size={66} color={INK} w={700} />
      <Tag a={c + 12} t="ELEFANTE ENANO" x={960} y={320} size={70} color={ORA} w={700} />
    </Scene>
  );
};

// 8 · EL FILO: macro de una lasca de piedra; el borde brilla y una línea roja cruza una pieza de cuero — el corte, no la herida
export const FiloLasca: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 40, 86), x = lp(260, 1500, k);
  return (
    <Scene d={d} bg={p.bg} tint="#100c0a" floor="255,220,170">
      <SV>
        <rect x={200} y={620} width={1520} height={230} rx={14} fill="#8b5e3a" stroke="#51351f" strokeWidth={5} />
        {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M${220 + i * 70},${640 + rnd(i) * 180} q20,10 40,0`} stroke="rgba(50,30,16,.5)" strokeWidth={3} fill="none" />)}
        <path d={`M260,735 L${x},735`} stroke="#190c06" strokeWidth={12} strokeLinecap="round" />
        <path d={`M260,735 L${x},735`} stroke={RED} strokeWidth={3} opacity={0.7} />
        <Lasca x={x} y={470} s={2.5} rot={-8 + Math.sin(f / 10) * 2} glow={ez(f, 16, 40)} />
      </SV>
      <Tag a={16} t="PIEDRA" x={480} y={130} size={100} color={INK} w={560} />
      <Tag a={78} t="CORTA COMO NAVAJA" x={1200} y={900} size={72} color={GOLD} w={1100} />
    </Scene>
  );
};

// 9 · LA CAJA DE ZAPATOS: trece fragmentos caen uno a uno dentro de una caja y el contador sube; toda una especie cabe ahí
export const CajaTrece: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const n = Math.min(13, Math.max(0, Math.floor((f - 12) / 9) + 1));
  return (
    <Scene d={d} bg={p.bg} tint="#14100c" floor="255,200,130">
      <SV>
        <path d="M430,560 L1490,560 L1400,430 L520,430 Z" fill="#b9a783" stroke="#6a5a3c" strokeWidth={5} />
        {Array.from({ length: 13 }).map((_, i) => { const at0 = 12 + i * 9, k = ez(f, at0, at0 + 12); const x = 560 + (i % 7) * 130 + rnd(i) * 34, y = lp(-90, 520 - (i > 6 ? 40 : 0), k); return <g key={i} transform={`translate(${x},${y})`} opacity={k > 0 ? 1 : 0}>{i % 3 === 0 ? <rect x={-22} y={-22} width={44} height={46} rx={14} fill="#e4d7ba" stroke="#7a6b4c" strokeWidth={3} /> : <Fosil x={0} y={0} w={110} h={32} curve={i % 3 === 1 ? 10 : 0} rot={rnd(i, 3) * 40 - 20} />}</g>; })}
        <path d="M410,560 L1510,560 L1510,920 L410,920 Z" fill="#a08c68" stroke="#6a5a3c" strokeWidth={5} />
        <rect x={720} y={650} width={480} height={170} rx={8} fill="#efe6cf" />
      </SV>
      <div style={{ position: "absolute", left: 720, top: 660, width: 480, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 118, color: "#34281a", fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <Tag a={d - 90} t="TODA UNA ESPECIE" x={960} y={100} size={86} color={GOLD} />
    </Scene>
  );
};

// 10 · DEDOS GANCHO: dos falanges una al lado de la otra, la recta y la curva; una mano agarra una rama y aguanta
export const DedoGancho: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 12, 40), g = ez(f, at(p, "cuelga", 90), at(p, "cuelga", 90) + 22);
  const swing = Math.sin(f / 18) * 6 * g;
  return (
    <Scene d={d} bg={p.bg} tint="#0f1612" floor="160,230,170">
      <SV>
        <g opacity={k}><Fosil x={480} y={380} w={440} h={94} rot={-4} /><Fosil x={480} y={640} w={440} h={94} curve={70} rot={-4} /></g>
        <rect x={1050} y={250} width={800} height={46} rx={23} fill="#5a4026" stroke="#2e2013" strokeWidth={4} transform={`rotate(-3 1450 273)`} />
        <g transform={`translate(1450,290) rotate(${swing})`} opacity={g}>
          <Rival x={0} y={520} s={2} h={0.86} w={0.8} raise={1} arm={1.28} c="#7c5536" />
        </g>
      </SV>
      <Tag a={18} t="TUYA: RECTA" x={480} y={250} size={66} color={INK} w={700} />
      <Tag a={32} t="LUZÓN: CURVA" x={480} y={730} size={66} color={GOLD} w={700} />
    </Scene>
  );
};

// 11 · TRES VECES: el rival se suelta de la rama tres veces, cada caída te tira; el contador de golpes crece, la cuarta la paras
export const CaeTresVeces: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const hit = Math.floor(Math.min(3, Math.max(0, (f - 26) / 46 + 1)));
  const ph = Math.min(1, (((f - 26) % 46) + 46) % 46 / 20), y0 = 310, y1 = 800;
  const fallY = f < 26 ? y0 : lp(y0, y1, ph * ph), xr = 900 + ((hit % 3) - 1) * 260;
  const stun = f > 26 && (((f - 26) % 46) + 46) % 46 < 14 ? 1 : 0;
  return (
    <Scene d={d} bg={p.bg} tint="#0c1510" floor="160,230,170">
      <SV>
        <rect x={0} y={880} width={1920} height={200} fill="#1a2a1b" />
        <path d="M0,220 Q960,190 1920,240" stroke="#3f2d1a" strokeWidth={50} fill="none" />
        {Array.from({ length: 34 }).map((_, i) => <circle key={i} cx={40 + i * 58} cy={150 + rnd(i) * 80} r={40 + rnd(i, 3) * 26} fill={`rgba(26,${60 + rnd(i, 5) * 40},30,.9)`} />)}
        <Rival x={xr} y={fallY} s={1.7} h={0.86} w={0.8} raise={ph < 0.8 ? 1 : 0.2} arm={1.25} c="#7c5536" />
        {stun ? <Sting x={xr} y={700} k={1} n={9} r={80} /> : null}
      </SV>
      <Tu x={xr + 30} y={884} s={1.9} rot={stun ? 16 : Math.sin(f / 8) * 2} />
      <div style={{ position: "absolute", left: 80, top: 330, fontFamily: F, fontWeight: 900, color: RED, fontSize: 210, fontVariantNumeric: "tabular-nums" }}>×{hit}</div>
      <Tag a={Math.max(90, d - 80)} t="LA CUARTA: LO AGARRAS" x={1200} y={500} size={60} color={GOLD} w={1100} />
    </Scene>
  );
};

// 12 · DENTRO DEL BRAZO: el corte transversal del húmero, el tuyo y el de Lucy: la pared de hueso crece
export const CorteBrazo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 24, 90);
  const Hueso = ({ x, r, wall, c }: any) => <g transform={`translate(${x},540)`}><circle r={r} fill={c} stroke="#6d5a39" strokeWidth={5} /><circle r={Math.max(4, r - wall)} fill="#2a1712" />{Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={Math.cos(i * 0.9) * (r - wall / 2)} cy={Math.sin(i * 0.9) * (r - wall / 2)} r={3} fill="rgba(90,70,40,.5)" />)}</g>;
  return (
    <Scene d={d} bg={p.bg} tint="#17100c" floor="255,200,140">
      <SV>
        <Hueso x={560} r={230} wall={46} c="#d9c7a2" />
        <Hueso x={1360} r={230} wall={lp(46, 170, k)} c="#c9a973" />
      </SV>
      <Tag a={10} t="TU BRAZO" x={560} y={820} size={78} color={INK} w={700} />
      <Tag a={20} t="LUCY" x={1360} y={820} size={78} color={GOLD} w={700} />
      <Tag a={84} t="PARED MÁS GRUESA" x={960} y={110} size={92} color={RED} />
    </Scene>
  );
};

// 13 · EL TIRÓN: tú tiras de una muñeca; un medidor te dice que aplicaste todo, y la mano del rival sigue en cero
export const TironCero: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 10, 80), sh = Math.sin(f / 2) * (k * 4);
  return (
    <Scene d={d} bg={p.bg} tint="#16100b" floor="255,190,120">
      <SV>
        <rect x={0} y={880} width={1920} height={200} fill="#2d1e12" />
        <Rival x={1240 + sh * 0.2} y={884} s={2.2} h={0.95} w={1.08} brow={0.9} arm={1.2} flip c="#6f4a2d" />
        <line x1={720 + sh} y1={620} x2={1110} y2={620} stroke="#7c5536" strokeWidth={22} strokeLinecap="round" />
      </SV>
      <Tu x={580 + sh} y={884} s={2.2} rot={-13 * k} arms="spear" />
      <div style={{ position: "absolute", left: 120, top: 120, width: 700, fontFamily: F }}><div style={{ fontSize: 42, fontWeight: 800, color: "rgba(240,235,229,.8)" }}>TU FUERZA</div><div style={{ marginTop: 8, height: 44, width: 660, borderRadius: 22, background: "rgba(240,235,229,.16)" }}><div style={{ height: "100%", width: `${k * 100}%`, background: RED, borderRadius: 22 }} /></div></div>
      <div style={{ position: "absolute", left: 1100, top: 120, width: 700, fontFamily: F }}><div style={{ fontSize: 42, fontWeight: 800, color: "rgba(240,235,229,.8)" }}>SE MUEVE</div><div style={{ fontSize: 124, fontWeight: 900, color: GOLD, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>0 cm</div></div>
    </Scene>
  );
};
