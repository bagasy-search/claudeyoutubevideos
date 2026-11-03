// cl2heladera · componentes 0:39 → 8:10 (promesa, intro, medir, perilla, dos etapas, parrilla). Cada uno: f(t) puro, marcas de fx.json.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";

// 1 · dos fallas: dos vitrinas que se acercan; termómetro que sube y anillo de motor que no corta
export const DosFallas: React.FC<FxP> = ({ t, a, b, m }) => {
  const L = spr(t, m.enf - 0.2), R = spr(t, m.apa - 0.2), j = e(t, b - 2.6, b - 1.4);
  const card = (x: number, p: number, ch: React.ReactNode) => <div style={{ position: "absolute", left: x, top: 210, width: 600, height: 560, ...glass(), opacity: cl(p * 1.4), transform: `translateY(${(1 - p) * 120}px)` }}>{ch}</div>;
  const merc = 0.25 + 0.6 * e(t, m.enf, m.enf + 4);
  return (
    <>
      {card(lerp(250, 380, j), L, <Svg style={{ left: 0, top: 0 }}><rect x={270} y={70} width={60} height={380} rx={30} fill="rgba(255,255,255,.08)" stroke={C.edge} strokeWidth={3} /><rect x={282} y={70 + 380 * (1 - merc)} width={36} height={380 * merc - 12} rx={18} fill={lerp(0, 1, merc) > 0.6 ? C.heat : C.ice} /><circle cx={300} cy={470} r={44} fill={merc > 0.6 ? C.heat : C.ice} /></Svg>)}
      {card(lerp(1070, 940, j), R, <Svg><circle cx={300} cy={260} r={150} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={26} /><circle cx={300} cy={260} r={150} fill="none" stroke={C.heat} strokeWidth={26} strokeDasharray={`${2 * Math.PI * 150 * 0.28} ${2 * Math.PI * 150}`} transform={`rotate(${(t - m.apa) * 240} 300 260)`} strokeLinecap="round" /><text x={300} y={285} textAnchor="middle" fill={C.ink} fontFamily={FONT} fontWeight={800} fontSize={74}>ON</text></Svg>)}
      <Lbl t={t} at={m.enf + 0.3} text="no enfría" x={lerp(550, 680, j)} y={850} col={C.ice} />
      <Lbl t={t} at={m.apa + 0.3} text="no se apaga" x={lerp(1370, 1240, j)} y={850} col={C.heat} />
      <Pop t={t} at={b - 1.6} x={960} y={490}><Big size={150} col={C.ink}>≈</Big></Pop>
    </>
  );
};

// 2 · diecisiete escalones: del gratis al repuesto
export const Diecisiete: React.FC<FxP> = ({ t, a, m }) => (
  <>
    <Svg>
      {Array.from({ length: 17 }, (_, i) => {
        const p = spr(t, a + 0.25 + i * 0.12, 1.2), x = 190 + i * 92, h = 70 + i * 26, y = 860 - h, k = i / 16;
        const col = `rgb(${Math.round(lerp(125, 255, k))},${Math.round(lerp(255, 154, k))},${Math.round(lerp(155, 60, k))})`;
        return <g key={i} transform={`translate(0,${(1 - p) * 300})`} opacity={cl(p * 2)}><rect x={x} y={y} width={80} height={h} rx={10} fill={col} opacity={0.22} stroke={col} strokeWidth={3} /><text x={x + 40} y={y + 50} textAnchor="middle" fill={C.ink} fontFamily={FONT} fontWeight={800} fontSize={40}>{i + 1}</text></g>;
      })}
    </Svg>
    <Lbl t={t} at={m.gratis} text="gratis · cinco minutos" x={520} y={930} col={C.ok} size={58} />
    <Lbl t={t} at={m.rep} text="con repuesto" x={1560} y={300} col={C.heat} size={64} />
    <Lbl t={t} at={a + 0.5} text="17 cosas, en orden" x={1180} y={170} size={72} />
  </>
);

// 3 · más de cien comentarios: globos que caen y se apilan; un contador; la mitad queda igual
export const CienComentarios: React.FC<FxP> = ({ t, m }) => {
  const n = Math.floor(118 * e(t, m.cien - 0.3, m.cien + 2.2));
  return (
    <>
      <Svg>
        {Array.from({ length: n }, (_, i) => {
          const tt = m.cien - 0.3 + (i / 118) * 2.5, u = cl((t - tt) / 0.5), fall = 1 - (1 - u) * (1 - u);
          const col = i % 12, row = Math.floor(i / 12), x = 280 + col * 74 + (row % 2) * 30, y = 900 - row * 52;
          const half = i % 2 === 0 && t > m.mitad;
          return <g key={i} transform={`translate(${x},${lerp(-120, y, fall)})`}><rect x={-30} y={-20} width={60} height={40} rx={12} fill={half ? "rgba(255,75,62,.55)" : "rgba(214,241,255,.22)"} stroke={half ? C.red : C.edge} strokeWidth={2} /><path d="M-12,20 L-4,32 L4,20" fill={half ? "rgba(255,75,62,.55)" : "rgba(214,241,255,.22)"} /></g>;
        })}
      </Svg>
      <Pop t={t} at={m.cien} x={1500} y={420}><Big size={210}>+{n}</Big></Pop>
      <Lbl t={t} at={m.cien + 0.4} text="comentarios" x={1500} y={560} col={C.dim} size={62} />
      <Lbl t={t} at={m.mitad + 0.2} text="la mitad, igual que antes" x={1500} y={700} col={C.red} size={56} />
    </>
  );
};

// 4 · la regla: el enchufe sale de la pared (no la perilla)
export const ReglaEnchufe: React.FC<FxP> = ({ t, a, m }) => {
  const out = spr(t, m.pared, 0.9), px = 1230 - 330 * out, zz = t > m.v220 ? 0.5 + 0.5 * Math.sin(t * 22) : 0;
  return (
    <>
      <Svg>
        <rect x={1300} y={300} width={300} height={380} rx={36} fill="#e8ecef" opacity={0.92} />
        <circle cx={1415} cy={490} r={20} fill="#2a3138" /><circle cx={1485} cy={490} r={20} fill="#2a3138" />
        <path d={`M${px - 260},900 C ${px - 300},700 ${px - 200},490 ${px - 110},490`} stroke="#d9d9d9" strokeWidth={22} fill="none" />
        <rect x={px - 120} y={430} width={150} height={120} rx={22} fill="#f5f5f5" />
        <rect x={px + 30} y={472} width={70} height={14} rx={6} fill="#b9c0c6" opacity={1 - out} /><rect x={px + 30} y={496} width={70} height={14} rx={6} fill="#b9c0c6" opacity={1 - out} />
        {out > 0.3 && <><rect x={px + 30} y={472} width={70} height={14} rx={6} fill="#b9c0c6" /><rect x={px + 30} y={496} width={70} height={14} rx={6} fill="#b9c0c6" /></>}
        <g opacity={zz * (1 - out)} transform="translate(1450,250)"><path d="M0,-70 L-34,10 L-4,10 L-22,80 L40,-14 L8,-14 L28,-70 Z" fill="#ffd84a" /></g>
        <g transform="translate(560,470)" opacity={cl((t - m.perilla) * 5)}>
          <circle r={110} fill="rgba(255,255,255,.08)" stroke={C.edge} strokeWidth={4} /><rect x={-14} y={-100} width={28} height={80} rx={12} fill={C.ink} transform={`rotate(${-60 + 60 * e(t, m.perilla, m.perilla + 0.8)})`} />
        </g>
        <Cross t={t} at={m.perilla + 0.6} x={560} y={470} r={130} />
      </Svg>
      <Lbl t={t} at={m.perilla + 0.4} text="la perilla, no" x={560} y={700} col={C.red} />
      <Lbl t={t} at={m.pared + 0.1} text="desenchufada" x={1240} y={820} col={C.ok} size={84} />
      <Pop t={t} at={m.v220} x={1450} y={170}><Big size={84} col="#ffd84a">220 V</Big></Pop>
    </>
  );
};

// 5 · el gas no se toca: tres sellos que caen sobre el caño
export const GasNo: React.FC<FxP> = ({ t, m }) => {
  const st = [["cargar", m.carga, 520], ["pinchar", m.pincha, 960], ["soldar", m.suelda, 1400]] as const;
  return (
    <>
      <Svg>
        <path d="M120,560 L1800,560" stroke="#b87333" strokeWidth={44} strokeLinecap="round" />
        <path d="M120,548 L1800,548" stroke="rgba(255,220,180,.5)" strokeWidth={6} />
      </Svg>
      {st.map(([w, at, x]) => {
        const p = cl((t - at) / 0.22), s = lerp(2.4, 1, p * p), dx = shake(t, at + 0.22, 10);
        return t < at ? null : (
          <div key={w} style={{ position: "absolute", left: x + dx, top: 420, transform: `translate(-50%,-50%) scale(${s}) rotate(-8deg)`, opacity: cl(p * 3), fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.red, border: `7px solid ${C.red}`, borderRadius: 14, padding: "4px 26px 0", textTransform: "uppercase", background: "rgba(40,6,6,.35)" }}>
            <span style={{ textDecoration: "line-through", textDecorationThickness: 8 }}>{w}</span>
          </div>
        );
      })}
      <Lbl t={t} at={m.mat} text="sólo un matriculado" x={960} y={780} col={C.ink} size={70} plate="rgba(14,34,52,.7)" />
    </>
  );
};

// 6 · el vaso en el estante del medio (corte de frente) + 24 h + termómetro de pinchar
export const VasoMedio: React.FC<FxP> = ({ t, a, m }) => {
  const mv = spr(t, m.medio, 0.8), gx = lerp(960, 960, mv), gy = lerp(960, 560, mv), clk = e(t, m.dia, m.dia + 3.2), pr = spr(t, m.term, 1);
  return (
    <>
      <Svg>
        <rect x={660} y={120} width={600} height={860} rx={30} fill="rgba(214,241,255,.05)" stroke={C.edge} strokeWidth={3} />
        {[330, 620, 840].map((y) => <line key={y} x1={680} x2={1240} y1={y} y2={y} stroke="rgba(214,241,255,.5)" strokeWidth={4} />)}
        <rect x={1270} y={140} width={130} height={820} rx={18} fill="rgba(214,241,255,.04)" stroke="rgba(214,241,255,.35)" strokeWidth={2} />
        <Cross t={t} at={m.no} x={1335} y={500} r={46} /><Cross t={t} at={m.no + 0.9} x={960} y={190} r={40} />
        <g transform={`translate(${gx},${gy})`}>
          <path d="M-46,-110 L46,-110 L38,0 L-38,0 Z" fill="rgba(214,241,255,.12)" stroke={C.ice2} strokeWidth={4} />
          <path d="M-43,-58 L43,-58 L38,0 L-38,0 Z" fill="rgba(127,211,255,.45)" />
          {clk > 0 && <circle r={150} fill="none" stroke={C.ice} strokeWidth={8} pathLength={1} strokeDasharray={`${clk} 1`} transform="rotate(-90)" opacity={0.85} />}
          {pr > 0.01 && <g transform={`translate(0,${lerp(-420, -150, pr)})`}><rect x={-6} y={0} width={12} height={150} rx={6} fill="#cfd6dc" /><circle cx={0} cy={-26} r={30} fill="#f3f6f8" /><text y={-16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.night}>°C</text></g>}
        </g>
      </Svg>
      <Lbl t={t} at={m.medio + 0.4} text="el estante del medio" x={1560} y={760} col={C.ice} size={60} />
      <Pop t={t} at={m.dia} x={1560} y={560}><Big size={110} col={C.ink}>24 h</Big></Pop>
    </>
  );
};

// 7 · la lectura del vaso: columna de 0 a 12 °C con las dos zonas
export const LecturaVaso: React.FC<FxP> = ({ t, a, m }) => {
  const v = lerp(0, 4, spr(t, a + 0.2, 0.8)) + lerp(0, 4.5, spr(t, m.mal, 0.8)), Y = (c: number) => 900 - c * 62, bad = t > m.mal + 0.3;
  return (
    <>
      <Svg>
        <rect x={860} y={Y(3)} width={200} height={124} fill="rgba(125,255,155,.18)" /><rect x={860} y={Y(10)} width={200} height={186} fill="rgba(255,75,62,.16)" />
        <rect x={930} y={Y(12)} width={60} height={12 * 62} rx={30} fill="rgba(255,255,255,.06)" stroke={C.edge} strokeWidth={3} />
        <rect x={942} y={Y(v)} width={36} height={v * 62} rx={18} fill={bad ? C.red : C.ice} />
        {Array.from({ length: 13 }, (_, c) => <g key={c}><line x1={860} x2={900} y1={Y(c)} y2={Y(c)} stroke={C.edge} strokeWidth={3} /><text x={840} y={Y(c) + 12} textAnchor="end" fill={C.dim} fontFamily={FONT} fontWeight={700} fontSize={34}>{c}°</text></g>)}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="bien" x={1230} y={Y(4)} col={C.ok} align="left" size={90} />
      <Lbl t={t} at={m.mal + 0.4} text="problema" x={1230} y={Y(8.5)} col={C.red} align="left" size={90} />
      <Pop t={t} at={a + 0.3} x={600} y={820}><Big size={100} col={C.ice}>{num(t, a + 0.2, a + 1.2, 0, 4)}° → {num(t, m.mal, m.mal + 1, 4, 8)}°</Big></Pop>
    </>
  );
};

// 8 · por qué el agua: dos curvas de 24 h, el aire salta con cada puerta, el agua casi no se mueve
export const AireAgua: React.FC<FxP> = ({ t, a, m }) => {
  const X = (h: number) => 260 + h * 60, air = (h: number) => 4 + (Math.abs(((h * 1.7) % 5) - 0.4) < 0.35 ? 5.5 : 0) + 0.6 * Math.sin(h * 3), wat = (h: number) => 4 + 0.35 * Math.sin(h * 0.4);
  const path = (f: (h: number) => number) => Array.from({ length: 241 }, (_, i) => `${i ? "L" : "M"}${X(i / 10)},${820 - f(i / 10) * 50}`).join(" ");
  return (
    <>
      <Svg>
        <line x1={260} x2={1720} y1={820} y2={820} stroke={C.edge} strokeWidth={3} />
        <Draw d={path(air)} p={e(t, m.puerta - 0.3, m.puerta + 3)} col={C.heat} w={5} />
        <Draw d={path(wat)} p={e(t, m.agua, m.agua + 2.5)} col={C.ice} w={9} glow />
        {[0, 6, 12, 18, 24].map((h) => <text key={h} x={X(h)} y={870} textAnchor="middle" fill={C.dim} fontFamily={FONT} fontWeight={700} fontSize={32}>{h} h</text>)}
      </Svg>
      <Lbl t={t} at={m.puerta + 1} text="el aire te miente" x={1380} y={190} col={C.heat} size={66} />
      <Lbl t={t} at={m.agua + 1.2} text="el agua no" x={1380} y={965} col={C.ice} size={66} />
    </>
  );
};

// 9 · −18 en el freezer y el papelito con imán en la puerta
export const PapelIman: React.FC<FxP> = ({ t, a, m }) => {
  const sw = Math.sin((t - m.anota) * 3) * 8 * Math.exp(-(t - m.anota) * 0.9) * (t > m.anota && t < m.iman ? 1 : 0), drop = cl((t - m.iman) / 0.3), sh = shake(t, m.iman + 0.3, 6);
  return (
    <>
      <Pop t={t} at={a + 0.1} x={560} y={500}><Big size={230} col={C.ice}>−18°</Big></Pop>
      <Svg>
        <rect x={1050} y={110} width={640} height={880} rx={24} fill="rgba(230,226,212,.10)" stroke={C.edge} strokeWidth={3} />
        <g transform={`translate(${1370 + sh},${520}) rotate(${sw + 3})`} opacity={cl((t - m.anota) * 4)}>
          <rect x={-190} y={-230} width={380} height={460} fill="#f4efe1" />
          <Draw d="M-120,-90 L-60,-150 L-60,-10 M-130,-10 L0,-10" p={e(t, m.anota + 0.3, m.anota + 1.1)} col="#1d3557" w={10} />
          <Draw d="M40,-140 a35,35 0 1,0 0.1,0 M40,-80 L40,-80" p={e(t, m.anota + 0.8, m.anota + 1.4)} col="#1d3557" w={9} />
          <Draw d="M-130,110 L-50,110 M-10,40 L50,40 L-10,180 M-10,110 L60,110" p={e(t, m.anota + 1.3, m.anota + 2.2)} col="#1d3557" w={10} />
        </g>
        {t > m.iman - 0.1 && <circle cx={1370} cy={lerp(-80, 300, drop * drop)} r={46} fill="#e63946" stroke="#7a1e25" strokeWidth={6} />}
      </Svg>
      <Lbl t={t} at={m.iman + 0.35} text="pegado en la puerta" x={1370} y={1030} size={56} />
    </>
  );
};

// 10 · la perilla no es acelerador: velocímetro 1-7, contador de luz que corre al máximo, vuelve al medio
export const PerillaMedio: React.FC<FxP> = ({ t, a, m }) => {
  const k = t < m.medio ? lerp(0.5, 1, spr(t, m.max, 0.7)) : lerp(1, 0.5, spr(t, m.medio, 0.7)), ang = -120 + 240 * k * (6 / 6) - 0 + (k - 0.5) * 0;
  const kwh = num(t, m.max, m.medio, 1.1, 2.4, 1);
  return (
    <>
      <Svg>
        <path d="M 560 760 A 400 400 0 1 1 1360 760" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={40} strokeLinecap="round" />
        <path d="M 560 760 A 400 400 0 1 1 1360 760" fill="none" stroke={k > 0.8 ? C.heat : C.ice} strokeWidth={40} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
        {Array.from({ length: 7 }, (_, i) => { const q = ((-120 + i * 40) * Math.PI) / 180; return <text key={i} x={960 + Math.sin(q) * 300} y={620 - Math.cos(q) * 300 + 16} textAnchor="middle" fill={C.ink} fontFamily={FONT} fontWeight={800} fontSize={58}>{i + 1}</text>; })}
        <g transform={`translate(960,620) rotate(${-120 + 240 * k})`}><rect x={-10} y={-330} width={20} height={330} rx={10} fill={C.ink} /><circle r={36} fill={C.ink} /></g>
      </Svg>
      <Lbl t={t} at={m.acel} text="no es un acelerador" x={960} y={890} col={C.red} size={66} />
      <Lbl t={t} at={m.termo} out={m.medio} text="le dice cuándo cortar" x={960} y={970} col={C.ice} size={56} />
      <Pop t={t} at={m.max + 0.4} out={m.medio} x={1600} y={330}><Big size={90} col={C.heat}>{kwh} kWh</Big></Pop>
      <Lbl t={t} at={m.medio + 0.3} text="en el medio" x={960} y={970} col={C.ok} size={80} />
    </>
  );
};

// 11 · dos etapas: meses de "no se apaga" antes del "no enfría"; el técnico llega tarde
export const DosEtapas: React.FC<FxP> = ({ t, a, b, m }) => {
  const p1 = e(t, a, m.desp), p2 = e(t, m.desp, m.desp + 1.6), pin = spr(t, m.tec, 1.1);
  return (
    <>
      <Svg>
        <rect x={200} y={500} width={1100 * p1} height={70} rx={35} fill={C.heat} opacity={0.85} />
        <rect x={1310} y={500} width={410 * p2} height={70} rx={35} fill={C.red} opacity={0.85} />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={200 + i * 190} x2={200 + i * 190} y1={590} y2={612} stroke={C.edge} strokeWidth={3} />)}
        <g transform={`translate(1600,${lerp(-100, 400, pin)})`} opacity={cl(pin * 2)}><path d="M0,90 C-50,30 -50,-40 0,-40 C50,-40 50,30 0,90 Z" fill={C.ink} /><circle cy={-2} r={18} fill={C.night} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="no se apaga" x={700} y={430} col={C.heat} size={70} />
      <Lbl t={t} at={m.desp + 0.3} text="no enfría" x={1520} y={660} col={C.red} size={70} />
      <Lbl t={t} at={m.tec + 0.3} text="recién acá llaman" x={1500} y={260} size={58} />
      <Lbl t={t} at={a + 1.4} text="meses de aviso" x={700} y={680} col={C.dim} size={54} />
    </>
  );
};

// 12 · la frazada: macro de la parrilla; el fieltro gris crece y el calor rebota
export const Frazada: React.FC<FxP> = ({ t, a, m }) => {
  const fz = e(t, m.pone - 0.4, m.pone + 1.6);
  return (
    <>
      <Svg>
        {Array.from({ length: 9 }, (_, i) => <rect key={"t" + i} x={300} y={180 + i * 85} width={1320} height={22} rx={11} fill="#20262c" stroke="#5b6670" strokeWidth={2} />)}
        {Array.from({ length: 22 }, (_, i) => <line key={"w" + i} x1={330 + i * 60} x2={330 + i * 60} y1={160} y2={900} stroke="#4a545d" strokeWidth={4} />)}
        {Array.from({ length: 140 }, (_, i) => <circle key={"f" + i} cx={300 + hash(i, 1) * 1320} cy={170 + hash(i, 2) * 740} r={20 + hash(i, 3) * 38} fill="#8d8b84" opacity={fz * 0.75} />)}
        {Array.from({ length: 10 }, (_, i) => {
          const u = (t * 0.7 + i / 10) % 1, x = 380 + i * 130, back = fz > 0.5, y = back ? 220 + (u < 0.5 ? -u * 260 : -(1 - u) * 260) : 200 - u * 200;
          return <path key={"h" + i} d={`M${x},${y + 40} q -18,-30 0,-60 q 18,-30 0,-60`} stroke={back ? C.red : C.heat} strokeWidth={8} fill="none" opacity={(1 - Math.abs(u - 0.5) * 2) * 0.9} />;
        })}
      </Svg>
      <Lbl t={t} at={a + 0.2} text="una frazada encima" x={960} y={980} col={C.heat2} size={80} plate="rgba(6,16,26,.6)" />
    </>
  );
};

// 13 · barro vs seco: trapo mojado deja barro entre los caños; el cepillo seco lo saca
export const Barro: React.FC<FxP> = ({ t, a, m }) => {
  const mud = e(t, m.barro - 0.3, m.barro + 1.4), br = e(t, m.seco, m.seco + 2.4);
  return (
    <>
      <Svg>
        {[0, 1].map((side) => <g key={side} transform={`translate(${side ? 1000 : 120},220)`}>
          <rect width={800} height={560} rx={24} fill="rgba(14,34,52,.55)" stroke={C.edge} strokeWidth={2} />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={40} y={50 + i * 85} width={720} height={20} rx={10} fill="#232a31" />)}
          {Array.from({ length: 60 }, (_, i) => {
            const x = 50 + hash(i, 4 + side) * 700, y = 60 + hash(i, 6 + side) * 440;
            if (side === 0) return <ellipse key={i} cx={x} cy={y} rx={22 + 10 * hash(i, 9)} ry={12} fill="#5a4630" opacity={0.25 + 0.7 * mud} />;
            return <circle key={i} cx={x} cy={y} r={10 + 8 * hash(i, 9)} fill="#9a9a94" opacity={0.7 * (x / 800 > br ? 1 : 0)} />;
          })}
          {side === 0 && Array.from({ length: 14 }, (_, i) => { const u = ((t - a) * 1.2 + hash(i, 2)) % 1; return <ellipse key={"d" + i} cx={60 + hash(i, 3) * 680} cy={u * 560} rx={7} ry={11} fill={C.ice} opacity={0.75} />; })}
          {side === 1 && br > 0 && br < 1 && <rect x={br * 800 - 40} y={10} width={60} height={540} rx={14} fill="#c08a4a" />}
        </g>)}
        <Cross t={t} at={m.barro + 0.4} x={520} y={860} r={46} />
        <Tick t={t} at={m.seco + 0.5} x={1400} y={860} r={46} />
      </Svg>
      <Lbl t={t} at={a + 0.4} text="trapo mojado" x={520} y={170} col={C.red} size={62} />
      <Lbl t={t} at={m.seco} text="seco siempre" x={1400} y={170} col={C.ok} size={62} />
    </>
  );
};

// 14 · cuatro grados: el vaso y un tambor de números que rueda de 9 a 4; la frazada se va volando
export const CuatroGrados: React.FC<FxP> = ({ t, a, m }) => {
  const roll = e(t, a + 0.3, m.cuatro + 0.2), d = lerp(9, 4, roll), fly = e(t, m.fraz, m.fraz + 1.4);
  return (
    <>
      <div style={{ position: "absolute", left: 760, top: 300, width: 400, height: 300, overflow: "hidden", ...glass() }}>
        {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, width: 400, top: (i - d) * 300 + 0, height: 300, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 280, lineHeight: "300px", color: i === 4 ? C.ice : C.dim }}>{i}°</div>)}
      </div>
      <Svg>
        <g transform={`translate(${1460 + fly * 300},${700 - fly * 900}) rotate(${fly * 40})`} opacity={1 - fly}><rect x={-160} y={-90} width={320} height={180} rx={18} fill="#8d8b84" /><path d="M-160,-40 L160,-40 M-160,10 L160,10 M-160,60 L160,60" stroke="#6f6d66" strokeWidth={6} /></g>
      </Svg>
      <Lbl t={t} at={m.cuatro + 0.2} text="sin cambiar nada" x={960} y={760} col={C.ok} size={72} />
      <Lbl t={t} at={m.fraz + 0.3} text="le saqué la frazada" x={1460} y={900} col={C.heat2} size={56} />
    </>
  );
};
