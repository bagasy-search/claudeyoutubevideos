import React from "react";
import { rnd } from "./lib";
import { C, ent, fontFamily, prog } from "./kit";

// Objetos del video completo (trampas 1-7). Todo vector plano saturado, sombra propia abajo-derecha y brillo arriba-izquierda.
// Cada objeto se dibuja centrado en (x, y); con t/t0 entra con rebote (escala + giro) y con t1 sale.
type Pos = { x: number; y: number; s?: number; t?: number; t0?: number; t1?: number; rot?: number; op?: number };
const TINTA = "#2a1530";

export const Obj: React.FC<Pos & { w: number; h: number; children: React.ReactNode }> = ({ x, y, s = 1, t = 0, t0, t1 = 1e9, rot = 0, op = 1, w, h, children }) => {
  if (t0 !== undefined && t < t0) return null;
  const e = t0 === undefined ? 1 : ent(t, t0);
  const out = t > t1 ? Math.max(0, 1 - (t - t1) / 0.2) : 1;
  return (
    <svg style={{ position: "absolute", left: x - (w / 2) * s, top: y - (h / 2) * s, overflow: "visible", opacity: op * out, transform: `scale(${e * (0.8 + 0.2 * out)}) rotate(${rot + (1 - e) * -14}deg)` }} width={w * s} height={h * s} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
      {children}
    </svg>
  );
};
const Brillo: React.FC<{ d: string; w?: number }> = ({ d, w = 10 }) => <path d={d} stroke="#fff" strokeOpacity={0.55} strokeWidth={w} fill="none" strokeLinecap="round" />;

// ── moneda romana (denario de plata u oro) con perfil del emperador
export const Denario: React.FC<Pos & { r?: number; plata?: boolean; gira?: number }> = ({ r = 50, plata, gira = 0, ...p }) => {
  const a = plata ? ["#f4f6fa", "#b9c0cc", "#8a93a3"] : ["#ffe27a", "#e9a92a", "#a8650f"];
  const sx = gira ? Math.max(0.1, Math.abs(Math.cos((p.t ?? 0) * gira * Math.PI))) : 1;
  return (
    <Obj {...p} w={r * 2.2} h={r * 2.4}>
      <g transform={`scale(${sx} 1)`}>
        <ellipse cx={0} cy={r * 0.12} rx={r} ry={r} fill={a[2]} />
        <circle r={r} fill={a[1]} />
        <circle r={r * 0.8} fill="none" stroke={a[2]} strokeWidth={r * 0.06} strokeDasharray={`${r * 0.08} ${r * 0.08}`} />
        <path d={`M ${-r * 0.2} ${r * 0.5} Q ${-r * 0.45} ${r * 0.1} ${-r * 0.25} ${-r * 0.35} Q ${-r * 0.05} ${-r * 0.62} ${r * 0.25} ${-r * 0.42} Q ${r * 0.32} ${-r * 0.2} ${r * 0.42} ${-r * 0.05} L ${r * 0.28} ${r * 0.02} Q ${r * 0.3} ${r * 0.3} ${r * 0.12} ${r * 0.5} Z`} fill={a[2]} opacity={0.8} />
        {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={-r * 0.32 + k * r * 0.13} cy={-r * 0.45 + k * r * 0.02} rx={r * 0.07} ry={r * 0.12} fill={a[0]} opacity={0.6} transform={`rotate(${-40 + k * 20} ${-r * 0.32 + k * r * 0.13} ${-r * 0.45})`} />)}
        <Brillo d={`M ${-r * 0.55} ${-r * 0.45} Q ${-r * 0.3} ${-r * 0.75} ${r * 0.1} ${-r * 0.72}`} w={r * 0.1} />
      </g>
    </Obj>
  );
};

// ── tarjeta de oficio con veredicto
export type Oficio = "herrero" | "carpintero" | "carnicero" | "jabali" | "pescador" | "pastelero" | "tejedor" | "mujeres" | "agrimensor" | "escriba" | "arquero" | "medico" | "animales";
const ICONO: Record<Oficio, React.ReactNode> = {
  herrero: <g><path d="M -70 10 L 70 10 L 50 30 L 20 30 L 30 70 L -30 70 L -20 30 L -50 30 Z" fill="#5d6577" /><path d="M -70 10 L 70 10 L 60 -6 L -60 -6 Z" fill="#8a93a3" /><rect x={-8} y={-90} width={16} height={70} rx={6} fill="#8a5a2a" transform="rotate(30)" /><rect x={-34} y={-104} width={60} height={30} rx={6} fill="#5d6577" transform="rotate(30)" /></g>,
  carpintero: <g transform="rotate(-20)"><path d="M -80 -10 L 60 -30 L 60 20 L -80 20 Z" fill="#c8ccd4" />{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${-76 + i * 15} 20 l 7 12 l 7 -12`} fill="#c8ccd4" />)}<rect x={50} y={-44} width={44} height={70} rx={12} fill="#a8622c" /></g>,
  carnicero: <g transform="rotate(-25)"><path d="M -70 -50 L 40 -50 Q 60 0 40 30 L -70 30 Z" fill="#c8ccd4" /><circle cx={-48} cy={-28} r={9} fill="#fff" /><rect x={40} y={-24} width={70} height={26} rx={10} fill="#6b3a1f" /></g>,
  jabali: <g><ellipse cx={0} cy={10} rx={80} ry={56} fill="#6b4a3a" /><path d="M -60 -30 L -80 -70 L -40 -44 Z M 60 -30 L 80 -70 L 40 -44 Z" fill="#4a3226" /><ellipse cx={0} cy={36} rx={34} ry={24} fill="#c98a7a" /><circle cx={-12} cy={36} r={6} fill="#4a3226" /><circle cx={12} cy={36} r={6} fill="#4a3226" /><path d="M -30 46 Q -50 30 -46 10 M 30 46 Q 50 30 46 10" stroke="#fff6e0" strokeWidth={9} fill="none" strokeLinecap="round" /><circle cx={-30} cy={-6} r={8} fill="#1a1010" /><circle cx={30} cy={-6} r={8} fill="#1a1010" /></g>,
  pescador: <g><path d="M -80 0 Q -20 -50 50 0 Q -20 50 -80 0 Z" fill="#4fb0d8" /><path d="M 50 0 L 86 -32 L 86 32 Z" fill="#2f86b0" /><circle cx={-48} cy={-6} r={7} fill="#13324a" /><path d="M -20 -20 Q -10 0 -20 20" stroke="#2f86b0" strokeWidth={6} fill="none" /></g>,
  pastelero: <g><path d="M -70 20 L 70 20 L 60 70 L -60 70 Z" fill="#e88aa6" /><path d="M -70 20 Q 0 -60 70 20 Z" fill="#fff0d0" />{[-40, 0, 40].map((xx) => <circle key={xx} cx={xx} cy={-4 - (xx === 0 ? 20 : 0)} r={12} fill={C.rojo} />)}</g>,
  tejedor: <g><rect x={-60} y={-60} width={120} height={120} rx={14} fill="#f2ead8" />{Array.from({ length: 7 }, (_, i) => <line key={i} x1={-50 + i * 16} y1={-56} x2={-50 + i * 16} y2={56} stroke="#c9b48a" strokeWidth={6} />)}{Array.from({ length: 6 }, (_, i) => <line key={i} x1={-56} y1={-44 + i * 18} x2={56} y2={-44 + i * 18} stroke="#9a8460" strokeWidth={6} />)}</g>,
  mujeres: <g><path d="M -60 70 L -60 -40 Q 0 -100 60 -40 L 60 70 Z" fill="#7a4a9a" /><path d="M -50 70 L -50 -36 Q -10 -80 0 -76 L 0 70 Z" fill="#e88aa6" /><path d="M 0 -76 Q 10 -80 50 -36 L 50 70 L 0 70 Z" fill="#d06a8a" /><path d="M 0 0 C -30 -20 -20 -50 0 -34 C 20 -50 30 -20 0 0 Z" fill="#fff" /></g>,
  agrimensor: <g><line x1={0} y1={-80} x2={0} y2={80} stroke="#6b3a1f" strokeWidth={10} /><line x1={-70} y1={-60} x2={70} y2={-60} stroke="#6b3a1f" strokeWidth={8} /><line x1={0} y1={-60} x2={0} y2={-60} /><line x1={-70} y1={-60} x2={-70} y2={10} stroke="#5d6577" strokeWidth={4} /><line x1={70} y1={-60} x2={70} y2={10} stroke="#5d6577" strokeWidth={4} /><circle cx={-70} cy={14} r={9} fill="#5d6577" /><circle cx={70} cy={14} r={9} fill="#5d6577" /></g>,
  escriba: <g><rect x={-70} y={-50} width={140} height={100} rx={8} fill="#c98f4a" /><rect x={-60} y={-40} width={120} height={80} rx={4} fill="#3a2a1a" />{[-24, -6, 12].map((yy) => <path key={yy} d={`M -48 ${yy} q 12 -10 24 0 t 24 0 t 24 0 t 24 0`} stroke="#f2e4c0" strokeWidth={4} fill="none" />)}</g>,
  arquero: <g><path d="M -20 -80 Q 60 0 -20 80" stroke="#8a5a2a" strokeWidth={12} fill="none" /><line x1={-20} y1={-80} x2={-20} y2={80} stroke="#e8e0d0" strokeWidth={3} /><line x1={-60} y1={0} x2={70} y2={0} stroke="#6b3a1f" strokeWidth={6} /><path d="M 70 0 L 50 -12 L 50 12 Z" fill="#5d6577" /></g>,
  medico: <g><rect x={-24} y={-70} width={48} height={140} rx={8} fill={C.rojo} /><rect x={-70} y={-24} width={140} height={48} rx={8} fill={C.rojo} /></g>,
  animales: <g><ellipse cx={0} cy={20} rx={70} ry={42} fill="#f2ead8" /><circle cx={60} cy={-10} r={30} fill="#f2ead8" /><path d="M 44 -34 Q 30 -60 50 -64 M 76 -34 Q 90 -60 70 -64" stroke="#c9b48a" strokeWidth={10} fill="none" strokeLinecap="round" />{[-40, -10, 20, 50].map((xx) => <rect key={xx} x={xx - 6} y={50} width={12} height={26} rx={5} fill="#c9b48a" />)}<circle cx={70} cy={-14} r={5} fill="#2a1a10" /></g>,
};
export const Tarjeta: React.FC<Pos & { of: Oficio; label: string; veredicto?: "si" | "no"; tv?: number }> = ({ of, label, veredicto, tv = 1e9, ...p }) => {
  const v = (p.t ?? 0) >= tv ? ent(p.t ?? 0, tv) : 0;
  return (
    <Obj {...p} w={280} h={340}>
      <rect x={-130} y={-156} width={268} height={328} rx={30} fill="rgba(20,8,40,.35)" />
      <rect x={-140} y={-170} width={268} height={328} rx={30} fill="#fff8ec" />
      <rect x={-140} y={-170} width={268} height={328} rx={30} fill="none" stroke={TINTA} strokeWidth={8} />
      <g transform="translate(-6 -40)">{ICONO[of]}</g>
      <text x={-6} y={120} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={label.length > 10 ? 30 : 38} fill={TINTA}>{label}</text>
      {veredicto && v > 0 && (
        <g transform={`translate(70 -110) scale(${v * (1.6 - 0.6 * v)}) rotate(-14)`} opacity={Math.min(1, v * 2)}>
          <circle r={60} fill={veredicto === "si" ? "#2fae5a" : C.rojo} stroke="#fff" strokeWidth={10} />
          <path d={veredicto === "si" ? "M -28 0 L -6 24 L 30 -24" : "M -24 -24 L 24 24 M 24 -24 L -24 24"} stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </Obj>
  );
};

// ── mano grande (palma) con marca opcional
export const Mano: React.FC<Pos & { marca?: number; tono?: string }> = ({ marca = 0, tono = "#f2b48a", ...p }) => (
  <Obj {...p} w={360} h={460}>
    <path d="M -110 220 L -120 40 Q -170 -30 -150 -60 Q -120 -70 -96 -10 L -90 -150 Q -88 -186 -60 -186 Q -34 -186 -34 -150 L -30 -60 L -24 -196 Q -22 -230 6 -230 Q 34 -230 34 -196 L 34 -60 L 44 -180 Q 46 -212 74 -210 Q 100 -206 98 -174 L 92 -50 L 106 -130 Q 112 -158 136 -152 Q 158 -146 152 -116 L 130 60 Q 120 160 96 220 Z" fill={tono} stroke="#c9805a" strokeWidth={8} strokeLinejoin="round" />
    <path d="M -60 60 Q 0 90 70 50 M -50 110 Q 10 130 60 100" stroke="#c9805a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
    {marca > 0 && (
      <g opacity={marca} transform="translate(0 20)">
        <text x={0} y={22} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={84} fill="#2b3a8f" opacity={0.85}>SPQR</text>
      </g>
    )}
  </Obj>
);

// ── placa de plomo colgada del cuello
export const Placa: React.FC<Pos> = (p) => (
  <Obj {...p} w={260} h={360}>
    <path d="M -110 -170 Q 0 40 110 -170" stroke="#6b3a1f" strokeWidth={8} fill="none" />
    <circle cx={0} cy={60} r={86} fill="#7d8796" />
    <circle cx={0} cy={60} r={86} fill="none" stroke="#5d6577" strokeWidth={10} />
    <text x={0} y={80} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={50} fill="#4a5262">LEG</text>
    <Brillo d="M -50 10 Q -20 -10 20 -6" />
  </Obj>
);

// ── vara de medir (sólo la regla, el alto lo da h)
export const Regla: React.FC<Pos & { h?: number; marca?: number }> = ({ h = 820, marca, ...p }) => (
  <Obj {...p} w={140} h={h}>
    <rect x={-40} y={-h / 2} width={80} height={h} rx={10} fill="#e8c88a" stroke="#a8783a" strokeWidth={6} />
    {Array.from({ length: Math.floor(h / 40) }, (_, i) => <line key={i} x1={-40} y1={-h / 2 + 20 + i * 40} x2={i % 5 === 0 ? 20 : -6} y2={-h / 2 + 20 + i * 40} stroke="#7a4a1a" strokeWidth={i % 5 === 0 ? 7 : 4} />)}
    {marca !== undefined && <path d={`M 40 ${-h / 2 + marca} L 76 ${-h / 2 + marca - 20} L 76 ${-h / 2 + marca + 20} Z`} fill={C.rojo} />}
  </Obj>
);

// ── fuerte con empalizada (vista lateral), ancho w
export const Fuerte: React.FC<Pos & { w?: number; piedra?: boolean }> = ({ w = 1400, piedra, ...p }) => {
  const col = piedra ? ["#c9b8a0", "#a8967c", "#8a7a64"] : ["#a8622c", "#8a4a20", "#6b3a1f"];
  return (
    <Obj {...p} w={w} h={420}>
      <rect x={-w / 2} y={-80} width={w} height={300} fill={col[1]} />
      {piedra
        ? Array.from({ length: 5 }, (_, f) => Array.from({ length: Math.ceil(w / 90) }, (_, i) => <rect key={f + "-" + i} x={-w / 2 + i * 90 + (f % 2) * 45} y={-74 + f * 58} width={84} height={52} rx={6} fill={col[(i + f) % 2 === 0 ? 0 : 2]} />))
        : Array.from({ length: Math.ceil(w / 38) }, (_, i) => <path key={i} d={`M ${-w / 2 + i * 38} 220 L ${-w / 2 + i * 38} -96 L ${-w / 2 + i * 38 + 17} -126 L ${-w / 2 + i * 38 + 34} -96 L ${-w / 2 + i * 38 + 34} 220 Z`} fill={i % 2 ? col[0] : col[2]} />)}
      {[-w / 2 + 60, w / 2 - 200].map((xx) => (
        <g key={xx}>
          <rect x={xx} y={-210} width={140} height={430} fill={col[2]} />
          <rect x={xx - 14} y={-230} width={168} height={40} fill={col[1]} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={xx - 14 + k * 46} y={-262} width={28} height={36} fill={col[1]} />)}
          <rect x={xx + 50} y={-150} width={40} height={60} rx={18} fill="#2a1530" />
        </g>
      ))}
      <path d={`M -90 220 L -90 30 Q 0 -60 90 30 L 90 220 Z`} fill="#3a2010" />
      <rect x={-w / 2} y={200} width={w} height={20} fill="rgba(20,8,30,.3)" />
    </Obj>
  );
};

// ── lápida con líneas de texto
export const Lapida: React.FC<Pos & { lineas?: string[]; grande?: string; color?: string }> = ({ lineas = [], grande, color = "#d8d0c4", ...p }) => (
  <Obj {...p} w={380} h={500}>
    <path d="M -170 240 L -170 -120 Q -170 -240 0 -240 Q 170 -240 170 -120 L 170 240 Z" fill="#9a9284" />
    <path d="M -180 230 L -180 -130 Q -180 -250 -10 -250 Q 160 -250 160 -130 L 160 230 Z" fill={color} />
    <path d="M -140 -150 Q -120 -210 -40 -220" stroke="#fff" strokeOpacity={0.5} strokeWidth={10} fill="none" strokeLinecap="round" />
    {lineas.map((l, i) => <text key={i} x={-10} y={-120 + i * 58} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={44} fill="#6a6254" letterSpacing={4}>{l}</text>)}
    {grande && <text x={-10} y={130} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={130} fill={C.rojo}>{grande}</text>}
    <rect x={-220} y={226} width={420} height={30} rx={10} fill="#5a7a3a" />
  </Obj>
);

// ── papiro con renglones que se tachan (lista de descuentos)
export const Papiro: React.FC<{ t: number; x: number; y: number; w?: number; t0: number; items: { txt: string; t0: number; monto?: string }[]; tacha?: boolean; titulo?: string }> = ({ t, x, y, w = 760, t0, items, tacha = true, titulo }) => {
  if (t < t0) return null;
  const e = ent(t, t0);
  const H = 160 + items.length * 84;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - H / 2, width: w, height: H, transform: `scale(${e}) rotate(${(1 - e) * 10 - 1.5}deg)`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #f2dfae, #e2c588)", borderRadius: 16, boxShadow: "14px 16px 0 rgba(20,8,40,.35)", border: "6px solid #b98a4a" }} />
      {titulo && <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily, fontWeight: 700, fontSize: 46, color: "#7a3d14", letterSpacing: 3 }}>{titulo}</div>}
      {items.map((it, i) => {
        if (t < it.t0) return null;
        const a = ent(t, it.t0);
        const tc = prog(t, it.t0 + 0.25, it.t0 + 0.5);
        return (
          <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 110 + i * 84, height: 70, opacity: a, transform: `translateX(${(1 - a) * -60}px)`, fontFamily, fontWeight: 700, fontSize: 44, color: "#4a2a10", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{it.txt}</span>
            {it.monto && <span style={{ color: C.rojo }}>{it.monto}</span>}
            {tacha && <div style={{ position: "absolute", left: -10, top: 32, height: 9, borderRadius: 5, width: `${tc * 104}%`, background: C.rojo }} />}
          </div>
        );
      })}
    </div>
  );
};

// ── armas y equipo
export const Escudo: React.FC<Pos & { mimbre?: boolean; color?: string }> = ({ mimbre, color = "#c81d2e", ...p }) => (
  <Obj {...p} w={260} h={380}>
    <rect x={-104} y={-166} width={220} height={350} rx={34} fill="rgba(20,8,40,.3)" />
    <rect x={-116} y={-178} width={220} height={350} rx={34} fill={mimbre ? "#c9a46a" : color} stroke={mimbre ? "#8a6a3a" : "#ffcf5a"} strokeWidth={12} />
    {mimbre
      ? Array.from({ length: 11 }, (_, i) => <line key={i} x1={-106} y1={-150 + i * 30} x2={94} y2={-150 + i * 30} stroke="#8a6a3a" strokeWidth={8} strokeDasharray="22 10" strokeDashoffset={i % 2 ? 16 : 0} />)
      : <g><circle cx={-6} cy={-4} r={40} fill="#ffcf5a" /><circle cx={-6} cy={-4} r={22} fill="#e9a92a" />{[-1, 1].map((s) => <path key={s} d={`M ${-6 + s * 44} -4 Q ${-6 + s * 80} -70 ${-6 + s * 70} -140 M ${-6 + s * 44} -4 Q ${-6 + s * 80} 60 ${-6 + s * 70} 130`} stroke="#ffcf5a" strokeWidth={10} fill="none" strokeLinecap="round" />)}</g>}
    <Brillo d="M -90 -120 Q -86 -160 -40 -164" />
  </Obj>
);
export const Gladius: React.FC<Pos & { madera?: boolean }> = ({ madera, ...p }) => (
  <Obj {...p} w={120} h={460}>
    <path d="M -24 -60 L -24 -170 L 0 -220 L 24 -170 L 24 -60 Z" fill={madera ? "#b5793a" : "#d8dde6"} stroke={madera ? "#7a4a1a" : "#8a93a3"} strokeWidth={5} />
    {!madera && <line x1={0} y1={-200} x2={0} y2={-66} stroke="#8a93a3" strokeWidth={5} />}
    <rect x={-50} y={-66} width={100} height={22} rx={10} fill={madera ? "#7a4a1a" : "#e9a92a"} />
    <rect x={-14} y={-44} width={28} height={120} rx={10} fill="#6b3a1f" />
    <circle cx={0} cy={92} r={26} fill={madera ? "#7a4a1a" : "#e9a92a"} />
  </Obj>
);
export const Pilum: React.FC<Pos & { dobla?: number; largo?: number }> = ({ dobla = 0, largo = 720, ...p }) => {
  const m = largo * 0.42;
  return (
    <Obj {...p} w={largo + 40} h={120}>
      <rect x={-largo / 2} y={-9} width={largo - m} height={18} rx={9} fill="#8a5a2a" />
      <g transform={`translate(${-largo / 2 + largo - m} 0) rotate(${dobla * 38})`}>
        <rect x={-6} y={-12} width={30} height={24} rx={6} fill="#5d6577" />
        <rect x={20} y={-4} width={m - 50} height={8} fill="#8a93a3" />
        <path d={`M ${m - 34} -14 L ${m + 10} 0 L ${m - 34} 14 Z`} fill="#c8ccd4" />
      </g>
    </Obj>
  );
};
export const Poste: React.FC<Pos> = (p) => (
  <Obj {...p} w={220} h={560}>
    <rect x={-50} y={-240} width={100} height={500} rx={20} fill="#8a5a2a" />
    <rect x={-50} y={-240} width={30} height={500} fill="#a8783a" />
    {[-150, -40, 70].map((yy, i) => <circle key={i} cx={0} cy={yy} r={30} fill="none" stroke={C.rojo} strokeWidth={9} />)}
    <rect x={-90} y={250} width={180} height={26} rx={10} fill="#5a3418" />
  </Obj>
);
export const Casco: React.FC<Pos> = (p) => (
  <Obj {...p} w={260} h={220}>
    <path d="M -110 30 Q -116 -110 0 -110 Q 116 -110 110 30 L 124 40 L -124 40 Z" fill="#e9a92a" />
    <path d="M -110 30 L -96 100 L -66 90 L -72 36 Z M 110 30 L 96 100 L 66 90 L 72 36 Z" fill="#b87a22" />
    <path d="M -124 40 L 124 40 L 132 58 L -132 58 Z" fill="#8a5414" />
    <rect x={-10} y={-136} width={20} height={30} rx={8} fill="#8a5414" />
    <Brillo d="M -70 -60 Q -30 -96 20 -88" />
  </Obj>
);
export const Armadura: React.FC<Pos> = (p) => (
  <Obj {...p} w={300} h={300}>
    <path d="M -120 -120 Q 0 -150 120 -120 L 130 130 Q 0 150 -130 130 Z" fill="#b9c2cf" />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M -126 ${-90 + i * 40} Q 0 ${-74 + i * 40} 126 ${-90 + i * 40}`} stroke="#7d8796" strokeWidth={8} fill="none" />)}
    <Brillo d="M -90 -100 Q -40 -120 10 -116" />
  </Obj>
);

// ── la carga de la mula de Mario
type Carga = "olla" | "sierra" | "cesta" | "pico" | "hoz" | "saco" | "cadena" | "estaca" | "grano" | "pala";
const CARGA: Record<Carga, React.ReactNode> = {
  olla: <g><path d="M -70 -20 L 70 -20 Q 70 70 0 74 Q -70 70 -70 -20 Z" fill="#5d6577" /><rect x={-80} y={-34} width={160} height={20} rx={8} fill="#7d8796" /><path d="M -50 -34 Q 0 -100 50 -34" stroke="#3d4452" strokeWidth={8} fill="none" /></g>,
  sierra: <g transform="rotate(-10)"><rect x={-90} y={-30} width={180} height={50} fill="#c8ccd4" />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-90 + i * 15} 20 l 7 14 l 8 -14`} fill="#c8ccd4" />)}<path d="M -90 -60 L 90 -60 L 90 -30 L -90 -30" stroke="#8a5a2a" strokeWidth={12} fill="none" /></g>,
  cesta: <g><path d="M -80 -40 L 80 -40 L 60 60 L -60 60 Z" fill="#c9a46a" />{[-20, 0, 20, 40].map((yy) => <line key={yy} x1={-76} y1={yy - 20} x2={76} y2={yy - 20} stroke="#8a6a3a" strokeWidth={7} />)}<path d="M -60 -40 Q 0 -110 60 -40" stroke="#8a6a3a" strokeWidth={10} fill="none" /></g>,
  pico: <g><rect x={-8} y={-30} width={16} height={130} rx={6} fill="#8a5a2a" /><path d="M -90 -30 Q 0 -70 90 -30 L 80 -20 Q 0 -50 -80 -20 Z" fill="#7d8796" /></g>,
  hoz: <g><rect x={-8} y={10} width={16} height={80} rx={6} fill="#8a5a2a" /><path d="M 0 10 Q -90 -10 -60 -90 Q -40 -30 0 -10 Z" fill="#c8ccd4" /></g>,
  saco: <g><path d="M -60 -40 Q -90 70 0 76 Q 90 70 60 -40 Z" fill="#a8783a" /><path d="M -40 -40 L -20 -70 L 20 -70 L 40 -40 Z" fill="#8a5a2a" /><rect x={-34} y={-48} width={68} height={12} rx={5} fill="#5a3418" /></g>,
  cadena: <g>{[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={-80 + k * 40} cy={0} rx={k % 2 ? 12 : 26} ry={k % 2 ? 26 : 16} fill="none" stroke="#8a93a3" strokeWidth={10} />)}</g>,
  estaca: <g>{[-1, 1].map((s) => <path key={s} d={`M ${s * 24 - 12} -90 L ${s * 24 + 12} -90 L ${s * 24 + 12} 60 L ${s * 24} 90 L ${s * 24 - 12} 60 Z`} fill="#a8783a" stroke="#6b3a1f" strokeWidth={5} />)}</g>,
  grano: <g><path d="M -64 -50 Q -86 70 0 74 Q 86 70 64 -50 Z" fill="#e8d8a8" /><text x={0} y={30} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={40} fill="#8a6a3a">GRAIN</text></g>,
  pala: <g><rect x={-8} y={-100} width={16} height={130} rx={6} fill="#8a5a2a" /><path d="M -40 30 L 40 30 L 34 90 Q 0 110 -34 90 Z" fill="#7d8796" /></g>,
};
export const Item: React.FC<Pos & { k: Carga }> = ({ k, ...p }) => <Obj {...p} w={220} h={220}>{CARGA[k]}</Obj>;

// ── mula de costado
export const Mula: React.FC<Pos & { t: number; camina?: number; carga?: boolean }> = ({ camina = 0, carga, ...p }) => {
  const f = Math.sin((p.t ?? 0) * camina * Math.PI * 2);
  return (
    <Obj {...p} w={520} h={420}>
      {[-150, -110, 110, 150].map((xx, i) => <rect key={i} x={xx - 14} y={40} width={28} height={150} rx={12} fill="#6b5546" transform={`rotate(${(i % 2 ? 1 : -1) * f * 16} ${xx} 40)`} />)}
      <ellipse cx={0} cy={30} rx={190} ry={96} fill="#8a6e5c" />
      <path d="M 150 -20 Q 210 -120 250 -110 Q 290 -100 270 -40 Q 240 10 180 30 Z" fill="#8a6e5c" />
      <path d="M 220 -110 L 214 -190 L 240 -120 Z M 250 -108 L 262 -186 L 266 -112 Z" fill="#6b5546" />
      <ellipse cx={268} cy={-50} rx={26} ry={20} fill="#d6c0b0" />
      <circle cx={238} cy={-82} r={9} fill="#1a1010" />
      <path d="M -186 0 Q -230 40 -210 110" stroke="#6b5546" strokeWidth={12} fill="none" strokeLinecap="round" />
      {carga && <g><rect x={-120} y={-110} width={220} height={90} rx={20} fill="#a8783a" /><rect x={-90} y={-160} width={80} height={60} rx={14} fill="#c9a46a" /><rect x={10} y={-150} width={70} height={50} rx={12} fill="#5d6577" /></g>}
    </Obj>
  );
};

// ── construcciones
export const Muro: React.FC<{ x: number; y: number; w: number; h?: number; t: number; t0?: number; d?: number }> = ({ x, y, w, h = 180, t, t0 = -9, d = 1.2 }) => {
  const u = t0 < -1 ? 1 : prog(t, t0, t0 + d);
  return (
    <svg style={{ position: "absolute", left: x, top: y - h, overflow: "visible" }} width={w} height={h}>
      {Array.from({ length: 4 }, (_, f) => Array.from({ length: Math.ceil(w / 70) + 1 }, (_, i) => {
        const xx = i * 70 + (f % 2) * 35 - 35;
        if (xx / w > u) return null;
        return <rect key={f + "-" + i} x={xx} y={h - (f + 1) * (h / 4)} width={66} height={h / 4 - 4} rx={5} fill={["#c9b8a0", "#b5a48a", "#d8c8ae"][(i + f) % 3]} />;
      }))}
    </svg>
  );
};
export const Arco: React.FC<Pos & { n?: number; alto?: number }> = ({ n = 5, alto = 300, ...p }) => (
  <Obj {...p} w={n * 180} h={alto + 60}>
    <rect x={-n * 90} y={-alto / 2 - 30} width={n * 180} height={46} fill="#b5a48a" />
    {Array.from({ length: n }, (_, i) => <path key={i} d={`M ${-n * 90 + i * 180} ${alto / 2 + 30} L ${-n * 90 + i * 180} ${-alto / 2 + 16} L ${-n * 90 + i * 180 + 180} ${-alto / 2 + 16} L ${-n * 90 + i * 180 + 180} ${alto / 2 + 30} L ${-n * 90 + i * 180 + 150} ${alto / 2 + 30} L ${-n * 90 + i * 180 + 150} ${-alto / 2 + 110} Q ${-n * 90 + i * 180 + 90} ${-alto / 2 + 40} ${-n * 90 + i * 180 + 30} ${-alto / 2 + 110} L ${-n * 90 + i * 180 + 30} ${alto / 2 + 30} Z`} fill={i % 2 ? "#d8c8ae" : "#c9b8a0"} />)}
    <rect x={-n * 90} y={-alto / 2 - 40} width={n * 180} height={14} rx={6} fill="#4fb0d8" />
  </Obj>
);

// ── tablilla de Vindolanda (madera con tinta)
export const Tablilla: React.FC<Pos & { texto?: string[] }> = ({ texto = [], ...p }) => (
  <Obj {...p} w={640} h={300}>
    <rect x={-300} y={-130} width={620} height={280} rx={14} fill="rgba(20,8,40,.3)" />
    <rect x={-316} y={-146} width={620} height={280} rx={14} fill="#c9a46a" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M -300 ${-120 + i * 40} q 150 ${i % 2 ? 8 : -8} 300 0 t 300 0`} stroke="#b08a50" strokeWidth={3} fill="none" />)}
    <line x1={-6} y1={-146} x2={-6} y2={134} stroke="#8a6a3a" strokeWidth={6} />
    {texto.map((l, i) => <text key={i} x={-280} y={-80 + i * 60} fontFamily="'Brush Script MT', cursive" fontStyle="italic" fontSize={46} fill="#2a1a10">{l}</text>)}
  </Obj>
);
export const Ropa: React.FC<Pos & { k: "medias" | "sandalia" | "calzon" }> = ({ k, ...p }) => (
  <Obj {...p} w={220} h={220}>
    {k === "medias" && <path d="M -30 -90 L 30 -90 L 30 30 Q 90 40 80 80 Q 70 100 -10 96 Q -40 90 -30 40 Z" fill="#c9a0e8" stroke="#7a4a9a" strokeWidth={6} />}
    {k === "sandalia" && <g><path d="M -40 -90 Q 50 -90 44 0 Q 40 90 0 96 Q -50 90 -46 0 Q -50 -60 -40 -90 Z" fill="#a8622c" />{[-50, -10, 30].map((yy) => <rect key={yy} x={-50} y={yy} width={100} height={14} rx={6} fill="#6b3a1f" />)}</g>}
    {k === "calzon" && <path d="M -90 -60 L 90 -60 L 80 10 L 30 70 L 10 20 L -10 20 L -30 70 L -80 10 Z" fill="#f2ead8" stroke="#a89a80" strokeWidth={6} />}
  </Obj>
);

// ── letrina romana y la esponja en el palo
export const Letrina: React.FC<Pos & { n?: number }> = ({ n = 6, ...p }) => (
  <Obj {...p} w={n * 170 + 60} h={300}>
    <rect x={-n * 85 - 30} y={-40} width={n * 170 + 60} height={60} rx={10} fill="#d8c8ae" />
    <rect x={-n * 85 - 30} y={20} width={n * 170 + 60} height={110} fill="#b5a48a" />
    {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={-n * 85 + 85 + i * 170} cy={-14} rx={36} ry={14} fill="#3a2a1a" />)}
    {Array.from({ length: n }, (_, i) => <rect key={i} x={-n * 85 + 70 + i * 170} y={20} width={30} height={110} fill="#2a1a10" opacity={0.6} />)}
    <rect x={-n * 85 - 30} y={130} width={n * 170 + 60} height={30} fill="#4fb0d8" />
  </Obj>
);
export const Esponja: React.FC<Pos> = (p) => (
  <Obj {...p} w={140} h={520}>
    <rect x={-8} y={-180} width={16} height={420} rx={6} fill="#8a5a2a" />
    <ellipse cx={0} cy={-200} rx={56} ry={46} fill="#e8c86a" />
    {[[-20, -214], [14, -190], [26, -222], [-16, -184]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={8} fill="#c9a43a" />)}
  </Obj>
);

// ── médico: pinza, bisturí, punta de flecha
export const Instrumento: React.FC<Pos & { k: "pinza" | "bisturi" | "flecha" }> = ({ k, ...p }) => (
  <Obj {...p} w={120} h={420}>
    {k === "pinza" && <g>{[-1, 1].map((s) => <path key={s} d={`M 0 180 Q ${s * 40} 0 ${s * 14} -180`} stroke="#c8ccd4" strokeWidth={16} fill="none" strokeLinecap="round" />)}<circle cx={0} cy={170} r={14} fill="#8a93a3" /></g>}
    {k === "bisturi" && <g><rect x={-10} y={-40} width={20} height={220} rx={8} fill="#e9a92a" /><path d="M -12 -40 L 12 -40 L 12 -120 Q 0 -190 -14 -130 Z" fill="#d8dde6" stroke="#8a93a3" strokeWidth={4} /></g>}
    {k === "flecha" && <g><rect x={-6} y={-60} width={12} height={240} fill="#8a5a2a" /><path d="M 0 -170 L 34 -60 L -34 -60 Z" fill="#7d8796" /><path d="M -6 160 L -30 200 L -6 190 Z M 6 160 L 30 200 L 6 190 Z" fill="#e8e0d0" /></g>}
  </Obj>
);

// ── comida del soldado
export const Comida: React.FC<Pos & { k: "molino" | "porridge" | "queso" | "tocino" | "lentejas" | "jarra" | "trigo" | "cebada" }> = ({ k, ...p }) => (
  <Obj {...p} w={240} h={240}>
    {k === "molino" && <g><ellipse cx={0} cy={50} rx={110} ry={40} fill="#8a8274" /><rect x={-110} y={0} width={220} height={50} fill="#9a9284" /><ellipse cx={0} cy={0} rx={110} ry={40} fill="#b5ad9e" /><ellipse cx={0} cy={0} rx={30} ry={12} fill="#6a6254" /><rect x={60} y={-70} width={20} height={70} rx={8} fill="#8a5a2a" /></g>}
    {k === "porridge" && <g><path d="M -100 -10 L 100 -10 Q 96 90 0 96 Q -96 90 -100 -10 Z" fill="#a8622c" /><ellipse cx={0} cy={-10} rx={100} ry={26} fill="#f2e4c0" />{[-30, 10, 44].map((xx, i) => <path key={i} d={`M ${xx} -40 q -14 -30 0 -60 t 0 -50`} stroke="#fff" strokeOpacity={0.6} strokeWidth={8} fill="none" strokeLinecap="round" />)}</g>}
    {k === "queso" && <g><path d="M -100 40 L 100 40 L 100 -20 L -60 -70 Z" fill="#f2c84a" /><path d="M -100 40 L 100 40 L 100 70 L -100 70 Z" fill="#d9a82a" />{[[-20, -10], [40, 10], [60, -26]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={11} fill="#d9a82a" />)}</g>}
    {k === "tocino" && <g>{[0, 1, 2].map((i) => <path key={i} d={`M -100 ${-50 + i * 40} Q -40 ${-70 + i * 40} 0 ${-50 + i * 40} T 100 ${-50 + i * 40}`} stroke={i % 2 ? "#f2c0a8" : "#c8463a"} strokeWidth={30} fill="none" strokeLinecap="round" />)}</g>}
    {k === "lentejas" && <g><path d="M -90 0 L 90 0 Q 86 80 0 84 Q -86 80 -90 0 Z" fill="#7d8796" /><ellipse cx={0} cy={0} rx={90} ry={22} fill="#a8783a" />{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-70 + (i % 7) * 23} cy={-6 + Math.floor(i / 7) * 10} rx={9} ry={6} fill="#c98a3a" />)}</g>}
    {k === "jarra" && <g><path d="M -50 -90 L 50 -90 L 60 60 Q 0 100 -60 60 Z" fill="#c9773a" /><path d="M 56 -40 Q 110 -30 90 30 L 60 30" stroke="#a8622c" strokeWidth={16} fill="none" /><ellipse cx={0} cy={-90} rx={50} ry={14} fill="#8a3a4a" /></g>}
    {(k === "trigo" || k === "cebada") && <g>{[-40, 0, 40].map((xx, i) => <g key={i} transform={`rotate(${(i - 1) * 14} ${xx} 100)`}><line x1={xx} y1={100} x2={xx} y2={-60} stroke={k === "trigo" ? "#d9a82a" : "#a8a060"} strokeWidth={8} />{Array.from({ length: 6 }, (_, j) => <ellipse key={j} cx={xx + (j % 2 ? 12 : -12)} cy={-60 + j * 18} rx={10} ry={16} fill={k === "trigo" ? "#f2c84a" : "#c0b878"} />)}</g>)}</g>}
  </Obj>
);

// ── batalla y muerte
export const Soldadito: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; enemigo?: boolean; cae?: number; avanza?: number; color?: string }> = ({ x, y, s = 1, t, seed = 1, enemigo, cae, avanza = 0, color }) => {
  const r = rnd(seed);
  const ph = r() * 6;
  const c = cae !== undefined && t > cae ? Math.min(1, (t - cae) / 0.35) : 0;
  const bob = Math.sin(t * 6 + ph) * 3 * (avanza ? 1 : 0.3);
  return (
    <svg style={{ position: "absolute", left: x - 60 * s, top: y - 200 * s, overflow: "visible" }} width={120 * s} height={200 * s} viewBox="-60 -200 120 200">
      <g transform={`translate(0 ${bob + c * 30}) rotate(${c * (enemigo ? 80 : -80)} 0 -10)`} opacity={1 - c * 0.4}>
        {enemigo ? (
          <g fill={color ?? "#2a1530"}>
            <rect x={-26} y={-120} width={52} height={110} rx={18} />
            <circle cx={0} cy={-146} r={30} />
            <path d="M -30 -160 Q -40 -200 -10 -184 Q 0 -210 14 -186 Q 40 -200 30 -160 Z" />
            <rect x={-6} y={-200} width={12} height={110} rx={6} transform="rotate(28 0 -120)" />
            <rect x={-12} y={-12} width={10} height={14} /><rect x={4} y={-12} width={10} height={14} />
          </g>
        ) : (
          <g>
            <rect x={-20} y={-110} width={40} height={100} rx={14} fill="#c81d2e" />
            <rect x={-22} y={-100} width={44} height={40} fill="#b9c2cf" />
            <circle cx={0} cy={-136} r={26} fill="#f2b48a" />
            <path d="M -28 -136 Q -30 -170 0 -170 Q 30 -170 28 -136 Z" fill="#e9a92a" />
            <rect x={-6} y={-12} width={8} height={14} fill="#6b3a1f" /><rect x={4} y={-12} width={8} height={14} fill="#6b3a1f" />
            <rect x={8} y={-120} width={44} height={110} rx={12} fill={color ?? "#c81d2e"} stroke="#ffcf5a" strokeWidth={5} />
            <circle cx={30} cy={-65} r={9} fill="#ffcf5a" />
          </g>
        )}
      </g>
    </svg>
  );
};
export const Craneo: React.FC<Pos> = (p) => (
  <Obj {...p} w={200} h={220}>
    <path d="M -80 -10 Q -84 -100 0 -100 Q 84 -100 80 -10 Q 80 30 50 40 L 50 80 L -50 80 L -50 40 Q -80 30 -80 -10 Z" fill="#f2ead8" />
    <ellipse cx={-34} cy={-10} rx={24} ry={28} fill="#2a1530" />
    <ellipse cx={34} cy={-10} rx={24} ry={28} fill="#2a1530" />
    <path d="M 0 20 L -10 40 L 10 40 Z" fill="#2a1530" />
    {[-30, -10, 10, 30].map((xx) => <line key={xx} x1={xx} y1={60} x2={xx} y2={80} stroke="#c9bca0" strokeWidth={5} />)}
  </Obj>
);
export const Arbol: React.FC<Pos & { color?: string; alto?: number }> = ({ color = "#1d2a1a", alto = 700, ...p }) => (
  <Obj {...p} w={420} h={alto}>
    <rect x={-30} y={-alto / 2 + 160} width={60} height={alto - 160} fill="#2a1a10" />
    <path d={`M 0 ${-alto / 2} L 190 ${-alto / 2 + 300} L 90 ${-alto / 2 + 280} L 210 ${-alto / 2 + 520} L -210 ${-alto / 2 + 520} L -90 ${-alto / 2 + 280} L -190 ${-alto / 2 + 300} Z`} fill={color} />
  </Obj>
);
export const Urna: React.FC<Pos & { t: number; tSaca?: number }> = ({ tSaca = 1e9, ...p }) => {
  const u = prog(p.t ?? 0, tSaca, tSaca + 0.6);
  return (
    <Obj {...p} w={300} h={420}>
      <path d="M -100 -60 Q -140 120 -60 170 L 60 170 Q 140 120 100 -60 Z" fill="#c9773a" />
      <rect x={-110} y={-80} width={220} height={30} rx={12} fill="#a8622c" />
      {u > 0 && <g transform={`translate(0 ${-80 - u * 160}) rotate(${u * 360})`}><rect x={-30} y={-20} width={60} height={40} rx={8} fill={C.rojo} stroke="#fff" strokeWidth={6} /><text x={0} y={12} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={30} fill="#fff">X</text></g>}
      <path d="M -70 -20 Q -96 60 -60 120" stroke="#ffd09a" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.5} />
    </Obj>
  );
};

// ── retiro y cierre
export const Bolsa: React.FC<Pos & { txt?: string }> = ({ txt, ...p }) => (
  <Obj {...p} w={300} h={320}>
    <path d="M -110 -20 Q -150 140 0 146 Q 150 140 110 -20 Q 60 -60 0 -60 Q -60 -60 -110 -20 Z" fill="#a8783a" />
    <path d="M -50 -60 L -70 -110 Q 0 -86 70 -110 L 50 -60 Z" fill="#8a5a2a" />
    <rect x={-60} y={-70} width={120} height={18} rx={8} fill="#5a3418" />
    {txt && <text x={0} y={70} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={56} fill="#fff6c8">{txt}</text>}
    <Brillo d="M -90 10 Q -96 60 -70 100" />
  </Obj>
);
export const Diploma: React.FC<Pos> = (p) => (
  <Obj {...p} w={460} h={340}>
    <rect x={-210} y={-150} width={440} height={320} rx={18} fill="rgba(20,8,40,.3)" />
    <rect x={-224} y={-164} width={440} height={320} rx={18} fill="#d9a85a" stroke="#a8763a" strokeWidth={10} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-180} y={-110 + i * 46} width={i === 0 ? 260 : 340 - (i % 2) * 70} height={14} rx={7} fill="#a8763a" />)}
    {[[-200, -140], [196, -140], [-200, 136], [196, 136]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={10} fill="#8a5a2a" />)}
  </Obj>
);
export const Ciudad: React.FC<Pos & { nombre?: string; seed?: number; luz?: boolean }> = ({ nombre, seed = 1, luz, ...p }) => {
  const r = rnd(seed);
  const ed = Array.from({ length: 9 }, (_, i) => ({ x: -260 + i * 60, w: 50 + r() * 30, h: 120 + r() * 220, c: ["#7a5aa8", "#5b3b8a", "#9a6ab8"][i % 3] }));
  return (
    <Obj {...p} w={600} h={460}>
      {ed.map((e, i) => (
        <g key={i}>
          <rect x={e.x} y={200 - e.h} width={e.w} height={e.h} fill={e.c} />
          {Array.from({ length: Math.floor(e.h / 50) }, (_, k) => <rect key={k} x={e.x + 12} y={220 - e.h + k * 50} width={e.w - 24} height={16} rx={4} fill={luz ? "#ffd27a" : "#3b2a6a"} opacity={luz && r() < 0.7 ? 1 : 0.6} />)}
        </g>
      ))}
      <rect x={-300} y={196} width={600} height={30} fill="#3b2a6a" />
      {nombre && <text x={0} y={-180} textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize={70} fill="#fff" stroke={TINTA} strokeWidth={10} paintOrder="stroke">{nombre}</text>}
    </Obj>
  );
};
export const Campana: React.FC<Pos & { t: number; t0b?: number }> = ({ t0b = 1e9, ...p }) => {
  const sw = (p.t ?? 0) > t0b ? Math.sin(((p.t ?? 0) - t0b) * 18) * 22 * Math.exp(-((p.t ?? 0) - t0b) * 2.5) : 0;
  return (
    <Obj {...p} w={240} h={260}>
      <g transform={`rotate(${sw} 0 -110)`}>
        <path d="M -90 70 Q -90 -100 0 -100 Q 90 -100 90 70 L 110 90 L -110 90 Z" fill="#ffcf5a" />
        <circle cx={0} cy={104} r={22} fill="#e9a92a" />
        <rect x={-14} y={-126} width={28} height={30} rx={10} fill="#e9a92a" />
        <Brillo d="M -56 30 Q -60 -60 -10 -76" />
      </g>
    </Obj>
  );
};
export const Barco: React.FC<Pos & { t: number }> = (p) => (
  <Obj {...p} w={700} h={520}>
    <g transform={`rotate(${Math.sin((p.t ?? 0) * 1.4) * 3})`}>
      <path d="M -320 60 L 320 60 L 250 170 L -250 170 Z" fill="#8a4a20" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-220 + i * 55} y1={150} x2={-260 + i * 55} y2={230} stroke="#6b3a1f" strokeWidth={8} />)}
      <rect x={-12} y={-230} width={24} height={300} fill="#6b3a1f" />
      <path d="M -170 -200 Q 0 -230 170 -200 L 150 30 Q 0 10 -150 30 Z" fill="#f2ead8" />
      <path d="M -60 -150 L 60 -150 L 0 -60 Z" fill={C.rojo} />
      <path d="M 320 60 Q 360 20 350 -20" stroke="#8a4a20" strokeWidth={18} fill="none" strokeLinecap="round" />
    </g>
  </Obj>
);

// ── clima
export const Lluvia: React.FC<{ t: number; n?: number; seed?: number; angulo?: number; op?: number }> = ({ t, n = 120, seed = 3, angulo = 18, op = 0.55 }) => {
  const r = React.useMemo(() => { const q = rnd(seed); return Array.from({ length: n }, () => [q() * 2200 - 140, q(), 0.7 + q() * 0.6]); }, [n, seed]);
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {r.map(([x0, ph, v], i) => {
        const k = (t * 1.8 * v + ph) % 1;
        const y = k * 1240 - 120, x = x0 - Math.tan((angulo * Math.PI) / 180) * y;
        return <line key={i} x1={x} y1={y} x2={x + Math.tan((angulo * Math.PI) / 180) * 50} y2={y - 50} stroke="#cfe3ff" strokeWidth={4} strokeLinecap="round" opacity={op} />;
      })}
    </svg>
  );
};
export const Calor: React.FC<{ t: number; y?: number; op?: number }> = ({ t, y = 600, op = 0.35 }) => (
  <svg style={{ position: "absolute", left: 0, top: y, pointerEvents: "none" }} width={1920} height={400}>
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={Array.from({ length: 25 }, (_, k) => `${k ? "L" : "M"} ${k * 80} ${i * 56 + Math.sin(k * 0.9 + t * 4 + i) * 12}`).join(" ")} stroke="#fff3c4" strokeWidth={5} fill="none" opacity={op * (1 - i / 8)} />)}
  </svg>
);
// ── franja de cuenta (las 7 trampas) para los separadores
export const Trampas: React.FC<{ t: number; t0: number; n: number; x?: number; y?: number; on?: string }> = ({ t, t0, n, x = 960, y = 800, on = C.rojo }) => (
  <>
    {Array.from({ length: 7 }, (_, i) => {
      const act = i === n - 1;
      return <div key={i} style={{ position: "absolute", left: x - 3 * 76 + i * 76 - 26, top: y, width: 52, height: 52, borderRadius: 26, background: i < n ? on : "rgba(255,255,255,.18)", border: "6px solid #fff", transform: `scale(${ent(t, t0, i * 0.05) * (act ? 1 + 0.18 * Math.sin(t * 8) : 1)})`, boxShadow: act ? `0 0 30px ${on}` : undefined }} />;
    })}
  </>
);
