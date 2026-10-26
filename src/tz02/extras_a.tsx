// tz02 · helpers nuevos de la vuelta 3 para planos1 (Q01-Q42). No tocar extras.tsx (lo usa también planos2).
import React from "react";
import { interpolate, random } from "remotion";
import { golpe, useF } from "../anikit/camara";
import { F_HUD } from "../anikit/pantalla";
import { cl, lerp, Lienzo, ManoGrande, MiniPalacio, suave, usePop } from "./extras";

// rótulo con PLACA oscura (se lee sobre los lavarropas blancos y el palacio claro)
export const Placa: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number; fondo?: string; borde?: string }> = ({ texto, x, y, desde, hasta = 1e9, color = "#f4efe6", tam = 40, fondo = "rgba(16,14,20,0.82)", borde }) => {
  const f = useF();
  const s = usePop(desde);
  if (f < desde) return null;
  const o = Math.min(s, interpolate(f, [hasta - 8, hasta], [1, 0], cl));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * s})`, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color, whiteSpace: "nowrap",
      background: fondo, padding: `${tam * 0.22}px ${tam * 0.55}px`, borderRadius: tam * 0.4, border: borde ? `3px solid ${borde}` : undefined, boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>{texto}</div>
  );
};

// sacudón de cámara (golpe, puño, bolso que cae): envuelve el plano entero
export const Sacude: React.FC<{ f0: number[]; amp?: number; children: React.ReactNode }> = ({ f0, amp = 9, children }) => {
  const f = useF();
  let dx = 0, dy = 0;
  for (const g of f0) { dy += golpe(f, g, amp); dx += golpe(f, g + 1, amp * 0.5); }
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px,${dy}px)` }}>{children}</div>;
};

// tren elevado que cruza EN PRIMER TÉRMINO por arriba del cuadro (pantalla), con ventanas encendidas y barrido
export const TrenFrente: React.FC<{ desde: number; y?: number; vel?: number; alto?: number }> = ({ desde, y = 40, vel = 70, alto = 230 }) => {
  const f = useF();
  if (f < desde) return null;
  const x0 = 1920 + 40 - (f - desde) * vel; // entra por la derecha
  const L = 1100;
  if (x0 + 4 * L < -100) return null;
  return (
    <Lienzo>
      <g style={{ filter: "blur(2.5px)" }}>
        <rect x={-50} y={y + alto} width={2020} height={34} fill="#16181d" />
        {Array.from({ length: 4 }).map((_, k) => {
          const cx = x0 + k * (L + 30);
          return (
            <g key={k}>
              <rect x={cx} y={y} width={L} height={alto} rx={26} fill="#9aa2ae" stroke="#2a2e36" strokeWidth={8} />
              <rect x={cx} y={y + alto - 46} width={L} height={20} fill="#2a5aa0" />
              {Array.from({ length: 7 }).map((_, j) => <rect key={j} x={cx + 40 + j * 150} y={y + 40} width={110} height={90} rx={10} fill={random(`tw${k}${j}`) > 0.3 ? "#ffe9b0" : "#4a525e"} />)}
            </g>
          );
        })}
      </g>
      {/* estelas de velocidad */}
      {Array.from({ length: 8 }).map((_, k) => <rect key={k} x={((x0 + k * 260) % 2000 + 2000) % 2000} y={y + 20 + k * 26} width={180} height={4} fill="#ffffff" opacity={0.25} />)}
    </Lienzo>
  );
};

// el lavadero se DESARMA por capas: cuadritos de luz que se encienden desde el farol (x,y de pantalla) hacia afuera;
// `capas` = [yDesde, yHasta, retraso] por franja (lavarropas → sillas/piso → personajes)
export const Desarma: React.FC<{ x: number; y: number; desde: number; dur: number; color?: string; capas: [number, number, number][] }> = ({ x, y, desde, dur, color = "#fff2d0", capas }) => {
  const f = useF();
  if (f < desde) return null;
  const T = 48;
  const celdas: React.ReactNode[] = [];
  for (let gy = 0; gy < 1080; gy += T) for (let gx = 0; gx < 1920; gx += T) {
    const cy = gy + T / 2, cx = gx + T / 2;
    let ret = 0.6;
    for (const [a, b, r] of capas) if (cy >= a && cy < b) ret = r;
    const d = Math.hypot(cx - x, cy - y) / 2200;
    const t0 = desde + (ret * 0.6 + d * 0.4 + random(`ds${gx}_${gy}`) * 0.12) * dur;
    const u = lerp(f, t0, t0 + 8, 0, 1);
    if (u <= 0) continue;
    celdas.push(<rect key={`${gx}_${gy}`} x={gx + (T / 2) * (1 - u)} y={gy + (T / 2) * (1 - u)} width={T * u + 1} height={T * u + 1} fill={color} opacity={Math.min(1, u)} />);
  }
  return <Lienzo>{celdas}</Lienzo>;
};

// cronómetro gráfico de pantalla completa: «24:00:00» que corre + el tel que vuelve «MAÑANA 3:00 AM»
export const Reloj24: React.FC<{ desde: number; dur: number }> = ({ desde, dur }) => {
  const f = useF();
  const s = usePop(desde, 14, 160);
  const t = Math.max(0, 24 * 3600 - Math.max(0, f - desde - 6) * 410);
  const p = (n: number) => (Math.floor(n) < 10 ? "0" : "") + Math.floor(n);
  const vuelve = lerp(f, desde + dur * 0.55, desde + dur * 0.85, 0, 1);
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #2a2530, #0d0c10)" }}>
      <Lienzo>
        <g transform={`translate(960,470) scale(${0.85 + 0.15 * s})`}>
          <circle r={300} fill="none" stroke="#2f2a36" strokeWidth={26} />
          <circle r={300} fill="none" stroke="#ff6a2b" strokeWidth={26} strokeDasharray={`${(t / 86400) * 1885} 1885`} transform="rotate(-90)" strokeLinecap="round" />
          {Array.from({ length: 24 }).map((_, k) => <line key={k} x1={0} y1={-262} x2={0} y2={k % 6 ? -248 : -236} stroke="#6a6270" strokeWidth={6} transform={`rotate(${k * 15})`} />)}
        </g>
        {/* el tel vuelve a la mano de Leo: flecha curva desde el reloj */}
        <g opacity={vuelve}>
          <path d="M1290,560 Q1500,700 1640,560" stroke="#f4efe6" strokeWidth={10} fill="none" strokeDasharray={`${vuelve * 420} 600`} strokeLinecap="round" />
          <g transform={`translate(${1290 + vuelve * 350},${560 - Math.sin(vuelve * Math.PI) * 90}) rotate(${-20 + vuelve * 30})`}>
            <rect x={-38} y={-70} width={76} height={140} rx={14} fill="#15171c" stroke="#f4efe6" strokeWidth={5} />
          </g>
        </g>
      </Lienzo>
      <div style={{ position: "absolute", left: 960, top: 470, transform: "translate(-50%,-50%)", textAlign: "center", fontFamily: F_HUD, opacity: s }}>
        <div style={{ fontSize: 120, color: "#ff6a2b", fontWeight: 600, fontVariantNumeric: "tabular-nums", textShadow: "0 0 30px #ff6a2b66" }}>{p(t / 3600)}:{p((t % 3600) / 60)}:{p(t % 60)}</div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 850, transform: "translate(-50%,-50%)", fontFamily: F_HUD, fontWeight: 600, fontSize: 52, letterSpacing: 6, color: "#f4efe6", opacity: lerp(f, desde + 10, desde + 18, 0, 1), background: "rgba(255,255,255,0.08)", padding: "10px 34px", borderRadius: 20 }}>TOMORROW · 3:00 AM</div>
      <div style={{ position: "absolute", left: 1640, top: 690, transform: "translate(-50%,-50%)", fontFamily: F_HUD, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: "#ffd38a", opacity: vuelve, whiteSpace: "nowrap" }}>BACK TO LEO</div>
    </div>
  );
};

// inserto de la MANDARINA: las toallas se van, la mandarina entra rodando y la cáscara sale en UNA espiral que crece y se balancea.
// p = 0..1 cuánto se peló (lo maneja el plano); cuadro absoluto f para el giro/balanceo.
export const InsertoMandarina: React.FC<{ f: number; p: number; toallas?: number; entra?: number; zoom?: number }> = ({ f, p, toallas = 1, entra = 1, zoom = 1 }) => {
  const CX = 960 + (1 - suave(entra)) * 1300, CY = 430;
  const rot = f * 1.6 + (1 - entra) * -600;
  const R = 150;
  // punto donde se está pelando: da vuelta alrededor de la mandarina
  const a = (-30 + p * 1080) * (Math.PI / 180);
  const px = CX + Math.cos(a) * R, py = CY + Math.sin(a) * R * 0.55 - 40;
  const L = 60 + p * 560;
  const pts: string[] = [];
  const N = 70;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const yy = py + t * L;
    const xx = px + Math.sin(t * 12 + f / 7) * (10 + 40 * t) + Math.sin(f / 23) * 30 * t;
    pts.push(`${xx},${yy}`);
  }
  const hx = px + Math.cos(a) * 40, hy = py - 10;
  return (
    <Lienzo>
      <defs>
        <radialGradient id="farolIM" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc46a" stopOpacity={0.6} /><stop offset="1" stopColor="#ffc46a" stopOpacity={0} /></radialGradient>
        <clipPath id="peladoIM"><path d={`M0,0 L${Math.cos(0) * 200},${Math.sin(0) * 200} A200,200 0 ${p > 0.5 ? 1 : 0} 1 ${Math.cos(p * 2 * Math.PI - 0.001) * 200},${Math.sin(p * 2 * Math.PI - 0.001) * 200} Z`} /></clipPath>
      </defs>
      <g transform={`translate(960,540) scale(${zoom}) translate(-960,-540)`}>
        <rect x={-400} y={-300} width={2720} height={1680} fill="#2a2620" />
        <circle cx={1500} cy={260} r={560} fill="url(#farolIM)" />
        <rect x={-400} y={780} width={2720} height={600} fill="#55524a" />
        <rect x={-400} y={780} width={2720} height={10} fill="#6a675e" />
        {/* toallas dobladas que se van del cuadro */}
        {toallas > 0 && <g transform={`translate(${760 - (1 - toallas) * 1500},780) scale(1.7)`}>{[0, 1, 2, 3].map((k) => <rect key={k} x={-170 + k * 3} y={-46 - k * 46} width={340} height={44} rx={14} fill={["#d8dde4", "#bcd0e0", "#e4dcd0", "#c8d4c8"][k]} stroke="#7a828c" strokeWidth={4} />)}</g>}
        {toallas > 0 && toallas < 1 && <ManoGrande x={760 - (1 - toallas) * 1500 + 360} y={690} ang={-90} piel="#f2bf8f" manga="#8e8a82" s={1.1} />}
        {/* la mandarina */}
        <g transform={`translate(${CX},${CY}) rotate(${rot})`}>
          <circle r={R} fill="#ff8a2a" stroke="#c8501a" strokeWidth={6} />
          {Array.from({ length: 26 }).map((_, k) => <circle key={k} cx={Math.cos(k * 2.3) * 115} cy={Math.sin(k * 3.1) * 115} r={4} fill="#e0701a" />)}
          <g clipPath="url(#peladoIM)">
            <circle r={R - 4} fill="#ffc87a" stroke="#f0a050" strokeWidth={4} />
            {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M0,-140 Q${Math.cos(k * 0.7) * 120},0 0,140`} stroke="#fff0d0" strokeWidth={4} fill="none" opacity={0.8} />)}
          </g>
          <path d="M-8,-150 q10,-30 30,-36" stroke="#4a7a2a" strokeWidth={8} fill="none" opacity={1 - p} />
        </g>
        {/* la espiral de cáscara: cuelga del punto de pelado y se balancea */}
        {p > 0.01 && <>
          <polyline points={pts.join(" ")} stroke="#a8401a" strokeWidth={42} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={pts.join(" ")} stroke="#ff8a2a" strokeWidth={33} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={pts.join(" ")} stroke="#ffe0b0" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} transform="translate(-7,0)" />
        </>}
        {/* manos: la izquierda sostiene desde abajo; la derecha tira de la cáscara y da la vuelta */}
        <g opacity={entra}><ManoGrande x={CX - 120} y={CY + 200} ang={35} piel="#f2bf8f" manga="#8e8a82" /></g>
        {p > 0.01 && <ManoGrande x={hx + 60} y={hy - 30} ang={-120 + Math.cos(a) * 30} piel="#f2bf8f" manga="#8e8a82" s={0.85} />}
      </g>
    </Lienzo>
  );
};

// la palma abierta de Tenzo en primer plano (inserto) y la mano de Leo con el tel que retrocede
export const InsertoPalma: React.FC<{ f: number; abre: number; retro: number }> = ({ f, abre, retro }) => {
  const tiembla = Math.sin(f * 2.1) * 3;
  return (
    <Lienzo>
      <defs>
        <radialGradient id="farolIP"><stop offset="0" stopColor="#ffc46a" stopOpacity={0.6} /><stop offset="1" stopColor="#ffc46a" stopOpacity={0} /></radialGradient>
        <filter id="bokIP"><feGaussianBlur stdDeviation="16" /></filter>
      </defs>
      <rect width={1920} height={1080} fill="#2a2621" />
      <g filter="url(#bokIP)" opacity={0.5}>{[0, 1, 2, 3, 4].map((k) => <g key={k}><rect x={-60 + k * 420} y={40} width={360} height={420} rx={20} fill="#d8d4cc" opacity={0.35} /><circle cx={120 + k * 420} cy={250} r={120} fill="#1e1d1f" opacity={0.7} /></g>)}</g>
      <circle cx={1450} cy={330} r={640} fill="url(#farolIP)" />
      <rect x={0} y={860} width={1920} height={220} fill="#4a463e" />
      {/* palma: los dedos se abren (de puño a palma) */}
      <g transform={`translate(1240,${760 - abre * 40}) rotate(${-70 + abre * 25}) scale(${1.9})`}>
        <rect x={-70} y={40} width={140} height={600} rx={50} fill="#8e8a82" stroke="#121316" strokeWidth={8} />
        <rect x={-58} y={-40} width={116} height={110} rx={50} fill="#f2bf8f" stroke="#3a2618" strokeWidth={8} />
        {[-34, -8, 18, 42].map((d, k) => { const lg = 40 + abre * 50; return <rect key={d} x={d - 13} y={-30 - lg + Math.abs(k - 1.5) * 10 * abre} width={26} height={lg + 10} rx={13} fill="#f2bf8f" stroke="#3a2618" strokeWidth={7} transform={`rotate(${(1 - abre) * 60} ${d} -30)`} />; })}
        <path d={`M-58,-10 Q${-80 - abre * 30},-50 ${-70 - abre * 26},${-80 - abre * 30}`} stroke="#3a2618" strokeWidth={30} strokeLinecap="round" fill="none" />
        <path d={`M-58,-10 Q${-80 - abre * 30},-50 ${-70 - abre * 26},${-80 - abre * 30}`} stroke="#f2bf8f" strokeWidth={16} strokeLinecap="round" fill="none" />
        <path d="M-30,10 Q0,30 34,8" stroke="#c8905a" strokeWidth={5} fill="none" opacity={abre} />
      </g>
      {/* mano de Leo con el tel, a la izquierda: se echa atrás */}
      <g transform={`translate(${330 - retro * 180 + tiembla},${560 + retro * 40}) rotate(${70 + retro * 10})`}>
        <rect x={-70} y={40} width={140} height={700} rx={50} fill="#24242a" stroke="#121316" strokeWidth={8} />
        <rect x={-44} y={-160} width={88} height={170} rx={16} fill="#15171c" stroke="#3a3d44" strokeWidth={6} />
        <rect x={-36} y={-150} width={72} height={150} rx={10} fill="#ff8a4a" opacity={0.85} />
        <rect x={-58} y={-40} width={116} height={110} rx={50} fill="#ecc9a3" stroke="#3a2618" strokeWidth={8} />
      </g>
    </Lienzo>
  );
};

// pantalla del tel: el PALACIO que se convierte en el feed (dentro de un TelMarco: 476x956)
export const PalacioAFeed: React.FC<{ m: number; f: number; Tarjeta: React.FC<{ y: number; i: number }> }> = ({ m, f, Tarjeta }) => {
  const sc = 1 - m * 0.72, ty = -m * 290; // el palacio se encoge hasta la 1ª tarjeta
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* cielo del palacio que se apaga en el fondo del feed */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#ffd9a0, #f2c48a)", opacity: 1 - m }} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - suave(Math.min(1, Math.max(0, m * 1.6 - i * 0.3)))) * 1000}px)` }}><Tarjeta y={40 + i * 420 - lerp(f, 60, 88, 0, 180)} i={i} /></div>)}
      <svg viewBox="0 0 476 956" width={476} height={956} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(238,${560 + ty}) scale(${2.2 * sc})`} opacity={1 - Math.max(0, m - 0.85) / 0.15}><MiniPalacio /></g>
      </svg>
    </div>
  );
};
