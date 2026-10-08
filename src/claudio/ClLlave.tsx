// Kit de la LLAVE (Claudio Old Mechanic ep. 2 "omkey"), dentro del mundo (cama real + sombra + luz):
//   ClFobHold   la llave de Doris de frente: el botón que se SOSTIENE late, el pulgar lo aprieta, el anillo cuenta 1-5 s y aparece
//               el resultado (result). button: "unlock" | "lock" | "trunk" | "panic"; tap = lo que hace si sólo lo tocás (opcional)
//   ClCoinCell  la pila de la llave gigante: el número grabado se descifra (CR = pila de litio · 20 = 20 mm de ancho · 32 = 3,2 mm de
//               grueso) y al final la cuenta dealer vs farmacia (dealer / store)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, clamp01, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";

const FobBtn: React.FC<{ kind: string; x: number; y: number; hot: boolean; k: number; down?: number }> = ({ kind, x, y, hot, k, down = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${1 - 0.07 * down})`}>
    <circle r={62} fill={kind === "panic" ? "#C8352B" : "#2A2F38"} stroke={hot ? CL.yellow : "#11141A"} strokeWidth={hot ? 7 : 4} />
    <circle r={62} fill="url(#btnShine)" />
    {kind === "lock" || kind === "unlock" ? (
      <g stroke="#E9EDF5" strokeWidth={7} fill="none" strokeLinecap="round">
        <rect x={-22} y={-4} width={44} height={34} rx={6} fill="#E9EDF5" />
        <path d={kind === "lock" ? "M-14 -4 V-18 A14 14 0 0 1 14 -18 V-4" : "M-14 -4 V-18 A14 14 0 0 1 14 -18 V-26"} />
      </g>
    ) : kind === "trunk" ? (
      <g stroke="#E9EDF5" strokeWidth={6} fill="none" strokeLinejoin="round"><path d="M-30 14 H30 V-2 L18 -14 H-18 L-30 -2 Z" /><path d="M14 -14 L34 -34" /></g>
    ) : (
      <text x={0} y={11} textAnchor="middle" fill="#fff" fontFamily={LABEL} fontWeight={700} fontSize={28}>PANIC</text>
    )}
    {hot ? <circle r={62 + 14 + 10 * k} fill="none" stroke={hexA(CL.yellow, 0.5 * (1 - k))} strokeWidth={6} /> : null}
  </g>
);

export const ClFobHold: React.FC<{ button?: "unlock" | "lock" | "trunk" | "panic"; result: string; tap?: string; bed?: string }> = ({ button = "unlock", result, tap, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 12);
  const h0 = Math.round(T * 0.18), h1 = Math.round(T * 0.62);
  const hold = clamp01((f - h0) / (h1 - h0));
  const press = f >= h0 ? 1 : lin(f, h0 - 8, h0);
  const secs = Math.min(5, Math.max(1, Math.ceil(hold * 5)));
  const res = pop(f, fps, h1 + 2, 12);
  const BTN: Record<string, [number, number]> = { lock: [0, -150], unlock: [0, -10], trunk: [0, 130], panic: [0, 270] };
  const [bx, by] = BTN[button];
  const R = 92, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={713} dim={0.58} />
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `translateY(${(1 - p) * 120}px)`, opacity: clamp01(p * 1.4) }}>
        <defs>
          <radialGradient id="btnShine" cx="35%" cy="30%" r="70%"><stop offset="0%" stopColor="rgba(255,255,255,0.28)" /><stop offset="60%" stopColor="rgba(255,255,255,0)" /></radialGradient>
          <linearGradient id="fobBody" x1="0" x2="1"><stop offset="0%" stopColor="#1A1D23" /><stop offset="50%" stopColor="#30343C" /><stop offset="100%" stopColor="#15181D" /></linearGradient>
        </defs>
        <g transform="translate(620 560) scale(0.92)">
          <ellipse cx={30} cy={440} rx={200} ry={30} fill="rgba(0,0,0,0.35)" />
          <circle cx={0} cy={-330} r={44} fill="none" stroke="#9AA0A8" strokeWidth={14} />
          <rect x={-170} y={-300} width={340} height={700} rx={150} fill="url(#fobBody)" stroke="#0B0D10" strokeWidth={6} />
          <rect x={-150} y={-280} width={300} height={660} rx={135} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
          {(["lock", "unlock", "trunk", "panic"] as const).map((b) => <FobBtn key={b} kind={b} x={BTN[b][0]} y={BTN[b][1]} hot={b === button} k={(f % 24) / 24} down={b === button ? press : 0} />)}
          <circle cx={bx} cy={by} r={R} fill="none" stroke={hexA("#FFFFFF", 0.18)} strokeWidth={12} />
          <circle cx={bx} cy={by} r={R} fill="none" stroke={CL.yellow} strokeWidth={12} strokeDasharray={C} strokeDashoffset={C * (1 - hold)} transform={`rotate(-90 ${bx} ${by})`} strokeLinecap="round" />
          {press > 0 ? <circle cx={bx} cy={by} r={62} fill={hexA(CL.yellow, 0.22 * press)} stroke={CL.yellow} strokeWidth={4 * press} /> : null}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1000, top: 200, width: 820 }}>
        {tap ? (
          <div style={{ opacity: lin(f, 6, 14) * (1 - 0.55 * clamp01(hold * 3)), marginBottom: 18 }}>
            <Card style={{ padding: "16px 34px" }}>
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: CL.inkSoft }}>TAP · </span>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: CL.ink }}>{tap}</span>
            </Card>
          </div>
        ) : null}
        <div style={{ opacity: lin(f, h0 - 4, h0 + 4) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>HOLD</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, lineHeight: 1, color: CL.yellow, textShadow: "0 8px 24px rgba(0,0,0,0.55)" }}>{secs}<span style={{ fontSize: 110 }}> s</span></div>
        </div>
        <div style={{ marginTop: 26, transform: `scale(${0.7 + 0.3 * res})`, transformOrigin: "0% 50%", opacity: clamp01(res * 1.3) }}>
          <Card style={{ padding: "22px 38px", borderLeft: `14px solid ${CL.nitrile}` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 68, lineHeight: 1.05, color: CL.ink }}>{result}</div>
          </Card>
        </div>
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

export const ClCoinCell: React.FC<{ code?: string; dealer?: string; store?: string; bed?: string }> = ({ code = "CR2032", dealer = "$65", store = "$3", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 12);
  const parts: [string, string, number][] = [[code.slice(0, 2), "lithium coin cell", 0.2], [code.slice(2, 4), `${code.slice(2, 4)} mm wide`, 0.32], [code.slice(4), `${code.slice(4, 5)}.${code.slice(5) || "0"} mm thick`, 0.44]];
  const lit = (i: number) => (i < 2 ? f > T * 0.2 && f < T * 0.32 : i < 4 ? f > T * 0.32 && f < T * 0.44 : f > T * 0.44 && f < T * 0.6);
  const pr = pop(f, fps, Math.round(T * 0.62), 12);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={727} dim={0.55} />
      <div style={{ position: "absolute", left: 600 - 320, top: 540 - 320 + 40, width: 640, height: 640 }}>
        <div style={{ position: "absolute", left: 40, top: 60, width: 640, height: 640, borderRadius: "50%", background: "rgba(0,0,0,0.4)", filter: "blur(30px)", opacity: p }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", transform: `rotate(${(1 - p) * -90}deg) scale(${0.6 + 0.4 * p})`,
          background: "radial-gradient(circle at 34% 30%, #FFFFFF 0%, #DADDE2 18%, #A9AEB6 46%, #7E848D 72%, #5D626A 100%)", boxShadow: "inset 0 0 0 18px rgba(255,255,255,0.18), inset 0 0 0 26px rgba(0,0,0,0.12)" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: "rgba(40,44,52,0.55)", marginBottom: -6 }}>+</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 132, letterSpacing: 4, color: "rgba(36,40,48,0.72)", textShadow: "0 2px 0 rgba(255,255,255,0.6)" }}>
              {code.split("").map((ch, i) => <span key={i} style={{ color: lit(i) ? CL.nitrile : undefined }}>{ch}</span>)}
            </div>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: "rgba(36,40,48,0.55)" }}>3V LITHIUM</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 190, width: 800 }}>
        {parts.map(([a, b, at], i) => {
          const k = pop(f, fps, Math.round(T * at), 12);
          return (
            <div key={i} style={{ opacity: clamp01(k * 1.3), transform: `translateX(${(1 - k) * 60}px)`, marginBottom: 22 }}>
              <Card style={{ display: "flex", alignItems: "center", gap: 30, padding: "16px 34px" }}>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: CL.nitrile, minWidth: 120 }}>{a}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: CL.ink }}>{b}</div>
              </Card>
            </div>
          );
        })}
        <div style={{ marginTop: 20, opacity: clamp01(pr * 1.3), transform: `scale(${0.8 + 0.2 * pr})`, transformOrigin: "0% 50%", display: "flex", gap: 22 }}>
          <Card style={{ padding: "16px 30px", borderLeft: `12px solid ${CL.red}` }}>
            <div style={{ fontFamily: LABEL, fontSize: 30, letterSpacing: 4, color: CL.inkSoft }}>DEALER</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CL.red, textDecoration: `line-through ${hexA(CL.red, 0.8)} 7px` }}>{dealer}</div>
          </Card>
          <Card style={{ padding: "16px 30px", borderLeft: `12px solid ${CL.nitrile}` }}>
            <div style={{ fontFamily: LABEL, fontSize: 30, letterSpacing: 4, color: CL.inkSoft }}>DRUGSTORE</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CL.navy }}>{store}</div>
          </Card>
        </div>
      </div>
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};
