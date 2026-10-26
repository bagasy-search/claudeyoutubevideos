import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { rnd } from "../soot/lib";

// Roma de noche como UN solo mundo: todo vive en coordenadas de mundo (suelo de la calle en y = 0, edificios hacia y < 0).
// La cámara (x, y, z) viaja por ese mundo; cada capa tiene su factor de paralaje. Lo que se ve en cada x depende del
// barrio (tema) que toca en ese tramo del camino a casa: villa del Esquilino → callejones → vía → ínsulas → cruce →
// valle con cloacas → río → fuego → vigiles → casa.

export type Tema = "villa" | "callejon" | "via" | "insulas" | "cruce" | "valle" | "rio" | "fuego" | "vigiles" | "casa";
export type Cam = { x: number; y: number; z: number };

export const pantalla = (cam: Cam, wx: number, wy: number, p = 1) => {
  const z = 1 + (cam.z - 1) * p;
  return { x: (wx - cam.x * p) * z + 960, y: (wy - cam.y * p) * z + 540, z };
};

// ── capa: un div con la transformación de cámara; los hijos se ubican en coordenadas de mundo (HTML absoluto o SVG)
export const Capa: React.FC<{ cam: Cam; p?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ cam, p = 1, children, style }) => {
  const z = 1 + (cam.z - 1) * p;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(960px, 540px) scale(${z}) translate(${-cam.x * p}px, ${-cam.y * p}px)`, ...style }}>
      {children}
    </div>
  );
};
export const SvgMundo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>{children}</svg>
);

// ── paletas por tema
type Pal = { cielo: string[]; muro: string[]; sombra: string; techo: string; suelo: string; suelo2: string; lejos: string; medio: string };
// piedra cálida y cielo azul noche (molde: la miniatura elegida, OJO vuelta 3)
const NOCHE: Pal = {
  cielo: ["#040820", "#0a1640", "#16265c", "#24386f"], muro: ["#8a6446", "#7d5a40", "#946c4a", "#83603f", "#9a7450"],
  sombra: "#26170f", techo: "#8a3b28", suelo: "#4a3426", suelo2: "#3a281c", lejos: "#18204a", medio: "#121838",
};
const FUEGO: Pal = {
  cielo: ["#2a0612", "#6e1424", "#c2361f", "#ff8a3a"], muro: ["#7a3a3a", "#8c4a38", "#6e3346", "#9a5a3a", "#80403e"],
  sombra: "#2e0f1a", techo: "#5a1a14", suelo: "#4a2226", suelo2: "#2e1218", lejos: "#4a1424", medio: "#320c1a",
};
export const paleta = (tema: Tema): Pal => (tema === "fuego" ? FUEGO : NOCHE);

// ── cielo: degradé + estrellas + luna; `fuego` 0-1 lo tiñe de naranja
export const CieloNoche: React.FC<{ t: number; fuego?: number; luna?: number; camY?: number }> = ({ t, fuego = 0, luna = 1, camY = 0 }) => {
  const c = NOCHE.cielo, f = FUEGO.cielo;
  const mix = (a: string, b: string) => {
    const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const A = h(a), B = h(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * fuego)).join(",")})`;
  };
  const r = rnd(77);
  const est = Array.from({ length: 120 }, () => [r() * 1920, r() * 1400 - 400, 1 + r() * 2.4, r() * 6]);
  const dy = camY * 0.05;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${mix(c[0], f[0])} 0%, ${mix(c[1], f[1])} 35%, ${mix(c[2], f[2])} 70%, ${mix(c[3], f[3])} 100%)` }} />
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        {est.map(([x, y, s, ph], i) => <circle key={i} cx={x} cy={y - dy} r={s} fill="#fff" opacity={(0.4 + 0.45 * Math.sin(t * 1.7 + ph)) * (1 - fuego * 0.85)} />)}
        {luna > 0 && (
          <g opacity={luna * (1 - fuego)} transform={`translate(1560 ${190 - dy})`}>
            <circle r={150} fill="#fff6d8" opacity={0.08} /><circle r={95} fill="#fff6d8" opacity={0.12} />
            <circle r={58} fill="#fff3d0" /><circle cx={-16} cy={-10} r={11} fill="#e8dcb4" /><circle cx={18} cy={14} r={8} fill="#e8dcb4" />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// ── horizonte lejano: colinas con templos, el anfiteatro, el acueducto (paralaje 0,18)
export const Horizonte: React.FC<{ cam: Cam; t: number; fuego?: number }> = ({ cam, t, fuego = 0 }) => {
  const P = 0.18;
  const per = 5200;
  const x0 = Math.floor((cam.x * P - 3000) / per) * per;
  const col = fuego > 0.5 ? FUEGO.lejos : NOCHE.lejos;
  const bloques = [x0, x0 + per, x0 + per * 2];
  return (
    <Capa cam={{ ...cam, y: cam.y }} p={P}>
      <SvgMundo>
        {bloques.map((bx) => (
          <g key={bx} transform={`translate(${bx} 0)`} fill={col}>
            <path d="M -200 -40 Q 400 -420 900 -300 Q 1300 -200 1700 -380 Q 2300 -560 2900 -300 Q 3500 -120 4100 -340 Q 4700 -500 5400 -60 L 5400 400 L -200 400 Z" />
            {/* templo con frontón en la colina */}
            <g transform="translate(2300 -520)">
              <path d="M -170 0 L 0 -90 L 170 0 Z" />
              {[-140, -84, -28, 28, 84, 140].map((cx) => <rect key={cx} x={cx - 14} y={0} width={28} height={150} />)}
              <rect x={-190} y={150} width={380} height={30} />
            </g>
            {/* anfiteatro */}
            <g transform="translate(700 -330)">
              <path d="M -330 120 L -330 -80 Q 0 -150 330 -80 L 330 120 Z" />
              {[0, 1, 2].map((fila) => Array.from({ length: 9 }, (_, i) => <rect key={`${fila}${i}`} x={-300 + i * 70} y={-60 + fila * 60} width={34} height={44} rx={17} fill="#ffb04a" opacity={0.5 + 0.1 * Math.sin(t * 0.7 + i + fila)} />))}
            </g>
            {/* acueducto */}
            <g transform="translate(3600 -260)">
              <rect x={-600} y={-40} width={1300} height={34} />
              {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-600 + i * 108} -6 L ${-600 + i * 108} 300 L ${-576 + i * 108} 300 Q ${-546 + i * 108} 200 ${-516 + i * 108} 300 L ${-492 + i * 108} 300 L ${-492 + i * 108} -6 Z`} />)}
            </g>
            {/* humo de mil chimeneas, muy tenue */}
            {[400, 1500, 2800, 4300].map((hx, i) => <ellipse key={hx} cx={hx + Math.sin(t * 0.3 + i) * 40} cy={-560 - (t * 6 + i * 50) % 200} rx={160} ry={40} fill="#fff" opacity={0.03} />)}
          </g>
        ))}
      </SvgMundo>
    </Capa>
  );
};

// ── siluetas medias de ínsulas (paralaje 0,5)
export const Siluetas: React.FC<{ cam: Cam; t: number; fuego?: number; temaEn: (x: number) => Tema }> = ({ cam, t, fuego = 0, temaEn }) => {
  const P = 0.5;
  const ancho = 1920 / (1 + (cam.z - 1) * P) + 800;
  const cx = cam.x * P;
  const W = 300;
  const i0 = Math.floor((cx - ancho) / W), i1 = Math.ceil((cx + ancho) / W);
  const col = fuego > 0.5 ? FUEGO.medio : NOCHE.medio;
  const out: React.ReactNode[] = [];
  for (let i = i0; i <= i1; i++) {
    const r = rnd(i * 13 + 7);
    const tema = temaEn(i * W / P);
    if (tema === "rio") continue;
    const alto = tema === "villa" ? 260 + r() * 200 : 520 + r() * 520;
    const x = i * W + r() * 60, w = W - 20 + r() * 80;
    out.push(
      <g key={i}>
        <rect x={x} y={-alto} width={w} height={alto + 300} fill={col} />
        <path d={`M ${x - 14} ${-alto} L ${x + w / 2} ${-alto - 46} L ${x + w + 14} ${-alto} Z`} fill={col} />
        {Array.from({ length: 6 }, (_, k) => {
          const rr = rnd(i * 31 + k);
          const on = Math.sin(t * 0.21 + rr() * 50) > 0.35;
          return on ? <rect key={k} x={x + 20 + rr() * (w - 50)} y={-alto + 40 + rr() * (alto - 120)} width={18} height={24} fill="#ffcf6a" opacity={0.75} /> : null;
        })}
      </g>,
    );
  }
  return <Capa cam={cam} p={P}><SvgMundo>{out}</SvgMundo></Capa>;
};

// ── la fachada principal (paralaje 1): ínsulas, villas, santuarios, cuartel de vigiles
type Edif = { x: number; w: number; tema: Tema; pisos: number; seed: number; tipo: "insula" | "domus" | "santuario" | "cuartel" | "puente" | "muro" };
export const construirCalle = (desde: number, hasta: number, temaEn: (x: number) => Tema): Edif[] => {
  const out: Edif[] = [];
  let x = desde, i = 0;
  while (x < hasta) {
    const r = rnd(i * 97 + 11);
    const tema = temaEn(x);
    let tipo: Edif["tipo"] = "insula";
    let w = 420 + r() * 260;
    let pisos = 4 + Math.floor(r() * 3);
    if (tema === "villa") { tipo = "domus"; w = 760 + r() * 300; pisos = 1; }
    if (tema === "callejon") { pisos = 3 + Math.floor(r() * 2); w = 360 + r() * 160; }
    if (tema === "cruce" && i % 4 === 1) { tipo = "santuario"; w = 380; }
    if (tema === "vigiles" && i % 3 === 0) { tipo = "cuartel"; w = 900; pisos = 2; }
    if (tema === "rio") { tipo = "puente"; w = 700; }
    if (tema === "valle" && i % 5 === 2) { tipo = "muro"; w = 900; pisos = 2; }
    if (tema === "casa") pisos = 6;
    out.push({ x, w, tema, pisos, seed: i * 7 + 3, tipo });
    x += w + (tema === "callejon" ? 8 : 26 + r() * 30);
    i++;
  }
  return out;
};

const PISO = 200, BAJO = 270;
export const altoEdif = (e: { pisos: number; tipo: string }) => (e.tipo === "domus" ? 330 : e.tipo === "santuario" ? 300 : BAJO + (e.pisos - 1) * PISO);

// tabernas de la planta baja (determinístico: lo usa también Noche para agujerear la oscuridad)
export const tabernas = (e: { x: number; w: number; seed: number; tema: Tema }) => {
  const n = Math.max(1, Math.floor(e.w / 220));
  const aw = e.w / n;
  return Array.from({ length: n }, (_, k) => {
    const r = rnd(e.seed * 53 + k * 11 + 1);
    const lit = e.tema !== "fuego" && e.tema !== "casa" && r() < 0.5;
    return { x0: aw * k + 22, aw, lit, antorcha: lit && r() < 0.6 };
  });
};
const utileria = (e: { w: number; seed: number }) => {
  const r = rnd(e.seed * 71 + 5);
  const n = Math.floor(r() * 3);
  return Array.from({ length: n }, () => ({ x: 40 + r() * (e.w - 80), tipo: Math.floor(r() * 3) }));
};

const Insula: React.FC<{ e: Edif; t: number; pal: Pal; arde: number }> = ({ e, t, pal, arde }) => {
  const r = rnd(e.seed);
  const muro = pal.muro[Math.floor(r() * pal.muro.length)];
  const H = altoEdif(e);
  const nv = Math.max(2, Math.floor(e.w / 150));
  const balcon = Array.from({ length: e.pisos }, () => r() < 0.4);
  const ropa = r() < 0.35;
  return (
    <g transform={`translate(${e.x} 0)`}>
      <rect x={0} y={-H} width={e.w} height={H} fill={muro} />
      {arde === 0 && <rect x={0} y={-H} width={e.w} height={H} fill="url(#piedraP)" />}
      <rect x={0} y={-H} width={e.w} height={H} fill="url(#altoV)" />
      {/* esquineros de piedra clara */}
      {Array.from({ length: Math.floor(H / 70) }, (_, k) => <rect key={k} x={k % 2 ? 0 : 0} y={-H + k * 70 + 4} width={k % 2 ? 44 : 70} height={62} fill="#fff" opacity={0.07} />)}
      <rect x={e.w - 46} y={-H} width={46} height={H} fill="#000" opacity={0.22} />
      {/* revoque descascarado */}
      {[0, 1, 2].map((k) => <path key={k} d={`M ${30 + r() * (e.w - 120)} ${-H + 60 + r() * (H - 200)} q 30 -18 60 0 q 20 20 -10 30 q -40 8 -50 -30 Z`} fill="#000" opacity={0.08} />)}
      {/* pisos de arriba */}
      {Array.from({ length: e.pisos - 1 }, (_, p) => {
        const y0 = -BAJO - (p + 1) * PISO;
        return (
          <g key={p}>
            <rect x={-8} y={y0 + PISO - 12} width={e.w + 16} height={12} fill={pal.sombra} opacity={0.55} />
            {Array.from({ length: nv }, (_, k) => {
              const wx = (e.w / nv) * (k + 0.5) - 32;
              const rr = rnd(e.seed * 13 + p * 7 + k);
              const ph = rr() * 60;
              const luz = arde > 0 ? (rr() < 0.6 ? 2 : 1) : Math.sin(t * 0.17 + ph) > 0.1 - p * 0.05 ? 1 : 0;
              return (
                <g key={k}>
                  <rect x={wx - 6} y={y0 + 46} width={76} height={98} fill={pal.sombra} />
                  <rect x={wx} y={y0 + 52} width={64} height={88} fill={luz === 2 ? "#ff7a2a" : luz ? "#ffcf6a" : "#1a1028"} />
                  {luz === 1 && <rect x={wx + 8} y={y0 + 60} width={18} height={30} fill="#fff3c4" opacity={0.6} />}
                  {luz === 2 && <path d={`M ${wx + 4} ${y0 + 140} Q ${wx + 20} ${y0 + 70 - Math.sin(t * 9 + ph) * 18} ${wx + 32} ${y0 + 100} Q ${wx + 46} ${y0 + 60 + Math.sin(t * 7 + ph) * 16} ${wx + 60} ${y0 + 140} Z`} fill="#ffd23a" />}
                  {/* postigos */}
                  <rect x={wx - 26} y={y0 + 52} width={22} height={88} fill="#4a2a22" />
                  <rect x={wx + 68} y={y0 + 52} width={22} height={88} fill="#4a2a22" />
                </g>
              );
            })}
            {balcon[p] && p < e.pisos - 2 && (
              <g>
                <rect x={30} y={y0 + PISO - 30} width={e.w - 60} height={16} fill="#6b3a1f" />
                {Array.from({ length: Math.floor((e.w - 60) / 28) }, (_, k) => <rect key={k} x={36 + k * 28} y={y0 + PISO - 78} width={8} height={50} fill="#7d4a24" />)}
                <rect x={30} y={y0 + PISO - 84} width={e.w - 60} height={10} fill="#8a5a2c" />
                {[0.2, 0.55, 0.8].map((u) => <g key={u} transform={`translate(${30 + (e.w - 60) * u} ${y0 + PISO - 84})`}><path d="M -18 0 L -14 -30 L 14 -30 L 18 0 Z" fill="#b5452c" /><circle cx={-8} cy={-40} r={12} fill="#3f8f4a" /><circle cx={8} cy={-44} r={13} fill="#4fa85a" /></g>)}
              </g>
            )}
          </g>
        );
      })}
      {/* ropa tendida entre ventanas */}
      {ropa && e.pisos > 3 && (() => {
        const y = -BAJO - PISO * 2 + 20;
        return (
          <g>
            <path d={`M 10 ${y} Q ${e.w / 2} ${y + 40} ${e.w - 10} ${y}`} stroke="#2a1a2a" strokeWidth={3} fill="none" />
            {[0.25, 0.45, 0.7].map((u, k) => <rect key={u} x={e.w * u - 24} y={y + 16 + Math.sin(u * 3) * 6} width={48} height={60 + k * 8} rx={6} fill={["#d8c8a8", "#c96a4a", "#7aa8c8"][k]} transform={`rotate(${Math.sin(t * 1.3 + u * 9) * 5} ${e.w * u} ${y + 16})`} />)}
          </g>
        );
      })()}
      {/* techo de tejas con palomas */}
      <rect x={-20} y={-H - 26} width={e.w + 40} height={30} fill={pal.techo} />
      <path d={Array.from({ length: Math.ceil((e.w + 40) / 30) }, (_, k) => `M ${-20 + k * 30} ${-H - 26} q 15 -16 30 0`).join(" ")} stroke={pal.techo} strokeWidth={10} fill="none" />
      {r() < 0.5 && [0.3, 0.6].map((u, k) => <g key={u} transform={`translate(${e.w * u} ${-H - 40 + Math.max(0, Math.sin(t * 2 + k * 3)) * -4})`}><ellipse rx={18} ry={12} fill="#9a9ab0" /><circle cx={14} cy={-10} r={8} fill="#9a9ab0" /><path d="M 21 -10 L 28 -8 L 21 -6 Z" fill="#e0a040" /></g>)}
      {/* planta baja: tabernas; las abiertas derraman luz cálida en el muro y en los adoquines (las únicas luces de la calle) */}
      {tabernas(e).map(({ x0, aw, lit, antorcha }, k) => {
        const ph = e.seed * 3 + k * 7;
        const fl = 0.85 + 0.15 * Math.sin(t * 9 + ph) * Math.sin(t * 5.3 + ph);
        return (
          <g key={k}>
            {lit && <ellipse cx={x0 + (aw - 44) / 2} cy={-BAJO * 0.55} rx={aw * 0.95} ry={BAJO * 1.1} fill="url(#haloF)" opacity={0.85 * fl} />}
            <path d={`M ${x0} 0 L ${x0} ${-BAJO + 90} Q ${x0 + (aw - 44) / 2} ${-BAJO + 20} ${x0 + aw - 44} ${-BAJO + 90} L ${x0 + aw - 44} 0 Z`} fill={lit ? "#ffb347" : "#2a1622"} />
            {lit ? (
              <g>
                <path d={`M ${x0 + 14} 0 L ${x0 + 14} ${-BAJO + 104} Q ${x0 + (aw - 44) / 2} ${-BAJO + 40} ${x0 + aw - 58} ${-BAJO + 104} L ${x0 + aw - 58} 0 Z`} fill="#ffd27a" opacity={0.75 * fl} />
                {/* mostrador con ánforas y una silueta adentro */}
                <rect x={x0 + 10} y={-78} width={aw - 64} height={78} fill="#6b3a1f" />
                <rect x={x0 + 10} y={-84} width={aw - 64} height={10} fill="#8a5028" />
                {[0.22, 0.5].map((u) => <path key={u} d={`M ${x0 + (aw - 44) * u} -84 q -16 -10 -12 -40 q 4 -14 12 -16 q 8 2 12 16 q 4 30 -12 40 Z`} fill="#9a4a24" />)}
                <g transform={`translate(${x0 + (aw - 44) * 0.76} -84)`} fill="#3a1e14">
                  <circle cx={0} cy={-74 + Math.sin(t * 1.4 + ph) * 3} r={22} />
                  <path d="M -30 0 Q -28 -50 0 -54 Q 28 -50 30 0 Z" />
                </g>
              </g>
            ) : (
              <g>
                {Array.from({ length: 6 }, (_, b) => <rect key={b} x={x0 + 6 + b * ((aw - 56) / 6)} y={-BAJO + 96} width={(aw - 56) / 6 - 4} height={BAJO - 96} fill={b % 2 ? "#5a3424" : "#6b3f2a"} />)}
                <rect x={x0} y={-BAJO + 96} width={aw - 44} height={10} fill="#3a2014" />
              </g>
            )}
            {/* dintel de piedra */}
            <path d={`M ${x0 - 10} ${-BAJO + 90} Q ${x0 + (aw - 44) / 2} ${-BAJO + 6} ${x0 + aw - 34} ${-BAJO + 90}`} stroke="#c9a77a" strokeWidth={12} fill="none" opacity={0.55} />
            {/* derrame de luz sobre los adoquines */}
            {lit && <ellipse cx={x0 + (aw - 44) / 2} cy={46} rx={aw * 0.7} ry={60} fill="url(#haloF)" opacity={0.7 * fl} />}
            {antorcha && (
              <g transform={`translate(${x0 + aw - 22} ${-BAJO + 40})`}>
                <circle r={150} fill="url(#haloF)" opacity={0.9 * fl} />
                <path d="M -18 30 L 0 18 L 0 4" stroke="#2a1a10" strokeWidth={7} fill="none" />
                <rect x={-7} y={-20} width={14} height={40} rx={4} fill="#5a3418" />
                <path d={`M 0 ${-66 - Math.sin(t * 11 + ph) * 10} Q 22 -30 10 -16 Q 0 -10 -10 -16 Q -22 -30 0 ${-66 - Math.sin(t * 11 + ph) * 10} Z`} fill="#ff9a2a" />
                <path d={`M 0 ${-48 - Math.sin(t * 13 + ph) * 6} Q 10 -28 4 -20 Q 0 -16 -4 -20 Q -10 -28 0 ${-48 - Math.sin(t * 13 + ph) * 6} Z`} fill="#fff0a0" />
              </g>
            )}
          </g>
        );
      })}
      {/* utilería al pie del muro: barriles, ánforas, cajones */}
      {utileria(e).map(({ x, tipo }, k) => (
        <g key={`u${k}`} transform={`translate(${x} 0)`}>
          {tipo === 0 && <g><rect x={-34} y={-92} width={68} height={92} rx={14} fill="#6b4024" stroke="#26170f" strokeWidth={4} /><rect x={-36} y={-72} width={72} height={8} fill="#3a2a1e" /><rect x={-36} y={-28} width={72} height={8} fill="#3a2a1e" /><rect x={-20} y={-86} width={10} height={80} fill="#fff" opacity={0.12} /></g>}
          {tipo === 1 && <g><path d="M -10 -120 L 10 -120 L 12 -104 Q 46 -84 38 -36 Q 30 -6 0 0 Q -30 -6 -38 -36 Q -46 -84 -12 -104 Z" fill="#a0502a" stroke="#26170f" strokeWidth={4} /><path d="M -12 -104 Q -30 -100 -26 -80 M 12 -104 Q 30 -100 26 -80" stroke="#26170f" strokeWidth={4} fill="none" /><ellipse cx={-14} cy={-60} rx={7} ry={22} fill="#fff" opacity={0.15} /></g>}
          {tipo === 2 && <g><rect x={-46} y={-70} width={92} height={70} fill="#8a6038" stroke="#26170f" strokeWidth={4} /><path d="M -46 -70 L 46 0 M 46 -70 L -46 0" stroke="#5a3a20" strokeWidth={5} /></g>}
        </g>
      ))}
    </g>
  );
};

const Domus: React.FC<{ e: Edif; t: number }> = ({ e, t }) => (
  <g transform={`translate(${e.x} 0)`}>
    {/* cipreses del jardín */}
    {[0.12, 0.88].map((u) => <path key={u} d={`M ${e.w * u} 0 Q ${e.w * u - 50} -260 ${e.w * u} -520 Q ${e.w * u + 50} -260 ${e.w * u} 0 Z`} fill="#1f3a2a" />)}
    <rect x={60} y={-300} width={e.w - 120} height={300} fill="#c9a07a" />
    <rect x={60} y={-300} width={e.w - 120} height={300} fill="#2a1a3a" opacity={0.45} />
    <path d={`M 30 -300 L ${e.w / 2} -400 L ${e.w - 30} -300 Z`} fill="#9a3a2a" />
    {Array.from({ length: 6 }, (_, k) => <rect key={k} x={110 + k * ((e.w - 260) / 5)} y={-290} width={36} height={290} fill="#e8d6b8" opacity={0.85} />)}
    <rect x={e.w / 2 - 70} y={-200} width={140} height={200} rx={60} fill="#ffcf6a" />
    <rect x={e.w / 2 - 54} y={-186} width={108} height={186} rx={50} fill="#ffe2a0" />
    {[-120, 120].map((d) => (
      <g key={d} transform={`translate(${e.w / 2 + d} -170)`}>
        <rect x={-8} y={0} width={16} height={80} fill="#5a3418" />
        <path d={`M 0 ${-60 - Math.sin(t * 11 + d) * 10} Q 20 -20 0 0 Q -20 -20 0 ${-60 - Math.sin(t * 11 + d) * 10} Z`} fill="#ffb02a" />
        <circle r={60} fill="#ffb02a" opacity={0.15} />
      </g>
    ))}
  </g>
);

const Santuario: React.FC<{ e: Edif; t: number }> = ({ e, t }) => (
  <g transform={`translate(${e.x + e.w / 2} 0)`}>
    <rect x={-170} y={-60} width={340} height={60} fill="#7a6a7a" />
    <rect x={-120} y={-260} width={240} height={200} fill="#8a7a8a" />
    <path d="M -150 -260 L 0 -340 L 150 -260 Z" fill="#9a4a3a" />
    <rect x={-60} y={-230} width={120} height={140} fill="#3a2a3a" />
    {/* serpientes de los Lares pintadas y la lucecita */}
    <path d="M -100 -40 q 30 -30 60 0 t 60 0 t 60 0" stroke="#5aa860" strokeWidth={8} fill="none" />
    <ellipse cx={0} cy={-120} rx={26} ry={10} fill="#c9a06a" />
    <path d={`M 0 ${-150 - Math.sin(t * 12) * 6} Q 10 -132 0 -122 Q -10 -132 0 ${-150 - Math.sin(t * 12) * 6} Z`} fill="#ffb02a" />
    <circle cx={0} cy={-136} r={44} fill="#ffb02a" opacity={0.2} />
  </g>
);

const Cuartel: React.FC<{ e: Edif; pal: Pal }> = ({ e, pal }) => (
  <g transform={`translate(${e.x} 0)`}>
    <rect x={0} y={-470} width={e.w} height={470} fill="#7a5a4a" />
    <rect x={0} y={-470} width={e.w} height={40} fill={pal.techo} />
    {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M ${60 + k * 170} 0 L ${60 + k * 170} -200 Q ${120 + k * 170} -260 ${180 + k * 170} -200 L ${180 + k * 170} 0 Z`} fill="#2a1622" />)}
    {Array.from({ length: 5 }, (_, k) => <rect key={k} x={80 + k * 170} y={-380} width={80} height={70} fill="#ffcf6a" />)}
    <rect x={e.w / 2 - 240} y={-300} width={480} height={60} rx={10} fill="#c81d2e" />
    <text x={e.w / 2} y={-256} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={44} fill="#ffd77a">STATIO VIGILVM</text>
  </g>
);

const MuroLiso: React.FC<{ e: Edif; pal: Pal }> = ({ e, pal }) => (
  <g transform={`translate(${e.x} 0)`}>
    <rect x={0} y={-560} width={e.w} height={560} fill={pal.muro[1]} />
    {Array.from({ length: 7 }, (_, f) => Array.from({ length: Math.ceil(e.w / 120) }, (_, k) => <rect key={`${f}${k}`} x={k * 120 + (f % 2) * 60} y={-560 + f * 80} width={116} height={76} fill="#000" opacity={0.06 + ((f * 7 + k * 3) % 5) * 0.012} />))}
  </g>
);

// ── calle: el suelo (barro, surcos, bosta, tiestos; adoquines poligonales en la vía; canaleta abierta en el valle)
export const Suelo: React.FC<{ cam: Cam; temaEn: (x: number) => Tema; pal: Pal }> = ({ cam, temaEn, pal }) => {
  const ancho = 1920 / cam.z + 1200;
  const T = 240;
  const i0 = Math.floor((cam.x - ancho / 2) / T), i1 = Math.ceil((cam.x + ancho / 2) / T);
  const out: React.ReactNode[] = [];
  for (let i = i0; i <= i1; i++) {
    const x = i * T;
    const tema = temaEn(x);
    const r = rnd(i * 41 + 5);
    if (tema === "rio") continue;
    if (tema === "via" || tema === "villa" || tema === "vigiles") {
      for (let k = 0; k < 6; k++) {
        const px = x + (k % 3) * 80 + r() * 20, py = 30 + Math.floor(k / 3) * 110 + r() * 30;
        out.push(<path key={`${i}a${k}`} d={`M ${px} ${py} l 60 -8 l 18 40 l -30 40 l -56 -6 l -10 -40 Z`} fill="#000" opacity={0.18} />);
      }
    } else {
      if (r() < 0.6) out.push(<ellipse key={`${i}b`} cx={x + r() * T} cy={60 + r() * 200} rx={22 + r() * 20} ry={8} fill="#5a3a1a" opacity={0.8} />);
      if (r() < 0.5) out.push(<path key={`${i}c`} d={`M ${x + r() * T} ${80 + r() * 200} l 26 -10 l 10 18 l -22 8 Z`} fill="#c96a3a" opacity={0.7} />);
      if (r() < 0.3) out.push(<g key={`${i}d`} transform={`translate(${x + r() * T} ${120 + r() * 160})`}><circle r={10} fill="#5a8a3a" /><circle cx={14} cy={4} r={8} fill="#8a5a2a" /><path d="M -4 -4 l 30 -6" stroke="#3a5a2a" strokeWidth={4} /></g>);
    }
    if (tema === "valle" && i % 2 === 0) out.push(<rect key={`${i}e`} x={x} y={170} width={T + 2} height={40} fill="#0e0a1a" />, <rect key={`${i}f`} x={x} y={196} width={T + 2} height={14} fill="#2a5a6a" opacity={0.7} />);
    if (tema === "valle" && i % 3 === 1) out.push(<ellipse key={`${i}g`} cx={x + 100} cy={300} rx={130} ry={22} fill="#2a4a6a" opacity={0.7} />, <ellipse key={`${i}h`} cx={x + 80} cy={296} rx={40} ry={5} fill="#9ad6ff" opacity={0.4} />);
  }
  return (
    <Capa cam={cam}>
      <SvgMundo>
        <defs>
          <pattern id="adoqP" width={96} height={44} patternUnits="userSpaceOnUse">
            <rect x={3} y={3} width={42} height={18} rx={8} fill="#6a4a34" stroke="#22150e" strokeWidth={3} />
            <rect x={51} y={3} width={42} height={18} rx={8} fill="#5e4230" stroke="#22150e" strokeWidth={3} />
            <rect x={-21} y={25} width={42} height={18} rx={8} fill="#5a3e2c" stroke="#22150e" strokeWidth={3} />
            <rect x={27} y={25} width={42} height={18} rx={8} fill="#6e4e36" stroke="#22150e" strokeWidth={3} />
            <rect x={75} y={25} width={42} height={18} rx={8} fill="#5a3e2c" stroke="#22150e" strokeWidth={3} />
            <rect x={10} y={6} width={18} height={4} rx={2} fill="#d9a870" opacity={0.35} /><rect x={36} y={28} width={16} height={4} rx={2} fill="#d9a870" opacity={0.3} />
          </pattern>
        </defs>
        <rect x={cam.x - ancho} y={0} width={ancho * 2} height={900} fill={pal.suelo} />
        <rect x={cam.x - ancho} y={0} width={ancho * 2} height={900} fill="url(#adoqP)" opacity={0.9} />
        <rect x={cam.x - ancho} y={0} width={ancho * 2} height={26} fill={pal.sombra} />
        <rect x={cam.x - ancho} y={26} width={ancho * 2} height={10} fill="#000" opacity={0.25} />
        {/* surcos de las ruedas */}
        <rect x={cam.x - ancho} y={150} width={ancho * 2} height={10} fill={pal.suelo2} />
        <rect x={cam.x - ancho} y={250} width={ancho * 2} height={10} fill={pal.suelo2} />
        {out}
      </SvgMundo>
    </Capa>
  );
};

// río: agua con olas y el puente (el Tíber pasa por debajo del puente de piedra)
const Rio: React.FC<{ x: number; w: number; t: number }> = ({ x, w, t }) => (
  <g>
    <rect x={x} y={-10} width={w} height={900} fill="#1d2f5a" />
    {Array.from({ length: Math.ceil(w / 120) * 4 }, (_, k) => {
      const fx = x + ((k * 137) % w), fy = 40 + ((k * 53) % 300);
      return <path key={k} d={`M ${fx + Math.sin(t + k) * 20} ${fy} q 20 -10 40 0 t 40 0`} stroke="#6a9ad8" strokeWidth={5} fill="none" opacity={0.5} />;
    })}
  </g>
);
const Puente: React.FC<{ e: Edif }> = ({ e }) => (
  <g transform={`translate(${e.x} 0)`}>
    <rect x={0} y={-40} width={e.w + 30} height={60} fill="#6a5a6a" />
    <path d={`M 0 20 L 0 260 Q ${e.w / 2} -40 ${e.w + 30} 260 L ${e.w + 30} 20 Z`} fill="#6a5a6a" />
    {Array.from({ length: Math.ceil(e.w / 60) }, (_, k) => <rect key={k} x={k * 60} y={-80} width={20} height={40} fill="#7a6a7a" />)}
  </g>
);

export const Fachada: React.FC<{ cam: Cam; t: number; calle: Edif[]; arde: (e: Edif) => number }> = ({ cam, t, calle, arde }) => {
  const ancho = 1920 / cam.z + 1600;
  const vis = calle.filter((e) => e.x + e.w > cam.x - ancho / 2 && e.x < cam.x + ancho / 2);
  return (
    <Capa cam={cam}>
      <SvgMundo>
        <defs>
          <pattern id="piedraP" width={120} height={64} patternUnits="userSpaceOnUse">
            <path d="M 0 0.5 H 120 M 0 32.5 H 120 M 30 0 V 32 M 90 32 V 64" stroke="#2a1a10" strokeWidth={3} opacity={0.28} />
            <rect x={4} y={4} width={22} height={10} fill="#fff" opacity={0.05} /><rect x={64} y={38} width={20} height={9} fill="#fff" opacity={0.05} />
          </pattern>
          <linearGradient id="altoV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0a24" stopOpacity={0.55} /><stop offset="0.6" stopColor="#0a0a24" stopOpacity={0.12} /><stop offset="1" stopColor="#0a0a24" stopOpacity={0} /></linearGradient>
          <radialGradient id="haloF"><stop offset="0" stopColor="#ffb347" stopOpacity={0.75} /><stop offset="0.45" stopColor="#ff9a3a" stopOpacity={0.3} /><stop offset="1" stopColor="#ff9a3a" stopOpacity={0} /></radialGradient>
        </defs>
        {vis.map((e) => {
          const pal = paleta(e.tema);
          if (e.tipo === "domus") return <Domus key={e.seed} e={e} t={t} />;
          if (e.tipo === "santuario") return <Santuario key={e.seed} e={e} t={t} />;
          if (e.tipo === "cuartel") return <Cuartel key={e.seed} e={e} pal={pal} />;
          if (e.tipo === "muro") return <MuroLiso key={e.seed} e={e} pal={pal} />;
          if (e.tipo === "puente") return <g key={e.seed}><Rio x={e.x - 30} w={e.w + 90} t={t} /><Puente e={e} /></g>;
          return <Insula key={e.seed} e={e} t={t} pal={pal} arde={arde(e)} />;
        })}
      </SvgMundo>
    </Capa>
  );
};

// ── primer plano con paralaje 1,6: columnas de pórtico, faroles apagados que no existen (postes), ropa colgada
export const Frente: React.FC<{ cam: Cam; t: number; temaEn: (x: number) => Tema; op?: number }> = ({ cam, t, temaEn, op = 1 }) => {
  const P = 1.6;
  const z = 1 + (cam.z - 1) * P;
  const ancho = 1920 / z + 800;
  const W = 1500;
  const cx = cam.x * P;
  const i0 = Math.floor((cx - ancho) / W), i1 = Math.ceil((cx + ancho) / W);
  const out: React.ReactNode[] = [];
  for (let i = i0; i <= i1; i++) {
    const r = rnd(i * 29 + 1);
    const tema = temaEn(i * W / P);
    const x = i * W + r() * 500;
    if (tema === "rio") continue;
    r(); // (los postes oscuros de primer plano tapaban al nene: fuera, OJO vuelta 2)
    out.push(<g key={i} transform={`translate(${x} ${560})`}><ellipse rx={260} ry={120} fill="#0d0716" /><ellipse cx={240} cy={30} rx={160} ry={90} fill="#0d0716" />{r() < 0.5 && <path d={`M -60 -100 L -40 -260 L -20 -100 Z`} fill="#0d0716" />}</g>);
  }
  return <Capa cam={cam} p={P} style={{ opacity: op }}><SvgMundo>{out}</SvgMundo></Capa>;
};

// ── oscuridad: todo negro salvo el círculo de la lámpara (y otras luces)
export type Luz = { x: number; y: number; r: number; color?: string };
export const Oscuridad: React.FC<{ a: number; luces: Luz[] }> = ({ a, luces }) => {
  if (a <= 0.01) return null;
  const id = "osc";
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <defs>
        <mask id={id}>
          <rect width={1920} height={1080} fill="#fff" />
          {luces.map((l, i) => (
            <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#${id}g)`} />
          ))}
        </mask>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor="#000" /><stop offset="0.45" stopColor="#000" stopOpacity={0.85} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
        <radialGradient id={`${id}c`}><stop offset="0" stopColor="#ffb347" stopOpacity={0.28} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#06040f" opacity={a} mask={`url(#${id})`} />
      {luces.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={l.r * 0.8} fill={`url(#${id}c)`} />)}
    </svg>
  );
};

// ── interpolación de keyframes (cámara, velocidad, oscuridad)
export const kf = (t: number, ks: [number, number][], ease = Easing.inOut(Easing.cubic)) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) return interpolate(t, [ks[i - 1][0], ks[i][0]], [ks[i - 1][1], ks[i][1]], { easing: ease });
  }
  return ks[ks.length - 1][1];
};
