// Kit de la GOTERA (Claudio el Albañil, ep. 4 "La casa de Doña Marta"), dentro del mundo (cama real + sombra + luz):
//   ClWaterWalk  corte de la losa sobre la cocina: el agua entra por la fisura al lado del desagüe tapado, CAMINA adentro de la losa
//                3 metros y gotea al lado de la lámpara. mode "walk" | "patch" (el parche de brea arriba de la mancha: el agua sigue igual)
//   ClHoseTest   el techo visto de arriba en zonas: la manguera moja de a una zona, 10 minutos, de la más baja a la más alta; en la zona
//                del agujero, abajo cae la gota y el ayudante grita ("¡AHÍ!"). hit = índice de la zona del agujero
//   ClMembrane   las capas del arreglo sobre la fisura, en orden: cordón de sellador apretado → mano 1 → tela → mano 2 → mano 3, con las
//                flechas del rodillo cruzadas
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Contact, RoomLight, lin, pop, useOut } from "./ClParts";

const WATER = "#3D8FD6";
const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);

// ───────────────── ClWaterWalk
export const ClWaterWalk: React.FC<{ mode?: "walk" | "patch"; bed?: string }> = ({ mode = "walk", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const X0 = 260, X1 = 1660, SY = 380, SH = 90; // losa
  const DX = 420, LX = 1300;                    // desagüe (izquierda) y lámpara/mancha (derecha)
  const walk = ease(clamp01((f - 18) / (T * 0.45)));
  const wx = DX + 60 + (LX - DX - 60) * walk;
  const drop = clamp01((f - 18 - T * 0.45) / 10);
  const kpatch = mode === "patch" ? lin(f, 8, 16) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={191} dim={0.4} />
      <Contact x={960} y={940} w={1400} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* lluvia */}
        {Array.from({ length: 40 }, (_, i) => { const t = ((f * 0.05 + rnd(i)) % 1); return <line key={i} x1={X0 + rnd(i + 2) * (X1 - X0)} y1={80 + t * 260} x2={X0 + rnd(i + 2) * (X1 - X0) - 8} y2={100 + t * 260} stroke={hexA(WATER, 0.6)} strokeWidth={3} />; })}
        {/* charco sobre el desagüe tapado */}
        <ellipse cx={DX + 40} cy={SY - 6} rx={170} ry={14} fill={hexA(WATER, 0.55)} />
        {/* losa */}
        <rect x={X0} y={SY} width={X1 - X0} height={SH} fill="#A6A39B" stroke={CL.ink} strokeWidth={6} />
        {/* desagüe con hojas */}
        <rect x={DX} y={SY} width={70} height={SH + 120} fill="#8C8F93" stroke={CL.ink} strokeWidth={5} />
        {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={DX + 10 + rnd(i) * 50} cy={SY - 10 + rnd(i + 3) * 18} rx={16} ry={7} fill={i % 2 ? "#7A5A2A" : "#5E7A2E"} transform={`rotate(${rnd(i + 6) * 180} ${DX + 10 + rnd(i) * 50} ${SY})`} />)}
        {/* fisura al lado del desagüe */}
        <path d={`M${DX + 110} ${SY} l 8 25 l -6 22 l 10 30`} stroke="#2A2A2A" strokeWidth={5} fill="none" />
        {/* el agua que camina adentro de la losa */}
        <path d={`M${DX + 114} ${SY + 40} L ${wx} ${SY + SH - 18}`} stroke={WATER} strokeWidth={10} strokeLinecap="round" strokeDasharray="22 14" strokeDashoffset={-f * 3} />
        {/* cocina: techo de abajo, lámpara, mancha y gota */}
        <rect x={X0} y={SY + SH} width={X1 - X0} height={10} fill="#EDE7DA" />
        <ellipse cx={LX} cy={SY + SH + 10} rx={110 * walk} ry={18 * walk} fill="rgba(140,100,50,0.55)" />
        <line x1={LX - 160} y1={SY + SH + 10} x2={LX - 160} y2={SY + SH + 90} stroke={CL.ink} strokeWidth={4} />
        <path d={`M${LX - 200} ${SY + SH + 90} h 80 l -20 40 h -40 z`} fill="#F1D27A" stroke={CL.ink} strokeWidth={4} />
        {[0, 1, 2].map((i) => { const t = ((f * 0.04 + i / 3) % 1); return <ellipse key={i} cx={LX} cy={SY + SH + 24 + t * 330} rx={9} ry={13} fill={WATER} opacity={drop * (1 - t)} />; })}
        <path d={`M${LX - 70} 860 h 140 l -16 70 h -108 z`} fill="#D9D4CA" stroke={CL.ink} strokeWidth={4} />
        {/* parche de brea del pintor, arriba de la mancha */}
        {mode === "patch" ? <ellipse cx={LX} cy={SY - 8} rx={90} ry={16} fill="#1B1B1B" opacity={kpatch} /> : null}
        {/* medida: 3 metros */}
        <line x1={DX + 110} x2={LX} y1={SY + SH + 160} y2={SY + SH + 160} stroke={CL.yellow} strokeWidth={8} opacity={lin(f, T * 0.55, T * 0.65)} />
      </svg>
      <Tag x={DX - 130} y={SY - 130} text="Desagüe tapado" color={CL.red} o={lin(f, 6, 14)} size={34} />
      <Tag x={DX + 140} y={SY + 120} text="La fisura" color={CL.navy} o={lin(f, 12, 20)} size={34} />
      <Tag x={LX - 130} y={SY + SH + 210} text="La mancha" color={CL.navy} o={lin(f, T * 0.4, T * 0.5)} size={34} />
      <Tag x={(DX + LX) / 2 - 120} y={SY + SH + 180} text="3 metros" color={CL.ink} o={lin(f, T * 0.55, T * 0.65)} size={40} />
      {mode === "patch" ? <Tag x={LX - 220} y={SY - 110} text="Parche: no sirve" color={CL.red} o={kpatch} size={34} /> : null}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClHoseTest
export const ClHoseTest: React.FC<{ zones?: number; hit?: number; bed?: string }> = ({ zones = 4, hit = 1, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const per = (T * 0.7) / (hit + 1);
  const cur = Math.min(hit, Math.floor(Math.max(0, f - 12) / per));
  const within = clamp01((f - 12 - cur * per) / per);
  const found = f - 12 >= hit * per + per * 0.6;
  const X = 300, Y = 200, W = 1000, H = 600, zw = W / zones;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={201} dim={0.4} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, opacity: clamp01(p * 1.4), transform: "perspective(1800px) rotateX(22deg)", transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", inset: 0, background: "#B9B6AE", borderRadius: 10, boxShadow: `0 40px 70px ${CL.shadow}` }} />
        {Array.from({ length: zones }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: i * zw, top: 0, width: zw, height: H, borderRight: i < zones - 1 ? "6px dashed rgba(40,40,40,0.5)" : "none", background: i < cur ? hexA(WATER, 0.18) : i === cur ? hexA(WATER, 0.25 + 0.25 * within) : "transparent" }}>
            <div style={{ position: "absolute", left: 20, top: 16, fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: CL.ink }}>ZONA {i + 1}</div>
            {i === cur ? <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>{Math.min(10, Math.round(within * 10))}′</div> : null}
            {i === hit && found ? <div style={{ position: "absolute", left: "50%", top: "45%", translate: "-50% -50%", width: 120, height: 120, borderRadius: "50%", border: `10px solid ${CL.red}`, scale: String(1 + 0.08 * Math.sin(f * 0.3)) }} /> : null}
          </div>
        ))}
        {/* desagüe en la zona más baja */}
        <div style={{ position: "absolute", left: 30, top: H / 2 - 30, width: 60, height: 60, borderRadius: "50%", background: "#6E7176", border: "6px solid #3A3A3A" }} />
        {/* gotas de la manguera sobre la zona activa */}
        {Array.from({ length: 16 }, (_, i) => { const t = ((f * 0.07 + rnd(i)) % 1); return <div key={i} style={{ position: "absolute", left: cur * zw + 30 + rnd(i + 4) * (zw - 60), top: 60 + t * (H - 120), width: 8, height: 18, borderRadius: 4, background: WATER, opacity: 0.8 * (1 - t) }} />; })}
      </div>
      <div style={{ position: "absolute", left: X + 20, top: Y - 110, opacity: lin(f, 4, 12) }}><Tag x={0} y={0} text="De la zona más baja a la más alta · 10 min c/u" size={34} /></div>
      <div style={{ position: "absolute", left: 1380, top: 360, opacity: found ? 1 : 0.25, scale: String(found ? 1 + 0.06 * Math.sin(f * 0.4) : 1) }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: CL.ink }}>abajo, en la cocina:</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: found ? CL.red : CL.inkSoft, lineHeight: 1 }}>¡Ahí!</div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClMembrane
const LAYERS = [
  { k: "Cordón de sellador", sub: "apretado adentro de la fisura", c: "#6B6B6B" },
  { k: "1ª mano", sub: "de membrana, un palmo alrededor", c: "#E9E6DF" },
  { k: "Tela de refuerzo", sub: "sobre la membrana fresca", c: "#F5EFD8" },
  { k: "2ª mano", sub: "cruzada", c: "#F7F7F5" },
  { k: "3ª mano", sub: "cruzada otra vez", c: "#FFFFFF" },
];
export const ClMembrane: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const step = (T * 0.75) / LAYERS.length;
  const k = (i: number) => lin(f, 10 + i * step, 10 + i * step + 10);
  const X = 260, Y = 300, W = 900;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={211} dim={0.38} />
      <Contact x={X + W / 2} y={Y + 470} w={1000} o={0.3} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* losa con la fisura en V */}
        <path d={`M${X} ${Y + 200} L${X + W / 2 - 18} ${Y + 200} L${X + W / 2} ${Y + 300} L${X + W / 2 + 18} ${Y + 200} L${X + W} ${Y + 200} L${X + W} ${Y + 420} L${X} ${Y + 420} Z`} fill="#A6A39B" stroke={CL.ink} strokeWidth={6} />
        {/* cordón */}
        <path d={`M${X + W / 2 - 16} ${Y + 202} L${X + W / 2} ${Y + 286} L${X + W / 2 + 16} ${Y + 202} Z`} fill={LAYERS[0].c} opacity={k(0)} />
        {/* manos y tela, cada una un poco más arriba */}
        {[1, 2, 3, 4].map((i) => <rect key={i} x={X + W / 2 - 260} y={Y + 200 - i * 16} width={520} height={16} rx={6} fill={LAYERS[i].c} stroke="rgba(0,0,0,0.25)" strokeWidth={2} opacity={k(i)} style={i === 2 ? { strokeDasharray: "6 4" } : undefined} />)}
        {/* flechas del rodillo cruzadas */}
        <g opacity={k(3)}><path d={`M${X + W / 2 - 220} ${Y + 80} h 300`} stroke={CL.nitrile} strokeWidth={8} markerEnd="url(#am)" /></g>
        <g opacity={k(4)}><path d={`M${X + W / 2 + 140} ${Y - 10} v 110`} stroke={CL.nitrile} strokeWidth={8} markerEnd="url(#am)" /></g>
        <defs><marker id="am" markerWidth={5} markerHeight={5} refX={2.5} refY={2.5} orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill={CL.nitrile} /></marker></defs>
      </svg>
      {LAYERS.map((L, i) => (
        <div key={i} style={{ position: "absolute", left: 1260, top: 170 + i * 150, opacity: 0.2 + 0.8 * k(i), translate: `${(1 - k(i)) * 40}px 0` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink, lineHeight: 1, whiteSpace: "nowrap" }}>{i + 1}. {L.k}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.inkSoft }}>{L.sub}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: X, top: Y + 450, opacity: lin(f, T * 0.8, T * 0.88) }}><Tag x={0} y={0} text="≈ 1 kg por m² en cada mano" /></div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
