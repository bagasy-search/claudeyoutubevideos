import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Persona } from "./persona";
import { C, fontFamily, ent, prog, Escena, Cielo, Colinas, Chip, Grande, MapaPuntos, Particulas, Rayos, Emote, cabeza, Aguila } from "./kit";
import { Gladius, Escudo, Pilum, Soldadito, Craneo, Arbol, Lluvia, Trampas } from "./kit2";
import { Cuenta } from "./P1";

// Parte 6 (659,62-792,73 s): trampa 6, la batalla desde adentro, Cannas y el bosque de Teutoburgo.
const L = (x: number, y: number, h: number) => cabeza(x, y, h);
const Suelo: React.FC<{ y?: number; a?: string; b?: string }> = ({ y = 860, a = "#c9773a", b = "#7a4a20" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${a}, ${b})` }} />
);
const Tachado: React.FC<{ t: number; t0: number; x: number; y: number; w?: number; h?: number }> = ({ t, t0, x, y, w = 600, h = 400 }) => (
  <svg style={{ position: "absolute", left: x - w / 2, top: y - h / 2, overflow: "visible" }} width={w} height={h}>
    <path d={`M 20 20 L ${w - 20} ${h - 20} M ${w - 20} 20 L 20 ${h - 20}`} stroke={C.rojo} strokeWidth={Math.min(w, h) / 10} strokeLinecap="round" strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - prog(t, t0, t0 + 0.25))} />
  </svg>
);
// barra de energía
const Energia: React.FC<{ t: number; t0: number; t1: number; x: number; y: number }> = ({ t, t0, t1, x, y }) => {
  const f = 1 - prog(t, t0, t1);
  return (
    <div style={{ position: "absolute", left: x - 380, top: y - 50, width: 760, height: 100, borderRadius: 50, border: "10px solid #fff", background: "rgba(0,0,0,.3)", overflow: "hidden" }}>
      <div style={{ width: `${f * 100}%`, height: "100%", background: f > 0.5 ? C.lima : f > 0.25 ? C.ambar : C.rojo }} />
    </div>
  );
};
// estandarte numerado de una legión
const Estandarte: React.FC<{ t: number; t0: number; x: number; y: number; n: string; fade?: number }> = ({ t, t0, x, y, n, fade = 1e9 }) => {
  if (t < t0) return null;
  const op = 1 - prog(t, fade, fade + 1.2);
  return (
    <div style={{ position: "absolute", left: x - 140, top: y - 360, width: 280, height: 720, opacity: op, transform: `scale(${ent(t, t0)}) translateY(${(1 - op) * 80}px)`, filter: `grayscale(${1 - op})` }}>
      <div style={{ position: "absolute", left: 132, top: 120, width: 16, height: 600, background: "#8a5a2a" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 280, height: 180 }}><Aguila x={140} y={90} s={0.7} /></div>
      <div style={{ position: "absolute", left: 40, top: 220, width: 200, height: 220, background: C.rojo, border: "8px solid #e9a92a", fontFamily, fontWeight: 700, fontSize: 72, color: "#fff", textAlign: "center", lineHeight: "200px" }}>{n}</div>
    </div>
  );
};

export const P6: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* 158 · trampa seis: la batalla */}
    <Escena t={t} t0={659.62} t1={662.0} entra="corte" golpes={[659.84, 660.96]}>
      <AbsoluteFill style={{ background: C.rojo }} />
      <Rayos t={t} x={960} y={430} color="#fff" op={0.14} />
      <Grande t={t} t0={659.84} text="TRAP #6" y={400} size={260} color="#fff" borde="#5e0f1d" />
      <Grande t={t} t0={660.96} text="THE BATTLE" y={650} size={140} color={C.oro} borde="#5e0f1d" />
      <Trampas t={t} t0={659.7} n={6} y={850} on={C.oro} />
    </Escena>

    {/* 159 · tarde o temprano llega */}
    <Escena t={t} t0={662.0} t1={663.15} entra="zoom" golpes={[662.32]}>
      <Cielo tipo="sangre" />
      <Colinas capas={["#4a1030", "#2a0a1e"]} base={760} seed={121} alto={80} />
      <Grande t={t} t0={662.12} text="IT COMES." y={420} size={200} color="#fff" borde="#2a0a1e" />
    </Escena>

    {/* 160 · el enemigo en la colina; vos en la fila, hombro con hombro, escudo con escudo */}
    <Escena t={t} t0={663.15} t1={668.72} zoom={0.04} entra="corte" golpes={[663.91, 665.34, 666.38, 667.74]}>
      <Cielo tipo="atardecer" />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M 0 520 Q 600 260 1300 300 Q 1700 320 1920 420 L 1920 1080 L 0 1080 Z" fill="#6a2a5a" /></svg>
      {Array.from({ length: 22 }, (_, i) => <Soldadito key={i} x={420 + i * 52} y={330 + Math.abs(i - 11) * 6} s={0.55} t={t} seed={200 + i} enemigo />)}
      <Suelo y={800} a="#8a5a3a" b="#4a2a1a" />
      {Array.from({ length: 13 }, (_, i) => { const k = prog(t, 664.6 + i * 0.05, 665.2 + i * 0.05); return <Soldadito key={i} x={interpolate(k, [0, 1], [i < 7 ? -200 : 2100, 120 + i * 140])} y={960} s={1.7} t={t} seed={i} />; })}
      <Chip t={t} t0={663.91} text="THE ENEMY: ON THE HILL" color={C.rojo} x={160} y={140} size={54} />
      <Chip t={t} t0={665.34} text="YOU: IN A LINE" color={C.violeta} x={160} y={260} size={54} />
      <Chip t={t} t0={667.12} text="SHIELD TOUCHING SHIELD" color={C.ambar} tinta={C.noche} x={1100} y={140} size={50} />
    </Escena>

    {/* 161 · cómo se siente de verdad desde adentro */}
    <Escena t={t} t0={668.72} t1={672.22} zoom={0.06} entra="iris" ix={960} iy={500} golpes={[669.96, 671.15]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ff9a4d, #8c1d34 70%)" }} />
      <Persona x={960} y={1320} h={1100} t={t} seed={1} casco="legion" expr="miedo" mira={0.1} />
      <Escudo x={250} y={760} s={2.0} rot={4} />
      <Escudo x={1670} y={760} s={2.0} rot={-4} />
      <Emote t={t} t0={670.0} tipo="sudor" {...L(960, 1320, 1100)} s={1.6} />
      <Grande t={t} t0={670.36} text="FROM THE INSIDE" y={150} size={110} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 162 · primero, la espera: a veces horas */}
    <Escena t={t} t0={672.22} t1={675.38} entra="barrido" golpes={[672.96, 674.46]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #4a2f8f, #2d1b69)" }} />
      <svg style={{ position: "absolute", left: 960 - 280, top: 260 }} width={560} height={560} viewBox="-280 -280 560 560">
        <circle r={250} fill="#fff8ec" stroke="#2a1530" strokeWidth={16} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-215} x2={0} y2={-240} stroke="#2a1530" strokeWidth={10} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={0} x2={0} y2={-180} stroke={C.rojo} strokeWidth={14} strokeLinecap="round" transform={`rotate(${(t - 672.2) * 720})`} />
        <line x1={0} y1={0} x2={0} y2={-120} stroke="#2a1530" strokeWidth={18} strokeLinecap="round" transform={`rotate(${(t - 672.2) * 60})`} />
        <circle r={18} fill="#2a1530" />
      </svg>
      <Chip t={t} t0={672.96} text="FIRST: THE WAITING" color={C.violeta} x={160} y={140} size={58} />
      <Chip t={t} t0={674.46} text="FOR HOURS" color={C.ambar} tinta={C.noche} x={960} y={920} centro size={64} />
    </Escena>

    {/* 163 · el enemigo carga */}
    <Escena t={t} t0={675.38} t1={677.0} entra="corte" golpes={[675.93]}>
      <Cielo tipo="sangre" />
      <Colinas capas={["#4a1030", "#2a0a1e"]} base={700} seed={122} alto={60} />
      {Array.from({ length: 16 }, (_, i) => { const k = prog(t, 675.5, 677.0); return <Soldadito key={i} x={100 + i * 115 + Math.sin(i) * 20} y={interpolate(k, [0, 1], [740, 1000]) + (i % 3) * 20} s={interpolate(k, [0, 1], [1, 2.4])} t={t} seed={210 + i} enemigo avanza={2} />; })}
      <Particulas t={t} tipo="polvo" n={40} seed={123} />
      <Grande t={t} t0={675.93} text="CHARGE!" y={220} size={200} color="#fff" borde={C.rojo} />
    </Escena>

    {/* 164 · cuando están cerca, tirás tus dos jabalinas */}
    <Escena t={t} t0={677.0} t1={679.82} zoom={0.04} entra="diag" golpes={[678.1, 678.77]}>
      <Cielo tipo="atardecer" />
      <Colinas capas={["#7a3a6a", "#5a2a5a"]} base={760} seed={124} alto={40} />
      {Array.from({ length: 18 }, (_, i) => {
        const t0 = 678.1 + (i % 6) * 0.06 + Math.floor(i / 6) * 0.35;
        if (t < t0) return null;
        const k = Math.min(1.2, (t - t0) / 0.9);
        const x = interpolate(k, [0, 1], [-100, 1900]) - (i % 6) * 60, y = 760 - Math.sin(Math.min(1, k) * Math.PI) * 520 + (i % 6) * 26;
        const ang = interpolate(k, [0, 0.5, 1], [-40, 0, 40]);
        return <Pilum key={i} x={x} y={y} s={0.6} rot={ang} />;
      })}
      {Array.from({ length: 8 }, (_, i) => <Soldadito key={i} x={1100 + i * 110} y={940} s={1.3} t={t} seed={220 + i} enemigo cae={i % 2 ? 679.0 + i * 0.05 : undefined} />)}
      <Chip t={t} t0={677.29} text="WHEN THEY ARE CLOSE" color={C.violeta} x={160} y={140} size={54} />
      <Chip t={t} t0={678.55} text="THROW YOUR 2 JAVELINS" color={C.rojo} x={160} y={260} size={56} />
    </Escena>

    {/* 165 · desenvainás la espada corta, el gladius, y entrás en el amontonamiento */}
    <Escena t={t} t0={679.82} t1={683.91} zoom={0.05} entra="corte" golpes={[680.05, 681.51, 683.15]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #ffd27a, #8c1d34 70%)" }} />
      <Rayos t={t} x={960} y={540} color="#fff" op={0.12} />
      {t < 682.2 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${interpolate(prog(t, 679.9, 680.5), [0, 1], [-500, 0])}px)` }}><Gladius x={960} y={560} s={2.6} rot={-90} /></div>}
      {t >= 682.2 && <>
        {Array.from({ length: 20 }, (_, i) => <Persona key={i} x={80 + (i % 10) * 200 + (Math.floor(i / 10) ? 100 : 0)} y={1000 + Math.floor(i / 10) * 140 + Math.sin(t * 7 + i) * 6} h={420} t={t} seed={230 + i} casco="legion" expr="enojado" inclina={Math.sin(t * 5 + i) * 8} />)}
      </>}
      <Grande t={t} t0={681.51} text="THE GLADIUS" y={200} size={140} color="#fff" borde={C.rojo} />
      <Grande t={t} t0={683.01} text="INTO THE CRUSH" y={320} size={120} color={C.oro} borde="#2a1530" />
    </Escena>

    {/* 166 · no la balanceás como en las películas */}
    <Escena t={t} t0={683.91} t1={685.9} entra="zoom" golpes={[684.36, 685.2]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      <svg style={{ position: "absolute", left: 460, top: 160 }} width={1000} height={760}>
        <path d="M 120 600 A 420 420 0 0 1 880 600" stroke="#fff" strokeWidth={20} fill="none" strokeDasharray="40 30" strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${Math.sin((t - 683.9) * 6) * 50}deg)`, transformOrigin: "960px 800px" }}><Gladius x={960} y={440} s={1.6} rot={0} /></div>
      {t > 684.8 && <Tachado t={t} t0={684.8} x={960} y={480} w={900} h={700} />}
      <Chip t={t} t0={684.36} text="NOT LIKE IN THE MOVIES" color={C.rojo} x={960} y={980} centro size={60} />
    </Escena>

    {/* 167-168 · apuñalás bajo, desde atrás del escudo... mientras alguien que no ves te apuñala */}
    <Escena t={t} t0={685.9} t1={692.98} zoom={0.05} entra="corte" golpes={[685.91, 686.53, 687.91, 691.53]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 50%, #8c1d34, #2a0a1e 75%)" }} />
      {(() => {
        const st = t > 686.0 && t < 690.2 ? Math.max(0, Math.sin((t - 686) * 9)) : 0;
        return <>
          <div style={{ position: "absolute", left: 1200 + st * 260, top: 700, width: 0, height: 0 }}><div style={{ position: "relative" }}><Gladius x={0} y={0} s={1.5} rot={90} /></div></div>
          <Escudo x={860} y={560} s={3.0} rot={-2} />
        </>;
      })()}
      {t > 690.2 && <div style={{ position: "absolute", left: 1500, top: 120, width: 400, height: 900, background: "linear-gradient(90deg, transparent, #000)", opacity: 0.85 }} />}
      {t > 691.3 && <div style={{ position: "absolute", inset: 0, transform: `translateX(${interpolate(prog(t, 691.4, 691.7), [0, 1], [400, 0])}px)` }}><Gladius x={1500} y={400} s={1.3} rot={-150} /></div>}
      <Chip t={t} t0={685.91} text="YOU STAB" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={686.53} text="LOW" color={C.ambar} tinta={C.noche} x={160} y={260} size={60} />
      <Chip t={t} t0={687.41} text="FROM BEHIND YOUR SHIELD" color={C.violeta} x={160} y={380} size={52} />
      <Chip t={t} t0={690.34} text="SOMEONE YOU CAN'T SEE..." color="#2a1530" x={160} y={880} size={52} />
      <Chip t={t} t0={691.53} text="STABS BACK" color={C.rojo} x={160} y={990} size={60} />
    </Escena>

    {/* 169 · la primera fila se agota en minutos, así que rotan */}
    <Escena t={t} t0={692.98} t1={696.9} entra="sube" banda={C.lima} golpes={[693.86, 694.63, 696.12]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2d1b69, #4a2f8f)" }} />
      <Persona x={960} y={1140} h={640} t={t} seed={1} casco="legion" expr={t > 694.5 ? "triste" : "enojado"} inclina={prog(t, 693.5, 695.5) * 20} ladea={prog(t, 694, 695.5) * 8} />
      <Emote t={t} t0={693.9} tipo="sudor" {...L(960, 1140, 640)} s={1.3} />
      <Energia t={t} t0={693.4} t1={695.4} x={960} y={300} />
      <Chip t={t} t0={693.86} text="EXHAUSTED" color={C.rojo} x={160} y={140} size={60} />
      <Chip t={t} t0={694.63} text="IN MINUTES" color={C.ambar} tinta={C.noche} x={1300} y={140} size={60} />
      <Grande t={t} t0={696.12} text="ROTATE!" y={480} size={160} color={C.lima} borde="#2a1530" />
    </Escena>

    {/* 170 · los de atrás pasan adelante y vos atrás a respirar */}
    <Escena t={t} t0={696.9} t1={700.75} zoom={0.03} entra="corte" golpes={[698.15, 699.41, 699.88]}>
      <Cielo tipo="atardecer" />
      <Suelo y={600} a="#8a5a3a" b="#4a2a1a" />
      {Array.from({ length: 3 }, (_, f) => Array.from({ length: 9 }, (_, i) => {
        const k = prog(t, 697.9, 699.6);
        const fila = f === 0 ? interpolate(k, [0, 1], [0, 2]) : f - k;
        const x = 200 + i * 190 + (f === 0 ? Math.sin(k * Math.PI) * 90 : 0);
        return <Soldadito key={`${f}-${i}`} x={x} y={960 - fila * 150} s={1.4 - fila * 0.2} t={t} seed={f * 10 + i} color={f === 0 ? "#7fd6ff" : undefined} />;
      }))}
      <svg style={{ position: "absolute", left: 1700, top: 380 }} width={160} height={600}><path d="M 80 560 L 80 60 M 30 120 L 80 40 L 130 120" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" /></svg>
      <Chip t={t} t0={697.36} text="THE MEN BEHIND STEP FORWARD" color={C.violeta} x={160} y={140} size={50} />
      <Chip t={t} t0={699.15} text="YOU STEP BACK TO BREATHE" color={C.teal} tinta={C.noche} x={160} y={260} size={50} />
    </Escena>

    {/* 171 · ese sistema le ganó muchas batallas a Roma */}
    <Escena t={t} t0={700.75} t1={703.24} entra="zoom" golpes={[701.62, 702.34]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffd27a, #e9a92a 60%, #8c4a1a)" }} />
      <Rayos t={t} x={960} y={500} color="#fff" op={0.2} />
      <Particulas t={t} tipo="lluviaoro" n={40} seed={125} />
      <div style={{ position: "absolute", left: 960 - 200, top: 260, width: 400, height: 300, transform: `scale(${ent(t, 700.9) * 1.6})` }}><Aguila x={200} y={150} s={1} /></div>
      <Grande t={t} t0={701.62} text="A LOT OF BATTLES WON" y={760} size={100} color="#fff" borde="#7a3d14" />
    </Escena>

    {/* 172 · pero cuando fallaba, fallaba del todo */}
    <Escena t={t} t0={703.24} t1={706.03} entra="corte" golpes={[703.6, 704.81]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      {Array.from({ length: 9 }, (_, i) => {
        const k = prog(t, 704.6, 705.8);
        const a = (i / 9) * Math.PI * 2;
        return <div key={i} style={{ position: "absolute", left: 860 + Math.cos(a) * k * 600, top: 360 + Math.sin(a) * k * 400 + k * k * 300, width: 200, height: 140, background: C.rojo, clipPath: "polygon(0 0, 100% 20%, 70% 100%, 10% 70%)", transform: `rotate(${k * (i * 40 - 160)}deg)`, opacity: t > 704.6 ? 1 - k * 0.4 : 0 }} />;
      })}
      {t < 704.6 && <div style={{ position: "absolute", left: 660, top: 320, width: 600, height: 400, background: C.rojo, borderRadius: 20 }} />}
      <Grande t={t} t0={703.6} text="WHEN IT FAILED..." y={200} size={110} color="#fff" />
      <Grande t={t} t0={704.81} text="COMPLETELY" y={900} size={150} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 173 · Roma lo aprendió por las malas, mucho antes de tu época */}
    <Escena t={t} t0={706.03} t1={709.25} entra="barrido" golpes={[706.93, 708.47]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #4a3a2a, #2a1d14)" }} />
      <Particulas t={t} tipo="polvo" n={30} seed={126} />
      <Grande t={t} t0={706.37} text="THE HARD WAY" y={380} size={170} color="#e8d8b8" borde="#2a1d14" />
      <Chip t={t} t0={707.77} text="LONG BEFORE YOUR TIME" color={C.violeta} x={960} y={640} centro size={58} />
    </Escena>

    {/* 174-175 · 216 a. C., Cannas: Aníbal rodeó un ejército romano enorme y lo apretó */}
    <Escena t={t} t0={709.25} t1={717.99} zoom={0.04} entra="corte" golpes={[709.39, 712.19, 714.45, 714.85, 716.91]}>
      {t < 713.6
        ? <MapaPuntos t={t} pulsa={["CANNAE"]} t0Pulsa={712.19} vuela={{ n: "CANNAE", z: 2.4, t: [710.6, 712.4] }} />
        : <>
          <AbsoluteFill style={{ background: "#c8b070" }} />
          {(() => {
            const sq = prog(t, 714.85, 717.6), sq2 = prog(t, 716.9, 717.9);
            const romW = 900 - sq2 * 300, romH = 340 - sq2 * 80;
            return <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
              <rect x={960 - romW / 2} y={560 - romH / 2} width={romW} height={romH} rx={20} fill={C.rojo} stroke="#5e0f1d" strokeWidth={10} />
              {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={960 - romW / 2 + 40 + (i % 12) * ((romW - 80) / 11)} cy={560 - romH / 2 + 40 + Math.floor(i / 12) * ((romH - 80) / 4)} r={10} fill="#ffd0c0" />)}
              <path d={`M ${960 - 700 + sq * 120} ${560 + 260 - sq * 40} L ${960 - 700 + sq * 120} ${560 - 260 + sq * 40} Q 960 ${560 - 300 - (1 - sq) * 200} ${960 + 700 - sq * 120} ${560 - 260 + sq * 40} L ${960 + 700 - sq * 120} ${560 + 260 - sq * 40} Q 960 ${560 + 300 + (1 - sq) * 200} ${960 - 700 + sq * 120} ${560 + 260 - sq * 40} Z`} fill="none" stroke="#2f6df6" strokeWidth={70 + sq2 * 20} strokeLinejoin="round" strokeDasharray={sq < 1 ? `${3600 * sq} 9999` : undefined} />
              {[0, 1, 2, 3].map((i) => { const a = (i / 4) * Math.PI * 2 + 0.6; return <path key={i} d="M 0 -30 L 50 0 L 0 30" fill="#2f6df6" transform={`translate(${960 + Math.cos(a) * (650 - sq * 160)} ${560 + Math.sin(a) * (300 - sq * 50)}) rotate(${(a * 180) / Math.PI + 180})`} />; })}
            </svg>;
          })()}
        </>}
      <Cuenta t={t} t0={709.39} t1={710.0} de={300} a={216} x={1480} y={200} size={140} color="#fff" suf=" BC" />
      <Chip t={t} t0={712.19} text="CANNAE · SOUTHERN ITALY" color={C.violeta} x={160} y={140} size={52} />
      <Chip t={t} t0={714.45} text="HANNIBAL" color="#2f6df6" x={160} y={900} size={64} />
      <Chip t={t} t0={714.85} text="SURROUNDED" color="#2a1530" x={160} y={260} size={60} />
      <Chip t={t} t0={716.91} text="...AND SQUEEZED" color={C.rojo} x={1260} y={900} size={60} />
    </Escena>

    {/* 176 · los del medio tan apretados que no podían ni levantar la espada */}
    <Escena t={t} t0={717.99} t1={722.05} zoom={0.06} entra="zoom" golpes={[719.43, 721.09]}>
      <AbsoluteFill style={{ background: "#3a1a1a" }} />
      {Array.from({ length: 24 }, (_, i) => {
        const r = Math.floor(i / 8), c = i % 8, apri = prog(t, 718.3, 720.5);
        return <Persona key={i} x={960 + (c - 3.5) * (230 - apri * 70)} y={760 + r * 150} h={520} t={t} seed={i === 11 ? 1 : 240 + i} casco="legion" expr={i === 11 ? "miedo" : "triste"} bD={0} bI={0} inclina={Math.sin(t * 4 + i) * 4} />;
      })}
      <Emote t={t} t0={719.6} tipo="susto" {...L(960 + 0.5 * 160, 1060, 520)} />
      <Chip t={t} t0={718.53} text="THE MIDDLE" color={C.violeta} x={160} y={140} size={58} />
      <Chip t={t} t0={719.43} text="PACKED SO TIGHTLY..." color={C.rojo} x={160} y={260} size={56} />
      <Chip t={t} t0={720.61} text="NO ROOM TO RAISE A SWORD" color={C.ambar} tinta={C.noche} x={160} y={380} size={50} />
    </Escena>

    {/* 177 · unos 50.000 romanos murieron en una sola tarde */}
    <Escena t={t} t0={722.05} t1={729.67} zoom={0.04} entra="iris" ix={960} iy={420} golpes={[723.57, 725.71, 727.63]}>
      <Cielo tipo="sangre" />
      <svg style={{ position: "absolute", left: 960 - 160, top: interpolate(t, [722, 729.6], [300, 620]) - 160 }} width={320} height={320}><circle cx={160} cy={160} r={150} fill="#ffb070" opacity={0.85} /></svg>
      <Colinas capas={["#4a1030", "#2a0a1e"]} base={720} seed={127} alto={40} />
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + i * 60, top: 860 + (i % 3) * 30, width: 40 * prog(t, 723.6 + i * 0.03, 724 + i * 0.03), height: 46, borderRadius: "50% 50% 0 0", background: "#1a0612" }} />)}
      <Chip t={t} t0={722.29} text="BY THE ANCIENT ACCOUNTS" color={C.violeta} x={160} y={140} size={50} />
      <Cuenta t={t} t0={723.57} t1={724.7} de={0} a={50000} x={960} y={330} size={190} color="#fff" />
      <Chip t={t} t0={724.37} text="ROMANS DIED" color={C.rojo} x={960} y={500} centro size={60} />
      <Chip t={t} t0={725.43} text="IN ONE AFTERNOON" color={C.ambar} tinta={C.noche} x={960} y={600} centro size={58} />
      <Chip t={t} t0={727.63} text="ONE OF THE BLOODIEST DAYS IN HISTORY" color="#2a0a1e" x={960} y={1000} centro size={48} />
    </Escena>

    {/* 178 · todo centurión sabía el nombre; la lección: que nunca te rodeen */}
    <Escena t={t} t0={729.67} t1={734.83} zoom={0.05} entra="corte" golpes={[730.81, 732.11, 733.75]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2f6df6, #12061a 75%)" }} />
      <Persona x={380} y={1140} h={700} t={t} seed={60} ropa={{ tunica: "#a3202f", tunica2: "#5e0f1d", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#2a1a10" }} casco="centurion" expr="enojado" habla bD={130} cD={40} />
      <Chip t={t} t0={730.4} text="EVERY CENTURION KNEW THE NAME" color={C.violeta} x={160} y={140} size={48} />
      <Grande t={t} t0={732.11} text="THE LESSON:" x={1150} y={330} size={100} color="#fff" />
      <Grande t={t} t0={733.11} text="NEVER LET THEM" x={1150} y={500} size={120} color={C.oro} borde="#2a1530" />
      <Grande t={t} t0={733.75} text="SURROUND YOU" x={1150} y={680} size={150} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 179 · año 9: Varo mete tres legiones en el bosque de Teutoburgo */}
    <Escena t={t} t0={734.83} t1={740.49} zoom={0.04} entra="barrido" golpes={[735.23, 737.19, 738.43, 739.63]}>
      {t < 737.0
        ? <MapaPuntos t={t} pulsa={["TEUTOBURG"]} t0Pulsa={735.3} vuela={{ n: "TEUTOBURG", z: 2.4, t: [735.0, 736.8] }} />
        : <>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a2a, #12201a)" }} />
          {Array.from({ length: 9 }, (_, i) => <Arbol key={i} x={100 + i * 220} y={760} s={0.9 + (i % 3) * 0.15} t={t} t0={737.4 + i * 0.05} color="#1d3a24" alto={900} />)}
          <Estandarte t={t} t0={737.19} x={560} y={620} n="XVII" />
          <Estandarte t={t} t0={737.35} x={960} y={620} n="XVIII" />
          <Estandarte t={t} t0={737.51} x={1360} y={620} n="XIX" />
        </>}
      <Cuenta t={t} t0={735.23} t1={735.6} de={1} a={9} x={1500} y={200} size={140} color="#fff" pre="AD " />
      <Chip t={t} t0={735.99} text="GOVERNOR VARUS" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={737.19} text="3 LEGIONS" color={C.rojo} x={160} y={260} size={60} />
      <Grande t={t} t0={738.43} text="TEUTOBURG FOREST" y={960} size={100} color="#fff" borde="#1d3a24" />
    </Escena>

    {/* 180 · llovió; el camino, un sendero de barro entre árboles y pantanos */}
    <Escena t={t} t0={740.49} t1={745.11} zoom={0.05} entra="corte" golpes={[740.61, 742.13, 742.49, 744.13]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a3a, #1a2620)" }} />
      <Lluvia t={t} n={180} angulo={20} op={0.55} />
      {Array.from({ length: 7 }, (_, i) => <Arbol key={i} x={i % 2 ? 1500 + (i * 60) % 400 : 120 + (i * 70) % 420} y={720} s={1.1} color="#14281a" alto={1000} />)}
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}><path d="M 820 1080 Q 900 800 940 560 L 980 560 Q 1040 800 1180 1080 Z" fill="#5a3a1a" /><ellipse cx={500} cy={980} rx={260} ry={60} fill="#2a4a3a" /><ellipse cx={1480} cy={960} rx={240} ry={50} fill="#2a4a3a" /></svg>
      {Array.from({ length: 7 }, (_, i) => { const k = ((t - 740.5) * 0.12 + i / 7) % 1; return <Soldadito key={i} x={interpolate(k, [0, 1], [1000, 960])} y={interpolate(k, [0, 1], [1080, 580])} s={interpolate(k, [0, 1], [1.8, 0.4])} t={t} seed={250 + i} avanza={1} />; })}
      <Chip t={t} t0={740.61} text="IT RAINED" color={C.teal} tinta={C.noche} x={160} y={140} size={58} />
      <Chip t={t} t0={742.13} text="NARROW · MUDDY" color={C.tierra} x={160} y={260} size={56} />
      <Chip t={t} t0={743.53} text="TREES & SWAMPS" color={C.violeta} x={1100} y={140} size={56} />
    </Escena>

    {/* 181 · los guerreros germanos, liderados por alguien entrenado por Roma, atacaron por todos lados tres días */}
    <Escena t={t} t0={745.11} t1={751.87} zoom={0.04} entra="corte" golpes={[745.61, 747.55, 749.17, 751.07]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #6a8a6a, #2a3a2a)" }} />
      <Lluvia t={t} n={120} angulo={20} op={0.4} />
      {t < 748.9 ? <>
        <Persona x={960} y={1140} h={760} t={t} seed={70} ropa={{ tunica: "#3a5a2a", tunica2: "#24401a", cinto: "#3b230f", piel: "#e8b090", piel2: "#c08060", pelo: "#c9a050" }} expr="enojado" casco="no" bD={120} cD={30} manoD={<g transform="rotate(90)"><rect x={-8} y={-10} width={16} height={180} rx={6} fill="#c9ccd6" /></g>} />
        <Chip t={t} t0={745.29} text="GERMAN WARRIORS" color="#3a5a2a" x={160} y={140} size={58} />
        <Chip t={t} t0={746.47} text="LED BY ARMINIUS" color={C.violeta} x={160} y={260} size={56} />
        <Chip t={t} t0={747.55} text="TRAINED BY ROME ITSELF" color={C.rojo} x={1080} y={260} size={52} />
      </> : <>
        {Array.from({ length: 8 }, (_, i) => <Soldadito key={i} x={560 + (i % 4) * 260} y={700 + Math.floor(i / 4) * 200} s={1.2} t={t} seed={260 + i} cae={i % 3 === 0 ? 750.0 + i * 0.1 : undefined} />)}
        {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, k = prog(t, 749.0, 750.4); return <Soldadito key={i} x={960 + Math.cos(a) * (1100 - k * 420)} y={780 + Math.sin(a) * (700 - k * 300)} s={1.1} t={t} seed={270 + i} enemigo avanza={1} />; })}
        <Grande t={t} t0={749.17} text="FROM EVERY SIDE" y={160} size={110} color="#fff" borde={C.rojo} />
        <Cuenta t={t} t0={750.79} t1={751.3} de={1} a={3} x={960} y={330} size={120} color={C.oro} suf=" DAYS" />
      </>}
    </Escena>

    {/* 182 · sin lugar para formar, ni para rotar, ni campamento al que retirarse */}
    <Escena t={t} t0={751.87} t1={756.77} zoom={0.03} entra="sube" banda={C.rojo} golpes={[753.07, 754.23, 755.93]}>
      <AbsoluteFill style={{ background: "#12061a" }} />
      {([[752.11, "FORM A LINE", 360], [753.67, "ROTATE", 960], [754.93, "A CAMP TO RETREAT TO", 1560]] as const).map(([t0, txt, x], i) => t > t0 && (
        <div key={txt} style={{ position: "absolute", left: x - 270, top: 260, width: 540, height: 560, borderRadius: 30, background: "#2d1b69", border: "10px solid #fff", transform: `scale(${ent(t, t0)})` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 58, color: C.rojo }}>NO ROOM TO</div>
          <div style={{ position: "absolute", left: 20, right: 20, top: 360, textAlign: "center", fontFamily, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: "#fff" }}>{txt}</div>
          <svg style={{ position: "absolute", left: 170, top: 130 }} width={200} height={200} viewBox="-100 -100 200 200">
            {i === 0 && [-60, -20, 20, 60].map((cx) => <rect key={cx} x={cx - 14} y={-40} width={28} height={80} rx={8} fill={C.rojo} />)}
            {i === 1 && <path d="M 60 -40 A 70 70 0 1 0 70 20" stroke="#fff" strokeWidth={16} fill="none" />}
            {i === 2 && <path d="M -80 60 L 0 -60 L 80 60 Z" fill="#c9a46a" />}
          </svg>
          <Tachado t={t} t0={t0 + 0.3} x={270} y={230} w={300} h={260} />
        </div>
      ))}
    </Escena>

    {/* 183 · tres legiones enteras: la XVII, XVIII y XIX desaparecieron */}
    <Escena t={t} t0={756.77} t1={762.05} zoom={0.04} entra="corte" golpes={[757.43, 758.51, 759.39, 760.05, 760.67]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a2620, #0a120e)" }} />
      <Particulas t={t} tipo="polvo" n={30} seed={128} />
      <Estandarte t={t} t0={758.51} x={560} y={600} n="XVII" fade={760.67} />
      <Estandarte t={t} t0={759.39} x={960} y={600} n="XVIII" fade={760.8} />
      <Estandarte t={t} t0={760.05} x={1360} y={600} n="XIX" fade={760.95} />
      <Grande t={t} t0={756.95} text="3 ENTIRE LEGIONS" y={140} size={110} color="#fff" borde="#1d3a24" />
      <Grande t={t} t0={760.67} text="DISAPPEARED" y={930} size={120} color="#8a9ad8" borde="#12061a" />
    </Escena>

    {/* 184 · entre 15.000 y 20.000 hombres; Varo se quitó la vida */}
    <Escena t={t} t0={762.05} t1={766.63} zoom={0.04} entra="barrido" golpes={[762.73, 763.45, 765.37]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3a2a4a, #0a0818 75%)" }} />
      <Cuenta t={t} t0={762.73} t1={763.4} de={0} a={15000} x={600} y={420} size={150} color="#fff" />
      <Grande t={t} t0={763.37} text="–" y={420} size={150} color="#fff" />
      <Cuenta t={t} t0={763.45} t1={764.1} de={15000} a={20000} x={1320} y={420} size={150} color={C.rojo} />
      <Chip t={t} t0={764.15} text="MEN" color={C.violeta} x={960} y={600} centro size={64} />
      <Persona x={960} y={1260} h={560} t={t} seed={71} ropa={{ tunica: "#7a1fa3", tunica2: "#4a0f6a", cinto: "#3b230f", piel: "#d99872", piel2: "#b06f4e", pelo: "#8a8a8a" }} viejo casco="centurion" expr="triste" opacity={1 - prog(t, 765.4, 766.5)} aparece={764.9} />
      <Chip t={t} t0={765.09} text="VARUS KILLED HIMSELF" color="#2a1530" x={1240} y={860} size={48} />
    </Escena>

    {/* 185 · Roma quedó tan conmovida que esos tres números nunca se volvieron a usar */}
    <Escena t={t} t0={766.63} t1={770.85} entra="corte" golpes={[767.31, 768.73, 769.31]}>
      <AbsoluteFill style={{ background: "#e8d8b8" }} />
      {(["XVII", "XVIII", "XIX"] as const).map((n, i) => (
        <div key={n} style={{ position: "absolute", left: 210 + i * 520, top: 300, width: 460, height: 300, transform: `scale(${ent(t, 766.8 + i * 0.15)})` }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 200, color: "#5a4a3a", textAlign: "center" }}>{n}</div>
          <Tachado t={t} t0={769.31 + i * 0.12} x={230} y={130} w={420} h={220} />
        </div>
      ))}
      <Chip t={t} t0={767.31} text="ROME WAS SO SHAKEN" color={C.violeta} x={220} y={140} size={56} />
      <Grande t={t} t0={769.31} text="NEVER USED AGAIN" y={820} size={130} color={C.rojo} borde="#fff" />
    </Escena>

    {/* 186 · seis años después un ejército romano volvió al bosque; Tácito describe lo que encontraron */}
    <Escena t={t} t0={770.85} t1={776.49} zoom={0.05} entra="iris" ix={960} iy={700} golpes={[771.29, 773.19, 775.53]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #3a4a3a, #12201a)" }} />
      <Particulas t={t} tipo="luciernagas" n={30} seed={129} />
      {Array.from({ length: 8 }, (_, i) => <Arbol key={i} x={60 + i * 260} y={760} s={1.0 + (i % 2) * 0.2} color="#14281a" alto={1000} />)}
      {Array.from({ length: 6 }, (_, i) => <Soldadito key={i} x={interpolate(t, [771, 776.5], [-300, 700]) + i * 140} y={960} s={1.3} t={t} seed={280 + i} avanza={0.6} />)}
      <Cuenta t={t} t0={771.05} t1={771.5} de={0} a={6} x={1380} y={430} size={110} color="#fff" suf=" YEARS LATER" />
      <Chip t={t} t0={772.57} text="A ROMAN ARMY RETURNED" color={C.violeta} x={160} y={140} size={54} />
      <Chip t={t} t0={774.17} text="TACITUS DESCRIBES..." color={C.ambar} tinta={C.noche} x={160} y={260} size={54} />
    </Escena>

    {/* 187-188 · huesos al aire, blancos; armas rotas, patas de caballo y cráneos clavados en los troncos */}
    <Escena t={t} t0={776.49} t1={786.91} zoom={0.04} entra="corte" golpes={[776.49, 778.01, 781.55, 782.89, 783.99, 784.63]}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2a3a2a, #0a120e)" }} />
      <Particulas t={t} tipo="polvo" n={30} seed={130} />
      {Array.from({ length: 6 }, (_, i) => <Arbol key={i} x={160 + i * 320} y={720} s={1.1} color="#14281a" alto={1000} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, bottom: 0, background: "#1d2a1a" }} />
      {Array.from({ length: 14 }, (_, i) => t > 776.6 + i * 0.1 && <div key={i} style={{ position: "absolute", left: 100 + ((i * 263) % 1720), top: 900 + (i % 3) * 50, width: 110, height: 22, borderRadius: 11, background: "#f2efe6", transform: `rotate(${(i * 47) % 60 - 30}deg) scale(${ent(t, 776.6 + i * 0.1)})`, boxShadow: "-12px 0 0 -2px #f2efe6, 12px 0 0 -2px #f2efe6" }} />)}
      {t > 781.3 && [0, 1, 2].map((i) => <Gladius key={i} x={400 + i * 520} y={930} s={0.6} rot={70 + i * 50} t={t} t0={781.4 + i * 0.12} />)}
      {t > 784.4 && [0, 1, 2, 3, 4, 5].map((i) => <Craneo key={i} x={160 + i * 320} y={520 - (i % 2) * 60} s={0.5} t={t} t0={784.63 + i * 0.12} />)}
      <Chip t={t} t0={776.49} text="BONES IN THE OPEN" color={C.violeta} x={160} y={140} size={56} />
      <Chip t={t} t0={778.01} text="WHITE" color="#e8e8e8" tinta={C.noche} x={160} y={260} size={56} />
      <Chip t={t} t0={781.25} text="BROKEN WEAPONS" color={C.rojo} x={1200} y={140} size={54} t1={784.4} />
      <Chip t={t} t0={784.63} text="NAILED TO THE TREES" color={C.rojo} x={1160} y={140} size={54} />
    </Escena>

    {/* 189 · eso era una batalla: no gloria. Un bosque que guardó tus huesos seis años */}
    <Escena t={t} t0={786.91} t1={792.73} zoom={0.05} entra="zoom" golpes={[788.15, 788.95, 791.79]}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2a3a2a, #05080a 75%)" }} />
      <Grande t={t} t0={787.49} text="THAT IS A BATTLE" y={260} size={120} color="#fff" />
      <Grande t={t} t0={788.47} text="NOT GLORY." y={440} size={160} color={C.rojo} borde="#fff" />
      {Array.from({ length: 5 }, (_, i) => <Arbol key={i} x={260 + i * 350} y={980} s={0.7} color="#14281a" alto={600} t={t} t0={789.9 + i * 0.1} />)}
      <Chip t={t} t0={790.59} text="A FOREST THAT KEPT YOUR BONES" color={C.violeta} x={960} y={660} centro size={52} />
      <Cuenta t={t} t0={791.51} t1={791.9} de={0} a={6} x={960} y={790} size={110} color="#e8e8e8" suf=" YEARS" />
    </Escena>
  </>
);
