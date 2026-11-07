// arboles60 — escenas 1-3
import React from "react";
import { Bird, Telescope } from "./chars";
import { Balance, Earth, Glow as _G, NightWorld, Pine, RoundTree, Satellite, yMid } from "./env";
import { C, Cam, FONT, Glow, Layer, Motes, PopText, Stage, antic, blink, clamp, ei, eio, eo, fmt, lerp, lerpPoly, mix, nz, pinePath, prog, rnd, rr, spr, starPath, wob, eback } from "./lib";

// ───────────────────────── S1 · 0-5,4 · bosque nocturno: las estrellas caen y se vuelven árboles ─────────────────────────
const FALL = Array.from({ length: 14 }, (_, i) => {
  const ex = lerp(-150, 2050, (i + 0.3 + rnd(i + 70) * 0.4) / 14);
  return { sx: rr(i + 80, 150, 1800), sy: rr(i + 81, 60, 330), ex, ey: yMid(ex) + rr(i + 82, 6, 16), h: rr(i + 83, 110, 170), t0: 1.0 + i * 0.11 + rnd(i + 84) * 0.12 };
}).filter((f) => f.ex < 380 || f.ex > 760);

export const S1: React.FC<{ t: number }> = ({ t }) => {
  const up = ei(prog(t, 4.7, 5.6));
  const cam: Cam = { x: mix(t, 0, 4.7, -40, 30, (k) => k), y: -up * 620, z: mix(t, 0, 4.7, 1.0, 1.07, (k) => k) * (1 + up * 1.1) };
  const flare = clamp(spr(t, 2.84, 1.5, 4) * Math.exp(-1.6 * Math.max(0, t - 2.84)) * 1.6);
  const milky = eio(prog(t, 4.05, 5.0));
  // Luma: mira el cielo, señala, se sorprende, salta
  const jumpK = prog(t, 4.3, 4.78);
  const jy = jumpK > 0 && jumpK < 1 ? Math.sin(Math.PI * jumpK) * 70 : 0;
  const crouch = t < 4.3 ? -0.14 * Math.sin(Math.PI / 2 * prog(t, 4.08, 4.3)) * (t > 4.08 ? 1 : 0) : 0;
  const sq = 1 + crouch + (jumpK > 0 && jumpK < 1 ? 0.1 * Math.cos(Math.PI * jumpK) : 0) - 0.16 * wob(t, 4.78, 3, 7);
  const point = spr(t, 1.12, 2, 7) * (1 - eio(prog(t, 2.6, 3.0)));
  const luma = (
    <Bird who="luma" uid="s1l" t={t} p={{
      x: 540, y: 880, s: 1.4, turn: 0.55, jy, sq, lean: 3 + nz(t, 1) * 1.5,
      head: -6 + 4 * point + Math.sin(t * 1.3) * 2, lx: 0.5, ly: -0.8, blink: blink(t, 3),
      mood: t > 2.84 ? "surprised" : t > 1.1 ? "happy" : "neutral", beak: t > 4.3 && t < 4.9 ? 0.6 : 0,
      wr: -125 * point - (t > 4.3 ? 40 * Math.sin(Math.PI * clamp(jumpK)) : 0), wl: t > 4.3 ? -40 * Math.sin(Math.PI * clamp(jumpK)) : 0,
    }} />
  );
  const falling = FALL.map((f, i) => {
    const k = prog(t, f.t0, f.t0 + 0.9);
    if (k <= 0) return <g key={i}><path d={starPath(14)} transform={`translate(${f.sx} ${f.sy})`} fill={C.yellow} opacity={0.9} /></g>;
    const pos = (kk: number) => ({ x: lerp(f.sx, f.ex, eo(kk)), y: lerp(f.sy, f.ey, kk * kk) });
    const p = pos(k), m = eio(prog(k, 0.7, 1));
    const land = f.t0 + 0.9, sqz = wob(t, land, 3, 7);
    const glow = 1 - prog(t, land, land + 1.2);
    return (
      <g key={i}>
        {k < 1 && Array.from({ length: 9 }, (_, j) => {
          const q = pos(Math.max(0, k - j * 0.035));
          return <circle key={j} cx={q.x} cy={q.y} r={(9 - j) * 1.3} fill={j < 4 ? C.yellow : C.teal} opacity={0.5 * (1 - j / 9)} />;
        })}
        {glow > 0 && k >= 1 && <circle cx={f.ex} cy={f.ey - f.h * 0.15} r={f.h * 0.22} fill={C.yellow} opacity={0.22 * glow} />}
        <g transform={`translate(${p.x} ${p.y}) scale(${1 + 0.3 * sqz} ${1 - 0.3 * sqz})`}>
          <path d={lerpPoly(starPath(14), pinePath(lerp(28, f.h, m)), m)} fill={m < 0.5 ? C.yellow : m < 0.85 ? "#7DDB8A" : "#1E9A5E"} />
          {m > 0.9 && <path d={lerpPoly(starPath(14), pinePath(f.h), 1)} fill="#147A4A" transform="scale(0.5 1) translate(30 0)" opacity={0.6} />}
        </g>
      </g>
    );
  });
  return (
    <Stage bg={C.deep}>
      <NightWorld t={t} cam={cam} milky={milky} flare={flare} midExtra={<g>{falling}</g>}>
        <Telescope x={760} y={884} a={-38 + Math.sin(t * 0.7) * 2} s={1.9} />
        {luma}
      </NightWorld>
    </Stage>
  );
};

// ───────────────────────── S2 · 5,4-14 · la galaxia: 100-400 mil millones ─────────────────────────
const GAL = (() => {
  const pts: { x: number; y: number; r: number; c: string; o: number }[] = [];
  for (let a = 0; a < 2; a++) for (let i = 0; i < 380; i++) {
    const th = (i / 380) * 3.4 * Math.PI, r = 36 * Math.exp(0.24 * th), sc = r * 0.2;
    const x = r * Math.cos(th + a * Math.PI) + (rnd(i * 7 + a) - 0.5) * sc * 2, y = r * Math.sin(th + a * Math.PI) + (rnd(i * 7 + a + 3) - 0.5) * sc * 2;
    const q = rnd(i * 11 + a);
    pts.push({ x, y, r: rr(i * 13 + a, 0.8, 3.4), c: q > 0.85 ? C.yellow : q > 0.65 ? C.pink : q > 0.35 ? C.light : "#fff", o: rr(i * 17 + a, 0.5, 1) });
  }
  for (let i = 0; i < 260; i++) { const r = Math.pow(rnd(i + 5000), 2) * 160, a = rnd(i + 5001) * 6.283; pts.push({ x: r * Math.cos(a), y: r * Math.sin(a), r: rr(i + 5002, 1, 3), c: rnd(i + 5003) > 0.5 ? C.yellow : "#fff", o: 0.9 }); }
  return pts;
})();

export const S2: React.FC<{ t: number }> = ({ t }) => {
  const cam: Cam = { x: mix(t, 5.4, 8.4, -40, 0), y: mix(t, 5.4, 8.4, -120, 0), z: mix(t, 5.4, 8.4, 2.6, 1.0) * mix(t, 8.4, 14, 1, 1.06, (k) => k) };
  const pulse = clamp(spr(t, 9.16, 1.2, 3) * Math.exp(-1.2 * Math.max(0, t - 9.16)));
  const rot = -t * 4;
  const confused = t > 12.14 && t < 13.3;
  const scratch = confused ? -150 + Math.sin(t * 22) * 9 : -150 * (1 - prog(t, 13.3, 13.6)) * (t > 13.3 ? 1 : 0);
  const sprout = spr(t, 13.3, 2.2, 6);
  const q = spr(t, 12.2, 2.6, 8) * (1 - prog(t, 13.3, 13.5));
  const count = t < 9.16 ? 100 : Math.round(lerp(100, 400, eio(prog(t, 9.16, 9.8))));
  const panel = spr(t, 8.5, 2, 7);
  return (
    <Stage bg={C.deep2}>
      <Layer cam={cam} d={0.1}>
        <rect x={-1000} y={-800} width={3920} height={2700} fill={C.deep2} />
        <Glow id="s2bg" x={960} y={540} r={1300} color={C.purple} op={0.6} />
        {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={rr(i, -600, 2500)} cy={rr(i + 1, -400, 1500)} r={rr(i + 2, 0.6, 1.8)} fill="#fff" opacity={0.3 + 0.4 * Math.sin(t * 2 + i)} />)}
        {[[260, 200, 0.6], [1650, 160, 0.45], [1760, 820, 0.5], [180, 760, 0.4]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${30 + i * 40}) scale(${s})`} opacity={0.55}>
            <ellipse rx={90} ry={26} fill={C.light} opacity={0.25} /><ellipse rx={30} ry={10} fill="#fff" opacity={0.6} />
          </g>
        ))}
      </Layer>
      <Layer cam={cam} d={1}>
        <g transform={`translate(960 470) scale(1 0.62) rotate(${rot})`}>
          <Glow id="gcore2" x={0} y={0} r={620} color={C.pink} op={0.45} />
          {GAL.filter((_, i) => i % 9 === 0).map((p, i) => <circle key={`h${i}`} cx={p.x} cy={p.y} r={44} fill={i % 2 ? C.purple : C.pink} opacity={0.07} />)}
          {GAL.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r * (1 + pulse * 0.6)} fill={p.c} opacity={p.o} />)}
          <Glow id="gcore" x={0} y={0} r={230} color={C.yellow} op={0.95} />
          <circle r={34} fill="#FFF6D6" />
        </g>
      </Layer>
      <Layer cam={cam} d={1.25}>
        <g transform={`translate(0 ${Math.sin(t * 0.9) * 8})`}>
          <circle cx={380} cy={1050} r={190} fill="#3B2A7A" />
          <path d="M190 1050 A190 190 0 0 1 570 1050 A190 120 0 0 0 190 1050 Z" fill="#5240A0" />
          {[[300, 990, 22], [450, 1010, 16], [370, 1120, 28], [510, 1100, 14]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#2A1D60" />)}
          <RoundTree x={478} y={872} h={110} g={sprout} c={C.leaf3} c2={C.leaf} sway={Math.sin(t * 2) * 2} seed={3} />
          <Bird who="luma" uid="s2l" t={t} p={{
            x: 350, y: 872, s: 0.85, turn: t > 8.6 && t < 12 ? 0.35 : 0.2, head: confused ? -9 : -4 + Math.sin(t) * 2,
            lx: t > 13.3 ? 0.8 : t > 8.6 && t < 12 ? 0.9 : 0.2, ly: t > 13.3 ? 0.7 : -0.7, blink: blink(t, 5),
            mood: t > 13.3 ? "surprised" : confused ? "confused" : t < 7.3 ? "surprised" : "neutral",
            wl: scratch, wr: confused ? -20 : 0, sq: 1 - 0.08 * wob(t, 13.3, 3, 6),
          }} />
          {q > 0.01 && (
            <g transform={`translate(${300} ${600}) scale(${q}) rotate(${Math.sin(t * 5) * 8})`}>
              <text x={0} y={0} fontFamily={FONT} fontWeight={900} fontSize={110} fill={C.yellow} textAnchor="middle">?</text>
            </g>
          )}
        </g>
        <Motes t={t} n={22} seed={21} color={C.light} r={[1.5, 3]} glow area={[-100, -100, 2000, 1200]} speed={0.3} op={0.5} />
      </Layer>
      {panel > 0.01 && (
        <g transform={`translate(1440 850) scale(${0.85 + 0.15 * panel})`} opacity={clamp(panel * 1.4)}>
          <rect x={-380} y={-130} width={760} height={240} rx={36} fill={C.deep} opacity={0.82} />
          <rect x={-380} y={-130} width={760} height={240} rx={36} fill="none" stroke={C.light} strokeWidth={3} opacity={0.7} />
          <PopText t={t} t0={8.7} x={t < 9.16 ? 0 : -150} y={10} size={118} color="#fff" anchor="middle">100</PopText>
          <PopText t={t} t0={9.16} x={-30} y={10} size={118} color={C.light} anchor="middle">–</PopText>
          <PopText t={t} t0={9.16} x={120} y={10} size={118} color={C.yellow} anchor="middle">{String(count)}</PopText>
          <PopText t={t} t0={9.86} x={-10} y={78} size={46} color={C.light} anchor="end" weight={700}>mil millones</PopText>
          <PopText t={t} t0={10.98} x={10} y={78} size={46} color="#fff" anchor="start" weight={700}>de estrellas</PopText>
        </g>
      )}
    </Stage>
  );
};

// ───────────────────────── S3 · 14-23,9 · órbita: el satélite estima 400 mil millones · empate ─────────────────────────
export const S3: React.FC<{ t: number }> = ({ t }) => {
  const satX = mix(t, 14.0, 23.9, 380, 1080, (k) => k), satY = 360 + Math.sin(t * 0.8) * 10;
  const dive = ei(prog(t, 23.35, 23.95));
  const cam: Cam = { x: mix(t, 14, 16.5, -60, 0) + (satX - 700) * 0.18 * (1 - dive), y: mix(t, 14, 16.5, 80, 0) + dive * 200, z: mix(t, 14, 16.5, 1.18, 1.0) * (1 + dive * 2.4) };
  const panel = spr(t, 18.6, 2, 7);
  const n = lerp(0, 400e9, eio(prog(t, 19.04, 20.9)));
  const bal = spr(t, 21.45, 1.5, 6);
  const tilt = t < 21.6 ? 14 : 14 * Math.exp(-2.6 * (t - 21.6)) * Math.cos(2 * Math.PI * 1.1 * (t - 21.6));
  const ding = clamp(1 - prog(t, 23.08, 23.7)) * (t > 23.08 ? 1 : 0);
  const shrug = Math.sin(Math.PI * clamp(prog(t, 21.94, 22.6)));
  const beamW = 70 + Math.sin(t * 9) * 4;
  return (
    <Stage bg="#0B2E6E">
      <Layer cam={cam} d={0.12}>
        <defs><linearGradient id="s3sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0A1F5C" /><stop offset="0.7" stopColor="#1567A8" /><stop offset="1" stopColor={C.cyan} /></linearGradient></defs>
        <rect x={-900} y={-700} width={3720} height={2600} fill="url(#s3sky)" />
        {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={rr(i + 300, -600, 2500)} cy={rr(i + 301, -500, 500)} r={rr(i + 302, 0.6, 2)} fill="#fff" opacity={0.25 + 0.3 * Math.sin(t * 2 + i)} />)}
        {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={960} cy={1650} rx={1150 + i * 140} ry={1150 + i * 140} fill="none" stroke={C.teal} strokeWidth={2} opacity={0.07} />)}
      </Layer>
      <PopText t={t} t0={14.46} x={960 - cam.x * 0.3} y={330} size={300} color={C.light} out={16.4} weight={900}>2015</PopText>
      <Layer cam={cam} d={1}>
        <Earth cx={960} cy={1700} r={1080} rot={0.6 + t * 0.035} t={t} id="s3e" scan={t > 16.8 && t < 21.2 ? satX : -1} cover={0} />
        {t > 16.8 && t < 21.4 && (
          <g opacity={clamp(prog(t, 16.8, 17.2)) * (1 - prog(t, 21.0, 21.4))}>
            <defs><linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.teal} stopOpacity="0.7" /><stop offset="1" stopColor={C.teal} stopOpacity="0.08" /></linearGradient></defs>
            <path d={`M${satX - 22} ${satY + 75} L${satX + 22} ${satY + 75} L${satX + beamW} ${640} L${satX - beamW} ${640} Z`} fill="url(#beam)" />
            {[0, 1, 2].map((i) => { const k = ((t * 1.4 + i / 3) % 1); return <ellipse key={i} cx={satX} cy={lerp(satY + 80, 640, k)} rx={lerp(14, beamW, k)} ry={lerp(3, 10, k)} fill="none" stroke={C.teal} strokeWidth={2} opacity={0.6 * (1 - k)} />; })}
          </g>
        )}
        <Satellite x={satX} y={satY} t={t} s={1.5} rot={Math.sin(t * 0.6) * 4} />
        <Bird who="luma" uid="s3l" t={t} p={{
          x: satX - 8, y: satY - 46, s: 0.72, turn: 0.4, lx: 0.6, ly: t > 21.9 ? -0.2 : 0.8, head: 6 + Math.sin(t * 1.1) * 3, blink: blink(t, 8),
          mood: t > 21.9 && t < 22.9 ? "confused" : t > 16 && t < 17 ? "worried" : "neutral", wl: -60 * shrug, wr: -60 * shrug, sq: 1 - 0.06 * shrug,
        }} />
        {panel > 0.01 && (
          <g opacity={clamp(panel * 1.4) * (1 - prog(t, 21.2, 21.5))}>
            <line x1={satX + 60} y1={satY - 50} x2={satX + 150} y2={satY - 150} stroke={C.teal} strokeWidth={3} />
            <g transform={`translate(${satX + 360} ${satY - 190}) scale(${0.85 + 0.15 * panel})`}>
              <rect x={-230} y={-80} width={460} height={150} rx={26} fill="#06204F" opacity={0.85} />
              <rect x={-230} y={-80} width={460} height={150} rx={26} fill="none" stroke={C.teal} strokeWidth={3} />
              <text x={0} y={2} fontFamily={FONT} fontWeight={800} fontSize={56} fill="#fff" textAnchor="middle">≈ {fmt(n)}</text>
              <text x={0} y={50} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.leaf3} textAnchor="middle" opacity={clamp(prog(t, 20.8, 21.1))}>árboles</text>
            </g>
          </g>
        )}
        {bal > 0.01 && (
          <g transform={`translate(${lerp(2300, 1500, Math.min(bal, 1.1))} 0)`}>
            <Balance x={0} y={250} s={0.78} tilt={tilt} stars={10} trees={10} t={t} />
            <text x={-180} y={600} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.yellow} textAnchor="middle">estrellas</text>
            <text x={180} y={600} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.leaf3} textAnchor="middle">árboles</text>
            {ding > 0 && <circle cx={0} cy={250} r={30 + (1 - ding) * 120} fill="none" stroke={C.yellow} strokeWidth={6} opacity={ding} />}
          </g>
        )}
      </Layer>
    </Stage>
  );
};
