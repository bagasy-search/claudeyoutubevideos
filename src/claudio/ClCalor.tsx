// Kit del CALOR (Claudio el Albañil, ep. 2 "La casa de Doña Marta"), todo dentro del mundo (cama real + sombra + luz):
//   ClHeatSides  corte de la casa: el cuarto de arriba bajo la losa; se encienden los 3 lados del calor (vidrio · losa · aire atrapado)
//                mode "three" (los 3 en orden) | "glass" | "roof" | "night"
//   ClShadeGap   corte de una ventana: la cortina ADENTRO (el calor ya pasó) vs. la malla AFUERA a 20 cm (el calor rebota y sube)
//   ClCrossVent  corte de la casa de noche: ventana BAJA del lado fresco + ventana ALTA del otro lado; el aire entra por abajo y sale por
//                arriba; fan=true pone el ventilador en la ventana alta soplando hacia afuera (las flechas se aceleran)
//   ClThermo     termómetro de pared que baja (o sube) de un valor a otro con su rótulo
//   ClEarthTube  corte del terreno: el caño enterrado a 2 m, 25 m de largo, con pendiente y desagüe; la tierra a temperatura pareja;
//                mode "good" | "short" (a medio metro y corto: no enfría + agua estancada)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const HOT = "#E8571E", COOL = "#3D8FD6";
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
// flecha ondulada que avanza (calor o aire)
const Flow: React.FC<{ d: string; color: string; o?: number; speed?: number; w?: number }> = ({ d, color, o = 1, speed = 1, w = 10 }) => {
  const f = useCurrentFrame();
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray="34 26" strokeDashoffset={-f * 3 * speed} opacity={o} markerEnd={`url(#ah${color.slice(1)})`} />;
};
const Arrows: React.FC<{ colors: string[] }> = ({ colors }) => (
  <defs>{colors.map((c) => <marker key={c} id={`ah${c.slice(1)}`} markerWidth={5} markerHeight={5} refX={2.5} refY={2.5} orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill={c} /></marker>)}</defs>
);

// ───────────────── ClHeatSides
export const ClHeatSides: React.FC<{ mode?: "three" | "glass" | "roof" | "night"; bed?: string }> = ({ mode = "three", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const k = (i: number) => (mode === "three" ? lin(f, 10 + i * (T * 0.26), 22 + i * (T * 0.26)) : (["glass", "roof", "night"].indexOf(mode) === i ? lin(f, 8, 20) : 0.12));
  const glow = 0.5 + 0.5 * Math.sin(f * 0.2);
  const kg = k(0), kr = k(1), kn = k(2);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={111} dim={0.38} />
      <Contact x={960} y={960} w={1400} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <Arrows colors={[HOT, COOL]} />
        {/* sol */}
        <circle cx={1650} cy={150} r={70} fill="#FFC93C" opacity={0.95} />
        {/* casa: planta baja + cuarto de arriba */}
        <rect x={420} y={560} width={1000} height={380} fill="#CFE3D6" stroke={CL.ink} strokeWidth={10} />
        <rect x={720} y={300} width={520} height={260} fill={`rgba(232,87,30,${0.12 + 0.35 * Math.max(kg, kr, kn) * glow})`} stroke={CL.ink} strokeWidth={10} />
        {/* losa */}
        <rect x={700} y={270} width={560} height={36} fill={interpolate(kr, [0, 1], [0, 1]) > 0.5 ? "#C2502A" : "#9A9A94"} stroke={CL.ink} strokeWidth={6} />
        {/* ventana oeste del cuarto (derecha) */}
        <rect x={1222} y={360} width={26} height={130} fill="#BFE0F5" stroke={CL.ink} strokeWidth={5} />
        {/* cama */}
        <rect x={800} y={490} width={220} height={50} rx={10} fill="#E9E1D2" stroke={CL.ink} strokeWidth={5} />
        {/* 1: sol por el vidrio */}
        <Flow d="M1610 210 L1260 420" color={HOT} o={kg} />
        <Flow d="M1180 430 L1000 490" color={HOT} o={kg} w={8} />
        {/* 2: losa que devuelve calor hacia abajo */}
        {[780, 900, 1020, 1140].map((x, i) => <Flow key={i} d={`M${x} 312 L${x} 420`} color={HOT} o={kr} speed={0.7} w={8} />)}
        <Flow d="M1600 230 L1180 250" color={HOT} o={kr} />
        {/* 3: aire atrapado de noche: remolino */}
        <path d={`M840 380 q 80 -60 160 0 t 160 0`} fill="none" stroke={HOT} strokeWidth={8} strokeDasharray="20 16" strokeDashoffset={-f * 2} opacity={kn} />
      </svg>
      <Tag x={1270} y={470} text="1 · El vidrio" color={HOT} o={kg} />
      <Tag x={760} y={190} text="2 · La losa" color={HOT} o={kr} />
      <Tag x={430} y={330} text="3 · El aire de noche" color={HOT} o={kn} />
      <div style={{ position: "absolute", left: 760, top: 330, fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.ink, opacity: lin(f, 6, 14) }}>el cuarto de arriba</div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClShadeGap
export const ClShadeGap: React.FC<{ mode?: "curtain" | "outside" | "both"; bed?: string }> = ({ mode = "both", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const kc = mode === "outside" ? 0 : lin(f, 6, 16), ko = mode === "curtain" ? 0 : lin(f, mode === "both" ? T * 0.48 : 6, mode === "both" ? T * 0.58 : 16);
  const Panel: React.FC<{ x: number; outside: boolean; o: number }> = ({ x, outside, o }) => (
    <g opacity={o} transform={`translate(${x},0)`}>
      <rect x={0} y={180} width={700} height={660} rx={14} fill="#FBF7EE" stroke={CL.ink} strokeWidth={6} />
      {/* pared con hueco de ventana */}
      <rect x={300} y={180} width={60} height={200} fill="#CFE3D6" stroke={CL.ink} strokeWidth={5} />
      <rect x={300} y={640} width={60} height={200} fill="#CFE3D6" stroke={CL.ink} strokeWidth={5} />
      <rect x={322} y={380} width={16} height={260} fill="#BFE0F5" stroke={CL.ink} strokeWidth={4} />
      <text x={150} y={240} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.inkSoft}>AFUERA</text>
      <text x={530} y={240} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.inkSoft}>ADENTRO</text>
      {outside ? (
        <>
          <rect x={210} y={360} width={12} height={300} fill="#2E5E3A" />
          <line x1={222} y1={500} x2={322} y2={500} stroke={CL.yellow} strokeWidth={6} strokeDasharray="10 8" />
          <text x={272} y={490} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={CL.ink}>20 cm</text>
          <Flow d="M40 300 L200 420" color={HOT} w={9} />
          <Flow d="M200 430 L120 560" color={HOT} w={8} speed={0.8} />
          <Flow d="M262 640 L262 330" color={HOT} w={7} speed={0.6} />
          <circle cx={560} cy={540} r={60} fill={hexA(COOL, 0.25)} />
        </>
      ) : (
        <>
          <rect x={380} y={360} width={18} height={300} fill="#B9A27A" />
          <Flow d="M40 300 L320 480" color={HOT} w={9} />
          <Flow d="M340 500 L620 640" color={HOT} w={9} speed={1.2} />
          <circle cx={560} cy={640} r={80} fill={hexA(HOT, 0.3 + 0.15 * Math.sin(f * 0.2))} />
        </>
      )}
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={121} dim={0.36} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <Arrows colors={[HOT, COOL]} />
        {mode !== "outside" ? <Panel x={mode === "both" ? 160 : 610} outside={false} o={kc} /> : null}
        {mode !== "curtain" ? <Panel x={mode === "both" ? 1060 : 610} outside o={ko} /> : null}
      </svg>
      {mode !== "outside" ? <Tag x={mode === "both" ? 220 : 670} y={880} text="Cortina adentro: el calor ya entró" color={CL.red} o={kc} size={36} /> : null}
      {mode !== "curtain" ? <Tag x={mode === "both" ? 1100 : 650} y={880} text="Malla afuera, a 20 cm" color="#3E8A3A" o={ko} size={36} /> : null}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCrossVent
export const ClCrossVent: React.FC<{ fan?: boolean; bed?: string }> = ({ fan = false, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const kin = lin(f, 12, 24), kout = lin(f, 20, 32), kf = fan ? lin(f, T * 0.35, T * 0.45) : 0;
  const sp = 1 + 1.6 * kf;
  const blade = f * (0.25 + 0.6 * kf);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={131} dim={0.45} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <Arrows colors={[HOT, COOL]} />
        {/* luna */}
        <circle cx={250} cy={150} r={55} fill="#F4F1E3" /><circle cx={275} cy={135} r={50} fill={hexA(CL.navyDeep, 0.0)} />
        <rect x={420} y={560} width={1000} height={380} fill="#2F4A5E" stroke={CL.ink} strokeWidth={10} />
        <rect x={720} y={300} width={520} height={260} fill="#34536A" stroke={CL.ink} strokeWidth={10} />
        <rect x={700} y={270} width={560} height={36} fill="#9A9A94" stroke={CL.ink} strokeWidth={6} />
        {/* ventana BAJA (sala, lado del patio, izquierda) y ventana ALTA (cuarto de arriba, derecha) */}
        <rect x={408} y={780} width={26} height={120} fill="#9FD0F0" stroke={CL.ink} strokeWidth={5} />
        <rect x={1228} y={340} width={26} height={120} fill="#9FD0F0" stroke={CL.ink} strokeWidth={5} />
        {/* aire fresco entra por abajo y corre por el piso */}
        <Flow d="M150 860 L560 880 Q 900 900 980 760 Q 1040 620 1000 520" color={COOL} o={kin} speed={sp} w={12} />
        {/* aire caliente sube y sale por arriba */}
        <Flow d="M900 470 Q 1050 380 1260 400 L 1560 330" color={HOT} o={kout} speed={sp} w={12} />
        {/* ventilador en la ventana alta, soplando para afuera */}
        {fan ? (
          <g transform={`translate(1300,400)`} opacity={kf}>
            <circle r={62} fill="#F4F4F2" stroke={CL.ink} strokeWidth={6} />
            {[0, 1, 2].map((i) => <ellipse key={i} rx={50} ry={16} fill={CL.nitrile} transform={`rotate(${(blade * 57.3 + i * 120) % 360})`} />)}
            <circle r={10} fill={CL.ink} />
          </g>
        ) : null}
      </svg>
      <Tag x={120} y={930} text="Abajo, del lado fresco" color={COOL} o={kin} size={36} />
      <Tag x={1290} y={240} text="Arriba, del otro lado" color={HOT} o={kout} size={36} />
      {fan ? <Tag x={1290} y={490} text="Ventilador: para afuera" color={CL.navy} o={kf} size={36} /> : null}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClThermo
export const ClThermo: React.FC<{ from?: number; to?: number; label?: string; sub?: string; bed?: string }> = ({ from = 38, to = 31, label, sub, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13);
  const k = ease(clamp01((f - 14) / (T * 0.5)));
  const v = from + (to - from) * k;
  const lvl = clamp01((v - 15) / 30);
  const hot = v >= 33;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={141} dim={0.3} />
      <Contact x={960} y={950} w={520} o={0.35} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", scale: String(0.85 + 0.15 * p) }}>
        <Card style={{ width: 360, height: 820, borderRadius: 40, padding: 30, position: "relative", background: "linear-gradient(180deg,#FFFFFF,#EEE9DF)" }}>
          <div style={{ position: "absolute", left: 150, top: 60, width: 60, height: 600, borderRadius: 30, background: "#EDEDED", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: hot ? CL.red : COOL }} />
          </div>
          <div style={{ position: "absolute", left: 125, top: 630, width: 110, height: 110, borderRadius: "50%", background: hot ? CL.red : COOL }} />
          {[15, 20, 25, 30, 35, 40, 45].map((t) => <div key={t} style={{ position: "absolute", left: 230, top: 60 + 600 * (1 - (t - 15) / 30) - 18, fontFamily: LABEL, fontWeight: 600, fontSize: 32, color: CL.ink }}>{t}°</div>)}
        </Card>
        <div style={{ position: "absolute", left: 420, top: 260, fontFamily: SERIF, fontWeight: 900, fontSize: 170, color: hot ? CL.red : CL.navy, whiteSpace: "nowrap", lineHeight: 1 }}>{Math.round(v)}°</div>
        {label ? <div style={{ position: "absolute", left: 420, top: 450, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.ink, whiteSpace: "nowrap", opacity: lin(f, 8, 16) }}>{label}</div> : null}
        {sub ? <div style={{ position: "absolute", left: 420, top: 530, opacity: lin(f, T * 0.55, T * 0.65) }}><Tag x={0} y={0} text={sub} color="#3E8A3A" /></div> : null}
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClEarthTube
export const ClEarthTube: React.FC<{ mode?: "good" | "short"; bed?: string }> = ({ mode = "good", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const good = mode === "good";
  const kp = lin(f, 10, 26), ka = lin(f, 24, 40), kw = lin(f, T * 0.5, T * 0.62);
  const depth = good ? 560 : 330; // y del caño
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={151} dim={0.35} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <Arrows colors={[HOT, COOL]} />
        {/* cielo/pasto y capas de tierra */}
        <rect x={120} y={230} width={1680} height={30} fill="#6FA34C" />
        <rect x={120} y={260} width={1680} height={150} fill="#B58A5A" />
        <rect x={120} y={410} width={1680} height={200} fill="#9C734A" />
        <rect x={120} y={610} width={1680} height={260} fill="#7E5C3B" />
        <text x={good ? 150 : 760} y={350} fontFamily={LABEL} fontWeight={700} fontSize={32} fill="#FFF3E0">medio metro · {good ? "caliente" : "caliente como el patio"}</text>
        <text x={150} y={good ? 780 : 690} fontFamily={LABEL} fontWeight={700} fontSize={32} fill="#FFF3E0">2 metros · la temperatura promedio del año, todo el año</text>
        {/* casa */}
        <rect x={1500} y={70} width={260} height={160} fill="#CFE3D6" stroke={CL.ink} strokeWidth={8} />
        {/* entrada del caño */}
        <rect x={190} y={120} width={36} height={110} fill="#F4F4F2" stroke={CL.ink} strokeWidth={5} />
        {/* el caño */}
        <path d={good ? `M208 230 L208 ${depth} L1430 ${depth + 40} L1560 ${depth + 40} L1560 230` : `M208 230 L208 ${depth} L700 ${depth} L700 230`} fill="none" stroke="#F4F4F2" strokeWidth={34} strokeLinejoin="round" opacity={kp} />
        <path d={good ? `M208 230 L208 ${depth} L1430 ${depth + 40} L1560 ${depth + 40} L1560 230` : `M208 230 L208 ${depth} L700 ${depth} L700 230`} fill="none" stroke={CL.ink} strokeWidth={4} strokeDasharray="1 0" opacity={kp * 0.4} />
        {/* aire: entra caliente, sale fresco (good) / sale igual (short) */}
        <Flow d="M120 150 L190 170" color={HOT} o={ka} />
        {good ? <Flow d={`M240 ${depth} L1400 ${depth + 38}`} color={COOL} o={ka} w={9} /> : <Flow d={`M240 ${depth} L680 ${depth}`} color={HOT} o={ka} w={9} />}
        {/* desagüe / agua estancada */}
        {good ? <g opacity={kw}><rect x={1380} y={depth + 60} width={24} height={120} fill="#5B8FBF" /><text x={1240} y={depth + 220} fontFamily={LABEL} fontWeight={700} fontSize={30} fill="#E6F3FF">desagüe del agua</text></g>
          : <g opacity={kw}><ellipse cx={450} cy={depth + 4} rx={150} ry={10} fill="#5B8FBF" />{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={360 + i * 34} cy={depth - 6} r={7} fill="#1A1C14" />)}</g>}
      </svg>
      <Tag x={good ? 600 : 300} y={good ? 440 : 420} text={good ? "1,5 a 2 m de hondo · 20 a 30 m de largo" : "Corto y bajo: no enfría"} color={good ? "#3E8A3A" : CL.red} o={ka} size={38} />
      {!good ? <Tag x={300} y={500} text="y el agua cría moho" color={CL.red} o={kw} size={34} /> : <Tag x={1180} y={250} text="Con pendiente" color={CL.navy} o={kw} size={34} />}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
