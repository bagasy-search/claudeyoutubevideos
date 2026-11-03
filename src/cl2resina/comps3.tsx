// cl2resina · componentes de los errores al cierre (cinco errores, el frasco de Don Ramón, la prueba de la canilla, sellar,
// bañar y no colar, el pegamento que respira, el seis, las cuentas, las preguntas, guardar y tirar).
import React from "react";
import { C, FONT, BODY, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";
import { Vaso, Telgo } from "./comps1";

// 35 · cinco errores = cinco frascos en un estante; cada uno se rompe a su turno y le cuelga un cartelito rojo
export const CincoFrascos: React.FC<FxP> = ({ t, a, m }) => {
  const E5 = [["disolvente flojo", m.e1], ["capa gruesa", m.e2], ["ventana cerrada", m.e3], ["frasco de plástico", m.e4], ["apurarse", m.e5]] as [string, number][];
  return (
    <>
      <Svg>
        <rect x={160} y={640} width={1600} height={30} rx={6} fill={C.wood} opacity={cl((t - a) * 3)} />
        {E5.map(([, at], i) => { const x = 320 + i * 320, br = e(t, at + 0.2, at + 0.6); return (
          <g key={i} opacity={cl((t - a - i * 0.15) * 3)} transform={`translate(${shake(t, at + 0.2, 10)},0)`}>
            <Vaso x={x} y={640} w={150} h={220} lv={0.5} liq={i === 3 ? "rgba(255,255,255,.2)" : "rgba(240,169,58,.5)"} lid />
            <Draw d={`M${x - 50},${470} l 30,40 l -20,30 l 40,50`} p={br} col={C.red} w={6} />
          </g>); })}
      </Svg>
      {E5.map(([w, at], i) => <Lbl key={i} t={t} at={at + 0.4} text={w} x={320 + i * 320} y={i % 2 ? 860 : 760} col={C.red} size={40} />)}
      <Pop t={t} at={a + 0.2} x={960} y={250}><Big size={120} col={C.honey}>5 errores</Big></Pop>
    </>
  );
};

// 36 · el frasco de Don Ramón: el frasco de aceitunas con el pincel; los otoños pasan en un almanaque y la ventana sigue sana
export const FrascoAceitunas: React.FC<FxP> = ({ t, a, m }) => {
  const yr = Math.floor(40 * e(t, m.otono, m.cuarenta + 0.6)), bolsa = spr(t, m.bolsa, 0.9);
  return (
    <>
      <Svg>
        <Vaso x={560} y={820} w={320} h={460} lv={0.6} liq="rgba(201,120,31,.6)" lid />
        <g transform="translate(820,820)"><rect x={-60} y={-130} width={120} height={130} rx={12} fill="rgba(143,211,255,.25)" stroke={C.edge} strokeWidth={3} /><rect x={-10} y={-330} width={20} height={250} rx={8} fill="#7a5b2a" /><path d="M-26,-90 L26,-90 L18,-20 L-18,-20 Z" fill="#3a2a16" /></g>
        {Array.from({ length: 10 }, (_, i) => { const u = ((t - m.otono) * 0.5 + hash(i, 1)) % 1; return t > m.otono ? <path key={i} d={`M${1100 + hash(i, 2) * 600},${180 + u * 700} q 18,-10 30,6 q -14,14 -30,-6`} fill={["#c9781f", "#a5451b", "#d9a43a"][i % 3]} opacity={1 - u} transform={`rotate(${u * 300} ${1115 + hash(i, 2) * 600} ${180 + u * 700})`} /> : null; })}
        {bolsa > 0.01 && <g transform={`translate(1500,${300 + (1 - bolsa) * -200})`} opacity={cl(bolsa * 2)}><line x1={0} y1={-120} x2={0} y2={-60} stroke={C.cream} strokeWidth={4} /><path d="M-130,-60 Q0,-90 130,-60 L150,250 Q0,290 -150,250 Z" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.6)" strokeWidth={3} />{[0, 1, 2, 3, 4, 5].map((i) => <Telgo key={i} x={-70 + (i % 3) * 70} y={40 + Math.floor(i / 3) * 110} s={70} rot={hash(i, 3) * 40} />)}</g>}
      </Svg>
      <Pop t={t} at={m.otono} out={m.bolsa} x={1400} y={520}><Big size={150} col={C.honey}>{yr} años</Big></Pop>
      <Lbl t={t} at={a + 0.5} text="el frasco de Don Ramón" x={700} y={200} col={C.cream} size={54} align="left" />
      <Lbl t={t} at={m.cuarenta + 0.4} out={m.bolsa} text="ni una parte podrida" x={1400} y={700} col={C.ok} size={52} />
      <Lbl t={t} at={m.bolsa + 0.6} text="barniz de regalo" x={1500} y={930} col={C.honey} size={54} />
    </>
  );
};

// 37 · dos tablitas bajo la canilla: la desnuda se oscurece y se hincha; la tratada hace gotitas que resbalan
export const DosTablitas: React.FC<FxP> = ({ t, a, m }) => {
  const d = e(t, m.desn, m.desn + 2), r = e(t, m.res, m.res + 1), am = e(t, m.sol, m.sol + 1.5);
  return (
    <>
      <Svg>
        {[560, 1360].map((x, i) => <g key={i}>
          <rect x={x - 70} y={140} width={140} height={50} rx={10} fill="#b8a77d" /><rect x={x - 20} y={190} width={40} height={40} fill="#b8a77d" />
          {Array.from({ length: 8 }, (_, j) => { const u = ((t * 1.6 + j / 8) % 1); return <ellipse key={j} cx={x + 6 * Math.sin(j)} cy={240 + u * 300} rx={8} ry={16} fill={C.water} opacity={0.85} />; })}
          <rect x={x - 260} y={540 - (i === 0 ? 10 * d : 0)} width={520} height={110 + (i === 0 ? 20 * d : 0)} rx={10} fill={i === 0 ? `rgb(${lerp(192, 120, d)},${lerp(138, 80, d)},${lerp(82, 46, d)})` : C.wood} />
          {i === 1 && <rect x={x - 260} y={532} width={520} height={12} rx={6} fill={`rgba(${lerp(255, 240, am)},${lerp(236, 200, am)},${lerp(200, 90, am)},.7)`} />}
          {i === 1 && r > 0 && [0, 1, 2, 3, 4].map((j) => <ellipse key={j} cx={x - 200 + j * 100 + ((t - m.res) * 160 * (j % 2 ? 1 : -1)) % 120} cy={524} rx={18} ry={13} fill={C.water} stroke="#fff" strokeWidth={2} opacity={r} />)}
          {i === 0 && d > 0.5 && Array.from({ length: 10 }, (_, j) => <path key={j} d={`M${x - 240 + j * 50},${530 - 10 * d} l 6,-${16 * d}`} stroke="#5e3a1c" strokeWidth={4} />)}
        </g>)}
      </Svg>
      <Lbl t={t} at={m.desn + 0.4} text="desnuda: chupa" x={560} y={800} col={C.red} size={56} />
      <Lbl t={t} at={m.res + 0.4} text="con resina: resbala" x={1360} y={800} col={C.ok} size={56} />
      <Lbl t={t} at={m.ano} text="una mano cada año" x={960} y={940} col={C.honey} size={56} />
    </>
  );
};

// 38 · sellar: corte de una grieta; la laca la llena en pasadas; con el frío y el calor la grieta respira y la laca la acompaña
export const SellaGrieta: React.FC<FxP> = ({ t, a, m }) => {
  const f = e(t, m.llena, m.llena + 2.5), osc = t > m.acomp ? Math.sin((t - m.acomp) * 2.2) : 0, w = 18 + 8 * osc;
  return (
    <>
      <Svg>
        <path d={`M240,360 L${930 - w},360 L${940 - w * 0.6},560 L${925 - w * 0.3},760 L240,760 Z`} fill="#cfc8bb" />
        <path d={`M1680,360 L${990 + w},360 L${980 + w * 0.6},560 L${995 + w * 0.3},760 L1680,760 Z`} fill="#cfc8bb" />
        <path d={`M${930 - w},360 L${940 - w * 0.6},560 L${925 - w * 0.3},760 L${995 + w * 0.3},760 L${980 + w * 0.6},560 L${990 + w},360 Z`} fill="rgba(240,169,58,.8)" style={{ clipPath: `inset(${(1 - f) * 100}% 0 0 0)` }} />
        <g transform="translate(400,220)" opacity={t > m.acomp ? 1 : 0}><circle r={56} fill={osc > 0 ? "rgba(255,180,80,.25)" : "rgba(124,200,255,.25)"} stroke={osc > 0 ? C.sun : C.solv} strokeWidth={4} /><text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={C.ink}>{osc > 0 ? "☀" : "❄"}</text></g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="grietas chicas" x={1500} y={240} col={C.cream} size={56} />
      <Lbl t={t} at={m.llena + 0.4} text="dos o tres pasadas" x={960} y={880} col={C.honey} size={54} />
      <Lbl t={t} at={m.acomp + 0.6} text="acompaña, no se raja" x={1500} y={960} col={C.ok} size={50} />
    </>
  );
};

// 39 · moldes no, baños sí: el molde lleno se encoge y se tuerce; la figurita colgada de un hilo se baña tres veces
export const MoldeNoBanoSi: React.FC<FxP> = ({ t, a, m }) => {
  const sh = e(t, m.no, m.no + 2), dips = Math.min(3, Math.floor(e(t, m.tres, m.tres + 3) * 3.99)), dip = (t - m.sumer) % 1.2;
  const yfig = t > m.sumer ? 560 + 120 * Math.sin(cl(dip / 1.2) * Math.PI) : 520;
  return (
    <>
      <Svg>
        <rect x={260} y={520} width={460} height={240} rx={30} fill="#e88aa8" />
        <path d={`M${310 + 30 * sh},${560 + 20 * sh} Q490,${540 + 40 * sh} ${670 - 30 * sh},${570 + 30 * sh} L${660 - 40 * sh},720 L${320 + 40 * sh},720 Z`} fill="rgba(236,232,222,.85)" transform={`rotate(${-4 * sh} 490 640)`} />
        <g opacity={e(t, m.bano, m.bano + 0.6)}>
          <Vaso x={1400} y={880} w={300} h={320} lv={0.7} liq="rgba(240,169,58,.5)" />
          <line x1={1400} y1={120} x2={1400} y2={yfig - 70} stroke={C.cream} strokeWidth={3} />
          <g transform={`translate(1400,${yfig})`}><path d="M0,-70 C 40,-70 46,-20 26,6 L40,70 L-40,70 L-26,6 C -46,-20 -40,-70 0,-70 Z" fill="#f4f1ea" stroke={`rgba(240,169,58,${0.2 + 0.27 * dips})`} strokeWidth={4 + 4 * dips} /></g>
        </g>
      </Svg>
      <Cross t={t} at={m.no + 1.4} x={490} y={360} r={56} />
      <Lbl t={t} at={m.no + 0.6} text="en molde: se encoge" x={490} y={860} col={C.red} size={52} />
      <Lbl t={t} at={m.bano + 0.5} text="para bañar: sí" x={1400} y={980} col={C.ok} size={54} />
      <Pop t={t} at={m.tres} x={1700} y={420}><Big size={110} col={C.honey}>{dips}/3</Big></Pop>
    </>
  );
};

// 40 · el pegamento respira: madera con madera, el vapor sale por los poros; entre dos vidrios queda encerrado
export const PegaRespira: React.FC<FxP> = ({ t, a, m }) => {
  const vid = e(t, m.vid, m.vid + 0.8);
  return (
    <>
      <Svg>
        <g opacity={cl((t - a) * 3)}>
          <rect x={260} y={420} width={560} height={110} rx={8} fill={C.wood} /><rect x={260} y={540} width={560} height={110} rx={8} fill={C.wood} />
          <rect x={260} y={528} width={560} height={14} fill="rgba(240,169,58,.9)" />
          {Array.from({ length: 10 }, (_, i) => { const u = ((t - a) * 0.6 + hash(i, 1)) % 1; return <circle key={i} cx={300 + hash(i, 2) * 480} cy={520 - u * 220} r={7} fill={C.solv} opacity={(1 - u) * e(t, m.resp, m.resp + 0.5)} />; })}
        </g>
        <g opacity={vid}>
          <rect x={1100} y={430} width={560} height={90} rx={6} fill="rgba(220,240,255,.25)" stroke={C.edge} strokeWidth={3} /><rect x={1100} y={540} width={560} height={90} rx={6} fill="rgba(220,240,255,.25)" stroke={C.edge} strokeWidth={3} />
          <rect x={1100} y={522} width={560} height={16} fill="rgba(240,169,58,.9)" />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={1130 + i * 54 + 8 * Math.sin(t * 4 + i)} cy={530} r={6} fill={C.solv} />)}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="madera con madera" x={540} y={760} col={C.cream} size={52} />
      <Lbl t={t} at={m.resp + 0.4} text="respira y seca" x={540} y={860} col={C.ok} size={52} />
      <Lbl t={t} at={m.vid + 0.4} text="vidrio: una eternidad" x={1380} y={760} col={C.red} size={52} />
    </>
  );
};

// 41 · el seis: el tenedor transparente se da vuelta y aparece el triangulito; la prueba de la uña sobre dos tablas
export const TrianguloSeis: React.FC<FxP> = ({ t, a, m }) => {
  const fl = e(t, a + 0.3, a + 1.3), tri = e(t, a + 1.2, a + 2.4), un = t >= m.una;
  return (
    <>
      {!un && <Svg>
        <g transform={`translate(700,560) scale(${Math.cos(fl * Math.PI) || 0.01},1)`}><path d="M-40,-300 L-40,-120 M-14,-300 L-14,-120 M14,-300 L14,-120 M40,-300 L40,-120 M-50,-120 Q0,-60 50,-120 L22,300 L-22,300 Z" stroke="rgba(220,240,255,.85)" strokeWidth={10} fill="rgba(220,240,255,.25)" /></g>
        <g transform="translate(1300,540)"><Draw d="M0,-170 L170,120 L-170,120 Z" p={tri} col={C.ok} w={12} /><text y={70} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={170} fill={C.ok} opacity={e(t, a + 2, a + 2.4)}>6</text></g>
      </Svg>}
      {un && <Svg>
        {[560, 1360].map((x, i) => { const k = spr(t, m.una + i * 1.4, 1), sc = e(t, m.una + i * 1.4 + 0.4, m.una + i * 1.4 + 1.2); return <g key={i}>
          <rect x={x - 300} y={480} width={600} height={160} rx={12} fill={C.wood} /><rect x={x - 300} y={468} width={600} height={16} rx={6} fill={i ? "rgba(220,240,255,.7)" : "rgba(240,190,110,.75)"} />
          {i === 0 && <Draw d={`M${x - 120},476 L${x + 120},476`} p={sc} col="#5e3a1c" w={6} />}
          {k > 0.01 && <rect x={x - 40 + sc * 200 - 100} y={lerp(300, 410, cl(k))} width={70} height={60} rx={24} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={3} opacity={1 - e(t, m.una + i * 1.4 + 1.2, m.una + i * 1.4 + 1.5)} />}
        </g>; })}
      </Svg>}
      {!un && <Lbl t={t} at={a + 1.8} text="transparentes, rígidos" x={1300} y={820} col={C.cream} size={54} />}
      {un && <Lbl t={t} at={m.una + 1.2} text="telgopor: marca" x={560} y={760} col={C.red} size={54} />}
      {un && <Lbl t={t} at={m.una + 2.6} text="cubiertos: resbala" x={1360} y={760} col={C.ok} size={54} />}
      {un && <Lbl t={t} at={m.cd} text="CD, tapas, vasitos duros" x={960} y={940} col={C.honey} size={50} />}
    </>
  );
};

// 42 · las cuentas: dos ceros (telgopor y cubiertos), una lata de thinner que se reparte en frascos; la tabla = un café
export const CuentaCafe: React.FC<FxP> = ({ t, a, m }) => {
  const fr = Math.min(4, Math.floor(e(t, m.litro, m.litro + 2) * 4.99));
  return (
    <>
      {[["telgopor", a + 0.4], ["cubiertos", a + 1.2]].map(([w, at], i) => (
        <Pop key={i} t={t} at={at as number} x={360 + i * 380} y={420}><div style={{ ...glass(), padding: "18px 30px", textAlign: "center" }}><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.ok }}>$0</div><Txt size={32}>{w as string}</Txt></div></Pop>
      ))}
      <Svg>
        <g opacity={cl((t - m.litro) * 3)}><rect x={1140} y={260} width={170} height={250} rx={16} fill="#c7b89a" stroke="#5e584d" strokeWidth={4} />{Array.from({ length: fr }, (_, i) => <Vaso key={i} x={1400 + i * 100} y={510} w={70} h={100} lv={0.7} liq="rgba(240,169,58,.6)" lid />)}</g>
        <g opacity={e(t, m.cafe, m.cafe + 0.5)} transform="translate(960,800)"><path d="M-90,-60 L90,-60 L70,60 Q0,80 -70,60 Z" fill="#f4f1ea" /><path d="M90,-30 q 50,0 40,40 q -10,30 -50,20" stroke="#f4f1ea" strokeWidth={14} fill="none" /><ellipse cx={0} cy={-60} rx={90} ry={16} fill="#5e3a1c" />{[0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 40},-90 q 14,-30 0,-60`} stroke="rgba(255,255,255,.5)" strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />)}</g>
      </Svg>
      <Lbl t={t} at={m.litro + 0.4} text="un litro, varios frascos" x={1420} y={620} col={C.honey} size={50} />
      <Lbl t={t} at={m.cafe + 0.3} text="la tabla: un café" x={960} y={960} col={C.cream} size={58} />
      <Lbl t={t} at={m.ferre} text="preguntá cuánto sale" x={1420} y={760} col={C.sun} size={50} />
    </>
  );
};

// 43 · las preguntas: tarjetas que caen como fichas en una pila, cada una con su país y la respuesta en una palabra
export const PreguntasPais: React.FC<FxP> = ({ t, a, m }) => {
  const Q = [["Colombia", "¿catalizador?", "no hace falta", m.col, C.red], ["México", "¿acetona?", "sí, la pura", m.mex, C.ok], ["Honduras", "¿la gota?", "quieta como miel", m.hon, C.ok], ["Chile", "¿dónde consigo?", "xilol, ferretería", m.chi, C.ok], ["Brasil", "¿con gasolina?", "no", m.bra, C.red], ["Argentina", "¿la mesada?", "sí, sin calor", m.arg, C.honey]] as [string, string, string, number, string][];
  const cur = Q.filter((q) => t >= q[3] - 0.1).length - 1;
  return (
    <>
      {Q.map(([pais, pre, res, at, col], i) => {
        if (t < at - 0.1) return null;
        const d = cur - i, p = spr(t, at, 1);
        return (
          <div key={pais} style={{ position: "absolute", left: 960 - 520 + d * 26, top: 260 - d * 38 + (1 - p) * 300, width: 1040, height: 520, ...glass(1), background: "rgba(36,24,12,.92)", opacity: d > 3 ? 0 : 1 - d * 0.18, transform: `rotate(${(hash(i, 3) - 0.5) * 6}deg) scale(${1 - d * 0.04})`, padding: "44px 60px", zIndex: 10 - d }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.honey, letterSpacing: 4, textTransform: "uppercase" }}>desde {pais}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, color: C.ink, marginTop: 10 }}>{pre}</div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 64, color: col, marginTop: 30, opacity: e(t, at + 1, at + 1.4) }}>→ {res}</div>
          </div>
        );
      })}
    </>
  );
};

// 44 · guardar y tirar: el frasco rotulado arriba; lo que sobra va a una lata al sol (nunca a la pileta); las manos, con aceite
export const GuardarTirar: React.FC<FxP> = ({ t, a, m }) => {
  const lt = e(t, m.lata, m.lata + 2), mn = t >= m.manos;
  return (
    <>
      {!mn && <Svg>
        <rect x={200} y={360} width={520} height={24} rx={6} fill={C.wood} />
        <Vaso x={460} y={360} w={200} h={260} lv={0.65} liq="rgba(240,169,58,.6)" lid />
        <rect x={400} y={210} width={120} height={70} rx={6} fill="#f2e3bf" opacity={e(t, a + 0.5, a + 0.9)} />
        <g transform="translate(1000,760)" opacity={cl((t - m.lata) * 3)}><rect x={-110} y={-150} width={220} height={150} rx={10} fill="#a49f93" /><ellipse cx={0} cy={-150} rx={110} ry={22} fill={`rgba(${lerp(240, 200, lt)},${lerp(169, 190, lt)},${lerp(58, 170, lt)},1)`} />{Array.from({ length: 6 }, (_, i) => { const u = ((t - m.lata) * 0.4 + i / 6) % 1; return <path key={i} d={`M${-60 + i * 24},${-170 - u * 160} q 10,-14 20,0`} stroke={C.solv} strokeWidth={4} fill="none" opacity={(1 - u) * (1 - lt)} />; })}</g>
        <g transform="translate(1520,700)"><ellipse rx={150} ry={50} fill="#d8d4cb" stroke="#8d887e" strokeWidth={4} /><circle r={16} fill="#6e695f" /></g>
      </Svg>}
      {!mn && <Cross t={t} at={m.lata - 0.6} x={1520} y={520} r={56} />}
      {!mn && <Lbl t={t} at={a + 0.9} text="rotulado y tapado" x={460} y={500} col={C.cream} size={48} />}
      {!mn && <Lbl t={t} at={m.lata + 0.4} text="se seca afuera" x={1000} y={880} col={C.ok} size={52} />}
      {!mn && <Lbl t={t} at={m.trapo} text="trapos extendidos" x={1000} y={970} col={C.honey} size={46} />}
      {mn && <Svg>
        {[760, 1160].map((x, i) => <g key={i} transform={`translate(${x + 20 * Math.sin((t - m.manos) * 5) * (i ? -1 : 1) * e(t, m.aceite, m.aceite + 0.4)},560)`}><path d="M-110,200 L-110,-20 Q-110,-120 0,-140 Q110,-120 110,-20 L110,200 Z" fill="#e2b48f" stroke="#7a4b2f" strokeWidth={4} /><ellipse cx={0} cy={-30} rx={60} ry={30} fill="rgba(240,169,58,.7)" opacity={1 - e(t, m.aceite + 0.6, m.aceite + 2)} /></g>)}
        <g transform="translate(960,240)" opacity={e(t, m.aceite, m.aceite + 0.4)}><rect x={-40} y={-90} width={80} height={180} rx={20} fill="rgba(240,200,80,.8)" stroke="#8a6a1a" strokeWidth={3} /></g>
      </Svg>}
      {mn && <Lbl t={t} at={m.manos + 0.4} text="no con disolvente" x={960} y={880} col={C.red} size={56} out={m.aceite + 0.6} />}
      {mn && <Lbl t={t} at={m.aceite + 0.8} text="aceite de cocina, después jabón" x={960} y={880} col={C.ok} size={50} />}
    </>
  );
};
