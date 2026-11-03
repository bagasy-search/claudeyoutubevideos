// cl2heladera · componentes 22:40 → 41:10 (no frost, termostato, bulbo, hummm-clac, cuentas, mudanza, gas, Don Aldo, el reloj).
import React from "react";
import { C, FONT, BODY, cl, e, lerp, spr, hash } from "./lib";
import { Lbl } from "./base";
import { Big, Cross, Draw, FxP, Pop, Svg, Tick, Txt, glass, num, shake } from "./kit";

// 30 · tres voces: tres mensajes que se escriben letra a letra y se funden en la misma frase
export const TresVoces: React.FC<FxP> = ({ t, a, m }) => {
  const Q = [["Venezuela", a], ["Monterrey", a + 1.2], ["Bogotá", m.bog]] as const, merge = e(t, m.frase - 0.2, m.frase + 0.8);
  const frase = "arriba congela, abajo no enfría";
  return (
    <>
      {Q.map(([w, at], i) => { const p = spr(t, at, 1), y = lerp(250 + i * 190, 470, merge), x = lerp(i % 2 ? 1150 : 770, 960, merge); return (
        <div key={w} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * p})`, opacity: cl(p * 2) * (1 - merge * (i ? 1 : 0)), ...glass(), padding: "22px 34px", width: 720 }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ice, textTransform: "uppercase" }}>desde {w}</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 42, color: C.ink }}>{frase.slice(0, Math.floor(frase.length * e(t, at + 0.2, at + 1.4)))}</div>
        </div>); })}
      <Lbl t={t} at={m.frase + 0.6} text="tres países, misma falla" x={960} y={820} col={C.heat2} size={64} />
    </>
  );
};

// 31 · el botoncito del marco: apretado → el ventilador sopla; suelto → se para
export const Boton: React.FC<FxP> = ({ t, a, m }) => {
  const pr = e(t, a + 0.2, a + 0.6), spin = t > m.arranca - 0.3 ? 1 : 0, ang = spin ? (t - m.arranca) * 900 : 0;
  return (
    <>
      <Svg>
        <rect x={360} y={180} width={140} height={760} fill="rgba(214,241,255,.1)" stroke={C.edge} strokeWidth={3} />
        <rect x={500 - 46 * pr} y={500} width={90} height={80} rx={16} fill={C.ink} />
        <g transform={`translate(${620 - 60 * pr},540)`}><ellipse rx={90} ry={56} fill="#e7c6a5" /></g>
        <g transform={`translate(1300,520) rotate(${ang})`}>{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-90} rx={36} ry={90} fill={C.ice2} opacity={0.85} transform={`rotate(${r})`} />)}<circle r={30} fill={C.night} stroke={C.ice2} strokeWidth={4} /></g>
        {spin > 0 && Array.from({ length: 10 }, (_, i) => { const u = ((t - m.arranca) * 0.9 + i / 10) % 1; return <path key={i} d={`M${1300 + (i - 5) * 30},${700 + u * 260} q 20,20 0,40`} stroke={C.ice} strokeWidth={6} fill="none" opacity={(1 - u) * 0.9} />; })}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="apretá el botón" x={560} y={1000} col={C.ink} size={56} />
      <Lbl t={t} at={m.arranca + 0.3} text="sopla: está bien" x={1300} y={240} col={C.ok} size={64} />
    </>
  );
};

// 32 · el botón pegado: la heladera cree que la puerta está abierta; el ventilador nunca gira
export const BotonPegado: React.FC<FxP> = ({ t, a, b, m }) => {
  const sticky = e(t, a + 0.3, a + 1.4);
  return (
    <>
      <Svg>
        <rect x={420} y={360} width={420} height={360} rx={30} fill="rgba(214,241,255,.08)" stroke={C.edge} strokeWidth={3} />
        <rect x={560} y={480 - 60 * (1 - sticky)} width={140} height={120} rx={18} fill={C.ink} />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={560 + hash(i, 1) * 140} cy={470 + hash(i, 2) * 140} r={8 + hash(i, 3) * 10} fill="#7a5b3a" opacity={sticky * 0.85} />)}
        <g transform="translate(1340,540)" opacity={cl((t - m.cree) * 3)}><rect x={-200} y={-220} width={400} height={440} rx={20} fill="none" stroke={C.ice2} strokeWidth={5} /><path d={`M200,-220 L${200 + 200 * 0.8},-160 L${200 + 200 * 0.8},160 L200,220`} fill="rgba(214,241,255,.12)" stroke={C.ice2} strokeWidth={5} /></g>
        <g transform="translate(1340,540)" opacity={cl((t - m.nunca) * 3)}>{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx={0} cy={-60} rx={24} ry={60} fill="rgba(214,241,255,.4)" transform={`rotate(${r})`} />)}</g>
        <Cross t={t} at={m.nunca + 0.3} x={1340} y={540} r={90} />
      </Svg>
      <Lbl t={t} at={m.cree + 0.3} text="cree que está abierta" x={1340} y={240} col={C.heat2} size={56} />
      <Lbl t={t} at={b - 2} text="un botón de nada" x={630} y={850} col={C.ink} size={64} />
    </>
  );
};

// 33 · el evaporador tapado: aletas que se cubren de escarcha; las flechas de aire se angostan; la resistencia que no prende
export const Evaporador: React.FC<FxP> = ({ t, a, m }) => {
  const ice = e(t, m.crece - 1.5, m.crece + 2.2), res = t > m.resis ? 0.4 + 0.4 * Math.sin(t * 6) * (1 - ice) : 0;
  return (
    <>
      <Svg>
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={560 + i * 50} y={300} width={14 + ice * 34} height={420} rx={4} fill={ice > 0.2 ? "rgba(240,250,255,.85)" : "#9aa5ae"} />)}
        <path d="M540,760 L1380,760" stroke={`rgba(255,90,60,${res})`} strokeWidth={14} strokeLinecap="round" />
        {Array.from({ length: 8 }, (_, i) => { const u = (t * 0.8 + i / 8) % 1, y = 340 + i * 50, x = lerp(300, 1600, u); return <path key={i} d={`M${x},${y} l 50,0 l -14,-10 m 14,10 l -14,10`} stroke={C.ice} strokeWidth={6} fill="none" opacity={(x > 540 && x < 1380 ? 1 - ice * 0.95 : 1) * 0.85} />; })}
      </Svg>
      <Lbl t={t} at={a + 0.3} text="el evaporador" x={960} y={220} col={C.ice2} size={66} />
      <Lbl t={t} at={m.resis + 0.3} text="la resistencia lo derrite" x={960} y={850} col={C.heat2} size={52} />
      <Lbl t={t} at={m.crece + 0.3} text="tapado de hielo" x={960} y={950} col={C.red} size={64} />
    </>
  );
};

// 34 · el bulbo y su gasito: corte del caño; el gas se contrae (abre contactos, motor quieto) o se expande (cierra, motor anda)
export const BulboGas: React.FC<FxP> = ({ t, a, m }) => {
  const s = t < m.contrae ? 0.6 : t < m.expande ? lerp(0.6, 0.15, e(t, m.contrae, m.contrae + 1.2)) : lerp(0.15, 1, e(t, m.expande, m.expande + 1.2));
  const closed = s > 0.55, motor = closed ? (t * 500) % 360 : 0;
  return (
    <>
      <Svg>
        <path d="M300,560 C 500,560 520,380 700,380 L1000,380" stroke="#b87333" strokeWidth={18} fill="none" />
        {Array.from({ length: 22 }, (_, i) => { const u = hash(i, 1), x = lerp(320, 980, u), q = 0.4 + 0.6 * s; return <circle key={i} cx={x} cy={x < 700 ? 560 - (x - 300) / 400 * 180 + (hash(i, 2) - 0.5) * 6 : 380 + (hash(i, 2) - 0.5) * 6} r={5 * q} fill={C.ice2} opacity={q} />; })}
        <rect x={1000} y={300} width={260} height={180} rx={20} fill="rgba(214,241,255,.1)" stroke={C.edge} strokeWidth={3} />
        <line x1={1060} x2={1140} y1={420} y2={closed ? 420 : 370} stroke={C.ink} strokeWidth={10} strokeLinecap="round" /><circle cx={1150} cy={420} r={10} fill={closed ? C.ok : C.red} />
        <g transform="translate(1520,620)"><circle r={130} fill="#1a2128" stroke="#4d5862" strokeWidth={4} /><path d="M0,-80 L0,80 M-80,0 L80,0" stroke={closed ? C.heat : "#4d5862"} strokeWidth={14} transform={`rotate(${motor})`} /></g>
      </Svg>
      <Lbl t={t} at={a + 0.3} text="el bulbo" x={420} y={650} col={C.ice2} size={60} />
      <Lbl t={t} at={m.contrae + 0.3} out={m.expande} text="se enfría: corta" x={1520} y={840} col={C.ice} size={60} />
      <Lbl t={t} at={m.expande + 0.3} text="se calienta: arranca" x={1520} y={840} col={C.heat} size={60} />
    </>
  );
};

// 35 · la prueba del clic: osciloscopio del sonido; la perilla gira y en un punto salta el clic y el motor se calla
export const ClicDial: React.FC<FxP> = ({ t, a, m }) => {
  const hum = (x: number) => t < m.clic1 || (t > m.clic2 && t < m.muerto) ? 1 : 0.08;
  const path = Array.from({ length: 300 }, (_, i) => { const x = 300 + i * 4.4, tt = t - (300 - i) * 0.01; const spike = Math.abs(tt - m.clic1) < 0.06 || Math.abs(tt - m.clic2) < 0.06 ? 160 : 0; return `${i ? "L" : "M"}${x},${560 + Math.sin(tt * 120) * 40 * hum(x) + spike * Math.sin(i)}`; }).join(" ");
  const knob = lerp(120, -120, e(t, a + 0.3, m.clic1 + 0.6)) + lerp(0, 160, e(t, m.clic1 + 1, m.clic2));
  return (
    <>
      <Svg>
        <rect x={280} y={380} width={1340} height={360} rx={24} fill="rgba(14,34,52,.55)" stroke={C.edge} strokeWidth={2} />
        <path d={path} stroke={C.ok} strokeWidth={4} fill="none" />
        <g transform={`translate(960,880) rotate(${knob})`}><circle r={80} fill="#dfe4e8" /><rect x={-8} y={-74} width={16} height={50} rx={8} fill={C.night} /></g>
      </Svg>
      <Lbl t={t} at={m.clic1} text="clic" x={1450} y={300} col={C.ok} size={110} k={1.6} />
      <Lbl t={t} at={m.vivo + 0.2} out={m.muerto} text="vivo" x={480} y={300} col={C.ok} size={70} />
      <Lbl t={t} at={m.muerto + 0.6} text="sin clic: muerto" x={600} y={300} col={C.red} size={64} />
    </>
  );
};

// 36 · el bulbo suelto: el caño en el aire no siente el frío; la grampa lo pega a la pared y el motor corta
export const BulboSuelto: React.FC<FxP> = ({ t, a, b, m }) => {
  const loose = e(t, m.suelto - 0.4, m.suelto + 0.6), fix = e(t, b - 2.4, b - 1.4), gap = 120 * loose * (1 - fix), cold = fix;
  return (
    <>
      <Svg>
        <rect x={1300} y={200} width={90} height={700} fill="rgba(240,250,255,.8)" />
        {Array.from({ length: 8 }, (_, i) => { const u = (t * 0.6 + i / 8) % 1; return <circle key={i} cx={1290 - u * (gap > 30 ? 60 : 200)} cy={260 + i * 80} r={10} fill={C.ice} opacity={(1 - u) * 0.8} />; })}
        <path d={`M600,880 C 900,880 1100,${560 + gap * 0.3} ${1300 - gap},560 L${1300 - gap},300`} stroke={cold > 0.5 ? C.ice : "#b87333"} strokeWidth={14} fill="none" />
        <rect x={1230} y={520} width={150 - 0} height={30} rx={8} fill="#9aa5ae" transform={`translate(${-gap * (1 - fix)},0)`} opacity={0.7 + 0.3 * fix} />
        <text x={760} y={500} fill={cold > 0.5 ? C.ice : C.heat} fontFamily={FONT} fontWeight={800} fontSize={130}>{cold > 0.5 ? "4°" : num(t, a, m.cree + 1, 6, 9)}°</text>
      </Svg>
      <Lbl t={t} at={m.suelto + 0.3} out={b - 2.4} text="en el aire" x={1050} y={250} col={C.red} size={64} />
      <Lbl t={t} at={m.cree + 0.3} out={b - 2.4} text="nunca corta" x={760} y={600} col={C.heat} size={64} />
      <Lbl t={t} at={b - 2.2} text="pegado a la pared" x={960} y={980} col={C.ok} size={68} />
    </>
  );
};

// 37 · cinco reglas del cambio de termostato: lista que se tilda con trazo
export const CincoReglas: React.FC<FxP> = ({ t, m }) => {
  const R = [["desenchufada", m.r1], ["foto a los cables", m.r2], ["repuesto del mismo tipo", m.r3], ["bulbo en el mismo lugar", m.r4], ["no doblarlo", m.r5]] as const;
  return (
    <>
      <div style={{ position: "absolute", left: 560, top: 170, width: 900, height: 760, ...glass() }} />
      <Svg>{R.map(([w, at], i) => <Tick key={i} t={t} at={at + 0.2} x={660} y={270 + i * 140} r={34} col={i === 3 ? C.heat : C.ok} />)}</Svg>
      {R.map(([w, at], i) => <Lbl key={i} t={t} at={at} text={w} x={740} y={270 + i * 140} align="left" col={i === 3 ? C.heat2 : C.ink} size={i === 3 ? 62 : 54} />)}
    </>
  );
};

// 38 · hummm y clac: la onda del zumbido, el golpe del protector y el silencio; cinco minutos y otra vez
export const HumClac: React.FC<FxP> = ({ t, a, m }) => {
  const span = 6, X = (s: number) => 260 + (s / span) * 1400;
  const wave = Array.from({ length: 400 }, (_, i) => { const s = (i / 400) * span, tt = a + s; const on = tt < m.clac ? 1 : tt < m.clac + 0.12 ? 3 : 0; return `${i ? "L" : "M"}${X(s)},${560 + Math.sin(i * 1.9) * 40 * on}`; }).join(" ");
  return (
    <>
      <Svg>
        <Draw d={wave} p={e(t, a, a + span)} col={C.heat} w={4} />
        <line x1={X(m.clac - a)} x2={X(m.clac - a)} y1={380} y2={740} stroke={C.red} strokeWidth={3} strokeDasharray="8 8" opacity={cl((t - m.clac) * 4)} />
      </Svg>
      <Lbl t={t} at={a + 0.3} text="hummm" x={X(0.9)} y={360} col={C.heat2} size={80} />
      <Lbl t={t} at={m.clac} text="clac" x={X(m.clac - a)} y={300} col={C.red} size={120} k={1.8} />
      <Pop t={t} at={m.otra} x={1500} y={830}><Big size={80} col={C.dim}>+5 min: otra vez</Big></Pop>
    </>
  );
};

// 39 · tres causas: escalera de precio de la más barata a la más cara
export const TresCausas: React.FC<FxP> = ({ t, a, m }) => {
  const S = [["tensión", "$", a + 0.6], ["relé", "$$", a + 1.2], ["motor", "$$$", a + 1.8]] as const, dir = e(t, m.pared, m.pared + 0.8);
  return (
    <>
      <Svg>{S.map(([w, p, at], i) => { const q = spr(t, at, 1); return <g key={i} transform={`translate(0,${(1 - q) * 300})`} opacity={cl(q * 2)}><rect x={400 + i * 400} y={700 - i * 160} width={360} height={200 + i * 160} rx={16} fill={i === 0 && t > m.c1 ? "rgba(125,255,155,.22)" : "rgba(214,241,255,.08)"} stroke={i === 0 && t > m.c1 ? C.ok : C.edge} strokeWidth={3} /><text x={580 + i * 400} y={780 - i * 160} textAnchor="middle" fill={C.heat2} fontFamily={FONT} fontWeight={800} fontSize={60}>{p}</text></g>; })}</Svg>
      {S.map(([w, p, at], i) => <Lbl key={i} t={t} at={at + 0.2} text={w} x={580 + i * 400} y={640 - i * 160} col={C.ink} size={64} />)}
      <Lbl t={t} at={m.pared + 0.2} text="sola, directo a la pared" x={960} y={1000} col={C.ok} size={56} />
    </>
  );
};

// 40 · el relé de arranque: la piecita pegada al motor que da el empujón (flecha que patea el rotor)
export const Rele: React.FC<FxP> = ({ t, a, m }) => {
  const kick = e(t, m.emp, m.emp + 0.4), rot = kick * 200 + (t > m.emp + 0.4 ? (t - m.emp) * 300 : 0);
  return (
    <>
      <Svg>
        <circle cx={1000} cy={580} r={260} fill="#1a2128" stroke="#4d5862" strokeWidth={5} />
        <g transform={`translate(1000,580) rotate(${rot})`}><path d="M0,-170 L0,170 M-170,0 L170,0" stroke="#4d5862" strokeWidth={26} strokeLinecap="round" /></g>
        <rect x={600} y={560} width={140} height={110} rx={14} fill="#2f3b45" stroke={C.heat} strokeWidth={4} />
        <Draw d="M740,600 C 820,560 860,520 900,470" p={kick} col={C.heat} w={10} glow />
      </Svg>
      <Lbl t={t} at={a + 0.3} text="el relé de arranque" x={1000} y={930} col={C.heat2} size={62} />
      <Lbl t={t} at={m.barato + 0.2} text="barato, pero con 220" x={1400} y={250} col={C.ink} size={56} />
    </>
  );
};

// 41 · las cuentas: 24 h × 365 días en un odómetro; dos kWh que bajan a uno
export const Cuentas: React.FC<FxP> = ({ t, a, m }) => {
  const kwh = t < m.uno ? lerp(0, 2.1, e(t, m.dos - 0.4, m.dos + 1)) : lerp(2.1, 1.1, e(t, m.uno, m.uno + 1.4));
  return (
    <>
      <Pop t={t} at={Math.min(m.h24, a + 0.4)} x={560} y={420}><Big size={160} col={C.ink}>24 h</Big></Pop>
      <Pop t={t} at={Math.min(m.h24, a + 0.4) + 1.1} x={560} y={620}><Big size={120} col={C.dim}>× 365</Big></Pop>
      <Pop t={t} at={m.doble} x={1340} y={360}><Big size={110} col={C.heat}>× 2 de motor</Big></Pop>
      <Pop t={t} at={m.dos - 0.2} x={1340} y={650}>
        <div style={{ ...glass(), padding: "20px 50px", display: "flex", gap: 18, alignItems: "baseline" }}><Big size={150} col={t > m.uno ? C.ok : C.heat}>{kwh.toFixed(1).replace(".", ",")}</Big><Big size={60} col={C.dim}>kWh / día</Big></div>
      </Pop>
    </>
  );
};

// 42 · la mudanza: parada vs acostada; el aceite del motor se corre a los caños y vuelve con el tiempo
export const Mudanza: React.FC<FxP> = ({ t, a, b, m }) => {
  const lie = e(t, m.acost - 0.4, m.acost + 0.6), run = e(t, m.corre, m.corre + 1.5) * (1 - e(t, b - 2.2, b - 0.8));
  return (
    <>
      <Svg>
        <g transform="translate(560,600)"><rect x={-110} y={-260} width={220} height={480} rx={18} fill="rgba(214,241,255,.08)" stroke={C.ok} strokeWidth={4} /><circle cy={170} r={60} fill="#1a2128" /><rect x={-50} y={190} width={100} height={30} fill="#e8c766" /></g>
        <g transform={`translate(1360,640) rotate(${-90 * lie})`}><rect x={-110} y={-260} width={220} height={480} rx={18} fill="rgba(214,241,255,.08)" stroke={lie > 0.5 ? C.heat : C.edge} strokeWidth={4} /><circle cy={170} r={60} fill="#1a2128" /><rect x={-50} y={190 - 400 * run} width={100} height={30} fill="#e8c766" opacity={0.9} /><path d="M60,170 L90,170 L90,-200" stroke="#b87333" strokeWidth={10} fill="none" /></g>
      </Svg>
      <Lbl t={t} at={a + 0.3} text="parada: 4 horas" x={560} y={940} col={C.ok} size={60} />
      <Lbl t={t} at={m.acost + 0.4} text="acostada: un día" x={1360} y={940} col={C.heat} size={60} />
      <Lbl t={t} at={m.aceite + 0.2} text="el aceite vuelve" x={1360} y={230} col="#e8c766" size={56} />
    </>
  );
};

// 43 · el gas no se gasta: un circuito cerrado que gira para siempre; una pérdida lo vacía aunque lo carguen
export const Perdida: React.FC<FxP> = ({ t, a, m }) => {
  const leak = t > m.perd, refill = t > m.carg ? e(t, m.carg, m.carg + 0.8) : 0, lvl = leak ? Math.max(0, 1 - (t - m.perd) * 0.18) * (1 - refill) + refill * Math.max(0, 1 - (t - m.carg - 0.8) * 0.3) : 1;
  const N = 40;
  return (
    <>
      <Svg>
        <rect x={560} y={260} width={800} height={520} rx={160} fill="none" stroke="#b87333" strokeWidth={30} />
        {Array.from({ length: N }, (_, i) => { if (i / N > lvl) return null; const u = (t * 0.12 + i / N) % 1, L = 2 * (800 - 320) + 2 * (520 - 320) + 2 * Math.PI * 160, d = u * L;
          let x = 0, y = 0; const s1 = 480, s2 = s1 + Math.PI * 80, s3 = s2 + 200, s4 = s3 + Math.PI * 80, s5 = s4 + 480, s6 = s5 + Math.PI * 80, s7 = s6 + 200;
          if (d < s1) { x = 720 + d; y = 260; } else if (d < s2) { const q = (d - s1) / (Math.PI * 160) * Math.PI; x = 1200 + 160 * Math.sin(q); y = 420 - 160 * Math.cos(q); } else if (d < s3) { x = 1360; y = 420 + (d - s2); } else if (d < s4) { const q = (d - s3) / (Math.PI * 160) * Math.PI; x = 1200 + 160 * Math.cos(q); y = 620 + 160 * Math.sin(q); } else if (d < s5) { x = 1200 - (d - s4); y = 780; } else if (d < s6) { const q = (d - s5) / (Math.PI * 160) * Math.PI; x = 720 - 160 * Math.sin(q); y = 620 + 160 * Math.cos(q); } else if (d < s7) { x = 560; y = 620 - (d - s6); } else { const q = (d - s7) / (Math.PI * 160) * Math.PI; x = 720 - 160 * Math.cos(q); y = 420 - 160 * Math.sin(q); }
          return <circle key={i} cx={x} cy={y} r={10} fill={C.ice2} />; })}
        {leak && Array.from({ length: 8 }, (_, i) => { const u = ((t - m.perd) * 0.7 + i / 8) % 1; return <circle key={"l" + i} cx={1360 + u * 160} cy={560 + u * 140} r={8 + u * 14} fill="rgba(214,241,255,.5)" opacity={(1 - u) * lvl} />; })}
        {leak && <circle cx={1360} cy={560} r={18} fill={C.red} />}
      </Svg>
      <Lbl t={t} at={m.nogasta + 0.2} text="el gas no se gasta" x={960} y={520} col={C.ice2} size={64} />
      <Lbl t={t} at={m.perd + 0.3} text="hay una pérdida" x={1460} y={880} col={C.red} size={60} />
      <Lbl t={t} at={m.carg + 0.4} text="cargar sin buscarla, no" x={760} y={900} col={C.heat2} size={52} />
    </>
  );
};

// 44 · las cinco cosas que Don Aldo nunca hacía: tarjetas que se clavan con chinche en el tablero del taller
export const CincoNunca: React.FC<FxP> = ({ t, m }) => {
  const N = [["enchufada", m.n1], ["metal en el hielo", m.n2], ["prender al toque", m.n3], ["hacer un puente", m.n4], ["pegada a la pared", m.n5]] as const;
  return (
    <>
      <div style={{ position: "absolute", left: 200, top: 160, width: 1520, height: 760, borderRadius: 18, background: "repeating-linear-gradient(0deg, rgba(160,120,80,.35) 0 2px, rgba(120,88,58,.30) 2px 22px)", border: "10px solid rgba(90,62,40,.7)" }} />
      {N.map(([w, at], i) => { const p = spr(t, at, 1.1), x = 470 + (i % 3) * 490, y = 360 + Math.floor(i / 3) * 330, r = (hash(i, 7) - 0.5) * 8; return t < at ? null : (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 420, transform: `translate(-50%,-50%) translateY(${(1 - p) * -80}px) rotate(${r}deg) scale(${0.8 + 0.2 * p})`, background: "#f4efe1", padding: "30px 20px 22px", boxShadow: "0 18px 40px rgba(0,0,0,.45)", textAlign: "center" }}>
          <div style={{ position: "absolute", left: "50%", top: -14, width: 30, height: 30, borderRadius: 15, background: C.red, transform: "translateX(-50%)", boxShadow: "0 4px 6px rgba(0,0,0,.4)" }} />
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#7a1e25", textTransform: "uppercase" }}>nunca</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#1d2a35", textTransform: "uppercase", lineHeight: 1 }}>{w}</div>
        </div>); })}
    </>
  );
};

// 45 · comentarios: hilo de preguntas con la respuesta corta abajo de cada una
export const Comentarios: React.FC<FxP> = ({ t, a, m }) => {
  const Q = [["Venezuela", "no enfría ni apaga", "parrilla, burlete, hielo", a], ["Bogotá", "recargaron gas y nada", "buscar la pérdida", m.bog], ["Monterrey", "el abanico gira, no enfría", "evaporador con hielo", m.mty], ["una señora", "seis horas abierta", "no se rompió", m.senora]] as const;
  const cur = Q.reduce((k, q, i) => (t >= q[3] ? i : k), 0);
  return (
    <>
      {Q.map(([who, q, r, at], i) => { const d = i - cur, p = spr(t, at, 1); return t < at - 0.1 ? null : (
        <div key={i} style={{ position: "absolute", left: 960, top: 520 + d * 230, transform: `translate(-50%,-50%) scale(${d === 0 ? 1 : 0.82})`, opacity: d === 0 ? cl(p * 2) : 0.28, width: 1100, ...glass(), padding: "26px 40px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ice, textTransform: "uppercase" }}>{who}</div>
          <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 46, color: C.ink }}>“{q}”</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ok, textTransform: "uppercase", opacity: e(t, at + 1.2, at + 1.6), marginTop: 8 }}>→ {r}</div>
        </div>); })}
    </>
  );
};

// 46 · el reloj de Don Aldo: esfera de una hora con los arcos de motor andando (naranja) y descansando (azul)
export const Reloj: React.FC<FxP> = ({ t, a, m }) => {
  const arcs = [[0, 22, 1], [22, 37, 0], [37, 60, 1]] as const, sw = e(t, a + 0.3, m.desc + 1.5);
  const arc = (a0: number, a1: number) => { const p = (x: number) => [960 + 300 * Math.sin((x / 60) * 2 * Math.PI), 540 - 300 * Math.cos((x / 60) * 2 * Math.PI)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0},${y0} A300,300 0 ${a1 - a0 > 30 ? 1 : 0} 1 ${x1},${y1}`; };
  return (
    <>
      <Svg>
        <circle cx={960} cy={540} r={360} fill="rgba(240,232,210,.08)" stroke="#c9b48a" strokeWidth={10} />
        {Array.from({ length: 12 }, (_, i) => { const q = (i / 12) * 2 * Math.PI; return <line key={i} x1={960 + 330 * Math.sin(q)} y1={540 - 330 * Math.cos(q)} x2={960 + 350 * Math.sin(q)} y2={540 - 350 * Math.cos(q)} stroke="#c9b48a" strokeWidth={5} />; })}
        {arcs.map(([a0, a1, on], i) => <Draw key={i} d={arc(a0, Math.min(a1, Math.max(a0, sw * 60)))} p={sw * 60 > a0 ? 1 : 0} col={on ? C.heat : C.ice} w={34} />)}
        <line x1={960} y1={540} x2={960 + 280 * Math.sin(sw * 2 * Math.PI)} y2={540 - 280 * Math.cos(sw * 2 * Math.PI)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" /><circle cx={960} cy={540} r={16} fill={C.ink} />
      </Svg>
      <Lbl t={t} at={m.trab + 0.2} text="trabaja 15 a 30 min" x={1560} y={360} col={C.heat} size={54} />
      <Lbl t={t} at={m.desc + 0.2} text="descansa 10 a 20" x={1560} y={720} col={C.ice} size={54} />
      <Lbl t={t} at={m.desc + 2.5} text="el pulso" x={400} y={940} col={C.ink} size={72} />
    </>
  );
};

// 47 · el diagnóstico por el ritmo: cinco tiras de ritmo (barra de motor) y su causa
export const Diagnostico: React.FC<FxP> = ({ t, m }) => {
  const D = [["sana", [1, 0, 1, 0, 1, 0], m.d1, C.ok], ["parrilla, burlete, hielo", [1, 1, 1, 1, 0, 1], m.d2, C.heat], ["termostato o bulbo", [1, 1, 1, 1, 1, 1], m.d3, C.red], ["tensión o relé", [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], m.d4, "#ffd56a"], ["recién ahí, el gas", [1, 1, 1, 1, 1, 1], m.d5, C.ice]] as const;
  const cur = D.reduce((k, d, i) => (t >= d[2] ? i : k), 0);
  return (
    <>
      {D.map(([w, pat, at, col], i) => { const on = i === cur, p = spr(t, at, 1); return t < at - 0.1 ? null : (
        <div key={i} style={{ position: "absolute", left: 240, top: 160 + i * 160, width: 1440, height: 130, display: "flex", alignItems: "center", gap: 40, opacity: on ? cl(p * 2) : 0.3, transform: `translateX(${(1 - p) * -80}px)` }}>
          <div style={{ display: "flex", gap: 6, width: 700 }}>{pat.map((b, k) => <div key={k} style={{ flex: 1, height: 60, borderRadius: 8, background: b ? (col as string) : "rgba(214,241,255,.12)", opacity: e(t, at + k * 0.08, at + k * 0.08 + 0.2) }} />)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: col as string, textTransform: "uppercase" }}>{w}</div>
        </div>); })}
    </>
  );
};

// 48 · la rutina: anillo del año con doce marcas (mes) y dos estrellas (verano e invierno)
export const Rutina: React.FC<FxP> = ({ t, a, b, m }) => {
  const run = e(t, a + 0.3, m.dos - 0.2), two = e(t, m.dos, m.dos + 1);
  return (
    <>
      <Svg>
        <circle cx={760} cy={540} r={300} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={30} />
        {Array.from({ length: 12 }, (_, i) => { const q = (i / 12) * 2 * Math.PI, on = run * 12 > i; return <circle key={i} cx={760 + 300 * Math.sin(q)} cy={540 - 300 * Math.cos(q)} r={on ? 26 : 14} fill={on ? C.ice : "rgba(255,255,255,.2)"} />; })}
        {[[-0.08, "VERANO", C.heat], [0.42, "INVIERNO", C.ice2]].map(([f, w, col], i) => { const q = (f as number) * 2 * Math.PI, p = spr(t, m.dos + i * 0.4, 1); return <g key={i} transform={`translate(${760 + 420 * Math.sin(q)},${540 - 420 * Math.cos(q)}) scale(${p})`} opacity={two}><circle r={60} fill={col as string} opacity={0.25} /><text y={14} textAnchor="middle" fill={col as string} fontFamily={FONT} fontWeight={800} fontSize={38}>{w as string}</text></g>; })}
      </Svg>
      <Lbl t={t} at={a + 0.4} text="burlete y desagote, cada mes" x={1420} y={420} col={C.ice} size={48} />
      <Lbl t={t} at={m.dos + 0.4} text="parrilla, dos por año" x={1420} y={560} col={C.heat2} size={52} />
      <Lbl t={t} at={m.duda + 0.2} text="el vaso y el reloj" x={1420} y={760} col={C.ink} size={64} />
    </>
  );
};
