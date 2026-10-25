import React from "react";
import { interpolate, Easing } from "remotion";

// CUADRO 0 = la miniatura (soot_ola/minis/soot06_elegida.png) sin texto ni flecha, rehecha en SVG puro con su nivel
// de detalle: piedra con textura, madera veteada, manta de piel pelo por pelo, ratas con anatomía, hielo, luz cálida
// de las velas contra el frío azul de la ventana y la letrina, polvo y nieve en el aire.
// Coordenadas de la miniatura (1672x941) estiradas a 1920x1080. 0-2,2 s la escena cobra vida; 2,2-3,3 s la cámara
// entra por la ventana hasta el castillo nevado y funde al mundo del gancho (la luna detrás de la bandera).
export const C0_FIN = 3.3;
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1672, H = 941;
const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
const mezcla = (a: string, b: string, k: number) => {
  const p = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * k).toString(16).padStart(2, "0")).join("");
};

// piedra: cada bloque con su tono, filo de luz arriba, sombra abajo, poros y alguna grieta
const Piedras: React.FC<{ x: number; y: number; w: number; h: number; bw: number; bh: number; a: string; b: string; junta: string; luz: string; seed: number; escarcha?: boolean }> = ({ x, y, w, h, bw, bh, a, b, junta, luz, seed, escarcha }) => {
  const r: React.ReactNode[] = [];
  let k = 0;
  r.push(<rect key="j" x={x} y={y} width={w} height={h} fill={junta} />);
  for (let j = 0; j * bh < h; j++) {
    const off = j % 2 ? bw / 2 : 0;
    for (let i = -1; i * bw < w + bw; i++) {
      const n = seed * 1000 + j * 50 + i;
      const f = rnd(n), bx = x + i * bw + off + 4, by = y + j * bh + 4, ww = bw - 8 - rnd(n + 7) * 6, hh = bh - 8;
      r.push(<rect key={k++} x={bx} y={by} width={ww} height={hh} rx={7} fill={mezcla(a, b, f)} />);
      r.push(<rect key={k++} x={bx + 3} y={by + 2} width={ww - 6} height={5} rx={2} fill={luz} opacity={0.35} />);
      r.push(<rect key={k++} x={bx + 3} y={by + hh - 7} width={ww - 6} height={6} rx={2} fill="#000" opacity={0.22} />);
      for (let q = 0; q < 3; q++) r.push(<circle key={k++} cx={bx + rnd(n + q * 3) * ww} cy={by + 8 + rnd(n + q * 5) * (hh - 14)} r={1.5 + rnd(n + q) * 2} fill="#000" opacity={0.18} />);
      if (f > 0.82) r.push(<path key={k++} d={`M ${bx + ww * 0.3} ${by + 4} l 8 ${hh * 0.35} l -6 ${hh * 0.3}`} stroke="#000" strokeWidth={2} opacity={0.3} fill="none" />);
      if (escarcha && f > 0.45) r.push(<path key={k++} d={`M ${bx + 2} ${by + 3} Q ${bx + ww / 2} ${by - 4} ${bx + ww - 2} ${by + 3}`} stroke="#eaf6ff" strokeWidth={4} opacity={0.75} fill="none" />);
    }
  }
  return <g>{r}</g>;
};

// veta de madera sobre un rectángulo
const Veta: React.FC<{ x: number; y: number; w: number; h: number; seed: number; vertical?: boolean }> = ({ x, y, w, h, seed, vertical }) => (
  <g opacity={0.35} stroke="#2a1306" strokeWidth={2.2} fill="none">
    {Array.from({ length: 7 }, (_, i) => {
      const u = (i + 0.5) / 7, o = (rnd(seed + i) - 0.5) * 10;
      return vertical
        ? <path key={i} d={`M ${x + w * u} ${y} C ${x + w * u + o} ${y + h * 0.3} ${x + w * u - o} ${y + h * 0.6} ${x + w * u + o / 2} ${y + h}`} />
        : <path key={i} d={`M ${x} ${y + h * u} C ${x + w * 0.3} ${y + h * u + o} ${x + w * 0.6} ${y + h * u - o} ${x + w} ${y + h * u + o / 2}`} />;
    })}
  </g>
);

const Rata: React.FC<{ x: number; y: number; s: number; flip?: boolean; t: number; seed: number; dx?: number }> = ({ x, y, s, flip, t, seed, dx = 0 }) => {
  const cola = Math.sin(t * 6 + seed) * 16;
  const pasito = Math.sin(t * 14 + seed) * 3;
  const bigote = Math.sin(t * 22 + seed) * 3;
  const olfa = Math.sin(t * 30 + seed) * 1.5;
  const colaD = `M -112 18 C -160 ${40 + cola} -205 ${-5 - cola} -250 ${25 + cola}`;
  return (
    <g transform={`translate(${x + dx} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* cola rosada que se afina, con anillos */}
      <path d={colaD} stroke="#b9606f" strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={colaD} stroke="#f2a2ae" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={colaD} stroke="#c97a88" strokeWidth={8} strokeDasharray="2 9" fill="none" />
      {/* pata trasera con dedos */}
      <g transform={`translate(-70 ${42 + pasito})`}><ellipse rx={26} ry={10} fill="#e98f9e" />{[-16, -6, 4, 14].map((q) => <circle key={q} cx={q + 12} cy={6} r={4} fill="#f6b3be" />)}</g>
      {/* cuerpo: grupa redonda, lomo arqueado, pelo */}
      <path d="M -120 20 C -130 -40 -60 -62 10 -55 C 60 -50 95 -30 112 -8 C 100 30 60 48 0 50 C -60 52 -112 45 -120 20 Z" fill="url(#c0rata)" stroke="#1f1c24" strokeWidth={4} />
      {Array.from({ length: 26 }, (_, i) => {
        const u = rnd(seed * 40 + i), v = rnd(seed * 40 + i + 99);
        const px = -105 + u * 190, py = -40 + v * 70 + Math.abs(px) * 0.05;
        return <path key={i} d={`M ${px} ${py} q 6 -3 12 1`} stroke={i % 3 ? "#6d6875" : "#24212a"} strokeWidth={2.5} fill="none" strokeLinecap="round" />;
      })}
      <path d="M -90 -30 C -40 -52 20 -50 70 -30" stroke="#8a8592" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* pata delantera */}
      <g transform={`translate(55 ${44 - pasito})`}><ellipse rx={20} ry={9} fill="#e98f9e" />{[-10, -2, 6, 14].map((q) => <circle key={q} cx={q + 6} cy={6} r={3.6} fill="#f6b3be" />)}</g>
      {/* cabeza puntiaguda que olfatea */}
      <path d={`M 70 -40 C 100 -48 130 -25 ${150 + olfa} 10 C 128 30 95 34 70 25 Z`} fill="url(#c0rata)" stroke="#1f1c24" strokeWidth={4} />
      <circle cx={150 + olfa} cy={10} r={8} fill="#ff8fa3" stroke="#a24a5a" strokeWidth={2} />
      <path d="M 132 22 q 8 6 16 0" stroke="#3a1a22" strokeWidth={2.5} fill="none" />
      <ellipse cx={74} cy={-50} rx={24} ry={27} fill="#4a4652" stroke="#1f1c24" strokeWidth={4} />
      <ellipse cx={76} cy={-48} rx={15} ry={18} fill="#f0a0ae" />
      <circle cx={108} cy={-8} r={14} fill="#fff" stroke="#1f1c24" strokeWidth={2} />
      <circle cx={111} cy={-7} r={9} fill="#0e0e12" />
      <circle cx={114} cy={-11} r={3.5} fill="#fff" />
      <g stroke="#e8e4ee" strokeWidth={2.2} strokeLinecap="round" opacity={0.9}>
        <path d={`M 140 12 L 196 ${-4 + bigote}`} /><path d={`M 140 16 L 200 ${16 + bigote}`} /><path d={`M 140 20 L 192 ${36 + bigote}`} />
        <path d={`M 136 14 L 186 ${-14 + bigote}`} />
      </g>
    </g>
  );
};

const Llama: React.FC<{ x: number; y: number; s: number; t: number; seed: number }> = ({ x, y, s, t, seed }) => {
  const f = 1 + Math.sin(t * 23 + seed) * 0.08 + Math.sin(t * 37 + seed * 2) * 0.05;
  const sw = Math.sin(t * 11 + seed) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * f})`}>
      <circle cx={0} cy={-24} r={110} fill="url(#c0halo)" />
      <path d={`M 0 -70 C ${20 + sw} -34 18 -6 0 6 C -18 -6 ${-20 + sw} -34 0 -70 Z`} fill="#ff8a1a" />
      <path d={`M 0 -58 C ${14 + sw} -30 13 -6 0 2 C -13 -6 ${-14 + sw} -30 0 -58 Z`} fill="#ffc23a" />
      <path d={`M 0 -38 C ${7 + sw} -20 7 -5 0 0 C -7 -5 ${-7 + sw} -20 0 -38 Z`} fill="#fff6d0" />
      <rect x={-1.5} y={-6} width={3} height={10} fill="#3a2a1a" />
    </g>
  );
};

// borde superior de la manta (por tramos) para sembrar el pelo adentro
const BORDE: [number, number][] = [[120, 735], [300, 640], [560, 600], [760, 568], [900, 560], [1100, 566], [1300, 625], [1380, 760], [1420, 941]];
const bordeY = (x: number) => {
  for (let i = 0; i < BORDE.length - 1; i++) {
    const [x0, y0] = BORDE[i], [x1, y1] = BORDE[i + 1];
    if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return 941;
};
const MANTA = `M ${BORDE.map((p) => p.join(" ")).join(" L ")} L 1420 941 L 120 941 Z`;
const PELO = ["#4a3628", "#6e5242", "#8a6c58", "#a88a72", "#5c4434", "#c2a58c", "#3a2a20"];

export const Cuadro0: React.FC<{ t: number }> = ({ t }) => {
  if (t >= C0_FIN) return null;
  const ent = interpolate(t, [2.2, 3.25], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const zoom = 1 + 0.06 * interpolate(t, [0, 2.2], [0, 1], cl) + 7 * ent;
  const fx = 215, fy = 330;
  const op = interpolate(t, [2.85, 3.3], [1, 0], cl);
  const tiembla = Math.sin(t * 55) * 3.2;
  const pulso = 0.6 + 0.4 * Math.abs(Math.sin(t * 9));
  const brillo = 1 + Math.sin(t * 19) * 0.05 + Math.sin(t * 31) * 0.03;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="c0halo"><stop offset="0" stopColor="#ffcf66" stopOpacity={0.6} /><stop offset="0.4" stopColor="#ffa040" stopOpacity={0.18} /><stop offset="1" stopColor="#ffa040" stopOpacity={0} /></radialGradient>
          <radialGradient id="c0calido" cx="0.55" cy="0.4" r="0.55"><stop offset="0" stopColor="#ffb060" stopOpacity={0.55} /><stop offset="0.6" stopColor="#ff8a3a" stopOpacity={0.15} /><stop offset="1" stopColor="#ff8a3a" stopOpacity={0} /></radialGradient>
          <radialGradient id="c0frio" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#6fb8ff" stopOpacity={0.45} /><stop offset="1" stopColor="#2a5aa8" stopOpacity={0} /></radialGradient>
          <linearGradient id="c0cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#081248" /><stop offset="0.6" stopColor="#1d3f9a" /><stop offset="1" stopColor="#3b72d6" /></linearGradient>
          <radialGradient id="c0luna"><stop offset="0" stopColor="#ffffff" stopOpacity={0.95} /><stop offset="0.35" stopColor="#cfe2ff" stopOpacity={0.5} /><stop offset="1" stopColor="#9fc4ff" stopOpacity={0} /></radialGradient>
          <radialGradient id="c0casco" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#fff0a8" /><stop offset="0.35" stopColor="#f4bf3a" /><stop offset="1" stopColor="#9a6408" /></radialGradient>
          <radialGradient id="c0cara" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stopColor="#ffe2c4" /><stop offset="0.75" stopColor="#ffc89e" /><stop offset="1" stopColor="#e6a57a" /></radialGradient>
          <linearGradient id="c0piel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9b7a60" /><stop offset="0.5" stopColor="#6b4b38" /><stop offset="1" stopColor="#3a281d" /></linearGradient>
          <radialGradient id="c0rata" cx="0.45" cy="0.25" r="0.8"><stop offset="0" stopColor="#6d6875" /><stop offset="0.6" stopColor="#3e3a45" /><stop offset="1" stopColor="#25222b" /></radialGradient>
          <linearGradient id="c0hielo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor="#bfe4ff" /><stop offset="1" stopColor="#5aa8ee" /></linearGradient>
          <linearGradient id="c0madera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a250f" /><stop offset="0.35" stopColor="#a8682e" /><stop offset="0.55" stopColor="#8a4f22" /><stop offset="1" stopColor="#3e1f0b" /></linearGradient>
          <linearGradient id="c0maderaH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8763a" /><stop offset="0.5" stopColor="#8a4f22" /><stop offset="1" stopColor="#4a250f" /></linearGradient>
          <linearGradient id="c0cort" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a0a16" /><stop offset="0.3" stopColor="#b3203a" /><stop offset="0.5" stopColor="#7a1020" /><stop offset="0.75" stopColor="#c02842" /><stop offset="1" stopColor="#5a0a16" /></linearGradient>
          <linearGradient id="c0peltre" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a3a42" /><stop offset="0.35" stopColor="#c9c9d2" /><stop offset="0.55" stopColor="#7a7a86" /><stop offset="1" stopColor="#2a2a30" /></linearGradient>
          <linearGradient id="c0cera" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9c08a" /><stop offset="0.4" stopColor="#fff4d6" /><stop offset="1" stopColor="#c9a868" /></linearGradient>
          <linearGradient id="c0almo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d22a44" /><stop offset="1" stopColor="#7a0f20" /></linearGradient>
          <linearGradient id="c0viento" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#bfe8ff" stopOpacity={0.95} /><stop offset="1" stopColor="#4aa0ff" stopOpacity={0} /></linearGradient>
          <clipPath id="c0vent"><path d="M 40 560 L 40 300 Q 40 180 190 170 Q 340 180 340 300 L 340 560 Z" /></clipPath>
          <clipPath id="c0manta"><path d={MANTA} /></clipPath>
        </defs>
        <g transform={`translate(${fx + (W / 2 - fx) * ent} ${fy + (H / 2 - fy) * ent}) scale(${zoom}) translate(${-fx} ${-fy})`}>
          {/* ── fondo: piedra fría a la izquierda, ladrillo cálido detrás de la cama ── */}
          <rect x={0} y={0} width={W} height={H} fill="#141a33" />
          <Piedras x={0} y={0} w={600} h={640} bw={118} bh={64} a="#16213f" b="#2c3c66" junta="#080c20" luz="#7f9ad0" seed={1} />
          <Piedras x={560} y={0} w={640} h={360} bw={92} bh={48} a="#3a2a3a" b="#5a3a3a" junta="#1a1020" luz="#ffb070" seed={5} />
          <Piedras x={1180} y={0} w={200} h={720} bw={86} bh={46} a="#6a3a22" b="#a8683a" junta="#2a1208" luz="#ffd08a" seed={2} />
          <rect x={0} y={0} width={W} height={H} fill="url(#c0calido)" opacity={brillo} />
          {/* ── ventana: noche de luna con el castillo nevado ── */}
          <g clipPath="url(#c0vent)">
            <rect x={30} y={160} width={320} height={410} fill="url(#c0cielo)" />
            {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={50 + rnd(i + 300) * 290} cy={185 + rnd(i + 400) * 150} r={1.2 + rnd(i + 500) * 1.8} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i))} />)}
            <circle cx={180} cy={370} r={95} fill="url(#c0luna)" />
            <circle cx={180} cy={370} r={38} fill="#f4f7ff" />
            <circle cx={166} cy={358} r={8} fill="#cdd8f2" /><circle cx={194} cy={384} r={6} fill="#cdd8f2" /><circle cx={190} cy={352} r={4} fill="#cdd8f2" />
            <g fill="#121845">
              <rect x={60} y={440} width={280} height={140} />
              <rect x={78} y={392} width={56} height={110} />
              {[78, 92, 106, 120].map((q) => <rect key={q} x={q} y={380} width={10} height={14} />)}
              <rect x={215} y={345} width={46} height={150} /><path d="M 208 348 L 238 282 L 268 348 Z" />
              <rect x={150} y={410} width={36} height={60} /><path d="M 146 412 L 168 376 L 190 412 Z" />
              <rect x={286} y={405} width={40} height={90} />{[286, 300, 314].map((q) => <rect key={q} x={q} y={394} width={9} height={12} />)}
              {Array.from({ length: 14 }, (_, i) => <rect key={i} x={60 + i * 20} y={428} width={11} height={14} />)}
            </g>
            <path d="M 238 282 L 238 262 L 256 268 L 238 274" fill="#c02842" />
            {[[100, 410], [120, 440], [232, 370], [244, 410], [165, 430], [305, 430], [90, 470], [260, 470]].map(([x, y], i) => <rect key={i} x={x} y={y} width={7} height={11} rx={3} fill="#ffcc55" opacity={0.65 + 0.35 * Math.sin(t * 5 + i)} />)}
            <path d="M 76 392 L 136 392 L 136 398 L 76 398 Z M 210 346 L 266 346 L 262 354 L 214 354 Z M 60 440 L 340 440 L 340 446 L 60 446 Z" fill="#e8f0ff" opacity={0.85} />
            <path d="M 30 525 Q 120 500 200 515 Q 280 502 350 518 L 350 570 L 30 570 Z" fill="#e3ecff" />
            <path d="M 30 540 Q 120 525 200 535 Q 280 524 350 538" stroke="#b8cdf5" strokeWidth={4} fill="none" />
            {Array.from({ length: 36 }, (_, i) => {
              const x0 = 30 + rnd(i + 600) * 320, v = 55 + rnd(i + 700) * 80;
              const y = 160 + ((rnd(i + 800) * 410 + t * v) % 410);
              return <circle key={i} cx={x0 + Math.sin(t * 2 + i) * 10} cy={y} r={1.8 + rnd(i + 900) * 2.6} fill="#fff" opacity={0.9} />;
            })}
          </g>
          {/* marco de piedra de la ventana y alféizar con nieve */}
          {Array.from({ length: 11 }, (_, i) => {
            const a = Math.PI + (i / 10) * Math.PI;
            const cx = 190 + Math.cos(a) * 160, cy = 300 + Math.sin(a) * 125;
            return <rect key={i} x={cx - 18} y={cy - 14} width={36} height={28} rx={5} fill={i % 2 ? "#4a5f96" : "#3a4c80"} stroke="#141c40" strokeWidth={3} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`} />;
          })}
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={14} y={300 + i * 52} width={30} height={46} rx={4} fill={i % 2 ? "#3a4c80" : "#4a5f96"} stroke="#141c40" strokeWidth={3} />)}
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={336} y={300 + i * 52} width={30} height={46} rx={4} fill={i % 2 ? "#4a5f96" : "#3a4c80"} stroke="#141c40" strokeWidth={3} />)}
          <rect x={10} y={552} width={372} height={32} rx={6} fill="#3a4a7a" stroke="#141c40" strokeWidth={3} />
          <path d="M 10 556 Q 70 536 150 548 Q 240 530 300 546 Q 350 538 382 552 L 382 562 L 10 562 Z" fill="#f2f7ff" />
          {[40, 120, 210, 300].map((q, i) => <path key={i} d={`M ${q - 7} 582 L ${q + 7} 582 L ${q} ${606 + (i % 2) * 14} Z`} fill="url(#c0hielo)" />)}
          <ellipse cx={200} cy={420} rx={330} ry={300} fill="url(#c0frio)" />
          {/* ── cortinas de terciopelo con pliegues y fleco dorado ── */}
          <path d="M 0 0 L 74 0 Q 64 120 34 225 L 0 236 Z" fill="url(#c0cort)" />
          <path d="M 380 0 L 565 0 Q 548 210 568 478 Q 470 488 418 466 Q 444 250 380 0 Z" fill="url(#c0cort)" />
          {[425, 470, 515].map((q, i) => <path key={i} d={`M ${q} 0 Q ${q + 22} 230 ${q + 4 + i * 10} 470`} stroke="#4a0812" strokeWidth={7} fill="none" opacity={0.6} />)}
          {[448, 495, 540].map((q, i) => <path key={i} d={`M ${q} 0 Q ${q + 18} 230 ${q + 4 + i * 10} 470`} stroke="#e0485e" strokeWidth={4} fill="none" opacity={0.45} />)}
          <path d="M 420 466 Q 470 490 568 478" stroke="#d9a63a" strokeWidth={8} fill="none" strokeDasharray="4 4" />
          <path d="M 892 0 L 1245 0 L 1245 365 Q 1070 388 892 362 Z" fill="url(#c0cort)" />
          {[930, 1010, 1130, 1200].map((q, i) => <path key={i} d={`M ${q} 0 Q ${q + 12} 180 ${q - 6} 368`} stroke="#4a0812" strokeWidth={8} fill="none" opacity={0.5} />)}
          {/* estandarte azul con flores de lis */}
          <path d="M 972 18 L 1098 18 L 1098 330 L 1035 300 L 972 330 Z" fill="#1a2c78" stroke="#d9a63a" strokeWidth={7} />
          <path d="M 984 30 L 1086 30 L 1086 314 L 1035 288 L 984 314 Z" fill="none" stroke="#2c44a0" strokeWidth={6} />
          <rect x={960} y={8} width={150} height={16} rx={6} fill="#5a3416" stroke="#2e170a" strokeWidth={3} />
          {[[1035, 150, 1.45], [930, 255, 0.95], [1125, 232, 0.95]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <g fill="#f1c24a" stroke="#8a5a08" strokeWidth={2.5}>
                <path d="M 0 -52 C 20 -30 19 -4 0 16 C -19 -4 -20 -30 0 -52 Z" />
                <path d="M -6 0 C -30 -22 -58 -6 -42 22 C -33 8 -18 6 -6 12 Z" /><path d="M 6 0 C 30 -22 58 -6 42 22 C 33 8 18 6 6 12 Z" />
                <rect x={-28} y={14} width={56} height={11} rx={3} /><path d="M -6 25 L 6 25 L 0 50 Z" />
              </g>
              <path d="M -3 -40 C 6 -26 6 -8 -2 6" stroke="#fff3c4" strokeWidth={3} fill="none" opacity={0.7} />
            </g>
          ))}
          <path d="M 1150 0 L 1238 0 L 1232 425 Q 1190 436 1158 414 Z" fill="url(#c0cort)" />
          {/* candelabro de hierro y escudo */}
          <g>
            <path d="M 1290 232 Q 1292 262 1258 264 L 1252 205 M 1290 232 Q 1302 200 1327 206 L 1330 192" stroke="#2a1d10" strokeWidth={9} fill="none" strokeLinecap="round" />
            <rect x={1281} y={225} width={18} height={64} rx={4} fill="#2a1d10" /><circle cx={1290} cy={292} r={9} fill="#2a1d10" />
            <rect x={1243} y={198} width={22} height={8} rx={3} fill="#3a2a1a" /><rect x={1318} y={186} width={24} height={8} rx={3} fill="#3a2a1a" />
            <rect x={1246} y={156} width={16} height={44} rx={3} fill="url(#c0cera)" /><rect x={1322} y={136} width={17} height={52} rx={3} fill="url(#c0cera)" />
            <Llama x={1254} y={154} s={0.6} t={t} seed={3} /><Llama x={1330} y={134} s={0.65} t={t} seed={5} />
          </g>
          <path d="M 1258 300 L 1354 300 L 1354 382 Q 1354 434 1306 450 Q 1258 434 1258 382 Z" fill="#9a1426" stroke="#d9a63a" strokeWidth={7} />
          <path d="M 1270 312 L 1342 312 L 1342 380 Q 1342 422 1306 436 Q 1270 422 1270 380 Z" fill="none" stroke="#e8b84a" strokeWidth={3} opacity={0.6} />
          <path d="M 1282 352 C 1290 330 1310 324 1322 336 C 1334 346 1330 360 1322 368 L 1330 392 L 1318 388 L 1312 404 L 1302 392 L 1288 404 L 1290 384 C 1280 378 1278 364 1282 352 Z" fill="#f1c24a" stroke="#8a5a08" strokeWidth={2.5} />
          <circle cx={1314} cy={344} r={3} fill="#8a5a08" />
          {/* ── torre helada a la derecha: arco, puerta y la letrina ── */}
          <Piedras x={1372} y={0} w={300} h={941} bw={104} bh={62} a="#2f4a80" b="#5f80b4" junta="#121c3a" luz="#cfe6ff" seed={4} escarcha />
          <path d="M 1468 655 L 1468 300 Q 1468 196 1545 192 Q 1622 196 1622 300 L 1622 655 Z" fill="#0a1028" />
          <path d="M 1490 655 L 1490 310 Q 1490 222 1545 218 Q 1600 222 1600 310 L 1600 655 Z" fill="#141c3a" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI + (i / 8) * Math.PI;
            const cx = 1545 + Math.cos(a) * 84, cy = 300 + Math.sin(a) * 100;
            return <rect key={i} x={cx - 16} y={cy - 12} width={32} height={24} rx={5} fill={i % 2 ? "#a8c6ec" : "#8fb0dc"} stroke="#1c2a52" strokeWidth={3} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`} />;
          })}
          <path d="M 1600 330 L 1672 300 L 1672 642 L 1600 628 Z" fill="url(#c0maderaH)" stroke="#2e170a" strokeWidth={6} />
          <Veta x={1604} y={330} w={64} h={290} seed={77} vertical />
          <rect x={1606} y={398} width={66} height={14} rx={3} fill="#26262c" /><rect x={1606} y={540} width={66} height={14} rx={3} fill="#26262c" />
          {[1620, 1650].map((q) => [405, 547].map((r) => <circle key={`${q}${r}`} cx={q} cy={r} r={3.5} fill="#7a7a86" />))}
          {/* asiento de piedra de la letrina con el agujero */}
          <path d="M 1400 612 Q 1525 568 1645 612 L 1645 705 Q 1525 735 1400 705 Z" fill="#6f8cbc" stroke="#1c2a52" strokeWidth={6} />
          {[1430, 1480, 1530, 1580, 1625].map((q, i) => <path key={i} d={`M ${q} ${625 - (i === 2 ? 16 : 6)} L ${q} ${712 + (i === 2 ? 10 : 4)}`} stroke="#1c2a52" strokeWidth={4} opacity={0.6} />)}
          <ellipse cx={1525} cy={614} rx={74} ry={22} fill="#04060f" />
          <ellipse cx={1525} cy={620} rx={60} ry={14} fill="#000" />
          <path d="M 1400 614 Q 1525 572 1645 614" stroke="#f2f8ff" strokeWidth={12} fill="none" strokeLinecap="round" />
          {[1388, 1412, 1440, 1470, 1500, 1556, 1588, 1618, 1640].map((x, i) => <path key={i} d={`M ${x - 10} 700 Q ${x} 708 ${x + 10} 700 L ${x + 1} ${748 + rnd(i + 50) * 50} Z`} fill="url(#c0hielo)" stroke="#9fd0ff" strokeWidth={1.5} />)}
          {[1378, 1402, 1430, 1458, 1600, 1630, 1655].map((x, i) => <path key={i} d={`M ${x - 11} 0 L ${x + 11} 0 L ${x} ${60 + rnd(i + 70) * 80} Z`} fill="url(#c0hielo)" stroke="#9fd0ff" strokeWidth={1.5} />)}
          <path d="M 1372 132 Q 1520 112 1672 118 L 1672 146 Q 1520 140 1372 160 Z" fill="#f2f8ff" />
          {[1392, 1420, 1452, 1580, 1612, 1646].map((x, i) => <path key={i} d={`M ${x - 9} 146 L ${x + 9} 146 L ${x} ${190 + rnd(i + 90) * 50} Z`} fill="url(#c0hielo)" />)}
          <path d="M 1430 860 Q 1520 840 1560 850 L 1672 840 L 1672 880 Q 1540 880 1430 900 Z" fill="#eaf4ff" opacity={0.9} />
          {Array.from({ length: 10 }, (_, i) => {
            const x = 1390 + rnd(i + 120) * 270, y = 40 + rnd(i + 130) * 760, k = Math.max(0, Math.sin(t * 4 + i * 1.7));
            return <path key={i} d={`M ${x} ${y - 10 * k} L ${x + 2} ${y - 2} L ${x + 10 * k} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 10 * k} L ${x - 2} ${y + 2} L ${x - 10 * k} ${y} L ${x - 2} ${y - 2} Z`} fill="#fff" opacity={0.9} />;
          })}
          <ellipse cx={1540} cy={480} rx={260} ry={380} fill="url(#c0frio)" />
          {/* viento helado que sube por la letrina */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const u = (t * 0.8 + i * 0.17) % 1;
            const y = 380 + i * 42, sh = u * 140;
            return <path key={i} d={`M ${1660 - sh} ${y} C ${1580 - sh} ${y - 36} ${1490 - sh} ${y + 34} ${1390 - sh} ${y - 14}`} stroke="url(#c0viento)" strokeWidth={13 - i * 1.4} fill="none" strokeLinecap="round" opacity={0.85 * Math.sin(u * Math.PI)} />;
          })}
          {Array.from({ length: 22 }, (_, i) => {
            const u = (t * (0.35 + rnd(i + 140) * 0.3) + rnd(i + 150)) % 1;
            return <circle key={i} cx={1650 - u * 420} cy={360 + rnd(i + 160) * 300 + Math.sin(t * 3 + i) * 14} r={2 + rnd(i + 170) * 3} fill="#fff" opacity={0.85 * Math.sin(u * Math.PI)} />;
          })}
          {/* ── la cama: cabecero tallado, postes torneados ── */}
          <rect x={540} y={360} width={700} height={250} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={8} />
          {[600, 700, 800, 900, 1000, 1100].map((x, i) => (
            <g key={x}>
              <rect x={x} y={386} width={72} height={196} rx={8} fill="#6a3a1a" stroke="#2e170a" strokeWidth={4} />
              <rect x={x + 8} y={394} width={56} height={180} rx={6} fill="none" stroke="#a8682e" strokeWidth={3} opacity={0.6} />
              <Veta x={x + 10} y={396} w={52} h={176} seed={i * 9} vertical />
            </g>
          ))}
          <rect x={518} y={328} width={744} height={42} rx={7} fill="url(#c0maderaH)" stroke="#2e170a" strokeWidth={6} />
          <path d="M 524 340 L 1256 340" stroke="#e0a060" strokeWidth={3} opacity={0.5} />
          <rect x={522} y={338} width={64} height={250} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={6} />
          {[380, 430].map((q) => <rect key={q} x={518} y={q} width={72} height={12} rx={4} fill="#a8682e" stroke="#2e170a" strokeWidth={3} />)}
          <path d="M 530 340 L 578 340 L 572 318 Q 584 300 566 288 L 560 266 L 548 288 Q 530 300 542 318 Z" fill="url(#c0madera)" stroke="#2e170a" strokeWidth={5} />
          <rect x={1178} y={238} width={74} height={364} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={6} />
          {[300, 350, 520].map((q) => <rect key={q} x={1172} y={q} width={86} height={14} rx={5} fill="#a8682e" stroke="#2e170a" strokeWidth={3} />)}
          <path d="M 1184 244 L 1246 244 L 1240 222 Q 1258 200 1232 186 L 1215 150 L 1198 186 Q 1172 200 1190 222 Z" fill="url(#c0madera)" stroke="#2e170a" strokeWidth={5} />
          <path d="M 1206 180 Q 1214 166 1222 180" stroke="#e0a060" strokeWidth={3} fill="none" />
          {/* almohadas de terciopelo con borlas */}
          <path d="M 585 478 Q 600 440 728 448 Q 768 470 758 566 Q 650 596 598 576 Z" fill="url(#c0almo)" stroke="#4a0812" strokeWidth={6} />
          <path d="M 640 500 l 10 -18 l 10 18 l -10 18 z" fill="#e3b440" opacity={0.85} />
          <path d="M 1036 462 Q 1182 440 1214 484 Q 1220 566 1184 606 Q 1080 606 1042 566 Z" fill="url(#c0almo)" stroke="#4a0812" strokeWidth={6} />
          <path d="M 1110 505 l 12 -20 l 12 20 l -12 20 z" fill="#e3b440" opacity={0.85} />
          {[[592, 482], [756, 562], [1214, 486], [1186, 604]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={7} fill="#e3b440" /><path d={`M ${x} ${y + 6} l -5 16 l 10 0 z`} fill="#c9962a" /></g>)}
          <path d="M 1148 512 Q 1218 500 1228 542 L 1222 624 L 1158 614 Z" fill="#f4eadb" stroke="#cbbca4" strokeWidth={4} />
          {/* ── el chico (vos): casco dorado, capa de piel, dientes apretados, temblando ── */}
          <g transform={`translate(${tiembla} 0)`}>
            <path d="M 724 566 Q 742 452 858 440 L 1012 440 Q 1086 468 1076 584 Z" fill="#a8182c" stroke="#4a0812" strokeWidth={5} />
            <path d="M 800 470 Q 830 520 820 580 M 1000 470 Q 990 520 1010 580" stroke="#6a0d1a" strokeWidth={6} fill="none" />
            <path d="M 736 526 Q 756 440 870 450 Q 932 482 1000 450 Q 1076 448 1070 546 Q 1010 502 940 512 Q 862 502 736 526 Z" fill="#f4efe6" stroke="#bfb19a" strokeWidth={4} />
            {Array.from({ length: 34 }, (_, i) => {
              const u = i / 33, x = 745 + u * 318, y = 470 + Math.sin(u * Math.PI) * -20 + (i % 2) * 14;
              return <path key={i} d={`M ${x} ${y} q ${rnd(i + 200) * 10 - 5} 16 ${rnd(i + 210) * 8 - 4} 30`} stroke={i % 3 ? "#d8cdb9" : "#ffffff"} strokeWidth={4} fill="none" strokeLinecap="round" />;
            })}
            <circle cx={898} cy={506} r={9} fill="#e3b440" stroke="#8a5a08" strokeWidth={2} /><circle cx={982} cy={506} r={9} fill="#e3b440" stroke="#8a5a08" strokeWidth={2} />
            <ellipse cx={835} cy={412} rx={16} ry={22} fill="#f5b48a" stroke="#c98a62" strokeWidth={3} />
            <ellipse cx={1036} cy={412} rx={16} ry={22} fill="#f5b48a" stroke="#c98a62" strokeWidth={3} />
            <ellipse cx={935} cy={398} rx={100} ry={94} fill="url(#c0cara)" stroke="#d89a70" strokeWidth={3} />
            {[860, 880, 990, 1010].map((x, i) => <path key={i} d={`M ${x} 352 q ${i < 2 ? -6 : 6} 18 ${i < 2 ? -2 : 2} 30`} stroke="#7a4a1e" strokeWidth={8} fill="none" strokeLinecap="round" />)}
            <ellipse cx={862} cy={434} rx={24} ry={14} fill="#ff8a8a" opacity={0.55} /><ellipse cx={1010} cy={434} rx={24} ry={14} fill="#ff8a8a" opacity={0.55} />
            <path d="M 852 350 Q 878 338 906 356" stroke="#6b3a1a" strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d="M 1012 350 Q 990 338 962 356" stroke="#6b3a1a" strokeWidth={8} fill="none" strokeLinecap="round" />
            <ellipse cx={884} cy={394} rx={30} ry={33} fill="#fff" stroke="#3a2a2a" strokeWidth={4} />
            <ellipse cx={966} cy={394} rx={30} ry={33} fill="#fff" stroke="#3a2a2a" strokeWidth={4} />
            <circle cx={872} cy={404} r={17} fill="#3a2414" /><circle cx={872} cy={404} r={10} fill="#0a0a0a" /><circle cx={877} cy={397} r={6} fill="#fff" /><circle cx={866} cy={410} r={2.5} fill="#fff" />
            <circle cx={954} cy={404} r={17} fill="#3a2414" /><circle cx={954} cy={404} r={10} fill="#0a0a0a" /><circle cx={959} cy={397} r={6} fill="#fff" /><circle cx={948} cy={410} r={2.5} fill="#fff" />
            <path d="M 928 408 Q 934 424 924 428" stroke="#d08a64" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M 872 446 Q 930 424 998 446 Q 1004 476 992 484 Q 932 470 878 484 Q 864 472 872 446 Z" fill="#7a1a20" stroke="#5a1418" strokeWidth={5} />
            <path d="M 878 450 Q 932 432 992 450 Q 996 472 988 478 Q 932 466 882 478 Q 872 468 878 450 Z" fill="#fffdf6" />
            <path d="M 876 464 Q 934 452 994 464 M 900 440 L 902 480 M 924 435 L 925 474 M 948 435 L 948 474 M 972 440 L 970 478" stroke="#6b5a50" strokeWidth={3} fill="none" />
            <path d="M 828 384 Q 816 258 940 252 Q 1064 258 1054 384 Q 940 342 828 384 Z" fill="url(#c0casco)" stroke="#7a4a06" strokeWidth={6} />
            <path d="M 818 380 Q 940 330 1064 380 L 1072 404 Q 940 356 810 404 Z" fill="#e0a52a" stroke="#7a4a06" strokeWidth={5} />
            {Array.from({ length: 9 }, (_, i) => { const u = i / 8; return <circle key={i} cx={826 + u * 236} cy={392 - Math.sin(u * Math.PI) * 26} r={5} fill="#fff0a8" stroke="#7a4a06" strokeWidth={2} />; })}
            <path d="M 940 254 L 940 340" stroke="#a87010" strokeWidth={6} />
            <circle cx={940} cy={248} r={15} fill="#e0a52a" stroke="#7a4a06" strokeWidth={4} />
            <path d="M 868 300 Q 900 272 950 270" stroke="#fffbe0" strokeWidth={12} fill="none" opacity={0.75} strokeLinecap="round" />
            <path d="M 1030 320 Q 1040 344 1036 370" stroke="#6fb8ff" strokeWidth={6} fill="none" opacity={0.5} />
            {[[900, 544], [976, 548]].map(([x, y], i) => (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={36} ry={26} fill="#ffd2ad" stroke="#c98a62" strokeWidth={4} />
                {[-18, -6, 6, 18].map((q) => <path key={q} d={`M ${x + q} ${y - 18} q 3 10 0 22`} stroke="#c98a62" strokeWidth={3} fill="none" />)}
              </g>
            ))}
          </g>
          {/* rayitas de temblor */}
          <g stroke="#5fb4ff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={pulso}>
            <path d="M 790 400 q 10 -10 0 -20 q -10 -10 0 -20" /><path d="M 1082 380 q 10 -10 0 -20 q -10 -10 0 -20 q 10 -10 0 -20" />
            <path d="M 722 482 q 10 -8 0 -16 q -10 -8 0 -16" /><path d="M 1104 548 q 10 -8 0 -16 q -10 -8 0 -16" />
            <path d="M 770 300 q 8 -8 0 -16" /><path d="M 1100 300 q 8 -8 0 -16" />
          </g>
          {/* ── la manta de piel: base con degradado y cientos de pelos ── */}
          <path d={MANTA} fill="url(#c0piel)" />
          <g clipPath="url(#c0manta)">
            {Array.from({ length: 950 }, (_, i) => {
              const x = 120 + rnd(i + 1000) * 1300, top = bordeY(x), y = top - 8 + rnd(i + 2000) * (960 - top);
              const len = 30 + rnd(i + 3000) * 34, d = (rnd(i + 4000) - 0.5) * 26;
              const c = PELO[Math.floor(rnd(i + 5000) * PELO.length)];
              const luzK = 1 - (y - top) / 420;
              return <path key={i} d={`M ${x} ${y} q ${d} ${len * 0.5} ${d * 0.4} ${len}`} stroke={luzK > 0.75 && i % 2 ? "#c9a98a" : c} strokeWidth={5 + rnd(i + 6000) * 4} fill="none" strokeLinecap="round" opacity={0.9} />;
            })}
            {[[700, 840], [905, 885], [1110, 800], [520, 900], [1250, 880]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={16} ry={10} fill="#1a100a" /><ellipse cx={x} cy={y - 3} rx={16} ry={6} fill="none" stroke="#b8977a" strokeWidth={3} /></g>)}
          </g>
          {Array.from({ length: 90 }, (_, i) => {
            const x = 125 + (i / 89) * 1240, y = bordeY(x);
            return <path key={i} d={`M ${x} ${y + 6} q ${(rnd(i + 7000) - 0.5) * 14} -16 ${(rnd(i + 7100) - 0.5) * 10} -26`} stroke={i % 3 ? "#c9a98a" : "#8b6a52"} strokeWidth={5} fill="none" strokeLinecap="round" />;
          })}
          <path d="M 880 865 Q 1080 834 1232 826 L 1232 941 L 846 941 Z" fill="#9a1426" />
          <path d="M 880 865 Q 1080 834 1232 826" stroke="#d9a63a" strokeWidth={6} fill="none" />
          <path d="M 1060 850 L 1080 941 M 1112 842 L 1132 941" stroke="#e3b440" strokeWidth={11} />
          {/* ── ratas sobre la manta ── */}
          <Rata x={385} y={690} s={0.7} t={t} seed={1} dx={interpolate(t, [0, 3], [0, 26])} />
          <Rata x={680} y={665} s={1.15} t={t} seed={2} dx={interpolate(t, [0, 3], [0, 34])} />
          <Rata x={1010} y={725} s={0.82} flip t={t} seed={3} dx={interpolate(t, [0, 3], [0, -28])} />
          {/* ── poste delantero y poste chico ── */}
          <rect x={1228} y={560} width={98} height={381} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={6} />
          <Veta x={1234} y={680} w={86} h={260} seed={33} vertical />
          {[620, 668].map((q) => <rect key={q} x={1218} y={q} width={118} height={30} rx={8} fill="url(#c0maderaH)" stroke="#2e170a" strokeWidth={4} />)}
          <path d="M 1236 562 L 1318 562 L 1310 536 Q 1332 512 1300 496 L 1277 450 L 1254 496 Q 1222 512 1244 536 Z" fill="url(#c0madera)" stroke="#2e170a" strokeWidth={5} />
          <path d="M 1262 500 Q 1277 478 1292 500" stroke="#e0a060" strokeWidth={4} fill="none" />
          <rect x={1368} y={772} width={48} height={170} fill="url(#c0madera)" stroke="#2e170a" strokeWidth={5} />
          <path d="M 1370 774 L 1414 774 L 1406 748 Q 1392 716 1378 748 Z" fill="url(#c0madera)" stroke="#2e170a" strokeWidth={4} />
          {/* alfombra roja con guarda */}
          <path d="M 1430 862 L 1672 842 L 1672 941 L 1440 941 Z" fill="#a3172a" stroke="#d9a63a" strokeWidth={6} />
          <path d="M 1452 878 L 1672 860 M 1458 900 L 1672 884" stroke="#e3b440" strokeWidth={4} strokeDasharray="10 8" />
          {/* ── mesita: baúl, candelabro con vela chorreada, jarra de peltre ── */}
          <rect x={0} y={790} width={424} height={160} fill="url(#c0maderaH)" stroke="#2e170a" strokeWidth={6} />
          <Veta x={4} y={800} w={410} h={140} seed={55} />
          <rect x={0} y={768} width={434} height={30} rx={4} fill="#a8682e" stroke="#2e170a" strokeWidth={5} />
          <path d="M 2 774 L 432 774" stroke="#e0a060" strokeWidth={3} opacity={0.6} />
          <rect x={60} y={798} width={22} height={150} fill="#2a2a30" /><rect x={330} y={798} width={22} height={150} fill="#2a2a30" />
          {[70, 340].map((q) => [826, 880, 930].map((r) => <circle key={`${q}${r}`} cx={q + 1} cy={r} r={4} fill="#8a8a96" />))}
          <rect x={186} y={824} width={44} height={36} rx={4} fill="#3a3a42" stroke="#1a1a1e" strokeWidth={3} /><circle cx={208} cy={842} r={6} fill="#8a8a96" />
          <path d="M 38 822 L 162 822 L 142 800 L 58 800 Z" fill="#8a6a2a" stroke="#3a2a10" strokeWidth={4} />
          <rect x={88} y={684} width={24} height={122} fill="#7a5a28" stroke="#3a2a10" strokeWidth={4} />
          {[720, 760].map((q) => <ellipse key={q} cx={100} cy={q} rx={18} ry={7} fill="#9a7a38" stroke="#3a2a10" strokeWidth={3} />)}
          <path d="M 46 692 Q 100 670 154 692 L 142 704 L 58 704 Z" fill="#b08a40" stroke="#3a2a10" strokeWidth={4} />
          <path d="M 66 692 L 66 596 Q 100 584 134 596 L 134 692 Z" fill="url(#c0cera)" stroke="#bfa070" strokeWidth={3} />
          <path d="M 70 600 Q 78 640 72 668 Q 70 676 76 680" stroke="#fff4d6" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M 122 600 Q 128 626 124 640" stroke="#e8d6a8" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 60 690 Q 64 704 58 712 M 140 690 Q 146 700 142 708" stroke="#f3e2b5" strokeWidth={6} fill="none" strokeLinecap="round" />
          <Llama x={100} y={590} s={1.3} t={t} seed={1} />
          <path d="M 218 790 L 228 692 Q 236 662 262 660 L 302 660 Q 324 662 328 692 L 338 790 Z" fill="url(#c0peltre)" stroke="#1e1e24" strokeWidth={5} />
          <path d="M 226 720 L 332 720 M 222 760 L 336 760" stroke="#1e1e24" strokeWidth={4} />
          <path d="M 334 698 Q 382 706 352 768" stroke="#2a2a30" strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d="M 238 662 Q 276 626 318 662 Z" fill="#9a9aa6" stroke="#1e1e24" strokeWidth={4} />
          <circle cx={278} cy={636} r={8} fill="#7a7a86" stroke="#1e1e24" strokeWidth={3} />
          <path d="M 250 680 L 246 776" stroke="#fff" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
          <path d="M 228 666 L 212 650 L 236 660" fill="#9a9aa6" stroke="#1e1e24" strokeWidth={3} />
          <circle cx={100} cy={570} r={300} fill="url(#c0halo)" opacity={0.45 * brillo} />
          {/* polvo dorado flotando en la luz de las velas */}
          {Array.from({ length: 24 }, (_, i) => {
            const u = (t * (0.08 + rnd(i + 8000) * 0.1) + rnd(i + 8100)) % 1;
            return <circle key={i} cx={40 + rnd(i + 8200) * 360 + Math.sin(t * 1.5 + i) * 12} cy={760 - u * 420} r={1.5 + rnd(i + 8300) * 2.5} fill="#ffd98a" opacity={0.8 * Math.sin(u * Math.PI)} />;
          })}
          {Array.from({ length: 14 }, (_, i) => {
            const u = (t * (0.06 + rnd(i + 8400) * 0.08) + rnd(i + 8500)) % 1;
            return <circle key={i} cx={1180 + rnd(i + 8600) * 180} cy={300 - u * 260} r={1.4 + rnd(i + 8700) * 2} fill="#ffd98a" opacity={0.7 * Math.sin(u * Math.PI)} />;
          })}
        </g>
      </svg>
    </div>
  );
};
