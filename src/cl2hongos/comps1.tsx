// cl2hongos · componentes del gancho a la mezcla (promesa, el segundo exacto, el cemento quema, moldes, proporción, arena, puño).
// Cada uno es f(t) puro; las marcas (m.*) salen de fx.json, ancladas a la voz.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";

// silueta de hongo (2D) en (x, y = base del tallo), tamaño s; sombrero ancho/alto relativos
export const Seta: React.FC<{ x: number; y: number; s: number; cw?: number; ch?: number; sw?: number; sh?: number; cap?: string; stem?: string; dots?: number; o?: number; rot?: number }> = ({ x, y, s, cw = 1.2, ch = 0.6, sw = 0.24, sh = 0.8, cap = C.cap, stem = C.cream, dots = 0, o = 1, rot = 0 }) => {
  const W = cw * s, Hh = ch * s, w = sw * s, h = sh * s, top = y - h;
  return (
    <g opacity={o} transform={`rotate(${rot} ${x} ${y})`}>
      <path d={`M${x - w * 1.2},${y} C ${x - w * 0.9},${y - h * 0.5} ${x - w},${top + 4} ${x - w * 0.85},${top} L ${x + w * 0.85},${top} C ${x + w},${top + 4} ${x + w * 0.9},${y - h * 0.5} ${x + w * 1.2},${y} Z`} fill={stem} stroke="rgba(0,0,0,.3)" strokeWidth={2} />
      <path d={`M${x - W},${top} C ${x - W},${top - Hh * 1.35} ${x + W},${top - Hh * 1.35} ${x + W},${top} Q ${x},${top + Hh * 0.2} ${x - W},${top} Z`} fill={cap} stroke="rgba(0,0,0,.3)" strokeWidth={2} />
      {Array.from({ length: Math.round(dots) }, (_, i) => { const a = -2.6 + (i / Math.max(1, dots - 1)) * 2.1, r = 0.62; return <circle key={i} cx={x + Math.cos(a) * W * r} cy={top - Hh * 0.4 + Math.sin(a) * Hh * 0.7 * r} r={s * 0.07} fill="#fbf3e2" />; })}
    </g>
  );
};

// 1 · tres moldes → tres hongos: el bol, la taza y el medio huevito caen; cada uno se da vuelta y es un sombrero
export const TresMoldes: React.FC<FxP> = ({ t, m }) => {
  const M = [{ x: 480, at: m.bol, s: 190, lab: "el bol" }, { x: 960, at: m.taza, s: 130, lab: "la taza" }, { x: 1400, at: m.huevo, s: 80, lab: "medio huevito" }];
  return (
    <>
      <Svg>
        {M.map((q, i) => {
          const p = spr(t, q.at, 1), flip = e(t, q.at + 1.1, q.at + 1.7), y = lerp(-200, 560, p);
          const bowl = `M${q.x - q.s},${y - q.s * 0.2} Q ${q.x},${y + q.s * 1.1} ${q.x + q.s},${y - q.s * 0.2} Z`;
          return (
            <g key={i} opacity={cl(p * 2)}>
              <g transform={`rotate(${180 * flip} ${q.x} ${y + q.s * 0.25})`}><path d={bowl} fill={i === 0 ? "#c9372b" : i === 1 ? "#e9e2d2" : "#f2c84b"} stroke="rgba(0,0,0,.35)" strokeWidth={3} opacity={1 - 0.8 * flip} /></g>
              {flip > 0.5 && <Seta x={q.x} y={820} s={q.s * 0.85} cap={C.cem} stem={C.cem} o={e(t, q.at + 1.5, q.at + 2)} />}
            </g>
          );
        })}
      </Svg>
      {M.map((q, i) => <Lbl key={i} t={t} at={q.at + 0.3} text={q.lab} x={q.x} y={930} size={56} col={C.cream} />)}
    </>
  );
};

// 2 · el segundo exacto: diez sombreros en fila; un millón y medio de vistas; nueve se parten, sobrevive uno; aparece un reloj
export const SegundoExacto: React.FC<FxP> = ({ t, m }) => {
  const rot = e(t, m.sobre, m.sobre + 1.2), rel = spr(t, m.reloj, 0.9);
  return (
    <>
      <Svg>
        {Array.from({ length: 10 }, (_, i) => {
          const x = 220 + i * 165, vive = i === 6, p = spr(t, m.millon - 0.4 + i * 0.06, 1.3), br = vive ? 0 : cl(rot * 1.4 - hash(i, 2) * 0.4);
          return (
            <g key={i} opacity={cl(p * 2) * (1 - 0.6 * br)} transform={`translate(0,${(1 - p) * 120 + br * 60})`}>
              <path d={`M${x - 62},560 C ${x - 62},480 ${x - 4},470 ${x - 4},470 L ${x - 4},560 Z`} fill={C.cem} transform={`rotate(${-br * 22} ${x - 4} 560)`} />
              <path d={`M${x + 62},560 C ${x + 62},480 ${x + 4},470 ${x + 4},470 L ${x + 4},560 Z`} fill={C.cem} transform={`rotate(${br * 22} ${x + 4} 560)`} />
              {vive && rot > 0.5 && <circle cx={x} cy={510} r={95} fill="none" stroke={C.ok} strokeWidth={5} opacity={e(t, m.sobre + 0.6, m.sobre + 1)} />}
            </g>
          );
        })}
        {rel > 0.01 && <g transform={`translate(1500,300) scale(${rel})`}><circle r={120} fill="rgba(255,240,214,.1)" stroke={C.sun} strokeWidth={6} /><line x1={0} y1={0} x2={0} y2={-85} stroke={C.ink} strokeWidth={8} strokeLinecap="round" transform={`rotate(${(t - m.reloj) * 90})`} /><line x1={0} y1={0} x2={55} y2={0} stroke={C.ink} strokeWidth={8} strokeLinecap="round" /></g>}
      </Svg>
      <Pop t={t} at={m.millon} x={560} y={250}><Big size={150}>{num(t, m.millon, m.millon + 1.4, 0, 1.5, 1)} M</Big></Pop>
      <Lbl t={t} at={m.sobre + 0.8} text="sobrevivió uno" x={1360} y={720} col={C.ok} size={60} />
      <Lbl t={t} at={m.reloj + 0.3} text="el problema: el reloj" x={1180} y={860} col={C.sun} size={64} />
    </>
  );
};

// 3 · el cemento quema: una mano dibujada; la piel se raja en rojo; entra el guante; el polvito choca contra el barbijo
export const CementoQuema: React.FC<FxP> = ({ t, a, m }) => {
  const raja = e(t, a + 0.6, a + 2.4), gu = e(t, m.guantes, m.guantes + 0.9), bb = spr(t, m.barbijo, 1);
  const mano = "M560,880 L560,600 Q560,560 600,560 L600,420 Q600,385 632,385 Q664,385 664,420 L664,540 L664,370 Q664,335 696,335 Q728,335 728,370 L728,540 L728,385 Q728,350 760,350 Q792,350 792,385 L792,555 L792,430 Q792,400 822,400 Q852,400 852,430 L852,700 Q852,880 720,880 Z";
  return (
    <>
      <Svg>
        <path d={mano} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((i) => <Draw key={i} d={`M${600 + i * 50},${640 + hash(i, 4) * 60} l ${12 - hash(i, 1) * 24},28 l ${10},26 l ${-8},30`} p={raja} col={C.red} w={4} />)}
        <path d={mano} fill="#f2c84b" stroke="#a57c12" strokeWidth={4} style={{ clipPath: `inset(${(1 - gu) * 100}% 0 0 0)` }} />
        {bb > 0.01 && <g transform={`translate(1360,500) scale(${bb})`}>
          <circle r={150} fill="rgba(255,240,214,.08)" stroke={C.edge} strokeWidth={3} />
          <path d="M-110,-10 Q0,-60 110,-10 L95,70 Q0,110 -95,70 Z" fill="#f4f1ea" stroke="#9a948a" strokeWidth={3} />
          {Array.from({ length: 26 }, (_, i) => { const u = ((t - m.barbijo) * 0.6 + hash(i, 7)) % 1; return <circle key={i} cx={-380 + u * 260} cy={-90 + hash(i, 8) * 170} r={4} fill={C.cem} opacity={0.8 * (1 - u)} />; })}
        </g>}
      </Svg>
      <Lbl t={t} at={a + 0.5} text="el cemento quema" x={700} y={230} col={C.red} size={72} />
      <Lbl t={t} at={m.guantes + 0.3} text="guantes de goma" x={1000} y={960} col={C.sun} size={56} />
      <Lbl t={t} at={m.barbijo + 0.3} text="barbijo al echar polvo" x={1360} y={760} col={C.cream} size={52} />
    </>
  );
};

// 4 · hondo o playo: el perfil del bol se aplana y el sombrero cambia de campana a plato
export const HondoPlayo: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, m.playo, m.playo + 1.2), d = lerp(330, 120, k), p = spr(t, a, 0.9);
  return (
    <>
      <Svg>
        <g opacity={cl(p * 2)}>
          <path d={`M520,420 Q960,${420 + d * 2} 1400,420`} fill="none" stroke={C.cap} strokeWidth={14} strokeLinecap="round" />
          <path d={`M600,880 Q960,${880 - d * 1.6} 1320,880 Z`} fill={C.cem} stroke="rgba(0,0,0,.3)" strokeWidth={3} />
          <line x1={960} y1={880} x2={960} y2={880 - d * 0.8} stroke={C.sun} strokeWidth={4} strokeDasharray="8 8" />
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.3} text="hondo: campana" x={1560} y={300} col={C.cream} size={58} out={m.playo} />
      <Lbl t={t} at={m.playo + 0.4} text="playo: plato" x={1560} y={300} col={C.moss} size={58} />
    </>
  );
};

// 5 · lo que hace falta: el tablero se llena de íconos; sólo dos llevan la etiqueta de comprar
export const ListaCasera: React.FC<FxP> = ({ t, a, m }) => {
  const it: [string, number][] = [["bol", a], ["taza", a + 0.3], ["huevito", a + 0.6], ["botellas", a + 0.9], ["media vieja", a + 1.2], ["nylon", m.nylon], ["balde", m.balde], ["cuchara", m.balde + 0.3], ["colador", m.balde + 0.9], ["alambre", m.balde + 1.4], ["vasitos", m.balde + 1.9], ["cemento", m.cem], ["arena", m.cem + 0.3]];
  return (
    <>
      {it.map(([w, at], i) => {
        const col = i % 5, row = Math.floor(i / 5), compra = i >= 11;
        return (
          <Pop key={w} t={t} at={at} x={300 + col * 300} y={290 + row * 220} k={1.2}>
            <div style={{ ...glass(), width: 250, height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: compra ? C.sun : C.ink, textTransform: "uppercase", borderColor: compra ? C.sun : undefined }}>{w}</div>
          </Pop>
        );
      })}
      <Lbl t={t} at={m.cem + 0.8} text="lo único que comprás" x={1500} y={760} col={C.sun} size={56} />
      <Lbl t={t} at={a + 0.4} text="ya lo tenés en casa" x={960} y={930} col={C.moss} size={60} />
    </>
  );
};

// 6 · el molde de fábrica: una cinta saca hongos clonados; del otro lado, los de bol y taza, todos distintos
export const MoldeFabrica: React.FC<FxP> = ({ t, a, m }) => {
  const mv = (t - a) * 140, bos = e(t, m.bosque, m.bosque + 1);
  return (
    <>
      <Svg>
        <rect x={120} y={560} width={760} height={24} rx={12} fill="rgba(255,240,214,.18)" />
        {Array.from({ length: 6 }, (_, i) => <Seta key={i} x={120 + ((i * 150 + mv) % 760)} y={556} s={80} cap={C.cem2} stem={C.cem2} />)}
        <Cross t={t} at={m.igual + 0.6} x={500} y={300} r={70} />
        {[[1150, 1.1, 0.5, 0.3, 0.6, 100], [1380, 0.8, 0.7, 0.18, 1.1, 70], [1580, 1.4, 0.35, 0.28, 0.5, 90], [1750, 0.9, 0.6, 0.15, 1.2, 55]].map(([x, cw, ch, sw, sh, s], i) => (
          <Seta key={i} x={x} y={600 + i * 30} s={s * (0.6 + 0.4 * spr(t, m.bosque - 0.3 + i * 0.2))} cw={cw} ch={ch} sw={sw} sh={sh} cap={C.cem} stem={C.cem} o={bos} />
        ))}
      </Svg>
      <Lbl t={t} at={m.igual} text="todos iguales" x={500} y={760} col={C.red} size={60} />
      <Lbl t={t} at={m.bosque + 0.3} text="ninguno igual" x={1450} y={860} col={C.ok} size={60} />
    </>
  );
};

// 7 · tres y una: el cemento solo se encoge y se raja; las medidas caen como latas: 3+1 sombrero, 2+1 tallo
export const TresYUna: React.FC<FxP> = ({ t, a, m }) => {
  const enc = e(t, m.solo, m.solo + 1.6), out = e(t, m.tres - 0.6, m.tres);
  const lata = (x: number, y: number, col: string, at: number, k: number) => { const p = spr(t, at, 1.2); return <g key={x + "" + y} transform={`translate(${x},${lerp(-200, y, p)})`} opacity={cl(p * 2)}><rect x={-46} y={-60} width={92} height={120} rx={10} fill={col} stroke="rgba(0,0,0,.35)" strokeWidth={3} /><ellipse cx={0} cy={-60} rx={46} ry={12} fill="rgba(255,255,255,.25)" /><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#2a2016">{k}</text></g>; };
  return (
    <>
      <Svg>
        <g opacity={1 - out}>
          <rect x={960 - 220 * (1 - 0.12 * enc)} y={420} width={440 * (1 - 0.12 * enc)} height={240} rx={14} fill={C.cem2} />
          {[0, 1, 2].map((i) => <Draw key={i} d={`M${880 + i * 70},420 l 18,60 l -14,50 l 20,60 l -10,70`} p={e(t, m.solo + 0.6 + i * 0.2, m.solo + 1.4 + i * 0.2)} col="#231d15" w={5} />)}
        </g>
        <g opacity={out}>
          {[0, 1, 2].map((i) => lata(360 + i * 120, 470, "#d9c08f", m.tres + i * 0.2, i + 1))}
          {lata(760, 470, C.cem2, m.tres + 0.8, 1)}
          {[0, 1].map((i) => lata(1180 + i * 120, 470, "#d9c08f", m.tallo + i * 0.2, i + 1))}
          {lata(1460, 470, C.cem2, m.tallo + 0.6, 1)}
        </g>
      </Svg>
      <Lbl t={t} at={m.solo + 0.4} out={m.tres - 0.6} text="solo, se encoge" x={960} y={790} col={C.red} size={64} />
      <Lbl t={t} at={m.tres + 0.6} text="sombrero 3 + 1" x={560} y={700} col={C.cream} size={58} />
      <Lbl t={t} at={m.tallo + 0.5} text="tallo 2 + 1" x={1320} y={700} col={C.sun} size={58} />
      <Lbl t={t} at={m.tres + 1.4} text="arena + cemento" x={960} y={880} col={C.dim} size={44} />
    </>
  );
};

// 8 · la piedrita: el colador deja pasar la arena fina; la piedra queda arriba. Sin colar, esa piedra es un agujero en el borde
export const Piedrita: React.FC<FxP> = ({ t, a, m }) => {
  const ins = spr(t, m.piedra, 0.9);
  return (
    <>
      <Svg>
        <ellipse cx={620} cy={420} rx={300} ry={70} fill="rgba(255,240,214,.08)" stroke={C.edge} strokeWidth={4} />
        {Array.from({ length: 13 }, (_, i) => <line key={i} x1={340 + i * 46} y1={370} x2={340 + i * 46} y2={470} stroke="rgba(255,240,214,.25)" strokeWidth={2} />)}
        {Array.from({ length: 80 }, (_, i) => { const u = ((t - a) * 0.7 + hash(i, 3)) % 1; return <circle key={i} cx={360 + hash(i, 4) * 520} cy={440 + u * 420} r={2.5} fill="#e2cfa2" opacity={1 - u} />; })}
        {[[520, 400, 18], [700, 392, 14], [610, 410, 11]].map(([x, y, r], i) => <ellipse key={i} cx={x + 8 * Math.sin(t * 9 + i)} cy={y} rx={r} ry={r * 0.75} fill="#8d8677" stroke="#4b463e" strokeWidth={2} />)}
        {ins > 0.01 && <g transform={`translate(1380,560) scale(${ins})`}>
          <path d="M-260,60 C -260,-140 260,-140 260,60 Q 0,90 -260,60 Z" fill={C.cem} stroke="rgba(0,0,0,.3)" strokeWidth={3} />
          <ellipse cx={-215} cy={40} rx={30} ry={22} fill="#15110b" opacity={e(t, m.piedra + 0.8, m.piedra + 1.3)} />
          <circle cx={-215} cy={40} r={56} fill="none" stroke={C.red} strokeWidth={5} opacity={e(t, m.piedra + 1, m.piedra + 1.4)} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.piedra + 1.2} text="piedrita = agujero" x={1380} y={820} col={C.red} size={58} />
      <Lbl t={t} at={m.harina} text="fina como harina" x={620} y={940} col={C.cream} size={58} />
    </>
  );
};

// 9 · la prueba del puño: tres puños abiertos; uno se desarma, uno chorrea, el del medio guarda los dedos
export const PruebaPuno: React.FC<FxP> = ({ t, a, m }) => {
  const P3 = [{ x: 420, at: m.seca, lab: "le falta agua", col: C.red }, { x: 960, at: m.perf, lab: "perfecta", col: C.ok }, { x: 1500, at: m.chorrea, lab: "te pasaste", col: C.red }];
  return (
    <>
      <Svg>
        {P3.map((q, i) => {
          const p = spr(t, Math.min(q.at - 0.3, a + 0.4 + i * 0.35), 1), v = cl((t - q.at + 0.3) * 3);
          return (
            <g key={i} opacity={cl(p * 2)} transform={`translate(${q.x},${560 + (1 - p) * 120})`}>
              <ellipse cx={0} cy={110} rx={200} ry={46} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={3} />
              <g opacity={v}>{i === 0 && Array.from({ length: 24 }, (_, j) => <circle key={j} cx={-120 + hash(j, 2) * 240} cy={20 + hash(j, 3) * 80 + e(t, q.at, q.at + 1) * 40 * hash(j, 5)} r={9} fill={C.cem} />)}
              {i === 1 && <><ellipse cx={0} cy={50} rx={130} ry={70} fill={C.cem} /><path d="M-80,30 q 20,-20 40,0 M-20,22 q 20,-20 40,0 M40,30 q 20,-20 40,0" stroke="#6e695f" strokeWidth={6} fill="none" /></>}
              {i === 2 && <><ellipse cx={0} cy={70} rx={150} ry={50} fill={C.cem2} />{[0, 1, 2].map((j) => <ellipse key={j} cx={-60 + j * 60} cy={140 + ((t * 120 + j * 40) % 120)} rx={8} ry={14} fill={C.water} />)}</>}</g>
            </g>
          );
        })}
        {[0, 2].map((i) => <Cross key={i} t={t} at={P3[i].at + 0.6} x={P3[i].x} y={380} r={46} />)}
        <Tick t={t} at={m.perf + 0.5} x={960} y={380} r={52} />
      </Svg>
      {P3.map((q, i) => <Lbl key={i} t={t} at={q.at + 0.2} text={q.lab} x={q.x} y={830} col={q.col} size={56} />)}
      <Lbl t={t} at={a + 0.6} out={m.dulce - 0.3} text="la prueba del puño" x={960} y={200} col={C.cream} size={62} />
      <Lbl t={t} at={m.dulce} text="dulce de leche espeso" x={960} y={200} col={C.sun} size={62} />
    </>
  );
};
