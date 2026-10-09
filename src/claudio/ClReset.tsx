// Kit del RESET (Claudio Old Mechanic ep. 5 "omreset"), dentro del mundo (cama real + tarjeta con luz):
//   ClResetSeq    la secuencia de botones de un reset: cada paso es una tecla del auto que se aprieta (y se SOSTIENE `hold` s con su
//                 anillo que se llena) y después queda con su tilde · steps [{ label, key, hold? }] · title arriba
//                 key: "down" | "up" | "power" | "brake" | "key" | "fuse" | "wait" | "plug"
//   ClBrainMemory la "memoria" de la computadora del motor: barras de lo aprendido (combustible, ralentí, cambios) · mode "learn"
//                 (crecen con los días), "erase" (se vacían a FACTORY cuando se saca el cable) o "relearn" (vuelven a crecer con el manejo)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

type Step = { label: string; key?: string; hold?: number };
const KeyIcon: React.FC<{ k: string; down: number }> = ({ k, down }) => {
  const s = 1 - 0.08 * down;
  const arrow = (up: boolean) => (
    <svg width={120} height={120} viewBox="0 0 120 120"><path d={up ? "M60 22 L98 70 H72 V98 H48 V70 H22 Z" : "M60 98 L98 50 H72 V22 H48 V50 H22 Z"} fill="#E9ECF2" /></svg>
  );
  const body: Record<string, React.ReactNode> = {
    down: arrow(false), up: arrow(true),
    power: <svg width={120} height={120} viewBox="0 0 120 120"><path d="M60 18 V58" stroke="#E9ECF2" strokeWidth={12} strokeLinecap="round" /><path d="M38 34 A34 34 0 1 0 82 34" fill="none" stroke="#E9ECF2" strokeWidth={12} strokeLinecap="round" /></svg>,
    brake: <svg width={120} height={120} viewBox="0 0 120 120"><rect x={26} y={30} width={68} height={70} rx={14} fill="#E9ECF2" /><rect x={36} y={44} width={48} height={8} rx={4} fill="#2A303A" /><rect x={36} y={60} width={48} height={8} rx={4} fill="#2A303A" /><rect x={36} y={76} width={48} height={8} rx={4} fill="#2A303A" /></svg>,
    key: <svg width={120} height={120} viewBox="0 0 120 120"><circle cx={44} cy={60} r={22} fill="none" stroke="#E9ECF2" strokeWidth={10} /><path d="M64 60 H104 M90 60 V76 M100 60 V72" stroke="#E9ECF2" strokeWidth={10} strokeLinecap="round" /></svg>,
    fuse: <svg width={120} height={120} viewBox="0 0 120 120"><rect x={36} y={22} width={48} height={52} rx={8} fill={CL.yellow} /><rect x={44} y={74} width={10} height={26} fill="#C9CED8" /><rect x={66} y={74} width={10} height={26} fill="#C9CED8" /><text x={60} y={58} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={24} fill="#2A303A">15</text></svg>,
    wait: <svg width={120} height={120} viewBox="0 0 120 120"><circle cx={60} cy={62} r={38} fill="none" stroke="#E9ECF2" strokeWidth={9} /><path d="M60 62 V38 M60 62 L78 72" stroke="#E9ECF2" strokeWidth={9} strokeLinecap="round" /></svg>,
    plug: <svg width={120} height={120} viewBox="0 0 120 120"><rect x={30} y={40} width={60} height={40} rx={8} fill="#E9ECF2" /><rect x={40} y={22} width={10} height={20} fill="#E9ECF2" /><rect x={70} y={22} width={10} height={20} fill="#E9ECF2" /><path d="M60 80 V104" stroke="#E9ECF2" strokeWidth={10} /></svg>,
  };
  return <div style={{ transform: `scale(${s})`, width: 120, height: 120 }}>{body[k] || body.power}</div>;
};

export const ClResetSeq: React.FC<{ steps?: Step[]; title?: string; bed?: string }> = ({ steps = [{ label: "Hold DOWN", key: "down", hold: 3 }, { label: "Hold UP", key: "up", hold: 3 }], title = "The window relearn", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const n = steps.length, slot = (T * 0.82 - 10) / n;
  const W = Math.min(380, 1500 / n);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={931} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: "#fff", textShadow: "0 6px 18px rgba(0,0,0,0.6)", opacity: clamp01(p * 1.4), transform: `translateY(${(1 - p) * 30}px)` }}>{title}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 40 }}>
        {steps.map((st, i) => {
          const a = 10 + i * slot, k = clamp01((f - a + 8) / 10);
          const press = clamp01((f - a) / 6) * (1 - clamp01((f - a - slot * 0.8) / 6));
          const fill = clamp01((f - a) / (slot * 0.75));
          const done = clamp01((f - a - slot * 0.78) / 6);
          const R = 92, C = 2 * Math.PI * R;
          return (
            <div key={i} style={{ width: W, display: "flex", flexDirection: "column", alignItems: "center", opacity: clamp01(k * 1.4), transform: `translateY(${(1 - k) * 40}px)` }}>
              <div style={{ position: "relative", width: 220, height: 220 }}>
                <svg width={220} height={220} style={{ position: "absolute", inset: 0 }}>
                  <circle cx={110} cy={110} r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={14} />
                  <circle cx={110} cy={110} r={R} fill="none" stroke={done > 0.5 ? "#4CAF50" : CL.yellow} strokeWidth={14} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - fill)} transform="rotate(-90 110 110)" />
                </svg>
                <div style={{ position: "absolute", left: 30, top: 30, width: 160, height: 160, borderRadius: 34, background: "linear-gradient(180deg,#3A414E,#1E232C)", boxShadow: `0 ${14 - 10 * press}px ${26 - 16 * press}px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.15)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <KeyIcon k={st.key || "power"} down={press} />
                </div>
                {done > 0 ? <div style={{ position: "absolute", right: -6, top: -6, width: 70, height: 70, borderRadius: 35, background: "#4CAF50", color: "#fff", fontSize: 50, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${done})` }}>✓</div> : null}
              </div>
              <div style={{ marginTop: 26, fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: "#fff", textAlign: "center", textShadow: "0 4px 12px rgba(0,0,0,0.7)", lineHeight: 1.1 }}>{st.label}</div>
              {st.hold ? <div style={{ marginTop: 10, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CL.yellow, textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{`hold ${Math.min(st.hold, Math.ceil(fill * st.hold))} s`}</div> : null}
              <div style={{ position: "absolute", marginTop: 0 }} />
              <div style={{ marginTop: 6, fontFamily: LABEL, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.7)" }}>{`STEP ${i + 1}`}</div>
            </div>
          );
        })}
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

export const ClBrainMemory: React.FC<{ mode?: "learn" | "erase" | "relearn"; items?: string[]; bed?: string }> = ({ mode = "erase", items = ["Fuel trim", "Idle position", "Shift timing", "Window limits", "Radio stations"], bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const t = ease(clamp01((f - 12) / (T * 0.55)));
  const lvl = (i: number) => {
    const full = 0.62 + 0.3 * ((i * 37) % 10) / 10;
    if (mode === "learn") return full * clamp01(t * 1.3 - i * 0.06);
    if (mode === "erase") return full * (1 - clamp01(t * 1.4 - i * 0.05));
    return full * clamp01(t * 1.2 - i * 0.08);
  };
  const tag = mode === "erase" ? "FACTORY SETTINGS" : mode === "learn" ? "LEARNED FROM YOUR DRIVING" : "RELEARNING…";
  const tagK = mode === "erase" ? clamp01((f - 12 - T * 0.5) / 8) : lin(f, 10, 20);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={947} dim={0.6} />
      <div style={{ position: "absolute", left: 210, top: 120, right: 210, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ padding: "40px 60px 46px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>The engine computer's memory</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: CL.inkSoft }}>ECU · PCM</div>
          </div>
          <div style={{ marginTop: 26 }}>
            {items.map((it, i) => {
              const v = lvl(i);
              return (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 26, height: 96 }}>
                  <div style={{ width: 360, fontFamily: SERIF, fontWeight: 800, fontSize: 46, color: CL.ink }}>{it}</div>
                  <div style={{ flex: 1, height: 52, borderRadius: 12, background: hexA(CL.navy, 0.12), overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${v * 100}%`, height: "100%", borderRadius: 12, background: mode === "erase" ? `linear-gradient(90deg, ${hexA(CL.red, 0.6)}, ${CL.red})` : `linear-gradient(90deg, ${hexA(CL.nitrile, 0.6)}, ${CL.nitrile})` }} />
                    {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", top: 0, bottom: 0, left: `${(k + 1) * 100 / 13}%`, width: 3, background: "rgba(255,255,255,0.5)" }} />)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, textAlign: "center", opacity: tagK, transform: `scale(${1.3 - 0.3 * tagK})` }}>
            <span style={{ display: "inline-block", border: `7px solid ${mode === "erase" ? CL.red : CL.nitrile}`, color: mode === "erase" ? CL.red : CL.nitrile, fontFamily: LABEL, fontWeight: 800, fontSize: 52, letterSpacing: 5, padding: "4px 26px", borderRadius: 12, transform: "rotate(-3deg)" }}>{tag}</span>
          </div>
        </Card>
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
