// arboles60 — escenas 4-7
import React from "react";
import { Bird, Clipboard, Person, Tape } from "./chars";
import { Balance, Burst, Earth, NightWorld, Pine, RoundTree, Stump } from "./env";
import { C, Cam, FONT, Glow, Layer, Motes, PopText, Stage, antic, blink, clamp, eback, ei, eio, eo, fmt, lerp, mix, nz, prog, rnd, rr, spr, wob } from "./lib";

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const lerpColor = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(",")})`; };

const Check: React.FC<{ x: number; y: number; g: number }> = ({ x, y, g }) => g <= 0.01 ? null : (
  <g transform={`translate(${x} ${y}) scale(${g})`}>
    <circle r={30} fill={C.leaf3} /><circle r={30} fill="none" stroke="#fff" strokeWidth={5} />
    <path d="M-13 1 L-3 11 L14 -10" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

// ───────────────────────── S4 · 23,9-41,5 · salir a contar → cruzar capas → todo el planeta ─────────────────────────
const FLAGS = Array.from({ length: 46 }, (_, i) => ({ x: rr(i + 600, -1400, 3300), y: rr(i + 601, 620, 760), t0: 28.4 + rnd(i + 602) * 3.0, far: rnd(i + 603) > 0.5 }));
const PLOT_TREES = [1010, 1220, 1430];

const S4Ground: React.FC<{ t: number }> = ({ t }) => {
  const back = ei(prog(t, 28.3, 31.9)), whip = eo(prog(t, 32.45, 32.85)), up = ei(prog(t, 33.55, 34.0));
  const zoomOut = lerp(1, 0.5, back), zIn = lerp(zoomOut, 1.22, whip);
  const cam: Cam = { x: lerp(lerp(mix(t, 23.9, 28, -80, 120), 200, back), 260, whip), y: lerp(lerp(0, -160, back), 40, whip) - up * 1500, z: zIn };
  // Tito: entra caminando, se frena, levanta la tablilla; durante el alejamiento va hasta los árboles
  const tw = eo(prog(t, 24.2, 26.7)), tx = t < 28.5 ? lerp(-260, 820, tw) : lerp(820, 1110, eio(prog(t, 28.6, 31.5)));
  const walkingT = (t > 24.2 && t < 26.6) || (t > 28.6 && t < 31.4);
  const lw = eo(prog(t, 24.7, 27.1)), lx = lerp(-460, 600, lw);
  const walkingL = t > 24.7 && t < 27.0;
  const raise = antic(t, 27.0, 0.2, 0.15, 2, 7);
  const taps = [32.92, 33.1, 33.34];
  const tapIdx = taps.filter((x) => t >= x).length;
  const point = tapIdx > 0 && t < 33.6 ? -95 + 15 * wob(t, taps[tapIdx - 1], 4, 8) : 0;
  const count = t < 28.3 ? 0 : Math.round(lerp(0, 429775, eio(prog(t, 28.3, 31.9))));
  return (
    <g>
      <Layer cam={cam} d={0.15}>
        <defs><linearGradient id="s4sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#127A86" /><stop offset="0.6" stopColor="#5FD3C0" /><stop offset="1" stopColor="#D8F7E4" /></linearGradient></defs>
        <rect x={-2600} y={-2400} width={7000} height={4400} fill="url(#s4sky)" />
        <Glow id="s4sun" x={1480} y={240} r={420} color={C.yellow} op={0.8} />
        <circle cx={1480} cy={240} r={70} fill="#FFF3B8" />
        {[[200, 200], [900, 140], [1900, 230], [-600, 170], [2600, 120]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x + t * 8} ${y})`} opacity={0.85}>
            <ellipse rx={110} ry={30} fill="#fff" /><ellipse cx={-40} cy={-20} rx={60} ry={34} fill="#fff" /><ellipse cx={35} cy={-26} rx={50} ry={30} fill="#fff" />
          </g>
        ))}
      </Layer>
      <Layer cam={cam} d={0.32}>
        <path d="M-2600 700 C -1800 560, -1100 620, -400 560 C 300 500, 900 600, 1500 540 C 2200 480, 2900 600, 4400 560 L4400 2000 L-2600 2000 Z" fill="#3AA88F" />
        {Array.from({ length: 70 }, (_, i) => <RoundTree key={i} x={rr(i + 700, -2500, 4300)} y={rr(i + 701, 600, 640)} h={rr(i + 702, 50, 80)} c="#2F9578" c2="#277F67" trunk="#277F67" seed={i} />)}
        {FLAGS.filter((f) => f.far).map((f, i) => {
          const g = clamp(spr(t, f.t0, 2.5, 8)); if (g <= 0) return null;
          return <g key={i} transform={`translate(${f.x} ${f.y - 40}) scale(${g * 1.6})`}><rect x={-30} y={20} width={60} height={22} fill="none" stroke="#FFE6B0" strokeWidth={3} /><line x1={0} y1={30} x2={0} y2={-14} stroke="#5C3A1E" strokeWidth={4} /><path d="M0 -14 L26 -6 L0 2 Z" fill={C.orange} /></g>;
        })}
      </Layer>
      <Layer cam={cam} d={0.6}>
        <path d="M-2600 790 C -1700 720, -900 770, -100 730 C 700 690, 1300 770, 2000 730 C 2800 690, 3500 760, 4400 730 L4400 2000 L-2600 2000 Z" fill="#46B76A" />
        {Array.from({ length: 60 }, (_, i) => {
          const x = rr(i + 800, -2500, 4300), y = 760 + rr(i + 801, -10, 30);
          return rnd(i + 802) > 0.5 ? <RoundTree key={i} x={x} y={y} h={rr(i + 803, 130, 200)} c={C.leaf2} c2="#237A45" seed={i} sway={Math.sin(t * 1.2 + i) * 1.5} /> : <Pine key={i} x={x} y={y} h={rr(i + 804, 150, 230)} c="#23804A" c2="#1C6B3D" sway={Math.sin(t * 1.1 + i) * 1.5} />;
        })}
        {FLAGS.filter((f) => !f.far).map((f, i) => {
          const g = clamp(spr(t, f.t0, 2.5, 8)); if (g <= 0) return null;
          return <g key={i} transform={`translate(${f.x} ${f.y + 30}) scale(${g * 2})`}><rect x={-34} y={18} width={68} height={24} fill="none" stroke="#FFE6B0" strokeWidth={3} /><line x1={0} y1={30} x2={0} y2={-16} stroke="#5C3A1E" strokeWidth={4} /><path d="M0 -16 L28 -7 L0 2 Z" fill={C.orange} /></g>;
        })}
      </Layer>
      <Layer cam={cam} d={1}>
        <path d="M-2600 900 C -1500 860, -500 880, 400 870 C 1200 862, 2000 900, 4400 880 L4400 2200 L-2600 2200 Z" fill="#5ACB6E" />
        <path d="M-2600 960 C -1200 930, 0 950, 1000 940 C 2000 930, 3000 960, 4400 950 L4400 2200 L-2600 2200 Z" fill="#4DB862" />
        {/* parcela con estacas y soga */}
        <path d="M900 900 L1540 900" stroke="#FFE6B0" strokeWidth={5} strokeDasharray="14 10" />
        {[900, 1540].map((x) => <rect key={x} x={x - 6} y={850} width={12} height={60} rx={4} fill="#7A4A2E" />)}
        {PLOT_TREES.map((x, i) => {
          const tp = taps[i], b = wob(t, tp, 3, 7);
          return (
            <g key={i}>
              <g transform={`translate(${x} 900) scale(${1 + 0.06 * b} ${1 - 0.08 * b}) translate(${-x} -900)`}>
                <RoundTree x={x} y={900} h={i === 1 ? 360 : 310} c={C.leaf} c2={C.leaf2} seed={i + 2} sway={Math.sin(t * 1.3 + i) * 1.2} />
              </g>
              {t > tp && <rect x={x - 22} y={760} width={44} height={10} rx={4} fill={C.yellow} />}
              <Check x={x} y={i === 1 ? 480 : 530} g={clamp(spr(t, tp, 2.6, 8))} />
            </g>
          );
        })}
        {/* cartel con el contador de mediciones */}
        <g transform="translate(620 910)">
          <rect x={-8} y={-170} width={16} height={170} fill="#7A4A2E" />
          <rect x={-190} y={-310} width={380} height={150} rx={18} fill="#B5743A" />
          <rect x={-176} y={-296} width={352} height={122} rx={12} fill="#FFF3DC" />
          <text x={0} y={-252} fontFamily={FONT} fontWeight={700} fontSize={30} fill="#8A5A2E" textAnchor="middle">mediciones</text>
          <text x={0} y={-196} fontFamily={FONT} fontWeight={900} fontSize={56} fill={C.leaf2} textAnchor="middle">{fmt(count)}</text>
        </g>
        <Bird who="luma" uid="s4l" t={t} p={{
          x: lx, y: 912, s: 0.82, turn: walkingL ? 0.7 : 0.45, walk: walkingL ? t * 9 : null, lean: walkingL ? 4 : 0, blink: blink(t, 11),
          lx: 0.6, ly: -0.1, mood: "happy", handR: <Tape len={t > 27 ? 40 + Math.sin(t * 3) * 10 : 0} />, wr: t > 27 ? -40 : 0,
        }} />
        <Bird who="tito" uid="s4t" t={t} p={{
          x: tx, y: 906, s: 0.92, turn: walkingT ? 0.75 : tapIdx > 0 ? 0.3 : 0.45, walk: walkingT ? t * 9.5 : null, lean: walkingT ? 5 : 0,
          blink: blink(t, 12), lx: tapIdx === 1 ? -0.8 : tapIdx >= 2 ? 0.9 : 0.5, ly: t > 32.9 ? -0.4 : 0,
          mood: t > 27 ? "happy" : "neutral", face: tapIdx === 1 && t < 33.1 ? -1 : 1,
          handL: <Clipboard ticks={t > 32.9 ? tapIdx + 2 : t > 27.34 ? 2 : 0} />, wl: -30 - 50 * clamp(raise), wr: point,
          sq: 1 - 0.07 * wob(t, 26.7, 3, 7),
        }} />
      </Layer>
      <Layer cam={cam} d={1.4}>
        {[[-260, 1120, 1], [2180, 1140, -1], [80, 1180, 1]].map(([x, y, f], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${f * 1.4} 1.4) rotate(${Math.sin(t * 1.2 + i) * 3})`}>
            {[-50, -20, 10, 40].map((a, j) => <path key={j} d="M0 0 C 30 -60, 70 -140, 40 -240 C 10 -150, -10 -60, 0 0 Z" fill={j % 2 ? "#1F7A47" : "#25904F"} transform={`rotate(${a})`} />)}
          </g>
        ))}
        <Motes t={t} n={24} seed={44} color="#FFF8C8" r={[2, 4]} glow area={[-400, 200, 2300, 1100]} speed={0.4} op={0.7} />
      </Layer>
      {up > 0 && <g opacity={up}>{Array.from({ length: 30 }, (_, i) => <rect key={i} x={rr(i + 950, 0, 1920)} y={0} width={rr(i + 951, 2, 6)} height={1080} fill="#fff" opacity={0.25} />)}</g>}
    </g>
  );
};

const Sheet: React.FC<{ x: number; y: number; g: number; kind: 0 | 1 | 2; label: string; t: number; o?: number; s?: number }> = ({ x, y, g, kind, label, t, o = 1, s = 1 }) => {
  if (g <= 0.01 || o <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${g * s}) skewX(-12)`} opacity={o * clamp(g)}>
      <rect x={-150} y={-70} width={300} height={140} rx={18} fill="#0E2E4F" opacity={0.85} />
      <g clipPath="">
        {kind === 0 && Array.from({ length: 24 }, (_, i) => <rect key={i} x={-140 + (i % 8) * 35} y={-60 + Math.floor(i / 8) * 35} width={33} height={33} fill={["#3FAE5A", "#2C8A48", "#D9B26A", "#5BC46E", "#243CDB"][Math.floor(rnd(i + 990) * 5)]} />)}
        {kind === 1 && (
          <g>
            <rect x={-140} y={-60} width={280} height={105} rx={10} fill="#3C8DDB" />
            <circle cx={-80} cy={-15} r={26} fill={C.yellow} />
            <g transform={`translate(${30 + Math.sin(t) * 6} -10)`}><ellipse rx={50} ry={20} fill="#fff" /><ellipse cx={-18} cy={-14} rx={26} ry={18} fill="#fff" /></g>
            {[0, 1, 2, 3].map((i) => <line key={i} x1={10 + i * 18} y1={18} x2={4 + i * 18} y2={36} stroke="#BFE3FF" strokeWidth={4} strokeLinecap="round" />)}
          </g>
        )}
        {kind === 2 && ["#8B5A2B", "#A86F38", "#6E4421", "#C48A4A"].map((c, i) => <path key={i} d={`M-140 ${-60 + i * 26} Q 0 ${-70 + i * 26 + Math.sin(i) * 8} 140 ${-60 + i * 26} L140 ${-34 + i * 26} Q 0 ${-44 + i * 26} -140 ${-34 + i * 26} Z`} fill={c} />)}
      </g>
      <rect x={-150} y={-70} width={300} height={140} rx={18} fill="none" stroke={C.teal} strokeWidth={4} />
      <text x={0} y={104} fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff" textAnchor="middle" transform="skewX(12)">{label}</text>
    </g>
  );
};

const S4Globe: React.FC<{ t: number }> = ({ t }) => {
  const arr = eback(prog(t, 33.85, 34.6));
  const cam: Cam = { x: 0, y: 0, z: mix(t, 34, 41.5, 1.0, 1.08, (k) => k) };
  const cover = eio(prog(t, 39.1, 40.7));
  const fly = (k0: number) => eio(prog(t, k0, k0 + 0.55));
  const sheets: [number, 0 | 1 | 2, string, number][] = [[35.98, 0, "satélite", 330], [37.64, 1, "clima", 560], [38.1, 2, "suelo", 790]];
  const hop = prog(t, 40.55, 41.0), jy = hop > 0 && hop < 1 ? Math.sin(Math.PI * hop) * 50 : 0;
  return (
    <g>
      <Layer cam={cam} d={0.15}>
        <defs><radialGradient id="s4g" cx="0.5" cy="0.5" r="0.8"><stop offset="0" stopColor="#1F7F8C" /><stop offset="1" stopColor="#0A2B4A" /></radialGradient></defs>
        <rect x={-600} y={-600} width={3120} height={2280} fill="url(#s4g)" />
        {Array.from({ length: 120 }, (_, i) => <circle key={i} cx={rr(i + 1200, -300, 2200)} cy={rr(i + 1201, -300, 1400)} r={rr(i + 1202, 0.6, 2)} fill="#fff" opacity={0.3 + 0.4 * Math.sin(t * 2 + i)} />)}
      </Layer>
      <Layer cam={cam} d={1}>
        <g transform={`translate(0 ${(1 - arr) * -900})`}>
          <Earth cx={1060} cy={620} r={380} rot={1.2 + t * 0.12 + cover * 0.6} t={t} id="s4e" pins={t - 34.4} cover={cover} />
          {cover > 0 && cover < 1 && <circle cx={1060} cy={620} r={380 + cover * 60} fill="none" stroke={C.leaf3} strokeWidth={8 * (1 - cover)} opacity={1 - cover} />}
          <Bird who="tito" uid="s4gt" t={t} p={{
            x: 1060, y: 246, s: 0.72, turn: 0.3, blink: blink(t, 14), lx: -0.8, ly: 0.2, mood: t > 39 ? "happy" : "neutral",
            jy, sq: 1 - 0.1 * wob(t, 41.0, 3, 7) + (hop > 0 && hop < 1 ? 0.08 : 0), wl: t > 35.9 && t < 38.8 ? -110 : jy > 0 ? -60 : 0,
            wr: jy > 0 ? -60 : 0, handR: <Clipboard ticks={5} />,
          }} />
        </g>
        {sheets.map(([t0, kind, label, y], i) => {
          const f = fly(38.82 + i * 0.16);
          const x = lerp(400, 1060, f), yy = lerp(y, 600, f);
          return <Sheet key={i} x={x} y={yy} g={spr(t, t0, 2.2, 7)} kind={kind} label={label} t={t} s={lerp(1, 0.3, f)} o={1 - prog(f, 0.75, 1)} />;
        })}
        {[0, 1, 2].map((i) => {
          const f = fly(38.82 + i * 0.16);
          if (f <= 0 || f >= 1) return null;
          return <line key={i} x1={lerp(560, 1060, f * 0.6)} y1={lerp(sheets[i][3], 600, f * 0.6)} x2={lerp(560, 1060, f)} y2={lerp(sheets[i][3], 600, f)} stroke={C.teal} strokeWidth={6} strokeLinecap="round" opacity={0.7} />;
        })}
      </Layer>
      <Layer cam={cam} d={1.3}><Motes t={t} n={20} seed={66} color={C.teal} r={[1.5, 3]} glow speed={0.3} op={0.5} /></Layer>
    </g>
  );
};

export const S4: React.FC<{ t: number }> = ({ t }) => (
  <Stage bg="#127A86">
    {t < 34.05 && <S4Ground t={t} />}
    {t >= 33.85 && <g opacity={clamp(prog(t, 33.85, 34.05))}><S4Globe t={t} /></g>}
  </Stage>
);

// ───────────────────────── S5 · 41,5-50,8 · revelación: 3 billones · ×8 · 400 por persona ─────────────────────────
const BIG = "3.000.000.000.000";
const BIGX: [string, number][] = (() => { const w = (c: string) => (c === "." ? 26 : 66); const tot = BIG.split("").reduce((a, c) => a + w(c), 0); let x = -tot / 2; return BIG.split("").map((c) => { const r: [string, number] = [c, x + w(c) / 2]; x += w(c); return r; }); })();
export const S5: React.FC<{ t: number }> = ({ t }) => {
  const crash = t < 43.48 ? 0 : spr(t, 43.48, 1.8, 5) * (1 - eio(prog(t, 44.9, 45.6)));
  const cam: Cam = { x: crash * 40, y: crash * -60, z: 1 + crash * 0.18 + mix(t, 41.5, 50.8, 0, 0.05, (k) => k) };
  const tilt = t < 43.8 ? 0 : 18 * spr(t, 43.8, 1.1, 4.5);
  const balOut = ei(prog(t, 45.15, 45.6));
  const crateOut = ei(prog(t, 47.7, 48.1));
  const hop = prog(t, 44.5, 44.95), jy = hop > 0 && hop < 1 ? Math.sin(Math.PI * hop) * 80 : 0;
  const pre = t > 44.3 && t < 44.5 ? -0.12 * Math.sin(Math.PI / 2 * prog(t, 44.3, 44.5)) : 0;
  const crates = Array.from({ length: 8 }, (_, i) => ({ col: i % 2, row: Math.floor(i / 2), t0: 45.62 + i * 0.165 }));
  return (
    <Stage bg={C.orange}>
      <Layer cam={cam} d={0.15}>
        <defs><linearGradient id="s5sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF7A12" /><stop offset="1" stopColor="#FFC15A" /></linearGradient></defs>
        <rect x={-800} y={-800} width={3520} height={2700} fill="url(#s5sky)" />
        <Burst x={960} y={380} t={t} color={C.yellow} op={0.22} />
        <Glow id="s5sun" x={960} y={380} r={700} color="#FFE7A0" op={0.6} />
      </Layer>
      <Layer cam={cam} d={0.45}>
        <path d="M-800 820 C -200 760, 400 800, 900 780 C 1400 760, 1900 800, 2720 770 L2720 1800 L-800 1800 Z" fill="#F07A1E" />
        {Array.from({ length: 34 }, (_, i) => { const x = rr(i + 1400, -700, 2650); return rnd(i + 1401) > 0.5 ? <Pine key={i} x={x} y={800} h={rr(i + 1402, 70, 120)} c="#D45F10" c2="#C4530C" trunk="#C4530C" /> : <RoundTree key={i} x={x} y={800} h={rr(i + 1403, 60, 100)} c="#D45F10" c2="#C4530C" trunk="#C4530C" seed={i} />; })}
      </Layer>
      <Layer cam={cam} d={1}>
        <path d="M-800 950 C -100 900, 700 930, 1200 920 C 1700 910, 2200 950, 2720 930 L2720 1900 L-800 1900 Z" fill="#E2650F" />
        {balOut < 1 && (
          <g transform={`translate(${-balOut * 1500} 0)`}>
            <Balance x={640} y={330} s={1.05} tilt={tilt} stars={10} trees={Math.round(lerp(10, 30, clamp(prog(t, 43.8, 44.6))))} t={t} />
          </g>
        )}
        {/* cajones de árboles: antes 1 · ahora 8 */}
        {t > 45.4 && crateOut < 1 && (
          <g transform={`translate(0 ${crateOut * 900})`}>
            <g transform="translate(560 920)">
              <Crate g={spr(t, 45.45, 2.4, 8)} />
              <text x={0} y={60} fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff" textAnchor="middle" opacity={clamp(prog(t, 45.5, 45.8))}>lo que se creía</text>
            </g>
            {crates.map((c, i) => {
              const k = prog(t, c.t0, c.t0 + 0.32); if (k <= 0) return null;
              const land = c.t0 + 0.32, yy = 920 - c.row * 130 - (1 - k * k) * 700;
              return <g key={i} transform={`translate(${1050 + c.col * 190} ${yy})`}><Crate g={1} sq={wob(t, land, 3, 8)} /></g>;
            })}
            <PopText t={t} t0={46.96} x={1500} y={560} size={170} color="#fff" shadow="#C4530C" weight={900}>×8</PopText>
          </g>
        )}
        {/* 400 árboles por persona */}
        {t > 47.9 && (
          <g>
            <Person x={520} y={930} s={1.25 * spr(t, 47.95, 2, 7)} color={C.royal} wave={t > 48.3 ? (Math.sin(t * 8) * 0.5 + 0.5) * (1 - prog(t, 49.3, 49.6)) : 0} />
            {Array.from({ length: 400 }, (_, i) => {
              const c = i % 25, r = Math.floor(i / 25), t0 = 48.2 + (c + r) * 0.034;
              const g = clamp(spr(t, t0, 3, 9) * 1.0); if (g <= 0) return null;
              return <Pine key={i} x={760 + c * 31} y={430 + r * 31} h={34} g={g} c={r % 2 ? C.leaf : C.leaf2} c2="#1C6B3D" />;
            })}
            <PopText t={t} t0={48.36} x={1150} y={360} size={110} color="#fff" shadow="#C4530C" weight={900}>400+</PopText>
            <PopText t={t} t0={49.5} x={520} y={600} size={46} color="#fff" shadow="#C4530C" weight={800}>por persona</PopText>
          </g>
        )}
        <Bird who="tito" uid="s5t" t={t} p={{
          x: t < 47.8 ? 1540 : 1700, y: 920, s: 0.9, turn: 0.35, face: -1, jy, sq: 1 + pre - 0.15 * wob(t, 44.95, 3, 7) + (jy > 0 ? 0.08 : 0),
          blink: blink(t, 15), lx: 0.7, ly: t < 45 ? -0.7 : -0.2, mood: t > 43.4 ? (t > 43.5 && t < 44.4 ? "surprised" : "happy") : "neutral",
          wl: jy > 0 ? -70 : 0, wr: jy > 0 ? -70 : t > 48.4 ? -100 : 0, handL: t < 44.3 ? <Clipboard ticks={5} /> : undefined,
        }} />
      </Layer>
      {/* número gigante */}
      <g transform="translate(0 0)" opacity={1 - prog(t, 45.15, 45.45)}>
        {BIGX.map(([ch, x], i) => (
          <PopText key={i} t={t} t0={43.48 + i * 0.028} x={1240 + x} y={260} size={104} color="#fff" shadow="#B4470A" weight={900}>{ch}</PopText>
        ))}
        <PopText t={t} t0={44.5} x={1240} y={350} size={58} color={C.ink} weight={800}>árboles</PopText>
      </g>
    </Stage>
  );
};
const Crate: React.FC<{ g: number; sq?: number }> = ({ g, sq = 0 }) => g <= 0.01 ? null : (
  <g transform={`scale(${g * (1 + 0.15 * sq)} ${g * (1 - 0.15 * sq)})`}>
    {[-40, 0, 40].map((x, i) => <Pine key={i} x={x} y={-110} h={70} c={C.leaf} c2={C.leaf2} />)}
    <rect x={-80} y={-120} width={160} height={120} rx={10} fill="#B5743A" />
    <rect x={-80} y={-120} width={160} height={22} rx={8} fill="#9A5F2C" />
    <path d="M-70 -90 L70 -10 M70 -90 L-70 -10" stroke="#9A5F2C" strokeWidth={10} />
  </g>
);

// ───────────────────────── S6 · 50,8-61,4 · la otra cifra: casi la mitad · 15 mil millones por año ─────────────────────────
const S6T = Array.from({ length: 150 }, (_, i) => ({ x: -300 + i * 31 + rnd(i + 2000) * 22, back: i % 2 === 0, h: rr(i + 2001, 150, 260), cut: rnd(i + 2002) < 0.48, pine: rnd(i + 2003) > 0.55 }));
export const S6: React.FC<{ t: number }> = ({ t }) => {
  const camx = mix(t, 50.8, 61.4, 0, 2500, es2);
  const cam: Cam = { x: camx, y: 0, z: 1.0 };
  const front = mix(t, 54.3, 60.6, 900, 3900, (k) => k);
  const sky1 = t < 58 ? lerpColor("#FF8A2A", "#ED4BA4", prog(t, 55, 58)) : lerpColor("#ED4BA4", "#6535A8", prog(t, 58, 61.2));
  const sky2 = t < 58 ? lerpColor("#FFD08A", "#FF9AC8", prog(t, 55, 58)) : lerpColor("#FF9AC8", "#9C7BE0", prog(t, 58, 61.2));
  const gauge = clamp(prog(t, 56.42, 57.18)) * 0.46;
  const g1 = spr(t, 56.3, 2, 7), g2 = spr(t, 58.0, 2, 7);
  const titoX = camx + 380 + (t < 57.2 ? 0 : 0);
  const sit = eio(prog(t, 58.5, 59.0));
  return (
    <Stage bg="#FF8A2A">
      <Layer cam={cam} d={0.1}>
        <defs><linearGradient id="s6sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky1} /><stop offset="1" stopColor={sky2} /></linearGradient></defs>
        <rect x={-600} y={-400} width={5000} height={2000} fill="url(#s6sky)" />
        <Glow id="s6sun" x={1300 + camx * 0.2} y={mix(t, 50.8, 61.4, 300, 720, (k) => k)} r={500} color="#FFE7A0" op={1 - prog(t, 58, 61)} />
      </Layer>
      <Layer cam={cam} d={0.4}>
        <path d="M-800 760 C 0 700, 800 740, 1600 720 C 2400 700, 3200 750, 4800 720 L4800 2000 L-800 2000 Z" fill={lerpColor("#E8792A", "#8A3A9E", prog(t, 56, 61))} />
      </Layer>
      <Layer cam={cam} d={1}>
        <path d="M-600 880 C 400 850, 1400 870, 2400 860 C 3400 850, 4400 880, 5200 870 L5200 2000 L-600 2000 Z" fill={lerpColor("#D9671A", "#5A2E9E", prog(t, 56, 61))} />
        {/* campos y casas sobre lo desmontado */}
        {S6T.filter((s, i) => s.cut && i % 3 === 0).map((s, i) => {
          const g = clamp(spr(t, 54.3 + (s.x - 900) / 3000 * 6.3 + 0.4, 2, 7)); if (g <= 0 || s.x < 900) return null;
          return <g key={i} transform={`translate(${s.x} 900) scale(${g})`}>{i % 2 ? <g><rect x={-30} y={-46} width={60} height={46} fill="#F2E2C4" /><path d="M-38 -44 L0 -78 L38 -44 Z" fill={C.pink} /><rect x={-8} y={-26} width={16} height={26} fill="#8A5A2E" /></g> : <g>{[0, 1, 2].map((j) => <rect key={j} x={-60} y={4 + j * 14} width={120} height={10} rx={5} fill={j % 2 ? "#FFC15A" : "#F0A040"} />)}</g>}</g>;
        })}
        {S6T.map((s, i) => {
          const gone = s.cut && s.x > 900 && front > s.x;
          const k = gone ? prog(front, s.x, s.x + 120) : 0;
          const y = s.back ? 860 : 905, h = s.back ? s.h * 0.8 : s.h;
          const c = lerpColor(s.back ? "#2C9A55" : "#3FB55A", s.back ? "#3B2E7A" : "#4A3A92", prog(t, 57, 61.2));
          const c2 = lerpColor(s.back ? "#237A45" : "#2C9A55", "#2E2266", prog(t, 57, 61.2));
          return (
            <g key={i}>
              {k > 0 && <Stump x={s.x} y={y} h={h} />}
              {k < 1 && (s.pine ? <Pine x={s.x} y={y} h={h} g={1 - eio(k)} c={c} c2={c2} sway={Math.sin(t + i) * 1.5} /> : <RoundTree x={s.x} y={y} h={h} g={1 - eio(k)} c={c} c2={c2} seed={i} sway={Math.sin(t + i) * 1.5} />)}
              {k > 0 && k < 1 && Array.from({ length: 6 }, (_, j) => <circle key={j} cx={s.x + Math.cos(j) * 60 * k} cy={y - h * 0.4 - Math.sin(j * 1.7) * 50 * k} r={14 * (1 - k)} fill="#fff" opacity={0.6 * (1 - k)} />)}
            </g>
          );
        })}
        {/* frente del tiempo */}
        {t > 54.2 && <g opacity={clamp(prog(t, 54.2, 54.6)) * (1 - prog(t, 60.6, 61))}><rect x={front - 3} y={300} width={6} height={620} fill="#fff" opacity={0.6} /><Glow id="s6f" x={front} y={600} r={260} color="#fff" op={0.35} /></g>}
        <Bird who="tito" uid="s6t" t={t} p={{
          x: titoX, y: 935, s: 0.9, turn: 0.55, walk: t < 57.2 ? t * 8 : null, lean: t < 57.2 ? 4 : 0, blink: blink(t, 17),
          mood: t > 55.5 ? "worried" : "neutral", lx: t > 58 ? 0.3 : 0.8, ly: t > 58 ? 0.6 : -0.2, head: t > 58 ? 7 : 0,
          sq: 1 - 0.12 * sit, jy: 0, handL: <Clipboard ticks={5} flip={clamp(prog(t, 51.06, 51.5))} />, wl: lerp(-40, 10, sit),
        }} />
      </Layer>
      {/* línea de tiempo abajo */}
      <g opacity={clamp(prog(t, 54.0, 54.4))}>
        <rect x={200} y={1012} width={1520} height={12} rx={6} fill="#fff" opacity={0.35} />
        <rect x={200} y={1012} width={1520 * clamp((front - 900) / 3000)} height={12} rx={6} fill="#fff" />
        <circle cx={200 + 1520 * clamp((front - 900) / 3000)} cy={1018} r={16} fill="#fff" />
        <PopText t={t} t0={54.34} x={200} y={990} size={30} color="#fff" anchor="start" weight={800}>inicio de la civilización</PopText>
        <PopText t={t} t0={59.4} x={1720} y={990} size={30} color="#fff" anchor="end" weight={800}>hoy</PopText>
      </g>
      {/* medidor −46 % y contador anual */}
      {g1 > 0.01 && (
        <g transform={`translate(1560 250) scale(${g1})`}>
          <circle r={120} fill={C.ink} opacity={0.55} />
          <circle r={98} fill="none" stroke="#ffffff33" strokeWidth={22} />
          <circle r={98} fill="none" stroke={C.yellow} strokeWidth={22} strokeDasharray={`${2 * Math.PI * 98 * gauge} 1000`} transform="rotate(-90)" strokeLinecap="round" />
          <text x={0} y={18} fontFamily={FONT} fontWeight={900} fontSize={58} fill="#fff" textAnchor="middle">−{Math.round(gauge * 100)}%</text>
        </g>
      )}
      {g2 > 0.01 && (
        <g transform={`translate(1560 520) scale(${g2})`}>
          <rect x={-250} y={-70} width={500} height={150} rx={26} fill={C.ink} opacity={0.6} />
          <text x={0} y={8} fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff" textAnchor="middle">{fmt(lerp(0, 15e9, eio(prog(t, 58.12, 60.28))))}</text>
          <text x={0} y={56} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.yellow} textAnchor="middle">talados cada año</text>
        </g>
      )}
    </Stage>
  );
};
const es2 = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;

// ───────────────────────── S7 · 61,4-fin · callback: el cielo sigue, los árboles dependen de nosotros ─────────────────────────
export const S7: React.FC<{ t: number }> = ({ t }) => {
  const down = eio(prog(t, 64.5, 65.7));
  const pull = eio(prog(t, 67.8, 72.8));
  const drift = eio(prog(t, 61.4, 65.7));
  const cam: Cam = { x: lerp(-140, 0, drift), y: lerp(-360, 0, down) - pull * 60, z: lerp(1.04, 1.12, drift) * lerp(1, 1.035, down) * lerp(1, 0.86, pull) };
  const shoot = prog(t, 62.5, 63.6);
  const sprout = spr(t, 65.9, 1.8, 6);
  const turnT = eio(prog(t, 65.5, 65.9)) * (1 - eio(prog(t, 67.6, 68.1)));
  const turnL = eio(prog(t, 66.9, 67.3)) * (1 - eio(prog(t, 67.8, 68.3)));
  const face = eio(prog(t, 69.3, 69.8));
  const cred = clamp(prog(t, 70.9, 71.4));
  return (
    <Stage bg={C.deep}>
      <NightWorld t={t} cam={cam} milky={1} flare={0.15 * Math.sin(t * 1.3)}>
        {/* brote */}
        <g transform={`translate(960 878) scale(${sprout})`}>
          <Glow id="sprg" x={0} y={-30} r={90} color={C.yellow} op={0.55} />
          <path d="M0 0 C 2 -20, -2 -40, 0 -56" stroke="#5BC46E" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M0 -40 C 16 -54, 34 -54, 42 -46 C 30 -34, 14 -34, 0 -40 Z" fill={C.leaf3} transform={`rotate(${Math.sin(t * 2) * 6})`} />
          <path d="M0 -50 C -14 -64, -32 -64, -40 -56 C -28 -44, -12 -44, 0 -50 Z" fill={C.leaf} transform={`rotate(${Math.sin(t * 2 + 1) * 6})`} />
        </g>
        {face < 1 && <g opacity={1}>
          <Bird who="tito" uid="s7t" t={t} p={{
            x: 820, y: 880, s: 0.9, back: turnT < 0.5, turn: turnT >= 0.5 ? 0.6 : 0, sq: 0.9, blink: blink(t, 19), lx: 0.6, ly: 0.6,
            mood: turnT >= 0.5 ? "happy" : "neutral", wr: t > 65.6 && t < 66.4 ? -60 * Math.sin(Math.PI * prog(t, 65.6, 66.4)) : 0,
          }} />
        </g>}
        {face >= 1 && <Bird who="tito" uid="s7t2" t={t} p={{ x: 820, y: 880, s: 0.9, back: true, sq: 0.9, blink: 0 }} />}
        <Bird who="luma" uid="s7l" t={t} p={{
          x: 1110, y: 884, s: 0.9, back: turnL < 0.5 && face < 0.5, turn: face >= 0.5 ? 0.15 : turnL >= 0.5 ? 0.6 : 0, face: turnL >= 0.5 && face < 0.5 ? -1 : 1,
          sq: 0.9, blink: blink(t, 20), lx: face >= 0.5 ? 0.2 : 0.6, ly: face >= 0.5 ? 0 : 0.6, head: face >= 0.5 ? -7 : 0,
          mood: face >= 0.5 ? "neutral" : "happy",
        }} />
      </NightWorld>
      {shoot > 0 && shoot < 1 && (
        <g opacity={Math.sin(Math.PI * shoot)}>
          <line x1={lerp(380, 1250, eo(shoot))} y1={lerp(120, 380, eo(shoot))} x2={lerp(380, 1250, eo(shoot)) - 190} y2={lerp(120, 380, eo(shoot)) - 57} stroke="#FFF6D6" strokeWidth={4} strokeLinecap="round" opacity={0.75} />
          <circle cx={lerp(380, 1250, eo(shoot))} cy={lerp(120, 380, eo(shoot))} r={6} fill="#FFFFFF" />
        </g>
      )}
      <text x={1880} y={1050} fontFamily={FONT} fontWeight={600} fontSize={22} fill="#C9D4FF" textAnchor="end" opacity={cred * 0.85}>Fuente: Crowther et al., Nature (2015)</text>
    </Stage>
  );
};
