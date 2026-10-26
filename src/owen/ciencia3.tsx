// Láminas de ciencia de ob03 (sin dormir): la señal apagada, sentirse vs estar despierto, el hipocampo que archiva,
// el sistema glinfático, Randy Gardner, la factura de Rosa. Sobre la Pizarra de ciencia.tsx; tiempos = cuadros locales.
import React from "react";
import { interpolate } from "remotion";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { useF } from "../anikit/camara";
import { VERDE, TEEN, OWEN_CASA } from "./elenco";
import { Actor } from "../anikit/actor";
import { Pizarra } from "./ciencia";

const AMBAR = "#ffc24a", ROJO = "#ff5a4a", TINTA = "#f4efe4", AZUL = "#6fa8ff", GRIS = "#2a3a62", ROSA_C = "#f2a7c0";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
const T: React.FC<{ x: number; y: number; s?: number; c?: string; a?: "middle" | "start" | "end"; w?: number; o?: number; f?: string; children: React.ReactNode }> = ({ x, y, s = 44, c = TINTA, a = "middle", w = 600, o = 1, f = F_HUD, children }) => (
  <text x={x} y={y} fontFamily={f} fontWeight={w} fontSize={s} fill={c} textAnchor={a} opacity={o}>{children}</text>
);

// 1 · la adenosina se sigue juntando, pero la señal no llega: tubo que se llena + «sensor» apagado
export const NoLaSiente: React.FC<{ dCorte?: number }> = ({ dCorte = 60 }) => {
  const f = useF();
  const lleno = interpolate(f, [0, 160], [0.25, 0.9], { extrapolateRight: "clamp" });
  const corte = ease(f, dCorte, dCorte + 14);
  // 26-oct v8 (ojo: rótulos chicos): el pulso viaja del tubo al cerebro; tras el corte viaja hasta la X, choca y rebota
  const ciclo = 40, p = (f % ciclo) / ciclo;
  const xPulso = corte < 1 ? 700 + p * 540 : (p < 0.6 ? 700 + (p / 0.6) * 180 : 880 - ((p - 0.6) / 0.4) * 180);
  const choque = corte >= 1 && p >= 0.6 ? Math.exp(-((p - 0.6) * ciclo) / 5) : 0;
  const latido = 1 + 0.04 * Math.sin(f / 10);
  return (
    <Pizarra titulo="OWEN'S BRAIN · THIS WEEK" profe={false}>
      <rect x={430} y={300} width={180} height={540} rx={36} fill={GRIS} />
      <rect x={442} y={312 + 516 * (1 - lleno)} width={156} height={516 * lleno} rx={28} fill={AMBAR} />
      <T x={520} y={910} s={56} w={700}>ADENOSINE</T>
      <T x={520} y={975} s={46} c={AMBAR}>still piling up</T>
      {/* el cable de la señal, con un pulso que se corta */}
      <path d="M640,570 H1250" stroke={GRIS} strokeWidth={22} strokeLinecap="round" />
      <circle cx={xPulso} cy={570} r={24} fill={AMBAR} />
      {corte > 0 && <g transform={`translate(960,570) rotate(${choque * 8 * Math.sin(f / 2.5)}) scale(${corte * (1 + choque * 0.12)})`}><circle r={84} fill="#1a1f33" stroke={ROJO} strokeWidth={14} /><path d="M-42,-42 L42,42 M42,-42 L-42,42" stroke={ROJO} strokeWidth={16} strokeLinecap="round" /></g>}
      <T x={1440} y={330} s={60} w={700}>"SLOW DOWN"</T>
      <g transform={`translate(1440,570) scale(${1.45 * latido})`}>
        <path d="M-120,0 C-125,-80 -60,-110 0,-85 C60,-110 125,-80 120,0 C125,60 55,80 0,70 C-55,80 -125,60 -120,0 Z" fill="#3a2a44" stroke={ROSA_C} strokeWidth={8} />
      </g>
      <T x={1440} y={800} s={56} c={ROJO} w={700} o={corte}>signal: OFF</T>
    </Pizarra>
  );
};

// 2 · sentirse despierto vs estar despierto: dos curvas; la zona de 17-19 h = alcohol en sangre 0,05
export const SentirVsSer: React.FC<{ dCurvas?: number; d05?: number }> = ({ dCurvas = 120, d05 = 390 }) => {
  const f = useF();
  const x0 = 250, x1 = 1210, y0 = 820, H = 460;
  const X = (h: number) => x0 + (h / 24) * (x1 - x0);
  const sent = (h: number) => y0 - H * (0.86 - 0.06 * (h / 24));
  const real = (h: number) => y0 - H * (0.9 - 0.75 * Math.pow(Math.max(0, h - 8) / 16, 1.4));
  const u = ease(f, dCurvas, dCurvas + 150);
  const pts = (fn: (h: number) => number) => Array.from({ length: 49 }).map((_, i) => i / 2).filter((h) => h <= 24 * u).map((h) => `${X(h)},${fn(h)}`).join(" ");
  const z = ease(f, d05, d05 + 14);
  return (
    <Pizarra titulo="FEELING AWAKE ≠ BEING AWAKE" fuente="Van Dongen et al., Sleep, 2003 · Williamson & Feyer, OEM, 2000">
      <path d={`M${x0},${y0} H${x1} M${x0},${y0} V${y0 - H - 40}`} stroke={GRIS} strokeWidth={6} />
      {[0, 6, 12, 18, 24].map((h) => <T key={h} x={X(h)} y={y0 + 50} s={30} c="#9aa6c8">{h}h</T>)}
      <T x={x0 - 20} y={y0 - H - 50} s={28} c="#9aa6c8" a="start">HOURS AWAKE →</T>
      {z > 0 && <g opacity={z}><rect x={X(17)} y={y0 - H - 20} width={X(19) - X(17)} height={H + 20} fill={ROJO} opacity={0.18} /><T x={(X(17) + X(19)) / 2} y={y0 - H - 30} s={40} c={ROJO} w={700}>= 0.05 BAC</T></g>}
      <polyline points={pts(sent)} fill="none" stroke={VERDE} strokeWidth={10} strokeLinecap="round" />
      <polyline points={pts(real)} fill="none" stroke={ROJO} strokeWidth={10} strokeLinecap="round" />
      <T x={x1 + 20} y={sent(24) + 10} s={34} c={VERDE} a="start" o={ease(f, dCurvas + 150, dCurvas + 160)}>how you FEEL</T>
      <T x={x1 + 20} y={real(24) + 10} s={34} c={ROJO} a="start" o={ease(f, dCurvas + 150, dCurvas + 160)}>how you DO</T>
      {/* las puntas de las dos curvas: viajan mientras se dibujan y después laten; la flecha marca la brecha que crece */}
      {[sent, real].map((fn, i) => { const h = 24 * u; const late = 1 + 0.25 * Math.sin(f * 0.25 + i * 2); return <circle key={i} cx={X(h)} cy={fn(h)} r={16 * late} fill={i ? ROJO : VERDE} stroke="#0e1428" strokeWidth={4} />; })}
      {u > 0.55 && (() => { const h = 24 * u; const g = ease(f, dCurvas + 80, dCurvas + 110); return <g opacity={g}><path d={`M${X(h) + 36},${sent(h) + 14} V${real(h) - 14}`} stroke="#ffd27a" strokeWidth={6} markerEnd="" /><path d={`M${X(h) + 22},${real(h) - 34} L${X(h) + 36},${real(h) - 12} L${X(h) + 50},${real(h) - 34}`} fill="none" stroke="#ffd27a" strokeWidth={6} /></g>; })()}
    </Pizarra>
  );
};

// 3 · el hipocampo archiva el día mientras dormís; Owen vivió 3 días y guardó 1
export const Hipocampo: React.FC<{ dArchiva?: number; dTres?: number }> = ({ dArchiva = 150, dTres = 480 }) => {
  const f = useF();
  const a = ease(f, 20, 40);
  const tarjeta = (i: number, d: number, guardada: boolean, label: string) => {
    const t = ease(f, d, d + 34);
    const x = interpolate(t, [0, 1], [860, guardada ? 1470 : 1180]);
    const y = interpolate(t, [0, 1], [560, guardada ? 430 + i * 12 : 900]) - Math.sin(t * Math.PI) * 190;
    const rebote = guardada && t >= 1 ? 1 + Math.exp(-(f - d - 34) / 5) * 0.15 : 1;
    return (
      <g key={label} transform={`translate(${x},${y}) rotate(${guardada ? 0 : 28 * t}) scale(${1.45 * rebote})`}>
        <rect x={-90} y={-55} width={180} height={110} rx={12} fill={TINTA} stroke="#14203a" strokeWidth={4} />
        <T x={0} y={16} s={44} c="#14203a" w={800}>{label}</T>
        {!guardada && t > 0.6 && <path d="M-80,-45 L80,45 M80,-45 L-80,45" stroke={ROJO} strokeWidth={10} />}
      </g>
    );
  };
  // Owen grande a la izquierda: manotea cada tarjeta hacia el archivo
  const beats = [dArchiva, dTres, dTres + 20, dTres + 40];
  const poses = [{ f: 0, v: { hD: 20, cD: 20, hI: 20, cI: 20 } }, ...beats.flatMap((d) => [{ f: d - 8, v: { hD: 150, cD: 60, tronco: -6, cabeza: -6 } }, { f: d + 4, v: { hD: 80, cD: 10, tronco: 8, cabeza: 6 } }, { f: d + 22, v: { hD: 30, cD: 30, tronco: 2 } }])];
  return (
    <Pizarra titulo="SLEEP FILES THE DAY" fuente="Rasch & Born, Physiological Reviews, 2013" profe={false}>
      <Actor look={OWEN_CASA} escala={2.3} seed={47} ruta={[{ f: 0, x: 240, y: 1190 }]} dir={[{ f: 0, v: 1 }]} poses={poses}
        caras={[{ f: 0, v: "duda" }, { f: dTres + 30, v: "miedo" }]} />
      <g transform={`translate(720,560) scale(${a * 1.3})`}>
        <path d="M0,-150 C70,-150 90,-80 50,-40 C100,-10 90,70 30,90 C60,140 20,190 -30,170 C0,140 -10,110 -40,100 C-90,60 -60,-10 -20,-30 C-60,-70 -50,-150 0,-150 Z" fill="#ffd27a" stroke="#c98a2a" strokeWidth={8} />
        <circle cx={10} cy={-110} r={10} fill="#14203a" />
        <T x={0} y={240} s={34}>HIPPOCAMPUS</T>
      </g>
      <rect x={1300} y={260} width={340} height={440} rx={22} fill={GRIS} />
      {[0, 1, 2].map((i) => <rect key={i} x={1322} y={284 + i * 138} width={296} height={118} rx={12} fill="#1d2a4a" />)}
      <T x={1470} y={760} s={46} c="#9aa6c8" w={700}>LONG-TERM</T>
      {f >= dArchiva && tarjeta(0, dArchiva, true, "TODAY")}
      {f >= dTres && <>{tarjeta(1, dTres, true, "MON")}{tarjeta(2, dTres + 20, false, "TUE")}{tarjeta(3, dTres + 40, false, "WED")}</>}
      {f >= dTres + 70 && <T x={1100} y={1000} s={66} c={ROJO} w={800}>3 days lived · 1 saved</T>}
    </Pizarra>
  );
};

// 4 · el sistema glinfático: el espacio entre células crece ~60 % al dormir y el líquido barre la basura (beta-amiloide)
export const Glinfatico: React.FC<{ dCrece?: number; dLava?: number; dNombre?: number; dOwen?: number }> = ({ dCrece = 90, dLava = 230, dNombre = 470, dOwen = 600 }) => {
  const f = useF();
  const g = ease(f, dCrece, dCrece + 40);
  const lava = ease(f, dLava, dLava + 120);
  const owen = ease(f, dOwen, dOwen + 20);
  const sep = 1 + 0.6 * g * (1 - owen);
  const basura = Array.from({ length: 26 }).map((_, i) => ({ x: 380 + ((i * 197) % 1160), y: 360 + ((i * 113) % 470) }));
  const trash = Math.round(owen > 0 ? 100 : 100 - 60 * lava);
  const frente = 200 + lava * 1600; // la oleada barre de izquierda a derecha
  return (
    <Pizarra titulo="THE BRAIN TAKES OUT ITS TRASH" fuente="Xie et al., Science, 2013 · University of Rochester" profe={false}>
      {Array.from({ length: 12 }).map((_, i) => {
        const cx = 960 + ((i % 4) - 1.5) * 240 * sep, cy = 600 + (Math.floor(i / 4) - 1) * 150 * sep;
        return <ellipse key={i} cx={cx} cy={cy} rx={106 + 4 * Math.sin(f / 16 + i)} ry={76 + 3 * Math.sin(f / 19 + i * 2)} fill="#3a2a44" stroke={ROSA_C} strokeWidth={7} />;
      })}
      {lava > 0 && lava < 1 && owen === 0 && <path d={`M${frente - 60},300 C${frente + 30},450 ${frente - 50},700 ${frente + 20},900`} fill="none" stroke={AZUL} strokeWidth={80} opacity={0.5} strokeLinecap="round" />}
      {basura.map((b, i) => {
        const pasada = owen > 0 ? 0 : Math.max(0, Math.min(1, (frente - b.x) / 300));
        const sale = (i % 5) < 3 ? pasada : 0; // ~60 % se va con la oleada
        return <circle key={i} cx={b.x + sale * 260 + 8 * Math.sin(f / 20 + i)} cy={b.y + 8 * Math.cos(f / 23 + i * 1.7)} r={17} fill={AMBAR} opacity={Math.max(0, 1 - sale)} />;
      })}
      <T x={960} y={268} s={50} c={AZUL} w={700} o={g * (1 - owen)}>{`asleep: +60% space · TRASH ${trash}%`}</T>
      <T x={960} y={975} s={44} c={AMBAR} o={ease(f, dLava + 40, dLava + 60) * (1 - ease(f, dNombre - 10, dNombre)) * (1 - owen)}>washes out beta-amyloid (linked to Alzheimer's)</T>
      <T x={960} y={975} s={56} c={TINTA} w={700} o={ease(f, dNombre, dNombre + 15) * (1 - owen)}>the GLYMPHATIC system</T>
      <T x={960} y={975} s={60} c={ROJO} w={800} o={owen}>Owen: 3 days · TRASH 100%</T>
    </Pizarra>
  );
};

// 5 · Randy Gardner, 1964: 11 días, 264 horas
export const Gardner: React.FC<{ dDias?: number; dHoras?: number; dSintomas?: number; dMant?: number }> = ({ dDias = 175, dHoras = 230, dSintomas = 270, dMant = 425 }) => {
  const f = useF();
  const n = Math.round(interpolate(f, [dHoras, dHoras + 20], [0, 264], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sint = ["trouble speaking", "memory failing", "seeing things"];
  return (
    <Pizarra titulo="RANDY GARDNER · 17 · 1964" fuente="Gulevich, Dement & Johnson, Arch Gen Psychiatry, 1966">
      {/* antes de los números: el chico despierto en su silla, el almanaque que pasa hojas */}
      <g opacity={1 - ease(f, dDias - 12, dDias)}>
        <g transform="translate(1240,380)">
          <rect x={-150} y={-20} width={300} height={360} rx={16} fill={TINTA} />
          <rect x={-150} y={-20} width={300} height={70} rx={16} fill={ROJO} />
          <T x={0} y={32} s={40} w={700}>JAN 1964</T>
          <T x={0} y={250} s={180} c="#14203a" w={800}>{Math.min(11, 1 + Math.floor(f / 14))}</T>
          {f % 14 < 7 && <rect x={-150} y={60 - (f % 14) * 30} width={300} height={280} rx={8} fill="#ddd6c6" opacity={1 - (f % 14) / 7} />}
        </g>
      </g>
      {/* 26-oct v7 (ojo 6/10: Randy chico y quieto): Randy grande TODO el plano, cada vez más desarmado: se balancea más, la cabeza cae y se frota los ojos */}
      <Actor look={TEEN} escala={2.5} seed={17} ruta={[{ f: 0, x: 250, y: 1230 }]} dir={[{ f: 0, v: 1 }]}
        poses={Array.from({ length: 40 }).map((_, i) => { const d = Math.min(1, (i * 18) / Math.max(1, dHoras)); return { f: i * 18, v: i % 4 === 3 ? { tronco: 6 + d * 10, hD: 120, cD: 150, cabeza: 10 + d * 14 } : { tronco: (i % 2 ? 1 : -1) * (3 + d * 12), cabeza: (i % 2 ? 1 : -1) * 6 + d * 18, hD: 20 + d * 20, cD: 20, hI: 20 + d * 20, cI: 20 } }; })}
        caras={[{ f: 0, v: "neutral" }, { f: Math.round(dDias * 0.5), v: "cansado" }, { f: dDias, v: "zombi" }, { f: dSintomas, v: "miedo" }, { f: dSintomas + 60, v: "zombi" }]} />
      <g opacity={ease(f, dDias, dDias + 10)}>
        <rect x={360} y={330} width={520} height={380} rx={24} fill={TINTA} />
        <rect x={360} y={330} width={520} height={90} rx={24} fill={ROJO} />
        <T x={620} y={395} s={46} w={700}>DAYS AWAKE</T>
        <T x={620} y={640} s={200} c="#14203a" w={800}>11</T>
      </g>
      <g opacity={ease(f, dHoras, dHoras + 10)}>
        <g transform={`translate(1340,470) scale(${1 + (f >= dHoras + 20 ? Math.exp(-(f - dHoras - 20) / 5) * 0.45 : 0)}) translate(-1340,-470)`}><T x={1340} y={520} s={150} c={AMBAR} w={800}>{n}</T></g>
        <T x={1340} y={590} s={44}>HOURS</T>
      </g>
      {sint.map((s, i) => <T key={s} x={1340} y={700 + i * 60} s={38} c={ROJO} o={ease(f, dSintomas + i * 40, dSintomas + i * 40 + 10)}>× {s}</T>)}
      <T x={960} y={960} s={54} c={VERDE} w={700} o={ease(f, dMant, dMant + 12)} f={F_MANO}>Sleep isn't wasted time. It's maintenance.</T>
    </Pizarra>
  );
};

// 6 · la factura de la cadera de Rosa: $31,412 en negrita; la paga del ensayo no cubre ni un sexto
export const Factura: React.FC<{ dTotal?: number; dSexto?: number }> = ({ dTotal = 150, dSexto = 400 }) => {
  const f = useF();
  const a = ease(f, 0, 18);
  const tot = ease(f, dTotal, dTotal + 12);
  const sx = ease(f, dSexto, dSexto + 20);
  // las manos de Owen sostienen la hoja y tiemblan; cada renglón entra y su número cuenta hacia arriba; la birome encierra el total
  // 26-oct: temblor LENTO (a 0,9 rad/cuadro el ojo lo marcaba como lageos y se veía trabado)
  const tiembla = Math.sin(f * 0.17) * 3 + Math.sin(f * 0.29 + 1) * 1.5;
  const filas: [string, number, string][] = [["Surgery & anesthesia", 48920, ""], ["Hospital stay · 4 nights", 21300, ""], ["Physical therapy", 6410, ""], ["Insurance paid", 45218, "−"]];
  const tFila = (i: number) => 20 + i * Math.max(30, (dTotal - 40) / 4);
  const cuenta = Math.round(31412 * ease(f, dTotal, dTotal + 30));
  const circ = ease(f, dTotal + 34, dTotal + 64);
  const num = (n: number) => "$" + n.toLocaleString("en-US");
  // golpe a cada cifra: cuando el número termina de contar salta y la hoja da un respingo
  const golpe = (d: number) => (f < d ? 0 : Math.exp(-(f - d) / 5));
  const respingo = filas.reduce((acc, _, i) => acc + golpe(tFila(i) + 24), 0) * 10;
  const sacude = f > dTotal + 30 && f < dTotal + 44 ? Math.sin((f - dTotal) * 2.4) * 6 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#1b1612" }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${960 - 300 * sx + sacude},${560 + (1 - a) * 80 + tiembla - respingo}) rotate(${-2 + sx * -2 + tiembla * 0.15})`} opacity={a}>
          <rect x={-380} y={-460} width={760} height={920} fill="#fbf8f0" />
          <circle cx={-300} cy={-385} r={36} fill="#2a6fd6" /><path d="M-300,-405 v40 M-320,-385 h40" stroke="#fff" strokeWidth={10} />
          <T x={-250} y={-372} s={40} c="#1a2a4a" a="start" w={700}>St. Anthony Hospital</T>
          <T x={-330} y={-280} s={30} c="#5a5a5a" a="start">Patient: Rosa · 81 · Hip replacement</T>
          {filas.map(([d, v, sg], i) => { const e = ease(f, tFila(i), tFila(i) + 10); return e > 0 && (
            <g key={d} opacity={e} transform={`translate(${(1 - e) * -30},0)`}><T x={-330} y={-190 + i * 70} s={32} c="#333" a="start">{d}</T><g transform={`translate(330,${-190 + i * 70}) scale(${golpe(tFila(i) + 24) * 0.35 + 1}) translate(-330,${190 - i * 70})`}><T x={330} y={-190 + i * 70} s={32} c={sg ? "#2a7a3a" : "#333"} a="end">{sg + num(Math.round(v * ease(f, tFila(i), tFila(i) + 24)))}</T></g></g>
          ); })}
          <path d="M-330,120 H330" stroke="#999" strokeWidth={3} />
          <T x={-330} y={200} s={38} c="#333" a="start" w={700}>BALANCE DUE</T>
          <g opacity={tot} transform={`translate(300,330) scale(${0.8 + 0.2 * tot})`}><T x={0} y={0} s={96} c="#c23a2e" a="end" w={800}>{num(cuenta)}</T></g>
          {circ > 0 && <ellipse cx={110} cy={300} rx={240} ry={90} fill="none" stroke="#c23a2e" strokeWidth={8} strokeDasharray={1100} strokeDashoffset={1100 * (1 - circ)} transform="rotate(-4 130 300)" />}
          <T x={0} y={420} s={28} c="#777">FINAL NOTICE</T>
          {/* las manos de Owen (trazo de palito, como su cuerpo): brazo grueso que sube de abajo, palma redonda detrás y el pulgar por delante de la hoja */}
          {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 372},360)`}>
            <path d={`M${sd * 60},560 Q${sd * 40},300 0,40`} stroke="#1a1a1a" strokeWidth={34} fill="none" strokeLinecap="round" />
            <circle r={58} fill="#1a1a1a" />
            <path d={`M${-sd * 10},-20 Q${-sd * 60},-60 ${-sd * 70},-110`} stroke="#1a1a1a" strokeWidth={30} fill="none" strokeLinecap="round" />
          </g>)}
        </g>
        {sx > 0 && <g opacity={sx} transform="translate(1340,560)">
          <rect x={-220} y={-300} width={440} height={600} rx={28} fill="#0e1428" stroke="#f4efe4" strokeWidth={4} />
          <T x={0} y={-220} s={38} c="#f4efe4" w={700}>THE TRIAL PAYS</T>
          <rect x={-60} y={-160} width={120} height={360} rx={12} fill="#2a3a62" />
          <rect x={-60} y={200 - (360 / 6.3) * ease(f, dSexto + 10, dSexto + 40)} width={120} height={(360 / 6.3) * ease(f, dSexto + 10, dSexto + 40)} rx={12} fill={VERDE} />
          <T x={0} y={260} s={48} c={VERDE} w={700}>less than 1/6</T>
        </g>}
      </svg>
    </div>
  );
};
