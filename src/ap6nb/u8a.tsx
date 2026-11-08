// ap6nb — únicas 1-15: cómo es, qué tan lento, y cómo se le midió la edad. Ninguna repite apex01-07 ni ap6na. Dibujado por código, sin IA.
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, ORA, GOLD, Scene, Tag, Motes, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Shark, ICE, SLATE, lp } from "./skit";

type UP = { d: number; p: any };
const T = "#061018", CY = "#7fd1e8";

// 1 · LARGO DE CAMIONETA: el tiburón y una pickup, con la misma cota
export const PickupLength: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "truck", 14), k = ez(f, a, a + 26);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <Shark x={960 + f * 0.06} y={400} s={1.72} t={f} />
        <g opacity={k} transform={`translate(${lp(-260, 0, k)},0)`}>
          <path d="M360,820 L360,720 L640,716 L780,620 L1140,616 L1240,716 L1560,726 L1560,820 Z" fill="#1d2b36" stroke={ICE} strokeWidth={5} />
          <path d="M800,636 L1120,632 L1198,712 L700,716 Z" fill="#0b151d" stroke={ICE} strokeWidth={3} />
          {[560, 1360].map((x) => <g key={x}><circle cx={x} cy={830} r={70} fill="#0a1218" stroke={ICE} strokeWidth={5} /><circle cx={x} cy={830} r={28} fill="none" stroke={ICE} strokeWidth={3} /></g>)}
        </g>
        <g opacity={ez(f, a + 20, a + 36)}><path d="M320,930 H1600 M320,906 V954 M1600,906 V954" stroke={GOLD} strokeWidth={6} /></g>
      </SV>
      <Tag a={a + 26} t="AS LONG AS A PICKUP" x={960} y={950} size={72} color={GOLD} w={1300} />
      <Motes c="190,225,255" />
    </Scene>
  );
};

// 2 · LO QUE IMAGINÁS Y LO QUE ES: torpedo tachado, aparece el real con llamadas
export const NotThatShark: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), r = at(p, "real", 70), hd = at(p, "head", r + 60), fi = at(p, "fins", hd + 40), sk = at(p, "skin", fi + 50);
  const out = ez(f, r, r + 16), inn = ez(f, r + 8, r + 34);
  const C: [number, number, string, number, number, number][] = [[1500, 250, "SMALL HEAD", hd, 1450, 470], [760, 220, "TINY FINS", fi, 840, 380], [430, 830, "SCARRED SKIN", sk, 620, 620]];
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <g opacity={1 - out} transform={`translate(960,560) scale(${1 - out * 0.4})`}>
          <path d="M460,0 C300,-90 -140,-96 -380,-16 L-520,-120 L-470,0 L-520,110 L-380,20 C-140,96 300,90 460,0 Z" fill="none" stroke={INK} strokeWidth={7} />
          <path d="M0,-88 L-90,-320 L-140,-82" fill="none" stroke={INK} strokeWidth={7} />
          <path d="M-540,-250 L540,250" stroke={RED} strokeWidth={22} strokeDasharray="1300" strokeDashoffset={1300 * (1 - ez(f, r - 16, r))} />
        </g>
        <g opacity={inn}><Shark x={960} y={540} s={2.1} t={f} /></g>
        {C.map(([x, y, , a0, tx, ty], i) => <path key={i} d={`M${x},${y + 74} L${tx},${ty}`} stroke={GOLD} strokeWidth={5} opacity={ez(f, a0, a0 + 12)} />)}
      </SV>
      {f < r && <Tag a={6} t="WHAT YOU PICTURE" x={960} y={80} size={78} />}
      {C.map(([x, y, t, a0], i) => <Tag key={i} a={a0} t={t} x={x} y={y} size={62} color={GOLD} w={620} />)}
    </Scene>
  );
};

// 3 · LO MEDIDO Y LO DICHO: cinta métrica, banda habitual, pin en 502 cm, zona punteada de relatos viejos
export const MeasuredOrSaid: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), b = at(p, "band", 12), pn = at(p, "pin", 90), sd = at(p, "said", 150);
  const X = (ft: number) => 180 + ft * 74, Y = 620;
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <rect x={180} y={Y} width={1600} height={110} fill={GOLD} rx={6} />
        {Array.from({ length: 22 }).map((_, i) => <g key={i}><line x1={X(i)} y1={Y} x2={X(i)} y2={Y + (i % 2 ? 40 : 66)} stroke="#2a2108" strokeWidth={5} />{i % 2 === 0 && <text x={X(i) + 6} y={Y + 100} fontFamily={F} fontWeight={900} fontSize={30} fill="#2a2108">{i}</text>}</g>)}
        <rect x={X(8)} y={Y - 26} width={(X(16) - X(8)) * ez(f, b, b + 30)} height={18} fill={CY} />
        <g opacity={ez(f, b + 10, b + 34)}><Shark x={X(12)} y={Y - 190} s={0.86} t={f} /></g>
        <g opacity={ez(f, pn, pn + 10)} transform={`translate(${X(16.47)},${Y - 8 - 40 * (1 - sp(f, pn))})`}><path d="M0,0 L-20,-44 A26,26 0 1 1 20,-44 Z" fill={RED} /></g>
        <rect x={X(16.8)} y={Y - 30} width={X(21) - X(16.8)} height={22} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={ez(f, sd, sd + 14)} />
      </SV>
      <Tag a={b + 6} t="8–16 FT · TYPICAL ADULTS" x={960} y={110} size={70} color={CY} w={1400} />
      <Tag a={pn + 6} t="502 CM · MEASURED" x={1120} y={790} size={68} color={RED} w={900} />
      <Tag a={sd + 6} t="LONGER? ONLY SAID" x={1400} y={910} size={58} w={900} />
    </Scene>
  );
};

// 4 · DONDE MUERE LA LUZ: columna de agua, la cámara baja, contador de profundidad
export const SunlightEnds: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), k = ez(f, 8, Math.max(40, d - 40)), mile = at(p, "mile", d - 60);
  const depth = Math.round(lp(0, 7500, k)), lit = Math.max(0, 1 - depth / 3300), y0 = lp(0, -2300, k);
  return (
    <Scene d={d} tint="#010407" floor="20,50,70" drift={0.5}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(60,170,210,${lit}) 0%, rgba(8,50,80,${lit * 0.8}) 100%)` }} />
      <SV>
        {lit > 0 && Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${200 + i * 260},0 L${60 + i * 300},1080 L${200 + i * 300},1080 Z`} fill={`rgba(220,245,255,${0.09 * lit})`} />)}
        <g transform={`translate(0,${y0})`}>
          <line x1={0} x2={1920} y1={1300} y2={1300} stroke={GOLD} strokeWidth={5} strokeDasharray="30 18" />
          <text x={80} y={1270} fontFamily={F} fontWeight={900} fontSize={66} fill={GOLD}>SUNLIGHT ENDS</text>
          <g opacity={0.8}><Shark x={1180} y={2860} s={1.2} t={f} eyeGlow c="#56636d" /></g>
        </g>
      </SV>
      <div style={{ position: "absolute", right: 100, top: 70, fontFamily: F, fontWeight: 900, fontSize: 120, color: INK, fontVariantNumeric: "tabular-nums" }}>{depth.toLocaleString("en-US")} ft</div>
      <Tag a={mile} t="OVER A MILE · SOME ACCOUNTS" x={960} y={930} size={62} color={GOLD} w={1500} />
      <Motes c="190,225,255" n={40} />
    </Scene>
  );
};

// 5 · TIRA DE REGISTRO: seis pistas planas, 0.34 de crucero y el pico de 0.74
export const LoggerStrip: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), cr = at(p, "cruise", 70), bu = at(p, "burst", 150);
  const W = (i: number, x: number) => 7 * Math.sin(x / 60 + i * 1.7) + 6 * Math.sin(x / 13 + i);
  const X0 = 300, X1 = 1760, sc = 700, Y0 = 880;
  const yv = (v: number) => Y0 - v * sc, prog = lin(f, 6, Math.max(60, cr + 30));
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <rect x={X0 - 20} y={260} width={X1 - X0 + 60} height={660} fill="rgba(4,14,22,.85)" stroke="rgba(240,235,229,.25)" strokeWidth={3} />
        {[0, 0.25, 0.5, 0.75].map((v) => <g key={v}><line x1={X0} x2={X1} y1={yv(v)} y2={yv(v)} stroke="rgba(240,235,229,.14)" strokeWidth={2} /><text x={X0 - 34} y={yv(v) + 12} textAnchor="end" fontFamily={F} fontWeight={800} fontSize={34} fill={INK}>{v.toFixed(2)}</text></g>)}
        {Array.from({ length: 6 }).map((_, i) => {
          let s = ""; const n = 120; for (let j = 0; j <= n * prog; j++) { const x = X0 + (j / n) * (X1 - X0); s += `${j ? "L" : "M"}${x},${yv(0.34) + W(i, j * 6)}`; }
          return <path key={i} d={s} fill="none" stroke={[CY, "#a9e5c8", GOLD, ORA, "#c8b6ff", INK][i]} strokeWidth={3.5} opacity={0.85} />;
        })}
        {f > bu && <g><circle cx={1320} cy={yv(0.74)} r={14 + 3 * Math.sin(f / 5)} fill={RED} /><line x1={1320} x2={1320} y1={yv(0.74)} y2={yv(0.34)} stroke={RED} strokeWidth={5} /></g>}
      </SV>
      <Tag a={4} t="SIX TAGGED SHARKS · m/s" x={960} y={140} size={66} w={1300} />
      <Tag a={cr} t="UNDER 1 MPH" x={760} y={700} size={92} color={CY} w={900} />
      <Tag a={bu} t="FASTEST BURST: 0.74" x={1330} y={290} size={58} color={RED} w={800} />
    </Scene>
  );
};

// 6 · SIETE SEGUNDOS: vista de arriba, un solo coletazo mientras la voz cuenta; el blanco se va a la cuenta de dos
export const SevenCount: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a0 = at(p, "one", 10), a7 = at(p, "seven", a0 + 180), wh = at(p, "white", a7 + 30);
  const per = Math.max(10, (a7 - a0) / 6);
  const c = Math.min(7, Math.max(0, Math.floor((f - a0) / per) + 1)), sw = Math.sin(Math.min(1, Math.max(0, (f - a0) / (per * 7))) * Math.PI * 2) * 30;
  const wx = f < wh ? -300 : lp(-300, 2300, ez(f, wh, wh + 16));
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220" drift={0.6}>
      <SV>
        <g transform="translate(980,560)">
          <path d="M520,0 C440,-92 120,-110 -280,-52 Q-300,0 -280,52 C120,110 440,92 520,0 Z" fill={SLATE} />
          <g transform={`translate(-280,0) rotate(${sw})`}><path transform="scale(1.9)" d="M10,-26 L-112,-98 L-82,-10 L-128,44 L10,26 Z" fill="#46535c" /></g>
          <path d="M240,-96 L170,-210 L120,-100 Z M240,96 L170,210 L120,100 Z" fill="#46535c" />
        </g>
        <g transform={`translate(${wx},240)`}><path d="M200,0 C100,-34 -80,-34 -170,-8 L-260,-50 L-230,0 L-260,50 L-170,8 C-80,34 100,34 200,0 Z" fill="#c8d0d6" /></g>
      </SV>
      <div style={{ position: "absolute", left: 90, top: 700, fontFamily: F, fontWeight: 900, fontSize: 280, color: GOLD, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{c || ""}</div>
      {c >= 7 && <Tag a={a7 + 4} t="ONE STROKE" x={1240} y={880} size={110} color={INK} w={1000} />}
      {f >= wh && <Tag a={wh + 2} t="GREAT WHITE: GONE" x={960} y={90} size={74} color="#c8d0d6" w={1200} />}
    </Scene>
  );
};

// 7 · POR DEBAJO DE LA RECTA: lo esperable para su tamaño y un punto rojo que cae lejos (esquema, sin valores inventados)
export const BelowTheLine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "dot", 60), c = at(p, "cold", 180), k = sp(f, a, 1.4, 12);
  const Xa = 300, Xb = 1700, l = ez(f, 6, 40);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <path d="M240,180 V900 H1780" stroke={INK} strokeWidth={5} fill="none" />
        <path d={`M${Xa},840 L${lp(Xa, Xb, l)},${lp(840, 260, l)}`} stroke={GOLD} strokeWidth={10} />
        {Array.from({ length: 16 }).map((_, i) => { const t = (i + 1) / 17, x = lp(Xa, Xb, t), y = lp(840, 260, t) + (rnd(i, 3) - 0.5) * 70; return <circle key={i} cx={x} cy={y} r={15} fill={CY} opacity={ez(f, 16 + i * 2, 26 + i * 2)} />; })}
        <circle cx={1540} cy={lp(320, 800, k)} r={26} fill={RED} opacity={ez(f, a - 2, a + 6)} />
        <path d={`M1540,340 V${lp(340, 760, k)}`} stroke={RED} strokeWidth={5} strokeDasharray="16 12" opacity={ez(f, a + 6, a + 16)} />
      </SV>
      <Tag a={6} t="SPEED" x={270} y={100} size={58} w={400} />
      <Tag a={6} t="BODY SIZE →" x={1480} y={920} size={58} w={600} />
      <Tag a={18} t="WHAT A FISH THIS BIG SHOULD DO" x={740} y={230} size={56} color={GOLD} w={1100} rot={-1} />
      <Tag a={a + 10} t="SLOWEST, FOR ITS SIZE" x={1000} y={760} size={64} color={RED} w={900} />
      <Tag a={c} t="WATER: ABOUT 2 °C" x={620} y={300} size={72} color={CY} w={900} />
    </Scene>
  );
};

// 8 · DIECISÉIS AÑOS, UNOS CENTÍMETROS: anillo de marca, años que corren, la regla casi no se mueve
export const SixteenYearRuler: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "run", 20), m = at(p, "math", d - 80), k = ez(f, a, a + 110);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <Shark x={900} y={380} s={1.5} t={f * 0.4} />
        <circle cx={940} cy={278} r={16} fill="#f6d65b" stroke="#2a2108" strokeWidth={4} opacity={ez(f, 6, 16)} />
        <rect x={290} y={620} width={1340} height={84} fill={GOLD} rx={6} />
        {Array.from({ length: 41 }).map((_, i) => <line key={i} x1={300 + i * 33} x2={300 + i * 33} y1={620} y2={620 + (i % 5 ? 28 : 56)} stroke="#2a2108" strokeWidth={4} />)}
        <path d={`M${1400 + 36 * k},596 l-14,-30 h28 Z`} fill={RED} />
        <line x1={1400} x2={1400} y1={560} y2={740} stroke={INK} strokeWidth={4} strokeDasharray="12 8" opacity={ez(f, 4, 14)} />
      </SV>
      <div style={{ position: "absolute", left: 120, top: 750, fontFamily: F, fontWeight: 900, fontSize: 150, color: INK, fontVariantNumeric: "tabular-nums" }}>{Math.round(16 * k)} <span style={{ fontSize: 76 }}>YEARS</span></div>
      <Tag a={a + 100} t="ONLY A FEW CM" x={1340} y={760} size={78} color={RED} w={900} />
      <Tag a={m} t="OVER 5 M LONG…?" x={1280} y={890} size={84} color={GOLD} w={1100} />
    </Scene>
  );
};

// 9 · EL CENTRO DEL OJO: capas de cristalino que se abren como cebolla hasta un núcleo sellado
export const LensCore: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "center", 40), c = at(p, "capsule", a + 120);
  const n = 11, k = ez(f, a, a + 60);
  return (
    <Scene d={d} bg={p.bg} tint="#050b12" floor="120,190,220">
      <SV>
        <g transform="translate(960,540)">
          {Array.from({ length: n }).map((_, i) => { const r = 400 - i * 34, gap = k * (n - i) * 5, h = i / n; return <circle key={i} r={r + gap} fill="none" stroke={`rgba(${150 + 60 * h},${205 + 25 * h},235,${(0.2 + 0.7 * h) * (1 - k * (1 - h) * 0.7)})`} strokeWidth={20} />; })}
          <circle r={26 + 44 * ez(f, c, c + 20)} fill={GOLD} />
          <circle r={56 + 44 * ez(f, c, c + 20) + 12 * Math.sin(f / 9)} fill="none" stroke={GOLD} strokeWidth={5} opacity={0.5} />
        </g>
      </SV>
      <Tag a={a + 8} t="FORMED BEFORE BIRTH" x={960} y={44} size={72} color={GOLD} w={1300} />
      <Tag a={c + 10} t="NEVER REPLACED" x={960} y={962} size={74} w={1300} />
    </Scene>
  );
};

// 10 · EL PULSO DE LA BOMBA: la curva que se dispara en los 50-60
export const BombPulse: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), t = at(p, "tests", 20), af = at(p, "after", 140), be = at(p, "before", af + 40);
  const pts: [number, number][] = [[260, 830], [760, 830], [900, 816], [980, 690], [1040, 300], [1110, 260], [1230, 420], [1420, 590], [1720, 690]];
  const pr = ez(f, t, t + 66), path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const Y: [string, number][] = [["1900", 340], ["1950", 900], ["1965", 1110], ["TODAY", 1640]];
  return (
    <Scene d={d} bg={p.bg} tint="#0b0a08" floor="255,170,90">
      <SV>
        <line x1={240} x2={1760} y1={850} y2={850} stroke={INK} strokeWidth={4} />
        {Y.map(([y, x]) => <text key={y} x={x} y={910} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={INK}>{y}</text>)}
        <path d={path} fill="none" stroke={ORA} strokeWidth={12} strokeDasharray="2100" strokeDashoffset={2100 * (1 - pr)} strokeLinejoin="round" />
        <circle cx={1060} cy={260} r={70 * ez(f, t + 20, t + 34) + 20 * Math.sin(f / 7)} fill="rgba(255,190,110,.2)" />
      </SV>
      <Tag a={t + 16} t="CARBON-14 · THE BOMB PULSE" x={960} y={80} size={68} color={ORA} w={1500} />
      <Tag a={af} t="AFTER: MARKED" x={1500} y={300} size={72} color={RED} w={700} />
      <Tag a={be} t="BEFORE: NO MARK" x={520} y={690} size={72} color={CY} w={800} />
    </Scene>
  );
};

// 11 · VEINTIOCHO: 28 tiburones por tamaño, los más chicos con la marca
export const TwentyEightLine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), mk = at(p, "mark", 50), old = at(p, "old", mk + 70);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        {Array.from({ length: 28 }).map((_, i) => {
          const col = i % 7, row = Math.floor(i / 7), s = 0.14 + (i / 27) * 0.2, x = 220 + col * 248, y = 300 + row * 160, inn = ez(f, 4 + i * 1.5, 14 + i * 1.5), marked = i < 4;
          return <g key={i} opacity={inn}><Shark x={x} y={y} s={s} t={f + i * 20} />{marked && <circle cx={x} cy={y - 40} r={16} fill={ORA} opacity={ez(f, mk + i * 4, mk + 10 + i * 4)} />}</g>;
        })}
      </SV>
      <Tag a={2} t="28 FEMALES" x={960} y={70} size={92} w={1000} />
      <Tag a={mk + 6} t="SMALLEST: BOMB MARK" x={520} y={940} size={58} color={ORA} w={860} />
      <Tag a={old + 6} t="LARGEST: NO MARK" x={1400} y={940} size={58} color={CY} w={860} />
    </Scene>
  );
};

// 12 · EL PISO: columna vertical 272–392–512; una figura se para en el piso
export const StandOnFloor: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), md = at(p, "mid", 20), rg = at(p, "range", 100), fl = at(p, "floor", rg + 100);
  const Y = (y: number) => 960 - (y - 180) * 2.0, bar = ez(f, rg, rg + 26);
  const y392 = Y(392), yt = lp(y392, Y(512), bar), yb = lp(y392, Y(272), bar);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <rect x={840} y={yt} width={240} height={Math.max(8, yb - yt)} fill="rgba(127,209,232,.32)" stroke={CY} strokeWidth={5} />
        <line x1={780} x2={1140} y1={y392} y2={y392} stroke={RED} strokeWidth={9} opacity={ez(f, md, md + 10)} />
        <g opacity={ez(f, fl, fl + 12)}>
          <rect x={200} y={Y(272)} width={1520} height={34} fill="#d9dde0" />
          {Array.from({ length: 30 }).map((_, i) => <line key={i} x1={210 + i * 52} x2={190 + i * 52} y1={Y(272) + 34} y2={Y(272) + 76} stroke="#d9dde0" strokeWidth={5} />)}
          <g transform={`translate(1480,${Y(272) - 6 - 60 * (1 - sp(f, fl + 4))}) scale(1.6)`}>
            <path d="M-9,0 L-6,-46 M9,0 L6,-46 M0,-46 V-98 M0,-90 L-20,-60 M0,-90 L20,-60" stroke={INK} strokeWidth={9} strokeLinecap="round" /><circle cy={-114} r={14} fill={INK} />
          </g>
        </g>
      </SV>
      <Tag a={md} t="392 ± 120" x={480} y={y392 - 50} size={92} color={RED} w={600} />
      <Tag a={rg + 12} t="512" x={1220} y={Y(512) - 40} size={84} color={CY} w={260} />
      <Tag a={rg + 12} t="272" x={1220} y={Y(272) - 100} size={84} color={CY} w={260} />
      <Tag a={fl + 10} t="THE NUMBER YOU CAN STAND ON" x={960} y={44} size={68} color={GOLD} w={1500} />
    </Scene>
  );
};

// 13 · LA COLUMNA MÁS LARGA: vértebras = décadas; ballena, tortuga, tiburón
export const LongestSpine: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), b = at(p, "bow", 10), t0 = at(p, "tort", b + 40), s = at(p, "shark", t0 + 40);
  const R: [string, number, number, string, string][] = [["BOWHEAD WHALE", 200, b, CY, "200+"], ["GALÁPAGOS TORTOISE", 170, t0, ORA, "~170"], ["GREENLAND SHARK", 272, s, RED, "272 AT LEAST"]];
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        {R.map(([, y, a, c], i) => { const n = Math.round(y / 10), k = Math.round(n * ez(f, a, a + 38)), Yr = 350 + i * 245; return <g key={i}>{Array.from({ length: k }).map((_, j) => <g key={j} transform={`translate(${130 + j * 60},${Yr})`}><rect x={0} y={-30} width={42} height={60} rx={10} fill={c} /><rect x={12} y={-56} width={18} height={30} rx={5} fill={c} opacity={0.6} /><rect x={12} y={26} width={18} height={30} rx={5} fill={c} opacity={0.6} /></g>)}</g>; })}
      </SV>
      {R.map(([n, , a, c, v], i) => <Tag key={n} a={a + 26} t={`${n} · ${v}`} x={130} y={220 + i * 245} size={56} color={c} w={1500} align="left" />)}
      <Tag a={4} t="1 BONE = 10 YEARS" x={1420} y={60} size={54} w={780} />
    </Scene>
  );
};

// 14 · TESTIGO DE HIELO: estratos con fechas humanas y una línea de vida que los atraviesa todos
export const IceCoreCalendar: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), go = at(p, "go", 16);
  const E: [string, string, number][] = [["1610s", "Galileo in trouble with the Church", 0], ["1620", "Pilgrims reach Plymouth", 1], ["1776", "Declaration of Independence", 2], ["1865", "US Civil War ends", 3], ["1945", "End of World War II", 4], ["TODAY", "Still swimming", 5]];
  const dt = Math.max(30, (d - go - 30) / 6), sc = lin(f, go + dt, d - 20, 0, -780);
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220" drift={0.4}>
      <div style={{ position: "absolute", left: 180, top: 0, transform: `translateY(${sc}px)` }}>
        {E.map(([y, t, i]) => <div key={y} style={{ position: "absolute", top: 90 + i * 290, left: 0, width: 1560, height: 262, borderRadius: 18, background: `linear-gradient(90deg, rgba(190,226,240,${0.3 - i * 0.03}), rgba(120,180,210,.12))`, borderTop: "3px solid rgba(235,248,255,.5)", opacity: ez(f, go + i * dt - 10, go + i * dt + 8) }}>
          <div style={{ position: "absolute", left: 40, top: 66, fontFamily: F, fontWeight: 900, fontSize: 102, color: i === 5 ? RED : GOLD }}>{y}</div>
          <div style={{ position: "absolute", left: 480, top: 94, fontFamily: F, fontWeight: 800, fontSize: 56, color: INK }}>{t}</div>
        </div>)}
        <div style={{ position: "absolute", left: 440, top: 90, width: 10, height: lin(f, go, d - 20, 0, 1720), background: RED, boxShadow: "0 0 18px rgba(241,69,54,.8)" }} />
      </div>
      <Motes c="210,235,255" />
    </Scene>
  );
};

// 15 · ADOLESCENCIA DE SIGLO Y MEDIO: barra de 156 frente a los ~13 años de una persona; 1865 → hoy
export const CenturyTeen: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "bar", 10), hu = at(p, "human", a + 50), y = at(p, "war", hu + 90);
  const yr = Math.round(lp(1865, 2021, ez(f, y, y + 80))), sc = 9;
  return (
    <Scene d={d} bg={p.bg} tint={T} floor="120,190,220">
      <SV>
        <rect x={220} y={330} width={156 * sc * ez(f, a, a + 60)} height={120} rx={12} fill={RED} />
        <rect x={220} y={560} width={13 * sc * ez(f, hu, hu + 14)} height={120} rx={12} fill={CY} />
        {Array.from({ length: 16 }).map((_, i) => <line key={i} x1={220 + i * 10 * sc} x2={220 + i * 10 * sc} y1={300} y2={480} stroke="rgba(240,235,229,.22)" strokeWidth={2} />)}
      </SV>
      <Tag a={a + 20} t="FEMALE SHARK: 156 YEARS (± 22)" x={220} y={228} size={70} color={RED} w={1500} align="left" />
      <Tag a={hu + 8} t="PERSON: ~13" x={380} y={586} size={74} color={CY} w={700} align="left" />
      {f >= y && <div style={{ position: "absolute", left: 220, top: 720, fontFamily: F, fontWeight: 900, fontSize: 196, color: GOLD, fontVariantNumeric: "tabular-nums" }}>{yr}</div>}
      <Tag a={y + 70} t="FIRST YOUNG? ONLY NOW" x={1240} y={800} size={64} w={1100} />
    </Scene>
  );
};
