// dur5nb — componentes únicos 14-25 (tramos 7, 6, 5 y 4 + re-gancho 1).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV, Tu, Meter } from "./pkit";

type UP = { d: number; p: any };
const Big: React.FC<{ x: number; y: number; v: string; c?: string; size?: number; o?: number; label?: string; w?: number }> = ({ x, y, v, c = INK, size = 110, o = 1, label, w = 700 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: F, fontWeight: 900, opacity: o, color: c, fontVariantNumeric: "tabular-nums" }}>
    {label && <div style={{ fontSize: 26, letterSpacing: 4, color: "rgba(240,235,229,.8)", marginBottom: 6 }}>{label}</div>}
    <div style={{ fontSize: size, lineHeight: 1, textShadow: "0 6px 26px rgba(0,0,0,.7)" }}>{v}</div>
  </div>
);

// 14 · LA PLATA DE SALAMINA: monedas que suben por un pozo de mina y caen en los cascos de una flota de trirremes
export const PlataSalamina: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const n = Math.min(60, Math.floor(f / 2)), ships = ez(f, at(p, "flota", 10), at(p, "flota", 10) + 40);
  return (
    <Scene d={d} bg={p.bg} floor="200,210,230" tint="#0b0e14">
      <SV>
        <rect x={0} y={560} width={1920} height={520} fill="#3a2c1e" /><rect x={300} y={560} width={120} height={520} fill="#120c07" />
        <path d="M0,420 Q480,400 960,420 T1920,420 L1920,560 L0,560 Z" fill="#1f3a52" />
        {Array.from({ length: 5 }).map((_, i) => { const x = 820 + i * 220, y = 430 + Math.sin(f / 18 + i) * 6;
          return <g key={i} transform={`translate(${x},${y + (1 - ships) * 80})`} opacity={ships}><path d="M-90,0 L90,0 L70,26 L-70,26 Z" fill="#5a3a22" />{Array.from({ length: 7 }).map((_, j) => <line key={j} x1={-70 + j * 22} y1={20} x2={-80 + j * 22 + Math.sin(f / 5 + j) * 8} y2={52} stroke="#c9a46a" strokeWidth={3} />)}<line x1={0} y1={0} x2={0} y2={-90} stroke="#5a3a22" strokeWidth={5} /><path d="M2,-86 L50,-60 L2,-34 Z" fill="#d9cdb0" /></g>; })}
        {Array.from({ length: n }).map((_, i) => { const t0 = i * 2, k = Math.min(1, (f - t0) / 50); const sx = 360, sy = 1040 - k * 600; const tx = 820 + (i % 5) * 220;
          const x = k < 0.8 ? sx + Math.sin(i) * 20 : sx + (tx - sx) * ((k - 0.8) / 0.2), y = k < 0.8 ? sy : 440 - Math.sin(((k - 0.8) / 0.2) * Math.PI) * 140;
          return <g key={i} transform={`translate(${x},${y}) scale(${Math.abs(Math.cos(f / 6 + i))},1)`} opacity={k < 1 ? 1 : 0}><circle r={16} fill="#d7dde6" stroke="#9aa4b4" strokeWidth={3} /><text y={6} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={14} fill="#6a7484">ΑΘΕ</text></g>; })}
      </SV>
      <Tag a={at(p, "plata", 5)} t="LAURIÓN · PLATA" x={360} y={620} size={40} color="#d7dde6" w={500} />
      <Tag a={at(p, "flota", 10)} t="LA FLOTA DE SALAMINA · 480 a.C." x={1260} y={200} size={46} color={GOLD} w={1000} />
      <Tag a={at(p, "esclavos", 60)} t="galerías de 1 metro, cavadas por esclavos" x={1200} y={760} size={40} w={1000} />
    </Scene>
  );
};

// 15 · LA LLAMA DE LAURIÓN: corte de la roca, una galería de un metro, tú a gatas con la lámpara; la llama baja y los golpes suenan sin lugar
export const GaleriaLaurion: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const air = 1 - 0.75 * lin(f, 30, d), flame = air * (0.85 + 0.15 * Math.sin(f / 3)), crawl = lin(f, 0, d) * 600;
  const knock = at(p, "golpeando", d * 0.45);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,90" tint="#090604" push={0.02}>
      <AbsoluteFill style={{ background: "#1f160e" }} />
      <SV>
        {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M${rnd(i) * 1920},${rnd(i, 2) * 1080} l${40 + rnd(i, 3) * 60},${10 - rnd(i, 4) * 30}`} stroke="#2e2216" strokeWidth={4} />)}
        <path d="M0,520 L1920,500 L1920,760 L0,780 Z" fill="#0a0705" />
        <line x1={120} y1={520} x2={120} y2={780} stroke={GOLD} strokeWidth={3} /><text x={140} y={660} fontFamily={F} fontWeight={900} fontSize={38} fill={GOLD}>1 m</text>
        <g transform={`translate(${520 + crawl},760)`}>
          <ellipse cx={0} cy={-90} rx={260 * flame} ry={160 * flame} fill={`rgba(255,170,80,${0.22 * flame})`} />
          <ellipse cx={-80} cy={-60} rx={90} ry={40} fill="#2d3a5a" /><circle cx={30} cy={-80} r={34} fill="#f2c49b" />
          <rect x={-170} y={-50} width={26} height={50} rx={10} fill="#2d3a5a" /><rect x={-40} y={-50} width={22} height={50} rx={10} fill="#f2c49b" /><rect x={10} y={-50} width={22} height={50} rx={10} fill="#f2c49b" />
          <ellipse cx={110} cy={-10} rx={34} ry={12} fill="#8a6a42" /><path d={`M130,-14 q${8},${-40 * flame} 0,${-60 * flame} q-8,${20 * flame} 0,${60 * flame}`} fill="#ffcf73" />
        </g>
        {[0, 1, 2].map((i) => { const t0 = knock + i * 40, k = ((f - t0) % 120) / 60; const x = [300, 1500, 900][i], y = [400, 860, 420][i];
          return f > t0 && k < 1 ? <circle key={i} cx={x} cy={y} r={30 + k * 160} fill="none" stroke="rgba(240,235,229,.5)" strokeWidth={4} opacity={1 - k} /> : null; })}
      </SV>
      <Meter x={1400} y={80} w={420} h={20} k={air} col={air < 0.4 ? RED : ORA} label="AIRE · LA LLAMA LO DICE" val={`${Math.round(air * 100)} %`} size={64} />
      <Tag a={knock} t="¿dónde?" x={960} y={300} size={56} w={400} />
      <Tag a={at(p, "pagan", d * 0.8)} t="SIN SUELDO" x={460} y={140} size={64} color={RED} w={600} />
    </Scene>
  );
};

// 16 · LO QUE RESPIRAS: dos pulmones que se inflan; con cada respiración entran motas que se quedan; «la caída» y «el golpe» se tachan
export const AireRespiras: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const br = 1 + 0.06 * Math.sin(f / 18), dots = Math.min(160, Math.floor(f / 2)), cross = at(p, "caida", 60), res = at(p, "respiras", d * 0.7);
  return (
    <Scene d={d} bg={p.bg} floor="230,200,170" tint="#0d0a0a">
      <SV>
        <g transform={`translate(960,560) scale(${br})`}>
          <path d="M-20,-300 L-20,-150 M20,-300 L20,-150 M-20,-150 Q-80,-120 -120,-60 M20,-150 Q80,-120 120,-60" stroke="#c98a7a" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M-40,-140 Q-300,-160 -320,80 Q-330,280 -120,300 Q-40,300 -40,140 Z" fill="#8a4a44" stroke="#c98a7a" strokeWidth={6} />
          <path d="M40,-140 Q300,-160 320,80 Q330,280 120,300 Q40,300 40,140 Z" fill="#8a4a44" stroke="#c98a7a" strokeWidth={6} />
          {Array.from({ length: dots }).map((_, i) => { const sd = i % 2 ? 1 : -1, x = sd * (80 + rnd(i) * 200), y = -100 + rnd(i, 2) * 360;
            return <circle key={i} cx={x} cy={y} r={3 + rnd(i, 3) * 3} fill="#e8e0d0" opacity={0.75} />; })}
        </g>
        {Array.from({ length: 24 }).map((_, i) => { const ph = ((f / 50) + rnd(i)) % 1; return <circle key={i} cx={960 + (rnd(i, 4) - 0.5) * 200 * (1 - ph)} cy={-40 + ph * 300} r={4} fill="#e8e0d0" opacity={1 - ph} />; })}
      </SV>
      {[["la caída", 280], ["el golpe", 400]].map(([t, y], i) => { const a = cross + i * 14;
        return <div key={i} style={{ position: "absolute", left: 120, top: y as number, fontFamily: F, fontWeight: 900, fontSize: 70, color: INK, opacity: ez(f, a - 10, a) }}>{t}
          <div style={{ position: "absolute", left: -10, top: 40, height: 10, width: `${ez(f, a + 6, a + 16) * 110}%`, background: RED, transform: "rotate(-4deg)" }} /></div>; })}
      <Tag a={res} t="lo que respiras" x={1540} y={480} size={78} color={ORA} w={700} />
      <Tag a={at(p, "cuarenta", 5)} t="40 TRABAJOS" x={1540} y={160} size={44} color={GOLD} w={600} />
    </Scene>
  );
};

// 17 · EL PINCEL Y LOS LABIOS: la esfera verde brilla; el pincel va a la boca y vuelve, una y otra vez; el brillo baja hacia la mandíbula
export const PincelLabios: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const cyc = (f % 70) / 70, toLip = Math.sin(cyc * Math.PI), dips = Math.floor(f / 70);
  const jaw = ez(f, at(p, "mandibula", d * 0.7) - 30, at(p, "mandibula", d * 0.7) + 30), mo = Math.min(4, 1 + Math.floor(lin(f, at(p, "meses", d * 0.55), d) * 4));
  const bx = 560 + toLip * 520, by = 700 - toLip * 260;
  return (
    <Scene d={d} bg={p.bg} floor="170,255,170" tint="#070b08">
      <SV>
        <g transform="translate(520,720)"><circle r={200} fill="#1e2418" stroke="#8a8f96" strokeWidth={14} /><circle r={176} fill="#2a3022" />
          {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2, k = Math.min(1, dips / 12 + (i < dips % 12 ? 1 : 0)); return <text key={i} x={Math.sin(a) * 140} y={-Math.cos(a) * 140 + 14} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#b8ff9a" opacity={0.25 + 0.75 * k} style={{ filter: "drop-shadow(0 0 8px #9aff7a)" }}>{i === 0 ? 12 : i}</text>; })}
          <line x1={0} y1={0} x2={0} y2={-110} stroke="#b8ff9a" strokeWidth={8} /><line x1={0} y1={0} x2={80} y2={30} stroke="#b8ff9a" strokeWidth={8} /></g>
        <g transform="translate(1260,520)">
          <path d="M-120,-200 Q0,-280 120,-200 Q170,-60 120,100 Q60,180 0,190 Q-60,180 -120,100 Q-170,-60 -120,-200 Z" fill="#e8c8a8" />
          <path d="M-60,110 Q0,140 60,110" stroke="#a8604a" strokeWidth={10} fill="none" />
          <path d="M-110,110 Q0,230 110,110" stroke={`rgba(184,255,154,${0.7 * jaw})`} strokeWidth={22} fill="none" style={{ filter: "blur(6px)" }} />
        </g>
        <g transform={`translate(${bx},${by}) rotate(${-30 + toLip * 40})`}><rect x={-6} y={0} width={12} height={220} rx={6} fill="#c9a46a" /><path d="M-8,0 L0,-46 L8,0 Z" fill="#b8ff9a" style={{ filter: "drop-shadow(0 0 10px #9aff7a)" }} /></g>
      </SV>
      <Big x={1640} y={140} v={`MES ${mo}`} c="#b8ff9a" size={90} o={ez(f, at(p, "meses", d * 0.55), at(p, "meses", d * 0.55) + 8)} w={460} />
      <Tag a={at(p, "salud", 60)} t="«el radio es bueno para la salud»" x={960} y={110} size={44} color={GOLD} w={1200} />
      <Tag a={at(p, "demandaron", d * 0.85)} t="5 OBRERAS DEMANDARON" x={1260} y={900} size={48} color={ORA} w={800} />
      <Tag a={at(p, "unas", 30)} t="uñas que brillan en la oscuridad" x={520} y={380} size={36} color="#b8ff9a" w={700} />
    </Scene>
  );
};

// 18 · EL MARCADOR A LA MITAD: las cinco paradas hechas como barras de tiempo; la del radio rompe la escala
export const MarcadorMitad: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R = [["Catador", "4 min 20", 4.3], ["Golden Gate", "2 h 10", 130], ["Canaria", "3 semanas", 30240], ["Laurión", "18 min", 18], ["Pintora de radio", "4 meses", 172800]] as const;
  const mx = Math.log10(172800), hit = at(p, "cuatro", d * 0.5);
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" tint="#0d0b08" push={0.025}>
      {R.map(([n, v, m], i) => { const k = ez(f, 10 + i * 12, 40 + i * 12) * (Math.log10(m as number + 1) / mx), last = i === 4;
        return (
          <div key={i} style={{ position: "absolute", left: 160, top: 220 + i * 140, width: 1600, fontFamily: F, fontWeight: 900 }}>
            <div style={{ fontSize: 34, color: last ? "#b8ff9a" : INK }}>{n}</div>
            <div style={{ marginTop: 8, height: 54, width: `${k * 100}%`, background: last ? "#7ad66a" : ORA, borderRadius: 10, boxShadow: last ? `0 0 ${30 * ez(f, hit, hit + 10)}px #9aff7a` : "none",
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, fontSize: 32, color: "#120c07" }}>{k > 0.2 ? v : ""}</div>
          </div>
        );
      })}
      <Tag a={at(p, "marcador", 5)} t="EL MARCADOR · MITAD DEL CAMINO" x={960} y={110} size={52} color={GOLD} w={1400} />
      <Tag a={at(p, "avisó", d * 0.8)} t="y nadie te avisó" x={1460} y={940} size={50} color={RED} w={700} />
      <div style={{ position: "absolute", left: 160, top: 960, fontFamily: F, fontWeight: 800, fontSize: 22, color: "rgba(240,235,229,.6)" }}>escala logarítmica</div>
    </Scene>
  );
};

// 19 · EL ROSARIO DE NAIN SINGH: un sendero por montañas del Tíbet; cada 100 pasos baja una cuenta; el molinillo gira con las notas adentro
export const RosarioPasos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const steps = Math.floor(f * 3.4), beads = Math.floor(steps / 100), wheel = f * 6, notes = ez(f, at(p, "molinillo", d * 0.6), at(p, "molinillo", d * 0.6) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="230,200,150" tint="#0e0c0a">
      <SV>
        <path d="M0,700 L240,420 L420,560 L640,300 L900,560 L1120,380 L1360,600 L1600,340 L1920,620 L1920,1080 L0,1080 Z" fill="#2a2a34" />
        {[[640, 300], [1120, 380], [1600, 340]].map(([x, y], i) => <path key={i} d={`M${x - 60},${y + 60} L${x},${y} L${x + 60},${y + 60} Z`} fill="#e8eef4" />)}
        <path d="M80,900 Q500,820 900,880 T1840,820" stroke={GOLD} strokeWidth={4} strokeDasharray="10 14" fill="none" strokeDashoffset={-f * 2} />
        <g transform="translate(300,520)">
          {Array.from({ length: 20 }).map((_, i) => { const a = (i / 20) * Math.PI * 2 + beads * (Math.PI * 2 / 20); return <circle key={i} cx={Math.cos(a) * 110} cy={Math.sin(a) * 140} r={14} fill={i === 5 ? GOLD : "#8a5a3a"} />; })}
          <circle cx={Math.cos(Math.PI / 2) * 110} cy={150} r={20} fill={GOLD} />
        </g>
        <g transform="translate(1500,560)">
          <rect x={-8} y={0} width={16} height={260} fill="#5a3a22" />
          <g transform={`scale(${Math.cos(wheel * Math.PI / 180) * 0.3 + 0.7},1)`}><rect x={-90} y={-160} width={180} height={160} rx={20} fill="#b07a2a" stroke="#e9c762" strokeWidth={6} />
            {[0, 1, 2].map((i) => <line key={i} x1={-90} x2={90} y1={-120 + i * 40} y2={-120 + i * 40} stroke="#7a5218" strokeWidth={4} />)}</g>
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-40 + i * 40},${-180 - notes * (80 + i * 40)}) rotate(${(i - 1) * 14})`} opacity={notes}><rect x={-30} y={-20} width={60} height={40} fill="#efe6cf" />
            {[0, 1, 2].map((j) => <line key={j} x1={-22} x2={22} y1={-10 + j * 10} y2={-10 + j * 10} stroke="#6a5a42" strokeWidth={2} />)}</g>)}
        </g>
      </SV>
      <Tu x={180 + lin(f, 0, d) * 1500} y={880} s={0.6} walk />
      <Big x={300} y={150} v={steps.toLocaleString("es-MX").replace(",", ".")} label="PASOS" size={90} w={500} />
      <Tag a={at(p, "rosario", 30)} t="1 cuenta = 100 pasos" x={300} y={760} size={36} color={GOLD} w={500} />
      <Tag a={at(p, "nain", 5)} t="NAIN SINGH · PUNDIT" x={1200} y={110} size={48} color={GOLD} w={900} />
    </Scene>
  );
};

// 20 · ATRAPADOS EN EL HIELO: dos barcos encajados, el sol se hunde por meses, las latas bajan; el trineo sale caminando
export const HieloFranklin: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const sun = ez(f, at(p, "sol", d * 0.4) - 20, at(p, "sol", d * 0.4) + 50), cans = Math.max(0, 36 - Math.floor(lin(f, 20, d * 0.7) * 30));
  const sled = ez(f, at(p, "trineo", d * 0.75), d), day = Math.min(11, Math.floor(lin(f, at(p, "trineo", d * 0.75), d) * 11) + (f > at(p, "trineo", d * 0.75) ? 1 : 0));
  return (
    <Scene d={d} bg={p.bg} floor="190,210,240" tint="#060a10">
      <AbsoluteFill style={{ background: `linear-gradient(rgba(${40 - 30 * sun},${60 - 45 * sun},${90 - 60 * sun},1), #0a1420 70%)` }} />
      <SV>
        <circle cx={1500} cy={520 + sun * 260} r={70} fill="#ffd7a0" opacity={1 - sun} />
        <path d="M0,600 L1920,580 L1920,1080 L0,1080 Z" fill="#cfdbe6" />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${i * 150},${620 + rnd(i) * 40} l60,-30 l50,34 Z`} fill="#e8f0f6" />)}
        {[520, 980].map((x, i) => <g key={i} transform={`translate(${x},600) rotate(${i ? 4 : -6})`}><path d="M-200,0 L200,0 L170,60 L-170,60 Z" fill="#2a1f18" />
          {[-90, 0, 90].map((mx, j) => <line key={j} x1={mx} y1={0} x2={mx} y2={-300 + j * 20} stroke="#2a1f18" strokeWidth={8} />)}
          {[-90, 0, 90].map((mx, j) => <line key={j} x1={mx - 50} y1={-200 + j * 10} x2={mx + 50} y2={-200 + j * 10} stroke="#2a1f18" strokeWidth={5} />)}
          <path d="M-200,40 L200,40 L220,70 L-220,70 Z" fill="#e8f0f6" /></g>)}
        {Array.from({ length: cans }).map((_, i) => <g key={i} transform={`translate(${120 + (i % 12) * 38},${960 - Math.floor(i / 12) * 46})`}><rect x={-14} y={-38} width={28} height={38} rx={3} fill="#9aa3ad" /><rect x={-14} y={-28} width={28} height={12} fill="#b23a22" /></g>)}
        <g transform={`translate(${900 + sled * 700},860)`} opacity={sled > 0 ? 1 : 0}><rect x={0} y={-30} width={260} height={40} rx={8} fill="#6b4a2a" /><path d="M-10,12 Q130,30 280,12" stroke="#3a2614" strokeWidth={6} fill="none" /><line x1={-80} y1={-60} x2={0} y2={-20} stroke="#d9cdb0" strokeWidth={4} /></g>
        {Array.from({ length: 40 }).map((_, i) => { const ph = ((f / 60) + rnd(i)) % 1; return <circle key={i} cx={rnd(i, 3) * 1920 - ph * 200} cy={ph * 1080} r={3} fill="#fff" opacity={0.6} />; })}
      </SV>
      <Tu x={820 + sled * 700} y={880} s={0.6} walk={sled > 0} rot={sled > 0 ? 10 : 0} />
      <Big x={300} y={720} v={String(cans)} label="LATAS" size={60} w={400} />
      <Tag a={at(p, "inviernos", 10)} t="2 INVIERNOS EN EL HIELO" x={960} y={110} size={52} color="#cfe6ff" w={1000} />
      <Big x={1640} y={160} v={`DÍA ${Math.max(1, day)}`} c={RED} size={90} o={sled > 0 ? 1 : 0} w={460} />
    </Scene>
  );
};

// 21 · EL ATASCO DE TRONCOS: el río baja troncos, se traban en una roca; tú saltas sobre ellos con la vara a soltarlos
export const TroncosVara: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const jam = at(p, "atascaban", d * 0.45), stuck = ez(f, jam - 30, jam), free = ez(f, d - 40, d - 10), jx = 980;
  return (
    <Scene d={d} bg={p.bg} floor="160,200,180" tint="#081210">
      <SV>
        <path d="M0,360 L1920,300 L1920,820 L0,880 Z" fill="#1e3e46" />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${((i * 260 + f * 6) % 2200) - 200},${420 + (i % 4) * 100} q60,-10 120,0`} stroke="rgba(255,255,255,.25)" strokeWidth={4} fill="none" />)}
        <ellipse cx={jx + 160} cy={620} rx={80} ry={50} fill="#4a4a44" />
        {Array.from({ length: 14 }).map((_, i) => { const free0 = ((i * 160 + f * 7) % 2100) - 200; const x = stuck > 0.5 && free < 0.5 ? Math.min(free0, jx - (i % 7) * 60) : free0;
          const y = 400 + (i % 5) * 90 + Math.sin(f / 10 + i) * 6, rot = stuck > 0.5 && free < 0.5 && free0 > jx - 300 ? (i % 2 ? 22 : -18) : (i % 3) * 4;
          return <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}><rect x={-130} y={-22} width={260} height={44} rx={22} fill="#7a5230" /><ellipse cx={130} cy={0} rx={10} ry={22} fill="#c9a46a" /></g>; })}
      </SV>
      <Tu x={jx - 80} y={560 - Math.abs(Math.sin(f / 8)) * 40} s={0.8} arms="spear" />
      <Tag a={jam} t="si se atascan, entras tú" x={960} y={130} size={56} color={ORA} w={1100} />
      <Tag a={at(p, "vara", 30)} t="una vara" x={500} y={880} size={40} color={GOLD} w={400} />
    </Scene>
  );
};

// 22 · CENTÍMETRO A CENTÍMETRO: la cuadrícula del suelo, la varilla pincha y avanza; cada casilla limpia se pone verde; una roja aparece
export const VarillaCm: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const N = 12, M = 6, done = Math.min(N * M, Math.floor(f / 3)), prod = Math.abs(Math.sin(f / 4));
  const cur = done % (N * M), cx = 360 + (cur % N) * 100, cy = 380 + Math.floor(cur / N) * 100;
  return (
    <Scene d={d} bg={p.bg} floor="200,170,120" tint="#120d08">
      <SV>
        <rect x={340} y={360} width={N * 100 + 20} height={M * 100 + 20} fill="#6a4a2a" />
        {Array.from({ length: N * M }).map((_, i) => { const x = 350 + (i % N) * 100, y = 370 + Math.floor(i / N) * 100, mine = i === 41, ok = i < done && !mine;
          return <rect key={i} x={x} y={y} width={92} height={92} rx={6} fill={mine && i < done ? RED : ok ? "rgba(122,214,106,.55)" : "rgba(0,0,0,.25)"} stroke="rgba(255,255,255,.12)" />; })}
        <g transform={`translate(${cx + 46},${cy + 46 - prod * 30})`}><line x1={0} y1={0} x2={160} y2={-260} stroke="#cfd6de" strokeWidth={8} /><circle cx={160} cy={-260} r={14} fill="#3a3a3a" /></g>
      </SV>
      <Tu x={cx + 280} y={cy + 160} s={0.9} rot={-24} />
      <Big x={1700} y={200} v={`${done * 10} cm`} label="AVANZADO" size={84} w={420} />
      <Tag a={at(p, "centimetro", 20)} t="centímetro a centímetro" x={960} y={120} size={56} color={GOLD} w={1100} />
      <Tag a={at(p, "camboya", 5)} t="CAMBOYA" x={960} y={110} size={34} w={600} />
    </Scene>
  );
};

// 23 · LA MALETA DE 13 KG: el transmisor abierto, la antena por el cuarto, 20 minutos de cuenta atrás; en el mapa tres camionetas cierran el círculo
export const MaletaRadio: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const tx = at(p, "veinte", 80), left = Math.max(0, 20 * 60 - Math.floor(lin(f, tx, tx + 240) * 1200)), close = ez(f, at(p, "camionetas", tx + 120), at(p, "camionetas", tx + 120) + 120);
  const nb = ez(f, at(p, "vecino", d * 0.75), at(p, "vecino", d * 0.75) + 20), day = Math.min(9, 1 + Math.floor(lin(f, at(p, "cambias", d * 0.6), d) * 9));
  return (
    <Scene d={d} bg={p.bg} floor="230,200,150" tint="#0b0a0a">
      <SV>
        <g transform="translate(160,520)"><rect x={0} y={0} width={620} height={360} rx={18} fill="#5a3a22" stroke="#2a1a10" strokeWidth={8} /><rect x={30} y={30} width={560} height={300} rx={10} fill="#2a2a2a" />
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={110 + i * 130} cy={120} r={36} fill="#1a1a1a" stroke="#9aa3ad" strokeWidth={5} />)}
          {[0, 1, 2, 3].map((i) => <line key={i} x1={110 + i * 130} y1={120} x2={110 + i * 130 + Math.cos(f / 20 + i) * 26} y2={120 + Math.sin(f / 20 + i) * 26} stroke="#e9c762" strokeWidth={4} />)}
          <rect x={80} y={210} width={460} height={60} rx={8} fill="#1a1a1a" /><circle cx={560} cy={60} r={10} fill={f % 20 < 10 ? RED : "#400"} /></g>
        <path d={`M780,560 Q1000,${420 + Math.sin(f / 20) * 10} 1180,300`} stroke="#c9a46a" strokeWidth={4} fill="none" />
        <g transform="translate(1230,360)"><rect x={0} y={0} width={560} height={420} fill="#d9cdb0" />
          {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={0} y1={i * 52} x2={560} y2={i * 52 + rnd(i) * 20} stroke="#b0a080" strokeWidth={3} />)}
          {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={i * 76} y1={0} x2={i * 76 + rnd(i, 2) * 30} y2={420} stroke="#b0a080" strokeWidth={3} />)}
          <circle cx={300} cy={210} r={12} fill={RED} />
          {[[40, 40], [520, 80], [280, 400]].map(([x, y], i) => { const vx = x + (300 - x) * close * 0.7, vy = y + (210 - y) * close * 0.7;
            return <g key={i}><circle cx={vx} cy={vy} r={300 - close * 200} fill="none" stroke="rgba(30,30,40,.5)" strokeWidth={4} /><rect x={vx - 16} y={vy - 10} width={32} height={20} rx={4} fill="#2a2a34" /></g>; })}</g>
      </SV>
      <Tu x={1700} y={300} s={0.55} dark op={nb} />
      <Big x={470} y={120} v={`${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`} label="TRANSMITIR · MÁXIMO 20 MIN" size={110} c={left < 300 ? RED : INK} o={ez(f, tx, tx + 8)} w={620} />
      <Tag a={at(p, "maleta", 10)} t="13 KG" x={470} y={900} size={54} color={GOLD} w={300} />
      <Big x={1510} y={820} v={`DÍA ${day}`} size={70} c={ORA} o={ez(f, at(p, "cambias", d * 0.6), at(p, "cambias", d * 0.6) + 8)} w={400} />
      <Tag a={at(p, "vecino", d * 0.75)} t="un vecino te mira" x={1500} y={120} size={40} color={RED} w={500} />
    </Scene>
  );
};

// 24 · LA LADERA DE MANN GULCH: la pendiente en diagonal; el frente de fuego sube más rápido que las figuras que corren
export const LaderaFuego: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const k = lin(f, 10, d), fire = 140 + k * 1500, run = 520 + k * 1100;
  const slope = (x: number) => 960 - (x - 100) * 0.42;
  return (
    <Scene d={d} bg={p.bg} floor="255,140,60" tint="#140806">
      <SV>
        <path d={`M100,${slope(100)} L1900,${slope(1900)} L1920,1080 L0,1080 Z`} fill="#4a3a22" />
        {Array.from({ length: 30 }).map((_, i) => { const x = 120 + i * 60; return x < fire ? <path key={i} d={`M${x},${slope(x)} q-12,${-60 - Math.sin(f / 3 + i) * 30} 0,${-110 - rnd(i) * 40} q12,${50} 0,${110}`} fill={i % 2 ? "#ff8a2a" : "#ffcf3a"} opacity={0.9} /> : null; })}
        <path d={`M100,${slope(100) - 40} ${Array.from({ length: 20 }).map((_, i) => { const x = 100 + i * ((fire - 100) / 19); return `L${x},${slope(x) - 160 - Math.sin(f / 9 + i) * 40}`; }).join(" ")}`} stroke="rgba(60,40,30,.7)" strokeWidth={90} fill="none" />
        {Array.from({ length: 13 }).map((_, i) => { const x = run + i * 34 - 200; const caught = x < fire; return <g key={i} opacity={caught ? 0.25 : 1}><circle cx={x} cy={slope(x) - 52} r={9} fill="#1a120d" /><rect x={x - 7} y={slope(x) - 44} width={14} height={40} rx={6} fill="#1a120d" /></g>; })}
      </SV>
      <Big x={1500} y={620} v="13" label="MANN GULCH · MONTANA · 1949" size={120} c={RED} o={ez(f, at(p, "trece", 30), at(p, "trece", 30) + 10)} w={700} />
      <Tag a={at(p, "rapido", 40)} t="el fuego sube más rápido" x={700} y={120} size={50} color={ORA} w={900} />
    </Scene>
  );
};

// 25 · DELTA P: un tubo, dos manómetros; la diferencia de presión acelera el agua hacia la boca y arrastra al buzo
export const DeltaPe: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const dp = ez(f, at(p, "diferencia", 40), at(p, "diferencia", 40) + 60), pull = ez(f, at(p, "succiona", d * 0.6), at(p, "succiona", d * 0.6) + 60);
  return (
    <Scene d={d} bg={p.bg} floor="120,180,220" tint="#06101a">
      <AbsoluteFill style={{ background: "linear-gradient(#0e2a40, #061420)" }} />
      <SV>
        <rect x={1100} y={100} width={40} height={980} fill="#3a4450" /><rect x={1140} y={500} width={780} height={120} fill="#2a323c" /><rect x={1100} y={510} width={40} height={100} fill="#000" />
        {Array.from({ length: 30 }).map((_, i) => { const ph = ((f * (0.6 + dp * 1.6)) / 100 + rnd(i)) % 1; const r = 500 * (1 - ph); const a = rnd(i, 2) * Math.PI - Math.PI / 2;
          return <line key={i} x1={1100 - Math.cos(a) * r} y1={560 + Math.sin(a) * r} x2={1100 - Math.cos(a) * (r - 30 - dp * 30)} y2={560 + Math.sin(a) * (r - 30 - dp * 30)} stroke="rgba(180,220,255,.55)" strokeWidth={3} />; })}
        {[[440, 260, 1, "ALTA"], [1560, 260, 0.2 - 0.15 * dp, "BAJA"]].map(([x, y, k, t], i) => <g key={i} transform={`translate(${x},${y})`}><circle r={90} fill="#1a1a1a" stroke="#c9cfd6" strokeWidth={8} />
          <line x1={0} y1={0} x2={Math.cos(Math.PI * (1 - (k as number)) + Math.PI) * -70} y2={Math.sin(Math.PI * (1 - (k as number)) + Math.PI) * -70} stroke={i ? RED : GOLD} strokeWidth={8} />
          <text y={140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={INK}>{t}</text></g>)}
      </SV>
      <Tu x={620 + pull * 420} y={700 + Math.sin(f / 12) * 10} s={0.8} rot={-70 - pull * 10} />
      <Big x={960} y={60} v="ΔP" size={150} c={GOLD} o={ez(f, at(p, "delta", 5), at(p, "delta", 5) + 8)} w={400} />
      <Tag a={at(p, "succiona", d * 0.6)} t="te succiona sin avisar" x={660} y={900} size={48} color={RED} w={900} />
    </Scene>
  );
};
