// OlcScenes — escenas animadas de olcast (SVG por useCurrentFrame): OvenStack, HeatMap, Flick, RustCheck, Briquette.
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { OLE, LABEL, SERIF, HAND, hexA, rnd, Wood, Paper, Kicker, Seal, PanTop, cl, eo, eio, ramp, useT, useIO } from "./OlcKit";

const Dial: React.FC<{ cx: number; cy: number; r: number; deg: number; min: number; max: number; from?: number; to?: number; label?: string; unit?: string; danger?: boolean }> = ({ cx, cy, r, deg, min, max, from, to, label, unit = "°F", danger }) => {
  const ang = (v: number) => -125 + ((v - min) / (max - min)) * 250;
  const P = (a: number, rr: number) => [cx + Math.sin((a * Math.PI) / 180) * rr, cy - Math.cos((a * Math.PI) / 180) * rr];
  const arc = (a0: number, a1: number, rr: number) => { const [x0, y0] = P(a0, rr), [x1, y1] = P(a1, rr); return `M ${x0} ${y0} A ${rr} ${rr} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  const ticks = [];
  for (let v = min; v <= max; v += 50) { const a = ang(v); const [x0, y0] = P(a, r * 0.8), [x1, y1] = P(a, r * 0.94), [tx, ty] = P(a, r * 0.66);
    ticks.push(<g key={v}><line x1={x0} y1={y0} x2={x1} y2={y1} stroke={OLE.ironL} strokeWidth={5} /><text x={tx} y={ty + 10} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={r * 0.15} fill={OLE.iron}>{v}</text></g>); }
  const [nx, ny] = P(ang(deg), r * 0.78);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={OLE.cream} stroke={OLE.iron} strokeWidth={10} />
      {from != null && to != null ? <path d={arc(ang(from), ang(to), r * 0.87)} stroke={OLE.fire} strokeWidth={r * 0.1} fill="none" opacity={0.85} /> : null}
      {ticks}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={danger ? OLE.plaid : OLE.iron} strokeWidth={9} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.09} fill={OLE.iron} />
      <text x={cx} y={cy + r * 0.55} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={r * 0.26} fill={OLE.forest}>{Math.round(deg)}{unit}</text>
      {label ? <text x={cx} y={cy + r * 0.82} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={r * 0.13} letterSpacing={4} fill={OLE.mute}>{label}</text> : null}
    </g>
  );
};

// ─────────────────────────────── OvenStack ────────────────────────────────
// upside down → foil abajo → 450–500 °F → una hora → se apaga y se enfría adentro
export const OlcOvenStack: React.FC<{ tUp?: number; tFoil?: number; tDial?: number; tHour?: number; tOff?: number }> = ({ tUp = 0.8, tFoil = 3.6, tDial = 8, tHour = 11.6, tOff = 15 }) => {
  const { t } = useT(); const io = useIO();
  const flip = ramp(t, tUp, tUp + 0.9, Easing.inOut(Easing.cubic));
  const foil = ramp(t, tFoil, tFoil + 0.9);
  const hot = ramp(t, tDial, tDial + 2.6, Easing.inOut(Easing.quad));
  const off = ramp(t, tOff, tOff + 4.5, Easing.inOut(Easing.quad));
  const temp = 70 + (475 - 70) * hot - (475 - 120) * off + (t > tDial + 2.6 && t < tOff ? Math.sin(t * 2) * 12 : 0);
  const hour = ramp(t, tHour, tHour + 2.6, Easing.linear);
  const mins = Math.round(60 * (1 - hour));
  const glow = Math.max(0, (temp - 120) / 420);
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* horno en corte */}
          <rect x={120} y={130} width={1000} height={820} rx={26} fill="#2A2724" stroke="#0e0d0c" strokeWidth={10} />
          <rect x={160} y={170} width={920} height={740} rx={14} fill={`rgb(${58 + glow * 150},${44 + glow * 30},${34})`} />
          <rect x={160} y={170} width={920} height={740} rx={14} fill={hexA("#ff7a1c", glow * 0.28)} />
          {[420, 690].map((y) => <g key={y}><line x1={175} x2={1065} y1={y} y2={y} stroke="#9a9590" strokeWidth={7} />{Array.from({ length: 30 }).map((_, i) => <line key={i} x1={195 + i * 30} x2={195 + i * 30} y1={y - 26} y2={y} stroke="#9a9590" strokeWidth={3} />)}</g>)}
          {/* papel de aluminio en el estante de abajo */}
          <g transform={`translate(${(1 - foil) * -560}, 0)`}><path d="M 330 676 L 900 676 L 950 700 L 290 700 Z" fill="#D8DBDF" stroke="#8a8f96" strokeWidth={3} /><path d="M 350 682 L 500 680 M 560 682 L 700 681" stroke="#fff" strokeWidth={3} opacity={0.7} /></g>
          <text x={620} y={740} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={hexA("#ffffff", 0.95 * foil)}>foil catches the drips</text>
          {/* sartén: se da vuelta y queda boca abajo */}
          <g transform={`translate(620, ${420 - 6}) `}>
            <g transform={`scale(1, ${1 - 2 * flip})`}>
              <path d="M -190 0 L -160 -70 Q 0 -96 160 -70 L 190 0 Z" fill="#1B1A18" stroke="#3A3733" strokeWidth={6} />
              <path d="M -150 -60 Q 0 -84 150 -60" stroke="#55514b" strokeWidth={5} fill="none" opacity={0.7} />
              <rect x={188} y={-40} width={250} height={26} rx={10} fill="#1B1A18" stroke="#3A3733" strokeWidth={5} transform="rotate(4 188 -40)" />
            </g>
          </g>
          <text x={620} y={330} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill={hexA("#ffffff", ramp(t, tUp + 0.9, tUp + 1.5))}>upside down · so the oil can't pool</text>
          {/* humo */}
          {t > tDial + 2 && t < tOff + 1 ? Array.from({ length: 5 }).map((_, i) => { const y = 400 - ((t * 60 + i * 60) % 260); return <ellipse key={i} cx={560 + i * 46 + Math.sin(t * 2 + i) * 14} cy={y} rx={22} ry={12} fill="#fff" opacity={0.16 * (1 - (400 - y) / 260)} />; }) : null}
          {/* panel derecho: dial + temporizador */}
          <Dial cx={1480} cy={380} r={230} deg={temp} min={100} max={500} from={450} to={500} label="OVEN" danger={hot > 0.9 && off < 0.2} />
          <g transform="translate(1250, 690)">
            <rect x={0} y={0} width={460} height={170} rx={16} fill="#111" stroke={OLE.ironL} strokeWidth={6} opacity={ramp(t, tHour - 0.2, tHour + 0.4)} />
            <text x={230} y={112} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={110} fill="#FF9B3D" opacity={ramp(t, tHour - 0.2, tHour + 0.4)}>{String(mins).padStart(2, "0")}:00</text>
            <text x={230} y={-16} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={34} letterSpacing={8} fill={OLE.iron} opacity={ramp(t, tHour - 0.2, tHour + 0.4)}>ONE FULL HOUR</text>
          </g>
        </svg>
        <div style={{ position: "absolute", left: 1250, top: 900, width: 560, opacity: ramp(t, tOff, tOff + 0.6) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: OLE.forest }}>THEN OVEN OFF</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.pencil }}>let it cool inside. Don't rush it.</div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 40 }}><Kicker color={OLE.cream} size={38}>SEASONING · THE OVEN WAY</Kicker></div>
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── HeatMap ──────────────────────────────────
// Alta = punto caliente al centro y borde frío · Media = calor parejo · agua/grasa que "brilla"
export const OlcHeatMap: React.FC<{ tHigh?: number; tMed?: number; tWait?: number; tFat?: number; tShimmer?: number }> = ({ tHigh = 1.5, tMed = 8, tWait = 12.5, tFat = 16.5, tShimmer = 18.5 }) => {
  const { t } = useT(); const io = useIO();
  const dialV = t < tMed ? 500 : 500 - 320 * ramp(t, tMed, tMed + 1.2, eio); // 500=HIGH → 180=MEDIUM
  const med = ramp(t, tMed, tMed + 1.6);
  const R = 300;
  const Heat: React.FC<{ cx: number; even: number; show: number; label: string; sub: string; col: string }> = ({ cx, even, show, label, sub, col }) => (
    <g opacity={show} transform={`translate(0, ${(1 - show) * 40})`}>
      <defs>
        <radialGradient id={"hg" + cx}>
          <stop offset="0%" stopColor={even ? "#F0A23A" : "#FF3B1D"} stopOpacity={1} />
          <stop offset={even ? "70%" : "38%"} stopColor={even ? "#E8892E" : "#C9451B"} stopOpacity={1} />
          <stop offset="100%" stopColor={even ? "#C97A32" : "#3d5a7a"} stopOpacity={1} />
        </radialGradient>
      </defs>
      <PanTop cx={cx} cy={470} r={R} fill={`url(#hg${cx})`}>
        {even ? null : <circle cx={cx} cy={470} r={R * 0.16} fill="#FFD27A" opacity={0.75 + Math.sin(t * 6) * 0.1} />}
      </PanTop>
      <text x={cx} y={860} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={60} letterSpacing={8} fill={col}>{label}</text>
      <text x={cx} y={912} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={42} fill={OLE.pencil}>{sub}</text>
    </g>
  );
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Heat cx={470} even={0} show={ramp(t, tHigh, tHigh + 0.7)} label="CRANKED TO HIGH" sub="hot spot in the middle · cold edge" col={OLE.plaid} />
          <Heat cx={1450} even={1} show={med} label="MEDIUM, NEVER PAST IT" sub="iron heats slow · and even" col={OLE.forest} />
          <g transform="translate(960, 470)"><Dial cx={0} cy={0} r={130} deg={dialV} min={100} max={500} label="BURNER" unit="" /></g>
          {t > tHigh + 1 && t < tMed ? [0, 1, 2, 3].map((i) => <path key={i} d={`M ${400 + i * 46} ${140 - (t * 40 + i * 12) % 60} q 14 -24 0 -48 q -14 -24 0 -48`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.35} />) : null}
          <g opacity={ramp(t, tWait, tWait + 0.6)}>
            <text x={1450} y={130} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={54} letterSpacing={6} fill={OLE.forest}>SIT 2–3 MINUTES</text>
            <circle cx={1450} cy={230} r={44} fill="none" stroke={OLE.forest} strokeWidth={8} /><path d={`M 1450 230 L ${1450 + Math.sin(ramp(t, tWait, tFat, Easing.linear) * 6.28) * 30} ${230 - Math.cos(ramp(t, tWait, tFat, Easing.linear) * 6.28) * 30}`} stroke={OLE.forest} strokeWidth={8} strokeLinecap="round" />
          </g>
          {/* grasa que brilla */}
          <g opacity={ramp(t, tFat, tFat + 0.5)}>
            <ellipse cx={1450} cy={470} rx={190} ry={190} fill="#F6D67C" opacity={0.3 + (t > tShimmer ? 0.12 * Math.sin(t * 9) : 0)} />
            {t > tShimmer ? [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${1330 + i * 60} ${560 - (t * 50 + i * 20) % 80} q 20 -16 0 -32 q -20 -16 0 -32`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.7} />) : null}
            <text x={1450} y={990} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={52} fill={OLE.plaid}>the fat goes in · food waits till it shimmers</text>
          </g>
        </svg>
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── Flick ────────────────────────────────────
// el "flick test": las gotas se juntan en perlas y patinan = la sartén está lista
export const OlcFlick: React.FC<{ readyAt?: number }> = ({ readyAt = 1.6 }) => {
  const { t } = useT(); const io = useIO();
  const drops = [0, 1, 2, 3, 4, 5, 6];
  const ready = ramp(t, readyAt, readyAt + 0.5);
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <defs><radialGradient id="pg"><stop offset="0%" stopColor="#2b2926" /><stop offset="100%" stopColor="#141312" /></radialGradient>
            <radialGradient id="dg"><stop offset="0%" stopColor="#fff" stopOpacity={0.95} /><stop offset="55%" stopColor="#bfe4ff" stopOpacity={0.65} /><stop offset="100%" stopColor="#7fb8e6" stopOpacity={0.5} /></radialGradient></defs>
          <PanTop cx={820} cy={540} r={430} fill="url(#pg)" rim="#3A3733">
            {drops.map((i) => {
              // antes de "ready": gotas planas que chisporrotean y se achican; después: perlas que patinan
              const sizzle = 1 - ready;
              const r0 = 30 + rnd(i + 2) * 22;
              const ph = rnd(i + 8) * 6.28;
              const sp = 0.7 + rnd(i + 12) * 0.9;
              const cx = 820 + Math.cos(t * sp + ph) * (150 + rnd(i) * 200) * (0.25 + 0.75 * ready) + Math.sin(t * 2.3 * sp + i) * 22 * ready;
              const cy = 540 + Math.sin(t * sp * 1.3 + ph) * (110 + rnd(i + 5) * 170) * (0.25 + 0.75 * ready);
              const r = r0 * (0.6 + 0.4 * ready) * (1 - 0.55 * sizzle * ramp(t, 0.2, readyAt));
              return <g key={i}><ellipse cx={cx} cy={cy} rx={r} ry={r * (0.85 + 0.15 * Math.sin(t * 9 + i))} fill="url(#dg)" stroke="#fff" strokeOpacity={0.7} strokeWidth={2} />
                <ellipse cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.25} ry={r * 0.16} fill="#fff" opacity={0.95} /></g>;
            })}
          </PanTop>
        </svg>
        <div style={{ position: "absolute", left: 1400, top: 260, width: 470 }}>
          <Kicker>THE FLICK TEST</Kicker>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: OLE.cream, lineHeight: 1, marginTop: 10, textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>Beads that skate</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: OLE.cream, marginTop: 18, textShadow: "0 3px 12px rgba(0,0,0,0.6)", opacity: 1 - ready }}>sizzling away = not ready</div>
        </div>
        <Seal text="READY" at={readyAt + 0.3} color={OLE.forest} size={96} x={520} y={-380} rot={-6} />
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── RustCheck ────────────────────────────────
// prueba de girarla en el mostrador: si se mece, el fondo está alabeado
export const OlcRustCheck: React.FC<{ tStamp?: number }> = ({ tStamp = 5.2 }) => {
  const { t } = useT(); const io = useIO();
  const rock = Math.sin(t * 5.2) * 5.5 * Math.exp(-Math.max(0, t - 3.4) * 0.35) * ramp(t, 0.6, 1.0);
  const spin = ramp(t, 0.3, 0.9);
  const Skillet: React.FC<{ x: number; rockDeg: number; warped: boolean; label: string; col: string }> = ({ x, rockDeg, warped, label, col }) => (
    <g transform={`translate(${x}, 640) scale(1.35) rotate(${rockDeg} 0 ${warped ? 24 : 0})`}>
      <path d={`M -230 -70 Q -230 -30 -190 0 L 190 0 Q 230 -30 230 -70 Z`} fill="#1B1A18" stroke="#3A3733" strokeWidth={6} />
      <path d={`M -200 -66 L 200 -66`} stroke="#55514b" strokeWidth={5} />
      <rect x={224} y={-68} width={230} height={26} rx={10} fill="#1B1A18" stroke="#3A3733" strokeWidth={5} />
      {warped ? <path d="M -190 0 Q 0 26 190 0" fill="#1B1A18" /> : null}
      <text x={0} y={90} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={40} letterSpacing={6} fill={hexA("#ffffff", 0.95)}>{label}</text>
    </g>
  );
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={640} width={1920} height={44} fill="#D9CDB0" /><rect x={0} y={684} width={1920} height={396} fill="#8a5f34" />
          <Skillet x={470} rockDeg={rock} warped label="ROCKS" col={OLE.plaid} />
          <Skillet x={1290} rockDeg={0} warped={false} label="SITS FLAT" col={OLE.forest} />
          <path d={`M 250 420 q 220 -${130 * spin} 440 0`} stroke={OLE.cream} strokeWidth={12} fill="none" strokeLinecap="round" opacity={spin} />
          <path d={`M 690 420 l 22 -34 M 690 420 l -34 -18`} stroke={OLE.cream} strokeWidth={12} strokeLinecap="round" opacity={spin} />
        </svg>
        <div style={{ position: "absolute", left: 140, top: 110 }}><Kicker color={OLE.cream}>AT THE FLEA MARKET · TEST 1</Kicker>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: OLE.cream, lineHeight: 1, marginTop: 10, textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>Spin it on a flat counter</div></div>
        <Seal text="ROCKS? PUT IT BACK" at={tStamp} color={OLE.plaid} size={64} x={-460} y={-215} rot={-5} />
        <Seal text="STEADY = KEEP LOOKING" at={tStamp + 1.2} color={OLE.forest} size={56} x={330} y={-215} rot={4} />
      </AbsoluteFill>
    </Wood>
  );
};

// ─────────────────────────────── Briquette ────────────────────────────────
// el ancho de la olla × 2 = briquetas · 2/3 en la tapa, 1/3 abajo · ≈ 350 °F
const Coal: React.FC<{ x: number; y: number; p: number; rot: number }> = ({ x, y, p, rot }) => (
  <g transform={`translate(${x}, ${y - (1 - p) * 60}) rotate(${rot}) scale(${0.4 + 0.6 * p})`} opacity={p}>
    <rect x={-20} y={-20} width={40} height={40} rx={9} fill="#2B2926" stroke="#55504a" strokeWidth={3} />
    <rect x={-12} y={-12} width={24} height={24} rx={6} fill="#4a3f38" opacity={0.7} /><circle cx={-4} cy={-3} r={6} fill="#ff7a1c" opacity={0.65} />
  </g>
);
export const OlcBriquette: React.FC<{ tMeasure?: number; tDouble?: number; tLid?: number; tUnder?: number; tHeat?: number; tTurn?: number }> = ({ tMeasure = 0.6, tDouble = 4.8, tLid = 9.5, tUnder = 15.5, tHeat = 20.5, tTurn = 25 }) => {
  const { t } = useT(); const io = useIO();
  const lidPos: [number, number][] = []; for (let i = 0; i < 16; i++) { const ring = i < 10 ? 0 : 1; const n = ring ? 6 : 10; const k = ring ? i - 10 : i; const rr = ring ? 60 : 135; lidPos.push([Math.cos((k / n) * 6.283 + ring) * rr, Math.sin((k / n) * 6.283 + ring) * rr]); }
  const underPos: [number, number][] = []; for (let i = 0; i < 8; i++) underPos.push([Math.cos((i / 8) * 6.283 + 0.4) * 120, Math.sin((i / 8) * 6.283 + 0.4) * 120]);
  const turn = ramp(t, tTurn, tTurn + 1.2, eio) * 90;
  const num = t < tDouble ? 12 : t < tLid ? 24 : t < tUnder ? 24 : 24;
  return (
    <Wood>
      <AbsoluteFill style={{ opacity: io }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {/* 1. medir el ancho */}
          <g opacity={ramp(t, tMeasure, tMeasure + 0.6)} transform="translate(0, 0)">
            <circle cx={470} cy={480} r={240} fill="#1B1A18" stroke="#3A3733" strokeWidth={14} />
            <circle cx={470} cy={480} r={205} fill="#252321" />
            <rect x={404} y={228} width={132} height={26} rx={13} fill="#1B1A18" stroke="#3A3733" strokeWidth={5} />
            <line x1={230} x2={710} y1={780} y2={780} stroke={OLE.cream} strokeWidth={8} strokeDasharray={ramp(t, tMeasure + 0.3, tMeasure + 1.6) * 480 + " 999"} />
            <path d="M 230 764 v 32 M 710 764 v 32" stroke={OLE.cream} strokeWidth={8} />
            <text x={470} y={846} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={64} fill={OLE.cream} letterSpacing={4}>12 IN WIDE</text>
          </g>
          {/* 2. duplicar */}
          <g opacity={ramp(t, tDouble, tDouble + 0.7)}>
            <text x={470} y={130} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={120} fill={OLE.cream}>12 × 2 = <tspan fill={OLE.ember}>{num}</tspan></text>
            <text x={470} y={196} textAnchor="middle" fontFamily={LABEL} fontWeight={600} fontSize={40} letterSpacing={8} fill={OLE.cream}>CHARCOAL BRIQUETTES</text>
          </g>
          {/* 3. tapa: 2/3 */}
          <g transform={`translate(1090, 470) rotate(${-turn})`} opacity={ramp(t, tLid - 0.5, tLid)}>
            <circle r={230} fill="#1B1A18" stroke="#3A3733" strokeWidth={12} /><circle r={30} fill="#3A3733" />
            {lidPos.map(([x, y], i) => <Coal key={i} x={x} y={y} p={ramp(t, tLid + i * 0.16, tLid + i * 0.16 + 0.3)} rot={i * 23} />)}
          </g>
          <text x={1090} y={790} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={52} letterSpacing={6} fill={OLE.cream} opacity={ramp(t, tLid, tLid + 0.5)}>ON THE LID · 16 (⅔)</text>
          {/* 4. abajo: 1/3 */}
          <g transform="translate(1600, 470)" opacity={ramp(t, tUnder - 0.5, tUnder)}>
            <circle r={230} fill="none" stroke="#3A3733" strokeWidth={12} strokeDasharray="6 14" />
            <rect x={-120} y={-40} width={240} height={80} fill="none" />
            {underPos.map(([x, y], i) => <Coal key={i} x={x} y={y} p={ramp(t, tUnder + i * 0.2, tUnder + i * 0.2 + 0.3)} rot={i * 41} />)}
          </g>
          <text x={1600} y={790} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={52} letterSpacing={6} fill={OLE.cream} opacity={ramp(t, tUnder, tUnder + 0.5)}>UNDER · 8 (⅓)</text>
          {/* 5. calor */}
          <g opacity={ramp(t, tHeat, tHeat + 0.7)}>
            <rect x={640} y={890} width={640} height={110} rx={20} fill={hexA(OLE.fire, 0.92)} />
            <text x={960} y={962} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={64} letterSpacing={5} fill="#fff">≈ 350°F · A STARTING POINT</text>
          </g>
          <text x={1090} y={905} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={44} fill={OLE.cream} opacity={ramp(t, tTurn, tTurn + 0.6)}>quarter turn every 15 min</text>
        </svg>
      </AbsoluteFill>
    </Wood>
  );
};
