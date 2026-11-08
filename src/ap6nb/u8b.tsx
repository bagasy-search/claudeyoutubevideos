// ap6nb — únicas 16-30: ojos, veneno, aceite, cuentas de la especie, las tres teorías y el cierre. Sin sangre ni animales atacados: siluetas.
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Shark, Seal, lp } from "./skit";

type UP = { d: number; p: any };
const T = "#061018", CY = "#7fd1e8";

// 16 · NADIE LO VIO: tres placas vacías con estática (nacimiento, cría, apareamiento)
export const NeverSeen: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "a", 8), at(p, "b", 60), at(p, "c", 110)];
  const L = ["GIVING BIRTH", "WHERE THEY MATE", "THE SMALLEST ONES"];
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        {L.map((_, i) => { const x = 130 + i * 580, s = sp(f, A[i]); return <g key={i} transform={`translate(${x},${260 + (1 - s) * 60})`} opacity={ez(f, A[i], A[i] + 8)}>
          <rect width={500} height={420} fill="#0a1218" stroke={INK} strokeWidth={5} rx={8} />
          {Array.from({ length: 90 }).map((_, j) => { const n = Math.floor(f / 2); return <rect key={j} x={8 + rnd(j + n, 3) * 470} y={8 + rnd(j + n, 5) * 390} width={6 + rnd(j, 2) * 26} height={3} fill={`rgba(220,235,245,${0.1 + rnd(j + n, 7) * 0.34})`} />; })}
          <text x={250} y={250} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={190} fill="rgba(241,69,54,.88)">?</text>
        </g>; })}
      </SV>
      {L.map((t, i) => <Tag key={t} a={A[i] + 8} t={t} x={380 + i * 580} y={720} size={54} color={GOLD} w={560} />)}
      <Tag a={A[2] + 30} t="NEVER OBSERVED" x={960} y={860} size={96} w={1300} />
    </Scene>
  );
};

// 17 · HÉLICE REMENDADA: cortes en el ADN que se cierran, y sello de ciencia joven
export const HelixPatch: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), r = at(p, "repair", 60), y = at(p, "young", d - 90);
  const BR = [260, 620, 980, 1340, 1640];
  return (
    <Scene d={d} bg={p.bg} tint="#07101a" floor="120,190,220">
      <SV>
        {Array.from({ length: 62 }).map((_, i) => { const x = 60 + i * 30, ph = i / 3.6 + f / 22, y1 = 500 + Math.sin(ph) * 150, y2 = 500 - Math.sin(ph) * 150;
          const br = BR.findIndex((b) => Math.abs(b - x) < 32), heal = br < 0 ? 1 : ez(f, r + br * 16, r + br * 16 + 16);
          return <g key={i}><line x1={x} x2={x} y1={y1} y2={lp(y1, y2, heal)} stroke={br >= 0 ? (heal < 1 ? RED : GOLD) : "rgba(127,209,232,.5)"} strokeWidth={8} /><circle cx={x} cy={y1} r={13} fill={CY} /><circle cx={x} cy={y2} r={13} fill="#a9e5c8" opacity={0.25 + 0.75 * heal} /></g>; })}
      </SV>
      <Tag a={r + 6} t="EARLY SIGNS OF STRONG REPAIR" x={960} y={80} size={66} color={GOLD} w={1500} />
      <Tag a={y} t="YOUNG SCIENCE" x={960} y={830} size={120} color={RED} rot={-3} w={1400} />
    </Scene>
  );
};

// 18 · EL HILO DEL OJO: macro del ojo con el copépodo colgando y el rótulo de manual que se tacha
export const EyeThread: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "blind", d - 110), x = at(p, "wrong", d - 50), s2 = Math.sin(f / 26);
  return (
    <Scene d={d} tint="#080d12" floor="120,190,220">
      <SV>
        <rect width={1920} height={1080} fill="#2f3a42" />
        {Array.from({ length: 150 }).map((_, i) => <circle key={i} cx={rnd(i, 2) * 1920} cy={rnd(i, 3) * 1080} r={3 + rnd(i, 4) * 12} fill="rgba(0,0,0,.2)" />)}
        {Array.from({ length: 34 }).map((_, i) => <path key={i} d={`M${rnd(i, 5) * 1920},${rnd(i, 6) * 1080} l${40 + rnd(i, 7) * 110},${-14 + rnd(i, 8) * 28}`} stroke="rgba(226,232,236,.3)" strokeWidth={4} />)}
        <ellipse cx={960} cy={440} rx={250} ry={190} fill="#11171b" />
        <circle cx={960} cy={440} r={140} fill="#7c8d96" /><circle cx={960} cy={440} r={82} fill="#050709" /><circle cx={916} cy={396} r={24} fill="rgba(255,255,255,.55)" />
        <path d={`M960,520 C${970 + s2 * 30},640 ${930 - s2 * 44},770 ${960 + s2 * 70},940`} stroke="#ece4cf" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={`M960,520 C${974 + s2 * 30},640 ${934 - s2 * 44},770 ${964 + s2 * 70},940`} stroke="#c7bea3" strokeWidth={7} fill="none" strokeLinecap="round" />
        <circle cx={960} cy={520} r={26} fill="#ece4cf" />
      </SV>
      <Tag a={20} t="A COPEPOD, ON THE CORNEA" x={960} y={46} size={62} color={GOLD} w={1400} />
      <div style={{ position: "absolute", left: 230, top: 610, fontFamily: F, fontWeight: 900, fontSize: 96, color: INK, opacity: ez(f, a, a + 10) }}>"BLIND"<div style={{ position: "absolute", left: -10, top: 54, height: 12, background: RED, width: 360 * ez(f, x, x + 14) }} /></div>
    </Scene>
  );
};

// 19 · PARED DE BASTONES: fotones que caen a un bosque de bastones y encienden uno por uno
export const RodWall: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), r = at(p, "rods", 40), s = at(p, "still", r + 100);
  return (
    <Scene d={d} bg={p.bg} tint="#050b12" floor="120,190,220">
      <SV>
        {Array.from({ length: 46 }).map((_, i) => { const x = 40 + i * 41, h = 340 + rnd(i, 2) * 120, g = ez(f, r + rnd(i, 3) * 90, r + 20 + rnd(i, 3) * 90), hit = Math.max(0, Math.sin(f / 7 + i * 1.9)) * g; return <g key={i} transform={`translate(${x},${1000 - h * ez(f, 2 + i, 22 + i)})`}><rect width={22} height={h} rx={11} fill={`rgba(${60 + 190 * hit},${130 + 110 * hit},${180 + 40 * hit},.9)`} /><circle cx={11} cy={h} r={18} fill="#1b2b38" /></g>; })}
        {Array.from({ length: 34 }).map((_, i) => { const ph = (f / 42 + rnd(i, 6)) % 1, x = rnd(i, 7) * 1920; return <circle key={i} cx={x} cy={ph * 560} r={6} fill="#f6f1c2" opacity={Math.sin(ph * Math.PI) * ez(f, s, s + 16)} />; })}
      </SV>
      <Tag a={r + 8} t="BUILT FOR THE DARK" x={960} y={60} size={84} color={GOLD} w={1300} />
      <Tag a={s + 10} t="LIGHT STILL GETS THROUGH" x={960} y={950} size={66} w={1400} />
    </Scene>
  );
};

// 20 · ENTERRAR Y COLGAR: semanas bajo tierra, meses al viento, el veneno que baja
export const BuryThenHang: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), b = at(p, "bury", 10), h = at(p, "hang", b + 70);
  const pz = 1 - 0.5 * ez(f, b + 20, h) - 0.5 * ez(f, h + 10, Math.max(h + 30, d - 20));
  return (
    <Scene d={d} bg={p.bg} tint="#0d0b08" floor="255,190,120">
      <SV>
        <rect x={0} y={590} width={1920} height={490} fill="#2b2118" />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={rnd(i, 2) * 960} cy={620 + rnd(i, 3) * 430} r={4 + rnd(i, 4) * 10} fill="#3b2e22" />)}
        <g opacity={ez(f, b, b + 12)} transform={`translate(0,${-(ez(f, h, h + 18)) * 500})`}><rect x={300} y={720} width={420} height={110} rx={26} fill="#d9cdb2" /><rect x={320} y={740} width={380} height={20} rx={10} fill="rgba(0,0,0,.14)" /></g>
        <g opacity={ez(f, h, h + 14)}>
          <path d="M1120,590 V180 H1800 V590 M1100,180 H1820" stroke="#6b5338" strokeWidth={22} fill="none" />
          {Array.from({ length: 6 }).map((_, i) => <g key={i} transform={`translate(${1190 + i * 108},190) rotate(${Math.sin(f / 26 + i) * 3})`}><line y2={40} stroke="#a58a64" strokeWidth={4} /><rect x={-26} y={40} width={52} height={250 + (i % 3) * 30} rx={14} fill="#d9cdb2" /></g>)}
        </g>
        <rect x={840} y={210} width={70} height={520} rx={12} fill="rgba(240,235,229,.14)" stroke={INK} strokeWidth={4} />
        <rect x={840} y={730 - 520 * pz} width={70} height={520 * pz} rx={12} fill={RED} />
      </SV>
      <Tag a={4} t="POISON" x={875} y={120} size={60} color={RED} w={360} />
      <Tag a={b + 14} t="WEEKS BURIED" x={510} y={380} size={72} color={GOLD} w={780} />
      <Tag a={h + 14} t="MONTHS HANGING" x={1460} y={80} size={72} color={GOLD} w={780} />
    </Scene>
  );
};

// 21 · ACEITE DE HÍGADO: barril que llena lámpara, máquina y pintura; dos récords; línea hasta los 60
export const LiverOil: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), l = at(p, "lamp", 8), g = at(p, "green", 110), n = at(p, "nor", g + 60), o = at(p, "over", n + 60);
  const num = (a: number, v: number) => Math.round(v * ez(f, a, a + 26)).toLocaleString("en-US");
  const Items: [string, number][] = [["LAMPS", l], ["MACHINERY", l + 22], ["PAINT", l + 44]];
  return (
    <Scene d={d} bg={p.bg} tint="#0d0b08" floor="255,190,120">
      <SV>
        <g transform="translate(150,260)">
          <rect width={250} height={330} rx={36} fill="#5b4227" stroke="#2a1d10" strokeWidth={8} />
          {[70, 260].map((y) => <rect key={y} x={-8} y={y} width={266} height={22} fill="#2a1d10" />)}
          <path d={`M250,170 H${250 + 190 * ez(f, l, l + 16)}`} stroke="#c49a2b" strokeWidth={22} />
        </g>
      </SV>
      {Items.map(([t, a], i) => <Tag key={t} a={a} t={t} x={610} y={230 + i * 110} size={72} color={GOLD} w={620} align="left" />)}
      <Tag a={g} t={`GREENLAND · ${num(g, 30000)}+ A YEAR`} x={150} y={660} size={64} color={INK} w={1500} align="left" />
      <Tag a={n} t={`NORWAY, 1948 · NEARLY ${num(n, 60000)}`} x={150} y={760} size={64} color={ORA} w={1500} align="left" />
      <Tag a={o} t="SYNTHETIC OIL: TRADE OVER BY THE 1960s" x={150} y={880} size={58} color={CY} w={1680} align="left" />
    </Scene>
  );
};

// 22 · ANTES DE PODER CRIAR: fila de tiburones sobre una regla de edad; los que estaban debajo de 156 quedan sin cría
export const NeverBred: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), l = at(p, "line", 30), g = at(p, "gray", l + 60);
  const X = (a: number) => 180 + a * 6.2;
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <line x1={120} x2={1800} y1={900} y2={900} stroke={INK} strokeWidth={5} />
        {[0, 50, 100, 150, 200, 250].map((a) => <g key={a}><line x1={X(a)} x2={X(a)} y1={886} y2={918} stroke={INK} strokeWidth={4} /><text x={X(a)} y={962} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill={INK}>{a}</text></g>)}
        {Array.from({ length: 24 }).map((_, i) => { const a = 40 + rnd(i, 3) * 210, y = 300 + (i % 6) * 95, young = a < 156, gr = young ? ez(f, g + i, g + 12 + i) : 0; return <g key={i} opacity={ez(f, 4 + i, 12 + i)}><Shark x={X(a)} y={y} s={0.2} t={f + i * 30} c={gr ? `rgb(${60 + gr * 130},${71 - gr * 10},${80 - gr * 16})` : "#7fa7b5"} /></g>; })}
        <line x1={X(156)} x2={X(156)} y1={lp(900, 210, ez(f, l, l + 20))} y2={900} stroke={GOLD} strokeWidth={8} />
      </SV>
      <Tag a={l + 8} t="MATURE AT ~156" x={X(156)} y={120} size={72} color={GOLD} w={900} />
      <Tag a={g + 30} t="LEFT OF THE LINE: NEVER BRED" x={560} y={990} size={46} color={RED} w={1000} />
    </Scene>
  );
};

// 23 · TRES GENERACIONES: 450 años en tres tramos y una barra que cae 30–49 %
export const ThreeGenerations: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), v = at(p, "vuln", 6), b = at(p, "bar", v + 50), g = at(p, "gens", b + 60);
  const low = ez(f, b + 16, b + 40), H = 460;
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <rect x={190} y={260} width={320} height={H} fill="rgba(240,235,229,.14)" stroke={INK} strokeWidth={4} rx={8} />
        <rect x={190} y={260 + H * 0.49 * low} width={320} height={H * (1 - 0.49 * low)} fill={CY} rx={8} opacity={ez(f, b, b + 10)} />
        <rect x={190} y={260 + H * 0.3 * low - 3} width={320} height={6} fill={RED} opacity={low} />
        <rect x={190} y={260 + H * 0.49 * low - 3} width={320} height={6} fill={RED} opacity={low} />
        {[0, 1, 2].map((i) => { const a = g + i * 16, k = ez(f, a, a + 18); return <g key={i}><rect x={700 + i * 370} y={520} width={350 * k} height={90} fill={["#7fd1e8", "#a9e5c8", GOLD][i]} rx={8} /><text x={870 + i * 370} y={582} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill="#0a1218" opacity={ez(f, a + 10, a + 20)}>~150 YR</text></g>; })}
      </SV>
      <Tag a={v} t="IUCN 2020: VULNERABLE" x={960} y={70} size={84} color={RED} w={1400} />
      <Tag a={b + 34} t="DOWN 30–49 % (SUSPECTED)" x={350} y={770} size={48} color={INK} w={640} />
      <Tag a={g + 40} t="3 GENERATIONS ≈ 450 YEARS" x={1250} y={380} size={70} color={GOLD} w={1160} />
    </Scene>
  );
};

// 24 · DOS VELOCIDADES: dos carriles; la foca cruza, el tiburón apenas se mueve
export const TwoSpeeds: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "go", 16), t = Math.max(0, f - a), sx = 140 + (t * 26) % 2100;
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220" drift={0.5}>
      <SV>
        {[300, 720].map((y) => <line key={y} x1={0} x2={1920} y1={y + 140} y2={y + 140} stroke="rgba(240,235,229,.2)" strokeWidth={3} strokeDasharray="30 20" />)}
        <Seal x={sx} y={300} s={1.05} t={f} />
        <Shark x={320 + t * 0.42} y={720} s={0.9} t={f} />
      </SV>
      <Tag a={a} t="SEAL · SEVERAL m/s" x={960} y={110} size={68} color={CY} w={1400} />
      <Tag a={a + 6} t="SHARK · TOP BURST 0.74 m/s" x={1200} y={880} size={62} color={GOLD} w={1300} />
    </Scene>
  );
};

// 25 · INVENTARIO DE ESTÓMAGO: silueta y lo hallado adentro como fichas (sin restos)
export const StomachList: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "fish", 10), at(p, "seal", 60), at(p, "big", 130)];
  const X: [string, number, string][] = [["FISH", A[0], CY], ["SEALS", A[1], GOLD], ["REINDEER (REPORTED)", A[2], ORA], ["A POLAR BEAR (REPORTED)", A[2] + 24, ORA]];
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV><g opacity={0.85}><Shark x={960} y={300} s={2.1} t={f * 0.5} /></g>
        <ellipse cx={1040} cy={320} rx={330 * ez(f, 2, 24)} ry={92 * ez(f, 2, 24)} fill="rgba(241,69,54,.2)" stroke={RED} strokeWidth={5} strokeDasharray="14 12" />
      </SV>
      {X.map(([t, a, c], i) => <Tag key={t} a={a} t={t} x={i % 2 ? 1010 : 160} y={640 + Math.floor(i / 2) * 150} size={i < 2 ? 88 : 56} color={c} w={880} align="left" />)}
    </Scene>
  );
};

// 26 · IDEA 1, EMBOSCADA: desde arriba el lomo se pierde; la cámara muestra lo que ve la foca
export const AmbushFromAbove: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "dark", 30), t = at(p, "never", d - 70), k = ez(f, a, a + 40);
  return (
    <Scene d={d} tint="#02060a" floor="30,70,90">
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#5aa7c4 0%,#123a52 34%,#02060a 72%)" }} />
      <SV>
        <Seal x={lp(460, 780, k)} y={240} s={0.8} t={f} rot={14} />
        <g opacity={lp(0.95, 0.42, ez(f, a + 10, a + 60))}><Shark x={1040} y={830} s={1.6} t={f} c="#2f3b44" /></g>
      </SV>
      <Tag a={8} t="IDEA 1 · AMBUSH" x={100} y={50} size={70} color={GOLD} w={900} align="left" />
      <Tag a={a + 26} t="DARK BACK · DARK WATER" x={1300} y={480} size={60} color={CY} w={960} />
      <Tag a={t} t="NEVER SEEN HAPPENING" x={960} y={960} size={70} color={RED} w={1300} />
    </Scene>
  );
};

// 27 · IDEA 2, LA FOCA QUE DUERME: colgando inmóvil, un metrónomo de siete segundos, sello SIN PRUEBA
export const SleepingSeal: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "still", 20), u = at(p, "unproven", d - 80), bt = Math.sin(f * (2 * Math.PI) / 210);
  return (
    <Scene d={d} tint="#02070c" floor="30,70,90" drift={0.4}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#123a52 0%,#061a28 44%,#02060a 100%)" }} />
      <SV>
        <rect x={0} y={0} width={1920} height={90} fill="#c6dfe9" opacity={0.9} />
        <Seal x={700} y={360 + Math.sin(f / 60) * 6} s={0.95} rot={-76} c="#59636b" />
        {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={684 + Math.sin(f / 16 + i) * 5} cy={200 - ((f * 1.2 + i * 26) % 120)} r={4 + i % 3} fill="rgba(220,240,250,.55)" />)}
        <Shark x={1240 - f * 0.05} y={860} s={1.3} t={f} c="#232c33" flip />
        <g transform="translate(1660,300)"><circle r={120} fill="rgba(3,10,16,.8)" stroke={INK} strokeWidth={4} /><line y2={-98} stroke={GOLD} strokeWidth={9} strokeLinecap="round" transform={`rotate(${bt * 52})`} /><circle r={12} fill={GOLD} /></g>
      </SV>
      <Tag a={8} t="IDEA 2 · ASLEEP" x={100} y={120} size={70} color={GOLD} w={900} align="left" />
      <Tag a={a + 20} t="1 STROKE / 7 SECONDS" x={1660} y={450} size={40} w={460} />
      <Tag a={u} t="UNPROVEN" x={960} y={500} size={190} color={RED} rot={-5} w={1300} />
    </Scene>
  );
};

// 28 · IDEA 3, YA ESTABAN MURIENDO: tres causas colgadas de la red, y qué no explica
export const NetAndWeak: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "hurt", 10), at(p, "dis", 50), at(p, "net", 90)], b = at(p, "but", d - 70);
  const L = ["HURT", "SICK", "DROWNED IN NETS"];
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M${i * 80 - 40},0 Q${i * 80 + Math.sin(f / 40 + i) * 22},540 ${i * 80 + 40},1080`} stroke="rgba(226,232,236,.1)" strokeWidth={3} fill="none" />)}
        {Array.from({ length: 13 }).map((_, i) => <path key={i} d={`M0,${i * 90} Q960,${i * 90 + Math.sin(f / 36 + i) * 26} 1920,${i * 90}`} stroke="rgba(226,232,236,.1)" strokeWidth={3} fill="none" />)}
        {L.map((_, i) => <g key={i} opacity={ez(f, A[i], A[i] + 12)}><Seal x={360 + i * 600} y={430 + Math.sin(f / 50 + i) * 8} s={0.8} c="#3b454c" /></g>)}
      </SV>
      <Tag a={8} t="IDEA 3 · ALREADY DYING" x={960} y={60} size={78} color={GOLD} w={1400} />
      {L.map((t, i) => <Tag key={t} a={A[i] + 8} t={t} x={360 + i * 600} y={600} size={60} w={600} />)}
      <Tag a={b} t="DOESN'T EXPLAIN EVERYTHING" x={960} y={800} size={78} color={RED} w={1500} />
    </Scene>
  );
};

// 29 · NI UN CUADRO: tira de película que corre vacía; lo que hay arriba, lo que falta abajo
export const NoFootage: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "st", 6), at(p, "tags", 30), at(p, "th", 54)], z = at(p, "none", 10);
  const K = ["STOMACHS", "TAG DATA", "THEORIES"];
  return (
    <Scene d={d} bg={p.bg} tint="#0a0a0a" floor="255,190,120" drift={0.4}>
      <SV>
        <g transform={`translate(${-(f * 7) % 340},0)`}>
          <rect x={-40} y={480} width={2500} height={300} fill="#141414" />
          {Array.from({ length: 9 }).map((_, i) => <g key={i}><rect x={i * 340} y={520} width={300} height={220} fill="#050505" stroke="#3a3a3a" strokeWidth={4} /></g>)}
          {Array.from({ length: 80 }).map((_, i) => <g key={i}><rect x={i * 34} y={492} width={20} height={16} rx={3} fill="#3a3a3a" /><rect x={i * 34} y={752} width={20} height={16} rx={3} fill="#3a3a3a" /></g>)}
        </g>
      </SV>
      {K.map((t, i) => <Tag key={t} a={A[i]} t={`✓ ${t}`} x={170 + i * 570} y={250} size={66} color={CY} w={640} align="left" />)}
      <Tag a={z} t="HEALTHY SEAL TAKEN: 0 CLEAR SCENES" x={960} y={880} size={68} color={RED} w={1700} />
    </Scene>
  );
};

// 30 · LO QUE SABEMOS Y LO QUE NO: tres tildes, una incógnita; el coletazo sigue
export const ThreeKnownOneNot: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), A = [at(p, "a", 6), at(p, "b", 40), at(p, "c", 80), at(p, "q", 120)];
  const L: [string, string, string][] = [["HOW OLD", "✓", CY], ["HOW SLOW", "✓", CY], ["CAN IT SEE", "✓", CY], ["HOW IT CATCHES A SEAL", "?", RED]];
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV><g opacity={0.6}><Shark x={1420} y={700} s={1.1} t={f} /></g></SV>
      {L.map(([t, m, c], i) => <div key={t} style={{ position: "absolute", left: 140, top: 150 + i * 200, display: "flex", gap: 40, alignItems: "center", opacity: ez(f, A[i], A[i] + 10), transform: `translateX(${(1 - sp(f, A[i])) * -80}px)` }}>
        <div style={{ width: 130, height: 130, borderRadius: 18, background: c, color: "#051018", textAlign: "center", lineHeight: "130px", fontFamily: F, fontWeight: 900, fontSize: 96 }}>{m}</div>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: i === 3 ? 84 : 92, color: i === 3 ? RED : INK, textShadow: "0 4px 16px rgba(0,0,0,.8)" }}>{t}</div>
      </div>)}
    </Scene>
  );
};

// 31 · SIN BICHOS: la foca entera en el fondo, los carroñeros que nunca llegan
export const NoCrawlers: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), c = at(p, "cross", 40), l = at(p, "line", 180), k = ez(f, 0, c + 20), o = lp(1, 0.6, ez(f, c + 10, c + 34)), rg = ez(f, c + 14, c + 30);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220" drift={0.3}>
      <SV>
        <path d="M0,760 C300,730 620,780 960,760 C1300,742 1620,780 1920,752 L1920,1080 L0,1080 Z" fill="#10202a" />
        <Seal x={960} y={690} s={1.7} t={f} c="#7a858e" />
        <ellipse cx={960} cy={720} rx={560} ry={230} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="22 20" opacity={rg} />
        {Array.from({ length: 60 }).map((_, i) => { const a = (i / 60) * Math.PI * 2, r0 = 860 + rnd(i, 3) * 240, r1 = 430 + rnd(i, 4) * 160, r = lp(r0, r1, k), j = Math.sin(f / 4 + i) * 7;
          return <ellipse key={i} cx={960 + Math.cos(a) * r} cy={760 + Math.abs(Math.sin(a)) * 180 + j} rx={13} ry={6} fill="#c9b48c" opacity={o * 0.9} />; })}
      </SV>
      <Tag a={6} t="SCAVENGERS" x={330} y={230} size={60} color={GOLD} w={520} />
      <Tag a={c + 16} t="NEVER GOT THERE" x={1400} y={230} size={72} color={RED} w={860} />
      <Tag a={l} t="EATEN SOON AFTER DEATH — OR BEFORE IT" x={960} y={920} size={62} color={CY} w={1720} />
    </Scene>
  );
};

// 32 · AL REVÉS: la flecha del miedo se invierte (tiburón→gente: 0 · gente→tiburón: 300 años)
export const OtherWay: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), b = at(p, "b", 90), s = ez(f, b, b + 26), w = sp(f, b);
  return (
    <Scene d={d} bg={p.bg} tint="#10080a" floor="255,150,120">
      <SV>
        <Shark x={1500} y={420} s={0.8} t={f} c="#59646c" flip />
        <g transform="translate(250,300)" fill={INK}><circle cx={60} cy={0} r={50} /><path d="M0,70 h120 l20,190 h-160 Z" /></g>
        <g opacity={1 - s * 0.72}><path d="M1130,350 L470,350" stroke={CY} strokeWidth={8} strokeDasharray="20 22" /><path d="M500,322 L450,350 L500,378 Z" fill={CY} /></g>
        <g opacity={s}><path d={`M430,600 L${lp(430, 1190, w)},600`} stroke={RED} strokeWidth={44} strokeLinecap="round" /><path d="M1185,538 L1300,600 L1185,662 Z" fill={RED} opacity={w} /></g>
      </SV>
      <Tag a={6} t="ATTACKS ON PEOPLE: 0 DOCUMENTED" x={800} y={230} size={58} color={CY} w={1200} />
      <Tag a={b + 14} t="PEOPLE → SHARK: ABOUT 300 YEARS" x={880} y={790} size={78} color={RED} w={1500} />
    </Scene>
  );
};
