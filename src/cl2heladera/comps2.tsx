// cl2heladera · componentes 9:00 → 22:20 (aire alrededor, bandejita, burlete, nivel, carga, hielo, desagote, cinco errores).
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";

// 15 · la mano abierta: planta vista desde arriba, la heladera se separa de la pared y la mano entra justa
export const ManoDiez: React.FC<FxP> = ({ t, a, m }) => {
  const sep = spr(t, a + 0.2, 0.7), gap = 30 + 140 * sep, hand = spr(t, m.mano, 0.9), side = e(t, m.cinco, m.cinco + 1);
  const fx = 760, fy = 300 + gap;
  return (
    <>
      <Svg>
        <rect x={420} y={240} width={1080} height={60} fill="url(#hatch)" />
        <defs><pattern id="hatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="22" stroke={C.edge} strokeWidth="4" /></pattern></defs>
        <rect x={fx} y={fy} width={400} height={420} rx={20} fill="rgba(214,241,255,.08)" stroke={C.ice2} strokeWidth={4} />
        <text x={fx + 200} y={fy + 240} textAnchor="middle" fill={C.dim} fontFamily={FONT} fontWeight={800} fontSize={50}>HELADERA</text>
        <g opacity={side}><line x1={fx - 80} x2={fx} y1={fy + 210} y2={fy + 210} stroke={C.ice} strokeWidth={4} strokeDasharray="10 8" /><line x1={fx + 400} x2={fx + 480} y1={fy + 210} y2={fy + 210} stroke={C.ice} strokeWidth={4} strokeDasharray="10 8" /></g>
        <line x1={fx + 470} x2={fx + 470} y1={300} y2={fy} stroke={C.ok} strokeWidth={5} />
        <g transform={`translate(${fx + 200},${300 + gap / 2}) scale(${0.8 * hand})`} opacity={cl(hand * 2)}>
          <path d="M-150,-30 Q-160,0 -150,30 L60,40 Q90,42 110,30 L170,20 Q182,0 170,-20 L110,-30 Q90,-42 60,-40 Z" fill="#e7c6a5" />
          {[-28, -10, 8, 26].map((dy, i) => <rect key={i} x={160} y={dy - 7} width={70 - Math.abs(i - 1.5) * 10} height={15} rx={7} fill="#e7c6a5" />)}
        </g>
      </Svg>
      <Pop t={t} at={a + 0.6} x={1290} y={300 + gap / 2}><Big size={70} col={C.ok}>10 cm</Big></Pop>
      <Lbl t={t} at={m.cinco + 0.4} text="5 cm a cada costado" x={960} y={950} col={C.ice} size={56} />
      <Lbl t={t} at={m.mano + 0.4} text="una mano abierta" x={1450} y={190} col={C.ink} size={56} />
    </>
  );
};

// 16 · los vecinos: horno, sol de la ventana, mueble encima; cada uno le tira calor a la heladera
export const Vecinos: React.FC<FxP> = ({ t, a, m }) => {
  const src = [{ k: m.horno, x: 360, y: 560, w: "horno" }, { k: m.sol, x: 1560, y: 400, w: "sol de la tarde" }, { k: m.mueble, x: 960, y: 150, w: "mueble encima" }];
  return (
    <>
      <Svg>
        <rect x={810} y={300} width={300} height={560} rx={24} fill="rgba(214,241,255,.08)" stroke={C.ice2} strokeWidth={4} />
        <rect x={250} y={480} width={240} height={380} rx={14} fill="#2a2f35" stroke="#59616a" strokeWidth={3} /><rect x={285} y={600} width={170} height={110} rx={10} fill={`rgba(255,120,40,${0.3 + 0.2 * Math.sin(t * 5)})`} />
        <rect x={1460} y={260} width={220} height={300} fill="rgba(255,220,120,.12)" stroke="#ffd56a" strokeWidth={4} /><circle cx={1640} cy={210} r={56} fill="#ffd56a" opacity={cl((t - m.sol) * 3)} />
        <rect x={760} y={170} width={400} height={110} rx={10} fill="#5b3f2a" opacity={cl((t - m.mueble) * 3)} />
        {src.map((s, i) => t < s.k ? null : Array.from({ length: 4 }, (_, j) => {
          const u = ((t - s.k) * 0.8 + j / 4) % 1, tx = lerp(s.x, 960, u), ty = lerp(s.y, 560, u);
          return <circle key={i + "-" + j} cx={tx} cy={ty} r={16} fill={C.heat} opacity={(1 - u) * 0.85} />;
        }))}
      </Svg>
      {src.map((s, i) => <Lbl key={i} t={t} at={s.k + 0.2} text={s.w} x={i === 2 ? 1300 : s.x} y={i === 2 ? 130 : s.y + (i === 0 ? 360 : 360)} col={C.heat2} size={52} />)}
    </>
  );
};

// 17 · la bandejita arriba del motor: gotas que caen, vapor que sube; después barro negro y rebalse al piso
export const Bandejita: React.FC<FxP> = ({ t, a, b, m }) => {
  const mud = e(t, m.barro, m.barro + 2), over = e(t, m.barro + 1.6, b - 0.6);
  return (
    <>
      <Svg>
        <circle cx={960} cy={760} r={170} fill="#1a2128" stroke="#4d5862" strokeWidth={4} />
        <path d="M720,560 L1200,560 L1170,620 L750,620 Z" fill="rgba(214,241,255,.18)" stroke={C.ice2} strokeWidth={4} />
        <path d={`M752,${618 - 50 * (0.3 + 0.7 * mud)} L1168,${618 - 50 * (0.3 + 0.7 * mud)} L1168,618 L752,618 Z`} fill={mud > 0.3 ? `rgba(40,30,20,${0.6 + 0.3 * mud})` : "rgba(127,211,255,.5)"} />
        {Array.from({ length: 5 }, (_, i) => { const u = ((t - a) * 0.9 + i / 5) % 1; return <ellipse key={"g" + i} cx={960 + (i - 2) * 30} cy={lerp(200, 560, u)} rx={8} ry={13} fill={C.ice} opacity={0.85} />; })}
        {t > m.evap && Array.from({ length: 8 }, (_, i) => { const u = ((t - m.evap) * 0.5 + i / 8) % 1; return <path key={"v" + i} d={`M${800 + i * 50},${560 - u * 220} q 14,-20 0,-40`} stroke="rgba(255,255,255,.55)" strokeWidth={6} fill="none" opacity={(1 - u) * (1 - mud)} />; })}
        <ellipse cx={1240} cy={960} rx={260 * over} ry={36 * over} fill="rgba(127,211,255,.35)" />
        <path d={`M1170,600 Q1220,${lerp(600, 940, over)} 1240,${lerp(600, 950, over)}`} stroke="rgba(127,211,255,.6)" strokeWidth={10} fill="none" opacity={over > 0.02 ? 1 : 0} />
      </Svg>
      <Lbl t={t} at={a + 0.3} text="la bandejita" x={960} y={480} col={C.ice2} size={64} />
      <Lbl t={t} at={m.evap + 0.4} out={m.barro} text="el motor la evapora" x={960} y={1010} col={C.heat2} size={52} />
      <Lbl t={t} at={m.barro + 0.4} text="barro y rebalse" x={580} y={1000} col={C.red} size={58} />
      <Txt size={30} col={C.dim} style={{ position: "absolute", left: 1150, top: 740 }}>compresor</Txt>
    </>
  );
};

// 18 · la prueba del papel: corte de la puerta, el burlete aprieta (o no) la hoja y la mano tira
export const PapelBurlete: React.FC<FxP> = ({ t, a, m }) => {
  const pull = t < m.suelta ? e(t, m.tira, m.tira + 1.2) * 0.25 : t < m.firme ? 0.25 + 0.75 * e(t, m.suelta, m.suelta + 0.6) : lerp(0, 0.12, Math.sin((t - m.firme) * 6) * 0.5 + 0.5);
  const squeeze = t >= m.firme ? 1 : 0.15, lados = e(t, m.lados, m.lados + 2.4);
  return (
    <>
      <Svg>
        <rect x={420} y={240} width={360} height={600} fill="rgba(214,241,255,.08)" stroke={C.edge} strokeWidth={3} />
        <rect x={780 + 30 * (1 - squeeze)} y={240} width={300} height={600} fill="rgba(214,241,255,.12)" stroke={C.edge} strokeWidth={3} />
        <path d={`M780,500 q ${-10 + 26 * squeeze},40 0,80 q ${-10 + 26 * squeeze},40 0,80`} stroke="#d8dde2" strokeWidth={34} fill="none" strokeLinecap="round" />
        <rect x={lerp(640, 1500, pull)} y={560} width={560} height={14} fill="#f6f2e6" />
        <g transform={`translate(${lerp(1200, 1880, pull)},567)`}><ellipse rx={70} ry={46} fill="#e7c6a5" /></g>
        {t > m.firme && t < m.lados && <text x={1180} y={500} fill={C.ok} fontFamily={FONT} fontWeight={800} fontSize={60}>RESISTE</text>}
        <g transform="translate(1500,260)" opacity={lados}><rect width={300} height={460} rx={16} fill="none" stroke={C.ice} strokeWidth={6} />{[0, 1, 2, 3].map((s) => <circle key={s} cx={[150, 300, 150, 0][s]} cy={[0, 230, 460, 230][s]} r={22} fill={e(t, m.lados + s * 0.5, m.lados + s * 0.5 + 0.3) > 0.5 ? C.ok : "rgba(255,255,255,.2)"} />)}</g>
      </Svg>
      <Cross t={t} at={m.suelta + 0.4} x={620} y={950} r={40} />
      <Lbl t={t} at={m.suelta + 0.3} out={m.firme} text="sale sola: no aprieta" x={1060} y={950} col={C.red} size={56} />
      <Lbl t={t} at={m.firme + 0.3} text="hace fuerza: está bien" x={1060} y={950} col={C.ok} size={56} />
      <Lbl t={t} at={m.lados + 0.3} text="los cuatro lados" x={1650} y={800} col={C.ice} size={48} />
    </>
  );
};

// 19 · la goma tiene memoria: perfil de fuelle aplastado que el secador vuelve a inflar
export const GomaMemoria: React.FC<FxP> = ({ t, a, m }) => {
  const inf = e(t, m.infla - 0.3, m.infla + 2.5), heat = e(t, m.sec, m.sec + 0.6) * (1 - e(t, m.media, m.media + 0.5));
  const h = lerp(40, 150, inf), P = `M600,560 C 700,${560 - h} 800,${560 - h} 900,560 C 1000,${560 + h} 1100,${560 + h} 1200,560 C 1260,${560 - h * 0.8} 1320,${560 - h * 0.8} 1360,560`;
  return (
    <>
      <Svg>
        <path d={P} stroke="#e4e8eb" strokeWidth={60} fill="none" strokeLinecap="round" />
        <path d={P} stroke={`rgba(255,154,60,${0.55 * heat})`} strokeWidth={66} fill="none" strokeLinecap="round" />
        <g transform="translate(1560,330)" opacity={cl((t - m.sec) * 3)}><rect x={-60} y={-60} width={240} height={120} rx={50} fill="#3a4148" /><rect x={-150} y={-36} width={100} height={72} rx={14} fill="#2b3036" /><rect x={60} y={50} width={60} height={160} rx={20} fill="#3a4148" /></g>
        {heat > 0 && Array.from({ length: 7 }, (_, i) => { const u = (t * 1.3 + i / 7) % 1; return <path key={i} d={`M${1400 - u * 320},${330 + u * 180 + (i - 3) * 16} q -20,-10 -40,0`} stroke={C.heat} strokeWidth={6} fill="none" opacity={(1 - u) * heat} />; })}
      </Svg>
      <Lbl t={t} at={a + 0.3} text="la goma tiene memoria" x={960} y={860} size={70} />
      <Pop t={t} at={m.media} x={960} y={250}><Big size={96} col={C.ice}>30 min cerrada</Big></Pop>
    </>
  );
};

// 20 · vaselina, no: la gota de aceite ablanda y la goma se raja con los meses
export const Vaselina: React.FC<FxP> = ({ t, a, b, m }) => {
  const drop = e(t, a + 0.2, a + 1.2), crack = e(t, m.ablanda + 0.6, b - 0.6), mes = Math.floor(lerp(0, 8, crack));
  return (
    <>
      <Svg>
        <rect x={460} y={500} width={1000} height={90} rx={45} fill="#e4e8eb" />
        <ellipse cx={960} cy={lerp(200, 500, drop)} rx={30} ry={42} fill="#e8c766" opacity={drop < 1 ? 1 : 0} />
        <ellipse cx={960} cy={545} rx={260 * drop} ry={40} fill="rgba(232,199,102,.4)" />
        {Array.from({ length: 9 }, (_, i) => { const x = 560 + i * 100 + hash(i, 1) * 40; return <Draw key={i} d={`M${x},500 l ${hash(i, 2) * 30 - 15},30 l ${hash(i, 3) * 30 - 15},30 l ${hash(i, 4) * 20 - 10},30`} p={cl(crack * 1.6 - i * 0.07)} col="#3a2a20" w={5} />; })}
      </Svg>
      <Pop t={t} at={m.ablanda + 0.6} x={960} y={330}><Big size={100} col={C.heat2}>{mes} meses</Big></Pop>
      <Lbl t={t} at={a + 0.3} text="vaselina o aceite: no" x={960} y={760} col={C.red} size={66} />
    </>
  );
};

// 21 · el nivel: la heladera de perfil se inclina apenas atrás, la burbuja se corre, la puerta se cierra sola
export const Nivel: React.FC<FxP> = ({ t, a, b, m }) => {
  const tilt = t < m.recta ? -1.6 * spr(t, a + 0.4, 0.7) : lerp(-1.6, 0, e(t, m.recta, m.recta + 0.8)) + (t > b - 2.4 ? -1.6 * spr(t, b - 2.4, 0.7) : 0);
  const door = t > m.recta && t < b - 2.4 ? 0.35 : 0.35 * (1 - e(t, a + 1.2, a + 3.2));
  const bub = lerp(0, -1, -tilt / 1.6);
  return (
    <>
      <Svg>
        <line x1={300} x2={1620} y1={900} y2={900} stroke={C.edge} strokeWidth={4} />
        <g transform={`rotate(${tilt} 1100 900)`}>
          <rect x={700} y={300} width={420} height={600} rx={20} fill="rgba(214,241,255,.08)" stroke={C.ice2} strokeWidth={4} />
          <line x1={1120} y1={320} x2={1120 + 380 * Math.sin(door * 1.6)} y2={320} stroke={C.ink} strokeWidth={10} />
          <line x1={1120} y1={880} x2={1120 + 380 * Math.sin(door * 1.6)} y2={880} stroke={C.ink} strokeWidth={10} />
          <rect x={760} y={240} width={300} height={56} rx={28} fill="rgba(200,255,120,.25)" stroke="#c8ff78" strokeWidth={4} />
          <circle cx={910 + bub * 70} cy={268} r={20} fill="#f6ffe8" />
          <line x1={880} x2={880} y1={244} y2={292} stroke="#c8ff78" strokeWidth={3} /><line x1={940} x2={940} y1={244} y2={292} stroke="#c8ff78" strokeWidth={3} />
        </g>
      </Svg>
      <Lbl t={t} at={m.burb + 0.2} text="apenas hacia atrás" x={910} y={170} col="#c8ff78" size={60} />
      <Lbl t={t} at={m.recta + 0.2} out={b - 2.4} text="recta no cierra" x={1450} y={560} col={C.red} size={56} />
      <Lbl t={t} at={b - 2.2} text="cierra sola" x={1450} y={560} col={C.ok} size={64} />
    </>
  );
};

// 22 · cuatro errores al cargar: cartas boca abajo, la primera se da vuelta (la olla caliente)
export const Carga: React.FC<FxP> = ({ t, a, m }) => {
  const W = ["olla caliente", "hasta el techo", "rejillas tapadas", "vacía"];
  return (
    <>
      {W.map((w, i) => {
        const inn = spr(t, a + 0.2 + i * 0.15, 1.1), flip = i === 0 ? e(t, m.e1, m.e1 + 0.6) : 0, rot = flip * 180;
        return (
          <div key={i} style={{ position: "absolute", left: 230 + i * 380, top: 330, width: 320, height: 420, perspective: 1200, opacity: cl(inn * 2), transform: `translateY(${(1 - inn) * 200}px)` }}>
            <div style={{ position: "absolute", inset: 0, transform: `rotateY(${rot}deg)`, transformStyle: "preserve-3d" }}>
              <div style={{ position: "absolute", inset: 0, ...glass(), backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: "rgba(214,241,255,.45)" }}>{i + 1}</div>
              <div style={{ position: "absolute", inset: 0, ...glass(), border: `3px solid ${C.heat}`, backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <svg width={200} height={170}><path d="M30,70 L170,70 L160,150 L40,150 Z" fill="#6c757d" /><rect x={20} y={60} width={160} height={14} rx={7} fill="#868e96" />{[0, 1, 2].map((k) => { const u = (t * 0.8 + k / 3) % 1; return <path key={k} d={`M${70 + k * 30},${55 - u * 50} q 12,-14 0,-28`} stroke={C.heat} strokeWidth={6} fill="none" opacity={1 - u} />; })}</svg>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.heat, textTransform: "uppercase" }}>{w}</div>
              </div>
            </div>
          </div>
        );
      })}
      <Lbl t={t} at={a + 0.5} text="cuatro errores al cargar" x={960} y={870} size={64} />
    </>
  );
};

// 23 · el agua como batería: botellas que se cargan de frío; la puerta abre y descarga menos
export const BateriaAgua: React.FC<FxP> = ({ t, a }) => (
  <>
    <Svg>
      {[0, 1, 2].map((i) => {
        const x = 600 + i * 360, ch = e(t, a + 0.4 + i * 0.3, a + 2.4 + i * 0.3);
        return <g key={i}><rect x={x - 70} y={300} width={140} height={480} rx={40} fill="rgba(214,241,255,.08)" stroke={C.ice2} strokeWidth={4} /><rect x={x - 30} y={262} width={60} height={44} rx={10} fill={C.ice2} />
          <rect x={x - 56} y={300 + 466 * (1 - ch)} width={112} height={466 * ch} rx={30} fill="rgba(127,211,255,.55)" />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={x - 40} y={700 - k * 110} width={80} height={80} rx={10} fill={ch > (k + 1) / 4 ? C.ice : "rgba(255,255,255,.07)"} opacity={0.9} />)}</g>;
      })}
    </Svg>
    <Lbl t={t} at={a + 0.4} text="guarda el frío" x={960} y={890} col={C.ice} size={76} />
  </>
);

// 24 · el abrigo de hielo: corte de la pared del congelador; regla de medio centímetro; el frío choca contra el hielo
export const AbrigoHielo: React.FC<FxP> = ({ t, a, m }) => {
  const ice = e(t, a + 0.3, m.medio + 1.2) * 1 + e(t, m.aisl, m.aisl + 2) * 0.6;
  return (
    <>
      <Svg>
        <rect x={300} y={200} width={160} height={700} fill="#2a3138" />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={380} cy={260 + i * 115} r={22} fill="#b87333" />)}
        <rect x={460} y={200} width={ice * 180} height={700} fill="rgba(240,250,255,.75)" />
        {Array.from({ length: 6 }, (_, i) => { const u = (t * 0.6 + i / 6) % 1, stop = 460 + ice * 180 + 10, x = lerp(400, 1600, u), xx = ice > 0.8 ? Math.min(x, stop + 40) : x; return <circle key={"c" + i} cx={xx} cy={260 + i * 115} r={14} fill={C.ice} opacity={ice > 0.8 && x > stop ? 0.15 : 0.85} />; })}
        <g opacity={e(t, m.medio - 0.2, m.medio + 0.4)}><line x1={460} x2={640} y1={940} y2={940} stroke={C.ink} strokeWidth={4} /><line x1={460} x2={460} y1={920} y2={960} stroke={C.ink} strokeWidth={4} /><line x1={640} x2={640} y1={920} y2={960} stroke={C.ink} strokeWidth={4} /></g>
        <g transform="translate(1300,560)" opacity={cl((t - m.abrigo) * 3)}><path d="M-120,-160 L-60,-200 L0,-170 L60,-200 L120,-160 L150,120 L-150,120 Z" fill="rgba(240,250,255,.85)" /><path d="M0,-170 L0,120" stroke="#9cc" strokeWidth={6} /></g>
      </Svg>
      <Pop t={t} at={m.medio} x={550} y={1010}><Big size={64} col={C.ink}>½ cm</Big></Pop>
      <Lbl t={t} at={m.aisl + 0.2} text="el hielo aísla" x={1300} y={300} col={C.ice2} size={70} />
      <Lbl t={t} at={m.abrigo + 0.2} text="un abrigo" x={1300} y={820} col={C.ink} size={70} />
    </>
  );
};

// 25 · la olla de agua caliente adentro del congelador: vapor y placas de hielo que se despegan y caen
export const OllaVapor: React.FC<FxP> = ({ t, a, b, m }) => {
  const clk = e(t, m.diez - 1.5, m.diez + 0.2), drop = (i: number) => { const t0 = m.diez + 0.3 + i * 0.35, u = cl((t - t0) / 0.7); return u * u; };
  return (
    <>
      <Svg>
        <rect x={560} y={160} width={800} height={720} rx={20} fill="rgba(214,241,255,.06)" stroke={C.edge} strokeWidth={3} />
        {Array.from({ length: 6 }, (_, i) => { const x = 590 + i * 125, dy = drop(i) * 560; return <path key={i} d={`M${x},190 L${x + 110},190 L${x + 100},${250} L${x + 20},${262} Z`} fill="rgba(240,250,255,.85)" transform={`translate(0,${dy}) rotate(${drop(i) * (i % 2 ? 20 : -20)} ${x + 55} 220)`} />; })}
        <path d="M800,820 L1120,820 L1100,700 L820,700 Z" fill="#69737c" /><rect x={790} y={690} width={340} height={20} rx={10} fill="#8a949d" />
        {Array.from({ length: 12 }, (_, i) => { const u = (t * 0.45 + i / 12) % 1; return <circle key={i} cx={830 + hash(i, 3) * 260 + Math.sin(u * 6 + i) * 30} cy={690 - u * 460} r={18 + u * 40} fill="rgba(255,255,255,.18)" opacity={(1 - u) * cl((t - m.cierra) * 2)} />; })}
        <circle cx={1560} cy={300} r={90} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={14} /><circle cx={1560} cy={300} r={90} fill="none" stroke={C.heat} strokeWidth={14} pathLength={1} strokeDasharray={`${clk} 1`} transform="rotate(-90 1560 300)" />
      </Svg>
      <Pop t={t} at={m.diez - 1.5} x={1560} y={300}><Big size={64}>10'</Big></Pop>
      <Lbl t={t} at={m.vapor} text="el vapor trabaja" x={960} y={960} col={C.ink} size={66} />
    </>
  );
};

// 26 · nunca el cuchillo: corte de la pared con el caño a 2 mm; la punta baja, pincha, escapa el gas
export const CuchilloX: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, m.golpe - 0.6, m.golpe), leak = cl((t - m.golpe) / 1.4), sh = shake(t, m.golpe, 12);
  return (
    <>
      <Svg style={{ transform: `translateX(${sh}px)` }}>
        <rect x={300} y={600} width={1320} height={260} fill="#d9dee2" />
        <rect x={300} y={600} width={1320} height={30} fill="rgba(240,250,255,.85)" />
        <circle cx={960} cy={668} r={30} fill="#b87333" opacity={cl((t - m.canos) * 3)} /><circle cx={620} cy={668} r={30} fill="#b87333" opacity={cl((t - m.canos) * 3)} /><circle cx={1300} cy={668} r={30} fill="#b87333" opacity={cl((t - m.canos) * 3)} />
        <g transform={`translate(960,${lerp(150, 615, k)}) rotate(8)`}><path d="M-22,-320 L22,-320 L22,-60 L0,0 L-22,-60 Z" fill="#cfd6dc" /><rect x={-30} y={-460} width={60} height={150} rx={14} fill="#2b2b2b" /></g>
        {leak > 0 && Array.from({ length: 16 }, (_, i) => { const u = (leak + i / 16) % 1; return <circle key={i} cx={960 + (hash(i, 1) - 0.5) * 300 * u} cy={630 - u * 300} r={10 + 30 * u} fill="rgba(200,230,255,.35)" opacity={1 - u} />; })}
      </Svg>
      <Pop t={t} at={m.dos} x={1380} y={520}><Big size={80} col="#ffd56a">2 mm</Big></Pop>
      <Lbl t={t} at={a + 0.2} text="nunca un cuchillo" x={960} y={960} col={C.red} size={80} plate="rgba(30,6,6,.55)" />
      <Lbl t={t} at={m.golpe + 0.5} text="sin arreglo barato" x={1450} y={300} col={C.ink} size={56} />
    </>
  );
};

// 27 · el agujerito de desagote: tres herramientas y la jeringa que empuja agua tibia por el caño hasta la bandejita
export const Jeringa: React.FC<FxP> = ({ t, a, m }) => {
  const push = e(t, m.jer + 0.4, m.baja + 0.5), flow = e(t, m.baja - 0.4, m.baja + 2);
  const tools = [["hisopo", m.hisopo, 520], ["sorbete", m.sorbete, 960], ["jeringa", m.jer, 1400]] as const;
  return (
    <>
      <Svg>
        <path d="M300,520 L1000,520 Q1060,520 1060,580 L1060,860 L1500,860" stroke="rgba(214,241,255,.35)" strokeWidth={36} fill="none" strokeLinejoin="round" />
        <Draw d="M300,520 L1000,520 Q1060,520 1060,580 L1060,860 L1500,860" p={flow} col="rgba(127,211,255,.9)" w={22} />
        <path d="M1460,900 L1740,900 L1720,960 L1480,960 Z" fill="rgba(214,241,255,.2)" stroke={C.ice2} strokeWidth={3} />
        <g transform="translate(160,520)" opacity={cl((t - m.jer) * 3)}><rect x={-140} y={-34} width={260} height={68} rx={12} fill="rgba(214,241,255,.25)" stroke={C.ice2} strokeWidth={4} /><rect x={-140 + 200 * push} y={-30} width={22} height={60} fill={C.ink} /><rect x={-300 + 200 * push} y={-8} width={170} height={16} fill={C.ink} /><rect x={-140 + 200 * push} y={-30} width={260 - 200 * push} height={60} fill="rgba(127,211,255,.55)" /></g>
      </Svg>
      {tools.map(([w, at, x]) => <Lbl key={w} t={t} at={at} text={w} x={x} y={300} col={w === "jeringa" ? C.ice : C.dim} size={60} />)}
      <Lbl t={t} at={m.baja + 0.6} text="agua tibia y bicarbonato" x={700} y={960} col={C.ice2} size={52} />
    </>
  );
};

// 28 · los cinco errores: fichas de dominó que caen una sobre otra y destapan cada error
export const CincoErrores: React.FC<FxP> = ({ t, a, m }) => {
  const E = [["perilla al máximo", m.e1], ["pegada a la pared", m.e2], ["puerta abierta mirando", m.e3], ["apagar y prender", m.e4], ["zapatilla y alargue", m.e5]] as const;
  return (
    <>
      <Svg>
        <line x1={160} x2={1760} y1={760} y2={760} stroke={C.edge} strokeWidth={3} />
        {E.map(([w, at], i) => { const f = e(t, at - 0.1, at + 0.5), x = 300 + i * 320; return <g key={i} transform={`rotate(${f * 72} ${x + 60} 760)`}><rect x={x} y={420} width={60} height={340} rx={10} fill={f > 0.5 ? "rgba(255,75,62,.35)" : "rgba(214,241,255,.12)"} stroke={f > 0.5 ? C.red : C.edge} strokeWidth={3} /><circle cx={x + 30} cy={510} r={10} fill={C.ink} /><circle cx={x + 30} cy={670} r={10} fill={C.ink} /><text x={x + 30} y={600} textAnchor="middle" fill={C.ink} fontFamily={FONT} fontWeight={800} fontSize={44}>{i + 1}</text></g>; })}
      </Svg>
      {E.map(([w, at], i) => { const nx = E[i + 1]?.[1] ?? 1e9; return <Lbl key={i} t={t} at={at + 0.4} out={nx} text={w} x={960} y={930} col={C.heat2} size={72} />; })}
    </>
  );
};

// 29 · la zapatilla: cada aparato que se enchufa baja la aguja de tensión de la heladera
export const Zapatilla: React.FC<FxP> = ({ t, a, m }) => {
  const n = (t > a + 0.8 ? 1 : 0) + (t > m.micro ? 1 : 0) + (t > m.micro + 0.9 ? 1 : 0), v = 220 - n * 18 - (t > m.arranca ? 24 * (0.5 + 0.5 * Math.sin(t * 8)) : 0);
  return (
    <>
      <Svg>
        <rect x={360} y={760} width={900} height={110} rx={30} fill="#eef1f3" />
        {Array.from({ length: 4 }, (_, i) => <g key={i}><circle cx={470 + i * 220} cy={815} r={34} fill="#cfd5da" /><rect x={450 + i * 220} y={810 - 220 * (i <= n ? 1 : 0)} width={40} height={0} /></g>)}
        {["heladera", "microondas", "pava", "tostadora"].map((w, i) => i < 1 || i <= n ? <g key={w} transform={`translate(${470 + i * 220},${700 - 20 * spr(t, i ? (i === 1 ? m.micro : m.micro + 0.9 * (i - 1)) : a + 0.2)})`}><path d={`M0,90 C 0,40 ${i * 10},0 0,-40`} stroke="#d9d9d9" strokeWidth={10} fill="none" /><rect x={-70} y={-130} width={140} height={90} rx={14} fill={i ? "#59616a" : "rgba(214,241,255,.25)"} stroke={i ? "#7c858e" : C.ice2} strokeWidth={3} /><text y={-160} textAnchor="middle" fill={C.dim} fontFamily={FONT} fontWeight={700} fontSize={30}>{w.toUpperCase()}</text></g> : null)}
        <path d="M 1360 700 A 220 220 0 0 1 1800 700" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={26} />
        <g transform={`translate(1580,700) rotate(${lerp(-80, 80, (v - 150) / 80)})`}><rect x={-6} y={-200} width={12} height={200} rx={6} fill={v < 190 ? C.red : C.ok} /><circle r={20} fill={C.ink} /></g>
      </Svg>
      <Pop t={t} at={a + 0.4} x={1580} y={790}><Big size={70} col={v < 190 ? C.red : C.ink}>{Math.round(v)} V</Big></Pop>
      <Lbl t={t} at={m.arranca + 0.3} text="le falta fuerza" x={1580} y={360} col={C.red} size={60} />
    </>
  );
};
