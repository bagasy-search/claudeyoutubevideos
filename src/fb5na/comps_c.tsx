// fb5na · componentes 26-37 (vinagre, el cristal, pared húmeda, la crema, la trama, el curado, las semanas, la pintura
// que respira, cuándo romper, silicato, el caso completo y la rutina)
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, num, shake } from "./kit";
import { Ampollas, CRIS, Corte, H2O, LAD, LAD2, Mancha, Muro, Nube, Reloj, Salitre } from "./pared";

// 26 · el balde de vinagre: medio litro de la botella cae en 5 L (el nivel sube y se tiñe apenas); la esponja frota la
// pared y los cristalitos de sal se deshacen en burbujas; un reloj de 10 minutos y el enjuague
export const VinagreBalde: React.FC<FxP> = ({ t, a, m }) => {
  const ver = e(t, a + 0.8, a + 3), neut = e(t, m.neut, m.neut + 2.4), diez = e(t, m.diez, m.diez + 3);
  const lv = 0.55 + 0.06 * ver;
  return (
    <>
      <Svg>
        <g transform="translate(560,700)">
          <path d="M-200,-240 L200,-240 L170,200 L-170,200 Z" fill="#c9cdd2" stroke="#5e6670" strokeWidth={5} />
          <path d={`M${-200 + 30 * (1 - lv)},${200 - 440 * lv} L${200 - 30 * (1 - lv)},${200 - 440 * lv} L170,200 L-170,200 Z`} fill={`rgba(${lerp(140, 196, ver)},${lerp(200, 196, ver)},${lerp(240, 170, ver)},.75)`} />
          <text x={0} y={140} textAnchor="middle" fontSize={56} fontWeight={800} fill="#2b3a46" fontFamily="Barlow Condensed">5 L</text>
        </g>
        <g transform={`translate(${560 + 120},${380 - 60 * (1 - spr(t, a + 0.4))}) rotate(${-lerp(0, 110, e(t, a + 0.6, a + 1.4)) * (1 - e(t, a + 3, a + 3.6))})`} opacity={1 - e(t, a + 3.4, a + 3.8)}>
          <rect x={-40} y={-160} width={80} height={200} rx={18} fill="rgba(230,240,240,.85)" stroke="#8d969c" strokeWidth={4} /><rect x={-16} y={-200} width={32} height={44} fill="#c43b2c" /><rect x={-40} y={-100} width={80} height={60} fill="#f6f1e6" /><text x={0} y={-60} textAnchor="middle" fontSize={22} fontWeight={800} fill="#2b241b" fontFamily="Barlow">VINAGRE</text>
        </g>
        {t > a + 0.9 && t < a + 3 && Array.from({ length: 8 }, (_, i) => { const u = ((t - a) * 2 + i / 8) % 1; return <circle key={i} cx={560 + 40 + 30 * u} cy={300 + 200 * u} r={7} fill="rgba(240,230,190,.9)" />; })}
        <Muro x={980} y={220} w={720} h={620}>
          {Array.from({ length: 34 }, (_, i) => { const x = 1010 + 660 * hash(i, 201), y = 260 + 520 * hash(i, 202), k = cl(1 - neut * 1.4 + hash(i, 203) * 0.4); return <g key={i}>
            <rect x={x - 6} y={y - 6} width={12 * k} height={12 * k} fill="#fbfaf6" transform={`rotate(45 ${x} ${y})`} />
            {neut > 0 && k < 0.9 && <circle cx={x} cy={y - 30 * (1 - k)} r={6 * (1 - k)} fill="none" stroke="#d9f3ff" strokeWidth={2} opacity={k} />}
          </g>; })}
        </Muro>
        {neut > 0 && diez < 0.2 && <g transform={`translate(${1340 + 240 * Math.sin(t * 3)},${520 + 160 * Math.cos(t * 2.3)}) rotate(${15 * Math.sin(t * 4)})`}><rect x={-80} y={-50} width={160} height={100} rx={22} fill="#e7d55a" /><rect x={-80} y={20} width={160} height={30} rx={10} fill="#3d8a4a" /></g>}
        {diez > 0 && <Reloj x={1340} y={530} r={140} k={diez} col={C.solv} />}
      </Svg>
      <Lbl t={t} at={a + 1} out={m.neut} text="medio litro en 5 L" x={560} y={960} col={C.cream} size={58} />
      <Lbl t={t} at={m.neut + 0.4} out={m.diez} text="neutraliza las sales" x={1340} y={140} col={C.solv} size={62} />
      <Lbl t={t} at={m.diez + 0.4} text="10 minutos y enjuague" x={1340} y={140} col={C.honey} size={62} />
    </>
  );
};

// 27 · el corazón: el revoque en corte, ampliado hasta ver sus caminitos (tubos); el agua corre por ellos; al tocarla
// el cristalizante, los cristales crecen dentro de cada tubo y lo cierran; el vapor (puntitos blancos) sigue pasando
export const CristalPoros: React.FC<FxP> = ({ t, a, m }) => {
  const cr = e(t, m.crecen - 2, m.crecen + 2.2), vap = e(t, m.vapor, m.vapor + 1);
  const N = 6, Y = (i: number) => 300 + i * 100;
  return (
    <>
      <Svg>
        <rect x={360} y={240} width={1200} height={620} rx={30} fill={C.cem} stroke={C.cem2} strokeWidth={4} />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={380 + 1160 * hash(i, 211)} cy={260 + 580 * hash(i, 212)} r={4 + 10 * hash(i, 213)} fill="#b4ae9f" />)}
        {Array.from({ length: N }, (_, i) => { const d = `M360,${Y(i)} C 600,${Y(i) - 40 + 30 * hash(i, 1)} 900,${Y(i) + 40} 1180,${Y(i) - 20} S 1450,${Y(i) + 30} 1560,${Y(i)}`;
          return <g key={i}>
            <path d={d} stroke="#4b4639" strokeWidth={38} fill="none" strokeLinecap="round" />
            <path d={d} stroke="#6c6656" strokeWidth={28} fill="none" />
            <path d={d} stroke={H2O} strokeWidth={18} fill="none" strokeDasharray="24 30" strokeDashoffset={-t * 120} opacity={1 - cr} />
            {/* cristales que crecen desde la izquierda (la cara de adentro) */}
            {Array.from({ length: 12 }, (_, k) => { const g = cl(cr * 1.5 - k / 14); if (g <= 0) return null; const x = 400 + k * 46, y = Y(i) + (k % 2 ? 6 : -6); return <path key={k} d={`M${x},${y - 18 * g} L${x + 11 * g},${y} L${x},${y + 18 * g} L${x - 11 * g},${y} Z`} fill={CRIS} stroke="#7fc6ec" strokeWidth={1.5} />; })}
            {vap > 0 && Array.from({ length: 4 }, (_, k) => { const u = ((t * 0.35 + k / 4 + i * 0.11) % 1); return <circle key={"v" + k} cx={lerp(1560, 340, u)} cy={Y(i) - 4} r={4} fill="#fff" opacity={vap * (1 - u * 0.3)} />; })}
          </g>; })}
        <text x={300} y={560} textAnchor="end" fontSize={40} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={0.85}>ADENTRO</text>
        <text x={1620} y={560} fontSize={40} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={0.85}>MURO</text>
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.crecen - 0.3} text="los caminitos del agua" x={960} y={150} col={H2O} size={64} />
      <Lbl t={t} at={m.crecen} out={m.vapor} text="cristales que los tapan" x={960} y={150} col={CRIS} size={64} />
      <Lbl t={t} at={m.vapor + 0.3} text="el vapor sigue saliendo" x={960} y={150} col={C.ink} size={64} />
    </>
  );
};

// 28 · húmeda, sí: dos paredes y dos pinceladas; en la seca el material queda gris opaco y se cuartea; en la húmeda
// (el pulverizador le tira niebla antes) brilla y nacen los cristales. El tilde va a la húmeda
export const ParedHumedaSi: React.FC<FxP> = ({ t, a, m }) => {
  const seca = e(t, m.seca, m.seca + 1.6), pulv = e(t, m.pulv, m.pulv + 1.4), pin = e(t, m.pulv + 1.6, m.pulv + 3.2);
  return (
    <>
      <Svg>
        {[0, 1].map((i) => <g key={i} transform={`translate(${i ? 1280 : 640},560)`}>
          <rect x={-300} y={-300} width={600} height={600} fill={i ? `rgb(${lerp(217, 168, pulv)},${lerp(210, 162, pulv)},${lerp(195, 150, pulv)})` : "#e0d9c9"} stroke="#8d887e" strokeWidth={3} />
          {i === 0 && <><rect x={-240} y={-60} width={480 * seca} height={120} fill="#b0aca4" />{seca > 0.8 && [0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${-200 + k * 100},-60 l 20,40 l -14,40 l 18,40`} stroke="#6f6b62" strokeWidth={3} fill="none" />)}</>}
          {i === 1 && <><rect x={-240} y={-60} width={480 * pin} height={120} fill="#8f8a80" />{Array.from({ length: 14 }, (_, k) => { const g = cl(pin * 2 - 1 - k / 20); return g > 0 ? <path key={k} d={`M${-220 + k * 34},${-10 - 10 * g} l ${8 * g},${10 * g} l ${-8 * g},${10 * g} l ${-8 * g},${-10 * g} Z`} fill={CRIS} /> : null; })}<rect x={-240} y={-60} width={480 * pin} height={20} fill="rgba(255,255,255,.25)" /></>}
        </g>)}
        {pulv > 0 && pulv < 1 && <g transform="translate(1600,320) scale(-1,1)"><rect x={-40} y={-30} width={140} height={80} rx={20} fill="#2f8a4a" /><rect x={-20} y={50} width={60} height={160} rx={16} fill="#2f8a4a" opacity={0.9} /><rect x={-90} y={-14} width={60} height={20} fill="#555" />{Array.from({ length: 16 }, (_, k) => { const u = ((t * 2 + k / 16) % 1); return <circle key={k} cx={-100 - 300 * u} cy={-6 + (k - 8) * 18 * u} r={4 + 3 * u} fill="rgba(200,230,255,.7)" opacity={1 - u} />; })}</g>}
        {seca > 0.9 && <Cross t={t} at={m.seca + 1.6} x={640} y={180} r={48} />}
        <Tick t={t} at={m.pulv + 3.2} x={1280} y={180} r={48} />
      </Svg>
      <Lbl t={t} at={m.seca + 0.3} text="seca: no cristaliza" x={640} y={950} col={C.red} size={60} />
      <Lbl t={t} at={m.pulv + 0.4} text="mojás justo antes" x={1280} y={950} col={C.solv} size={60} />
    </>
  );
};

// 29 · la crema: la bolsa de 4 kg y el litro de agua en la balanza de proporción (3 a 1); el taladro gira la paleta
// despacio, la superficie pasa de grumosa a lisa (crema espesa); 3 min de reposo, se vuelve a mezclar, y el reloj
// de media hora se va poniendo rojo
export const CremaMezcla: React.FC<FxP> = ({ t, a, m }) => {
  const mez = e(t, m.tal - 2, m.repo), rep = t > m.repo && t < m.repo + 3, rel = e(t, m.media, m.media + 4);
  return (
    <>
      <Svg>
        {/* proporción */}
        <g transform="translate(460,520)" opacity={1 - e(t, m.tal - 1.2, m.tal - 0.4) * 0.6}>
          <rect x={-210} y={-60} width={420} height={18} rx={9} fill="#8d887e" transform={`rotate(${8 * (1 - spr(t, a + 2.2))})`} />
          <path d="M-20,-42 L20,-42 L0,10 Z" fill="#5e5547" /><rect x={-60} y={10} width={120} height={20} fill="#5e5547" />
          <g transform={`translate(-150,${-200 + 40 * (1 - spr(t, a + 0.6))})`}><path d="M-80,-60 L80,-60 L90,120 L-90,120 Z" fill="#9aa0a6" /><text x={0} y={50} textAnchor="middle" fontSize={52} fontWeight={800} fill="#fff" fontFamily="Barlow Condensed">4 kg</text></g>
          <g transform={`translate(150,${-170 + 40 * (1 - spr(t, a + 1.4))})`}><rect x={-44} y={-60} width={88} height={150} rx={16} fill="rgba(170,215,245,.75)" stroke="#6fa8cc" strokeWidth={4} /><text x={0} y={30} textAnchor="middle" fontSize={44} fontWeight={800} fill="#14202a" fontFamily="Barlow Condensed">1 L</text></g>
        </g>
        {/* balde */}
        <g transform="translate(1200,700)">
          <path d="M-220,-200 L220,-200 L190,200 L-190,200 Z" fill="#4b78a8" stroke="#2b3a46" strokeWidth={5} />
          <ellipse cx={0} cy={-200} rx={220} ry={50} fill="#9a958b" stroke="#2b3a46" strokeWidth={4} />
          {Array.from({ length: 22 }, (_, i) => { const k = 1 - mez; const ang = hash(i, 221) * 6.28 + t * (rep ? 0 : 2); const r = 180 * Math.sqrt(hash(i, 222)); return k > 0.05 ? <circle key={i} cx={r * Math.cos(ang)} cy={-200 + 0.24 * r * Math.sin(ang)} r={6 + 12 * k * hash(i, 223)} fill="#7f7a70" /> : null; })}
          {mez > 0.6 && <ellipse cx={-60} cy={-214} rx={90} ry={10} fill="rgba(255,255,255,.25)" />}
          {!rep && t > m.tal - 2 && <g transform="translate(0,-210)"><rect x={-10} y={-300} width={20} height={300} fill="#5a5f66" /><g transform={`scale(${Math.cos(t * 8)},1)`}><rect x={-70} y={-12} width={140} height={14} fill="#9aa4ab" /></g><rect x={-80} y={-420} width={160} height={130} rx={22} fill="#c43b2c" /><rect x={60} y={-380} width={100} height={40} rx={12} fill="#2b241b" /></g>}
        </g>
        {rel > 0 && <g transform="translate(1660,360)"><Reloj x={0} y={0} r={120} k={0.5 * rel} col={rel > 0.7 ? C.red : C.honey} /></g>}
      </Svg>
      <Lbl t={t} at={a + 2.4} out={m.tal - 0.4} text="3 de polvo, 1 de agua" x={460} y={850} col={C.cream} size={58} />
      <Lbl t={t} at={m.tal + 0.3} out={m.repo} text="crema espesa, sin grumos" x={1200} y={1000} col={C.cream} size={58} />
      <Lbl t={t} at={m.repo + 0.3} out={m.media} text="reposa y volvés a mezclar" x={1200} y={1000} col={C.honey} size={56} />
      <Lbl t={t} at={m.media + 0.3} text="usala en media hora" x={1200} y={1000} col={C.red} size={60} />
    </>
  );
};

// 30 · la trama: primera mano en horizontal deja poros sin tapar (puntos oscuros); la vertical cruza y los cubre; en
// mucha agua, la tercera otra vez horizontal. Visto como tela con lupa
export const TramaCruzada: React.FC<FxP> = ({ t, a, m }) => {
  const h1 = e(t, a + 0.2, m.poro - 0.6), v = e(t, m.poro, m.poro + 2.4), h3 = e(t, m.tercera, m.tercera + 2.2);
  const X0 = 560, Y0 = 220, S = 800;
  return (
    <>
      <Svg>
        <rect x={X0} y={Y0} width={S} height={S * 0.8} fill="#cfc8b8" />
        {Array.from({ length: 10 }, (_, r) => <rect key={"h" + r} x={X0} y={Y0 + r * 64 + 4} width={S * cl(h1 * 10 - r)} height={50} fill="#8f8a80" opacity={0.9} />)}
        {Array.from({ length: 12 }, (_, i) => { const x = X0 + 40 + (S - 80) * hash(i, 231), y = Y0 + 50 + (S * 0.8 - 100) * hash(i, 232); const cov = v > hash(i, 233) ? 1 : 0; return <g key={i}><circle cx={x} cy={y} r={14} fill="#3a352c" opacity={h1 * (1 - cov)} /><circle cx={x} cy={y} r={30 * spr(t, m.poro + hash(i, 233) * 2.4)} fill="none" stroke={C.ok} strokeWidth={4} opacity={cov * (1 - e(t, m.poro + 2.6, m.poro + 3.4))} /></g>; })}
        {Array.from({ length: 13 }, (_, c) => <rect key={"v" + c} x={X0 + c * 62 + 4} y={Y0} width={46} height={S * 0.8 * cl(v * 13 - c)} fill="#7f7a70" opacity={0.75} />)}
        {Array.from({ length: 10 }, (_, r) => <rect key={"t" + r} x={X0} y={Y0 + r * 64 + 20} width={S * cl(h3 * 10 - r)} height={30} fill="#77726a" opacity={0.7} />)}
      </Svg>
      <Lbl t={t} at={a + 0.4} out={m.poro} text="primera: horizontal" x={960} y={950} col={C.cream} size={60} />
      <Lbl t={t} at={m.poro + 0.4} out={m.tercera} text="la vertical tapa lo que quedó" x={960} y={950} col={C.ok} size={56} />
      <Lbl t={t} at={m.tercera + 0.3} text="mucha agua: una tercera" x={960} y={950} col={C.honey} size={58} />
    </>
  );
};

// 31 · el curado: un calendario de tres días con tres soles chicos por día (2-3 rociadas); cada rociada hace avanzar
// los cristales hacia adentro; si se saltea, el cristal queda «a mitad de camino»; ventilador, estufa y sol, tachados
export const CuradoNiebla: React.FC<FxP> = ({ t, a, m }) => {
  const dias = e(t, a + 1.4, m.mitad - 0.6), mit = e(t, m.mitad, m.mitad + 1), nada = e(t, m.nada, m.nada + 1);
  const n = Math.floor(dias * 8.99);
  return (
    <>
      <Svg>
        {[0, 1, 2].map((d) => <g key={d} transform={`translate(${380 + d * 260},300)`} opacity={1 - nada * 0.6}>
          <rect x={-110} y={-90} width={220} height={240} rx={18} fill="#f6f1e6" stroke="#5e5547" strokeWidth={4} /><rect x={-110} y={-90} width={220} height={50} rx={18} fill={C.solv} />
          <text x={0} y={-52} textAnchor="middle" fontSize={34} fontWeight={800} fill="#14202a" fontFamily="Barlow Condensed">DÍA {d + 1}</text>
          {[0, 1, 2].map((k) => { const on = n > d * 3 + k; return <g key={k} transform={`translate(${-60 + k * 60},50)`}><circle r={22} fill={on ? H2O : "#e0dbcf"} />{on && <circle r={30 * spr(t, a + 1.4 + (d * 3 + k) * (m.mitad - 2 - a) / 9)} fill="none" stroke={H2O} strokeWidth={3} />}</g>; })}
        </g>)}
        <g transform="translate(1340,520)">
          <Corte t={t} x={-220} y={-260} w={440} h={520} agua={0.6} cris={t < m.mitad ? 0.2 + 0.8 * dias : 0.35} poros={false} />
          {mit > 0 && <><rect x={-220} y={-260} width={70} height={520} fill="rgba(240,169,58,.0)" stroke={C.red} strokeWidth={5} strokeDasharray="12 8" opacity={mit} /></>}
        </g>
        {nada > 0 && [["vent", 380], ["estufa", 640], ["sol", 900]].map(([k, x], i) => <g key={i} transform={`translate(${x},740) scale(${spr(t, m.nada + i * 0.25)})`}>
          {k === "vent" && <g><circle r={60} fill="none" stroke="#c9ccd0" strokeWidth={8} />{[0, 1, 2].map((j) => <ellipse key={j} rx={50} ry={16} fill="#c9ccd0" transform={`rotate(${j * 120 + t * 200})`} />)}</g>}
          {k === "estufa" && <g><rect x={-60} y={-50} width={120} height={100} rx={12} fill="#7b7f86" />{[0, 1, 2].map((j) => <rect key={j} x={-44} y={-34 + j * 28} width={88} height={14} rx={7} fill="#ff6a2a" />)}</g>}
          {k === "sol" && <g><circle r={36} fill={C.sun} />{Array.from({ length: 8 }, (_, j) => <line key={j} x1={0} y1={-48} x2={0} y2={-66} stroke={C.sun} strokeWidth={6} transform={`rotate(${j * 45})`} />)}</g>}
          <Cross t={t} at={m.nada + 0.4 + i * 0.25} x={0} y={0} r={56} />
        </g>)}
      </Svg>
      <Lbl t={t} at={a + 0.8} out={m.mitad} text="niebla, 2 o 3 veces al día" x={640} y={130} col={H2O} size={56} />
      <Lbl t={t} at={m.mitad + 0.2} text="se seca rápido: a mitad de camino" x={1340} y={890} col={C.red} size={40} />
      <Lbl t={t} at={m.nada + 0.4} text="que se cure despacio" x={640} y={900} col={C.cream} size={56} />
    </>
  );
};

// 32 · las semanas: línea de tiempo que avanza bajo la pared; día 1 oscura (mojada del curado), semana 1 se aclara desde
// arriba, la pelusa de salitre aparece en un punto y el cepillo la saca, y a las 3-4 semanas, tras la nube, sigue seca
export const AclaraArriba: React.FC<FxP> = ({ t, a, m }) => {
  const sem = e(t, m.sem, m.sem + 8), pel = e(t, m.pelusa, m.pelusa + 1.2), cep = e(t, m.pelusa + 4, m.pelusa + 6), lluv = e(t, m.pelusa + 9, m.pelusa + 11);
  const top = 220 + 560 * sem;
  return (
    <>
      <Svg>
        <Muro x={500} y={220} w={920} h={560}>
          <rect x={500} y={top} width={920} height={Math.max(0, 780 - top - 46)} fill="rgba(58,74,82,.55)" />
          <Salitre x={980} y={560} w={120} k={pel * (1 - cep)} />
        </Muro>
        {cep > 0 && cep < 1 && <g transform={`translate(${1040 + 60 * Math.sin(t * 10)},530)`}><rect x={-70} y={-24} width={140} height={48} rx={10} fill="#a46a3a" />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={-60 + i * 17} y1={24} x2={-60 + i * 17} y2={48} stroke="#2b241b" strokeWidth={4} />)}</g>}
        {lluv > 0 && <Nube t={t} x={1600} y={260} s={0.8} k={lluv} />}
        <line x1={500} y1={900} x2={1420} y2={900} stroke="rgba(255,236,200,.4)" strokeWidth={6} />
        <line x1={500} y1={900} x2={500 + 920 * e(t, a, m.pelusa + 12)} y2={900} stroke={C.honey} strokeWidth={8} />
        {["día 1", "semana 1", "pelusa", "semana 4"].map((s, i) => <g key={i}><circle cx={500 + i * 306} cy={900} r={12} fill={C.honey} /><text x={500 + i * 306} y={960} textAnchor="middle" fontSize={32} fontWeight={700} fill={C.cream} fontFamily="Barlow">{s}</text></g>)}
        {lluv > 0.8 && <Tick t={t} at={m.pelusa + 11} x={1600} y={520} r={56} />}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={m.sem} text="oscura: es el curado" x={960} y={130} col={C.cream} size={62} />
      <Lbl t={t} at={m.sem + 0.4} out={m.pelusa} text="se aclara desde arriba" x={960} y={130} col={C.sun} size={64} />
      <Lbl t={t} at={m.pelusa + 0.4} out={m.pelusa + 8} text="pelusa: cepillo en seco" x={960} y={130} col={C.cream} size={60} />
      <Lbl t={t} at={m.pelusa + 11.4} text="«Claudio, no se mojó»" x={960} y={130} col={C.ok} size={66} />
    </>
  );
};

// 33 · la pintura que respira: tres latas sobre la pared tratada; con el látex el vapor choca contra una película y
// vuelve; con la cal y el silicato pasa (los puntitos atraviesan) — el silicato además se «mete» en el revoque
export const PinturaRespira: React.FC<FxP> = ({ t, a, m }) => {
  const opts = [{ n: "látex", at: a + 0.4, col: "#f3f0ea", pasa: false }, { n: "a la cal", at: m.cal, col: "#fbfaf4", pasa: true }, { n: "silicato", at: m.sili, col: "#e7ecee", pasa: true }];
  return (
    <>
      <Svg>
        {opts.map((o, i) => { const x = 380 + i * 580, k = e(t, o.at, o.at + 0.8); return <g key={i} opacity={0.25 + 0.75 * k}>
          <rect x={x - 220} y={300} width={110} height={480} fill={C.cem} />
          <rect x={x - 110} y={300} width={22} height={480} fill={o.col} stroke={o.pasa ? "none" : "#c9c4b8"} strokeWidth={3} />
          {i === 2 && <rect x={x - 140} y={300} width={30} height={480} fill="rgba(231,236,238,.6)" />}
          {Array.from({ length: 7 }, (_, j) => { const u = ((t * 0.5 + j / 7) % 1), y = 330 + j * 66; const bx = o.pasa ? lerp(x - 200, x + 120, u) : (u < 0.5 ? lerp(x - 200, x - 116, u * 2) : lerp(x - 116, x - 190, (u - 0.5) * 2)); return <circle key={j} cx={bx} cy={y} r={9} fill="#fff" opacity={k * (o.pasa ? 1 - u * 0.4 : 1)} />; })}
          <g transform={`translate(${x + 70},${560 + 40 * (1 - spr(t, o.at))})`}><path d="M-70,-90 L70,-90 L70,90 L-70,90 Z" fill={i === 0 ? "#3a6fb0" : i === 1 ? "#efe9dc" : "#9fb7c4"} stroke="#2b241b" strokeWidth={3} /><ellipse cx={0} cy={-90} rx={70} ry={16} fill="#c9ccd0" stroke="#2b241b" strokeWidth={3} /></g>
        </g>; })}
        <Cross t={t} at={a + 2} x={380} y={220} r={44} />
        <Tick t={t} at={m.cal + 1.4} x={960} y={220} r={44} />
        <Tick t={t} at={m.sili + 1.4} x={1540} y={220} r={44} />
      </Svg>
      {opts.map((o, i) => <Lbl key={i} t={t} at={o.at + 0.3} text={o.n} x={380 + i * 580} y={880} col={i ? C.ok : C.red} size={60} />)}
      <Lbl t={t} at={m.sili + 3} text="15 días antes de pintar" x={960} y={990} col={C.honey} size={48} />
    </>
  );
};

// 34 · cuándo sí hay que romper: tablero de cuatro casos que se dan vuelta como cartas: revoque hueco grande (se rehace),
// capilar (barrera en la base, otro video), grieta pasante (sellar primero), napa con presión (profesional)
export const CuandoRomper: React.FC<FxP> = ({ t, a, m }) => {
  const C4 = [{ at: a + 2.6, n: "hueco grande", r: "se rehace" }, { at: m.cap, n: "capilar", r: "barrera en la base" }, { at: m.grie, n: "grieta pasante", r: "sellar primero" }, { at: m.napa, n: "napa con presión", r: "un profesional" }];
  const fin = e(t, m.napa + 5, m.napa + 6.5);
  return (
    <>
      <Svg>
        {C4.map((c, i) => { const x = 330 + i * 420, fl = e(t, c.at, c.at + 0.7), sx = Math.abs(Math.cos(Math.PI * fl)), back = fl > 0.5; return <g key={i} transform={`translate(${x},540) scale(${sx * (1 - 0.15 * fin)},${1 - 0.15 * fin})`}>
          <rect x={-180} y={-260} width={360} height={520} rx={26} fill={back ? "#2a2117" : "#3a2e20"} stroke={back ? C.honey : "rgba(255,236,200,.3)"} strokeWidth={4} />
          {!back && <text x={0} y={30} textAnchor="middle" fontSize={140} fontWeight={800} fill="rgba(255,236,200,.25)" fontFamily="Barlow Condensed">?</text>}
          {back && <g>
            {i === 0 && <g transform="translate(0,-90)"><rect x={-120} y={-80} width={240} height={160} fill={LAD} /><path d="M-60,-60 L60,-60 L80,60 L-80,60 Z" fill="#1a140d" /></g>}
            {i === 1 && <g transform="translate(0,-90)"><rect x={-120} y={-80} width={240} height={160} fill="#ece6d8" /><rect x={-120} y={0} width={240} height={80} fill="rgba(58,74,82,.55)" /><line x1={-120} y1={0} x2={120} y2={0} stroke={C.honey} strokeWidth={5} strokeDasharray="12 8" /></g>}
            {i === 2 && <g transform="translate(0,-90)"><rect x={-120} y={-80} width={240} height={160} fill="#ece6d8" /><path d="M-20,-80 L10,-30 L-14,10 L18,50 L-6,80" stroke="#2b241b" strokeWidth={8} fill="none" />{Array.from({ length: 4 }, (_, k) => <circle key={k} cx={-6 + 10 * Math.sin(t * 3 + k)} cy={-60 + k * 40 + ((t * 40) % 40)} r={7} fill={H2O} />)}</g>}
            {i === 3 && <g transform="translate(0,-90)"><rect x={-120} y={-80} width={240} height={160} fill="#6d4a2c" /><rect x={-120} y={20} width={240} height={60} fill="rgba(95,180,255,.7)" />{[0, 1, 2].map((k) => <path key={k} d={`M${-60 + k * 60},20 l 0,-50 m -14,14 l 14,-14 l 14,14`} stroke="#fff" strokeWidth={5} fill="none" />)}</g>}
            <text x={0} y={90} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{c.n.toUpperCase()}</text>
            <text x={0} y={150} textAnchor="middle" fontSize={34} fontWeight={700} fill={C.honey} fontFamily="Barlow">{c.r}</text>
          </g>}
        </g>; })}
      </Svg>
      <Lbl t={t} at={a + 0.6} out={a + 2.6} text="cuándo esto solo no alcanza" x={960} y={140} col={C.cream} size={62} />
      <Lbl t={t} at={m.napa + 5.6} text="revoque sano: funciona" x={960} y={940} col={C.ok} size={70} />
    </>
  );
};

// 35 · silicato o cristalizante: balanza de dos platos. Humedad leve (gotita): el silicato (más barato) alcanza y la
// balanza queda pareja; cuando el agua empuja todos los días (balde que cae en el plato), gana el cristalizante
export const SilicatoBalanza: React.FC<FxP> = ({ t, a, m }) => {
  const lev = e(t, m.leve, m.leve + 1), emp = e(t, m.empuja, m.empuja + 1.4), ang = lerp(lerp(0, 0, lev), 14, emp);
  const pl = (s: number) => ({ x: 960 + s * 380 * Math.cos((ang * Math.PI) / 180), y: 420 + s * 380 * Math.sin((ang * Math.PI) / 180) });
  const L = pl(-1), R = pl(1);
  return (
    <>
      <Svg>
        <rect x={940} y={420} width={40} height={460} fill="#7a6a52" /><rect x={800} y={860} width={320} height={40} rx={10} fill="#5e5547" />
        <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke="#8d7a5a" strokeWidth={22} strokeLinecap="round" />
        <circle cx={960} cy={420} r={22} fill="#5e5547" />
        {[L, R].map((p, i) => <g key={i} transform={`translate(${p.x},${p.y})`}>
          <line x1={-110} y1={180} x2={0} y2={0} stroke="#8d887e" strokeWidth={4} /><line x1={110} y1={180} x2={0} y2={0} stroke="#8d887e" strokeWidth={4} />
          <path d="M-150,180 L150,180 L120,220 L-120,220 Z" fill="#9a8e78" />
          {i === 0 && <g transform="translate(0,90)"><rect x={-50} y={-10} width={100} height={90} rx={12} fill="rgba(220,235,240,.85)" stroke="#8d969c" strokeWidth={3} /><rect x={-20} y={-30} width={40} height={24} fill="#3a6fb0" /><text x={0} y={52} textAnchor="middle" fontSize={22} fontWeight={800} fill="#2b241b" fontFamily="Barlow">SILICATO</text></g>}
          {i === 1 && <g transform="translate(0,90)"><path d="M-70,-30 L70,-30 L80,80 L-80,80 Z" fill="#9aa0a6" /><text x={0} y={40} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily="Barlow">CRISTALIZANTE</text></g>}
          {i === 1 && emp > 0 && <g transform={`translate(0,${-180 + 160 * Math.min(1, emp * 1.2)})`}><path d="M-60,-40 L60,-40 L50,40 L-50,40 Z" fill="#4b78a8" /><ellipse cx={0} cy={-40} rx={60} ry={14} fill={H2O} /></g>}
        </g>)}
        {lev > 0 && emp < 0.5 && <g transform={`translate(${L.x},${L.y - 60})`} opacity={lev}><path d="M0,-40 C 20,-10 26,6 0,20 C -26,6 -20,-10 0,-40 Z" fill={H2O} /></g>}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="silicato de sodio" x={500} y={200} col={C.solv} size={58} />
      <Lbl t={t} at={m.leve + 0.3} out={m.empuja} text="leve y firme: alcanza" x={960} y={140} col={C.ok} size={60} />
      <Lbl t={t} at={m.empuja + 1} text="empuja todos los días: cristalizante" x={960} y={140} col={C.honey} size={50} />
    </>
  );
};

// 36 · el caso completo: una línea de obra que avanza en cinco estaciones (aluminio → línea → jardinera del vecino →
// tratamiento → costo), cada estación con su escena chica; al final, el placard hinchado vs la cuenta, y la cama vuelve
export const CasoMatanza: React.FC<FxP> = ({ t, a, m }) => {
  const st = [{ at: a + 2, n: "junio" }, { at: m.alu, n: "aluminio" }, { at: m.linea, n: "la línea" }, { at: m.vec, n: "el vecino" }, { at: m.trat, n: "tratamiento" }, { at: m.costo, n: "la cuenta" }];
  const cur = st.filter((s) => t > s.at).length - 1, X = (i: number) => 300 + i * 264;
  const camX = cur < 0 ? 0 : lerp(X(Math.max(0, cur - 1)), X(cur), e(t, st[cur].at, st[cur].at + 1)) - 960;
  return (
    <>
      <Svg>
        <g transform={`translate(${-camX * 0.06},0)`}>
          <line x1={X(0)} y1={860} x2={X(5)} y2={860} stroke="rgba(255,236,200,.3)" strokeWidth={8} />
          <line x1={X(0)} y1={860} x2={cur < 0 ? X(0) : lerp(X(Math.max(0, cur - 1)), X(cur), e(t, st[cur].at, st[cur].at + 1))} y2={860} stroke={C.honey} strokeWidth={10} />
          {st.map((s, i) => <g key={i}><circle cx={X(i)} cy={860} r={i <= cur ? 20 : 12} fill={i <= cur ? C.honey : "#5e5547"} /><text x={X(i)} y={920} textAnchor="middle" fontSize={30} fontWeight={700} fill={i === cur ? C.ink : C.dim} fontFamily="Barlow">{s.n}</text></g>)}
        </g>
        {/* escena de la estación actual */}
        <g transform="translate(960,460)">
          {cur === 0 && <g opacity={e(t, st[0].at, st[0].at + 0.6)}>
            <rect x={-420} y={-280} width={560} height={500} fill="#ece6d8" /><Mancha cx={-140} cy={-30} rx={130} ry={220} k={1} seed={241} />
            <g transform="translate(260,0)"><rect x={-110} y={-260} width={220} height={480} fill="#b9a27e" stroke="#7a6a52" strokeWidth={4} /><path d={`M110,-260 C ${110 + 50 * e(t, st[0].at + 3, st[0].at + 5)},-60 ${110 + 50 * e(t, st[0].at + 3, st[0].at + 5)},60 110,220`} fill="#9a8460" /></g>
          </g>}
          {cur === 1 && <g><rect x={-200} y={-200} width={400} height={400} fill="rgba(58,74,82,.45)" stroke="#9aa4ab" strokeWidth={4} />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-170 + 340 * hash(i, 251)} cy={-170 + 340 * hash(i, 252)} r={10} fill="rgba(170,215,245,.95)" />)}<Tick t={t} at={m.alu + 2} x={260} y={-160} r={44} col={C.honey} /></g>}
          {cur === 2 && <g><rect x={-420} y={-260} width={840} height={480} fill="#ece6d8" /><Draw d="M-380,160 L-200,140 L-80,40 L0,-180 L80,30 L200,130 L380,150" p={e(t, m.linea, m.linea + 2)} col={C.red} w={8} /></g>}
          {cur === 3 && <g><rect x={-60} y={-260} width={40} height={480} fill={LAD2} /><g transform={`translate(${lerp(20, 120, e(t, m.vec + 6, m.vec + 8))},0)`}><rect x={0} y={60} width={300} height={160} fill="#9b4b2c" />{[40, 120, 200, 260].map((x) => <circle key={x} cx={x} cy={40} r={22} fill="#e05a7a" />)}</g><rect x={-18} y={-40} width={10 + 10 * e(t, m.vec + 9, m.vec + 10)} height={260} fill="rgba(235,240,255,.85)" opacity={e(t, m.vec + 9, m.vec + 10)} /></g>}
          {cur === 4 && <g>{["golpe", "raspar", "vinagre", "2 manos", "3 días", "cal"].map((s, i) => <g key={i} transform={`translate(${-375 + i * 150},0) scale(${spr(t, m.trat + i * 1.4)})`}><circle r={60} fill="rgba(40,30,18,.8)" stroke={C.honey} strokeWidth={4} /><text y={12} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">{s}</text></g>)}</g>}
          {cur === 5 && <g>
            <g transform="translate(-250,0)"><rect x={-110} y={-220} width={220} height={440} fill="#b9a27e" stroke="#7a6a52" strokeWidth={4} /><text x={0} y={280} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.red} fontFamily="Barlow Condensed">EL PLACARD</text></g>
            <text x={0} y={20} textAnchor="middle" fontSize={120} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">&gt;</text>
            <g transform="translate(250,0)"><rect x={-110} y={-140} width={220} height={280} rx={16} fill="#f6f1e6" stroke="#8d887e" strokeWidth={3} />{[0, 1, 2, 3].map((k) => <rect key={k} x={-80} y={-100 + k * 50} width={160 * (0.5 + 0.5 * hash(k, 9))} height={14} fill="#c9c2b2" />)}<text x={0} y={200} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">TODO EL ARREGLO</text></g>
          </g>}
        </g>
      </Svg>
      <Lbl t={t} at={a + 2.4} out={m.alu} text="placard hinchado por atrás" x={960} y={120} col={C.red} size={56} />
      <Lbl t={t} at={m.alu + 0.4} out={m.linea} text="mojada adentro: no es condensación" x={960} y={120} col={C.honey} size={48} />
      <Lbl t={t} at={m.linea + 0.4} out={m.vec} text="columna: no es capilar" x={960} y={120} col={C.cream} size={56} />
      <Lbl t={t} at={m.vec + 0.4} out={m.trat} text="corrió la jardinera + nylon" x={960} y={120} col={C.cream} size={54} />
      <Lbl t={t} at={m.costo + 4} text="dos inviernos: seca" x={960} y={120} col={C.ok} size={64} />
    </>
  );
};

// 37 · la rutina: tira de días tipo calendario de obra; cada día se ilumina cuando la voz lo nombra, con su icono
export const RutinaDias: React.FC<FxP> = ({ t, a, b }) => {
  const D = [["1", "aluminio 48 h"], ["3", "leer + línea + vecino"], ["4", "golpe y raspado"], ["5", "salitre y vinagre"], ["6", "mano horizontal"], ["6-7", "mano vertical"], ["7-9", "curado con niebla"], ["15-30", "cal o silicato"]];
  const step = (b - a - 4) / D.length;
  return (
    <>
      <Svg>
        {D.map(([d, s], i) => { const at0 = a + 2.4 + i * step, k = e(t, at0, at0 + 0.6), now = t > at0 && t < at0 + step; const x = 280 + (i % 4) * 450, y = 380 + Math.floor(i / 4) * 330; return <g key={i} transform={`translate(${x},${y + 30 * (1 - spr(t, a + 0.3 + i * 0.12))}) scale(${now ? 1.06 : 1})`}>
          <rect x={-200} y={-130} width={400} height={260} rx={24} fill={k > 0.5 ? "#3a2c1c" : "#231b12"} stroke={now ? C.honey : "rgba(255,236,200,.25)"} strokeWidth={now ? 6 : 2} />
          <text x={-170} y={-50} fontSize={72} fontWeight={800} fill={k > 0.5 ? C.honey : "rgba(255,236,200,.35)"} fontFamily="Barlow Condensed">DÍA {d}</text>
          <text x={-170} y={40} fontSize={36} fontWeight={700} fill={k > 0.5 ? C.ink : "rgba(255,236,200,.3)"} fontFamily="Barlow">{s}</text>
          {k > 0.5 && t > at0 + step && <Tick t={t} at={at0 + step} x={150} y={-70} r={30} />}
        </g>; })}
      </Svg>
      <Lbl t={t} at={b - 2.6} text="nunca látex plástico" x={960} y={980} col={C.red} size={58} />
    </>
  );
};
