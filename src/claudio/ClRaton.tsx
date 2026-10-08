// Kit del RATÓN (Claudio el Fumigador ep. 3 "Los ratones del garaje"), dentro del mundo (cama real + sombra + luz):
//   ClPoisonWall corte de la pared: el ratón come el bloque de veneno, se mete en el hueco de la pared, se queda ahí y sube el olor
//                ("wall": 2 semanas de olor) · "dog": el ratón envenenado anda lento, el perro lo agarra, el veneno pasa
//   ClFlourMap   el garaje de los Ramírez desde arriba con la harina pegada a las paredes: las huellitas llevan del saco de croquetas al
//                hueco detrás del calentador, a la goma mordida del portón y a la puerta de la cocina ("tracks") · "clean": la harina lisa,
//                ni una huellita · "mint": bolitas de algodón con menta cada 2 m por el camino, las de Bruno ARRIBA
//   ClCoinHole   "coin": la moneda al lado del hueco, la cabecita pasa y pasa el cuerpo · "plug": corte del hueco del tubo: lana de acero
//                apretada + masilla encima; el ratón muerde la masilla y se frena en la lana
//   ClTrapSet    "wall": la trampa pegada a la pared, de costado, el gatillo hacia la pared, una pizca del tamaño de una lenteja
//                · "box": la trampa adentro de una caja con un agujerito de moneda por costado: el ratón entra, el dedo y el hocico no
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
const Note: React.FC<{ x: number; y: number; o: number; big: string; small: string; color?: string }> = ({ x, y, o, big, small, color = CL.red }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>
    <Card style={{ padding: "14px 30px", borderBottom: `6px solid ${color}` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1.05 }}>{big}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color }}>{small}</div>
    </Card>
  </div>
);
// el ratón visto de costado (r = rotación, s = escala, walk = fase de las patas, sick = encorvado)
export const Mouse: React.FC<{ x: number; y: number; r?: number; s?: number; o?: number; walk?: number; flip?: boolean; sick?: boolean }> = ({ x, y, r = 0, s = 1, o = 1, walk = 0, flip = false, sick = false }) => {
  const w = Math.sin(walk) * 5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`} opacity={o}>
      <path d={`M-38 2 Q -80 ${-6 + w} -118 ${10 - w}`} stroke="#C9A7A0" strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={sick ? -10 : -6} rx={42} ry={sick ? 26 : 22} fill="#7F7A78" stroke="#3B3634" strokeWidth={2.4} />
      <ellipse cx={40} cy={-12} rx={22} ry={16} fill="#857F7D" stroke="#3B3634" strokeWidth={2.4} />
      <circle cx={30} cy={-28} r={10} fill="#D9B4AE" stroke="#3B3634" strokeWidth={2} />
      <circle cx={50} cy={-15} r={3.4} fill="#111" />
      <circle cx={62} cy={-8} r={3.6} fill="#E3A0A0" />
      <path d="M60 -6 l 18 -6 M60 -6 l 18 2 M60 -6 l 16 8" stroke="#4A4442" strokeWidth={1.2} />
      {[-22, 18].map((lx, i) => <line key={i} x1={lx} y1={12} x2={lx + (i ? w : -w)} y2={22} stroke="#C9A7A0" strokeWidth={4} strokeLinecap="round" />)}
    </g>
  );
};
const Print: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(2)`} opacity={o} fill="#5E5240">
    <circle cx={0} cy={-6} r={3.2} /><circle cx={0} cy={6} r={3.2} />
    {[-4, 0, 4].map((d, i) => <circle key={i} cx={6} cy={-6 + d} r={1.4} />)}
    {[-4, 0, 4].map((d, i) => <circle key={"b" + i} cx={6} cy={6 + d} r={1.4} />)}
  </g>
);
const Cotton: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={10} rx={34} ry={10} fill="#C8CDD2" stroke={CL.ink} strokeWidth={2.5} />
    {[[-10, 0], [8, -4], [0, -12], [14, 4], [-16, 6]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={11} fill="#FBFBF8" stroke="#D6D6CF" strokeWidth={1.5} />)}
  </g>
);
const Waves: React.FC<{ x: number; y: number; f: number; o: number; color?: string }> = ({ x, y, f, o, color = "#B5C46A" }) => (
  <g opacity={o}>
    {[0, 1, 2].map((i) => {
      const t = ((f * 0.012 + i / 3) % 1);
      return <path key={i} d={`M${x - 30 + i * 30} ${y - t * 220} q 14 -20 0 -40 q -14 -20 0 -40`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" opacity={(1 - t) * 0.9} />;
    })}
  </g>
);

// ───────────────── ClPoisonWall
export const ClPoisonWall: React.FC<{ mode?: "wall" | "dog"; bed?: string }> = ({ mode = "wall", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const FL = 860;
  if (mode === "dog") {
    const k = clamp01((f - 10) / (T * 0.55));
    const mx = 1180 - k * 120, dx = 260 + ease(clamp01((f - T * 0.25) / (T * 0.4))) * 560;
    const hit = lin(f, T * 0.62, T * 0.7);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={401} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          <rect x={160} y={FL} width={1600} height={40} fill="#A9A49A" stroke={CL.ink} strokeWidth={5} />
          <Mouse x={mx} y={FL - 24} s={1.8} walk={f * 0.15} sick flip />
          <g transform={`translate(${dx} ${FL})`}>
            <ellipse cx={0} cy={-150} rx={140} ry={70} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <rect x={-120} y={-110} width={30} height={110} fill="#C8894A" stroke={CL.ink} strokeWidth={4} /><rect x={80} y={-110} width={30} height={110} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <circle cx={150} cy={-230} r={66} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <path d="M118 -276 q -34 20 -26 74 q 26 -10 40 -50 Z" fill="#9A6532" stroke={CL.ink} strokeWidth={3} />
            <circle cx={176} cy={-242} r={7} fill={CL.ink} /><ellipse cx={212} cy={-216} rx={12} ry={9} fill={CL.ink} />
          </g>
          <path d={`M${dx + 240} ${FL - 300} Q ${dx + 330} ${FL - 420} ${mx - 40} ${FL - 120}`} stroke={CL.red} strokeWidth={6} fill="none" strokeDasharray="18 12" opacity={hit} />
        </svg>
        <Tag x={1000} y={FL - 200} text="Envenenado · lento" color={CL.red} o={lin(f, 10, 20)} size={36} />
        <Note x={1040} y={240} o={hit} big="El veneno pasa" small="al que se lo come" />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  // corte de la pared: el bloque, el ratón que se mete al hueco, se queda y sube el olor
  const WX = 1040, WW = 260;
  const walk = clamp01((f - 14) / (T * 0.4));
  const inWall = walk >= 1;
  const mx = 560 + walk * (WX + WW / 2 - 560), my = inWall ? FL - 30 : FL - 24;
  const smell = lin(f, T * 0.6, T * 0.7);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={403} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <rect x={160} y={FL} width={1600} height={40} fill="#A9A49A" stroke={CL.ink} strokeWidth={5} />
        {/* la pared en corte: ladrillo afuera, el hueco adentro, el revoque */}
        <rect x={WX} y={120} width={WW} height={FL - 120} fill="#2A2420" stroke={CL.ink} strokeWidth={6} />
        <rect x={WX} y={120} width={36} height={FL - 120} fill="#EDE6D8" stroke={CL.ink} strokeWidth={4} />
        <rect x={WX + WW - 36} y={120} width={36} height={FL - 120} fill="#C66A43" stroke={CL.ink} strokeWidth={4} />
        <rect x={WX} y={FL - 70} width={40} height={70} fill="#2A2420" />
        {/* el bloque de veneno de colores */}
        <g transform="translate(470 820)">
          <rect x={-46} y={-34} width={92} height={34} rx={8} fill="#3FAE6A" stroke={CL.ink} strokeWidth={3} />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-34 + i * 14} cy={-17} r={4} fill="#2B7E4A" />)}
        </g>
        <Mouse x={mx} y={my} s={1.4} walk={f * 0.6} o={inWall ? 0.92 : 1} r={inWall ? 8 : 0} sick={walk > 0.5} />
        <Waves x={WX + WW / 2} y={FL - 120} f={f} o={smell} />
        <Waves x={WX - 160} y={FL - 60} f={f + 20} o={smell * 0.8} />
        <Waves x={WX + WW + 160} y={FL - 60} f={f + 40} o={smell * 0.8} />
      </svg>
      <Tag x={330} y={FL - 150} text="Veneno en bloque" color={CL.nitrile} o={lin(f, 8, 16)} size={34} />
      <Tag x={WX - 40} y={140} text="Adentro de la pared" color={CL.navy} o={lin(f, T * 0.38, T * 0.46)} size={34} />
      <Note x={250} y={220} o={smell} big="2 semanas de olor" small="y no lo puedes sacar" />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClFlourMap
export const ClFlourMap: React.FC<{ mode?: "tracks" | "clean" | "mint"; bed?: string }> = ({ mode = "tracks", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const GX = 360, GY = 130, GW = 1200, GH = 820, BAND = 64;
  const flour = lin(f, 6, 18);
  // caminos de huellas pegados a la pared (puntos)
  const paths: [number, number][][] = [
    [[GX + 300, GY + GH - BAND / 2], [GX + GW - BAND / 2, GY + GH - BAND / 2], [GX + GW - BAND / 2, GY + BAND / 2 + 60]], // bolsa → calentador (fondo der.)
    [[GX + 300, GY + GH - BAND / 2], [GX + BAND / 2, GY + GH - BAND / 2]], // bolsa → portón (esquina izq.)
    [[GX + BAND / 2, GY + GH - BAND / 2], [GX + BAND / 2, GY + BAND / 2], [GX + 520, GY + BAND / 2]], // → puerta de la cocina (arriba)
  ];
  const pts = (path: [number, number][], n: number) => {
    const seg: { x: number; y: number; r: number }[] = [];
    let L = 0; const ls = path.slice(1).map((q, i) => { const d = Math.hypot(q[0] - path[i][0], q[1] - path[i][1]); L += d; return d; });
    for (let k = 0; k < n; k++) {
      let d = (k / (n - 1)) * L, i = 0; while (i < ls.length - 1 && d > ls[i]) { d -= ls[i]; i++; }
      const a = path[i], b = path[i + 1], t = d / ls[i];
      seg.push({ x: a[0] + (b[0] - a[0]) * t + (k % 2 ? 7 : -7) * (a[1] === b[1] ? 0 : 1), y: a[1] + (b[1] - a[1]) * t + (k % 2 ? 7 : -7) * (a[1] === b[1] ? 1 : 0), r: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI });
    }
    return seg;
  };
  const tracks = mode === "tracks", clean = mode === "clean", mint = mode === "mint";
  const heater = { x: GX + GW - 110, y: GY + 110 };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={411} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* el piso de cemento y las paredes */}
        <rect x={GX} y={GY} width={GW} height={GH} fill="#B7B2A8" stroke={CL.ink} strokeWidth={10} />
        {/* la harina pegada a las paredes */}
        <g opacity={flour}>
          <rect x={GX + 5} y={GY + 5} width={GW - 10} height={BAND} fill="#F7F4EC" />
          <rect x={GX + 5} y={GY + GH - BAND - 5} width={GW - 10} height={BAND} fill="#F7F4EC" />
          <rect x={GX + 5} y={GY + 5} width={BAND} height={GH - 10} fill="#F7F4EC" />
          <rect x={GX + GW - BAND - 5} y={GY + 5} width={BAND} height={GH - 10} fill="#F7F4EC" />
          {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={GX + 10 + rnd(i + 3) * (GW - 20)} cy={rnd(i + 9) > 0.5 ? GY + 10 + rnd(i + 4) * (BAND - 10) : GY + GH - BAND + rnd(i + 4) * (BAND - 12)} r={2} fill="#E4DFD2" />)}
        </g>
        {/* el portón (abajo izq.), la puerta a la cocina (arriba), el calentador (fondo der.), la lavadora, la bolsa */}
        <rect x={GX + 120} y={GY + GH - 8} width={560} height={18} fill="#8E949A" stroke={CL.ink} strokeWidth={4} />
        <rect x={GX + 480} y={GY - 10} width={120} height={20} fill="#8A5A34" stroke={CL.ink} strokeWidth={4} />
        <circle cx={heater.x} cy={heater.y} r={62} fill="#E9ECEE" stroke={CL.ink} strokeWidth={5} />
        <line x1={heater.x + 30} y1={heater.y - 52} x2={GX + GW - 6} y2={GY + 30} stroke="#C2A04A" strokeWidth={10} />
        <rect x={GX + 140} y={GY + 160} width={180} height={180} rx={14} fill="#F2F2EE" stroke={CL.ink} strokeWidth={5} /><circle cx={GX + 230} cy={GY + 250} r={56} fill="#C9D3DA" stroke={CL.ink} strokeWidth={4} />
        <rect x={GX + 560} y={GY + 380} width={340} height={80} fill="#A27A4E" stroke={CL.ink} strokeWidth={4} />
        <g transform={`translate(${GX + 300} ${GY + GH - 150})`}>
          {mint || clean
            ? <><rect x={-60} y={-50} width={120} height={100} rx={16} fill="#3E7CB1" stroke={CL.ink} strokeWidth={4} /><rect x={-66} y={-58} width={132} height={20} rx={8} fill="#2F5F88" stroke={CL.ink} strokeWidth={3} /></>
            : <><path d="M-60 -60 H 60 V 60 H -60 Z" fill="#C9A26A" stroke={CL.ink} strokeWidth={4} /><path d="M40 -60 l 20 0 l 0 22 q -14 -4 -20 -22 Z" fill="#B7B2A8" stroke={CL.ink} strokeWidth={3} />
               {[[70, -30], [84, -10], [62, 4]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={7} fill="#8B5A2B" />)}</>}
        </g>
        {/* el hueco del tubo y la goma mordida del portón */}
        <circle cx={GX + GW - 22} cy={GY + 34} r={16} fill="#1A1614" stroke={CL.red} strokeWidth={4} opacity={tracks ? lin(f, T * 0.5, T * 0.58) : 0} />
        <path d={`M${GX + 120} ${GY + GH - 8} q 20 -26 44 0`} fill="#1A1614" stroke={CL.red} strokeWidth={4} opacity={tracks ? lin(f, T * 0.62, T * 0.7) : 0} />
        {/* las huellitas */}
        {tracks && paths.map((path, j) => pts(path, 22).map((q, i) => (
          <Print key={j + "-" + i} x={q.x} y={q.y} r={q.r} o={lin(f, 16 + j * T * 0.18 + i * 0.9, 20 + j * T * 0.18 + i * 0.9)} />
        )))}
        {/* menta: una bolita cada 2 m; las de Bruno arriba (estante y lavadora) */}
        {mint && [[GX + 520, GY + GH - BAND / 2], [GX + 860, GY + GH - BAND / 2], [GX + GW - BAND / 2, GY + 520], [GX + BAND / 2, GY + 560], [GX + 730, GY + 420], [GX + 230, GY + 200]].map(([x, y], i) => (
          <Cotton key={i} x={x} y={y - 6} s={0.9} o={lin(f, 12 + i * 8, 20 + i * 8)} />
        ))}
        {mint && [0, 1].map((i) => {
          const a = GX + 520 + i * 340, o = lin(f, 64 + i * 6, 72 + i * 6);
          return <g key={i} opacity={o} stroke={CL.red} strokeWidth={4}><line x1={a} y1={GY + GH + 40} x2={a + 340} y2={GY + GH + 40} /><line x1={a} y1={GY + GH + 28} x2={a} y2={GY + GH + 52} /><line x1={a + 340} y1={GY + GH + 28} x2={a + 340} y2={GY + GH + 52} /></g>;
        })}
      </svg>
      <Tag x={GX + GW - 470} y={GY - 80} text={clean ? "1 semana después" : "Harina pegada a la pared"} color={clean ? CL.nitrile : CL.brass} o={lin(f, 8, 16)} size={34} />
      {!mint && <Tag x={GX + 640} y={GY + 320} text="Estante" color={CL.inkSoft} o={lin(f, 10, 18) * 0.9} size={26} />}
      <Tag x={GX + GW - 440} y={GY + 84} text="Calentador" color={CL.inkSoft} o={lin(f, 10, 18) * 0.9} size={26} />
      <Tag x={GX + 470} y={GY + 26} text="A la cocina" color={CL.inkSoft} o={lin(f, 10, 18) * 0.9} size={26} />
      {tracks && <>
        <Tag x={GX + GW - 470} y={GY + 196} text="El hueco del tubo" color={CL.red} o={lin(f, T * 0.5, T * 0.58)} size={34} />
        <Tag x={GX + 40} y={GY + GH + 24} text="Goma mordida" color={CL.red} o={lin(f, T * 0.62, T * 0.7)} size={32} />
        <Tag x={GX + 20} y={GY + GH - 230} text="Croquetas" color="#8B5A2B" o={lin(f, 12, 20)} size={30} />
      </>}
      {clean && <Note x={GX + 380} y={GY + 520} o={lin(f, T * 0.3, T * 0.4)} big="Ni una huellita" small="la harina, lisa" color={CL.nitrile} />}
      {mint && <>
        <div style={{ position: "absolute", left: GX + 640, top: GY + GH + 50, opacity: lin(f, 66, 74), fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: CL.red }}>2 m</div>
        <div style={{ position: "absolute", left: GX + 980, top: GY + GH + 50, opacity: lin(f, 72, 80), fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: CL.red }}>2 m</div>
        <Tag x={GX + 520} y={GY + 300} text="Arriba · Bruno no llega" color={CL.red} o={lin(f, T * 0.45, T * 0.53)} size={30} />
        <Note x={GX + 380} y={GY + 520} o={lin(f, T * 0.6, T * 0.7)} big="5 gotas por bolita" small="renovar cada 3 o 4 días" color={CL.nitrile} />
      </>}
      <RoomLight k={0.28} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCoinHole
export const ClCoinHole: React.FC<{ mode?: "coin" | "plug"; bed?: string }> = ({ mode = "coin", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  if (mode === "coin") {
    const HX = 1100, HY = 560, R = 120;
    const k = clamp01((f - T * 0.3) / (T * 0.5));
    const head = ease(clamp01(k * 2)), body = ease(clamp01(k * 2 - 1));
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={421} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          <rect x={700} y={160} width={1060} height={800} fill="#E8E1D2" stroke={CL.ink} strokeWidth={6} />
          {Array.from({ length: 5 }, (_, i) => <line key={i} x1={700} y1={160 + i * 160} x2={1760} y2={160 + i * 160} stroke="#D5CCBA" strokeWidth={3} />)}
          <circle cx={HX} cy={HY} r={R} fill="#151210" stroke={CL.ink} strokeWidth={6} />
          {/* la moneda al lado */}
          <g opacity={lin(f, 8, 16)} transform={`translate(420 ${HY})`}>
            <circle r={R} fill="#D8B14A" stroke="#8C6A1C" strokeWidth={6} />
            <circle r={R - 18} fill="none" stroke="#B48F2E" strokeWidth={4} />
            <text x={0} y={18} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={66} fill="#8C6A1C">$</text>
          </g>
          <path d={`M540 ${HY} H ${HX - R - 20}`} stroke={CL.red} strokeWidth={5} strokeDasharray="16 10" opacity={lin(f, 16, 24)} />
          {/* el ratón saliendo por el hueco */}
          <clipPath id="holeclip"><circle cx={HX} cy={HY} r={R - 4} /></clipPath>
          <g clipPath="url(#holeclip)">
            <g transform={`translate(${HX} ${HY}) scale(${0.6 + head * 0.9}) translate(${-HX} ${-HY})`}>
              <ellipse cx={HX} cy={HY + 10} rx={60} ry={48} fill="#857F7D" stroke="#3B3634" strokeWidth={3} />
              <circle cx={HX - 52} cy={HY - 40} r={26} fill="#D9B4AE" stroke="#3B3634" strokeWidth={3} /><circle cx={HX + 52} cy={HY - 40} r={26} fill="#D9B4AE" stroke="#3B3634" strokeWidth={3} />
              <circle cx={HX - 20} cy={HY} r={7} fill="#111" /><circle cx={HX + 20} cy={HY} r={7} fill="#111" />
              <circle cx={HX} cy={HY + 34} r={9} fill="#E3A0A0" />
            </g>
          </g>
          <Mouse x={HX + 40 + body * 300} y={HY + R + 40} s={1.5} walk={f * 0.6} o={body} />
        </svg>
        <Tag x={300} y={HY - R - 90} text="Una moneda" color={CL.brass} o={lin(f, 10, 18)} size={36} />
        <Note x={1180} y={220} o={lin(f, T * 0.55, T * 0.65)} big="Si pasa la cabeza" small="pasa el cuerpo" />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  // "plug": corte del hueco del tubo: lana de acero apretada + masilla; el ratón muerde la masilla y se frena
  const PX = 960, PY = 520, HR = 150, PR = 52;
  const wool = ease(clamp01((f - 10) / (T * 0.28)));
  const putty = ease(clamp01((f - T * 0.36) / (T * 0.18)));
  const bite = clamp01((f - T * 0.6) / (T * 0.3));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={423} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <rect x={420} y={150} width={1080} height={760} fill="#E8E1D2" stroke={CL.ink} strokeWidth={6} />
        <circle cx={PX} cy={PY} r={HR} fill="#151210" stroke={CL.ink} strokeWidth={6} />
        {/* la lana de acero: rulos grises que llenan el anillo */}
        <clipPath id="ringclip"><circle cx={PX} cy={PY} r={HR - 4} /></clipPath>
        <g clipPath="url(#ringclip)" opacity={wool}>
          {Array.from({ length: 70 }, (_, i) => {
            const a = rnd(i + 1) * Math.PI * 2, rr = PR + 10 + rnd(i + 2) * (HR - PR - 14) * wool;
            return <circle key={i} cx={PX + Math.cos(a) * rr} cy={PY + Math.sin(a) * rr} r={10 + rnd(i + 3) * 10} fill="none" stroke={i % 2 ? "#9AA0A6" : "#6E747A"} strokeWidth={3} />;
          })}
        </g>
        {/* la masilla encima (con la mordida al final) */}
        <circle cx={PX} cy={PY} r={HR} fill="#F4F1EA" stroke="#CFC8B8" strokeWidth={4} opacity={putty * (1 - bite * 0.0)} />
        <path d={`M${PX + HR * 0.55} ${PY + HR * 0.55} q 40 -20 50 -70 q -30 30 -60 20 Z`} fill="#151210" opacity={bite > 0.3 ? putty : 0} />
        {bite > 0.3 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={PX + HR * 0.62 + rnd(i + 30) * 30} cy={PY + HR * 0.4 + rnd(i + 31) * 30} r={8} fill="none" stroke="#7A8086" strokeWidth={3} opacity={putty} />)}
        {/* el tubo del gas */}
        <circle cx={PX} cy={PY} r={PR} fill="#C2A04A" stroke={CL.ink} strokeWidth={5} /><circle cx={PX} cy={PY} r={PR - 16} fill="#8F7230" />
        <Mouse x={PX + 330 - Math.sin(bite * Math.PI * 4) * 16} y={PY + 250} s={1.6} walk={f * 0.5} flip o={lin(f, T * 0.55, T * 0.62)} r={-24} />
      </svg>
      <Tag x={460} y={180} text="1 · Lana de acero apretada" color={CL.navy} o={lin(f, 10, 18)} size={34} />
      <Tag x={460} y={260} text="2 · Masilla encima" color={CL.nitrile} o={lin(f, T * 0.36, T * 0.44)} size={34} />
      <Note x={470} y={740} o={lin(f, T * 0.74, T * 0.82)} big="Muerde la masilla" small="la lana no" />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTrapSet
const Trap: React.FC<{ x: number; y: number; r?: number; s?: number; bait?: number }> = ({ x, y, r = 0, s = 1, bait = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-150} y={-60} width={300} height={120} rx={8} fill="#D4AE78" stroke={CL.ink} strokeWidth={4} />
    {Array.from({ length: 5 }, (_, i) => <line key={i} x1={-140} y1={-44 + i * 22} x2={140} y2={-44 + i * 22} stroke="#B98F58" strokeWidth={2} />)}
    <rect x={-120} y={-50} width={150} height={100} fill="none" stroke="#9AA0A6" strokeWidth={6} />
    <circle cx={30} cy={0} r={16} fill="none" stroke="#9AA0A6" strokeWidth={6} />
    <rect x={60} y={-22} width={70} height={44} rx={6} fill="#C9CDD1" stroke={CL.ink} strokeWidth={3} />
    <circle cx={110} cy={0} r={9} fill="#B07A3C" stroke="#6E4A20" strokeWidth={2} opacity={bait} />
  </g>
);
export const ClTrapSet: React.FC<{ mode?: "wall" | "box"; bed?: string }> = ({ mode = "wall", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  if (mode === "box") {
    const BX = 960, BY = 600, BW = 760, BH = 300;
    const m = clamp01((f - T * 0.2) / (T * 0.35));
    const paw = lin(f, T * 0.6, T * 0.7);
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={431} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          <rect x={160} y={BY + BH / 2} width={1600} height={40} fill="#A9A49A" stroke={CL.ink} strokeWidth={5} />
          <Trap x={BX} y={BY + BH / 2 - 70} s={1.1} />
          {/* la caja de cartón en corte (transparente) */}
          <rect x={BX - BW / 2} y={BY - BH / 2} width={BW} height={BH} fill={hexA("#C9A26A", 0.35)} stroke="#8A6A3A" strokeWidth={8} />
          <circle cx={BX - BW / 2} cy={BY + BH / 2 - 40} r={34} fill="#B7B2A8" stroke="#8A6A3A" strokeWidth={6} />
          <circle cx={BX + BW / 2} cy={BY + BH / 2 - 40} r={34} fill="#B7B2A8" stroke="#8A6A3A" strokeWidth={6} />
          <Mouse x={260 + m * (BX - BW / 2 - 200)} y={BY + BH / 2 - 26} s={1.1} walk={f * 0.6} o={1 - lin(f, T * 0.52, T * 0.56)} />
          {/* el hocico de Bruno que no entra */}
          <g opacity={paw} transform={`translate(${BX + BW / 2 + 160} ${BY + BH / 2 - 80})`}>
            <ellipse cx={0} cy={0} rx={110} ry={64} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <ellipse cx={-96} cy={10} rx={18} ry={14} fill={CL.ink} />
          </g>
          <g opacity={paw} stroke={CL.red} strokeWidth={10} strokeLinecap="round"><line x1={BX + BW / 2 + 10} y1={BY + BH / 2 - 120} x2={BX + BW / 2 + 70} y2={BY + BH / 2 - 60} /><line x1={BX + BW / 2 + 70} y1={BY + BH / 2 - 120} x2={BX + BW / 2 + 10} y2={BY + BH / 2 - 60} /></g>
        </svg>
        <Tag x={BX - BW / 2 - 120} y={BY - BH / 2 - 90} text="Agujerito de moneda por costado" color={CL.brass} o={lin(f, 10, 18)} size={32} />
        <Note x={300} y={180} o={paw} big="El ratón entra" small="el dedo y el hocico, no" color={CL.nitrile} />
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  // "wall": desde arriba, la pared a la derecha; la trampa de costado pegada, gatillo hacia la pared; el ratón llega de frente
  const WALLX = 1440;
  const m = clamp01((f - T * 0.12) / (T * 0.6));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={433} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <rect x={200} y={120} width={WALLX - 200} height={860} fill="#B7B2A8" stroke={CL.ink} strokeWidth={5} />
        <rect x={WALLX} y={120} width={200} height={860} fill="#E8E1D2" stroke={CL.ink} strokeWidth={8} />
        <Trap x={WALLX - 160} y={560} r={0} s={1.2} />
        {/* la lenteja de cebo */}
        <g opacity={lin(f, 6, 14)}>
          <circle cx={1060} cy={360} r={34} fill="#B07A3C" stroke="#6E4A20" strokeWidth={4} />
          <path d={`M1094 360 C 1180 360 1230 470 ${WALLX - 160 + 132} 556`} stroke={CL.red} strokeWidth={4} fill="none" strokeDasharray="12 10" />
        </g>
        <Mouse x={WALLX - 60} y={980 - m * 320} r={-90} s={1.2} walk={f * 0.6} o={lin(f, T * 0.12, T * 0.18)} />
        <path d={`M${WALLX - 40} 960 V 720`} stroke={CL.nitrile} strokeWidth={5} strokeDasharray="14 10" opacity={lin(f, T * 0.12, T * 0.22)} />
      </svg>
      <Tag x={WALLX - 470} y={420} text="Gatillo hacia la pared" color={CL.navy} o={lin(f, 8, 16)} size={34} />
      <Tag x={760} y={280} text="Una pizca · como una lenteja" color="#8B5A2B" o={lin(f, 10, 18)} size={32} />
      <Note x={300} y={700} o={lin(f, T * 0.45, T * 0.55)} big="Camina pegado a la pared" small="se la encuentra de frente" color={CL.nitrile} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
