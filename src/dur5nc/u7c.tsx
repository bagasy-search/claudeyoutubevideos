// dur5nc — componentes únicos 26-34 (ideas para no pelear, denisovano, neandertal, sapiens, tablero).
import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV, Tu } from "./pkit";
import { Rival, Fosil } from "./hkit";

type UP = { d: number; p: any };
const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// 26 · TRES IDEAS: un bocadillo, dos palos con humo que no prende, un árbol; a cada una le cae una tachadura de carbón
export const TresIdeas: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const I = [["hablar", 60, "HABLAR"], ["fuego", 220, "FUEGO"], ["arbol", 380, "TREPAR"]] as [string, number, string][];
  return (
    <Scene d={d} bg={p.bg} tint="#15100b" floor="255,190,110">
      {I.map(([k, def, l], i) => { const a = at(p, k, def); if (a > 9000) return null; const s = sp(f, a, 1, 12), x = 170 + i * 560, c = ez(f, a + 90, a + 104);
        return <div key={k} style={{ position: "absolute", left: x, top: 200, width: 460, height: 640, borderRadius: 22, background: "#efe6d0", opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 180}px) rotate(${[-2.5, 1.4, 3][i]}deg)`, boxShadow: "0 30px 50px rgba(0,0,0,.55)" }}>
          <svg width={460} height={480} viewBox="0 0 460 480">
            {i === 0 && <path d="M70,110 H390 Q420,110 420,140 V300 Q420,330 390,330 H200 L120,410 V330 H70 Q40,330 40,300 V140 Q40,110 70,110 Z" fill="#fff" stroke="#3a2d1d" strokeWidth={8} />}
            {i === 0 && [0, 1, 2].map((n) => <circle key={n} cx={160 + n * 70} cy={218} r={18 * (0.7 + 0.3 * Math.sin(f / 7 - n))} fill="#3a2d1d" />)}
            {i === 1 && <g><rect x={80} y={330} width={300} height={34} rx={16} fill="#7a5532" /><rect x={226} y={120} width={26} height={220} rx={12} fill="#8e6a44" transform={`rotate(${Math.sin(f / 2) * 8} 240 330)`} />{[0, 1, 2].map((n) => { const t = ((f + n * 24) % 72) / 72; return <circle key={n} cx={240 + Math.sin(t * 8 + n) * 26} cy={320 - t * 240} r={16 + t * 30} fill={`rgba(120,120,120,${(1 - t) * 0.55})`} />; })}</g>}
            {i === 2 && <g><rect x={200} y={210} width={60} height={250} fill="#6a4a2a" /><circle cx={230} cy={150} r={130} fill="#3f7a3a" /><circle cx={140} cy={210} r={80} fill="#356a32" /><circle cx={320} cy={210} r={80} fill="#356a32" /></g>}
          </svg>
          <div style={{ textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 78, color: "#2a2115" }}>{l}</div>
          <svg width={460} height={640} viewBox="0 0 460 640" style={{ position: "absolute", left: 0, top: 0 }}><path d="M40,70 L420,580 M420,70 L40,580" stroke={RED} strokeWidth={28} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - c)} /></svg>
        </div>; })}
    </Scene>
  );
};

// 27 · SIN NADA ENCIMA: al muñeco se le van, uno a uno, teléfono, lentes, zapatos y reloj; queda solo en la llanura
export const SinCivilizacion: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const O: [string, number, number][] = [["TELÉFONO", 1280, 300], ["LENTES", 1550, 460], ["ZAPATOS", 1320, 620], ["RELOJ", 1600, 780]];
  return (
    <Scene d={d} bg={p.bg} tint="#17110b" floor="255,190,110">
      <SV><rect x={0} y={880} width={1920} height={200} fill="#3a2b1c" /></SV>
      <Tu x={620} y={890} s={3.1} rot={Math.sin(f / 26) * 1} />
      {O.map(([l, x, y], i) => { const a = 18 + i * 34, k = ez(f, a, a + 30); return <div key={l} style={{ position: "absolute", left: lp(640, x, k) - 170, top: lp(560, y - k * 40, k), width: 380, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 62, color: INK, opacity: Math.min(1, k * 2.5) * (1 - ez(f, a + 86, a + 110) * 0.7) }}>{l}</div>; })}
      <Tag a={Math.max(120, d - 80)} t="UN MAMÍFERO LENTO" x={1280} y={120} size={80} color={RED} w={1100} />
    </Scene>
  );
};

// 28 · DE UN DEDO A UNA ESPECIE: un huesito casi invisible se acerca y se abre en una tira de letras de ADN que corre
export const DedoADN: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 12, 66), L = "ATCGGATTACAGCTTAGGCTAACGTCCATGGA";
  return (
    <Scene d={d} bg={p.bg} tint="#0a0f16" floor="120,190,255">
      <SV>
        <g transform={`translate(${lp(960, 320, k)},${lp(560, 320, k)}) scale(${lp(4.8, 1.3, k)})`}><Fosil x={0} y={0} w={60} h={26} rot={-12} /></g>
      </SV>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 100, fontWeight: 900, letterSpacing: 8, opacity: ez(f, 50, 76), transform: `translateX(${-f * 7 + 100}px)` }}>
        {(L + L + L).split("").map((c, i) => <span key={i} style={{ color: ({ A: "#7fe0c3", T: "#ff9d7a", C: "#ffd77a", G: "#9dbcff" } as any)[c] }}>{c}</span>)}
      </div>
      <Tag a={30} t="UN HUESITO" x={700} y={270} size={80} color={INK} w={900} />
      <Tag a={84} t="UNA ESPECIE NUEVA" x={960} y={780} size={106} color={GOLD} />
    </Scene>
  );
};

// 29 · FALTA OXÍGENO: una columna de altitud sube a 3.280 m; las burbujas de O₂ se van apagando dentro de un pulmón
export const AlturaO2: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 14, 70), hgt = Math.round(3280 * k), pal = 1 - 0.32 * ez(f, 50, 96);
  return (
    <Scene d={d} bg={p.bg} tint="#101a26" floor="170,210,255">
      <SV>
        <path d="M0,900 L320,540 L520,720 L860,300 L1200,830 L1920,900 V1080 H0 Z" fill="#3a4757" /><path d="M860,300 L800,380 L860,362 L920,410 L960,370 Z" fill="#e7eef5" />
        <rect x={150} y={230} width={46} height={700} rx={18} fill="rgba(240,235,229,.14)" /><rect x={150} y={930 - 700 * k} width={46} height={700 * k} rx={18} fill={GOLD} />
        <g transform="translate(1440,540)"><path d="M0,-260 C-210,-250 -300,60 -200,240 C-130,300 -30,240 -10,120 V-250 Z M16,-250 V120 C30,240 130,300 200,240 C300,60 210,-250 16,-250 Z" fill="#c07a78" stroke="#6f3b3b" strokeWidth={5} />
          {Array.from({ length: 24 }).map((_, i) => { const on = i / 24 < pal, x = (i % 2 ? 110 : -110) + (rnd(i) - 0.5) * 120, y = -180 + rnd(i, 2) * 380 + Math.sin(f / 12 + i) * 6; return <circle key={i} cx={x} cy={y} r={15} fill={on ? "#bfe5ff" : "rgba(60,30,30,.6)"} stroke="#fff" strokeWidth={on ? 2 : 0} />; })}
        </g>
      </SV>
      <div style={{ position: "absolute", left: 230, top: 140, fontFamily: F, fontWeight: 900, fontSize: 124, color: INK, fontVariantNumeric: "tabular-nums" }}>{hgt.toLocaleString("es-MX").replace(",", ".")} m</div>
      <Tag a={96} t="−⅓ DE OXÍGENO" x={1440} y={880} size={72} color={RED} w={800} />
    </Scene>
  );
};

// 30 · EL RODEO: el mismo esqueleto dos veces; las marcas de fractura caen en los mismos lugares: neandertal y jinete
export const MapaRodeo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const D = [[0, -300], [-30, -240], [34, -240], [-92, -170], [96, -170], [-120, -90], [10, -120]];
  const Esq = ({ x, c }: { x: number; c: number }) => <g transform={`translate(${x},840) scale(1.6)`}>
    <circle cy={-300} r={36} fill="none" stroke="#d6c196" strokeWidth={8} /><path d="M0,-262 V-90 M-70,-226 H70 M-70,-226 L-120,-90 M70,-226 L120,-90 M-40,-96 H40 M-40,-96 L-48,0 M40,-96 L48,0" stroke="#d6c196" strokeWidth={10} strokeLinecap="round" fill="none" />
    {D.map(([u, v], i) => { const k = sp(f, c + i * 7, 0.9, 9); return <g key={i} opacity={Math.min(1, k * 2)}><circle cx={u} cy={v} r={18 * k} fill={RED} /><circle cx={u} cy={v} r={32 * k} fill="none" stroke={RED} strokeWidth={3} /></g>; })}
  </g>;
  return (
    <Scene d={d} bg={p.bg} tint="#16100c" floor="255,180,110">
      <SV><Esq x={560} c={16} /><Esq x={1360} c={at(p, "rodeo", 90)} /></SV>
      <Tag a={10} t="NEANDERTAL" x={560} y={60} size={84} color={GOLD} w={760} />
      <Tag a={at(p, "rodeo", 90)} t="JINETE DE RODEO" x={1360} y={60} size={76} color={INK} w={800} />
    </Scene>
  );
};

// 31 · BRAZO DE TENISTA: dos cortes de hueso, derecho e izquierdo, en un mismo cuerpo: el derecho engorda a la vista
export const BrazoTenista: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 18, 86), sw = Math.sin(f / 13) * 12;
  return (
    <Scene d={d} bg={p.bg} tint="#16100c" floor="255,190,120">
      <SV>
        <Rival x={960} y={900} s={3.2} h={0.98} w={1.42} arm={0.95} brow={1} c="#6f4a2d" lean={sw * 0.05} />
        <g transform="translate(380,450)"><circle r={lp(140, 240, k)} fill="#d6c196" stroke="#6d5a39" strokeWidth={5} /><circle r={84} fill="#2a1712" /></g>
        <g transform="translate(1540,450)"><circle r={140} fill="#d6c196" stroke="#6d5a39" strokeWidth={5} /><circle r={84} fill="#2a1712" /></g>
      </SV>
      <Tag a={8} t="DERECHO" x={380} y={740} size={66} color={GOLD} w={520} />
      <Tag a={14} t="IZQUIERDO" x={1540} y={740} size={66} color={INK} w={520} />
      <Tag a={84} t="COMO TENISTA" x={960} y={70} size={92} color={RED} />
    </Scene>
  );
};

// 32 · DOS POR CIENTO: tu mapa genético de 100 bloques; dos se encienden, y es parte de él
export const DosPorCiento: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  return (
    <Scene d={d} bg={p.bg} tint="#0e0d13" floor="190,160,255">
      <SV>
        {Array.from({ length: 100 }).map((_, i) => { const on = i === 47 || i === 62, k = ez(f, 4 + i * 0.6, 14 + i * 0.6), g = ez(f, 74, 100); return <rect key={i} x={410 + (i % 10) * 112} y={120 + Math.floor(i / 10) * 74} width={100} height={62} rx={10} fill={on ? (g > 0 ? `rgba(255,182,90,${0.3 + g * 0.7})` : "rgba(240,235,229,.2)") : "rgba(240,235,229,.2)"} opacity={k} style={on ? { filter: `drop-shadow(0 0 ${22 * g}px #ffb65a)` } : undefined} />; })}
      </SV>
      <Tag a={90} t="≈ 2 %" x={230} y={430} size={120} color={GOLD} w={420} />
      <Tag a={Math.max(120, d - 56)} t="ES DE LA FAMILIA" x={960} y={880} size={92} color={INK} />
    </Scene>
  );
};

// 33 · LA PALANCA: dos brazos, con y sin lanzadardos; el arco del segundo es mayor y el velocímetro lo cuenta
export const PalancaDardo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const c = ((f - 16) % 80 + 80) % 80, k = Math.min(1, c / 26), a = lp(-155, 26, k * k * k);
  const Sw = ({ x, r, y, col }: { x: number; r: number; y: number; col: string }) => {
    const ex = x + Math.cos((a * Math.PI) / 180) * r, ey = y + Math.sin((a * Math.PI) / 180) * r;
    return <g><circle cx={x} cy={y} r={r} fill="none" stroke="rgba(240,235,229,.12)" strokeWidth={3} /><line x1={x} y1={y} x2={ex} y2={ey} stroke={col} strokeWidth={r > 300 ? 12 : 34} strokeLinecap="round" />{r > 300 && <line x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * 170} y2={y + Math.sin((a * Math.PI) / 180) * 170} stroke="#6f4a2d" strokeWidth={34} strokeLinecap="round" />}<circle cx={ex} cy={ey} r={14} fill={GOLD} /></g>;
  };
  const v0 = Math.round(50 * Math.min(1, k * 1.2)), v1 = Math.round(100 * Math.min(1, k * 1.2));
  return (
    <Scene d={d} bg={p.bg} tint="#16100b" floor="255,190,120">
      <SV><Sw x={420} r={170} y={560} col="#6f4a2d" /><Sw x={1240} r={345} y={560} col="#c2a06a" /></SV>
      <div style={{ position: "absolute", left: 180, top: 800, width: 480, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 86, color: INK, fontVariantNumeric: "tabular-nums" }}>{v0} km/h</div>
      <div style={{ position: "absolute", left: 1000, top: 800, width: 480, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 86, color: RED, fontVariantNumeric: "tabular-nums" }}>≈ {v1} km/h</div>
      <Tag a={10} t="LANZADARDOS" x={1240} y={90} size={80} color={GOLD} w={800} />
      <Tag a={10} t="BRAZO" x={420} y={260} size={66} color={INK} w={500} />
    </Scene>
  );
};

// 34 · HASTA DÓNDE LLEGA CADA UNO: vista de arriba; los otros diez alcanzan un círculo mínimo; el anillo de 30 m se abre y te alcanza
export const AlcanceTreinta: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, at(p, "trein", 60), at(p, "trein", 60) + 50), cx = 200, cy = 560, px = 50;
  const tux = cx + 30 * px;
  return (
    <AbsoluteFill style={{ background: "#0d150d" }}>
      <SV>
        {Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i, 4) * 1080} r={26 + rnd(i, 7) * 40} fill="rgba(44,86,44,.45)" />)}
        <circle cx={cx} cy={cy} r={px * 3} fill="rgba(241,69,54,.14)" stroke={RED} strokeWidth={4} />
        <circle cx={cx} cy={cy} r={30 * px * k} fill="rgba(233,199,98,.1)" stroke={GOLD} strokeWidth={8} />
        <line x1={cx} y1={cy} x2={cx + 30 * px * k} y2={cy} stroke={GOLD} strokeWidth={8} strokeDasharray="28 18" />
        <circle cx={cx} cy={cy} r={22} fill={GOLD} /><circle cx={tux} cy={cy} r={22} fill="#fff" />
      </SV>
      <Tag a={at(p, "trein", 60) + 40} t="30 METROS" x={1000} y={420} size={110} color={GOLD} w={900} />
      <Tag a={10} t="LOS OTROS 10: CUERPO A CUERPO" x={820} y={810} size={52} color={RED} w={1000} />
      <Tag a={at(p, "trein", 60) + 6} t="TÚ" x={tux} y={cy + 40} size={66} color={INK} w={240} />
    </AbsoluteFill>
  );
};

// 35 · ESTRATOS: las once marcas se apilan como capas de tierra; la de abajo es la de cero; suma total arriba
export const EstratosSuma: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const R: [string, string, string][] = [["FLORES", "3:10", "#6d5536"], ["LUZÓN", "2:40", "#7a5e3a"], ["LUCY", "1:50", "#866a42"], ["HABILIS", "1:15", "#92734a"], ["NALEDI", "0:58", "#a07f52"], ["CASCANUECES", "0:41", "#ad8a5a"], ["ERECTUS", "0:33", "#ba9662"], ["HEIDELBERG", "0:14", "#c6a26b"], ["DENISOVANO", "0:11", "#d2ae74"], ["NEANDERTAL", "0:03", "#deb97d"], ["SAPIENS", "0:00", RED]];
  const s = Math.round(695 * ez(f, 30, 190));
  return (
    <AbsoluteFill style={{ background: "#120c08" }}>
      {R.map(([n, t, c], i) => { const a = 6 + i * 13, k = sp(f, a, 1, 13); return <div key={n} style={{ position: "absolute", left: 180, top: 24 + i * 95, width: 1160, height: 86, borderRadius: 10, background: c, opacity: Math.min(1, k * 2), transform: `translateX(${(1 - k) * -220}px)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", fontFamily: F, fontWeight: 900, fontSize: 56, color: i === 10 ? "#fff" : "#1d140b", boxSizing: "border-box" }}><span>{n}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{t}</span></div>; })}
      <div style={{ position: "absolute", left: 1370, top: 340, width: 500, textAlign: "center", fontFamily: F, color: INK, fontWeight: 800, fontSize: 46 }}>TOTAL<div style={{ fontSize: 140, fontWeight: 900, color: GOLD, fontVariantNumeric: "tabular-nums" }}>{`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`}</div>EN TODA LA HISTORIA</div>
    </AbsoluteFill>
  );
};
