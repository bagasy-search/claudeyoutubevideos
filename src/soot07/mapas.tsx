import React from "react";
import { interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";
import { C, ent, fontFamily } from "./kit";
import { ICO } from "./iconos";
import { M } from "./guion07";

// Lo que se ve cuando la cámara sube al cielo (y ≈ -3600): la ciudad dibujada con estrellas y tiza de luz.
// Son capas de pantalla que aparecen con la altura de la cámara, así el viaje cielo ↔ calle es UN solo movimiento.
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const pr = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
const K = "#1a0d24";
const T = (x: number, y: number, txt: string, size = 40, col = C.crema, anchor: "middle" | "start" | "end" = "middle") => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={fontFamily} fontWeight={700} fontSize={size} fill={col} stroke={K} strokeWidth={size * 0.16} paintOrder="stroke">{txt}</text>
);
const Ico: React.FC<{ k: string; x: number; y: number; s: number }> = ({ k, x, y, s }) => <g transform={`translate(${x} ${y}) scale(${s})`}>{ICO[k]}</g>;

// silueta de Roma vista desde arriba: el Tíber en S y siete colinas
const RIO = "M 1500 -40 C 1380 200 1560 380 1420 560 C 1300 720 1460 900 1380 1120";
const COLINAS: [number, number, string][] = [[620, 380, "QUIRINAL"], [800, 300, "VIMINAL"], [960, 420, "ESQUILINE"], [840, 560, "CAELIAN"], [700, 520, "PALATINE"], [560, 600, "AVENTINE"], [600, 450, "CAPITOLINE"]];

const Ruta: React.FC<{ t: number }> = ({ t }) => {
  const dib = pr(t, M.ruta, M.ruta + 3);
  const trampas = ["farol", "rueda", "orinal", "daga", "olas", "llama", "cubo"];
  const pts: [number, number][] = [[420, 760], [600, 640], [760, 700], [900, 560], [1060, 620], [1180, 480], [1320, 540], [1500, 400]];
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const q = ent(t, M.casaQ);
  return (
    <g>
      <path d={RIO} stroke="#3a7fd0" strokeWidth={60} fill="none" opacity={0.5} strokeLinecap="round" />
      <path d={d} stroke={C.ambar} strokeWidth={14} fill="none" strokeDasharray="34 22" pathLength={1} strokeDashoffset={0} style={{ strokeDasharray: `${dib} 1` }} strokeLinecap="round" />
      <g transform={`translate(420 760) scale(${ent(t, M.ruta - 0.3)})`}><Ico k="lampara" x={0} y={-70} s={0.6} />{T(0, 60, "THE DINNER", 34)}</g>
      {trampas.map((k, i) => {
        const e = ent(t, M.trampas + 0.35 + i * 0.5);
        const [x, y] = pts[i + 1];
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${e})`}>
            <circle r={58} fill={C.rojo} stroke="#fff" strokeWidth={6} />
            <Ico k={k} x={0} y={0} s={0.42} />
            {T(0, -76, `${i + 1}`, 44, C.crema)}
          </g>
        );
      })}
      <g transform={`translate(1640 330) scale(${q * (1 + Math.sin(t * 6) * 0.05 * q)})`}>
        <path d="M -70 0 L 0 -70 L 70 0 L 70 80 L -70 80 Z" fill="#e8b98a" stroke={K} strokeWidth={8} />
        <path d="M -86 6 L 0 -84 L 86 6" stroke={C.rojo} strokeWidth={16} fill="none" />
        {T(0, 66, "?", 90, C.rojo)}
        {T(0, 150, "HOME", 40)}
      </g>
    </g>
  );
};

const Colinas: React.FC<{ t: number }> = ({ t }) => {
  const pant = pr(t, M.pantanos, M.pantanos + 1.5);
  const clo = pr(t, M.cloaca, M.cloaca + 2.2);
  return (
    <g>
      <path d={RIO} stroke="#3a7fd0" strokeWidth={70} fill="none" opacity={0.6} strokeLinecap="round" />
      {[[700, 440], [760, 640], [880, 480]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={160 * pant} ry={70 * pant} fill="#2f7f8f" opacity={0.55} />)}
      {COLINAS.map(([x, y, n], i) => {
        const e = ent(t, M.mapa2 + 0.3 + i * 0.18);
        return <g key={n} transform={`translate(${x} ${y}) scale(${e})`}><ellipse rx={110} ry={62} fill="#5c8f3e" stroke={K} strokeWidth={6} /><ellipse cx={-20} cy={-16} rx={60} ry={26} fill="#7fb85a" />{T(0, 92, n, 26)}</g>;
      })}
      <path d="M 700 440 C 760 560 900 600 1060 620 S 1340 600 1440 560" stroke="#9be7f0" strokeWidth={22} fill="none" pathLength={1} style={{ strokeDasharray: `${clo} 1` }} strokeLinecap="round" />
      {clo > 0.98 && T(1180, 700, "CLOACA MAXIMA", 46, "#9be7f0")}
    </g>
  );
};

// las 14 regiones de Augusto como una grilla de baldosas sobre el mapa
const REG: [number, number][] = Array.from({ length: 14 }, (_, i) => [460 + (i % 5) * 200 + (Math.floor(i / 5) % 2) * 100, 300 + Math.floor(i / 5) * 190]);
const Incendio: React.FC<{ t: number }> = ({ t }) => {
  const circo = 7;
  const quema = (i: number) => {
    const d = Math.hypot(REG[i][0] - REG[circo][0], REG[i][1] - REG[circo][1]);
    return pr(t, M.circo + d / 260, M.circo + d / 260 + 1);
  };
  const destino = (i: number) => (i === 7 || i === 6 || i === 8 ? "total" : [0, 4, 13].includes(i) ? "ok" : "dano");
  return (
    <g>
      <path d={RIO} stroke="#3a7fd0" strokeWidth={60} fill="none" opacity={0.5} strokeLinecap="round" />
      {REG.map(([x, y], i) => {
        const e = ent(t, M.grande + 0.4 + i * 0.07);
        const q = destino(i) === "ok" ? 0 : quema(i);
        const fin = destino(i);
        const col = t > M.cuatro && fin === "ok" ? C.lima : t > M.tres && fin === "total" ? "#1a1018" : t > M.siete7 && fin === "dano" ? C.naranja : q > 0 ? `rgb(${200 + 55 * q},${120 - 60 * q},40)` : "#6d4466";
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${e})`}>
            <rect x={-86} y={-76} width={172} height={152} rx={18} fill={col} stroke={K} strokeWidth={6} />
            {q > 0.2 && fin !== "ok" && t < M.tres + 0.4 && <path d={`M -30 30 Q -20 ${-30 - Math.sin(t * 9 + i) * 16} 0 -50 Q 20 ${-20 + Math.sin(t * 7 + i) * 14} 30 30 Z`} fill="#ffd23a" />}
            {T(0, 14, ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"][i], 40)}
          </g>
        );
      })}
      {t > M.circo && <g transform={`translate(${REG[circo][0]} ${REG[circo][1] + 110}) scale(${ent(t, M.circo)})`}>{T(0, 0, "CIRCUS MAXIMUS", 30, C.ambar)}</g>}
      {t > M.tres && <g transform={`translate(1500 820)`}>{T(0, 0, "3 GONE", 44, "#ff6f6f", "start")}{t > M.siete7 && T(0, 60, "7 DAMAGED", 44, C.naranja, "start")}{t > M.cuatro && T(0, 120, "4 SURVIVED", 44, C.lima, "start")}</g>}
    </g>
  );
};

const Cohortes: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <path d={RIO} stroke="#3a7fd0" strokeWidth={60} fill="none" opacity={0.5} strokeLinecap="round" />
    {REG.map(([x, y], i) => {
      const c = Math.floor(i / 2);
      const e = ent(t, M.cohortes + 0.3 + i * 0.05);
      const on = t > M.dosde14 + c * 0.28;
      const col = ["#e8344a", "#ffb020", "#2ec4d6", "#9be15d", "#9b7bf0", "#ff6f91", "#f7c548"][c];
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${e})`}>
          <rect x={-86} y={-76} width={172} height={152} rx={18} fill={on ? col : "#6d4466"} stroke={K} strokeWidth={6} opacity={on ? 0.95 : 0.7} />
          {i % 2 === 0 && on && <g transform={`translate(0 -4) scale(${ent(t, M.dosde14 + c * 0.28)})`}><Ico k="cubo" x={0} y={0} s={0.42} /></g>}
        </g>
      );
    })}
    {t > M.dosde14 && T(960, 960, "1 COHORT = 2 DISTRICTS", 48, C.crema)}
  </g>
);

// fábrica victoriana del próximo video (silueta con chimeneas que humean)
const Fabrica: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const e = ent(t, t0, 0, { damping: 14, stiffness: 120 });
  return (
    <g transform={`translate(1500 ${860 + (1 - e) * 500}) scale(0.9)`}>
      {[[-240, 420], [-80, 520], [90, 460]].map(([x, h], k) => (
        <g key={k}>
          <rect x={x} y={-h} width={54} height={h} fill="#3a2a3a" stroke={K} strokeWidth={5} />
          {Array.from({ length: 5 }, (_, j) => { const lt = ((t * 0.6 + j * 0.2 + k * 0.13) % 1); return <circle key={j} cx={x + 27 + lt * 120} cy={-h - 30 - lt * 260} r={30 + lt * 60} fill="#8a8090" opacity={0.5 * (1 - lt)} />; })}
        </g>
      ))}
      <path d="M -380 0 L -380 -220 L -260 -300 L -260 -220 L -140 -300 L -140 -220 L -20 -300 L -20 -220 L 100 -300 L 100 -220 L 260 -220 L 260 0 Z" fill="#4a3448" stroke={K} strokeWidth={6} />
      {Array.from({ length: 8 }, (_, k) => <rect key={k} x={-350 + k * 76} y={-170} width={44} height={70} fill={Math.sin(t * 3 + k) > -0.3 ? "#ffcf6a" : "#2a1a20"} />)}
      {T(-60, 110, "NEXT: THE VICTORIAN FACTORY", 58, C.ambar)}
    </g>
  );
};

const Cta: React.FC<{ t: number }> = ({ t }) => {
  const sb = ent(t, M.suscribe);
  const bell = t > M.campana ? Math.sin((t - M.campana) * 18) * 18 * Math.exp(-(t - M.campana) * 2) : 0;
  const trampas = ["farol", "rueda", "orinal", "daga", "olas", "llama", "cubo"];
  return (
    <g>
      <g transform={`translate(560 300) scale(${sb})`}>
        <rect x={-300} y={-80} width={600} height={160} rx={40} fill={C.rojo} stroke="#fff" strokeWidth={8} />
        {T(0, 26, "SUBSCRIBE", 84, "#fff")}
        <g transform={`translate(${t > M.suscribe + 0.4 ? -360 + Math.min(1, (t - M.suscribe - 0.4) * 3) * 300 : -360} 120)`}>
          <path d="M 0 0 L 0 70 L 18 54 L 32 84 L 44 78 L 30 50 L 54 50 Z" fill="#fff" stroke={K} strokeWidth={5} />
        </g>
      </g>
      <g transform={`translate(1000 300) scale(${ent(t, M.campana)}) rotate(${bell})`}>
        <path d="M -60 50 Q -60 -60 0 -70 Q 60 -60 60 50 L 76 70 L -76 70 Z" fill={C.oro} stroke={K} strokeWidth={8} />
        <circle cx={0} cy={86} r={18} fill={C.oro} stroke={K} strokeWidth={6} />
      </g>
      {t > M.proximo - 0.2 && <Fabrica t={t} t0={M.proximo} />}
      {t > M.cual && trampas.map((k, i) => {
        const e = ent(t, M.cual + 0.2 + i * 0.22);
        return <g key={k} transform={`translate(${300 + i * 150} 700) scale(${e})`}><circle r={60} fill={C.violeta} stroke="#fff" strokeWidth={6} /><Ico k={k} x={0} y={0} s={0.44} />{T(0, 100, `${i + 1}`, 40)}</g>;
      })}
      {t > M.cual && T(700, 560, "WHICH TRAP GETS YOU FIRST?", 56, C.ambar)}
    </g>
  );
};

export const MapaCielo: React.FC<{ t: number; camY: number }> = ({ t, camY }) => {
  const op = cl((-camY - 2300) / 900);
  if (op <= 0.01) return null;
  const tipo = t < M.t1 ? "ruta" : t < M.t6 ? "colinas" : t < M.t7 ? "incendio" : t < M.pregunta ? "cohortes" : "cta";
  return (
    <svg style={{ position: "absolute", inset: 0, opacity: op }} width={1920} height={1080}>
      {tipo === "ruta" && <Ruta t={t} />}
      {tipo === "colinas" && <Colinas t={t} />}
      {tipo === "incendio" && <Incendio t={t} />}
      {tipo === "cohortes" && <Cohortes t={t} />}
      {tipo === "cta" && <Cta t={t} />}
    </svg>
  );
};

// ── reloj de las 12 horas de la noche (y las 4 guardias del ejército)
export const RelojNoche: React.FC<{ t: number }> = ({ t }) => {
  if (t < M.doce - 0.2 || t > M.civil + 1.2) return null;
  const e = ent(t, M.doce) * (1 - cl((t - M.civil - 0.8) / 0.4));
  const largo = t > M.invierno ? 1 + 0.25 * Math.sin(Math.min(1, (t - M.invierno) / 1.5) * Math.PI) * (t < ahVerano() ? 1 : -1) : 1;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <g transform={`translate(1500 560) scale(${e})`}>
        <circle r={260} fill="#1b1240" stroke="#fff3d6" strokeWidth={10} />
        {Array.from({ length: 12 }, (_, i) => {
          const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
          const g = Math.floor(i / 3);
          const col = t > M.guardias ? ["#5b2bb5", "#2ec4d6", "#e8344a", "#ffb020"][g] : "#2d1b69";
          const r = 230 * (i % 2 ? largo : 1);
          const on = t > M.doce + i * 0.09;
          return on ? <path key={i} d={`M 0 0 L ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`} fill={col} stroke="#1b1240" strokeWidth={6} /> : null;
        })}
        <circle r={60} fill="#fff3d6" />
        <path d="M 22 -30 A 34 34 0 1 0 22 30 A 26 26 0 1 1 22 -30 Z" fill="#1b1240" />
      </g>
    </svg>
  );
};
const ahVerano = () => M.invierno + 1.8;

// ── balanza: un año de alquiler en Roma = una casa entera en un pueblo
export const Balanza: React.FC<{ t: number }> = ({ t }) => {
  if (t < M.alquiler - 0.2 || t > M.tejas + 0.5) return null;
  const e = ent(t, M.alquiler) * (1 - cl((t - M.tejas) / 0.5));
  const inc = t > M.balanza ? interpolate(t, [M.balanza, M.balanza + 1], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }) : 0;
  const a = -8 + 8 * inc; // queda nivelada
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <g transform={`translate(960 600) scale(${e})`}>
        <rect x={-14} y={-260} width={28} height={340} fill="#c9a46a" stroke={K} strokeWidth={6} />
        <path d="M -120 90 L 120 90 L 80 60 L -80 60 Z" fill="#c9a46a" stroke={K} strokeWidth={6} />
        <g transform={`translate(0 -260) rotate(${a})`}>
          <rect x={-420} y={-12} width={840} height={24} rx={10} fill={C.oro} stroke={K} strokeWidth={6} />
          {[-1, 1].map((d) => (
            <g key={d} transform={`translate(${d * 400} 0) rotate(${-a})`}>
              <line x1={-80} y1={150} x2={0} y2={0} stroke={K} strokeWidth={4} /><line x1={80} y1={150} x2={0} y2={0} stroke={K} strokeWidth={4} />
              <path d="M -130 150 Q 0 210 130 150 Z" fill={C.oro} stroke={K} strokeWidth={6} />
              {d < 0 ? <g transform="translate(0 110)"><rect x={-60} y={-60} width={120} height={60} fill="#7c5060" stroke={K} strokeWidth={5} /><rect x={-20} y={-46} width={40} height={36} fill="#ffcf6a" />{T(0, 160, "1 YEAR OF RENT · ROME", 34)}</g>
                : t > M.balanza && <g transform={`translate(0 120) scale(${ent(t, M.balanza)})`}><path d="M -70 0 L -70 -60 L 0 -110 L 70 -60 L 70 0 Z" fill="#e8b98a" stroke={K} strokeWidth={6} /><path d="M -84 -54 L 0 -122 L 84 -54" stroke="#b5452c" strokeWidth={14} fill="none" />{T(0, 150, "A WHOLE HOUSE · A TOWN", 34)}</g>}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

// ── regla de altura (Augusto 70 pies, Trajano 60)
export const ReglaAltura: React.FC<{ t: number }> = ({ t }) => {
  if (t < M.setenta - 0.2 || t > M.planta + 0.4) return null;
  const e = ent(t, M.setenta) * (1 - cl((t - M.planta) / 0.4));
  const h = t > M.trajano ? interpolate(t, [M.trajano, M.trajano + 0.6], [700, 600], { extrapolateRight: "clamp" }) : 700;
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <g transform={`translate(1180 980) scale(1 ${e})`}>
        <rect x={-20} y={-h} width={40} height={h} fill={C.ambar} stroke={K} strokeWidth={6} />
        {Array.from({ length: Math.floor(h / 100) + 1 }, (_, k) => <line key={k} x1={-20} y1={-k * 100} x2={30} y2={-k * 100} stroke={K} strokeWidth={6} />)}
        <path d={`M -60 ${-h} L 60 ${-h}`} stroke={C.rojo} strokeWidth={12} />
      </g>
    </svg>
  );
};

// ── estrellas en la cara cuando le pegan
export const Estrellitas: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const lt = t - t0;
  if (lt < 0 || lt > 2.4) return null;
  const r = rnd(9);
  return (
    <svg style={{ position: "absolute", left: x - 200, top: y - 200, overflow: "visible" }} width={400} height={400} viewBox="-200 -200 400 400">
      {[0, 1, 2, 3, 4].map((k) => { const a = lt * 5 + (k / 5) * Math.PI * 2; const s = 24 + r() * 10; return <path key={k} transform={`translate(${Math.cos(a) * 110} ${Math.sin(a) * 30 - 60})`} d={`M 0 ${-s} L ${s * 0.3} ${-s * 0.3} L ${s} 0 L ${s * 0.3} ${s * 0.3} L 0 ${s} L ${-s * 0.3} ${s * 0.3} L ${-s} 0 L ${-s * 0.3} ${-s * 0.3} Z`} fill="#ffe14a" stroke={K} strokeWidth={4} />; })}
    </svg>
  );
};
