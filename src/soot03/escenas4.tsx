import React from "react";
import { AbsoluteFill } from "remotion";
import { C, prog, ent, Chip } from "./kit";
import { Mula } from "./kit2";
import { Actua, Carro, Termometro, Gesto } from "./kit3";
import { Sala } from "./sets";

// SETS EXTERIORES + escenas rehechas en la vuelta 4 (las que eran «un soldado solo en la muralla»).
type TonoE = "dia" | "gris" | "atardecer";
const CIELO: Record<TonoE, { cielo: [string, string]; lomas: [string, string, string]; sol: string }> = {
  dia: { cielo: ["#5fb4ea", "#d4eef7"], lomas: ["#9cc3a8", "#6fa25a", "#4f8a34"], sol: "255,236,170" },
  gris: { cielo: ["#6f82a0", "#c8d2dc"], lomas: ["#8a9cac", "#6a8a5a", "#4a6e3a"], sol: "240,240,255" },
  atardecer: { cielo: ["#5a2a7a", "#ffb070"], lomas: ["#8a5a8a", "#6a6a4a", "#4a5a2a"], sol: "255,200,120" },
};
const loma = (y0: number, amp: number, fase: number, dx: number) => {
  let d = `M -200 1200 L -200 ${y0}`;
  for (let x = -200; x <= 2200; x += 80) d += ` L ${x} ${(y0 - amp * (0.6 * Math.sin((x + dx) / 260 + fase) + 0.4 * Math.sin((x + dx) / 97 + fase * 2))).toFixed(0)}`;
  return d + " L 2200 1200 Z";
};

// cielo con sol y halo, nubes que derivan, 3 lomas con paralaje (la cámara se desliza sola), pasto que se mece al frente
export const Exterior: React.FC<{ t: number; tono?: TonoE; viento?: number; horizonte?: number; pasto?: boolean; children?: React.ReactNode }> = ({ t, tono = "dia", viento = 1, horizonte = 560, pasto = true, children }) => {
  const P = CIELO[tono];
  const pan = t * 18;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${P.cielo[0]}, ${P.cielo[1]} ${(horizonte / 10.8).toFixed(0)}%)` }}>
      <div style={{ position: "absolute", left: 1480 - 300, top: 170 - 300, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(${P.sol},.95) 0 13%, rgba(${P.sol},.35) 15%, rgba(${P.sol},0) 62%)` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {[0, 1, 2, 3].map((i) => {
          const x = ((i * 640 + t * (20 + i * 6) * viento) % 2500) - 300, y = 90 + (i % 2) * 120;
          return <g key={i} transform={`translate(${x} ${y}) scale(${0.8 + (i % 3) * 0.25})`} fill="#fff" opacity={0.8}><ellipse rx={150} ry={46} /><ellipse cx={-70} cy={-20} rx={80} ry={54} /><ellipse cx={60} cy={-34} rx={96} ry={66} /></g>;
        })}
        <path d={loma(horizonte - 40, 70, 1, pan * 0.3)} fill={P.lomas[0]} />
        <path d={loma(horizonte + 60, 60, 3, pan * 0.6)} fill={P.lomas[1]} />
        <path d={loma(horizonte + 200, 40, 5, pan)} fill={P.lomas[2]} />
        {/* luz rasante sobre las lomas */}
        <rect x={0} y={horizonte - 120} width={1920} height={400} fill={`rgba(${P.sol},.10)`} />
      </svg>
      {children}
      {/* pasto del frente, se mece con el viento */}
      {pasto && <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
        {Array.from({ length: 64 }, (_, i) => {
          const x = i * 31 + ((i * 53) % 17), h = 50 + ((i * 37) % 45), sw = (10 + 8 * Math.sin(t * 2.6 + i * 0.5)) * viento;
          return <path key={i} d={`M ${x} 1085 q ${sw * 0.5} ${-h / 2} ${sw} ${-h}`} stroke={i % 3 ? "#3f7a2a" : "#2f5a20"} strokeWidth={9} strokeLinecap="round" fill="none" />;
        })}
      </svg>}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 60%, rgba(10,5,25,.3) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Oveja: React.FC<{ x: number; y: number; s?: number; t: number; anda?: boolean; flip?: boolean }> = ({ x, y, s = 1, t, anda, flip }) => {
  const p = anda ? Math.sin(t * 9) * 14 : 0;
  return (
    <svg style={{ position: "absolute", left: x - 160 * s, top: y - 170 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} width={320 * s} height={200 * s} viewBox="-160 -170 320 200">
      <ellipse cx={0} cy={22} rx={120} ry={12} fill="#000" opacity={0.18} />
      {[-60, -30, 30, 60].map((xx, i) => <rect key={i} x={xx - 8} y={-40} width={16} height={60} rx={6} fill="#2a2a2a" transform={`rotate(${(i % 2 ? 1 : -1) * p} ${xx} -40)`} />)}
      {[[-60, -80], [-20, -100], [25, -95], [60, -75], [-40, -55], [10, -60], [50, -50]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={42} fill="#f4f1ea" stroke="#d6d0c4" strokeWidth={4} />)}
      <ellipse cx={108} cy={-92 + Math.sin(t * 3) * 4} rx={32} ry={40} fill="#2a2a2a" />
      <ellipse cx={92} cy={-120} rx={18} ry={9} fill="#2a2a2a" transform="rotate(-30 92 -120)" />
      <circle cx={118} cy={-100} r={6} fill="#fff" /><circle cx={120} cy={-100} r={3} fill="#000" />
    </svg>
  );
};

// 7:30 · «tu trabajo es pararte arriba del muro, al viento, y mirar al norte: lomas, pasto, más pasto… una oveja»
export const MiraNorte: React.FC<{ t: number; t0: number; tLomas: number; tPasto: number; tMas: number; tOveja: number }> = ({ t, t0, tLomas, tPasto, tMas, tOveja }) => {
  const beats: [number, Gesto][] = [[t0, "tiembla"], [tLomas, "señala"], [tPasto + 0.1, "encoge"], [tMas, "triste"], [tOveja, "sorpresa"], [tOveja + 1.2, "señala"]];
  const ox = 2100 - 900 * prog(t, tOveja - 0.3, tOveja + 1.6);
  return (
    <Exterior t={t} tono="gris" viento={1.8}>
      {t > tOveja - 0.3 && <Oveja x={ox} y={850} s={1.15} t={t} anda={t < tOveja + 1.6} flip />}
      {/* almena del frente: él está arriba del muro */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={-20} y={930} width={760} height={170} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 190} y={880} width={120} height={60} rx={6} fill="#b9ad98" stroke="#6a5e4a" strokeWidth={6} />)}
        <rect x={-20} y={930} width={760} height={18} fill="#d8ccb6" />
      </svg>
      <Actua t={t} beats={beats} x0={380} x1={380} y={935} h={560} frio />
      {/* aliento que se ve por el frío */}
      {[0, 1, 2].map((i) => { const k = ((t * 0.7 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 470 + k * 120, top: 480 - k * 50, width: 40 + k * 60, height: 26 + k * 34, borderRadius: "50%", background: "#fff", opacity: 0.45 * (1 - k) }} />; })}
      {t > tLomas && <Chip t={t} t0={tLomas} text="HILLS" color="#5a6e8a" x={1000} y={400} centro size={58} />}
      {t > tPasto && <Chip t={t} t0={tPasto} text="GRASS" color="#3f7a2a" x={1650} y={600} centro size={58} />}
      {t > tMas && <Chip t={t} t0={tMas} text="MORE GRASS" color="#2f5a20" x={1650} y={800} centro size={58} />}
      {t > tOveja && <Chip t={t} t0={tOveja} text="A SHEEP. POSSIBLY." color={C.ambar} tinta={C.noche} x={1200} y={560} centro size={62} />}
    </Exterior>
  );
};

// 5:38 · «acá no crece nada que quieras comer: todo tiene que subir por los caminos» — camino en perspectiva con carros que llegan
export const Camino: React.FC<{ t: number; t0: number; tTodo: number }> = ({ t, t0, tTodo }) => {
  // el camino va de un punto lejano (izquierda, horizonte) al frente (abajo a la derecha)
  const lej = [430, 600], cer = [1560, 1100];
  const carros = [0, 1, 2, 3].map((i) => {
    const k = prog(t, t0 + i * 0.75, t0 + 3.4 + i * 0.75);
    const u = Math.pow(k, 1.6);
    return { i, k, x: lej[0] + (cer[0] - lej[0]) * u, y: lej[1] + (cer[1] - lej[1]) * u, s: 0.12 + 0.75 * u };
  });
  return (
    <Exterior t={t} tono="gris" viento={1.3} horizonte={600}>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <path d={`M ${lej[0] - 10} ${lej[1]} L ${lej[0] + 30} ${lej[1]} L ${cer[0] + 420} 1080 L ${cer[0] - 520} 1080 Z`} fill="#9a7a52" />
        <path d={`M ${lej[0] + 10} ${lej[1]} L ${cer[0] - 50} 1080`} stroke="#c9a36a" strokeWidth={14} strokeDasharray="60 50" opacity={0.6} />
        {/* charcos de barro */}
        {[[820, 760, 90], [1150, 920, 150], [640, 680, 50]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.28} fill="#5a4a3a" opacity={0.7} />)}
        {/* campo pelado: matas secas */}
        {Array.from({ length: 14 }, (_, i) => { const x = 60 + i * 140 + ((i * 71) % 60), y = 680 + ((i * 53) % 160); return x > 1250 || x < 380 ? <path key={i} d={`M ${x} ${y} l -14 -40 M ${x} ${y} l 2 -50 M ${x} ${y} l 16 -36`} stroke="#8a7a52" strokeWidth={6} strokeLinecap="round" /> : null; })}
      </svg>
      {carros.filter((c) => c.k > 0).sort((a, b) => a.s - b.s).map((c) => (
        <React.Fragment key={c.i}>
          <Carro x={c.x} y={c.y - 70 * c.s} s={c.s} t={t} carga={c.i % 2 ? "barril" : "grano"} />
          <Mula x={c.x + 400 * c.s} y={c.y - 110 * c.s} s={c.s * 0.8} t={t} camina={1.4} />
        </React.Fragment>
      ))}
      <Actua t={t} beats={[[t0, "camina"], [t0 + 1.0, "triste"], [tTodo, "señala"]]} x0={-120} x1={230} y={1020} h={460} frio />
      {t > t0 + 0.4 && <Chip t={t} t0={t0 + 0.4} text="NOTHING TO EAT HERE" color="#7a6a4a" x={250} y={460} centro size={44} />}
    </Exterior>
  );
};

// 8:48 · «Roma no siempre pudo mantener caliente el muro… pero siempre lo mantuvo ORGANIZADO»
export const Frio: React.FC<{ t: number; t0: number; tOrg: number }> = ({ t, t0, tOrg }) => {
  const fuego = 1 + 0.15 * Math.sin(t * 13) + 0.1 * Math.sin(t * 21 + 1);
  return (
    <AbsoluteFill>
      <Sala t={t} tono="noche" ventana="der" estante={false} lampara={false} />
      {/* nieve que entra por la ventana */}
      {Array.from({ length: 22 }, (_, i) => { const k = (t * 0.25 + i * 0.137) % 1; return <div key={i} style={{ position: "absolute", left: 1500 + ((i * 97) % 260) + Math.sin(t + i) * 12 - k * 160, top: 170 + k * 520, width: 10, height: 10, borderRadius: 5, background: "#fff", opacity: 0.85 * (1 - k) }} />; })}
      {/* brasero que casi no calienta */}
      <div style={{ position: "absolute", left: 980 - 260, top: 660 - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,150,60,.42), rgba(255,120,40,0) 62%)", transform: `scale(${fuego})`, mixBlendMode: "screen" }} />
      <svg style={{ position: "absolute", left: 980 - 140, top: 560, overflow: "visible" }} width={280} height={300}>
        <path d={`M 70 120 Q ${100 + 10 * Math.sin(t * 9)} ${40 - 30 * fuego} 140 ${10 - 40 * fuego} Q ${180 + 8 * Math.sin(t * 11)} ${50 - 20 * fuego} 210 120 Z`} fill="#ff8a3a" />
        <path d={`M 110 120 Q 130 ${70 - 20 * fuego} 140 ${50 - 30 * fuego} Q 156 ${80 - 14 * fuego} 170 120 Z`} fill="#ffe08a" />
        <path d="M 40 110 L 240 110 L 210 170 L 70 170 Z" fill="#4a3a30" stroke="#2a1a10" strokeWidth={6} />
        <rect x={86} y={170} width={14} height={110} fill="#2a1a10" /><rect x={180} y={170} width={14} height={110} fill="#2a1a10" />
      </svg>
      <Actua t={t} beats={[[t0, "tiembla"], [tOrg - 0.2, "lee"], [tOrg + 1.6, "festeja"]]} x0={560} x1={560} y={1010} h={520} frio />
      {[0, 1, 2].map((i) => { const k = ((t * 0.8 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 640 + k * 110, top: 560 - k * 60, width: 34 + k * 56, height: 22 + k * 30, borderRadius: "50%", background: "#fff", opacity: 0.5 * (1 - k) }} />; })}
      <Termometro t={t} t0={t0 + 0.3} de={6} a={-4} x={250} y={560} s={0.9} />
      {/* repisa ORDENADA: tablillas apiladas con tilde */}
      {t > tOrg && Array.from({ length: 8 }, (_, i) => {
        const e = ent(t, tOrg + i * 0.12);
        return (
          <div key={i} style={{ position: "absolute", left: 1330 + (i % 2) * 230, top: 420 + Math.floor(i / 2) * 110, width: 210, height: 90, borderRadius: 10, background: "#d9b878", border: "5px solid #8a6a3a", transform: `scale(${e})`, boxShadow: "0 8px 0 rgba(0,0,0,.25)" }}>
            {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", left: 16, top: 16 + j * 20, width: 120, height: 6, borderRadius: 3, background: "#6b4a2f" }} />)}
            <div style={{ position: "absolute", right: 12, top: 10, fontSize: 52, fontWeight: 700, color: C.teal, fontFamily: "sans-serif" }}>✓</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 3:40 · «hacés algo que ningún romano decente haría jamás: usás PANTALONES» — en la barraca, los compañeros se ríen
export const Pantalones: React.FC<{ t: number; t0: number; tPant: number }> = ({ t, t0, tPant }) => {
  const puesto = t > tPant;
  return (
    <AbsoluteFill>
      <Sala t={t} tono="piedra" ventana="izq" />
      {/* catre */}
      <div style={{ position: "absolute", left: 1180, top: 760, width: 620, height: 70, borderRadius: 14, background: "#8a5a2a", boxShadow: "0 18px 0 rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", left: 1200, top: 720, width: 580, height: 50, borderRadius: 24, background: "#c9b48a" }} />
      <Actua t={t} beats={[[t0, "habla"], [tPant - 0.5, "niega"], [tPant, "encoge"], [tPant + 1.2, "festeja"]]} x0={760} x1={760} y={1000} h={560} frio={puesto} />
      {/* los pantalones aparecen volando a sus piernas */}
      {t > tPant - 0.5 && t < tPant + 0.1 && (() => {
        const k = prog(t, tPant - 0.5, tPant);
        return <svg style={{ position: "absolute", left: 1500 - 700 * k - 90, top: 600 + 200 * k - 120 * Math.sin(k * Math.PI), overflow: "visible" }} width={180} height={240}><path d="M 20 0 L 160 0 L 170 230 L 110 230 L 90 70 L 70 230 L 10 230 Z" fill="#6b4a2f" stroke="#3a2410" strokeWidth={6} /></svg>;
      })()}
      <Actua t={t} beats={[[t0 + 0.2, "habla"], [tPant, "festeja"], [tPant + 1.0, "señala"]]} x0={1340} x1={1340} y={1000} h={420} quien={2} />
      <Actua t={t} beats={[[t0 + 0.4, "lee"], [tPant + 0.2, "festeja"]]} x0={1640} x1={1640} y={1000} h={390} quien={5} />
    </AbsoluteFill>
  );
};

// 0:30 · «los hombres que cuidaban este muro… no eran exactamente romanos» — multitud en 3 planos (no clones en fila)
export const Multitud: React.FC<{ t: number; t0: number; tSenal: number; tDuda: number; tLab: number; labels: string[] }> = ({ t, t0, tSenal, tDuda, tLab, labels }) => {
  const g = (i: number): [number, Gesto][] => [[t0 + (i % 4) * 0.12, ["habla", "lee", "encoge", "tiembla"][i % 4] as Gesto], [tSenal + (i % 3) * 0.1, i % 2 ? "señala" : "enojado"], [tDuda + (i % 5) * 0.08, i % 3 ? "encoge" : "sorpresa"]];
  const fuego = (k: number) => 1 + 0.15 * Math.sin(t * 13 + k) + 0.1 * Math.sin(t * 21 + k * 2);
  const cols = [C.ambar, C.rojo, C.teal, C.violeta, C.lima, C.naranja];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0e0a28,#2b2457 60%,#3a2f6a)" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <path d="M 0 520 Q 400 430 900 500 T 1920 470 L 1920 1080 L 0 1080 Z" fill="#1c1a3a" />
        {/* parapeto del fondo */}
        <rect x={0} y={600} width={1920} height={480} fill="#5d5874" />
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 92} y={560} width={56} height={46} rx={4} fill="#6b6488" stroke="#3a3456" strokeWidth={3} />)}
      </svg>
      {/* antorchas con halo */}
      {[300, 960, 1620].map((x, k) => (
        <React.Fragment key={x}>
          <div style={{ position: "absolute", left: x - 230, top: 470 - 230, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,170,80,.45), rgba(255,140,60,0) 65%)", transform: `scale(${fuego(k)})`, mixBlendMode: "screen" }} />
          <svg style={{ position: "absolute", left: x - 40, top: 400, overflow: "visible" }} width={80} height={200}>
            <rect x={34} y={60} width={12} height={140} fill="#4a3020" />
            <path d={`M 22 64 Q ${34 + 6 * Math.sin(t * 9 + k)} ${10 - 20 * fuego(k)} 40 ${-10 - 26 * fuego(k)} Q ${52 + 5 * Math.sin(t * 11 + k)} ${20 - 14 * fuego(k)} 58 64 Z`} fill="#ff9a3a" />
            <path d={`M 32 64 Q 38 ${36 - 10 * fuego(k)} 40 ${20 - 16 * fuego(k)} Q 46 ${40 - 8 * fuego(k)} 50 64 Z`} fill="#ffe08a" />
          </svg>
        </React.Fragment>
      ))}
      {/* fila del fondo, chiquita, detrás del parapeto */}
      {Array.from({ length: 11 }, (_, i) => <Actua key={"f" + i} t={t} beats={g(i + 7)} x0={90 + i * 172 + (i % 2) * 30} x1={90 + i * 172 + (i % 2) * 30} y={720} h={190} quien={i + 3} />)}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <rect x={0} y={690} width={1920} height={60} fill="#4a4562" />
      </svg>
      {/* fila del medio */}
      {Array.from({ length: 6 }, (_, i) => <Actua key={"m" + i} t={t} beats={g(i)} x0={260 + i * 280} x1={260 + i * 280} y={930} h={320} quien={i} />)}
      {/* adelante, dos grandes (cortados a la rodilla) */}
      <Actua t={t} beats={g(1)} x0={170} x1={170} y={1230} h={640} quien={1} />
      <Actua t={t} beats={g(3)} x0={1760} x1={1760} y={1230} h={640} quien={3} vuelta={t0} />
      {/* lluvia */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
        {Array.from({ length: 70 }, (_, i) => { const k = (t * 1.8 * (0.7 + (i % 5) * 0.12) + i * 0.137) % 1, y = k * 1260 - 140, x = ((i * 157) % 2300) - 200 - 0.45 * y; return <line key={i} x1={x} y1={y} x2={x + 22} y2={y - 50} stroke="#d6e6ff" strokeWidth={4} strokeLinecap="round" opacity={0.5} />; })}
      </svg>
      {labels.map((l, i) => t > tLab + i * 0.12 ? <Chip key={l} t={t} t0={tLab + i * 0.12} text={l} color={cols[i % 6]} tinta={i % 2 === 0 ? C.noche : "#fff"} x={260 + i * 280} y={560 - (i % 2) * 60} centro size={40} /> : null)}
    </AbsoluteFill>
  );
};
