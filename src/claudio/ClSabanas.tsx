// Kit del video cons6nb (las sábanas blancas que se pusieron GRISES). Un componente ÚNICO por minuto, ninguno repetido, sin rótulos de esquina.
//   SbTwoSheets   dos sábanas colgadas de la soga: el viento las mueve, la de la izquierda gris, la de la derecha blanca (mismo juego)
//   SbFiberTube   el hilo de algodón en corte, como un tubito: entran grasa, jabón y piedra en capas y el tubo se pone gris
//   SbBleachThin  la trama vista con lupa: el cloro blanquea por arriba y los hilos se afinan hasta romperse en el medio
//   SbFoamDrop    la gota de agua caliente cae en la punta de la sábana, las manos frotan y aparece espuma (= jabón viejo)
//   SbKit         lo que necesita: los objetos caen con peso sobre la mesa de doblar (frasco marrón, bicarbonato, balde, jarra, paleta, guantes)
//   SbLabelTemp   la etiqueta de la sábana con su lavado: el termómetro del agua sube y frena en lo que dice la etiqueta
//   SbRatio       el balde de 10 L en corte: se llena hasta la marca, caen 2 tazas del frasco y ½ taza de bicarbonato, la paleta revuelve
//   SbBucketSoak  el remojo: la sábana hundida, burbujitas, el agua se pone gris, el reloj de 2 h con una vuelta cada 30 min
//   SbHalfSoap    la tapa medidora: el jabón llega sólo a la mitad; lo que sobra queda pegado en la tela como gris
//   SbDrumLoad    el tambor de la lavadora visto de frente: lleno hasta arriba no se mueve, a ¾ las sábanas dan vueltas
//   SbSunLine     la terraza del hotel: el sol sube, la sábana en la soga pasa de gris a blanca y el viento se lleva el olor
//   SbPillowZone  la cama vista desde arriba: la funda y el borde de la sábana de arriba se marcan amarillos, + 1 hora
//   SbFiveErrors  cinco broches en la soga, cada uno sostiene una tarjeta de error que se da vuelta
//   SbRoutine     la hoja de la lavandería del sótano con los 5 pasos y su tiempo, el reloj suma
//   SbEverySix    seis lavados en fila: cinco con jabón a la mitad y el sexto con el balde de remojo (agua dura: cada 4)
//   SbBottleLight el frasco marrón y una botella transparente al sol: el burbujeo de la transparente se apaga en «una semana»
//   SbHemTest     el dobladillo de una sábana celeste: la gota prueba primero; una sábana celeste entera queda con manchas claras
//   SbPharmacy    el frasco de farmacia 3 % = «10 volúmenes» al lado del de peluquería tachado
//   SbCost        el ticket: frasco + bicarbonato + mitad del jabón contra una funda nueva
//   SbSaltTank    el tanque de sal del hotel (enorme) se encoge hasta ser la media taza de bicarbonato
//   SbShelf       el estante de madera con las pilas: la de abajo sube arriba (rotar), el aire pasa entre las pilas
//   SbRecap       repaso: pinzas en la soga con una tarjeta por paso
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, RoomLight, Stamp, Card, Tape, lin, pop, useOut } from "./ClParts";
import { Tag, Tick, Hand2D } from "./ClTina";

const GRAY = "#B9B6AE", GRAYD = "#9A968C", WHITE = "#FCFCF8", BROWN = "#5A3418", BROWNL = "#8A5A33", SKY = "#BFD9EE";
const sheetCol = (k: number) => { const a = [0xB9, 0xB6, 0xAE], b = [0xFC, 0xFC, 0xF8]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`; };
// sábana colgada que flamea (path con ondas)
const Sheet: React.FC<{ x: number; y: number; w: number; h: number; col: string; f: number; seed: number; fold?: number }> = ({ x, y, w, h, col, f, seed, fold = 0.06 }) => {
  const wv = (t: number, k: number) => Math.sin(f / 11 + t * 4 + seed) * 14 * k;
  const bot = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return `${x + t * w + wv(t, 1.4)},${y + h + Math.sin(f / 9 + t * 6 + seed) * 18}`; });
  const d = `M${x},${y} L${x + w},${y} L${x + w + wv(1, 1)},${y + h * 0.5} ` + bot.reverse().map((p) => `L${p}`).join(" ") + ` L${x + wv(0, 1)},${y + h * 0.5} Z`;
  return <g><path d={d} fill={col} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x + (i + 1) * w / 6} ${y + 10} q ${wv(i / 5, 1)} ${h * 0.5} ${wv(i / 5, 1.4)} ${h - 10}`} stroke={`rgba(0,0,0,${fold})`} strokeWidth={fold > 0.08 ? 20 : 10} fill="none" />)}
  </g>;
};
const blob = (cx: number, cy: number, r: number, seed: number, n = 9) => {
  const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; const rr = r * (0.55 + 0.7 * rnd(seed + i * 3)); return [cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr * 0.8]; });
  const m = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${m(pts[n - 1], pts[0]).join(" ")}`;
  pts.forEach((p, i) => { const q = m(p, pts[(i + 1) % n]); d += ` Q${p[0]} ${p[1]} ${q[0]} ${q[1]}`; });
  return d + " Z";
};
const arrowHead = (x: number, y: number, dx: number, dy: number, s = 34) => {
  const l = Math.hypot(dx, dy) || 1; const ux = dx / l, uy = dy / l; const px = -uy, py = ux;
  return `M${x} ${y} L${x - ux * s + px * s * 0.55} ${y - uy * s + py * s * 0.55} L${x - ux * s - px * s * 0.55} ${y - uy * s - py * s * 0.55} Z`;
};
const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => <g><rect x={x - 8} y={y - 22} width={16} height={44} rx={4} fill="#C9A06A" stroke="#8C6A3E" strokeWidth={2} /></g>;
const Bottle: React.FC<{ x: number; y: number; s?: number; clear?: boolean }> = ({ x, y, s = 1, clear }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-260} width={120} height={260} rx={26} fill={clear ? "rgba(220,235,240,0.55)" : BROWN} stroke={clear ? "#9FB3BD" : "#3B200D"} strokeWidth={4} />
    <rect x={-28} y={-300} width={56} height={46} rx={8} fill={clear ? "#E9EEF1" : "#F2EFE8"} />
    <rect x={-50} y={-180} width={100} height={90} rx={8} fill="#FFFFFF" opacity={0.95} />
    {!clear ? <rect x={-38} y={-240} width={22} height={150} rx={11} fill="rgba(255,255,255,0.18)" /> : null}
  </g>
);

const HandSvg: React.FC<{ skin?: string }> = ({ skin = "#D9A47E" }) => {
  const ol = "#A06A44";
  return <g strokeLinejoin="round">
    <rect x={-520} y={-56} width={170} height={112} rx={22} fill={CL.navy} />
    <rect x={-360} y={-38} width={260} height={76} rx={34} fill={skin} stroke={ol} strokeWidth={4} />
    {[[118, 0], [136, 1], [126, 2], [98, 3]].map(([len, i]) => { const y = -68 + i * 36; return <g key={i}>
      <rect x={-50} y={y} width={len + 10} height={32} rx={16} fill={skin} stroke={ol} strokeWidth={4} />
      <path d={`M${-50 + len * 0.42} ${y + 7} q 5 9 0 18 M${-50 + len * 0.74} ${y + 7} q 5 9 0 18`} stroke="#B9835C" strokeWidth={3} fill="none" />
      <ellipse cx={-50 + len - 4} cy={y + 16} rx={9} ry={11} fill="#F6DCCB" stroke="#D9B79F" strokeWidth={2} />
    </g>; })}
    <rect x={-190} y={-84} width={160} height={166} rx={54} fill={skin} stroke={ol} strokeWidth={4} />
    <g transform="translate(-130 -78) rotate(-40)"><rect x={0} y={-17} width={104} height={36} rx={18} fill={skin} stroke={ol} strokeWidth={4} /><ellipse cx={94} cy={0} rx={9} ry={11} fill="#F6DCCB" stroke="#D9B79F" strokeWidth={2} /></g>
  </g>;
};

// ═════════════════════════════ 1 · dos sábanas del mismo juego
export const SbTwoSheets: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={401} dim={0.25} />
      <Hand2D seed={401} push={[1.0, 1.07]}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #CFE3F2 0%, #EAF2F7 60%, #D9CDB8 60%)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M40 250 Q960 310 1880 250" stroke="#6B5A44" strokeWidth={5} fill="none" />
          <g opacity={p}><Sheet x={170} y={276} w={720} h={620} col="#A19E93" f={f} seed={1} fold={0.12} /></g>
          <g opacity={p}>
            {[[390, 500, 92, 11], [650, 450, 70, 23], [560, 720, 112, 37], [300, 740, 62, 41], [770, 640, 58, 53], [470, 380, 50, 67]].map(([x, y, r, s], i) => <path key={i} d={blob(x, y, r, s)} fill="rgba(70,66,56,0.45)" stroke="rgba(60,56,46,0.35)" strokeWidth={3} />)}
            {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={230 + rnd(i + 70) * 600} cy={330 + rnd(i + 90) * 520} r={3 + rnd(i + 5) * 6} fill="rgba(70,66,56,0.4)" />)}
          </g>
          <g opacity={p}><Sheet x={1030} y={276} w={720} h={620} col={WHITE} f={f} seed={3} fold={0.14} /></g>
          {[190, 870, 1050, 1730].map((x, i) => <Pin key={i} x={x} y={276} />)}
        </svg>
        <Tag x={250} y={975} text="sin remojo" k={lin(f, 10, 20)} color={CL.inkSoft} size={56} />
        <Tag x={1000} y={975} text="con el frasco marrón" k={lin(f, T * 0.45, T * 0.55)} size={56} />
        <Stamp text="mismo juego" at={Math.round(T * 0.25)} x="50%" y="12%" size={52} rot={-2} />
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 2 · el hilo como un tubito
export const SbFiberTube: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const L = [["grasa de la piel", "#E3B94A"], ["jabón que quedó", "#8FC2E8"], ["piedra del agua", "#B7B2A6"]] as const;
  const k = (i: number) => ease(lin(f, 14 + i * (T * 0.22), 30 + i * (T * 0.22)));
  const dirt = lin(f, T * 0.7, T * 0.9);
  const cx = 1230, cy = 620, rx = 130, ry = 205, sc = [0.96, 0.72, 0.48];
  const ty = [330, 600, 870];
  const tip: [number, number][] = [[cx + rx * 0.84 * Math.cos(-0.96), cy + ry * 0.84 * Math.sin(-0.96)], [cx + rx * 0.6, cy], [cx + rx * 0.36 * 0.57, cy + ry * 0.36 * 0.82]];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={402} dim={0.45} />
      <Hand2D seed={402} push={[1.0, 1.06]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><marker id="sbArr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={CL.navy} /></marker><linearGradient id="sbTube" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.5" stopColor="#F2EEE6" /><stop offset="1" stopColor="#D0CABD" /></linearGradient></defs>
          <ellipse cx={250} cy={cy} rx={rx} ry={ry} fill="#E3DDD1" stroke="#BDB5A6" strokeWidth={5} />
          <rect x={250} y={cy - ry} width={cx - 250} height={ry * 2} fill="url(#sbTube)" />
          <line x1={250} x2={cx} y1={cy - ry} y2={cy - ry} stroke="#BDB5A6" strokeWidth={5} /><line x1={250} x2={cx} y1={cy + ry} y2={cy + ry} stroke="#BDB5A6" strokeWidth={5} />
          {L.map(([, c], i) => <rect key={i} x={250} y={cy - ry + 14 + i * 34} width={(cx - 250) * k(i)} height={ry * 2 - 28 - i * 68} fill={hexA(c, 0.4)} />)}
          <rect x={250} y={cy - ry} width={cx - 250} height={ry * 2} fill={`rgba(105,102,94,${0.6 * dirt})`} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#F6F2E8" stroke="#A9A190" strokeWidth={6} />
          {L.map(([, c], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx * sc[i]} ry={ry * sc[i]} fill={c} stroke="rgba(60,50,30,0.35)" strokeWidth={3} opacity={clamp01(k(i) * 1.5)} />)}
          <ellipse cx={cx} cy={cy} rx={rx * 0.24} ry={ry * 0.24} fill={`rgb(${215 - 100 * dirt},${210 - 100 * dirt},${200 - 100 * dirt})`} stroke="rgba(0,0,0,0.25)" strokeWidth={3} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`rgba(105,102,94,${0.5 * dirt})`} />
          {tip.map(([x, y], i) => <path key={"ar" + i} d={`M1420 ${ty[i]} Q${(1420 + x) / 2 + 20} ${(ty[i] + y) / 2 + (i === 1 ? 0 : i === 0 ? 30 : -30)} ${x + 10} ${y}`} stroke={CL.navy} strokeWidth={8} fill="none" opacity={clamp01(k(i) * 2)} markerEnd="url(#sbArr)" />)}
        </svg>
        {L.map(([t], i) => <Tag key={i} x={1430} y={ty[i]} text={t} k={k(i) * 2} color={i === 1 ? CL.navy : i === 0 ? CL.brass : CL.inkSoft} size={42} />)}
        <Tag x={250} y={950} text="capa sobre capa = gris" k={lin(f, T * 0.7, T * 0.76)} color={CL.red} size={54} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 3 · el cloro afina los hilos
export const SbBleachThin: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const bl = lin(f, 6, T * 0.3);
  const thin = ease(lin(f, T * 0.3, T * 0.8));
  const brk = lin(f, T * 0.75, T * 0.85);
  const LX = 600, LY = 560, LR = 330;
  const th = (x: number) => 140 * (1 - thin * 0.78 * (0.3 + 0.7 * Math.exp(-(((x - LX) / 200) ** 2))));
  const g = 8 + 70 * brk;
  const piece = (x0: number, x1: number, fr0: boolean, fr1: boolean) => {
    const xs = Array.from({ length: 24 }, (_, i) => x0 + (x1 - x0) * (i / 23));
    const pts: string[] = xs.map((x) => `${x},${LY - th(x) / 2}`);
    if (fr1) { const t = th(x1); for (let j = 1; j <= 4; j++) pts.push(`${x1 + (j % 2 ? -18 : 6)},${LY - t / 2 + (t * j) / 4}`); }
    pts.push(...xs.map((x) => `${x},${LY + th(x) / 2}`).reverse());
    if (fr0) { const t = th(x0); for (let j = 3; j >= 1; j--) pts.push(`${x0 + (j % 2 ? 18 : -6)},${LY - t / 2 + (t * j) / 4}`); }
    return pts.join(" ");
  };
  const pieces: [number, number, boolean, boolean][] = brk > 0 ? [[LX - LR - 30, LX - g, false, true], [LX + g, LX + LR + 30, true, false]] : [[LX - LR - 30, LX + LR + 30, false, false]];
  const ticks = Array.from({ length: 30 }, (_, i) => LX - LR - 20 + i * 24).filter((x) => !(brk > 0 && x > LX - g - 12 && x < LX + g + 12));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={403} dim={0.45} />
      <Hand2D seed={403} push={[1.0, 1.06]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="sbLens"><circle cx={LX} cy={LY} r={LR - 24} /></clipPath>
            <linearGradient id="sbStrand" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={sheetCol(0.45 + 0.55 * bl)} /><stop offset="0.5" stopColor={sheetCol(0.2 + 0.3 * bl)} /><stop offset="1" stopColor={sheetCol(0.0 + 0.1 * bl)} /></linearGradient></defs>
          <line x1={880} y1={820} x2={1010} y2={950} stroke="#3B3F45" strokeWidth={64} strokeLinecap="round" />
          <circle cx={LX} cy={LY} r={LR} fill="#2B3036" />
          <g clipPath="url(#sbLens)">
            {[-210, 210].map((d) => <rect key={d} x={LX - LR} y={LY + d - 26 * (1 - 0.5 * thin)} width={LR * 2} height={52 * (1 - 0.5 * thin)} fill="#565B63" />)}
            {[-190, 190].map((d) => <rect key={d} x={LX + d - 22} y={LY - LR} width={44} height={LR * 2} fill="#4A4F57" />)}
            {[-70, 70].map((d) => <line key={d} x1={LX - LR} x2={LX + LR} y1={LY + d} y2={LY + d} stroke="rgba(245,194,66,0.8)" strokeWidth={3} strokeDasharray="14 10" />)}
            {pieces.map(([a, b, f0, f1], i) => <polygon key={i} points={piece(a, b, f0, f1)} fill="url(#sbStrand)" stroke="rgba(0,0,0,0.55)" strokeWidth={3} strokeLinejoin="round" />)}
            {ticks.map((x, i) => <line key={i} x1={x} y1={LY - th(x) * 0.42} x2={x + 14} y2={LY + th(x) * 0.42} stroke="rgba(70,62,50,0.45)" strokeWidth={3} />)}
          </g>
          <circle cx={LX} cy={LY} r={LR - 12} fill="none" stroke="#8D939B" strokeWidth={28} />
          <text x={LX - 110} y={LY - 84} fontFamily="Arial" fontWeight={800} fontSize={38} fill="#F5C242" opacity={0.95}>ancho original</text>
        </svg>
        <Tag x={1000} y={300} text="blanquea por arriba" k={bl * 2} size={48} />
        <Tag x={1000} y={440} text="se come el algodón" k={thin * 2} color={CL.red} size={48} />
        <Tag x={1000} y={580} text="dura la mitad" k={lin(f, T * 0.62, T * 0.72)} color={CL.navy} size={48} />
        <Tag x={1000} y={760} text="cloro solo · nunca mezclado" k={lin(f, 10, 22)} color={CL.inkSoft} size={44} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 4 · la gota caliente y la espuma
export const SbFoamDrop: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const dropY = interpolate(f, [4, 18], [80, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t });
  const rub = lin(f, 20, T * 0.6);
  const foam = ease(lin(f, T * 0.35, T * 0.7));
  const dx = Math.sin(f / 2.2) * 26 * (rub > 0 && rub < 1 ? 1 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={404} dim={0.4} />
      <Hand2D seed={404} push={[1.0, 1.08]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M520 400 Q760 360 1000 410 Q1180 450 1360 420 L1430 780 Q1180 820 960 780 Q720 740 480 800 Z" fill="#A19E93" stroke="#EDEAE2" strokeWidth={10} />
          {[[700, 560, 70, 5], [1180, 640, 80, 9], [900, 700, 60, 13]].map(([x, y, r, s], i) => <path key={i} d={blob(x, y, r, s)} fill="rgba(80,76,66,0.3)" />)}
          <path d="M560 480 Q760 450 980 500 M600 700 Q800 670 1000 710 M1100 520 Q1250 500 1380 540" stroke="rgba(0,0,0,0.12)" strokeWidth={10} fill="none" />
          {f < 20 ? <path d={`M960 ${dropY - 40} C 990 ${dropY - 5}, 990 ${dropY + 20}, 960 ${dropY + 26} C 930 ${dropY + 20}, 930 ${dropY - 5}, 960 ${dropY - 40} Z`} fill="#7FC0EE" stroke="#3E86BD" strokeWidth={3} /> : <ellipse cx={960} cy={590} rx={110 * lin(f, 18, 24)} ry={40 * lin(f, 18, 24)} fill="rgba(70,90,110,0.35)" />}
          {Array.from({ length: 46 }, (_, i) => { const a = rnd(i) * Math.PI * 2, r = 30 + rnd(i + 5) * 330; return <circle key={i} cx={960 + Math.cos(a) * r} cy={590 + Math.sin(a) * r * 0.3 - 18 * foam * rnd(i + 3)} r={(4 + rnd(i + 2) * 11) * foam} fill="rgba(255,255,255,0.95)" stroke="rgba(150,175,195,0.8)" strokeWidth={2} />; })}
          {rub > 0 ? <g opacity={lin(f, 18, 24)}>
            <g transform={`translate(${850 + dx} 520)`}><HandSvg /></g>
            <g transform={`translate(${1070 - dx} 610) scale(-1 1)`}><HandSvg skin="#D59D77" /></g>
          </g> : null}
        </svg>
        <Tag x={110} y={925} text="agua bien caliente · sin jabón" k={lin(f, 4, 14)} size={46} />
        <Tag x={1060} y={925} text="espuma = jabón viejo" k={lin(f, T * 0.62, T * 0.72)} color={CL.red} size={46} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 5 · lo que necesita
export const SbKit: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const items: [string, (k: number) => React.ReactNode][] = [
    ["agua oxigenada 3 %", () => <Bottle x={0} y={0} s={0.9} />],
    ["bicarbonato", () => <g><rect x={-80} y={-200} width={160} height={200} rx={8} fill="#F2EFE8" stroke="#BDB5A6" strokeWidth={4} /><rect x={-80} y={-150} width={160} height={50} fill="#E7A33E" /></g>],
    ["balde de 10 L", () => <g><path d="M-140 -230 L-110 0 L110 0 L140 -230 Z" fill="#7FA7D6" stroke="#4F78A8" strokeWidth={5} /><path d="M-130 -230 Q0 -330 130 -230" fill="none" stroke="#555" strokeWidth={6} /></g>],
    ["jarra medidora", () => <g><path d="M-80 -200 L-70 0 L70 0 L80 -200 Z" fill="rgba(220,235,245,0.7)" stroke="#8FA3B5" strokeWidth={4} />{[0, 1, 2, 3].map((i) => <line key={i} x1={-60} x2={-30} y1={-40 - i * 40} y2={-40 - i * 40} stroke="#8FA3B5" strokeWidth={3} />)}</g>],
    ["paleta de madera", () => <g><rect x={-14} y={-300} width={28} height={300} rx={10} fill="#C8955B" stroke="#8C6234" strokeWidth={3} transform="rotate(14)" /></g>],
    ["guantes", () => <g stroke="#2C55A8" strokeWidth={4} strokeLinejoin="round">
      <rect x={-62} y={-72} width={124} height={72} rx={10} fill="#3E68C0" />
      <rect x={-70} y={-170} width={140} height={110} rx={34} fill="#4C7BD9" />
      {[[-62, 100], [-30, 122], [2, 112], [34, 90]].map(([x, h], i) => <rect key={i} x={x} y={-150 - h} width={28} height={h + 20} rx={14} fill="#4C7BD9" />)}
      <rect x={-112} y={-180} width={28} height={86} rx={14} fill="#4C7BD9" transform="rotate(-32 -98 -140)" />
      <path d="M-62 -30 L62 -30" stroke="#8FB1F0" strokeWidth={5} />
    </g>],
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={405} dim={0.35} />
      <Hand2D seed={405}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 380, background: "linear-gradient(180deg, #E8E2D4, #C9BFA9)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {items.map(([, draw], i) => { const p = pop(f, fps, 4 + i * Math.round(T * 0.1), 11); const x = 240 + i * 288; return <g key={i} opacity={clamp01(p * 3)} transform={`translate(${x} ${750 - (1 - p) * 700})`}><ellipse cx={0} cy={6} rx={110} ry={16} fill="rgba(0,0,0,0.2)" />{draw(p)}</g>; })}
        </svg>
        {items.map(([t], i) => <div key={i} style={{ position: "absolute", left: 240 + i * 288, top: 790, width: 276, translate: "-50% 0", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, lineHeight: 1.05, color: "#14213A", opacity: lin(f, 12 + i * Math.round(T * 0.1), 20 + i * Math.round(T * 0.1)) }}>{t}</div>)}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 6 · la etiqueta manda
export const SbLabelTemp: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 14);
  const lim = f < T * 0.5 ? 60 : 40;
  const temp = f < T * 0.5 ? 20 + 40 * ease(lin(f, 10, T * 0.4)) : 20 + 20 * ease(lin(f, T * 0.55, T * 0.68));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={406} dim={0.35} />
      <Hand2D seed={406} push={[1.04, 1.0]}>
        <div style={{ position: "absolute", left: 300, top: 160, width: 560, height: 760, background: WHITE, borderRadius: 16, rotate: `${-4 + 3 * p}deg`, boxShadow: `0 30px 60px ${CL.shadow}`, padding: 50, transform: `translateY(${(1 - p) * 300}px)` }}>
          <div style={{ fontFamily: LABEL, fontSize: 40, color: CL.inkSoft, letterSpacing: 4 }}>100 % ALGODÓN</div>
          <div style={{ marginTop: 40, width: 260, height: 220, position: "relative" }}>
            <svg width={260} height={220}><path d="M20 40 L40 200 L220 200 L240 40" fill="none" stroke={CL.navy} strokeWidth={10} /><path d="M20 40 Q75 70 130 40 T240 40" fill="none" stroke={CL.navy} strokeWidth={8} /></svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.navy }}>{lim}°</div>
          </div>
          <div style={{ fontFamily: HAND, fontSize: 52, color: CL.ink, marginTop: 40 }}>{lim === 60 ? "aguanta 60 grados" : "dice 40: use 40"}</div>
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={1260} y={160} width={80} height={680} rx={40} fill="#FFFFFF" stroke="#9AA3AD" strokeWidth={6} />
          <circle cx={1300} cy={880} r={80} fill={CL.red} />
          <rect x={1280} y={840 - 640 * (temp / 70)} width={40} height={640 * (temp / 70)} fill={CL.red} />
          <line x1={1220} x2={1380} y1={840 - 640 * (lim / 70)} y2={840 - 640 * (lim / 70)} stroke={CL.navy} strokeWidth={6} strokeDasharray="14 8" />
        </svg>
        <div style={{ position: "absolute", left: 1420, top: 330, width: 360, textAlign: "center", background: "#FFF8EA", border: "3px solid #E6DAC2", borderRadius: 24, padding: "14px 0 10px", boxShadow: `0 24px 50px ${CL.shadow}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: 1.05, color: CL.navy, fontVariantNumeric: "tabular-nums" }}>{Math.round(temp)}°</div>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.inkSoft, letterSpacing: 3 }}>{lim === 60 ? "TOPE 60°" : "TOPE 40°"}</div>
        </div>
        <Tag x={1060} y={985} text="la etiqueta manda" k={lin(f, T * 0.8, T * 0.9)} size={52} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 7 · la proporción en el balde
export const SbRatio: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const fill = ease(lin(f, 4, T * 0.3));
  const cups = Math.floor(lin(f, T * 0.32, T * 0.55, 0, 2.99));
  const soda = ease(lin(f, T * 0.6, T * 0.75));
  const stir = lin(f, T * 0.75, T);
  const top = 880 - 520 * fill * 0.62;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={407} dim={0.4} />
      <Hand2D seed={407}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="sbBucket"><path d="M560 340 L620 880 L1060 880 L1120 340 Z" /></clipPath></defs>
          <path d="M560 340 L620 880 L1060 880 L1120 340 Z" fill="rgba(140,180,220,0.35)" stroke="#4F78A8" strokeWidth={8} />
          <g clipPath="url(#sbBucket)"><rect x={540} y={top} width={600} height={600} fill={`rgba(${150 + 30 * stir},${190},${225},0.7)`} />
            {stir > 0 ? Array.from({ length: 4 }, (_, i) => <ellipse key={i} cx={840} cy={top + 120 + i * 60} rx={200 - i * 30} ry={18} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={4} transform={`rotate(${f * 6 + i * 40} 840 ${top + 120 + i * 60})`} />) : null}
          </g>
          <line x1={540} x2={1140} y1={880 - 520 * 0.62} y2={880 - 520 * 0.62} stroke={CL.red} strokeWidth={5} strokeDasharray="16 10" />
          <g><rect x={380} y={880 - 520 * 0.62 - 36} width={160} height={72} rx={16} fill="#FFFFFF" stroke={CL.red} strokeWidth={4} /><text x={460} y={880 - 520 * 0.62 + 17} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={50} fill={CL.navy}>10 L</text></g>
          {/* paleta */}
          {stir > 0 ? <g transform={`rotate(${Math.sin(f / 5) * 8} 840 600)`}><rect x={830 + Math.sin(f / 5) * 80} y={230} width={26} height={530} rx={12} fill="#C8955B" stroke="#8C6234" strokeWidth={3} /><rect x={822 + Math.sin(f / 5) * 80} y={216} width={42} height={30} rx={14} fill="#A8773F" stroke="#8C6234" strokeWidth={3} /></g> : null}
          {/* chorro del frasco */}
          {f > T * 0.3 && f < T * 0.58 ? <g transform="translate(560 -40) rotate(128) scale(0.75)"><Bottle x={0} y={0} /></g> : null}
          {cups >= 0 && f > T * 0.32 && f < T * 0.56 ? <path d={`M760 150 Q780 240 800 ${top}`} stroke="rgba(230,240,245,0.95)" strokeWidth={16} fill="none" /> : null}
          {f > T * 0.58 && f < T * 0.78 ? <g transform={`translate(960 170) rotate(${60 * soda})`}><path d="M60 -30 Q112 -26 106 10 Q100 34 52 28" fill="none" stroke="#BDB5A6" strokeWidth={12} /><path d="M-60 -50 L-50 40 L50 40 L60 -50 Z" fill="#FFFFFF" stroke="#BDB5A6" strokeWidth={5} /><rect x={-56} y={-40} width={112} height={30} fill="#EDE9DF" opacity={1 - soda} /></g> : null}
          {soda > 0 && soda < 1 ? Array.from({ length: 30 }, (_, i) => <circle key={i} cx={900 + rnd(i) * 60} cy={120 + ((f * 18 + i * 30) % (top - 120))} r={4} fill="#FFFFFF" />) : null}
        </svg>
        <div style={{ position: "absolute", left: 1160, top: 230, width: 620, fontFamily: SERIF, fontWeight: 900, color: CL.navy, lineHeight: 1.12, background: "#FFF8EA", padding: "26px 34px", borderRadius: 18, boxShadow: `0 24px 50px ${CL.shadow}`, border: "3px solid #E6DAC2" }}>
          <div style={{ fontSize: 64, opacity: lin(f, 4, 14) }}>10 L bien caliente</div>
          <div style={{ fontSize: 64, opacity: lin(f, T * 0.32, T * 0.4), color: BROWNL, marginTop: 14 }}>+ {Math.max(1, cups)} {cups >= 1 ? "tazas" : "taza"}<div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40 }}>agua oxig. 3 %</div></div>
          <div style={{ fontSize: 64, opacity: lin(f, T * 0.6, T * 0.68), marginTop: 14 }}>+ ½ taza<div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40 }}>bicarbonato</div></div>
        </div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 8 · el remojo de dos horas
export const SbBucketSoak: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = lin(f, 0, T);
  const turns = Math.floor(k * 4.99);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={408} dim={0.5} />
      <Hand2D seed={408} push={[1.06, 1.0]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="sbSoak"><path d="M440 330 L520 950 L1120 950 L1200 330 Z" /></clipPath></defs>
          <path d="M430 300 Q820 60 1210 300" stroke="#555" strokeWidth={12} fill="none" />
          <path d="M420 300 L510 960 L1130 960 L1220 300 Z" fill="#4F78A8" stroke="#2F527E" strokeWidth={8} />
          <path d="M440 330 L520 950 L1120 950 L1200 330 Z" fill={`rgb(${170 - 50 * k},${200 - 70 * k},${225 - 95 * k})`} />
          <rect x={410} y={290} width={820} height={30} rx={14} fill="#6E92BE" />
          {/* la sábana hundida: pliegues */}
          <g clipPath="url(#sbSoak)">{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${500 + i * 12} ${560 + i * 64} Q${820 + Math.sin(f / 30 + i + turns) * 70} ${520 + i * 64} ${1140 - i * 12} ${570 + i * 64}`} stroke={sheetCol(0.25 + 0.5 * k)} strokeWidth={50} fill="none" opacity={0.9} />)}
          <path d="M440 400 Q820 380 1200 400" stroke="rgba(255,255,255,0.6)" strokeWidth={6} fill="none" /></g>
          {Array.from({ length: 60 }, (_, i) => { const per = 40 + rnd(i) * 30; const t = ((f + rnd(i + 1) * per) % per) / per; return <circle key={i} cx={560 + rnd(i + 2) * 520} cy={930 - t * 520} r={3 + 6 * t} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} opacity={1 - t} />; })}
          {/* reloj 2 h */}
          <g transform="translate(1530 400)">
            <circle r={190} fill="#FFFFFF" stroke={CL.navy} strokeWidth={10} />
            {[0, 1, 2, 3].map((q) => <circle key={q} cx={Math.sin((q / 4) * Math.PI * 2) * 150} cy={-Math.cos((q / 4) * Math.PI * 2) * 150} r={16} fill={turns > q ? CL.yellow : "#E3DCCF"} />)}
            <line x1={0} y1={0} x2={Math.sin(k * Math.PI * 2) * 120} y2={-Math.cos(k * Math.PI * 2) * 120} stroke={CL.navy} strokeWidth={12} strokeLinecap="round" />
            <circle r={14} fill={CL.navy} />
          </g>
        </svg>
        <Tag x={1400} y={680} text="2 horas" k={lin(f, 4, 14)} />
        <Tag x={1400} y={780} text="vuelta cada 30 min" k={lin(f, 14, 24)} color={CL.inkSoft} />
        <Tag x={300} y={980} text="ese gris salió de sus sábanas" k={lin(f, T * 0.6, T * 0.7)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 9 · la mitad del jabón
export const SbHalfSoap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const lvl = ease(lin(f, 6, T * 0.35));
  const over = lin(f, T * 0.5, T * 0.8);
  const bot = 700, H = 370, top = bot - H, half = bot - H / 2;
  const ax = 1300, ay = half, bx = 1440, by = 765;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={409} dim={0.4} />
      <Hand2D seed={409}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((side) => { const x = side ? 1140 : 480; const fh = side ? H * over : H * 0.5 * lvl; const y0 = bot - fh; return <g key={side} opacity={side ? lin(f, T * 0.45, T * 0.52) : 1}>
            <path d={`M${x - 170} ${top} L${x - 130} ${bot} L${x + 130} ${bot} L${x + 170} ${top} Z`} fill="rgba(255,255,255,0.7)" stroke="#5B7FB0" strokeWidth={8} />
            <rect x={x - 140} y={y0} width={280} height={fh} fill="rgba(226,160,60,0.9)" />
            {side && y0 < half ? <rect x={x - 140} y={y0} width={280} height={half - y0} fill="rgba(200,50,35,0.55)" /> : null}
            <line x1={x - 200} x2={x + 200} y1={half} y2={half} stroke={CL.navy} strokeWidth={6} strokeDasharray="14 9" />
            <text x={x - 214} y={half + 22} textAnchor="end" fontFamily="Georgia" fontWeight={900} fontSize={72} fill={CL.navy}>½</text>
          </g>; })}
          <rect x={880} y={760} width={680} height={130} rx={20} fill={WHITE} stroke="#CFC9BC" strokeWidth={5} />
          <path d={blob(1380, 828, 78 * over, 4)} fill={`rgba(110,104,90,${0.8 * over})`} />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={1300 + rnd(i) * 160} cy={800 + rnd(i + 4) * 55} r={7 * over} fill="rgba(226,170,80,0.8)" />)}
          <path d={`M${ax} ${ay} C1530 ${ay - 40} 1570 ${ay + 190} ${bx + 14} ${by - 14}`} stroke={CL.red} strokeWidth={10} fill="none" opacity={over} strokeLinecap="round" />
          <path d={arrowHead(bx, by, -130, 90, 46)} fill={CL.red} opacity={over} />
        </svg>
        <Tag x={110} y={830} text="la mitad · ni una gota más" k={lin(f, T * 0.3, T * 0.4)} size={50} />
        <div style={{ position: "absolute", left: 1590, top: 360, opacity: lin(f, T * 0.65, T * 0.75) }}><Tick ok={false} s={120} k={lin(f, T * 0.7, T * 0.8)} /></div>
        <Tag x={930} y={965} text="lo que sobra queda en la tela" k={lin(f, T * 0.6, T * 0.7)} color={CL.red} size={50} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 10 · el tambor: cargado de más vs ¾
export const SbDrumLoad: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={410} dim={0.4} />
      <Hand2D seed={410}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((s) => { const cx = s ? 1340 : 580, cy = 520; const spin = s ? f * 5 : Math.sin(f / 6) * 3; const n = s ? 6 : 14; return <g key={s} opacity={pop(f, fps, s * 10, 12)}>
            <rect x={cx - 330} y={cy - 360} width={660} height={760} rx={40} fill="#ECEEF0" stroke="#AEB4BA" strokeWidth={6} />
            <circle cx={cx} cy={cy} r={250} fill="#3A3F46" />
            <circle cx={cx} cy={cy} r={220} fill="rgba(170,205,230,0.5)" />
            <g transform={`rotate(${spin} ${cx} ${cy})`}>{Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, r = s ? 120 : 60 + (i % 3) * 50; return <ellipse key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} rx={s ? 90 : 80} ry={s ? 40 : 50} fill={WHITE} stroke="#D8D4CA" strokeWidth={3} transform={`rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r})`} />; })}</g>
            <circle cx={cx} cy={cy} r={250} fill="none" stroke="#C9CED4" strokeWidth={22} />
          </g>; })}
        </svg>
        <Tag x={190} y={970} text="hasta arriba: no se mueve" k={lin(f, 10, 20)} color={CL.red} size={50} />
        <Tag x={1010} y={970} text="de 40 kg: carga con 30" k={lin(f, T * 0.45, T * 0.55)} size={50} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 11 · al sol en la terraza
export const SbSunLine: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = ease(lin(f, 0, T * 0.85));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={411} dim={0.2} />
      <Hand2D seed={411} push={[1.0, 1.06]}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, rgb(${180 + 50 * k},${205 + 30 * k},${235}) 0%, #F4EAD6 70%, #C9B79A 70%)` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><radialGradient id="sbSunG"><stop offset="0" stopColor="#FFF3B8" stopOpacity={0.95} /><stop offset="0.45" stopColor="#F5C242" stopOpacity={0.45} /><stop offset="1" stopColor="#F5C242" stopOpacity={0} /></radialGradient></defs>
          <circle cx={300 + 340 * k} cy={440 - 260 * k} r={230} fill="url(#sbSunG)" />
          <circle cx={300 + 340 * k} cy={440 - 260 * k} r={90} fill="#F5C242" stroke="#E0A21B" strokeWidth={6} />
          <circle cx={300 + 340 * k - 24} cy={440 - 260 * k - 26} r={52} fill="rgba(255,244,190,0.7)" />
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + f / 60; const sx = 300 + 340 * k, sy = 440 - 260 * k; return <line key={i} x1={sx + Math.cos(a) * 112} y1={sy + Math.sin(a) * 112} x2={sx + Math.cos(a) * 156} y2={sy + Math.sin(a) * 156} stroke="#F5C242" strokeWidth={10} strokeLinecap="round" opacity={0.6 + 0.4 * k} />; })}
          <path d="M80 240 Q960 300 1840 240" stroke="#6B5A44" strokeWidth={5} fill="none" />
          <Sheet x={420} y={266} w={520} h={520} col={sheetCol(0.1)} f={f} seed={5} />
          <path d={`M${640 + 340 * k} ${440 - 260 * k} L1000 270 L1520 270 L1560 800 L1000 800 Z`} fill={`rgba(245,194,66,${0.5 * k})`} />{[0, 1, 2, 3].map((i) => <line key={i} x1={340 + 340 * k + 80} y1={440 - 260 * k + 60} x2={1060 + i * 140} y2={760} stroke="#F5C242" strokeWidth={6} opacity={0.5 * k} strokeDasharray="22 14" />)}
          <Sheet x={1000} y={270} w={520} h={520} col={sheetCol(0.1 + 0.9 * k)} f={f} seed={8} />
          {Array.from({ length: 6 }, (_, i) => { const t = ((f + i * 20) % 120) / 120; return <path key={i} d={`M${1550 + t * 300} ${420 + i * 60} q 40 -20 80 0 t 80 0`} stroke="rgba(255,255,255,0.8)" strokeWidth={5} fill="none" opacity={1 - t} />; })}
        </svg>
        <Tag x={300} y={930} text="a la sombra: gris" k={lin(f, 8, 18)} color={CL.inkSoft} size={52} />
        <Tag x={1000} y={930} text="al sol: blanca" k={lin(f, T * 0.4, T * 0.5)} size={52} />
      </Hand2D>
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 12 · las zonas amarillas de la cama
export const SbPillowZone: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const y1 = lin(f, 8, 24), y2 = lin(f, 22, 38);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={412} dim={0.35} />
      <Hand2D seed={412}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={460} y={80} width={1000} height={940} rx={30} fill="#8A6A4A" />
          <rect x={490} y={110} width={940} height={880} rx={20} fill={WHITE} stroke="#E0DCD2" strokeWidth={4} />
          {[0, 1].map((i) => <g key={i}><rect x={540 + i * 450} y={150} width={390} height={200} rx={60} fill={WHITE} stroke="#DCD7CC" strokeWidth={4} /><path d={`M${615 + i * 450} 250 Q${640 + i * 450} 190 ${735 + i * 450} 196 Q${850 + i * 450} 186 ${862 + i * 450} 246 Q${870 + i * 450} 300 ${760 + i * 450} 306 Q${650 + i * 450} 316 ${615 + i * 450} 250 Z`} fill={hexA("#D9AE3E", 0.7 * y1)} stroke={hexA("#B98A22", 0.6 * y1)} strokeWidth={4} /></g>)}
          <rect x={490} y={420} width={940} height={120} fill="#F6F4EE" stroke="#E0DCD2" strokeWidth={3} />
          <path d="M490 430 Q700 410 960 440 Q1200 470 1430 430 L1430 520 Q1200 550 960 520 Q700 500 490 530 Z" fill={hexA("#D9AE3E", 0.6 * y2)} />
          <path d="M1270 250 L1380 250" stroke={CL.navy} strokeWidth={4} opacity={y1} />
        </svg>
        <Tag x={1400} y={250} text="cara, pelo, cremas" k={y1 * 2} size={38} />
        <Tag x={1380} y={480} text="el borde del cuello" k={y2 * 2} size={38} />
        <Tag x={1400} y={700} text="+ 1 hora de remojo" k={lin(f, T * 0.6, T * 0.7)} color={CL.brass} size={38} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 13 · cinco errores en la soga
export const SbFiveErrors: React.FC<{ hi?: number; bed?: string }> = ({ hi = 1, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const E = ["Cloro en el algodón", "Lavadora hasta arriba", "Más jabón", "Suavizante siempre", "Secadora con la mancha"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={413} dim={0.35} />
      <Hand2D seed={413} push={[1.0, 1.03]}>
        <svg width={1920} height={200} style={{ position: "absolute", left: 0, top: 150 }}><path d="M80 40 Q960 110 1840 40" stroke="#6B5A44" strokeWidth={5} fill="none" /></svg>
        {E.map((e, i) => {
          const p = pop(f, fps, 2 + i * 4, 11);
          const flip = i + 1 === hi ? ease(lin(f, 14, 28)) : 1;
          const sw = Math.sin(f / 10 + i) * 2;
          const act = i + 1 === hi;
          const x = 108 + i * 354, y = 210 + Math.sin((i / 4) * Math.PI) * 36;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 304, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 30}deg`, opacity: Math.min(1, p * 2) * (act ? 1 : 0.92), scale: act ? "1.04" : "0.96", zIndex: act ? 2 : 1 }}>
            <div style={{ position: "absolute", left: 142, top: -16, width: 20, height: 50, borderRadius: 4, background: "#C9A06A", zIndex: 2 }} />
            <div style={{ transform: `perspective(1200px) rotateY(${flip * 180}deg)` }}>
              {flip < 0.5 ? <div style={{ height: 440, background: sheetCol(0.3), borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: "#8D887D" }}>{i + 1}</div>
                : <div style={{ transform: "scaleX(-1)", height: 440, background: act ? "#FFFFFF" : "#FBF8F0", borderRadius: 6, border: `${act ? 10 : 6}px solid ${CL.red}`, boxShadow: `0 20px 40px ${CL.shadow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 14, textAlign: "center" }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.red, lineHeight: 1 }}>{i + 1}</div>
                  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#14213A", lineHeight: 1.15, marginTop: 14 }}>{e}</div>
                </div>}
            </div>
          </div>;
        })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 14 · la hoja de la lavandería
export const SbRoutine: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const S = [["La gota caliente", 1], ["10 L + 2 tazas + ½ bicarbonato", 5], ["Remojo, vuelta cada 30 min", 120], ["Lavadora: ½ jabón, doble enjuague", 60], ["Al sol o a la ventana", 0]] as const;
  const p = pop(f, fps, 0, 15);
  const step = (i: number) => clamp01((f - 10 - i * (T * 0.15)) / 10);
  const sum = S.reduce((a, [, m], i) => a + m * step(i), 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={414} dim={0.3} />
      <Hand2D seed={414}>
        <div style={{ position: "absolute", left: 240, top: 120, rotate: `${-2 + (1 - p) * -8}deg`, translate: `0 ${(1 - p) * 900}px` }}>
          <div style={{ width: 1000, height: 710, background: "#FFFDF6", borderRadius: 10, boxShadow: `0 40px 80px ${CL.shadow}`, padding: "70px 50px 30px", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 119px, #E3DCCF 119px 121px)", backgroundPosition: "0 130px" }}>
            
            {S.map(([t, m], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 120, opacity: 0.75 + 0.25 * step(i) }}>
                <div style={{ width: 56, height: 56, border: `5px solid ${CL.navy}`, borderRadius: 8, position: "relative" }}>{step(i) > 0.1 ? <div style={{ position: "absolute", left: -6, top: -18 }}><Tick ok s={64} k={step(i)} /></div> : null}</div>
                <div style={{ flex: 1, fontFamily: HAND, fontWeight: 700, fontSize: 52, lineHeight: 1.0, color: "#14213A" }}>{t}</div>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 50, color: CL.navy }}>{m === 0 ? "sol" : m >= 60 ? `${m / 60} h` : `${m} min`}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 1320, top: 330, opacity: p, background: "#FFF8EA", padding: "26px 40px", borderRadius: 18, boxShadow: `0 24px 50px ${CL.shadow}`, border: "3px solid #E6DAC2" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.inkSoft, letterSpacing: 4 }}>TOTAL</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: CL.navy, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{sum >= 60 ? `${Math.floor(sum / 60)} h ${String(Math.round(sum % 60)).padStart(2, "0")}` : `${Math.round(sum)} min`}</div>
          <div style={{ fontFamily: HAND, fontSize: 60, color: CL.ink, opacity: lin(f, T * 0.8, T * 0.9) }}>una tarde</div>
        </div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 15 · cada seis lavados
export const SbEverySix: React.FC<{ bed?: string; hard?: boolean }> = ({ bed, hard = false }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const n = hard ? 4 : 6;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={415} dim={0.35} />
      <Hand2D seed={415}>
        {Array.from({ length: n }, (_, i) => {
          const p = pop(f, fps, 4 + i * 6, 12); const last = i === n - 1; const w = 1600 / n;
          const tk = last ? 0 : lin(f, 256 + i * 5, 265 + i * 5);
          const pulse = last ? 1 + 0.03 * Math.sin(f / 8) * lin(f, 254, 270) : 1;
          return <div key={i} style={{ position: "absolute", left: 160 + i * w, top: 270, width: w - 30, textAlign: "center", opacity: Math.min(1, p * 2), translate: `0 ${(1 - p) * 120}px`, scale: String((last ? 1.2 : 1) * pulse) }}>
            <Card style={{ position: "relative", padding: 14, height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: last ? `8px solid ${CL.brass}` : "3px solid #D9D0BE", background: last ? "#FFF3D6" : "#FFFFFF" }}>
              {!last ? <div style={{ position: "absolute", right: -18, top: -34 }}><Tick ok s={78} k={tk} /></div> : null}
              <svg width={140} height={140} viewBox="-70 -70 140 140">{last ? <g><path d="M-44 -30 L-34 46 L34 46 L44 -30 Z" fill="#5E86B8" stroke="#2F527E" strokeWidth={5} /><path d="M-40 -14 L40 -14 L36 18 L-36 18 Z" fill="#9EC3E6" /><path d="M-44 -30 Q0 -70 44 -30" stroke="#444" strokeWidth={5} fill="none" /></g> : <g><circle r={60} fill="#E9EEF3" stroke="#AEB6BF" strokeWidth={6} /><path d="M0 -38 C 26 -6, 30 16, 0 32 C -30 16, -26 -6, 0 -38 Z" fill="rgba(226,160,60,0.4)" stroke="#B9862E" strokeWidth={3} /><path d="M-22 8 C -18 22, 18 22, 22 8 L 22 20 C 14 32, -14 32, -22 20 Z" fill="rgba(226,160,60,0.95)" /></g>}</svg>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: CL.navy, marginTop: 18 }}>LAVADO {i + 1}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: last ? "#6B3F16" : "#14213A" }}>{last ? "+ remojo" : "½ jabón"}</div>
            </Card>
          </div>;
        })}
        <Tag x={560} y={860} text={hard ? "agua dura: cada 4" : "no cada vez · cada seis"} k={lin(f, T * 0.6, T * 0.7)} color={hard ? CL.red : CL.navy} size={54} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 16 · la luz gasta el agua oxigenada
export const SbBottleLight: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = lin(f, T * 0.2, T * 0.85);
  const day = Math.min(7, Math.floor(1 + k * 7));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={416} dim={0.35} />
      <Hand2D seed={416}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 90% 0%, rgba(255,230,160,0.55), rgba(255,230,160,0) 55%)` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={1900} y1={0} x2={500 + i * 160} y2={1080} stroke="rgba(255,230,160,0.12)" strokeWidth={50} />)}
          <Bottle x={640} y={820} s={1.6} />
          <path d="M1900 0 L1330 400 L1480 440 Z" fill="rgba(255,220,120,0.35)" />
          <Bottle x={1240} y={820} s={1.6} clear />
          <rect x={1144} y={404} width={192} height={416} rx={42} fill="none" stroke="#6E8792" strokeWidth={6} />
          {Array.from({ length: 24 }, (_, i) => { const t = ((f + i * 7) % 40) / 40; return <circle key={i} cx={1180 + rnd(i) * 120} cy={760 - t * 260} r={5} fill="none" stroke="rgba(120,160,180,0.9)" strokeWidth={2} opacity={(1 - t) * (1 - k)} />; })}
        </svg>
        <Tag x={460} y={960} text="se guarda en su frasco" k={lin(f, 6, 16)} />
        <div style={{ position: "absolute", left: 1240, top: 860, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "#fff", background: CL.navy, padding: "4px 26px", borderRadius: 14, opacity: lin(f, T * 0.2, T * 0.3) }}>día {day}</div>
        <Tag x={1380} y={980} text="en una semana es agua" k={lin(f, T * 0.8, T * 0.9)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 17 · el dobladillo primero
export const SbHemTest: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const drop = interpolate(f, [6, 20], [150, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t });
  const wait = lin(f, 22, T * 0.4);
  const sp = ease(lin(f, T * 0.45, T * 0.72));
  const PY = 220, PH = 600, HY = PY + PH - 170;
  const cloth = (x0: number, w: number) => <g>
    <rect x={x0} y={PY} width={w} height={PH} fill={SKY} />
    {Array.from({ length: Math.floor(w / 14) }, (_, i) => <line key={`a${i}`} x1={x0 + i * 14} x2={x0 + i * 14} y1={PY} y2={PY + PH} stroke="rgba(60,100,145,0.22)" strokeWidth={3} />)}
    {Array.from({ length: Math.floor(PH / 14) }, (_, i) => <line key={`b${i}`} x1={x0} x2={x0 + w} y1={PY + i * 14} y2={PY + i * 14} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />)}
    <path d={`M${x0 + 60} ${PY} Q${x0 + 200} ${PY + 250} ${x0 + 120} ${HY}`} stroke="rgba(40,80,120,0.16)" strokeWidth={46} fill="none" />
    <path d={`M${x0 + w - 150} ${PY} Q${x0 + w - 60} ${PY + 220} ${x0 + w - 190} ${HY}`} stroke="rgba(255,255,255,0.28)" strokeWidth={40} fill="none" />
    <rect x={x0} y={HY} width={w} height={PY + PH - HY} fill="#9CC2E1" />
    <rect x={x0} y={HY} width={w} height={20} fill="rgba(20,50,90,0.28)" />
    <line x1={x0} x2={x0 + w} y1={HY} y2={HY} stroke="#5C88AF" strokeWidth={5} />
    <line x1={x0 + 6} x2={x0 + w - 6} y1={HY + 40} y2={HY + 40} stroke="#2F5C88" strokeWidth={6} strokeDasharray="22 12" />
    <line x1={x0 + 6} x2={x0 + w - 6} y1={PY + PH - 30} y2={PY + PH - 30} stroke="#2F5C88" strokeWidth={6} strokeDasharray="22 12" />
  </g>;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={417} dim={0.35} />
      <Hand2D seed={417}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="sbHemA"><rect x={140} y={PY} width={760} height={PH} rx={20} /></clipPath><clipPath id="sbHemB"><rect x={1020} y={PY} width={760} height={PH} rx={20} /></clipPath></defs>
          <g clipPath="url(#sbHemA)">
            {cloth(140, 760)}
            <circle cx={520} cy={HY + 85} r={70 * wait} fill="#6F9CC4" opacity={0.85} />
            <circle cx={520} cy={HY + 85} r={46 * wait} fill="#C9E0F0" opacity={0.9} />
          </g>
          <rect x={140} y={PY} width={760} height={PH} rx={20} fill="none" stroke="#7FA6C8" strokeWidth={6} />
          {f < 22 ? <path d={`M520 ${drop - 34} C 548 ${drop - 4}, 548 ${drop + 18}, 520 ${drop + 24} C 492 ${drop + 18}, 492 ${drop - 4}, 520 ${drop - 34} Z`} fill={BROWN} stroke="#2B1608" strokeWidth={3} /> : null}
          <g transform="translate(520 190) scale(1.5)" opacity={1 - lin(f, 18, 26)}><rect x={-30} y={-90} width={60} height={80} rx={10} fill="#3B200D" /><path d="M-10 -10 L10 -10 L4 40 L-4 40 Z" fill="rgba(220,235,240,0.85)" stroke="#9FB3BD" strokeWidth={2} /></g>
          <circle cx={520} cy={HY + 85} r={92} fill="none" stroke={CL.navy} strokeWidth={6} strokeDasharray="14 10" opacity={lin(f, 22, 30)} />
          <g opacity={lin(f, 26, 34)} transform={`translate(${590 + 6 * Math.sin(f / 3)} ${HY + 30}) rotate(-30)`}>
            <rect x={14} y={-9} width={330} height={18} rx={9} fill="#F4EFE4" stroke="#B7AE9B" strokeWidth={3} />
            <ellipse cx={0} cy={0} rx={34} ry={24} fill="#FFFFFF" stroke="#B7AE9B" strokeWidth={4} />
          </g>
          <g opacity={lin(f, T * 0.4, T * 0.5)}>
            <g clipPath="url(#sbHemB)">
              {cloth(1020, 760)}
              {sp > 0.03 ? Array.from({ length: 14 }, (_, i) => { const cx = 1100 + rnd(i) * 600, cy = 270 + rnd(i + 9) * 480; return <path key={i} d={blob(cx, cy, (24 + rnd(i + 3) * 36) * sp, i * 7 + 3, 8)} fill="#E6F1FA" stroke="#B3CFE4" strokeWidth={2} opacity={0.95} />; }) : null}
            </g>
            <rect x={1020} y={PY} width={760} height={PH} rx={20} fill="none" stroke="#7FA6C8" strokeWidth={6} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 790, top: 250, opacity: lin(f, T * 0.3, T * 0.38) }}><Tick ok s={110} k={lin(f, T * 0.3, T * 0.42)} /></div>
        <div style={{ position: "absolute", left: 1650, top: 250, opacity: lin(f, T * 0.62, T * 0.7) }}><Tick ok={false} s={120} k={lin(f, T * 0.62, T * 0.74)} /></div>
        <Tag x={110} y={910} text="primero, el dobladillo de adentro" k={lin(f, 12, 22)} size={46} />
        <Tag x={1100} y={910} text="sin probar: manchas claras" k={sp * 2} color={CL.red} size={46} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 18 · farmacia 3 % (10 vol) sí, peluquería no
export const SbPharmacy: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={418} dim={0.35} />
      <Hand2D seed={418}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g opacity={pop(f, fps, 2, 12)}><Bottle x={620} y={860} s={1.7} /></g>
          <g opacity={pop(f, fps, 12, 12)}><rect x={1180} y={420} width={220} height={440} rx={20} fill="#D9D0EE" stroke="#5B4E8C" strokeWidth={6} /><rect x={1240} y={360} width={100} height={70} rx={10} fill="#8B6FD0" stroke="#5B4E8C" strokeWidth={4} /><rect x={1200} y={540} width={180} height={150} rx={10} fill="#FFFFFF" /><text x={1290} y={600} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={40} fill="#5B4E8C">30 VOL</text><text x={1290} y={650} textAnchor="middle" fontFamily="Arial" fontSize={26} fill="#5B4E8C">peluquería</text></g>
        </svg>
        <div style={{ position: "absolute", left: 500, top: 560, width: 240, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.navy, opacity: lin(f, 10, 20) }}>3 %<div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 24, whiteSpace: "nowrap" }}>10 VOLÚMENES</div></div>
        <div style={{ position: "absolute", left: 640, top: 140, opacity: lin(f, 14, 24) }}><Tick ok s={120} k={lin(f, 14, 26)} /></div>
        <div style={{ position: "absolute", left: 1220, top: 200, opacity: lin(f, T * 0.6, T * 0.68) }}><Tick ok={false} s={140} k={lin(f, T * 0.6, T * 0.72)} /></div>
        <Tag x={500} y={980} text="farmacia" k={lin(f, 6, 16)} />
        <Tag x={1130} y={980} text="peluquería: más fuerte" k={lin(f, T * 0.6, T * 0.7)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 19 · el ticket
export const SbCost: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  // balanza de mostrador: frasco + bicarbonato + ½ jabón de un lado, 1 funda nueva del otro; pesa más la funda
  const tilt = ease(lin(f, T * 0.45, T * 0.65));
  const a = -8 * tilt;
  const L = (i: number) => clamp01(pop(f, fps, 6 + i * 8, 12) * 2);
  const rad = (a * Math.PI) / 180;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={419} dim={0.35} />
      <Hand2D seed={419}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(960 640) scale(1.25) translate(-960 -640)">
          <path d="M960 330 L905 880 L1015 880 Z" fill="#8C6A3E" />
          <rect x={780} y={870} width={360} height={40} rx={12} fill="#6E4E2E" />
          <g transform={`rotate(${a} 960 330)`}><rect x={520} y={320} width={880} height={22} rx={10} fill="#B08850" stroke="#6E4E2E" strokeWidth={3} /></g>
          <circle cx={960} cy={330} r={22} fill="#6E4E2E" />
          {[-1, 1].map((s) => {
            const x = 960 + 420 * s * Math.cos(rad), y = 330 + 420 * s * Math.sin(rad);
            return <g key={s}>
              <line x1={x} y1={y} x2={x - 170} y2={y + 230} stroke="#555" strokeWidth={3} /><line x1={x} y1={y} x2={x + 170} y2={y + 230} stroke="#555" strokeWidth={3} />
              <path d={`M${x - 210} ${y + 230} Q${x} ${y + 300} ${x + 210} ${y + 230} Z`} fill="#C9CED4" stroke="#8E969F" strokeWidth={4} />
              {s < 0 ? <g>
                <g opacity={L(0)}><Bottle x={x - 120} y={y + 232} s={0.75} /></g>
                <g opacity={L(1)} transform={`translate(${x + 10} ${y + 232}) scale(1.35)`}><rect x={-50} y={-120} width={100} height={120} rx={6} fill="#F2EFE8" stroke="#BDB5A6" strokeWidth={3} /><rect x={-50} y={-90} width={100} height={30} fill="#E7A33E" /></g>
                <g opacity={L(2)} transform={`translate(${x + 130} ${y + 232}) scale(1.35)`}><path d="M-34 0 L-30 -110 L30 -110 L34 0 Z" fill="rgba(226,160,60,0.3)" stroke="#B9862E" strokeWidth={3} /><rect x={-31} y={-55} width={62} height={55} fill="rgba(226,160,60,0.85)" /></g>
              </g> : <g opacity={L(3)} transform={`translate(${x} ${y + 228})`}>
                <path d="M-160 -130 Q-170 -30 -160 0 L160 0 Q170 -30 160 -130 Q0 -150 -160 -130 Z" fill={WHITE} stroke="#CFC9BC" strokeWidth={4} />
                <path d="M-160 -130 Q-128 -108 -160 -86 M160 -130 Q128 -108 160 -86" stroke="#CFC9BC" strokeWidth={3} fill="none" />
                <g transform="translate(130 -140) rotate(20)"><rect x={-42} y={-24} width={84} height={48} rx={8} fill={CL.yellow} stroke="#B9961E" strokeWidth={3} /><circle cx={-28} cy={0} r={6} fill="#fff" /></g>
              </g>}
            </g>;
          })}
          </g>
        </svg>
        <Tag x={110} y={810} text="frasco + bicarbonato + ½ jabón" k={lin(f, 20, 30)} size={42} />
        <Tag x={1100} y={810} text="1 funda nueva" k={lin(f, 30, 40)} color={CL.red} size={46} />
        <Stamp text="alcanza para meses" at={Math.round(T * 0.68)} x="50%" y="9%" size={50} rot={-1} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 20 · el tanque de sal del hotel = ½ taza
export const SbSaltTank: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p1 = pop(f, fps, 2, 14), eq = pop(f, fps, Math.round(T * 0.35), 12), p2 = pop(f, fps, Math.round(T * 0.45), 12);
  const pour = ease(lin(f, T * 0.55, T * 0.75));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={420} dim={0.4} />
      <Hand2D seed={420}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(500 900) scale(${0.85 + 0.15 * p1})`} opacity={clamp01(p1 * 2)}>
            <ellipse cx={0} cy={6} rx={300} ry={30} fill="rgba(0,0,0,0.22)" />
            <rect x={-250} y={-640} width={500} height={640} rx={44} fill="#DCE3EC" stroke="#5C6F8A" strokeWidth={8} />
            {[-480, -320, -160].map((y) => <rect key={y} x={-250} y={y} width={500} height={26} fill="#7C93B4" />)}
            <rect x={-220} y={-630} width={50} height={620} rx={25} fill="rgba(255,255,255,0.4)" />
            <path d="M250 -520 L330 -520 L330 -120 L250 -120" fill="none" stroke="#8E969F" strokeWidth={18} />
            <rect x={-270} y={-690} width={540} height={70} rx={22} fill="#34496B" stroke="#22324C" strokeWidth={6} />
            <rect x={-60} y={-730} width={120} height={46} rx={14} fill="#22324C" />
            <rect x={-190} y={-570} width={380} height={170} rx={16} fill="#FFFFFF" stroke="#5C6F8A" strokeWidth={5} />
            <text x={0} y={-445} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={124} fill="#22324C">SAL</text>
            {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-190 + (i % 6) * 66} y={-300 + Math.floor(i / 6) * 70} width={48} height={48} rx={7} fill="#FFFFFF" stroke="#C3CCD8" strokeWidth={3} />)}
          </g>
          <g opacity={eq}>
            <line x1={845} x2={1140} y1={600} y2={600} stroke={CL.navy} strokeWidth={21} strokeLinecap="round" />
            <path d={arrowHead(1218, 600, 1, 0, 73)} fill={CL.navy} />
          </g>
          <g opacity={clamp01(p2 * 2)} transform={`translate(1450 ${900 + (1 - p2) * 120})`}>
            <ellipse cx={0} cy={6} rx={230} ry={24} fill="rgba(0,0,0,0.2)" />
            <path d="M-210 -360 L-170 0 L170 0 L210 -360 Z" fill="#7FA7D6" stroke="#4F78A8" strokeWidth={6} />
            <path d="M-190 -320 L-158 -20 L158 -20 L190 -320 Z" fill="rgba(200,225,245,0.85)" />
            <path d="M-200 -360 Q0 -500 200 -360" fill="none" stroke="#555" strokeWidth={8} />
            <g transform={`translate(-30 -440) rotate(${75 * pour})`}><path d="M-70 -60 L-60 40 L60 40 L70 -60 Z" fill="#FFFFFF" stroke="#BDB5A6" strokeWidth={5} /><path d="M70 -40 Q120 -30 110 10 Q100 30 60 24" fill="none" stroke="#FFFFFF" strokeWidth={14} /><rect x={-60} y={-14} width={120} height={52} fill="#EDE9DF" opacity={1 - pour} /></g>
            {pour > 0.3 && pour < 0.98 ? Array.from({ length: 30 }, (_, i) => { const t = ((f + i * 3) % 24) / 24; return <circle key={i} cx={40 + (rnd(i) - 0.5) * 40} cy={-400 + t * 300} r={4} fill="#FFFFFF" opacity={1 - t} />; }) : null}
          </g>
        </svg>
        <Tag x={860} y={490} text="equivale a" k={eq * 2} color={CL.navy} size={56} />
        <Tag x={130} y={985} text="el ablandador del hotel" k={lin(f, 6, 16)} color={CL.navy} size={50} />
        <Tag x={1100} y={985} text="½ taza de bicarbonato" k={lin(f, T * 0.6, T * 0.7)} size={48} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 21 · el estante: rotar la pila
export const SbShelf: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  // dos pilas con aire en el medio: de la derecha se usa la de abajo y la recién lavada entra arriba
  const take = ease(lin(f, T * 0.3, T * 0.5)), drop = ease(lin(f, T * 0.55, T * 0.72)), air = lin(f, 6, 16);
  const H = 74, Y0 = 840;
  const fold = (key: string, x: number, y: number, w: number, tone: number) => <g key={key} transform={`translate(${x} ${y})`}>
    <rect x={0} y={-H + 6} width={w} height={H - 6} rx={14} fill={sheetCol(tone)} stroke="#D3CEC2" strokeWidth={3} />
    <path d={`M14 ${-H + 26} Q${w / 2} ${-H + 36} ${w - 14} ${-H + 26}`} stroke="rgba(0,0,0,0.07)" strokeWidth={6} fill="none" />
    <path d={`M${w - 30} ${-H + 8} Q${w - 6} ${-H / 2} ${w - 30} -6`} stroke="rgba(0,0,0,0.08)" strokeWidth={4} fill="none" /></g>;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={421} dim={0.4} />
      <Hand2D seed={421}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={240} y={Y0} width={1440} height={44} rx={6} fill="#9A7048" stroke="#6E4E2E" strokeWidth={4} />
          <rect x={240} y={Y0 + 44} width={1440} height={16} fill="rgba(0,0,0,0.2)" />
          {Array.from({ length: 6 }, (_, i) => fold(`l${i}`, 360, Y0 - i * H, 460, 0.75 + 0.04 * i))}
          {fold("out", 1000 + 800 * take, Y0 - 30 * Math.sin(take * Math.PI), 460, 0.62)}
          {Array.from({ length: 5 }, (_, i) => fold(`r${i}`, 1000, Y0 - (i + 1) * H + H * take, 460, 0.78 + 0.04 * i))}
          <g opacity={clamp01(drop * 3)}>{fold("new", 1000, Y0 - 5 * H - (1 - drop) * 500, 460, 1)}</g>
          {Array.from({ length: 8 }, (_, i) => { const t = ((f + i * 12) % 80) / 80; return <path key={i} d={`M${900 + (i % 2) * 70} ${Y0 - 30 - t * 380} q 18 -22 0 -44 q -18 -22 0 -44`} stroke="rgba(130,175,210,0.85)" strokeWidth={6} fill="none" opacity={air * (1 - t)} />; })}
        </svg>
        <Tag x={110} y={975} text="estantes abiertos · aire entre pilas" k={air} size={44} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M1490 470 C1650 520 1650 740 1500 790" stroke={CL.brass} strokeWidth={14} fill="none" strokeLinecap="round" opacity={lin(f, T * 0.3, T * 0.4)} />
          <path d={arrowHead(1490, 792, -150, 50, 56)} fill={CL.brass} stroke="#7A5A10" strokeWidth={3} strokeLinejoin="round" opacity={lin(f, T * 0.34, T * 0.44)} />
        </svg>
        <Tag x={1480} y={400} text="la lavada, arriba" k={lin(f, T * 0.6, T * 0.7)} color={CL.brass} size={42} />
        <Tag x={1150} y={975} text="use la de abajo" k={lin(f, T * 0.32, T * 0.42)} color={CL.navy} size={44} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 22 · repaso en la soga
export const SbRecap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const W = ["llenas, no sucias", "el cloro no", "la gota caliente", "10 L bien caliente", "2 tazas · 3 %", "½ taza bicarbonato", "2 h · vuelta c/30", "½ jabón · doble enjuague", "sin suavizante", "al sol", "cada 6 lavados", "sólo blancos"];
  const per = 808 / W.length;
  const cur = Math.max(0, Math.min(W.length - 1, Math.floor((f - 4) / per)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={422} dim={0.35} />
      <Hand2D seed={422} push={[1.02, 1.0]}>
        {[0, 1, 2].map((r) => <svg key={r} width={1920} height={80} style={{ position: "absolute", left: 0, top: 112 + r * 300 }}><path d="M80 20 Q960 70 1840 20" stroke="#6B5A44" strokeWidth={4} fill="none" /></svg>)}
        {W.map((w, i) => {
          const r = Math.floor(i / 4), c = i % 4; const t0 = 4 + i * per;
          const p = pop(f, fps, t0, 10);
          const sw = Math.sin(f / 14 + i) * 2;
          const act = i === cur && f >= t0;
          return <div key={i} style={{ position: "absolute", left: 120 + c * 435, top: 160 + r * 300 + Math.sin((c / 3) * Math.PI) * 22, width: 375, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 40}deg`, opacity: clamp01(p * 2), scale: act ? "1.05" : "1", zIndex: act ? 2 : 1 }}>
            <div style={{ position: "absolute", left: 177, top: -20, width: 20, height: 50, borderRadius: 4, background: "#C9A06A", zIndex: 2 }} />
            <div style={{ height: 240, background: act ? "#FFF0C2" : WHITE, border: act ? `8px solid ${CL.brass}` : "2px solid #E4DED0", borderRadius: 8, boxShadow: `0 20px 40px ${CL.shadow}`, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: 16 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: act ? "#8A5A00" : CL.brass, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: CL.navy, lineHeight: 1.1 }}>{w}</div>
            </div>
          </div>;
        })}
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};
