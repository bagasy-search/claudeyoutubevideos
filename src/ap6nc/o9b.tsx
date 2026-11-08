// ap6nc — únicas 14-27: el velorio, Kesagake, la cacería, el oso y lo que vino después. Dibujado por código, sin gore.
import React from "react";
import { useCurrentFrame } from "remotion";
import { F, INK, RED, GOLD, Scene, Tag, ez, lin, sp, rnd, at } from "./ukit";
import { SV } from "./pkit";
import { Bear, BearUp, House, Snow, Rifle, NIGHT, SNOW, FUR, RIM, AMB, ICEB, lp } from "./o9a";

type UP = { d: number; p: any };

// 14 · NUEVE ALREDEDOR DEL FUEGO: nueve velas en círculo; el viento las doblega todas a la vez
export const WakeCandles: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 6), gu = at(p, "gust", 90), k = ez(f, gu, gu + 6) * (1 - ez(f, gu + 18, gu + 40));
  return (
    <Scene d={d} bg={p.bg} tint="#0b0806" floor="255,190,110">
      <SV>
        <circle cx={960} cy={560} r={120} fill={AMB} opacity={0.12 + 0.05 * Math.sin(f / 5)} />
        {Array.from({ length: 9 }).map((_, i) => { const a = (i / 9) * Math.PI * 2 - Math.PI / 2, x = 960 + Math.cos(a) * 330, y = 560 + Math.sin(a) * 200, o = ez(f, g + i * 5, g + i * 5 + 8), fl = Math.sin(f / 4 + i) * 3;
          return <g key={i} transform={`translate(${x},${y})`} opacity={o}>
            <rect x={-14} y={0} width={28} height={70} rx={4} fill="#efe6d2" />
            <path d={`M0,-4 C-12,-24 ${-6 + fl - k * 30},-44 ${fl - k * 34},-58 C${6 + fl - k * 30},-44 12,-24 0,-4 Z`} fill={AMB} opacity={1 - k * 0.6} />
          </g>; })}
      </SV>
      <Tag a={g + 50} t="NINE PEOPLE · ONE FIRE" x={960} y={130} size={70} w={1300} />
      <Tag a={gu + 14} t="8:30 PM" x={960} y={900} size={84} color={GOLD} w={900} />
    </Scene>
  );
};

// 15 · LA CASA QUE DEJARON: los guardias corren a la casa Ota; el oso baja 300 m a la casa Myoke
export const LitWindow: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), t = at(p, "turn", 70), k = ez(f, t, t + 90);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <House x={360} y={760} s={0.7} glow={0.6 + 0.2 * Math.sin(f / 5)} />
        <House x={1560} y={760} s={0.85} glow={0.75 + 0.25 * Math.sin(f / 7)} />
        <path d="M1460,660 L1180,980 L1700,980 Z" fill={AMB} opacity={0.12} />
        <line x1={0} y1={762} x2={1920} y2={762} stroke={SNOW} strokeWidth={8} />
        <Bear id="lw" x={lp(560, 1180, k)} y={760} s={0.42} step={f / (k > 0 && k < 1 ? 6 : 40)} />
      </SV>
      <Snow n={50} />
      <Tag a={14} t="OTA HOUSE · THE GUARDS RAN HERE" x={360} y={300} size={48} w={600} />
      <Tag a={t - 10} t="MYOKE HOUSE · 300 M DOWNRIVER" x={1560} y={300} size={48} color={AMB} w={600} />
      <Tag a={t + 60} t="IT WENT TO THE HOUSE THEY LEFT" x={960} y={920} size={64} w={1200} />
    </Scene>
  );
};

// 16 · ONCE ADENTRO: once figuras en la casa Myoke; cuatro quedan apagadas (sin sangre, solo luz que se va)
export const ElevenInside: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 8), lost = at(p, "lost", 100);
  const out = [2, 5, 7, 9];
  return (
    <Scene d={d} bg={p.bg} tint="#0a0807" floor="255,190,110">
      <SV>
        {Array.from({ length: 11 }).map((_, i) => { const x = 250 + i * 142, small = i % 3 === 2, k = sp(f, g + i * 3), gone = out.indexOf(i), go = gone >= 0 ? ez(f, lost + gone * 7, lost + gone * 7 + 14) : 0;
          return <g key={i} transform={`translate(${x},${640}) scale(${(small ? 0.72 : 1) * k})`} opacity={1 - go * 0.82}>
            <circle cy={-200} r={36} fill={go > 0.5 ? "#2c2420" : "#efe6d2"} />
            <path d="M-46,0 L-38,-150 Q0,-170 38,-150 L46,0 Z" fill={go > 0.5 ? "#2c2420" : "#efe6d2"} />
          </g>; })}
      </SV>
      <Tag a={g + 30} t="11 PEOPLE IN THE MYOKE HOUSE" x={960} y={130} size={64} w={1600} />
      <Tag a={lost + 60} t="4 LIVES HERE · AND ONE NOT YET BORN" x={960} y={860} size={52} color={GOLD} w={1600} />
    </Scene>
  );
};

// 17 · LA ESCOPETA EMPEÑADA: un recibo de casa de empeño se sella; el rifle vuelve a las manos del cazador
export const PawnTicket: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), st = at(p, "stamp", 40), bk = at(p, "back", 110), k = ez(f, bk, bk + 30);
  return (
    <Scene d={d} bg={p.bg} tint="#0d0b09" floor="230,190,130">
      <SV>
        <g transform={`translate(640,540) rotate(-4)`}>
          <rect x={-270} y={-320} width={540} height={640} fill="#eadfc7" stroke="#8a7656" strokeWidth={4} />
          <text x={0} y={-230} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill="#3a2a1a">PAWN TICKET</text>
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-210} y1={-140 + i * 60} x2={i === 4 ? 40 : 210} y2={-140 + i * 60} stroke="#a8977a" strokeWidth={4} />)}
          <text x={-210} y={-160} fontFamily={F} fontWeight={800} fontSize={38} fill="#3a2a1a" opacity={ez(f, 10, 20)}>1 MURATA RIFLE</text>
          <g transform={`translate(80,170) rotate(-14) scale(${lp(1.8, 1, ez(f, st, st + 5))})`} opacity={ez(f, st, st + 3)}><rect x={-160} y={-60} width={320} height={120} fill="none" stroke={RED} strokeWidth={10} /><text x={0} y={22} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill={RED}>PAWNED</text></g>
        </g>
        <Rifle x={lp(2300, 1380, k)} y={lp(700, 560, k)} s={1.2} rot={lp(30, -8, k)} />
      </SV>
      <Tag a={bk + 34} t="HE GOT IT BACK" x={1460} y={820} size={66} color={GOLD} w={800} />
    </Scene>
  );
};

// 18 · KESAGAKE: el apodo dibujado como la banda clara cruzando el lomo, como un manto de monje
export const SashMark: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), b = at(p, "band", 40), k = ez(f, b, b + 40);
  return (
    <Scene d={d} bg={p.bg} tint="#0b0a09" floor="230,170,110">
      <SV>
        <Bear id="kz" x={960} y={820} s={1.35} step={f / 28} band={k} />
        <path d="M1500,260 Q1580,340 1520,440" fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray="300" strokeDashoffset={300 * (1 - ez(f, b + 30, b + 50))} />
      </SV>
      <Tag a={b + 34} t="KESAGAKE" x={960} y={140} size={120} color={GOLD} w={1200} />
      <Tag a={b + 54} t="LIKE A MONK'S SASH ACROSS THE SHOULDER" x={960} y={950} size={50} w={1600} />
    </Scene>
  );
};

// 19 · LA CACERÍA MÁS GRANDE: un contador de gente, armas y perros que se llenan en filas
export const HuntRoster: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), m = at(p, "men", 10), gn = at(p, "guns", 70), dg = at(p, "dogs", 120);
  const n600 = Math.round(lp(0, 600, ez(f, m, m + 40))), n60 = Math.round(lp(0, 60, ez(f, gn, gn + 30)));
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        {Array.from({ length: 120 }).map((_, i) => { const x = 140 + (i % 30) * 56, y = 300 + Math.floor(i / 30) * 70, on = n600 / 5 > i;
          return <g key={i} opacity={on ? 1 : 0.12}><circle cx={x} cy={y - 22} r={9} fill={SNOW} /><rect x={x - 9} y={y - 12} width={18} height={30} rx={6} fill={SNOW} /></g>; })}
        {Array.from({ length: 12 }).map((_, i) => <g key={i} opacity={n60 / 5 > i ? 1 : 0.1}><Rifle x={240 + i * 130} y={680} s={0.32} rot={-30} /></g>)}
        {Array.from({ length: 10 }).map((_, i) => { const o = ez(f, dg + i * 4, dg + i * 4 + 6); return <g key={i} transform={`translate(${260 + i * 150},${820})`} opacity={o}><ellipse rx={40} ry={18} fill="#c8a06a" /><circle cx={40} cy={-16} r={15} fill="#c8a06a" /><path d="M-40,-4 L-60,-26" stroke="#c8a06a" strokeWidth={8} strokeLinecap="round" /></g>; })}
      </SV>
      <Tag a={m + 4} t={`${n600} MEN`} x={360} y={160} size={72} w={600} />
      <Tag a={gn + 4} t={`${n60} GUNS`} x={960} y={160} size={72} color={GOLD} w={600} />
      <Tag a={dg + 4} t="10+ DOGS" x={1560} y={160} size={72} w={600} />
      <Tag a={dg + 50} t="AND SOLDIERS FROM ASAHIKAWA" x={960} y={960} size={50} w={1500} />
    </Scene>
  );
};

// 20 · OCHO CASAS VACÍAS: el mapa del valle; las casas se apagan una por una mientras el oso las recorre
export const EmptyHouses: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 20);
  const pts = Array.from({ length: 8 }).map((_, i) => [260 + i * 200, 520 + Math.sin(i * 1.3) * 170] as const);
  const prog = lin(f, g, g + 8 * 18, 0, 8);
  const seg = Math.min(7, Math.floor(prog)), u = prog - seg;
  const [bx, by] = seg < 7 ? [lp(pts[seg][0], pts[seg + 1][0], u), lp(pts[seg][1], pts[seg + 1][1], u)] : pts[7];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <path d={pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ")} fill="none" stroke={FUR} strokeWidth={10} strokeDasharray="14 14" opacity={0.7} />
        {pts.map(([x, y], i) => <g key={i} transform={`translate(${x},${y}) scale(0.32)`}><House x={0} y={0} glow={prog > i ? 0.05 : 0.8} /></g>)}
        <circle cx={bx} cy={by - 40} r={22} fill={RED} /><circle cx={bx} cy={by - 40} r={22 + 10 * Math.sin(f / 4)} fill="none" stroke={RED} strokeWidth={4} opacity={0.6} />
      </SV>
      <Snow n={40} />
      <Tag a={g} t="THE FAMILIES HAD LEFT" x={960} y={145} size={64} w={1300} />
      <Tag a={g + 8 * 18} t="8 HOUSES RAIDED" x={960} y={900} size={78} color={GOLD} w={1200} />
    </Scene>
  );
};

// 21 · LA TRAMPA QUE NO FUNCIONÓ: los tiradores en círculo alrededor del cebo; el oso se acerca hasta el borde y se va
export const BaitRing: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), a = at(p, "ring", 10), ap = at(p, "approach", 60), lv = at(p, "turn", 140);
  const kin = ez(f, ap, ap + 70), kout = ez(f, lv, lv + 60), r = lp(700, 420, kin) + lp(0, 500, kout);
  const ang = -0.6 + f / 400;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <circle cx={960} cy={560} r={360} fill="none" stroke={GOLD} strokeWidth={4} strokeDasharray="10 14" opacity={ez(f, a, a + 20)} />
        {Array.from({ length: 12 }).map((_, i) => { const t = (i / 12) * Math.PI * 2, o = ez(f, a + i * 3, a + i * 3 + 6); return <g key={i} transform={`translate(${960 + Math.cos(t) * 360},${560 + Math.sin(t) * 360})`} opacity={o}><circle r={18} fill={SNOW} /><line x1={0} y1={0} x2={-Math.cos(t) * 50} y2={-Math.sin(t) * 50} stroke={SNOW} strokeWidth={6} /></g>; })}
        <House x={960} y={600} s={0.35} glow={0.2} />
        <circle cx={960 + Math.cos(ang) * r} cy={560 + Math.sin(ang) * r} r={30} fill={FUR} stroke={RIM} strokeWidth={5} />
        {f > ap + 40 && f < lv + 20 && <circle cx={960 + Math.cos(ang) * r} cy={560 + Math.sin(ang) * r} r={50 + 8 * Math.sin(f / 3)} fill="none" stroke={RED} strokeWidth={5} />}
      </SV>
      <Snow n={30} />
      <Tag a={a + 30} t="THE BODIES AS BAIT · GUNS ALL AROUND" x={960} y={145} size={54} w={1700} />
      <Tag a={lv + 10} t="IT CAME TO THE EDGE… AND TURNED BACK" x={960} y={960} size={52} color={GOLD} w={1600} />
    </Scene>
  );
};

// 22 · EL PUENTE DE HIELO: corte del río congelado, el tirador en el puente; una sombra en la orilla y un tiro
export const IceBridgeShot: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), sh = at(p, "shot", 90), fl = ez(f, sh, sh + 2) * (1 - ez(f, sh + 6, sh + 16));
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <circle cx={1580} cy={250} r={56} fill="#e9eef4" opacity={0.85} />
        {Array.from({ length: 22 }).map((_, i) => { const x = 1180 + i * 36, h = 120 + rnd(i) * 110; return <path key={i} d={`M${x},640 L${x + 20},${640 - h} L${x + 40},640 Z`} fill="#0d1612" />; })}
        <path d="M1180,640 L1920,640 L1920,700 L1180,700 Z" fill="#dfe6ee" />
        <path d="M0,700 L1920,700 L1920,1080 L0,1080 Z" fill="#14202c" />
        <path d="M0,700 C500,690 1400,710 1920,700" fill="none" stroke={ICEB} strokeWidth={16} />
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={200 + i * 220} y1={710} x2={240 + i * 220 + Math.sin(i) * 40} y2={780} stroke={ICEB} strokeWidth={3} opacity={0.5} />)}
        <path d="M300,760 Q760,560 1220,700" fill="none" stroke={SNOW} strokeWidth={46} strokeLinecap="round" />
        <g transform="translate(700,640) scale(1.8)"><circle cy={-90} r={22} fill="#1b1612" /><path d="M-20,-66 L-30,0 L30,0 L20,-66 Z" fill="#1b1612" /></g>
        <Rifle x={760} y={500} s={0.9} rot={-4} flash={fl} />
        {fl > 0 && <line x1={960} y1={505} x2={1500} y2={560} stroke={GOLD} strokeWidth={4} opacity={fl} strokeDasharray="20 18" />}
        <g opacity={0.6 + 0.4 * ez(f, 20, 60)}><Bear id="ib" x={1560} y={640} s={0.55} step={f / 30} flip /></g>
      </SV>
      <Snow n={40} />
      <Tag a={10} t="A SNIPER ON THE ICE BRIDGE" x={960} y={145} size={60} w={1500} />
      <Tag a={sh + 12} t="ONE SHOT INTO THE DARK" x={960} y={940} size={58} color={GOLD} w={1300} />
    </Scene>
  );
};

// 23 · VEINTE METROS: una regla que mide la distancia entre el cazador y el olmo; dos tiros, dos marcas
export const TwentyMeters: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), ms = at(p, "measure", 10), s1 = at(p, "shot1", 80), s2 = at(p, "shot2", 110), k = ez(f, ms, ms + 50);
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="160,190,230">
      <SV>
        <g transform="translate(1520,800)"><rect x={-40} y={-560} width={80} height={560} fill="#3d2c1f" />{[0, 1, 2].map((i) => <path key={i} d={`M0,${-560 + i * 120} Q${-180 + i * 30},${-640 + i * 120} ${-260 + i * 40},${-560 + i * 120}`} fill="none" stroke="#3d2c1f" strokeWidth={22} />)}</g>
        <BearUp x={1420} y={800} s={0.62} op={ez(f, 20, 40)} />
        <g transform="translate(330,800)"><circle cy={-210} r={30} fill="#1b1612" /><path d="M-30,-176 L-36,0 L36,0 L30,-176 Z" fill="#1b1612" /></g>
        <Rifle x={390} y={660} s={0.55} rot={-4} flash={Math.max(ez(f, s1, s1 + 2) * (1 - ez(f, s1 + 5, s1 + 12)), ez(f, s2, s2 + 2) * (1 - ez(f, s2 + 5, s2 + 12)))} />
        <line x1={430} y1={880} x2={lp(430, 1420, k)} y2={880} stroke={GOLD} strokeWidth={8} />
        {Array.from({ length: 21 }).map((_, i) => <line key={i} x1={430 + i * 49.5} y1={866} x2={430 + i * 49.5} y2={i % 5 ? 894 : 906} stroke={GOLD} strokeWidth={4} opacity={k * 21 > i ? 1 : 0} />)}
        <line x1={0} y1={802} x2={1920} y2={802} stroke={SNOW} strokeWidth={8} />
      </SV>
      <Tag a={ms + 40} t="20 METERS" x={925} y={980} size={70} color={GOLD} w={700} />
      <Tag a={s1 + 4} t="HEART" x={1100} y={360} size={52} color={RED} w={400} />
      <Tag a={s2 + 4} t="HEAD" x={1100} y={440} size={52} color={RED} w={400} />
    </Scene>
  );
};

// 24 · A ESCALA: el oso parado al lado de una puerta de casa y un hombre; 340 kg y 2,7 m se cuentan solos
export const StandScale: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10), k = ez(f, g, g + 60);
  const kg = Math.round(lp(0, 340, k)), m = lp(0, 2.7, k).toFixed(1);
  return (
    <Scene d={d} bg={p.bg} tint="#0b0a09" floor="230,170,110">
      <SV>
        <rect x={300} y={300} width={220} height={560} fill="#3d2a1b" stroke={RIM} strokeWidth={6} /><circle cx={490} cy={600} r={10} fill={GOLD} />
        <g transform="translate(720,860)"><circle cy={-460} r={44} fill="#e8e0d0" /><path d="M-48,-410 L-60,0 L60,0 L48,-410 Z" fill="#e8e0d0" /></g>
        <BearUp x={1300} y={860} s={lp(0.3, 1.18, k)} />
        <line x1={1600} y1={860} x2={1600} y2={lp(860, 160, k)} stroke={GOLD} strokeWidth={6} />
        <line x1={1570} y1={lp(860, 160, k)} x2={1630} y2={lp(860, 160, k)} stroke={GOLD} strokeWidth={6} />
        <line x1={0} y1={862} x2={1920} y2={862} stroke={SNOW} strokeWidth={8} />
      </SV>
      <Tag a={g + 10} t={`${m} M`} x={1720} y={460} size={72} color={GOLD} w={500} />
      <Tag a={g + 10} t={`${kg} KG`} x={960} y={140} size={96} w={900} />
    </Scene>
  );
};

// 25 · TRES RAZONES: tres cartas que se dan vuelta — sin cueva, herido, la despensa
export const ThreeReasons: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), r1 = at(p, "r1", 10), r2 = at(p, "r2", 60), r3 = at(p, "r3", 110);
  const C: [number, string, string][] = [[r1, "NO DEN", "too big to find one, too late in the year"], [r2, "WOUNDED", "November bullets still inside"], [r3, "THE PANTRY", "it kept coming back to its food"]];
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        {C.map(([a], i) => { const k = ez(f, a, a + 14), sx = Math.abs(Math.cos(k * Math.PI)), front = k > 0.5, x = 380 + i * 580;
          return <g key={i} transform={`translate(${x},540) scale(${sx},1)`}>
            <rect x={-240} y={-300} width={480} height={600} rx={24} fill={front ? "#efe8dc" : "#2a1c12"} stroke={front ? GOLD : RIM} strokeWidth={6} />
            {!front && <text x={0} y={40} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={160} fill={RIM}>{i + 1}</text>}
          </g>; })}
      </SV>
      {C.map(([a, t1, t2], i) => <React.Fragment key={i}><Tag a={a + 12} t={t1} x={380 + i * 580} y={460} size={58} color="#1c1410" w={440} flat /><Tag a={a + 18} t={t2} x={380 + i * 580} y={590} size={40} color="#3a2a1a" w={440} flat /></React.Fragment>)}
      <Tag a={r1} t="WHY IT KEPT COMING BACK" x={960} y={145} size={64} w={1500} />
    </Scene>
  );
};

// 26 · CIEN OSOS: Okawa, el chico que juró vengar al pueblo, y la cuenta de su vida que sube hasta 102
export const LifetimeTally: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10), k = ez(f, g, g + 120), n = Math.round(lp(0, 102, k));
  return (
    <Scene d={d} bg={p.bg} tint="#0b0a09" floor="230,170,110">
      <SV>
        {Array.from({ length: 102 }).map((_, i) => { const col = i % 17, row = Math.floor(i / 17), x = 260 + col * 82, y = 300 + row * 92;
          return <g key={i} transform={`translate(${x},${y}) scale(${i < n ? 1 : 0.6})`} opacity={i < n ? 1 : 0.1}><ellipse rx={26} ry={16} fill={i === 101 ? GOLD : FUR} stroke={RIM} strokeWidth={2} /><circle cx={22} cy={-12} r={10} fill={i === 101 ? GOLD : FUR} /></g>; })}
      </SV>
      <Tag a={g} t="OKAWA · 1915 → A LIFETIME" x={960} y={130} size={58} w={1500} />
      <Tag a={g + 20} t={`${n} BEARS`} x={960} y={930} size={100} color={GOLD} w={1100} />
    </Scene>
  );
};

// 27 · 46 AÑOS DESPUÉS: una línea de tiempo 1915 → 1961; el registro de Kimura cierra la brecha
export const LongRecord: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(), g = at(p, "go", 10), k = ez(f, g, g + 70), nv = at(p, "novel", 110), mm = at(p, "memo", 150);
  const X = (y: number) => 220 + ((y - 1915) / (1980 - 1915)) * 1480;
  return (
    <Scene d={d} bg={p.bg} tint={NIGHT} floor="140,170,210">
      <SV>
        <line x1={220} y1={560} x2={lp(220, 1700, ez(f, 0, 30))} y2={560} stroke={SNOW} strokeWidth={6} />
        <path d={`M${X(1915)},540 Q${(X(1915) + X(1961)) / 2},${300} ${lp(X(1915), X(1961), k)},${lp(540, 540, k)}`} fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="1400" strokeDashoffset={1400 * (1 - k)} />
        {[[1915, 0], [1961, g + 60], [1977, mm]].map(([y, a], i) => <g key={i} transform={`translate(${X(y)},560)`} opacity={ez(f, a, a + 8)}><circle r={18} fill={i ? GOLD : RED} /><text y={70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={INK}>{y}</text></g>)}
        <g transform={`translate(${X(1970)},380)`} opacity={ez(f, nv, nv + 12)}><rect x={-70} y={-90} width={140} height={180} rx={6} fill="#efe8dc" stroke={GOLD} strokeWidth={4} /><line x1={-40} y1={-40} x2={40} y2={-40} stroke="#8a7656" strokeWidth={6} /><line x1={-40} y1={-10} x2={30} y2={-10} stroke="#8a7656" strokeWidth={6} /></g>
      </SV>
      <Snow n={20} />
      <Tag a={g + 70} t="46 YEARS LATER, THE FULL RECORD" x={1000} y={760} size={58} color={GOLD} w={1500} />
      <Tag a={nv + 14} t="THEN A NOVEL" x={X(1970)} y={230} size={42} w={500} />
      <Tag a={mm + 10} t="A MEMORIAL" x={X(1977) + 60} y={660} size={42} w={500} />
    </Scene>
  );
};
