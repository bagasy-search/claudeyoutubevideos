// Kit de la CAJA AUTOMÁTICA (Claudio Old Mechanic ep. 8 "omauto"), dentro del mundo (cama real + luz):
//   ClShifter  el tablero de la palanca P R N D L (+ "2 1" si low): la perilla viaja hasta `pick`; las letras de `cross` quedan tachadas
//              con una X roja; `ok` = letras con tilde verde · caption abajo
//   ClPawl     el trinquete de estacionamiento: la rueda dentada del eje de salida y el "dedito" de metal · mode "flat" (entra y
//              sostiene tranquilo), "hill" (el peso del auto tira: flecha de carga, el dedito se tensa y se gasta), "rolling" (la rueda
//              gira y el dedito rebota y raspa: chispas, CLACK) · label
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA, rnd } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

export const ClShifter: React.FC<{ pick?: string; cross?: string[]; ok?: string[]; low?: boolean; caption?: string; bed?: string }> = ({ pick = "D", cross = [], ok = [], low = false, caption, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const L = low ? ["P", "R", "N", "D", "2", "1"] : ["P", "R", "N", "D", "L"];
  const step = 120, y0 = 230;
  const target = Math.max(0, L.indexOf(pick));
  const t = ease(clamp01((f - 10) / 16));
  const knobY = y0 + step * target * t;
  const mark = clamp01((f - 26) / 8);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1013} dim={0.62} />
      <div style={{ position: "absolute", left: 660, top: 90, width: 600, height: 900, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "linear-gradient(180deg,#2A2F38,#14171D)", boxShadow: "0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 6px #3A404C" }} />
        <div style={{ position: "absolute", left: 270, top: 200, width: 60, height: step * (L.length - 1) + 60, borderRadius: 30, background: "#0B0D11", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)" }} />
        {L.map((l, i) => {
          const isPick = i === target && t > 0.9;
          const isX = cross.includes(l), isOk = ok.includes(l);
          return (
            <React.Fragment key={l}>
              <div style={{ position: "absolute", left: 90, top: y0 + i * step - 50, width: 120, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 96, color: isPick ? CL.yellow : "#C9CED8", textShadow: isPick ? "0 0 22px rgba(242,194,48,0.8)" : "none" }}>{l}</div>
              {isX ? <svg width={150} height={150} style={{ position: "absolute", left: 75, top: y0 + i * step - 75, opacity: mark }}><path d="M25 25 L125 125 M125 25 L25 125" stroke={CL.red} strokeWidth={16} strokeLinecap="round" /></svg> : null}
              {isOk ? <div style={{ position: "absolute", left: 400, top: y0 + i * step - 46, fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "#4CAF50", opacity: mark }}>✓</div> : null}
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 220, top: knobY - 60, width: 160, height: 120, borderRadius: 30, background: "linear-gradient(180deg,#5B6372,#2E343F)", boxShadow: "0 14px 26px rgba(0,0,0,0.6)", border: "4px solid #7D8696" }} />
      </div>
      {caption ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: mark }}>
          <div style={{ background: "rgba(255,255,255,0.93)", color: CL.ink, fontFamily: LABEL, fontWeight: 800, fontSize: 56, letterSpacing: 3, padding: "8px 30px", borderRadius: 14 }}>{caption}</div>
        </div>
      ) : null}
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};

export const ClPawl: React.FC<{ mode?: "flat" | "hill" | "rolling"; label?: string; bed?: string }> = ({ mode = "hill", label, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const cx = 860, cy = 560, R = 230, N = 14;
  const rot = mode === "rolling" ? f * 9 : 0;
  const drop = ease(clamp01((f - 8) / 12));
  const bounce = mode === "rolling" ? Math.abs(Math.sin((f * 9 * Math.PI) / (360 / N))) : 0;
  const pawlAng = 18 - 18 * drop + bounce * 14;                // grados que el dedito se levanta
  const strain = mode === "hill" ? clamp01((f - 24) / (T * 0.4)) : 0;
  const lab = label || (mode === "flat" ? "ON FLAT GROUND: FINE" : mode === "hill" ? "THE WHOLE CAR ON ONE LITTLE FINGER" : "PARK WHILE ROLLING: IT GRINDS");
  const col = mode === "flat" ? "#2E7D32" : CL.red;
  const lk = clamp01((f - T * 0.45) / 8);
  const teeth = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const x1 = cx + Math.cos(a - 0.12) * R, y1 = cy + Math.sin(a - 0.12) * R;
    const x2 = cx + Math.cos(a - 0.08) * (R + 48), y2 = cy + Math.sin(a - 0.08) * (R + 48);
    const x3 = cx + Math.cos(a + 0.08) * (R + 48), y3 = cy + Math.sin(a + 0.08) * (R + 48);
    const x4 = cx + Math.cos(a + 0.12) * R, y4 = cy + Math.sin(a + 0.12) * R;
    return `M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} L${x4} ${y4} Z`;
  });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={1021} dim={0.62} />
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ position: "absolute", inset: 0, background: "#1B1F27", padding: 0, overflow: "hidden" }}>
          <svg width={1400} height={860} viewBox="260 110 1400 860" style={{ position: "absolute", inset: 0 }}>
            <g transform={`rotate(${rot} ${cx} ${cy})`}>
              <circle cx={cx} cy={cy} r={R} fill="#8E96A4" stroke="#C7CDD6" strokeWidth={8} />
              {teeth.map((d, i) => <path key={i} d={d} fill="#9AA2AF" stroke="#C7CDD6" strokeWidth={4} />)}
              <circle cx={cx} cy={cy} r={70} fill="#5B6372" stroke="#C7CDD6" strokeWidth={6} />
            </g>
            {/* el dedito (pawl) pivotea en (1300, 300) y su punta cae en el hueco de arriba a la derecha */}
            <g transform={`rotate(${-pawlAng} 1330 290)`}>
              <path d={`M1330 270 L1330 310 L${cx + 200} ${cy - R - 20} L${cx + 160} ${cy - R - 70} Z`} fill={strain > 0.5 ? "#C98A5A" : "#B8BEC8"} stroke="#E3E6EA" strokeWidth={5} />
              <circle cx={1330} cy={290} r={22} fill="#5B6372" stroke="#E3E6EA" strokeWidth={5} />
            </g>
            {mode === "hill" ? (
              <g opacity={strain}>
                <path d={`M${cx - 380} ${cy + 60} L${cx - 380} ${cy + 230}`} stroke={CL.red} strokeWidth={22} />
                <path d={`M${cx - 420} ${cy + 220} L${cx - 380} ${cy + 290} L${cx - 340} ${cy + 220} Z`} fill={CL.red} />
                <text x={cx - 380} y={cy + 30} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={44} fill="#fff">3,000 LB</text>
              </g>
            ) : null}
            {mode === "rolling" && bounce > 0.85 ? Array.from({ length: 8 }, (_, i) => <circle key={i} cx={cx + 190 + rnd(f * 3 + i) * 60} cy={cy - R - 40 + rnd(f * 5 + i) * 50} r={5} fill="#FFD27A" />) : null}
          </svg>
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#C7CDD6" }}>PARKING PAWL</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `rotate(-2deg) scale(${1.4 - 0.4 * lk})`, opacity: lk, border: `8px solid ${col}`, color: col, background: "rgba(255,255,255,0.93)", fontFamily: LABEL, fontWeight: 800, fontSize: 52, letterSpacing: 3, padding: "6px 28px", borderRadius: 14 }}>{lab}</div>
      </div>
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
