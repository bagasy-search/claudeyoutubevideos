// Componentes del video del SARRO (reusables por el canal), todos DENTRO del mundo (cama real del baño/mesada/escritorio, sombra, luz):
//   ClPumiceTest  la piedra pómez sobre la porcelana: SECA (polvo + rayitas) vs MOJADA (desliza, el anillo se borra detrás)
//   ClPasteRecipe la pasta 3 a 1 en un bowl de vidrio sobre la mesada: 3 cucharadas de bicarbonato + 1 de agua oxigenada, se revuelve
//   ClNotebook    la libreta del gerente sobre el escritorio del hotel: renglones a mano; strike = la birome roja tacha "cambiar"
//   ClVideoRef    la CADENA del canal: una polaroid con la miniatura de otro video pegada en el azulejo ("ya en el canal" / "próximo video")
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, Tape, lin, pop, useOut } from "./ClParts";

// ───────────────── ClPumiceTest
const Pumice: React.FC<{ x: number; y: number; rot?: number; wet?: boolean }> = ({ x, y, rot = -8, wet }) => (
  <svg width={250} height={170} viewBox="0 0 250 170" style={{ position: "absolute", left: x - 125, top: y - 85, rotate: `${rot}deg`, filter: "drop-shadow(0 14px 14px rgba(19,29,53,0.35))" }}>
    <defs>
      <radialGradient id={`pg${wet ? 1 : 0}`} cx="40%" cy="35%" r="75%"><stop offset="0" stopColor={wet ? "#9C9890" : "#C9C4B9"} /><stop offset="1" stopColor={wet ? "#6E6A62" : "#8F897C"} /></radialGradient>
    </defs>
    <path d="M18 60 Q10 20 60 14 L190 10 Q238 14 236 62 L232 120 Q228 158 186 158 L58 160 Q16 156 16 118 Z" fill={`url(#pg${wet ? 1 : 0})`} />
    {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={28 + rnd(i) * 196} cy={22 + rnd(i + 99) * 128} r={1.5 + rnd(i + 7) * 4.5} fill={wet ? "#4E4A43" : "#6F695D"} opacity={0.55 + 0.4 * rnd(i + 3)} />)}
    {wet ? <path d="M40 30 Q110 18 200 26" stroke="rgba(255,255,255,0.55)" strokeWidth={7} fill="none" strokeLinecap="round" /> : null}
  </svg>
);
const Panel: React.FC<{ x: number; wet: boolean; t0: number }> = ({ x, wet, t0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig();
  const W = 760, H = 560, u = clamp01((f - t0) / Math.max(1, T * 0.62));
  const sx = 120 + (W - 240) * (0.5 + 0.5 * Math.sin(u * Math.PI * 5 - Math.PI / 2));
  const erased = wet ? u : 0; // el anillo se borra detrás de la piedra mojada
  const scratches = wet ? 0 : Math.floor(u * 26);
  const k = lin(f, t0 - 8, t0 + 4);
  return (
    <div style={{ position: "absolute", left: x, top: 220, width: W, height: H, opacity: k, translate: `0 ${(1 - k) * 40}px` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden", boxShadow: `0 26px 56px ${CL.shadow}`, background: "linear-gradient(170deg, #FFFFFF 0%, #F1EFEA 55%, #E6E3DC 100%)", border: `10px solid ${CL.white}` }}>
        {/* brillo del esmalte */}
        <div style={{ position: "absolute", left: -80, top: 40, width: W + 160, height: 90, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))", rotate: "-6deg" }} />
        {/* el anillo marrón (se borra con la piedra mojada) */}
        <div style={{ position: "absolute", left: 0, top: 250, width: W, height: 90, background: "linear-gradient(180deg, rgba(123,74,34,0) 0%, rgba(123,74,34,0.85) 30%, rgba(92,55,24,0.9) 60%, rgba(123,74,34,0) 100%)", clipPath: `inset(0 0 0 ${erased * 100}%)` }} />
        {wet ? <div style={{ position: "absolute", left: 0, top: 250, width: `${erased * 100}%`, height: 90, background: "linear-gradient(180deg, rgba(200,195,185,0) 0%, rgba(200,195,185,0.35) 50%, rgba(200,195,185,0) 100%)" }} /> : null}
        {/* agua: película y gotas */}
        {wet ? <>{Array.from({ length: 34 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * W, top: rnd(i + 40) * H, width: 10 + rnd(i + 3) * 22, height: 8 + rnd(i + 5) * 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(170,205,230,0.35) 60%, rgba(120,160,190,0.15))" }} />)}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(190,220,240,0.12), rgba(255,255,255,0) 60%)" }} /></> : null}
        {/* rayitas finas de la piedra seca */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: scratches }, (_, i) => { const y0 = 150 + rnd(i) * 300, x0 = 60 + rnd(i + 9) * 300, L = 220 + rnd(i + 4) * 280; return <line key={i} x1={x0} y1={y0} x2={x0 + L} y2={y0 - 18 + rnd(i + 2) * 36} stroke="#8D8A84" strokeWidth={1.6 + rnd(i + 6) * 1.6} opacity={0.75} strokeLinecap="round" />; })}
          {!wet ? Array.from({ length: 40 }, (_, i) => { const t = ((f * 0.04 + rnd(i)) % 1); return <circle key={"d" + i} cx={sx + (rnd(i + 3) - 0.5) * 300 * t} cy={300 - 120 * t + (rnd(i + 8) - 0.5) * 60} r={2 + rnd(i + 1) * 3} fill="#B5AFA2" opacity={(1 - t) * 0.9} />; }) : null}
        </svg>
        <Pumice x={sx} y={300} wet={wet} rot={-8 + 6 * Math.sin(u * 20)} />
      </div>
      <div style={{ position: "absolute", left: 30, top: -46, background: wet ? CL.navy : CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 3, padding: "6px 30px", borderRadius: 12, boxShadow: `0 12px 26px ${CL.shadow}` }}>{wet ? "MOJADA" : "SECA"}</div>
      <div style={{ position: "absolute", right: 30, bottom: -40, opacity: lin(f, t0 + T * 0.35, t0 + T * 0.45), background: CL.white, color: wet ? CL.navy : CL.red, fontFamily: HAND, fontWeight: 700, fontSize: 62, padding: "0 26px", borderRadius: 14, boxShadow: `0 12px 26px ${CL.shadow}` }}>{wet ? "desliza, no raya" : "raya para siempre"}</div>
    </div>
  );
};
export const ClPumiceTest: React.FC<{ only?: "dry" | "wet"; bed?: string }> = ({ only, bed }) => {
  const out = useOut(6);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={31} dim={0.42} />
      {only !== "wet" ? <Panel x={only === "dry" ? 580 : 150} wet={false} t0={6} /> : null}
      {only !== "dry" ? <Panel x={only === "wet" ? 580 : 1010} wet t0={only === "wet" ? 6 : 16} /> : null}
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClPasteRecipe
export const ClPasteRecipe: React.FC<{ a?: number; b?: number; aLabel?: string; bLabel?: string; note?: string; bed?: string }> = ({ a = 3, b = 1, aLabel = "bicarbonato", bLabel = "agua oxigenada", note = "como pasta de dientes", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(10, Math.round(T * 0.42 / (a + b)));
  const spoonAt = (i: number) => 10 + i * per;
  const nA = Array.from({ length: a }, (_, i) => f >= spoonAt(i) + per * 0.6).filter(Boolean).length;
  const nB = Array.from({ length: b }, (_, i) => f >= spoonAt(a + i) + per * 0.6).filter(Boolean).length;
  const stir = clamp01((f - spoonAt(a + b)) / Math.max(1, T * 0.25));
  const cur = Math.min(a + b - 1, Math.floor((f - 10) / per));
  const cx = 760, cy = 650;
  const powder = nA / a, liquid = nB / b;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={41} dim={0.3} />
      <Contact x={cx} y={cy + 150} w={640} o={0.38} />
      {/* bowl de vidrio */}
      <svg width={760} height={420} viewBox="0 0 760 420" style={{ position: "absolute", left: cx - 380, top: cy - 230 }}>
        <defs><linearGradient id="glassB" x1="0" x2="1"><stop offset="0" stopColor="rgba(220,235,245,0.55)" /><stop offset="0.5" stopColor="rgba(255,255,255,0.25)" /><stop offset="1" stopColor="rgba(200,220,235,0.55)" /></linearGradient></defs>
        <path d="M60 110 Q70 380 380 390 Q690 380 700 110 Z" fill="url(#glassB)" stroke="rgba(150,175,195,0.8)" strokeWidth={5} />
        {/* contenido: polvo blanco que crece, se vuelve pasta lisa al revolver */}
        <path d={`M ${150 - 20 * powder} ${330 - 120 * powder} Q 380 ${300 - 200 * powder - 30 * (1 - stir)} ${610 + 20 * powder} ${330 - 120 * powder} Q 560 380 380 382 Q 200 380 ${150 - 20 * powder} ${330 - 120 * powder} Z`} fill={stir > 0.5 ? "#F4F1EA" : "#FBFBF9"} opacity={powder > 0 ? 1 : 0} />
        {liquid > 0 ? <ellipse cx={380} cy={300 - 120 * powder + 40} rx={110 * (1 - stir * 0.8)} ry={30 * (1 - stir * 0.8)} fill="rgba(190,215,235,0.75)" /> : null}
        {stir > 0 ? <path d={`M ${380 + 140 * Math.cos(stir * 18)} ${280 + 40 * Math.sin(stir * 18)} A 140 40 0 1 1 ${380 + 140 * Math.cos(stir * 18 + 3)} ${280 + 40 * Math.sin(stir * 18 + 3)}`} stroke="#E2DCCF" strokeWidth={10} fill="none" strokeLinecap="round" /> : null}
        <ellipse cx={380} cy={110} rx={320} ry={46} fill="none" stroke="rgba(150,175,195,0.9)" strokeWidth={6} />
        <path d="M120 140 Q130 300 240 360" stroke="rgba(255,255,255,0.8)" strokeWidth={10} fill="none" strokeLinecap="round" />
      </svg>
      {/* la cuchara que entra y vuelca */}
      {cur >= 0 && f < spoonAt(a + b) + 4 ? (() => { const t = clamp01((f - spoonAt(cur)) / per), isB = cur >= a; const dip = Math.sin(Math.PI * t);
        return (<div style={{ position: "absolute", left: cx - 40 + 120 * (1 - dip), top: cy - 420 + 230 * dip, rotate: `${-30 + 70 * clamp01((t - 0.35) / 0.4)}deg`, transformOrigin: "20% 50%" }}>
          <svg width={360} height={110} viewBox="0 0 360 110"><rect x={110} y={44} width={250} height={22} rx={11} fill="#B9BEC5" /><ellipse cx={70} cy={55} rx={70} ry={40} fill="#C9CED5" stroke="#9DA3AB" strokeWidth={4} />
            {t < 0.55 ? <ellipse cx={70} cy={48} rx={56} ry={26} fill={isB ? "rgba(190,215,235,0.95)" : "#FFFFFF"} /> : null}</svg>
        </div>); })() : null}
      {/* la cuenta: cucharadas */}
      <div style={{ position: "absolute", left: 1240, top: 230, opacity: lin(f, 6, 16) }}>
        <Card style={{ padding: "34px 44px", width: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.ink, lineHeight: 1 }}>{Math.max(nA, 0)}<span style={{ color: CL.inkSoft, fontSize: 70 }}>/{a}</span></div>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 40, color: CL.ink, lineHeight: 1.05 }}>cucharadas de<br />{aLabel}</div>
          </div>
          <div style={{ height: 3, background: CL.grout, margin: "18px 0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: nA >= a ? 1 : 0.35 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 120, color: CL.brown, lineHeight: 1 }}>{nB}<span style={{ color: CL.inkSoft, fontSize: 70 }}>/{b}</span></div>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 40, color: CL.ink, lineHeight: 1.05 }}>cucharada de<br />{bLabel}</div>
          </div>
        </Card>
        <div style={{ marginTop: 26, display: "flex", gap: 22, alignItems: "center", opacity: lin(f, spoonAt(a + b), spoonAt(a + b) + 10), scale: String(0.8 + 0.2 * pop(f, fps, spoonAt(a + b))) }}>
          <div style={{ background: CL.yellow, color: CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 92, padding: "0 30px", borderRadius: 14, boxShadow: `0 14px 30px ${CL.shadow}` }}>{a} : {b}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.navy, lineHeight: 1 }}>{note}</div>
        </div>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ───────────────── ClNotebook
export const ClNotebook: React.FC<{ title?: string; rows: { k: string; v: string }[]; strike?: boolean; note?: string; bed?: string }> = ({ title = "3er piso", rows, strike, note, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(12, Math.round(T * (strike ? 0.5 : 0.65) / rows.length));
  const ink = "#1F3A8A";
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={51} dim={0.22} />
      <div style={{ position: "absolute", left: 560, top: 110, width: 820, height: 880, perspective: 1800 }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(26deg) rotateZ(-4deg)", transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", inset: 0, background: "#FFFDF6", borderRadius: 10, boxShadow: `0 40px 70px ${CL.shadow}, 0 4px 8px rgba(0,0,0,0.15)`, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 86px, #BFD3EA 86px 89px)", backgroundPosition: "0 150px" }}>
            <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "#E8A3A3" }} />
            {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 50 + i * 72, top: -26, width: 34, height: 52, borderRadius: 18, border: "6px solid #8D939B", borderBottomColor: "transparent" }} />)}
            <div style={{ position: "absolute", left: 150, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: ink, opacity: lin(f, 2, 10) }}>{title}</div>
            {rows.map((r, i) => {
              const t0 = strike ? 0 : 10 + i * per, wk = strike ? 1 : clamp01((f - t0) / (per * 0.8));
              const s0 = 12 + i * per, sk = strike ? ease(clamp01((f - s0) / (per * 0.6))) : 0;
              return (
                <div key={i} style={{ position: "absolute", left: 150, top: 170 + i * 178, height: 120, display: "flex", alignItems: "flex-end", gap: 50 }}>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 92, color: ink, clipPath: `inset(0 ${100 - Math.min(100, wk * 230)}% 0 0)` }}>{r.k}</div>
                  <div style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: 92, color: ink, clipPath: `inset(0 ${100 - clamp01(wk * 2.3 - 1.3) * 100}% 0 0)` }}>
                    {r.v}
                    {strike ? <svg width={380} height={60} style={{ position: "absolute", left: -20, top: 40, overflow: "visible" }}><path d={`M 0 30 Q 95 ${18 + 10 * rnd(i)} 190 32 T ${380 * sk} 26`} stroke={CL.red} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - sk)} /></svg> : null}
                  </div>
                  {strike && sk > 0.95 ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: CL.red, rotate: "-8deg", opacity: lin(f, s0 + per * 0.6, s0 + per * 0.8) }}>blanco ✓</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {note ? <div style={{ position: "absolute", right: 130, bottom: 120, opacity: lin(f, T * 0.6, T * 0.7), background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 46, letterSpacing: 2, padding: "10px 28px", borderRadius: 12, textTransform: "uppercase", boxShadow: `0 14px 30px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{note}</div> : null}
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClVideoRef: la cadena de videos del canal
export const ClVideoRef: React.FC<{ thumb: string; title: string; tag?: string; next?: boolean; bed?: string }> = ({ thumb, title, tag, next, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 4, 12);
  const bar = clamp01((f - 14) / Math.max(1, T * 0.7));
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={61} dim={0.3} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", rotate: `${interpolate(p, [0, 1], [-14, -3])}deg`, scale: String(interpolate(p, [0, 1], [0.6, 1])) }}>
        <div style={{ background: "#FFFFFF", padding: "26px 26px 110px", borderRadius: 8, boxShadow: `0 40px 70px ${CL.shadow}, 0 4px 10px rgba(0,0,0,0.15)` }}>
          <div style={{ position: "relative", width: 1088, height: 612, overflow: "hidden", borderRadius: 4 }}>
            <Img src={staticFile(thumb)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", width: 150, height: 104, borderRadius: 30, background: "rgba(214,40,40,0.92)", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.05 * Math.sin(f * 0.25)) }}>
              <div style={{ width: 0, height: 0, borderTop: "28px solid transparent", borderBottom: "28px solid transparent", borderLeft: "46px solid #fff", marginLeft: 10 }} />
            </div>
            <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${bar * 100}%`, background: "#E33" }} />
          </div>
          <div style={{ position: "absolute", left: 40, bottom: 26, right: 40, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        </div>
        <Tape x={480} y={-22} rot={-4} w={170} />
        <div style={{ position: "absolute", right: -40, top: -50, rotate: "6deg", background: next ? CL.yellow : CL.navy, color: next ? CL.ink : "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 3, padding: "8px 30px", borderRadius: 12, boxShadow: `0 14px 30px ${CL.shadow}`, opacity: lin(f, 10, 18) }}>{tag || (next ? "PRÓXIMO VIDEO" : "YA EN EL CANAL")}</div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
