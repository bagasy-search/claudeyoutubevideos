// Kit "LAS MOSCAS DE LA COCINA" (Claudio el Fumigador ep. 8 `fumoscasf`, vlog continuo). Todo DENTRO del mundo:
// los gráficos van sobre un cuadro REAL del video (cama = bed_<n>.mp4, un trozo del propio vlog), con la luz de la
// escena encima y MOVIMIENTO CONTINUO (acercamiento, brisa, alas, olor que fluye: nunca un cuadro quieto >2 s).
// El rótulo va sobre la franja vacía de arriba a la izquierda del cartel y la nota manuscrita ARRIBA del cartel:
// ninguno tapa el dibujo. Texto en TÚ neutro.
//   ClFlyDoor    corte de la casa: el bote abierto llena la cocina de olor, el olor sale por la PUERTA al patio y a la
//                calle, y las moscas de la calle lo siguen y entran por ahí. Por la ventana con mosquitero, no.
//   ClLemon10    la ventana de la cocina: el medio limón en el borde; se le clavan los DIEZ clavos uno por uno y suelta
//                el olor que no soportan. A la derecha, la otra ventana con su propio limón ("una por ventana").
//   ClTapeHigh   la cocina de costado: la cinta colgada del marco de arriba, las TRES reglas y la línea de altura de
//                Bruno (el perro pasa por abajo) mientras la cinta gira y se va llenando de moscas.
//   ClMoscasMap  la cocina en corte con los cuatro arreglos puestos y las dos ventanas que se CIERRAN al final.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, Tape, lin, pop, useOut } from "./ClParts";

const SW = 1608, SH = 580;            // el dibujo de todos los carteles mide lo mismo

// ── piezas comunes ────────────────────────────────────────────────────────────────────────────────────────────
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 34 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 12}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "5px 18px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
// nota manuscrita de Claudio: va pegada con cinta de papel, arriba del cartel (nunca flotando en el aire)
const Note: React.FC<{ x: number; y: number; o: number; big: string; small?: string; rot?: number; color?: string }> = ({ x, y, o, big, small, rot = -1.4, color = CL.navy }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 16}px) rotate(${rot}deg)` }}>
    <Card style={{ padding: "10px 26px 12px", borderBottom: `6px solid ${color}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: CL.ink, lineHeight: 1.04 }}>{big}</div>
      {small ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color, lineHeight: 1 }}>{small}</div> : null}
    </Card>
    <Tape x={50} y={-16} rot={-7} w={150} />
  </div>
);
// el cartel: cama real + hoja de papel con el dibujo, con acercamiento continuo y salida suave
const Sheet: React.FC<{ bed?: string; seed: number; dim?: number; rot?: number; children: React.ReactNode }> = ({ bed, seed, dim = 0.42, rot = -1, children }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 2, 14), push = 1 + 0.05 * (f / T);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={seed} dim={dim} />
      <div style={{ position: "absolute", left: 960, top: 566, translate: "-50% -50%", scale: String((0.87 + 0.13 * p) * push), rotate: `${rot}deg` }}>
        <Card style={{ width: SW + 52, padding: "18px 26px 22px", background: "#FFFDF6" }}>{children}</Card>
      </div>
      <RoomLight k={0.42} />
    </AbsoluteFill>
  );
};
// la mosca común de costado, con las alas batiendo (t = fase del batido)
const Fly: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; t?: number }> = ({ x, y, s = 1, r = 0, o = 1, t = 0 }) => {
  const w = 0.30 + 0.70 * Math.abs(Math.sin(t));
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      <ellipse cx={2} cy={-16} rx={24} ry={3 + 10 * w} fill="rgba(226,238,255,0.5)" stroke="rgba(120,140,170,0.75)" strokeWidth={1.6} transform="rotate(-20)" />
      <ellipse cx={30} cy={-6} rx={20} ry={3 + 8 * w} fill="rgba(226,238,255,0.42)" stroke="rgba(120,140,170,0.65)" strokeWidth={1.6} transform="rotate(16)" />
      <ellipse cx={4} cy={0} rx={27} ry={15} fill="#3B404B" stroke="#20242B" strokeWidth={2} />
      <ellipse cx={-19} cy={-4} rx={12} ry={11} fill="#2C313A" stroke="#20242B" strokeWidth={2} />
      <circle cx={-24} cy={-9} r={5} fill="#8E2222" />
      <path d="M-27 -12 l-9 -9 M-27 -12 l-12 -2" stroke="#20242B" strokeWidth={2} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (<line key={i} x1={-6 + i * 11} y1={-13} x2={-6 + i * 11} y2={13} stroke="#20242B" strokeWidth={2.4} opacity={0.6} />))}
      {[-6, 10].map((lx, i) => (<line key={i} x1={lx} y1={14} x2={lx - 6} y2={24} stroke="#2C313A" strokeWidth={2.6} strokeLinecap="round" />))}
    </g>
  );
};
// corriente de olor: el dash corre hacia `dir` (-1 = hacia la izquierda). El dibujo va espejado y el offset
// positivo hace que las rayas marchen hacia el extremo del trazo, o sea hacia `dir`.
const Stink: React.FC<{ x: number; y: number; len: number; f: number; o?: number; dir?: number; n?: number; color?: string }> = ({ x, y, len, f, o = 1, dir = -1, n = 3, color = "#9DBF5E" }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${dir} 1)`}>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M0 ${i * 22} q ${len * 0.22} ${i % 2 ? -22 : 22} ${len * 0.45} 0 q ${len * 0.22} ${i % 2 ? 22 : -22} ${len * 0.45} 0`}
        stroke={color} strokeWidth={8 - i * 0.9} fill="none" strokeLinecap="round" opacity={0.85 - i * 0.16}
        strokeDasharray="48 32" strokeDashoffset={(f * 6 + i * 26) % 80} />
    ))}
  </g>
);
// el perro de la casa (Bruno) sentado de costado. El origen (0,0) es el piso, entre las patas delanteras.
const Dog: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M-64 -46 q -22 -26 2 -44 q 26 -8 34 22" fill="#A87F49" stroke="#7A5A32" strokeWidth={4} strokeLinecap="round" />
    <circle cx={-30} cy={-46} r={44} fill="#C79A62" stroke="#7A5A32" strokeWidth={4} />
    <path d="M-66 -30 q 22 -46 68 -40 q 40 6 46 44 l -6 26 h -102 z" fill="#D2A66C" stroke="#7A5A32" strokeWidth={4} />
    <circle cx={36} cy={-100} r={28} fill="#D9AE74" stroke="#7A5A32" strokeWidth={4} />
    <path d="M18 -122 q -16 -12 -22 8 q -4 18 6 26 z" fill="#A87F49" stroke="#7A5A32" strokeWidth={4} />
    <ellipse cx={64} cy={-92} rx={22} ry={15} fill="#E2BE8A" stroke="#7A5A32" strokeWidth={4} />
    <circle cx={80} cy={-96} r={7} fill="#2B2118" />
    <circle cx={42} cy={-108} r={5} fill="#2B2118" />{/* ojo */}
    <path d="M56 -84 q 8 8 -2 12" stroke="#B4562F" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M20 -76 q -4 10 2 14" stroke={CL.nitrile} strokeWidth={8} fill="none" strokeLinecap="round" />{/* collar */}
    <path d="M22 -62 l -2 58" stroke="#C79A62" strokeWidth={15} strokeLinecap="round" />
    <path d="M44 -62 l 2 58" stroke="#D2A66C" strokeWidth={15} strokeLinecap="round" />
    <ellipse cx={19} cy={-2} rx={13} ry={7} fill="#E2BE8A" stroke="#7A5A32" strokeWidth={3} />
    <ellipse cx={47} cy={-2} rx={13} ry={7} fill="#E2BE8A" stroke="#7A5A32" strokeWidth={3} />
    <ellipse cx={-44} cy={-2} rx={16} ry={8} fill="#E2BE8A" stroke="#7A5A32" strokeWidth={3} />
  </g>
);
// el medio limón con los clavos (n = cuántos ya están clavados)
const Clavos: React.FC<{ n: number; s?: number }> = ({ n, s = 1 }) => {
  const R: [number, number][] = [[0, -0.78], [0.62, -0.48], [0.88, 0.16], [0.55, 0.72], [0, 0.86], [-0.55, 0.72], [-0.88, 0.16], [-0.62, -0.48], [0.34, -0.74], [-0.34, -0.74]];
  return (
    <g transform={`scale(${s})`}>
      {R.slice(0, n).map(([cx, cy], i) => {
        const X = cx * 150, Y = cy * 50;
        return (
          <g key={i} transform={`translate(${X} ${Y})`}>
            <line x1={-cx * 44} y1={-cy * 15} x2={0} y2={0} stroke="#5E3F1C" strokeWidth={6} strokeLinecap="round" />
            {[0, 72, 144, 216, 288].map((a, j) => (<ellipse key={j} cx={0} cy={-15} rx={5.5} ry={13} fill="#7A5527" stroke="#4E3414" strokeWidth={2} transform={`rotate(${a})`} />))}
            <circle r={6.5} fill="#4E3414" />
          </g>
        );
      })}
    </g>
  );
};

// ── 1. ClFlyDoor: de dónde viene la mosca y qué la atrae ──────────────────────────────────────────────────────
export const ClFlyDoor: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig();
  const draw = ease(clamp01((f - 3) / 26));
  const wall = { stroke: CL.ink, strokeWidth: 9, fill: "none", strokeLinejoin: "round" as const, strokeDasharray: 1400, strokeDashoffset: 1400 * (1 - draw) };
  const flies = [0, 1, 2].map((i) => {
    const u = (f * 0.0040 * (0.85 + 0.22 * i) + i / 3.1) % 1;
    return { i, x: 40 + u * 700, y: 486 - Math.sin(u * 7 + i * 2.1) * 30 - u * 8, o: clamp01(u * 7) * clamp01((1 - u) * 7), t: f * 0.9 + i };
  });
  const cf = (i: number) => 0.55 + 0.45 * Math.abs(Math.sin(f * 0.05 + i));
  return (
    <>
      <Sheet bed={bed} seed={101} dim={0.42}>
        <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ overflow: "visible" }}>
          <defs>
            <pattern id="leafm" width={44} height={44} patternUnits="userSpaceOnUse"><rect width={44} height={44} fill="#EDE7D6" /><path d="M9 13 q7 -7 14 0 q-7 7 -14 0z M28 32 q7 -7 14 0 q-7 7 -14 0z" fill="#C9A35C" opacity={0.55} /></pattern>
            <pattern id="mesh" width={14} height={14} patternUnits="userSpaceOnUse"><path d="M0 7 H14 M7 0 V14" stroke="#9AA4AE" strokeWidth={2} /></pattern>
            <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9D8E4" /><stop offset="100%" stopColor="#E8EBE2" /></linearGradient>
          </defs>
          {/* la calle y el patio (afuera de la casa) */}
          <rect x={0} y={0} width={500} height={540} fill="url(#sky1)" />
          <rect x={0} y={518} width={500} height={24} fill="#93938D" opacity={0.5} />
          <text x={20} y={132} fontFamily={LABEL} fontSize={28} fontWeight={700} fill={CL.inkSoft} letterSpacing={3} opacity={draw}>CALLE</text>
          <path d="M0 540 H 1608" stroke={CL.ink} strokeWidth={8} {...wall} />
          <rect x={272} y={472} width={228} height={68} fill="url(#leafm)" stroke="#B9B19A" strokeWidth={3} strokeDasharray="12 9" opacity={draw} />
          <text x={296} y={516} fontFamily={LABEL} fontSize={24} fill={CL.inkSoft} letterSpacing={2} opacity={draw}>PATIO</text>
          {/* la pared de la casa, con la puerta ABIERTA: el hueco va del piso al dintel */}
          <path d="M500 40 V 330" {...wall} />
          <path d="M500 40 H 1608" {...wall} />
          <path d="M500 330 h 150" stroke={CL.ink} strokeWidth={9} strokeDasharray={150} strokeDashoffset={150 * (1 - draw)} />
          {/* la hoja de la puerta, abierta hacia la cocina (gozne en el suelo) */}
          <g opacity={draw}>
            <path d="M500 540 L 658 344 L 712 384 L 554 540 Z" fill="#B08A50" stroke={CL.ink} strokeWidth={6} strokeLinejoin="round" />
            <path d="M540 500 L 646 400 M576 540 L 668 442" stroke="#8A6A44" strokeWidth={4} opacity={0.8} />
            <circle cx={620} cy={470} r={9} fill="#E3DCC8" stroke={CL.ink} strokeWidth={3} />
          </g>
          <text x={512} y={318} fontFamily={LABEL} fontSize={26} fontWeight={700} fill={CL.navy} letterSpacing={2} opacity={lin(f, 20, 32)}>LA PUERTA</text>
          {/* la ventana con mosquitero, del otro lado de la cocina */}
          <rect x={1200} y={110} width={180} height={148} fill="#DCE7EE" stroke={CL.ink} strokeWidth={6} opacity={draw} />
          <rect x={1200} y={110} width={180} height={148} fill="url(#mesh)" opacity={draw} />
          <text x={1204} y={292} fontFamily={LABEL} fontSize={24} fill={CL.inkSoft} letterSpacing={2} opacity={draw}>MOSQUITERO</text>
          {/* la mosca que va a la ventana, se topa con la red y se vuelve hacia la puerta */}
          <g opacity={lin(f, 62, 78) * draw}>
            <path d="M1252 314 q 54 -74 -4 -100 q -58 -26 -96 34" stroke={CL.red} strokeWidth={5} fill="none" strokeDasharray="14 10" />
            <text x={1130} y={330} fontFamily={HAND} fontSize={40} fontWeight={700} fill={CL.red}>no pasa</text>
          </g>
          {/* el bote abierto, al lado de la puerta */}
          <g opacity={draw}>
            <path d="M660 420 H 800 L 790 540 H 670 Z" fill="#7C8794" stroke={CL.ink} strokeWidth={5} />
            <path d="M656 420 q 74 -24 148 0" fill="#98A3AE" stroke={CL.ink} strokeWidth={5} />
            <path d="M806 412 q 56 -36 70 6" stroke={CL.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d="M684 452 q 38 -18 56 6 q 20 24 -8 32" fill="#D9D3C4" stroke="#A9A292" strokeWidth={3} />
            <path d="M742 464 q 32 -12 42 14" fill="#C9C0AC" stroke="#A9A292" strokeWidth={3} />
            {[690, 780].map((bx, i) => (<circle key={i} cx={bx} cy={486} r={5} fill="#8A6A44" opacity={cf(i)} />))}
          </g>
          {/* la mesada del fondo, con la alacena arriba: la cocina tiene que leer como cocina */}
          <g opacity={draw}>
            <path d="M1020 460 H 1560" stroke="#8A6A44" strokeWidth={16} strokeLinecap="round" />
            <path d="M1052 460 V 540 M1528 460 V 540" stroke="#8A6A44" strokeWidth={11} strokeLinecap="round" />
            <rect x={1080} y={424} width={190} height={36} fill="#B9C0C6" stroke={CL.ink} strokeWidth={4} rx={6} />
            <ellipse cx={1400} cy={446} rx={82} ry={20} fill="#E3DCC8" stroke="#A9A292" strokeWidth={4} />
            <path d="M640 148 H 980" stroke="#8A6A44" strokeWidth={12} strokeLinecap="round" />
            <path d="M640 262 H 980" stroke="#8A6A44" strokeWidth={12} strokeLinecap="round" />
            {[668, 748, 828, 908].map((jx, i) => (
              <g key={jx}>
                <rect x={jx} y={210} width={48} height={50} fill={i % 2 ? "#C9D6C0" : "#E0CBB0"} stroke="#8A6A44" strokeWidth={3} rx={4} />
                <rect x={jx + 8} y={166} width={34} height={42} fill="#D8E0DE" stroke="#8A6A44" strokeWidth={3} rx={4} />
              </g>
            ))}
          </g>
          {/* el olor del bote: cruza la puerta y llega a la calle */}
          <Stink x={660} y={452} len={620} f={f} o={0.92 * draw} dir={-1} />
          <Stink x={660} y={492} len={620} f={f + 30} o={0.6 * draw} dir={-1} n={2} />
          {flies.map((fl) => (<Fly key={fl.i} x={fl.x} y={fl.y} s={1.05} r={-8 + Math.sin(fl.t * 0.3) * 8} o={fl.o} t={fl.t} />))}
        </svg>
      </Sheet>
      <Tag x={146} y={272} text="LO QUE LA LLAMA" o={lin(f, 12, 24)} />
      <Note x={430} y={62} o={lin(f, 30, 44)} big="el olor de la basura sale a la calle" small="y la mosca lo sigue, hasta la puerta" />
    </>
  );
};

// ── 2. ClLemon10: el limón con los diez clavos, en el borde de la ventana ─────────────────────────────────────
export const ClLemon10: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig();
  const sways = Math.sin(f * 0.035) * 2.0;
  const n = Math.min(10, Math.max(0, Math.floor((f - 22) / 13) + 1));
  const done = lin(f, 22 + 10 * 13, 22 + 10 * 13 + 14);
  const tick = (i: number) => pop(f, fps, 22 + i * 13, 12);
  return (
    <>
      <Sheet bed={bed} seed={202} dim={0.42} rot={-0.7}>
        <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="out2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E9F1F6" /><stop offset="100%" stopColor="#F8F4E6" /></linearGradient>
            <radialGradient id="pulp" cx="50%" cy="46%" r="58%"><stop offset="0%" stopColor="#FBEE9C" /><stop offset="100%" stopColor="#E9CE55" /></radialGradient>
          </defs>
          {/* la ventana grande */}
          <g transform={`translate(0 ${sways})`}>
            <rect x={260} y={72} width={880} height={398} fill="url(#out2)" stroke="#8A6A44" strokeWidth={16} rx={6} />
            <line x1={880} y1={80} x2={880} y2={462} stroke="#8A6A44" strokeWidth={12} />
            <line x1={268} y1={270} x2={1132} y2={270} stroke="#8A6A44" strokeWidth={10} />
            <path d="M330 350 q 60 -46 128 -6 q 68 40 138 -4" stroke="#B6C48F" strokeWidth={8} fill="none" opacity={0.55} />
          </g>
          {/* el borde de la ventana */}
          <rect x={240} y={470} width={920} height={34} fill="#A8875A" stroke="#7A5A32" strokeWidth={5} rx={3} />
          {/* el medio limón, apoyado en el borde */}
          <g transform={`translate(600 ${414 + Math.sin(f * 0.04) * 2}) rotate(${sways * 0.6})`}>
            <ellipse cx={0} cy={48} rx={176} ry={15} fill="rgba(10,14,25,0.26)" />
            <path d="M-150 0 q 0 -56 150 -56 q 150 0 150 56 q 0 56 -150 56 q -150 0 -150 -56z" fill="#E5C23A" stroke="#B08A22" strokeWidth={4} />
            <ellipse cx={0} cy={0} rx={150} ry={52} fill="url(#pulp)" stroke="#D8B93F" strokeWidth={3} />
            <ellipse cx={0} cy={0} rx={139} ry={46} fill="none" stroke="#FBF6D8" strokeWidth={12} opacity={0.85} />
            {Array.from({ length: 9 }, (_, i) => {
              const a = (-Math.PI / 2) + (i / 9) * Math.PI * 2;
              return <path key={i} d={`M0 0 L ${Math.cos(a) * 126} ${Math.sin(a) * 41} A 126 41 0 0 1 ${Math.cos(a + 0.42) * 126} ${Math.sin(a + 0.42) * 41} Z`} fill="#F6E58A" stroke="#E0CB62" strokeWidth={2.2} />;
            })}
            <ellipse cx={-46} cy={-16} rx={40} ry={11} fill="#FFF6C8" opacity={0.6} transform="rotate(-18)" />
            <Clavos n={n} />
          </g>
          {/* el olor que suelta, subiendo hacia la ventana */}
          {[0, 1, 2].map((i) => {
            const t = (f * 0.016 + i / 3) % 1;
            return <path key={i} d={`M${520 + i * 88 + Math.sin(f * 0.06 + i) * 20} ${392 - t * 300} q 22 -26 0 -52 q -22 -26 0 -52`} stroke="#94B856" strokeWidth={10 - i} fill="none" strokeLinecap="round" opacity={(1 - t) * 0.9} />;
          })}
          {/* la lista de los diez, en una tira de cinta de papel pegada al costado */}
          <g opacity={lin(f, 10, 22)}>
            <rect x={44} y={236} width={188} height={230} fill={hexA(CL.yellowSoft, 0.9)} stroke="#D6C58A" strokeWidth={2} rx={4} transform="rotate(-2 138 351)" />
            <text x={62} y={284} fontFamily={HAND} fontWeight={700} fontSize={44} fill={CL.ink} transform="rotate(-2 138 351)">clavos</text>
            {Array.from({ length: 10 }, (_, i) => {
              const k = tick(i);
              const X = 70 + (i % 5) * 34, Y = 330 + Math.floor(i / 5) * 62;
              return (<g key={i} transform={`translate(${X} ${Y}) scale(${0.5 + 0.5 * k})`} opacity={k > 0 ? 1 : 0}>
                <line x1={-11} y1={-16} x2={11} y2={16} stroke={CL.ink} strokeWidth={7} strokeLinecap="round" />
                <line x1={11} y1={-16} x2={-11} y2={16} stroke={CL.ink} strokeWidth={7} strokeLinecap="round" />
              </g>);
            })}
          </g>
          {/* la otra ventana: un limón por ventana */}
          <g opacity={lin(f, Math.round(T * 0.52), Math.round(T * 0.52) + 14)}>
            <rect x={1268} y={92} width={252} height={320} fill="url(#out2)" stroke="#8A6A44" strokeWidth={12} rx={5} />
            <line x1={1394} y1={98} x2={1394} y2={406} stroke="#8A6A44" strokeWidth={9} />
            <rect x={1256} y={406} width={276} height={16} fill="#A8875A" stroke="#7A5A32" strokeWidth={4} rx={3} />
            <g transform="translate(1394 372)">
              <ellipse cx={0} cy={32} rx={62} ry={8} fill="rgba(10,14,25,0.25)" />
              <ellipse cx={0} cy={0} rx={54} ry={20} fill="#E5C23A" stroke="#B08A22" strokeWidth={3} />
              <ellipse cx={0} cy={0} rx={44} ry={15} fill="#F6E58A" stroke="#E0CB62" strokeWidth={2} />
              {[[0, -0.7], [0.7, 0], [0, 0.7], [-0.7, 0], [0.5, -0.5]].map(([cx, cy], i) => (<circle key={i} cx={cx * 44} cy={cy * 15} r={4.2} fill="#4E3414" />))}
            </g>
            <text x={1272} y={462} fontFamily={HAND} fontWeight={700} fontSize={42} fill={CL.navy}>una por ventana</text>
          </g>
        </svg>
      </Sheet>
      <Tag x={146} y={272} text="EL OLOR QUE NO SOPORTAN" o={lin(f, 12, 24)} />
      <Tag x={146} y={338} text={`${n} DE 10 CLAVOS`} o={lin(f, 22, 32)} size={30} color={CL.red} />
      <Note x={860} y={62} o={lin(f, 150, 168)} big={done > 0.5 ? "diez clavos, ni cinco ni veinte" : "se los clavas uno por uno"} small={done > 0.5 ? "y se cambia cada tres o cuatro días" : "con la cabeza afuera"} />
    </>
  );
};

// ── 3. ClTapeHigh: dónde va la cinta (alta, lejos de la comida, cerca de la luz) ──────────────────────────────
export const ClTapeHigh: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig();
  const swing = Math.sin(f * 0.045) * 5, spin = 0.72 + 0.28 * Math.cos(f * 0.03);
  const HL = 452;                                                   // la línea de altura de Bruno
  const stuck = (i: number) => clamp01((f - (58 + i * 30)) / 10);
  return (
    <>
      <Sheet bed={bed} seed={303} dim={0.44}>
        <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="wind3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E7F0F5" /><stop offset="100%" stopColor="#FBF6E6" /></linearGradient>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF3B0" stopOpacity="0.95" /><stop offset="100%" stopColor="#FFF3B0" stopOpacity="0" /></radialGradient>
          </defs>
          {/* la pared y el techo de la cocina */}
          <rect x={40} y={54} width={1528} height={486} fill="#FBF7EC" stroke={CL.ink} strokeWidth={7} rx={4} opacity={0.85} />
          <path d="M40 54 H 1568" stroke="#8A6A44" strokeWidth={14} strokeLinecap="round" />
          {/* la ventana por donde entra la luz */}
          <rect x={96} y={104} width={330} height={236} fill="url(#wind3)" stroke="#8A6A44" strokeWidth={14} rx={6} />
          <line x1={261} y1={112} x2={261} y2={332} stroke="#8A6A44" strokeWidth={11} />
          <line x1={104} y1={222} x2={418} y2={222} stroke="#8A6A44" strokeWidth={9} />
          <circle cx={261} cy={222} r={210} fill="url(#glow)" opacity={0.5 + 0.12 * Math.sin(f * 0.05)} />
          <text x={106} y={382} fontFamily={LABEL} fontSize={24} fill={CL.inkSoft} letterSpacing={2}>ACÁ ENTRA LA LUZ</text>
          {/* la cinta colgada del marco de ARRIBA (giro + vaivén continuos) */}
          <g transform="translate(900 0)">
            <rect x={-24} y={44} width={48} height={20} rx={5} fill="#B9C0C6" stroke="#7C848C" strokeWidth={3} />
            <path d={`M-16 62 q ${swing} 96 ${swing * 0.6} 190 L 16 252 q ${-swing * 0.6} -94 ${-swing} -190 Z`}
              fill={hexA("#F2C230", 0.55)} stroke="#C9A227" strokeWidth={3} transform={`scale(${spin} 1)`} />
            <path d={`M0 62 q ${swing} 96 ${swing * 0.6} 190`} stroke="#C9A227" strokeWidth={3} fill="none" opacity={0.6} />
            {[0, 1, 2, 3, 4].map((i) => { const k = stuck(i); return (<ellipse key={i} cx={swing * 0.6 + (i % 2 ? 7 : -6)} cy={104 + i * 34} rx={15 * k} ry={10 * k} fill="#3B404B" />); })}
            <text x={54} y={104} fontFamily={HAND} fontWeight={700} fontSize={42} fill={CL.navy}>bien alta</text>
          </g>
          {/* las moscas que van a la luz y quedan pegadas */}
          {[0, 1, 2, 3].map((i) => {
            const u = clamp01((f - (12 + i * 30)) / 30);
            if (u >= 1) return null;
            return <Fly key={i} x={1160 - u * 230 + Math.sin(f * 0.2 + i) * 10} y={92 + i * 62 - u * 20} s={0.95} r={-24 * (1 - u)} o={1 - stuck(i)} t={f * 1.1 + i} />;
          })}
          {/* la línea de altura de Bruno: la cinta queda arriba de todo */}
          <line x1={40} y1={HL} x2={1100} y2={HL} stroke={CL.red} strokeWidth={5} strokeDasharray="18 12" opacity={lin(f, 20, 34)} />
          <path d={`M40 ${HL} l 26 -13 M40 ${HL} l 26 13 M1100 ${HL} l -26 -13 M1100 ${HL} l -26 13`} stroke={CL.red} strokeWidth={5} fill="none" opacity={lin(f, 20, 34)} />
          <text x={300} y={HL - 18} fontFamily={LABEL} fontWeight={700} fontSize={32} letterSpacing={3} fill={CL.red} opacity={lin(f, 24, 38)}>ALTURA DE BRUNO</text>
          <Dog x={700} y={540} s={0.66} o={lin(f, 28, 42)} />
          {/* la lámpara colgada, para que el medio de la cocina no quede vacío */}
          <g opacity={lin(f, 46, 58)} transform={`rotate(${Math.sin(f * 0.03) * 1.6} 560 54)`}>
            <path d="M560 54 V 196" stroke={CL.inkSoft} strokeWidth={4} />
            <path d="M504 248 q 56 -70 112 0 z" fill={CL.navy} stroke="#12321C" strokeWidth={4} />
            <ellipse cx={560} cy={250} rx={56} ry={10} fill="#FFF3B0" opacity={0.9} />
          </g>
          {/* lo que la cinta NO debe tapar */}
          <g opacity={lin(f, Math.round(T * 0.45), Math.round(T * 0.45) + 14)}>
            <path d="M1180 460 H 1520" stroke="#8A6A44" strokeWidth={16} strokeLinecap="round" />
            <ellipse cx={1350} cy={440} rx={80} ry={19} fill="#E3DCC8" stroke="#A9A292" strokeWidth={4} />
            <path d="M1284 410 q 66 -22 132 0 q 12 20 -10 28 q -56 14 -112 0 q -22 -8 -10 -28z" fill="#D9A04E" stroke="#A9762F" strokeWidth={4} />
            <path d="M1276 372 l 160 92 M1436 372 l -160 92" stroke={CL.red} strokeWidth={9} strokeLinecap="round" />
            <text x={1170} y={528} fontFamily={HAND} fontWeight={700} fontSize={44} fill={CL.red}>nunca arriba de la comida</text>
          </g>
        </svg>
      </Sheet>
      <Tag x={146} y={272} text="LAS TRES REGLAS DE LA CINTA" o={lin(f, 12, 24)} />
      <Note x={640} y={62} o={lin(f, 34, 50)} big="lejos de la comida · cerca de la luz" small="y bien alta: por Bruno y por los chicos" />
    </>
  );
};

// ── 4. ClMoscasMap: la cocina con los cuatro arreglos puestos y las ventanas cerrándose ──────────────────────
const SPOTS: { n: number; x: number; y: number; lx: number; ly: number }[] = [
  { n: 1, x: 224, y: 392, lx: 150, ly: 540 },
  { n: 2, x: 512, y: 286, lx: 470, ly: 540 },
  { n: 3, x: 1206, y: 286, lx: 1000, ly: 540 },
  { n: 4, x: 1444, y: 196, lx: 1290, ly: 540 },
];
const LT = ["TAPA EL BOTE", "LIMÓN CON CLAVO", "ALBAHACA", "CINTA ALTA"];
export const ClMoscasMap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig();
  const draw = ease(clamp01((f - 3) / 26));
  const close = ease(clamp01((f - (T - 84)) / 44));               // las ventanas se CIERRAN al final
  const wall = { stroke: CL.ink, strokeWidth: 8, fill: "none", strokeLinejoin: "round" as const, strokeDasharray: 1400, strokeDashoffset: 1400 * (1 - draw) };
  const pin = (i: number) => pop(f, fps, 20 + i * 24, 12);
  return (
    <>
      <Sheet bed={bed} seed={404} dim={0.42}>
        <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="win4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#DCE9F0" /><stop offset="100%" stopColor="#F4F1E2" /></linearGradient>
            <pattern id="floor4" width={54} height={54} patternUnits="userSpaceOnUse"><rect width={54} height={54} fill="#EFE7D5" /><path d="M0 27 H54 M27 0 V54" stroke="#DCD2BC" strokeWidth={3} /></pattern>
          </defs>
          {/* la cocina en corte */}
          <path d="M40 60 H 1568 V 500 H 40 Z" {...wall} />
          <rect x={40} y={500} width={1528} height={70} fill="url(#floor4)" opacity={draw} />
          <g opacity={draw} fontFamily={LABEL} fontSize={26} fill={CL.inkSoft} letterSpacing={2}>
            <text x={74} y={104}>COCINA</text><text x={556} y={104}>VENTANA</text><text x={1076} y={104}>VENTANA</text>
          </g>
          {/* 1 el bote, ahora con la tapa puesta */}
          <g opacity={draw}>
            <path d="M156 430 H 292 L 282 500 H 166 Z" fill="#7C8794" stroke={CL.ink} strokeWidth={5} />
            <path d="M148 430 q 76 -22 152 0" fill="#98A3AE" stroke={CL.ink} strokeWidth={5} />
            <path d="M294 414 q 38 -8 44 6" stroke={CL.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
          {/* 2 y 3 las dos ventanas (con la hoja que se cierra al final) + el limón y la albahaca en el borde */}
          {[470, 990].map((x0, i) => (
            <g key={i} transform={`translate(${x0} 0)`} opacity={draw}>
              <rect x={0} y={140} width={280} height={210} fill="url(#win4)" stroke="#8A6A44" strokeWidth={12} rx={5} />
              <line x1={140} y1={146} x2={140} y2={344} stroke="#8A6A44" strokeWidth={8} opacity={1 - close} />
              <g opacity={close} transform={`translate(140 245) scale(${1 - close * 0.94} 1) translate(-140 -245)`}>
                <rect x={4} y={144} width={272} height={202} fill={hexA("#DCE9F0", 0.95)} stroke="#8A6A44" strokeWidth={10} rx={4} />
                <rect x={16} y={156} width={248} height={178} fill="none" stroke="#B39C74" strokeWidth={4} rx={3} />
                <rect x={252} y={236} width={12} height={30} rx={5} fill="#8A6A44" />
              </g>
              <rect x={-14} y={350} width={308} height={18} fill="#A8875A" stroke="#7A5A32" strokeWidth={4} rx={3} />
              <ellipse cx={40} cy={344} rx={26} ry={10} fill="#E5C23A" stroke="#B08A22" strokeWidth={3} />
              {[0, 1, 2, 3, 4, 5].map((k) => (<circle key={k} cx={40 + Math.cos(k * 1.05) * 17} cy={344 + Math.sin(k * 1.05) * 6} r={3.2} fill="#4E3414" />))}
              {i === 1 ? (
                <g>
                  <path d="M214 350 h 40 l -6 36 h -28 z" fill="#C97B4A" stroke="#8A5230" strokeWidth={3} />
                  {[-12, 4, 20].map((dx, j) => (<path key={j} d={`M${214 + dx} ${349 - (j % 2) * 5} q -16 -20 0 -32 q 16 12 0 32z`} fill="#5C8C43" stroke="#3C6330" strokeWidth={2} />))}
                </g>
              ) : null}
            </g>
          ))}
          {/* 4 la cinta colgada del marco de arriba */}
          <g opacity={draw} transform="translate(1440 60)">
            <path d={`M-13 4 q ${Math.sin(f * 0.05) * 6} 110 0 224 L 13 228 q ${-Math.sin(f * 0.05) * 6} -114 0 -224 Z`} fill={hexA("#F2C230", 0.55)} stroke="#C9A227" strokeWidth={3} />
            {[0, 1, 2].map((k) => { const t = (f * 0.012 + k / 3) % 1; return (<path key={k} d={`M${-40 + k * 40} ${-t * 130} q 14 -18 0 -36 q -14 -18 0 -36`} stroke="#A8C46A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={(1 - t) * 0.6} />); })}
            {[0, 1, 2].map((k) => (<ellipse key={k} cx={4} cy={64 + k * 62} rx={11} ry={7.5} fill="#3B404B" opacity={clamp01((f - (66 + k * 30)) / 10)} />))}
          </g>
          {/* las moscas que llegan de la calle y se vuelven (ya no tienen por dónde entrar) */}
          {[0, 1, 2].map((i) => {
            const u = (f * 0.005 + i / 3) % 1, go = Math.sin(Math.PI * u);
            return <Fly key={i} x={1660 - go * 420} y={132 + i * 58 - go * 30 + Math.sin(f * 0.2 + i) * 12} s={1} r={170 * (1 - go)} o={(0.25 + 0.7 * go) * (1 - close)} t={f * 1.2 + i} />;
          })}
          {/* la mesa y la lámpara: la cocina tiene que leerse como cocina */}
          <g opacity={draw}>
            <path d="M640 448 H 900" stroke="#8A6A44" strokeWidth={15} strokeLinecap="round" />
            <path d="M664 452 V 500 M876 452 V 500" stroke="#8A6A44" strokeWidth={11} strokeLinecap="round" />
            <path d="M726 424 q 44 -14 88 0 q 10 16 -8 22 q -36 10 -72 0 q -18 -6 -8 -22z" fill="#C9D6C0" stroke="#7E8C76" strokeWidth={4} />
            <path d="M770 54 V 168" stroke={CL.inkSoft} strokeWidth={4} />
            <path d="M724 214 q 46 -60 92 0 z" fill={CL.navy} stroke="#12321C" strokeWidth={4} />
            <ellipse cx={770} cy={216} rx={46} ry={9} fill="#FFF3B0" opacity={0.85} />
          </g>
          {SPOTS.map((s, i) => {
            const k = pin(i), done = k > 0.9;
            return (
              <g key={s.n} transform={`translate(${s.x} ${s.y}) scale(${k})`}>
                <circle r={33} fill={done ? CL.nitrile : CL.navy} stroke="#fff" strokeWidth={6} />
                {done ? <path d="M-14 2 L-4 13 L16 -11" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <text textAnchor="middle" y={12} fontFamily={LABEL} fontWeight={700} fontSize={38} fill="#fff">{s.n}</text>}
                <g transform={`translate(${s.lx - s.x} ${s.ly - s.y})`}>
                  <rect x={-6} y={-27} width={LT[i].length * 22 + 24} height={38} rx={8} fill="#fff" stroke={done ? CL.nitrile : CL.navy} strokeWidth={3} />
                  <text x={6} y={1} fontFamily={LABEL} fontWeight={700} fontSize={26} fill={done ? CL.nitrile : CL.navy} letterSpacing={2}>{LT[i]}</text>
                </g>
              </g>
            );
          })}
        </svg>
      </Sheet>
      <Tag x={146} y={272} text="LA COCINA COMPLETA" o={lin(f, 12, 24)} />
      <Note x={700} y={62} o={lin(f, Math.round(T * 0.6), Math.round(T * 0.6) + 16)} big="dos minutos, cada tres o cuatro días" small="cambiar el limón · mirar el bote · mirar el plato" />
    </>
  );
};
