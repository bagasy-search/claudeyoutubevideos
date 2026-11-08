// dur5na — componentes únicos 11-20 (curtidor, salitrero, sombrerero, las 5 cosas, trampero de mina).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV, Tu, Shovel, Barrow, Bucket, Sting, Meter } from "./pkit";

type UP = { d: number; p: any };

// 11 · LA RECETA DEL POZO BLANCO: cuatro frascos se vuelcan uno tras otro en el pozo; la mezcla se pone lechosa = amoníaco
const JARS = [["CAL", "#f1efe8"], ["SAL", "#dfe6ea"], ["AGUA", "#7fb2d4"], ["PALOMA", "#8a8576"]] as const;
export const RecetaFez: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const ks = ["cal", "sal", "agua", "paloma"].map((k, i) => at(p, k, 20 + i * 24));
  const milk = ez(f, ks[0], ks[3] + 20), am = ez(f, at(p, "amoniaco", ks[3] + 30), at(p, "amoniaco", ks[3] + 30) + 10);
  return (
    <Scene d={d} bg={p.bg} floor="255,220,170" tint="#140e09">
      <SV>
        <ellipse cx={960} cy={820} rx={460} ry={110} fill="#8b6c48" />
        <ellipse cx={960} cy={800} rx={420} ry={90} fill={`rgb(${Math.round(120 + 120 * milk)},${Math.round(110 + 120 * milk)},${Math.round(90 + 120 * milk)})`} />
        {[0, 1, 2].map((i) => { const ph = ((f + i * 25) % 75) / 75; return <ellipse key={i} cx={960} cy={800} rx={60 + ph * 360} ry={12 + ph * 76} fill="none" stroke="#fff" strokeWidth={3} opacity={(1 - ph) * milk} />; })}
        {JARS.map((j, i) => { const t = ez(f, ks[i] - 10, ks[i] + 6), x = 420 + i * 360, y = 330;
          const pour = f > ks[i] && f < ks[i] + 26;
          return <g key={i}>
            <g transform={`translate(${x},${y}) rotate(${t * 110})`}><path d="M-60,-90 L60,-90 L70,80 Q0,110 -70,80 Z" fill="#c78a4e" stroke="#6e4524" strokeWidth={5} /><rect x={-40} y={-120} width={80} height={36} rx={8} fill="#a56f3c" /></g>
            {pour && <path d={`M${x + 90},${y + 40} Q${(x + 960) / 2},${y + 200} 960,780`} stroke={j[1]} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.95} />}
            <text x={x} y={y + 190} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill={INK} opacity={t}>{j[0]}</text>
          </g>; })}
      </SV>
      <Tu x={1620} y={880} s={1.3} arms="up" op={ez(f, 4, 16)} />
      <Tag a={at(p, "amoniaco", ks[3] + 30)} t="= AMONÍACO" x={960} y={600} size={96} color="#cfe68a" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 36, color: ORA, opacity: am }}>ablanda la piel… y la tuya también</div>
    </Scene>
  );
};

// 12 · LA ORDEN DE LA CORONA: el pergamino se desenrolla con el sello real; cuatro lugares reciben el sello «SIN PERMISO»
const PLACES = ["ESTABLO", "PALOMAR", "CORRAL", "CASA"];
export const OrdenCorona: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const un = ez(f, 6, 40), seal = sp(f, 44, 1, 9);
  const ks = ["establo", "palomar", "corral", "casas"].map((k, i) => at(p, k, 70 + i * 18));
  const sinp = at(p, "permiso", ks[3] + 20);
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" tint="#120d07">
      <div style={{ position: "absolute", left: 180, top: 140, width: 640, height: 760 * un, overflow: "hidden", background: "linear-gradient(#efe0bb,#d8c08c)", borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
        <div style={{ padding: "50px 56px", fontFamily: "Georgia, serif", color: "#3b2a14" }}>
          <div style={{ fontSize: 46, fontWeight: 700, textAlign: "center", letterSpacing: 2 }}>BY THE QUEENE</div>
          {Array.from({ length: 11 }).map((_, i) => <div key={i} style={{ height: 12, margin: "24px 0", background: "rgba(59,42,20,.45)", width: `${70 + rnd(i, 2) * 30}%`, borderRadius: 4 }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, top: 120, width: 680, height: 50, borderRadius: 25, background: "linear-gradient(#b79762,#8a6a3a)" }} />
      <div style={{ position: "absolute", left: 160, top: 120 + 760 * un, width: 680, height: 50, borderRadius: 25, background: "linear-gradient(#b79762,#8a6a3a)" }} />
      <div style={{ position: "absolute", left: 610, top: 700, width: 150, height: 150, borderRadius: 75, background: "radial-gradient(circle at 40% 35%, #d23b2a, #7a140c)", transform: `scale(${seal})`, opacity: seal > 0.05 ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 56, color: "#f6c7b8", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }}>ER</div>
      {PLACES.map((pl, i) => { const o = ez(f, ks[i] - 6, ks[i] + 4), st = sp(f, sinp + i * 5, 0.7, 8);
        return <div key={i} style={{ position: "absolute", left: 1000 + (i % 2) * 430, top: 200 + Math.floor(i / 2) * 360, width: 380, height: 300, opacity: o, borderRadius: 18, background: "rgba(20,14,8,.75)", border: "3px solid rgba(237,178,105,.5)", fontFamily: F }}>
          <svg width={380} height={210}>{i === 0 && <g><path d="M60,190 L60,90 L190,30 L320,90 L320,190 Z" fill="none" stroke={ORA} strokeWidth={7} /><rect x={150} y={110} width={80} height={80} fill="none" stroke={ORA} strokeWidth={7} /></g>}
            {i === 1 && <g><rect x={120} y={70} width={140} height={120} fill="none" stroke={ORA} strokeWidth={7} /><path d="M100,70 L190,20 L280,70" fill="none" stroke={ORA} strokeWidth={7} />{[0, 1, 2].map((k) => <circle key={k} cx={150 + k * 40} cy={110} r={11} fill="none" stroke={ORA} strokeWidth={5} />)}</g>}
            {i === 2 && <g>{[0, 1, 2, 3, 4].map((k) => <line key={k} x1={60 + k * 65} y1={60} x2={60 + k * 65} y2={190} stroke={ORA} strokeWidth={7} />)}<line x1={50} y1={100} x2={330} y2={100} stroke={ORA} strokeWidth={7} /><line x1={50} y1={150} x2={330} y2={150} stroke={ORA} strokeWidth={7} /></g>}
            {i === 3 && <g><path d="M80,190 L80,100 L190,40 L300,100 L300,190 Z" fill="none" stroke={ORA} strokeWidth={7} /><rect x={170} y={130} width={40} height={60} fill="none" stroke={ORA} strokeWidth={6} /><rect x={110} y={115} width={36} height={30} fill="none" stroke={ORA} strokeWidth={5} /></g>}</svg>
          <div style={{ textAlign: "center", fontSize: 42, fontWeight: 900, color: INK }}>{pl}</div>
          <div style={{ position: "absolute", left: 30, top: 90, transform: `rotate(-12deg) scale(${st > 0.02 ? 2 - st : 0})`, opacity: st, border: `6px solid ${RED}`, color: RED, fontSize: 46, fontWeight: 900, padding: "4px 18px", borderRadius: 8, background: "rgba(10,6,4,.6)" }}>SIN PERMISO</div>
        </div>; })}
      <Tu x={980} y={1060} s={0.9} arms="up" op={ez(f, 10, 20)} />
    </Scene>
  );
};

// 13 · DEL ESTABLO A LA PÓLVORA: cavas la tierra, la cargas, la hierves con ceniza; del caldero salen cristales blancos
export const CalderoSalitre: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const stir = Math.sin(f / 8) * 16;
  const cr = ez(f, at(p, "cristales", d * 0.55), at(p, "cristales", d * 0.55) + 30);
  const steps = [["CAVAS", 6], ["CARGAS", 30], ["HIERVES", 56], ["SALITRE", at(p, "salitre", 90)]] as const;
  return (
    <Scene d={d} bg={p.bg} floor="255,140,60" tint="#120a06">
      <SV>
        <rect x={0} y={860} width={1920} height={220} fill="#2a1d12" />
        <path d="M120,860 Q260,800 400,860 Z" fill="#4a3a26" />
        <Shovel x={300} y={790} rot={-30 + Math.sin(f / 6) * 14} />
        <Barrow x={620} y={860} s={1} load={0.9} col="#4a3a26" />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${960 + (i - 3) * 50},960 q10,-30 0,-60 q-10,-30 0,-60`} stroke={["#ff7a2a", "#ffb53a", "#ff9a2a"][i % 3]} strokeWidth={14} fill="none" opacity={0.6 + 0.4 * Math.sin(f / 3 + i)} />)}
        <path d="M760,700 L1160,700 L1130,880 Q960,940 790,880 Z" fill="#2e2e30" stroke="#121214" strokeWidth={6} />
        <ellipse cx={960} cy={700} rx={200} ry={34} fill="#6b5a40" />
        <line x1={1050} y1={560} x2={970 + stir} y2={720} stroke="#7a5532" strokeWidth={12} strokeLinecap="round" />
        {Array.from({ length: 14 }).map((_, i) => { const ph = ((f / 70) + rnd(i, 1)) % 1; return <circle key={i} cx={900 + rnd(i, 2) * 140 + Math.sin(f / 15 + i) * 30} cy={680 - ph * 520} r={30 + ph * 80} fill="rgba(220,220,210,.13)" opacity={Math.sin(ph * Math.PI)} />; })}
        {Array.from({ length: 16 }).map((_, i) => { const x = 1350 + (i % 4) * 90, y = 760 - Math.floor(i / 4) * 70; return <path key={i} d={`M${x},${y} l24,-40 l24,40 l-24,22 Z`} fill="#f4f6f8" stroke="#a9b6c0" strokeWidth={3} opacity={ez(f, at(p, "cristales", d * 0.55) + i * 3, at(p, "cristales", d * 0.55) + i * 3 + 8) * (0.8 + 0.2 * Math.sin(f / 4 + i))} />; })}
      </SV>
      <Tu x={1150} y={880} s={1.3} arms="spear" flip rot={-6} />
      {steps.map(([t, a], i) => <div key={i} style={{ position: "absolute", left: 120 + i * 440, top: 90, fontFamily: F, fontWeight: 900, fontSize: 50, color: i === 3 ? INK : ORA, opacity: ez(f, a, a + 8) }}>{`${i + 1}. ${t}`}</div>)}
      <Tag a={at(p, "polvora", 20)} t="ingrediente principal de la PÓLVORA" x={1500} y={880} size={36} w={760} color={INK} />
      <Motes c="255,200,150" up />
    </Scene>
  );
};

// 14 · SECRETAGE: el cepillo pinta de naranja el pelo de conejo; del vapor suben gotitas de mercurio hacia tu cara
export const Secretage: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const brush = ez(f, at(p, "untaba", 20), at(p, "untaba", 20) + 90), bx = 380 + brush * 1060;
  const vap = ez(f, at(p, "vapor", d * 0.5) - 10, at(p, "vapor", d * 0.5) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="255,160,80" tint="#110b07">
      <SV>
        <rect x={260} y={640} width={1400} height={70} rx={12} fill="#5b3b22" /><rect x={300} y={710} width={40} height={300} fill="#3b2614" /><rect x={1580} y={710} width={40} height={300} fill="#3b2614" />
        <defs><linearGradient id="pelt" x1="0" x2="1"><stop offset={0} stopColor="#e1864a" /><stop offset={Math.max(0.001, brush)} stopColor="#f08c32" /><stop offset={Math.min(0.999, brush + 0.001)} stopColor="#c9b8a4" /><stop offset={1} stopColor="#b8a690" /></linearGradient></defs>
        <path d="M360,640 Q420,520 900,540 Q1400,520 1460,640 Z" fill="url(#pelt)" />
        {Array.from({ length: 60 }).map((_, i) => { const x = 380 + i * 18; return <line key={i} x1={x} y1={600 - Math.sin(i) * 20} x2={x + 6} y2={570 - Math.sin(i) * 20} stroke={x < bx ? "#b8561c" : "#8c7a66"} strokeWidth={3} />; })}
        <g transform={`translate(${bx},${520 + Math.sin(f / 4) * 10})`}><rect x={-60} y={-20} width={120} height={36} rx={8} fill="#6e4b2a" /><rect x={-10} y={-90} width={20} height={72} fill="#8a6a44" />{Array.from({ length: 10 }).map((_, i) => <line key={i} x1={-54 + i * 12} y1={16} x2={-54 + i * 12} y2={40} stroke="#d27a2a" strokeWidth={4} />)}</g>
        {Array.from({ length: 22 }).map((_, i) => { const ph = ((f / 80) + rnd(i, 1)) % 1; const x0 = 500 + rnd(i, 2) * 900; const x = x0 + (1520 - x0) * ph * 0.8 * vap, y = 560 - ph * 300;
          return <circle key={i} cx={x} cy={y} r={9} fill="url(#hg)" opacity={vap * Math.sin(ph * Math.PI)} />; })}
        <defs><radialGradient id="hg"><stop offset={0} stopColor="#ffffff" /><stop offset={0.5} stopColor="#c3cbd2" /><stop offset={1} stopColor="#6f7a83" /></radialGradient></defs>
      </SV>
      <Tu x={1640} y={640} s={1.7} flip rot={-4} />
      <Tag a={at(p, "secretage", 40)} t="«SECRETAGE»" x={960} y={110} size={92} color={ORA} />
      <Tag a={at(p, "mercurio", 30)} t="nitrato de MERCURIO" x={960} y={230} size={46} color="#c3cbd2" />
      <Tag a={at(p, "respirabas", d * 0.7)} t="y tú lo respiras" x={1500} y={330} size={44} color={RED} w={600} />
    </Scene>
  );
};

// 15 · LA TAZA QUE TIEMBLA: los años pasan en el contador; tu mano con la taza tiembla cada vez más; el té se derrama
export const TazaTiembla: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const yrs = Math.max(1, Math.round(lin(f, 10, d - 20) * 20)), amp = Math.pow(yrs / 20, 1.6) * 22;
  const jx = Math.sin(f * 1.9) * amp, jy = Math.cos(f * 2.3) * amp * 0.6;
  return (
    <Scene d={d} bg={p.bg} floor="241,69,54" tint="#0e0b0a">
      <SV>
        <g transform={`translate(${960 + jx},${560 + jy}) rotate(${jx * 0.3})`}>
          <ellipse cx={0} cy={160} rx={260} ry={46} fill="#e9e3da" stroke="#b9b0a4" strokeWidth={5} />
          <path d="M-170,-60 L170,-60 Q160,150 0,150 Q-160,150 -170,-60 Z" fill="#f3eee6" stroke="#b9b0a4" strokeWidth={6} />
          <path d="M170,-10 Q260,0 240,70 Q220,120 150,100" fill="none" stroke="#b9b0a4" strokeWidth={18} />
          <ellipse cx={0} cy={-60} rx={170} ry={30} fill="#8a4a1e" />
          {amp > 8 && Array.from({ length: 5 }).map((_, i) => { const ph = ((f / 20) + i * 0.2) % 1; return <circle key={i} cx={(i % 2 ? 1 : -1) * (150 + ph * 60)} cy={-50 + ph * 220} r={8} fill="#8a4a1e" opacity={1 - ph} />; })}
        </g>
      </SV>
      <Tu x={1470} y={940} s={1.5} arms="up" rot={Math.sin(f * 1.7) * amp * 0.15} />
      <div style={{ position: "absolute", left: 120, top: 360, fontFamily: F }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 4, color: "rgba(240,235,229,.7)" }}>AÑOS EN LA FÁBRICA</div>
        <div style={{ fontSize: 220, fontWeight: 900, color: yrs > 12 ? RED : INK, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{yrs}</div>
      </div>
      <Tag a={at(p, "temblor", d * 0.5)} t="EL TEMBLOR DE DANBURY" x={960} y={90} size={76} color={ORA} />
    </Scene>
  );
};

// 16 · LAS 5 COSAS: cinco losas se dan vuelta en su palabra; tú caminas por delante de cada una
const FIVE = [["EL AGUA", "uno"], ["LAS CORTADAS", "dos"], ["EL AIRE", "tres"], ["EL HAMBRE", "cuatro"], ["EL CANSANCIO", "cinco"]] as const;
export const CincoAmenazas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const ks = FIVE.map((x, i) => at(p, x[1], 20 + i * 60));
  const cur = ks.filter((k) => f >= k).length - 1;
  const px = 190 + Math.max(0, cur) * 385 + Math.min(1, Math.max(0, (f - (ks[cur] ?? 0)) / 20)) * 0;
  const ic = (i: number, c: string) => {
    const st = { fill: "none", stroke: c, strokeWidth: 9, strokeLinecap: "round", strokeLinejoin: "round" } as const;
    return [<path key={0} d="M70,20 Q20,90 40,120 Q70,150 100,120 Q120,90 70,20 Z" {...st} />, <g key={1}><path d="M30,120 L110,40" {...st} /><path d="M50,130 L120,60" {...st} strokeDasharray="10 10" /></g>,
      <g key={2}><path d="M20,60 Q60,30 100,60 T130,60" {...st} /><path d="M20,100 Q60,70 100,100 T130,100" {...st} /></g>, <g key={3}><circle cx={70} cy={80} r={48} {...st} /><path d="M40,80 L100,80" {...st} /></g>,
      <g key={4}><circle cx={70} cy={80} r={50} {...st} /><path d="M70,80 L70,46 M70,80 L96,92" {...st} /></g>][i];
  };
  return (
    <Scene d={d} bg={p.bg} floor="237,178,105" tint="#0e0a08" push={0.025}>
      {FIVE.map((x, i) => { const k = ez(f, ks[i] - 4, ks[i] + 10); const on = i === cur;
        return <div key={i} style={{ position: "absolute", left: 90 + i * 360, top: 230, width: 330, height: 440, perspective: 900 }}>
          <div style={{ width: "100%", height: "100%", transform: `rotateY(${180 - 180 * k}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 18, background: on ? "linear-gradient(#5a1c12,#24100a)" : "linear-gradient(#2a1d14,#150e09)", border: `4px solid ${on ? RED : "rgba(237,178,105,.55)"}`, boxShadow: on ? `0 0 40px ${RED}88` : "none", fontFamily: F, textAlign: "center" }}>
              <div style={{ marginTop: 26, fontSize: 70, fontWeight: 900, color: on ? RED : ORA }}>{i + 1}</div>
              <svg width={140} height={150} style={{ marginTop: 10 }}>{ic(i, on ? INK : "rgba(240,235,229,.7)")}</svg>
              <div style={{ marginTop: 18, fontSize: 36, fontWeight: 900, color: INK, padding: "0 10px" }}>{x[0]}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 18, background: "#1a120c", border: "4px solid rgba(237,178,105,.3)" }} />
          </div>
        </div>; })}
      <Tu x={px + 100} y={940} s={0.9} walk />
      <Tag a={6} t="LO QUE TE MATARÍA PRIMERO" x={960} y={90} size={70} color={INK} w={1700} />
    </Scene>
  );
};

// 17 · LA ÚLTIMA HORA: el anillo de la jornada se llena a 12, 14, 16 horas; la última hora late en rojo: ahí llega el accidente
export const RelojJornada: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const h = 16 * ez(f, 10, d * 0.7), last = ez(f, at(p, "ultima", d * 0.7), at(p, "ultima", d * 0.7) + 8);
  const R = 300, arc = (a0: number, a1: number) => { const p0 = [960 + R * Math.sin(a0), 540 - R * Math.cos(a0)], p1 = [960 + R * Math.sin(a1), 540 - R * Math.cos(a1)]; return `M${p0[0]},${p0[1]} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0},1 ${p1[0]},${p1[1]}`; };
  const toA = (x: number) => (x / 24) * Math.PI * 2;
  return (
    <Scene d={d} bg={p.bg} floor="241,69,54" tint="#0b0909">
      <SV>
        <circle cx={960} cy={540} r={R} fill="none" stroke="rgba(240,235,229,.14)" strokeWidth={60} />
        {h > 0.05 && <path d={arc(0, toA(Math.min(h, 15)))} fill="none" stroke={ORA} strokeWidth={60} />}
        {h > 15 && <path d={arc(toA(15), toA(h))} fill="none" stroke={RED} strokeWidth={60 + last * 16 * (0.5 + 0.5 * Math.sin(f / 3))} />}
        {[12, 14, 16].map((x) => { const a = toA(x); return <g key={x} opacity={h >= x ? 1 : 0.2}><line x1={960 + 250 * Math.sin(a)} y1={540 - 250 * Math.cos(a)} x2={960 + 350 * Math.sin(a)} y2={540 - 350 * Math.cos(a)} stroke={INK} strokeWidth={5} /><text x={960 + 410 * Math.sin(a)} y={555 - 410 * Math.cos(a)} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill={INK}>{x} h</text></g>; })}
      </SV>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 120, color: last > 0.5 ? RED : INK, fontVariantNumeric: "tabular-nums" }}>{Math.floor(h)} h</div>
      <Tu x={1580} y={930} s={1.2} rot={Math.sin(f / 14) * 7} />
      <Tag a={at(p, "ultima", d * 0.7) + 4} t="la última hora" x={960} y={70} size={64} color={RED} />
    </Scene>
  );
};

// 18 · LA CANASTA AL POZO: a las 4 de la mañana bajas en una canasta por el pozo; el contador de profundidad pasa los cientos de metros
export const CanastaPozo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const k = ez(f, 16, d - 8), dep = Math.round(k * 300);
  const ty = -k * 1800;
  return (
    <Scene d={d} bg={p.bg} floor="255,180,90" tint="#050403">
      <AbsoluteFill style={{ transform: `translateY(${ty}px)` }}>
        <SV>
          <rect x={0} y={0} width={1920} height={300} fill="#1a2433" />
          <path d="M700,300 L700,3000 M1220,300 L1220,3000" stroke="#2a211a" strokeWidth={40} />
          <rect x={720} y={300} width={480} height={2700} fill="#0b0806" />
          {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M0,${360 + i * 70} L700,${380 + i * 70} M1220,${370 + i * 70} L1920,${355 + i * 70}`} stroke={["#2e241b", "#3a2d21", "#241c15"][i % 3]} strokeWidth={30} />)}
          <line x1={960} y1={0} x2={960} y2={560 + k * 1800} stroke="#8a7a62" strokeWidth={5} />
          <rect x={620} y={180} width={680} height={40} fill="#4a3a28" /><circle cx={960} cy={150} r={70} fill="none" stroke="#6b5a40" strokeWidth={14} />
        </SV>
      </AbsoluteFill>
      <SV>
        <g transform={`translate(960,${700 + Math.sin(f / 9) * 6})`}>
          <path d="M-110,-70 L110,-70 L90,60 L-90,60 Z" fill="#7a5a34" stroke="#3a2614" strokeWidth={5} />
          {[-40, -10, 20].map((yy) => <line key={yy} x1={-104} y1={yy} x2={104} y2={yy} stroke="#3a2614" strokeWidth={3} />)}
          <path d="M-110,-70 L0,-160 L110,-70" fill="none" stroke="#8a7a62" strokeWidth={4} />
          <circle cx={30} cy={-60} r={60} fill="rgba(255,200,110,.18)" />
        </g>
      </SV>
      <Tu x={950} y={650 + Math.sin(f / 9) * 6} s={0.65} />
      <Meter x={1400} y={300} w={360} h={18} k={k} col={ORA} label="BAJO TIERRA" val={`${dep} m`} size={110} />
      <div style={{ position: "absolute", left: 120, top: 300, fontFamily: F, fontWeight: 900, fontSize: 120, color: INK, opacity: ez(f, 4, 12) }}>4:00</div>
      <Tag a={at(p, "anos", 10)} t="TIENES 8 AÑOS" x={330} y={460} size={48} color={ORA} w={500} />
    </Scene>
  );
};

// 19 · LA PUERTA DEL AIRE: el aire corre por el túnel; viene el carro, abres, pasa, cierras; si la dejas abierta, el gas se junta
export const PuertaAire: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const C = at(p, "carro", 40), cx = -300 + ez(f, C, C + 70) * 2400;
  const open = f < C + 20 ? ez(f, C, C + 18) : 1 - ez(f, C + 70, C + 88);
  const G = at(p, "abierta", d * 0.65), gas = ez(f, G, G + 40);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,90" tint="#070605">
      <SV>
        <path d="M0,260 Q960,180 1920,260 L1920,900 L0,900 Z" fill="#1b1611" />
        <path d="M0,900 L1920,900 L1920,1080 L0,1080 Z" fill="#2a2118" />
        <line x1={0} y1={880} x2={1920} y2={880} stroke="#6b5a40" strokeWidth={8} /><line x1={0} y1={900} x2={1920} y2={900} stroke="#6b5a40" strokeWidth={8} />
        {Array.from({ length: 10 }).map((_, i) => { const x = ((i * 260 + f * 7) % 2100) - 100; return <path key={i} d={`M${x},${420 + (i % 3) * 90} l70,0 m-20,-14 l20,14 l-20,14`} stroke="#9fd0ff" strokeWidth={5} fill="none" opacity={0.5 * (1 - gas)} />; })}
        <rect x={1100} y={300} width={30} height={600} fill="#4a3a28" />
        <g transform={`translate(1115,300) scale(${Math.cos(open * 1.35)},1)`}><rect x={0} y={0} width={240} height={600} fill="#6b4c2c" stroke="#3a2614" strokeWidth={6} />{[120, 300, 480].map((y) => <rect key={y} x={0} y={y} width={240} height={18} fill="#4a321c" />)}</g>
        <g transform={`translate(${cx},800)`}><rect x={-140} y={-110} width={280} height={110} rx={8} fill="#3d3d40" stroke="#1d1d1f" strokeWidth={5} /><path d="M-130,-110 Q0,-170 130,-110 Z" fill="#111" /><circle cx={-80} cy={10} r={24} fill="#222" stroke="#666" strokeWidth={5} /><circle cx={80} cy={10} r={24} fill="#222" stroke="#666" strokeWidth={5} /></g>
        {/* el gas se junta contra el techo: nubes blandas que crecen y se mueven, no una elipse */}
        <defs><filter id="gasb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28" /></filter></defs>
        <g filter="url(#gasb)" opacity={gas}>
          {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={1180 + i * 85 + Math.sin(f / 30 + i) * 30} cy={290 + (i % 3) * 40 + Math.cos(f / 25 + i) * 14} r={(70 + (i % 4) * 22) * (0.4 + 0.6 * gas)} fill={i % 2 ? "rgba(185,210,120,.55)" : "rgba(160,190,100,.45)"} />)}
        </g>
      </SV>
      <Tu x={1000} y={890} s={0.7} arms={open > 0.3 && open < 0.95 ? "spear" : "down"} />
      <Tag a={at(p, "aire", 10)} t="LA PUERTA DEL AIRE" x={700} y={90} size={64} color={INK} />
      <Tag a={G} t="si la dejas abierta: GAS" x={1450} y={180} size={50} color={RED} w={800} />
    </Scene>
  );
};

// 20 · LA VELA QUE SE ACABA: en lo oscuro total, la vela baja; cuando se apaga queda tu contorno y pasan dos ojitos de rata
export const VelaOscuridad: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const out = at(p, "oscuras", d * 0.55), h = 220 * (1 - ez(f, 0, out)), lit = f < out ? 1 : Math.max(0, 1 - (f - out) / 10);
  const fl = 0.85 + 0.15 * Math.sin(f / 2.7) * Math.sin(f / 5.1);
  const rat = lin(f, out + 30, d - 4), rx = -100 + rat * 2100;
  const secs = Math.floor(f / 30 * 37);
  return (
    <Scene d={d} floor="255,200,120" tint="#000">
      <AbsoluteFill style={{ background: `radial-gradient(circle at 960px ${720 - h}px, rgba(255,190,100,${0.42 * lit * fl}) 0%, rgba(80,40,10,${0.2 * lit}) 25%, #000 55%)` }} />
      <SV>
        <rect x={930} y={720 - h} width={60} height={h} rx={8} fill="#efe6cf" opacity={0.2 + 0.8 * lit} />
        <path d={`M960,${720 - h - 4} q-16,-30 0,-70 q16,40 0,70`} fill="#ffd27a" opacity={lit * fl} />
        <rect x={880} y={720} width={160} height={20} rx={8} fill="#5a4632" opacity={0.3 + 0.7 * lit} />
        {rat > 0 && rat < 1 && <g transform={`translate(${rx},930)`}><ellipse cx={0} cy={0} rx={60} ry={24} fill="#0f0f0f" /><path d="M-60,0 Q-140,-10 -190,20" stroke="#0f0f0f" strokeWidth={6} fill="none" /><circle cx={52} cy={-8} r={6} fill="#ff9a2a" /><circle cx={52} cy={-8} r={14} fill="rgba(255,150,40,.25)" /></g>}
      </SV>
      <Tu x={680} y={960} s={1.4} op={0.22 + 0.6 * lit} dark={lit < 0.3} />
      <div style={{ position: "absolute", right: 120, top: 120, fontFamily: F, fontWeight: 900, fontSize: 64, color: "rgba(240,235,229,.6)", fontVariantNumeric: "tabular-nums" }}>{`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`}</div>
      <Tag a={at(p, "sarah", 20)} t="SARAH GOODER · 8 AÑOS" x={960} y={110} size={56} color={ORA} />
      <Tag a={out + 6} t="a oscuras" x={960} y={480} size={64} color="rgba(240,235,229,.7)" />
    </Scene>
  );
};
