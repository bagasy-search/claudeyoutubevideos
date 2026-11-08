// dur5na — componentes únicos 1-10 (gancho, trapero, niño del lodo, recolector de pure, curtidor). Cada uno = «tú» haciendo el oficio.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, sf, at } from "./ukit";
import { SV, Tu, Shovel, Barrow, Bucket, Lantern, Basket, Sting, Meter } from "./pkit";

type UP = { d: number; p: any };
const tt = (f: number) => f / 30;

// 1 · LA ISLA BLANCA: una montaña de guano de 30 m en el mar, tú al pie con pala y carretilla, la cuota de 4 toneladas que casi no se mueve
export const IslaGuano: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const up = ez(f, 0, 40), hm = Math.round(30 * ez(f, at(p, "metros", 70) - 20, at(p, "metros", 70) + 10));
  const dig = Math.sin(f / 6), q = 0.02 + 0.06 * lin(f, 0, d);
  const sunx = 260 + f * 0.6;
  return (
    <Scene d={d} bg={p.bg} floor="255,220,170" tint="#2b1d14">
      <AbsoluteFill style={{ background: "linear-gradient(#f3c48a 0%, #e79a5c 38%, #6e88a0 62%, #20384f 100%)", opacity: 0.92 }} />
      <SV>
        <circle cx={sunx} cy={200} r={70} fill="#fff4d6" opacity={0.9} /><circle cx={sunx} cy={200} r={140} fill="#fff4d6" opacity={0.15} />
        {Array.from({ length: 9 }).map((_, i) => { const a = f / 40 + i * 0.7; return <path key={i} d={`M${1100 + Math.cos(a) * (240 + i * 20)},${260 + Math.sin(a) * 60 - i * 8} l14,-8 l14,8`} fill="none" stroke="#2b2b2b" strokeWidth={3} />; })}
        <rect x={0} y={760} width={1920} height={320} fill="#1d3a55" />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M0,${790 + i * 40} Q480,${780 + i * 40 + Math.sin(f / 18 + i) * 10} 960,${790 + i * 40} T1920,${790 + i * 40}`} stroke="rgba(255,255,255,.12)" strokeWidth={3} fill="none" />)}
        <g transform={`translate(0,${(1 - up) * 300})`}>
          <path d="M380,790 L700,420 L900,300 L1100,330 L1320,470 L1560,790 Z" fill="#efe6cf" />
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${430 + i * 16},${760 - i * 34} Q960,${740 - i * 36 + Math.sin(i) * 10} ${1500 - i * 18},${760 - i * 32}`} stroke="#d4c6a3" strokeWidth={3} fill="none" opacity={0.8} />)}
          <path d="M300,800 L1640,800 L1600,760 L340,760 Z" fill="#a3916b" />
          <line x1={1640} y1={300} x2={1640} y2={790} stroke={INK} strokeWidth={4} /><line x1={1620} y1={300} x2={1660} y2={300} stroke={INK} strokeWidth={4} />
          <Barrow x={860} y={772} s={1.1} load={0.6} />
          <Shovel x={700} y={700} rot={-20 + dig * 14} />
        </g>
      </SV>
      <Tu x={660} y={772 + (1 - up) * 300} s={0.95} rot={8 + dig * 5} />
      <div style={{ position: "absolute", left: 1670, top: 500, fontFamily: F, fontWeight: 900, fontSize: 74, color: INK, opacity: ez(f, at(p, "metros", 70) - 20, at(p, "metros", 70)), textShadow: "0 4px 18px rgba(0,0,0,.6)" }}>{hm} m</div>
      <Meter x={90} y={70} w={520} h={22} k={q} col={RED} label="CUOTA ANTES DEL ATARDECER" val={`${(q * 4).toFixed(2).replace(".", ",")} / 4 t`} size={58} />
      <Tag a={at(p, "isla", 30)} t="ISLAS CHINCHA · PERÚ · 1855" x={960} y={930} size={46} />
    </Scene>
  );
};

// 2 · AMONÍACO: de cerca, el polvo sube de la pila, te arden los ojos, toses; el capataz mira desde la cresta
export const Amoniaco: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const cough = Math.max(0, Math.sin(f / 5)) * ez(f, at(p, "toses", 120) - 6, at(p, "toses", 120)) * 6;
  const eyes = ez(f, at(p, "ojos", 90) - 8, at(p, "ojos", 90) + 4), cap = ez(f, at(p, "capataz", 160) - 10, at(p, "capataz", 160) + 6);
  return (
    <Scene d={d} bg={p.bg} floor="230,240,170" tint="#1f1a10">
      <SV>
        <path d="M0,840 Q500,700 980,780 T1920,720 L1920,1080 L0,1080 Z" fill="#e8dcc0" />
        <path d="M1240,500 L1500,330 L1920,420 L1920,760 L1240,760 Z" fill="#d9cba5" opacity={0.9} />
        {Array.from({ length: 34 }).map((_, i) => { const ph = ((f / (90 + rnd(i, 2) * 80)) + rnd(i, 3)) % 1; const x = 300 + rnd(i, 4) * 900 + Math.sin(f / 20 + i) * 40; const y = 860 - ph * 760;
          return <circle key={i} cx={x} cy={y} r={26 + ph * 70} fill="rgba(214,226,150,.16)" opacity={Math.sin(ph * Math.PI)} />; })}
        {[0, 1, 2, 3].map((i) => { const ph = ((f / 120) + i * 0.25) % 1; const x = 520 + i * 160, y = 760 - ph * 520;
          return <g key={i} transform={`translate(${x},${y})`} opacity={Math.sin(ph * Math.PI) * ez(f, 20, 40)}><circle r={20} fill="#9fc26a" /><circle cx={-26} cy={18} r={11} fill="#e8f0d8" /><circle cx={26} cy={18} r={11} fill="#e8f0d8" /><circle cx={0} cy={-28} r={11} fill="#e8f0d8" /></g>; })}
        <Sting x={835} y={438} k={eyes * (0.6 + 0.4 * Math.sin(f / 3))} c="#ffe066" r={60} />
      </SV>
      <Tu x={840} y={900} s={2.3} rot={12 + cough} />
      <Tu x={1560} y={360} s={0.9} arms="spear" dark op={cap} />
      <Tag a={at(p, "amoniaco", 40)} t="NH₃ · AMONÍACO" x={480} y={160} size={64} color="#cfe68a" />
      <Tag a={at(p, "capataz", 160)} t="el capataz" x={1560} y={140} size={40} />
      <Motes c="235,240,190" up />
    </Scene>
  );
};

// 3 · LA ESCALERA DEL RANKING: diez escalones que bajan a lo oscuro; tú bajas; el último está tapado y brilla en rojo
export const TorreRanking: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const walk = lin(f, 20, d - 10);
  const step = (i: number) => [220 + i * 150, 250 + i * 70] as const;
  const pos = Math.min(9, walk * 9.4), i0 = Math.floor(pos), fr = pos - i0;
  const [ax, ay] = step(i0), [bx, by] = step(Math.min(9, i0 + 1));
  const px = ax + (bx - ax) * fr + 70, py = ay + (by - ay) * Math.min(1, fr * 2.2);
  const veil = ez(f, at(p, "ultimo", d * 0.6) - 6, at(p, "ultimo", d * 0.6) + 8);
  return (
    <Scene d={d} bg={p.bg} floor="241,69,54" tint="#0d0807" push={0.03}>
      {Array.from({ length: 10 }).map((_, i) => { const [x, y] = step(i); const t = sp(f, 4 + i * 3, 0.8, 13); const last = i === 9;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + (1 - t) * 60, width: 150, height: 1080 - y, opacity: t, background: last ? "linear-gradient(#3b0f12,#140606)" : `linear-gradient(hsl(28,${40 - i * 2}%,${30 - i * 2}%), #120a06)`, borderTop: `4px solid ${last ? RED : "rgba(237,178,105,.7)"}`, boxShadow: last ? `0 0 ${40 + 30 * veil}px ${RED}` : "none" }}>
            <div style={{ fontFamily: F, fontWeight: 900, fontSize: 54, color: last ? RED : INK, textAlign: "center", marginTop: 14 }}>{last ? (veil > 0.5 ? "?" : "1") : 10 - i}</div>
          </div>
        ); })}
      <Tu x={px} y={py} s={0.75} walk />
      <Tag a={at(p, "menos", 30)} t="DEL MENOS MALO AL PEOR" x={760} y={110} size={70} color={ORA} />
      <Tag a={at(p, "ultimo", d * 0.6)} t="el que nadie aguantaba" x={1600} y={820} size={44} color={RED} w={560} />
    </Scene>
  );
};

// 4 · EL CANASTO DEL TRAPERO: de noche, farol y gancho; de la basura salen volando las cosas que se venden a su canasto con su destino
const ITEMS = [["TRAPOS", "→ papel", "#cfc3a8"], ["HUESOS", "→ botones y pegamento", "#efe8d6"], ["VIDRIO", "roto", "#8fd0c4"], ["COLILLAS", "de cigarro", "#c9a27a"], ["PELO", "de peluquería", "#6a4a32"]] as const;
export const CanastoTrapero: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const keys = ["trapos", "huesos", "vidrios", "colillas", "pelo"].map((k, i) => at(p, k, 40 + i * 40));
  const hookA = -30 + Math.sin(f / 7) * 18;
  return (
    <Scene d={d} bg={p.bg} floor="255,190,90" tint="#070b14">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 60% at 30% 40%, rgba(255,200,120,.18), transparent 70%), linear-gradient(#0a1424, #04060b)" }} />
      <SV>
        <rect x={0} y={840} width={1920} height={240} fill="#1b1f27" />
        {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={(i % 10) * 200 + (Math.floor(i / 10) % 2) * 100} cy={880 + Math.floor(i / 10) * 60} rx={90} ry={22} fill="none" stroke="#2c323d" strokeWidth={3} />)}
        <path d="M640,850 Q700,700 820,720 Q900,640 980,730 Q1060,700 1100,850 Z" fill="#3a3328" />
        {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={680 + rnd(i, 1) * 380} y={740 + rnd(i, 2) * 90} width={20 + rnd(i, 3) * 30} height={8 + rnd(i, 4) * 14} fill={["#5a5040", "#6d6250", "#463e33"][i % 3]} transform={`rotate(${rnd(i, 5) * 90} ${700 + rnd(i, 1) * 380} ${760 + rnd(i, 2) * 90})`} />)}
        <Lantern x={420} y={600} s={1.2} />
        <line x1={560} y1={560} x2={560 + Math.cos(hookA * Math.PI / 180) * 300} y2={560 - Math.sin(hookA * Math.PI / 180) * 300} stroke="#7a5532" strokeWidth={9} strokeLinecap="round" />
        <Basket x={455} y={600} s={1.15} />
        {ITEMS.map((it, i) => { const k = ez(f, keys[i], keys[i] + 14); const x0 = 860, y0 = 760, x1 = 455, y1 = 520;
          const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 220;
          return k > 0 && k < 1 ? <circle key={i} cx={x} cy={y} r={18} fill={it[2]} stroke="#000" strokeWidth={2} /> : null; })}
      </SV>
      <Tu x={520} y={850} s={1.4} rot={14} arms="spear" />
      {ITEMS.map((it, i) => { const a = keys[i] + 12, o = ez(f, a, a + 8);
        return <div key={i} style={{ position: "absolute", left: 1240, top: 170 + i * 128, opacity: o, transform: `translateX(${(1 - o) * 60}px)`, display: "flex", alignItems: "center", gap: 22, fontFamily: F }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: it[2], border: "3px solid #000" }} />
          <div><div style={{ fontSize: 52, fontWeight: 900, color: INK, lineHeight: 1 }}>{it[0]}</div><div style={{ fontSize: 30, fontWeight: 700, color: ORA }}>{it[1]}</div></div></div>; })}
      <Tag a={6} t="PARÍS · MEDIANOCHE" x={430} y={110} size={48} />
    </Scene>
  );
};

// 5 · LA TAPA DE POUBELLE: el montón libre en la vereda, cae el bote con tapa, tu gancho rebota contra el metal
export const PoubelleTapa: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const A = at(p, "botes", 40), drop = sp(f, A, 1.2, 9), lid = sp(f, A + 14, 0.7, 7);
  const poke = f > A + 22 ? Math.max(0, Math.sin((f - A - 22) / 4)) : 0;
  const shake = f > A + 14 && f < A + 24 ? Math.sin(f * 3) * 6 : 0;
  return (
    <Scene d={d} bg={p.bg} floor="190,200,230" tint="#090c12">
      <SV>
        <rect x={0} y={850} width={1920} height={230} fill="#22262e" />
        <path d={`M860,850 Q900,${760 + 400 * drop} 1000,${770 + 300 * drop} Q1080,${780 + 260 * drop} 1140,850 Z`} fill="#3a3328" opacity={1 - drop} />
        <g transform={`translate(${1000 + shake},${-500 + 1350 * drop})`}>
          <path d="M-130,-330 L130,-330 L110,0 L-110,0 Z" fill="#8b949c" stroke="#4d5359" strokeWidth={6} />
          {[-80, -40, 0, 40, 80].map((x) => <line key={x} x1={x} y1={-310} x2={x * 0.85} y2={-20} stroke="#6c747b" strokeWidth={5} />)}
          <g transform={`translate(0,${-330 - (1 - lid) * 260}) rotate(${(1 - lid) * -30})`}><rect x={-145} y={-26} width={290} height={30} rx={10} fill="#9aa3aa" stroke="#4d5359" strokeWidth={5} /><rect x={-30} y={-48} width={60} height={24} rx={8} fill="#6c747b" /></g>
        </g>
        <line x1={600} y1={660} x2={790 + poke * 60} y2={560 - poke * 20} stroke="#7a5532" strokeWidth={9} strokeLinecap="round" />
        <Sting x={860} y={530} k={poke > 0.85 ? 1 : 0} c="#e8eef5" r={40} />
      </SV>
      <Tu x={560} y={860} s={1.35} rot={10} arms="spear" />
      <div style={{ position: "absolute", left: 1250, top: 230, fontFamily: F, fontWeight: 900, fontSize: 150, color: RED, opacity: ez(f, A + 16, A + 24), transform: `rotate(-6deg) scale(${1.3 - 0.3 * ez(f, A + 16, A + 24)})`, border: `8px solid ${RED}`, padding: "0 30px", borderRadius: 14, lineHeight: 1.1 }}>1883</div>
      <Tag a={A + 26} t="«POUBELLE»" x={1450} y={470} size={80} color={INK} w={700} />
      <Tag a={A + 34} t="= bote de basura, en francés" x={1450} y={570} size={36} color={ORA} w={700} />
    </Scene>
  );
};

// 6 · LA MAREA DEL TÁMESIS: corte de la orilla; el agua baja y deja al descubierto lo que se vende; tú, descalzo, llenas la cubeta
const LOOT = [["CARBÓN", "#1b1b1b", 520], ["CLAVOS", "#6e6e6e", 760], ["SOGA", "#a88a5a", 1010], ["COBRE", "#c56b33", 1260]] as const;
export const MareaTamesis: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const tide = ez(f, 10, 80), wl = 420 + tide * 320;
  const walkK = lin(f, 60, d - 20), px = 380 + walkK * 1000;
  const got = LOOT.filter((l) => px > l[2] + 20).length;
  return (
    <Scene d={d} bg={p.bg} floor="150,170,190" tint="#0d1216">
      <SV>
        <path d="M0,560 Q600,620 1920,700 L1920,1080 L0,1080 Z" fill="#2b2620" />
        <path d="M0,600 Q600,660 1920,740 L1920,1080 L0,1080 Z" fill="#1e1a15" />
        {/* fondo: puente de piedra y barcazas sobre el río, para que la orilla no quede vacía */}
        <path d="M0,330 L1920,330 L1920,360 L0,360 Z" fill="#3a3a38" opacity={0.85} />
        {[160, 560, 960, 1360, 1760].map((x) => <path key={x} d={`M${x - 150},360 Q${x},250 ${x + 150},360 Z`} fill="#0d1216" opacity={0.7} />)}
        {[[300, 470], [1180, 500]].map(([x, y], i) => <g key={i} transform={`translate(${x + Math.sin(f / 40 + i) * 6},${y})`}><path d="M-120,0 L120,0 L95,34 L-95,34 Z" fill="#2d2219" /><line x1={-10} y1={0} x2={-10} y2={-120} stroke="#2d2219" strokeWidth={6} /><path d="M-6,-116 L70,-30 L-6,-30 Z" fill="#6b5a40" opacity={0.8} /></g>)}
        {Array.from({ length: 26 }).map((_, i) => { const x = 60 + rnd(i, 4) * 1800, y = 650 + (x / 1920) * 80 + rnd(i, 5) * 120; return <ellipse key={i} cx={x} cy={y} rx={10 + rnd(i, 6) * 18} ry={5 + rnd(i, 7) * 7} fill={["#4a4036", "#5e5448", "#3a322a"][i % 3]} />; })}
        {LOOT.map((l, i) => { const vis = px < l[2] + 20; const y = 640 + (l[2] / 1920) * 80;
          return vis ? <g key={i} opacity={ez(f, 30 + i * 8, 46 + i * 8)}><circle cx={l[2]} cy={y} r={46} fill="rgba(255,220,140,.12)" /><circle cx={l[2]} cy={y} r={30} fill={l[1]} stroke="#f0ebe5" strokeWidth={3} /><text x={l[2]} y={y + 84} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={INK} style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 6 }}>{l[0]}</text></g> : null; })}
        <rect x={0} y={0} width={1920} height={wl} fill="#405566" opacity={0.75} />
        <path d={`M0,${wl} Q480,${wl - 12 + Math.sin(f / 10) * 8} 960,${wl} T1920,${wl}`} stroke="#b9cbd6" strokeWidth={5} fill="none" />
        <rect x={1640} y={300} width={180} height={500} fill="#5c5a55" /><path d="M1640,300 L1640,800 M1660,360 L1820,360 M1660,460 L1820,460 M1660,560 L1820,560 M1660,660 L1820,660" stroke="#3e3c39" strokeWidth={6} />
        <Bucket x={px + 70} y={640 + (px / 1920) * 80 - 90} s={1.6} fill={got / 4} col="#3b2f22" />
      </SV>
      <Tu x={px} y={680 + (px / 1920) * 80} s={1.25} walk={walkK > 0 && walkK < 1} rot={6} />
      <Meter x={90} y={60} w={420} h={18} k={got / 4} col={ORA} label="LO QUE JUNTASTE" val={`${got * 2} peniques`} size={54} />
      <Tag a={at(p, "marea", 20)} t="MAREA BAJA" x={960} y={200} size={60} color="#d6e4ec" />
      <Tag a={at(p, "anos", 8)} t="9 AÑOS · DESCALZO" x={1300} y={110} size={44} color={ORA} />
    </Scene>
  );
};

// 7 · NUNCA DONDE BRILLA: el barro en perspectiva; tanteas con el palo, cruz roja en lo que brilla, tilde en lo opaco; la marea entra callada
export const LodoBrilla: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const spots = [[420, 520, 1], [700, 640, 0], [980, 520, 1], [1180, 700, 0], [1420, 560, 0], [1600, 700, 1]] as const;
  const walk = lin(f, 30, d - 30), px = 300 + walk * 1300;
  const tideIn = ez(f, at(p, "marea", d * 0.7) - 10, d);
  return (
    <Scene d={d} bg={p.bg} floor="160,170,180" tint="#0b0d0f">
      <AbsoluteFill style={{ perspective: 1200 }}>
        <div style={{ position: "absolute", left: -200, top: 380, width: 2320, height: 900, transform: "rotateX(58deg)", transformOrigin: "50% 0%", background: "radial-gradient(ellipse at 50% 40%, #4a4036, #231d18)", overflow: "hidden" }}>
          <svg width={2320} height={900}>
            {Array.from({ length: 70 }).map((_, i) => <path key={i} d={`M${rnd(i, 1) * 2320},${rnd(i, 2) * 900} l${30 + rnd(i, 3) * 90},${-20 + rnd(i, 4) * 40} l${20 + rnd(i, 5) * 40},${30}`} stroke="#1a1512" strokeWidth={3} fill="none" />)}
            {spots.map(([x, y, wet], i) => wet ? <ellipse key={i} cx={x + 200} cy={(y - 380) * 1.6} rx={150} ry={90} fill="url(#shine)" opacity={0.75 + 0.25 * Math.sin(f / 9 + i)} /> : null)}
            <defs><radialGradient id="shine"><stop offset="0%" stopColor="#d9e4ea" /><stop offset="60%" stopColor="#7c8a93" /><stop offset="100%" stopColor="#3e3a35" stopOpacity={0} /></radialGradient></defs>
            <rect x={0} y={0} width={2320} height={120 + tideIn * 260} fill="#3d5262" opacity={0.85} />
          </svg>
        </div>
      </AbsoluteFill>
      <SV>
        {spots.map(([x, y, wet], i) => { const o = ez(f, 30 + i * 22, 40 + i * 22);
          return <g key={i} opacity={o} transform={`translate(${x},${y})`}>{wet ? <path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke={RED} strokeWidth={12} strokeLinecap="round" /> : <path d="M-30,0 L-8,24 L32,-26" stroke="#7ee07a" strokeWidth={12} strokeLinecap="round" fill="none" />}</g>; })}
        {Array.from({ length: 8 }).map((_, i) => { const x = 300 + i * 170; return x < px ? <ellipse key={i} cx={x} cy={760 - (i % 2) * 30} rx={16} ry={8} fill="#15110e" /> : null; })}
        <line x1={px + 40} y1={640} x2={px + 140} y2={780 + Math.sin(f / 5) * 10} stroke="#7a5532" strokeWidth={8} strokeLinecap="round" />
      </SV>
      <Tu x={px} y={780} s={0.8} walk={walk > 0 && walk < 1} rot={-4} />
      <Tag a={at(p, "brillaba", 20)} t="NUNCA DONDE BRILLA" x={960} y={110} size={78} color={INK} />
      <Tag a={at(p, "marea", d * 0.7)} t="y la marea sube callada" x={960} y={220} size={44} color="#b9cbd6" />
    </Scene>
  );
};

// 8 · LA CADENA DEL GUANTE: de tu cubeta al curtidor, a la piel suave, al guante de una dama; abajo, el precio según el color
const CHAIN = ["TU CUBETA", "EL CURTIDOR", "PIEL SUAVE", "GUANTE FINO"];
export const CadenaGuante: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const k = (i: number) => ez(f, 20 + i * 34, 36 + i * 34);
  const price = ez(f, at(p, "seco", 160) - 6, at(p, "seco", 160) + 10);
  return (
    <Scene d={d} bg={p.bg} floor="237,178,105" tint="#120c08">
      <SV>
        {[0, 1, 2].map((i) => <path key={i} d={`M${330 + i * 420},420 L${520 + i * 420},420`} stroke={ORA} strokeWidth={8} strokeDasharray="1" pathLength={1} style={{ strokeDashoffset: 1 - k(i + 1) } as any} markerEnd="" />)}
        {[0, 1, 2].map((i) => <path key={"h" + i} d={`M${505 + i * 420},404 L${525 + i * 420},420 L${505 + i * 420},436`} stroke={ORA} strokeWidth={8} fill="none" opacity={k(i + 1)} />)}
        <g opacity={k(0)}><Bucket x={240} y={440} s={2} fill={0.7} col="#4a3a26" lid /></g>
        <g opacity={k(1)} transform="translate(660,420)"><ellipse cx={0} cy={30} rx={110} ry={34} fill="#6a5238" /><ellipse cx={0} cy={20} rx={96} ry={26} fill="#8c6a44" /><path d="M-60,10 Q0,-60 60,10" stroke="#3a2614" strokeWidth={8} fill="none" /></g>
        <g opacity={k(2)} transform="translate(1080,420)"><path d="M-110,-50 Q0,-90 110,-50 Q130,20 90,60 Q0,90 -90,60 Q-130,20 -110,-50 Z" fill="#e6c9a0" stroke="#b08a5c" strokeWidth={5} /></g>
        <g opacity={k(3)} transform="translate(1500,420)"><path d="M-50,90 L-50,-20 L-70,-80 L-50,-90 L-36,-30 L-30,-110 L-12,-110 L-8,-30 L4,-115 L22,-112 L18,-28 L34,-100 L50,-94 L40,-10 L66,-50 L80,-40 L50,40 L50,90 Z" fill="#f0e6d8" stroke="#b9a58a" strokeWidth={4} /></g>
      </SV>
      {CHAIN.map((c, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 420, top: 560, width: 300, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 38, color: i === 3 ? GOLD : INK, opacity: k(i) }}>{c}</div>)}
      <Tu x={240} y={940} s={1.1} op={k(0)} />
      <div style={{ position: "absolute", left: 520, top: 760, width: 1200, opacity: price, fontFamily: F }}>
        <div style={{ display: "flex", height: 54, borderRadius: 27, overflow: "hidden", border: "3px solid rgba(240,235,229,.4)" }}>
          <div style={{ flex: 1, background: "linear-gradient(90deg,#3b2f22,#8a7660,#f4f0e6)" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 34, fontWeight: 800, color: INK }}><span>oscuro · $</span><span style={{ color: GOLD }}>blanco y seco · $$$</span></div>
      </div>
      <Tag a={at(p, "pure", 10)} t="«PURE»" x={960} y={120} size={90} color={ORA} />
    </Scene>
  );
};

// 9 · KILÓMETROS MIRANDO EL PISO: caminas con la vista abajo, el empedrado pasa, el contador de km sube; a la hora cuatro se rompe el guante
export const PasosKm: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const km = lin(f, 0, d) * 18, hrs = lin(f, 0, d) * 4.13;
  const G = at(p, "guante", d - 70), torn = ez(f, G, G + 8);
  return (
    <Scene d={d} bg={p.bg} floor="210,200,180" tint="#0f0d0b">
      <SV>
        <rect x={0} y={760} width={1920} height={320} fill="#3a352e" />
        {Array.from({ length: 40 }).map((_, i) => { const x = ((i * 120 - f * 9) % 2160 + 2160) % 2160 - 120; return <rect key={i} x={x} y={770 + (i % 3) * 90} width={104} height={74} rx={14} fill={["#59524a", "#4d463f", "#625a50"][i % 3]} />; })}
        {Array.from({ length: 6 }).map((_, i) => { const x = ((i * 380 - f * 9 + 200) % 2280 + 2280) % 2280 - 180; return <ellipse key={i} cx={x} cy={820 + (i % 2) * 120} rx={20} ry={10} fill="#2a241d" />; })}
        <Bucket x={1010} y={640} s={1.2} fill={lin(f, 0, d) * 0.9} col="#4a3a26" lid />
        <Sting x={1012} y={600} k={torn} c={RED} r={50} />
      </SV>
      <Tu x={920} y={790} s={1.5} walk rot={14} />
      <Meter x={90} y={70} w={420} h={18} k={km / 18} col={INK} label="CAMINADO HOY" val={`${km.toFixed(1).replace(".", ",")} km`} size={64} />
      <Meter x={1400} y={70} w={420} h={18} k={hrs / 4.13} col={torn > 0.5 ? RED : ORA} label="TURNO" val={`${Math.floor(hrs)} h ${String(Math.floor((hrs % 1) * 60)).padStart(2, "0")}`} size={64} />
      <Tag a={G + 6} t="SE ROMPE EL GUANTE" x={1010} y={420} size={60} color={RED} />
    </Scene>
  );
};

// 10 · EL PANAL DE FEZ: los pozos vistos desde arriba como un panal; la cámara baja a un pozo blanco; tú adentro hasta la cintura, pisando pieles
const VAT = ["#efe9dc", "#b3342a", "#e2b43a", "#7a4e2c", "#efe9dc", "#c46a2a", "#efe9dc", "#8b2b2b", "#d9a441"];
export const PanalPozos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const dive = ez(f, at(p, "adentro", d * 0.45) - 30, at(p, "adentro", d * 0.45) + 10);
  const z = 1 + dive * 2.6, stomp = Math.abs(Math.sin(f / 6)) * 18;
  return (
    <Scene d={d} bg={p.bg} floor="255,200,140" tint="#1d130b" push={0.02}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "960px 560px", background: "#c8a77a" }}>
        <SV>
          {Array.from({ length: 7 * 12 }).map((_, i) => { const r = Math.floor(i / 12), c = i % 12; const x = c * 170 + (r % 2) * 85 - 30, y = r * 150 + 40;
            const col = r === 3 && c === 5 ? "#efe9dc" : VAT[(i * 7 + r) % VAT.length];
            return <g key={i}><circle cx={x} cy={y} r={72} fill="#a9895e" /><circle cx={x} cy={y} r={58} fill={col} /><circle cx={x - 14} cy={y - 14} r={14} fill="rgba(255,255,255,.18)" /></g>; })}
        </SV>
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, opacity: dive }}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #f3eee2 0%, #d8d0bf 45%, #8b7454 46%, #3a2c1c 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, overflow: "hidden" }}>
          <Tu x={960} y={980 + stomp} s={2.4} rot={Math.sin(f / 6) * 3} />
        </div>
        <SV>
          <ellipse cx={960} cy={760} rx={520} ry={70} fill="rgba(243,238,226,.92)" />
          {[0, 1, 2].map((i) => <ellipse key={i} cx={960} cy={760} rx={140 + ((f * 3 + i * 60) % 180) * 2} ry={20 + ((f * 3 + i * 60) % 180) * 0.3} fill="none" stroke="#fff" strokeWidth={3} opacity={1 - ((f * 3 + i * 60) % 180) / 180} />)}
          <path d="M760,770 Q900,740 1080,780 L1060,800 Q900,770 780,795 Z" fill="#b58a5a" />
        </SV>
      </div>
      <Tag a={at(p, "chouara", 20)} t="CHOUARA · FEZ" x={960} y={100} size={70} color={INK} />
      <Tag a={at(p, "adentro", d * 0.45) + 6} t="hasta la cintura, descalzo" x={960} y={200} size={44} color={ORA} />
    </Scene>
  );
};
