// StvSeasonCalendar — el calendario de preparación de la temporada (oct → dic), hoja de cocinero sobre la pared de troncos.
// PAGO del cierre: «October, stack your wood and check the meter… before the first cold have the chimney looked at… test the alarms».
// Props: months = [{name, items[], at}] — las tildes se marcan a lápiz una por una. Sin texto quemado.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, LABEL, HAND, woodBg, notebookBg, hexA } from "./OleTheme";
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const StvSeasonCalendar: React.FC<{ months?: { name: string; items: string[]; at: number }[] }> = ({ months = [
  { name: "OCTOBER", items: ["Stack the wood", "Check it with the meter"], at: 0.5 },
  { name: "BEFORE THE COLD", items: ["Have the chimney inspected"], at: 2.4 },
  { name: "NOVEMBER", items: ["Test the alarms"], at: 3.8 },
  { name: "ALL WINTER", items: ["Flashlight on the pipe, monthly"], at: 5.2 },
] }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  return (
    <AbsoluteFill style={woodBg("#8A6A44")}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${hexA("#FFE8B8", 0.35)}, transparent 62%)` }} />
      <div style={{ position: "absolute", left: 300, top: 70, width: 1320, height: 940, transform: "rotate(-1.2deg)", boxShadow: "0 26px 60px rgba(20,10,4,0.5)", ...notebookBg(OLE.paper, 62) }}>
        <div style={{ position: "absolute", left: 130, top: 40, right: 60, fontFamily: HAND, fontSize: 60, color: OLE.pencil, fontWeight: 700 }}>
          {months.map((m, mi) => {
            const a = c01((t - m.at) / 0.5);
            return (
              <div key={mi} style={{ opacity: a, transform: `translateY(${(1 - ease(a)) * 24}px)`, marginBottom: 28 }}>
                <div style={{ fontFamily: LABEL, fontSize: 44, letterSpacing: 6, color: OLE.plaid }}>{m.name}</div>
                {m.items.map((it, k) => {
                  const ck = c01((t - m.at - 0.5 - k * 0.5) / 0.35);
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", height: 74 }}>
                      <svg width="60" height="60" viewBox="0 0 60 60" style={{ marginRight: 22 }}><rect x="6" y="6" width="48" height="48" rx="6" fill="none" stroke={OLE.pencil} strokeWidth="4" /><path d="M14 32 L26 44 L52 12" fill="none" stroke="#2F7A45" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - ck)} /></svg>
                      <span>{it}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
export default StvSeasonCalendar;
