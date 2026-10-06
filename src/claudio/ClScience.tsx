// "Lo que pasa adentro" del kit Claudio, dibujado como el objeto real (porcelana, agujeros, botellas), nunca número sobre negro:
//   ClRimJets        vista desde abajo del borde: la fila de agujeros con la mugre; mode dirty | grow | spray | fizz
//   ClBleachVsRoots  lupa sobre el borde: corte de la costra porosa; la lejía blanquea arriba y las raíces siguen (phase bleach|roots)
//   ClNeverMix       dos botellas que se acercan → cruz roja + sello (a, b, verdict); soft = "días distintos" (celeste); chart = tabla
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { CL, SERIF, LABEL, HAND, hexA, rnd, clamp01 } from "./ClTheme";
import { Bed, Card, Stamp, Tape, lin, pop, useOut } from "./ClParts";

const HOLES = 9;
export const ClRimJets: React.FC<{ mode?: "dirty" | "grow" | "spray" | "fizz"; label?: string }> = ({ mode = "dirty", label }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const holes = Array.from({ length: HOLES }, (_, i) => { const t = i / (HOLES - 1) - 0.5; return { x: 960 + t * 1500, y: 300 + t * t * 260, s: 1 - Math.abs(t) * 0.55 }; });
  const grow = mode === "grow" ? lin(f, 6, T * 0.8) : 1;
  const wet = mode === "spray" ? lin(f, T * 0.25, T * 0.6) : mode === "fizz" ? 1 : 0;
  const fz = mode === "fizz" ? lin(f, 4, T * 0.7) : 0;
  const slime = 1 - clamp01(fz * 1.3 - 0.3);
  const pan = interpolate(f, [0, T], [-30, 30]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#E9EEF1 0%, #FFFFFF 38%, #F3F5F6 70%, #DCE6EC 100%)", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, translate: `${pan}px 0` }}>
        <defs>
          <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.7" stopColor="#EEF2F4" /><stop offset="1" stopColor="#D5DEE3" /></linearGradient>
          <radialGradient id="holeG"><stop offset="0" stopColor="#0E0D0A" /><stop offset="0.7" stopColor="#2A2620" /><stop offset="1" stopColor="#6E675C" /></radialGradient>
        </defs>
        {/* el labio del borde, curvo, visto desde abajo */}
        <path d="M -100 120 Q 960 -60 2020 120 L 2020 360 Q 960 560 -100 360 Z" fill="url(#lip)" />
        <path d="M -100 360 Q 960 560 2020 360" fill="none" stroke="#C9D3D9" strokeWidth={6} />
        {holes.map((h, i) => {
          const len = (120 + rnd(i * 7) * 260) * h.s * grow;
          const dr = (rnd(i * 3) - 0.5) * 30;
          return (
            <g key={i}>
              {slime > 0.01 ? (
                <g opacity={slime}>
                  <path d={`M ${h.x - 16 * h.s} ${h.y + 8} C ${h.x - 20 * h.s} ${h.y + len * 0.4}, ${h.x + dr - 8} ${h.y + len * 0.7}, ${h.x + dr} ${h.y + len} C ${h.x + dr + 10} ${h.y + len * 0.7}, ${h.x + 20 * h.s} ${h.y + len * 0.4}, ${h.x + 16 * h.s} ${h.y + 8} Z`} fill={CL.slime} opacity={0.88} />
                  <circle cx={h.x + dr} cy={h.y + len} r={11 * h.s * (0.7 + grow * 0.3)} fill={CL.slime} />
                  {mode === "grow" ? <circle cx={h.x + 40 * h.s} cy={h.y + 40} r={6 + 10 * grow} fill={hexA(CL.slime, 0.6)} /> : null}
                </g>
              ) : null}
              <ellipse cx={h.x} cy={h.y} rx={30 * h.s} ry={16 * h.s} fill="url(#holeG)" stroke={hexA(CL.slime, 0.5 + 0.5 * slime)} strokeWidth={8 * h.s} />
              {wet > 0 ? <ellipse cx={h.x + 8} cy={h.y + 24 * h.s} rx={7 * h.s} ry={11 * h.s * wet} fill="rgba(200,230,250,0.9)" /> : null}
              {wet > 0.4 ? <circle cx={h.x + 8} cy={h.y + 24 * h.s + ((f * 7 + i * 40) % 260) * wet} r={6 * h.s} fill="rgba(200,230,250,0.85)" /> : null}
              {fz > 0 ? Array.from({ length: 14 }, (_, b) => {
                const bk = clamp01(fz * 1.4 - rnd(i * 40 + b) * 0.4); const pp = Math.sin(Math.PI * clamp01((fz - 0.55) / 0.45)) ;
                const r = (6 + rnd(b + i) * 14) * h.s * bk * (1 - 0.6 * clamp01((fz - 0.8) / 0.2));
                return r > 0.5 ? <circle key={b} cx={h.x + (rnd(b * 3 + i) - 0.5) * 70 * h.s} cy={h.y + 10 + rnd(b * 5 + i) * 200 * h.s * (0.4 + 0.6 * bk)} r={r} fill="#fff" stroke="rgba(150,180,200,0.7)" strokeWidth={2} opacity={0.95 - 0.2 * pp} /> : null;
              }) : null}
            </g>
          );
        })}
        {mode === "spray" ? Array.from({ length: 70 }, (_, i) => {
          const t = ((f * 1.6 + i * 9) % 60) / 60, sx = 120, sy = 1000, tx = holes[i % HOLES].x, ty = holes[i % HOLES].y + 30;
          const x = sx + (tx - sx) * t, y = sy + (ty - sy) * t - Math.sin(t * Math.PI) * 120;
          return f > 4 ? <circle key={i} cx={x + (rnd(i) - 0.5) * 40} cy={y} r={3 + rnd(i + 3) * 4} fill="rgba(190,225,250,0.75)" /> : null;
        }) : null}
      </svg>
      {mode === "spray" ? (
        <svg width={420} height={420} style={{ position: "absolute", left: -40, bottom: -60, rotate: "-35deg" }}>
          <rect x={150} y={150} width={120} height={260} rx={30} fill="#4A2810" />
          <rect x={150} y={210} width={120} height={110} fill="#FAFAF7" />
          <rect x={170} y={70} width={80} height={90} rx={10} fill="#F4F4F2" /><rect x={240} y={80} width={90} height={30} rx={10} fill="#F4F4F2" />
          <rect x={120} y={260} width={70} height={130} rx={30} fill={CL.nitrile} />
        </svg>
      ) : null}
      {label ? (
        <div style={{ position: "absolute", left: 120, bottom: 110, opacity: out * lin(f, 8, 18), translate: `0 ${(1 - lin(f, 8, 18)) * 30}px`, background: mode === "fizz" ? CL.navy : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 52, padding: "10px 30px", borderRadius: 12, boxShadow: `0 14px 30px ${CL.shadow}` }}>{label}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const ClBleachVsRoots: React.FC<{ phase?: "bleach" | "roots"; bed?: string }> = ({ phase = "bleach", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0);
  const bl = phase === "bleach" ? lin(f, 10, T * 0.6) : 1;
  const re = phase === "roots" ? lin(f, T * 0.25, T * 0.85) : 0;
  const top = 1 - bl + re; // oscuridad de la capa de arriba
  const roots = Array.from({ length: 11 }, (_, i) => ({ x: 120 + i * 62 + rnd(i) * 30, d: 120 + rnd(i + 5) * 150 }));
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={91} dim={0.2} />
      <div style={{ position: "absolute", left: 160, top: 120, width: 840, height: 840, borderRadius: "50%", overflow: "hidden", border: `22px solid ${CL.ink}`, boxShadow: `0 40px 80px ${CL.shadow}`, opacity: out, scale: String(0.7 + 0.3 * p), background: "#fff" }}>
        <svg width={840} height={840}>
          <rect x={0} y={0} width={840} height={840} fill="#F2F4F5" />
          {/* porcelana */}
          <rect x={0} y={560} width={840} height={280} fill="#FFFFFF" /><rect x={0} y={556} width={840} height={8} fill="#D9E0E4" />
          {/* costra mineral porosa */}
          <path d={`M 0 560 ${Array.from({ length: 22 }, (_, i) => `L ${i * 40 + 20} ${470 + rnd(i * 3) * 50}`).join(" ")} L 840 480 L 840 560 Z`} fill="#D8D2C2" />
          {Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={20 + rnd(i * 7) * 800} cy={490 + rnd(i * 11) * 60} rx={6 + rnd(i) * 10} ry={4 + rnd(i + 2) * 6} fill="#B9B19C" />)}
          {/* raíces: siempre vivas */}
          {roots.map((r, i) => <path key={i} d={`M ${r.x} 470 C ${r.x - 20} ${470 + r.d * 0.4}, ${r.x + 25} ${470 + r.d * 0.7}, ${r.x + 5} ${470 + r.d}`} stroke={CL.slime} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.95} />)}
          {/* la capa de arriba: negra → blanca con la lejía → vuelve a crecer */}
          <path d={`M 0 400 ${Array.from({ length: 22 }, (_, i) => `Q ${i * 40 + 10} ${380 + rnd(i * 5) * 30} ${i * 40 + 40} ${400 + rnd(i * 9) * 30}`).join(" ")} L 840 520 L 0 520 Z`} fill={`rgb(${Math.round(28 + (238 - 28) * (1 - top))},${Math.round(26 + (236 - 26) * (1 - top))},${Math.round(20 + (228 - 20) * (1 - top))})`} />
          {phase === "bleach" ? <rect x={0} y={250 + 120 * bl} width={840} height={140} fill={hexA("#F6F2C8", 0.55 * (1 - bl * 0.6))} /> : null}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1080, top: 260, opacity: out }}>
        <div style={{ opacity: lin(f, 14, 24), translate: `${(1 - lin(f, 14, 24)) * 40}px 0`, marginBottom: 40 }}>
          <Card style={{ padding: "26px 40px", borderLeft: `14px solid ${CL.yellow}` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 40, color: CL.inkSoft, letterSpacing: 2 }}>ARRIBA</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.ink }}>{phase === "bleach" ? "Sin color" : "Negro otra vez"}</div>
          </Card>
        </div>
        <div style={{ opacity: lin(f, T * 0.45, T * 0.55), translate: `${(1 - lin(f, T * 0.45, T * 0.55)) * 40}px 0` }}>
          <Card style={{ padding: "26px 40px", borderLeft: `14px solid ${CL.red}` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 40, color: CL.inkSoft, letterSpacing: 2 }}>ABAJO</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: CL.ink }}>{phase === "bleach" ? "Sigue vivo" : "Vuelve en una semana"}</div>
          </Card>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// alarma: baliza roja giratoria arriba a la derecha + barrido de luz roja sobre la escena + borde que titila
const Alarm: React.FC<{ on: boolean }> = ({ on }) => {
  const f = useCurrentFrame(); if (!on) return null;
  const a = (f * 9) % 360, blink = 0.5 + 0.5 * Math.sin(f * 0.6);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `conic-gradient(from ${a}deg at 88% 10%, rgba(230,40,30,0.32) 0deg, rgba(230,40,30,0) 40deg, rgba(230,40,30,0) 180deg, rgba(230,40,30,0.32) 200deg, rgba(230,40,30,0) 240deg)`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${60 + 50 * blink}px rgba(220,30,20,${0.35 + 0.35 * blink})` }} />
      <div style={{ position: "absolute", right: 120, top: 40, width: 120, height: 150 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 120, height: 30, borderRadius: 8, background: "#2B2B2B" }} />
        <div style={{ position: "absolute", bottom: 26, left: 15, width: 90, height: 110, borderRadius: "45px 45px 8px 8px", background: `radial-gradient(circle at ${50 + 35 * Math.sin(a / 57.3)}% 40%, #FFD0C8 0%, #F0352A 35%, #9A140C 100%)`, boxShadow: `0 0 ${50 + 40 * blink}px rgba(255,40,30,0.9)` }} />
      </div>
    </AbsoluteFill>
  );
};

// botellas genéricas (sin marca, etiquetas en blanco)
const BottleSvg: React.FC<{ kind: string; w?: number }> = ({ kind, w = 300 }) => {
  const k = kind.toLowerCase();
  if ((k.includes("tablet") || k.includes("pastilla"))) return (<svg width={w} height={w * 1.3} viewBox="0 0 300 390"><ellipse cx={150} cy={260} rx={120} ry={46} fill="#1F6FD1" /><rect x={30} y={215} width={240} height={45} fill="#1F6FD1" /><ellipse cx={150} cy={215} rx={120} ry={46} fill="#4C93E6" /></svg>);
  if ((k.includes("peroxide") || k.includes("oxigenada"))) return (<svg width={w} height={w * 1.3} viewBox="0 0 300 390"><rect x={70} y={110} width={160} height={270} rx={34} fill="#4A2810" /><rect x={70} y={180} width={160} height={120} fill="#FAFAF7" /><rect x={115} y={60} width={70} height={60} rx={12} fill="#F4F4F2" /><rect x={95} y={95} width={110} height={30} rx={14} fill="#4A2810" /></svg>);
  const clear = k.includes("vinegar") || k.includes("ammonia") || k.includes("vinagre") || k.includes("amon");
  const body = clear ? "rgba(225,240,248,0.9)" : k.includes("anything") ? "#B9C3CA" : "#FFFFFF";
  return (<svg width={w} height={w * 1.3} viewBox="0 0 300 390"><path d="M 60 140 Q 60 100 110 90 L 120 50 L 180 50 L 190 90 Q 250 100 250 150 L 250 360 Q 250 380 230 380 L 80 380 Q 60 380 60 360 Z" fill={body} stroke="#9AA7AF" strokeWidth={6} />{!clear && !k.includes("anything") ? <path d="M 200 120 Q 255 130 250 190" stroke="#9AA7AF" strokeWidth={22} fill="none" /> : null}<rect x={85} y={190} width={140} height={110} rx={8} fill="#F9F9F6" stroke="#D9DEE1" strokeWidth={3} /><rect x={118} y={30} width={64} height={30} rx={8} fill={clear ? "#E5E5E0" : "#3E7FC9"} /></svg>);
};
const CHART = [["Cloro", "Vinagre", "Gas cloro"], ["Cloro", "Amoníaco", "Gas tóxico"], ["Cloro", "Agua oxigenada", "Nunca en el mismo lugar"], ["Agua oxigenada", "Vinagre", "Nunca en la misma botella"]];
export const ClNeverMix: React.FC<{ a?: string; b?: string; verdict?: string; soft?: boolean; short?: boolean; chart?: boolean; bed?: string }> = ({ a = "Cloro", b = "Vinagre", verdict = "Nunca", soft, short, chart, bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  if (chart) {
    return (
      <AbsoluteFill>
        <Bed src={bed} seed={101} dim={0.25} />
        <div style={{ position: "absolute", left: "50%", top: 80, translate: `-50% ${(1 - pop(f, fps, 0)) * 100}px`, rotate: "-1deg", opacity: out, width: 1300 }}>
          <Card style={{ padding: "40px 60px 30px", borderTop: `18px solid ${CL.red}` }}>
            <Tape x={560} y={-36} rot={2} w={190} />
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: CL.ink, marginBottom: 18 }}>Nunca mezclar</div>
            {CHART.map((r, i) => { const k = lin(f, 10 + i * 12, 22 + i * 12); return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, padding: "16px 0", borderTop: `3px dashed ${CL.grout}`, opacity: k, translate: `${(1 - k) * 50}px 0` }}>
                <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 52, color: CL.ink, width: 480 }}>{r[0]} + {r[1]}</div>
                <svg width={60} height={60}><path d="M12 12 L48 48 M48 12 L12 48" stroke={CL.red} strokeWidth={10} strokeLinecap="round" /></svg>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: CL.red }}>{r[2]}</div>
              </div>); })}
          </Card>
        </div>
      </AbsoluteFill>
    );
  }
  const meet = interpolate(f, [4, short ? T * 0.45 : T * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const col = soft ? CL.navy : CL.red;
  const xk = lin(f, (short ? T * 0.45 : T * 0.4) + 2, (short ? T * 0.45 : T * 0.4) + 12);
  const fume = !soft && meet > 0.85 ? lin(f, T * 0.4, T * 0.9) : 0;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={111} dim={0.22} />
      {!soft ? <Alarm on={meet > 0.85} /> : null}
      {fume > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, ${hexA("#C9D96A", 0.45 * fume)}, transparent 55%)` }} /> : null}
      <div style={{ position: "absolute", left: interpolate(meet, [0, 1], [180, 560]), top: 260, opacity: out, rotate: `${meet * 12}deg` }}><BottleSvg kind={a} /></div>
      <div style={{ position: "absolute", right: interpolate(meet, [0, 1], [180, 560]), top: 260, opacity: out, rotate: `${-meet * 12}deg` }}><BottleSvg kind={b} /></div>
      <div style={{ position: "absolute", left: 300, top: 720, width: 300, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 50, color: CL.ink, opacity: out * lin(f, 4, 12), background: hexA(CL.white, 0.85), borderRadius: 10, padding: "4px 0" }}>{a}</div>
      <div style={{ position: "absolute", right: 300, top: 720, width: 300, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 50, color: CL.ink, opacity: out * lin(f, 4, 12), background: hexA(CL.white, 0.85), borderRadius: 10, padding: "4px 0" }}>{b}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: out }}>
        {soft ? <path d="M 860 470 L 1060 470 M 1010 420 L 1060 470 L 1010 520" stroke={col} strokeWidth={22 * xk} fill="none" strokeLinecap="round" strokeLinejoin="round" /> :
          <path d={`M 830 330 L ${830 + 260 * xk} ${330 + 260 * xk} M 1090 330 L ${1090 - 260 * xk} ${330 + 260 * xk}`} stroke={col} strokeWidth={36} strokeLinecap="round" />}
      </svg>
      <Stamp text={verdict} at={Math.round((short ? T * 0.45 : T * 0.4) + 8)} color={col} x="50%" y="85%" rot={-6} size={70} />
    </AbsoluteFill>
  );
};
