// abyss02 · MINUTO 3 (149–225 s): el MISMO corte de la fosa que dejó el minuto 2, una sola cámara, segundo GLOBAL t.
// el Everest cae dentro y su cumbre queda a ~2 km bajo el agua → 1952: el barco Horizon arriba, el ping baja 10,8 km y el eco
// tarda 14 s en volver → el fondo: Challenger y Horizon lado a lado con un edificio de 40 pisos en la diferencia
// → la fábrica de terremotos: los sismos profundos se encienden a lo largo de la placa que se hunde.
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { FPS } from "../abysskit/lib";
import { FONT } from "../abysskit/kit";
import { O, SV, rnd } from "../abysskit/ocean";

const k01 = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / Math.max(0.001, b - a)));
const sm = (t: number, a: number, b: number) => { const k = k01(t, a, b); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const TX: React.CSSProperties = { position: "absolute", fontFamily: FONT, fontWeight: 900, color: O.ink, textShadow: "0 4px 22px rgba(0,0,0,.75)" };
// corte: superficie y=300, fondo de la fosa (10.800 m) y=980 → 0,063 px por metro
const SURF = 230, PXM = 0.06, Yd = (m: number) => SURF + m * PXM, TX0 = 1000;

// barco de investigación de los 50: casco gris, puente, mástil con antena
const OldShip: React.FC<{ x: number; t: number }> = ({ x, t }) => <g transform={`translate(${x},${SURF + Math.sin(t * 1.4) * 4}) rotate(${Math.sin(t * 1.1) * 1.4})`}>
  <path d="M-230,0 L250,0 L205,44 L-195,44 Z" fill="#141a21" /><path d="M-230,0 L250,0" stroke="#e8b07a" strokeWidth={3} opacity={0.7} />
  <path d="M-70,0 L-70,-72 L95,-72 L95,0 Z M-40,-72 L-40,-112 L60,-112 L60,-72 Z" fill="#1c232c" />
  <path d="M-70,-72 L95,-72 M-40,-112 L60,-112" stroke="#e8b07a" strokeWidth={2.5} opacity={0.6} />
  {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-58 + i * 30} y={-58} width={14} height={11} fill="#ffcf7a" opacity={0.85} />)}
  <path d="M110,-72 L110,-190 M86,-166 L134,-166 M95,-140 L125,-140" stroke="#141a21" strokeWidth={5} />
  <circle cx={110} cy={-192} r={5} fill="#ff5a3a" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
  <path d="M-150,0 L-150,-70 M-150,-70 L-200,0" stroke="#141a21" strokeWidth={5} fill="none" />
  {/* estela blanca suave */}
  <path d={`M-230,30 Q-420,${36 + Math.sin(t * 2) * 4} -620,44`} stroke="#cfe0ea" strokeWidth={10} fill="none" opacity={0.25} strokeLinecap="round" />
  <text x={10} y={30} textAnchor="middle" fill="#8f9aa6" fontFamily={FONT} fontWeight={900} fontSize={20} letterSpacing={4}>HORIZON</text>
</g>;

// el corte de la fosa: placa de arriba a la izquierda, placa del Pacífico que se hunde a la derecha, agua arriba
const Section: React.FC<{ t: number; quake: number }> = ({ t, quake }) => {
  const Y56 = Yd(5600), Y76 = Yd(7600), YB = Yd(10800);
  const top = `M2000,${Y56} L1180,${Y56} Q1050,${Y76 - 40} ${TX0},${YB} L860,1300`;
  const off = `L980,1300 L${TX0 + 90},${YB + 40} Q1130,${Y76 + 110} 1250,${Y56 + 130} L2000,${Y56 + 130} Z`;
  // los sismos van por adentro de la placa que baja (desde 6.000 m hasta perderse abajo)
  const along = (k: number): [number, number] => k < 0.5 ? [lerp(1240, TX0 + 40, k * 2), lerp(Y56 + 70, YB + 10, k * 2)] : [lerp(TX0 + 40, 920, (k - 0.5) * 2), lerp(YB + 10, 1180, (k - 0.5) * 2)];
  return <>
    <rect x={0} y={SURF} width={1920} height={1100 - SURF} fill="url(#water3)" />
    <path d={`${top} L2000,1300 Z`} fill="#1a100b" filter="url(#rock3)" />
    <path d={`${top} ${off}`} fill="url(#strata3)" />
    <path d={`${top} ${off}`} fill="#000" opacity={0.35} filter="url(#rock3)" />
    <path d={top} stroke="#ffcf9a" strokeWidth={3} fill="none" opacity={0.55} />
    <path d={`M-20,1100 L-20,${Yd(3000)} L560,${Yd(3200)} Q${TX0 - 140},${Yd(6200)} ${TX0},${YB} L860,1300 Z`} fill="#3a2d24" filter="url(#rock3)" />
    <path d={`M-20,${Yd(3000)} L560,${Yd(3200)} Q${TX0 - 140},${Yd(6200)} ${TX0},${YB}`} stroke="#9fc7da" strokeWidth={3} fill="none" opacity={0.35} />
    {quake > 0 && Array.from({ length: 80 }).map((_, i) => { const a = 211.6 + rnd(i, 52) * 7.4, on = sm(t, a, a + 0.2), fade = sm(t, a + 0.2, a + 1.4);
      const [x0, y0] = along(rnd(i, 51)), x = x0 + (rnd(i, 53) - 0.5) * 70, y = y0 + (rnd(i, 54) - 0.5) * 50;
      return <g key={i} opacity={quake * on}><circle cx={x} cy={y} r={12 + 90 * fade} fill="none" stroke="#ffd34a" strokeWidth={5} opacity={1 - fade} /><circle cx={x} cy={y} r={30 * (1 - fade) + 8} fill="#ffb02e" opacity={0.25 * (1 - fade)} /><circle cx={x} cy={y} r={10} fill="#fff1b0" opacity={1 - 0.6 * fade} style={{ filter: "drop-shadow(0 0 14px #ffb02e)" }} /></g>; })}
  </>;
};

export const Echo: React.FC<{ t0: number }> = ({ t0 }) => {
  const f = useCurrentFrame(), t = t0 + f / FPS;
  // Everest
  const ev = sm(t, 156.4, 160.6), evOut = sm(t, 165.0, 166.6), evTop = lerp(-260, Yd(10800 - 8849), ev);
  // 1952: el ping baja y el eco vuelve (1.500 m/s → 14,4 s ida y vuelta; acá comprimido a la frase)
  const ship = sm(t, 166.6, 168.0) * (1 - sm(t, 188.6, 189.4)), ping = k01(t, 174.2, 178.0), back = k01(t, 178.0, 181.4);
  const timer = t < 174.2 ? 0 : t < 181.4 ? (t - 174.2) * 2.0 : 14.4;
  // fondo: 40 pisos de diferencia
  const deep = sm(t, 189.4, 191.2) * (1 - sm(t, 204.8, 205.8)), bld = sm(t, 194.6, 197.6);
  // fábrica de terremotos
  const quake = sm(t, 211.8, 212.6);
  const cam = lerp(1, 1.5, deep) * lerp(1, 1.55, sm(t, 211.85, 213.6));
  return (
    <AbsoluteFill style={{ background: "#0d1a26", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><defs>
        <filter id="rock3" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.06" numOctaves={4} seed={7} result="n" />
          <feDiffuseLighting in="n" lightingColor="#c8b4a0" surfaceScale={3} result="l"><feDistantLight azimuth={235} elevation={48} /></feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="in" result="c" /><feBlend in="SourceGraphic" in2="c" mode="multiply" /></filter>
        <filter id="deep3"><feColorMatrix type="matrix" values="0.15 0 0 0 0.01  0 0.35 0 0 0.08  0 0 0.55 0 0.16  0 0 0 0.9 0" /></filter>
        <linearGradient id="water3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a5f80" /><stop offset="35%" stopColor="#0a2a44" /><stop offset="100%" stopColor="#01060c" /></linearGradient>
        <pattern id="strata3" width="140" height="44" patternUnits="userSpaceOnUse" patternTransform={`translate(${-(t - 149) * 30 % 140},0)`}><rect width="140" height="44" fill="#6b3f26" /><rect y={22} width="140" height="8" fill="#8a5434" /></pattern>
      </defs></svg>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#1b2a3a 0%, #4d5f70 14%, #c98a5a 21%, #e8b07a 23%)" }} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: quake > 0 ? `1120px ${Yd(8600)}px` : `${TX0 - 60}px ${Yd(10800) - 20}px` }}>
        <SV>
          <Section t={t} quake={quake} />
          {/* el Everest REAL (cumbre sobre las nubes) cae en la fosa; bajo el agua se tiñe de azul */}
          {ev > 0 && <g opacity={1 - evOut}>
            <image href={staticFile("abyss02/cut/everest.png")} x={TX0 - 460 * 0.98} y={evTop - 20 * 0.98} width={1244 * 0.98} height={647 * 0.98} />
            <clipPath id="uw3"><rect x={0} y={SURF} width={1920} height={1100} /></clipPath>
            <image href={staticFile("abyss02/cut/everest.png")} x={TX0 - 460 * 0.98} y={evTop - 20 * 0.98} width={1244 * 0.98} height={647 * 0.98} clipPath="url(#uw3)" filter="url(#deep3)" />
          </g>}
          {/* regla de profundidad */}
          {[0, 2000, 4000, 6000, 8000, 10000].map((m) => <g key={m} opacity={1 - deep}><line x1={230} x2={270} y1={Yd(m)} y2={Yd(m)} stroke="#e8eef2" strokeWidth={3} opacity={0.6} /><text x={280} y={Yd(m) + 10} fill="#e8eef2" opacity={0.6} fontFamily={FONT} fontWeight={800} fontSize={28}>{m.toLocaleString("en")} m</text></g>)}
          {ev > 0.98 && <g opacity={1 - evOut}><line x1={TX0 + 30} x2={TX0 + 30} y1={SURF} y2={evTop} stroke={O.gold} strokeWidth={6} strokeDasharray="14 10" />
            <text x={TX0 + 60} y={(SURF + evTop) / 2 + 20} fill={O.gold} fontFamily={FONT} fontWeight={900} fontSize={60}>~2 km of water</text></g>}
          {/* el ping de 1952 */}
          {ship > 0 && <g opacity={ship}>
            {ping > 0 && ping < 1 && [0, 1, 2].map((i) => { const r = Math.max(0, ping * (Yd(10800) - SURF) - i * 40); return <path key={i} d={`M${TX0 - r * 0.5},${SURF + r * 0.86} A${r},${r} 0 0 0 ${TX0 + r * 0.5},${SURF + r * 0.86}`} stroke="#9ff3ff" strokeWidth={6 - i * 1.5} fill="none" opacity={0.9 - i * 0.25} />; })}
            {back > 0 && back < 1 && [0, 1].map((i) => { const r = Math.max(0, (1 - back) * (Yd(10800) - SURF) - i * 40); return <path key={i} d={`M${TX0 - r * 0.5},${SURF + r * 0.86} A${r},${r} 0 0 0 ${TX0 + r * 0.5},${SURF + r * 0.86}`} stroke={O.gold} strokeWidth={5 - i * 1.5} fill="none" opacity={0.8 - i * 0.3} />; })}
            {ping >= 1 && back === 0 ? null : null}
            {t > 177.8 && t < 178.4 && <circle cx={TX0} cy={Yd(10800)} r={40} fill="#9ff3ff" opacity={0.7} />}
          </g>}
        </SV>
        {ship > 0 && <SV style={{ opacity: ship }}><OldShip x={TX0} t={t} /></SV>}
      </AbsoluteFill>
      {/* nieve marina real flotando en toda la columna de agua (se suma a la luz) */}
      <AbsoluteFill style={{ top: SURF, mixBlendMode: "screen", opacity: 0.28, transform: `scale(${cam})`, transformOrigin: `${TX0 - 60}px ${Yd(10800) - 20 - SURF}px` }}>
        <OffthreadVideo src={staticFile("abyss02/real/dark_35552762.mp4")} muted playbackRate={0.3} startFrom={Math.max(0, Math.round((t0 - 149) * FPS * 0.3))} style={{ width: 1920, height: 1080, filter: "hue-rotate(160deg) saturate(0.5)" }} />
      </AbsoluteFill>
      {/* lupa sobre el fondo: los dos récords separados por un edificio de 40 pisos (~135 m) */}
      {deep > 0 && <svg width={720} height={720} viewBox="-360 -360 720 720" style={{ position: "absolute", right: 200, top: 200, opacity: deep, transform: `scale(${0.6 + 0.4 * deep})` }}>
        <defs><clipPath id="lupa"><circle r={300} /></clipPath></defs>
        <circle r={300} fill="#020a14" stroke={O.ink} strokeWidth={10} />
        <g clipPath="url(#lupa)">
          <rect x={-300} y={-170} width={600} height={470} fill="#2a2119" />
          <rect x={-300} y={150} width={600} height={160} fill="#3e3128" />
          <line x1={-300} x2={300} y1={-170} y2={-170} stroke={O.red} strokeWidth={6} /><line x1={-300} x2={300} y1={150} y2={150} stroke={O.orange} strokeWidth={6} />
          <g transform={`translate(-40,150) scale(1,${bld})`}><rect x={0} y={-320} width={110} height={320} fill="#d8d2c4" />
            {Array.from({ length: 40 }).map((_, i) => <line key={i} x1={0} x2={110} y1={-(i + 1) * 8} y2={-(i + 1) * 8} stroke="#5a6470" strokeWidth={1.5} />)}
            {Array.from({ length: 40 }).map((_, i) => <rect key={"w" + i} x={14 + (i % 4) * 24} y={-(Math.floor(i / 4) * 32) - 26} width={12} height={16} fill="#ffe6a0" opacity={0.7} />)}</g>
        </g>
        <text x={-270} y={-186} fill={O.red} fontFamily={FONT} fontWeight={900} fontSize={30}>Horizon · ~10,800 m</text>
        <text x={-270} y={196} fill={O.orange} fontFamily={FONT} fontWeight={900} fontSize={30}>Challenger · ~10,935 m</text>
      </svg>}
      {/* rótulos */}
      <div style={{ ...TX, right: 230, top: 330, textAlign: "right", fontSize: 54, opacity: sm(t, 154.2, 155.0) * (1 - sm(t, 156.3, 156.7)) }}>swallowed faster than <span style={{ color: O.red }}>almost anywhere</span></div>
      <div style={{ ...TX, right: 230, top: 600, textAlign: "right", fontSize: 54, opacity: sm(t, 157.0, 157.8) * (1 - evOut) }}>MOUNT EVEREST · 8,849 m</div>
      <div style={{ ...TX, right: 230, top: 330, textAlign: "right", fontSize: 60, color: O.gold, opacity: sm(t, 167.4, 168.2) * (1 - sm(t, 173.2, 173.8)) }}>1952 · the ship <span style={{ color: O.ink }}>Horizon</span></div>
      <div style={{ ...TX, right: 230, top: 430, textAlign: "right", opacity: sm(t, 174.2, 174.8) * (1 - sm(t, 188.6, 189.2)) }}>
        <div style={{ fontSize: 30, color: O.dim, letterSpacing: 4 }}>ECHO</div>
        <div style={{ fontSize: 130, lineHeight: 1, fontVariantNumeric: "tabular-nums", color: t > 179.6 ? O.red : O.ink }}>{timer.toFixed(1)} s</div>
        <div style={{ fontSize: 44, color: O.red, opacity: sm(t, 179.6, 180.2) * (1 - sm(t, 180.8, 181.2)) }}>impossible?</div>
        <div style={{ fontSize: 44, color: O.gold, opacity: sm(t, 182.4, 183.0) }}>the bottom is that far</div>
        <div style={{ fontSize: 90, color: O.ink, opacity: sm(t, 185.2, 186.0) }}>≈ 10,800 m</div>
      </div>
      <div style={{ ...TX, left: 230, top: 420, opacity: deep }}>
        <div style={{ fontSize: 50, color: O.dim }}>only one place is deeper</div>
        <div style={{ fontSize: 76, marginTop: 20, opacity: bld }}>the gap ≈ a<br /><span style={{ color: O.gold }}>40-story</span> building</div>
      </div>
      <div style={{ ...TX, right: 230, top: 330, textAlign: "right", fontSize: 54, color: "#ffd34a", opacity: sm(t, 214.8, 215.6) * quake }}>more deep quakes<br />than anywhere on Earth</div>
    </AbsoluteFill>
  );
};
