// dur29b — componentes ÚNICOS (uno por minuto, ninguno repetido en la tanda): cada uno es el OBJETO que la frase es.
// p.at = cuadros (desde el arranque del plano) de las palabras clave, los arma tools/mkplan_core.py desde words.json.
import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import { useCurrentFrame } from "remotion";
import * as K from "./comp";
import * as VA from "./v3a";
import * as VB from "./v3b";
import * as VC from "./v3c";
import * as VD from "./v3d";
import * as VE from "./v3e";
import * as VF from "./v3f";
import * as VG from "./v3g";
import * as VH from "./v3h";
import * as VI from "./v3i";
import { F, INK, RED, ORA, GOLD, SAND, Scene, Tag, Shadow, Motes, Fig, ez, lin, sp, rnd, sf, at, cl } from "./ukit";

type UP = { d: number; p: any };
const W = 1920, H = 1080;

// 1 · POZO EN CORTE: la montaña cortada al medio, la cámara baja por el pozo hasta los 200 m (vela y escalera de cuero)
const PozoCorte: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const k = ez(f, 22, d - 2), depth = Math.round(200 * k);
  const ty = -k * 1500, zin = 0.82 + 0.18 * ez(f, 0, 24);
  return (
    <Scene d={d} bg={p.bg} floor="255,150,80">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="mt1"><path d="M-40,520 L700,120 L960,40 L1240,140 L1960,520 L1960,2800 L-40,2800 Z" /></clipPath></defs>
        <g transform={`translate(960,540) scale(${zin}) translate(-960,-540) translate(0,${ty})`}>
          <path d="M-40,520 L700,120 L960,40 L1240,140 L1960,520 L1960,2800 L-40,2800 Z" fill="#7a3a22" />
          {p.bg && <image href={sf(p.bg)} x={-40} y={20} width={2000} height={1125} preserveAspectRatio="xMidYMid slice" clipPath="url(#mt1)" opacity={0.85} />}
          <rect x={-40} y={700} width={2000} height={2100} fill="#5e2b18" opacity={0.9} clipPath="url(#mt1)" />
          {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M-40,${600 + i * 100} Q960,${560 + i * 100 + Math.sin(i) * 30} 1960,${610 + i * 100}`} stroke="#5e2b18" strokeWidth={3 + (i % 3)} fill="none" opacity={0.6} />)}
          <rect x={930} y={180} width={60} height={2420} fill="#120806" />
          {Array.from({ length: 60 }).map((_, i) => <line key={i} x1={938} y1={200 + i * 40} x2={982} y2={200 + i * 40} stroke="#8a5a32" strokeWidth={5} />)}
          <line x1={938} y1={180} x2={938} y2={2600} stroke="#6a4024" strokeWidth={5} /><line x1={982} y1={180} x2={982} y2={2600} stroke="#6a4024" strokeWidth={5} />
          <g transform={`translate(960,${700 + k * 1500})`}>
            <circle r={90 + Math.sin(f / 5) * 6} fill="rgba(255,190,90,.22)" />
            <Fig x={-4} y={40} s={0.9} c="#0d0806" load arm={0.6} />
            <path d={`M10,-60 q-5,-12 0,-22 q5,10 0,22`} fill="#ffd27a" transform="translate(0,-20)" />
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", right: 140, top: 380, fontFamily: F, fontWeight: 900, fontSize: 150, color: INK, fontVariantNumeric: "tabular-nums", textShadow: "0 6px 30px rgba(0,0,0,.8)" }}>{depth} m</div>
      <div style={{ position: "absolute", right: 150, top: 550, width: 18, height: 300, borderRadius: 9, background: "rgba(240,235,229,.2)" }}><div style={{ width: 18, height: 300 * k, borderRadius: 9, background: ORA }} /></div>
      <Motes c="255,200,140" />
    </Scene>
  );
};

// 2 · EL CUADRO TAPADO: un marco dorado bajo una tela; la esquina se levanta un poco, deja ver un pedazo y vuelve a caer
const CuadroVelado: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const t = sp(f, 4, 1.2, 14), lift = Math.sin(Math.min(1, Math.max(0, (f - at(p, "pintor", 30)) / 50)) * Math.PI) * 0.75;
  const flut = Math.sin(f / 9) * 6;
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98">
      <div style={{ position: "absolute", left: 460, top: 170 + (1 - t) * 80, width: 1000, height: 640, opacity: t, border: "26px solid #b88a3e", boxShadow: "0 40px 90px rgba(0,0,0,.75), inset 0 0 0 6px #6a4a1e", background: "#2a2018" }}>
        <Img src={sf(p.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.85) brightness(.9)" }} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={`M430,${150 + (1 - t) * 80} L1490,${150 + (1 - t) * 80} L1500,${840 - lift * 420 + flut} Q${1200 - lift * 160},${880 - lift * 300} ${980 - lift * 380},${846 - lift * 120} L420,860 Z`} fill="#3b0f12" stroke="#200608" strokeWidth={4} opacity={t} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${560 + i * 180},${170} Q${580 + i * 180 + flut},${520} ${550 + i * 180},${850 - (i > 2 ? lift * 260 * (i - 2) / 2 : 0)}`} stroke="#5a1a1e" strokeWidth={6} fill="none" opacity={0.6 * t} />)}
      </svg>
      <Tag a={at(p, "pintor", 30) + 40} t="#8" x={1560} y={150} size={120} color={RED} rot={-8} w={300} />
      <Motes c="255,230,170" />
    </Scene>
  );
};

// 3 · LA RACIÓN: pan, cebolla y la jarra de cerveza espesa que se llena hasta la marca de 4-5 litros
const RacionPan: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a1 = at(p, "pan", 6), a2 = at(p, "cebolla", a1 + 12), a3 = at(p, "litros", a2 + 20);
  const lvl = ez(f, a3 - 6, a3 + 40);
  const drop = (a: number) => { const s = sp(f, a, 1.3, 9); return { y: (1 - s) * -420, k: Math.min(1, s), r: (1 - s) * 30 }; };
  const b = drop(a1), o = drop(a2), j = drop(a1 + 6);
  return (
    <Scene d={d} bg={p.bg} floor="255,190,110">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d="M260,820 L1660,820 L1760,960 L160,960 Z" fill="#a8803e" /><path d="M260,820 L1660,820" stroke="#d6b46a" strokeWidth={6} />
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={300 + i * 100} y1={822} x2={240 + i * 110} y2={958} stroke="#8a6a30" strokeWidth={3} />)}
        <Shadow x={560} y={840} w={170} k={b.k} /><Shadow x={880} y={840} w={90} k={o.k} /><Shadow x={1300} y={840} w={150} k={j.k} />
        <g transform={`translate(560,${780 + b.y}) rotate(${b.r})`}><ellipse rx={170} ry={62} fill="#c98a3e" /><ellipse rx={150} ry={46} cy={-10} fill="#e0a456" /><path d="M-90,-20 q30,-20 60,0 M0,-28 q30,-18 60,0" stroke="#a9692c" strokeWidth={8} fill="none" /></g>
        <g transform={`translate(880,${790 + o.y}) rotate(${-o.r})`}><ellipse rx={70} ry={58} fill="#d8c7a8" /><path d="M0,-58 q8,-34 -6,-60" stroke="#7a8a3a" strokeWidth={8} fill="none" /><path d="M-30,-40 q30,50 0,98 M20,-46 q-20,50 6,100" stroke="#bfae8a" strokeWidth={4} fill="none" /></g>
        <g transform={`translate(1300,${560 + j.y})`}>
          <defs><clipPath id="jar3"><path d="M-120,0 Q-160,120 -110,260 L110,260 Q160,120 120,0 Z" /></clipPath></defs>
          <path d="M-120,0 Q-160,120 -110,260 L110,260 Q160,120 120,0 Z" fill="#8a4a2a" />
          <g clipPath="url(#jar3)"><rect x={-170} y={260 - 240 * lvl} width={340} height={260} fill="#c9a24a" /><path d={`M-170,${260 - 240 * lvl} q40,${Math.sin(f / 6) * 8} 85,0 t85,0 t85,0 t85,0`} fill="#ead18a" /></g>
          <path d="M-120,0 Q-160,120 -110,260 L110,260 Q160,120 120,0 Z" fill="none" stroke="#5a2a14" strokeWidth={8} />
          <ellipse cx={0} cy={0} rx={120} ry={22} fill="#6a3218" />
          {[1, 2, 3, 4, 5].map((l) => <g key={l}><line x1={130} y1={260 - l * 46} x2={170} y2={260 - l * 46} stroke={INK} strokeWidth={4} /><text x={180} y={270 - l * 46} fontFamily={F} fontWeight={900} fontSize={30} fill={l <= Math.round(lvl * 5.2) ? GOLD : "rgba(240,235,229,.5)"}>{l} L</text></g>)}
        </g>
      </svg>
      <Tag a={a3 + 30} t="cerveza. diaria." x={1300} y={160} size={64} color={GOLD} w={700} />
      <Motes />
    </Scene>
  );
};

// 4 · TRINEO Y DINAMÓMETRO: el agua oscurece la arena y la aguja de la fuerza cae a la mitad
const TrineoFriccion: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aW = at(p, "agua", 40), aM = at(p, "mitad", aW + 60);
  const wet = ez(f, aW, aW + 40), drop = sp(f, aM - 10, 1.4, 8);
  const force = 1 - 0.5 * Math.min(1, drop) + Math.sin(f / 7) * 0.02 * (1 - wet);
  const slide = f * (0.6 + wet * 1.4);
  const ang = -120 + 240 * force;
  return (
    <Scene d={d} bg={p.bg} floor="255,200,120">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={760} width={W} height={320} fill="#d9b27c" />
        <rect x={0} y={760} width={1300 * wet} height={320} fill="#9a7444" opacity={0.75} style={{ transform: `translateX(${720 - 720 * wet}px)` } as any} />
        {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M${((i * 140 - slide * 2) % 2100 + 2100) % 2100 - 100},${800 + (i % 4) * 60} q30,-6 60,0`} stroke="#b8925c" strokeWidth={4} fill="none" />)}
        <g transform="translate(560,0)">
          <Shadow x={0} y={772} w={260} />
          <rect x={-250} y={720} width={500} height={34} rx={14} fill="#6a4628" /><path d="M250,720 q60,0 70,34" stroke="#6a4628" strokeWidth={14} fill="none" />
          <rect x={-220} y={470} width={440} height={250} fill="#d8cdb6" stroke="#a89a80" strokeWidth={6} />
          <path d="M-220,560 L220,560 M-80,470 L-80,720" stroke="#bfb196" strokeWidth={4} />
          <path d="M330,736 L1180,700" stroke="#c9a46a" strokeWidth={14} />
        </g>
        <g transform={`translate(1000,${640})`} opacity={1 - ez(f, aW + 70, aW + 90)}>
          <g transform={`rotate(${-20 - 60 * ez(f, aW - 10, aW + 10)})`}><path d="M-50,-60 Q-80,0 -40,60 L40,60 Q80,0 50,-60 Z" fill="#9a5a32" /><ellipse cx={0} cy={-60} rx={50} ry={12} fill="#6a3218" /></g>
          {wet > 0.01 && wet < 0.98 && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-40 - i * 6} cy={40 + ((f * 9 + i * 13) % 110)} r={7} fill="#7ab8e0" opacity={0.8} />)}
        </g>
        <g transform="translate(1500,330)">
          <circle r={190} fill="#efe6d2" stroke="#7a5a2a" strokeWidth={16} />
          <path d={`M0,0 m-160,0 a160,160 0 0,1 320,0`} fill="none" stroke="rgba(0,0,0,.15)" strokeWidth={30} />
          {Array.from({ length: 11 }).map((_, i) => { const a = (-120 + i * 24) * Math.PI / 180; return <line key={i} x1={Math.sin(a) * 150} y1={-Math.cos(a) * 150} x2={Math.sin(a) * 175} y2={-Math.cos(a) * 175} stroke="#2a2018" strokeWidth={i % 5 ? 4 : 8} />; })}
          <line x1={0} y1={0} x2={Math.sin(ang * Math.PI / 180) * 150} y2={-Math.cos(ang * Math.PI / 180) * 150} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <circle r={16} fill="#2a2018" />
          <path d="M-190,10 L-420,330" stroke="#c9a46a" strokeWidth={10} />
        </g>
      </svg>
      <Tag a={aM} t="LA MITAD." x={1500} y={560} size={86} color={RED} w={600} />
      <Tag a={aW + 6} t="arena mojada" x={1000} y={880} size={50} color={INK} w={600} />
    </Scene>
  );
};

// 5 · LA MARCA DE LA CUADRILLA: un pincel de ocre rojo pinta el nombre del grupo sobre el bloque, trazo por trazo
const MarcaCuadrilla: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a = at(p, "amigos", 30);
  const strokes = ["M640,420 q30,-60 70,0 q40,60 80,0", "M820,360 L820,520", "M880,380 q50,40 0,90 q-40,40 20,60", "M980,360 L1060,520 M1060,360 L980,520", "M1110,440 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0", "M1240,360 L1240,520 L1300,520", "M600,320 L1340,320 L1340,560 L600,560 Z"];
  const bx = 960 + Math.sin(f / 8) * 6;
  const prog = lin(f, a - 50, a + 10, 0, strokes.length);
  const cur = Math.min(strokes.length - 1, Math.floor(prog));
  return (
    <Scene d={d} bg={p.bg} floor="255,180,120">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={360} y={160} width={1200} height={740} fill="#d9cdb4" />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={380 + rnd(i, 2) * 1160} cy={180 + rnd(i, 3) * 700} r={3 + rnd(i, 4) * 10} fill="#c4b698" />)}
        {strokes.map((s, i) => <path key={i} d={s} stroke="#b0381e" strokeWidth={i === 6 ? 10 : 18} strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, prog - i))} opacity={0.88} />)}
        <g transform={`translate(${prog < strokes.length ? bx + (cur - 3) * 90 : 1500},${prog < strokes.length ? 380 + Math.sin(f / 4) * 40 : 820}) rotate(-35)`}>
          <rect x={-8} y={-220} width={16} height={200} rx={6} fill="#6a4628" /><path d="M-14,-20 L14,-20 L6,30 L-6,30 Z" fill="#7a2a14" />
        </g>
      </svg>
      <Tag a={a + 14} t="«Los Amigos del Rey Keops»" x={960} y={640} size={70} color={INK} w={1300} />
      <Motes />
    </Scene>
  );
};

// 6 · LA MONTAÑA COMO UN QUESO: se cavan las galerías una por una, entra el torrente y la montaña entera se desploma
const MontanaQueso: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aG = at(p, "galerias", 20), aA = at(p, "agua", aG + 100), aC = at(p, "cae", aA + 60);
  const N = 9, dug = lin(f, aG - 60, aG + 60, 0, N);
  const water = ez(f, aA, aA + 40), fall = ez(f, aC, aC + 26), dust = ez(f, aC, aC + 60);
  const tun = (i: number) => { const r = Math.floor(i / 3), c = i % 3; return { x: 640 + c * 220 + r * 40, y: 560 + r * 110, w: 180 + (i % 2) * 40 }; };
  return (
    <Scene d={d} bg={p.bg} floor="255,150,90">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={900} width={W} height={180} fill="#3e2416" />
        <g transform={`translate(0,${fall * 260}) scale(1,${1 - fall * 0.45})`} style={{ transformOrigin: "960px 900px" } as any}>
          <path d={`M300,900 L780,${300 + fall * 120} Q960,${220 + fall * 200} 1140,${300 + fall * 140} L1620,900 Z`} fill="#b0532e" />
          <path d="M520,700 Q960,640 1400,700" stroke="#8e3f22" strokeWidth={6} fill="none" opacity={1 - fall} />
          {Array.from({ length: N }).map((_, i) => { const t = tun(i), k = Math.max(0, Math.min(1, dug - i));
            return <g key={i}><rect x={t.x} y={t.y} width={t.w * k} height={46} rx={18} fill={water > 0 ? `rgb(${30 + (1 - water) * 10},${40 + water * 60},${60 + water * 120})` : "#1a0c06"} opacity={1 - fall * 0.8} /></g>; })}
        </g>
        <path d={`M1920,${520} L1700,520 Q1640,520 1620,600 L${1620 - water * 140},${640}`} stroke="#4a8ac0" strokeWidth={30} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, water * 1.4)} />
        {Array.from({ length: 24 }).map((_, i) => { const a = (i / 24) * Math.PI * 2, r = dust * (180 + rnd(i, 9) * 340);
          return <circle key={i} cx={960 + Math.cos(a) * r * 1.6} cy={760 - Math.abs(Math.sin(a)) * r * 0.8} r={60 + dust * 80} fill="#c08a60" opacity={0.42 * Math.sin(dust * Math.PI)} />; })}
      </svg>
      <Tag a={aG} t="galerías" x={960} y={180} size={64} color={INK} w={700} />
      <Tag a={aC + 8} t="RUINA MONTIUM" x={960} y={140} size={96} color={RED} w={1400} />
    </Scene>
  );
};

// 7 · EL HILO DE TIERRA: en el techo de la galería se abre una grieta y cae un hilito que va armando un cono en el piso
const HiloTierra: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aH = at(p, "hilo", 20), aR = at(p, "corre", aH + 60);
  const flow = ez(f, aH, aH + 12), crack = ez(f, aH - 10, aR + 10), cone = lin(f, aH, d, 0, 1);
  const lamp = 0.8 + 0.2 * Math.sin(f / 3.3) * Math.sin(f / 7.1);
  return (
    <Scene d={d} bg={p.bg} floor="255,170,80" tint="#0a0604">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="lamp7" cx="0.3" cy="0.7" r="0.7"><stop offset="0" stopColor={`rgba(255,180,90,${0.55 * lamp})`} /><stop offset="1" stopColor="rgba(0,0,0,0)" /></radialGradient></defs>
        <path d="M0,0 L1920,0 L1920,300 Q960,380 0,300 Z" fill="#4a2414" />
        <path d="M0,860 Q960,800 1920,860 L1920,1080 L0,1080 Z" fill="#3a1c10" />
        {[300, 1500].map((x, i) => <g key={i}><rect x={x} y={300} width={44} height={540} fill="#6a4628" /><rect x={x - 100} y={290} width={244} height={36} fill="#7a5230" /></g>)}
        <rect x={0} y={0} width={W} height={H} fill="url(#lamp7)" />
        <path d={`M960,320 l-30,${-10 - crack * 6} l-70,-12 M960,320 l40,-20 l90,-6 l60,-22 M960,320 l10,-40`} stroke="#1a0804" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
        {flow > 0 && Array.from({ length: 40 }).map((_, i) => { const y = 330 + ((f * 14 + i * 37) % 520); return <circle key={i} cx={960 + Math.sin(i * 1.7) * 4} cy={y} r={2.5 + (i % 3)} fill="#c08a60" opacity={flow} />; })}
        <path d={`M${960 - 30 - cone * 150},850 Q960,${850 - 30 - cone * 90} ${960 + 30 + cone * 150},850 Z`} fill="#8a5a3a" />
        <g transform="translate(330,640)"><path d="M0,0 q-20,30 0,50 q20,-20 0,-50" fill="#ffcf7a" opacity={lamp} /><ellipse cx={0} cy={58} rx={40} ry={14} fill="#7a4a2a" /></g>
      </svg>
      <Tag a={aR} t="¡SE CORRE!" x={960} y={140} size={110} color={RED} w={900} rot={-4} />
    </Scene>
  );
};

// 8 · EL MURO POR CAPAS: cajón de tablas, la tierra cae, el pisón la aprieta y la capa se achica; capa tras capa el muro sube
const MuroCapas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a0 = at(p, "cajon", 10), aP = at(p, "pison", a0 + 40), aC = at(p, "capa", aP + 40);
  const per = 34, n = Math.max(0, Math.floor((f - aP) / per)), ph = Math.max(0, ((f - aP) % per) / per);
  const layers = Math.min(9, n + (f >= aP ? 1 : 0));
  const hit = f >= aP ? Math.abs(Math.sin(ph * Math.PI)) : 0;
  const curH = 70 - 34 * Math.min(1, ph * 1.4);
  const base = 900, LH = 36;
  return (
    <Scene d={d} bg={p.bg} floor="230,200,150">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={base} width={W} height={180} fill="#6a5034" />
        {Array.from({ length: Math.max(0, layers - 1) }).map((_, i) => <rect key={i} x={560} y={base - (i + 1) * LH} width={800} height={LH - 3} fill={i % 2 ? "#c8a46c" : "#bb975e"} />)}
        {f >= a0 + 10 && <rect x={560} y={base - (layers - 1) * LH - curH} width={800} height={curH} fill="#d8b884" />}
        {[0, 1].map((s) => <g key={s}><rect x={s ? 1360 : 530} y={base - (layers + 2) * LH - 40 * ez(f, a0, a0 + 20)} width={30} height={(3) * LH + 40} fill="#7a5230" /><rect x={s ? 1388 : 508} y={base - (layers + 3) * LH} width={14} height={4 * LH + 20} fill="#5a3a20" /></g>)}
        <g transform={`translate(${760 + (n % 3) * 200},${base - (layers - 1) * LH - curH - 200 + hit * -120 + 120})`}>
          <rect x={-10} y={-260} width={20} height={260} fill="#7a5230" /><rect x={-50} y={0} width={100} height={60} rx={12} fill="#8a8274" />
        </g>
        {f >= aP && ph < 0.25 && Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={760 + (n % 3) * 200 + (i - 4) * 18} cy={base - (layers - 1) * LH - curH - 6 - ph * 60} r={5} fill="#d8b884" opacity={1 - ph * 4} />)}
      </svg>
      <Tag a={aC} t={`capa ${Math.max(1, layers)}`} x={960} y={base - layers * LH - 220} size={64} color={GOLD} w={600} />
      <Tag a={aC} t="10 cm" x={1560} y={base - LH - 30} size={46} color={INK} w={260} />
      <Motes c="240,220,180" />
    </Scene>
  );
};

// 9 · EL RITMO DE LOS PISONES: seis pisones suben y bajan juntos; uno se sale del ritmo y se enciende en rojo
const RitmoPisones: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aR = at(p, "ritmo", 20), aF = at(p, "fuera", aR + 50);
  const off = ez(f, aF, aF + 8);
  return (
    <Scene d={d} bg={p.bg} floor="230,200,150">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={820} width={W} height={260} fill="#bb975e" />
        {[0, 1, 2, 3, 4, 5].map((i) => { const bad = i === 4; const ph = f / 22 + (bad ? off * 1.3 : 0); const y = Math.abs(Math.sin(ph * Math.PI)) * 220;
          return <g key={i} transform={`translate(${310 + i * 260},${600 - y})`}>
            <rect x={-10} y={-300} width={20} height={300} fill={bad && off > 0.5 ? "#a8321e" : "#7a5230"} />
            <rect x={-56} y={0} width={112} height={66} rx={14} fill={bad && off > 0.5 ? RED : "#8a8274"} style={{ filter: bad && off > 0.5 ? `drop-shadow(0 0 20px ${RED})` : undefined } as any} />
            <ellipse cx={0} cy={240 + y} rx={70 - y * 0.15} ry={10} fill="rgba(0,0,0,.4)" />
          </g>; })}
      </svg>
      <Tag a={aR} t="todos al mismo tiempo" x={960} y={150} size={66} color={INK} w={1400} />
      <Tag a={aF + 4} t="fuera de ritmo" x={1350} y={300} size={58} color={RED} w={600} rot={-4} />
    </Scene>
  );
};

// 10 · LA RED DE POSTAS: un camino que serpentea por la estepa con postas cada ~35 km; el jinete salta a un caballo fresco en cada una
const RutaPostas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aP = at(p, "postas", 20), aS = at(p, "salta", aP + 60);
  const run = lin(f, 6, d, 0, 1);
  const pts = Array.from({ length: 7 }).map((_, i) => [180 + i * 260, 640 + Math.sin(i * 1.3) * 120]);
  const path = "M" + pts.map((q) => q.join(",")).join(" L");
  const seg = run * 6, si = Math.min(5, Math.floor(seg)), sk = seg - si;
  const hx = pts[si][0] + (pts[si + 1][0] - pts[si][0]) * sk, hy = pts[si][1] + (pts[si + 1][1] - pts[si][1]) * sk;
  return (
    <Scene d={d} bg={p.bg} floor="190,220,140">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={path} stroke="#e8d7a8" strokeWidth={16} fill="none" strokeDasharray="30 20" opacity={0.8} />
        <path d={path} stroke={ORA} strokeWidth={16} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - run} />
        {pts.map((q, i) => { const s = sp(f, aP + i * 6, 0.9, 10);
          return <g key={i} transform={`translate(${q[0]},${q[1] - 70}) scale(${s})`}><path d="M-46,40 Q0,-50 46,40 Z" fill="#efe2c4" stroke="#8a6a3a" strokeWidth={5} /><line x1={0} y1={-34} x2={0} y2={-60} stroke="#8a6a3a" strokeWidth={4} /><text y={110} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill={INK}>{i ? `${i * 35} km` : "0"}</text></g>; })}
        <g transform={`translate(${hx},${hy - 30})`}>
          <ellipse rx={40} ry={18} fill={si % 2 ? "#5a3a22" : "#8a5a32"} /><path d={`M30,-6 L58,-30 L64,-20 L44,4`} fill={si % 2 ? "#5a3a22" : "#8a5a32"} />
          {[0, 1, 2, 3].map((l) => <line key={l} x1={-28 + l * 18} y1={10} x2={-28 + l * 18 + Math.sin(f / 2 + l) * 12} y2={44} stroke="#3a2414" strokeWidth={7} strokeLinecap="round" />)}
          <circle cx={0} cy={-36} r={13} fill="#1a120d" /><rect x={-9} y={-28} width={18} height={22} fill="#1a120d" />
          {sk < 0.15 && f > aS && <circle r={70 * sk * 6} fill="none" stroke={GOLD} strokeWidth={5} opacity={1 - sk * 6} />}
        </g>
      </svg>
      <Tag a={aS} t="caballo fresco" x={960} y={170} size={66} color={GOLD} w={900} />
    </Scene>
  );
};

// 11 · EL CUENTAKILÓMETROS DEL GALOPE: los tambores ruedan hasta 400 mientras el sol cruza de punta a punta en un solo día
const Odometro400: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a = at(p, "km", 10), k = ez(f, a - 10, a + 40), v = 400 * k;
  const digs = [Math.floor(v / 100), Math.floor(v / 10) % 10, Math.floor(v) % 10];
  const sun = lin(f, 0, d, 0.05, 0.95);
  return (
    <Scene d={d} bg={p.bg} floor="255,200,120">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d="M260,640 A700,520 0 0,1 1660,640" stroke="rgba(240,235,229,.25)" strokeWidth={6} fill="none" strokeDasharray="12 16" />
        <circle cx={960 - Math.cos(sun * Math.PI) * 700} cy={640 - Math.sin(sun * Math.PI) * 520} r={56} fill="#ffcf6a" style={{ filter: "drop-shadow(0 0 40px #ffb84a)" } as any} />
        <text x={250} y={700} fontFamily={F} fontWeight={800} fontSize={36} fill={INK}>amanecer</text><text x={1560} y={700} fontFamily={F} fontWeight={800} fontSize={36} fill={INK}>noche</text>
      </svg>
      <div style={{ position: "absolute", left: 960 - 330, top: 720, display: "flex", gap: 18, padding: 22, borderRadius: 22, background: "linear-gradient(#2a2420,#120e0c)", border: "6px solid #8a6a3a", boxShadow: "0 30px 70px rgba(0,0,0,.7)" }}>
        {digs.map((dg, i) => { const frac = i === 2 ? v % 1 : i === 1 ? (v % 10) / 10 > 0.9 ? ((v % 10) - 9) : 0 : 0;
          return <div key={i} style={{ width: 150, height: 190, overflow: "hidden", borderRadius: 12, background: "#f2ede4", position: "relative" }}>
            <div style={{ position: "absolute", top: -190 * (dg + frac) + 0, left: 0, width: 150 }}>{Array.from({ length: 11 }).map((_, n) => <div key={n} style={{ height: 190, lineHeight: "190px", textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 150, color: "#1a1410" }}>{n % 10}</div>)}</div>
          </div>; })}
        <div style={{ alignSelf: "flex-end", fontFamily: F, fontWeight: 900, fontSize: 70, color: GOLD, marginLeft: 10 }}>km</div>
      </div>
      <Tag a={a + 44} t="en UN día" x={960} y={180} size={84} color={RED} w={900} />
    </Scene>
  );
};

// 12 · EL FAJADO: el torso en silueta; las vendas se enrollan en espiral (panza, pecho) y los órganos dejan de sacudirse
const Fajado: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aV = at(p, "vendas", 20), aO = at(p, "organos", aV + 50);
  const wrap = lin(f, aV, aV + 60, 0, 1), shake = (1 - ez(f, aV + 30, aV + 70)) * Math.sin(f / 1.6) * 10 * (f > 8 ? 1 : 0);
  const bounce = Math.sin(f / 5) * 14;
  return (
    <Scene d={d} bg={p.bg} floor="255,200,140">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(960,${560 + bounce * 0.4})`}>
          <circle cx={0} cy={-470} r={78} fill="#2a1c14" /><rect x={-40} y={-410} width={80} height={70} fill="#2a1c14" />
          <path d="M-200,-330 Q-330,-320 -360,-160 L-330,120 L-280,120 L-260,-150 Q-250,-120 -190,120 Q-160,260 -120,330 L120,330 Q160,260 190,120 Q250,-120 260,-150 L280,120 L330,120 L360,-160 Q330,-320 200,-330 Q0,-370 -200,-330 Z" fill="#2a1c14" />
          <g opacity={0.9}>
            <path d={`M${-30 + shake},-300 Q${-170 + shake},-280 ${-150 + shake},-40 Q${-90 + shake},0 ${-30 + shake},-60 Z`} fill="#a8424a" opacity={0.85} /><path d={`M${30 - shake},-300 Q${170 - shake},-280 ${150 - shake},-40 Q${90 - shake},0 ${30 - shake},-60 Z`} fill="#a8424a" opacity={0.85} />
            <path d={`M${-20 + shake},-150 q-36,-30 -50,10 q10,50 50,80 q40,-30 50,-80 q-14,-40 -50,-10`} fill="#c0303a" />
            <ellipse cx={-40 + shake * 1.4} cy={50} rx={100} ry={52} fill="#b05a3a" /><path d={`M-110,${130 + shake} q40,-40 80,0 t80,0 t80,0`} stroke="#c87a5a" strokeWidth={26} fill="none" />
          </g>
          {Array.from({ length: 9 }).map((_, i) => { const k = Math.max(0, Math.min(1, wrap * 9 - i)); const y = 240 - i * 56;
            return <path key={i} d={`M-230,${y} Q0,${y + 40} 230,${y - 10}`} stroke={i % 2 ? "#e8dcc4" : "#d8caa8"} strokeWidth={50} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />; })}
        </g>
      </svg>
      <Tag a={aV} t="vendas apretadas" x={1500} y={220} size={56} color={INK} w={600} />
      <Tag a={aO} t="para que no se sacudan" x={1500} y={760} size={50} color={GOLD} w={640} />
    </Scene>
  );
};

// 13 · LA CARGA DE LAS CINCO COSAS: los sacos caen sobre la espalda de a uno (con su palabra) y las piernas se doblan más cada vez
const CincoSacos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const words = ["AGUA", "POLVO", "TECHO", "CANSANCIO", "NADIE TE PREGUNTA"];
  const ats = [at(p, "s5", -40), at(p, "s4", -20), at(p, "s3", 10), at(p, "s2", 120), at(p, "s1", 260)];
  const landed = ats.map((a) => Math.min(1, Math.max(0, sp(f, a, 1.4, 9))));
  const load = landed.reduce((s, k) => s + k, 0);
  const bend = load * 5, wob = landed[4] > 0.5 ? Math.sin(f / 6) * 3 * (1 - ez(f, ats[4] + 20, ats[4] + 80)) : 0;
  return (
    <Scene d={d} bg={p.bg} floor="255,170,110">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={900} width={W} height={180} fill="#4a3222" />
        <g transform={`translate(700,${930}) scale(1.15) rotate(${wob})`}>
          <path d={`M0,0 L${-20 - bend},-${150 - bend * 3} L0,-${300 - bend * 6}`} stroke="#1a120d" strokeWidth={34} fill="none" strokeLinecap="round" />
          <path d={`M60,0 L${40 - bend},-${150 - bend * 3} L40,-${300 - bend * 6}`} stroke="#1a120d" strokeWidth={34} fill="none" strokeLinecap="round" />
          <path d={`M20,-${300 - bend * 6} Q${120 + bend * 4},-${470 - bend * 6} ${260 + bend * 6},-${430 - bend * 10}`} stroke="#1a120d" strokeWidth={64} fill="none" strokeLinecap="round" />
          <circle cx={300 + bend * 7} cy={-400 + bend * 10} r={38} fill="#1a120d" />
          {words.map((w, i) => { const k = landed[i]; const yy = -(520 - bend * 8) - i * 74; const big = i === 4;
            return <g key={i} transform={`translate(${150 + bend * 3 + i * 46},${yy + (1 - k) * -700}) rotate(${(1 - k) * 25 + (i % 2 ? 3 : -3)})`} opacity={k > 0 ? 1 : 0}>
              <rect x={big ? -230 : -150} y={-46} width={big ? 460 : 300} height={92} rx={30} fill={big ? "#7a2a1e" : "#8a6a44"} stroke="#3a2414" strokeWidth={5} />
              <text textAnchor="middle" y={14} fontFamily={F} fontWeight={900} fontSize={big ? 40 : 44} fill={big ? INK : "#1a1410"}>{`#${5 - i} ${w}`}</text>
            </g>; })}
        </g>
      </svg>
    </Scene>
  );
};

// 14 · SIN RUEDA NI ANIMALES: caballo, buey, mula y carreta aparecen y se tachan; queda sólo una persona con la carga
const SinRueda: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const ks = ["caballos", "bueyes", "mulas", "rueda"].map((k, i) => at(p, k, 10 + i * 25));
  const aT = at(p, "tu", ks[3] + 60);
  const icons = [
    "M-70,20 Q-60,-30 0,-30 L50,-60 L70,-40 L50,-10 Q60,30 40,40 M-60,30 L-60,70 M-30,40 L-30,70 M20,40 L20,70 M40,40 L40,70",
    "M-80,0 Q-70,-40 0,-40 Q60,-40 70,-10 L90,-30 M-80,0 L-80,60 M-40,10 L-40,60 M30,10 L30,60 M60,0 L60,60 M70,-10 Q80,-40 60,-50",
    "M-60,10 Q-50,-30 0,-30 L40,-60 L46,-90 L56,-60 L66,-90 L66,-40 Q60,20 40,30 M-50,20 L-50,70 M-20,30 L-20,70 M20,30 L20,70",
    "M-90,-20 L60,-20 L60,20 L-90,20 Z M-40,40 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 M70,0 L110,-30",
  ];
  return (
    <Scene d={d} bg={p.bg} floor="255,200,130">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {icons.map((ic, i) => { const s = sp(f, ks[i] - 8, 1, 11), x = 330 + i * 300, gone = ez(f, aT, aT + 18);
          return <g key={i} transform={`translate(${x},${420 - gone * 60}) scale(${1.3 * s})`} opacity={1 - gone * 0.75}>
            <path d={ic} stroke="#efe2c4" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M-110,-90 L110,90" stroke={RED} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(f, ks[i] + 4, ks[i] + 12)} />
          </g>; })}
        <g transform={`translate(${1560 - (1 - sp(f, aT, 1.2, 12)) * 400},${830})`} opacity={ez(f, aT, aT + 8)}>
          <Fig x={0} y={0} s={2} lean={14} step={f / 6} c="#efe2c4" load />
        </g>
      </svg>
      <Tag a={aT + 6} t="TÚ." x={1560} y={260} size={150} color={RED} w={500} />
    </Scene>
  );
};

// 15 · EL MECAPAL: el peso cuelga de la frente; la flecha de la fuerza baja por el cuello, la etiqueta de 23 kg se balancea y el camino suma km
const MecapalVector: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aM = at(p, "mecapal", 10), aC = at(p, "cuello", aM + 40), aK = at(p, "kilos", aC + 60), aD = at(p, "km", aK + 60);
  const km = Math.round(25 * ez(f, aD, aD + 50));
  const scroll = f * 3;
  const sw = Math.sin(f / 9) * 8;
  return (
    <Scene d={d} bg={p.bg} floor="230,200,140">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${((i * 200 - scroll) % 2400 + 2400) % 2400 - 200},${880 + (i % 3) * 20} l60,-4`} stroke="#8a6a3a" strokeWidth={6} />)}
        <path d="M0,880 Q960,840 1920,880" stroke="#6a4a2a" strokeWidth={10} fill="none" />
        <g transform="translate(860,880)">
          <Fig x={0} y={-60} s={3.2} lean={18} step={f / 7} c="#1a120d" />
          <g transform="translate(-170,-420) rotate(18)"><rect x={-90} y={-130} width={180} height={260} rx={14} fill="#7a5a32" stroke="#3a2414" strokeWidth={6} /><path d="M-90,-40 L90,-40 M-90,40 L90,40" stroke="#5a3a20" strokeWidth={6} /></g>
          <path d="M-120,-560 Q-10,-650 110,-640" stroke="#c9a46a" strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(f, aM, aM + 16)} />
          <g opacity={ez(f, aC, aC + 8)}>
            <path d="M110,-640 L90,-470" stroke={RED} strokeWidth={14} strokeLinecap="round" /><path d="M70,-500 L90,-460 L115,-495" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g transform={`translate(-300,-300) rotate(${sw})`} opacity={ez(f, aK, aK + 8)}><line x1={0} y1={-80} x2={0} y2={0} stroke="#c9a46a" strokeWidth={5} /><rect x={-80} y={0} width={160} height={90} rx={12} fill={GOLD} /><text x={0} y={62} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={52} fill="#1a1410">23 kg</text></g>
        </g>
      </svg>
      <Tag a={aC} t="EL CUELLO" x={1200} y={200} size={76} color={RED} w={600} />
      <div style={{ position: "absolute", right: 120, bottom: 120, fontFamily: F, fontWeight: 900, fontSize: 96, color: INK, opacity: ez(f, aD, aD + 8), fontVariantNumeric: "tabular-nums" }}>{km} km</div>
    </Scene>
  );
};

// 16 · LA CADENA DE RELEVOS: el bulto salta de cargador en cargador, de pueblo en pueblo, hasta la ciudad del lago
const CadenaRelevos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a = at(p, "relevos", 10);
  const N = 7, prog = lin(f, a, d - 10, 0, N - 1);
  const xs = Array.from({ length: N }).map((_, i) => 200 + i * 255), ys = xs.map((x, i) => 820 - i * 50 - Math.sin(i) * 50);
  const i0 = Math.min(N - 2, Math.floor(prog)), k = prog - i0;
  const bx = xs[i0] + (xs[i0 + 1] - xs[i0]) * k, by = ys[i0] + (ys[i0 + 1] - ys[i0]) * k - Math.sin(k * Math.PI) * 160;
  return (
    <Scene d={d} bg={p.bg} floor="200,210,150">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={"M" + xs.map((x, i) => `${x},${ys[i] + 40}`).join(" L")} stroke="#8a6a3a" strokeWidth={8} fill="none" strokeDasharray="14 14" />
        {xs.map((x, i) => <g key={i} transform={`translate(${x},${ys[i]}) scale(1.5)`}>
          {i < N - 1 ? <><path d="M-60,40 L-60,0 L-30,-30 L0,0 L0,40 Z M10,40 L10,10 L40,-14 L70,10 L70,40 Z" fill="#cdb894" opacity={0.85} /><Fig x={-90} y={40} s={0.8} c="#1a120d" arm={i <= prog ? 1 : 0} /></>
            : <g><ellipse cx={20} cy={40} rx={170} ry={40} fill="#3a7aa0" /><path d="M-60,30 L-60,-40 L0,-90 L60,-40 L60,30 Z" fill="#efe6d6" /><rect x={-20} y={-150} width={40} height={60} fill="#efe6d6" /></g>}
        </g>)}
        <g transform={`translate(${bx},${by - 90}) scale(1.6)`}><rect x={-34} y={-30} width={68} height={60} rx={10} fill={GOLD} stroke="#5a3a20" strokeWidth={5} /><path d="M-34,-6 L34,-6" stroke="#5a3a20" strokeWidth={4} /></g>
      </svg>
      <Tag a={a} t="de pueblo en pueblo" x={960} y={170} size={64} color={INK} w={1100} />
    </Scene>
  );
};

// 17 · ALTÍMETRO Y AIRE: la aguja trepa a 4.000 m y el frasco de aire se va quedando sin puntitos
const Altimetro: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aM = at(p, "metros", 10), aA = at(p, "aire", aM + 60);
  const k = ez(f, aM - 10, aM + 40), thin = ez(f, aA - 10, aA + 50);
  const ang = -135 + 270 * k * 0.8;
  return (
    <Scene d={d} bg={p.bg} floor="200,220,255">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(620,560)">
          <circle r={300} fill="#1e2228" stroke="#b8a070" strokeWidth={24} />
          {Array.from({ length: 11 }).map((_, i) => { const a = (-135 + i * 27) * Math.PI / 180; return <g key={i}><line x1={Math.sin(a) * 240} y1={-Math.cos(a) * 240} x2={Math.sin(a) * 280} y2={-Math.cos(a) * 280} stroke={INK} strokeWidth={i % 2 ? 4 : 9} />{i % 2 === 0 && <text x={Math.sin(a) * 196} y={-Math.cos(a) * 196 + 12} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={32} fill={INK}>{i * 500}</text>}</g>; })}
          <line x1={0} y1={0} x2={Math.sin(ang * Math.PI / 180) * 230} y2={-Math.cos(ang * Math.PI / 180) * 230} stroke={RED} strokeWidth={12} strokeLinecap="round" />
          <circle r={22} fill={RED} />
          <text y={130} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={70} fill={INK}>{Math.round(4000 * k).toLocaleString("es")} m</text>
        </g>
        <g transform="translate(1340,280)">
          <path d="M0,0 L0,520 Q0,560 40,560 L300,560 Q340,560 340,520 L340,0" fill="rgba(200,230,255,.08)" stroke="#cfe4f2" strokeWidth={8} />
          {Array.from({ length: 70 }).map((_, i) => { const keep = rnd(i, 31) > thin * 0.82; const x = 30 + rnd(i, 32) * 280 + Math.sin(f / 20 + i) * 8, y = 30 + rnd(i, 33) * 500 + Math.cos(f / 25 + i) * 8;
            return <circle key={i} cx={x} cy={y} r={9} fill="#9fd4ff" opacity={keep ? 0.85 : 0.85 * (1 - ez(f, aA + rnd(i, 34) * 30, aA + 20 + rnd(i, 34) * 30))} />; })}
          <text x={170} y={640} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill={INK}>aire</text>
        </g>
      </svg>
    </Scene>
  );
};

// 18 · LA SEMANA ADENTRO: lunes a sábado; en cada día la ventanita del sol se apaga y la vela se gasta
const SemanaMina: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aL = at(p, "lunes", 10), aS = at(p, "sabado", aL + 40);
  const days = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const step = Math.max(6, (aS - aL) / 5);
  return (
    <Scene d={d} bg={p.bg} floor="255,180,100">
      <div style={{ position: "absolute", left: 160, top: 300, display: "flex", gap: 26 }}>
        {days.map((dd, i) => { const ai = aL + i * step, s = sp(f, ai - 6, 1, 11), dark = ez(f, ai, ai + 10), last = i === 5;
          const candle = 1 - ez(f, ai, aS + 120) * 0.85;
          return <div key={i} style={{ width: 240, height: 440, borderRadius: 20, background: last ? "linear-gradient(#f7d488,#e09a4a)" : `linear-gradient(rgb(${40 - dark * 25},${32 - dark * 20},${28 - dark * 18}),#120a06)`, border: `5px solid ${last ? GOLD : "#6a4a2a"}`, opacity: s, transform: `translateY(${(1 - s) * 60}px)`, position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontFamily: F }}>
            <div style={{ marginTop: 24, textAlign: "center", fontSize: 50, fontWeight: 900, color: last ? "#2a1a0a" : INK }}>{dd}</div>
            {!last && <div style={{ position: "absolute", left: 95, bottom: 40, width: 50, height: 200 * candle, background: "#efe2c4", borderRadius: 6 }}><div style={{ position: "absolute", left: 13, top: -46, width: 24, height: 40, borderRadius: "50% 50% 40% 40%", background: "#ffcf6a", boxShadow: "0 0 30px #ffb84a", transform: `scaleY(${1 + Math.sin(f / 3 + i) * 0.1})` }} /></div>}
            {last && <svg width={240} height={300} style={{ position: "absolute", top: 110 }}><circle cx={120} cy={140} r={60 + Math.sin(f / 8) * 4} fill="#fff4c8" />{Array.from({ length: 10 }).map((_, r) => <line key={r} x1={120 + Math.cos(r * 0.63) * 80} y1={140 + Math.sin(r * 0.63) * 80} x2={120 + Math.cos(r * 0.63) * 110} y2={140 + Math.sin(r * 0.63) * 110} stroke="#fff4c8" strokeWidth={8} strokeLinecap="round" />)}</svg>}
          </div>; })}
      </div>
      <Tag a={aS + 10} t="recién ahí ves el sol" x={1240} y={150} size={58} color={GOLD} w={900} />
    </Scene>
  );
};

// 19 · EL MERCURIO: gotitas plateadas que se buscan y se juntan en un espejo; el vapor sube y se mete donde se respira
const MercurioGotas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aM = at(p, "mercurio", 10), aV = at(p, "vapores", aM + 60);
  const merge = ez(f, aM, aM + 70), vap = ez(f, aV - 10, aV + 40);
  return (
    <Scene d={d} bg={p.bg} floor="200,210,230">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><radialGradient id="hg19" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#ffffff" /><stop offset="0.45" stopColor="#c8ccd2" /><stop offset="1" stopColor="#5a6068" /></radialGradient></defs>
        <path d="M0,760 L1920,700 L1920,1080 L0,1080 Z" fill="#4a4038" />
        {Array.from({ length: 16 }).map((_, i) => { const x0 = 300 + rnd(i, 41) * 1300, y0 = 790 + rnd(i, 42) * 180; const x = x0 + (900 - x0) * merge, y = y0 + (860 - y0) * merge, r = 14 + rnd(i, 43) * 22;
          return <g key={i}><ellipse cx={x} cy={y + r * 0.7} rx={r} ry={r * 0.25} fill="rgba(0,0,0,.4)" /><ellipse cx={x} cy={y} rx={r * (1 - merge * 0.6)} ry={r * 0.8 * (1 - merge * 0.6)} fill="url(#hg19)" /></g>; })}
        <ellipse cx={900} cy={860} rx={150 * merge} ry={56 * merge} fill="url(#hg19)" />
        {Array.from({ length: 9 }).map((_, i) => { const ph = ((f + i * 17) % 90) / 90;
          return <path key={i} d={`M${860 + i * 10},${820 - ph * 420} q${30 + Math.sin(f / 10 + i) * 20},-40 0,-80`} stroke="#d8dce4" strokeWidth={10} fill="none" strokeLinecap="round" opacity={vap * 0.5 * Math.sin(ph * Math.PI)} />; })}
        <g transform={`translate(1360,${420})`} opacity={ez(f, aV, aV + 10)}><path d="M-80,320 L-80,140 Q-80,40 0,40 Q70,40 80,110 L110,150 L80,160 L80,210 Q60,240 30,230 L30,320 Z" fill="#1a1410" /><path d="M-300,120 Q-150,40 60,150" stroke="#d8dce4" strokeWidth={6} fill="none" strokeDasharray="10 12" opacity={vap} /></g>
      </svg>
      <Tag a={aM + 4} t="MERCURIO" x={900} y={560} size={92} color={INK} w={800} />
      <Tag a={aV + 6} t="se respira" x={1360} y={280} size={56} color={RED} w={500} />
    </Scene>
  );
};

// 20 · RANKING EN RELOJES DE ARENA: cada oficio es un reloj de arena con la arena que le dura
const RelojesArena: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const J = [["EGIPTO", "2 h", 0.7], ["ROMA", "10 min", 0.12], ["CHINA", "1 h", 0.45], ["MONGOL", "4 h", 1], ["AZTECA", "3 h", 0.85], ["POTOSÍ", "15 min", 0.16]] as const;
  return (
    <Scene d={d} bg={p.bg} floor="255,190,120">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {J.map(([n, t, amt], i) => { const a = at(p, "j" + (i + 1), 10 + i * 40), s = sp(f, a - 4, 1.1, 10), x = 230 + i * 292, y = 520;
          const fl = Math.min(1, Math.max(0, (f - a) / 90)), top = amt * (1 - fl), bot = amt * fl;
          return <g key={i} transform={`translate(${x},${y + (1 - s) * 300}) scale(${Math.min(1.1, s)})`} opacity={Math.min(1, s * 1.5)}>
            <rect x={-100} y={-250} width={200} height={20} rx={6} fill="#8a6a3a" /><rect x={-100} y={230} width={200} height={20} rx={6} fill="#8a6a3a" />
            <path d="M-80,-230 Q-80,-40 0,0 Q-80,40 -80,230 L80,230 Q80,40 0,0 Q80,-40 80,-230 Z" fill="rgba(220,235,255,.12)" stroke="#d8e6f0" strokeWidth={5} />
            <path d={`M${-72 * top},${-20 - 190 * top} L${72 * top},${-20 - 190 * top} L0,-6 Z`} fill={SAND} />
            <path d={`M-74,226 Q0,${226 - 210 * bot} 74,226 Z`} fill={SAND} />
            {fl > 0 && fl < 1 && <line x1={0} y1={0} x2={0} y2={226 - 190 * bot} stroke={SAND} strokeWidth={4} />}
            <text y={310} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={INK}>{n}</text>
            <text y={-280} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={i === 5 ? RED : GOLD}>{t}</text>
          </g>; })}
      </svg>
    </Scene>
  );
};

// 21 · EL FRASCO DE LOS MILLONES: la etiqueta del frasco rueda de «miles» a «decenas de millones» y atrás se apilan cajones hasta el techo
const FrascoMillones: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aK = at(p, "miles", 10), aM = at(p, "millones", aK + 60);
  const n = Math.round(interpolate(f, [aK, aM, aM + 40], [1000, 1000000, 30000000], cl));
  const crates = Math.floor(lin(f, aK, aM + 50, 0, 18));
  return (
    <Scene d={d} bg={p.bg} floor="200,230,200">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: crates }).map((_, i) => { const c = i % 6, r = Math.floor(i / 6); const s = sp(f, aK + i * 5, 1.2, 10);
          return <g key={i} transform={`translate(${1150 + c * 120},${860 - r * 110 - (1 - s) * 300})`}><rect x={-55} y={-50} width={110} height={100} fill="#8a6a3a" stroke="#4a3018" strokeWidth={5} /><path d="M-55,-50 L55,50 M55,-50 L-55,50" stroke="#6a4a24" strokeWidth={4} /></g>; })}
        <g transform="translate(620,560)">
          <path d="M-190,-260 L190,-260 L210,-220 L210,300 Q210,330 180,330 L-180,330 Q-210,330 -210,300 L-210,-220 Z" fill="rgba(170,200,170,.22)" stroke="#d8e6d8" strokeWidth={8} />
          <rect x={-200} y={-50} width={400} height={360} fill="rgba(90,110,60,.35)" />
          {Array.from({ length: 14 }).map((_, i) => { const x = -150 + rnd(i, 51) * 300 + Math.sin(f / 15 + i) * 20, y = 0 + rnd(i, 52) * 280;
            return <path key={i} d={`M${x},${y} q20,${-10 + Math.sin(f / 6 + i) * 10} 40,0 t40,0`} stroke="#1a1410" strokeWidth={13} strokeLinecap="round" fill="none" />; })}
          <rect x={-170} y={-210} width={340} height={130} rx={10} fill="#efe6d2" stroke="#8a6a3a" strokeWidth={5} />
          <text y={-160} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={30} fill="#3a2414">SANGUIJUELAS</text>
          <text y={-108} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={n > 999999 ? RED : "#1a1410"}>{n.toLocaleString("es")}</text>
        </g>
      </svg>
      <Tag a={aM + 20} t="en un solo año" x={1450} y={170} size={60} color={GOLD} w={800} />
    </Scene>
  );
};

// 22 · LA PIERNA DE CARNADA: corte por la línea del agua; las sanguijuelas sienten el calor, nadan hacia la pierna y el frasco de la orilla suma
const PiernaCebo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aS = at(p, "siente", 10), aP = at(p, "pellizco", aS + 70), aF = at(p, "frasco", aP + 40);
  const cnt = f < aF ? 0 : 1 + Math.floor((f - aF) / 40);
  return (
    <Scene d={d} bg={p.bg} floor="160,200,180">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={W} height={430} fill="rgba(160,190,200,.12)" />
        <rect x={0} y={430} width={W} height={650} fill="rgba(70,80,50,.55)" />
        <path d={`M0,430 ${Array.from({ length: 21 }).map((_, i) => `L${i * 96},${430 + Math.sin(f / 9 + i) * 6}`).join(" ")}`} stroke="#c8d8d0" strokeWidth={4} fill="none" />
        <path d="M880,120 Q860,420 880,640 Q890,820 860,900 L1000,900 Q1010,820 1020,640 Q1040,420 1010,120 Z" fill="#d8b8a0" />
        {[0, 1, 2].map((k) => { const ph = ((f - aS + k * 20) % 60) / 60; return f > aS ? <ellipse key={k} cx={950} cy={700} rx={120 + ph * 400} ry={(120 + ph * 400) * 0.35} fill="none" stroke="#e8c070" strokeWidth={4} opacity={0.6 * (1 - ph)} /> : null; })}
        {Array.from({ length: 6 }).map((_, i) => { const side = i % 2 ? 1 : -1, sx = 950 + side * (700 + rnd(i, 61) * 200), sy = 600 + rnd(i, 62) * 250;
          const k = ez(f, aS + i * 8, aP + i * 10), x = sx + (950 + side * 60 - sx) * k, y = sy + (720 + i * 20 - sy) * k;
          return <path key={i} d={`M${x - 26 * side},${y} q${13 * side},${-10 + Math.sin(f / 3 + i) * 8} ${26 * side},0 t${26 * side},0`} stroke="#1a1410" strokeWidth={14} strokeLinecap="round" fill="none" />; })}
        {f > aP && f < aP + 16 && <circle cx={1010} cy={720} r={20 + (f - aP) * 4} fill="none" stroke={RED} strokeWidth={6} opacity={1 - (f - aP) / 16} />}
        <g transform="translate(1560,330)"><path d="M-80,-120 L80,-120 L90,100 Q90,120 70,120 L-70,120 Q-90,120 -90,100 Z" fill="rgba(200,220,200,.25)" stroke="#d8e6d8" strokeWidth={6} /><text y={30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={80} fill={INK}>{cnt}</text></g>
      </svg>
      <Tag a={aP} t="¡pellizco!" x={1260} y={560} size={66} color={RED} w={500} rot={-6} />
      <Tag a={aS} t="la carnada eres tú" x={700} y={150} size={60} color={INK} w={900} />
    </Scene>
  );
};

// 23 · CONTRA LA CORRIENTE: vista desde arriba; la corriente baja, el barco sube tirado por once figuras en la orilla
const ContraCorriente: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aC = at(p, "corriente", 10), aG = at(p, "gente", aC + 60);
  const men = ez(f, aG, aG + 20), bx = 1300 + f * 0.25;
  return (
    <Scene d={d} bg={p.bg} floor="230,210,150">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={W} height={330} fill="#d8bf8a" />
        <rect x={0} y={330} width={W} height={750} fill="#3a6a7a" />
        {Array.from({ length: 22 }).map((_, i) => { const x = ((i * 190 - f * 4 * ez(f, aC - 10, aC + 10) - f * 1.2) % 2200 + 2200) % 2200 - 140, y = 420 + (i % 5) * 120;
          return <path key={i} d={`M${x + 80},${y} L${x},${y} M${x},${y} l20,-12 M${x},${y} l20,12`} stroke="#9fd0dc" strokeWidth={6} strokeLinecap="round" opacity={0.8} />; })}
        <g transform={`translate(${bx - 1100},560)`}><path d="M-260,-70 L200,-70 Q300,0 200,70 L-260,70 Z" fill="#6a4628" stroke="#3a2414" strokeWidth={6} /><rect x={-40} y={-260} width={14} height={200} fill="#3a2414" /></g>
        <path d={`M${bx - 860},560 L${bx - 560},300`} stroke="#c9a46a" strokeWidth={6} />
        {Array.from({ length: 11 }).map((_, i) => { const s = sp(f, aG + i * 3, 1, 12);
          return <g key={i} opacity={men * s}><Fig x={bx - 560 + i * 56} y={300} s={0.9} lean={42} step={f / 9 + i * 0.6} c="#1a120d" /></g>; })}
      </svg>
      <Tag a={aC} t="contra la corriente" x={960} y={900} size={62} color={INK} w={1000} />
      <Tag a={aG + 10} t="11 hombres" x={900} y={70} size={66} color={GOLD} w={600} />
    </Scene>
  );
};

// 24 · EL CUADRO REVELADO: la tela del #8 cae y aparece el cuadro de Repin; una luz recorre la fila y se queda en el muchacho del medio
const RepinRevelado: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aC = at(p, "cuadro", 10), aO = at(p, "once", aC + 60), aM = at(p, "medio", aO + 60);
  const fall = ez(f, aC, aC + 30), sweep = ez(f, aO, aM), spot = ez(f, aM, aM + 12);
  const lx = 520 + sweep * 880 * (1 - spot) + spot * (0.52 * 1000 + 460 - 520 * 0);
  return (
    <Scene d={d} bg={p.bg} floor="233,199,98" push={0.07}>
      <div style={{ position: "absolute", left: 460, top: 190, width: 1000, height: 560, border: "26px solid #b88a3e", boxShadow: "0 40px 90px rgba(0,0,0,.75)", overflow: "hidden", background: "#2a2018" }}>
        <Img src={sf(p.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.55 + 0.45 * fall})` }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle ${240 - spot * 60}px at ${lx - 460}px 50%, rgba(255,240,200,0) 0%, rgba(0,0,0,${0.55 * Math.max(sweep > 0 ? 1 : 0, spot)}) 100%)` }} />
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={`M430,${170 + fall * 760} L1490,${170 + fall * 760} L1500,${860 + fall * 400} L420,${860 + fall * 400} Z`} fill="#3b0f12" opacity={1 - fall * 0.2} />
      </svg>
      <Tag a={aC + 20} t="Iliá Repin · 1870-1873" x={960} y={830} size={46} color={INK} w={1100} />
      <Tag a={aM + 10} t="el único que levanta la cabeza" x={960} y={100} size={56} color={GOLD} w={1300} />
    </Scene>
  );
};

// 25 · EL RELOJ DE DOCE HORAS: los turnos de los 8 oficios se suman como gajos de colores y no llegan a cerrar la esfera
const RelojDoce: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const a = at(p, "total", 10);
  const hrs = [2, 10 / 60, 1, 4, 3, 0.25, 40 / 3600, 0.5];
  const cols = ["#d9b27c", "#b0532e", "#c8a46c", "#8a5a32", "#7a8a3a", "#c0c4ca", "#5a7a5a", "#6a4628"];
  let acc = 0;
  return (
    <Scene d={d} bg={p.bg} floor="255,190,120">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(960,560)">
          <circle r={380} fill="#efe6d2" stroke="#8a6a3a" strokeWidth={20} />
          {hrs.map((h, i) => { const k = ez(f, a - 40 + i * 9, a - 28 + i * 9); const s0 = acc / 12 * Math.PI * 2; acc += h; const s1 = s0 + (h / 12) * Math.PI * 2 * k; const big = s1 - s0 > Math.PI ? 1 : 0;
            return <path key={i} d={`M0,0 L${Math.sin(s0) * 340},${-Math.cos(s0) * 340} A340,340 0 ${big},1 ${Math.sin(s1) * 340},${-Math.cos(s1) * 340} Z`} fill={cols[i]} stroke="#efe6d2" strokeWidth={3} />; })}
          {Array.from({ length: 12 }).map((_, i) => { const an = i / 12 * Math.PI * 2; return <text key={i} x={Math.sin(an) * 310} y={-Math.cos(an) * 310 + 16} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#2a2018">{i || 12}</text>; })}
          <circle r={22} fill="#2a2018" />
        </g>
      </svg>
      <Tag a={a + 30} t="ni 12 horas." x={1600} y={480} size={80} color={RED} w={520} />
    </Scene>
  );
};

// 26 · LA PIRÁMIDE DE LOS DE ABAJO: se apilan las glorias de cada imperio; al final se ve quién sostiene la base
const PiramideOficios: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const L = ["BARCOS", "MEDICINA", "PLATA", "CIUDAD", "IMPERIO", "MURALLA", "ORO", "PIRÁMIDES"];
  const aD = at(p, "debajo", 200), aA = at(p, "amigos", aD + 120);
  const reveal = ez(f, aD, aD + 30);
  return (
    <Scene d={d} bg={p.bg} floor="255,190,110">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {L.map((w, i) => { const wdt = 260 + i * 150, y = 130 + i * 86; const s = sp(f, 6 + i * 10, 1.2, 11);
          return <g key={i} transform={`translate(960,${y + (1 - s) * -500})`} opacity={Math.min(1, s * 1.4)}><rect x={-wdt / 2} y={0} width={wdt} height={80} fill={i === L.length - 1 ? "#d9cdb4" : "#c8b28a"} stroke="#8a6a3a" strokeWidth={4} /><text y={54} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill="#2a1a0a">{w}</text></g>; })}
        <g transform={`translate(0,${-reveal * 80})`}>
          {Array.from({ length: 16 }).map((_, i) => <Fig key={i} x={420 + i * 72} y={1000 + 140 * (1 - reveal)} s={0.95} arm={1} c="#efe2c4" />)}
        </g>
      </svg>
      <Tag a={aA} t="«Los Amigos del Rey Keops»" x={960} y={60} size={64} color={GOLD} w={1400} />
    </Scene>
  );
};


// 27 · TIRÓN O UÑA: la misma sanguijuela en la pierna, dos maneras. De un tirón: se corta y la boca queda adentro (roja). Con la uña: se despega entera y cae al frasco
const TironUna: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aT = at(p, "tiron", 30), aU = at(p, "una", aT + 100);
  const yank = ez(f, aT, aT + 8), bad = ez(f, aT + 8, aT + 30);
  const nail = ez(f, aU, aU + 40), drop = ez(f, aU + 40, aU + 70);
  const leg = (x: number) => <path d={`M${x - 150},120 Q${x - 170},520 ${x - 120},980 L${x + 120},980 Q${x + 160},520 ${x + 150},120 Z`} fill="#d8b8a0" />;
  const leech = (x: number, y: number, r: number, k = 1.7) => <path d={`M${x - 70 * k},${y} q${35 * k},${-26 + Math.sin(f / 5) * 6} ${70 * k},0 t${70 * k},0`} stroke="#1a1410" strokeWidth={30 * k} strokeLinecap="round" fill="none" transform={`rotate(${r},${x},${y})`} />;
  return (
    <Scene d={d} bg={p.bg} floor="200,190,170">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <line x1={960} y1={90} x2={960} y2={1000} stroke="rgba(240,235,229,.25)" strokeWidth={4} strokeDasharray="14 14" />
        {leg(520)}{leg(1400)}
        {/* izquierda: de un tirón */}
        <g opacity={1 - ez(f, aU - 10, aU)}>
          {f < aT + 4 ? leech(560, 560, -20) : leech(560 + yank * 260, 560 - yank * 300, -60 + yank * 80, 1)}
          {f >= aT + 4 && <><circle cx={600} cy={560} r={10 + bad * 26} fill="#9a1a12" opacity={0.85} /><circle cx={600} cy={560} r={8} fill="#1a1410" /></>}
          <path d="M380,250 L660,520 M660,250 L380,520" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bad} transform="translate(0,420)" opacity={0.9} />
        </g>
        {/* derecha: con la uña */}
        <g>
          {leech(1440 + drop * 160, 560 + drop * 380, -20 + nail * 40 + drop * 60)}
          <g transform={`translate(${1290 + nail * 120},${600 - nail * 30})`} opacity={ez(f, aU - 6, aU + 4) * (1 - drop)}><path d="M0,0 q30,-30 70,-10 l10,30 q-40,10 -80,0 Z" fill="#e8c8b0" stroke="#a88068" strokeWidth={4} /><path d="M58,-12 q16,4 20,22" stroke="#f6eee6" strokeWidth={6} fill="none" /></g>
          <g transform="translate(1700,860) scale(1.5)"><path d="M-80,-90 L80,-90 L86,90 L-86,90 Z" fill="rgba(200,220,200,.25)" stroke="#d8e6d8" strokeWidth={5} /></g>
          <path d="M1530,840 l40,40 l80,-90" stroke={GOLD} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(f, aU + 60, aU + 72)} />
        </g>
      </svg>
      <Tag a={aT} t="de un tirón" x={520} y={140} size={64} color={RED} w={700} />
      <Tag a={aU} t="con la uña" x={1400} y={140} size={64} color={GOLD} w={700} />
    </Scene>
  );
};

// 28 · ¿CUÁL ELEGIRÍAS?: los ocho oficios como herramientas en la mesa; una luz las recorre, duda entre dos y se queda quieta esperando tu respuesta
const EligeOficio: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const aE = at(p, "elegir", 90);
  const xs = Array.from({ length: 8 }).map((_, i) => 260 + i * 200);
  const scan = lin(f, 10, aE, 0, 7);
  const hes = f > aE ? 3.5 + Math.sin((f - aE) / 14) * 1.6 * (1 - ez(f, aE + 60, aE + 120)) : scan;
  const lx = 260 + hes * 200;
  return (
    <Scene d={d} bg={p.bg} floor="255,200,130">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d="M120,720 L1800,720 L1900,900 L20,900 Z" fill="#3a2414" /><path d="M120,720 L1800,720" stroke="#6a4a2a" strokeWidth={6} />
        <defs><radialGradient id="sp28" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="rgba(255,220,150,.55)" /><stop offset="1" stopColor="rgba(255,220,150,0)" /></radialGradient></defs>
        <ellipse cx={lx} cy={700} rx={170} ry={260} fill="url(#sp28)" />
        {xs.map((x, i) => { const s = sp(f, 4 + i * 4, 1.1, 10), lit = Math.max(0, 1 - Math.abs(hes - i) * 1.3);
          return <g key={i} transform={`translate(${x - 85},${470 + (1 - s) * -300 - lit * 26}) scale(1.7)`} opacity={Math.min(1, s * 1.3)}>
            <g opacity={0.45 + lit * 0.55}><K.Icon i={i} c={lit > 0.5 ? ORA : "#cdb894"} /></g>
            <text x={50} y={140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={17} fill={INK} opacity={0.5 + lit * 0.5}>{K.JOBS[i].y.toUpperCase()}</text>
          </g>; })}
      </svg>
      <Tag a={aE} t="¿cuál elegirías?" x={960} y={170} size={96} color={GOLD} w={1300} />
      <Motes />
    </Scene>
  );
};

const MAP: Record<string, React.FC<UP>> = { PozoCorte, CuadroVelado, RacionPan, TrineoFriccion, MarcaCuadrilla, MontanaQueso, HiloTierra, MuroCapas, RitmoPisones, RutaPostas, Odometro400, Fajado, CincoSacos, SinRueda, MecapalVector, CadenaRelevos, Altimetro, SemanaMina, MercurioGotas, RelojesArena, FrascoMillones, PiernaCebo, ContraCorriente, RepinRevelado, RelojDoce, PiramideOficios, TironUna, EligeOficio };
const MAP3: Record<string, React.FC<UP>> = { ArcillaEscucha: VA.ArcillaEscucha3D, OchoCascos: VA.OchoCascos3D, AsientoApodo: VA.AsientoApodo3D, PesoHoplita: VA.PesoHoplita3D, FalangeEscudos: VA.FalangeEscudos3D, Othismos: VA.Othismos3D, CascoVision: VA.CascoVision3D, ConElSobreEl: VA.ConElSobreEl3D, TensionArco: VA.TensionArco3D, HuesosAsimetricos: VA.HuesosAsimetricos3D, CercaEstacas: VA.CercaEstacas3D, AsedioCorte: VB.AsedioCorte3D, TamborArvejas: VB.TamborArvejas3D, CuerdaTirones: VB.CuerdaTirones3D, ColumnaRusia: VB.ColumnaRusia3D, TamborOrdenes: VB.TamborOrdenes3D, NoTeSientes: VB.NoTeSientes3D, TopCinco: VB.TopCinco3D, PasilloInfinito: VB.PasilloInfinito3D, CloacaLimpia: VB.CloacaLimpia3D, CuerdasTiempo: VB.CuerdasTiempo3D, BalaPlomo: VC.BalaPlomo3D, MitoVuelta: VC.MitoVuelta3D, ManosGermenes: VC.ManosGermenes3D, TorretaCola: VC.TorretaCola3D, TrajeCalefaccion: VC.TrajeCalefaccion3D, ParacaidasPuerta: VC.ParacaidasPuerta3D, ClayKicker: VC.ClayKicker3D, Messines19: VC.Messines193D, TiraTiempo: VC.TiraTiempo3D, OchoPuertas: VC.OchoPuertas3D, TodoLoDemas: VD.TodoLoDemas3D, LagunaPaz: VD.LagunaPaz3D, ...VE.OVR, ...VF.OVR, ...VG.OVR, ...VH.OVR, ...VI.OVR };
export const Uniq: React.FC<{ n: string; d: number; p: any; o?: any }> = ({ n, d, p }) => {
  const C = MAP3[n] ?? MAP[n];
  if (!C) return <AbsoluteFill style={{ background: "#300" }} />;
  return <C d={d} p={p} />;
};
