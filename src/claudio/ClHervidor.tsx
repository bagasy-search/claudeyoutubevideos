// Kit del video cons6nc (las PIEDRITAS BLANCAS del hervidor). Un componente ÚNICO por minuto, ninguno repetido, sin rótulos de esquina.
//   HvSwirlCup     la taza vista desde arriba: el té gira y las escamitas blancas dan vueltas y bajan
//   HvBeforeAfter  el fondo del hervidor visto desde la boca: mitad con piedritas, la cortina de agua lo deja acero brillante
//   HvKettleWall   la pared de la cocina de servicio: 300 hervidores que se encienden de a uno, el contador llega a 300
//   HvTreeRings    corte de la resistencia: la costra crece en capas como anillos de árbol y se agrieta en escamas
//   HvBlanket      la resistencia con la «manta» de piedra: el termómetro de la resistencia sube, el medidor de luz gira más rápido
//   HvGlassTest    tres vasos al sol: el agua baja y deja aro grueso / marquita / nada → muy dura / media / blanda
//   HvSachet       el sobre de ácido cítrico se rasga y los cristales caen con peso en la cuchara sopera: «1 por cada ½ litro»
//   HvUnplug       el enchufe sale de la pared con resorte, la lucecita del hervidor se apaga; la base nunca se moja
//   HvFillGauge    la ventanita del hervidor: el agua sube y frena en MITAD; al hervir la espuma sube y la línea MAX late en rojo
//   HvFizz         macro del fondo durante el reposo: burbujitas salen de la piedra, la costra se achica, el agua se enturbia, arco de 20 min
//   HvThreeBoils   tres tazas de enjuague que van de turbia a clara y se vacían a la pileta
//   HvMeshSoak     la rejilla de malla en el vaso: los puntitos blancos de la trama se disuelven y el agua pasa
//   HvCalendar     tres calendarios de pared: cruces cada 2 semanas / cada mes / cada 3 meses
//   HvAltScale     tres frascos (ácido cítrico, limón, vinagre) con su olor y su precio; abajo el bicarbonato + vinagre = 0
//   HvFiveErrors   cinco hervidores en el estante de la cocina: cada uno se da vuelta y muestra su error
//   HvRoutine      la barra de tiempo de la rutina: 2 + 5 + 20 + 10 min, cada tramo se llena y aparece su dibujo
//   HvGlassKettle  el hervidor de vidrio: durante el reposo la costra del fondo desaparece a la vista
//   HvRecap        repaso: fichas de la cocina de servicio colgadas de un hilo, una por paso
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, RoomLight, Stamp, Card, Tape, lin, pop, useOut } from "./ClParts";
import { Tag, Tick, Hand2D } from "./ClTina";

const STEEL = "#C7CCD2", STEELD = "#8E969F", STEELL = "#EEF1F4", SCALE = "#EDE9DF", SCALED = "#D2CBBB", TEA = "#B5742E", TEAD = "#8A5220";
const CIT = "#F4F1E8";

// hervidor de acero de perfil (SVG en coordenadas locales 0..400 × 0..460)
const KettleSide: React.FC<{ x: number; y: number; s?: number; led?: number; water?: number; foam?: number; glass?: boolean; max?: number; scale?: number }> = ({ x, y, s = 1, led = 0, water = -1, foam = 0, glass = false, max = 0, scale = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={200} cy={452} rx={190} ry={18} fill="rgba(0,0,0,0.22)" />
    {/* base */}
    <rect x={40} y={410} width={320} height={40} rx={14} fill="#2B2F36" />
    <circle cx={310} cy={430} r={7} fill={led > 0 ? `rgba(255,${120 - 60 * led},40,${0.3 + 0.7 * led})` : "#444"} />
    {/* cuerpo */}
    <path d="M70 410 L90 120 Q200 80 310 120 L330 410 Z" fill={glass ? "rgba(220,235,245,0.35)" : "url(#hvSteel)"} stroke={glass ? "rgba(120,140,160,0.8)" : STEELD} strokeWidth={4} />
    {water >= 0 ? <clipPath id={`hvBody${Math.round(x)}`}><path d="M74 406 L93 124 Q200 86 307 124 L326 406 Z" /></clipPath> : null}
    {water >= 0 ? <g clipPath={`url(#hvBody${Math.round(x)})`}>
      <rect x={60} y={406 - 290 * water} width={290} height={300} fill={glass ? "rgba(150,200,230,0.45)" : "rgba(120,170,210,0.55)"} />
      {foam > 0 ? Array.from({ length: 22 }, (_, i) => <circle key={i} cx={90 + (i * 47) % 220 + rnd(i) * 20} cy={406 - 290 * water - 6 - rnd(i + 9) * 30 * foam} r={10 + rnd(i + 3) * 12} fill="rgba(255,255,255,0.9)" />) : null}
      {scale > 0 ? Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={95 + rnd(i * 3) * 210} cy={398 - rnd(i * 5) * 12} rx={12 * scale + 3} ry={5 * scale + 2} fill={SCALE} stroke={SCALED} strokeWidth={1.5} opacity={scale} />) : null}
    </g> : null}
    {/* ventanita con marcas */}
    {!glass ? <g>
      <rect x={110} y={150} width={36} height={250} rx={14} fill="rgba(170,205,230,0.55)" stroke={STEELD} strokeWidth={3} />
      <line x1={104} x2={152} y1={172} y2={172} stroke={max > 0 ? `rgba(220,50,40,${0.5 + 0.5 * max})` : "#555"} strokeWidth={max > 0 ? 6 : 3} />
      <text x={160} y={180} fontFamily="Arial" fontWeight={700} fontSize={22} fill={max > 0 ? CL.red : "#555"}>MAX</text>
      <line x1={104} x2={152} y1={275} y2={275} stroke="#555" strokeWidth={3} strokeDasharray="6 5" />
    </g> : null}
    {/* tapa, asa, pico */}
    <path d="M120 112 Q200 70 280 112 L272 100 Q200 60 128 100 Z" fill="#30343B" />
    <rect x={180} y={64} width={40} height={18} rx={8} fill="#30343B" />
    <path d="M318 140 Q400 160 392 270 Q386 360 334 380" fill="none" stroke="#2B2F36" strokeWidth={30} strokeLinecap="round" />
    <path d="M88 170 L20 120 L10 104 L30 108 L94 150 Z" fill={glass ? "rgba(200,220,235,0.6)" : STEELD} />
  </g>
);
const SteelDefs = () => (
  <defs>
    <linearGradient id="hvSteel" x1="0" x2="1"><stop offset="0" stopColor={STEELD} /><stop offset="0.25" stopColor={STEELL} /><stop offset="0.5" stopColor={STEEL} /><stop offset="0.8" stopColor="#FFFFFF" /><stop offset="1" stopColor={STEELD} /></linearGradient>
  </defs>
);

// ═════════════════════════════ 1 · la taza desde arriba
export const HvSwirlCup: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 16);
  const flakes = Array.from({ length: 34 }, (_, i) => ({ r0: 60 + rnd(i) * 230, a0: rnd(i + 40) * Math.PI * 2, w: 0.04 + rnd(i + 7) * 0.05, sz: 8 + rnd(i + 3) * 18 }));
  const sink = lin(f, T * 0.4, T);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={301} dim={0.4} />
      <Hand2D seed={301} push={[1.0, 1.1]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="hvTea"><stop offset="0" stopColor={TEA} /><stop offset="0.8" stopColor={TEAD} /><stop offset="1" stopColor="#5E3714" /></radialGradient>
            <radialGradient id="hvCup"><stop offset="0.82" stopColor="#FFFFFF" /><stop offset="0.93" stopColor="#E7E2D8" /><stop offset="1" stopColor="#BDB6A8" /></radialGradient>
          </defs>
          <ellipse cx={980} cy={590} rx={470} ry={450} fill="rgba(0,0,0,0.25)" />
          <path d="M1380 470 Q1560 470 1560 560 Q1560 660 1380 650" fill="none" stroke="#F4F1EA" strokeWidth={56} />
          <circle cx={960} cy={540} r={440 * (0.9 + 0.1 * p)} fill="url(#hvCup)" />
          <circle cx={960} cy={540} r={370 * (0.9 + 0.1 * p)} fill="url(#hvTea)" />
          {/* reflejo de la ventana que gira con el té */}
          <ellipse cx={960 + Math.cos(f / 22) * 120} cy={540 + Math.sin(f / 22) * 120} rx={90} ry={34} fill="rgba(255,255,255,0.18)" transform={`rotate(${f * 2.6} ${960 + Math.cos(f / 22) * 120} ${540 + Math.sin(f / 22) * 120})`} />
          {flakes.map((k, i) => {
            const a = k.a0 + f * k.w; const r = k.r0 * (1 - 0.35 * sink * rnd(i + 2));
            return <ellipse key={i} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} rx={k.sz} ry={k.sz * 0.55} transform={`rotate(${(a * 180) / Math.PI} ${960 + Math.cos(a) * r} ${540 + Math.sin(a) * r})`} fill={SCALE} opacity={0.85 - 0.3 * sink * rnd(i)} stroke={SCALED} strokeWidth={1.5} />;
          })}
        </svg>
        <Tag x={1460} y={880} text="escamas de piedra" k={lin(f, T * 0.35, T * 0.45)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 2 · así estaba / así quedó (el fondo desde la boca)
export const HvBeforeAfter: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const wipe = ease(clamp01((f - T * 0.45) / (T * 0.3)));
  const cx = 960, cy = 560, R = 430;
  const stones = Array.from({ length: 140 }, (_, i) => { const a = rnd(i) * Math.PI * 2, r = Math.sqrt(rnd(i + 99)) * (R - 30); return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, s: 6 + rnd(i + 5) * 22, rot: rnd(i + 3) * 180 }; });
  const edge = cx - R + 2 * R * wipe;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={302} dim={0.5} />
      <Hand2D seed={302} push={[1.04, 1.0]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="hvFloor"><stop offset="0" stopColor="#F4F6F8" /><stop offset="0.6" stopColor={STEEL} /><stop offset="1" stopColor="#6F767E" /></radialGradient>
            <clipPath id="hvDirty"><rect x={edge} y={0} width={1920} height={1080} /></clipPath>
          </defs>
          <circle cx={cx} cy={cy} r={R + 70} fill="#3A3F46" />
          <circle cx={cx} cy={cy} r={R} fill="url(#hvFloor)" />
          {/* resistencia escondida: disco con remache central */}
          <circle cx={cx} cy={cy} r={60} fill="none" stroke="#9AA2AA" strokeWidth={6} />
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1={cx - R * 0.85} x2={cx + R * 0.85} y1={cy - 200 + i * 50} y2={cy - 200 + i * 50} stroke="rgba(255,255,255,0.12)" strokeWidth={3} />)}
          <g clipPath="url(#hvDirty)">
            <circle cx={cx} cy={cy} r={R} fill={hexA(SCALE, 0.75)} />
            {stones.map((s, i) => <ellipse key={i} cx={s.x} cy={s.y} rx={s.s} ry={s.s * 0.7} transform={`rotate(${s.rot} ${s.x} ${s.y})`} fill={i % 3 ? SCALE : "#F7F4EC"} stroke={SCALED} strokeWidth={2} />)}
          </g>
          {wipe > 0 && wipe < 1 ? <rect x={edge - 10} y={cy - R} width={20} height={2 * R} fill="rgba(170,210,240,0.55)" /> : null}
        </svg>
        <Tag x={300} y={170} text="así estaba" k={lin(f, 4, 14)} color={CL.inkSoft} />
        <Tag x={1350} y={170} text="así quedó" k={lin(f, T * 0.62, T * 0.72)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 3 · la pared de 300 hervidores
export const HvKettleWall: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const cols = 25, rows = 12, N = cols * rows;
  const lit = interpolate(f, [6, T * 0.8], [0, N], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t });
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, background: "#2A2E35" }}>
      <Bed src={bed} seed={303} dim={0.75} />
      <Hand2D seed={303} push={[1.12, 1.0]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: N }, (_, i) => {
            const c = i % cols, r = Math.floor(i / cols); const ord = Math.floor(rnd(i * 7 + 1) * N * 0.15) + i * 0.85;
            const on = clamp01(lit - ord);
            const x = 110 + c * 69, y = 80 + r * 74;
            return <g key={i} transform={`translate(${x} ${y})`}>
              <rect x={-4} y={56} width={60} height={6} fill="#4A5059" />
              <path d="M8 54 L12 14 Q28 6 44 14 L48 54 Z" fill={on > 0 ? STEEL : "#555B63"} />
              <path d="M46 20 Q60 26 56 46" fill="none" stroke="#30343B" strokeWidth={5} />
              <circle cx={40} cy={50} r={3} fill={on > 0 ? `rgba(255,140,40,${on})` : "#333"} />
              {on > 0 ? <circle cx={28} cy={32} r={34} fill={`rgba(255,200,120,${0.10 * on})`} /> : null}
            </g>;
          })}
        </svg>
        <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", fontFamily: SERIF, fontWeight: 900, fontSize: 240, color: "#fff", textShadow: "0 10px 40px rgba(0,0,0,0.7)", fontVariantNumeric: "tabular-nums", opacity: lin(f, 10, 20) }}>{Math.round(lit)}</div>
        <div style={{ position: "absolute", left: "50%", top: "66%", translate: "-50% 0", fontFamily: HAND, fontSize: 70, color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,0.7)", opacity: lin(f, T * 0.78, T * 0.88), whiteSpace: "nowrap" }}>hervidores, uno por habitación</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 4 · anillos de árbol en la resistencia
export const HvTreeRings: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const n = Math.floor(lin(f, 6, T * 0.65, 0, 9));
  const crack = lin(f, T * 0.68, T * 0.8);
  const fall = lin(f, T * 0.78, T);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={304} dim={0.5} />
      <Hand2D seed={304} push={[1.0, 1.08]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={820} cy={540} r={420} fill="rgba(0,0,0,0.18)" />
          {Array.from({ length: n + 1 }, (_, k) => n - k).map((k) => {
            const r = 150 + k * 28; const born = clamp01(lin(f, 6 + k * ((T * 0.65 - 6) / 9), 14 + k * ((T * 0.65 - 6) / 9)));
            return <circle key={k} cx={820} cy={540} r={150 + (r - 150) * born} fill={k % 2 ? SCALE : "#F8F5EE"} stroke={SCALED} strokeWidth={3} />;
          })}
          {/* el tubo de la resistencia (cobre) */}
          <circle cx={820} cy={540} r={150} fill="#B9733E" stroke="#7E4A23" strokeWidth={8} />
          <circle cx={820} cy={540} r={70} fill="#5B3A1F" />
          {crack > 0 ? <path d={`M${820 + 150 + 9 * 28} 540 L${820 + 300} ${520} L${820 + 250} 470 L${820 + 330} 420`} stroke="#8D8577" strokeWidth={5} fill="none" strokeDasharray={420} strokeDashoffset={420 * (1 - crack)} /> : null}
          {fall > 0 ? Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={1120 + i * 40 + fall * 60 * rnd(i)} cy={430 + i * 20 + fall * fall * 520} rx={30 - i * 2} ry={13} fill={SCALE} stroke={SCALED} strokeWidth={2} transform={`rotate(${fall * 200 * (i % 2 ? 1 : -1)} ${1120 + i * 40} ${430 + i * 20 + fall * fall * 520})`} />) : null}
        </svg>
        <div style={{ position: "absolute", left: 1350, top: 220, fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: CL.navy, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{n}<span style={{ fontFamily: HAND, fontWeight: 400, fontSize: 64, display: "block", color: CL.ink }}>{n === 1 ? "hervor" : "hervores"} · {n} capas</span></div>
        <Tag x={1350} y={900} text="se sueltan las escamas" k={fall * 3} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 5 · la manta de piedra (aislante) + el medidor de luz
export const HvBlanket: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const cover = ease(clamp01((f - 10) / 24));
  const hot = lin(f, T * 0.35, T * 0.8);
  const disc = f * (4 + 10 * hot);
  const kwh = 0.11 + 0.07 * hot;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={305} dim={0.5} />
      <Hand2D seed={305}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* agua arriba */}
          <rect x={160} y={180} width={1000} height={520} rx={30} fill="rgba(130,180,220,0.45)" />
          {/* resistencia en espiral */}
          <path d="M220 620 Q300 560 380 620 T540 620 T700 620 T860 620 T1020 620 T1100 620" fill="none" stroke={`rgb(${185 + 70 * hot},${115 - 40 * hot},${62 - 30 * hot})`} strokeWidth={34} strokeLinecap="round" />
          {/* manta de piedra */}
          <path d={`M200 ${620 - 70 * cover} Q300 ${540 - 70 * cover} 390 ${600 - 60 * cover} T560 ${600 - 60 * cover} T720 ${600 - 60 * cover} T880 ${600 - 60 * cover} T1120 ${600 - 70 * cover} L1120 690 L200 690 Z`} fill={SCALE} stroke={SCALED} strokeWidth={4} opacity={cover} />
          {/* flechas de calor que no pasan */}
          {Array.from({ length: 5 }, (_, i) => { const y = 520 - ((f * 3 + i * 40) % 160) * (1 - 0.7 * cover); return <path key={i} d={`M${300 + i * 180} ${y} q 14 -20 0 -40 q -14 -20 0 -40`} fill="none" stroke={hexA("#E0592A", 0.7 * (1 - cover * 0.7))} strokeWidth={8} strokeLinecap="round" />; })}
          {/* medidor de luz de disco */}
          <g transform="translate(1420 300)">
            <rect x={-170} y={-200} width={340} height={470} rx={30} fill="#E8E4DA" stroke="#9B958A" strokeWidth={4} />
            <rect x={-130} y={-150} width={260} height={70} rx={8} fill="#22262C" />
            <text x={0} y={-102} textAnchor="middle" fontFamily="Courier New" fontWeight={700} fontSize={46} fill="#9FE39A">{kwh.toFixed(2)} kWh</text>
            <ellipse cx={0} cy={60} rx={130} ry={34} fill="#B7B1A5" />
            <ellipse cx={0} cy={56} rx={126} ry={30} fill="#D9D4C8" stroke="#8E887C" strokeWidth={3} />
            <rect x={-12 + Math.sin((disc * Math.PI) / 180) * 110} y={34} width={24} height={44} rx={4} fill={CL.red} opacity={0.4 + 0.6 * Math.abs(Math.cos((disc * Math.PI) / 180))} />
          </g>
        </svg>
        <Tag x={160} y={120} text="la piedra es una manta" k={cover * 2} />
        <Tag x={1290} y={880} text="más luz por hervor" k={lin(f, T * 0.55, T * 0.65)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 6 · la prueba del vaso
export const HvGlassTest: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const dry = ease(lin(f, 10, T * 0.55));
  const L = [["muy dura", 1, CL.red], ["media", 0.45, CL.brass], ["blanda", 0.08, "#2F8F48"]] as const;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={306} dim={0.35} />
      <Hand2D seed={306}>
        {/* sol de ventana */}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 0%, rgba(255,230,170,${0.35 + 0.15 * Math.sin(f / 30)}), rgba(255,230,170,0) 60%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 320, background: "linear-gradient(180deg, #7A5A3C, #5C4128)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {L.map(([, thick], i) => {
            const x = 380 + i * 580, p = pop(f, fps, i * 5, 13);
            const lvl = 170 * (1 - dry);
            return <g key={i} transform={`translate(${x} ${770 - (1 - p) * 300})`} opacity={p}>
              <ellipse cx={0} cy={6} rx={170} ry={26} fill="rgba(0,0,0,0.18)" />
              <path d="M-150 -420 L-128 0 L128 0 L150 -420" fill="rgba(235,245,250,0.35)" stroke="rgba(160,180,190,0.9)" strokeWidth={5} />
              <rect x={-130} y={-lvl - 4} width={260} height={lvl} fill="rgba(160,205,230,0.55)" />
              {/* aro que deja */}
              <ellipse cx={0} cy={-6} rx={128} ry={20} fill="none" stroke="#F6F3EA" strokeWidth={4 + 22 * thick * dry} opacity={0.2 + 0.8 * dry} />
              {thick > 0.5 ? Array.from({ length: 10 }, (_, k) => <circle key={k} cx={-120 + k * 26} cy={-6 + (k % 2 ? 4 : -4)} r={5 * dry} fill="#FFFFFF" />) : null}
            </g>;
          })}
        </svg>
        {L.map(([t, , c], i) => <Tag key={i} x={380 + i * 580 - 120} y={250} text={t} color={c} k={lin(f, T * 0.6 + i * 8, T * 0.6 + i * 8 + 10)} />)}
        <div style={{ position: "absolute", left: 1500, top: 90, fontFamily: HAND, fontSize: 64, color: CL.ink, opacity: lin(f, 4, 14) }}>{dry < 0.98 ? (f < T * 0.3 ? "1 día" : "2 días") : "seco"}</div>
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 7 · el sobre de ácido cítrico
export const HvSachet: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 14);
  const tear = ease(lin(f, 12, 24));
  const tilt = ease(lin(f, 22, 40)) * 58;
  const pourK = lin(f, 34, T * 0.75);
  const heap = ease(pourK);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={307} dim={0.4} />
      <Hand2D seed={307}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* el sobre */}
          <g transform={`translate(760 ${330 - (1 - p) * 500}) rotate(${tilt})`}>
            <rect x={-150} y={-230} width={300} height={400} rx={12} fill="#FFFFFF" stroke="#C9C2B4" strokeWidth={4} />
            <rect x={-150} y={-80} width={300} height={90} fill={hexA(CL.yellow, 0.8)} />
            <rect x={-110} y={-56} width={220} height={16} rx={8} fill="rgba(0,0,0,0.12)" />
            <rect x={-80} y={-28} width={160} height={12} rx={6} fill="rgba(0,0,0,0.1)" />
            <path d={`M150 -230 L${150 - 120 * tear} -230`} stroke="#FFFFFF" strokeWidth={10} />
            {tear > 0 ? <path d={`M150 -230 L${150 - 120 * tear} ${-230 - 30 * tear}`} stroke="#C9C2B4" strokeWidth={4} fill="#fff" /> : null}
          </g>
          {/* cristales con física */}
          {Array.from({ length: 70 }, (_, i) => {
            const t0 = 34 + rnd(i) * (T * 0.6 - 34); const tt = (f - t0) / fps; if (tt < 0) return null;
            const y = 230 + 0.5 * 2600 * tt * tt; const x = 900 + rnd(i + 3) * 40 + tt * 120;
            const land = 760 - heap * 20;
            if (y > land) return <rect key={i} x={1000 + (rnd(i + 8) - 0.5) * 160 * heap} y={land + rnd(i + 9) * 18} width={7} height={7} fill={CIT} stroke="#D8D2C2" strokeWidth={1} transform={`rotate(${rnd(i) * 90} ${1000} ${land})`} />;
            return <rect key={i} x={x} y={y} width={8} height={8} fill={CIT} stroke="#D8D2C2" strokeWidth={1} transform={`rotate(${f * 9 + i * 40} ${x} ${y})`} />;
          })}
          {/* cuchara sopera */}
          <ellipse cx={1010} cy={800} rx={180} ry={70} fill={STEEL} stroke={STEELD} strokeWidth={5} />
          <path d={`M${1010 - 150 * heap} 790 Q1010 ${790 - 60 * heap} ${1010 + 150 * heap} 790`} fill={CIT} stroke="#D8D2C2" strokeWidth={2} />
          <rect x={1180} y={784} width={560} height={30} rx={15} fill={STEEL} stroke={STEELD} strokeWidth={4} />
        </svg>
        <div style={{ position: "absolute", left: 1230, top: 260, opacity: lin(f, T * 0.55, T * 0.66) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: CL.navy, lineHeight: 1 }}>1 cucharada</div>
          <div style={{ fontFamily: HAND, fontSize: 70, color: CL.ink }}>por cada ½ litro de agua</div>
        </div>
        <Tag x={300} y={900} text="ácido cítrico" k={lin(f, 6, 16)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 8 · desenchufado, no sólo apagado
export const HvUnplug: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const at = Math.round(T * 0.3);
  const pull = pop(f, fps, at, 9);
  const dx = 260 * pull;
  const led = f < at + 4 ? 1 : 0;
  const dry = lin(f, T * 0.6, T * 0.7);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={308} dim={0.4} />
      <Hand2D seed={308}>
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 55%, #E9E2D6 55%)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <SteelDefs />
          <KettleSide x={140} y={330} s={1.3} led={led} />
          {/* cable */}
          <path d={`M640 ${910} C 900 ${980}, ${1150 - dx * 0.5} ${520}, ${1380 - dx} 520`} fill="none" stroke="#1E1F22" strokeWidth={16} />
          {/* tomacorriente */}
          <rect x={1460} y={400} width={200} height={260} rx={22} fill="#FFFFFF" stroke="#BDB5A6" strokeWidth={4} />
          <rect x={1520} y={470} width={14} height={44} rx={5} fill="#333" /><rect x={1586} y={470} width={14} height={44} rx={5} fill="#333" />
          {/* ficha */}
          <g transform={`translate(${1380 - dx} 520) rotate(${-8 * pull + 8 * (1 - pull)})`}>
            <rect x={-10} y={-50} width={110} height={100} rx={18} fill="#2A2C30" />
            <rect x={100} y={-26} width={44} height={12} fill="#C9A24A" /><rect x={100} y={14} width={44} height={12} fill="#C9A24A" />
          </g>
          {/* gota tachada sobre la base */}
          <g transform="translate(470 870)" opacity={dry}>
            <path d="M0 -60 C 30 -20, 40 0, 0 30 C -40 0, -30 -20, 0 -60 Z" fill="#5AA9E6" />
            <path d="M-50 -60 L50 40" stroke={CL.red} strokeWidth={12} strokeLinecap="round" />
          </g>
        </svg>
        <Tag x={1200} y={760} text="desenchufado · frío" k={lin(f, at + 6, at + 16)} />
        <Tag x={1200} y={860} text="apagado no alcanza" k={lin(f, at + 16, at + 26)} color={CL.red} />
        <Tag x={600} y={960} text="la base nunca se moja" k={dry} color={CL.inkSoft} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 9 · hasta la MITAD (y la espuma)
export const HvFillGauge: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const fill = ease(lin(f, 6, T * 0.35)) * 0.45;
  const boil = lin(f, T * 0.5, T * 0.8);
  const foamH = boil * 0.25;
  const maxBlink = boil > 0.2 ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={309} dim={0.4} />
      <Hand2D seed={309} push={[1.0, 1.1]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <SteelDefs />
          <KettleSide x={420} y={90} s={1.95} water={fill + foamH * 0.3} foam={boil} max={maxBlink} glass />
          {/* jarra que vierte */}
          {f < T * 0.4 ? <g transform={`translate(1240 ${150}) rotate(${-40 * ease(lin(f, 0, 10))})`}>
            <path d="M0 0 L180 0 L160 220 L20 220 Z" fill="rgba(210,230,245,0.6)" stroke="#8FA3B5" strokeWidth={4} />
          </g> : null}
          {f < T * 0.36 ? <path d={`M1150 230 Q1060 ${300} 1010 ${560}`} stroke="rgba(130,180,220,0.8)" strokeWidth={18} fill="none" /> : null}
          {/* línea de mitad */}
          <line x1={520} x2={1220} y1={90 + 1.95 * (406 - 290 * 0.45)} y2={90 + 1.95 * (406 - 290 * 0.45)} stroke={CL.navy} strokeWidth={4} strokeDasharray="14 10" opacity={lin(f, T * 0.3, T * 0.38)} />
        </svg>
        <Tag x={1300} y={90 + 1.95 * (406 - 290 * 0.45)} text="la mitad" k={lin(f, T * 0.32, T * 0.4)} />
        <Tag x={1300} y={420} text="la espuma sube" k={lin(f, T * 0.58, T * 0.66)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 10 · el reposo: la piedra burbujea y se achica
export const HvFizz: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const k = lin(f, 0, T);
  const mins = Math.round(20 * k);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={310} dim={0.5} />
      <Hand2D seed={310} push={[1.08, 1.0]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={0} width={1920} height={1080} fill={`rgba(${150 + 70 * k},${190 + 30 * k},${220 + 10 * k},0.55)`} />
          <rect x={0} y={860} width={1920} height={220} fill="url(#hvFzFloor)" />
          <defs><linearGradient id="hvFzFloor" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={STEELL} /><stop offset="1" stopColor={STEELD} /></linearGradient></defs>
          {Array.from({ length: 16 }, (_, i) => { const x = 80 + i * 118, w = (60 + rnd(i) * 70) * (1 - 0.85 * k), h = (40 + rnd(i + 5) * 60) * (1 - 0.85 * k); return <path key={i} d={`M${x - w} 862 Q${x - w * 0.6} ${862 - h} ${x} ${862 - h * 1.1} Q${x + w * 0.7} ${862 - h * 0.9} ${x + w} 862 Z`} fill={SCALE} stroke={SCALED} strokeWidth={3} />; })}
          {Array.from({ length: 90 }, (_, i) => { const per = 30 + rnd(i) * 40; const t = ((f + rnd(i + 2) * per) % per) / per; const x = 80 + (i % 16) * 118 + (rnd(i + 4) - 0.5) * 80 + Math.sin(t * 8 + i) * 8; const y = 850 - t * 700; return <circle key={i} cx={x} cy={y} r={3 + rnd(i + 7) * 6} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2} opacity={(1 - t) * (1 - 0.6 * k)} />; })}
          {/* arco de 20 min */}
          <g transform="translate(1660 200)">
            <circle r={120} fill="rgba(255,255,255,0.85)" />
            <circle r={100} fill="none" stroke="#E3DCCF" strokeWidth={22} />
            <circle r={100} fill="none" stroke={CL.navy} strokeWidth={22} strokeDasharray={628} strokeDashoffset={628 * (1 - k)} transform="rotate(-90)" strokeLinecap="round" />
            <text y={22} textAnchor="middle" fontFamily="Georgia" fontWeight={900} fontSize={64} fill={CL.navy}>{mins}</text>
          </g>
        </svg>
        <Tag x={1540} y={380} text="min de reposo" k={lin(f, 4, 14)} />
        <Tag x={120} y={150} text="el ácido se come la piedra" k={lin(f, 14, 26)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 11 · los tres hervores de enjuague
export const HvThreeBoils: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={311} dim={0.35} />
      <Hand2D seed={311}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, height: 340, background: "linear-gradient(180deg, #CFD5DB, #9AA3AD)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2].map((i) => {
            const t0 = 6 + i * (T * 0.27), p = pop(f, fps, t0, 12);
            const pour = ease(lin(f, t0 + T * 0.14, t0 + T * 0.24));
            const cloud = [0.75, 0.35, 0][i];
            const x = 420 + i * 540;
            return <g key={i} opacity={p} transform={`translate(${x} ${760}) rotate(${-70 * pour})`}>
              <path d="M-130 -260 L-110 0 L110 0 L130 -260 Z" fill="#FFFFFF" stroke="#C9C2B4" strokeWidth={5} />
              <path d="M130 -200 Q200 -180 196 -120 Q190 -60 120 -50" fill="none" stroke="#FFFFFF" strokeWidth={26} />
              <rect x={-118} y={-220 + pour * 200} width={236} height={(210) * (1 - pour)} fill={`rgba(${200 + 40 * (1 - cloud)},${215 + 25 * (1 - cloud)},${200 + 40 * (1 - cloud)},${0.5 + 0.4 * cloud})`} />
              {[0, 1, 2].map((s) => <path key={s} d={`M${-40 + s * 40} -270 q 14 -30 0 -60 q -14 -30 0 -60`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={6} opacity={(1 - pour) * (0.5 + 0.5 * Math.sin(f / 7 + s))} />)}
            </g>;
          })}
        </svg>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 420 + i * 540, top: 840, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.navy, opacity: lin(f, 6 + i * (T * 0.27), 16 + i * (T * 0.27)) }}>{i + 1}</div>)}
        <Tag x={720} y={140} text="a la pileta · no se toma" k={lin(f, T * 0.7, T * 0.8)} color={CL.red} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 12 · la rejilla de malla en el vaso
export const HvMeshSoak: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const dip = ease(lin(f, 4, 26));
  const clean = lin(f, T * 0.3, T * 0.85);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={312} dim={0.4} />
      <Hand2D seed={312} push={[1.0, 1.12]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="hvMesh"><rect x={-180} y={-120} width={360} height={240} rx={40} /></clipPath></defs>
          <path d="M560 160 L620 980 L1300 980 L1360 160" fill="rgba(235,245,250,0.3)" stroke="rgba(150,170,185,0.9)" strokeWidth={6} />
          <rect x={585} y={330} width={750} height={640} fill={`rgba(${200 - 40 * clean},${215 - 20 * clean},${210},0.45)`} />
          <g transform={`translate(960 ${130 + 560 * dip}) rotate(${-8 + 6 * dip})`}>
            <rect x={-190} y={-130} width={380} height={260} rx={44} fill="none" stroke={STEELD} strokeWidth={16} />
            <g clipPath="url(#hvMesh)">
              {Array.from({ length: 25 }, (_, i) => <line key={`a${i}`} x1={-180 + i * 15} x2={-180 + i * 15} y1={-120} y2={120} stroke={STEEL} strokeWidth={4} />)}
              {Array.from({ length: 17 }, (_, i) => <line key={`b${i}`} x1={-180} x2={180} y1={-120 + i * 15} y2={-120 + i * 15} stroke={STEEL} strokeWidth={4} />)}
              {Array.from({ length: 140 }, (_, i) => <rect key={i} x={-180 + Math.floor(rnd(i) * 24) * 15} y={-120 + Math.floor(rnd(i + 50) * 16) * 15} width={15} height={15} fill={SCALE} opacity={(1 - clean) * (rnd(i + 3) > 0.15 * (1 + 4 * clean) ? 0.95 : 0)} />)}
            </g>
          </g>
          {Array.from({ length: 30 }, (_, i) => { const t = ((f + i * 9) % 60) / 60; return <circle key={i} cx={760 + rnd(i) * 400} cy={700 - t * 360} r={4} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2} opacity={clean > 0 ? (1 - t) * (1 - clean * 0.5) : 0} />; })}
        </svg>
        <Tag x={1420} y={300} text="agua caliente + 1 cucharadita" k={lin(f, 18, 30)} />
        <Tag x={1420} y={420} text="20 min" k={lin(f, 30, 42)} color={CL.inkSoft} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 13 · los tres calendarios
export const HvCalendar: React.FC<{ bed?: string; hi?: number }> = ({ bed, hi = -1 }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const C = [["MUY DURA", 14, "cada 2 semanas", CL.red], ["MEDIA", 30, "una vez por mes", CL.brass], ["BLANDA", 91, "cada 3 meses", "#2F8F48"]] as const;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={313} dim={0.35} />
      <Hand2D seed={313}>
        {C.map(([t, every, txt, col], i) => {
          const p = pop(f, fps, 4 + i * 6, 12);
          const marks = Array.from({ length: 91 }, (_, d) => d).filter((d) => d % every === 0 && d > 0 || d === 0);
          const dim = hi >= 0 && hi !== i ? 0.45 : 1;
          return (
            <div key={i} style={{ position: "absolute", left: 130 + i * 580, top: 110, width: 520, transformOrigin: "50% 0", rotate: `${(1 - p) * 20 + (i - 1) * 2}deg`, opacity: p * dim }}>
              <div style={{ position: "absolute", left: 250, top: -26, width: 22, height: 22, borderRadius: "50%", background: "#555" }} />
              <Card style={{ padding: 26 }}>
                <div style={{ background: col, color: "#fff", fontFamily: LABEL, fontSize: 40, letterSpacing: 4, textAlign: "center", padding: "10px 0", borderRadius: 8 }}>{t}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 16 }}>
                  {Array.from({ length: 91 }, (_, d) => {
                    const on = marks.includes(d) && lin(f, 20 + i * 8 + d * 0.5, 26 + i * 8 + d * 0.5) > 0.5;
                    return <div key={d} style={{ height: 22, borderRadius: 3, background: on ? hexA(col, 0.95) : "#EEE9DF", fontSize: 20, color: "#fff", textAlign: "center", lineHeight: "22px", fontWeight: 900 }}>{on ? "✕" : ""}</div>;
                  })}
                </div>
                <div style={{ fontFamily: HAND, fontSize: 52, color: CL.ink, textAlign: "center", marginTop: 16 }}>{txt}</div>
              </Card>
            </div>
          );
        })}
        <Tag x={720} y={980} text="1 cucharada · 1 hervor · 10 min · 3 enjuagues" k={lin(f, T * 0.7, T * 0.8)} size={34} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 14 · las alternativas (y lo que nunca)
export const HvAltScale: React.FC<{ bed?: string; never?: boolean }> = ({ bed, never = false }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const J = [["Ácido cítrico", "sin olor", "$", "#F4F1E8"], ["Jugo de 2 limones", "algo de olor", "$$", "#F2DD6B"], ["Vinagre ½ y ½", "olor fuerte · ventana", "$", "#EDEFE6"]] as const;
  const nv = lin(f, 10, 22);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={314} dim={0.35} />
      <Hand2D seed={314}>
        {!never ? J.map(([t, smell, price, col], i) => {
          const p = pop(f, fps, 4 + i * 8, 12);
          return (
            <div key={i} style={{ position: "absolute", left: 170 + i * 560, top: 140 + (1 - p) * 300, width: 460, opacity: p, textAlign: "center" }}>
              <div style={{ margin: "0 auto", width: 230, height: 330, borderRadius: "30px 30px 24px 24px", background: `linear-gradient(90deg, rgba(0,0,0,0.12), rgba(255,255,255,0.4) 30%, rgba(0,0,0,0.06))`, backgroundColor: col, border: "5px solid rgba(120,110,95,0.5)", position: "relative", boxShadow: `0 30px 50px ${CL.shadow}` }}>
                <div style={{ position: "absolute", left: 40, top: -40, width: 140, height: 50, borderRadius: 10, background: "#5A5F66" }} />
                {i === 1 ? <div style={{ position: "absolute", left: 50, top: 120, width: 130, height: 90, borderRadius: "50%", background: "#E7C531", border: "4px solid #B9961E" }} /> : null}
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CL.navy, marginTop: 30 }}>{t}</div>
              <div style={{ fontFamily: HAND, fontSize: 48, color: CL.ink, opacity: lin(f, 20 + i * 8, 30 + i * 8) }}>{smell}</div>
              <div style={{ fontFamily: LABEL, fontSize: 44, color: CL.brass, opacity: lin(f, 26 + i * 8, 36 + i * 8) }}>{price}</div>
              {i === 0 ? <div style={{ position: "absolute", left: 360, top: 40 }}><Tick ok s={100} k={lin(f, T * 0.6, T * 0.7)} /></div> : null}
            </div>
          );
        }) : (
          <>
            {[["vinagre", "+ bicarbonato", "mucha espuma, limpia 0"], ["cloro", "o limpiador de baño", "nunca donde calienta agua para tomar"]].map(([a, b, c], i) => (
              <div key={i} style={{ position: "absolute", left: 200 + i * 800, top: 200, width: 700, opacity: pop(f, fps, 4 + i * 14, 12) }}>
                <Card style={{ padding: 40, border: `6px solid ${CL.red}` }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: CL.navy, lineHeight: 1 }}>{a}</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.inkSoft }}>{b}</div>
                  <div style={{ fontFamily: HAND, fontSize: 52, color: CL.ink, marginTop: 20 }}>{c}</div>
                </Card>
                <div style={{ position: "absolute", right: -30, top: -50 }}><Tick ok={false} s={150} k={lin(f, 14 + i * 14, 26 + i * 14)} /></div>
              </div>
            ))}
            {Array.from({ length: 40 }, (_, i) => { const t = ((f + i * 5) % 50) / 50; return <div key={i} style={{ position: "absolute", left: 300 + rnd(i) * 500, top: 640 - t * 140 * nv, width: 30 + rnd(i + 2) * 40, height: 30 + rnd(i + 2) * 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", opacity: (1 - t) * nv * 0.8 }} />; })}
          </>
        )}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 15 · cinco hervidores, cinco errores
export const HvFiveErrors: React.FC<{ hi?: number; bed?: string }> = ({ hi = 1, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const E = ["Lana de acero adentro", "Pasar el máximo", "Mojar la base", "No enjuagar", "Esperar las piedritas"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={315} dim={0.4} />
      <Hand2D seed={315}>
        <div style={{ position: "absolute", left: 80, right: 80, top: 720, height: 40, borderRadius: 6, background: "linear-gradient(180deg, #D7DCE1, #9AA3AD)", boxShadow: `0 20px 40px ${CL.shadow}` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <SteelDefs />
          {E.map((_, i) => { const p = pop(f, fps, 2 + i * 4, 12); const act = i + 1 === hi; return <g key={i} opacity={(act ? 1 : 0.5) * p} transform={`translate(${120 + i * 350} ${720 - 300 * 0.82 - (act ? 30 * ease(lin(f, 10, 22)) : 0)})`}><KettleSide x={0} y={-100} s={0.72} /></g>; })}
        </svg>
        {E.map((e, i) => {
          if (i + 1 !== hi) return null;
          const k = ease(lin(f, 18, 32));
          return <div key={i} style={{ position: "absolute", left: 120 + i * 350 + 145, top: 790, translate: "-50% 0", opacity: k, scale: String(0.8 + 0.2 * k) }}>
            <Card style={{ padding: "18px 26px", border: `5px solid ${CL.red}`, textAlign: "center", width: 330 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: CL.red, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontFamily: LABEL, fontSize: 44, color: CL.ink, lineHeight: 1.15 }}>{e}</div>
            </Card>
          </div>;
        })}
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 16 · la barra de tiempo de la rutina
export const HvRoutine: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const S = [["Preparar", 2, "#7FA7D6"], ["Hervir", 5, "#E0864A"], ["Reposo", 20, CL.navy], ["3 enjuagues", 10, "#5BA36B"]] as const;
  const tot = 37; const X0 = 160, W = 1600;
  const k = ease(lin(f, 8, T * 0.8));
  let acc = 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={316} dim={0.35} />
      <Hand2D seed={316}>
        <div style={{ position: "absolute", left: X0, top: 470, width: W, height: 120, borderRadius: 60, background: "#E8E2D6", boxShadow: `inset 0 6px 12px rgba(0,0,0,0.15)` }} />
        {S.map(([t, m, c], i) => {
          const a = acc / tot; acc += m; const b = acc / tot;
          const fill = clamp01((k - a) / (b - a));
          const x = X0 + W * a, w = W * (b - a);
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x + 4, top: 476, width: Math.max(0, (w - 8) * fill), height: 108, borderRadius: 54, background: c }} />
            <div style={{ position: "absolute", left: x + w / 2, top: i % 2 ? 640 : 250, translate: "-50% 0", textAlign: "center", opacity: fill > 0.05 ? 1 : 0.25, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: CL.navy }}>{m} min</div>
              <div style={{ fontFamily: HAND, fontSize: 52, color: CL.ink }}>{t}</div>
            </div>
          </React.Fragment>;
        })}
        <div style={{ position: "absolute", right: 160, top: 840, fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: CL.navy, opacity: lin(f, T * 0.8, T * 0.9) }}>≈ 40 min</div>
        <Stamp text="+ una cruz en el calendario" at={Math.round(T * 0.86)} x="30%" y="86%" size={50} rot={-5} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 17 · el hervidor de vidrio
export const HvGlassKettle: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const sc = 1 - ease(lin(f, T * 0.15, T * 0.85));
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={317} dim={0.45} />
      <Hand2D seed={317} push={[1.0, 1.1]}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <SteelDefs />
          <KettleSide x={560} y={60} s={2.0} water={0.45} glass scale={sc} />
          {Array.from({ length: 40 }, (_, i) => { const t = ((f + i * 7) % 45) / 45; return <circle key={i} cx={760 + rnd(i) * 420} cy={60 + 2 * (398 - t * 120)} r={3 + rnd(i) * 4} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} opacity={(1 - t) * sc} />; })}
        </svg>
        <Tag x={1450} y={300} text="en vidrio se ve todo" k={lin(f, 4, 14)} />
      </Hand2D>
      <RoomLight />
    </AbsoluteFill>
  );
};

// ═════════════════════════════ 18 · repaso: fichas colgadas de un hilo
export const HvRecap: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const W = ["piedra del agua", "gasta luz", "la prueba del vaso", "desenchufado y frío", "hasta la mitad", "1 cda × ½ litro", "1 hervor + 20 min", "3 enjuagues", "el filtrito", "nada de lana de acero", "base seca · sin cloro", "2 sem · 1 mes · 3 meses"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Bed src={bed} seed={318} dim={0.35} />
      <Hand2D seed={318} push={[1.04, 1.0]}>
        {[0, 1, 2].map((r) => <svg key={r} width={1920} height={80} style={{ position: "absolute", left: 0, top: 70 + r * 330 }}><path d="M40 20 Q960 70 1880 20" stroke="#8A7A62" strokeWidth={4} fill="none" /></svg>)}
        {W.map((w, i) => {
          const r = Math.floor(i / 4), c = i % 4; const t0 = 4 + i * ((T - 30) / W.length);
          const p = pop(f, fps, t0, 10);
          const sw = Math.sin(f / 14 + i) * 2.5;
          return <div key={i} style={{ position: "absolute", left: 130 + c * 430, top: 110 + r * 330 + Math.sin((c / 3) * Math.PI) * 30, width: 380, transformOrigin: "50% 0", rotate: `${sw + (1 - p) * 40}deg`, opacity: clamp01(p * 2) }}>
            <Tape x={150} y={-14} rot={-4} w={80} />
            <Card style={{ padding: "26px 20px", height: 220, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
              <div style={{ fontFamily: LABEL, fontSize: 30, color: CL.brass, letterSpacing: 3 }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: CL.navy, lineHeight: 1.1 }}>{w}</div>
            </Card>
          </div>;
        })}
      </Hand2D>
      <RoomLight k={0.6} />
    </AbsoluteFill>
  );
};
