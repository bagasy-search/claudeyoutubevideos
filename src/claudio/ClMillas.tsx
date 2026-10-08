// Kit de las MILLAS (Claudio Old Mechanic ep. 3 "om500k"), dentro del mundo (cama real + sombra + luz):
//   ClOdoRace     dos odómetros del mismo auto: el de la izquierda se frena en `a` (sello SCRAPYARD), el de la derecha sigue hasta `b`
//                 (sello STILL DRIVING) · labelA / labelB debajo
//   ClFluidClock  los líquidos que vencen por CALENDARIO: una regla de años 0-5 y una barra por líquido que se llena hasta su año
//                 (items [{ name, years, color? }]) · title arriba
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

const fmt = (n: number) => Math.round(n).toString().padStart(6, "0");
const Odo: React.FC<{ value: number; x: number; y: number; stamp?: string; stampColor?: string; stampK?: number; label: string; k: number }> = ({ value, x, y, stamp, stampColor = CL.red, stampK = 0, label, k }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 720, opacity: clamp01(k * 1.3), transform: `translateY(${(1 - k) * 60}px)` }}>
    <div style={{ background: "linear-gradient(180deg,#14171D,#07080B)", borderRadius: 26, padding: "34px 30px 26px", boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 6px #2A2F38" }}>
      <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: "#8E97A8", textAlign: "center", marginBottom: 14 }}>ODOMETER · MILES</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {fmt(value).split("").map((d, i) => (
          <div key={i} style={{ width: 92, height: 132, borderRadius: 10, background: i < 3 ? "#1E232C" : "#232833", border: "2px solid #3A404C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 104, color: "#F2C230", textShadow: "0 0 18px rgba(242,194,48,0.45)" }}>{d}</div>
        ))}
      </div>
    </div>
    <div style={{ marginTop: 22, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 50, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>{label}</div>
    {stamp ? (
      <div style={{ position: "absolute", left: "50%", top: 330, transform: `translateX(-50%) rotate(-6deg) scale(${1.6 - 0.6 * stampK})`, opacity: stampK, border: `8px solid ${stampColor}`, color: stampColor, fontFamily: LABEL, fontWeight: 800, fontSize: 58, letterSpacing: 6, padding: "6px 26px", borderRadius: 12, background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>{stamp}</div>
    ) : null}
  </div>
);

export const ClOdoRace: React.FC<{ a?: number; b?: number; labelA?: string; labelB?: string; bed?: string }> = ({ a = 130000, b = 500000, labelA = "Owner A", labelB = "Owner B", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const kA = pop(f, fps, 0, 13), kB = pop(f, fps, 6, 13);
  const run = ease(clamp01((f - 10) / (T * 0.62)));
  const vA = Math.min(a, b * run), vB = b * run;
  const stopA = clamp01((b * run - a) / (b * 0.06));
  const endB = clamp01((f - (10 + T * 0.62)) / 8);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={811} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.6)", opacity: lin(f, 2, 12) }}>SAME CAR · SAME ENGINE</div>
      <Odo value={vA} x={150} y={300} label={labelA} k={kA} stamp="SCRAPYARD" stampColor={CL.red} stampK={stopA} />
      <Odo value={vB} x={1050} y={300} label={labelB} k={kB} stamp="STILL DRIVING" stampColor={CL.nitrile} stampK={endB} />
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

export const ClFluidClock: React.FC<{ title?: string; items?: { name: string; years: number; color?: string }[]; bed?: string }> = ({ title = "On the calendar, not the odometer", items = [{ name: "Brake fluid", years: 2 }, { name: "Coolant", years: 5 }], bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 13);
  const X0 = 520, W = 1180, Y0 = 430, MAXY = 5;
  const cols = [CL.red, CL.navy, CL.nitrile];
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={823} dim={0.6} />
      <div style={{ position: "absolute", left: 120, top: 150, right: 120, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 40}px)` }}>
        <Card style={{ padding: "40px 56px 50px", height: 720 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: CL.ink }}>{title}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CL.nitrile, marginTop: 4, opacity: lin(f, 10, 20) }}>even if the car sits in the garage</div>
        </Card>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.3) }}>
        {Array.from({ length: MAXY + 1 }, (_, i) => {
          const x = X0 + (W * i) / MAXY;
          return (
            <g key={i} opacity={lin(f, 6 + i * 3, 14 + i * 3)}>
              <line x1={x} y1={Y0 + 40} x2={x} y2={Y0 + 120 + items.length * 150} stroke={hexA(CL.ink, 0.18)} strokeWidth={3} strokeDasharray="8 10" />
              <text x={x} y={Y0 + 20} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} fill={CL.inkSoft}>{i === 0 ? "TODAY" : `${i} YR`}</text>
            </g>
          );
        })}
      </svg>
      {items.map((it, i) => {
        const at = 14 + i * Math.round(T * 0.2);
        const g = ease(clamp01((f - at) / (T * 0.22)));
        const y = Y0 + 70 + i * 150, w = (W * it.years / MAXY) * g, c = it.color || cols[i % cols.length];
        const done = clamp01((f - at - T * 0.22) / 8);
        return (
          <React.Fragment key={it.name}>
            <div style={{ position: "absolute", left: 190, top: y + 14, width: 310, fontFamily: SERIF, fontWeight: 800, fontSize: 52, color: CL.ink, opacity: lin(f, at - 6, at + 4) }}>{it.name}</div>
            <div style={{ position: "absolute", left: X0, top: y, width: w, height: 96, borderRadius: 14, background: `linear-gradient(90deg, ${hexA(c, 0.55)}, ${c})`, boxShadow: `0 10px 22px ${hexA(c, 0.35)}` }} />
            <div style={{ position: "absolute", left: X0 + (W * it.years) / MAXY - 330, top: y + 18, width: 310, textAlign: "right", whiteSpace: "nowrap", fontFamily: LABEL, fontWeight: 800, fontSize: 50, color: "#fff", opacity: done }}>{`EVERY ${it.years} YR`}</div>
          </React.Fragment>
        );
      })}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
