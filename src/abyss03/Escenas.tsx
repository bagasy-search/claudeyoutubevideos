// abyss03 · escenas ILUSTRADAS ("Every Ocean on Earth Ranked by How Fast It Would Kill You"): todo en código con abysskit.
// Cada escena actúa la frase que se dice y nunca queda quieta. f = cuadro local (0 = arranque del bloque), d = duración en cuadros.
// name = "escena" o "escena:variante" (lo pone la escaleta esc.txt). El renglón de KeyLine vive arriba (y≈175): las escenas usan y>280.
import { Plate } from "../abysskit/plate";
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, ease } from "../abysskit/kit";
import { Arrow, Counter, Draw, Fish, GeoBase, O, Pin, Ship, SV, Snow, Tag, Water, lin, mix, rnd } from "../abysskit/ocean";
import { MAPS } from "../abysskit/maps";

const F = () => useCurrentFrame();
const M = "abyss03/map/";
type SP = { d: number; v: string };
// fondo de ficha: agua REAL desenfocada y oscura detrás (nunca un degradé plano), teñida con el tono de la escena
const Dark: React.FC<{ children?: React.ReactNode; tone?: string }> = ({ children, tone = "#03080f" }) => <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
  <Plate kind="dark" rate={0.4} vstyle={{ filter: "blur(4px) brightness(0.5) saturate(0.75)", transform: "scale(1.08)" }} />
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${tone}88 0%, rgba(0,0,0,.88) 85%)` }} />
  {children}
</AbsoluteFill>;
const Big: React.FC<{ x: number; y: number; k: number; size?: number; color?: string; children: React.ReactNode }> = ({ x, y, k, size = 110, color = O.orange, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 900, fontSize: size, color, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: "left center", textShadow: "0 6px 26px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{children}</div>
);
const JACKET = "#ff7a1a";
// plano real fijo de esta escena (clip fuera del plan, anotado en malos.txt para que el build no lo repita)
const RealBg: React.FC<{ n: string; rate?: number; from?: number; filter?: string }> = ({ n, rate = 0.5, from = 0.5, filter = "brightness(0.6)" }) =>
  <OffthreadVideo src={staticFile(`abyss03/real/${n}.mp4`)} muted playbackRate={rate} startFrom={Math.round(from * 30)} style={{ position: "absolute", inset: 0, width: 1920, height: 1080, objectFit: "cover", filter }} />;

// mar visto de costado: cielo arriba, línea de agua con olas que se mueven (h = alto de ola en px)
const Sea: React.FC<{ y?: number; h?: number; sky?: [string, string]; water?: [string, string]; children?: React.ReactNode; over?: React.ReactNode; spd?: number }> = ({ y = 560, h = 18, sky = ["#7da7c2", "#c9dbe4"], water = ["#1f6a8c", "#05223a"], children, over, spd = 1 }) => {
  const f = F(), wave = (yy: number, a: number, ph: number) => `M-40,1100 L-40,${yy} ${Array.from({ length: 50 }).map((_, i) => `L${i * 42},${yy + Math.sin(i * 0.55 + (f * spd) / 9 + ph) * a}`).join(" ")} L2000,${yy} L2000,1100 Z`;
  // mar REAL con el horizonte en y; lo que está "en el agua" queda tapado por una segunda copia del mismo plano recortada bajo la ola
  const yp = (y / 1080) * 100, tint = <AbsoluteFill style={{ background: `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} ${yp}%, ${water[0]} ${yp}%, ${water[1]} 100%)`, mixBlendMode: "color", opacity: 0.3 }} />;
  const sea = <><Plate kind="sea" y={y} rate={0.6 * spd} vstyle={{ filter: "saturate(0.9) contrast(1.06)" }} />{tint}</>;
  return <AbsoluteFill style={{ background: water[1], overflow: "hidden" }}>
    {sea}
    {children}
    <AbsoluteFill style={{ clipPath: `path('${wave(y + h * 0.4, h * 0.5, 0)}')`, opacity: 0.9 }}>{sea}</AbsoluteFill>
    {over}
  </AbsoluteFill>;
};
// persona flotando con el chaleco naranja (bob = sube y baja con la ola): piel con volumen, pelo mojado, cinta reflectiva, borde de luz
const Head: React.FC<{ x: number; y: number; s?: number; blue?: number; face?: "up" | "fwd" }> = ({ x, y, s = 1, blue = 0, face = "fwd" }) => {
  const f = F(), b = Math.sin(f / 9) * 8 * s, sk = mix("#d29b74", "#93a3b6", blue), sk2 = mix("#6b4330", "#38465a", blue), id = `hd${Math.round(x)}_${Math.round(y)}`;
  return <svg width={220 * s} height={200 * s} viewBox="-110 -120 220 200" style={{ position: "absolute", left: x - 110 * s, top: y - 120 * s - 70 + b, overflow: "visible", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.45))" }}>
    <defs>
      <radialGradient id={id + "s"} cx="0.38" cy="0.32" r="0.75"><stop offset="0%" stopColor={sk} /><stop offset="65%" stopColor={sk2} /><stop offset="100%" stopColor="#140e0a" /></radialGradient>
      <linearGradient id={id + "j"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff8f33" /><stop offset="55%" stopColor="#d9530f" /><stop offset="100%" stopColor="#6e2306" /></linearGradient>
      <linearGradient id={id + "h"} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b2a1d" /><stop offset="100%" stopColor="#0d0907" /></linearGradient>
    </defs>
    <path d="M-92,34 Q-98,-18 -44,-30 L44,-30 Q98,-18 92,34 Q0,62 -92,34 Z" fill={`url(#${id}j)`} />
    <path d="M-86,4 Q0,22 86,4 L88,16 Q0,34 -88,16 Z" fill="#dde4e8" opacity={0.85} />
    <path d="M-40,-30 L40,-30 L28,6 L-28,6 Z" fill="#a83d0b" opacity={0.8} />
    <g transform={face === "up" ? "rotate(-18 0 -40)" : undefined}>
      <rect x={-18} y={-44} width={36} height={22} fill={sk2} />
      <ellipse cx={0} cy={-66} rx={40} ry={47} fill={`url(#${id}s)`} />
      <ellipse cx={-40} cy={-62} rx={7} ry={11} fill={sk2} />
      <path d="M-42,-74 Q-46,-118 0,-116 Q46,-118 42,-74 Q30,-98 0,-96 Q-28,-98 -42,-74 Z" fill={`url(#${id}h)`} />
      <path d="M-20,-108 Q4,-114 24,-104" stroke="#fff" strokeWidth={3} fill="none" opacity={0.22} />
      {face === "fwd" ? <><ellipse cx={0} cy={-70} rx={30} ry={8} fill="#1a100b" opacity={0.28} /><path d="M0,-66 L-4,-50 L4,-48" stroke={sk2} strokeWidth={3} fill="none" opacity={0.7} /><path d="M-10,-36 Q0,-33 10,-36" stroke="#3a1c14" strokeWidth={3} fill="none" opacity={0.6} /></>
        : <><path d="M-22,-64 q6,3 12,0 M10,-64 q6,3 12,0" stroke="#2a1a12" strokeWidth={3} fill="none" opacity={0.7} /><path d="M-8,-40 Q0,-36 8,-40" stroke="#3a1c14" strokeWidth={3} fill="none" opacity={0.6} /></>}
      <path d="M30,-100 Q48,-70 34,-30" stroke="#e8f4ff" strokeWidth={3} fill="none" opacity={0.35} />
    </g>
    <ellipse cx={0} cy={30} rx={104 + Math.sin(f / 7) * 6} ry={12} fill="none" stroke="#f2f8fa" strokeWidth={4} opacity={0.4} />
  </svg>;
};
// persona colgando del chaleco vista DESDE ABAJO: silueta a contraluz, piernas que patalean despacio
const Dangle: React.FC<{ x: number; y: number; s?: number; ph?: number }> = ({ x, y, s = 1, ph = 0 }) => {
  const f = F(), a = Math.sin(f / 11 + ph) * 12, b = Math.sin(f / 11 + ph + 2.2) * 12;
  return <svg width={180 * s} height={360 * s} viewBox="-90 -40 180 360" style={{ position: "absolute", left: x - 90 * s, top: y, overflow: "visible", filter: "blur(1.3px) drop-shadow(0 0 14px rgba(170,225,255,.25))" }}>
    <ellipse cx={0} cy={-12} rx={21} ry={15} fill="#0a1622" />
    <path d={`M-30,40 Q-72,${84 + a} -64,${146 + a}`} stroke="#0a1622" strokeWidth={16} strokeLinecap="round" fill="none" />
    <path d={`M30,40 Q72,${84 + b} 64,${146 + b}`} stroke="#0a1622" strokeWidth={16} strokeLinecap="round" fill="none" />
    <path d={`M-14,146 Q${-22 + a},228 ${-16 + a * 1.7},312`} stroke="#08131d" strokeWidth={23} strokeLinecap="round" fill="none" />
    <path d={`M14,146 Q${22 + b},228 ${16 + b * 1.7},312`} stroke="#08131d" strokeWidth={23} strokeLinecap="round" fill="none" />
    <path d="M-36,40 Q-42,-2 0,-8 Q42,-2 36,40 L32,152 Q0,164 -32,152 Z" fill="#6e2a0c" />
    <path d="M-34,72 Q0,80 34,72" stroke="#c8d2d8" strokeWidth={5} fill="none" opacity={0.35} />
  </svg>;
};
// tiburón oceánico de punta blanca en silueta (aletas largas y redondeadas, puntas blancas)
const Shark: React.FC<{ x: number; y: number; s?: number; flip?: boolean; op?: number; color?: string }> = ({ x, y, s = 1, flip = false, op = 1, color = "#22303b" }) => {
  const f = F(), w = Math.sin(f / 7 + x / 100) * 12, gid = `sk${Math.round(x)}_${Math.round(y)}`;
  return <svg width={520 * s} height={260 * s} viewBox="-260 -130 520 260" style={{ position: "absolute", left: x - 260 * s, top: y - 130 * s, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, opacity: op, filter: "blur(0.6px)" }}>
    <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14202a" /><stop offset="45%" stopColor={color} /><stop offset="70%" stopColor="#8a9aa4" /><stop offset="100%" stopColor="#c9d3d8" /></linearGradient></defs>
    <path d={`M-230,0 Q-150,-50 20,-40 Q140,-34 190,-6 L250,${-60 + w} L232,${w} L250,${50 + w} L190,8 Q120,40 0,42 Q-150,44 -230,0 Z`} fill={`url(#${gid})`} />
    <path d="M-30,-40 Q-10,-120 40,-130 Q30,-80 40,-38 Z" fill={`url(#${gid})`} /><path d="M38,-128 Q32,-112 36,-100 L44,-118 Z" fill="#f1f1f1" />
    <path d="M-60,30 Q-20,110 60,130 Q30,80 30,36 Z" fill={`url(#${gid})`} /><path d="M58,128 Q44,116 40,104 L62,118 Z" fill="#f1f1f1" />
    <circle cx={-170} cy={-6} r={6} fill="#0b0b0b" />
  </svg>;
};
// termómetro vertical: v = grados que marca (escala min..max)
const Thermo: React.FC<{ x: number; y: number; v: number; min?: number; max?: number; color?: string; label?: string; h?: number }> = ({ x, y, v, min = -5, max = 40, color = O.red, label, h = 440 }) => {
  const k = (v - min) / (max - min);
  return <>
    <div style={{ position: "absolute", left: x - 40, top: y, width: 80, height: h, borderRadius: 40, border: "6px solid #dfe8f0", background: "rgba(0,0,0,.25)" }} />
    <div style={{ position: "absolute", left: x - 28, top: y + h - 40 - (h - 60) * k, width: 56, height: (h - 60) * k + 40, borderRadius: 28, background: color }} />
    <div style={{ position: "absolute", left: x - 56, top: y + h - 40, width: 112, height: 112, borderRadius: 56, background: color, border: "6px solid #dfe8f0" }} />
    <Tag x={x + 70} y={y + h - 40 - (h - 60) * k - 30} size={64} color={color}>{v.toFixed(Math.abs(v) < 3 && v % 1 ? 1 : 0)} °C</Tag>
    {label && <Tag x={x} y={y + h + 80} size={36} color={O.dim} center>{label}</Tag>}
  </>;
};
// reloj de arena simple en barra: k = cuánto tiempo ya se fue
const Bar: React.FC<{ x: number; y: number; w: number; k: number; color?: string; label?: string; sub?: string; h?: number }> = ({ x, y, w, k, color = O.orange, label, sub, h = 70 }) => <>
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, border: "4px solid rgba(244,239,230,.5)" }} />
  <div style={{ position: "absolute", left: x + 6, top: y + 6, width: Math.max(0, (w - 12) * k), height: h - 12, borderRadius: (h - 12) / 2, background: color }} />
  {label && <Tag x={x} y={y - 64} size={44}>{label}</Tag>}{sub && <Tag x={x + w + 30} y={y + h / 2 - 28} size={48} color={color}>{sub}</Tag>}
</>;
// pulmones de línea que se inflan (k = aire)
const Lungs: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 1 }) => <svg width={400 * s} height={360 * s} viewBox="-200 -180 400 360" style={{ position: "absolute", left: x - 200 * s, top: y - 180 * s, overflow: "visible" }}>
  <path d="M0,-170 L0,-60 M0,-60 Q-30,-40 -50,-30 M0,-60 Q30,-40 50,-30" stroke="#dfe8f0" strokeWidth={10} fill="none" strokeLinecap="round" />
  {[-1, 1].map((sd) => <path key={sd} transform={`scale(${sd * (0.75 + 0.35 * k)},${0.75 + 0.35 * k})`} d="M30,-90 Q150,-120 160,40 Q160,150 70,150 Q30,150 30,90 Z" fill={`rgba(255,120,110,${0.25 + 0.5 * k})`} stroke="#ffb3a8" strokeWidth={6} />)}
</svg>;

const S: Record<string, React.FC<SP>> = {
  // "you just went over the side" · el barco se aleja · luz en el horizonte · ya no está
  overboard: ({ d, v }) => { const f = F(), light = v === "light", gone = v === "gone", far = light ? 1 : lin(f, 0, d, 0, 0.35);
    const sky: [string, string] = light || gone ? ["#26364a", "#7c8a96"] : ["#6f97b2", "#c4d6e0"];
    return <Sea y={620} h={22} sky={sky}>
      {!gone && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${lin(f, 0, d, 0, light ? 60 : 380)}px,0)` }}>
        {light ? <><div style={{ position: "absolute", left: 1450, top: 596, width: 22, height: 22, borderRadius: 11, background: "#fff6c8", boxShadow: "0 0 40px 18px rgba(255,240,180,.7)" }} /></>
          : <div style={{ transform: `scale(${1 - far})`, transformOrigin: "1400px 620px", position: "absolute", inset: 0 }}><Ship x={1400} y={640} s={2.4} color="#16202a" /></div>}
      </div>}
      {light && <Tag x={1380} y={500} size={50} color={O.ink}>1 minute</Tag>}
      {gone && <><Tag x={1260} y={430} size={60} color={O.ink}>5 minutes</Tag><Tag x={1260} y={505} size={42} color={O.ink} op={ease(f, 10, 22)}>nothing on the horizon</Tag></>}
      <Head x={560} y={700} s={1.4} />
    </Sea>; },
  // "it depends on which ocean you fell into" · los cinco océanos en el mapa
  oceans: ({ d, v }) => { const f = F(), m = MAPS.world, ask = v === "ask";
    const L: [string, string][] = [["pac_c", "PACIFIC"], ["atl_c", "ATLANTIC"], ["ind_c", "INDIAN"], ["arc_c", "ARCTIC"], ["sou_c", "SOUTHERN"]];
    return <GeoBase png={M + "world_sat.png"} m={m} d={d} zoom={[1, 1.04]} W={1640}>{(P) => <>
      {L.map(([k, n], i) => { const [x, y0] = P(k), y = Math.min(960, Math.max(330, y0)), kk = ease(f, 6 + i * 7, 14 + i * 7); return <React.Fragment key={k}><Pin x={x} y={y} k={kk} color={ask && i === 4 ? O.red : O.gold} /><Tag x={x} y={y > 900 ? y - 90 : y + 26} op={kk} size={ask && i === 4 ? 90 : 40} center color={ask && i === 4 ? O.red : O.ink}>{ask && i === 4 ? "?" : n}</Tag></React.Fragment>; })}
    </>}</GeoBase>; },
  // los días vs los tres minutos
  daysmin: ({ d }) => { const f = F(), k1 = ease(f, 4, d * 0.4), k2 = ease(f, d * 0.45, d * 0.85);
    return <Dark tone="#0d2638">
      <Bar x={260} y={420} w={1300} k={k1} color={O.gold} label="one ocean" sub="DAYS" />
      <Bar x={260} y={700} w={1300} k={0.02 + 0.02 * k2} color={O.red} label="another one" />
      <Tag x={260} y={800} op={k2} size={64} color={O.red}>≈ 3 MINUTES</Tag>
    </Dark>; },
  // regla 1·10·1: arg = bloque activo (0 = un minuto, 1 = diez minutos, 2 = una hora); "" = presentación
  onetenone: ({ d, v }) => { const f = F(), act = v === "" ? -1 : Number(v);
    const B: [string, string, string][] = [["1", "MINUTE", "cold shock"], ["10", "MINUTES", "your hands"], ["1", "HOUR", "you pass out"]];
    return <Dark tone="#0e2a42">
      {B.map(([n, u, s], i) => { const k = ease(f, 4 + i * 6, 14 + i * 6), on = act === i, x = 330 + i * 440;
        return <div key={i} style={{ position: "absolute", left: x, top: 330, width: 380, height: 480, borderRadius: 30, border: `5px solid ${on ? O.cyan : "rgba(244,239,230,.3)"}`, background: on ? "rgba(95,240,255,.08)" : "rgba(255,255,255,.03)", opacity: k * (act >= 0 && !on ? 0.4 : 1), transform: `scale(${(on ? 1.06 + 0.02 * Math.sin(f / 8) : 1) * (0.9 + 0.1 * k)})` }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 210, lineHeight: 1, color: on ? O.cyan : O.ink }}>{n}</div>
          <div style={{ position: "absolute", top: 270, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: on ? O.cyan : O.ink, letterSpacing: 4 }}>{u}</div>
          <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: O.dim }}>{s}</div>
        </div>; })}
    </Dark>; },
  // el boqueo: los pulmones se inflan de golpe, la respiración se dispara · variante wave: una ola te tapa la cara justo ahí
  gasp: ({ d, v }) => { const f = F(), wv = v === "wave", g = f < 14 ? ease(f, 2, 12) : 0.55 + 0.45 * Math.abs(Math.sin(f / 4.5)), br = Math.round(lin(f, 0, d * 0.6, 14, 60));
    if (wv) { const wx = lin(f, 0, d * 0.6, 1900, -400);
      return <Sea y={640} h={20}>
        <Head x={760} y={720} s={1.5} face="up" />
        <SV><path d={`M${wx},1100 Q${wx + 120},420 ${wx + 420},520 Q${wx + 300},560 ${wx + 520},700 L${wx + 900},1100 Z`} fill="#1b5c7c" opacity={0.95} /><path d={`M${wx + 120},560 Q${wx + 240},430 ${wx + 420},520`} stroke="#e8f6ff" strokeWidth={14} fill="none" opacity={0.8} /></SV>
        <Tag x={1000} y={330} op={ease(f, d * 0.4, d * 0.5)} size={70} color={O.red}>you inhale the sea</Tag>
      </Sea>; }
    return <Dark tone="#10324a">
      <Lungs x={620} y={600} k={g} s={1.4} />
      <Counter x={1180} y={420} v={br} unit="breaths/min" size={150} color={O.cyan} label="you cannot stop it" />
    </Dark>; },
  // el corazón se acelera y la presión se dispara
  heart: ({ d }) => { const f = F(), bpm = lin(f, 0, d * 0.7, 72, 160), beat = Math.max(0, Math.sin((f / 30) * (bpm / 60) * Math.PI * 2)) ** 6;
    return <Dark tone="#2a0e12">
      <RealBg n="heart_6130551" rate={0.6} filter={`brightness(${0.5 + 0.25 * beat}) saturate(1.1) hue-rotate(-100deg)`} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.75) 55%, rgba(0,0,0,.85) 100%)" }} />
      <Counter x={900} y={400} v={bpm} unit="bpm" size={180} color={O.red} label="blood pressure spikes" />
      <Draw pts={Array.from({ length: 60 }).map((_, i) => [900 + i * 15, 760 - (i % 10 === 5 ? 120 : i % 10 === 6 ? -60 : 0)] as [number, number])} k={ease(f, 0, d * 0.8)} color={O.red} w={6} />
    </Dark>; },
  // diez minutos: los dedos dejan de cerrar · variante rope: la soga y la escalera que ya no podés agarrar
  hands: ({ d, v }) => { const f = F(), rope = v === "rope", amp = rope ? 0.12 : 1 - ease(f, d * 0.1, d * 0.9), cold = rope ? 1 : ease(f, 0, d);
    const bend = amp * (0.5 + 0.5 * Math.sin(f / 7)), sk = mix("#f2c49b", "#8ea6c2", cold), sh = Math.sin(f * 1.9) * 2 * cold;
    const finger = (i: number) => { const x0 = -75 + i * 50, a1 = bend * 70, a2 = bend * 95, L1 = i === 0 || i === 3 ? 70 : 85, L2 = 60;
      const r1 = (a1 * Math.PI) / 180, r2 = ((a1 + a2) * Math.PI) / 180, x1 = x0 + Math.sin(r1) * L1, y1 = -10 - Math.cos(r1) * L1, x2 = x1 + Math.sin(r2) * L2, y2 = y1 - Math.cos(r2) * L2;
      return <path key={i} d={`M${x0},-10 L${x1},${y1} L${x2},${y2}`} stroke={sk} strokeWidth={38} fill="none" strokeLinecap="round" strokeLinejoin="round" />; };
    return <Dark tone="#0f2b44">
      {rope && <><SV><path d={`M1260,250 Q${1270 + Math.sin(f / 12) * 30},560 1250,960`} stroke="#c8a46a" strokeWidth={22} fill="none" /></SV><Tag x={1330} y={600} size={48} color={O.ink}>a rope you can't grab</Tag></>}
      <svg width={640} height={640} viewBox="-200 -260 400 400" style={{ position: "absolute", left: rope ? 760 : 420, top: 300 + sh, overflow: "visible" }}>
        {[0, 1, 2, 3].map(finger)}
        <rect x={-110} y={-30} width={200} height={150} rx={50} fill={sk} />
        <path d={`M-100,40 Q-170,${10 - bend * 40} -150,-40`} stroke={sk} strokeWidth={36} fill="none" strokeLinecap="round" />
      </svg>
      {!rope && <><Counter x={1180} y={400} v={lin(f, 0, d, 0, 10)} unit="min" size={170} color={O.cyan} /><Tag x={1180} y={620} op={ease(f, d * 0.5, d * 0.6)} size={50} color={O.cyan}>fingers stop closing</Tag></>}
    </Dark>; },
  // nadadores fuertes: en la pileta climatizada vs en agua fría
  swim: ({ d }) => { const f = F(), k = ease(f, 6, d * 0.7);
    return <Dark tone="#0d2b40">
      <Bar x={260} y={430} w={1360} k={k} color={O.sky} label="heated pool" />
      <Bar x={260} y={700} w={1360} k={k * 0.18} color={O.cyan} label="cold water · same swimmers" />
      <Tag x={420 + 1360 * 0.18 * k} y={710} op={ease(f, d * 0.6, d * 0.7)} size={46} color={O.red}>arms stop</Tag>
    </Dark>; },
  // ese barco que parece cerca está mucho más lejos de lo que llegan tus brazos
  boatclose: ({ d }) => { const f = F(), k = ease(f, d * 0.2, d * 0.7);
    return <Sea y={600} h={16}>
      <Ship x={1500} y={620} s={0.9} />
      <Head x={360} y={690} s={1.1} />
      <Draw pts={[[460, 520], [1380, 520]]} k={1} color={O.ink} w={5} dash="18 14" />
      <Draw pts={[[460, 470], [460 + 920 * 0.25 * k, 470]]} k={1} color={O.red} w={12} />
      <Tag x={470} y={380} op={k} size={46} color={O.red}>where your arms give out</Tag>
    </Sea>; },
  // una hora: el reloj se vacía y la conciencia se apaga
  hour: ({ d }) => { const f = F(), k = ease(f, 0, d * 0.9), a = k * 360;
    return <Dark tone="#0c2236">
      <svg width={520} height={520} viewBox="-130 -130 260 260" style={{ position: "absolute", left: 300, top: 320 }}>
        <circle r={120} fill="none" stroke="rgba(244,239,230,.3)" strokeWidth={10} />
        <path d={`M0,0 L0,-120 A120,120 0 ${a > 180 ? 1 : 0},1 ${120 * Math.sin((a * Math.PI) / 180)},${-120 * Math.cos((a * Math.PI) / 180)} Z`} fill={O.cyan} opacity={0.5} />
        <line x1={0} y1={0} x2={100 * Math.sin((a * Math.PI) / 180)} y2={-100 * Math.cos((a * Math.PI) / 180)} stroke={O.ink} strokeWidth={8} strokeLinecap="round" />
      </svg>
      <Big x={950} y={440} k={ease(f, 6, 18)} size={160} color={O.cyan}>1 HOUR</Big>
      <Tag x={960} y={640} op={ease(f, d * 0.5, d * 0.6)} size={50} color={O.dim}>ice water · you lose consciousness</Tag>
      <AbsoluteFill style={{ background: "#000", opacity: 0.55 * ease(f, d * 0.6, d) }} />
    </Dark>; },
  // el frío no te gana al final: te gana al principio (línea de tiempo con el peligro adelante)
  start: ({ d }) => { const f = F(), k = ease(f, 4, d * 0.6);
    return <Dark tone="#0e2a42">
      <Draw pts={[[200, 620], [1720, 620]]} k={k} color={O.dim} w={6} />
      {[["0", 200], ["1 min", 420], ["10 min", 820], ["1 hour", 1640]].map(([t, x], i) => <Tag key={i} x={(x as number) - 30} y={660} op={k} size={38} color={O.dim}>{t}</Tag>)}
      <div style={{ position: "absolute", left: 200, top: 520, width: 620 * ease(f, d * 0.3, d * 0.7), height: 90, background: "rgba(255,59,48,.45)", borderRadius: 12 }} />
      <Tag x={220} y={430} op={ease(f, d * 0.4, d * 0.55)} size={60} color={O.red}>THE DANGER IS HERE</Tag>
    </Dark>; },
  // el agua saca calor 25 veces más rápido que el aire
  heat25: ({ d }) => { const f = F(), k = ease(f, 6, d * 0.7);
    return <Dark tone="#0b2235">
      <Bar x={260} y={440} w={56} k={1} color={O.sky} label="air" h={70} />
      <Tag x={350} y={446} size={48} color={O.sky}>1×</Tag>
      <Bar x={260} y={700} w={60 + 1340 * k} k={1} color={O.cyan} label="water, same temperature" h={70} />
      <Big x={1250} y={800} k={ease(f, d * 0.55, d * 0.7)} size={140} color={O.cyan}>25×</Big>
    </Dark>; },
  // el cuerpo aprieta la piel y tira la sangre caliente al corazón: brazos y piernas son lo primero que se sacrifica
  core: ({ d, v }) => { const f = F(), k = ease(f, d * 0.15, d * 0.8), opt = v === "opt";
    const lim = mix("#ff7a1a", "#2c1878", k), lim2 = mix("#d2262a", "#120a3a", k);
    const body = (blur: number, op: number) => <svg width={600} height={860} viewBox="-150 -60 300 430" style={{ position: "absolute", left: 660, top: 240, filter: `blur(${blur}px)`, opacity: op }}>
      <defs><radialGradient id={`th${blur}`} cx="0.45" cy="0.4" r="0.7"><stop offset="0%" stopColor="#fffbe0" /><stop offset="28%" stopColor="#ffd23a" /><stop offset="60%" stopColor="#ff7a1a" /><stop offset="100%" stopColor="#c0202a" /></radialGradient>
        <linearGradient id={`tl${blur}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lim} /><stop offset="100%" stopColor={lim2} /></linearGradient></defs>
      <ellipse cx={0} cy={0} rx={40} ry={48} fill="#ffb02a" /><rect x={-16} y={40} width={32} height={20} fill="#ff9a2a" />
      <path d="M-58,62 Q0,44 58,62 L56,210 Q0,232 -56,210 Z" fill={`url(#th${blur})`} />
      {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 56},70 Q${sd * 92},140 ${sd * 98},228`} stroke={`url(#tl${blur})`} strokeWidth={34} strokeLinecap="round" fill="none" />)}
      {[-1, 1].map((sd) => <path key={"l" + sd} d={`M${sd * 30},214 L${sd * 36},392`} stroke={`url(#tl${blur})`} strokeWidth={40} strokeLinecap="round" />)}
    </svg>;
    return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #1a0f3a 0%, #05030c 70%)", overflow: "hidden" }}>
      {body(10, 1)}{body(2, 0.35)}
      <div style={{ position: "absolute", right: 120, bottom: 140, width: 36, height: 380, borderRadius: 6, background: "linear-gradient(0deg,#120a3a,#2c1878 25%,#c0202a 55%,#ff7a1a 72%,#ffd23a 88%,#fffbe0)" }} />
      <Tag x={1660} y={540} size={30} color={O.ink}>37 °C</Tag><Tag x={1660} y={920} size={30} color={O.dim}>15 °C</Tag>
      {Array.from({ length: 6 }).map((_, i) => { const p = ((f / 40 + i / 6) % 1); return <Arrow key={i} x1={i % 2 ? 1180 : 760} y1={760 - (i % 3) * 120} x2={i % 2 ? 1180 - 160 * p : 760 + 160 * p} y2={560 - (i % 3) * 60} k={p} color={O.ink} w={5} />; })}
      <Tag x={1320} y={430} op={k} size={52} color={O.cyan}>{opt ? "hands: optional" : "arms & legs first"}</Tag>
      <Tag x={180} y={430} op={ease(f, 6, 18)} size={52} color={O.gold}>heart · brain</Tag>
    </AbsoluteFill>; },
  // 15 grados en el aire (remera, todo bien) vs 15 grados en el agua (tiritando)
  air15: ({ d }) => { const f = F(), sh = Math.sin(f * 2.4) * 6 * ease(f, d * 0.4, d * 0.6);
    return <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}><div style={{ position: "absolute", left: -480, top: 0, width: 1920, height: 1080 }}><RealBg n="beach_8994656" rate={0.4} filter="brightness(0.9)" /></div></div>
      <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}><div style={{ position: "absolute", left: -480, top: 0, width: 1920, height: 1080 }}><RealBg n="lake_36212406" rate={0.4} filter="brightness(0.8) saturate(0.8)" /></div></div>
      <div style={{ position: "absolute", left: 956, top: 0, width: 8, height: 1080, background: "#05121c" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 55%)" }} />
      <Tag x={180} y={330} size={110} color={O.ink}>15 °C</Tag><Tag x={180} y={460} size={46} color={O.ink}>air · T-shirt · fine</Tag>
      <Tag x={1140} y={330} size={110} color={O.ink}>15 °C</Tag><Tag x={1140} y={680} size={46} color={O.cyan} op={ease(f, d * 0.4, d * 0.55)}>water · shivering in minutes</Tag>
      <div style={{ transform: `translateX(${sh}px)` }}><Head x={1460} y={760} s={1.2} blue={ease(f, d * 0.3, d)} /></div>
    </AbsoluteFill>; },
  // las reglas del ranking: caíste, tenés chaleco, nadie sabe, el océano hace lo suyo
  terms: ({ d }) => { const f = F(), L = ["you fell in", "you have a life jacket", "nobody knows you are missing", "the ocean does what it does best"];
    return <Dark tone="#0e2a42">
      {L.map((t, i) => { const k = ease(f, 4 + i * (d / 5), 12 + i * (d / 5)); return <div key={i} style={{ position: "absolute", left: 420, top: 340 + i * 130, display: "flex", alignItems: "center", gap: 36, opacity: k, transform: `translateX(${(1 - k) * -40}px)` }}>
        <div style={{ width: 70, height: 70, borderRadius: 14, border: `5px solid ${i === 3 ? O.red : O.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 48, color: i === 3 ? O.red : O.gold }}>{i === 3 ? "!" : "✓"}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: O.ink }}>{t}</div></div>; })}
    </Dark>; },
  // mapa de un océano con su temperatura · arg = océano (indian | pacific | atlantic | arctic | southern)
  ocean: ({ d, v }) => { const f = F(), m = MAPS.world;
    const D: Record<string, [string, string, string]> = { indian: ["ind_c", "INDIAN", "warmest ocean on Earth"], pacific: ["pac_c", "PACIFIC", "a third of the planet"], atlantic: ["atl_c", "ATLANTIC", "cooler · and it changes fast"] };
    const [pk, n, s] = D[v] ?? D.indian, fx = m.pts[pk][0], fy = m.pts[pk][1];
    return <GeoBase png={M + "world_sat.png"} m={m} d={d} zoom={[1.2, 1.55]} fx={fx} fy={fy} W={1920}>{(P) => { const [x, y] = P(pk); return <>
      <div style={{ position: "absolute", left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${v === "indian" ? "rgba(255,120,40,.45)" : v === "pacific" ? "rgba(95,240,255,.25)" : "rgba(120,170,255,.3)"} 0%, transparent 70%)`, transform: `scale(${0.9 + 0.1 * Math.sin(f / 15)})` }} />
      <Pin x={x} y={y} k={ease(f, 4, 12)} color={O.gold} />
      <Tag x={Math.min(1500, Math.max(420, x))} y={y + 40} op={ease(f, 6, 16)} size={64} center>{n}</Tag>
      <Tag x={Math.min(1500, Math.max(420, x))} y={y + 120} op={ease(f, d * 0.4, d * 0.5)} size={36} color={O.gold} center>{s}</Tag>
    </>; }}</GeoBase>; },
  // termómetro del agua contra la pileta climatizada · arg = indian (30) | indy (28 vs 37) | titanic (−2) | arctic (−1.8) | south (−1.9)
  temp: ({ d, v }) => { const f = F(), k = ease(f, 4, d * 0.6);
    if (v === "indy") return <Dark tone="#14263a">
      <Thermo x={520} y={300} v={lin(f, 0, d * 0.5, 20, 37)} color={O.red} label="your body" />
      <Thermo x={1240} y={300} v={lin(f, 0, d * 0.5, 20, 28)} color={O.orange} label="the water" />
      <Tag x={960} y={950} op={ease(f, d * 0.5, d * 0.62)} size={64} color={O.cyan} center>9 °C colder than you</Tag>
    </Dark>;
    if (v === "indian") return <Dark tone="#2a1a10">
      <Thermo x={560} y={300} v={lin(f, 0, d * 0.5, 10, 30)} color={O.orange} label="Bay of Bengal" />
      <Thermo x={1240} y={300} v={28} color={O.sky} label="heated pool" />
      <Tag x={960} y={950} op={ease(f, d * 0.5, d * 0.62)} size={58} color={O.gold} center>no cold shock · no gasp</Tag>
    </Dark>;
    const T: Record<string, [number, string, string]> = { titanic: [-2, "saltwater stays liquid", "Titanic · April 1912"], arctic: [-1.8, "where seawater freezes", "Arctic Ocean"], south: [-1.9, "just as cold as the Arctic", "Southern Ocean · winter"] };
    const [t, s, lab] = T[v] ?? T.titanic;
    return <Dark tone="#0b2235">
      <Thermo x={560} y={300} v={lin(f, 0, d * 0.5, 10, t)} min={-5} max={30} color={O.cyan} label={lab} />
      <Draw pts={[[480, 300 + 440 - 40 - (380 * 5) / 35], [900, 300 + 440 - 40 - (380 * 5) / 35]]} k={k} color={O.dim} w={4} dash="12 10" />
      <Tag x={920} y={300 + 440 - 40 - (380 * 5) / 35 - 26} op={k} size={38} color={O.dim}>0 °C · ice</Tag>
      <Tag x={880} y={400} op={ease(f, d * 0.4, d * 0.55)} size={58} color={O.cyan}>{s}</Tag>
    </Dark>; },
  // el sol del ecuador: horas → quemadura → ampollas
  sunburn: ({ d }) => { const f = F(), k = ease(f, 0, d), hrs = Math.round(lin(f, 0, d, 1, 24));
    return <Sea y={640} h={10} sky={["#7fc4e6", "#f1e9c6"]} water={["#1d8aa8", "#0a3f5c"]}>
      <div style={{ position: "absolute", left: 1210, top: 30, width: 600, height: 600, borderRadius: 300, mixBlendMode: "screen", background: `radial-gradient(circle, #ffffff 0%, rgba(255,246,210,.9) 7%, rgba(255,226,150,${0.45 + 0.08 * Math.sin(f / 10)}) 22%, rgba(255,210,120,0) 70%)` }} />
      <div style={{ position: "absolute", left: 0, top: 0 }}><Head x={640} y={720} s={1.5} face="up" /></div>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 640px 640px, rgba(230,60,40,${0.45 * k}) 0%, transparent 14%)` }} />
      <Counter x={160} y={320} v={hrs} unit={hrs > 23 ? "hours · blisters" : "hours"} size={120} color={C.red} />
    </Sea>; },
  // rodeado de agua y sin poder tomar: la sal le gana al riñón
  thirst: ({ d }) => { const f = F(), k = ease(f, 6, d * 0.6);
    return <Dark tone="#0d2a3e">
      <Bar x={300} y={430} w={1000} k={0.55 * k} color={O.sky} label="what your kidneys can remove" />
      <Bar x={300} y={700} w={1000} k={0.95 * k} color={O.red} label="salt in seawater" />
      <Tag x={300} y={840} op={ease(f, d * 0.55, d * 0.7)} size={60} color={O.red}>every sip = thirstier</Tag>
    </Dark>; },
  // tres días sin agua dulce
  days3: ({ d }) => { const f = F();
    return <Dark tone="#2a1a10">{[0, 1, 2].map((i) => { const k = ease(f, 6 + i * d * 0.22, 14 + i * d * 0.22); return <div key={i} style={{ position: "absolute", left: 360 + i * 420, top: 380, width: 340, height: 340, borderRadius: 30, border: `5px solid ${i === 2 ? O.red : O.gold}`, opacity: k, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 90, color: i === 2 ? O.red : O.gold }}>DAY {i + 1}</div>; })}
      <Tag x={360} y={790} op={ease(f, d * 0.7, d * 0.8)} size={50} color={O.dim}>no fresh water · in that heat</Tag></Dark>; },
  // el punta blanca oceánico investiga lo que flota · variante many: los tiburones daban vueltas, día y noche
  whitetip: ({ d, v }) => { const f = F(), many = v === "many", n = many ? 5 : 1;
    return <Water top={0.12} bot={0.5} rays={0.9} drift={0.4}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 230, background: "linear-gradient(180deg, rgba(220,245,255,.35), transparent)" }} />
      {many ? [700, 1000, 1300].map((x, i) => <Dangle key={i} x={x + 100} y={14} s={0.8} ph={i * 1.7} />) : <Dangle x={970} y={6} s={1.1} />}
      {Array.from({ length: n }).map((_, i) => { const a = f / (many ? 70 : 90) + (i * Math.PI * 2) / n, x = 960 + Math.cos(a) * (many ? 760 : 520), y = (many ? 720 : 680) + Math.sin(a) * 180 + i * 30, fl = Math.sin(a) < 0;
        return <Shark key={i} x={x} y={y} s={(many ? 0.7 : 1.1) * (0.85 + 0.15 * Math.sin(a))} flip={fl} op={0.95} />; })}
      {!many && <Tag x={160} y={330} op={ease(f, d * 0.4, d * 0.55)} size={46} color={O.ink}>curious about anything floating</Tag>}
    </Water>; },
  // Rizal Shahputra: el tsunami de 2004 lo arrastra desde Sumatra y flota más de una semana
  rizal: ({ d, v }) => { const f = F(), m = MAPS.world, drift = v === "drift";
    return <GeoBase png={M + "world_sat.png"} m={m} d={d} zoom={[2.4, 2.8]} fx={m.pts.banda_aceh[0]} fy={m.pts.banda_aceh[1]} W={1920}>{(P) => { const [x, y] = P("banda_aceh");
      const pts: [number, number][] = Array.from({ length: 12 }).map((_, i) => [x - i * 9 - Math.sin(i) * 6, y + 6 + i * 5]);
      return <>
        <Pin x={x} y={y} k={ease(f, 4, 12)} color={O.red} size={22} label={drift ? undefined : "Sumatra · 26 Dec 2004"} />
        {drift && <><Draw pts={pts} k={ease(f, 4, d * 0.8)} color={O.gold} w={3} dash="6 5" /><Tag x={x + 16} y={y + 40} op={ease(f, d * 0.5, d * 0.6)} size={20} color={O.gold}>8+ days adrift</Tag></>}
      </>; }}</GeoBase>; },
  // más de una semana: contador de días con cocos que pasan
  week: ({ d }) => { const f = F(), dd = lin(f, 0, d * 0.8, 1, 8);
    return <Sea y={620} h={14}>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: ((1900 - f * (2 + i) + i * 600) % 2200) - 100, top: 610 + i * 10, width: 54, height: 48, borderRadius: "50%", background: "#5a3b22" }} />)}
      <div style={{ position: "absolute", left: 300, top: 640, width: 360, height: 26, borderRadius: 13, background: "#6b4a2a", transform: `rotate(${Math.sin(f / 20) * 4}deg)` }} />
      <Head x={480} y={700} s={1.1} />
      <Counter x={1060} y={340} v={dd} unit={dd > 7.5 ? "days · alive" : "days"} size={160} color={O.gold} />
    </Sea>; },
  // el Índico se calienta más rápido que casi cualquier otro océano
  warming: ({ d }) => { const f = F(), k = ease(f, 4, d * 0.8);
    return <Dark tone="#2a160c">
      <Draw pts={Array.from({ length: 30 }).map((_, i) => [260 + i * 48, 800 - i * i * 0.45 - Math.sin(i * 1.3) * 18] as [number, number])} k={k} color={O.orange} w={10} />
      <Tag x={260} y={850} size={36} color={O.dim}>1950</Tag><Tag x={1600} y={850} size={36} color={O.dim}>today</Tag>
      <Tag x={1160} y={330} op={ease(f, d * 0.6, d * 0.75)} size={58} color={O.orange}>warming faster</Tag>
    </Dark>; },
  // Point Nemo: 2.700 km a la tierra más cercana · variante iss: la estación espacial pasa a 400 km sobre tu cabeza
  nemo: ({ d, v }) => { const f = F(), m = MAPS.spac;
    if (v === "iss") { const ix = lin(f, 0, d, -200, 2100);
      return <AbsoluteFill style={{ background: "#000" }}>
        <RealBg n="iss_cissp2" rate={0.7} filter="brightness(0.85) contrast(1.1)" />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
        <div style={{ position: "absolute", left: ix - 6, top: 300, width: 12, height: 12, borderRadius: 6, background: "#fff", boxShadow: "0 0 18px 6px rgba(255,255,255,.7)" }} />
        <Draw pts={[[960, 400], [960, 860]]} k={ease(f, 6, d * 0.5)} color={O.dim} w={4} dash="14 12" />
        <Tag x={1000} y={600} op={ease(f, d * 0.3, d * 0.45)} size={72} color={O.ink}>400 km up</Tag>
        <Tag x={1000} y={690} op={ease(f, d * 0.5, d * 0.6)} size={40} color={O.dim}>the closest humans to you</Tag>
      </AbsoluteFill>; }
    return <GeoBase png={M + "spac_sat.png"} m={m} d={d} zoom={[1, 1.12]} fx={m.pts.nemo[0]} fy={m.pts.nemo[1]}>{(P) => { const [x, y] = P("nemo"), [dx, dy] = P("ducie"), [mx, my] = P("maher"), r = Math.hypot(dx - x, dy - y) * ease(f, d * 0.2, d * 0.6);
      return <>
        <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `5px dashed ${O.gold}` }} />
        <Pin x={x} y={y} k={ease(f, 4, 12)} color={O.red} label="POINT NEMO" />
        <Pin x={dx} y={dy} k={ease(f, d * 0.5, d * 0.6)} color={O.gold} size={30} label="Ducie Island" /><Pin x={mx} y={my} k={ease(f, d * 0.55, d * 0.65)} color={O.gold} size={30} label="Antarctica" left />
        <Tag x={x - 160} y={y + 60} op={ease(f, d * 0.4, d * 0.55)} size={50} color={O.gold}>2,700 km to land</Tag>
      </>; }}</GeoBase>; },
  // la Fosa de las Marianas: el Everest entra con 2 km de sobra · variante top2: sólo importan los dos metros de arriba
  mariana: ({ d, v }) => { const f = F(), top2 = v === "top2", k = ease(f, 4, d * 0.6), H = 640, Y0 = 330, ev = (8849 / 10935) * H;
    if (top2) return <Sea y={420} h={16} water={["#1f6a8c", "#000"]} over={<>
      <Draw pts={[[1180, 430], [1180, 640]]} k={k} color={O.gold} w={6} /><Tag x={1220} y={500} op={k} size={60} color={O.gold}>2 m</Tag>
      <Tag x={1220} y={760} op={ease(f, d * 0.5, d * 0.6)} size={42} color={O.ink}>the other 10,933 m don't matter</Tag></>}>
      <Head x={960} y={500} s={1.6} />
    </Sea>;
    return <Dark tone="#06182a">
      <div style={{ position: "absolute", left: 0, right: 0, top: Y0 - 4, height: 6, background: O.sky }} />
      <SV><path d={`M${700},${Y0 + H} L${960},${Y0 + H - ev * k} L${1220},${Y0 + H} Z`} fill="#6b5a48" /><path d={`M${930},${Y0 + H - ev * k + 30} L${960},${Y0 + H - ev * k} L${990},${Y0 + H - ev * k + 30} Z`} fill="#f1f1f1" /></SV>
      <div style={{ position: "absolute", left: 420, top: Y0 + H, width: 1080, height: 12, background: "#3a2a1f" }} />
      <Tag x={1260} y={Y0 + H - ev * k - 30} op={k} size={40}>Everest · 8,849 m</Tag>
      <Draw pts={[[1500, Y0], [1500, Y0 + H]]} k={k} color={O.dim} w={4} /><Tag x={1530} y={Y0 + H / 2} op={k} size={40} color={O.dim}>10,935 m</Tag>
      <Tag x={1000} y={Y0 + (H - ev * k) / 2 - 28} op={ease(f, d * 0.55, d * 0.7)} size={52} color={O.orange}>+2 km to spare</Tag>
    </Dark>; },
  // el Pacífico va de baño tibio en el ecuador a casi helado en Alaska
  pactemp: ({ d }) => { const f = F(), k = ease(f, 4, d * 0.7);
    return <Dark tone="#0b2235">
      <div style={{ position: "absolute", left: 360, top: 330, width: 1200, height: 90, borderRadius: 45, background: `linear-gradient(90deg, ${O.orange}, ${O.gold} 40%, ${O.sky} 75%, ${O.cyan})`, clipPath: `inset(0 ${100 - 100 * k}% 0 0 round 45px)` }} />
      <Tag x={360} y={450} size={44} color={O.orange}>equator · like a bath</Tag><Tag x={1180} y={450} op={ease(f, d * 0.5, d * 0.6)} size={44} color={O.cyan}>Alaska · near freezing</Tag>
      <Counter x={360} y={560} v={29} unit="°C" size={130} color={O.orange} /><Counter x={1260} y={560} v={lin(f, d * 0.5, d * 0.8, 29, 4)} unit="°C" size={130} color={O.cyan} />
    </Dark>; },
  // USS Indianapolis: se hunde en 12 minutos · variante count: 900 al agua → 316 vivos · variante days: casi cuatro días hasta que un avión los ve
  indy: ({ d, v }) => { const f = F();
    if (v === "count") { const n = lin(f, d * 0.15, d * 0.85, 900, 316);
      return <Dark tone="#14202c">
        <div style={{ position: "absolute", left: 300, top: 300, width: 1320, display: "flex", flexWrap: "wrap", gap: 6 }}>{Array.from({ length: 90 }).map((_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: i < Math.round(n / 10) ? JACKET : "rgba(244,239,230,.12)" }} />)}</div>
        <Counter x={300} y={560} v={n} unit="men" size={190} color={n < 400 ? O.red : O.ink} label={n < 400 ? "still alive" : "in the water"} />
      </Dark>; }
    if (v === "days") { const dd = lin(f, 0, d * 0.75, 0, 4), pl = ease(f, d * 0.7, d);
      return <Sea y={640} h={14} sky={["#4c7896", "#c2d6e0"]}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Head key={i} x={260 + i * 150} y={700 + (i % 2) * 40} s={0.6} />)}
        <svg width={240} height={90} viewBox="-120 -45 240 90" style={{ position: "absolute", left: lin(pl, 0, 1, 2100, 1300), top: 300 }}><path d="M-110,0 L90,0 L120,-10 L90,10 L-110,10 Z" fill="#26313c" /><rect x={-20} y={-40} width={30} height={90} fill="#26313c" /></svg>
        <Counter x={1180} y={460} v={dd} unit="days" size={140} color={O.ink} label={pl > 0.3 ? "spotted by accident" : "nobody knew"} />
      </Sea>; }
    const k = ease(f, 0, d), tilt = 18 * k;
    return <Sea y={620} h={12} sky={["#253446", "#7c8a96"]}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${180 * k}px) rotate(${tilt}deg)`, transformOrigin: "900px 620px" }}><Ship x={900} y={640} s={2.6} color="#1d2833" /></div>
      <Counter x={1300} y={300} v={lin(f, 0, d, 0, 12)} unit="min" size={140} color={O.red} label="to sink" />
    </Sea>; },
  // la corriente del Golfo (tibia) al lado del agua fría del Ártico: 10 grados de diferencia en poco trecho
  gulf: ({ d, v }) => { const f = F(), m = MAPS.natl, side = v === "side";
    return <GeoBase png={M + "natl_sat.png"} m={m} d={d} zoom={[1, 1.1]} fx={0.35} fy={0.5}>{(P) => { const [fx2, fy2] = P("florida"), [nx, ny] = P("newyork"), [ux, uy] = P("uk"), [hx, hy] = P("halifax");
      const warm: [number, number][] = [[fx2 + 30, fy2], [nx + 60, ny + 20], [hx + 160, hy + 60], [ux - 120, uy + 40]];
      const cold: [number, number][] = [[hx + 230, hy - 190], [hx + 110, hy - 90], [hx + 40, hy - 20], [nx + 70, ny - 10]];
      return <>
        <Draw pts={warm} k={ease(f, 4, d * 0.5)} color={O.orange} w={26} glow />
        <Draw pts={cold} k={ease(f, d * 0.25, d * 0.65)} color={O.cyan} w={20} glow />
        <Tag x={nx + 150} y={ny + 90} op={ease(f, 10, 20)} size={40} color={O.orange}>Gulf Stream</Tag>
        <Tag x={hx + 260} y={hy - 200} op={ease(f, d * 0.4, d * 0.5)} size={40} color={O.cyan}>from the Arctic</Tag>
        {side ? <><Tag x={nx + 140} y={ny + 150} op={ease(f, d * 0.5, d * 0.6)} size={46} color={O.orange}>hours</Tag><Tag x={hx - 40} y={hy - 70} op={ease(f, d * 0.6, d * 0.7)} size={46} color={O.cyan}>minutes</Tag></>
          : <Tag x={nx + 80} y={ny - 120} op={ease(f, d * 0.6, d * 0.7)} size={56} color={O.ink}>a 10 °C drop · in a short distance</Tag>}
      </>; }}</GeoBase>; },
  // el Titanic: dónde se hundió · variante carpathia: dos horas de rescate vs 15-30 minutos de conciencia
  titanic: ({ d, v }) => { const f = F();
    if (v === "carpathia") { const k = ease(f, 4, d * 0.8);
      return <Dark tone="#0b2235">
        <Draw pts={[[240, 640], [1680, 640]]} k={1} color={O.dim} w={6} />
        {[["0", 240], ["30 min", 600], ["1 h", 960], ["2 h", 1680]].map(([t, x], i) => <Tag key={i} x={(x as number) - 30} y={680} size={36} color={O.dim}>{t}</Tag>)}
        <div style={{ position: "absolute", left: 240, top: 540, width: 360 * ease(f, 4, d * 0.4), height: 80, background: "rgba(95,240,255,.45)", borderRadius: 12 }} />
        <Tag x={250} y={460} op={ease(f, 6, 18)} size={46} color={O.cyan}>conscious · 15–30 min</Tag>
        <div style={{ position: "absolute", left: 240 + 1440 * k - 20, top: 560, width: 40, height: 40, borderRadius: 20, background: O.gold }} />
        <Tag x={1300} y={460} op={ease(f, d * 0.7, d * 0.8)} size={46} color={O.gold}>Carpathia arrives</Tag>
      </Dark>; }
    const m = MAPS.natl;
    return <GeoBase png={M + "natl_sat.png"} m={m} d={d} zoom={[1, 1.25]} fx={m.pts.titanic[0]} fy={m.pts.titanic[1]}>{(P) => { const [x, y] = P("titanic"); return <>
      <Pin x={x} y={y} k={ease(f, 4, 12)} color={O.red} label="TITANIC · 15 April 1912" />
      <Tag x={x - 60} y={y + 50} op={ease(f, d * 0.4, d * 0.55)} size={48} color={O.cyan}>water: −2 °C</Tag>
    </>; }}</GeoBase>; },
  // la tabla de supervivencia: temperatura del agua → tiempo
  table: ({ d }) => { const f = F(), R: [string, string][] = [["below 0 °C", "under 15–45 min"], ["0–5 °C", "30–90 min"], ["5–10 °C", "1–3 hours"], ["10–15 °C", "1–6 hours"], ["15–20 °C", "2–40 hours"], ["above 25 °C", "indefinite"]];
    return <Dark tone="#0e2a42">
      <Tag x={440} y={300} size={36} color={O.dim}>WATER</Tag><Tag x={1100} y={300} size={36} color={O.dim}>SURVIVAL TIME</Tag>
      {R.map(([a, b], i) => { const k = ease(f, 4 + i * 5, 12 + i * 5), hot = i === 3 && f > d * 0.4; return <div key={i} style={{ position: "absolute", left: 400, top: 360 + i * 92, width: 1120, height: 80, borderRadius: 14, background: hot ? "rgba(233,199,98,.18)" : "rgba(255,255,255,.04)", border: hot ? `4px solid ${O.gold}` : "none", opacity: k }}>
        <div style={{ position: "absolute", left: 40, top: 14, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: hot ? O.gold : O.ink }}>{a}</div>
        <div style={{ position: "absolute", left: 700, top: 14, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: hot ? O.gold : O.ink }}>{b}</div></div>; })}
    </Dark>; },
  // el Ártico: casi todo cubierto de hielo
  arctic: ({ d }) => { const f = F(), m = MAPS.arctic;
    return <GeoBase png={M + "arctic_sat.png"} m={m} d={d} zoom={[1, 1.1]}>{(P) => { const [x, y] = P("northpole"), r = 300 * ease(f, 4, d * 0.5); return <>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,250,255,.85) 0%, rgba(220,240,250,.6) 60%, transparent 100%)" }} />
      <Pin x={x} y={y} k={ease(f, d * 0.4, d * 0.5)} color={O.cyan} label="ARCTIC OCEAN" />
    </>; }}</GeoBase>; },
  // bajo el hielo: el agujero por donde caíste se corre y arriba sólo queda un techo blanco · variante edge: el borde es muy alto y resbaloso
  underice: ({ d, v }) => { const f = F();
    if (v === "edge") return <Sea y={640} h={6} sky={["#a9c4d4", "#e4eef3"]} water={["#123e58", "#02101c"]} over={<>
      <Tag x={1000} y={720} op={ease(f, d * 0.3, d * 0.45)} size={46} color={O.red}>too high · too slippery</Tag>
      <Tag x={1000} y={790} op={ease(f, d * 0.5, d * 0.65)} size={40} color={O.ink}>with hands that don't work anymore</Tag></>}>
      <div style={{ position: "absolute", left: 960, top: 560, width: 960, height: 90, background: "linear-gradient(180deg,#f4fbff,#bcd6e4)" }} />
      <Head x={820} y={710} s={1.3} blue={0.7} />
      <Arrow x1={900} y1={620} x2={950} y2={560} k={0.6 + 0.4 * Math.sin(f / 6)} color={O.red} w={8} />
    </Sea>;
    const hx = lin(f, 0, d * 0.8, 900, 1500);
    return <AbsoluteFill style={{ background: "linear-gradient(180deg,#bfe0ef 0%,#7fb3cc 12%,#0d3550 40%,#010810 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 330, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg,#000 45%,transparent 100%)" }}><RealBg n="arct_30403586" rate={0.3} filter="brightness(1.15) contrast(0.85) saturate(0.6) hue-rotate(-12deg)" /></div>
      <div style={{ position: "absolute", left: hx, top: 0, width: 260, height: 120, borderRadius: "0 0 60px 60px", background: "#061c2c", opacity: 1 - ease(f, d * 0.55, d * 0.9) }} />
      <Snow n={50} drift={0.2} />
      <Dangle x={970} y={150} s={1.1} />
      <Tag x={180} y={700} op={ease(f, d * 0.3, d * 0.45)} size={50} color={O.ink}>only a white ceiling</Tag>
    </AbsoluteFill>; },
  // el hielo calma el agua: plano bajo el hielo vs olas de mar abierto
  calm: ({ d }) => { const f = F(), w = (y: number, a: number) => `M0,1080 L0,${y} ${Array.from({ length: 25 }).map((_, i) => `L${i * 40},${y + Math.sin(i * 0.7 + f / 7) * a}`).join(" ")} L960,${y} L960,1080 Z`;
    return <AbsoluteFill style={{ background: "#9cc0d2" }}>
      <SV><path d={w(600, 3)} fill="#1b5070" /><rect x={0} y={520} width={960} height={70} fill="#eef7fb" /><g transform="translate(960,0)"><path d={w(600, 90)} fill="#14465f" /></g></SV>
      <Tag x={180} y={330} size={60} color="#0b2a3e">under the ice: flat</Tag>
      <Tag x={1140} y={330} op={ease(f, d * 0.4, d * 0.5)} size={60} color="#0b2a3e">no ice: waves</Tag>
    </AbsoluteFill>; },
  // el océano Austral: el anillo que rodea la Antártida sin tocar tierra · variante bands: los 40 rugientes, 50 furiosos, 60 aullantes
  south: ({ d, v }) => { const f = F(), m = MAPS.south, bands = v === "bands";
    return <GeoBase png={M + "south_sat.png"} m={m} d={d} zoom={[1, 1.08]}>{(P) => { const [cx, cy] = P("sou_c"), [px, py] = P([0.53, 0.43]);
      if (bands) return <>{[["ROARING 40s", 470, O.gold], ["FURIOUS 50s", 380, O.orange], ["SCREAMING 60s", 290, O.red]].map(([n, r, c], i) => { const k = ease(f, 6 + i * (d / 4), 14 + i * (d / 4)), rr = r as number; return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: px - rr, top: py - rr, width: 2 * rr, height: 2 * rr, borderRadius: "50%", border: `6px solid ${c}`, opacity: k }} />
          <Tag x={px + rr + 14} y={py + (i - 1) * 70 - 20} op={k} size={38} color={c as string}>{n}</Tag></React.Fragment>; })}</>;
      return <>{Array.from({ length: 14 }).map((_, i) => { const a = f / 40 + (i / 14) * Math.PI * 2, r = 330, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, a2 = a + 0.25;
        return <Arrow key={i} x1={x} y1={y} x2={cx + Math.cos(a2) * r} y2={cy + Math.sin(a2) * r} k={ease(f, 4, 20)} color={O.cyan} w={8} />; })}
        <Tag x={cx - 220} y={cy + 380} op={ease(f, d * 0.4, d * 0.5)} size={46} color={O.cyan}>all the way around · no land</Tag></>; }}</GeoBase>; },
  // olas: vos (cabeza) contra 10 m de mar de fondo y 20 m de tormenta
  waves: ({ d }) => { const f = F(), k1 = ease(f, 4, d * 0.4), k2 = ease(f, d * 0.45, d * 0.85), base = 940, px = 22;
    const wv = (x: number, h: number, c: string) => <path d={`M${x - 340},${base} Q${x - 120},${base - h * 0.2} ${x - 40},${base - h} Q${x + 40},${base - h - 20} ${x + 110},${base - h + 40} Q${x + 200},${base - h * 0.4} ${x + 360},${base} Z`} fill={c} />;
    return <AbsoluteFill style={{ background: "#2a3640", overflow: "hidden" }}>
      <Plate kind="sea" y={base} rate={0.6} k={3} vstyle={{ filter: "brightness(0.8) saturate(0.8)" }} />
      <SV><defs><linearGradient id="wvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8aa2" stopOpacity={0.9} /><stop offset="100%" stopColor="#0d2c40" stopOpacity={0.95} /></linearGradient></defs>
        <g stroke="#eef6f8" strokeWidth={5} strokeOpacity={0.7}>{wv(820, 10 * 48 * k1, "url(#wvg)")}{wv(1460, 20 * 30 * k2, "url(#wvg)")}</g></SV>
      <Head x={330} y={base + 10} s={0.5} />
      <Tag x={720} y={base - 10 * 48 * k1 - 70} op={k1} size={52}>10 m · normal here</Tag>
      <Tag x={1300} y={base - 600 * k2 - 70} op={k2} size={52} color={O.red}>20 m+ · storms</Tag>
      <Tag x={250} y={base - 120} size={34} color={O.dim}>you</Tag>
      {px > 0 && null}
    </AbsoluteFill>; },
  // cada pocos segundos una ola rompe sobre tu cabeza: cada una, otra chance de tragar mar
  breaking: ({ d }) => { const f = F(), per = 75, p = (f % per) / per, wx = lin(p, 0, 1, 2000, -700), n = Math.floor(f / per) + 1;
    return <Sea y={640} h={24} sky={["#3c4a56", "#86939c"]} water={["#24546c", "#04182a"]} spd={2}>
      <Head x={760} y={720} s={1.4} face="up" />
      <SV><path d={`M${wx},1100 Q${wx + 120},360 ${wx + 460},470 Q${wx + 320},520 ${wx + 560},700 L${wx + 980},1100 Z`} fill="#1b4c64" /><path d={`M${wx + 140},520 Q${wx + 260},380 ${wx + 460},470`} stroke="#eef8ff" strokeWidth={18} fill="none" /></SV>
      <Counter x={1300} y={300} v={n} unit={n === 1 ? "wave" : "waves"} size={130} color={O.ink} label="another chance to inhale the sea" />
    </Sea>; },
  // viento helado y espuma: no ves el horizonte
  spray: ({ d }) => { const f = F();
    return <Sea y={600} h={30} sky={["#4a5864", "#9aa6ae"]} water={["#2a5a72", "#061c2c"]} spd={2.5}>
      {Array.from({ length: 140 }).map((_, i) => { const x = ((rnd(i, 3) * 2400 + f * (18 + rnd(i, 4) * 20)) % 2400) - 240, y = 200 + rnd(i, 5) * 700; return <div key={i} style={{ position: "absolute", left: x, top: y, width: 40 + rnd(i, 6) * 80, height: 3, background: "rgba(255,255,255,.55)", transform: "rotate(-6deg)" }} />; })}
      <Head x={700} y={680} s={1.3} blue={0.5} face="up" />
      <AbsoluteFill style={{ background: "rgba(220,230,236,.25)" }} />
    </Sea>; },
  // Shackleton 1916: Isla Elefante → Georgia del Sur, 1.300 km en un bote abierto · variante none: ninguno cayó al agua
  shack: ({ d, v }) => { const f = F(), m = MAPS.south, none = v === "none";
    return <GeoBase png={M + "south_sat.png"} m={m} d={d} zoom={[1.6, 1.9]} fx={(m.pts.elephant[0] + m.pts.southgeorgia[0]) / 2} fy={(m.pts.elephant[1] + m.pts.southgeorgia[1]) / 2}>{(P) => { const [ex, ey] = P("elephant"), [gx, gy] = P("southgeorgia"), k = none ? 1 : ease(f, 6, d * 0.85);
      const pts: [number, number][] = Array.from({ length: 11 }).map((_, i) => [ex + (gx - ex) * (i / 10), ey + (gy - ey) * (i / 10) - Math.sin((i / 10) * Math.PI) * 30]);
      const i = Math.min(9, Math.floor(k * 10)), bx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * (k * 10 - i), by = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (k * 10 - i);
      return <>
        <Draw pts={pts} k={k} color={O.gold} w={5} dash={none ? undefined : undefined} />
        <Pin x={ex} y={ey} k={1} color={O.red} size={22} label="Elephant Island" left /><Pin x={gx} y={gy} k={ease(f, d * 0.6, d * 0.7)} color={O.gold} size={22} label="South Georgia" />
        <div style={{ position: "absolute", left: bx - 12, top: by - 6, width: 24, height: 12, borderRadius: 6, background: "#f4efe6" }} />
        <Tag x={(ex + gx) / 2 + 30} y={(ey + gy) / 2 + 40} op={ease(f, d * 0.3, d * 0.45)} size={24} color={O.gold}>{none ? "0 fell in" : "1,300 km · open boat · 1916"}</Tag>
      </>; }}</GeoBase>; },
  // lejos de todo: el hospital más cercano a miles de km, días de tormenta
  faraway: ({ d }) => { const f = F(), m = MAPS.south;
    return <GeoBase png={M + "south_sat.png"} m={m} d={d} zoom={[1, 1.06]}>{(P) => { const [x, y] = P([0.2, 0.62]);
      return <>{[1, 2, 3].map((i) => { const r = i * 140 * ease(f, 4 + i * 8, 20 + i * 8); return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `4px dashed ${O.dim}` }} />; })}
        <Pin x={x} y={y} k={ease(f, 2, 10)} color={O.red} label="you" />
        <Tag x={960} y={900} op={ease(f, d * 0.5, d * 0.6)} size={50} color={O.ink} center>thousands of km to a hospital</Tag></>; }}</GeoBase>; },
  // la foca leopardo: 3 m, cabeza de reptil, patrulla el borde del hielo
  lseal: ({ d }) => { const f = F(), x = lin(f, 0, d, 1600, 900);
    return <Water top={0.15} bot={0.55} rays={0.4} drift={0.4}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "linear-gradient(180deg,#f2fbff,#c4dde9)" }} />
      <svg width={760} height={240} viewBox="-380 -120 760 240" style={{ position: "absolute", left: x - 380, top: 560 }}><path d={`M-360,0 Q-300,-70 -200,-60 Q0,-80 200,-40 Q320,-10 360,${Math.sin(f / 8) * 20} Q320,40 200,40 Q0,80 -200,60 Q-300,70 -360,0 Z`} fill="#6f7a82" /><path d="M-300,-10 Q-250,-30 -200,-10" stroke="#20262a" strokeWidth={6} fill="none" /><circle cx={-270} cy={-28} r={8} fill="#111" /></svg>
      <Draw pts={[[x - 360, 820], [x + 360, 820]]} k={ease(f, d * 0.3, d * 0.5)} color={O.gold} w={5} /><Tag x={x - 60} y={840} op={ease(f, d * 0.3, d * 0.5)} size={46} color={O.gold}>3 m</Tag>
      <Tag x={160} y={330} op={ease(f, d * 0.5, d * 0.65)} size={48} color={O.ink}>it patrols the ice edge</Tag>
    </Water>; },
  // tres minutos: el boqueo dura eso, y en estas olas es cuando tragás el mar
  min3: ({ d }) => { const f = F(), t = lin(f, 0, d * 0.9, 180, 0), mm = Math.floor(t / 60), ss = Math.floor(t % 60);
    return <Dark tone="#2a0e12">
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 300, color: O.red, textShadow: "0 0 60px rgba(255,59,48,.4)" }}>{mm}:{String(ss).padStart(2, "0")}</div>
      <Tag x={960} y={720} center size={52} color={O.dim} op={ease(f, 10, 22)}>Southern Ocean</Tag>
    </Dark>; },
  // nadie va a venir: unos minutos de manos y el horizonte vacío
  nobody: ({ d }) => { const f = F();
    return <Sea y={600} h={26} sky={["#3c4a56", "#86939c"]} water={["#24546c", "#04182a"]} spd={1.6}>
      <Head x={960} y={690} s={1} blue={0.8} face="up" />
      <AbsoluteFill style={{ background: "#000", opacity: 0.4 * ease(f, d * 0.4, d) }} />
    </Sea>; },
  // la mayoría se ahoga cerca de la orilla: la playa a pocos metros · variante rip: la corriente te saca · variante lake: lago en primavera
  shore: ({ d, v }) => { const f = F(), rip = v === "rip", lake = v === "lake";
    if (lake) return <AbsoluteFill style={{ background: "#000" }}>
      <RealBg n="lake_16693722" rate={0.4} filter="brightness(0.75)" />
      <Thermo x={500} y={300} v={22} color={O.orange} label="the air" h={420} />
      <Thermo x={1300} y={300} v={lin(f, 0, d * 0.5, 22, 8)} color={O.cyan} label="the lake" h={420} />
    </AbsoluteFill>;
    const off = rip ? lin(f, 0, d, 0, 360) : 0;
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <RealBg n={rip ? "beach_36067914" : "beach_10885349"} rate={0.4} filter="brightness(0.85)" />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      {rip && Array.from({ length: 5 }).map((_, i) => { const p = ((f / 30 + i / 5) % 1); return <Arrow key={i} x1={960} y1={740 - p * 60} x2={960} y2={740 - p * 400} k={p} color={O.red} w={8} />; })}
      {!rip && <><Head x={960} y={640} s={0.45} /><Draw pts={[[1040, 600], [1040, 700]]} k={1} color={O.gold} w={4} dash="10 8" /></>}
      <Tag x={1150} y={700} size={44} color={O.ink} op={ease(f, d * 0.3, d * 0.45)}>{rip ? "a rip current you never saw" : "a few meters from safety"}</Tag>
    </AbsoluteFill>; },
  // flotá boca arriba, cara afuera, y dejá pasar el boqueo
  float: ({ d }) => { const f = F(), t = Math.round(lin(f, 0, d * 0.9, 0, 60));
    return <Sea y={620} h={10} sky={["#7fb3cc", "#d6e6ec"]} over={<svg width={640} height={180} viewBox="-320 -90 640 180" style={{ position: "absolute", left: 640, top: 520 + Math.sin(f / 10) * 6 }}>
        <defs><linearGradient id="fbj" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff9a40" /><stop offset="60%" stopColor="#d9530f" /><stop offset="100%" stopColor="#6e2306" /></linearGradient>
          <radialGradient id="fbs" cx="0.4" cy="0.3" r="0.8"><stop offset="0%" stopColor="#d9a37c" /><stop offset="70%" stopColor="#7a4a33" /><stop offset="100%" stopColor="#2a1810" /></radialGradient></defs>
        <path d="M40,-12 Q160,-20 272,-6 L272,18 Q160,28 40,26 Z" fill="#1b2433" />
        <path d="M-252,-28 Q-120,-46 34,-32 L44,36 Q-120,50 -252,32 Z" fill="url(#fbj)" />
        <path d="M-244,0 Q-110,14 34,4" stroke="#dde4e8" strokeWidth={8} fill="none" opacity={0.7} />
        <ellipse cx={-300} cy={-8} rx={44} ry={36} fill="url(#fbs)" /><path d="M-338,-26 Q-300,-58 -262,-26 Q-300,-40 -338,-26 Z" fill="#1a120c" />
        <rect x={-360} y={8} width={650} height={60} fill="#2a5a72" opacity={0.55} />
        <ellipse cx={-30} cy={10} rx={340} ry={9} fill="none" stroke="#eef6f8" strokeWidth={4} opacity={0.5} />
      </svg>}>
      <Counter x={760} y={300} v={t} unit="seconds" size={130} color={O.ink} label="let the gasp pass" />
    </Sea>; },
};

export const Scene: React.FC<{ name: string; d: number }> = ({ name, d }) => {
  const [n, v = ""] = name.split(":"), Sc = S[n];
  return Sc ? <Sc d={d} v={v} /> : <AbsoluteFill style={{ background: "#300" }} />;
};
export const SCENES = Object.keys(S);
export { C };
