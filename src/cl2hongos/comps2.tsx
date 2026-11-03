// cl2hongos · componentes del molde al desmolde (nylon, arrugas, capa fina, burbujas, la llave, botella, media, alambre,
// proporción de bosque, agua de más, curado, la galletita mojada, 24 h, la bolsa de arena, el ruido, semanas, arreglos, laminillas).
import React from "react";
import { C, FONT, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, glass, num, shake } from "./kit";
import { Seta } from "./comps1";

// corte de un bol (media luna) centrado en (x, y), radio r
const bolD = (x: number, y: number, r: number) => `M${x - r},${y} A ${r} ${r * 0.8} 0 0 0 ${x + r},${y}`;

// 10 · la ventosa: sin nylon el cemento se agarra al bol (ganchitos rojos); con nylon el sombrero sale solo, como un flan
export const Ventosa: React.FC<FxP> = ({ t, a, m }) => {
  const fl = e(t, m.flan, m.flan + 1.2), oil = spr(t, m.aceite, 1);
  return (
    <>
      <Svg>
        <path d={bolD(560, 420, 260) + " Z"} fill={C.cem} opacity={0.9} />
        <path d={bolD(560, 420, 260)} fill="none" stroke={C.cap} strokeWidth={12} />
        {Array.from({ length: 9 }, (_, i) => { const an = Math.PI * (0.1 + 0.8 * (i / 8)); return <circle key={i} cx={560 - 260 * Math.cos(an)} cy={420 + 208 * Math.sin(an)} r={10 + 3 * Math.sin(t * 8 + i)} fill={C.red} opacity={e(t, m.vent, m.vent + 0.6)} />; })}
        <g transform={`translate(0,${-fl * 260})`}>
          <path d={bolD(1360, 420 + fl * 260, 260) + " Z"} fill={C.cem} />
        </g>
        <path d={bolD(1360, 420, 260)} fill="none" stroke={C.cap} strokeWidth={12} />
        <path d={bolD(1360, 420, 248)} fill="none" stroke={C.water} strokeWidth={4} strokeDasharray="10 6" opacity={0.8} />
        {oil > 0.01 && <g transform={`translate(960,250) scale(${oil})`}><path d="M0,-50 C 30,-10 40,20 0,40 C -40,20 -30,-10 0,-50 Z" fill="#e1b54a" /><Cross t={t} at={m.aceite + 0.8} x={0} y={0} r={60} /></g>}
      </Svg>
      <Lbl t={t} at={m.vent + 0.2} text="se agarra al bol" x={560} y={800} col={C.red} size={56} />
      <Lbl t={t} at={m.flan + 0.3} text="con nylon: sale solo" x={1360} y={800} col={C.ok} size={56} />
      <Lbl t={t} at={m.aceite + 0.5} text="aceite: mancha" x={960} y={420} col={C.sun} size={50} />
    </>
  );
};

// 11 · cada arruga es una marca: el nylon con arrugas se calca en la piel; los dedos alisan del centro hacia afuera; el pliegue quiebra
export const Arrugas: React.FC<FxP> = ({ t, a, m }) => {
  const al = e(t, m.alisa, m.alisa + 2), pl = e(t, m.pliegue, m.pliegue + 0.8);
  return (
    <>
      <Svg>
        <circle cx={760} cy={540} r={330} fill="rgba(240,248,255,.12)" stroke={C.edge} strokeWidth={3} />
        {Array.from({ length: 9 }, (_, i) => { const an = (i / 9) * Math.PI * 2 + 0.3; const r0 = 60 + 260 * al; return <path key={i} d={`M${760 + Math.cos(an) * r0},${540 + Math.sin(an) * r0} q ${18 * Math.sin(i)},${12} ${Math.cos(an) * (300 - r0)},${Math.sin(an) * (300 - r0)}`} stroke="rgba(255,255,255,.55)" strokeWidth={4} fill="none" opacity={1 - 0.8 * al} />; })}
        {al > 0 && al < 1 && <circle cx={760 + Math.cos(t * 2) * 300 * al} cy={540 + Math.sin(t * 2) * 300 * al} r={34} fill="#f2c84b" opacity={0.9} />}
        <g transform="translate(1420,560)" opacity={pl}>
          <path d="M-220,60 C -220,-140 220,-140 220,60 Q 0,90 -220,60 Z" fill={C.cem} />
          <Draw d="M-200,52 L -170,10 L -186,-30" p={e(t, m.pliegue + 0.5, m.pliegue + 1)} col="#1c1813" w={6} />
          <path d="M-196,40 l -40,40" stroke={C.cem} strokeWidth={22} transform={`translate(${-pl * 20},${pl * 30}) rotate(${pl * 20})`} />
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="arruga = marca" x={760} y={150} col={C.cream} size={62} />
      <Lbl t={t} at={m.alisa + 0.3} text="del centro afuera" x={760} y={940} col={C.sun} size={56} />
      <Lbl t={t} at={m.pliegue + 0.6} text="pliegue: borde roto" x={1420} y={800} col={C.red} size={54} />
    </>
  );
};

// 12 · capa fina primero: una capa de un dedo apretada contra el nylon, después el relleno; el espesor justo: dos o tres dedos
export const CapaFina: React.FC<FxP> = ({ t, a, m }) => {
  const c1 = e(t, a + 0.4, a + 1.8), rel = e(t, m.rell, m.rell + 1.4), es = spr(t, m.esp, 1);
  return (
    <>
      <Svg>
        <path d={bolD(820, 360, 400)} fill="none" stroke={C.cap} strokeWidth={14} />
        <path d={bolD(820, 360, 396)} fill="none" stroke={C.cem2} strokeWidth={36 * c1} />
        {[0.2, 0.5, 0.8].map((k, i) => { const an = Math.PI * k; return <path key={i} d={`M${820 - 300 * Math.cos(an)},${360 + 230 * Math.sin(an)} l ${-40 * Math.cos(an)},${32 * Math.sin(an)}`} stroke={C.sun} strokeWidth={6} markerEnd="" opacity={c1 * (1 - rel)} />; })}
        <path d={`M${820 - 396},360 A 396 317 0 0 0 ${820 + 396},360 L ${820 + 300},${360 + 90 * rel} Q 820 ${360 + 150 * rel} ${820 - 300},${360 + 90 * rel} Z`} fill={C.cem} opacity={rel} />
        {es > 0.01 && <g transform={`translate(1500,500) scale(${es})`}><rect x={-30} y={-130} width={60} height={260} rx={10} fill="none" stroke={C.sun} strokeWidth={4} />{[0, 1, 2].map((i) => <rect key={i} x={-90} y={-120 + i * 80} width={180} height={60} rx={30} fill="#e2b48f" stroke="#7a4b2f" strokeWidth={3} />)}</g>}
      </Svg>
      <Lbl t={t} at={a + 0.6} text="una capa, apretada" x={820} y={160} col={C.sun} size={60} />
      <Lbl t={t} at={m.esp + 0.3} text="dos o tres dedos" x={1500} y={760} col={C.cream} size={56} />
    </>
  );
};

// 13 · hacerlo eructar: cada golpe de mesa sacude el bol y suben burbujas; cada vez menos
export const Eructo: React.FC<FxP> = ({ t, a, m }) => {
  const golpes = [0, 1, 2, 3, 4, 5].map((i) => m.burb - 1 + i * 0.9), sh = golpes.reduce((s, g) => s + shake(t, g, 12), 0);
  const quedan = Math.max(0, 30 - Math.floor(cl((t - m.burb) / 6) * 30));
  return (
    <>
      <Svg>
        <g transform={`translate(0,${sh})`}>
          <path d={bolD(960, 420, 380) + " Z"} fill={C.cem} />
          <path d={bolD(960, 420, 380)} fill="none" stroke={C.cap} strokeWidth={14} />
          {Array.from({ length: quedan }, (_, i) => { const u = ((t - a) * (0.25 + 0.2 * hash(i, 2)) + hash(i, 3)) % 1, an = Math.PI * (0.15 + 0.7 * hash(i, 4)); const r = 300 * hash(i, 5); return <circle key={i} cx={960 - r * Math.cos(an)} cy={420 + 240 * Math.sin(an) * (1 - u)} r={5 + 7 * hash(i, 6)} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={2.5} />; })}
        </g>
        <rect x={500} y={760} width={920} height={20} rx={8} fill="#7a5233" />
      </Svg>
      <Lbl t={t} at={m.burb} text="toc · toc · toc" x={960} y={880} col={C.cream} size={70} />
      <Lbl t={t} at={m.aguj} text="burbuja = agujero" x={1560} y={260} col={C.red} size={56} />
      <Lbl t={t} at={m.ramon} text="hacerlo eructar" x={420} y={260} col={C.sun} size={56} />
    </>
  );
};

// 14 · LA LLAVE: el vasito de yogur se hunde en el centro; queda el hueco; un tallo plano se cae, el que entra con alambre no
export const LaLlave: React.FC<FxP> = ({ t, a, m }) => {
  const hu = e(t, m.hunde, m.hunde + 1.4), cmp = e(t, m.plano, m.plano + 0.6), falla = e(t, m.plano + 1.4, m.plano + 2.2);
  return (
    <>
      <Svg>
        <g opacity={1 - cmp}>
          <path d={bolD(960, 330, 420) + " Z"} fill={C.cem} />
          <path d={bolD(960, 330, 420)} fill="none" stroke={C.cap} strokeWidth={14} />
          <g transform={`translate(960,${lerp(120, 330, hu)})`}><path d="M-60,-90 L60,-90 L46,90 L-46,90 Z" fill="#f4f1ea" stroke="#9a948a" strokeWidth={3} /></g>
          <line x1={1080} y1={330} x2={1080} y2={330 + 180 * hu} stroke={C.sun} strokeWidth={4} strokeDasharray="8 6" />
        </g>
        {cmp > 0.01 && <g opacity={cmp}>
          <g transform={`rotate(${-falla * 28} 620 640)`}><path d="M440,560 C 440,400 800,400 800,560 Q 620,600 440,560 Z" fill={C.cem} /></g>
          <rect x={580} y={600} width={80} height={240} fill={C.cem2} />
          <path d="M1120,560 C 1120,400 1480,400 1480,560 Q 1300,600 1120,560 Z" fill={C.cem} />
          <rect x={1260} y={600} width={80} height={240} fill={C.cem2} /><rect x={1270} y={500} width={60} height={100} fill={C.cem2} />
          <line x1={1300} y1={830} x2={1300} y2={490} stroke={C.red} strokeWidth={6} />
          <Cross t={t} at={m.plano + 1.6} x={620} y={330} r={56} /><Tick t={t} at={m.nunca} x={1300} y={330} r={56} />
        </g>}
      </Svg>
      <Lbl t={t} at={m.yog + 0.2} out={m.plano} text="un vasito de yogur" x={1500} y={220} col={C.cream} size={54} />
      <Lbl t={t} at={m.hunde + 0.5} out={m.plano} text="3 a 4 cm" x={1250} y={460} col={C.sun} size={56} />
      <Lbl t={t} at={m.llave} out={m.plano} text="la llave" x={960} y={900} col={C.sun} size={90} />
      <Lbl t={t} at={m.plano + 0.5} text="apoyado: se cae" x={620} y={940} col={C.red} size={52} />
      <Lbl t={t} at={m.nunca + 0.2} text="enchufado: nunca" x={1300} y={940} col={C.ok} size={52} />
    </>
  );
};

// 15 · el tubo de la botella: líneas de corte en el pico y el fondo, salen volando, queda el tubo y se llena de abajo
export const BotellaTubo: React.FC<FxP> = ({ t, a, m }) => {
  const ct = e(t, m.corta, m.corta + 0.8), ll = e(t, m.llena, m.llena + 3);
  return (
    <>
      <Svg>
        <g transform={`translate(${-ct * 260},${-ct * 220}) rotate(${-ct * 40} 960 230)`} opacity={1 - 0.7 * ct}><path d="M900,330 L900,250 Q900,200 930,180 L930,130 L990,130 L990,180 Q1020,200 1020,250 L1020,330 Z" fill="rgba(170,220,190,.35)" stroke={C.edge} strokeWidth={3} /></g>
        <rect x={880} y={330} width={200} height={460} fill="rgba(170,220,190,.25)" stroke={C.edge} strokeWidth={3} />
        <rect x={886} y={330 + 460 * (1 - ll)} width={188} height={460 * ll} fill={C.cem} />
        <g transform={`translate(${ct * 260},${ct * 160}) rotate(${ct * 30} 980 820)`} opacity={1 - 0.7 * ct}><path d="M880,790 L1080,790 L1070,850 Q980,880 890,850 Z" fill="rgba(170,220,190,.35)" stroke={C.edge} strokeWidth={3} /></g>
        <line x1={840} y1={330} x2={1120} y2={330} stroke={C.red} strokeWidth={4} strokeDasharray="12 8" opacity={1 - ct} />
        <line x1={840} y1={790} x2={1120} y2={790} stroke={C.red} strokeWidth={4} strokeDasharray="12 8" opacity={1 - ct} />
      </Svg>
      <Lbl t={t} at={m.corta + 0.4} text="sin pico, sin fondo" x={1460} y={330} col={C.cream} size={56} />
      <Lbl t={t} at={m.llena + 0.3} text="mezcla 2 + 1" x={1460} y={700} col={C.sun} size={60} />
    </>
  );
};

// 16 · la media: se llena desde abajo y se estira; queda gorda abajo y finita arriba, como un tallo de verdad
export const MediaTallo: React.FC<FxP> = ({ t, a, m }) => {
  const ll = e(t, a + 0.6, m.vaso + 2), bulge = 60 * ll;
  const d = `M${900 - 30 - bulge},820 C ${880 - bulge},700 ${905},520 ${920},300 L 1000,300 C ${1015},520 ${1040 + bulge},700 ${1020 + 30 + bulge},820 Z`;
  return (
    <>
      <Svg>
        <path d={d} fill="rgba(210,190,160,.25)" stroke="#c9b089" strokeWidth={3} />
        <path d={d} fill={C.cem} style={{ clipPath: `inset(${(1 - ll) * 100}% 0 0 0)` }} />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={880} y1={320 + i * 36} x2={1040} y2={330 + i * 36} stroke="rgba(201,176,137,.4)" strokeWidth={1.5} />)}
        <path d="M780,860 L800,560 L1120,560 L1140,860 Z" fill="none" stroke={C.edge} strokeWidth={3} opacity={e(t, m.vaso, m.vaso + 0.5)} />
      </Svg>
      <Lbl t={t} at={a + 0.5} text="una media vieja" x={1440} y={300} col={C.cream} size={58} />
      <Lbl t={t} at={m.vaso + 1} text="gorda abajo" x={1440} y={760} col={C.sun} size={58} />
      <Lbl t={t} at={m.saca} text="sacala con paciencia" x={500} y={900} col={C.dim} size={48} />
    </>
  );
};

// 17 · el alambre: entra hasta el fondo del tallo y sobresale; una regla marca los seis centímetros
export const AlambreSeis: React.FC<FxP> = ({ t, a, m }) => {
  const en = e(t, a + 0.3, a + 1.6), rg = spr(t, m.seis, 1);
  return (
    <>
      <Svg>
        <path d="M860,860 C 880,700 890,520 900,440 L 1020,440 C 1030,520 1040,700 1060,860 Z" fill={C.cem} />
        <line x1={960} y1={lerp(40, 840, en) - 0} x2={960} y2={lerp(-400, 270, en)} stroke="#b9bfc4" strokeWidth={10} strokeLinecap="round" />
        <line x1={960} y1={440} x2={960} y2={840} stroke="#b9bfc4" strokeWidth={10} opacity={en} />
        {rg > 0.01 && <g opacity={rg} transform={`translate(${1060 + (1 - rg) * 80},0)`}><rect x={0} y={270} width={60} height={170} fill="#f2c84b" stroke="#a57c12" strokeWidth={3} />{Array.from({ length: 7 }, (_, i) => <line key={i} x1={0} y1={270 + i * 28} x2={i % 2 ? 22 : 36} y2={270 + i * 28} stroke="#3b2c06" strokeWidth={3} />)}</g>}
        <rect x={880} y={860} width={160} height={14} rx={6} fill="#7a5233" />
      </Svg>
      <Pop t={t} at={m.seis} x={1360} y={350}><Big size={130} col={C.sun}>6 cm</Big></Pop>
      <Lbl t={t} at={m.galv + 0.2} text="galvanizado: no se oxida" x={560} y={250} col={C.cream} size={52} />
      <Lbl t={t} at={a + 0.8} text="hasta el fondo" x={560} y={760} col={C.dim} size={52} />
    </>
  );
};

// 18 · el palito se hincha: humedad azul que sube, el palito engorda y raja el tallo; el alambre queda igual
export const PalitoHincha: React.FC<FxP> = ({ t, a, m }) => {
  const hu = e(t, m.hincha - 1.5, m.hincha + 0.6), par = e(t, m.parte, m.parte + 0.8), al = spr(t, m.alam, 1);
  return (
    <>
      <Svg>
        <g transform={`translate(${-al * 300},0)`}>
          <path d="M860,860 C 880,700 890,520 900,440 L 1020,440 C 1030,520 1040,700 1060,860 Z" fill={C.cem} />
          <rect x={960 - 9 - 14 * hu} y={420} width={18 + 28 * hu} height={420} rx={6} fill="#a8783f" />
          <rect x={960 - 9 - 14 * hu} y={420 + 420 * (1 - hu)} width={18 + 28 * hu} height={420 * hu} rx={6} fill={C.water} opacity={0.4} />
          <Draw d="M900,480 L930,560 L905,640 L935,740 L910,840" p={par} col="#1c1813" w={6} />
        </g>
        {al > 0.01 && <g opacity={cl(al * 2)} transform={`translate(${300 + (1 - al) * 300},0)`}><path d="M860,860 C 880,700 890,520 900,440 L 1020,440 C 1030,520 1040,700 1060,860 Z" fill={C.cem} /><line x1={960} y1={840} x2={960} y2={300} stroke="#b9bfc4" strokeWidth={10} /><Tick t={t} at={m.alam + 0.4} x={960} y={230} r={50} /></g>}
      </Svg>
      <Lbl t={t} at={m.hincha} text="el palito se hincha" x={660} y={200} col={C.water} size={56} />
      <Lbl t={t} at={m.parte + 0.2} text="y parte el tallo" x={660} y={930} col={C.red} size={56} />
      <Lbl t={t} at={m.alam + 0.4} text="el alambre, no" x={1260} y={930} col={C.ok} size={56} />
    </>
  );
};

// 19 · proporción de bosque: el grande de tallo corto y gordo, el chiquito largo y flaco; tres copias a escala parecen juguete
export const ProporcionBosque: React.FC<FxP> = ({ t, a, m }) => {
  const b = spr(t, m.bosque, 0.9), j = spr(t, m.juguete, 0.9);
  return (
    <>
      <Svg>
        <g opacity={cl(b * 2)}>
          <Seta x={300} y={560} s={150 * b} cw={1.2} ch={0.62} sw={0.36} sh={0.55} cap={C.cem} stem={C.cem} />
          <Seta x={560} y={560} s={95 * b} cw={1} ch={0.6} sw={0.22} sh={1} cap={C.cem} stem={C.cem} />
          <Seta x={740} y={560} s={60 * b} cw={0.85} ch={0.6} sw={0.14} sh={1.5} cap={C.cem} stem={C.cem} />
        </g>
        <g opacity={cl(j * 2)}>
          {[150, 95, 60].map((s, i) => <Seta key={i} x={1180 + [0, 260, 440][i]} y={560} s={s * j} cap={C.cem2} stem={C.cem2} />)}
          <Cross t={t} at={m.juguete + 0.7} x={1440} y={260} r={56} />
        </g>
        <line x1={160} y1={580} x2={860} y2={580} stroke="#5b3c24" strokeWidth={10} strokeLinecap="round" opacity={b} />
        <line x1={1040} y1={580} x2={1740} y2={580} stroke="#5b3c24" strokeWidth={10} strokeLinecap="round" opacity={j} />
      </Svg>
      <Lbl t={t} at={m.bosque + 0.4} text="crecieron solos" x={520} y={730} col={C.ok} size={60} />
      <Lbl t={t} at={m.juguete + 0.4} text="parecen de juguete" x={1440} y={730} col={C.red} size={60} />
    </>
  );
};

// 20 · el agua de más: tres síntomas numerados — polvillo blanco arriba, telaraña de rajaduras, el sombrero que se parte
export const AguaDeMas: React.FC<FxP> = ({ t, a, m }) => {
  const S = [{ at: a + 0.3, lab: "polvillo blanco" }, { at: m.raja, lab: "rajaduras finitas" }, { at: m.debil, lab: "se parte" }];
  return (
    <>
      {S.map((q, i) => {
        const p = spr(t, q.at, 1), x = 380 + i * 580, u = t - q.at;
        return (
          <Pop key={i} t={t} at={q.at} x={x} y={500}>
            <div style={{ ...glass(), width: 500, height: 520, position: "relative" }}>
              <svg width={500} height={520} style={{ position: "absolute", inset: 0 }}>
                <text x={464} y={490} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={70} fill={C.sun}>{i + 1}</text>
                <g transform={i === 2 ? `rotate(${Math.min(18, Math.max(0, u - 1) * 30)} 250 330)` : undefined}><path d="M70,380 C 70,180 430,180 430,380 Q 250,410 70,380 Z" fill={C.cem} /></g>
                {i === 0 && Array.from({ length: 40 }, (_, j) => <circle key={j} cx={110 + hash(j, 2) * 280} cy={240 + hash(j, 3) * 60} r={4} fill="#fff" opacity={cl(u * 0.8) * 0.9} />)}
                {i === 1 && [0, 1, 2, 3, 4, 5].map((j) => <Draw key={j} d={`M250,300 l ${Math.cos(j) * 140},${Math.sin(j) * 60 + 20} l ${Math.cos(j + 1) * 30},${20}`} p={e(t, q.at + 0.3, q.at + 1.4)} col="#1c1813" w={3} />)}
                {i === 2 && <Draw d="M250,240 L240,300 L262,350 L248,400" p={e(t, q.at + 0.4, q.at + 1)} col="#1c1813" w={6} />}
              </svg>
            </div>
            <div style={{ textAlign: "center", marginTop: 20, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: i ? C.red : C.cream, textTransform: "uppercase", opacity: p }}>{q.lab}</div>
          </Pop>
        );
      })}
    </>
  );
};

// 21 · se cura, no se seca: agujitas de cristal crecen con agua; al sol el agua se va y la red queda a medias; a la sombra, completa
export const SeCura: React.FC<FxP> = ({ t, a, m }) => {
  const solK = e(t, m.sol, m.sol + 1.4), sombra = e(t, m.sombra, m.sombra + 1);
  const red = (x0: number, crec: number, agua: number) => (
    <g>
      <rect x={x0 - 300} y={260} width={600} height={520} rx={26} fill="rgba(255,240,214,.06)" stroke={C.edge} strokeWidth={2} />
      <rect x={x0 - 296} y={260 + 520 * (1 - agua)} width={592} height={520 * agua} rx={22} fill={C.water} opacity={0.18} />
      {Array.from({ length: 34 }, (_, i) => { const cx = x0 - 260 + hash(i, 2) * 520, cy = 300 + hash(i, 3) * 440, an = hash(i, 4) * Math.PI, L = 90 * crec * (0.5 + hash(i, 5)); return <line key={i} x1={cx - Math.cos(an) * L} y1={cy - Math.sin(an) * L} x2={cx + Math.cos(an) * L} y2={cy + Math.sin(an) * L} stroke={C.cream} strokeWidth={3} opacity={0.8} />; })}
    </g>
  );
  const crecSol = Math.min(e(t, a, a + 4), 0.45 + 0.55 * (1 - solK) * e(t, a, a + 4));
  return (
    <>
      <Svg>
        {red(560, crecSol, 1 - 0.9 * solK)}
        <g opacity={solK}><circle cx={560} cy={180} r={70} fill={C.sun} /><circle cx={560} cy={180} r={110} fill={C.sun} opacity={0.2} /></g>
        <g opacity={sombra}>{red(1360, e(t, m.sombra, m.sombra + 4), 1)}</g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="no se seca: se cura" x={960} y={950} col={C.cream} size={62} />
      <Lbl t={t} at={m.sol + 0.6} text="al sol: a medias" x={560} y={830} col={C.red} size={52} />
      <Lbl t={t} at={m.sombra + 0.4} text="sombra y nylon" x={1360} y={830} col={C.ok} size={52} />
    </>
  );
};

// 22 · la galletita mojada: el sombrero a las 6 h en corte — cáscara dura, adentro blando; lo das vuelta y el borde se quiebra
export const Galletita: React.FC<FxP> = ({ t, a, m }) => {
  const g = e(t, m.gall, m.gall + 1), v = e(t, m.vuelta, m.vuelta + 0.8), q = e(t, m.quiebra, m.quiebra + 0.6);
  return (
    <>
      <Svg>
        <g transform={`rotate(${180 * v} 960 520)`}>
          <path d="M600,600 C 600,330 1320,330 1320,600 Q 960,640 600,600 Z" fill={C.cem} />
          <path d="M650,590 C 650,380 1270,380 1270,590 Q 960,620 650,590 Z" fill="#a39d90" opacity={g} />
          <path d="M650,590 C 650,380 1270,380 1270,590 Q 960,620 650,590 Z" fill={C.water} opacity={0.25 * g} />
        </g>
        {q > 0 && <g transform={`translate(${-q * 60},${q * 140}) rotate(${-q * 35} 640 460)`}><path d="M600,440 C 590,470 600,500 640,520 L 660,470 Z" fill={C.cem} /></g>}
      </Svg>
      <Pop t={t} at={a + 0.3} x={960} y={190}><Big size={110} col={C.sun}>6 h</Big></Pop>
      <Lbl t={t} at={m.gall + 0.3} text="por dentro, blando" x={960} y={880} col={C.water} size={60} />
      <Lbl t={t} at={m.quiebra + 0.3} text="el borde se quiebra" x={1500} y={260} col={C.red} size={56} />
    </>
  );
};

// 23 · veinticuatro horas: un dial que da la vuelta entera; en invierno, el arco celeste sigue hasta 36-48
export const Dial24: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, a + 0.2, a + 2.2), inv = e(t, m.inv, m.inv + 1.4), R = 260, arc = (from: number, to: number) => { const p = (u: number) => [960 + R * Math.sin(u * 2 * Math.PI), 540 - R * Math.cos(u * 2 * Math.PI)]; const [x0, y0] = p(from), [x1, y1] = p(to); return `M${x0},${y0} A ${R} ${R} 0 ${to - from > 0.5 ? 1 : 0} 1 ${x1},${y1}`; };
  return (
    <>
      <Svg>
        <circle cx={960} cy={540} r={R} fill="rgba(255,240,214,.06)" stroke="rgba(255,240,214,.2)" strokeWidth={30} />
        {k > 0.001 && <path d={arc(0, Math.min(0.999, k))} fill="none" stroke={C.sun} strokeWidth={30} strokeLinecap="round" />}
        {inv > 0.001 && <path d={arc(0.001, 0.001 + 0.5 * inv)} fill="none" stroke={C.water} strokeWidth={14} strokeLinecap="round" transform="translate(0,0)" style={{ filter: "drop-shadow(0 0 8px #7cc8ff)" }} />}
      </Svg>
      <div style={{ position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)" }}><Big size={170}>{num(t, a + 0.2, a + 2.2, 0, 24)} h</Big></div>
      <Lbl t={t} at={a + 1.6} text="como mínimo" x={960} y={890} col={C.cream} size={58} />
      <Lbl t={t} at={m.inv + 0.4} text="invierno: 36 a 48" x={1540} y={300} col={C.water} size={56} />
    </>
  );
};

// 24 · la bolsa de arena sostiene: boca abajo sobre la mesa, el peso carga en el borde (flechas rojas); sobre arena se reparte
export const ArenaSostiene: React.FC<FxP> = ({ t, a, m }) => {
  const s = spr(t, m.bolsa, 0.9);
  return (
    <>
      <Svg>
        <rect x={160} y={720} width={680} height={18} fill="#7a5233" />
        <path d="M260,720 C 260,520 740,520 740,720 Z" fill={C.cem} transform="rotate(180 500 660) translate(0,-60)" />
        {[290, 710].map((x, i) => <path key={i} d={`M${x},560 L${x},700 M${x - 16},684 L${x},704 L${x + 16},684`} stroke={C.red} strokeWidth={8} fill="none" opacity={e(t, a + 0.5, a + 1)} />)}
        <g opacity={cl(s * 2)}>
          <path d="M1060,760 Q 1080,640 1400,640 Q 1720,640 1740,760 Z" fill="#d9c08f" />
          <path d="M1160,640 C 1160,820 1640,820 1640,640 Z" fill={C.cem} transform="translate(0,0)" />
          {Array.from({ length: 8 }, (_, i) => { const x = 1180 + i * 62; return <path key={i} d={`M${x},520 L${x},610 M${x - 10},598 L${x},614 L${x + 10},598`} stroke={C.ok} strokeWidth={5} fill="none" opacity={e(t, m.bolsa + 0.8, m.bolsa + 1.4)} />; })}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.6} text="el borde carga todo" x={500} y={880} col={C.red} size={54} />
      <Lbl t={t} at={m.bolsa + 1} text="la arena reparte" x={1400} y={880} col={C.ok} size={54} />
      <Lbl t={t} at={m.gira} text="tirás del nylon" x={1400} y={260} col={C.sun} size={56} />
    </>
  );
};

// 25 · suena a piedra: dos ondas; la de piedra es un golpe seco y alto, la de hueco es baja y larga
export const SuenaPiedra: React.FC<FxP> = ({ t, a, m }) => {
  const onda = (y: number, at: number, seca: boolean, col: string) => {
    const u = t - at; if (u < 0) return null;
    let d = ""; for (let i = 0; i <= 200; i++) { const x = 300 + i * 6.6, k = i / 200, env = seca ? Math.exp(-k * 14) : Math.exp(-k * 3) * 0.45, w = seca ? 70 : 18; d += (i ? "L" : "M") + x + "," + (y + Math.sin(k * w + u * 2) * 150 * env * cl(u * 3 - k * 2)); }
    return <path d={d} fill="none" stroke={col} strokeWidth={5} />;
  };
  return (
    <>
      <Svg>
        {[380, 760].map((y, i) => <line key={i} x1={300} y1={y} x2={300 + 1320 * e(t, a + 0.2 + i * 0.3, a + 1 + i * 0.3)} y2={y} stroke={C.edge} strokeWidth={2} strokeDasharray="8 10" />)}
        {[0, 1, 2].map((i) => { const u = cl((t - a - 0.5 - i * 0.45) / 0.5); return u > 0 && u < 1 ? <circle key={i} cx={200} cy={570} r={30 + u * 90} fill="none" stroke={C.cream} strokeWidth={4} opacity={1 - u} /> : null; })}
        <circle cx={200} cy={570} r={26} fill={C.cem} opacity={e(t, a + 0.3, a + 0.7)} />
        {onda(380, m.piedra, true, C.ok)}{onda(760, m.hueco, false, C.red)}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="toc, toc: escuchá" x={960} y={960} col={C.cream} size={56} />
      <Lbl t={t} at={m.piedra + 0.3} text="suena a piedra: listo" x={1440} y={250} col={C.ok} size={56} />
      <Lbl t={t} at={m.hueco + 0.3} text="a hueco: un día más" x={1440} y={640} col={C.red} size={56} />
    </>
  );
};

// 26 · siete días que cuentan: la curva de dureza sube rápido la primera semana; cada día cae una gota de rociador
export const SieteDias: React.FC<FxP> = ({ t, a, m }) => {
  const k = e(t, a + 0.3, a + 3.5), X0 = 300, Y0 = 820, Wd = 1300, Hd = 520, f = (u: number) => 1 - Math.exp(-u * 4.2);
  let d = ""; for (let i = 0; i <= 100 * k; i++) { const u = i / 100; d += (i ? "L" : "M") + (X0 + u * Wd) + "," + (Y0 - f(u) * Hd); }
  return (
    <>
      <Svg>
        <line x1={X0} y1={Y0} x2={X0 + Wd} y2={Y0} stroke={C.edge} strokeWidth={3} /><line x1={X0} y1={Y0} x2={X0} y2={Y0 - Hd - 30} stroke={C.edge} strokeWidth={3} />
        <rect x={X0} y={Y0 - Hd - 30} width={Wd * 0.25} height={Hd + 30} fill={C.water} opacity={0.12 * e(t, m.siete, m.siete + 0.6)} />
        <path d={d} fill="none" stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
        {Array.from({ length: 7 }, (_, i) => { const x = X0 + (i + 0.5) * (Wd * 0.25 / 7), at = m.siete + 0.4 + i * 0.25, u = cl((t - at) / 0.6); return <ellipse key={i} cx={x} cy={lerp(Y0 - Hd - 40, Y0 - f((i + 0.5) / 28) * Hd - 20, u)} rx={8} ry={12} fill={C.water} opacity={u > 0 && u < 1 ? 1 : 0} />; })}
      </Svg>
      <Lbl t={t} at={m.siete + 0.2} text="los primeros 7 días" x={600} y={200} col={C.water} size={58} />
      <Lbl t={t} at={a + 2} text="sigue endureciendo" x={1400} y={300} col={C.cream} size={54} />
    </>
  );
};

// 27 · todo tiene arreglo: cuatro tarjetas — agujero, arruga, filo, rajadura — y en cada una el remedio pasa por encima
export const CuatroArreglos: React.FC<FxP> = ({ t, a, m }) => {
  const T4 = [{ at: a + 0.3, lab: "agujero: lechada" }, { at: m.arr, lab: "arruga: lija al agua" }, { at: m.filo, lab: "filo: redondeado" }, { at: m.raja, lab: "rajadura: mojar y llenar" }];
  return (
    <>
      {T4.map((q, i) => {
        const fix = e(t, q.at + 0.8, q.at + 1.8);
        return (
          <Pop key={i} t={t} at={q.at} x={300 + (i % 2) * 0 + i * 440} y={500}>
            <div style={{ ...glass(), width: 400, height: 420, position: "relative" }}>
              <svg width={400} height={420} style={{ position: "absolute", inset: 0 }}>
                <path d="M40,300 C 40,110 360,110 360,300 Q 200,330 40,300 Z" fill={C.cem} />
                {i === 0 && <><circle cx={200} cy={200} r={22} fill="#231d15" /><circle cx={200} cy={200} r={22 * fix} fill={C.cem2} /></>}
                {i === 1 && <path d="M120,220 q 40,-30 80,0 t 80,0" stroke="#7d776c" strokeWidth={6} fill="none" opacity={1 - fix} />}
                {i === 2 && <path d={`M40,300 L ${40 - 18 * (1 - fix)},${300 - 4} L 46,288`} stroke={C.red} strokeWidth={6} fill="none" opacity={1 - fix} />}
                {i === 3 && <><Draw d="M200,150 L188,200 L210,250 L196,300" p={1} col="#1c1813" w={5} /><Draw d="M200,150 L188,200 L210,250 L196,300" p={fix} col={C.cem2} w={12} /></>}
              </svg>
            </div>
            <div style={{ textAlign: "center", marginTop: 16, width: 400, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.cream, textTransform: "uppercase", whiteSpace: "nowrap" }}>{q.lab}</div>
          </Pop>
        );
      })}
      <Lbl t={t} at={a + 0.5} text="casi todo tiene arreglo" x={960} y={190} col={C.ok} size={62} />
    </>
  );
};

// 28 · las laminillas: el sombrero visto de abajo; el tenedor tira rayas desde la llave al borde, una por una, todo alrededor
export const Laminillas: React.FC<FxP> = ({ t, a, m }) => {
  const n = Math.floor(64 * e(t, m.ten, m.ten + 5)), rot = (t - a) * 6;
  return (
    <>
      <Svg>
        <g transform={`rotate(${rot} 960 540)`}>
          <circle cx={960} cy={540} r={360} fill={C.cem} />
          <circle cx={960} cy={540} r={70} fill="#231d15" />
          {Array.from({ length: n }, (_, i) => { const an = (i / 64) * Math.PI * 2 + hash(i, 2) * 0.05, r1 = 80, r2 = 340 - 30 * hash(i, 3); return <line key={i} x1={960 + Math.cos(an) * r1} y1={540 + Math.sin(an) * r1} x2={960 + Math.cos(an) * r2} y2={540 + Math.sin(an) * r2} stroke="#7d776c" strokeWidth={3 + 2 * hash(i, 4)} strokeLinecap="round" />; })}
        </g>
      </Svg>
      <Lbl t={t} at={a + 0.4} text="como las páginas" x={1600} y={260} col={C.cream} size={58} />
      <Lbl t={t} at={m.ten + 0.4} text="de la llave al borde" x={1560} y={840} col={C.sun} size={54} />
    </>
  );
};
