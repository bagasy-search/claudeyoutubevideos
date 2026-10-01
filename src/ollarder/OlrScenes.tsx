// OlrScenes — escenas animadas "de ciencia" de ollarder: el reloj del descongelado, la papa que se congela, el almidón
// que se vuelve azúcar, la sal que saca el agua del germen, el frasco de chucrut. SVG por useCurrentFrame (nada de Math.random).
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { OLE, LABEL, SERIF, HAND, hexA, rnd } from "./OleTheme";
import { Wood, Kicker, ramp, useT, useIO, eo, eio, cl } from "./OlrKit";
import { ev } from "./OlrCards";
import { IcoGerm, IcoBeef, IcoSnow, IcoFlame, IcoJar, IcoThermo, IcoPotato, IcoDrop, IcoCheck, IcoCross } from "./OlrIcons";

const pop = (t: number, t0: number, d = 0.45) => ramp(t, t0, t0 + d, Easing.out(Easing.back(1.7)));
const ink = "#2A2118";
const Tag: React.FC<{ x: number; y: number; k: string; s: string; p: number; w?: number; c?: string }> = ({ x, y, k, s, p, w = 760, c = OLE.fire }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, background: OLE.paper, padding: "20px 34px 24px", borderRadius: 3, boxShadow: "0 18px 36px rgba(0,0,0,.35)", opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
    <Kicker color={c}>{k}</Kicker><div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 52, color: OLE.forest, marginTop: 8, lineHeight: 1.05 }}>{s}</div>
  </div>
);
const Head: React.FC<{ kicker: string; title: string; p: number; color?: string; light?: boolean }> = ({ kicker, title, p, color, light }) => (
  <div style={{ position: "absolute", left: 96, top: 70, opacity: p, transform: `translateY(${(1 - p) * 22}px)` }}><Kicker color={color ?? (light ? "#FFF3D6" : OLE.fire)}>{kicker}</Kicker><div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: light ? "#FBF6EA" : OLE.forest, lineHeight: 1.02, marginTop: 8, textShadow: light ? "0 3px 10px rgba(40,22,8,.55)" : "none" }}>{title}</div></div>
);

// ───────────────────────── P7 · EL RELOJ DEL DESCONGELADO ─────────────────────────
export const OlrThawClock: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const tFrozen = ev(at, "frozen", 1.0), tSleep = ev(at, "sleep", 8.0), tThaw = ev(at, "thaw", 15.5);
  const thawed = ramp(t, tThaw, tThaw + 1.4);
  const sleep = ramp(t, tSleep, tSleep + 0.8) * (1 - thawed);
  const hand = t < tThaw ? 0.3 : 0.3 + (t - tThaw) * 1.4; // vueltas
  const germs = Array.from({ length: 7 }, (_, i) => ({ x: 130 + (i % 4) * 160 + (i > 3 ? 70 : 0), y: 90 + Math.floor(i / 4) * 150 }));
  const extra = Math.round(interpolate(t, [tThaw + 1.2, tThaw + 5], [0, 5], cl));
  const bg = `linear-gradient(180deg, ${thawed > 0.5 ? "#E7D9BD" : "#CFE3F1"}, ${thawed > 0.5 ? "#D8C49C" : "#B4D2E8"})`;
  return (
    <AbsoluteFill style={{ background: bg, opacity: io }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 20% 15%, rgba(255,255,255,.7), transparent 45%)" }} />
      <Head kicker={thawed > 0.5 ? "THE MOMENT IT THAWS" : "FROZEN AT ZERO DEGREES"} title={thawed > 0.5 ? "The clock starts" : "Safe — the germs are asleep"} p={ramp(t, 0.1, 0.6)} color={thawed > 0.5 ? OLE.plaid : "#2F6E9A"} />
      {/* carne */}
      <div style={{ position: "absolute", left: 140, top: 330 }}><IcoBeef size={360} frost={1 - thawed} /><div style={{ position: "absolute", left: 40, top: 330, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: OLE.pencil, whiteSpace: "nowrap" }}>{thawed > 0.5 ? "thawed" : "frozen · 0°F"}</div></div>
      {thawed < 0.5 ? <div style={{ position: "absolute", left: 120, top: 270, opacity: ramp(t, tFrozen, tFrozen + 0.7) }}><IcoThermo size={190} level={0.08} color="#4B93C9" /></div> : null}
      {/* reloj helado */}
      <div style={{ position: "absolute", left: 650, top: 250, width: 520, height: 520, borderRadius: "50%", background: "#F4EFE3", border: "16px solid #3A3733", boxShadow: "0 26px 46px rgba(0,0,0,.35)" }}>
        <svg width="488" height="488" viewBox="0 0 488 488" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <path key={i} d={`M ${244 + 210 * Math.cos(a)} ${244 + 210 * Math.sin(a)} L ${244 + 180 * Math.cos(a)} ${244 + 180 * Math.sin(a)}`} stroke={ink} strokeWidth="6" />; })}
          <g transform={`rotate(${hand * 360} 244 244)`}><path d="M 244 244 L 244 70" stroke="#B3261E" strokeWidth="9" strokeLinecap="round" /></g>
          <g transform={`rotate(${hand * 30} 244 244)`}><path d="M 244 244 L 244 120" stroke={ink} strokeWidth="12" strokeLinecap="round" /></g>
          <circle cx="244" cy="244" r="16" fill="#3A3733" />
        </svg>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, rgba(200,230,250,${0.55 * (1 - thawed)}) 20%, rgba(255,255,255,${0.88 * (1 - thawed)}) 100%)`, boxShadow: `inset 0 0 60px rgba(120,180,220,${0.8 * (1 - thawed)})` }} />
        {thawed < 0.7 ? <div style={{ position: "absolute", left: 0, right: 0, top: 205, textAlign: "center", opacity: 1 - thawed }}><IcoSnow size={110} /></div> : null}
      </div>
      {/* germenes */}
      <div style={{ position: "absolute", left: 1230, top: 270, width: 640, height: 520 }}>
        {germs.map((g, i) => (<div key={i} style={{ position: "absolute", left: g.x - 60, top: g.y + Math.sin(t * (thawed > 0.5 ? 5 : 1) + i) * (thawed > 0.5 ? 10 : 2), opacity: ramp(t, 1.5 + i * 0.3, 2.1 + i * 0.3) }}><IcoGerm size={thawed > 0.5 ? 110 : 96} awake={thawed} color={thawed > 0.5 ? "#C7532A" : "#6BA04A"} /></div>))}
        {Array.from({ length: extra }).map((_, i) => (<div key={"x" + i} style={{ position: "absolute", left: 40 + (i % 4) * 150, top: 300 + Math.floor(i / 2) * 60 + (i % 2) * 20, opacity: pop(t, tThaw + 1.2 + i * 0.8, 0.4) }}><IcoGerm size={80} awake={1} color="#C7532A" /></div>))}
        {sleep > 0.05 ? [0, 1, 2].map((i) => (<div key={i} style={{ position: "absolute", left: 70 + i * 160 + 60, top: 20 - ((t * 60 + i * 90) % 150) * 0.4, fontFamily: HAND, fontWeight: 700, fontSize: 70 - i * 8, color: "#2F6E9A", opacity: sleep * (1 - ((t * 60 + i * 90) % 150) / 150) }}>z</div>)) : null}
      </div>
      <Tag x={96} y={800} k={thawed > 0.5 ? "THAWED" : "ASLEEP, NOT DEAD"} s={thawed > 0.5 ? "cook it that day — only the day's portion" : "freezing doesn't kill the germs"} p={ramp(t, thawed > 0.5 ? tThaw + 0.3 : tSleep, thawed > 0.5 ? tThaw + 0.9 : tSleep + 0.6)} c={thawed > 0.5 ? OLE.plaid : "#2F6E9A"} w={1500} />
    </AbsoluteFill>
  );
};

// ───────────────────────── P11 · LO QUE LA CONGELACIÓN ROMPE ─────────────────────────
export const OlrFreezeBreak: React.FC<{ mode?: "potato" | "jar"; at?: any }> = ({ mode = "potato", at }) => {
  const { t, dur } = useT(); const io = useIO(0.3, 0.3);
  const tF = ev(at, "freeze", 0.4), tT = ev(at, "thaw", 6.5), tC = ev(at, "crack", 4);
  if (mode === "potato") {
    const ice = ramp(t, tF + 0.6, tT - 0.2); const burst = ramp(t, tF + 3, tT + 0.2); const mush = ramp(t, tT, tT + 1.6);
    const cells = Array.from({ length: 28 }, (_, i) => ({ x: 300 + (i % 7) * 170 + (Math.floor(i / 7) % 2) * 85, y: 290 + Math.floor(i / 7) * 150 }));
    return (
      <Wood tone="#9C6B3C" dim={0.08}>
        <AbsoluteFill style={{ opacity: io }}>
          <Head kicker="INSIDE A POTATO" title={mush > 0.5 ? "Soggy, then chalky" : "Ice tears the cells apart"} p={ramp(t, 0.1, 0.6)}  light />
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
            <rect x="180" y="250" width="1330" height="700" rx="30" fill={mush > 0.5 ? "#C9B79A" : "#E7D7B4"} stroke={ink} strokeWidth="6" />
            {cells.map((c, i) => { const w = 150 * (1 - 0.55 * mush) , h = 130 * (1 - 0.5 * mush); const split = burst * (rnd(i + 5) > 0.45 ? 1 : 0); return (
              <g key={i} transform={`translate(${c.x} ${c.y + 60 * mush * rnd(i)})`}>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="26" fill={`rgba(250,246,232,${1 - 0.4 * mush})`} stroke={split > 0.5 ? "#8E2B2B" : "#B9A06A"} strokeWidth={split > 0.5 ? 5 : 3} strokeDasharray={split > 0.5 ? "14 10" : "0"} />
                <circle cx={-14} cy={0} r={14 * (1 - mush)} fill="#CBB782" />
                {ice > 0.05 ? <g stroke="#6FB4E6" strokeWidth="5" strokeLinecap="round" opacity={ice * (1 - mush)}>{[0, 60, 120, 180, 240, 300].map((a) => <path key={a} d={`M 0 0 L ${58 * ice * Math.cos(a * Math.PI / 180)} ${52 * ice * Math.sin(a * Math.PI / 180)}`} />)}</g> : null}
                {split > 0.5 ? <path d="M -50 -40 L -20 -8 L -48 18 L -10 44" stroke="#8E2B2B" strokeWidth="5" fill="none" /> : null}
              </g>); })}
          </svg>
          <div style={{ position: "absolute", left: 1560, top: 300, textAlign: "center", opacity: ramp(t, tF, tF + 0.6) }}><IcoPotato size={260} /><div style={{ marginTop: 16 }}>{mush > 0.5 ? <IcoCross size={110} /> : <IcoSnow size={110} />}</div></div>
          <Tag x={1480} y={640} k={mush > 0.5 ? "AFTER THE THAW" : "ICE CRYSTALS"} s={mush > 0.5 ? "soggy mush · then chalky" : "cells torn apart"} p={ramp(t, mush > 0.5 ? tT + 0.8 : tF + 1.2, (mush > 0.5 ? tT + 0.8 : tF + 1.2) + 0.6)} w={400} c={mush > 0.5 ? OLE.plaid : "#2F6E9A"} />
        </AbsoluteFill>
      </Wood>
    );
  }
  // frasco / lata
  const ice = ramp(t, tF, tC - 0.2); const crack = ramp(t, tC, tC + 0.4); const shard = ramp(t, tC + 0.2, tC + 1.6);
  const lvl = 0.55 + 0.22 * ice;
  return (
    <Wood tone="#9C6B3C" dim={0.08}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="WATER SWELLS WHEN IT FREEZES" title={crack > 0.5 ? "Crack." : "A jar of anything wet…"} p={ramp(t, 0.1, 0.6)}  light />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${crack > 0.5 ? 260 + Math.sin(t * 40) * 3 * (1 - shard) : 260} 250)`}>
            <rect x="220" y="40" width="360" height="70" rx="10" fill="#9AA0A6" stroke={ink} strokeWidth="6" transform={`translate(0 ${-60 * shard}) rotate(${-14 * shard} 400 60)`} />
            <path d="M 240 110 H 560 V 690 Q 560 740 510 740 H 290 Q 240 740 240 690 Z" fill="rgba(215,235,245,.6)" stroke={ink} strokeWidth="6" />
            <path d={`M 252 ${700 - 560 * lvl} H 548 V 690 Q 548 728 506 728 H 294 Q 252 728 252 690 Z`} fill={ice > 0.4 ? "#BFE2F5" : "#E8C26A"} />
            {ice > 0.3 ? Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${280 + i * 32} ${720 - 40 * ((i * 7) % 5)} l 14 -40 l 8 40`} stroke="#fff" strokeWidth="4" fill="none" opacity={ice} />) : null}
            {crack > 0.05 ? <path d="M 400 110 L 372 220 L 436 300 L 380 400 L 420 520 L 390 640" stroke={ink} strokeWidth={6} fill="none" strokeDasharray="1000" strokeDashoffset={1000 * (1 - crack)} /> : null}
            {shard > 0.05 ? <path d="M 560 330 L 600 300 L 620 380 Z" fill="rgba(215,235,245,.9)" stroke={ink} strokeWidth="4" transform={`translate(${150 * shard} ${-60 * shard + 220 * shard * shard})`} /> : null}
          </g>
          <g transform="translate(1000 330)">
            <path d="M 0 60 Q 0 20 80 20 H 380 Q 460 20 460 60 V 430 Q 460 470 380 470 H 80 Q 0 470 0 430 Z" fill="#B7BDC3" stroke={ink} strokeWidth="6" transform={`scale(${1 + 0.06 * ice} ${1 + 0.1 * ice}) translate(0 ${-20 * ice})`} />
            <ellipse cx="230" cy="24" rx="226" ry="26" fill="#9AA0A6" stroke={ink} strokeWidth="5" transform={`translate(0 ${-34 * ice})`} />
            <text x="230" y="270" textAnchor="middle" fontFamily={LABEL} fontWeight="700" fontSize="60" fill="#5C6670" letterSpacing="6">CAN</text>
            <text x="230" y="340" textAnchor="middle" fontFamily={HAND} fontWeight="700" fontSize="46" fill="#B3261E" opacity={ice}>bulging…</text>
          </g>
        </svg>
        <Tag x={1000} y={830} k={crack > 0.5 ? "THE SAME THING" : "A CAN OF ANYTHING WET"} s={crack > 0.5 ? "a can bursts the same way" : "swells, then bursts"} p={ramp(t, tC + 1.6, tC + 2.2)} w={820} c={OLE.plaid} />
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P14 · ALMIDÓN → AZÚCAR ─────────────────────────
export const OlrSweeten: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const tCold = ev(at, "cold", 0.6), tSug = ev(at, "sugar", 5.2), tGood = ev(at, "good", 12), tWarm = ev(at, "warm", 14);
  const temp = t < tCold ? 45 : t < tGood ? interpolate(t, [tCold, tSug + 1.5], [45, 34], cl) : interpolate(t, [tWarm, tWarm + 4], [34, 55], { ...cl, easing: eio });
  const sweet = t < tSug ? 0 : t < tWarm ? ramp(t, tSug, tSug + 2.5) : 1 - ramp(t, tWarm + 1.5, tWarm + 5);
  const granules = Array.from({ length: 30 }, (_, i) => ({ x: 340 + rnd(i + 1) * 780, y: 330 + rnd(i + 50) * 480, k: rnd(i + 99) }));
  return (
    <Wood tone="#9C6B3C" dim={0.06}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="TOO COLD, TOO LONG" title={sweet > 0.6 ? "Sweet, gummy potatoes" : "Starch turns into sugar"} p={ramp(t, 0.1, 0.6)}  light />
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <ellipse cx="730" cy="580" rx="470" ry="330" fill="#E7D7B4" stroke={ink} strokeWidth="6" transform="rotate(-8 730 580)" />
          {granules.map((g, i) => {
            const flip = sweet > g.k;
            return flip
              ? <rect key={i} x={g.x - 17} y={g.y - 17} width="34" height="34" rx="4" fill="#FFD9A0" stroke="#C98A2E" strokeWidth="3" transform={`rotate(${g.k * 40} ${g.x} ${g.y})`} />
              : <circle key={i} cx={g.x} cy={g.y} r={20 + g.k * 8} fill="#FBF7EA" stroke="#CDB98A" strokeWidth="3" />;
          })}
        </svg>
        {/* termómetro */}
        <div style={{ position: "absolute", left: 1330, top: 260 }}><IcoThermo size={420} level={Math.max(0.05, (temp - 28) / 30)} color={temp < 40 ? "#4B93C9" : "#D24A3A"} /></div>
        <div style={{ position: "absolute", left: 1300, top: 690, width: 300, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: temp < 40 ? "#2F6E9A" : "#B3261E", textShadow: "0 2px 6px rgba(255,255,255,.6)" }}>{temp.toFixed(0)}°F</div>
        <div style={{ position: "absolute", left: 340, top: 820, display: "flex", gap: 40, opacity: ramp(t, 1, 1.6) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 38, height: 38, borderRadius: 19, background: "#FBF7EA", border: "3px solid #CDB98A" }} /><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.pencil }}>starch</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 34, height: 34, background: "#FFD9A0", border: "3px solid #C98A2E" }} /><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: OLE.pencil }}>sugar</span></div>
        </div>
        <Tag x={1300} y={830} k={t >= tWarm ? "THE FIX" : "COLD SWEETENING"} s={t >= tWarm ? "a week or two in a warmer room" : "sweet, doesn't cook right"} p={ramp(t, t >= tWarm ? tWarm : tSug + 1, (t >= tWarm ? tWarm : tSug + 1) + 0.6)} w={560} c={t >= tWarm ? "#2F7A3E" : OLE.plaid} />
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P25 · LA SAL SACA EL AGUA ─────────────────────────
export const OlrSaltBrine: React.FC<{ at?: any }> = ({ at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  const tSalt = ev(at, "salt", 0.8), tPull = ev(at, "pull", 3.6), tGerm = ev(at, "germ", 9.2), tThat = ev(at, "thats", 12);
  const crystals = Array.from({ length: 70 }, (_, i) => ({ x: 120 + rnd(i + 1) * 1000, y: 380 + rnd(i + 90) * 300, s: 10 + rnd(i + 5) * 12 }));
  const salted = ramp(t, tSalt, tSalt + 2);
  const pull = ramp(t, tPull, tPull + 4);
  const germ = 1 - 0.55 * ramp(t, tGerm - 1, tGerm + 3);
  const drops = Array.from({ length: 14 }, (_, i) => ({ k: i / 14 }));
  return (
    <Wood tone="#9C6B3C" dim={0.08}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="HOW SALT KEEPS PORK" title="No water, no germs" p={ramp(t, 0.1, 0.6)}  light />
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <path d="M 110 330 H 1130 V 720 Q 1130 760 1090 760 H 150 Q 110 760 110 720 Z" fill="#C85F58" stroke={ink} strokeWidth="6" />
          <path d="M 150 460 q 300 30 600 -10 t 330 10 M 150 580 q 280 -40 580 0 t 350 -20" stroke="#F4D9CF" strokeWidth="12" fill="none" strokeLinecap="round" />
          {crystals.map((c, i) => <rect key={i} x={c.x} y={c.y - 70 + 70 * Math.min(1, salted * (0.5 + rnd(i + 7)))} width={c.s} height={c.s} fill="#FFFFFF" stroke="#C9D3DA" strokeWidth="2" opacity={salted * 0.95} transform={`rotate(${rnd(i) * 80} ${c.x} ${c.y})`} />)}
          {drops.map((d, i) => { const p = (pull * 1.6 - d.k * 0.6); const q = Math.max(0, Math.min(1, p)); return q > 0 ? <g key={i} opacity={Math.min(1, q * 3) * (1 - q * 0.6)} transform={`translate(${200 + (i % 7) * 140} ${760 + q * 140})`}><path d="M 0 -26 C 14 -4 20 6 20 14 C 20 28 10 34 0 34 C -10 34 -20 28 -20 14 C -20 6 -14 -4 0 -26 Z" fill="#4B93C9" stroke={ink} strokeWidth="2" /></g> : null; })}
          {/* germen que se arruga */}
          <g transform={`translate(1420 540) scale(${germ})`}>
            <circle r="170" fill="#7FBF5A" stroke={ink} strokeWidth="6" />
            <g stroke="#7FBF5A" strokeWidth="9" strokeLinecap="round">{Array.from({ length: 14 }, (_, i) => { const a = i * 25.7 * Math.PI / 180; return <path key={i} d={`M ${170 * Math.cos(a)} ${170 * Math.sin(a)} L ${230 * Math.cos(a)} ${230 * Math.sin(a)}`} />; })}</g>
            <circle cx="-56" cy="-30" r="22" fill="#fff" stroke={ink} strokeWidth="4" /><circle cx="56" cy="-30" r="22" fill="#fff" stroke={ink} strokeWidth="4" />
            <circle cx="-52" cy="-26" r="9" fill={ink} /><circle cx="52" cy="-26" r="9" fill={ink} />
            <path d={germ > 0.7 ? "M -50 70 q 50 40 100 0" : "M -50 80 q 50 -30 100 0"} stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 1290, top: 800, width: 560, textAlign: "center", opacity: ramp(t, tGerm, tGerm + 0.6), fontFamily: HAND, fontWeight: 700, fontSize: 52, color: OLE.plaid }}>a germ without water can't grow</div>
        <Tag x={110} y={810} k={pull > 0.1 ? "SALT PULLS THE WATER OUT" : "PACK IT IN SALT"} s={t >= tThat ? "that's all salting is" : "out of the meat… and out of the germs"} p={ramp(t, tSalt, tSalt + 0.6)} w={1020} c="#2F6E9A" />
      </AbsoluteFill>
    </Wood>
  );
};

// ───────────────────────── P31 / P32 · EL FRASCO DE CHUCRUT ─────────────────────────
export const OlrKrautJar: React.FC<{ mode?: "pack" | "brine"; at?: any }> = ({ mode = "brine", at }) => {
  const { t, dur } = useT(); const io = useIO(0.35, 0.35);
  if (mode === "pack") {
    const tPack = ev(at, "pack", 0.3), tPress = ev(at, "press", 4.4), tTemp = ev(at, "temp", 8.4);
    const fill = ramp(t, tPack, tPress - 0.4); const press = ramp(t, tPress, tPress + 1.2);
    return (
      <Wood tone="#9C6B3C" dim={0.06}>
        <AbsoluteFill style={{ opacity: io }}>
          <Head kicker="FROM THE BOOK · SMALL-BATCH SAUERKRAUT" title="Pack it tight, press it under" p={ramp(t, 0.1, 0.6)}  light />
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <g transform="translate(260 190)">
              <path d="M 40 40 H 460 V 700 Q 460 760 400 760 H 100 Q 40 760 40 700 Z" fill="rgba(220,238,246,.55)" stroke={ink} strokeWidth="7" />
              <rect x="30" y="0" width="440" height="50" rx="8" fill="#9AA0A6" stroke={ink} strokeWidth="6" opacity={1 - ramp(t, tPack, tPack + 0.3)} />
              <path d={`M 52 ${720 - 640 * (fill * 0.85 + 0.15 * press)} H 448 V 700 Q 448 748 396 748 H 104 Q 52 748 52 700 Z`} fill="#E9EFC4" />
              <path d={`M 52 ${720 - 640 * (0.9 * 0.85 + 0.15 * press) + 24} H 448 V 700 Q 448 748 396 748 H 104 Q 52 748 52 700 Z`} fill="rgba(170,205,225,.55)" opacity={press} />
              {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M ${70 + (i % 6) * 62} ${700 - Math.floor(i / 6) * 120 * fill} q 20 -30 40 0`} stroke="#B9CC8C" strokeWidth="5" fill="none" opacity={fill} />)}
              <g transform={`translate(0 ${-40 * 0 + 70 * (1 - press)})`} opacity={press}><rect x="70" y="150" width="360" height="22" rx="8" fill="#B5864F" stroke={ink} strokeWidth="5" /><rect x="170" y="108" width="160" height="46" rx="12" fill="#8A8C8F" stroke={ink} strokeWidth="5" /></g>
            </g>
          </svg>
          <div style={{ position: "absolute", left: 900, top: 300, display: "flex", flexDirection: "column", gap: 26 }}>
            {[{ k: "WEIGH THE SALT", v: "2% of the weight  ≈  18 g per 2 lb", a: ev(at, "pack", 0.3) - 0.2 }, { k: "KNEAD", v: "5 to 10 minutes · until a pool of brine forms", a: ev(at, "pack", 0.3) + 0.8 }, { k: "PRESS UNDER THE BRINE", v: "every shred stays under", a: tPress }, { k: "SET IT AT", v: "65–72°F · out of the sun", a: tTemp }].map((s, i) => { const p = pop(t, s.a, 0.5); return (
              <div key={i} style={{ background: OLE.paper, padding: "20px 34px", borderRadius: 4, boxShadow: `0 16px 32px ${OLE.shadow}`, opacity: p, transform: `translateX(${(1 - p) * 70}px)`, width: 900 }}>
                <Kicker>{s.k}</Kicker><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: OLE.pencil, marginTop: 6 }}>{s.v}</div>
              </div>); })}
          </div>
        </AbsoluteFill>
      </Wood>
    );
  }
  const tUnder = ev(at, "under", 0.5), tOver = ev(at, "over", 3.6), tPress = ev(at, "press", 7.2);
  const mold = ramp(t, tOver + 1, tOver + 3);
  const bubbles = Array.from({ length: 14 }, (_, i) => ({ x: 120 + rnd(i + 1) * 260, o: rnd(i + 20) * 4, s: 8 + rnd(i + 30) * 10 }));
  return (
    <Wood tone="#9C6B3C" dim={0.06}>
      <AbsoluteFill style={{ opacity: io }}>
        <Head kicker="THE WHOLE SECRET" title={t >= tOver ? "Above the brine, it molds" : "Under the brine, it ferments"} p={ramp(t, 0.1, 0.6)} color={t >= tOver ? OLE.plaid : "#2F7A3E"}  light />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((j) => (
            <g key={j} transform={`translate(${260 + j * 560} 240)`}>
              <path d="M 40 40 H 460 V 700 Q 460 760 400 760 H 100 Q 40 760 40 700 Z" fill="rgba(220,238,246,.55)" stroke={ink} strokeWidth="7" />
              <path d="M 52 330 H 448 V 700 Q 448 748 396 748 H 104 Q 52 748 52 700 Z" fill="rgba(160,200,225,.6)" />
              <path d={`M 52 ${j === 0 ? 330 : 330 - 130} V 700 Q 52 748 104 748 H 396 Q 448 748 448 700 V ${j === 0 ? 330 : 330 - 130} Z`} fill="#E9EFC4" opacity={0.0} />
              {/* repollo: bajo la línea (j=0) o asomando (j=1) */}
              {Array.from({ length: 26 }, (_, i) => { const x = 70 + (i % 6) * 62, y = (j === 0 ? 360 : 230) + Math.floor(i / 6) * 90; return <path key={i} d={`M ${x} ${y + 36} q 20 -42 40 0`} stroke={j === 1 && y < 330 ? "#9BA37A" : "#B9CC8C"} strokeWidth="9" fill="none" strokeLinecap="round" />; })}
              {j === 0 ? bubbles.map((b, i) => <circle key={i} cx={b.x + 40} cy={700 - ((t * 60 + b.o * 80) % 360)} r={b.s} fill="rgba(255,255,255,.7)" stroke="#fff" strokeWidth="2" opacity={ramp(t, tUnder, tUnder + 1)} />) : null}
              {j === 1 ? (<g opacity={mold}>{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={90 + i * 40} cy={226 + (i % 3) * 14} r={14 + (i % 4) * 4} fill={i % 2 ? "#6C8F7A" : "#8FA8B8"} opacity="0.9" />)}</g>) : null}
              <path d="M 40 330 H 460" stroke="#2F6E9A" strokeWidth="5" strokeDasharray="14 10" />
              <text x="250" y={800} textAnchor="middle" fontFamily={LABEL} fontWeight="700" fontSize="44" letterSpacing="6" fill={j === 0 ? "#2F7A3E" : "#8E2B2B"}>{j === 0 ? "UNDER = FERMENTS" : "ABOVE = MOLDS"}</text>
              <g transform={`translate(${j === 0 ? 0 : 0} 0)`}>{j === 0 ? <g transform="translate(20 20) scale(0.9)"><path d="M 70 150 H 430 V 172 H 70 Z" fill="#B5864F" stroke={ink} strokeWidth="5" transform="translate(0 150)" /><rect x="170" y="258" width="160" height="40" rx="12" fill="#8A8C8F" stroke={ink} strokeWidth="5" /></g> : null}</g>
            </g>
          ))}
        </svg>
        <div style={{ position: "absolute", left: 1500, top: 330, width: 340, opacity: ramp(t, tPress, tPress + 0.6) }}>
          <div style={{ background: OLE.paper, padding: "20px 26px", borderRadius: 4, boxShadow: `0 16px 32px ${OLE.shadow}` }}><Kicker>EVERY DAY</Kicker><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: OLE.pencil, lineHeight: 1.05, marginTop: 8 }}>press it down under the brine</div></div>
        </div>
      </AbsoluteFill>
    </Wood>
  );
};
