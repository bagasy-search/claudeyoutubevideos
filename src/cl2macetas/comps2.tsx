// cl2macetas · componentes de los moldes al llenado (la luz entre los dos moldes, las tapitas y la marca, el aceite en la cara
// justa, el soplido que desmolda, gris contra blanco, de la piedra a la marmolina, los vasos que miden, tanto vidrio como polvo,
// cuchara y no mano, la escala de la avena, el vaso de agua de a chorritos, el corcho del fondo, el molde que flota, las
// burbujas que suben, la cara de la maceta, tierra y cielo). Cada uno es f(t) puro; marcas (m.*) desde fx.json.
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, Draw, FxP, Svg, Tick, shake } from "./kit";
import { BaldeP, Botella, Mac, Vaso, Vid, mk } from "./comps1";

// corte de los dos moldes (de costado): x centro, y base; luz = espesor de pared en px; ins = cuánto entró el de adentro (0..1)
const Moldes: React.FC<{ x: number; y: number; W: number; H: number; luz: number; ins?: number; fondo?: number; pared?: number; vid?: number; o?: number; tilt?: number }> = ({ x, y, W, H, luz, ins = 1, fondo = 0, pared = 0, vid = 0, o = 1, tilt = 0 }) => {
  const wb = W * 0.74, fb = luz * 1.1, Wi = W - 2 * luz, wbi = wb - 2 * luz, Hi = H - fb, dy = (1 - ins) * -H * 0.9;
  const mez = "#e9e4d8";
  const lvl = y - fb * fondo, top = y - H * pared;
  return (
    <g opacity={o}>
      {fondo > 0.01 && <path d={`M${x - wb / 2 + 5},${y - 5} L${x - lerp(wb, W, fb / H) / 2 + 5},${lvl} L${x + lerp(wb, W, fb / H) / 2 - 5},${lvl} L${x + wb / 2 - 5},${y - 5} Z`} fill={mez} />}
      {pared > 0.01 && <>
        <path d={`M${x - wb / 2 + 5},${y - fb} L${x - lerp(wb, W, pared) / 2 + 5},${top} L${x - lerp(wbi, Wi, pared) / 2},${top} L${x - wbi / 2},${y - fb} Z`} fill={mez} />
        <path d={`M${x + wb / 2 - 5},${y - fb} L${x + lerp(wb, W, pared) / 2 - 5},${top} L${x + lerp(wbi, Wi, pared) / 2},${top} L${x + wbi / 2},${y - fb} Z`} fill={mez} />
      </>}
      {vid > 0 && Array.from({ length: Math.round(26 * vid) }, (_, i) => { const L = i % 2 === 0, v = hash(i, 2) * pared * 0.95, u = hash(i, 1); const xo = lerp(wb, W, v) / 2, xi = lerp(wbi, Wi, v) / 2; const px = x + (L ? -1 : 1) * lerp(xi + 6, xo - 6, u); return <Vid key={i} x={px} y={y - fb - (H - fb) * v} r={luz * 0.2} col={i % 3} seed={i} />; })}
      <path d={`M${x - W / 2},${y - H} L${x - wb / 2},${y} L${x + wb / 2},${y} L${x + W / 2},${y - H}`} fill="none" stroke={C.plast} strokeWidth={10} strokeLinejoin="round" />
      <g transform={`translate(0,${dy}) rotate(${tilt} ${x} ${y})`}><path d={`M${x - Wi / 2},${y - fb - Hi - 30} L${x - wbi / 2},${y - fb} L${x + wbi / 2},${y - fb} L${x + Wi / 2},${y - fb - Hi - 30}`} fill="rgba(60,85,104,.35)" stroke={C.plast2} strokeWidth={10} strokeLinejoin="round" /></g>
    </g>
  );
};

// 17 · la luz entre los moldes: la regla mide 2,5 cm; si queda fina, el vidrio grande toca los dos moldes y raja
export const LuzMolde: React.FC<FxP> = ({ t, a, m }) => {
  const md = mk(m, "mide", a + 1.2), fi = mk(m, "fino", md + 3), k = e(t, fi, fi + 1), luz = lerp(90, 34, k);
  return (
    <>
      <Svg>
        <Moldes x={860} y={900} W={700} H={600} luz={luz} ins={spr(t, a + 0.2)} />
        <g opacity={cl((t - md) * 4)}>
          <line x1={860 + (700 - 2 * luz) / 2 * 0.98} x2={860 + 700 / 2 * 0.98} y1={420} y2={420} stroke={k > 0.5 ? C.red : C.sun} strokeWidth={6} />
          <line x1={860 + (700 - 2 * luz) / 2 * 0.98} x2={860 + (700 - 2 * luz) / 2 * 0.98} y1={400} y2={440} stroke={k > 0.5 ? C.red : C.sun} strokeWidth={6} />
          <line x1={860 + 700 / 2 * 0.98} x2={860 + 700 / 2 * 0.98} y1={400} y2={440} stroke={k > 0.5 ? C.red : C.sun} strokeWidth={6} />
        </g>
        {k > 0.6 && <Vid x={860 + 700 / 2 - luz / 2 - 6} y={520} r={luz * 0.75} col={0} seed={4} />}
        {k > 0.6 && <Draw d={`M${1205 - luz},560 L${1185 - luz},620 L${1200 - luz},680 L${1180 - luz},760`} p={e(t, fi + 1, fi + 1.8)} col={C.red} w={5} />}
      </Svg>
      <Lbl t={t} at={md + 0.3} out={fi} text="2,5 cm de luz" x={1500} y={430} col={C.sun} size={64} />
      <Lbl t={t} at={fi + 0.8} text="más fina: se raja" x={1500} y={430} col={C.red} size={60} />
    </>
  );
};

// 18 · dos tapitas en el fondo y la marca con marcador a la altura del borde
export const TapitasMarca: React.FC<FxP> = ({ t, a, m }) => {
  const tp = mk(m, "tapitas", a + 0.8), mr = mk(m, "marca", tp + 2.5), baja = e(t, tp + 0.6, tp + 1.6);
  return (
    <>
      <Svg>
        <path d="M560,320 L650,900 L1270,900 L1360,320" fill="none" stroke={C.plast} strokeWidth={12} strokeLinejoin="round" />
        {[-1, 1].map((s) => <g key={s} opacity={cl((t - tp) * 5)} transform={`translate(${960 + s * 120},${878 - (1 - spr(t, tp)) * 80})`}><rect x={-34} y={-22} width={68} height={22} rx={5} fill={s < 0 ? C.red : C.verde} /><rect x={-34} y={-22} width={68} height={6} fill="rgba(255,255,255,.35)" /></g>)}
        <g transform={`translate(0,${lerp(-300, 0, baja)})`}>
          <path d="M650,260 L720,856 L1200,856 L1270,260" fill="rgba(60,85,104,.35)" stroke={C.plast2} strokeWidth={12} strokeLinejoin="round" />
          <Draw d="M664,330 L1256,330" p={e(t, mr, mr + 0.9)} col={C.sun} w={8} />
        </g>
        <g opacity={cl((t - mr) * 4) * (1 - e(t, mr + 1.4, mr + 1.8))} transform={`translate(${lerp(664, 1256, e(t, mr, mr + 0.9))},300) rotate(30)`}><rect x={-12} y={-120} width={24} height={110} rx={6} fill="#1b1a19" /><rect x={-12} y={-24} width={24} height={20} fill={C.sun} /></g>
      </Svg>
      <Lbl t={t} at={tp + 0.5} text="dos tapitas: el fondo" x={960} y={990} size={48} col={C.honey} />
      <Lbl t={t} at={mr + 0.9} text="la marca" x={1520} y={330} size={60} col={C.sun} />
    </>
  );
};

// 19 · el aceite va del lado que toca la mezcla: el de afuera por dentro, el de adentro por fuera
export const AceiteCapa: React.FC<FxP> = ({ t, a, m }) => {
  const af = mk(m, "afuera", a + 0.8), ad = mk(m, "adentro", af + 2), p1 = e(t, af, af + 1.6), p2 = e(t, ad, ad + 1.6);
  const pincel = (x: number, y: number, o: number) => <g opacity={o} transform={`translate(${x},${y}) rotate(-35)`}><rect x={-10} y={-160} width={20} height={130} rx={6} fill={C.wood} /><rect x={-16} y={-34} width={32} height={20} fill="#9ba1a6" /><path d="M-16,-14 L16,-14 L12,22 L-12,22 Z" fill={C.ambar} /></g>;
  return (
    <>
      <Svg>
        <path d="M300,300 L360,860 L780,860 L840,300" fill="none" stroke={C.plast} strokeWidth={12} strokeLinejoin="round" />
        <Draw d="M316,312 L372,848" p={p1} col={C.ambar} w={14} glow />
        <Draw d="M824,312 L768,848" p={p1} col={C.ambar} w={14} glow />
        {pincel(lerp(330, 370, p1), lerp(320, 840, p1), cl((t - af) * 4) * (1 - e(t, af + 1.6, af + 2)))}
        <path d="M1150,300 L1210,860 L1630,860 L1690,300" fill="none" stroke={C.plast2} strokeWidth={12} strokeLinejoin="round" />
        <Draw d="M1136,312 L1196,872" p={p2} col={C.ambar} w={14} glow />
        <Draw d="M1704,312 L1644,872" p={p2} col={C.ambar} w={14} glow />
        {pincel(lerp(1110, 1170, p2), lerp(320, 860, p2), cl((t - ad) * 4) * (1 - e(t, ad + 1.6, ad + 2)))}
      </Svg>
      <Lbl t={t} at={af + 0.4} text="el de afuera: por dentro" x={570} y={960} size={42} col={C.ink} />
      <Lbl t={t} at={ad + 0.4} text="el de adentro: por fuera" x={1420} y={960} size={42} col={C.ink} />
      <Lbl t={t} at={ad + 1.8} text="capa finita, sin chorrear" x={960} y={180} size={50} col={C.ambar} />
    </>
  );
};

// 20 · la cinta en el agujerito del molde y el soplido que empuja la maceta afuera
export const SoploDesmolde: React.FC<FxP> = ({ t, a, m }) => {
  const ci = mk(m, "cinta", a + 0.8), so = mk(m, "sopla", ci + 2.5), sale = e(t, so + 0.6, so + 2);
  return (
    <>
      <Svg>
        <g transform="rotate(180 960 560)">
          <path d="M620,300 L690,820 L1230,820 L1300,300" fill="none" stroke={C.plast} strokeWidth={12} strokeLinejoin="round" />
          <rect x={930} y={812} width={60} height={22} rx={4} fill="#c8a868" opacity={cl((t - ci) * 4) * (1 - e(t, so - 0.6, so - 0.2))} />
          <g transform={`translate(0,${-sale * 260})`}><Mac x={960} y={812} w={600} h={500} gris={0.9} seed={8} /></g>
        </g>
        {Array.from({ length: 6 }, (_, i) => { const u = ((t - so) * 1.6 + i / 6) % 1; return t > so ? <path key={i} d={`M${930 + i * 10},${120 + u * 160} q10,20 0,40`} fill="none" stroke={C.celeste} strokeWidth={6} opacity={(1 - u) * (1 - sale)} /> : null; })}
      </Svg>
      <Lbl t={t} at={ci + 0.3} text="cinta en el agujerito" x={1500} y={260} size={46} col={C.honey} />
      <Lbl t={t} at={so + 0.6} text="soplás y sale sola" x={1500} y={360} size={52} col={C.celeste} />
    </>
  );
};

// 21 · gris contra blanco: el mismo verde, sobre cada cemento
export const GrisVsBlanco: React.FC<FxP> = ({ t, a, m }) => {
  const bl = mk(m, "blanco", a + 2), k = e(t, bl, bl + 0.8);
  const panel = (x: number, bg: string, o: number) => <g opacity={o}><rect x={x - 380} y={240} width={760} height={560} rx={30} fill={bg} />{Array.from({ length: 14 }, (_, i) => <Vid key={i} x={x - 300 + (i % 5) * 150 + (Math.floor(i / 5) % 2) * 60} y={330 + Math.floor(i / 5) * 170} r={46} col={0} seed={i + 200} o={bg === C.cem2 ? 0.55 : 1} />)}</g>;
  return (
    <>
      <Svg>
        {panel(520, C.cem2, cl((t - a) * 3))}
        {panel(1400, C.marm, k)}
        <circle cx={1400} cy={520} r={330 + 20 * Math.sin(t * 3)} fill="none" stroke={C.verde} strokeWidth={6} opacity={k * 0.6} />
      </Svg>
      <Lbl t={t} at={a + 0.4} text="gris: se pierde" x={520} y={900} size={56} col={C.cem} />
      <Lbl t={t} at={bl + 0.4} text="blanco: salta" x={1400} y={900} size={56} col={C.verde} />
    </>
  );
};

// 22 · la marmolina: el mármol molido hecho polvo; y si no hay, arena fina tamizada
export const MarmolinaPolvo: React.FC<FxP> = ({ t, a, m }) => {
  const mo = e(t, a + 1, a + 3), al = mk(m, "alt", a + 5);
  return (
    <>
      <Svg>
        <g opacity={1 - mo}><path d="M700,700 L760,480 L900,420 L1080,460 L1200,560 L1160,720 Z" fill="#f1ede4" stroke="#bdb6a6" strokeWidth={5} /><path d="M780,520 Q900,560 1000,500 M840,640 Q960,600 1100,650" fill="none" stroke="#c9c1b0" strokeWidth={4} /></g>
        {Array.from({ length: 180 }, (_, i) => { const u = mo; return <circle key={i} cx={lerp(700 + hash(i, 1) * 500, 760 + hash(i, 3) * 400, u)} cy={lerp(420 + hash(i, 2) * 300, 760 - Math.sqrt(hash(i, 4)) * 160 * (1 - Math.abs(hash(i, 3) - 0.5) * 1.6), u)} r={3 + 2 * hash(i, 5)} fill={C.marm} opacity={mo} />; })}
        <g opacity={e(t, al, al + 0.8)}>{Array.from({ length: 120 }, (_, i) => <circle key={i} cx={1460 + hash(i, 6) * 260} cy={760 - Math.sqrt(hash(i, 7)) * 120 * (1 - Math.abs(hash(i, 6) - 0.5) * 1.6)} r={3} fill={C.sun} opacity={0.8} />)}</g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="marmolina: mármol molido" x={960} y={200} size={56} col={C.marm} />
      <Lbl t={t} at={a + 3} text="brillo de piedra pulida" x={960} y={900} size={44} col={C.dim} />
      <Lbl t={t} at={al + 0.5} text="o arena fina" x={1590} y={540} size={48} col={C.sun} />
    </>
  );
};

// 23 · la medida en vasos: uno de cemento, dos de marmolina, y se mezclan en seco hasta un solo blanco
export const VasosMedida: React.FC<FxP> = ({ t, a, m }) => {
  const v1 = mk(m, "v1", a + 0.6), v2 = mk(m, "v2", v1 + 1.4), sec = mk(m, "seco", v2 + 2.4), k = e(t, sec, sec + 1.4);
  const vs = [[v1, "#f6f4ef", "cemento"], [v2, "#efe8dc", "marmolina"], [v2 + 0.6, "#efe8dc", "marmolina"]] as const;
  return (
    <>
      <Svg>
        {vs.map(([at, col], i) => <g key={i} opacity={cl((t - at) * 5) * (1 - k * 0.9)} transform={`translate(${lerp(0, 960 - (520 + i * 280), k)},${(1 - spr(t, at)) * 120})`}><Vaso x={520 + i * 280} y={720} s={1.8} fill={col} /></g>)}
        <text x={720} y={600} fontFamily={FONT} fontWeight={800} fontSize={90} fill={C.dim} opacity={cl((t - v2) * 4) * (1 - k)}>+</text>
        <g opacity={k}><path d="M1250,760 Q1400,540 1550,760 Z" fill="#f2efe8" /><path d="M1250,760 Q1400,540 1550,760" fill="none" stroke="#d2ccbe" strokeWidth={4} /></g>
      </Svg>
      <Lbl t={t} at={v1 + 0.3} text="1 cemento blanco" x={520} y={880} size={44} col={C.ink} />
      <Lbl t={t} at={v2 + 0.4} text="2 marmolina" x={940} y={880} size={44} col={C.honey} />
      <Lbl t={t} at={sec + 0.8} text="en seco, sin vetas" x={1400} y={880} size={48} col={C.ok} />
    </>
  );
};

// 24 · tanto vidrio como polvo: la balanza de vasos queda pareja, y el vidrio se viste de blanco
export const VolumenIgual: React.FC<FxP> = ({ t, a, m }) => {
  const vd = mk(m, "vid", a + 1.5), vis = mk(m, "viste", vd + 3), tilt = lerp(-12, 0, e(t, vd, vd + 1.6));
  return (
    <>
      <Svg>
        <rect x={950} y={540} width={20} height={360} fill="#9ba1a6" /><polygon points="900,910 1020,910 960,860" fill="#7a7d82" />
        <g transform={`rotate(${tilt} 960 540)`}>
          <rect x={460} y={530} width={1000} height={20} rx={8} fill="#9ba1a6" />
          {[0, 1, 2].map((i) => <Vaso key={i} x={540 + i * 120} y={530} s={0.9} fill={C.marm} />)}
          {[0, 1, 2].map((i) => <g key={i} opacity={cl((t - vd - i * 0.3) * 5)}><Vaso x={1140 + i * 120} y={530} s={0.9} fill="rgba(63,174,90,.6)" />{[0, 1, 2].map((q) => <Vid key={q} x={1125 + i * 120 + q * 14} y={500 - q * 26} r={13} col={(q + i) % 3} seed={q + i * 3} />)}</g>)}
        </g>
        {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${760 + (i % 6) * 70},${780 + Math.floor(i / 6) * 70})`} opacity={cl((t - vis) * 3)}><Vid x={0} y={0} r={26} col={i % 3} seed={i + 300} /><circle r={30} fill={C.marm} opacity={e(t, vis + 0.4 + i * 0.1, vis + 1.4 + i * 0.1) * 0.85} /></g>)}
      </Svg>
      <Lbl t={t} at={a + 0.5} text="3 vasos de polvo" x={660} y={420} size={44} col={C.marm} />
      <Lbl t={t} at={vd + 0.5} text="3 vasos de vidrio" x={1260} y={420} size={44} col={C.verde} />
      <Lbl t={t} at={vis + 1.6} text="se viste de blanco" x={1480} y={830} size={46} col={C.ink} />
    </>
  );
};

// 25 · cuchara sí, mano no: el filo escondido en la mezcla atraviesa el guante fino
export const CucharaNoMano: React.FC<FxP> = ({ t, a, m }) => {
  const mn = mk(m, "mano", a + 2.5), pin = e(t, mn + 0.6, mn + 1.2), sx = shake(t, mn + 1.1, 10);
  return (
    <>
      <Svg>
        <rect x={180} y={600} width={700} height={240} rx={40} fill="#e6e1d6" />
        <g transform={`translate(530,${560 + Math.sin(t * 3) * 20}) rotate(${-20 + Math.sin(t * 3) * 8})`} opacity={cl((t - a) * 3)}><path d="M-110,0 L110,-30 L130,20 L-90,60 Z" fill="#b8bec3" stroke="#6f767b" strokeWidth={4} /><rect x={120} y={-20} width={190} height={34} rx={14} fill={C.wood} /></g>
        <Tick t={t} at={a + 0.8} x={530} y={330} r={56} />
        <g transform={`translate(${sx},0)`}>
          <rect x={1040} y={600} width={700} height={240} rx={40} fill="#e6e1d6" />
          <g opacity={cl((t - mn) * 4)} transform={`translate(1390,${lerp(380, 600, pin)})`}><path d="M-80,40 L-80,-120 Q-80,-150 -55,-150 Q-30,-150 -30,-120 L-30,-170 Q-30,-200 -5,-200 Q20,-200 20,-170 L20,-130 Q20,-155 45,-155 Q70,-155 70,-125 L70,40 Z" fill="#f2c94c" opacity={0.9} /></g>
          <g opacity={pin}><Vid x={1390} y={640} r={30} col={3} seed={9} /><polygon points="1390,640 1370,590 1392,560" fill="#dff3f5" stroke="#9fb8bb" strokeWidth={3} /></g>
          <Cross t={t} at={mn + 1.2} x={1390} y={330} r={56} />
        </g>
      </Svg>
      <Lbl t={t} at={a + 1} text="con la cuchara" x={530} y={940} size={52} col={C.ok} />
      <Lbl t={t} at={mn + 1.3} text="el filo no se ve" x={1390} y={940} size={52} col={C.red} />
    </>
  );
};

// 26 · la escala de la mezcla: sopa / avena espesa / arena húmeda — el cursor se queda en el medio
export const AvenaEscala: React.FC<FxP> = ({ t, a, m }) => {
  const so = mk(m, "sopa", a + 3), ar = mk(m, "arena", so + 2.5), av = mk(m, "avena", a + 1);
  const pos = t < so ? lerp(0, 0.5, e(t, av, av + 1)) : t < ar ? lerp(0.5, 0.05, e(t, so, so + 0.6)) : t < ar + 2.2 ? lerp(0.05, 0.95, e(t, ar, ar + 0.8)) : lerp(0.95, 0.5, e(t, ar + 2.2, ar + 3));
  const x = lerp(380, 1540, pos);
  return (
    <>
      <Svg>
        <defs><linearGradient id="avg" x1="0" x2="1"><stop offset="0" stopColor={C.celeste2} /><stop offset=".5" stopColor={C.ok} /><stop offset="1" stopColor={C.ambar2} /></linearGradient></defs>
        <rect x={380} y={600} width={1160} height={40} rx={20} fill="url(#avg)" opacity={0.85} />
        <g transform={`translate(${x},620)`}><circle r={44} fill={C.ink} /><circle r={28} fill={C.night} /></g>
        {/* las tres cucharas */}
        <g transform="translate(380,430)"><path d="M-60,0 Q0,40 60,0" fill="none" stroke="#b8bec3" strokeWidth={10} />{Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-30 + i * 12} cy={30 + ((t * 120 + i * 30) % 120)} r={7} fill="#e9e4d8" opacity={0.8} />)}</g>
        <g transform="translate(960,430)"><path d="M-60,0 Q0,40 60,0" fill="none" stroke="#b8bec3" strokeWidth={10} /><path d="M-50,4 Q-30,-60 0,-50 Q30,-70 50,4 Z" fill="#e9e4d8" /></g>
        <g transform="translate(1540,430)"><path d="M-60,0 Q0,40 60,0" fill="none" stroke="#b8bec3" strokeWidth={10} />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-40 + (i % 4) * 26} cy={-14 - Math.floor(i / 4) * 22 + (i % 2) * 40} r={11} fill="#d8d1c2" />)}</g>
      </Svg>
      <Lbl t={t} at={so} text="sopa: el vidrio se hunde" x={480} y={760} size={40} col={C.celeste} />
      <Lbl t={t} at={av + 0.4} text="avena espesa" x={960} y={760} size={60} col={C.ok} />
      <Lbl t={t} at={ar} text="arena: quedan agujeros" x={1440} y={760} size={40} col={C.ambar} />
    </>
  );
};

// 27 · un vaso de agua, un poco menos, en chorritos: la mezcla va pasando de polvo a avena
export const VasoDeAgua: React.FC<FxP> = ({ t, a, b }) => {
  const steps = [0, 1, 2, 3].map((i) => a + 0.8 + i * Math.max(1, (b - a - 2.5) / 4)), done = steps.filter((s) => t > s).length;
  const lv = lerp(1, 0.1, e(t, steps[0], steps[3] + 0.8)), mez = done / 4;
  return (
    <>
      <Svg>
        <g transform={`translate(760,${560}) rotate(${steps.some((s) => t > s && t < s + 0.7) ? 40 : 0} 0 -60)`}><Vaso x={0} y={0} s={2} lv={lv} fill="rgba(124,200,255,.65)" /></g>
        {steps.map((s, i) => t > s && t < s + 0.7 ? <g key={i}>{Array.from({ length: 6 }, (_, q) => <circle key={q} cx={870 + q * 3} cy={540 + ((t - s) * 600 + q * 40) % 260} r={8} fill={C.water} />)}</g> : null)}
        <path d="M800,900 Q1000,960 1300,900 L1260,820 Q1050,860 840,820 Z" fill="#6f7276" />
        <path d={`M860,840 Q1050,${lerp(780, 740, mez)} 1240,840 Z`} fill={`rgb(${Math.round(lerp(240, 214, mez))},${Math.round(lerp(236, 208, mez))},${Math.round(lerp(226, 196, mez))})`} />
        {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={1440 + i * 70} cy={460} r={24} fill={i < done ? C.water : "none"} stroke={C.water} strokeWidth={4} />)}
      </Svg>
      <Lbl t={t} at={a + 0.3} text="un vaso, un poco menos" x={1540} y={340} size={44} col={C.water} />
      <Lbl t={t} at={steps[1]} text="de a chorritos" x={1540} y={600} size={52} col={C.ink} />
    </>
  );
};

// 28 · el corcho del fondo: parado en el centro, pegado, y la mezcla que sube 2,5 cm alrededor
export const CorchoFondo: React.FC<FxP> = ({ t, a, m }) => {
  const co = mk(m, "corcho", a + 0.8), mz = mk(m, "fondo", co + 3), lv = e(t, mz, mz + 2);
  return (
    <>
      <Svg>
        <path d="M520,300 L600,900 L1320,900 L1400,300" fill="none" stroke={C.plast} strokeWidth={12} strokeLinejoin="round" />
        <path d={`M610,894 L${lerp(610, 596, lv)},${894 - 90 * lv} L${lerp(1310, 1324, lv)},${894 - 90 * lv} L1310,894 Z`} fill="#e9e4d8" />
        {Array.from({ length: Math.round(16 * lv) }, (_, i) => <Vid key={i} x={640 + hash(i, 1) * 640} y={880 - hash(i, 2) * 80 * lv} r={12} col={i % 3} seed={i + 400} />)}
        <g transform={`translate(960,${894 - (1 - spr(t, co)) * 300})`} opacity={cl((t - co) * 5)}><rect x={-36} y={-150} width={72} height={150} rx={12} fill="#b88a55" stroke="#6e4b25" strokeWidth={4} />{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-24 + hash(i, 8) * 48} cy={-140 + hash(i, 9) * 130} r={3} fill="#8a6339" />)}</g>
        <g opacity={cl((t - mz) * 4)}><line x1={1440} x2={1440} y1={894} y2={804} stroke={C.sun} strokeWidth={5} /><line x1={1420} x2={1460} y1={804} y2={804} stroke={C.sun} strokeWidth={5} /><line x1={1420} x2={1460} y1={894} y2={894} stroke={C.sun} strokeWidth={5} /></g>
      </Svg>
      <Lbl t={t} at={co + 0.5} text="corcho de vino" x={960} y={560} size={56} col={C.honey} />
      <Lbl t={t} at={co + 1.4} text="el agujero, desde ya" x={960} y={640} size={44} col={C.ink} />
      <Lbl t={t} at={mz + 1.2} text="2,5 cm" x={1560} y={850} size={54} col={C.sun} align="left" />
    </>
  );
};

// 29 · el molde de adentro flota: sin peso sube torcido; con piedras queda clavado
export const MoldeFlota: React.FC<FxP> = ({ t, a, m }) => {
  const ps = mk(m, "peso", a + 3.5), sube = e(t, a + 0.6, ps - 0.2) * (1 - e(t, ps, ps + 0.8)), wob = Math.sin(t * 2.4) * 4 * sube;
  return (
    <>
      <Svg>
        <Moldes x={960} y={920} W={760} H={640} luz={70} ins={1 - 0.35 * sube} fondo={1} tilt={wob + sube * 6} />
        {Array.from({ length: 10 }, (_, i) => { const at = ps + i * 0.08; return <g key={i} opacity={cl((t - at) * 6)} transform={`translate(${830 + (i % 5) * 60},${lerp(300, 780 - Math.floor(i / 5) * 46, e(t, at, at + 0.4))})`}><path d="M-26,0 L-18,-30 L14,-34 L28,-6 L12,16 L-20,14 Z" fill="#8f8a80" stroke="#5c5852" strokeWidth={3} /></g>; })}
        {sube > 0.2 && Array.from({ length: 3 }, (_, i) => <path key={i} d={`M${700 + i * 260},${500} l0,-60 m-14,14 l14,-14 l14,14`} stroke={C.red} strokeWidth={6} fill="none" opacity={sube} />)}
      </Svg>
      <Lbl t={t} at={a + 1.4} out={ps} text="flota y se tuerce" x={1560} y={460} size={52} col={C.red} />
      <Lbl t={t} at={ps + 1} text="peso adentro: quieto" x={1560} y={460} size={52} col={C.ok} />
    </>
  );
};

// 30 · los golpecitos al molde: las burbujas suben y revientan; cada una era un hueco
export const BurbujasGolpes: React.FC<FxP> = ({ t, a, m }) => {
  const g0 = mk(m, "golpes", a + 1), hits = Array.from({ length: 8 }, (_, i) => g0 + i * 0.55), last = hits.filter((h) => t >= h).pop(), sx = last ? shake(t, last, 9) : 0;
  const hu = last ? cl((t - last) / 0.3) : 1;
  return (
    <>
      <Svg>
        <g transform={`translate(${sx},0)`}>
          <Moldes x={960} y={920} W={760} H={640} luz={80} fondo={1} pared={0.8} vid={1} />
          {Array.from({ length: 26 }, (_, i) => { const st = g0 + hash(i, 1) * 4, u = cl((t - st) / 1.6), L = i % 2 === 0; if (u <= 0 || u >= 1) return null; const x0 = 960 + (L ? -1 : 1) * (280 + hash(i, 2) * 40); return <circle key={i} cx={x0} cy={lerp(860, 420, u)} r={lerp(4, 10, u)} fill="none" stroke="white" strokeWidth={2.5} opacity={1 - u * 0.6} />; })}
        </g>
        <g transform={`translate(1460,560) rotate(${-30 + Math.sin(hu * Math.PI) * 24})`} opacity={cl((t - g0 + 0.5) * 3)}><rect x={-14} y={-10} width={200} height={30} rx={12} fill={C.wood} /></g>
      </Svg>
      <Lbl t={t} at={g0 + 1.4} text="golpecitos de todos lados" x={1560} y={760} size={46} col={C.ink} />
      <Lbl t={t} at={g0 + 2.8} text="cada burbuja, un hueco" x={1560} y={300} size={44} col={C.celeste} />
    </>
  );
};

// 31 · la cara de la maceta: los pedazos lindos se empujan contra el molde de afuera; el resto rellena atrás
export const CaraDeLaMaceta: React.FC<FxP> = ({ t, a, m }) => {
  const em = mk(m, "empuja", a + 2), mi = mk(m, "mitad", 1e9), k = e(t, em, em + 1.6);
  const wall = { x0: 640, x1: 1280, y0: 260, y1: 860 };
  return (
    <>
      <Svg>
        <rect x={wall.x0} y={wall.y0} width={wall.x1 - wall.x0} height={wall.y1 - wall.y0} fill="#e9e4d8" />
        <line x1={wall.x0} x2={wall.x0} y1={wall.y0 - 30} y2={wall.y1 + 30} stroke={C.plast} strokeWidth={14} />
        <line x1={wall.x1} x2={wall.x1} y1={wall.y0 - 30} y2={wall.y1 + 30} stroke={C.plast2} strokeWidth={14} />
        {Array.from({ length: 12 }, (_, i) => { const y = 300 + i * 46, x0 = 820 + hash(i, 1) * 280; return <Vid key={i} x={lerp(x0, wall.x0 + 34, k)} y={y} r={30} col={i % 4 === 3 ? 2 : i % 2 ? 0 : 1} seed={i + 500} />; })}
        {Array.from({ length: 22 }, (_, i) => <Vid key={"m" + i} x={760 + hash(i, 4) * 470} y={290 + hash(i, 5) * 540} r={12} col={i % 3} seed={i + 560} o={0.8} />)}
        <path d={`M${wall.x0 - 140},560 l90,0 m-24,-20 l24,20 l-24,20`} stroke={C.sun} strokeWidth={8} fill="none" transform="rotate(180 520 560)" opacity={cl((t - em) * 3)} />
        {/* la regla de la mitad */}
        <g opacity={e(t, mi, mi + 0.6)}><Vid x={960} y={560} r={330} col={0} seed={77} o={0.85} /><Cross t={t} at={mi + 0.6} x={960} y={560} r={60} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="la cara de afuera" x={430} y={760} size={46} col={C.plast} />
      <Lbl t={t} at={em + 1.4} text="los lindos, contra el molde" x={960} y={180} size={44} col={C.sun} />
      <Lbl t={t} at={mi + 0.8} text="nunca más de media pared" x={1560} y={720} size={40} col={C.red} />
    </>
  );
};

// 32 · tierra y cielo: Doña Elvira agrupaba los colores, verde abajo y ámbar arriba
export const TierraCielo: React.FC<FxP> = ({ t, a, m }) => {
  const ag = mk(m, "agrupa", a + 2), k = e(t, ag, ag + 2);
  return (
    <>
      <Svg>
        {[0, 1].map((side) => {
          const x = side ? 1340 : 580;
          return <g key={side} opacity={side ? k : cl((t - a) * 3)}>
            <path d={`M${x - 260},360 L${x - 190},860 L${x + 190},860 L${x + 260},360 Z`} fill={C.marm} />
            {Array.from({ length: 40 }, (_, i) => { const v = hash(i + side * 50, 2); const col = side ? (v < 0.5 ? (hash(i, 9) < 0.8 ? 1 : 2) : (hash(i, 9) < 0.85 ? 0 : 2)) : Math.floor(hash(i, 3) * 3); const y = 380 + v * 460, half = lerp(250, 185, v); return <Vid key={i} x={x + (hash(i + side * 50, 1) - 0.5) * 2 * half * 0.9} y={y} r={22} col={col} seed={i + side * 50 + 600} />; })}
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="todo al azar" x={580} y={960} size={46} col={C.dim} />
      <Lbl t={t} at={ag + 1.4} text="tierra y cielo" x={1340} y={960} size={56} col={C.ambar} />
    </>
  );
};
export const _unused2 = [Botella, BaldeP, Mac];
