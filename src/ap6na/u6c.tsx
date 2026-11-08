// ap6na — componentes únicos 14-20 (las alarmas del bosque, la vigilia en el árbol, el rifle que pasa a cámara, el borde de Mumbai,
// el protocolo del atardecer, las dos reglas de encuentro y el cierre del expediente).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, Fig, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Leo, Eyes, KHouse, Ridges, Tree, Beam } from "./lkit";

type UP = { d: number; p: any };
const Ring: React.FC<{ x: number; y: number; t: number; c: string }> = ({ x, y, t, c }) => (
  <>{[0, 1, 2].map((i) => { const ph = ((t + i / 3) % 1); return <circle key={i} cx={x} cy={y} r={30 + ph * 170} fill="none" stroke={c} strokeWidth={5} opacity={(1 - ph) * 0.8} />; })}</>
);

// 14 · ALARM RELAY: bosque en corte, el leopardo (invisible, sólo una sombra) cruza de izquierda a derecha; a su paso se disparan
//     las alarmas: el ciervo ladrador, los langures en los árboles, los pájaros; cada alarma deja un anillo que «sigue» al gato
export const AlarmRelay: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const t0 = at(p, "go", 20), k = lin(f, t0, d - 20), lx = 160 + k * 1500;
  const A = [["BARKING DEER", 460, 840, at(p, "deer", 80), ORA], ["LANGUR", 960, 360, at(p, "langur", 160), GOLD], ["BIRDS", 1420, 250, at(p, "birds", 230), "#8fdcff"]] as const;
  return (
    <Scene d={d} bg={p.bg} floor="140,200,140" tint="#08100c">
      <AbsoluteFill style={{ background: "linear-gradient(#0c1a14 0%, #13261c 55%, #0a120d 100%)" }} />
      <SV>
        {Array.from({ length: 9 }).map((_, i) => <Tree key={i} x={100 + i * 220 + rnd(i, 2) * 60} y={900} s={1.2 + rnd(i, 3) * 0.6} c={i % 2 ? "#0b1610" : "#0e1d14"} sway={Math.sin(f / 30 + i) * 6} />)}
        <rect x={0} y={900} width={1920} height={180} fill="#08100b" />
        <Leo x={lx - 200} y={900} s={0.55} c="#050806" crouch={0.6} walk={f / 6} op={0.85} />
        {A.map(([t, x, y, a, c]) => f >= a ? <Ring key={t} x={x} y={y} t={(f - a) / 40} c={c} /> : null)}
        <g transform="translate(460,840)" opacity={ez(f, A[0][3] - 30, A[0][3])}><ellipse cx={0} cy={-40} rx={60} ry={28} fill="#7a5a3a" /><path d="M50,-56 L80,-90 L92,-84 L70,-50 Z" fill="#7a5a3a" /><rect x={-40} y={-16} width={8} height={40} fill="#7a5a3a" /><rect x={30} y={-16} width={8} height={40} fill="#7a5a3a" /></g>
        <g transform="translate(960,360)" opacity={ez(f, A[1][3] - 30, A[1][3])}><circle cx={0} cy={-20} r={18} fill="#c9c2b4" /><ellipse cx={0} cy={20} rx={22} ry={34} fill="#a9a294" /><path d={`M10,50 Q60,${90 + Math.sin(f / 8) * 10} 30,140`} stroke="#a9a294" strokeWidth={6} fill="none" /></g>
        {Array.from({ length: 6 }).map((_, i) => { const t = Math.max(0, f - A[2][3]) / 30; return <path key={i} d={`M${1420 + i * 30 + t * 80 * (1 + i * 0.2)},${250 - t * 60 - i * 14} l14,-9 l14,9`} stroke="#8fdcff" strokeWidth={4} fill="none" opacity={f >= A[2][3] - 20 ? 1 : 0} />; })}
      </SV>
      {A.map(([t, x, y, a, c]) => <Tag key={t} a={a} t={t} x={x} y={y + 150} size={42} color={c} w={500} />)}
      <Tag a={4} t="THE JUNGLE'S OWN WARNING SYSTEM" x={960} y={60} size={52} />
    </Scene>
  );
};

// 15 · TREE VIGIL: de noche, un hombre sentado inmóvil en la horqueta de un árbol (silueta), la luna entre nubes, un reloj de horas
//     que corre en la esquina; abajo el sendero; las orejas como única «luz»: ondas que se abren cuando cruje algo
export const TreeVigil: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const hrs = 21 + lin(f, 0, d) * 7, h = Math.floor(hrs) % 24, m = Math.floor((hrs % 1) * 60);
  const sound = at(p, "ears", 160), ring = f > sound ? ((f - sound) / 45) % 1 : -1;
  const eyes = ez(f, at(p, "finds", d - 60) - 10, at(p, "finds", d - 60) + 10);
  return (
    <Scene d={d} bg={p.bg} floor="150,170,230" tint="#060a12" drift={0.5}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 20%, #2a3a5a 0%, #0a1020 45%, #04060b 100%)" }} />
      <SV>
        <circle cx={1500} cy={200} r={70} fill="#e8ecf5" opacity={0.9} />
        {[0, 1].map((i) => <ellipse key={i} cx={(1300 + f * (0.6 + i * 0.3) + i * 400) % 2400 - 200} cy={210 + i * 40} rx={260} ry={40} fill="#0d1424" opacity={0.85} />)}
        <path d="M820,1080 L860,400 L900,400 L960,1080 Z" fill="#05080d" />
        <path d="M870,520 L620,300 M890,470 L1180,280 M880,640 L600,560" stroke="#05080d" strokeWidth={34} strokeLinecap="round" />
        {[[620, 300, 130], [1180, 280, 150], [880, 330, 170], [600, 540, 110]].map(([x, y, r], i) => <circle key={i} cx={x + Math.sin(f / 40 + i) * 4} cy={y} r={r} fill="#060a10" />)}
        <rect x={800} y={500} width={230} height={18} rx={6} fill="#1c2436" stroke="#8fa3cf" strokeWidth={2} />
        <g transform="translate(908,497)"><Fig x={0} y={0} s={1.15} c="#7d8fb8" lean={-8} arm={0.3} /></g>
        <g transform="translate(905,500)"><Fig x={0} y={0} s={1.15} c="#020305" lean={-8} arm={0.3} /></g>
        {ring >= 0 && [0, 1].map((i) => { const ph = (ring + i * 0.5) % 1; return <circle key={i} cx={918} cy={384} r={20 + ph * 220} fill="none" stroke="#9fb6ff" strokeWidth={4} opacity={(1 - ph) * 0.7} />; })}
        <rect x={0} y={1000} width={1920} height={80} fill="#04060a" />
        <path d="M0,1030 Q600,1000 1200,1035 T1920,1020" stroke="rgba(200,190,170,.15)" strokeWidth={22} fill="none" />
        <Eyes x={1380} y={980} k={eyes * (0.7 + 0.3 * Math.sin(f / 7))} s={0.8} />
      </SV>
      <div style={{ position: "absolute", left: 120, top: 90, fontFamily: F, fontWeight: 900, fontSize: 96, color: INK, letterSpacing: 2 }}>{String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}</div>
      <Tag a={at(p, "still", 30)} t="NO MOVING · NO SLEEP" x={300} y={220} size={40} align="left" w={800} />
      <Tag a={sound} t="EARS ONLY" x={1180} y={420} size={44} color="#9fb6ff" w={500} />
    </Scene>
  );
};

// 16 · RIFLE → CAMERA: una silueta de rifle sobre la mesa que se transforma en una cámara de fuelle de los años 30; al lado, el cartel del parque
//     «HAILEY NATIONAL PARK, est. 1936» que se tacha y pasa a «CORBETT NATIONAL PARK · INDIA’S OLDEST»
export const RifleCamera: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const m = ez(f, at(p, "camera", 30), at(p, "camera", 30) + 40), ren = ez(f, at(p, "renamed", 200), at(p, "renamed", 200) + 30);
  const old = ez(f, at(p, "oldest", 320), at(p, "oldest", 320) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="255,200,140" tint="#140e0a">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 60%, #3a2a1c 0%, #0d0907 80%)" }} />
      <SV>
        <rect x={0} y={760} width={1920} height={320} fill="#2a1d14" />
        <g transform="translate(560,700)" opacity={1 - m}>
          <rect x={-380} y={-14} width={560} height={24} rx={8} fill="#4a4f55" />
          <path d="M170,-20 L380,-30 Q420,-10 400,40 L240,40 Q200,10 170,10 Z" fill="#6b4a2a" />
          <rect x={-120} y={10} width={40} height={30} rx={6} fill="#33373c" />
        </g>
        <g transform={`translate(560,690) scale(${0.6 + 0.4 * m})`} opacity={m}>
          <rect x={-160} y={-90} width={140} height={180} rx={10} fill="#2b2b2e" />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-20 + i * 28} y={-80 + i * 6} width={28} height={160 - i * 12} fill={i % 2 ? "#1a1a1c" : "#232326"} />)}
          <rect x={150} y={-48} width={60} height={96} rx={8} fill="#2b2b2e" /><circle cx={225} cy={0} r={38} fill="#111" stroke="#8a8f96" strokeWidth={6} />
          <circle cx={225} cy={0} r={16} fill={`rgba(150,200,255,${0.3 + 0.2 * Math.sin(f / 10)})`} />
          <path d="M-140,90 L-180,240 M-60,90 L-60,250 M20,90 L60,240" stroke="#3a3a3e" strokeWidth={8} />
        </g>
        <g transform="translate(1320,440)">
          <rect x={-8} y={0} width={16} height={330} fill="#5a3c22" />
          <rect x={-330} y={-200} width={660} height={260} rx={10} fill="#3d5a3a" stroke="#efe3c8" strokeWidth={6} />
        </g>
      </SV>
      <div style={{ position: "absolute", left: 1000, top: 270, width: 640, textAlign: "center", fontFamily: F, color: "#efe3c8" }}>
        <div style={{ fontSize: 46, fontWeight: 900, position: "relative", opacity: 1 - 0.5 * ren }}>HAILEY NATIONAL PARK<div style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 6, background: RED, transform: `scaleX(${ren})`, transformOrigin: "left" }} /></div>
        <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.8 }}>est. 1936</div>
        <div style={{ fontSize: 50, fontWeight: 900, color: GOLD, marginTop: 14, opacity: ren, transform: `translateY(${(1 - ren) * 20}px)` }}>CORBETT NATIONAL PARK</div>
      </div>
      <Tag a={at(p, "oldest", 320)} t="INDIA'S OLDEST NATIONAL PARK" x={1320} y={800} size={44} color={GOLD} w={800} />
      <Tag a={at(p, "camera", 30)} t="RIFLE → CAMERA" x={560} y={160} size={70} color={INK} w={800} />
      <div style={{ position: "absolute", left: 1000, top: 860, width: 640, textAlign: "center", fontFamily: F, fontWeight: 700, fontSize: 28, color: INK, opacity: old * 0.8 }}>renamed in his honor after he died in 1955</div>
    </Scene>
  );
};

// 17 · CITY / FOREST EDGE: corte de una ciudad gigante (torres con ventanas que se prenden) que toca el borde de un bosque:
//     Sanjay Gandhi NP; de noche, ojos entre los árboles a pocos metros de los edificios
export const CityForestEdge: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const night = ez(f, 0, d * 0.5), eyes = ez(f, at(p, "attacks", d - 90), at(p, "attacks", d - 90) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="255,200,120" tint="#070b12">
      <AbsoluteFill style={{ background: `linear-gradient(rgb(${30 - 20 * night},${50 - 35 * night},${80 - 50 * night}) 0%, rgb(${200 - 160 * night},${110 - 80 * night},${70 - 40 * night}) 75%, #0a0a0c 100%)` }} />
      <SV>
        {Array.from({ length: 16 }).map((_, i) => { const w = 60 + rnd(i, 1) * 50, h = 220 + rnd(i, 2) * 420, x = 980 + i * 60;
          return <g key={i}><rect x={x} y={880 - h} width={w} height={h} fill={i % 2 ? "#141820" : "#1a1f2a"} />
            {Array.from({ length: Math.floor(h / 40) }).map((_, j) => [0, 1].map((q) => <rect key={`${j}-${q}`} x={x + 10 + q * (w / 2 - 4)} y={880 - h + 14 + j * 40} width={w / 2 - 18} height={14} fill="#ffd48a" opacity={night * (rnd(i * 31 + j, q + 4) > 0.45 ? 0.85 : 0.05)} />))}
          </g>; })}
        {Array.from({ length: 14 }).map((_, i) => <Tree key={i} x={40 + i * 70} y={900} s={0.9 + rnd(i, 7) * 0.5} c={i % 2 ? "#08120c" : "#0b1810"} sway={Math.sin(f / 25 + i) * 5} />)}
        <rect x={0} y={880} width={1920} height={200} fill="#07090b" />
        <line x1={960} y1={600} x2={960} y2={880} stroke={ORA} strokeWidth={4} strokeDasharray="10 12" opacity={ez(f, at(p, "edge", 60), at(p, "edge", 60) + 20)} />
        <Eyes x={880} y={820} k={eyes * (0.6 + 0.4 * Math.sin(f / 8))} s={0.7} />
      </SV>
      <Tag a={at(p, "mumbai", 30)} t="MUMBAI" x={1400} y={150} size={50} />
      <Tag a={at(p, "sgnp", 120)} t="SANJAY GANDHI NATIONAL PARK" x={480} y={300} size={44} color={GOLD} w={800} />
      <Tag a={at(p, "edge", 60)} t="THE EDGE" x={960} y={540} size={40} color={ORA} w={400} />
    </Scene>
  );
};

// 18 · DUSK PROTOCOL: una aldea al atardecer donde las reglas del departamento forestal se aplican en escena: el grupo que camina
//     hablando con una linterna, los chicos que entran, la maleza que se corta, el ganado en el corral cerrado; tilde por regla
export const DuskProtocol: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R = [["WALK IN GROUPS · TALK", at(p, "r1", 6)], ["CARRY A LIGHT AFTER DARK", at(p, "r2", 60)], ["CHILDREN CLOSE · INDOORS", at(p, "r3", 300)]] as const;
  const n = R.filter(([, a]) => f >= a).length;
  const walk = lin(f, R[0][1], d);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,90" tint="#0b1622">
      <AbsoluteFill style={{ background: "linear-gradient(#1a2a44 0%, #6a4a50 55%, #2a1e18 100%)" }} />
      <SV>
        <Ridges n={3} base={700} col={[30, 36, 52]} fog={0.12} />
        <path d="M0,760 L1920,760 L1920,1080 L0,1080 Z" fill="#1e1712" />
        <KHouse x={1560} y={760} s={0.95} lit={1} door={n >= 3 ? 0 : 1} bar={n >= 3 ? 1 : 0} />
        <g opacity={1 - 0.6 * ez(f, d - 60, d - 20)}>{Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${1180 + i * 18},760 Q${1176 + i * 18 + Math.sin(f / 14 + i) * 8},${660 - rnd(i, 3) * 60} ${1190 + i * 18},760`} fill="#1f3020" />)}</g>
        <g opacity={0.6 + 0.4 * ez(f, d - 60, d - 20)}><rect x={1720} y={660} width={180} height={100} fill="#3a2a1c" stroke="#6b4a2a" strokeWidth={6} /><line x1={1720} y1={700} x2={1900} y2={700} stroke="#6b4a2a" strokeWidth={6} /></g>
        {[0, 1, 2].map((i) => <Fig key={i} x={200 + walk * 700 + i * 70} y={682} s={1.0} c="#0e0a08" step={f / 7 + i} />)}
        {n >= 2 && <Beam x={360 + walk * 700} y={600} ang={8 + Math.sin(f / 9) * 3} len={520} w={200} k={0.9} />}
        {n < 3 && [0, 1].map((i) => <Fig key={i} x={1380 + i * 50} y={712} s={0.6} c="#0e0a08" step={f / 5 + i} />)}
      </SV>
      <div style={{ position: "absolute", left: 80, top: 90, fontFamily: F }}>
        {R.map(([t, a], i) => { const k = ez(f, a, a + 12); return <div key={t} style={{ fontSize: 40, fontWeight: 900, color: i === n - 1 ? GOLD : INK, opacity: k * (i < n - 1 ? 0.6 : 1), marginBottom: 12, transform: `translateX(${(1 - k) * -30}px)` }}>
          <span style={{ display: "inline-block", width: 52, color: "#9dff7a" }}>✓</span>{t}</div>; })}
      </div>
      <Tag a={4} t="FOREST DEPARTMENT ADVICE" x={1400} y={80} size={40} color={ORA} w={800} />
    </Scene>
  );
};

// 19 · BACK AWAY: el encuentro: silueta del leopardo a la izquierda, persona a la derecha que retrocede despacio con los brazos en alto;
//     un camino libre (flecha verde) se abre para el animal; tachados «RUN» y «PHOTO»; termina con el número del departamento forestal (ícono teléfono)
export const BackAway: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const back = ez(f, at(p, "back", 60), at(p, "back", 60) + 120), path = ez(f, at(p, "path", 160), at(p, "path", 160) + 30), rep = ez(f, at(p, "report", 260), at(p, "report", 260) + 20);
  const no = (a: number) => ez(f, a, a + 10);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,100" tint="#0d1016">
      <AbsoluteFill style={{ background: "linear-gradient(#1b2433 0%, #3d3030 60%, #1f1813 100%)" }} />
      <SV>
        <rect x={0} y={820} width={1920} height={260} fill="#1d1712" />
        <Leo x={340} y={820} s={0.95} crouch={0.2} eye={0.7} />
        <g transform={`translate(${1260 + back * 260},0)`}><Fig x={0} y={664} s={2} c="#0d0a08" arm={1} lean={-6} /></g>
        <path d={`M560,${900} Q720,${980} 520,1040`} stroke="#9dff7a" strokeWidth={10} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - path)} strokeLinecap="round" />
        <path d="M520,1040 l40,-6 l-20,-30" stroke="#9dff7a" strokeWidth={10} fill="none" opacity={path} strokeLinecap="round" />
        <g opacity={rep} transform="translate(1640,260)"><rect x={-60} y={-90} width={120} height={180} rx={18} fill="none" stroke={INK} strokeWidth={8} /><circle cx={0} cy={66} r={8} fill={INK} /></g>
      </SV>
      {[["RUN", 860, 300, at(p, "run", 10)], ["GET CLOSER", 860, 420, at(p, "photo", 40)]].map(([t, x, y, a]) => <div key={t as string} style={{ position: "absolute", left: (x as number) - 260, top: y as number, width: 520, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: INK, opacity: no(a as number) }}>
        {t}<div style={{ position: "absolute", left: 40, right: 40, top: "52%", height: 10, background: RED, transform: `scaleX(${ez(f, (a as number) + 8, (a as number) + 18)})`, transformOrigin: "left" }} /></div>)}
      <Tag a={at(p, "back", 60)} t="BACK AWAY SLOWLY · LOOK LARGE" x={1300} y={120} size={44} color={GOLD} w={900} />
      <Tag a={at(p, "path", 160)} t="LEAVE IT A WAY OUT" x={560} y={620} size={40} color="#9dff7a" w={600} />
      <Tag a={at(p, "report", 260)} t="REPORT IT" x={1640} y={400} size={40} w={400} />
    </Scene>
  );
};

// 20 · FILE SHUT: la carpeta del expediente «PANAR · 1910» con la foto, la cifra «~400» y renglones que se borran (los nombres que no quedaron);
//     la tapa se cierra y queda el sello «KNOWLEDGE · PATIENCE»
export const FileShut: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const shut = ez(f, at(p, "shut", d - 120), at(p, "shut", d - 120) + 30), st = sp(f, at(p, "shut", d - 120) + 30, 0.8, 9);
  const names = ["women at a spring", "children at a doorway", "old men walking home"];
  return (
    <Scene d={d} bg={p.bg} floor="255,200,140" tint="#120c08">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #3a2818 0%, #0b0806 80%)" }} />
      <div style={{ position: "absolute", left: 360, top: 150, width: 1200, height: 780, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, background: "#c9a46a", borderRadius: 12, boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 60, boxSizing: "border-box", fontFamily: F }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#5a3c1e", letterSpacing: 3 }}>FILE · PANAR LEOPARD · KUMAON 1910</div>
          <div style={{ fontSize: 200, fontWeight: 900, color: RED, lineHeight: 1, marginTop: 30 }}>~400</div>
          {names.map((t, i) => { const a = at(p, "names", 120) + i * 40, k = ez(f, a, a + 12);
            return <div key={t} style={{ fontSize: 44, fontWeight: 800, color: "#3a2614", marginTop: 18, opacity: k * (1 - 0.6 * ez(f, a + 40, a + 70)), filter: `blur(${3 * ez(f, a + 40, a + 70)}px)` }}>— {t}</div>; })}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#b8935a", borderRadius: 12, transformOrigin: "left center", transform: `rotateY(${-180 + 180 * shut}deg)`, backfaceVisibility: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,.5)",
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: "#5a3c1e" }}>
          CASE CLOSED
          <div style={{ position: "absolute", right: 90, bottom: 90, padding: "14px 30px", border: `8px solid ${RED}`, color: RED, fontSize: 46, transform: `rotate(-10deg) scale(${2 - st})`, opacity: st }}>KNOWLEDGE · PATIENCE</div>
        </div>
      </div>
    </Scene>
  );
};

// 21 · COVER SCALE: a la izquierda el tigre necesita un matorral alto; a la derecha el leopardo se aplasta detrás de una piedra «a la altura de la rodilla»
//     (marca de una pierna humana como regla); después trepa el árbol
export const CoverScale: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const flat = ez(f, at(p, "knee", 120) - 10, at(p, "knee", 120) + 20), climb = ez(f, at(p, "climb", 260), at(p, "climb", 260) + 40);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,100" tint="#0c1016">
      <AbsoluteFill style={{ background: "linear-gradient(#18263a 0%, #3e3a3a 60%, #231a13 100%)" }} />
      <SV>
        <rect x={0} y={860} width={1920} height={220} fill="#211811" />
        <line x1={960} y1={180} x2={960} y2={1000} stroke="rgba(255,255,255,.15)" strokeWidth={3} />
        <Leo x={300} y={862} s={1.0} c="#140c07" eye={0.5 + 0.5 * Math.sin(f / 18)} />
        {Array.from({ length: 14 }).map((_, q) => <path key={q} d={`M${200 + q * 34},860 Q${190 + q * 36 + Math.sin(f / 16 + q) * 10},${560 - rnd(q, 2) * 80} ${215 + q * 34},860`} fill="#1d2e1e" />)}
        <path d="M1240,868 Q1270,800 1360,792 Q1460,790 1490,868 Z" fill="#45413c" />
        <g transform={`translate(0,${-climb * 360})`}><Leo x={1300 - climb * 40} y={862} s={0.62} crouch={0.3 + 0.6 * flat * (1 - climb)} eye={0.7} op={1} /></g>
        <path d="M1700,860 L1712,200 L1740,200 L1752,860 Z" fill="#0d1a17" /><path d="M1726,520 L1560,460" stroke="#0d1a17" strokeWidth={20} strokeLinecap="round" />
        <g opacity={flat}><line x1={1180} y1={790} x2={1180} y2={868} stroke={GOLD} strokeWidth={6} /><line x1={1165} y1={790} x2={1195} y2={790} stroke={GOLD} strokeWidth={6} /></g>
      </SV>
      <Tag a={at(p, "tiger", 20)} t="A TIGER NEEDS BIG COVER" x={480} y={140} size={46} color={ORA} w={860} />
      <Tag a={at(p, "knee", 120)} t="A LEOPARD: A ROCK KNEE-HIGH" x={1440} y={140} size={46} color={GOLD} w={860} />
      <Tag a={at(p, "climb", 260)} t="IT CLIMBS" x={1640} y={300} size={44} w={400} />
    </Scene>
  );
};

// 22 · THREADS TO THE CAT: tres hilos rojos que nacen de tres cosas humanas (bala, pira, hacha que tala) y convergen en la silueta del leopardo
export const ThreadsToCat: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const S = [["CARELESS WOUNDS", 300, 260, at(p, "w", 20)], ["BODIES ON HILLSIDES", 300, 540, at(p, "b", 100)], ["FORESTS CUT · PREY HUNTED OUT", 300, 820, at(p, "c", 200)]] as const;
  const all = ez(f, at(p, "cause", d - 90), at(p, "cause", d - 90) + 20);
  return (
    <Scene d={d} bg={p.bg} floor="255,120,90" tint="#0b0a0e">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 55%, #2a1416 0%, #07070a 78%)" }} />
      <SV>
        {S.map(([t, x, y, a], i) => { const k = ez(f, a + 10, a + 50);
          return <g key={t}><path d={`M${x + 360},${y} C${x + 700},${y} ${1000},${560} ${1300},${560}`} stroke={RED} strokeWidth={6 + 4 * all} fill="none" strokeDasharray={1200} strokeDashoffset={1200 * (1 - k)} opacity={0.85} />
            <circle cx={x + 360} cy={y} r={12} fill={RED} opacity={ez(f, a, a + 8)} /></g>; })}
        <Leo x={1420} y={640} s={0.9} c="#0e0909" eye={0.8} />
        <circle cx={1540} cy={560} r={240} fill="none" stroke={RED} strokeWidth={5} opacity={all * (0.6 + 0.4 * Math.sin(f / 6))} />
      </SV>
      {S.map(([t, x, y, a]) => <div key={t} style={{ position: "absolute", left: x - 220, top: y - 40, width: 580, textAlign: "right", fontFamily: F, fontWeight: 900, fontSize: 44, color: INK, opacity: ez(f, a, a + 10) }}>{t}</div>)}
      <Tag a={at(p, "cause", d - 90)} t="PEOPLE ARE PART OF THE CAUSE" x={1420} y={880} size={46} color={RED} w={900} />
    </Scene>
  );
};
