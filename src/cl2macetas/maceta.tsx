// cl2macetas · LA MACETA EN MEDIO CORTE (el dibujo de taller): la mitad izquierda cortada muestra la pared por dentro —la
// pasta de cemento blanco, la marmolina, los pedazos de vidrio, los moldes de plástico, el corcho del fondo—, y la mitad
// derecha es la cara de afuera, que gira despacio: ahí está la piel de cemento que tapa el vidrio, la lija que la saca, el
// brillo del sellador y el gel que hincha. Todo f(t) y f(estado).
import React from "react";
import { C, cl, hash, lerp } from "./lib";

export type MacSt = {
  vidrio: number;   // 0..1 cuántos pedazos de vidrio hay en la pared
  pasta: number;    // 0..1 la pasta de cemento llena la pared (0 = sólo vidrio suelto entre los moldes)
  molde: number;    // 0..1 se ven los dos moldes de plástico
  piel: number;     // 0..1 la piel de cemento tapa el vidrio de afuera
  revela: number;   // 0..1 la lija va sacando la piel (de a un pedazo)
  sello: number;    // 0..1 brillo y tono oscuro del sellador
  corcho: number;   // 0..1 el corcho del fondo (1 = puesto, se va con `hueco`)
  hueco: number;    // 0..1 el agujero de drenaje queda abierto
  gel?: number;     // 0..1 el gel álcali-sílice crece alrededor de los vidrios
  raja?: number;    // 0..1 la rajadura que sale del gel hacia afuera
  fresco?: number;  // 0..1 recién hecha: más gris y húmeda
  planta?: number;  // 0..1 suculenta arriba
};
export const MAC0: MacSt = { vidrio: 1, pasta: 1, molde: 0, piel: 0, revela: 1, sello: 0, corcho: 0, hueco: 1 };

const GCOL = [[C.verde, C.verde2], [C.ambar, C.ambar2], [C.celeste, C.celeste2], [C.hielo, "#9fb8bb"]];
// pedazos de vidrio del corte: (u 0..1 a lo ancho de la pared, v 0..1 a lo alto), deterministas
const SEC = Array.from({ length: 34 }, (_, i) => {
  const r = 0.16 + 0.22 * hash(i, 3), n = 5 + Math.floor(hash(i, 6) * 3), col = hash(i, 4) < 0.42 ? 0 : hash(i, 4) < 0.74 ? 1 : hash(i, 4) < 0.88 ? 2 : 3;
  return { u: 0.2 + 0.6 * hash(i, 1), v: 0.04 + 0.92 * hash(i, 2), r, n, col, k: hash(i, 5), rot: hash(i, 7) * 6.28, j: Array.from({ length: n }, (_, q) => 0.65 + 0.45 * hash(i * 17 + q, 8)) };
});
// pedazos de la cara de afuera, sobre el cilindro: ángulo, altura 0..1, tamaño
const EXT = Array.from({ length: 120 }, (_, i) => ({ th: hash(i, 21) * Math.PI * 2, v: 0.05 + 0.9 * hash(i, 22), r: 9 + 15 * hash(i, 23) ** 1.5, col: hash(i, 24) < 0.42 ? 0 : hash(i, 24) < 0.74 ? 1 : hash(i, 24) < 0.88 ? 2 : 3, k: hash(i, 25), sh: Array.from({ length: 6 }, (_, q) => 0.6 + 0.5 * hash(i * 13 + q, 26)) }));
const shard = (x: number, y: number, r: number, j: number[], rot: number, sx = 1) => j.map((f, q) => { const a = rot + (q / j.length) * Math.PI * 2; return `${x + Math.cos(a) * r * f * sx},${y + Math.sin(a) * r * f}`; }).join(" ");

export const Maceta: React.FC<{ t: number; x: number; y: number; s?: number; st: MacSt; rot?: number; id?: number }> = ({ t, x, y, s = 1, st, rot = 0, id = 0 }) => {
  const Rt = 300 * s, Rb = 215 * s, H = 520 * s, w = 62 * s, fb = 74 * s, ry = 0.16;
  const rAt = (v: number) => lerp(Rb, Rt, v);           // radio de afuera a la altura v (0 abajo, 1 arriba)
  const yAt = (v: number) => y - H * v;
  const gid = "mc" + id;
  const fresco = st.fresco ?? 0;
  const cemCol = `rgb(${Math.round(lerp(230, 168, fresco) - 34 * st.sello)},${Math.round(lerp(225, 163, fresco) - 36 * st.sello)},${Math.round(lerp(214, 152, fresco) - 38 * st.sello)})`;
  // --- mitad izquierda: el corte ---
  const oL = (v: number) => x - rAt(v), iL = (v: number) => x - rAt(v) + w;
  const vb = fb / H; // altura del fondo en v
  const wallL = `M${oL(0)},${yAt(0)} L${oL(1)},${yAt(1)} L${iL(1)},${yAt(1)} L${iL(vb)},${yAt(vb)} L${x},${yAt(vb)} L${x},${yAt(0)} Z`;
  // pedazos del corte: los de la pared (u a lo ancho) y los del fondo
  const secP = SEC.map((g, i) => {
    const enFondo = i % 4 === 0;
    const v = enFondo ? vb * (0.25 + 0.5 * g.u) : vb + (1 - vb - 0.04) * g.v;
    const px = enFondo ? lerp(oL(0) + w * 0.8, x - 30 * s, g.v) : lerp(oL(v), iL(v), g.u);
    return { ...g, px, py: yAt(v), rr: g.r * w * (enFondo ? 0.55 : 0.62) };
  });
  const nV = Math.round(secP.length * cl(st.vidrio));
  // --- mitad derecha: la cara de afuera ---
  const extR = `M${x},${yAt(0)} L${x + rAt(0)},${yAt(0)} L${x + rAt(1)},${yAt(1)} L${x},${yAt(1)} Z`;
  const gelK = st.gel ?? 0, raja = st.raja ?? 0;
  return (
    <g>
      <defs>
        <clipPath id={gid + "w"}><path d={wallL} /></clipPath>
        <clipPath id={gid + "e"}><path d={extR} /></clipPath>
        <linearGradient id={gid + "g"} x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,.18)" /><stop offset="0.55" stopColor="rgba(255,255,255,0)" /><stop offset="1" stopColor="rgba(0,0,0,.38)" /></linearGradient>
      </defs>
      <ellipse cx={x + 30 * s} cy={y + 18 * s} rx={Rb * 1.6} ry={34 * s} fill="rgba(0,0,0,.45)" />
      {/* boca: elipse de adentro (la tierra/vacío) */}
      <ellipse cx={x} cy={yAt(1)} rx={Rt} ry={Rt * ry} fill={st.pasta > 0.5 ? "#2b2621" : "rgba(0,0,0,.25)"} />
      {/* cara de afuera */}
      <path d={extR} fill={cemCol} opacity={cl(st.pasta * 1.4)} />
      <g clipPath={`url(#${gid}e)`} opacity={cl(st.pasta * 1.4)}>
        {EXT.map((d, i) => {
          const a = d.th + rot, c = Math.cos(a), sn = Math.sin(a);
          if (c < 0.05 || sn < 0) return null;
          const v = d.v, px = x + rAt(v) * sn, py = yAt(v) + Rt * ry * c * 0.2, sk = st.piel * (1 - cl(st.revela * 1.7 - d.k * 0.7));
          const [f, b] = GCOL[d.col];
          return <g key={i}>
            <polygon points={shard(px, py, d.r * s * (0.5 + 0.5 * c), d.sh, d.k * 6, 0.45 + 0.55 * c)} fill={f} stroke={b} strokeWidth={1.5} opacity={1 - sk} />
            {st.sello > 0.05 && <circle cx={px - 3} cy={py - 3} r={2.5 * s} fill="white" opacity={0.7 * st.sello * (1 - sk)} />}
          </g>;
        })}
        {/* la piel: velo de lechada que la lija va sacando (deja manchas mientras tanto) */}
        {st.piel > 0.01 && <path d={extR} fill={cemCol} opacity={st.piel * (1 - st.revela) * 0.55} />}
        {/* sombreado del cilindro y brillo del sello */}
        <path d={extR} fill={`url(#${gid}g)`} />
        {st.sello > 0.01 && <path d={`M${x + Rb * 0.35},${yAt(0.05)} L${x + Rt * 0.42},${yAt(0.95)}`} stroke="rgba(255,255,255,.35)" strokeWidth={26 * s} opacity={st.sello} strokeLinecap="round" />}
      </g>
      {/* mitad izquierda: corte */}
      <path d={wallL} fill={cemCol} opacity={cl(st.pasta * 1.2)} />
      <g clipPath={`url(#${gid}w)`}>
        {secP.slice(0, nV).map((g, i) => { const [f, b] = GCOL[g.col]; return <g key={i}>
          {gelK > 0.01 && g.k < 0.35 && <polygon points={shard(g.px, g.py, g.rr * (1 + 0.6 * gelK), g.j, g.rot)} fill="rgba(230,240,190,.55)" stroke="rgba(200,220,120,.8)" strokeWidth={2} />}
          <polygon points={shard(g.px, g.py, g.rr, g.j, g.rot)} fill={f} stroke={b} strokeWidth={2.5} opacity={0.95} />
          <polygon points={shard(g.px - g.rr * 0.2, g.py - g.rr * 0.2, g.rr * 0.35, g.j, g.rot)} fill="rgba(255,255,255,.35)" />
        </g>; })}
        {/* marmolina: puntitos blancos de la pasta */}
        {st.pasta > 0.05 && Array.from({ length: 160 }, (_, i) => <circle key={i} cx={lerp(x - Rt, x, hash(i, 41))} cy={lerp(yAt(1), yAt(0), hash(i, 42))} r={1.4 + 1.6 * hash(i, 43)} fill={hash(i, 44) > 0.5 ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.12)"} opacity={st.pasta} />)}
        {/* la rajadura que sale del gel */}
        {raja > 0.01 && (() => { const g = secP.find((q) => q.k < 0.35 && q.py < yAt(0.6))!; const pts = [[g.px, g.py], [g.px - 18 * s, g.py - 30 * s], [g.px - 10 * s, g.py - 62 * s], [oL((y - g.py) / H + 0.15) - 4, g.py - 90 * s]]; return <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#151311" strokeWidth={6 * s} strokeLinejoin="round" strokeDasharray={`${raja * 200 * s} 999`} />; })()}
      </g>
      <path d={wallL} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={3} opacity={cl(st.pasta * 1.2)} />
      {/* rayado de corte (dibujo técnico) muy leve */}
      <path d={wallL} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={1} />
      {/* corcho / agujero del fondo */}
      {st.corcho > 0.01 && <rect x={x - 22 * s} y={yAt(vb) - 18 * s * (1 - st.hueco)} width={44 * s} height={fb + 18 * s * (1 - st.hueco)} rx={8 * s} fill="#b88a55" stroke="#6e4b25" strokeWidth={3} opacity={st.corcho * (1 - st.hueco)} transform={`translate(0,${st.hueco * 140 * s})`} />}
      {st.hueco > 0.01 && <rect x={x - 20 * s} y={yAt(vb)} width={20 * s} height={fb} fill="#141210" opacity={st.hueco} />}
      {/* boca: canto del borde */}
      <path d={`M${x - Rt},${yAt(1)} A${Rt},${Rt * ry} 0 0 0 ${x + Rt},${yAt(1)}`} fill="none" stroke={cemCol} strokeWidth={10 * s} opacity={cl(st.pasta * 1.4)} />
      <path d={`M${x - Rt + w},${yAt(1)} A${Rt - w},${(Rt - w) * ry} 0 0 1 ${x + Rt - w},${yAt(1)}`} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={4} opacity={cl(st.pasta * 1.4)} />
      {/* los dos moldes de plástico */}
      {st.molde > 0.01 && <g opacity={st.molde}>
        <path d={`M${x - rAt(1) - 10 * s},${yAt(1.04)} L${x - rAt(0) - 10 * s},${yAt(0) + 10 * s} L${x + rAt(0) + 10 * s},${yAt(0) + 10 * s} L${x + rAt(1) + 10 * s},${yAt(1.04)}`} fill="none" stroke={C.plast} strokeWidth={12 * s} strokeLinejoin="round" />
        <path d={`M${iL(1.08)},${yAt(1.08)} L${iL(vb)},${yAt(vb)} L${x + rAt(vb) - w},${yAt(vb)} L${x + rAt(1.08) - w},${yAt(1.08)}`} fill="rgba(95,127,152,.25)" stroke={C.plast2} strokeWidth={10 * s} strokeLinejoin="round" />
      </g>}
      {(st.planta ?? 0) > 0.01 && <g transform={`translate(${x},${yAt(1) - 10 * s}) scale(${s * (st.planta ?? 0)})`}>
        {Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + (i - 4) * 0.32; return <ellipse key={i} cx={Math.cos(a) * 60} cy={Math.sin(a) * 60 + 20} rx={22} ry={62} transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 60} ${Math.sin(a) * 60 + 20})`} fill={i % 2 ? "#6fae7a" : "#86c08f"} stroke="#3f7a4a" strokeWidth={3} />; })}
      </g>}
      {/* sombra de contacto entre las mitades */}
      <line x1={x} y1={yAt(1)} x2={x} y2={yAt(0)} stroke="rgba(0,0,0,.35)" strokeWidth={2} opacity={cl(st.pasta * 1.4)} />
      {t < -1 ? null : null}
    </g>
  );
};
