// Kit del MECÁNICO (Claudio Old Mechanic, EN, serie "Miss Doris's Car"), dentro del mundo (cama real + sombra + luz):
//   ClFeatureTag  la etiqueta de taller (manila, ojal de latón, hilo) que cuelga y se balancea con el número de la cuenta regresiva
//                 (n) y el nombre de la función (title) + una nota a mano (note) · se usa en cada "Number N" del video
//   ClGasArrow    el indicador de nafta del tablero: aguja en 1/4, el surtidor y la flechita que late; después el auto desde arriba
//                 con la tapa del lado que marca la flecha (side "left" | "right")
//   ClCarMap      el auto de Doris desde arriba (hilo del episodio): un punto por función en su lugar real; las ya vistas con tilde,
//                 la de ahora latiendo (now = id), las que faltan apagadas. ids: headrest hook glasses trunk gas visor child defog tire
//                 wheellock spare cabin glow manual obd
//   ClOBDScan     el enchufe OBD2 (trapecio de 16 pines) bajo el volante; el lector entra, la pantalla muestra el código de la tapa
//                 floja; después la cuenta: shop US$120 vs reader US$20 vs parts store FREE (mode "scan" | "price")
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.nitrile}` }}>{text}</div>
);
const MANILA = "#E8D3A2", MANILA_D = "#B99A5E";

// ───────────────── ClFeatureTag
export const ClFeatureTag: React.FC<{ n: number; title: string; note?: string; bed?: string }> = ({ n, title, note, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 9);
  const swing = Math.sin(f * 0.11) * 7 * Math.exp(-f / 60) + Math.sin(f * 0.05) * 1.2;
  const drop = (1 - p) * -520;
  const W = 620, H = 860, X = 960 - W / 2, Y = 150;
  const k = lin(f, 14, 26), nk = lin(f, T * 0.35, T * 0.5);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={900 + n} dim={0.5} />
      {/* hilo */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <path d={`M960 -20 Q ${960 + swing * 4} ${Y / 2} ${960 + Math.sin((swing * Math.PI) / 180) * 30} ${Y + 40 + drop}`} stroke="#F4EFE2" strokeWidth={4} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: X, top: Y + drop, width: W, height: H, transformOrigin: "50% 0%", rotate: `${swing}deg` }}>
        {/* sombra */}
        <div style={{ position: "absolute", inset: 0, translate: "26px 30px", background: "rgba(0,0,0,0.28)", filter: "blur(18px)", clipPath: "polygon(18% 0, 82% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)" }} />
        {/* etiqueta manila con las esquinas cortadas */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(170deg, #F1E0B6 0%, ${MANILA} 55%, #DCC48C 100%)`, clipPath: "polygon(18% 0, 82% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)" }}>
          {/* ojal de latón */}
          <div style={{ position: "absolute", left: W / 2 - 40, top: 34, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F6E3A8, #A8853A 70%, #6E5420)", boxShadow: "0 3px 6px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "absolute", left: 22, top: 22, width: 36, height: 36, borderRadius: "50%", background: "#3B2F22" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: "#6B5530" }}>NUMBER</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 330, lineHeight: 1, color: CL.navy, transform: `scale(${0.8 + 0.2 * k})`, opacity: k }}>{n}</div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 530, height: 4, background: hexA("#6B5530", 0.45) }} />
          <div style={{ position: "absolute", left: 40, right: 40, top: 560, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 56, lineHeight: 1.08, color: CL.ink, opacity: lin(f, 18, 30) }}>{title}</div>
          {note ? <div style={{ position: "absolute", left: 40, right: 40, top: 740, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.red, rotate: "-3deg", opacity: nk }}>{note}</div> : null}
          {/* grasa del dedo en la esquina */}
          <div style={{ position: "absolute", right: 46, bottom: 40, width: 70, height: 46, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(40,32,24,0.32), rgba(40,32,24,0) 70%)", rotate: "-20deg" }} />
        </div>
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClGasArrow
export const ClGasArrow: React.FC<{ side?: "left" | "right"; bed?: string }> = ({ side = "left", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13);
  const sw = ease(clamp01((f - T * 0.48) / (T * 0.14))); // pasa del tablero al auto
  const pulse = 1 + 0.12 * Math.max(0, Math.sin(f * 0.35));
  const needle = -60 + 30 * lin(f, 6, 30); // aguja hacia 1/4
  const L = side === "left";
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={611} dim={0.62} />
      {/* el indicador */}
      <div style={{ position: "absolute", left: 960 - 430, top: 120, width: 860, height: 620, opacity: (1 - sw) * clamp01(p * 1.4), transform: `scale(${0.9 + 0.1 * p})` }}>
        <svg width={860} height={620} viewBox="0 0 860 620">
          <defs><radialGradient id="dial" cx="50%" cy="60%" r="60%"><stop offset="0%" stopColor="#1E2430" /><stop offset="100%" stopColor="#0B0E14" /></radialGradient></defs>
          <path d="M60 560 A 370 370 0 0 1 800 560 Z" fill="url(#dial)" stroke="#5A6272" strokeWidth={10} />
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI * (1 - i / 8); const r1 = 330, r2 = i % 2 ? 300 : 280;
            return <line key={i} x1={430 + r1 * Math.cos(a)} y1={560 - r1 * Math.sin(a)} x2={430 + r2 * Math.cos(a)} y2={560 - r2 * Math.sin(a)} stroke="#E9EDF5" strokeWidth={i % 2 ? 5 : 9} />;
          })}
          <text x={110} y={520} fill="#FF5A4E" fontFamily={LABEL} fontWeight={700} fontSize={64}>E</text>
          <text x={700} y={520} fill="#E9EDF5" fontFamily={LABEL} fontWeight={700} fontSize={64}>F</text>
          {/* surtidor + flecha */}
          <g transform="translate(400 330)">
            <rect x={0} y={0} width={58} height={92} rx={8} fill="#E9EDF5" /><rect x={10} y={12} width={38} height={26} rx={4} fill="#1E2430" />
            <path d="M58 22 h18 v50 a10 10 0 0 0 20 0 v-40" stroke="#E9EDF5" strokeWidth={8} fill="none" />
          </g>
          <g transform={`translate(${L ? 360 : 530} 376) scale(${pulse}) scale(${L ? -1 : 1} 1)`}>
            <path d="M0 -26 L 34 0 L 0 26 Z" fill={CL.yellow} stroke="#000" strokeWidth={3} />
          </g>
          {/* aguja */}
          <g transform={`rotate(${needle} 430 560)`}><line x1={430} y1={560} x2={430} y2={260} stroke="#FF7A2E" strokeWidth={12} strokeLinecap="round" /></g>
          <circle cx={430} cy={560} r={34} fill="#2A303C" stroke="#5A6272" strokeWidth={6} />
        </svg>
        <div style={{ position: "absolute", left: L ? 60 : 560, top: 300, opacity: lin(f, 16, 26) }}>
          <Card style={{ padding: "10px 26px", borderBottom: `6px solid ${CL.yellow}` }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.ink }}>{L ? "← cap on the LEFT" : "cap on the RIGHT →"}</div>
          </Card>
        </div>
      </div>
      {/* el auto desde arriba con la tapa marcada */}
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: sw }}>
        <g transform={`translate(960 560) scale(${0.9 + 0.1 * sw})`}>
          <rect x={-200} y={-400} width={400} height={800} rx={150} fill="#BFC5CC" stroke="#59606B" strokeWidth={10} />
          <rect x={-150} y={-230} width={300} height={170} rx={40} fill="#2B3440" opacity={0.85} />
          <rect x={-150} y={110} width={300} height={130} rx={36} fill="#2B3440" opacity={0.85} />
          <circle cx={L ? -200 : 200} cy={190} r={34 * pulse} fill={CL.yellow} stroke="#000" strokeWidth={5} />
        </g>
      </svg>
      <Tag x={L ? 360 : 1240} y={680} text="Gas cap" color={CL.red} o={lin(f, T * 0.62, T * 0.7)} size={46} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClCarMap
const SPOTS: Record<string, { x: number; y: number; label: string }> = {
  headrest: { x: -70, y: -40, label: "headrest" }, hook: { x: 150, y: 120, label: "hook" }, glasses: { x: 0, y: -110, label: "glasses" },
  trunk: { x: -150, y: -10, label: "trunk button" }, gas: { x: -200, y: 230, label: "gas cap" }, visor: { x: -90, y: -170, label: "visor" },
  child: { x: 190, y: 60, label: "child lock" }, defog: { x: 0, y: -260, label: "defog" }, tire: { x: -205, y: -40, label: "door sticker" },
  wheellock: { x: 0, y: 330, label: "wheel lock key" }, spare: { x: 0, y: 380, label: "spare" }, cabin: { x: 90, y: -200, label: "cabin filter" },
  glow: { x: 0, y: 290, label: "glow handle" }, manual: { x: 120, y: -150, label: "manual" }, obd: { x: -120, y: -210, label: "OBD2 port" },
};
export const ClCarMap: React.FC<{ done?: string[]; now?: string; bed?: string; title?: string }> = ({ done = [], now, bed, title = "Miss Doris's car" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13);
  const beat = 1 + 0.18 * Math.max(0, Math.sin(f * 0.3));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={621} dim={0.6} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        <g transform={`translate(1060 560) scale(${0.95 + 0.05 * p})`}>
          <rect x={-230} y={-470} width={460} height={940} rx={170} fill="#C7CCD2" stroke="#4E5562" strokeWidth={10} />
          <rect x={-180} y={-300} width={360} height={190} rx={44} fill="#2B3440" opacity={0.85} />
          <rect x={-180} y={170} width={360} height={150} rx={40} fill="#2B3440" opacity={0.85} />
          {[[-240, -300], [240, -300], [-240, 300], [240, 300]].map(([x, y], i) => <rect key={i} x={x - 26} y={y - 70} width={52} height={140} rx={18} fill="#22262D" />)}
          {Object.entries(SPOTS).map(([id, s], i) => {
            const isDone = done.includes(id), isNow = now === id;
            const o = lin(f, 6 + i * 1.5, 14 + i * 1.5);
            const c = isNow ? CL.red : isDone ? CL.nitrile : "#7A818C";
            return (
              <g key={id} opacity={o * (isDone || isNow ? 1 : 0.55)} transform={`translate(${s.x} ${s.y}) scale(${isNow ? beat : 1})`}>
                <circle r={isNow ? 30 : 22} fill={c} stroke="#fff" strokeWidth={5} />
                {isDone ? <path d="M-9 1 l6 7 l12 -14" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 120, top: 150, opacity: lin(f, 8, 18) }}>
        <Card style={{ padding: "22px 36px", borderBottom: `6px solid ${CL.nitrile}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: CL.inkSoft }}>WALK-AROUND</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>{title}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CL.nitrile, marginTop: 6 }}>{done.length} found{now ? ` · now: ${SPOTS[now]?.label}` : ""}</div>
        </Card>
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClOBDScan
export const ClOBDScan: React.FC<{ mode?: "scan" | "price"; code?: string; meaning?: string; bed?: string }> = ({ mode = "scan", code = "P0457", meaning = "Gas cap loose", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 13);
  if (mode === "price") {
    const rows: [string, string, string][] = [["Dealership", "$120", CL.red], ["Code reader", "$20", CL.navy], ["Parts store", "FREE", CL.nitrile]];
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={631} dim={0.6} />
        <div style={{ position: "absolute", left: 960 - 560, top: 170, width: 1120 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 36, letterSpacing: 6, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.5)", marginBottom: 20, opacity: lin(f, 4, 12) }}>TO READ ONE CHECK ENGINE CODE</div>
          {rows.map(([a, b, c], i) => {
            const k = pop(f, fps, 8 + i * 12, 12);
            return (
              <div key={a} style={{ transform: `translateX(${(1 - k) * -80}px)`, opacity: clamp01(k * 1.3), marginBottom: 26 }}>
                <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 44px", borderLeft: `14px solid ${c}` }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: CL.ink }}>{a}</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: c, textDecoration: i === 0 ? `line-through ${hexA(CL.red, 0.8)} 8px` : "none" }}>{b}</div>
                </Card>
              </div>
            );
          })}
        </div>
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  const plug = ease(clamp01((f - T * 0.18) / (T * 0.16)));
  const screen = lin(f, T * 0.4, T * 0.48);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={641} dim={0.6} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* bajo del tablero */}
        <path d="M0 0 H1920 V360 Q 960 470 0 360 Z" fill="#23272E" />
        {/* el puerto: trapecio de 16 pines */}
        <g transform="translate(700 470)">
          <path d="M-150 -60 H150 L120 60 H-120 Z" fill="#111" stroke={CL.yellow} strokeWidth={6} />
          {Array.from({ length: 16 }, (_, i) => <rect key={i} x={-112 + (i % 8) * 30} y={i < 8 ? -38 : 8} width={14} height={26} rx={3} fill="#C9A44C" />)}
        </g>
        {/* el lector entra */}
        <g transform={`translate(${700 + (1 - plug) * 520} ${470 + (1 - plug) * 330})`}>
          <path d="M-140 -50 H140 L112 50 H-112 Z" fill="#2D63C8" stroke="#0F2B66" strokeWidth={5} />
          <rect x={-100} y={50} width={200} height={70} fill="#2D63C8" />
          <path d="M0 120 C 0 220, 260 220, 300 320" stroke="#111" strokeWidth={18} fill="none" />
        </g>
      </svg>
      {/* la pantalla del lector */}
      <div style={{ position: "absolute", left: 1080, top: 520, opacity: screen }}>
        <Card style={{ padding: 0, overflow: "hidden", width: 640, borderBottom: `8px solid ${CL.nitrile}` }}>
          <div style={{ background: "#0E1A12", padding: "26px 34px" }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: "#7DFF9A" }}>CODE FOUND</div>
            <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 96, color: "#B6FFC7" }}>{code}</div>
          </div>
          <div style={{ padding: "18px 34px", fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: CL.ink }}>{meaning}</div>
        </Card>
      </div>
      <Tag x={540} y={600} text="OBD2 port" color={CL.navy} o={lin(f, 10, 18)} size={44} />
      <Tag x={540} y={680} text="Every car since 1996" color={CL.nitrile} o={lin(f, 18, 26)} size={36} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
