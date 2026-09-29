// CalendarRipper — taco de almanaque de pared (uno por AÑO) colgado de un clavo; las hojas se arrancan
// (levantan, se curvan y caen) acelerando desde `from` hasta `to`. A la derecha la tarifa por cola vigente
// ese año (cambia con golpe), abajo una tira de línea de tiempo con los tramos de tarifa y un cabezal.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, MONO, HAND, HK, clamp, ease, easeInOut, rnd, lerp } from "../theme";

export type CalendarRipperProps = {
  from: number;
  to: number;
  rates: { from: number; label: string }[];
  caption?: string;
};

const Grain: React.FC<{ o?: number }> = ({ o = 0.22 }) => {
  const f = useCurrentFrame();
  return (
    <Img src={staticFile(`yc/grain/g${f % 8}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "overlay", opacity: o, pointerEvents: "none" }} />
  );
};

const PW = 470; // ancho hoja
const PH = 540; // alto hoja
const CX = 590; // centro X del almanaque
const TOPY = 150; // y del clavo

const rateIdx = (rates: { from: number }[], y: number) => {
  let k = 0;
  rates.forEach((r, i) => { if (y >= r.from) k = i; });
  return k;
};
const RATE_COL = [HK.mud, "#8C6A3A", HK.orange, HK.gold, HK.red];

const Page: React.FC<{ year: number; rate: string; style?: React.CSSProperties; lift?: number; shadowTop?: number }> = ({ year, rate, style, lift = 0, shadowTop = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, transformOrigin: "50% 0%", ...style }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#F4EEDF 0%,#EFE7D4 70%,#E6DCC5 100%)", boxShadow: "0 1px 0 rgba(0,0,0,0.25)" }} />
    {/* perforado */}
    <div style={{ position: "absolute", left: 10, right: 10, top: 8, height: 2, backgroundImage: "radial-gradient(circle, rgba(60,40,20,0.45) 1px, rgba(0,0,0,0) 1.5px)", backgroundSize: "7px 2px" }} />
    {/* banda roja */}
    <div style={{ position: "absolute", left: 22, right: 22, top: 28, height: 58, background: `linear-gradient(180deg, ${HK.red}, #A81B2E)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: 16, color: "#F7EFE3", paddingLeft: 16 }}>YEAR</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: SERIF, fontSize: 196, lineHeight: 1, color: HK.ink, letterSpacing: -4 }}>{year}</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 360, height: 2, background: "rgba(11,15,12,0.25)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 384, textAlign: "center", fontFamily: SANS, fontSize: 25, letterSpacing: 7, color: "#5b4630" }}>BOUNTY · {rate} PER TAIL</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: "rgba(11,15,12,0.45)" }}>JAN · FEB · MAR · … · DEC</div>
    {/* sombreado del rizo al levantar */}
    {lift > 0 && (
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${160 - lift * 20}deg, rgba(0,0,0,0) ${55 - lift * 25}%, rgba(255,255,255,${0.35 * lift}) ${68 - lift * 20}%, rgba(0,0,0,${0.35 * lift}) ${82 - lift * 15}%, rgba(0,0,0,${0.12 * lift}) 100%)` }} />
    )}
    {shadowTop > 0 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(20,12,4,${shadowTop}) 0%, rgba(20,12,4,${shadowTop * 0.3}) 60%, rgba(0,0,0,0) 100%)` }} />}
    {/* sombra de papel */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.18), rgba(0,0,0,0) 60%), linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,0.08))" }} />
  </div>
);

export const CalendarRipper: React.FC<CalendarRipperProps> = ({ from, to, rates, caption }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const N = Math.max(0, to - from);
  const t0 = 26;
  const t1 = Math.max(t0 + 30, Math.round(D * 0.6));
  const T = (i: number) => t0 + (t1 - t0) * Math.pow(i / Math.max(1, N), 0.62);
  const DUR = (i: number) => lerp(22, 11, i / Math.max(1, N));

  // hoja de arriba estática = primera no empezada
  let topIdx = N;
  for (let i = 0; i < N; i++) { if (frame < T(i)) { topIdx = i; break; } }
  const curYear = from + topIdx;
  // año VISIBLE: una hoja cuenta como arrancada cuando pasó el 35% de su animación
  const passF = (i: number) => T(i) + 0.35 * DUR(i);
  let passed = 0;
  let headVal = from;
  for (let i = 0; i < N; i++) { if (frame >= passF(i)) passed++; headVal += clamp((frame - passF(i)) / 6); }
  const visYear = from + passed;
  const ri = rateIdx(rates, visYear);
  const rate = rates[ri]?.label ?? "";
  // cuándo cambió la tarifa (para el golpe)
  const firstIdxOfRate = Math.max(0, (rates[ri]?.from ?? from) - from);
  const changeF = firstIdxOfRate === 0 ? 10 : passF(firstIdxOfRate - 1);
  const punch = clamp((frame - changeF) / 12);

  const tearing: number[] = [];
  for (let i = 0; i < N; i++) if (frame >= T(i) && frame < T(i) + DUR(i)) tearing.push(i);

  const done = frame >= T(N - 1) + DUR(N - 1);
  const doneF = T(N - 1) + DUR(N - 1);
  const fin = N === 0 ? 1 : ease((frame - doneF) / 18);

  const enter = ease(frame / 18);
  const tOut = clamp((frame - (D - 12)) / 12);
  const out = 1 - easeInOut(tOut);
  const drift = frame / Math.max(1, D);
  const camS = lerp(1.0, 1.045, easeInOut(drift)) + fin * 0.015;
  const stackN = N - topIdx; // hojas debajo

  // timeline
  const TLX0 = 170, TLX1 = 1750, TLY = 968;
  const yx = (y: number) => lerp(TLX0, TLX1, (y - from) / Math.max(1, N));
  const hx = yx(Math.min(headVal, to));

  const rangeLabel = (i: number) => {
    const r = rates[i];
    const nx = rates[i + 1];
    return nx ? `${r.from}–${nx.from - 1}` : `${r.from} → ${to}`;
  };

  return (
    <AbsoluteFill style={{ background: "#0e0b08", overflow: "hidden", opacity: out }}>
      <AbsoluteFill style={{ transform: `scale(${camS}) translate(${lerp(6, -6, drift)}px, ${lerp(4, -4, drift)}px)` }}>
        {/* pared de yeso con lámpara cálida arriba a la izquierda */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 75% at 32% 22%, #5a4a36 0%, #33291e 38%, #17120d 72%, #0b0907 100%)" }} />
        <AbsoluteFill style={{ opacity: 0.35, backgroundImage: "repeating-linear-gradient(93deg, rgba(255,255,255,0.025) 0 1px, rgba(0,0,0,0) 1px 9px), repeating-linear-gradient(4deg, rgba(0,0,0,0.05) 0 2px, rgba(0,0,0,0) 2px 13px)" }} />

        {/* ===== almanaque ===== */}
        <div style={{ position: "absolute", left: CX - 280, top: TOPY - 20, width: 560, height: 780, transform: `translateY(${(1 - enter) * -40}px) rotate(${lerp(-1.2, -0.6, drift)}deg)`, transformOrigin: "50% 20px", opacity: enter }}>
          {/* sombra del cartón en la pared */}
          {/* cordel */}
          <svg width={560} height={80} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M 180 70 L 280 18 L 380 70" stroke="#c9b48a" strokeWidth={3} fill="none" />
          </svg>
          {/* clavo */}
          <div style={{ position: "absolute", left: 270, top: 8, width: 20, height: 20, borderRadius: 10, background: "radial-gradient(circle at 35% 30%, #d8d2c4, #6f6a60 55%, #2a2722)", boxShadow: "3px 4px 5px rgba(0,0,0,0.6)" }} />
          {/* cartón de respaldo */}
          <div style={{ position: "absolute", left: 10, top: 60, width: 540, height: 680, borderRadius: 4, background: "linear-gradient(180deg,#4a3320,#3a2717 60%,#2f1f12)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.08), 0 2px 0 rgba(0,0,0,0.6), 24px 34px 50px rgba(0,0,0,0.6)" }}>
          </div>
          {/* pila de hojas (grosor) */}
          <div style={{ position: "absolute", left: 45, top: 150 }}>
            {Array.from({ length: Math.min(stackN, 30) }).map((_, j) => (
              <div key={j} style={{ position: "absolute", left: 0, top: PH + j * 1.6 - 2, width: PW, height: 2, background: j % 2 ? "#cfc3a8" : "#e2d8c0", boxShadow: "0 1px 0 rgba(0,0,0,0.25)" }} />
            ))}
            {/* hoja estática (la que se ve) */}
            <Page year={Math.min(curYear, to)} rate={rates[rateIdx(rates, Math.min(curYear, to))]?.label ?? ""}
              shadowTop={tearing.length ? 0.28 : 0}
              style={{ transform: done ? `scale(${1 + fin * 0.0})` : undefined }} />
            {/* hojas arrancándose */}
            {tearing.map((i) => {
              const u = (frame - T(i)) / DUR(i);
              const dir = rnd(i * 7 + 1) > 0.5 ? 1 : -1;
              const lu = clamp(u / 0.28);
              const v = clamp((u - 0.28) / 0.72);
              const rx = -38 * ease(lu) + 18 * v;
              const rz = dir * (3 * lu + 70 * v * v + 10 * v);
              const ty = 40 * lu + 1100 * v * v;
              const tx = dir * (30 * lu + 380 * v);
              const yr = from + i;
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, perspective: 900, zIndex: 10 + i }}>
                  <Page year={yr} rate={rates[rateIdx(rates, yr)]?.label ?? ""} lift={Math.max(ease(lu), 0.6 * (1 - v))}
                    style={{
                      transformOrigin: v > 0 ? `${dir > 0 ? 20 : 80}% 0%` : "50% 0%",
                      transform: `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateZ(${rz}deg) skewX(${dir * -6 * lu * (1 - v)}deg)`,
                      opacity: 1 - clamp((v - 0.75) / 0.25),
                      boxShadow: `0 ${20 + 40 * lu}px ${30 + 30 * lu}px rgba(0,0,0,${0.45 * lu})`,
                    }} />
                </div>
              );
            })}
          </div>
          {/* restos rotos en el perforado */}
          {topIdx > 0 && (
            <svg width={PW} height={16} style={{ position: "absolute", left: 45, top: 148, zIndex: 50 }}>
              <path d={`M0 0 L${PW} 0 L${PW} 4 ` + Array.from({ length: 40 }).map((_, j) => `L${PW - (j + 1) * (PW / 40)} ${4 + rnd(j * 3 + topIdx * 0) * 9}`).join(" ") + " Z"} fill="#e9e0cb" opacity={0.95} />
            </svg>
          )}
          {/* encuadernación metálica */}
          <div style={{ position: "absolute", left: 35, top: 118, width: PW + 20, height: 38, zIndex: 60, borderRadius: 3,
            background: "linear-gradient(180deg,#8a1c2a 0%,#6a1420 50%,#3f0b13 100%)", boxShadow: "0 5px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
            {[0.18, 0.5, 0.82].map((p, j) => (
              <div key={j} style={{ position: "absolute", left: `${p * 100}%`, top: 14, width: 26, height: 8, marginLeft: -13, borderRadius: 2, background: "linear-gradient(180deg,#e8e2d6,#8d877c)", boxShadow: "0 1px 1px rgba(0,0,0,0.5)" }} />
            ))}
          </div>
        </div>

        {/* ===== panel de tarifa ===== */}
        <div style={{ position: "absolute", left: 1040, top: 170, width: 760 }}>
          <div style={{ fontFamily: SANS, fontSize: 30, letterSpacing: 10, color: "rgba(241,235,221,0.7)", opacity: ease((frame - 6) / 14) }}>BOUNTY PER TAIL</div>
          <div style={{ width: 90, height: 3, background: HK.orange, marginTop: 14, transform: `scaleX(${ease((frame - 8) / 14)})`, transformOrigin: "0 50%" }} />
          <div style={{ position: "relative", height: 260, marginTop: 10 }}>
            <div style={{
              position: "absolute", left: -6, top: 0, fontFamily: SERIF, fontSize: 250, lineHeight: 1,
              color: punch < 1 ? `rgb(${lerp(255, 242, punch)},${lerp(122, 193, punch)},${lerp(26, 78, punch)})` : HK.gold,
              transform: `translateY(${(1 - ease(punch)) * 30}px) scale(${1 + 0.12 * (1 - ease(punch))})`, transformOrigin: "0 80%",
              opacity: ease((frame - 10) / 10),
              textShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 ${40 * (1 - punch)}px rgba(255,122,26,0.7)`,
            }}>{rate}</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 3, color: "rgba(241,235,221,0.75)", marginTop: 6, opacity: ease((frame - 12) / 10) }}>{rangeLabel(ri)}</div>
          {caption && (
            <div style={{ marginTop: 70, overflow: "hidden" }}>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 52, lineHeight: 1.12, letterSpacing: 4, color: HK.bone,
                clipPath: `inset(0 ${100 - fin * 100}% 0 0)`, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{caption}</div>
              <div style={{ height: 3, marginTop: 16, background: HK.orange, width: `${fin * 60}%` }} />
            </div>
          )}
        </div>

        {/* ===== tira de tarifas ===== */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: ease((frame - 10) / 16) }}>
          <div style={{ position: "absolute", left: TLX0 - 40, top: TLY - 64, width: TLX1 - TLX0 + 80, height: 128, borderRadius: 10, background: "linear-gradient(180deg, rgba(10,8,6,0.82), rgba(10,8,6,0.92))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
          {rates.map((r, i) => {
            const a = Math.max(from, r.from);
            const b = rates[i + 1] ? rates[i + 1].from : to + 1;
            if (b <= from || a > to) return null;
            const x0 = yx(a - 0.5 < from ? from : a - 0.5), x1 = yx(Math.min(b - 0.5, to));
            const on = hx >= x0 ? 1 : 0.28;
            const col = RATE_COL[i % RATE_COL.length];
            const fillW = clamp((hx - x0) / Math.max(1, x1 - x0));
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: x0 + 2, top: TLY - 8, width: x1 - x0 - 4, height: 16, borderRadius: 3, background: "rgba(241,235,221,0.08)" }} />
                <div style={{ position: "absolute", left: x0 + 2, top: TLY - 8, width: (x1 - x0 - 4) * fillW, height: 16, borderRadius: 3, background: `linear-gradient(180deg, ${col}, rgba(0,0,0,0.3)), ${col}`, boxShadow: `0 0 16px ${col}66` }} />
                <div style={{ position: "absolute", left: x0, width: x1 - x0, top: TLY - 54, textAlign: "center", fontFamily: SERIF, fontSize: 34, color: HK.bone, opacity: on }}>{r.label}</div>
              </React.Fragment>
            );
          })}
          {Array.from({ length: N + 1 }).map((_, j) => {
            const y = from + j;
            const major = j === 0 || j === N || rates.some((r) => r.from === y);
            return (
              <React.Fragment key={j}>
                <div style={{ position: "absolute", left: yx(y) - 1, top: TLY + 12, width: 2, height: major ? 14 : 7, background: `rgba(241,235,221,${major ? 0.7 : 0.3})` }} />
                {major && <div style={{ position: "absolute", left: yx(y) - 50, width: 100, top: TLY + 30, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "rgba(241,235,221,0.7)" }}>{y}</div>}
              </React.Fragment>
            );
          })}
          {/* cabezal */}
          <div style={{ position: "absolute", left: hx - 1.5, top: TLY - 22, width: 3, height: 44, background: HK.bone, boxShadow: "0 0 12px rgba(241,235,221,0.8)" }} />
          <div style={{ position: "absolute", left: hx - 8, top: TLY - 30, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `10px solid ${HK.bone}` }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
      <Grain o={0.24} />
    </AbsoluteFill>
  );
};
