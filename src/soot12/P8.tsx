import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, ent, prog, Escena, Particulas, Rayos, Emote, fontFamily } from "./kit";
import { Mundo, camEn, Key, Cam, SAJON, VIK, barbaDe, gy, PARADAS } from "./mundo";
import { G, Ch, Cuenta, Sello, Flash, LanzaMano, MapaN, lugarN } from "./comun";
import { CrecePueblo } from "./escenas";
import { Corona, Esqueleto, Drakkar, Empalizada, Iglesia, Tienda } from "./vik";
import { Craneo } from "./kit2";

// 779,8-922,3 s · EL GIRO Y EL CIERRE. ¿Trampa mortal? Los que les ganaron casi nunca lo hicieron de noche: Edington a la luz del
// día, el sitio de 14 días, Guthrum bautizado; o la plata (París 845). Dublín, Repton, el repaso por las 7 paradas del mundo y el CTA.
export const CAM8: Key[] = [
  [779.75, 5300, 640, 0.55], [783.33, 5000, 600, 0.7],
  [871.42, 3600, 640, 0.6], [875.47, 4080, 600, 1.2],
  [896.4, 1250, 440, 0.55], [898.26, 1250, 440, 0.6], [899.62, 3500, 600, 0.6], [900.49, 4700, 560, 0.6], [901.4, 5500, 560, 0.6],
  [903.23, 7700, 560, 0.6], [904.09, 8800, 560, 0.6], [905.12, 9900, 560, 0.6], [906.54, 5575, -260, 0.16], [910.7, 5575, -260, 0.16],
  [910.78, 5400, 560, 0.45], [922.3, 5600, 540, 0.5],
];
const ALFRED = { tunica: "#c8a23a", tunica2: "#8a6a1a", cinto: "#3b230f", piel: "#e8a880", piel2: "#c98864", pelo: "#3a2418" };
const GUTHRUM = { tunica: "#4a2a2a", tunica2: "#2a1a1a", cinto: "#c9a24a", piel: "#f2b48a", piel2: "#d98d66", pelo: "#a8552a" };
const CARLOS = { tunica: "#3a4aa8", tunica2: "#22306e", cinto: "#c9a24a", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#f2c4a0" };

const Monedas: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 12 }) => (
  <svg style={{ position: "absolute", left: x - 260 * s, top: y - 240 * s, overflow: "visible" }} width={520 * s} height={280 * s} viewBox="-260 -240 520 280">
    {Array.from({ length: n }, (_, i) => { const col = i % 4, fila = Math.floor(i / 4); const cx = -180 + col * 120 + (fila % 2) * 60, cy = 20 - fila * 60; return (
      <g key={i}><ellipse cx={cx} cy={cy + 10} rx={56} ry={20} fill="#a8801a" stroke="#2a1530" strokeWidth={5} /><ellipse cx={cx} cy={cy} rx={56} ry={20} fill="#ffd23a" stroke="#2a1530" strokeWidth={5} /><ellipse cx={cx} cy={cy} rx={30} ry={10} fill="none" stroke="#e8a81a" strokeWidth={4} /></g>
    ); })}
  </svg>
);

const Martillo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg style={{ position: "absolute", left: x - 60 * s, top: y - 70 * s, overflow: "visible" }} width={120 * s} height={140 * s} viewBox="-60 -70 120 140">
    <path d="M 0 -70 L 0 -40" stroke="#c9a24a" strokeWidth={6} />
    <rect x={-10} y={-44} width={20} height={60} fill="#dcc070" stroke="#2a1530" strokeWidth={5} />
    <path d="M -50 10 L 50 10 L 40 60 L -40 60 Z" fill="#dcc070" stroke="#2a1530" strokeWidth={6} />
  </svg>
);

// espada en la mano: a = bD+cD la deja parada; gira = 180 la pone punta abajo
const EspadaMano: React.FC<{ a: number; gira?: number }> = ({ a, gira = 0 }) => (
  <g transform={`rotate(${a + gira})`}>
    <rect x={-9} y={-30} width={18} height={56} rx={5} fill="#6b4022" stroke="#2a1530" strokeWidth={5} />
    <circle cx={0} cy={32} r={13} fill="#c9a24a" stroke="#2a1530" strokeWidth={5} />
    <rect x={-40} y={-46} width={80} height={16} rx={6} fill="#c9a24a" stroke="#2a1530" strokeWidth={5} />
    <path d="M -9 -46 L 9 -46 L 9 -276 L 0 -302 L -9 -276 Z" fill="#d8dee8" stroke="#2a1530" strokeWidth={6} />
  </g>
);

// hacha vikinga en la mano (a = bD+cD la deja parada; +25 la inclina hacia adelante)
const HachaMano: React.FC<{ a: number }> = ({ a }) => (
  <g transform={`rotate(${a})`}>
    <rect x={-7} y={-150} width={14} height={190} rx={6} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} />
    <path d="M 4 -146 L 46 -176 Q 76 -132 46 -88 L 4 -114 Z" fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} strokeLinejoin="round" />
  </g>
);

// escudo redondo vikingo (va en la mano de adelante)
const Escudo: React.FC = () => (
  <g>
    <circle r={80} fill="#9a5a2a" stroke="#2a1530" strokeWidth={8} />
    <path d="M -80 0 L 80 0 M 0 -80 L 0 80" stroke="#6b3a1f" strokeWidth={8} />
    <circle r={16} fill="#c8d0dc" stroke="#2a1530" strokeWidth={5} />
  </g>
);

const Asoman: React.FC<{ t: number; xs: number[]; y: number; flaco: number }> = ({ t, xs, y, flaco }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
    {xs.map((x, i) => { const r = 44 - flaco * 12; const dy = Math.sin(t * 1.3 + i * 2) * 6; return (
      <g key={i} transform={`translate(${x} ${y + dy})`}>
        <ellipse cx={0} cy={0} rx={r} ry={44} fill="#f2b48a" stroke="#2a1530" strokeWidth={6} />
        <path d={`M ${-r - 4} -8 Q 0 -78 ${r + 4} -8 Z`} fill="#9aa4b8" stroke="#2a1530" strokeWidth={6} />
        <circle cx={-14} cy={6} r={6} fill="#2a1530" /><circle cx={14} cy={6} r={6} fill="#2a1530" />
        <path d={flaco > 0.5 ? "M -14 30 Q 0 20 14 30" : "M -14 26 L 14 26"} stroke="#2a1530" strokeWidth={5} fill="none" strokeLinecap="round" />
        {flaco > 0.3 && <path d={`M ${-r + 8} 14 Q ${-r + 14} 24 ${-r + 10} 34 M ${r - 8} 14 Q ${r - 14} 24 ${r - 10} 34`} stroke="#c98864" strokeWidth={4} fill="none" />}
      </g>
    ); })}
  </svg>
);

// recorrido de las 7 paradas (E105): camino + círculos en coords de MUNDO (sin etiquetas)…
const RutaP8: React.FC<{ t: number; t0: number; dur: number; activa?: number; escala: number }> = ({ t, t0, dur, activa, escala }) => {
  if (t < t0) return null;
  const xs = [1250, 2300, 3500, 4700, 5500, 6600, 7700, 8800, 9900];
  const pts = xs.map((x) => [x, Math.min(gy(Math.min(x, 7400)), 860) - 90]);
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const u = Math.min(1, (t - t0) / dur);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={10} height={10}>
        <path d={d} stroke="#fff" strokeWidth={18 * escala} fill="none" opacity={0.9} pathLength={1000} style={{ strokeDasharray: `${u * 1000} 1000` }} strokeLinecap="round" />
      </svg>
      {PARADAS.map((p) => {
        const tp = t0 + ((p.x - 1250) / (9900 - 1250)) * dur;
        if (t < tp) return null;
        const e = ent(t, tp, 0, { damping: 10, stiffness: 200 });
        const act = activa === p.n;
        return (
          <div key={p.n} style={{ position: "absolute", left: p.x, top: p.y - 120, transform: `scale(${e * escala * (act ? 1.25 + 0.08 * Math.sin(t * 8) : 1)})`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: -75, top: -75, width: 150, height: 150, borderRadius: 75, background: act ? C.rojo : C.ambar, border: "12px solid #fff", boxSizing: "border-box", fontFamily, fontWeight: 700, fontSize: 92, color: act ? "#fff" : C.noche, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: act ? `0 0 60px ${C.rojo}` : "0 12px 0 rgba(10,5,30,.5)" }}>{p.n}</div>
          </div>
        );
      })}
    </>
  );
};
// …y las etiquetas en coords de PANTALLA: tamaño legible fijo, dentro del margen de 80 px, alternadas arriba/abajo
// (la 7 en una 2ª fila cuando la cámara está lejos) → nunca se cortan ni se pisan.
const EtiquetasP8: React.FC<{ t: number; t0: number; dur: number; cam: Cam; escala: number; activa?: number }> = ({ t, t0, dur, cam, escala, activa }) => {
  if (t < t0) return null;
  const lejos = cam.z < 0.35;
  const fs = lejos ? 44 : Math.max(36, Math.min(60, 56 * escala * cam.z));
  return (
    <>
      {PARADAS.map((p) => {
        const tp = t0 + ((p.x - 1250) / (9900 - 1250)) * dur;
        if (t < tp + 0.1) return null;
        const e = ent(t, tp + 0.1, 0, { damping: 12, stiffness: 200 });
        const R = 75 * escala * cam.z * (activa === p.n ? 1.33 : 1);
        const sx = 960 + (p.x - cam.x) * cam.z, sy = 540 + (p.y - 120 - cam.y) * cam.z;
        if (sx < -200 || sx > 2120) return null;
        const w = p.txt.length * fs * 0.62 + fs * 0.9, h = fs * 1.3;
        const abajo = lejos ? p.n % 2 === 0 || p.n === 7 : p.n % 2 === 1; // de lejos: impares arriba, pares abajo (la 7 abajo, 2ª fila)
        const fila2 = lejos && p.n === 7;
        const cy = abajo ? sy + R + 12 + h / 2 + (fila2 ? h + 30 : 0) : sy - R - 12 - h / 2 - (fila2 ? h + 30 : 0);
        const mg = lejos ? 140 : 80; // de lejos el golpe de zoom agranda: más margen
        const cx = Math.max(mg + w / 2, Math.min(1920 - mg - w / 2, sx));
        return (
          <div key={p.n} style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${e})`, fontFamily, fontWeight: 700, fontSize: fs, lineHeight: 1, color: "#fff", background: activa === p.n ? C.rojo : "rgba(27,18,64,.9)", padding: `${fs * 0.15}px ${fs * 0.4}px`, borderRadius: fs * 0.3, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(10,5,30,.4)" }}>{p.txt}</div>
        );
      })}
    </>
  );
};

export const P8: React.FC<{ t: number }> = ({ t }) => {
  const cam = camEn(t, CAM8);
  return (
    <AbsoluteFill>
      {/* 0 · entonces: ¿atacar un campamento vikingo dormido era una trampa mortal? · el giro */}
      <Escena t={t} t0={779.75} t1={784.73} zoom={0} entra="corte" golpes={[783.4]}>
        <div style={{ position: "absolute", inset: 0, transform: `scaleX(${Math.cos(prog(t, 783.2, 783.9) * Math.PI)})` }}>
          <Mundo t={t} cam={cam} e={{ amanece: 0.35, perros: t > 783.6 ? "alerta" : "duerme" }} luna={[1760, 130, 64]} />
        </div>
        {/* explorador sajón que se acerca en puntas de pie al campamento… y en el giro se da vuelta sorprendido */}
        {(() => {
          const giro = t > 783.4;
          const x = giro ? 700 : interpolate(t, [779.75, 783.2], [220, 700], { extrapolateRight: "clamp" });
          return (
            <>
              <Persona x={x} y={1010} h={460} t={t} seed={812} ropa={SAJON} casco="saxon" expr={giro ? "sorpresa" : "miedo"} flip={giro} mira={giro ? -0.2 : 0.8} miraY={0.2}
                camina={giro ? 0 : 0.9} inclina={giro ? 0 : 8} salta={giro && t < 783.75 ? 30 : 0}
                bD={30} cD={20} bI={giro ? 150 : 20} cI={giro ? 20 : 10} manoD={<LanzaMano a={50} inclina={-14} largo={360} />} />
              <Emote t={t} t0={783.45} tipo="excl" x={x - 150} y={620} s={0.8} />
            </>
          );
        })()}
        <G t={t} t0={780.0} t1={783.3} text="SO… A DEATH TRAP?" y={240} size={130} color={C.crema} />
        <Flash t={t} t0={783.35} dur={0.2} />
        <G t={t} t0={783.4} text="HERE IS THE TWIST" y={240} size={130} color={C.ambar} />
      </Escena>
      {/* 1 · los que les ganaron casi nunca lo hicieron de noche · Alfredo en el pantano → mayo de 878, Edington, a plena luz */}
      <Escena t={t} t0={784.73} t1={791.5} entra="diag" golpes={[786.4, 788.5]}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${t < 788.4 ? "#0a0826" : "#8aa0a8"}, ${t < 788.4 ? "#33227a" : "#c8d4c0"})` }} />
        {t < 788.4 ? (
          <>
            <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${ent(t, 785.0)})` }}>
              <svg width={520} height={520} viewBox="-260 -260 520 520"><circle r={170} fill="#f6efc9" /><circle cx={60} cy={-30} r={30} fill="#d8cfa0" /><path d="M -230 -230 L 230 230 M 230 -230 L -230 230" stroke={C.rojo} strokeWidth={36} strokeLinecap="round" opacity={prog(t, 786.4, 786.7)} /></svg>
            </div>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={880} width={1920} height={200} fill="#141030" /></svg>
            <Persona x={interpolate(t, [786.6, 788.3], [520, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1000} h={520} t={t} seed={371} ropa={ALFRED} sombra="#0a0820" flip={t > 786.5} mira={t > 786.5 ? 0 : 0.6} miraY={-0.6} camina={t > 786.6 ? 1.2 : 0} />
            <Ch t={t} t0={785.0} text="THE MEN WHO BEAT THE VIKINGS…" color={C.violeta} x={960} y={150} centro size={58} />
            <Ch t={t} t0={786.4} text="ALMOST NEVER AT NIGHT" color={C.rojo} x={960} y={960} centro size={62} />
          </>
        ) : (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#5a7a5a" />{Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${i * 50} 790 q 6 -90 ${10 + (i % 3) * 6} -140`} stroke="#4a6a3a" strokeWidth={8} fill="none" />)}</svg>
            {(() => {
              const ax = interpolate(t, [788.4, 789.9], [180, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <>
                  {/* recuerda: levanta la espada (789,9), la CLAVA en el barro (790,4-790,7) y se cruza de brazos, decidido */}
                  {(() => {
                    const alza = prog(t, 789.9, 790.3), clava = prog(t, 790.4, 790.7), cruza = prog(t, 790.75, 791.05);
                    const enMano = t < 790.7;
                    const bDa = enMano ? 20 + alza * 140 - clava * 110 : 20 - cruza * 5, cDa = enMano ? 10 : 10 - cruza * 115;
                    const sx = ax + 170, sy = 1000; // queda clavada al costado, punta hundida en el barro
                    return (
                      <>
                        {!enMano && (
                          <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                            <g transform={`translate(${sx} ${sy - 30 * (1 - prog(t, 790.7, 790.8))})`}>
                              <path d="M -9 -230 L 9 -230 L 9 0 L 0 26 L -9 0 Z" fill="#d8dee8" stroke="#2a1530" strokeWidth={6} />
                              <rect x={-40} y={-246} width={80} height={16} rx={6} fill="#c9a24a" stroke="#2a1530" strokeWidth={5} />
                              <rect x={-9} y={-300} width={18} height={56} rx={5} fill="#6b4022" stroke="#2a1530" strokeWidth={5} />
                              <circle cx={0} cy={-306} r={13} fill="#c9a24a" stroke="#2a1530" strokeWidth={5} />
                            </g>
                            {/* salpicón de barro al clavarla */}
                            {[-1, -0.5, 0.5, 1].map((d, i) => { const u = prog(t, 790.7, 791.2); return <circle key={i} cx={sx + d * (20 + u * 90)} cy={sy + 10 - Math.sin(u * Math.PI) * (50 + i * 12)} r={10 - u * 5} fill="#4a3a20" opacity={1 - u} />; })}
                          </svg>
                        )}
                        <Persona x={ax} y={990} h={480} t={t} seed={371} ropa={ALFRED} expr={t > 789.9 ? "enojado" : "triste"} mira={t > 790.75 ? 0.1 : 0.6} miraY={t > 790.3 && t < 790.75 ? 0.5 : 0}
                          camina={t < 789.9 ? 1.3 : 0} inclina={clava * 12 * (1 - cruza)}
                          salta={t > 790.75 && t < 791.0 ? 14 : 0}
                          bD={bDa} cD={cDa} bI={enMano ? 20 : 20 - cruza * 5} cI={enMano ? 10 : 10 - cruza * 115}
                          manoD={enMano ? <EspadaMano a={bDa + cDa} gira={clava * 180} /> : undefined} />
                      </>
                    );
                  })()}
                  <Corona x={ax} y={990 - 480 * 1.02} s={0.48} t={t} t0={788.5} />
                  {/* juncos delante que se mecen al pasar */}
                  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>{Array.from({ length: 22 }, (_, i) => { const bx = i * 92 + 20; const k = Math.max(0, 1 - Math.abs(bx - ax) / 160); return <path key={i} d={`M ${bx} 1080 q ${6 + k * 30} -110 ${14 + k * 60} -${180 + (i % 3) * 30}`} stroke="#3e5e30" strokeWidth={10} fill="none" strokeLinecap="round" />; })}</svg>
                  <Emote t={t} t0={790.0} tipo="enojo" x={ax - 260} y={620} s={0.8} />
                </>
              );
            })()}
            <Ch t={t} t0={788.6} text="REMEMBER ALFRED IN THE SWAMP?" color={C.violeta} x={960} y={150} centro size={58} />
          </>
        )}
      </Escena>
      <Escena t={t} t0={791.5} t1={800.02} zoom={0.03} entra="barrido" banda={C.ambar} golpes={[793.6, 796.6, 798.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #6ab8e8, #d8f0f8 60%)" }} />
        <Rayos t={t} x={1700} y={120} color="#fff8d0" op={0.25} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><circle cx={1700} cy={120} r={90} fill="#ffe28a" /><path d="M 0 760 Q 960 700 1920 760 L 1920 1080 L 0 1080 Z" fill="#6aaa4a" /></svg>
        {/* OPEN BATTLE (v6): 3 filas en profundidad. Carga 796,6-797,9; desde 797,9 hasta el final, 3 PAREJAS TRABADAS en la línea
            x≈880-1240: el inglés empuja la lanza al frente hasta ~20 px del escudo del vikingo; el vikingo tapa con el escudo y tiene
            el hacha en alto (mano de atrás, sobre el casco) dando golpes cortos. El resto, detrás. Bloque vikingo siempre en x≤~1720
            (con el zoom de la Escena queda <1800). Alfred adelante a la izquierda, lanza en la mano de atrás, lejos de la cara. */}
        {(() => {
          const ez = (u: number) => u * u * (3 - 2 * u);
          const c = ez(prog(t, 796.6, 797.9));
          const corre = t > 796.6 && t < 797.9;
          const traba = t > 797.9;
          const empuje = ez(prog(t, 798.2, 800.0)) * 50; // con el sello los ingleses los van haciendo retroceder
          const salta0 = (i: number) => (t < 796.6 ? Math.max(0, Math.sin(t * 6.5 + i * 1.9)) * 12 : 0);
          const bal = (cam: number) => (cam ? Math.sin(cam * t * Math.PI * 2) * 22 : 0);
          const filas = [{ y: 765, h: 185, cx: 880 }, { y: 852, h: 225, cx: 1060 }, { y: 950, h: 275, cx: 1180 }];
          const out: React.ReactNode[] = [];
          filas.forEach((f, r) => {
            const S = f.h / 560;
            const D = 764 * S - 10; // pie a pie de la pareja: punta de lanza (largo 160) a 20 px del borde del escudo
            const lucha = traba ? Math.sin(t * 9 + r * 2.1) * 8 : 0; // forcejeo: los dos se mueven juntos
            const sp = 165 * (f.h / 245);
            // vikingos: el de punta + uno detrás en las filas 0 y 2
            const ksV = r === 1 ? [0] : [1, 0];
            ksV.forEach((k) => {
              const frente = k === 0;
              const xV = f.cx + D / 2 + (r === 2 ? k * 170 : k * (r === 0 ? 126 : sp)) + (1 - c) * 20 + empuje + lucha;
              const cam = corre ? 1.9 : 0;
              const chop = traba ? Math.max(0, Math.sin(t * 7 + r + k)) * 22 : Math.sin(t * 5 + r + k) * 8;
              const bI = frente && traba ? 170 : [150, 120][k] + Math.sin(t * 5 + k + r) * 10, cI = frente && traba ? 0 : 10;
              out.push(<Persona key={`v${r}${k}`} x={xV} y={f.y + (frente ? 0 : -8)} h={f.h} t={t} seed={820 + r * 3 + k} ropa={VIK(r * 3 + k)} casco="vikingo" barba={barbaDe(r * 3 + k)}
                expr={t > 798.6 && frente ? "miedo" : "enojado"} habla={traba && frente} flip mira={0} camina={cam} salta={salta0(r * 3 + k + 7)} inclina={corre ? 8 : traba && frente ? -6 : 0}
                bD={frente ? 20 : 30} cD={frente ? 70 : 20} bI={bI} cI={cI}
                manoD={frente ? <Escudo /> : undefined}
                manoI={<g transform="scale(-1.35 1.35)"><HachaMano a={bI + cI - chop} /></g>} />);
            });
            // sajones: el de punta (lanza al frente) + uno detrás en filas 0 y 1
            const ksS = r === 2 ? [0] : [1, 0];
            ksS.forEach((k) => {
              const frente = k === 0;
              const xS = f.cx - D / 2 - k * (r === 0 ? 126 : sp) - (1 - c) * 220 + empuje + (frente ? lucha : 0);
              const cam = corre || (!frente && t > 798.2 && t < 800) ? 1.8 : 0;
              const clava = frente && t > 797.75;
              const bD = clava ? 80 : 30, cD = clava ? 0 : 20;
              out.push(<Persona key={`s${r}${k}`} x={xS} y={f.y + (frente ? 0 : 6)} h={f.h} t={t} seed={800 + r * 3 + k} ropa={SAJON} casco="saxon" expr="enojado"
                habla={clava} camina={cam} salta={salta0(r * 3 + k)} inclina={corre || clava ? 10 : 0}
                bD={bD} cD={cD} manoD={<LanzaMano a={(clava ? 170 : bD + cD) + bal(cam)} largo={clava ? 160 : 340} />} />);
            });
          });
          // Alfred: delante de todo, a la izquierda; lanza en la mano izquierda (la de atrás), ~150 px detrás de la cara
          const ax = 560 - (1 - c) * 220 + empuje;
          const camA = corre ? 1.8 : 0;
          const arenga = prog(t, 793.6, 794.0) * (1 - prog(t, 796.4, 796.7));
          return (
            <>
              {out}
              <Persona x={ax} y={1000} h={305} t={t} seed={371} ropa={ALFRED} expr="enojado" habla={(t > 793.8 && t < 796.6) || t > 798.2} camina={camA} salta={salta0(4)}
                bD={20 + arenga * 120 + Math.sin(t * 9) * 6 * arenga} cD={10 - arenga * 50} bI={35} cI={45}
                manoI={<LanzaMano a={-80 + bal(camA)} largo={600} />} />
              <Corona x={ax} y={1000 - 305 * 1.02} s={0.34} t={t} t0={791.6} />
            </>
          );
        })()}
        {t > 797.6 && t < 799.6 && <Particulas t={t} tipo="polvo" n={40} seed={8} />}
        <Flash t={t} t0={797.9} dur={0.15} color="#fff3c4" />
        <Ch t={t} t0={791.7} t1={793.5} text="A FEW MONTHS LATER · A NEW ARMY" color={C.violeta} x={960} y={150} centro size={56} />
        <G t={t} t0={793.6} t1={798.1} text="MAY 878 · EDINGTON" y={180} size={110} color={C.crema} />
        <Ch t={t} t0={796.6} text="OPEN BATTLE" color={C.rojo} x={960} y={350} centro size={56} />
        <Sello t={t} t0={798.2} text="IN DAYLIGHT" x={1100} y={160} size={84} color={C.ambar} rot={-8} />
      </Escena>
      {/* 2 · se meten en su campamento fortificado · Alfredo no lo asalta, no espera la noche: se sienta frente a la puerta 14 días */}
      <Escena t={t} t0={800.02} t1={815.49} entra="iris" ix={960} iy={640} golpes={[805.5, 806.8, 808.5, 812.6, 813.9]}>
        {(() => {
          // ⚠ fotosensibilidad: antes el cielo iba de día a noche cada ~0,48 s (estrobo). Ahora 7 ciclos lentos (~0,96 s c/u)
          // con coseno suave y amplitud limitada (la noche es azul atardecer, nunca negro): sin saltos bruscos de brillo.
          const u = Math.min(1, Math.max(0, (t - 808.6) / 6.7));
          const dia = Math.min(14, Math.max(1, 1 + Math.floor(u * 14)));
          const kN = ((1 - Math.cos(u * 7 * Math.PI * 2)) / 2) * 0.7;
          const mix = (c1: string, c2: string) => { const h = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16); return "#" + [0, 1, 2].map((i) => Math.round(h(c1, i) + (h(c2, i) - h(c1, i)) * kN).toString(16).padStart(2, "0")).join(""); };
          const kc = kN / 0.7; // 0 = día, 1 = noche (para sol/luna/estrellas)
          return (
            <>
              <AbsoluteFill style={{ background: `linear-gradient(180deg, ${mix("#6ab8e8", "#1a1650")}, ${mix("#d8f0f8", "#4a3a8a")} 60%)` }} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
                {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 397) % 1900 + 10} cy={40 + ((i * 211) % 560)} r={2 + (i % 3)} fill="#fff" opacity={kc * 0.8} />)}
                <circle cx={1720} cy={120 + kc * 40} r={70} fill="#ffe28a" opacity={1 - kc} />
                <circle cx={1720} cy={160 - kc * 40} r={62} fill="#f6efc9" opacity={kc} />
                <rect x={0} y={700} width={1920} height={380} fill={mix("#6aaa4a", "#2a4a3a")} />
              </svg>
              <div style={{ position: "absolute", left: 0, top: 0 }}><Empalizada x={760} y={700} n={26} h={230} /></div>
              <div style={{ position: "absolute", left: 1280, top: 520, width: 130, height: 180, background: "#2a1530" }} />
              {Array.from({ length: 5 }, (_, i) => { const x = interpolate(t, [800.2, 802.6], [200 + i * 120, 1345], { extrapolateRight: "clamp" }); return t < 802.8 ? <Persona key={i} x={x} y={900} h={240} t={t} seed={830 + i} ropa={VIK(i)} casco="vikingo" barba={barbaDe(i)} expr="miedo" camina={2.4} /> : null; })}
              {t > 802.4 && t < 808.4 && Array.from({ length: 7 }, (_, i) => <Persona key={i} x={interpolate(t, [802.4, 804.4], [-200 + i * 90, 160 + i * 90], { extrapolateRight: "clamp" })} y={900 + (i % 2) * 40} h={i === 3 ? 320 : 250} t={t} seed={870 + i} ropa={i === 3 ? ALFRED : SAJON} casco={i === 3 ? "no" : "saxon"} expr="enojado" camina={t < 804.4 ? 1.6 : 0} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={340} />} />)}
              {t > 802.4 && t < 808.4 && <Corona x={interpolate(t, [802.4, 804.4], [70, 430], { extrapolateRight: "clamp" })} y={900 - 320 * 1.02} s={0.34} t={t} />}
              {/* Alfredo sentado en un tronco frente a la puerta */}
              {t > 808.4 && (
                <>
                  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={400} y={880} width={260} height={60} fill="#8a5a32" stroke="#2a1530" strokeWidth={6} /><ellipse cx={660} cy={910} rx={18} ry={30} fill="#c8945a" stroke="#2a1530" strokeWidth={6} /><path d="M 420 896 L 640 896 M 430 922 L 620 922" stroke="#6a4022" strokeWidth={4} /></svg>
                  {(() => { const m = (Math.sin((t - 808.4) * 4.4) + 1) / 2; return (
                    <Persona x={530} y={930} h={380} t={t} seed={371} ropa={ALFRED} expr={m > 0.8 ? "feliz" : "orgullo"} habla={m > 0.8} mira={m > 0.6 ? 0 : 0.7} bD={40 + m * 110} cD={20 + m * 110} bI={70} cI={110}
                      manoD={<g><ellipse cx={0} cy={10} rx={34} ry={22} fill="#d9a35a" stroke="#2a1530" strokeWidth={6} /><path d="M -18 4 L -8 -6 M 0 4 L 10 -6" stroke="#a8702a" strokeWidth={5} /></g>} />); })()}
                  <Asoman t={t} xs={[900, 1080, 1560, 1740]} y={470} flaco={Math.min(1, (dia - 1) / 12)} />
                  <Corona x={530} y={930 - 380 * 1.02} s={0.4} t={t} />
                </>
              )}
              <Ch t={t} t0={800.2} t1={805.4} text="THEY RAN INTO THEIR FORTIFIED CAMP" color={C.violeta} x={960} y={150} centro size={54} />
              <Ch t={t} t0={803.0} t1={805.4} text="THE SMARTEST THING OF ALFRED'S LIFE:" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={50} />
              <Ch t={t} t0={805.5} t1={808.4} text="STORM IT? ✗" color={C.rojo} x={500} y={220} centro size={58} />
              <Ch t={t} t0={806.8} t1={808.4} text="WAIT FOR NIGHT? ✗" color={C.rojo} x={1400} y={220} centro size={58} />
              {t > 808.5 && <G t={t} t0={808.5} text={`DAY ${dia}`} x={1000} y={200} size={150} color={dia === 14 ? C.ambar : C.crema} />}
              {t > 812.6 && <Emote t={t} t0={812.7} tipo="sudor" x={1080} y={430} s={0.6} />}
              {t > 813.9 && <Emote t={t} t0={814.0} tipo="lagrimas" x={1560} y={470} s={0.6} />}
              <Ch t={t} t0={812.6} text="NO FOOD IN ✗" color={C.rojo} x={400} y={300} centro size={50} />
              <Ch t={t} t0={813.9} text="NO SHIPS TO HELP ✗" color={C.rojo} x={400} y={390} centro size={50} />
            </>
          );
        })()}
      </Escena>
      {/* 3 · rehenes y paz · Guthrum, el del ataque de Navidad, bautizado con Alfredo de padrino */}
      <Escena t={t} t0={815.49} t1={826.66} entra="barrido" golpes={[816.4, 820.4, 823.2]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2d08a, #fff0c8 60%)" }} />
        <Rayos t={t} x={960} y={200} color="#ffffff" op={0.25} />
        {t < 820.3 ? (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#7aa04a" /><rect x={1300} y={300} width={12} height={460} fill="#6b4022" /><g transform={`translate(0 ${(1 - prog(t, 815.6, 816.8)) * 300})`}><path d={`M 1312 310 Q 1420 ${290 + Math.sin(t * 5) * 20} 1520 330 L 1520 450 Q 1420 ${430 + Math.sin(t * 5 + 1) * 20} 1312 450 Z`} fill="#fff" stroke="#2a1530" strokeWidth={6} /></g></svg>
            {Array.from({ length: 3 }, (_, i) => <Persona key={i} x={interpolate(t, [815.49, 819.4], [2100 + i * 140, 900 + i * 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={960} h={300} t={t} seed={840 + i} ropa={VIK(i)} barba={barbaDe(i)} expr="triste" flip camina={t < 819.4 ? 1.2 : 0} />)}
            <Persona x={420} y={980} h={420} t={t} seed={371} ropa={ALFRED} expr="orgullo" />
            <Corona x={420} y={980 - 420 * 1.02} s={0.44} t={t} />
            <Ch t={t} t0={815.7} text="AFTER TWO WEEKS…" color={C.violeta} x={960} y={150} centro size={58} />
            <Ch t={t} t0={816.4} text="HOSTAGES" color={C.ambar} tinta={C.noche} x={960} y={260} centro size={56} />
            <Ch t={t} t0={818.0} text="+ A REQUEST FOR PEACE" color={C.teal} tinta={C.noche} x={960} y={360} centro size={52} />
          </>
        ) : (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={860} width={1920} height={220} fill="#c8a87a" /><ellipse cx={960} cy={900} rx={260} ry={60} fill="#7ab8e0" stroke="#2a1530" strokeWidth={8} /><rect x={760} y={900} width={400} height={160} fill="#a8a8b8" stroke="#2a1530" strokeWidth={8} /></svg>
            <Persona x={960} y={930} h={460} t={t} seed={850} ropa={GUTHRUM} barba="#a8552a" expr="sorpresa" />
            {Array.from({ length: 10 }, (_, i) => { const k = ((t * 1.5 + i / 10) % 1); return <div key={i} style={{ position: "absolute", left: 900 + (i % 5) * 26, top: 380 + k * 160, width: 12, height: 18, borderRadius: 8, background: "#7ab8e0", opacity: (1 - k) * (t > 820.6 ? 1 : 0) }} />; })}
            <Persona x={1450} y={990} h={420} t={t} seed={371} ropa={ALFRED} expr="feliz" flip bD={80} cD={60} />
            <Corona x={1450} y={990 - 420 * 1.02} s={0.44} t={t} />
            <Ch t={t} t0={820.4} text="GUTHRUM · THE CHRISTMAS ATTACKER" color={C.rojo} x={960} y={150} centro size={54} />
            <G t={t} t0={821.6} text="BAPTIZED" y={295} size={140} color={C.crema} />
            <Ch t={t} t0={823.2} text="GODFATHER: ALFRED" color={C.ambar} tinta={C.noche} x={1450} y={445} centro size={50} />
          </>
        )}
      </Escena>
      {/* 4 · el rey más listo nunca atacó un campamento dormido: lo dejó pasar hambre */}
      <Escena t={t} t0={826.66} t1={832.49} entra="sube" golpes={[831.3]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #6ab8e8, #d8f0f8 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={760} width={1920} height={320} fill="#6aaa4a" /></svg>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Empalizada x={820} y={790} n={25} h={250} /></div>
        <Asoman t={t} xs={[960, 1160, 1520, 1720]} y={520} flaco={1} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={300} y={900} width={240} height={56} fill="#8a5a32" stroke="#2a1530" strokeWidth={6} /></svg>
        {/* Alfredo come tranquilo delante de la empalizada; los vikingos flacos lo miran con hambre */}
        {(() => { const m = (Math.sin((t - 826.66) * 3.6) + 1) / 2; return (
          <Persona x={420} y={940} h={400} t={t} seed={371} ropa={ALFRED} expr={m > 0.75 ? "feliz" : "orgullo"} habla={m > 0.75} mira={m > 0.6 ? 0 : 0.8}
            bD={40 + m * 105} cD={30 + m * 100} bI={60} cI={100}
            manoI={<g><path d="M -40 0 Q 0 46 40 0 Z" fill="#a8794a" stroke="#2a1530" strokeWidth={6} /><ellipse cx={0} cy={0} rx={40} ry={9} fill="#5e3a1e" stroke="#2a1530" strokeWidth={5} /><path d="M -14 -14 q 6 -16 0 -32 M 12 -14 q 6 -16 0 -32" stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.6} /></g>}
            manoD={<g transform="rotate(-30)"><path d="M 0 0 L 0 -46" stroke="#c9a24a" strokeWidth={7} strokeLinecap="round" /><ellipse cx={0} cy={-50} rx={10} ry={7} fill="#c9a24a" /></g>} />); })()}
        <Corona x={420} y={940 - 400 * 1.02} s={0.42} t={t} />
        {[960, 1160, 1520, 1720].map((x, i) => <Emote key={i} t={t} t0={827.4 + i * 0.5} tipo={i % 2 ? "sudor" : "lagrimas"} x={x - 100} y={640} s={0.45} />)}
        <Ch t={t} t0={826.9} t1={831.2} text="THE SMARTEST KING IN VIKING-AGE ENGLAND" color={C.violeta} x={960} y={160} centro size={52} />
        <Ch t={t} t0={828.4} t1={831.2} text="NEVER ATTACKED A SLEEPING CAMP" color={C.rojo} x={960} y={270} centro size={56} />
        <G t={t} t0={831.3} text="HE LET IT GET HUNGRY" y={240} size={120} color={C.ambar} />
      </Escena>
      {/* 5 · el otro método, más rápido: les pagaban · 845, la flota sube el Sena hasta París, Carlos el Calvo paga 7.000 libras de plata */}
      <Escena t={t} t0={832.49} t1={841.5} zoom={0} entra="barrido" banda={C.ambar} golpes={[836.5, 838.6]}>
        <MapaN t={t} cam={[[832.49, 900, 700, 1.1], [838.0, 820, 950, 2.6], [841.5, 858, 978, 3.6]]} desde="NORWAY"
          pulsa={[{ n: "PARIS", t0: 839.6, color: C.ambar, label: "PARIS", lado: "der" }]}
          rutas={[{ de: "DENMARK", a: "SEINE", t0: 837.6, color: C.rojo, curva: 60, dur: 1.0, ancho: 12 }, { de: "SEINE", a: "PARIS", t0: 838.6, color: C.rojo, curva: 20, dur: 0.9, ancho: 12 }]}>
          {t > 836.5 && t < 838.6 && [0, 1, 2, 3].map((i) => { const a = lugarN("PARIS"), b = lugarN("DENMARK"); const u = prog(t, 836.5 + i * 0.15, 838.3); return (
            <svg key={i} style={{ position: "absolute", left: a.x + (b.x - a.x) * u + i * 14 - 40, top: a.y + (b.y - a.y) * u - Math.sin(u * Math.PI) * 60 - 40, overflow: "visible" }} width={80} height={80} viewBox="-40 -40 80 80">
              <path d="M -26 -6 Q -34 30 0 34 Q 34 30 26 -6 Q 12 -16 0 -16 Q -12 -16 -26 -6 Z" fill="#d8dce8" stroke="#2a1530" strokeWidth={5} />
              <path d="M -12 -16 L -6 -28 L 6 -28 L 12 -16" fill="#d8dce8" stroke="#2a1530" strokeWidth={5} /><text x={0} y={20} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={22} fill="#2a1530">$</text>
            </svg>); })}
        </MapaN>
        {/* jefe vikingo que estira la mano (izq) y Carlos que le tira bolsas de plata (der) */}
        {(() => {
          const ej = 1020, ec = 1020; // enteros desde el primer cuadro (pies en y≈1020)
          // la bolsa de plata vuela de la mano de Carlos a la del vikingo en 0,8 s con arco (dos veces)
          const vuelos = [836.6, 837.7].map((t0) => ({ t0, u: prog(t, t0, t0 + 0.8) }));
          const tieneBolsas = vuelos.filter((v) => v.u >= 1).length;
          const tira = t > 836.5 && t < 838.6 ? (Math.sin((t - 836.5) * 9) + 1) / 2 : 0;
          return (
            <>
              <Persona x={260} y={ej} h={400} t={t} seed={881} ropa={VIK(1)} casco="vikingo" barba={barbaDe(1)} expr={tieneBolsas ? "feliz" : "orgullo"} mira={0.6}
                salta={vuelos.some((v) => t > v.t0 + 0.8 && t < v.t0 + 1.1) ? 22 : 0}
                bD={t > 834.4 ? 95 : 30} cD={t > 834.4 ? 10 + Math.sin(t * 6) * 10 : 20} habla={t > 834.4 && t < 836.4}
                manoD={tieneBolsas ? <g><path d="M -26 -6 Q -34 30 0 34 Q 34 30 26 -6 Q 12 -16 0 -16 Q -12 -16 -26 -6 Z" fill="#d8dce8" stroke="#2a1530" strokeWidth={5} /><text x={0} y={22} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={24} fill="#2a1530">{tieneBolsas > 1 ? "$$" : "$"}</text></g> : undefined} />
              {vuelos.map((v, i) => v.u > 0 && v.u < 1 ? (
                <svg key={i} style={{ position: "absolute", left: 1550 + (330 - 1550) * v.u - 50, top: 800 - Math.sin(v.u * Math.PI) * 300 - 50, overflow: "visible", transform: `rotate(${-v.u * 540}deg)` }} width={100} height={100} viewBox="-50 -50 100 100">
                  <path d="M -36 -8 Q -46 40 0 46 Q 46 40 36 -8 Q 16 -22 0 -22 Q -16 -22 -36 -8 Z" fill="#d8dce8" stroke="#2a1530" strokeWidth={6} />
                  <path d="M -16 -22 L -8 -38 L 8 -38 L 16 -22" fill="#d8dce8" stroke="#2a1530" strokeWidth={6} /><text x={0} y={28} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={30} fill="#2a1530">$</text>
                </svg>) : null)}
              <Persona x={1660} y={ec} h={420} t={t} seed={860} ropa={CARLOS} viejo barba="#8a6a4a" flip expr={t > 836.5 ? "miedo" : "neutro"} mira={-0.6}
                bD={60 + tira * 90} cD={20 + tira * 50} manoD={(t > 836.0 && t < 836.6) || (t > 837.1 && t < 837.7) ? <g><path d="M -26 -6 Q -34 30 0 34 Q 34 30 26 -6 Q 12 -16 0 -16 Q -12 -16 -26 -6 Z" fill="#d8dce8" stroke="#2a1530" strokeWidth={5} /></g> : undefined} />
              <Corona x={1660} y={ec - 420 * 1.02} s={0.42} t={t} />
              {t > 834.4 && <Emote t={t} t0={836.7} tipo="brillos" x={140} y={700} s={0.7} />}
              {t > 836.5 && <Emote t={t} t0={836.6} tipo="sudor" x={1520} y={700} s={0.7} />}
            </>
          );
        })()}
        <Ch t={t} t0={832.7} t1={836.4} text="THE OTHER METHOD · EVEN FASTER" color={C.violeta} x={960} y={150} centro size={56} />
        <Ch t={t} t0={834.4} t1={836.4} text="THE FRANKS USED IT ALL THE TIME" color={C.teal} tinta={C.noche} x={960} y={260} centro size={50} />
        <G t={t} t0={836.5} t1={838.5} text="HE PAID THEM" y={260} size={140} color={C.ambar} />
        <G t={t} t0={838.6} text="845 · UP THE SEINE" y={200} size={110} color={C.crema} />
      </Escena>
      <Escena t={t} t0={841.5} t1={851.61} entra="iris" ix={960} iy={600} golpes={[842.4, 844.2, 846.7, 848.8]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #f2c08a, #ffe8c0 60%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={800} width={1920} height={280} fill="#3a7ac8" /><path d="M 0 800 L 1920 800" stroke="#cfe8ff" strokeWidth={8} /><path d="M 0 790 L 1120 790 Q 1200 900 1080 1080 L 0 1080 Z" fill="#e0c088" stroke="#2a1530" strokeWidth={6} /></svg>
        <Persona x={480} y={1000} h={600} t={t} seed={860} ropa={CARLOS} viejo barba="#8a6a4a" expr={t > 846.7 ? "sorpresa" : "miedo"} bD={t > 844 && t < 846.6 ? 80 + Math.sin(t * 10) * 14 : 20} cD={t > 844 && t < 846.6 ? 40 + Math.sin(t * 10) * 20 : 20} />
        <Corona x={480} y={1000 - 600 * 1.02} s={0.6} t={t} />
        {t > 844.2 && t < 846.7 && <Particulas t={t} tipo="lluviaoro" n={60} seed={5} />}
        {t > 844.2 && <div style={{ position: "absolute", left: 0, top: 0 }}><Monedas x={860} y={760} s={0.8 * ent(t, 844.3)} n={Math.min(12, Math.max(1, Math.floor((t - 844.2) * 6)))} /></div>}
        {[0, 1, 2].map((i) => { const ida = t < 846.7 ? 0 : prog(t, 846.7, 848.4); const vuelve = prog(t, 848.8, 850.6); const x = 1250 + i * 230 + ida * 1100 - vuelve * 1100; return <Drakkar key={i} x={x} y={820 + i * 16} s={0.4} t={t} vela={1} flip={t > 848.8} />; })}
        <Ch t={t} t0={841.7} t1={846.6} text="CHARLES THE BALD · KING OF THE FRANKS" color={C.violeta} x={960} y={150} centro size={52} />
        <Cuenta t={t} t0={844.2} t1={846.6} de={0} a={7000} dur={1.2} x={1300} y={300} size={170} color={C.ambar} />
        <Ch t={t} t0={844.8} t1={846.6} text="POUNDS OF SILVER · TO LEAVE" color={C.ambar} tinta={C.noche} x={1300} y={430} centro size={48} />
        {/* dos vikingos cargan monedas de la pila a los barcos */}
        {t > 844.4 && t < 846.8 && [0, 1].map((i) => { const k = prog(t, 844.5 + i * 0.3, 845.4 + i * 0.3), v = prog(t, 845.6 + i * 0.2, 846.6); const x = 1100 + i * 60 - k * 240 + v * 280; return (
          <Persona key={i} x={x} y={900 + i * 20} h={260} t={t} seed={890 + i} ropa={VIK(i + 2)} casco="vikingo" barba={barbaDe(i + 2)} expr="feliz" flip={k < 1} camina={(k > 0 && k < 1) || (v > 0 && v < 1) ? 2 : 0}
            bD={k >= 1 ? 150 : 30} cD={k >= 1 ? 30 : 20} bI={k >= 1 ? 150 : 30} cI={k >= 1 ? 30 : 20}
            manoD={k >= 1 ? <g><ellipse cx={0} cy={-12} rx={26} ry={10} fill="#ffd23a" stroke="#2a1530" strokeWidth={4} /></g> : undefined} />); })}
        <Ch t={t} t0={846.8} text="THEY LEFT…" color={C.teal} tinta={C.noche} x={1300} y={260} centro size={60} />
        <Sello t={t} t0={848.8} text="…AND CAME BACK" x={1300} y={400} size={86} rot={-6} />
        <Ch t={t} t0={849.8} text="EVERYBODY KNEW: PARIS PAYS" color={C.rojo} x={1300} y={570} centro size={50} />
      </Escena>
      {/* 6 · paciencia o plata · la lanza en la oscuridad: lo único para lo que estaban listos */}
      <Escena t={t} t0={851.61} t1={858.7} entra="diag" golpes={[851.75, 853.8, 856.2]}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3a3290 0%, #241d63 45%, #16123d 100%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 25% 45%, rgba(232,192,112,0.35) 0%, rgba(232,192,112,0) 30%), radial-gradient(circle at 75% 50%, rgba(255,200,80,0.3) 0%, rgba(255,200,80,0) 30%)" }} />
        <div style={{ position: "absolute", left: 480, top: 470, transform: `translate(-50%,-50%) scale(${0.8 * ent(t, 851.75)})`, textAlign: "center" }}>
          <svg width={260} height={340} viewBox="-130 -170 260 340"><path d="M -100 -160 L 100 -160 L 10 0 L 100 160 L -100 160 L -10 0 Z" fill="#cfe8ff" stroke="#c9a24a" strokeWidth={14} /><path d={`M -60 ${-130 + prog(t, 852.6, 858) * 100} L 60 ${-130 + prog(t, 852.6, 858) * 100} L 0 -10 Z`} fill="#e8c070" /><path d={`M -80 150 L 80 150 L 0 ${150 - prog(t, 852.6, 858) * 100} Z`} fill="#e8c070" /></svg>
          <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.teal }}>PATIENCE</div>
        </div>
        <div style={{ position: "absolute", left: 960, top: 470, transform: `translate(-50%,-50%) scale(${ent(t, 853.4)})`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 90, color: "#fff" }}>OR</div>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Monedas x={1440} y={500} s={0.65 * ent(t, 853.8)} n={12} /></div>
        <div style={{ position: "absolute", left: 1440, top: 580, transform: `translate(-50%,-50%) scale(${ent(t, 853.8)})`, fontFamily: "Fredoka", fontWeight: 700, fontSize: 70, color: C.ambar }}>MONEY</div>
        {(() => {
          const sp = t > 856.2;
          const vy = interpolate(t, [856.2, 856.8], [1400, 1030], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <>
              <Persona x={270} y={1030} h={360} t={t} seed={371} ropa={ALFRED} expr={sp ? "sorpresa" : "orgullo"} mira={sp ? 0.7 : 0.4} miraY={-0.3}
                bD={sp ? 30 : t > 852.0 ? 120 + Math.sin(t * 3) * 8 : 30} cD={sp ? 20 : 15} bI={sp ? 0 : 70} cI={sp ? 0 : 110} habla={!sp && t > 852.2 && t < 853.6} />
              <Corona x={270} y={1030 - 360 * 1.02} s={0.38} t={t} />
              <Persona x={1660} y={1030} h={360} t={t} seed={860} ropa={CARLOS} viejo barba="#8a6a4a" expr={sp ? "sorpresa" : "miedo"} flip mira={sp ? -0.7 : -0.4}
                bD={sp ? 30 : t > 853.8 ? 120 + Math.sin(t * 8) * 10 : 40} cD={sp ? 20 : 15} habla={!sp && t > 854.0 && t < 855.6} />
              <Corona x={1660} y={1030 - 360 * 1.02} s={0.38} t={t} />
              {sp && <Persona x={960} y={vy} h={380} t={t} seed={884} ropa={VIK(0)} casco="vikingo" barba={barbaDe(0)} expr="enojado" bD={30} cD={20} bI={60 + Math.sin(t * 8) * 10} cI={60} manoD={<LanzaMano a={50} inclina={-14} largo={380} />} />}
              <Emote t={t} t0={856.4} tipo="excl" x={160} y={700} s={0.6} />
            </>
          );
        })()}
        <Ch t={t} t0={856.2} text="A SPEAR IN THE DARK?" color={C.rojo} x={960} y={120} centro size={62} />
        <Ch t={t} t0={856.8} text="THE ONE THING THEY WERE READY FOR" color={C.ambar} tinta={C.noche} x={960} y={220} centro size={50} />
      </Escena>
      {/* 7 · algunos campamentos nunca se fueron: el vado del charco negro hoy es la capital de un país */}
      <Escena t={t} t0={858.7} t1={871.42} zoom={0.02} entra="iris" ix={960} iy={760} golpes={[862.6, 866.0, 867.5]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #5aa8e0, #bfe3f2 70%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={780} width={1920} height={300} fill="#3a5a4a" /><ellipse cx={960} cy={812} rx={430} ry={38} fill="#2a4a7a" /></svg>
        {t < 862 && <div style={{ opacity: 1 - prog(t, 860.8, 862) }}>{[0, 1, 2, 3].map((i) => <Tienda key={i} x={560 + i * 260} y={760} s={0.5} t={t} k={i} luz />)}</div>}
        {[0, 1].map((i) => <Drakkar key={i} x={790 + i * 360} y={820} s={0.26} t={t} vela={0} />)}
        <CrecePueblo t={t} t0={860.4} t1={865.6} x={960} y={790} />
        {/* gente: primero vikingos que bajan de los barcos y arman, después vecinos de la ciudad que van y vienen */}
        {[0, 1, 2, 3, 4].map((i) => {
          const dir = i % 2 ? -1 : 1, vel = 70 + i * 18;
          const x0 = dir > 0 ? -120 - i * 260 : 2040 + i * 220;
          const x = x0 + dir * (t - 858.7) * vel * (t > 862 ? 1 : 1.4);
          const pueblo = t > 862.6;
          const saluda = pueblo && i === 2 && t > 866.0 && t < 868.0;
          return <Persona key={i} x={x} y={1028 - (i % 2) * 12} h={165} t={t} seed={900 + i} mujer={pueblo && i % 2 === 1} ropa={pueblo ? [ALFRED, CARLOS, VIK(3), VIK(2), SAJON][i] : VIK(i)} casco={pueblo ? "no" : "vikingo"} barba={!pueblo || i === 3 ? barbaDe(i) : undefined}
            expr={saluda ? "feliz" : pueblo ? "neutro" : "enojado"} flip={dir < 0} camina={saluda ? 0 : 1.8} bD={saluda ? 150 + Math.sin(t * 10) * 18 : pueblo ? 30 : 30} cD={20}
            manoD={!pueblo ? <g><rect x={-16} y={-10} width={32} height={30} rx={6} fill="#a8794a" stroke="#2a1530" strokeWidth={4} /></g> : undefined} />;
        })}
        <Ch t={t} t0={858.9} t1={862.5} text="SOME CAMPS NEVER LEFT" color={C.violeta} x={960} y={150} centro size={58} />
        <G t={t} t0={862.6} text="DUBLIN" y={165} size={140} color={C.crema} />
        <Ch t={t} t0={866.0} t1={867.4} text="CAPITAL OF A WHOLE COUNTRY" color={C.lima} tinta={C.noche} x={960} y={312} centro size={48} />
        <Ch t={t} t0={867.5} text="NOT BAD FOR A PLACE YOU WERE" color={C.ambar} tinta={C.noche} x={960} y={312} centro size={44} />
        <Ch t={t} t0={868.2} text="SUPPOSED TO BURN BEFORE BREAKFAST" color={C.rojo} x={960} y={384} centro size={44} />
      </Escena>
      {/* 8 · ¿y Repton? El gran ejército se fue en primavera… no todo */}
      <Escena t={t} t0={871.42} t1={875.47} zoom={0} entra="corte" golpes={[872.3]}>
        <Mundo t={t} cam={cam} e={{ amanece: 0.85, barcosAlAgua: 872.0 }} luna={[1760, 120, 56]} />
        {/* un vikingo que se queda: cava una tumba con la pala mientras el resto se va */}
        {(() => { const k = (Math.sin(t * 5) + 1) / 2; return (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 1260 1040 Q 1330 960 1420 1040 Z" fill="#5e4428" stroke="#2a1530" strokeWidth={6} /><ellipse cx={1600} cy={1046} rx={120} ry={22} fill="#2a1a10" /></svg>
            <Persona x={1640} y={1040} h={380} t={t} seed={886} ropa={VIK(4)} casco="vikingo" barba={barbaDe(4)} expr={t > 874.2 ? "triste" : "neutro"} flip inclina={10 + k * 16} mira={-0.6} miraY={0.5}
              bD={40 + k * 50} cD={30} bI={60 + k * 40} cI={30}
              manoD={<g><path d="M 0 -60 L 0 150" stroke="#6b4022" strokeWidth={10} strokeLinecap="round" /><path d="M -26 140 L 26 140 L 18 196 L -18 196 Z" fill="#9aa4b8" stroke="#2a1530" strokeWidth={5} /></g>} />
            {t > 872.2 && <Particulas t={t} tipo="polvo" n={14} seed={11} />}
          </>
        ); })()}
        <G t={t} t0={871.5} text="AND REPTON?" y={200} size={130} color={C.crema} />
        <Ch t={t} t0={872.4} text="THE GREAT ARMY LEFT IN THE SPRING…" color={C.violeta} x={960} y={340} centro size={52} />
        <Sello t={t} t0={874.2} text="NOT ALL OF IT" x={560} y={930} size={80} rot={-8} />
      </Escena>
      {/* 9 · junto a la iglesia: un guerrero con su espada, un martillo de Thor y un colmillo de jabalí · y 264+ huesos apilados */}
      <Escena t={t} t0={875.47} t1={896.4} entra="iris" ix={960} iy={700} golpes={[877.8, 880.6, 882.4, 884.2, 885.8, 889.2, 892.7]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #a8c8e0, #e0eef4 40%)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={0} y={380} width={1920} height={700} fill="#8a6a44" /><rect x={0} y={360} width={1920} height={30} fill="#6a9a4a" /></svg>
        {t < 885.7 ? (
          <>
            <div style={{ position: "absolute", left: 1500, top: 120 }}><Iglesia x={0} y={0} s={0.42} t={t} /></div>
            {/* tumba abierta: el guerrero con su espada larga y su escudo están desde el primer segundo */}
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              <rect x={420} y={520} width={1080} height={340} rx={30} fill="#5e4428" stroke="#3a2a18" strokeWidth={8} />
              <path d="M 380 540 Q 400 470 520 480 L 600 520 Z M 1400 520 Q 1500 470 1560 540 Z" fill="#7a5a34" stroke="#3a2a18" strokeWidth={6} />
              {/* escudo redondo vikingo al pie */}
              <g transform="translate(1390 620)"><circle r={62} fill="#b8402a" stroke="#2a1530" strokeWidth={8} /><path d="M -62 0 L 62 0 M 0 -62 L 0 62" stroke="#e8c070" strokeWidth={10} /><circle r={18} fill="#c9c9d4" stroke="#2a1530" strokeWidth={6} /></g>
            </svg>
            <Esqueleto x={960} y={690} s={2.0} t={t} t0={875.3} />
            {/* casco cónico sobre el cráneo */}
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><g opacity={ent(t, 875.5)}><path d="M 500 640 Q 560 560 620 640 Z" fill="#9aa4b8" stroke="#2a1530" strokeWidth={7} transform="rotate(-90 560 690) translate(0 -20)" /></g></svg>
            {/* espada larga a su lado: brilla cuando la nombran */}
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
              {t > 880.6 && <rect x={600} y={772} width={880} height={54} rx={27} fill="#fff8c0" opacity={0.55 * (0.5 + 0.5 * Math.sin((t - 880.6) * 7)) * (1 - prog(t, 882.2, 882.6))} />}
              <path d="M 640 792 L 1350 792 L 1380 799 L 1350 806 L 640 806 Z" fill="#d8dee8" stroke="#2a1530" strokeWidth={5} />
              <path d="M 660 799 L 1330 799" stroke="#9aa4b8" strokeWidth={3} />
              <rect x={600} y={772} width={18} height={54} rx={4} fill="#c9a24a" stroke="#2a1530" strokeWidth={4} />
              <rect x={540} y={790} width={62} height={18} rx={6} fill="#6b4022" stroke="#2a1530" strokeWidth={4} />
              <circle cx={534} cy={799} r={13} fill="#c9a24a" stroke="#2a1530" strokeWidth={4} />
            </svg>
            {t > 882.4 && <Martillo x={690} y={600} s={0.6 * ent(t, 882.4)} />}
            {t > 884.2 && <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><path d="M 1140 720 Q 1220 640 1290 700 Q 1220 690 1150 740 Z" fill="#f4ead2" stroke="#2a1530" strokeWidth={6} opacity={ent(t, 884.2)} /></svg>}
            {/* arqueóloga que cepilla la tumba y reacciona a cada hallazgo */}
            {(() => {
              const sena = t > 880.6 && t < 881.8 ? 1 : t > 882.4 && t < 883.6 ? 2 : t > 884.2 && t < 885.6 ? 3 : 0;
              const cep = Math.sin(t * 9) * 18;
              return (
                <>
                  <Persona x={250} y={1010} h={440} t={t} seed={905} mujer ropa={{ tunica: "#4a8a7a", tunica2: "#2a5a4e", cinto: "#5a3418", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#7a4a22" }}
                    expr={t > 877.8 && t < 879.2 ? "sorpresa" : sena ? "feliz" : "neutro"} mira={0.8} miraY={0.3} habla={sena > 0}
                    bD={sena === 1 ? 95 : sena === 2 ? 115 : sena === 3 ? 105 : 60 + cep} cD={sena ? 5 : 40 + cep}
                    manoD={sena ? undefined : <g><rect x={-6} y={-4} width={12} height={40} fill="#8a5a32" stroke="#2a1530" strokeWidth={4} /><rect x={-14} y={34} width={28} height={22} rx={4} fill="#e8c070" stroke="#2a1530" strokeWidth={4} /></g>} />
                  <Emote t={t} t0={877.9} t1={879.4} tipo="excl" x={150} y={640} s={0.7} />
                </>
              );
            })()}
            <Ch t={t} t0={875.7} t1={877.7} text="RIGHT NEXT TO THE CHURCH" color={C.violeta} x={820} y={150} centro size={56} />
            <Ch t={t} t0={877.8} text="A VIKING WARRIOR" color={C.rojo} x={820} y={150} centro size={56} />
            <Ch t={t} t0={880.6} text="HIS SWORD" color={C.teal} tinta={C.noche} x={1000} y={930} centro size={48} />
            <Ch t={t} t0={882.4} text="THOR'S HAMMER" color={C.ambar} tinta={C.noche} x={690} y={450} centro size={48} />
            <Ch t={t} t0={884.2} text="A WILD BOAR'S TUSK" color={C.teal} tinta={C.noche} x={1220} y={450} centro size={48} />
          </>
        ) : (
          <>
            {/* el osario entra con un barrido de 0,3 s desde abajo (sin hueco negro) */}
            <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - ent(t, 885.7, 0, { damping: 14, stiffness: 260 })) * 700}px)` }}>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}><rect x={460} y={420} width={1000} height={520} fill="#a8a8b8" stroke="#2a1530" strokeWidth={10} /><rect x={500} y={460} width={920} height={440} fill="#3a2a2a" /></svg>
            {Array.from({ length: 24 }, (_, i) => <Craneo key={i} x={560 + (i % 8) * 115} y={850 - Math.floor(i / 8) * 95} s={0.42} t={t} t0={885.4 + i * 0.04} />)}
            </div>
            {/* la arqueóloga entra con un farol, cuenta los cráneos y retrocede */}
            {(() => {
              const x = interpolate(t, [885.8, 887.6, 892.6, 894.2], [1960, 1660, 1660, 1600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const cuenta = t > 889.2 && t < 892.6;
              return (
                <>
                  <Persona x={x} y={1010} h={420} t={t} seed={905} mujer ropa={{ tunica: "#4a8a7a", tunica2: "#2a5a4e", cinto: "#5a3418", piel: "#f2c4a0", piel2: "#d9a080", pelo: "#7a4a22" }}
                    flip expr={t > 889.2 ? "miedo" : "sorpresa"} mira={-0.8} camina={t < 887.6 || (t > 892.6 && t < 894.2) ? 1.6 : 0}
                    bD={cuenta ? 100 + Math.sin(t * 6) * 12 : 40} cD={cuenta ? 10 : 70} bI={30} cI={20}
                    manoI={<g><path d="M 0 -6 L 0 12" stroke="#2a1530" strokeWidth={4} /><rect x={-18} y={12} width={36} height={46} rx={8} fill="#ffd27a" stroke="#2a1530" strokeWidth={5} /><circle cx={0} cy={35} r={40} fill="#ffe8a0" opacity={0.3} /></g>} />
                  <Emote t={t} t0={889.4} t1={892.5} tipo="susto" x={x - 230} y={560} s={0.7} />
                </>
              );
            })()}
            <Ch t={t} t0={885.9} t1={889.1} text="NEARBY · AN OLD STONE BUILDING" color={C.violeta} x={960} y={150} centro size={54} />
            <Cuenta t={t} t0={889.2} t1={892.6} de={0} a={260} dur={1.2} x={960} y={200} size={170} color={C.crema} sufijo="+" />
            <Ch t={t} t0={890.0} t1={892.6} text="PEOPLE · STACKED TOGETHER" color={C.rojo} x={960} y={350} centro size={50} />
            {t > 892.6 && <AbsoluteFill style={{ background: `rgba(8,6,24,${prog(t, 892.6, 893.2) * 0.6})` }} />}
            <G t={t} t0={892.7} text="NOT EVEN THE GREAT ARMY" y={200} size={100} color={C.ambar} />
            <Ch t={t} t0={893.6} text="GOT OUT OF REPTON ALIVE" color={C.rojo} x={960} y={330} centro size={60} />
          </>
        )}
      </Escena>
      {/* 10 · contémoslas otra vez: la cámara recorre las 7 paradas del mundo · 7 trampas antes de que salga el sol */}
      <Escena t={t} t0={896.4} t1={910.78} zoom={0} entra="corte" golpes={[898.3, 899.6, 900.5, 901.4, 903.2, 904.1, 905.1, 906.6]}>
        {(() => {
          const act = [898.2, 899.6, 900.5, 901.4, 903.2, 904.1, 905.1].filter((x) => t >= x).length || undefined;
          const esc = interpolate(t, [904.6, 906.5], [2.4, 3.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <>
              <Mundo t={t} cam={cam} e={{ amanece: prog(t, 896.4, 910.7) * 0.9 }} luna={[1740, 120, 60]} yo={<RutaP8 t={t} t0={896.6} dur={8.52} escala={esc} activa={t < 906.5 ? act : undefined} />} >
                {t > 899.3 && t < 906.5 && <Persona x={cam.x} y={Math.min(gy(Math.min(cam.x, 7400)), 860) + 4} h={300} t={t} seed={3} ropa={SAJON} expr="miedo" camina={2.2} bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={420} />} />}
              </Mundo>
              <EtiquetasP8 t={t} t0={896.6} dur={8.52} cam={cam} escala={esc} activa={t < 906.5 ? act : undefined} />
              {t < 899.6 && (() => {
                // E105 v5: desde el cuadro 0 el chico (h 420) está en la loma: levanta un dedo («ONE…»), señala el campamento
                // y se queda en la loma señalando: con el paneo de la cámara sale por la izquierda (nunca cruza la parada 1); después sigue el caminante chico del mundo
                const sale = 0;
                const sx = 640 - (cam.x - 1250) * cam.z;
                if (sx < -300) return null;
                const wx = cam.x + (sx - 960) / cam.z;
                const sy = 540 + (Math.min(gy(Math.min(wx, 7400)), 860) - cam.y) * cam.z + 30;
                const dedo = t < 896.95, senala = t >= 896.95;
                const bD = dedo ? 140 : senala ? 95 : 30, cD = dedo ? 40 : senala ? 0 : 20;
                return <Persona x={sx} y={sy} h={420} t={t} seed={3} ropa={SAJON} expr={dedo ? "sorpresa" : senala ? "miedo" : "miedo"} mira={0.9} miraY={dedo ? -0.2 : 0}
                  habla={t > 896.5 && t < 897.3} camina={sale > 0 ? 2.6 : 0} inclina={sale > 0 ? 10 : 0} salta={dedo ? Math.max(0, Math.sin((t - 896.4) * 9)) * 10 : 0}
                  bD={bD} cD={cD} bI={senala ? 20 : undefined}
                  manoD={dedo || senala ? <g transform={`rotate(${dedo ? bD + cD : bD + cD + 90})`}><rect x={-7} y={-46} width={14} height={40} rx={7} fill="#f2c4a0" stroke="#2a1530" strokeWidth={4} /></g> : undefined} />;
              })()}
            </>
          );
        })()}
        <Ch t={t} t0={896.6} t1={898.1} text="LET'S COUNT THEM ONE MORE TIME" color={C.violeta} x={960} y={150} centro size={58} />
        <G t={t} t0={906.6} text="7 TRAPS" y={230} size={170} color={C.crema} />
        <Ch t={t} t0={907.8} text="ALL BEFORE THE SUN CAME UP" color={C.ambar} tinta={C.noche} x={960} y={390} centro size={56} />
      </Escena>
      {/* 11 · CTA: si sobreviviste a esta noche, suscribite y la campanita: vienen más trampas · ¿cuál te agarraba primero? */}
      <Escena t={t} t0={910.78} t1={922.4} zoom={0} entra="zoom" golpes={[911.6, 913.4, 916.8]}>
        <Mundo t={t} cam={cam} e={{ amanece: 0.95 }} luna={[1740, 120, 56]}>
          <Persona x={5500} y={862} h={300} t={t} seed={3} ropa={SAJON} expr="feliz" bD={30} cD={20} manoD={<LanzaMano a={50} inclina={-14} largo={460} />} />
        </Mundo>
        <Ch t={t} t0={910.9} t1={916.6} text="SURVIVED THE NIGHT WITH THE VIKINGS?" color={C.violeta} x={960} y={150} centro size={54} />
        {t < 916.7 && (
          <div style={{ position: "absolute", left: 960, top: 360, transform: `translate(-50%,-50%) scale(${ent(t, 911.6)})`, display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ background: "#e02020", color: "#fff", fontFamily: "Fredoka", fontWeight: 700, fontSize: 90, padding: "18px 60px", borderRadius: 26, boxShadow: "0 14px 0 #8a1010", transform: `scale(${t > 912.6 && t < 912.9 ? 0.92 : 1})` }}>SUBSCRIBE</div>
            <svg width={150} height={150} viewBox="-75 -75 150 150" style={{ transform: `rotate(${Math.sin(t * 14) * (t > 913.2 ? 18 : 0)}deg)` }}><path d="M -46 30 L -46 -10 Q -46 -52 0 -56 Q 46 -52 46 -10 L 46 30 L 58 44 L -58 44 Z" fill="#ffd23a" stroke="#2a1530" strokeWidth={8} /><circle cx={0} cy={54} r={12} fill="#ffd23a" stroke="#2a1530" strokeWidth={6} /></svg>
          </div>
        )}
        <Ch t={t} t0={913.4} t1={916.6} text="MORE TRAPS ARE COMING" color={C.ambar} tinta={C.noche} x={960} y={560} centro size={62} />
        <AbsoluteFill style={{ opacity: ent(t, 911.0) }}>
          {(() => {
            // pulgar arriba con SUBSCRIBE (911,6-913,3), saluda con la campanita, y en la pregunta señala la lista
            const pulgar = t > 911.7 && t < 913.3, pre = t > 916.8;
            const bDv = pulgar ? 70 : pre ? 120 + Math.sin(t * 4) * 8 : 30 + Math.sin(t * 6) * 20, cDv = pulgar ? 95 : pre ? 10 : 30;
            return (
              <Persona x={1500} y={1050} h={600} t={t} seed={3} ropa={SAJON} expr={pre ? "sorpresa" : "feliz"} mira={-0.3} habla
                salta={t > 911.7 && t < 912.0 ? 18 : 0} bD={bDv} cD={cDv} bI={pre ? 20 : 25} cI={pre ? 10 : 20}
                manoD={pulgar ? <g transform={`rotate(${bDv + cDv}) scale(1.5)`}><rect x={-20} y={-18} width={40} height={36} rx={10} fill="#f2c4a0" stroke="#2a1530" strokeWidth={5} /><rect x={-8} y={-52} width={16} height={38} rx={8} fill="#f2c4a0" stroke="#2a1530" strokeWidth={5} /></g> : undefined} />
            );
          })()}
        </AbsoluteFill>
        {t > 916.75 && (
          <>
            <G t={t} t0={916.8} text="WHICH TRAP GETS YOU FIRST?" x={740} y={170} size={92} color={C.crema} />
            <div style={{ position: "absolute", left: 90, top: 290, width: 1300, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "26px 30px" }}>
            {["THE PLACE", "THE DITCH", "THE DOGS", "THE SLEEPERS", "THE SHIPS", "THE EXPERTS", "THE MORNING AFTER"].map((n, i) => (
              <div key={n} style={{ transform: `scale(${ent(t, 917.6 + i * 0.25)})`, display: "flex", alignItems: "center", gap: 14, fontFamily: "Fredoka", fontWeight: 700, fontSize: 44, color: "#fff", background: "rgba(27,18,64,.88)", padding: "8px 22px 8px 8px", borderRadius: 40 }}>
                <div style={{ width: 70, height: 70, borderRadius: 35, background: C.ambar, color: C.noche, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>{i + 1}</div>{n}
              </div>
            ))}
            </div>
            <Ch t={t} t0={919.6} text="TELL ME IN THE COMMENTS" color={C.rojo} x={740} y={720} centro size={56} />
          </>
        )}
      </Escena>
    </AbsoluteFill>
  );
};

void gy;
