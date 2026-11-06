// fb5nc · componentes 1-16 (gancho, premio, qué es, qué tierra, frasco, puño, terreno, encofrado y espesor). Cada uno es
// f(t) y sigue la voz por sus marcas (m.*). Ninguno se repite con cl2nov ni con fb5na/fb5nb.
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, FxP, Svg, Tick, shake } from "./kit";
import { Balde, BARRO, Bolsa, Camioneta, Capas, Charcos, CLARA, Copo, Estaca, Frasco, Juntas, Losa, MAD, NEGRA, Pala, Pison, quad, SC, Sol, Tarja, Brillo } from "./piso";

const Persona: React.FC<{ x: number; y: number; s?: number; col?: string }> = ({ x, y, s = 1, col = "#e9d3b0" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cy={-170} r={26} fill={col} /><rect x={-24} y={-140} width={48} height={80} rx={18} fill="#3b6a8a" />
    <rect x={-22} y={-64} width={18} height={64} rx={8} fill="#2a3640" /><rect x={4} y={-64} width={18} height={64} rx={8} fill="#2a3640" />
  </g>
);
const Lluvia: React.FC<{ t: number; o: number; x0?: number; x1?: number; n?: number }> = ({ t, o, x0 = 0, x1 = 1920, n = 60 }) => o < 0.02 ? null : (
  <g opacity={o}>{Array.from({ length: n }, (_, i) => { const ph = (t * 1.4 + hash(i, 5)) % 1, x = lerp(x0, x1, hash(i, 6)); return <line key={i} x1={x - ph * 40} y1={-40 + ph * 1000} x2={x - ph * 40 - 10} y2={-10 + ph * 1000} stroke="#bcdcff" strokeWidth={3} opacity={0.6} />; })}</g>
);

// 1 · dos patios lado a lado: el de tierra con charcos y lluvia; el de al lado, pavimentado; la camioneta lo cruza y nada
export const DosPatios: React.FC<FxP> = ({ t, a, m }) => {
  const cx = lerp(-500, 2400, e(t, m.cam, m.cam + 4.2)), sobre = cx > 980 && cx < 1900;
  return (
    <>
      <Svg>
        <Lluvia t={t} o={1 - e(t, m.otro, m.otro + 1)} x0={60} x1={900} n={40} />
        <g transform={`translate(0,${spr(t, a, 0.8) * 0 })`}>
          <Losa cx={500} y={430} w={760} d={400} h={50} top={BARRO} side="#3e2a18" grano={20}>
            {(f) => <><Charcos f={f} o={1} n={6} />{t > m.barro && Array.from({ length: 6 }, (_, i) => { const [x, y] = f(0.2 + i * 0.12, 0.85 - i * 0.12); return <ellipse key={i} cx={x} cy={y} rx={18} ry={9} fill="#2e1f12" opacity={e(t, m.barro + i * 0.2, m.barro + i * 0.2 + 0.2)} />; })}</>}
          </Losa>
        </g>
        <g opacity={e(t, m.otro - 0.2, m.otro + 0.6)} transform={`translate(0,${(1 - spr(t, m.otro)) * 80 + (sobre ? 2 * Math.sin(t * 50) : 0)})`}>
          <Losa cx={1420} y={430} w={760} d={400} h={50} top={SC} side="#8f8473">
            {(f) => <><Juntas f={f} nu={3} nv={2} k={1} col="#7d7263" /><Brillo id="dpb" pts={quad(f, 0, 0, 1, 1)} k={e(t, m.duro, m.duro + 2.5)} o={0.55} w={240} /></>}
          </Losa>
        </g>
        {t > m.cam - 0.2 && <g opacity={1 - e(t, m.cam + 3.8, m.cam + 4.2)}><Camioneta x={cx} y={760} s={0.62} fardos giro={(cx * 0.9) % 360} /></g>}
      </Svg>
      <Lbl t={t} at={m.tierra} out={m.otro} text="tierra" x={500} y={940} col={C.cream} size={84} />
      <Lbl t={t} at={m.duro} text="ni se marca" x={1420} y={940} col={C.ok} size={84} />
    </>
  );
};

// 2 · un año: el patio en el centro y el anillo de las estaciones gira (helada, cuarenta grados, lluvia); la lupa no
// encuentra grieta; cae la etiqueta del metro cuadrado contra una baldosa barata
export const AnoSinGrieta: React.FC<FxP> = ({ t, a, m }) => {
  const rot = 120 * e(t, m.hel, m.llu + 2), lup = e(t, m.ni, m.ni + 1.6), cost = spr(t, m.cost, 0.8);
  const ic: [number, number][] = [[m.hel, 0], [m.ver, 120], [m.llu, 240]];
  return (
    <>
      <Svg>
        <g transform={`translate(960,520) rotate(${rot})`} opacity={1 - e(t, m.cost - 0.3, m.cost + 0.3) * 0.7}>
          <circle r={380} fill="none" stroke="rgba(255,236,200,.22)" strokeWidth={4} strokeDasharray="8 14" />
          {ic.map(([at, g], i) => t > at && <g key={i} transform={`rotate(${g}) translate(0,-380) rotate(${-g - rot}) scale(${spr(t, at)})`}>
            <circle r={78} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
            {i === 0 ? <Copo x={0} y={0} r={46} rot={t * 20} /> : i === 1 ? <><Sol x={0} y={-6} r={32} rot={t * 15} /><text y={60} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">40°</text></> : Array.from({ length: 9 }, (_, j) => { const ph = (t * 1.5 + hash(j, 3)) % 1; return <line key={j} x1={-40 + j * 10} y1={-50 + ph * 90} x2={-44 + j * 10} y2={-36 + ph * 90} stroke="#a9dcff" strokeWidth={4} />; })}
          </g>)}
        </g>
        <g transform={`translate(0,${-120 * e(t, m.cost - 0.3, m.cost + 0.4)})`}>
          <Losa cx={960} y={420} w={520} d={240} h={36}>{(f) => <Juntas f={f} nu={2} nv={2} k={1} col="#7d7263" />}</Losa>
          {lup > 0.02 && lup < 0.99 && <g transform={`translate(${lerp(760, 1160, lup)},${520 + 40 * Math.sin(lup * 6)})`}>
            <circle r={70} fill="rgba(220,240,255,.18)" stroke="#e9e1cf" strokeWidth={10} /><line x1={50} y1={50} x2={110} y2={110} stroke={MAD} strokeWidth={20} strokeLinecap="round" /></g>}
          <Tick t={t} at={m.ni + 1.6} x={1250} y={470} r={46} />
        </g>
        {t > m.cost && <g transform={`translate(760,${lerp(1200, 780, cost)}) rotate(${-6 + 6 * cost})`}>
          <path d="M-170,-90 L130,-90 L190,0 L130,90 L-170,90 Z" fill="#f2e3bf" stroke="#9c7a45" strokeWidth={5} /><circle cx={130} cy={0} r={14} fill={C.night} />
          <text x={-20} y={22} textAnchor="middle" fontSize={84} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">US$ 4</text>
          <text x={-20} y={80} textAnchor="middle" fontSize={32} fontWeight={700} fill="#6c5a3c" fontFamily="Barlow">el m²</text>
        </g>}
        {t > m.bal && <g transform={`translate(1260,${lerp(1200, 790, spr(t, m.bal))})`}>
          <rect x={-130} y={-90} width={260} height={180} rx={6} fill="#b26a45" stroke="#7a3f22" strokeWidth={5} />
          {[[-130, -2, 260, 4], [-2, -90, 4, 180]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#7a3f22" />)}
          <text y={140} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">BALDOSA: MÁS</text>
        </g>}
      </Svg>
      <Lbl t={t} at={m.ni} out={m.cost - 0.3} text="ni una grieta" x={960} y={960} col={C.ok} size={88} />
    </>
  );
};

// 3 · lo que NO lleva: piedra partida, hierro, mixer y cuadrilla caen y se tachan; quedan la pala con la tierra del patio
// y una bolsa; al final dos chinches marcan «dos detalles»
export const NoHormigon: React.FC<FxP> = ({ t, m }) => {
  const it: [string, number][] = [["piedra partida", m.pie], ["hierro", m.hie], ["mixer", m.mix], ["cuadrilla", m.cua]];
  const fuera = e(t, m.tie - 0.4, m.tie + 0.2);
  const ico = (i: number) => i === 0 ? Array.from({ length: 7 }, (_, j) => <polygon key={j} points={`${-60 + j * 20},${-10 - 30 * hash(j, 1)} ${-40 + j * 20},${-40 - 20 * hash(j, 2)} ${-28 + j * 20},${0}`} fill="#8b8f92" />)
    : i === 1 ? [0, 1, 2, 3].map((j) => <rect key={j} x={-80} y={-60 + j * 22} width={160} height={10} rx={5} fill="#7a4b2c" />)
    : i === 2 ? <><rect x={-90} y={-30} width={70} height={50} fill="#d8b860" /><ellipse cx={30} cy={-20} rx={60} ry={40} fill="#c9cbcc" transform="rotate(-18 30 -20)" /><circle cx={-60} cy={28} r={16} fill="#222" /><circle cx={50} cy={28} r={16} fill="#222" /></>
    : [-50, 0, 50].map((x) => <g key={x}><circle cx={x} cy={-48} r={16} fill="#e9d3b0" /><rect x={x - 16} y={-30} width={32} height={60} rx={10} fill="#d8a23a" /></g>);
  return (
    <>
      <Svg>
        {it.map(([w, at], i) => t > at && <g key={w} transform={`translate(${300 + i * 440},${330 + 900 * fuera * (i % 2 ? 1 : 1.2)}) scale(${spr(t, at)})`}>
          <rect x={-180} y={-150} width={360} height={300} rx={22} fill="rgba(30,20,10,.82)" stroke="rgba(255,236,200,.35)" strokeWidth={3} />
          <g transform="translate(0,-20) scale(1.3)">{ico(i)}</g>
          <text y={115} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text>
          <line x1={-150} y1={-120} x2={-150 + 300 * e(t, at + 0.3, at + 0.6)} y2={120 * e(t, at + 0.3, at + 0.6) * 2 - 120} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
        </g>)}
        {t > m.tie && <g transform={`translate(${lerp(-300, 640, spr(t, m.tie))},880)`}><Pala x={0} y={0} rot={-14} s={1.15} carga={1} /></g>}
        {t > m.bol && <g transform={`translate(1240,${lerp(-300, 690, spr(t, m.bol, 0.9))})`}><Bolsa x={0} y={0} s={1.2} /></g>}
        {[0, 1].map((i) => t > m.dos + i * 0.4 && <g key={i} transform={`translate(${760 + i * 400},300) scale(${spr(t, m.dos + i * 0.4)})`}>
          <circle r={64} fill={C.honey} /><text y={26} textAnchor="middle" fontSize={76} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">{i + 1}</text></g>)}
      </Svg>
      <Lbl t={t} at={m.tie} out={m.dos} text="la tierra del patio" x={640} y={980} col={C.cream} size={64} />
      <Lbl t={t} at={m.dos} text="dos detalles" x={960} y={450} col={C.honey} size={80} />
    </>
  );
};

// 4 · la fórmula y la historia: tierra + cemento + agua, apisonada = suelo cemento; un camino de campo se estira y por él
// pasan las tres obras (camino rural, pista de avioneta, base de ruta); mal hecho se desgrana; y las tres pruebas del final
export const CienAnosCaminos: React.FC<FxP> = ({ t, m }) => {
  const f1 = 1 - e(t, m.cam - 0.4, m.cam), road = e(t, m.cam, m.cam + 1.2), mal = e(t, m.mal, m.mal + 0.8), pr = e(t, m.pru - 0.3, m.pru + 0.3);
  const terms: [string, string][] = [["tierra", CLARA], ["cemento", "#c9cbcc"], ["agua", "#7cc8ff"]];
  return (
    <>
      <Svg>
        <g opacity={f1}>{terms.map(([w, col], i) => t > m.tie + i * 0.4 && <g key={w} transform={`translate(${380 + i * 420},480) scale(${spr(t, m.tie + i * 0.4)})`}>
          <circle r={130} fill={col} /><text y={200} textAnchor="middle" fontSize={56} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text>
          {i < 2 && <text x={210} y={22} textAnchor="middle" fontSize={90} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">+</text>}</g>)}</g>
        {road > 0.01 && <g opacity={road * (1 - pr)}>
          <polygon points={`${960 - 160},300 ${960 + 160},300 ${960 + 900},1000 ${960 - 900},1000`} fill={SC} />
          <polygon points={`${960 - 160},300 ${960 + 160},300 ${960 + 900},1000 ${960 - 900},1000`} fill="#5f5548" opacity={0.2} />
          <rect x={0} y={250} width={1920} height={52} fill="#6f8a3c" />
          {t > m.pis && <g transform={`translate(${lerp(1900, 300, e(t, m.pis, m.pis + 3))},${200 + 30 * Math.sin(t * 2)})`}><path d="M-90,0 L90,0 L60,-14 L-60,-14 Z M-20,-12 L-60,-70 L-30,-70 L20,-12 Z M-20,0 L-50,50 L-26,50 L16,0 Z M70,-6 L100,-40 L110,-40 L95,-6 Z" fill="#e9e1cf" /></g>}
          {t > m.rut && <g transform={`translate(960,${lerp(1200, 830, spr(t, m.rut))})`}><Tarja x={0} y={0} txt="base de ruta" w={420} /></g>}
          {mal > 0.02 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={960 + (hash(i, 9) - 0.5) * 1300 * hash(i, 8)} cy={500 + 450 * hash(i, 8)} r={4 + 6 * hash(i, 10)} fill="#8c8170" opacity={mal} transform={`translate(0,${mal * 30 * hash(i, 11)})`} />)}
          {mal > 0.02 && <path d={`M${700},${560} l60,80 l-30,60 l70,120 l-20,90`} stroke="#2b221a" strokeWidth={8} fill="none" opacity={mal} strokeDasharray="600" strokeDashoffset={600 * (1 - mal)} />}
        </g>}
        {pr > 0.01 && ["agua", "destornillador", "camioneta"].map((w, i) => t > m.pru + 0.6 + i * 0.6 && <g key={w} transform={`translate(${440 + i * 520},540) scale(${spr(t, m.pru + 0.6 + i * 0.6)})`}>
          <rect x={-210} y={-170} width={420} height={340} rx={26} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
          {i === 0 ? <Balde x={0} y={60} s={0.55} lvl={0.8} liq="#7cc8ff" /> : i === 1 ? <g transform="rotate(-35)"><rect x={-10} y={-120} width={20} height={150} rx={6} fill="#c8ccd0" /><rect x={-26} y={20} width={52} height={110} rx={18} fill={C.red} /></g> : <Camioneta x={0} y={60} s={0.5} />}
          <text y={140} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text></g>)}
      </Svg>
      <Lbl t={t} at={m.tie + 1.4} out={m.cam - 0.4} text="suelo cemento" x={960} y={830} col={C.honey} size={96} />
      <Lbl t={t} at={m.cam} out={m.pis} text="caminos rurales" x={960} y={170} col={C.cream} size={70} />
      <Lbl t={t} at={m.pis} out={m.rut} text="pistas de campo" x={960} y={170} col={C.cream} size={70} />
      <Lbl t={t} at={m.mal} out={m.pru - 0.3} text="mal hecha: se desgrana" x={960} y={170} col={C.red} size={70} />
    </>
  );
};

// 5 · los granos en macro: secos firmes; entra el agua, se separan y es barro; el cemento tiende puentecitos que fraguan
// y el agua vuelve a pasar sin separarlos: LOSA
export const PuentesGrano: React.FC<FxP> = ({ t, m }) => {
  const sep = e(t, m.sep, m.sep + 2) * (1 - e(t, m.cem, m.cem + 1.2)), agua = e(t, m.agua, m.agua + 1.2) * (1 - e(t, m.cem - 0.5, m.cem)) + e(t, m.llu, m.llu + 1) * 0.8;
  const pue = e(t, m.pue - 0.4, m.pue + 1.6), fra = e(t, m.pue + 1.8, m.llu - 0.3);
  const G = Array.from({ length: 34 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return { x: 560 + c * 130 + (r % 2) * 65 + 20 * (hash(i, 1) - 0.5), y: 300 + r * 115 + 15 * (hash(i, 2) - 0.5), r: 46 + 14 * hash(i, 3) }; });
  const pos = (g: { x: number; y: number }, i: number) => ({ x: g.x + sep * 40 * (hash(i, 4) - 0.5) * 2, y: g.y + sep * (40 + 50 * hash(i, 5)) });
  return (
    <>
      <Svg>
        <rect x={470} y={230} width={980} height={650} rx={40} fill="rgba(124,200,255,.0)" stroke="rgba(255,236,200,.25)" strokeWidth={3} />
        {agua > 0.02 && <rect x={480} y={240} width={960} height={630} rx={36} fill="#5d84a0" opacity={0.42 * agua} />}
        {pue > 0.02 && G.map((g, i) => G.slice(i + 1).filter((h) => Math.hypot(h.x - g.x, h.y - g.y) < 160).map((h, j) => { const p1 = pos(g, i), p2 = pos(h, i + j + 1); return <line key={i + "-" + j} x1={p1.x} y1={p1.y} x2={lerp(p1.x, p2.x, pue)} y2={lerp(p1.y, p2.y, pue)} stroke={fra > 0.5 ? "#e6e9ec" : "#c9cbcc"} strokeWidth={8 + 6 * fra} strokeLinecap="round" />; }))}
        {G.map((g, i) => { const p = pos(g, i); return <circle key={i} cx={p.x} cy={p.y} r={g.r} fill={hash(i, 6) < 0.25 ? "#8e7c69" : CLARA} />; })}
        {fra > 0.02 && G.map((g, i) => <circle key={"f" + i} cx={g.x} cy={g.y} r={g.r + 6} fill="none" stroke="#fffaf0" strokeWidth={2} opacity={0.4 * fra * (0.5 + 0.5 * Math.sin(t * 3 + i))} />)}
      </Svg>
      <Lbl t={t} at={m.seca} out={m.agua} text="seca: aguanta" x={960} y={960} col={C.cream} size={76} />
      <Lbl t={t} at={m.bar} out={m.cem} text="barro" x={960} y={960} col={C.red} size={96} />
      <Lbl t={t} at={m.pue} out={m.losa} text="puentecitos de cemento" x={960} y={960} col={C.cream} size={70} />
      <Lbl t={t} at={m.losa} text="una losa" x={960} y={960} col={C.ok} size={104} />
    </>
  );
};

// 6 · pocos baldes de cemento: ocho baldes de tierra en fila y uno de cemento; al lado, la pila del hormigón (piedra,
// arena, cemento, hierro) que no entra en el cuadro; y la tierra «ya la tenés»
export const UnoCadaOcho: React.FC<FxP> = ({ t, a, m }) => {
  const hor = e(t, m.hor, m.hor + 1) * (1 - e(t, m.par - 0.3, m.par + 0.2)), par = e(t, m.par, m.par + 2.6), bar = e(t, m.bar, m.bar + 0.8);
  return (
    <>
      <Svg>
        {hor > 0.02 && <g opacity={hor}>{[["#8b8f92", "piedra"], [CLARA, "arena"], ["#c9cbcc", "cemento"], ["#7a4b2c", "hierro"]].map(([col, w], i) => <g key={w} transform={`translate(${520 + i * 300},${560 - i * 40}) scale(${spr(t, m.hor + i * 0.25)})`}>
          <path d="M-130,120 Q0,-160 130,120 Z" fill={col} /><text y={180} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w.toUpperCase()}</text></g>)}</g>}
        {Array.from({ length: 9 }, (_, i) => { const at = m.par + i * 0.22, cem = i === 4; return t > at && <g key={i} transform={`translate(${200 + i * 190},${700 - (cem ? 40 : 0) - 30 * bar * (cem ? 0 : 1)}) scale(${spr(t, at) * (cem ? 0.62 : 0.5)})`}>
          <Balde x={0} y={0} lvl={0.85} liq={cem ? "#c9cbcc" : CLARA} />{cem && <circle cy={-200} r={0} />}</g>; })}
        {par > 0.4 && <text x={960} y={830} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={e(t, m.par + 2, m.par + 2.6)}>1 DE CEMENTO · 8 DE TIERRA</text>}
        {bar > 0.02 && <g transform={`translate(960,${lerp(1300, 300, spr(t, m.bar))})`}><Tarja x={0} y={0} w={620} txt="la tierra ya la tenés" col={C.ok} size={52} /></g>}
      </Svg>
      <Lbl t={t} at={m.hor} out={m.par - 0.3} text="el hormigón lleva todo esto" x={960} y={180} col={C.cream} size={60} />
      {t > a && null}
    </>
  );
};

// 7 · tres tierras en tres palas: la ideal (arena con un poco de arcilla) aprueba; la pura arcilla se raja en verano y se
// hincha en invierno; la pura arena se desarma
export const ArenaArcilla: React.FC<FxP> = ({ t, m }) => {
  const hin = e(t, m.hin, m.hin + 1.5), sx = 1 + 0.12 * Math.sin(hin * Math.PI * 3) * hin;
  const card = (i: number, at: number, titulo: string, ch: React.ReactNode, ok: boolean) => t > at && (
    <g key={i} transform={`translate(${380 + i * 580},520) scale(${spr(t, at)})`}>
      <rect x={-250} y={-270} width={500} height={540} rx={30} fill="rgba(30,20,10,.82)" stroke="rgba(255,236,200,.35)" strokeWidth={3} />
      {ch}
      <text y={230} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{titulo.toUpperCase()}</text>
      {ok ? <Tick t={t} at={at + 1.2} x={180} y={-200} r={44} /> : <Cross t={t} at={at + 1.6} x={180} y={-200} r={44} />}
    </g>
  );
  return (
    <>
      <Svg>
        {card(0, m.ide, "arena + algo de arcilla", <>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-180 + 360 * hash(i, 1)} cy={-160 + 300 * hash(i, 2)} r={hash(i, 3) < 0.2 ? 9 : 16} fill={hash(i, 3) < 0.2 ? "#8e7c69" : "#d3b07a"} />)}</>, true)}
        {card(1, m.arc, "pura arcilla", <g transform={`scale(${sx},1)`}><rect x={-190} y={-170} width={380} height={300} rx={20} fill="#8e6a4e" />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-180 + i * 70},-170 l${20 - 40 * hash(i, 4)},90 l${30 - 60 * hash(i, 5)},90 l${10},120`} stroke="#3b2717" strokeWidth={6} fill="none" opacity={e(t, m.arc + 0.6, m.arc + 1.4) * (1 - hin)} />)}</g>, false)}
        {card(2, m.are, "pura arena", <>{Array.from({ length: 70 }, (_, i) => { const fall = e(t, m.are + 0.8, m.are + 2.4) * hash(i, 9) * 160; return <circle key={i} cx={-180 + 360 * hash(i, 7)} cy={-160 + 260 * hash(i, 8) + fall} r={9} fill="#e3c88f" />; })}</>, false)}
      </Svg>
      <Lbl t={t} at={m.hin} out={m.are} text="se hincha y se encoge" x={960} y={960} col={C.red} size={64} />
    </>
  );
};

// 8 · la tierra negra en corte: raíces y hojas; la palabra «materia orgánica» la tacha; la pala saca 10-15 cm y aparece
// la tierra clara de abajo, limpia
export const TierraNegraFuera: React.FC<FxP> = ({ t, m }) => {
  const saca = e(t, m.saca, m.saca + 3.2), cla = e(t, m.cla - 0.3, m.cla + 0.8);
  return (
    <>
      <Svg>
        <g transform={`translate(0,${shake(t, m.saca + 0.3, 6)})`}>
          <Capas x={360} y={940} w={1200} capas={[{ h: 360, k: 1, tipo: "clara" }, { h: 180, k: 1 - saca, tipo: "negra" }]} />
          {cla > 0.02 && <rect x={360} y={580} width={1200} height={8} fill="#ffe9b8" opacity={0.6 * cla} />}
        </g>
        {t > m.saca && saca < 1 && <g transform={`translate(${lerp(520, 1500, saca)},${560 - 80 * Math.sin(saca * Math.PI * 4)})`}><Pala x={0} y={0} rot={-40} s={0.9} carga={1} col={NEGRA} /></g>}
        {t > m.cm && <g opacity={1 - cla * 0.4}>
          <line x1={1620} y1={400} x2={1620} y2={580} stroke={C.honey} strokeWidth={6} />{[400, 580].map((y) => <line key={y} x1={1600} x2={1640} y1={y} y2={y} stroke={C.honey} strokeWidth={6} />)}
          <text x={1660} y={505} fontSize={56} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={spr(t, m.cm)}>10-15 cm</text></g>}
      </Svg>
      <Lbl t={t} at={m.neg} out={m.rai} text="la tierra negra" x={960} y={250} col={C.cream} size={76} />
      <Lbl t={t} at={m.rai} out={m.saca} text="raíces y hojas: no agarra" x={960} y={250} col={C.red} size={70} />
      <Lbl t={t} at={m.cla} text="la tierra limpia" x={960} y={250} col={C.ok} size={80} />
    </>
  );
};

// 9 · la prueba del frasco: un tercio de tierra, agua, la cucharadita de sal; se tapa y se sacude (el frasco se mueve de
// verdad); quieto, se asienta en tres tiempos con su reloj: arena al minuto, limo a las dos horas, arcilla al día siguiente
export const FrascoSal: React.FC<FxP> = ({ t, m }) => {
  const ter = e(t, m.ter, m.ter + 1.2), ag = e(t, m.agua, m.agua + 1.5), sac = t > m.sac + 0.5 && t < m.quieto ? 1 : 0;
  const turb = e(t, m.sac + 0.6, m.sac + 1.4) * (1 - e(t, m.dia, m.dia + 2) * 0.95);
  const ar = 120 * e(t, m.min - 0.6, m.min + 0.6), li = 40 * e(t, m.hor - 0.5, m.hor + 0.8), ac = 36 * e(t, m.dia - 0.5, m.dia + 1);
  const rayas = [t > m.min + 1 ? 120 : -1, t > m.hor + 1.2 ? 160 : -1, t > m.dia + 1.4 ? 196 : -1].filter((x) => x > 0);
  const rel = t < m.quieto ? "" : t < m.hor ? "1 minuto" : t < m.dia ? "2 horas" : "al día siguiente";
  return (
    <>
      <Svg>
        <g transform={`translate(${sac ? 30 * Math.sin(t * 22) : 0},${sac ? 18 * Math.cos(t * 17) : 0})`}>
          <Frasco x={960} y={560} s={1.55} lvl={ag * 0.88} turb={turb * (1 - (ter > 0 && ag < 0.1 ? 1 : 0))} ar={ag < 0.1 ? 120 * ter : ar} li={li} ac={ac} rayas={rayas} tapa={e(t, m.sac - 0.3, m.sac + 0.3)} rot={sac ? 14 * Math.sin(t * 22) : 0} />
        </g>
        {t > m.sal && t < m.sac && <g transform={`translate(${lerp(1400, 1060, e(t, m.sal, m.sal + 1))},${200}) rotate(${-30 * e(t, m.sal + 1, m.sal + 1.6)})`}>
          <rect x={-120} y={-14} width={150} height={20} rx={10} fill="#c8ccd0" /><ellipse cx={50} cy={-4} rx={42} ry={24} fill="#c8ccd0" /><ellipse cx={50} cy={-10} rx={32} ry={14} fill="#fff" />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={60 + 10 * hash(i, 1)} cy={20 + ((t * 2 + hash(i, 2)) % 1) * 180} r={4} fill="#fff" opacity={e(t, m.sal + 1.4, m.sal + 1.8)} />)}</g>}
        {rel && <g transform={`translate(1480,${560})`}><circle r={110} fill="rgba(30,20,10,.85)" stroke="rgba(255,236,200,.45)" strokeWidth={5} />
          <line x1={0} y1={0} x2={0} y2={-80} stroke={C.honey} strokeWidth={8} strokeLinecap="round" transform={`rotate(${(t - m.quieto) * 160})`} />
          <line x1={0} y1={0} x2={50} y2={0} stroke={C.cream} strokeWidth={10} strokeLinecap="round" transform={`rotate(${(t - m.quieto) * 14})`} />
          <text y={170} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{rel.toUpperCase()}</text></g>}
        {[["arena", m.min + 1, 120], ["limo", m.hor + 1.2, 160], ["arcilla", m.dia + 1.4, 196]].map(([w, at, h]) => t > (at as number) && <text key={w as string} x={960 - 250} y={560 + 1.55 * (190 - 6 - (h as number)) + 20} textAnchor="end" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={spr(t, at as number)}>{(w as string).toUpperCase()}</text>)}
      </Svg>
      <Lbl t={t} at={m.ter} out={m.agua} text="un tercio de tierra" x={960} y={970} col={C.cream} size={70} />
      <Lbl t={t} at={m.sal} out={m.sac} text="+ una cucharadita de sal" x={960} y={970} col={C.cream} size={64} />
      <Lbl t={t} at={m.sac} out={m.quieto} text="un minuto entero" x={960} y={970} col={C.honey} size={76} />
    </>
  );
};

// 10 · leer el frasco: dos reglas al costado del vidrio; «arena más de la mitad» se llena en verde; «arcilla más de un
// tercio» en rojo, y la receta: una carretilla de arena cada dos de tierra
export const LeerFrasco: React.FC<FxP> = ({ t, m }) => {
  const mit = e(t, m.mit, m.mit + 1.2), arc = e(t, m.arc, m.arc + 1.2), carr = spr(t, m.carr);
  const Carr: React.FC<{ x: number; col: string; w: string }> = ({ x, col, w }) => (
    <g transform={`translate(${x},860)`}><path d="M-110,-60 L110,-60 L80,20 L-80,20 Z" fill="#5c7a8c" /><ellipse cy={-62} rx={110} ry={34} fill={col} /><circle cx={0} cy={50} r={30} fill="#222" /><line x1={80} y1={-20} x2={170} y2={30} stroke="#5e3a1c" strokeWidth={10} />
      <text y={130} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{w}</text></g>
  );
  return (
    <>
      <Svg>
        <g transform={`translate(${-320 * carr * 0},0)`}>
          <Frasco x={640} y={500} s={1.5} lvl={0.88} turb={0.05} ar={150} li={50} ac={60} />
          <g transform="translate(900,0)">
            <line x1={0} y1={210} x2={0} y2={790} stroke="rgba(255,236,200,.4)" strokeWidth={4} />
            <rect x={-10} y={790 - 290 * mit} width={20} height={290 * mit} fill={C.ok} />
            {mit > 0.9 && <text x={40} y={640} fontSize={52} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">ARENA &gt; ½ · MUY BUENA</text>}
            <rect x={-10 + 70} y={790 - 290 - 160 * arc} width={20} height={0} fill={C.red} />
            {arc > 0.02 && <><rect x={50} y={790 - 450} width={20} height={160 * arc} fill={C.red} /><text x={90} y={790 - 360} fontSize={52} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed" opacity={arc}>ARCILLA &gt; ⅓ · ARCILLOSA</text></>}
          </g>
        </g>
        {t > m.carr && <g opacity={carr}><Carr x={1080} col="#e3c88f" w="1 DE ARENA" /><text x={1290} y={860} fontSize={80} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">+</text><Carr x={1480} col={CLARA} w="2 DE TIERRA" /></g>}
      </Svg>
      <Lbl t={t} at={m.mir} out={m.mit} text="tres capas" x={960} y={980} col={C.cream} size={76} />
    </>
  );
};

// 11 · el puño: tres manos abiertas. La que se desarma (cruz), la que chorrea (cruz) y la bola firme con la marca de los
// dedos que cae desde la cintura y se parte en cuatro (tilde). «la bola que se parte»
export const BolaSeParte: React.FC<FxP> = ({ t, m }) => {
  const cae = e(t, m.cae + 0.4, m.cae + 1.3), parte = t > m.cae + 1.3;
  const Mano: React.FC<{ x: number }> = ({ x }) => <g transform={`translate(${x},640)`}><path d="M-120,0 Q-130,-60 -90,-70 L90,-70 Q130,-60 120,0 Q60,60 -60,60 Z" fill="#d9a27a" />{[-80, -40, 0, 40].map((fx) => <rect key={fx} x={fx - 14} y={-130} width={30} height={80} rx={14} fill="#d9a27a" />)}</g>;
  return (
    <>
      <Svg>
        {t > m.roc && t < m.des && <g transform={`translate(1400,300)`}>{Array.from({ length: 14 }, (_, i) => { const ph = (t * 2 + hash(i, 1)) % 1; return <circle key={i} cx={-ph * 300} cy={ph * 200 * (hash(i, 2) - 0.3)} r={5} fill="#a9dcff" opacity={1 - ph} />; })}<rect x={-20} y={-40} width={80} height={110} rx={16} fill="#3f7d5a" /></g>}
        {t > m.des && <g opacity={e(t, m.des, m.des + 0.4)}><Mano x={380} />{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={380 + (hash(i, 3) - 0.5) * 220} cy={560 + e(t, m.des + 0.5, m.des + 1.5) * 200 * hash(i, 4)} r={10} fill={CLARA} />)}<Cross t={t} at={m.des + 1.2} x={380} y={360} r={44} /></g>}
        {t > m.sob && <g opacity={e(t, m.sob, m.sob + 0.4)}><Mano x={960} /><ellipse cx={960} cy={560} rx={90} ry={60} fill="#6a4a2c" />
          {Array.from({ length: 5 }, (_, i) => { const ph = (t * 1.2 + i * 0.2) % 1; return <ellipse key={i} cx={900 + i * 30} cy={700 + ph * 120} rx={8} ry={14} fill="#6a4a2c" opacity={1 - ph} />; })}<Cross t={t} at={m.sob + 1.2} x={960} y={360} r={44} /></g>}
        {t > m.jus && <g opacity={e(t, m.jus, m.jus + 0.4)}>
          {cae < 0.02 && <Mano x={1540} />}
          {!parte ? <g transform={`translate(1540,${lerp(560, 860, cae * cae)})`}><ellipse rx={90} ry={70} fill={CLARA} />{[-40, -10, 20, 50].map((x) => <path key={x} d={`M${x},-60 q8,50 0,110`} stroke="#7d5f3b" strokeWidth={6} fill="none" />)}</g>
            : [0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1540 + (i - 1.5) * 70 * e(t, m.cae + 1.3, m.cae + 1.7)},${880 - 30 * Math.sin(Math.PI * e(t, m.cae + 1.3, m.cae + 1.7)) * (i % 2 + 1)}) rotate(${i * 40})`}><path d="M-40,-30 L40,-34 L46,20 L-30,36 Z" fill={CLARA} /></g>)}
          {parte && <Tick t={t} at={m.cae + 1.8} x={1540} y={360} r={50} />}</g>}
        {t > m.jus && <line x1={1700} y1={560} x2={1700} y2={880} stroke="rgba(255,236,200,.4)" strokeWidth={4} strokeDasharray="10 8" opacity={e(t, m.cae, m.cae + 0.4)} />}
      </Svg>
      <Lbl t={t} at={m.des} out={m.sob} text="le falta agua" x={380} y={950} col={C.red} size={56} />
      <Lbl t={t} at={m.sob} out={m.jus} text="le sobra" x={960} y={950} col={C.red} size={56} />
      <Lbl t={t} at={m.ing} out={m.bola} text="humedad óptima" x={960} y={180} col={C.cream} size={70} />
      <Lbl t={t} at={m.bola} text="la bola que se parte" x={960} y={180} col={C.ok} size={82} />
    </>
  );
};

// 12 · el patio visto desde arriba: cuatro estacas clavan, el hilo da la vuelta; la línea del aerosol como alternativa;
// la tierra negra viaja en carretilla al cantero, donde brotan las plantas
export const EstacasHilo: React.FC<FxP> = ({ t, m }) => {
  const hil = e(t, m.est + 1, m.est + 3), aer = e(t, m.aer, m.aer + 1.4), saca = e(t, m.saca, m.saca + 2.5), can = e(t, m.can, m.can + 2.5);
  const P4: [number, number][] = [[460, 260], [1300, 260], [1300, 860], [460, 860]];
  const per = P4.map((p, i) => [p, P4[(i + 1) % 4]] as const);
  return (
    <>
      <Svg>
        <rect x={360} y={160} width={1040} height={800} rx={20} fill={saca > 0.5 ? CLARA : "#4f6b33"} />
        {saca > 0.02 && <rect x={460} y={260} width={840 * saca} height={600} fill={CLARA} />}
        {saca < 0.98 && Array.from({ length: 60 }, (_, i) => { const x = 380 + 1000 * hash(i, 1), y = 180 + 760 * hash(i, 2); return (x > 460 + 840 * saca || x < 460 || y < 260 || y > 860) && <path key={i} d={`M${x},${y} l-6,-16 M${x},${y} l5,-18`} stroke="#86a84c" strokeWidth={3} />; })}
        {P4.map(([x, y], i) => t > m.est + i * 0.25 && <g key={i} transform={`translate(${x},${y}) scale(${spr(t, m.est + i * 0.25)})`}><circle r={22} fill={MAD} stroke="#5e3a1c" strokeWidth={4} /></g>)}
        {per.map(([p, q], i) => { const k = cl(hil * 4 - i); return k > 0 && <line key={i} x1={p[0]} y1={p[1]} x2={lerp(p[0], q[0], k)} y2={lerp(p[1], q[1], k)} stroke="#ffd27a" strokeWidth={5} />; })}
        {aer > 0.02 && <rect x={480} y={280} width={800} height={560} fill="none" stroke="#ff5aa8" strokeWidth={10} strokeDasharray={`${2720 * aer} 4000`} opacity={0.9} />}
        {t > m.can - 0.5 && <g transform={`translate(${lerp(900, 1600, e(t, m.can - 0.5, m.can + 1))},560)`}><path d="M-110,-60 L110,-60 L80,20 L-80,20 Z" fill="#5c7a8c" /><ellipse cy={-62} rx={110} ry={34} fill={NEGRA} opacity={1 - e(t, m.can + 1, m.can + 1.4)} /><circle cy={50} r={30} fill="#222" /></g>}
        <g transform="translate(1620,800)"><rect x={-180} y={-80} width={360} height={160} rx={20} fill="#6b4a2b" /><rect x={-160} y={-70} width={320} height={50} fill={NEGRA} opacity={0.4 + 0.6 * can} />
          {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${-130 + i * 52},-70) scale(${e(t, m.can + 1.4 + i * 0.15, m.can + 2.2 + i * 0.15)})`}><path d="M0,0 Q-24,-50 0,-80 Q24,-50 0,0" fill="#7fbf4d" /><path d="M0,0 Q30,-30 44,-50" stroke="#5c9a36" strokeWidth={5} fill="none" /></g>)}</g>
      </Svg>
      <Lbl t={t} at={m.est} out={m.aer} text="cuatro estacas y un hilo" x={880} y={1010} col={C.cream} size={60} />
      <Lbl t={t} at={m.can} text="la negra va al cantero" x={880} y={1010} col={C.ok} size={60} />
    </>
  );
};

// 13 · la pendiente en elevación: la casa a la izquierda, el patio baja hacia la rejilla; si queda plano, el charco se
// queda; con caída la gota rueda lejos de la casa; el hilo tirante entre estacas baja 2 cm por metro con su regla
export const CaidaDosCm: React.FC<FxP> = ({ t, m }) => {
  const caida = e(t, m.caida - 0.3, m.caida + 1.2), drop = t > m.caida + 1 ? ((t - m.caida - 1) * 0.35) % 1 : -1, casa = e(t, m.casa, m.casa + 0.5), hil = e(t, m.hilo, m.hilo + 1.5), baja = e(t, m.baja, m.baja + 1.5);
  const y0 = 640, y1 = y0 + 90 * caida, X0 = 480, X1 = 1700;
  const yAt = (x: number) => lerp(y0, y1, (x - X0) / (X1 - X0));
  return (
    <>
      <Svg>
        <rect x={160} y={260} width={320} height={420} fill="#a89377" /><polygon points="140,270 320,140 500,270" fill="#7a4b2c" /><rect x={260} y={460} width={110} height={220} fill="#6b4a2b" />
        <polygon points={`${X0},${y0} ${X1},${y1} ${X1},${y1 + 70} ${X0},${y0 + 70}`} fill={SC} />
        <polygon points={`${X0},${y0 + 70} ${X1},${y1 + 70} ${X1},980 ${X0},980`} fill={CLARA} />
        <rect x={X1 + 10} y={y1} width={110} height={30} fill="#3c4246" />{[0, 1, 2, 3].map((i) => <rect key={i} x={X1 + 20 + i * 24} y={y1 + 4} width={10} height={22} fill="#1d2124" />)}
        {t > m.plano && caida < 0.5 && <ellipse cx={1000} cy={y0 - 4} rx={240 * e(t, m.plano, m.plano + 1.5)} ry={12} fill="#7cc8ff" opacity={0.75} />}
        {drop >= 0 && <circle cx={lerp(560, X1 + 60, drop)} cy={yAt(lerp(560, X1, drop)) - 22} r={20} fill="#7cc8ff" />}
        {casa > 0.02 && <g opacity={casa}><path d="M900,520 L560,520" stroke={C.red} strokeWidth={12} markerEnd="" /><polygon points="540,520 590,494 590,546" fill={C.red} /><Cross t={t} at={m.casa + 0.3} x={720} y={460} r={46} /></g>}
        {hil > 0.02 && <g opacity={hil}><Estaca x={560} y={y0} h={260} /><Estaca x={1600} y={yAt(1600)} h={260} />
          <line x1={560} y1={y0 - 200} x2={lerp(560, 1600, hil)} y2={y0 - 200 + (yAt(1600) - y0) * baja * hil} stroke="#ffd27a" strokeWidth={5} />
          {baja > 0.02 && Array.from({ length: 5 }, (_, i) => <g key={i} opacity={baja}><line x1={560 + (i + 1) * 208} x2={560 + (i + 1) * 208} y1={y0 - 230} y2={y0 - 200 + (yAt(1600) - y0) * (i + 1) / 5} stroke="rgba(255,236,200,.4)" strokeWidth={3} /><text x={560 + (i + 1) * 208} y={y0 - 240} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.cream} fontFamily="Barlow">{`${(i + 1) * 2} cm`}</text></g>)}</g>}
      </Svg>
      <Lbl t={t} at={m.pen} out={m.caida} text="la pendiente" x={1100} y={200} col={C.cream} size={80} />
      <Lbl t={t} at={m.caida} out={m.hilo} text="1,5 a 2 cm por metro" x={1100} y={200} col={C.honey} size={72} />
    </>
  );
};

// 14 · el fondo firme: el pisón golpea el fondo en corte y lo aprieta (la capa baja y se cierra); al costado, el que
// quedó flojo: la losa se hunde en el medio y se quiebra
export const FondoFirme: React.FC<FxP> = ({ t, m }) => {
  const golpes = Math.max(0, Math.min(8, Math.floor((t - m.pis) / 0.55))), lift = t > m.pis && golpes < 8 ? Math.abs(Math.sin(((t - m.pis) / 0.55) * Math.PI)) : 0;
  const comp = golpes / 8, flo = e(t, m.flo, m.flo + 2);
  return (
    <>
      <Svg>
        <g transform={`translate(${-420 * e(t, m.flo - 0.4, m.flo + 0.4)},0)`}>
          <Capas x={360} y={940} w={760} capas={[{ h: 260 - 40 * comp, k: 1, tipo: comp > 0.5 ? "base" : "clara" }]} />
          {t > m.pis && <Pison x={360 + 760 * (0.15 + 0.7 * (golpes / 8))} y={680 + 40 * comp} s={0.9} lift={lift} />}
          {t > m.placa && <g transform={`translate(${740 + 20 * Math.sin(t * 40)},${640})`} opacity={e(t, m.placa, m.placa + 0.5) * (1 - flo)}><rect x={-150} y={-30} width={300} height={40} rx={6} fill="#d8a23a" /><rect x={-80} y={-110} width={160} height={80} rx={14} fill="#c9781f" /><line x1={60} y1={-100} x2={180} y2={-260} stroke="#3a3a3a" strokeWidth={14} /></g>}
        </g>
        {flo > 0.02 && <g opacity={flo} transform={`translate(${lerp(1600, 1080, flo)},0)`}>
          <path d={`M0,${620} Q380,${620 + 120 * flo} 760,${620} L760,${680} Q380,${680 + 120 * flo} 0,${680} Z`} fill={SC} />
          <path d={`M0,${680} Q380,${680 + 120 * flo} 760,${680} L760,940 L0,940 Z`} fill={CLARA} opacity={0.7} />
          <path d={`M380,${660 + 120 * flo} l-14,-40 l20,-20`} stroke="#2b221a" strokeWidth={6} fill="none" opacity={e(t, m.flo + 1.4, m.flo + 2)} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.pis} out={m.flo} text="el fondo, firme" x={740} y={240} col={C.cream} size={76} />
      <Lbl t={t} at={m.flo} text="flojo: se hunde" x={1460} y={240} col={C.red} size={76} />
    </>
  );
};

// 15 · el encofrado desde arriba: las cuatro tablas de canto llegan de a una y quedan firmes con sus estacas del lado de
// afuera; un recuadro chico muestra de costado que el borde de arriba sigue la pendiente
export const TablasCanto: React.FC<FxP> = ({ t, m }) => {
  const T4: [number, number, number, number][] = [[460, 240, 1000, 24], [1436, 240, 24, 600], [460, 816, 1000, 24], [460, 240, 24, 600]];
  const gui = e(t, m.guia, m.guia + 1.5);
  return (
    <>
      <Svg>
        <rect x={400} y={190} width={1120} height={700} rx={16} fill={CLARA} />
        {T4.map(([x, y, w, h], i) => { const at = m.tab + i * 0.5, k = spr(t, at); return t > at && <g key={i} transform={`translate(${(1 - k) * (i % 2 ? 600 : -600)},0)`}><rect x={x} y={y} width={w} height={h} fill={MAD} stroke="#5e3a1c" strokeWidth={3} /></g>; })}
        {t > m.est && Array.from({ length: 12 }, (_, i) => { const side = Math.floor(i / 3), j = i % 3, at = m.est + i * 0.12; const [x, y] = side === 0 ? [600 + j * 360, 214] : side === 1 ? [1486, 360 + j * 200] : side === 2 ? [600 + j * 360, 866] : [434, 360 + j * 200]; return t > at && <rect key={i} x={x - 12} y={y - 12} width={24} height={24} fill="#5e3a1c" transform={`scale(1)`} opacity={spr(t, at)} />; })}
        {gui > 0.02 && <g opacity={gui} transform="translate(960,560)">
          <rect x={-380} y={-170} width={760} height={340} rx={24} fill="rgba(30,20,10,.88)" stroke="rgba(255,236,200,.4)" strokeWidth={3} />
          <polygon points="-320,-20 320,30 320,90 -320,40" fill={MAD} /><line x1={-320} y1={-60} x2={320} y2={-10} stroke="#ffd27a" strokeWidth={4} strokeDasharray="12 8" />
          <text y={140} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">EL BORDE SIGUE LA PENDIENTE</text></g>}
      </Svg>
      <Lbl t={t} at={m.tab} out={m.guia} text="tablas de canto" x={960} y={980} col={C.cream} size={72} />
      <Lbl t={t} at={m.guia} text="molde y guía" x={960} y={980} col={C.honey} size={72} />
    </>
  );
};

// 16 · el espesor: dos cortes, 10 cm para el patio (persona, silla, bici) y 15 para la entrada (camioneta); después la
// mezcla suelta de 14 cm baja aplastada por el pisón hasta 10: un tercio menos
export const DiezQuince: React.FC<FxP> = ({ t, m }) => {
  const f2 = e(t, m.baja - 0.4, m.baja + 0.2), aplasta = e(t, m.tre + 0.8, m.tre + 2.4), cor = e(t, m.cor, m.cor + 1);
  return (
    <>
      <Svg>
        <g opacity={1 - f2}>
          {t > m.pat && <g transform={`scale(${spr(t, m.pat) * 0 + 1})`} opacity={e(t, m.pat, m.pat + 0.5)}>
            <Capas x={260} y={820} w={600} capas={[{ h: 160, k: 1, tipo: "clara" }, { h: 100, k: e(t, m.pat + 0.3, m.pat + 1.2), tipo: "sc" }]} />
            <Persona x={420} y={560} s={1.2} /><g transform="translate(700,560)"><circle cx={-60} cy={-40} r={40} fill="none" stroke="#2a3640" strokeWidth={8} /><circle cx={60} cy={-40} r={40} fill="none" stroke="#2a3640" strokeWidth={8} /><path d="M-60,-40 L0,-90 L60,-40 M0,-90 L-10,-120" stroke={C.red} strokeWidth={8} fill="none" /></g>
            <text x={560} y={900} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">10 CM</text></g>}
          {t > m.auto && <g opacity={e(t, m.auto, m.auto + 0.5)}>
            <Capas x={1060} y={820} w={600} capas={[{ h: 110, k: 1, tipo: "clara" }, { h: 150, k: e(t, m.auto + 0.3, m.auto + 1.2), tipo: "sc" }]} />
            <Camioneta x={1360} y={560} s={0.7} />
            <text x={1360} y={900} textAnchor="middle" fontSize={64} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">15 CM</text></g>}
        </g>
        {f2 > 0.02 && <g opacity={f2}>
          <Capas x={560} y={860} w={800} capas={[{ h: 120, k: 1, tipo: "clara" }, { h: lerp(196, 140, aplasta), k: 1, tipo: "sc", moj: 0.4 }]} />
          {t > m.tre + 0.6 && <Pison x={960} y={860 - 120 - lerp(196, 140, aplasta)} s={1.0} lift={aplasta < 1 ? Math.abs(Math.sin((t - m.tre) * 6)) * 0.3 : 0} />}
          <g transform="translate(1440,0)"><line x1={0} y1={740} x2={0} y2={740 - lerp(196, 140, aplasta)} stroke={C.honey} strokeWidth={6} />
            <text x={30} y={740 - lerp(196, 140, aplasta) / 2 + 20} fontSize={60} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{aplasta < 0.5 ? "13-14 CM SUELTA" : "10 CM"}</text></g>
          {cor > 0.02 && <path d="M760,600 l40,60 l-30,40 l50,40" stroke={C.red} strokeWidth={8} fill="none" opacity={cor} />}
        </g>}
      </Svg>
      <Lbl t={t} at={m.baja} out={m.cor} text="baja un tercio" x={960} y={230} col={C.cream} size={84} />
      <Lbl t={t} at={m.cor} text="corto = finito y se rompe" x={960} y={230} col={C.red} size={68} />
    </>
  );
};
