// ap6nc — únicas 28-31: el éxodo, el oso sin cueva, el ciclo de la despensa y la regla del país de osos. Dibujado por código.
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, GOLD, Scene, Tag, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Bear, House, Snow, NIGHT, SNOW, FUR, RIM, AMB, ICEB, lp } from "./o9a";

type UP = { d: number; p: any };

// 28 · EL ÉXODO: las chimeneas dejan de humear una por una y una fila de puntos baja por el río hacia la costa
export const Exodus: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10), wk = at(p, "walk", 50);
  const H = [[300, 520], [520, 600], [760, 500], [980, 610], [1200, 520]];
  const path = (u: number) => [lp(260, 1820, u), 760 + Math.sin(u * 7) * 40] as const;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="200,210,230">
      <SV>
        <path d={Array.from({ length: 41 }).map((_, i) => { const [x, y] = path(i / 40); return `${i ? "L" : "M"}${x},${y}`; }).join(" ")} fill="none" stroke={ICEB} strokeWidth={22} opacity={0.6} strokeLinecap="round" />
        {H.map(([x, y], i) => { const off = ez(f, g + i * 8, g + i * 8 + 10);
          return <g key={i}><g transform={`translate(${x},${y}) scale(0.3)`}><House x={0} y={0} glow={0.7 * (1 - off)} /></g>
            {Array.from({ length: 4 }).map((_, j) => { const ph = ((f / 50) + j / 4) % 1; return <circle key={j} cx={x + 30 + ph * 20} cy={y - 90 - ph * 90} r={10 + ph * 16} fill="#9aa6b4" opacity={(1 - ph) * 0.45 * (1 - off)} />; })}</g>; })}
        {Array.from({ length: 14 }).map((_, i) => { const u = lin(f, wk + i * 3, wk + i * 3 + 220, 0.05, 0.95); const [x, y] = path(u);
          return <g key={i} opacity={ez(f, wk + i * 3, wk + i * 3 + 6)}><circle cx={x} cy={y - 34} r={9} fill={SNOW} /><rect x={x - 8} y={y - 26} width={16} height={26} rx={5} fill={SNOW} /></g>; })}
        <text x={1820} y={700} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={38} fill={ICEB} opacity={ez(f, wk + 20, wk + 30)}>TO THE COAST →</text>
      </SV>
      <Snow n={40} />
      <Tag a={g} t="DECEMBER 11" x={960} y={145} size={70} color={GOLD} w={900} />
      <Tag a={wk + 40} t="THEY LEFT EVERYTHING BEHIND" x={960} y={930} size={60} w={1500} />
    </Scene>
  );
};

// 29 · OSO SIN CUEVA: un medidor de energía que baja con cada hora de frío; enfrente, casi nada para comer
export const NoDenDrain: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10), dr = at(p, "drain", 60), k = ez(f, dr, dr + 140);
  const lvl = 1 - 0.78 * k + 0.02 * Math.sin(f / 6);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <Bear id="nd" x={720} y={820} s={0.9} step={f / 9} />
        <g transform="translate(1420,260)">
          <rect x={-70} y={0} width={140} height={560} rx={24} fill="#1c1410" stroke={INK} strokeWidth={6} />
          <rect x={-56} y={14 + 532 * (1 - lvl)} width={112} height={532 * lvl} rx={16} fill={lvl < 0.35 ? RED : GOLD} />
          {[0.25, 0.5, 0.75].map((y) => <line key={y} x1={-70} y1={560 * y} x2={-40} y2={560 * y} stroke={INK} strokeWidth={4} />)}
        </g>
        {Array.from({ length: 6 }).map((_, i) => { const a = dr + i * 22; return <text key={i} x={1560} y={300 + i * 90} fontFamily={F} fontWeight={800} fontSize={34} fill={ICEB} opacity={ez(f, a, a + 6) * (1 - ez(f, a + 30, a + 40))}>−1 HOUR</text>; })}
        <line x1={0} y1={822} x2={1920} y2={822} stroke={SNOW} strokeWidth={8} />
      </SV>
      <Snow n={70} w={2} />
      <Tag a={g} t="A BEAR WITHOUT A DEN" x={720} y={150} size={72} color={GOLD} w={1200} />
      <Tag a={dr + 10} t="ENERGY" x={1420} y={200} size={44} w={400} />
      <Tag a={dr + 100} t="BURNING IT EVERY HOUR" x={720} y={950} size={56} w={1200} />
    </Scene>
  );
};

// 30 · EL CICLO DE LA DESPENSA: cuatro estaciones en círculo (encontró comida → se la sacaron → siguió el olor → entró a buscarla) y vuelve a empezar
export const CacheLoop: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10), st = 32;
  const L = ["STARVING", "FOUND FOOD", "IT WAS TAKEN", "FOLLOWED THE SCENT", "WENT IN TO TAKE IT BACK"];
  const n = L.length, cur = Math.floor(lin(f, g, g + st * n, 0, n - 0.001)), loopk = ((f - g) / (st * n)) % 1;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <circle cx={960} cy={560} r={330} fill="none" stroke={RIM} strokeWidth={6} strokeDasharray="12 16" />
        {f > g && (() => { const a = -Math.PI / 2 + loopk * Math.PI * 2; return <circle cx={960 + Math.cos(a) * 330} cy={560 + Math.sin(a) * 330} r={22} fill={RED} />; })()}
        {L.map((_, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2, on = f > g + i * st; return <circle key={i} cx={960 + Math.cos(a) * 330} cy={560 + Math.sin(a) * 330} r={on ? 16 : 10} fill={on ? GOLD : RIM} />; })}
        <g transform="translate(960,640) scale(0.5)"><Bear id="cl" x={0} y={0} step={f / 10} /></g>
      </SV>
      {L.map((t, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return <Tag key={i} a={g + i * st} t={t} x={960 + Math.cos(a) * 520} y={560 + Math.sin(a) * 420} size={i === cur ? 46 : 38} color={i === cur ? GOLD : INK} w={520} />; })}
      <Tag a={g} t="FROM THE BEAR'S SIDE" x={960} y={520} size={44} w={600} />
    </Scene>
  );
};

// 31 · LA REGLA: tres líneas que se marcan — si un oso tiene una presa, no se la saques
export const LeaveTheKill: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10);
  const R: [string, boolean][] = [["DON'T TAKE IT", false], ["LEAVE THE AREA", true], ["LET THE PROFESSIONALS HANDLE IT", true]];
  return (
    <Scene d={d} bg={p.bg} tint="#0b0a09" floor="230,170,110">
      <SV>
        <rect x={240} y={220} width={1440} height={680} rx={26} fill="#efe8dc" stroke={GOLD} strokeWidth={8} opacity={ez(f, g, g + 10)} />
        {R.map(([, ok], i) => { const a = g + 30 + i * 30, y = 450 + i * 150, k = ez(f, a, a + 10);
          return <g key={i} transform={`translate(360,${y})`} opacity={ez(f, a - 6, a)}>
            <circle r={44} fill={ok ? "#2f6b3a" : RED} />
            {ok ? <path d="M-20,0 L-4,18 L24,-18" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeDasharray="70" strokeDashoffset={70 * (1 - k)} />
                : <path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={k} />}
          </g>; })}
      </SV>
      <Tag a={g + 10} t="WHEN A BEAR HAS A KILL" x={960} y={280} size={66} color="#1c1410" w={1100} flat />
      {R.map(([t], i) => <Tag key={i} a={g + 30 + i * 30} t={t} x={440} y={450 + i * 150 - 30} size={56} color="#1c1410" w={1200} align="left" flat />)}
    </Scene>
  );
};
