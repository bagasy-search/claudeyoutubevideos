// abyss02 · MINUTO 1 (0–69 s): UN mundo continuo, UNA cámara que cae con la esfera. Todo depende del segundo GLOBAL t
// (no del plano), así cada vez que el montaje vuelve a lo ilustrado el descenso sigue exactamente donde iba.
// Las marcas (200 m gris, 500 m negro, 1.000 m último sol, 6.000 m hadal, 8.000 m pez fantasma, 8.200 m la línea, 10.800 m fondo)
// pasan frente a la esfera en el segundo en que la voz las nombra (frases.json).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { FONT } from "../abysskit/kit";
import { Fish, Ghost, O, SV, mix, rnd, waterAt } from "../abysskit/ocean";

// interpolación por tramos (clamp en los extremos)
const pw = (x: number, X: number[], Y: number[]) => {
  if (x <= X[0]) return Y[0];
  for (let i = 1; i < X.length; i++) if (x <= X[i]) return Y[i - 1] + ((Y[i] - Y[i - 1]) * (x - X[i - 1])) / (X[i] - X[i - 1]);
  return Y[Y.length - 1];
};
const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.001, b - a)));
const sm = (t: number, a: number, b: number) => { const k = k01(t, a, b); return k * k * (3 - 2 * k); };

// profundidad en función del segundo de la voz
const DT = [0, 9.4, 13, 17.5, 21.5, 24.5, 30, 34.2, 38, 43.4, 50.6, 53.2, 64, 67.3, 69];
const DD = [8, 30, 60, 200, 500, 1000, 1500, 5600, 6200, 8000, 8120, 8200, 8700, 10000, 10800];
export const depthAt = (t: number) => pw(t, DT, DD);
// mapa profundidad → píxeles del mundo (los tramos narrativos se estiran para que cada marca tenga su tiempo en pantalla)
const PD = [0, 200, 500, 1000, 1500, 5600, 6200, 8000, 8200, 8700, 10000, 10800];
const PP = [0, 1100, 1900, 2700, 3200, 3900, 4600, 5600, 6400, 6900, 7500, 8300];
const px = (dep: number) => pw(dep, PD, PP);
const CAM = 540; // la esfera vive en esta altura de pantalla

// marca de profundidad: línea de lado a lado + rótulo a la derecha (la izquierda es del renglón de texto)
const Mark: React.FC<{ y: number; label: string; sub?: string; color?: string; op?: number; big?: boolean }> = ({ y, label, sub, color = O.ink, op = 1, big }) => (
  y < -200 || y > 1300 ? null : <>
    <SV><path d={`M0,${y} L1920,${y}`} stroke={color} strokeWidth={big ? 5 : 3} strokeDasharray={big ? undefined : "22 16"} opacity={0.6 * op} /></SV>
    <div style={{ position: "absolute", right: 230, top: y + 14, textAlign: "right", fontFamily: FONT, fontWeight: 900, fontSize: big ? 70 : 54, lineHeight: 1.05, color, opacity: op * (1 - k01(y, 640, 760)) * k01(y, 30, 110), letterSpacing: 2, textShadow: "0 4px 20px rgba(0,0,0,.85)", whiteSpace: "nowrap" }}>
      {label}{sub && <div style={{ fontWeight: 700, fontSize: big ? 40 : 34, color: O.ink, opacity: 0.9 }}>{sub}</div>}
    </div>
  </>
);

// la esfera: por fuera acero con pernos; en corte, vos adentro con las rodillas contra la pared
const Ball: React.FC<{ r: number; cy: number; cut: number; lit: number; f: number; shake: number }> = ({ r, cy, cut, lit, f, shake }) => {
  const j = shake * Math.sin(f * 2.3) * 2.4;
  return <svg width={2 * r} height={2 * r} viewBox="-100 -100 200 200" style={{ position: "absolute", left: 960 - r + j, top: cy - r, overflow: "visible" }}>
    <defs>
      <radialGradient id="m1s" cx="34%" cy="28%"><stop offset="0%" stopColor="#dfe6ec" /><stop offset="50%" stopColor="#8d9aa6" /><stop offset="100%" stopColor="#2b333b" /></radialGradient>
      <radialGradient id="m1in" cx="55%" cy="60%"><stop offset="0%" stopColor="#3a2a1c" /><stop offset="100%" stopColor="#0b0d10" /></radialGradient>
    </defs>
    <circle r={100} fill="url(#m1s)" />
    {Array.from({ length: 16 }).map((_, i) => { const a = (i / 16) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 93} cy={Math.sin(a) * 93} r={2.3} fill="#e6ecf0" opacity={0.75} />; })}
    <path d="M-100,0 A100,100 0 0,0 100,0" fill="none" stroke="#1d2329" strokeWidth={2} opacity={0.6} />
    {/* escotilla */}
    <rect x={-30} y={-108} width={60} height={16} rx={5} fill="#4b5662" />
    {[-22, -11, 0, 11, 22].map((b) => <circle key={b} cx={b} cy={-100} r={2.4} fill="#dfe6ec" />)}
    {/* corte: la cámara ve adentro */}
    <g opacity={cut}>
      <circle r={86} fill="url(#m1in)" />
      <circle r={86} fill="none" stroke="#000" strokeWidth={4} opacity={0.6} />
      {/* luz roja de cabina */}
      <circle cx={-48} cy={-56} r={7} fill="#ff3b30" opacity={0.55 + 0.45 * Math.sin(f / 5)} />
      <circle cx={-48} cy={-56} r={26} fill="#ff3b30" opacity={0.12} />
      {/* vos: encogido, abrazando las rodillas, la espalda contra el acero */}
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* sombra contra el acero */}
        <ellipse cx={-6} cy={58} rx={64} ry={10} fill="#000" opacity={0.45} />
        {/* torso inclinado, espalda contra la pared */}
        <path d="M-38,46 L-46,-14" stroke="#b9561c" strokeWidth={30} />
        <path d="M-38,46 L-46,-14" stroke="#e8742a" strokeWidth={22} />
        {/* muslo hasta el pecho y pierna doblada: la rodilla toca la pared */}
        <path d="M-34,44 L34,-6" stroke="#2b3550" strokeWidth={22} />
        <path d="M34,-6 L44,56" stroke="#2b3550" strokeWidth={18} />
        <path d="M44,56 L62,58" stroke="#111" strokeWidth={12} />
        {/* brazos que abrazan las rodillas */}
        <path d="M-44,-10 Q-6,4 30,-2" stroke="#e8742a" strokeWidth={12} />
        <circle cx={30} cy={-2} r={7} fill="#e9b48c" stroke="none" />
        {/* cabeza gacha */}
        <circle cx={-36} cy={-36} r={17} fill="#e9b48c" stroke="none" />
        <path d="M-52,-42 Q-38,-60 -20,-44" stroke="#3a2618" strokeWidth={9} />
      </g>
      {/* la rodilla contra la pared: el espacio no da para más */}
      <path d="M50,-26 Q70,-10 66,10" stroke="#ff8a3d" strokeWidth={3} fill="none" opacity={0.9} />
    </g>
    {/* ventanita: de afuera se ve tu luz */}
    <circle cx={68} cy={26} r={15} fill={mix("#0a2a3f", "#fff2c8", lit * 0.8)} stroke="#c9d2da" strokeWidth={4} opacity={1 - cut * 0.85} />
  </svg>;
};

// medusa que brilla y pasa frente a la ventanita (frase 10) y se apaga (frase 11)
const Glow: React.FC<{ x: number; y: number; on: number; f: number }> = ({ x, y, on, f }) => (
  <svg width={260} height={320} viewBox="-130 -110 260 320" style={{ position: "absolute", left: x - 130, top: y - 110, overflow: "visible", opacity: on }}>
    <defs><radialGradient id="gl1"><stop offset="0%" stopColor="#bdf7ff" stopOpacity={0.95} /><stop offset="60%" stopColor="#3fd0ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#3fd0ff" stopOpacity={0} /></radialGradient></defs>
    <circle r={130} fill="url(#gl1)" opacity={0.7} />
    <path d={`M-60,0 Q0,${-80 - 6 * Math.sin(f / 6)} 60,0 Q0,-14 -60,0 Z`} fill="#c8fbff" opacity={0.9} />
    {[-40, -15, 10, 35].map((x0, i) => <path key={i} d={`M${x0},0 q${10 * Math.sin(f / 8 + i)},50 0,100 t0,90`} stroke="#9eefff" strokeWidth={3} fill="none" opacity={0.75} />)}
  </svg>
);

// pez que baja de la línea y su propia química lo aplasta desde adentro (frase 20)
const Crushed: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <svg width={360} height={180} viewBox="-130 -70 260 140" style={{ position: "absolute", left: x - 180, top: y - 90, overflow: "visible" }}>
    <g transform={`scale(${1 + 0.15 * k},${1 - 0.72 * k})`}>
      <path d="M-110,0 Q-30,-46 60,-8 L120,-34 L106,0 L120,34 L60,8 Q-30,46 -110,0 Z" fill={mix("#c4d6e0", "#8a2a22", k)} />
      <circle cx={-70} cy={-8} r={7} fill="#111" />
    </g>
    {k > 0.3 && [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-70 + i * 28},0 l${8 - rnd(i, 3) * 16},${-30 * k} m0,0 l${-10 + rnd(i, 4) * 20},${-16 * k}`} stroke={O.red} strokeWidth={3} opacity={k} />)}
  </svg>
);

// paredes de la fosa: aparecen pasando los 6.000 m y se cierran en V hacia el fondo
const Walls: React.FC<{ Y: (d: number) => number; P: number }> = ({ Y }) => {
  const N = 26, deps = Array.from({ length: N + 1 }).map((_, i) => 5600 + (i / N) * 5400);
  const w = (dep: number) => 40 + 560 * k01(dep, 5800, 10800) + 40 * Math.sin(dep / 260);
  const L = deps.map((dep) => [w(dep), Y(dep)]), R = deps.map((dep) => [1920 - w(dep) - 30 * Math.cos(dep / 310), Y(dep)]);
  const l = `M-40,${Y(5600)} ` + L.map(([x, y]) => `L${x},${y}`).join(" ") + ` L-40,${Y(11000)} Z`;
  const r = `M1960,${Y(5600)} ` + R.map(([x, y]) => `L${x},${y}`).join(" ") + ` L1960,${Y(11000)} Z`;
  return <SV>
    <defs><linearGradient id="wl" x1="0" x2="1"><stop offset="0%" stopColor="#0b0907" /><stop offset="100%" stopColor="#2c241b" /></linearGradient>
      <linearGradient id="wr" x1="1" x2="0"><stop offset="0%" stopColor="#0b0907" /><stop offset="100%" stopColor="#2c241b" /></linearGradient></defs>
    <path d={l} fill="url(#wl)" /><path d={r} fill="url(#wr)" />
    {/* rayado de grabado sobre la roca */}
    {deps.slice(1).map((dep, i) => { const y = Y(dep); if (y < -60 || y > 1140) return null; const a = w(dep);
      return <g key={i} stroke="#6d5a44" strokeWidth={1.5} opacity={0.5}><path d={`M${a - 30},${y} l-${60 + rnd(i, 2) * 80},${18}`} /><path d={`M${1920 - a + 20},${y + 10} l${60 + rnd(i, 3) * 80},${18}`} /></g>; })}
  </SV>;
};

export const Descent: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame(), t = t0 + f / FPS, D = depthAt(t), P = px(D), Y = (dep: number) => CAM + px(dep) - P;
  const v = (px(depthAt(t + 0.2)) - P) * 5; // px/s de la caída → largo de las estelas
  const col = (dep: number) => waterAt(Math.min(1, Math.pow(Math.max(0, dep) / 1100, 0.55)));
  const dTop = pw(P - CAM, PP, PD), dBot = pw(P + 1080 - CAM, PP, PD);
  // cámara: arranca pegada (la esfera en corte llena el cuadro) y se aleja mientras empezás a caer
  const pull = sm(t, 9.3, 16.8), r = 340 - 200 * pull, cy = CAM + 80 * (1 - pull), cut = 1 - sm(t, 14.2, 16.4), lit = sm(t, 29.6, 30.4);
  const sun = 1 - sm(D, 600, 1000), surfY = Y(0);
  const jelly = t > 30 && t < 34.3 ? sm(t, 30.2, 30.9) * (1 - sm(t, 33.1, 33.5)) : 0;
  const hadal = sm(t, 38.4, 39.2) * (1 - sm(t, 42.6, 43.3));
  const ghost = sm(t, 43.4, 44.4) * (1 - sm(t, 50, 51.2));
  const lineY = Y(8200), crush = sm(t, 59.6, 62.6), floorY = Y(10800);
  const bio = k01(D, 900, 1400) * (1 - k01(D, 5400, 6200));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${col(dTop)} 0%, ${col(dBot)} 100%)`, overflow: "hidden" }}>
      {/* superficie y casco del barco madre arriba, al arrancar */}
      {surfY > -40 && <>
        <AbsoluteFill style={{ height: Math.max(0, surfY), background: "linear-gradient(180deg,#9cb7c6,#d7e4ea)" }} />
        <SV><path d={`M0,${surfY} ` + Array.from({ length: 25 }).map((_, i) => `Q${i * 80 + 40},${surfY - 10 + 6 * Math.sin(t * 2 + i)} ${i * 80 + 80},${surfY}`).join(" ") + ` L1920,${surfY + 30} L0,${surfY + 30} Z`} fill="#3b8fae" opacity={0.8} />
          <path d={`M520,${surfY - 70} L1400,${surfY - 70} L1340,${surfY + 60} L600,${surfY + 60} Z`} fill="#141c24" /><rect x={1120} y={surfY - 150} width={200} height={80} fill="#141c24" />
          <path d={`M960,${surfY + 60} L960,${cy - r}`} stroke="#c8a46a" strokeWidth={4} opacity={1 - sm(t, 10, 12)} /></SV>
      </>}
      {/* rayos del último sol: se cortan a los 1.000 m y no vuelven */}
      {sun > 0 && <SV>{[0, 1, 2, 3, 4, 5].map((i) => { const x = 120 + i * 330 + Math.sin(t * 0.6 + i) * 40; return <path key={i} d={`M${x},${Math.max(-20, surfY)} L${x + 110},${Math.max(-20, surfY)} L${x + 380},${Y(1000)} L${x + 170},${Y(1000)} Z`} fill="#f4fbff" opacity={sun * (0.08 + 0.05 * Math.sin(t * 1.4 + i * 2))} />; })}</SV>}
      {/* bioluminiscencia de la zona media */}
      {bio > 0 && <SV>{Array.from({ length: 70 }).map((_, i) => { const x = rnd(i, 11) * 1920, y = ((rnd(i, 12) * 1400 - P * 0.9) % 1400 + 1400) % 1400 - 160, b = 0.5 + 0.5 * Math.sin(t * (1 + rnd(i, 13) * 3) + i);
        return <circle key={i} cx={x} cy={y} r={2 + rnd(i, 14) * 3} fill="#5ff0ff" opacity={bio * b * 0.8} style={{ filter: "drop-shadow(0 0 6px #5ff0ff)" }} />; })}</SV>}
      {/* estelas de nieve marina: suben porque nosotros caemos */}
      <SV>{Array.from({ length: 110 }).map((_, i) => { const x = rnd(i, 1) * 1920, y = ((rnd(i, 2) * 1300 - P * (0.6 + rnd(i, 3) * 0.6)) % 1300 + 1300) % 1300 - 110, L = Math.min(170, 6 + v * 0.06 * (0.6 + rnd(i, 3)));
        return <path key={i} d={`M${x},${y} l0,${L}`} stroke={O.snow} strokeWidth={1.5 + rnd(i, 4) * 2.5} strokeLinecap="round" opacity={0.16 + rnd(i, 5) * 0.4} />; })}</SV>
      <Walls Y={Y} P={P} />
      {/* marcas del mundo */}
      <Mark y={Y(200)} label="200 m" sub="the blue turns gray" op={k01(t, 16.5, 17.5)} />
      <Mark y={Y(500)} label="500 m" sub="black" op={k01(t, 20.5, 21.5)} />
      <Mark y={Y(1000)} label="1,000 m" sub="the last sunlight on Earth" color={O.gold} op={k01(t, 23.4, 24.4)} big />
      <Mark y={Y(6000)} label="6,000 m" sub="the hadal zone" color={O.orange} op={k01(t, 34.4, 35.4)} big />
      <Mark y={Y(8000)} label="8,000 m" sub="a fish" op={k01(t, 42.6, 43.6)} />
      {/* HADES grabado en la roca, debajo de la esfera */}
      {hadal > 0 && <div style={{ position: "absolute", left: 0, top: CAM + 200, right: 480, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 190, letterSpacing: 24, color: O.red, opacity: hadal * (0.8 + 0.2 * Math.sin(t * 9)), textShadow: "0 0 60px rgba(255,59,48,.55)" }}>HADES</div>}
      {/* la línea de los peces: arriba un cardumen que no baja, abajo nada */}
      {lineY > -300 && lineY < 1300 && <>
        <AbsoluteFill style={{ top: lineY, background: "linear-gradient(180deg, rgba(255,59,48,.20), transparent 260px)", opacity: k01(t, 50.6, 52) }} />
        <SV><path d={`M0,${lineY} L1920,${lineY}`} stroke={O.red} strokeWidth={8} opacity={k01(t, 50.6, 52)} style={{ filter: "drop-shadow(0 0 14px #ff3b30)" }} /></SV>
        <div style={{ position: "absolute", right: 230, top: lineY + 16, textAlign: "right", fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: O.red, opacity: k01(t, 50.8, 51.8) * (1 - k01(lineY, 640, 760)), textShadow: "0 4px 24px rgba(0,0,0,.85)" }}>8,200 m<div style={{ fontSize: 40, color: O.ink }}>no fish below this line</div></div>
        {Array.from({ length: 26 }).map((_, i) => { const fx = ((rnd(i, 6) * 2300 + t * 60 * (0.6 + rnd(i, 7))) % 2300) - 190, fy = lineY - 30 - rnd(i, 8) * 280;
          return <Fish key={i} x={fx} y={fy - Math.abs(Math.sin(t * 2 + i)) * 10} s={0.6 + rnd(i, 9) * 0.7} flip={rnd(i, 10) < 0.5} color="#a9bfcc" op={0.6 * k01(t, 51, 52.5)} />; })}
        {t > 58.8 && <Crushed x={520} y={Math.min(lineY + 140 + 90 * crush, CAM + 60)} k={crush} />}
        {t > 60.5 && <div style={{ position: "absolute", left: 230, width: 560, top: Math.min(lineY + 140 + 90 * crush, CAM + 60) + 100, fontFamily: FONT, fontWeight: 800, fontSize: 50, color: O.red, opacity: sm(t, 60.6, 61.4), textShadow: "0 4px 20px rgba(0,0,0,.9)" }}>crushed by its own chemistry</div>}
      </>}
      {/* el pez fantasma en tus luces */}
      {ghost > 0 && <Ghost x={1260 + Math.sin(t) * 30} y={CAM + 230} s={1.7} op={0.9 * ghost} />}
      {/* el fondo que sube de la oscuridad */}
      {floorY < 1200 && <SV><path d={`M-20,${floorY} Q480,${floorY - 40} 960,${floorY + 10} T1940,${floorY - 20} L1940,1200 L-20,1200 Z`} fill={O.mud} /></SV>}
      {/* luces del sumergible: cono suave propio con la nieve iluminada adentro */}
      {lit > 0 && <SV>
        <defs><radialGradient id="cone" cx="50%" cy="0%" r="100%"><stop offset="0%" stopColor="#fff2c8" stopOpacity={0.5} /><stop offset="70%" stopColor="#fff2c8" stopOpacity={0.06} /><stop offset="100%" stopColor="#fff2c8" stopOpacity={0} /></radialGradient></defs>
        <path d={`M${960 - r * 0.45},${CAM + r * 0.8} L${960 + r * 0.45},${CAM + r * 0.8} L1460,1100 L460,1100 Z`} fill="url(#cone)" opacity={lit} />
        {Array.from({ length: 40 }).map((_, i) => { const yy = CAM + r + ((rnd(i, 21) * 600 - P * 0.8) % 600 + 600) % 600, half = 0.45 * r + (yy - CAM - r) * 0.8, xx = 960 + (rnd(i, 22) - 0.5) * 2 * half;
          return <circle key={i} cx={xx} cy={yy} r={1.5 + rnd(i, 23) * 2} fill="#fff6dc" opacity={lit * 0.7} />; })}
      </SV>}
      <Ball r={r} cy={cy} cut={cut} lit={lit} f={f} shake={t > 9.4 ? 0.4 : 0} />
      <Glow x={1240} y={CAM - 60 + (1 - k01(t, 30.2, 33.5)) * 420 - 240} on={jelly} f={f} />
      {/* HUD abajo a la derecha: la profundidad grande + la regla de lo que falta */}
      <div style={{ position: "absolute", right: 220, bottom: 110, textAlign: "right", fontFamily: FONT, fontWeight: 900, color: O.ink, opacity: k01(t, 9.6, 10.6), textShadow: "0 4px 24px rgba(0,0,0,.85)" }}>
        <div style={{ fontSize: 120, lineHeight: 1 }}>{Math.round(D).toLocaleString("en-US")}<span style={{ fontSize: 56 }}> m</span></div>
        <div style={{ fontSize: 34, color: t < 17.6 ? O.orange : O.dim, marginTop: 6 }}>{t < 17.6 ? "3 m every second · straight down" : "and still falling"}</div>
      </div>
    </AbsoluteFill>
  );
};
