// dur5nc — componentes únicos 14-25 (habilis, naledi, boisei, las 5 ventajas, erectus, heidelbergensis).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, SAND, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV, Tu, Sting } from "./pkit";
import { Rival, Fosil, Lasca } from "./hkit";

type UP = { d: number; p: any };
const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// 14 · LA MORDIDA EN EL HUESO: huesos de un pie sobre tela, la lupa recorre y marca las perforaciones de dientes
export const PieMordido: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 18, 96), lx = lp(420, 1350, k), ly = 540 + Math.sin(f / 22) * 70;
  const M = [[720, 470], [840, 600], [980, 440], [1120, 590], [1280, 500]];
  return (
    <Scene d={d} bg={p.bg} tint="#17120c" floor="255,210,140">
      <AbsoluteFill style={{ background: "linear-gradient(#3b2c1e,#23190f)", opacity: 0.85 }} />
      <SV>
        {[0, 1, 2, 3, 4].map((i) => <Fosil key={i} x={560 + i * 60} y={360 + i * 90} w={500} h={72} rot={-14 + i * 7} curve={10} />)}
        <Fosil x={1250} y={530} w={620} h={100} rot={3} curve={-20} />
        {M.map(([x, y], i) => { const v = lx > x ? ez(f, 18 + ((x - 420) / 930) * 78, 28 + ((x - 420) / 930) * 78) : 0; return <g key={i} opacity={v}><ellipse cx={x} cy={y} rx={22} ry={13} fill="#1c120a" /><circle cx={x} cy={y} r={46 * v} fill="none" stroke={RED} strokeWidth={5} /></g>; })}
        <circle cx={lx} cy={ly} r={140} fill="rgba(255,250,235,.14)" stroke="#d8d2bb" strokeWidth={14} /><line x1={lx + 100} y1={ly + 100} x2={lx + 220} y2={ly + 220} stroke="#6f5a33" strokeWidth={26} strokeLinecap="round" />
      </SV>
      <Tag a={100} t="DIENTES DE COCODRILO" x={960} y={90} size={82} color={RED} w={1500} />
    </Scene>
  );
};

// 15 · DOS GOLPES: la piedra-martillo pega dos veces y salta la lasca, que queda girando con el borde encendido
export const DosGolpes: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const hits = [26, 56], fly = ez(f, 56, 84);
  const hy = f < 26 ? lp(180, 410, ez(f, 4, 26)) : f < 56 ? lp(410, 180, Math.min(1, (f - 26) / 14)) + (f > 40 ? lp(0, 230, (f - 40) / 16) : 0) : lp(410, 310, ez(f, 56, 76));
  return (
    <Scene d={d} bg={p.bg} tint="#14100b" floor="255,200,120">
      <SV>
        <rect x={0} y={800} width={1920} height={280} fill="#3a2b1b" />
        <path d="M600,790 q40,-180 200,-210 q200,-24 340,60 q86,70 60,150 Z" fill="#8e8778" stroke="#4c483f" strokeWidth={5} />
        <path d="M880,640 l50,60 l-70,70 M1010,620 l-30,90 l60,60" stroke="#55503f" strokeWidth={7} fill="none" opacity={ez(f, 26, 34)} /><ellipse cx={f < 56 ? 850 : lp(850, 560, ez(f, 56, 76))} cy={hy} rx={130} ry={90} fill="#6d6559" stroke="#393530" strokeWidth={5} />
        {hits.map((h) => <Sting key={h} x={900} y={560} k={Math.max(0, 1 - Math.abs(f - h) / 7)} r={110} n={12} />)}
        <g opacity={fly}><Lasca x={lp(980, 1490, fly)} y={lp(540, 430, fly) - Math.sin(fly * Math.PI) * 120} s={1.7} rot={f * 2.2} glow={fly} /></g>
      </SV>
      <Tag a={80} t="1,8 MILLONES DE AÑOS" x={960} y={90} size={76} color={GOLD} w={1500} />
      <Tag a={100} t="Y TODAVÍA CORTA" x={1400} y={720} size={62} color={INK} w={800} />
    </Scene>
  );
};

// 16 · DIECIOCHO CENTÍMETROS: una regla marca la grieta; tu pecho y tu cabeza se comparan y no entran
export const Grieta18: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 16, 66), push = Math.max(0, ez(f, 74, 116)), sh = Math.sin(f / 2) * push * 3;
  const gap = 18 * 13;
  return (
    <Scene d={d} bg={p.bg} tint="#090807" floor="255,170,100">
      <SV>
        <path d={`M0,0 H${960 - gap / 2} Q${960 - gap / 2 - 70},540 ${960 - gap / 2},1080 H0 Z`} fill="#6b6152" stroke="#2c261d" strokeWidth={4} />
        <path d={`M1920,0 H${960 + gap / 2} Q${960 + gap / 2 + 80},540 ${960 + gap / 2},1080 H1920 Z`} fill="#756a59" stroke="#2c261d" strokeWidth={4} />
        <g opacity={k}><line x1={960 - gap / 2} x2={960 + gap / 2} y1={190} y2={190} stroke={GOLD} strokeWidth={6} /><line x1={960 - gap / 2} x2={960 - gap / 2} y1={170} y2={210} stroke={GOLD} strokeWidth={6} /><line x1={960 + gap / 2} x2={960 + gap / 2} y1={170} y2={210} stroke={GOLD} strokeWidth={6} /></g>
        <g transform={`translate(${sh},0)`} opacity={ez(f, 66, 86)}>
          <rect x={920} y={520 + lp(0, 40, push)} width={80} height={80} fill="#b98d6d" /><ellipse cx={960} cy={420 + lp(0, 40, push)} rx={100} ry={126} fill="#cfa281" stroke="#6f4e38" strokeWidth={4} />
          <rect x={720} y={570 + lp(0, 40, push)} width={480} height={500} rx={120} fill="#3a506b" />
          <g opacity={ez(f, 90, 104)}><line x1={720} x2={1200} y1={650} y2={650} stroke={RED} strokeWidth={8} /><line x1={720} x2={720} y1={625} y2={675} stroke={RED} strokeWidth={8} /><line x1={1200} x2={1200} y1={625} y2={675} stroke={RED} strokeWidth={8} /></g>
        </g>
        {[960 - gap / 2, 960 + gap / 2].map((x, i) => <Sting key={i} x={x} y={640} k={Math.max(0, 1 - Math.abs(f - 100 - i * 14) / 9)} r={90} n={10} />)}
      </SV>
      <Tag a={12} t="18 CM" x={960} y={60} size={120} color={GOLD} />
      <Tag a={90} t="TUS HOMBROS: 45 CM" x={350} y={620} size={54} color={RED} w={660} />
    </Scene>
  );
};

// 17 · LA CÁMARA ESCONDIDA: la cueva en corte, una luz baja por el laberinto y al final se llena de huesos con su contador
export const CamaraMil: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 14, 90), Pts = [[220, 150], [520, 240], [460, 460], [820, 540], [860, 780]];
  const i = Math.min(Pts.length - 2, Math.floor(k * (Pts.length - 1))), u = k * (Pts.length - 1) - i, x = lp(Pts[i][0], Pts[i + 1][0], u), y = lp(Pts[i][1], Pts[i + 1][1], u);
  const cnt = Math.round(1550 * ez(f, 96, 150));
  return (
    <Scene d={d} bg={p.bg} tint="#0a0807" floor="255,190,120">
      <AbsoluteFill style={{ background: "#2f281f" }} />
      <SV>
        <path d={Pts.map(([a, b], n) => `${n ? "L" : "M"}${a},${b}`).join(" ")} stroke="#0d0a07" strokeWidth={50} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M640,740 Q880,620 1240,720 Q1470,830 1260,960 Q940,1040 660,950 Q540,850 640,740 Z" fill="#0d0a07" />
        {Array.from({ length: Math.round(60 * ez(f, 96, 150)) }).map((_, n) => <Fosil key={n} x={680 + rnd(n) * 640} y={830 + rnd(n, 2) * 120} w={46 + rnd(n, 3) * 40} h={14} rot={rnd(n, 4) * 180} />)}
        <circle cx={x} cy={y} r={70} fill="rgba(255,226,160,.28)" /><circle cx={x} cy={y} r={14} fill="#ffe7b0" />
      </SV>
      <div style={{ position: "absolute", left: 1040, top: 180, width: 820, textAlign: "center", fontFamily: F, color: GOLD, fontWeight: 900, fontSize: 170, fontVariantNumeric: "tabular-nums", opacity: ez(f, 96, 110) }}>{cnt.toLocaleString("es-MX").replace(",", ".")}</div>
      <Tag a={110} t="FÓSILES" x={1450} y={380} size={70} color={INK} w={700} />
      <Tag a={130} t="15 INDIVIDUOS" x={1450} y={490} size={62} color={ORA} w={700} />
    </Scene>
  );
};

// 18 · NEGRO TOTAL: pantalla casi negra, la barra del aire baja; manos que apenas se adivinan cierran el cuadro
export const SinAire: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = lin(f, 10, d - 20), br = Math.sin(f / (10 - k * 6)) * 0.5 + 0.5;
  return (
    <AbsoluteFill style={{ background: "#040302" }}>
      <SV>
        {[[310, 900, -40], [1610, 900, 220], [960, 1040, -90]].map(([x, y, a], i) => { const v = ez(f, 30 + i * 46, 80 + i * 46); return <g key={i} transform={`translate(${x},${y}) rotate(${a})`} opacity={v * 0.95}><path d="M0,0 C80,-30 170,-30 250,-10" stroke="#8a6a4e" strokeWidth={56} fill="none" strokeLinecap="round" /><path d="M250,-10 l70,-26 M250,-10 l78,-4 M250,-10 l70,20" stroke="#8a6a4e" strokeWidth={20} strokeLinecap="round" /></g>; })}
      </SV>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, rgba(241,69,54,0) 34%, rgba(241,69,54,${(0.12 + k * 0.3) * (0.5 + br * 0.5)}) 100%)` }} />
      <div style={{ position: "absolute", left: 360, top: 240, width: 1200, fontFamily: F, textAlign: "center" }}>
        <div style={{ fontSize: 124, fontWeight: 900, color: INK }}>AIRE</div>
        <div style={{ marginTop: 22, height: 92, borderRadius: 46, background: "rgba(240,235,229,.12)" }}><div style={{ height: "100%", width: `${(1 - k) * 100}%`, background: RED, borderRadius: 28, opacity: 0.6 + br * 0.4 }} /></div>
        <div style={{ marginTop: 30, fontSize: 66, fontWeight: 900, color: INK }}>{Math.round(30 + k * 50)} respiraciones/min</div>
      </div>
    </AbsoluteFill>
  );
};

// 19 · CASCANUECES: el cráneo de perfil, la cresta y el músculo que se contrae al morder; muela tuya vs la suya
export const CrestaMordida: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const bite = (Math.sin(f / 9) + 1) / 2, k = ez(f, at(p, "muelas", 90), at(p, "muelas", 90) + 26);
  return (
    <Scene d={d} bg={p.bg} tint="#14100b" floor="255,200,120">
      <SV>
        <g transform="translate(560,560) scale(1.55)">
          <path d="M-190,10 Q-200,-160 -40,-200 Q10,-262 40,-200 Q190,-170 220,-30 Q240,20 196,30 L196,86 L-40,86 Q-100,70 -130,60 Q-186,50 -190,10 Z" fill="#d6c196" stroke="#6d5a39" strokeWidth={4} />
          <ellipse cx={130} cy={-52} rx={52} ry={38} fill="#2a1a12" />
          <path d="M-40,-200 Q20,-60 -30,86" stroke={RED} strokeWidth={lp(30, 58, bite)} opacity={0.55} fill="none" />
          <g transform={`rotate(${bite * 6} -100 100)`}><path d="M-120,104 Q60,150 200,110 L200,160 Q40,220 -120,170 Z" fill="#cfba8f" stroke="#6d5a39" strokeWidth={4} /></g>
        </g>
        <g opacity={k}><rect x={1300} y={500} width={120} height={120} rx={26} fill="#f3e9d4" stroke="#6d5a39" strokeWidth={4} /><rect x={1490} y={420} width={260} height={280} rx={52} fill="#e7d6ae" stroke="#6d5a39" strokeWidth={4} /></g>
      </SV>
      <Tag a={at(p, "muelas", 90) + 8} t="TUYA" x={1360} y={640} size={54} color={INK} w={260} />
      <Tag a={at(p, "muelas", 90) + 16} t="×4" x={1620} y={720} size={110} color={GOLD} w={300} />
      <Tag a={20} t="CASCANUECES" x={960} y={70} size={88} color={INK} />
    </Scene>
  );
};

// 20 · LA PRENSA: un manómetro enorme y dos pares de dedos cerrando un antebrazo; la aguja no deja de subir
export const AgarrePrensa: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 12, d - 30), ang = lp(-130, 118, k) + Math.sin(f / 3) * 1.5;
  return (
    <Scene d={d} bg={p.bg} tint="#15100c" floor="255,190,120">
      <SV>
        <rect x={120} y={500} width={1000} height={220} rx={100} fill="#cfa281" stroke="#6f4e38" strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${420 + i * 110},${360 + k * 80} q60,120 12,290`} stroke="#6f4a2d" strokeWidth={58} fill="none" strokeLinecap="round" />)}
        <g transform="translate(1470,560)"><circle r={290} fill="#efe6d0" stroke="#58524a" strokeWidth={14} />
          {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-5} y={-268} width={10} height={i > 7 ? 54 : 34} fill={i > 7 ? RED : "#2b2b2b"} transform={`rotate(${-125 + i * 25})`} />)}
          <rect x={-9} y={-240} width={18} height={260} rx={9} fill={RED} transform={`rotate(${ang})`} /><circle r={36} fill="#2b2b2b" /></g>
      </SV>
      <Tag a={Math.max(30, d - 90)} t="COMO UN GORILA" x={1470} y={910} size={68} color={GOLD} w={800} />
      <Tag a={14} t="NO SUELTA" x={620} y={120} size={104} color={INK} w={900} />
    </Scene>
  );
};

// 21 · LA LISTA DE PÉRDIDAS: una etiqueta colgada de tu muñeco por cada cosa, que un sello va marcando PERDIDA
export const ListaPerdidas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const L: [string, string][] = [["huesos", "HUESOS"], ["manos", "MANOS"], ["dolor", "DOLOR"], ["aguante", "AGUANTE"], ["expe", "EXPERIENCIA"]];
  return (
    <Scene d={d} bg={p.bg} tint="#16100b" floor="255,190,120" drift={0.5}>
      <Tu x={420} y={920} s={3.6} />
      {L.map(([k0, l], i) => { const a = at(p, k0, 30 + i * 100); if (a > 9000) return null; const s = sp(f, a, 1, 11), st = sp(f, a + 22, 0.8, 9); return (
        <div key={l} style={{ position: "absolute", left: 800, top: 60 + i * 176, width: 1020, height: 150, borderRadius: 14, background: "#efe6d0", opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 200}px)`, boxShadow: "0 16px 30px rgba(0,0,0,.5)", fontFamily: F }}>
          <div style={{ position: "absolute", left: 32, top: 30, fontSize: 40, color: "#7a6b4c", fontWeight: 900 }}>{i + 1}</div>
          <div style={{ position: "absolute", left: 96, top: i === 4 ? 40 : 30, fontSize: i === 4 ? 66 : 84, color: "#2a2115", fontWeight: 900 }}>{l}</div>
          <div style={{ position: "absolute", right: 30, top: 26, padding: "4px 26px", border: `9px solid ${RED}`, color: RED, borderRadius: 10, fontSize: 56, fontWeight: 900, transform: `rotate(-8deg) scale(${2 - Math.min(1, st)})`, opacity: f > a + 22 ? 1 : 0 }}>PERDIDA</div>
        </div>); })}
    </Scene>
  );
};

// 22 · HOMBRO LATIGAZO: el rival lanza; el arco del brazo deja una estela y sale la piedra; junto un corredor sin cansarse
export const HombroLatigo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const c = ((f - 18) % 60 + 60) % 60, k = Math.min(1, c / 22), ang = lp(-170, 30, k * k), fly = Math.max(0, (c - 16) / 40);
  const sx = 736, sy = 312, r = 270, ax = sx + Math.cos((ang * Math.PI) / 180) * r, ay = sy + Math.sin((ang * Math.PI) / 180) * r;
  return (
    <Scene d={d} bg={p.bg} tint="#17110b" floor="255,200,120">
      <SV>
        <rect x={0} y={860} width={1920} height={220} fill="#3b2a18" />
        <Rival x={700} y={864} s={3.1} h={1.08} w={0.92} c="#6f4a2d" />
        <path d={`M${sx + Math.cos(Math.PI * -0.94) * r},${sy + Math.sin(Math.PI * -0.94) * r} A${r},${r} 0 0 1 ${ax},${ay}`} stroke={ORA} strokeWidth={16} opacity={0.8 * k} fill="none" />
        <line x1={sx} y1={sy} x2={ax} y2={ay} stroke="#6f4a2d" strokeWidth={44} strokeLinecap="round" />
        <circle cx={ax + 8} cy={ay} r={38} fill="#8d8476" stroke="#4e483e" strokeWidth={4} opacity={fly > 0 ? 0 : 1} />
        {fly > 0 && <circle cx={ax + fly * 1100} cy={ay - fly * 120 + fly * fly * 170} r={38} fill="#8d8476" stroke="#4e483e" strokeWidth={4} />}
      </SV>
      <Tag a={16} t="EL PRIMER LANZADOR" x={1320} y={120} size={70} color={GOLD} w={1000} />
    </Scene>
  );
};

// 23 · HORAS DE CALOR: dos cuerpos con termómetro; el tuyo sube y se dispara, el suyo se queda plano mientras avanza el reloj
export const HorasCalor: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 10, d - 20);
  const X = (t: number) => 180 + t * 1560, Y = (v: number) => 880 - v * 620;
  const T = (t: number) => Math.min(1, 0.16 + Math.pow(t, 2.2) * 1.2);
  const n = 60; const tu = Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * k; return `${i ? "L" : "M"}${X(t)},${Y(T(t))}`; }).join(" ");
  return (
    <Scene d={d} bg={p.bg} tint="#1b0f07" floor="255,150,70">
      <SV>
        <line x1={180} x2={1760} y1={880} y2={880} stroke="rgba(240,235,229,.4)" strokeWidth={4} /><line x1={180} x2={180} y1={230} y2={880} stroke="rgba(240,235,229,.4)" strokeWidth={4} />
        <line x1={180} x2={1760} y1={Y(0.92)} y2={Y(0.92)} stroke={RED} strokeWidth={4} strokeDasharray="18 14" />
        <path d={tu} stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" />
        <line x1={X(0)} x2={X(k)} y1={Y(0.22)} y2={Y(0.22)} stroke={GOLD} strokeWidth={14} strokeLinecap="round" />
      </SV>
      <Tag a={30} t="TÚ" x={X(k) + 20} y={Y(T(k)) - 80} size={72} color={RED} w={260} />
      <Tag a={44} t="ÉL" x={X(k)} y={Y(0.22) - 90} size={72} color={GOLD} w={260} />
      <Tag a={20} t="CALOR DEL CUERPO" x={960} y={80} size={72} color={INK} />
      <Tag a={Math.max(60, d - 70)} t="HORAS" x={1560} y={910} size={58} color={INK} w={400} />
    </Scene>
  );
};

// 24 · EL CENTRO DE GRAVEDAD: la lanza de Schöningen en perfil sobre un fiel: se equilibra adelante, igual que una jabalina
export const LanzaEquilibrio: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 14, 40), bal = Math.sin(f / 16) * (1 - ez(f, 40, 100)) * 8, jav = ez(f, at(p, "jab", 110), at(p, "jab", 110) + 22);
  return (
    <Scene d={d} bg={p.bg} tint="#16100b" floor="255,200,130">
      <SV>
        <g transform={`translate(0,${(1 - k) * 80})`} opacity={k}>
          <g transform={`rotate(${bal} 780 430)`}><path d="M120,430 L260,418 Q800,402 1760,430 Q800,458 260,442 Z" fill="#a47f4f" stroke="#573f22" strokeWidth={4} /></g>
          <path d="M780,450 l-54,120 h108 Z" fill="#6f7076" /><circle cx={780} cy={430} r={14} fill={GOLD} />
        </g>
        <g opacity={jav}><path d="M120,720 L290,712 Q900,704 1760,720 Q900,736 290,728 Z" fill="#9ca3a8" stroke="#4d5358" strokeWidth={3} /><path d="M780,738 l-44,96 h88 Z" fill="#6f7076" /><circle cx={780} cy={720} r={12} fill={GOLD} /></g>
      </SV>
      <Tag a={20} t="2 M · 300 MIL AÑOS" x={960} y={130} size={80} color={INK} w={1500} />
      <Tag a={at(p, "jab", 110) + 10} t="JABALINA DE HOY" x={1420} y={830} size={58} color={GOLD} w={800} />
    </Scene>
  );
};

// 25 · CERCO: vista desde arriba, tú en el centro; cinco puntos se cierran como en un radar
export const CercoRadar: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 26, d - 26);
  const cx = 960, cy = 560;
  return (
    <AbsoluteFill style={{ background: "#07130a" }}>
      <SV>
        {[140, 280, 420].map((r) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(120,255,160,.3)" strokeWidth={3} />)}
        <path d={`M${cx},${cy} L${cx + Math.cos(f / 14) * 460},${cy + Math.sin(f / 14) * 460}`} stroke="rgba(120,255,160,.75)" strokeWidth={5} />
        <circle cx={cx} cy={cy} r={18} fill="#fff" />
        {Array.from({ length: 5 }).map((_, i) => { const a = (i / 5) * Math.PI * 2 + 0.6, r = lp(470, 120, k), v = ez(f, 14 + i * 16, 30 + i * 16); return <g key={i} opacity={v}><circle cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={24} fill={RED} /><circle cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={38 + Math.sin(f / 5 + i) * 8} fill="none" stroke={RED} strokeWidth={3} /></g>; })}
      </SV>
      <Tag a={20} t="NO VIENE UNO" x={280} y={120} size={68} color={INK} w={520} />
      <Tag a={Math.max(50, d - 60)} t="VIENEN CINCO" x={1640} y={850} size={68} color={RED} w={520} />
    </AbsoluteFill>
  );
};
