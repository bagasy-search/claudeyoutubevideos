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
const Sheet: React.FC<{ x: number; y: number; w: number; h: number; col: string; f: number; seed: number }> = ({ x, y, w, h, col, f, seed }) => {
  const wv = (t: number, k: number) => Math.sin(f / 11 + t * 4 + seed) * 14 * k;
  const bot = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return `${x + t * w + wv(t, 1.4)},${y + h + Math.sin(f / 9 + t * 6 + seed) * 18}`; });
  const d = `M${x},${y} L${x + w},${y} L${x + w + wv(1, 1)},${y + h * 0.5} ` + bot.reverse().map((p) => `L${p}`).join(" ") + ` L${x + wv(0, 1)},${y + h * 0.5} Z`;
  return <g><path d={d} fill={col} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x + (i + 1) * w / 6} ${y + 10} q ${wv(i / 5, 1)} ${h * 0.5} ${wv(i / 5, 1.4)} ${h - 10}`} stroke="rgba(0,0,0,0.06)" strokeWidth={10} fill="none" />)}
  </g>;
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
          <path d="M40 150 Q960 210 1880 150" stroke="#6B5A44" strokeWidth={5} fill="none" />
          <g opacity={p}><Sheet x={170} y={176} w={720} h={720} col={GRAY} f={f} seed={1} /></g>
          <g opacity={p}><Sheet x={1030} y={176} w={720} h={720} col={WHITE} f={f} seed={3} /></g>
          {[190, 870, 1050, 1730].map((x, i) => <Pin key={i} x={x} y={176} />)}
        </svg>
        <Tag x={300} y={980} text="sin remojo" k={lin(f, 10, 20)} color={CL.inkSoft} />
        <Tag x={1180} y={980} text="con el frasco marrón" k={lin(f, T * 0.45, T * 0.55)} />
        <Stamp text="mismo juego" at={Math.round(T * 0.25)} x="50%" y="12%" size={52} rot={-4} />
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 2 · el hilo como un tubito
export const SbFiberTube: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const L = [["grasa de la piel", "#E8C77A"], ["jabón que quedó", "#CFE6F2"], ["piedra del agua", "#E9E5DB"]] as const;
  const k = (i: number) => ease(lin(f, 14 + i * (T * 0.22), 30 + i * (T * 0.22)));
  const dirt = lin(f, T * 0.7, T * 0.9);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={402} dim={0.45} />
      <Hand2D seed={402} push={[1.0, 1.1]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><linearGradient id="sbTube" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.5" stopColor="#F2EEE6" /><stop offset="1" stopColor="#D8D2C6" /></linearGradient></defs>
          {/* tubo en perspectiva */}
          <rect x={300} y={380} width={1150} height={320} fill="url(#sbTube)" />
          <ellipse cx={1450} cy={540} rx={90} ry={160} fill="#EFEAE0" stroke="#C9C2B4" strokeWidth={4} />
          {L.map(([, c], i) => <ellipse key={i} cx={1450} cy={540} rx={86 - 18 * (i + 1) * k(i) * 0.6} ry={156 - 30 * (i + 1) * k(i) * 0.6} fill="none" stroke={c} strokeWidth={22 * k(i)} />)}
          <ellipse cx={1450} cy={540} rx={30} ry={60} fill={`rgba(${120 - 30 * dirt},${118 - 30 * dirt},${110 - 30 * dirt},${0.2 + 0.6 * dirt})`} />
          {L.map(([, c], i) => <rect key={i} x={300} y={400 + i * 18} width={1150 * k(i)} height={280 - i * 36} fill={hexA(c, 0.35)} />)}
          <rect x={300} y={380} width={1150} height={320} fill={`rgba(110,108,100,${0.45 * dirt})`} />
          <ellipse cx={300} cy={540} rx={90} ry={160} fill="#E3DDD1" stroke="#C9C2B4" strokeWidth={4} />
        </svg>
        {L.map(([t, c], i) => <Tag key={i} x={360 + i * 380} y={260} text={t} k={k(i) * 2} color={i === 1 ? CL.navy : i === 0 ? CL.brass : CL.inkSoft} />)}
        <Tag x={760} y={820} text="capa sobre capa = gris" k={dirt * 2} color={CL.red} />
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
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={403} dim={0.45} />
      <Hand2D seed={403} push={[1.0, 1.08]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="sbLens"><circle cx={960} cy={540} r={430} /></clipPath></defs>
          <circle cx={960} cy={540} r={460} fill="#2E3238" />
          <g clipPath="url(#sbLens)">
            <rect x={500} y={100} width={920} height={900} fill={sheetCol(0.2 + 0.6 * bl)} />
            {Array.from({ length: 12 }, (_, i) => { const w = 34 * (1 - 0.7 * thin * (0.6 + 0.4 * rnd(i))); const gap = i === 6 && brk > 0; return <g key={`v${i}`}>{gap ? <><rect x={540 + i * 76 - w / 2} y={100} width={w} height={420 - 60 * brk} fill="#E9E4DA" /><rect x={540 + i * 76 - w / 2} y={580 + 60 * brk} width={w} height={420} fill="#E9E4DA" /></> : <rect x={540 + i * 76 - w / 2} y={100} width={w} height={900} fill="#E9E4DA" stroke="rgba(0,0,0,0.08)" />}</g>; })}
            {Array.from({ length: 12 }, (_, i) => { const h = 34 * (1 - 0.7 * thin * (0.6 + 0.4 * rnd(i + 20))); return <rect key={`h${i}`} x={500} y={130 + i * 76 - h / 2} width={920} height={h} fill={sheetCol(0.3 + 0.6 * bl)} opacity={0.85} stroke="rgba(0,0,0,0.06)" />; })}
            <rect x={500} y={100} width={920} height={900} fill={`rgba(230,210,140,${0.25 * thin})`} />
          </g>
          <circle cx={960} cy={540} r={430} fill="none" stroke="#8D939B" strokeWidth={26} />
          <rect x={1260} y={850} width={70} height={260} rx={30} transform="rotate(-40 1295 980)" fill="#3B3F45" />
        </svg>
        <Tag x={1450} y={300} text="blanquea por arriba" k={bl * 2} />
        <Tag x={1450} y={420} text="se come el algodón" k={thin * 2} color={CL.red} />
        <Tag x={1450} y={540} text="dura la mitad" k={brk * 2} color={CL.navy} />
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
      <Hand2D seed={404} push={[1.0, 1.1]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M520 420 Q760 380 1000 430 Q1180 470 1360 440 L1420 760 Q1180 800 960 760 Q720 720 480 780 Z" fill={GRAY} stroke={GRAYD} strokeWidth={3} />
          {f < 20 ? <path d={`M960 ${dropY - 40} C 990 ${dropY - 5}, 990 ${dropY + 20}, 960 ${dropY + 26} C 930 ${dropY + 20}, 930 ${dropY - 5}, 960 ${dropY - 40} Z`} fill="#9FD0F0" /> : <ellipse cx={960} cy={560} rx={110 * lin(f, 18, 24)} ry={40 * lin(f, 18, 24)} fill="rgba(120,130,140,0.35)" />}
          {/* manos (guantes no: manos desnudas con agua de la llave) */}
          {rub > 0 ? <g opacity={lin(f, 18, 24)}>
            <g transform={`translate(${900 + dx} 500)`}><path d="M-480 -60 Q-320 -120 -60 -70 Q40 -50 60 -10 Q60 30 0 34 L-480 40 Z" fill="#D9A47E" stroke="#A8724D" strokeWidth={4} /><path d="M-30 -52 Q30 -46 44 -14 Q20 8 -24 0 Z" fill="#F1D5C2" stroke="#C99A7B" strokeWidth={2} /><path d="M-200 -86 q 10 30 0 60" stroke="#B9835C" strokeWidth={3} fill="none" /></g>
            <g transform={`translate(${1020 - dx} 620) scale(-1 -1)`}><path d="M-480 -60 Q-320 -110 -60 -66 Q40 -48 60 -10 Q60 30 0 34 L-480 40 Z" fill="#D59D77" stroke="#A8724D" strokeWidth={4} /><path d="M-30 -48 Q30 -44 44 -14 Q20 8 -24 0 Z" fill="#F1D5C2" stroke="#C99A7B" strokeWidth={2} /></g>
          </g> : null}
          {Array.from({ length: 40 }, (_, i) => { const a = rnd(i) * Math.PI * 2, r = 60 + rnd(i + 5) * 260; return <circle key={i} cx={960 + Math.cos(a) * r} cy={520 + Math.sin(a) * r * 0.45 - 40 * foam * rnd(i + 3)} r={(8 + rnd(i + 2) * 22) * foam} fill="rgba(255,255,255,0.95)" stroke="rgba(180,200,215,0.7)" strokeWidth={2} />; })}
        </svg>
        <Tag x={300} y={900} text="agua bien caliente · sin jabón" k={lin(f, 4, 14)} />
        <Tag x={1160} y={900} text="espuma = jabón viejo" k={lin(f, T * 0.62, T * 0.72)} color={CL.red} />
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
    ["guantes", () => <g><path d="M-70 0 L-70 -120 Q-70 -170 -40 -170 L-40 -220 Q-30 -240 -20 -220 L-20 -170 L0 -230 Q10 -245 20 -230 L20 -170 L40 -220 Q50 -235 60 -220 L60 -100 Q70 0 40 0 Z" fill="#4C7BD9" stroke="#2C55A8" strokeWidth={3} /></g>],
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={405} dim={0.35} />
      <Hand2D seed={405}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, height: 380, background: "linear-gradient(180deg, #E8E2D4, #C9BFA9)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {items.map(([, draw], i) => { const p = pop(f, fps, 4 + i * Math.round(T * 0.1), 11); const x = 220 + i * 296; return <g key={i} opacity={clamp01(p * 3)} transform={`translate(${x} ${760 - (1 - p) * 700})`}><ellipse cx={0} cy={6} rx={110} ry={16} fill="rgba(0,0,0,0.2)" />{draw(p)}</g>; })}
        </svg>
        {items.map(([t], i) => <div key={i} style={{ position: "absolute", left: 220 + i * 296, top: 800, translate: "-50% 0", fontFamily: HAND, fontSize: 44, color: CL.ink, whiteSpace: "nowrap", opacity: lin(f, 12 + i * Math.round(T * 0.1), 20 + i * Math.round(T * 0.1)) }}>{t}</div>)}
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
          <line x1={1230} x2={1370} y1={840 - 640 * (lim / 70)} y2={840 - 640 * (lim / 70)} stroke={CL.navy} strokeWidth={6} strokeDasharray="14 8" />
          <text x={1390} y={850 - 640 * (lim / 70)} fontFamily="Georgia" fontWeight={900} fontSize={60} fill={CL.navy}>{Math.round(temp)}°</text>
        </svg>
        <Tag x={1100} y={980} text="la etiqueta manda" k={lin(f, T * 0.8, T * 0.9)} />
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
          <text x={1150} y={880 - 520 * 0.62 + 14} fontFamily="Arial" fontWeight={700} fontSize={40} fill={CL.red}>10 L</text>
          {/* paleta */}
          {stir > 0 ? <rect x={830 + Math.sin(f / 5) * 80} y={160} width={26} height={600} rx={10} fill="#C8955B" stroke="#8C6234" strokeWidth={3} transform={`rotate(${Math.sin(f / 5) * 8} 840 600)`} /> : null}
          {/* chorro del frasco */}
          {cups >= 0 && f > T * 0.32 && f < T * 0.56 ? <path d={`M760 120 Q780 220 800 ${top}`} stroke="rgba(230,240,245,0.9)" strokeWidth={14} fill="none" /> : null}
          {soda > 0 && soda < 1 ? Array.from({ length: 30 }, (_, i) => <circle key={i} cx={900 + rnd(i) * 60} cy={120 + ((f * 18 + i * 30) % (top - 120))} r={4} fill="#FFFFFF" />) : null}
        </svg>
        <div style={{ position: "absolute", left: 1260, top: 300, fontFamily: SERIF, fontWeight: 900, color: CL.navy, lineHeight: 1.1 }}>
          <div style={{ fontSize: 80, opacity: lin(f, 4, 14) }}>10 L bien caliente</div>
          <div style={{ fontSize: 80, opacity: lin(f, T * 0.32, T * 0.4), color: BROWNL }}>+ {Math.max(1, cups)} {cups >= 1 ? "tazas" : "taza"} <span style={{ fontFamily: HAND, fontWeight: 400, fontSize: 52 }}>agua oxig. 3 %</span></div>
          <div style={{ fontSize: 80, opacity: lin(f, T * 0.6, T * 0.68) }}>+ ½ taza <span style={{ fontFamily: HAND, fontWeight: 400, fontSize: 52 }}>bicarbonato</span></div>
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
          <circle cx={820} cy={560} r={470} fill="#4F78A8" />
          <circle cx={820} cy={560} r={440} fill={`rgb(${170 - 50 * k},${200 - 70 * k},${225 - 95 * k})`} />
          {/* la sábana hundida: pliegues */}
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${480 + i * 20} ${360 + i * 60} Q${820 + Math.sin(f / 30 + i) * 60} ${300 + i * 70} ${1160 - i * 20} ${380 + i * 60}`} stroke={sheetCol(0.25 + 0.5 * k)} strokeWidth={46} fill="none" opacity={0.85} transform={`rotate(${turns * 90 * ease(clamp01(((k * 5) % 1) * 4))} 820 560)`} />)}
          {Array.from({ length: 60 }, (_, i) => { const per = 40 + rnd(i) * 30; const t = ((f + rnd(i + 1) * per) % per) / per; const a = rnd(i + 2) * Math.PI * 2, r = rnd(i + 3) * 400; return <circle key={i} cx={820 + Math.cos(a) * r} cy={560 + Math.sin(a) * r} r={2 + 5 * t} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} opacity={1 - t} />; })}
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
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={409} dim={0.4} />
      <Hand2D seed={409}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((side) => { const x = side ? 1260 : 520; const L = side ? 1 : 0.5; const shown = side ? over : 1; return <g key={side} opacity={side ? lin(f, T * 0.45, T * 0.52) : 1}>
            <path d={`M${x - 170} 360 L${x - 130} 760 L${x + 130} 760 L${x + 170} 360 Z`} fill="rgba(255,255,255,0.6)" stroke="#5B7FB0" strokeWidth={8} />
            <rect x={x - 140} y={760 - 380 * L * (side ? shown : lvl)} width={280} height={380 * L * (side ? shown : lvl)} fill="rgba(226,160,60,0.8)" />
            <line x1={x - 160} x2={x + 160} y1={760 - 190} y2={760 - 190} stroke={CL.navy} strokeWidth={5} strokeDasharray="12 8" />
          </g>; })}
          {/* tela con jabón pegado (gris) bajo el vaso lleno */}
          <rect x={1060} y={820} width={400} height={140} rx={10} fill={sheetCol(1 - 0.8 * over)} />
          {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={1080 + rnd(i) * 360} cy={840 + rnd(i + 4) * 100} r={10 * over} fill="rgba(140,135,125,0.6)" />)}
        </svg>
        <Tag x={330} y={880} text="la mitad · ni una gota más" k={lin(f, T * 0.3, T * 0.4)} />
        <div style={{ position: "absolute", left: 1460, top: 860, opacity: lin(f, T * 0.65, T * 0.75) }}><Tick ok={false} s={110} k={lin(f, T * 0.7, T * 0.8)} /></div>
        <Tag x={1100} y={880} text="lo que sobra queda en la tela" k={lin(f, T * 0.6, T * 0.7)} color={CL.red} />
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
        <Tag x={340} y={960} text="hasta arriba: no se mueve" k={lin(f, 10, 20)} color={CL.red} />
        <Tag x={1110} y={960} text="máquina de 40 kg: se carga con 30" k={lin(f, T * 0.45, T * 0.55)} />
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
          <circle cx={300 + 300 * k} cy={420 - 300 * k} r={90} fill="#FFE59A" />
          {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + f / 60; return <line key={i} x1={300 + 300 * k + Math.cos(a) * 110} y1={420 - 300 * k + Math.sin(a) * 110} x2={300 + 300 * k + Math.cos(a) * 150} y2={420 - 300 * k + Math.sin(a) * 150} stroke="#FFE59A" strokeWidth={8} strokeLinecap="round" opacity={0.4 + 0.6 * k} />; })}
          <path d="M80 300 Q960 360 1840 300" stroke="#6B5A44" strokeWidth={5} fill="none" />
          <Sheet x={420} y={326} w={520} h={560} col={sheetCol(0.15 + 0.85 * k)} f={f} seed={5} />
          <Sheet x={1000} y={330} w={520} h={560} col={sheetCol(0.1 + 0.9 * k)} f={f} seed={8} />
          {Array.from({ length: 6 }, (_, i) => { const t = ((f + i * 20) % 120) / 120; return <path key={i} d={`M${1550 + t * 300} ${420 + i * 60} q 40 -20 80 0 t 80 0`} stroke="rgba(255,255,255,0.8)" strokeWidth={5} fill="none" opacity={1 - t} />; })}
        </svg>
        <Tag x={1200} y={980} text="al sol de la mañana, estiradas" k={lin(f, 8, 18)} />
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
          {[0, 1].map((i) => <g key={i}><rect x={540 + i * 450} y={150} width={390} height={200} rx={60} fill={WHITE} stroke="#DCD7CC" strokeWidth={4} /><ellipse cx={735 + i * 450} cy={250} rx={140} ry={60} fill={hexA("#E6C25A", 0.6 * y1)} /></g>)}
          <rect x={490} y={420} width={940} height={120} fill="#F6F4EE" stroke="#E0DCD2" strokeWidth={3} />
          <rect x={490} y={420} width={940} height={120} fill={hexA("#E6C25A", 0.45 * y2)} />
        </svg>
        <Tag x={1500} y={250} text="cara, pelo, cremas" k={y1 * 2} />
        <Tag x={1500} y={480} text="el borde del cuello" k={y2 * 2} />
        <Tag x={1500} y={700} text="+ 1 hora de remojo" k={lin(f, T * 0.6, T * 0.7)} color={CL.brass} />
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
      <Hand2D seed={413}>
        <svg width={1920} height={200} style={{ position: "absolute", left: 0, top: 120 }}><path d="M40 40 Q960 110 1880 40" stroke="#6B5A44" strokeWidth={5} fill="none" /></svg>
        {E.map((e, i) => {
          const p = pop(f, fps, 2 + i * 4, 11);
          const flip = i + 1 === hi ? ease(lin(f, 14, 28)) : 1;
          const sw = Math.sin(f / 10 + i) * 3;
          const x = 140 + i * 340, y = 170 + Math.sin((i / 4) * Math.PI) * 36;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 300, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 30}deg`, opacity: (i + 1 === hi ? 1 : 0.45) * p, scale: i + 1 === hi ? "1.06" : "0.92", zIndex: i + 1 === hi ? 2 : 1 }}>
            <div style={{ position: "absolute", left: 140, top: -16, width: 20, height: 50, borderRadius: 4, background: "#C9A06A", zIndex: 2 }} />
            <div style={{ transform: `perspective(1200px) rotateY(${flip * 180}deg)` }}>
              {flip < 0.5 ? <div style={{ height: 420, background: sheetCol(0.3), borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: "#8D887D" }}>{i + 1}</div>
                : <div style={{ transform: "scaleX(-1)", height: 420, background: WHITE, borderRadius: 6, border: `6px solid ${CL.red}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: CL.red, lineHeight: 1 }}>{i + 1}</div>
                  <div style={{ fontFamily: LABEL, fontSize: 44, color: CL.ink, lineHeight: 1.15, marginTop: 14 }}>{e}</div>
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
        <div style={{ position: "absolute", left: 240, top: 80, rotate: `${-2 + (1 - p) * -8}deg`, translate: `0 ${(1 - p) * 900}px` }}>
          <div style={{ width: 980, height: 900, background: "#FFFDF6", borderRadius: 10, boxShadow: `0 40px 80px ${CL.shadow}`, padding: "90px 60px 40px", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 129px, #E3DCCF 129px 131px)", backgroundPosition: "0 170px" }}>
            <div style={{ fontFamily: LABEL, fontSize: 36, letterSpacing: 4, color: CL.inkSoft, marginBottom: 24 }}>LAVANDERÍA · SÓTANO · ROSA</div>
            {S.map(([t, m], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 130, opacity: 0.35 + 0.65 * step(i) }}>
                <div style={{ width: 56, height: 56, border: `5px solid ${CL.navy}`, borderRadius: 8, position: "relative" }}>{step(i) > 0.1 ? <div style={{ position: "absolute", left: -6, top: -18 }}><Tick ok s={64} k={step(i)} /></div> : null}</div>
                <div style={{ flex: 1, fontFamily: HAND, fontSize: 52, color: CL.ink }}>{t}</div>
                <div style={{ fontFamily: LABEL, fontSize: 40, color: CL.navy }}>{m === 0 ? "sol" : m >= 60 ? `${m / 60} h` : `${m} min`}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 1330, top: 360, opacity: p }}>
          <div style={{ fontFamily: LABEL, fontSize: 36, color: CL.inkSoft, letterSpacing: 3 }}>TOTAL</div>
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
          return <div key={i} style={{ position: "absolute", left: 160 + i * w, top: 300, width: w - 30, textAlign: "center", opacity: p, translate: `0 ${(1 - p) * 120}px` }}>
            <Card style={{ padding: 24, height: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: last ? `6px solid ${CL.brass}` : "none" }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: last ? BROWN : "#DDE3E9", border: `8px solid ${last ? BROWNL : "#AEB6BF"}` }} />
              <div style={{ fontFamily: LABEL, fontSize: 36, color: CL.navy, marginTop: 20 }}>LAVADO {i + 1}</div>
              <div style={{ fontFamily: HAND, fontSize: 44, color: last ? BROWNL : CL.ink }}>{last ? "+ remojo" : "½ jabón"}</div>
            </Card>
          </div>;
        })}
        <Tag x={720} y={820} text={hard ? "agua dura: cada 4" : "no cada vez · cada seis"} k={lin(f, T * 0.6, T * 0.7)} color={hard ? CL.red : CL.navy} />
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
          <Bottle x={1240} y={820} s={1.6} clear />
          {Array.from({ length: 24 }, (_, i) => { const t = ((f + i * 7) % 40) / 40; return <circle key={i} cx={1180 + rnd(i) * 120} cy={760 - t * 260} r={5} fill="none" stroke="rgba(120,160,180,0.9)" strokeWidth={2} opacity={(1 - t) * (1 - k)} />; })}
        </svg>
        <Tag x={460} y={960} text="se guarda en su frasco" k={lin(f, 6, 16)} />
        <div style={{ position: "absolute", left: 1460, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: CL.navy, opacity: lin(f, T * 0.2, T * 0.3) }}>día {day}</div>
        <Tag x={1100} y={960} text="en una semana es agua" k={lin(f, T * 0.8, T * 0.9)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 17 · el dobladillo primero
export const SbHemTest: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const drop = interpolate(f, [6, 20], [140, 690], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t });
  const wait = lin(f, 22, T * 0.4);
  const sp = ease(lin(f, T * 0.45, T * 0.72));
  const weave = (x: number, y: number, w: number, h: number) => <g>{Array.from({ length: Math.floor(w / 16) }, (_, i) => <line key={`a${i}`} x1={x + i * 16} x2={x + i * 16} y1={y} y2={y + h} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />)}{Array.from({ length: Math.floor(h / 16) }, (_, i) => <line key={`b${i}`} x1={x} x2={x + w} y1={y + i * 16} y2={y + i * 16} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />)}</g>;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={417} dim={0.35} />
      <Hand2D seed={417}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="sbHemA"><rect x={140} y={220} width={760} height={600} rx={20} /></clipPath><clipPath id="sbHemB"><rect x={1020} y={220} width={760} height={600} rx={20} /></clipPath></defs>
          {/* izquierda: la esquina del dobladillo, de cerca */}
          <g clipPath="url(#sbHemA)">
            <rect x={140} y={220} width={760} height={600} fill={SKY} />
            {weave(140, 220, 760, 600)}
            <rect x={140} y={640} width={760} height={180} fill="#AECDE7" />
            <line x1={150} x2={890} y1={668} y2={668} stroke="#6F98BD" strokeWidth={5} strokeDasharray="22 12" />
            <path d="M140 640 L900 640" stroke="#8DB4D3" strokeWidth={6} />
            <circle cx={520} cy={730} r={64 * wait} fill="#C7DDEE" opacity={0.95} />
          </g>
          <rect x={140} y={220} width={760} height={600} rx={20} fill="none" stroke="#7FA6C8" strokeWidth={6} />
          {f < 22 ? <path d={`M520 ${drop - 34} C 548 ${drop - 4}, 548 ${drop + 18}, 520 ${drop + 24} C 492 ${drop + 18}, 492 ${drop - 4}, 520 ${drop - 34} Z`} fill={BROWN} /> : null}
          <g transform="translate(520 150)" opacity={1 - lin(f, 18, 26)}><rect x={-30} y={-90} width={60} height={80} rx={10} fill="#3B200D" /><path d="M-10 -10 L10 -10 L4 40 L-4 40 Z" fill="rgba(220,235,240,0.85)" stroke="#9FB3BD" strokeWidth={2} /></g>
          <circle cx={520} cy={730} r={86} fill="none" stroke={CL.navy} strokeWidth={6} strokeDasharray="14 10" opacity={lin(f, 22, 30)} />
          {/* derecha: la sábana celeste que entró sin probar */}
          <g opacity={lin(f, T * 0.4, T * 0.5)}>
            <g clipPath="url(#sbHemB)">
              <rect x={1020} y={220} width={760} height={600} fill={SKY} />
              {weave(1020, 220, 760, 600)}
              {Array.from({ length: 14 }, (_, i) => { const cx = 1080 + rnd(i) * 640, cy = 270 + rnd(i + 9) * 500; return <ellipse key={i} cx={cx} cy={cy} rx={(30 + rnd(i + 3) * 60) * sp} ry={(22 + rnd(i + 4) * 40) * sp} fill="#E8F2FA" opacity={0.95} transform={`rotate(${rnd(i + 6) * 60} ${cx} ${cy})`} />; })}
            </g>
            <rect x={1020} y={220} width={760} height={600} rx={20} fill="none" stroke="#7FA6C8" strokeWidth={6} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 790, top: 250, opacity: lin(f, T * 0.3, T * 0.38) }}><Tick ok s={110} k={lin(f, T * 0.3, T * 0.42)} /></div>
        <div style={{ position: "absolute", left: 1660, top: 250, opacity: lin(f, T * 0.62, T * 0.7) }}><Tick ok={false} s={120} k={lin(f, T * 0.62, T * 0.74)} /></div>
        <Tag x={250} y={890} text="primero, el dobladillo de adentro" k={lin(f, 12, 22)} />
        <Tag x={1150} y={890} text="sin probar: manchas claras" k={sp * 2} color={CL.red} />
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
          <g opacity={pop(f, fps, 12, 12) * (1 - 0.5 * lin(f, T * 0.6, T * 0.7))}><rect x={1180} y={420} width={220} height={440} rx={20} fill="#E7E2F2" stroke="#8D82B5" strokeWidth={5} /><rect x={1240} y={360} width={100} height={70} rx={10} fill="#5B4E8C" /></g>
        </svg>
        <div style={{ position: "absolute", left: 500, top: 560, width: 240, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.navy, opacity: lin(f, 10, 20) }}>3 %<div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30 }}>10 VOLÚMENES</div></div>
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
                <g opacity={L(0)}><Bottle x={x - 110} y={y + 232} s={0.55} /></g>
                <g opacity={L(1)} transform={`translate(${x + 10} ${y + 232})`}><rect x={-50} y={-120} width={100} height={120} rx={6} fill="#F2EFE8" stroke="#BDB5A6" strokeWidth={3} /><rect x={-50} y={-90} width={100} height={30} fill="#E7A33E" /></g>
                <g opacity={L(2)} transform={`translate(${x + 120} ${y + 232})`}><path d="M-34 0 L-30 -110 L30 -110 L34 0 Z" fill="rgba(226,160,60,0.3)" stroke="#B9862E" strokeWidth={3} /><rect x={-31} y={-55} width={62} height={55} fill="rgba(226,160,60,0.85)" /></g>
              </g> : <g opacity={L(3)} transform={`translate(${x} ${y + 228})`}>
                <path d="M-160 -130 Q-170 -30 -160 0 L160 0 Q170 -30 160 -130 Q0 -150 -160 -130 Z" fill={WHITE} stroke="#CFC9BC" strokeWidth={4} />
                <path d="M-160 -130 Q-128 -108 -160 -86 M160 -130 Q128 -108 160 -86" stroke="#CFC9BC" strokeWidth={3} fill="none" />
                <g transform="translate(130 -140) rotate(20)"><rect x={-42} y={-24} width={84} height={48} rx={8} fill={CL.yellow} stroke="#B9961E" strokeWidth={3} /><circle cx={-28} cy={0} r={6} fill="#fff" /></g>
              </g>}
            </g>;
          })}
        </svg>
        <Tag x={250} y={980} text="frasco + bicarbonato + ½ jabón" k={lin(f, 20, 30)} />
        <Tag x={1260} y={980} text="1 funda nueva" k={lin(f, 30, 40)} color={CL.red} />
        <Stamp text="alcanza para meses" at={Math.round(T * 0.68)} x="50%" y="14%" size={56} rot={-4} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 20 · el tanque de sal del hotel = ½ taza
export const SbSaltTank: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  // el tanque enorme del sótano  =  la media taza en el balde
  const p1 = pop(f, fps, 2, 14), eq = pop(f, fps, Math.round(T * 0.35), 12), p2 = pop(f, fps, Math.round(T * 0.45), 12);
  const pour = ease(lin(f, T * 0.55, T * 0.75));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={420} dim={0.4} />
      <Hand2D seed={420}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(520 880) scale(${0.85 + 0.15 * p1})`} opacity={clamp01(p1 * 2)}>
            <ellipse cx={0} cy={6} rx={300} ry={30} fill="rgba(0,0,0,0.22)" />
            <rect x={-250} y={-700} width={500} height={700} rx={50} fill="#5E7DA6" stroke="#3C5A82" strokeWidth={8} />
            <rect x={-220} y={-690} width={60} height={680} rx={30} fill="rgba(255,255,255,0.14)" />
            <ellipse cx={0} cy={-700} rx={250} ry={56} fill="#7894BA" stroke="#3C5A82" strokeWidth={6} />
            <path d="M250 -560 L330 -560 L330 -120 L250 -120" fill="none" stroke="#8E969F" strokeWidth={18} />
            <rect x={-170} y={-520} width={340} height={150} rx={12} fill="#EEF1F4" />
            <text x={0} y={-422} textAnchor="middle" fontFamily="Arial" fontWeight={900} fontSize={88} fill="#3C5A82">SAL</text>
            {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-200 + (i % 7) * 58} y={-250 + Math.floor(i / 7) * 60} width={40} height={40} rx={6} fill="#F4F6F8" opacity={0.7} />)}
          </g>
          <g opacity={eq}><rect x={890} y={480} width={140} height={22} rx={10} fill={CL.navy} /><rect x={890} y={540} width={140} height={22} rx={10} fill={CL.navy} /></g>
          <g opacity={clamp01(p2 * 2)} transform={`translate(1430 ${880 + (1 - p2) * 120})`}>
            <ellipse cx={0} cy={6} rx={230} ry={24} fill="rgba(0,0,0,0.2)" />
            <path d="M-210 -360 L-170 0 L170 0 L210 -360 Z" fill="#7FA7D6" stroke="#4F78A8" strokeWidth={6} />
            <path d="M-190 -320 L-158 -20 L158 -20 L190 -320 Z" fill="rgba(200,225,245,0.85)" />
            <path d="M-200 -360 Q0 -500 200 -360" fill="none" stroke="#555" strokeWidth={8} />
            <g transform={`translate(-30 -440) rotate(${75 * pour})`}><path d="M-70 -60 L-60 40 L60 40 L70 -60 Z" fill="#FFFFFF" stroke="#BDB5A6" strokeWidth={5} /><path d="M70 -40 Q120 -30 110 10 Q100 30 60 24" fill="none" stroke="#FFFFFF" strokeWidth={14} /><rect x={-60} y={-14} width={120} height={52} fill="#EDE9DF" opacity={1 - pour} /></g>
            {pour > 0.3 && pour < 0.98 ? Array.from({ length: 30 }, (_, i) => { const t = ((f + i * 3) % 24) / 24; return <circle key={i} cx={40 + (rnd(i) - 0.5) * 40} cy={-400 + t * 300} r={4} fill="#FFFFFF" opacity={1 - t} />; }) : null}
          </g>
        </svg>
        <Tag x={300} y={960} text="el ablandador del hotel" k={lin(f, 6, 16)} color={CL.inkSoft} />
        <Tag x={1230} y={960} text="½ taza de bicarbonato" k={lin(f, T * 0.6, T * 0.7)} />
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
          {fold("out", 1100 + 700 * take, Y0 - 30 * Math.sin(take * Math.PI), 460, 0.62)}
          {Array.from({ length: 5 }, (_, i) => fold(`r${i}`, 1100, Y0 - (i + 1) * H + H * take, 460, 0.78 + 0.04 * i))}
          <g opacity={clamp01(drop * 3)}>{fold("new", 1100, Y0 - 5 * H - (1 - drop) * 500, 460, 1)}</g>
          {Array.from({ length: 8 }, (_, i) => { const t = ((f + i * 12) % 80) / 80; return <path key={i} d={`M${900 + (i % 2) * 70} ${Y0 - 30 - t * 380} q 18 -22 0 -44 q -18 -22 0 -44`} stroke="rgba(130,175,210,0.85)" strokeWidth={6} fill="none" opacity={air * (1 - t)} />; })}
        </svg>
        <Tag x={640} y={970} text="estantes abiertos · aire entre pilas" k={air} />
        <Tag x={1120} y={300} text="la recién lavada, arriba" k={lin(f, T * 0.6, T * 0.7)} color={CL.brass} />
        <Tag x={1430} y={660} text="use la de abajo" k={lin(f, T * 0.32, T * 0.42)} color={CL.navy} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 22 · repaso en la soga
export const SbRecap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const W = ["llenas, no sucias", "el cloro no", "la gota caliente", "10 L bien caliente", "2 tazas · 3 %", "½ taza bicarbonato", "2 h · vuelta c/30", "½ jabón · doble enjuague", "sin suavizante", "al sol", "cada 6 lavados", "sólo blancos"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={422} dim={0.35} />
      <Hand2D seed={422} push={[1.04, 1.0]}>
        {[0, 1, 2].map((r) => <svg key={r} width={1920} height={80} style={{ position: "absolute", left: 0, top: 70 + r * 330 }}><path d="M40 20 Q960 70 1880 20" stroke="#6B5A44" strokeWidth={4} fill="none" /></svg>)}
        {W.map((w, i) => {
          const r = Math.floor(i / 4), c = i % 4; const t0 = 4 + i * ((T - 30) / W.length);
          const p = pop(f, fps, t0, 10);
          const sw = Math.sin(f / 14 + i) * 2.5;
          return <div key={i} style={{ position: "absolute", left: 130 + c * 430, top: 100 + r * 330 + Math.sin((c / 3) * Math.PI) * 30, width: 380, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 40}deg`, opacity: clamp01(p * 2) }}>
            <div style={{ position: "absolute", left: 180, top: -20, width: 20, height: 50, borderRadius: 4, background: "#C9A06A", zIndex: 2 }} />
            <div style={{ height: 220, background: WHITE, borderRadius: 6, boxShadow: `0 20px 40px ${CL.shadow}`, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: 20 }}>
              <div style={{ fontFamily: LABEL, fontSize: 30, color: CL.brass, letterSpacing: 3 }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: CL.navy, lineHeight: 1.1 }}>{w}</div>
            </div>
          </div>;
        })}
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};
