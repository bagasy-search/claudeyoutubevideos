// fb5nd · componentes 17-31 (mezcla, tendido, el momento justo, espolvoreado, llana de acero, curado, juntas, sellador).
import React from "react";
import { C, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Cross, FxP, Svg, Tick, num } from "./kit";
import { Balde, Bolsa, quad } from "./piso";
import { Colador, Cuarto, CONTRA, Fratas, LlanaAcero, Mano, Piso, Suela } from "./cem";

const Grano: React.FC<{ n: number; x: number; y: number; w: number; h: number; col: string; s: number; k?: number }> = ({ n, x, y, w, h, col, s, k = 1 }) => (
  <>{Array.from({ length: n }, (_, i) => hash(i, s) < k && <circle key={i} cx={x + hash(i, s + 1) * w} cy={y + hash(i, s + 2) * h} r={3 + 2 * hash(i, s + 3)} fill={col} />)}</>
);

// 17 · la proporción en baldes (1 cemento : 3 arena); el puñado de arena apretado deja la mano marrón (no sirve); mezcla
// en seco con vetas que desaparecen
export const PunadoDeArena: React.FC<FxP> = ({ t, m }) => {
  const pun = e(t, m.pun, m.pun + 1.4), vet = e(t, m.vet, m.vet + 2.5);
  return (
    <>
      <Svg>
        {t < m.pun && [0, 1, 2, 3].map((i) => t > (i ? m.tres : m.uno) + i * 0.3 && <g key={i} transform={`translate(${520 + i * 300},${lerp(1200, 620, spr(t, (i ? m.tres : m.uno) + i * 0.3))})`}><Balde x={0} y={0} s={1} lvl={0.8} liq={i ? "#c6a675" : "#bfbcb4"} /></g>)}
        {t > m.pun && t < m.seco && <g transform="translate(760,560)">
          <Mano x={0} y={0} s={1.5} rot={-10} />
          <ellipse cx={0} cy={-40} rx={100 * (1 - pun * 0.3)} ry={70 * (1 - pun * 0.3)} fill="#c6a675" />
          {t > m.marr && <ellipse cx={0} cy={-20} rx={120} ry={90} fill="#7a5530" opacity={0.5 * e(t, m.marr, m.marr + 1)} />}
        </g>}
        {t > m.marr && t < m.seco && <Cross t={t} at={m.marr + 0.5} x={1240} y={540} r={70} />}
        {t > m.seco && <g>
          <ellipse cx={960} cy={720} rx={560} ry={200} fill="#c6a675" />
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${560 + i * 60},${640 + 40 * hash(i, 2)} q40,${60 * Math.sin(t * 2 + i)} 90,${20}`} stroke="#d6d2ca" strokeWidth={22 * (1 - vet)} strokeLinecap="round" fill="none" opacity={1 - vet} />)}
          <ellipse cx={960} cy={720} rx={560} ry={200} fill="#b0a48e" opacity={vet * 0.8} />
          <g transform={`translate(${960 + 300 * Math.sin(t * 1.4)},560) rotate(${30 * Math.sin(t * 1.4)})`}><rect x={-10} y={-300} width={20} height={300} fill="#b98a55" /><path d="M-60,0 L60,0 L50,90 Q0,120 -50,90 Z" fill="#7d858c" /></g>
        </g>}
      </Svg>
      <Lbl t={t} at={m.uno} out={m.pun} text="1 cemento · 3 arena" x={960} y={180} col={C.cream} size={76} />
      <Lbl t={t} at={m.marr} out={m.seco} text="mano marrón = no" x={1240} y={760} col={C.red} size={52} />
      <Lbl t={t} at={m.vet} text="sin vetas claras" x={960} y={180} col={C.ok} size={70} />
    </>
  );
};

// 18 · dos bolas de mezcla: la aguada se desparrama y deja huecos que se cierran achicándose con fisuras; la justa
// queda con forma sin chorrear
export const AguaQueSeVa: React.FC<FxP> = ({ t, m }) => {
  const des = e(t, m.err, m.err + 3), hue = e(t, m.hue, m.hue + 1.5), fis = e(t, m.fis, m.fis + 2), fo = spr(t, m.for, 0.8);
  return (
    <>
      <Svg>
        <g transform="translate(560,640)">
          <ellipse rx={150 + 220 * des} ry={90 - 50 * des} fill="#8f877b" />
          {des > 0.3 && Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={-200 + i * 80 + (hash(i, 1) - 0.5) * 40} cy={-10 + (hash(i, 2) - 0.5) * 30} rx={30} ry={14} fill={C.water} opacity={0.7 * (1 - hue)} />)}
          {hue > 0.05 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-260 + i * 56} cy={(hash(i, 3) - 0.5) * 40} r={8 * hue} fill="#3a342c" />)}
          {fis > 0.02 && <path d={`M-300,0 l60,-20 l40,30 l70,-24 l60,26 l70,-20 l60,16`} stroke="#3a342c" strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${fis} 1`} />}
        </g>
        {t > m.for - 0.3 && <g transform={`translate(1360,${640 - 60 * (1 - fo)})`}>
          <path d={`M-170,40 Q-180,-${110 * fo} 0,-${130 * fo} Q180,-${110 * fo} 170,40 Z`} fill="#9d958a" />
          <path d="M-120,0 Q-60,-80 20,-90" stroke="rgba(255,255,255,.25)" strokeWidth={10} fill="none" />
        </g>}
      </Svg>
      <Lbl t={t} at={m.err} text="aguada" x={560} y={360} col={C.red} size={80} />
      <Lbl t={t} at={m.fis} text="se achica · se fisura" x={560} y={900} col={C.red} size={52} />
      <Lbl t={t} at={m.for} text="queda la forma" x={1360} y={360} col={C.ok} size={70} />
    </>
  );
};

// 19 · una barra de vida que se vacía: la carretilla llena tachada; el balde chico; a la hora y media la mezcla se pone
// gris oscuro y se tira; la manguera que quiere revivirla se tacha
export const UnaSolaVida: React.FC<FxP> = ({ t, m }) => {
  const vida = 1 - e(t, m.hora - 1, m.hora + 3), tira = e(t, m.tira, m.tira + 1.2);
  return (
    <>
      <Svg>
        <g transform="translate(560,640)" opacity={t > m.carr ? 1 : 0}>
          <path d="M-220,-60 L180,-60 L130,80 L-170,80 Z" fill="#3b6a8a" /><ellipse cx={-20} cy={-60} rx={200} ry={40} fill="#9d958a" /><circle cx={-20} cy={130} r={46} fill="#222" /><rect x={160} y={-40} width={160} height={16} rx={8} fill="#555" />
        </g>
        <Cross t={t} at={m.carr + 0.6} x={560} y={640} r={110} />
        <g transform={`translate(1240,${700 + 260 * tira}) rotate(${tira * 70})`} opacity={1 - tira * 0.6}><Balde x={0} y={0} s={1.2} lvl={0.7} liq={vida > 0.4 ? "#9d958a" : "#5f5a52"} /></g>
        <g transform="translate(960,150)">
          <rect x={-400} y={-30} width={800} height={60} rx={30} fill="rgba(30,20,10,.85)" stroke={C.cream} strokeWidth={4} />
          <rect x={-392} y={-22} width={784 * vida} height={44} rx={22} fill={vida > 0.4 ? C.ok : C.red} />
          <text y={-60} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{`VIDA DE LA MEZCLA · ${num(t, m.hora - 1, m.hora + 3, 0, 90)} MIN`}</text>
        </g>
        {t > m.nun && <g transform={`translate(1600,560) scale(${spr(t, m.nun)})`}><path d="M-80,-120 Q0,-160 40,-80 L40,40" stroke="#2f8f5a" strokeWidth={26} fill="none" strokeLinecap="round" /><circle cx={40} cy={60} r={20} fill={C.water} /></g>}
        <Cross t={t} at={m.nun + 0.5} x={1600} y={540} r={90} />
      </Svg>
      <Lbl t={t} at={m.tira} text="se tira" x={1240} y={960} col={C.red} size={66} />
    </>
  );
};

// 20 · corte lateral: la regla de aluminio apoyada en dos fajas va en zigzag como serrucho; la mezcla de más se arrastra
// y los huecos se rellenan con la cuchara; tres pasadas y la cara queda pareja
export const ZigzagDeSerrucho: React.FC<FxP> = ({ t, m }) => {
  const av = e(t, m.zig, m.tres + 3), zx = lerp(300, 1500, av), zz = 30 * Math.sin(t * 7), pas = cl((t - m.tres) / 4);
  const surf = (x: number) => x < zx ? 640 : 640 - 40 * Math.abs(Math.sin(x / 50)) - 30;
  const pts = Array.from({ length: 80 }, (_, i) => { const x = 300 + i * 16; return `${x},${surf(x)}`; }).join(" ");
  return (
    <>
      <Svg>
        <rect x={300} y={680} width={1280} height={260} fill={CONTRA} />
        <polygon points={`300,680 ${pts} 1580,680`} fill="#9d958a" />
        {[340, 1540].map((x) => <rect key={x} x={x - 30} y={640} width={60} height={40} fill="#8f877b" stroke={C.honey} strokeWidth={3} />)}
        {t > m.apo && <g transform={`translate(${zx},${620}) rotate(${(zz / 30) * 3})`}><rect x={-30} y={-20} width={60} height={24} fill="#c8ccd0" /><rect x={-640} y={-26} width={1280} height={26} rx={3} fill="#c8ccd0" stroke="#7d848c" strokeWidth={3} transform={`translate(${zz},0)`} /></g>}
        {t > m.zig && <ellipse cx={zx + 40} cy={600} rx={60} ry={30} fill="#9d958a" />}
        {t > m.hue && [700, 1000].map((x, i) => <g key={x}><circle cx={x} cy={640} r={22 * (1 - e(t, m.hue + i, m.hue + i + 1))} fill={CONTRA} /></g>)}
        {[0, 1, 2].map((i) => <circle key={i} cx={1680 + i * 0} cy={300 + i * 90} r={30} fill={pas > i / 3 ? C.ok : "rgba(255,236,200,.2)"} />)}
      </Svg>
      <Lbl t={t} at={m.ser} text="como un serrucho" x={960} y={220} col={C.honey} size={68} />
      <Lbl t={t} at={m.tres} text="2, 3 pasadas" x={1500} y={220} col={C.ok} size={56} />
    </>
  );
};

// 21 · vista cenital del cuarto en paños: el fratás hace círculos y cada paño se pone mate; el orden va del fondo hacia la
// puerta y una figurita sale sin quedar encerrada
export const FondoHaciaLaPuerta: React.FC<FxP> = ({ t, m }) => {
  const pan = Array.from({ length: 6 }, (_, i) => e(t, m.pano + i * 0.9, m.pano + 0.9 + i * 0.9));
  const fx = 960 + 120 * Math.cos(t * 4), fy = 460 + 70 * Math.sin(t * 4), sal = e(t, m.puer, m.puer + 2.5);
  return (
    <>
      <Svg>
        <rect x={460} y={180} width={1000} height={760} fill="#8f877b" stroke="#e9e1cf" strokeWidth={22} />
        <rect x={880} y={928} width={160} height={24} fill="#5e3a1c" />
        {pan.map((k, i) => <rect key={i} x={480 + (i % 2) * 480} y={200 + Math.floor(i / 2) * 240} width={480} height={240} fill="#aaa294" opacity={k} stroke="rgba(0,0,0,.15)" strokeWidth={2} />)}
        {pan.map((k, i) => k > 0.05 && <text key={"n" + i} x={720 + (i % 2) * 480} y={340 + Math.floor(i / 2) * 240} textAnchor="middle" fontSize={60} fontWeight={800} fill="rgba(0,0,0,.25)" fontFamily="Barlow Condensed">{i + 1}</text>)}
        {t < m.pano + 5 && <Fratas x={fx} y={fy} rot={t * 60} s={0.7} />}
        {t > m.cir && t < m.pano && <path d={`M${fx},${fy} m-120,0 a120,70 0 1,0 240,0 a120,70 0 1,0 -240,0`} stroke="rgba(255,255,255,.3)" strokeWidth={4} fill="none" />}
        {sal > 0.02 && <g transform={`translate(960,${lerp(780, 1060, sal)})`}><circle cy={-60} r={26} fill="#e9d3b0" /><rect x={-24} y={-34} width={48} height={70} rx={16} fill="#3b6a8a" /></g>}
        {t > m.puer && <path d="M960,700 L960,900" stroke={C.ok} strokeWidth={10} strokeDasharray="20 14" markerEnd="" />}
      </Svg>
      <Lbl t={t} at={m.mate} text="lisa pero mate" x={960} y={110} col={C.cream} size={64} />
      <Lbl t={t} at={m.puer} text="terminás en la puerta" x={960} y={1030} col={C.ok} size={52} />
    </>
  );
};

// 22 · una línea de tiempo de la carpeta: a la izquierda, demasiado fresca (polvo que se hunde y surcos); a la derecha,
// tarde (escamas); en el medio, la ventana verde que se abre
export const VentanaDeTiempo: React.FC<FxP> = ({ t, m }) => {
  const ven = e(t, m.ven, m.ven + 1.5);
  const P1: React.FC<{ x: number; k: number; tipo: 0 | 1 }> = ({ x, k, tipo }) => (
    <g transform={`translate(${x},640)`}>
      <rect x={-260} y={-150} width={520} height={300} rx={20} fill={tipo ? "#b0a99c" : "#4f4a42"} />
      {tipo === 0 && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-230,${-110 + i * 44} q120,${-20} 230,0 t230,0`} stroke="#2e2a24" strokeWidth={10} fill="none" pathLength={1} strokeDasharray={`${k} 1`} />)}
      {tipo === 1 && Array.from({ length: 14 }, (_, i) => { const up = cl(k * 1.5 - hash(i, 4) * 0.5); return <polygon key={i} transform={`translate(${-200 + (i % 5) * 100},${-90 + Math.floor(i / 5) * 90 - up * 40}) rotate(${up * 30})`} points="-30,-10 20,-20 34,10 -10,22" fill="#ddd8ce" stroke="#8a8277" strokeWidth={3} opacity={up > 0.02 ? 1 : 0} />; })}
    </g>
  );
  return (
    <>
      <Svg>
        <P1 x={420} k={e(t, m.sur, m.sur + 1.6)} tipo={0} />
        <P1 x={1500} k={e(t, m.esc, m.esc + 1.6)} tipo={1} />
        <rect x={720} y={460} width={480} height={360} rx={30} fill="rgba(169,230,108,.18)" stroke={C.ok} strokeWidth={6} transform={`translate(960,640) scale(${ven},1) translate(-960,-640)`} />
        {ven > 0.5 && <text x={960} y={660} textAnchor="middle" fontSize={84} fontWeight={800} fill={C.ok} fontFamily="Barlow Condensed">AHORA</text>}
        <line x1={160} y1={900} x2={1760} y2={900} stroke={C.cream} strokeWidth={6} /><path d="M1760,900 l-26,-16 v32z" fill={C.cream} />
        {t > m.una && <text x={960} y={960} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed" opacity={e(t, m.una, m.una + 0.6)}>1 HORA... O 3</text>}
      </Svg>
      <Lbl t={t} at={m.fre} text="muy fresca" x={420} y={360} col={C.red} size={60} />
      <Lbl t={t} at={m.tar} text="demasiado tarde" x={1500} y={360} col={C.red} size={60} />
    </>
  );
};

// 23 · la prueba de la pisada: el pie baja sobre una tabla y luego en la carpeta tres veces; cada huella se mide con un
// calibre: 1 cm (no), 2-3 mm (sí), casi nada (tarde)
export const TresHuellas: React.FC<FxP> = ({ t, m }) => {
  const H: [number, number, string, string, number][] = [[480, m.cm, "1 cm", C.red, 1], [960, m.mm, "2-3 mm", C.ok, 0.4], [1440, m.casi, "casi nada", C.honey, 0.1]];
  return (
    <>
      <Svg>
        {H.map(([x, at, txt, col, d], i) => {
          const baja = e(t, at - 1, at - 0.2), sube = e(t, at + 0.4, at + 1.2), prof = d * cl(baja * 1.2);
          return <g key={i}>
            <rect x={x - 200} y={560} width={400} height={300} rx={18} fill={i === 0 ? "#4f4a42" : i === 1 ? "#7a7366" : "#a9a295"} />
            <rect x={x - 200} y={560} width={400} height={40} fill="rgba(0,0,0,.2)" />
            {t > at - 0.2 && <g transform={`translate(${x},${720})`}><Suela x={0} y={0} s={0.8} col="#2a2620" o={0.25 + 0.6 * d} /></g>}
            {t > at - 1.2 && t < at + 1.2 && <g transform={`translate(${x},${lerp(300, 650, baja) - 400 * sube})`}><Suela x={0} y={0} s={0.85} col="#e7e2d8" /></g>}
            {t > at + 0.6 && <g transform={`translate(${x},940)`}>
              <rect x={-100} y={-6} width={200} height={12} fill={C.cream} /><rect x={-100} y={-6} width={200 * prof} height={12} fill={col} />
              <text y={60} textAnchor="middle" fontSize={50} fontWeight={800} fill={col} fontFamily="Barlow Condensed">{txt}</text>
            </g>}
          </g>;
        })}
      </Svg>
      <Lbl t={t} at={m.tab} out={m.cm} text="te parás en una tabla" x={960} y={180} col={C.cream} size={62} />
      <Lbl t={t} at={m.tir} out={m.casi} text="está tirando: ¡ahora!" x={960} y={180} col={C.ok} size={66} />
      <Lbl t={t} at={m.mate} text="mate y sano > brillante que se despega" x={960} y={180} col={C.honey} size={52} />
      <Tick t={t} at={m.tir} x={960} y={460} r={50} />
    </>
  );
};

// 24 · la carpeta cambia de color en una franja: gris oscuro brilloso de agua → gris opaco; el sol y el viento aceleran
// (el borde corre más rápido) y se parte el cuarto en dos mitades
export const BrilloQueSeVa: React.FC<FxP> = ({ t, m }) => {
  const k = e(t, m.osc, m.opa + 2), ver = e(t, m.ver, m.ver + 2), mit = e(t, m.ver + 2.5, m.ver + 4);
  return (
    <>
      <Svg>
        <Cuarto luz={1} />
        <Piso cx={960} y={450} w={1500} d={500} moj={1 - k * 0.8} brillo={(1 - k) * 0.7} t={t}>
          {(f) => <>{mit > 0.02 && <polygon points={quad(f, 0.497, 0, 0.503, mit)} fill={C.honey} />}</>}
        </Piso>
        {ver > 0.02 && <><g transform={`translate(1700,180) scale(${ver})`}><circle r={70} fill={C.sun} />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={-90} x2={0} y2={-120} stroke={C.sun} strokeWidth={8} transform={`rotate(${i * 36 + t * 20})`} />)}</g>
          {[0, 1, 2].map((i) => <path key={i} d={`M${200 + ((t * 300 + i * 200) % 600)},${300 + i * 50} q60,-30 120,0 t120,0`} stroke="#d6eaff" strokeWidth={6} fill="none" opacity={ver * 0.7} />)}</>}
      </Svg>
      <Lbl t={t} at={m.osc} out={m.opa} text="oscura y brillosa" x={960} y={1010} col={C.water} size={60} />
      <Lbl t={t} at={m.opa} out={m.ver} text="gris opaco" x={960} y={1010} col={C.cream} size={60} />
      <Lbl t={t} at={m.ver} text="verano o viento: de a mitades" x={960} y={1010} col={C.honey} size={56} />
    </>
  );
};

// 25 · el espolvoreado de cerca: el colador de cocina (o una lata con agujeritos) suelta un velo de 1 mm; un medidor
// de grosor; si se pasa, costra que se cuartea; el polvo se oscurece al chupar humedad y entra la llana
export const ColadorDeCocina: React.FC<FxP> = ({ t, m }) => {
  const cae = e(t, m.azu - 1, m.mm + 2), osc = e(t, m.osc, m.osc + 3), cos = e(t, m.cos, m.cos + 2), ll = e(t, m.lla, m.lla + 1.2);
  return (
    <>
      <Svg>
        <rect x={260} y={640} width={1400} height={300} fill="#7a7366" />
        <rect x={260} y={628 - 10 * cae} width={1400} height={12 + 10 * cae} fill={osc > 0.5 ? "#8a8378" : "#e3ddd2"} opacity={cae} />
        {t > m.col && t < m.lla && <Colador x={lerp(500, 1300, cae)} y={330} t={t} k={1 - osc} s={1.2} />}
        {t > m.lata && t < m.lata + 4 && <g transform={`translate(1540,300) rotate(${-30 + 10 * Math.sin(t * 8)})`}><rect x={-60} y={-90} width={120} height={180} rx={12} fill="#b9c0c6" stroke="#6f7780" strokeWidth={4} />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-40 + (i % 4) * 26} cy={-70 + Math.floor(i / 4) * 12} r={4} fill="#333" />)}</g>}
        {t > m.mm && <g transform="translate(1720,620)"><line x1={0} y1={0} x2={0} y2={20} stroke={C.sun} strokeWidth={4} /><text x={-20} y={0} textAnchor="end" fontSize={44} fontWeight={800} fill={C.sun} fontFamily="Barlow Condensed">1 mm</text></g>}
        {cos > 0.02 && <g transform="translate(700,560)"><rect x={-180} y={0} width={360} height={60} fill="#d8d3c9" />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-170 + i * 46},0 l12,30 l-8,30`} stroke="#6f685d" strokeWidth={4} fill="none" opacity={cos} />)}<Cross t={t} at={m.cos + 1} x={0} y={-80} r={44} /></g>}
        {ll > 0.02 && <LlanaAcero x={lerp(300, 1100, ll)} y={600} rot={0} s={1.1} />}
      </Svg>
      <Lbl t={t} at={m.azu} text="como azúcar impalpable" x={960} y={140} col={C.cream} size={64} />
      <Lbl t={t} at={m.osc} text="se oscurece → llana" x={960} y={1010} col={C.ok} size={56} />
    </>
  );
};

// 26 · la cuenta del polvo: un cuadrado de 1 m² con 1 kg; doce cuadrados con 12 kg que no llenan media bolsa; etiqueta
// de 5 dólares; el barbijo cae sobre la cara
export const KiloPorMetro: React.FC<FxP> = ({ t, m }) => {
  const doce = e(t, m.doce, m.doce + 2), bol = e(t, m.media, m.media + 1.4);
  return (
    <>
      <Svg>
        {Array.from({ length: 12 }, (_, i) => { const k = i === 0 ? spr(t, m.kilo) : cl(doce * 12 - i + 1); return k > 0.02 && <g key={i} transform={`translate(${300 + (i % 4) * 170},${300 + Math.floor(i / 4) * 170}) scale(${Math.min(k, 1)})`}>
          <rect x={-75} y={-75} width={150} height={150} fill="#8f877b" stroke={C.cream} strokeWidth={3} /><Grano n={40} x={-70} y={-70} w={140} h={140} col="#e3ddd2" s={i * 7} />
          <text y={12} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.ink} fontFamily="Barlow Condensed">1 kg</text>
        </g>; })}
        {t > m.media - 0.3 && <g transform={`translate(1360,560) scale(${spr(t, m.media - 0.3)})`}>
          <Bolsa x={0} y={0} s={1.3} kg="50 KG" />
          <rect x={-170} y={-250} width={340} height={460} fill="none" />
          <rect x={-130} y={40} width={260} height={-200 * bol * 0.24 + 0} fill="none" />
          <path d={`M-170,${208} L170,208 L170,${208 - 460 * 0.24 * bol} L-170,${208 - 460 * 0.24 * bol} Z`} fill={C.honey} opacity={0.55} />
        </g>}
        {t > m.cinco && <g transform={`translate(1360,180) scale(${spr(t, m.cinco)}) rotate(-5)`}><path d="M-170,-70 L120,-70 L170,0 L120,70 L-170,70 Z" fill="#f2e3bf" stroke="#9c7a45" strokeWidth={5} /><text x={-20} y={24} textAnchor="middle" fontSize={70} fontWeight={800} fill="#2b1a0c" fontFamily="Barlow Condensed">US$ 5 / m²</text></g>}
        {t > m.barb && <g transform={`translate(960,${lerp(-200, 560, spr(t, m.barb, 0.9))})`}><circle r={110} fill="#e9d3b0" /><path d="M-90,10 Q0,90 90,10 L80,-20 Q0,0 -80,-20 Z" fill="#f4f1e8" stroke="#bbb" strokeWidth={3} /></g>}
      </Svg>
      <Lbl t={t} at={m.doce} text="12 m² = 12 kg" x={550} y={860} col={C.cream} size={64} />
      <Lbl t={t} at={m.media} out={m.cinco} text="menos de media bolsa" x={1360} y={900} col={C.honey} size={52} />
    </>
  );
};

// 27 · la llana de acero en tres pasadas: el ángulo de la hoja sube (plana → inclinada → más) en un medidor; el arco del
// brazo barre; el brillo crece de mate a satinado a piel; la cara se compacta (granos que se juntan)
export const PielDeCemento: React.FC<FxP> = ({ t, m }) => {
  const pas = t < m.p2 ? 1 : t < m.p3 ? 2 : 3, ang = pas === 1 ? 4 : pas === 2 ? 12 : 20;
  const br = e(t, m.p1, m.p1 + 4) * 0.3 + e(t, m.p2, m.p2 + 4) * 0.3 + e(t, m.p3, m.piel) * 0.4;
  const arco = Math.sin(t * 2.2), lx = 960 + 380 * arco, ly = 700 + 60 * Math.cos(t * 2.2);
  return (
    <>
      <Svg>
        <Cuarto luz={0.4 + 0.6 * br} />
        <Piso cx={960} y={450} w={1600} d={560} brillo={br} t={t}>
          {(f) => <>{Array.from({ length: 80 }, (_, i) => { const [x, y] = f(hash(i, 3), hash(i, 4)); return <circle key={i} cx={x} cy={y} r={3 * (1 - br)} fill="#5f594f" />; })}</>}
        </Piso>
        {t > m.brazo && <path d={`M${960 - 380},${700} A380,90 0 0 0 ${960 + 380},700`} stroke="rgba(255,255,255,.28)" strokeWidth={6} strokeDasharray="14 12" fill="none" />}
        <g transform={`translate(${lx},${ly}) skewX(${-ang})`}><LlanaAcero x={0} y={0} rot={arco * 12} brillo={0.4 + 0.6 * br} /></g>
        <g transform="translate(1660,250)">
          <circle r={110} fill="rgba(30,20,10,.85)" stroke={C.cream} strokeWidth={5} />
          <line x1={-80} y1={30} x2={80} y2={30} stroke={C.cem2} strokeWidth={10} />
          <line x1={-70} y1={30} x2={70} y2={30} stroke="#c6ccd2" strokeWidth={10} transform={`rotate(${-ang} -70 30)`} />
          <text y={-36} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.honey} fontFamily="Barlow Condensed">{`${pas}ª PASADA`}</text>
        </g>
      </Svg>
      <Lbl t={t} at={m.pla} out={m.p1} text="casi plana" x={960} y={1010} col={C.cream} size={56} />
      <Lbl t={t} at={m.piel} text="una piel dura y lisa" x={960} y={1010} col={C.ok} size={66} />
    </>
  );
};

// 28 · de rodillas sobre telgopor: círculos que se cruzan dejan una estela de brillo; la mano pasa a 2 cm y el reflejo de
// la ventana aparece entero en el piso
export const VentanaEnElPiso: React.FC<FxP> = ({ t, m }) => {
  const cr = e(t, m.cruz, m.mano), ven = e(t, m.ven, m.ven + 2);
  return (
    <>
      <Svg>
        <Cuarto luz={1} />
        <Piso cx={960} y={450} w={1600} d={560} brillo={0.3 + 0.7 * ven} t={t}>
          {(f) => <>
            {t > m.telg && [0.35, 0.6].map((u, i) => <polygon key={i} points={quad(f, u, 0.7, u + 0.14, 0.92)} fill="#f6f5ef" stroke="#cfcac0" strokeWidth={3} opacity={e(t, m.telg + i * 0.4, m.telg + 0.6 + i * 0.4)} />)}
            {cr > 0.02 && Array.from({ length: 10 }, (_, i) => { const [x, y] = f(0.2 + 0.06 * i, 0.3 + 0.05 * Math.sin(i)); return <ellipse key={i} cx={x} cy={y} rx={90} ry={34} fill="none" stroke="rgba(255,255,255,.4)" strokeWidth={5} opacity={cl(cr * 10 - i)} />; })}
          </>}
        </Piso>
        {t > m.mano && <g transform={`translate(${lerp(400, 1300, e(t, m.mano, m.mano + 3))},640)`}><Mano x={0} y={0} rot={90} s={0.8} /><line x1={-40} y1={70} x2={-40} y2={110} stroke={C.sun} strokeWidth={3} /><text x={-50} y={140} textAnchor="end" fontSize={30} fontWeight={800} fill={C.sun} fontFamily="Barlow Condensed">2 cm</text></g>}
      </Svg>
      <Lbl t={t} at={m.cruz} out={m.ven} text="círculos que se cruzan" x={960} y={1010} col={C.cream} size={58} />
      <Lbl t={t} at={m.ven} text="la ventana, en el cemento" x={960} y={1010} col={C.sun} size={62} />
    </>
  );
};

// 29 · el cemento NO se seca, fragua: cristales que crecen tomando agua; si el agua se va, los cristales se cortan a la
// mitad y el piso queda débil con telaraña
export const ReaccionQueSeCorta: React.FC<FxP> = ({ t, m }) => {
  const cre = e(t, m.agua, m.agua + 3), cor = e(t, m.cor, m.cor + 2), tel = e(t, m.cor + 3, m.cor + 6);
  return (
    <>
      <Svg>
        <circle cx={760} cy={540} r={330} fill="#2a2620" stroke={C.cream} strokeWidth={8} />
        {Array.from({ length: 24 }, (_, i) => { const ang = (i / 24) * Math.PI * 2, L = 280 * cre * (1 - cor * 0.5 * hash(i, 2)); return <line key={i} x1={760} y1={540} x2={760 + Math.cos(ang) * L} y2={540 + Math.sin(ang) * L} stroke="#d6d2ca" strokeWidth={8} strokeLinecap="round" />; })}
        {Array.from({ length: 20 }, (_, i) => { const ph = (t * 0.5 + hash(i, 3)) % 1, a2 = hash(i, 4) * Math.PI * 2; return <circle key={i} cx={760 + Math.cos(a2) * 300 * (1 - ph)} cy={540 + Math.sin(a2) * 300 * (1 - ph)} r={8} fill={C.water} opacity={(1 - cor) * ph} />; })}
        {cor > 0.02 && Array.from({ length: 16 }, (_, i) => { const ph = (t * 0.6 + hash(i, 5)) % 1; return <path key={i} d={`M${700 + 120 * hash(i, 6)},${400 - ph * 200} q10,-20 0,-40`} stroke="rgba(214,240,255,.5)" strokeWidth={6} fill="none" opacity={cor * (1 - ph)} />; })}
        <g transform="translate(1440,560)" opacity={tel}>
          <rect x={-260} y={-200} width={520} height={400} rx={16} fill="#a9a295" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0,0 L${Math.cos(i) * 240},${Math.sin(i * 1.3) * 180}`} stroke="#3a342c" strokeWidth={4} />)}
          <path d="M-120,-60 L80,-90 L160,40 L-40,120 Z" fill="none" stroke="#3a342c" strokeWidth={3} />
        </g>
      </Svg>
      <Lbl t={t} at={m.fra} text="no se seca: fragua" x={760} y={120} col={C.honey} size={70} />
      <Lbl t={t} at={m.cor} text="sin agua, se corta" x={1440} y={120} col={C.red} size={60} />
    </>
  );
};

// 30 · calendario de 7 días bajo el nylon: el dedo toca suave, el rociador moja, el nylon cae con ladrillos; las casillas
// se tachan una por una; los primeros 3 en rojo (los que importan); el sol directo rebota en una sombrilla
export const SemanaBajoElNylon: React.FC<FxP> = ({ t, m }) => {
  const ny = spr(t, m.nyl, 0.8), dias = e(t, m.siete, m.tres + 3) * 7;
  return (
    <>
      <Svg>
        <Piso cx={760} y={500} w={1000} d={420} moj={0.5} t={t}>
          {(f) => <>
            {t > m.dedo && t < m.roc && <ellipse cx={f(0.5, 0.5)[0]} cy={f(0.5, 0.5)[1]} rx={30} ry={14} fill="rgba(0,0,0,.2)" />}
            {t > m.roc && Array.from({ length: 30 }, (_, i) => { const [x, y] = f(hash(i, 2), hash(i, 3)); return <circle key={i} cx={x} cy={y} r={5} fill={C.water} opacity={0.6 * e(t, m.roc, m.roc + 1)} />; })}
            {ny > 0.02 && <polygon points={quad(f, -0.03, -0.03, 1.03, 1.03)} fill="rgba(28,32,36,.78)" opacity={cl(ny)} transform={`translate(0,${(1 - cl(ny)) * -200})`} />}
          </>}
        </Piso>
        {t > m.roc && t < m.nyl && <g transform={`translate(1100,360) rotate(-20)`}><rect x={-30} y={-80} width={60} height={140} rx={14} fill="#3a7bd5" /><rect x={-14} y={-120} width={28} height={40} fill="#ddd" />{Array.from({ length: 8 }, (_, i) => { const ph = (t * 2 + i / 8) % 1; return <circle key={i} cx={-40 - ph * 120} cy={-110 + ph * 160} r={5} fill={C.water} opacity={1 - ph} />; })}</g>}
        <g transform="translate(1340,260)">
          {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${(i % 4) * 130},${Math.floor(i / 4) * 150})`}>
            <rect x={-55} y={-55} width={110} height={110} rx={12} fill="rgba(30,20,10,.85)" stroke={i < 3 ? C.red : C.cream} strokeWidth={5} />
            <text y={16} textAnchor="middle" fontSize={50} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed">{i + 1}</text>
            {dias > i && <path d="M-34,0 L-8,28 L36,-30" stroke={C.ok} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${cl(dias - i)} 1`} />}
          </g>)}
        </g>
        {t > m.sol && <g transform={`translate(1560,${880})`} opacity={e(t, m.sol, m.sol + 1)}><circle cx={180} cy={-60} r={50} fill={C.sun} /><path d="M-160,0 Q0,-150 160,0 Z" fill="#c43b2c" /><rect x={-6} y={0} width={12} height={180} fill="#555" /></g>}
      </Svg>
      <Lbl t={t} at={m.siete} text="7 días húmedo" x={1530} y={130} col={C.ok} size={60} />
      <Lbl t={t} at={m.tres} text="los primeros 3, sagrados" x={1530} y={620} col={C.red} size={46} />
    </>
  );
};

// 31 · junta de corte: un cuarto grande (>25 m²) en planta; la amoladora corta una línea finita; el cemento se achica
// (flechas hacia adentro) y la fisura, en vez de cruzar en diagonal, se mete por la junta elegida
export const FisuraElegida: React.FC<FxP> = ({ t, m }) => {
  const cor = e(t, m.amo, m.amo + 2.5), ach = e(t, m.ach, m.ach + 2), dia = e(t, m.diag, m.diag + 1.8), ele = e(t, m.ele, m.ele + 2);
  return (
    <>
      <Svg>
        <rect x={400} y={200} width={1120} height={720} fill="#a49c8e" stroke="#e9e1cf" strokeWidth={20} transform={`translate(960,560) scale(${1 - 0.02 * ach}) translate(-960,-560)`} />
        {t > m.vein && <text x={960} y={180} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.cream} fontFamily="Barlow Condensed" opacity={e(t, m.vein, m.vein + 0.6)}>MÁS DE 25 m²</text>}
        <line x1={960} y1={210} x2={960} y2={210 + 700 * cor} stroke="#3a342c" strokeWidth={6} />
        {t > m.amo && t < m.amo + 2.6 && <g transform={`translate(960,${210 + 700 * cor})`}><circle r={60} fill="#9aa2a9" stroke="#555" strokeWidth={6} /><rect x={30} y={-24} width={200} height={48} rx={20} fill="#2e6fd1" />{Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={0} x2={-40 - 40 * hash(i + Math.floor(t * 10), 2)} y2={-30 * hash(i, 3)} stroke={C.sun} strokeWidth={3} />)}</g>}
        {ach > 0.02 && [[480, 560, 1], [1440, 560, -1]].map(([x, y, d], i) => <path key={i} d={`M${x},${y} l${d * 60},0 m${-d * 20},-18 l${d * 20},18 l${-d * 20},18`} stroke={C.honey} strokeWidth={8} fill="none" opacity={ach} />)}
        {t < m.ele && <path d="M440,240 L700,460 L820,560 L1100,740 L1480,880" stroke={C.red} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={`${dia} 1`} />}
        {ele > 0.02 && <path d="M960,210 L960,910" stroke={C.ok} strokeWidth={10} pathLength={1} strokeDasharray={`${ele} 1`} style={{ filter: `drop-shadow(0 0 10px ${C.ok})` }} />}
      </Svg>
      <Cross t={t} at={m.diag + 1.6} x={1240} y={820} r={44} />
      <Lbl t={t} at={m.cor} text="un corte finito" x={960} y={1010} col={C.cream} size={58} />
      <Lbl t={t} at={m.ele} text="la fisura que vos elegiste" x={960} y={1010} col={C.ok} size={58} />
    </>
  );
};
