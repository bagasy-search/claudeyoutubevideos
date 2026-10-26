// Piezas nuevas para lc03b (E23-E51): sacudida de cámara, onomatopeyas, mano con marcador, vaho, chispas, salpicadura,
// rueda de válvula, manómetro, calendario que pasa días. Todo vector en código.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CapaSVG, Clave, Plano, golpe, useF } from "../../anikit/camara";
import { F_HUD } from "../../anikit/pantalla";
import { EscenaProps } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";

export const ap = (f: number, a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const rampa = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Escena con sacudidas de cámara (cuadros locales de cada golpe)
export const EscenaS: React.FC<EscenaProps & { sacudidas?: number[]; amp?: number }> = ({ Set, pal, claves, setProps = {}, medio, frente, detras, hud, mano = 3, seed = 0, zLejos = 0.25, fondo, sacudidas = [], amp = 14 }) => {
  const f = useF();
  const sp = { f, pal, ...setProps };
  const ex = sacudidas.reduce((a, g) => a + golpe(f, g, amp), 0);
  const ey = sacudidas.reduce((a, g) => a + golpe(f, g + 1, amp * 0.7), 0);
  return (
    <AbsoluteFill>
      <Plano claves={claves} mano={mano} seed={seed} fondo={fondo ?? pal.cielo[0]} extra={{ x: ex, y: ey }}>
        <CapaSVG z={zLejos} desenfoqueMax={3}><Set capa="lejos" {...sp} /></CapaSVG>
        <CapaSVG z={1}><Set capa="medio" {...sp} />{detras}{medio}</CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={5}><Set capa="frente" {...sp} />{frente}</CapaSVG>
      </Plano>
      {hud}
    </AbsoluteFill>
  );
};

// Onomatopeya HUD: salta (escala) en cada golpe y se apaga a los `dur` cuadros
export const Onoma: React.FC<{ texto: string; x: number; y: number; golpes: number[]; dur?: number; color?: string; tam?: number; rot?: number }> = ({ texto, x, y, golpes, dur = 16, color = "#ffcf6e", tam = 110, rot = -6 }) => {
  const f = useF();
  const g = golpes.filter((q) => f >= q).pop();
  if (g === undefined) return null;
  const t = f - g;
  if (t > dur) return null;
  const s = interpolate(t, [0, 3, 6], [0.4, 1.25, 1], { extrapolateRight: "clamp" });
  const o = interpolate(t, [dur - 5, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + (g % 2 ? 4 : -3)}deg) scale(${s})`, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color, whiteSpace: "nowrap",
      WebkitTextStroke: `${Math.max(4, tam * 0.07)}px rgba(14,10,18,0.92)`, paintOrder: "stroke fill", textShadow: "0 6px 0 rgba(10,8,14,0.85)" }}>{texto}</div>
  );
};

// Texto que se escribe letra a letra (HUD)
export const Escribe: React.FC<{ texto: string; x: number; y: number; desde: number; vel?: number; color?: string; tam?: number; centro?: boolean; hasta?: number }> = ({ texto, x, y, desde, vel = 1.6, color = "#f6ecd2", tam = 60, centro, hasta }) => {
  const f = useF();
  if (f < desde) return null;
  const n = Math.min(texto.length, Math.floor((f - desde) / vel));
  const o = hasta ? ap(f, hasta - 10, 10) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: centro ? "translateX(-50%)" : undefined, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, color, whiteSpace: "pre", opacity: 1 - o,
      WebkitTextStroke: `${Math.max(3, tam * 0.07)}px rgba(14,10,18,0.92)`, paintOrder: "stroke fill", textShadow: "0 5px 0 rgba(10,8,14,0.85)" }}>{texto.slice(0, n)}<span style={{ opacity: 0 }}>{texto.slice(n)}</span></div>
  );
};

// ---- brazo con manga cónica + mano dibujada con dedos (nada de tubos) ----
const NEGRO = "#17131a", NEGRO2 = "#3c3544";
// mano en coordenadas locales: la muñeca en el origen, los dedos hacia +x. modo: "dedo" (índice extendido), "pinza" (puño con marcador/lápiz)
export const ManoDedos: React.FC<{ x: number; y: number; ang: number; modo?: "dedo" | "pinza" | "puno"; tam?: number; punta?: string; cuerpo?: string }> = ({ x, y, ang, modo = "pinza", tam = 1, punta = "#c0352c", cuerpo = "#e8e2d6" }) => (
  <g transform={`translate(${x},${y}) rotate(${ang}) scale(${tam})`}>
    {modo === "pinza" && <g>
      <rect x={4} y={-7} width={108} height={14} rx={5} fill={cuerpo} stroke={NEGRO} strokeWidth={3} />
      <rect x={86} y={-7} width={26} height={14} rx={5} fill={punta} stroke={NEGRO} strokeWidth={3} />
    </g>}
    <ellipse cx={24} cy={0} rx={32} ry={25} fill={NEGRO} stroke={NEGRO2} strokeWidth={2} />
    {modo === "dedo" ? <g>
      <rect x={34} y={-11} width={64} height={19} rx={9.5} fill={NEGRO} stroke={NEGRO2} strokeWidth={2} />
      {[[44, 15], [58, 19], [70, 15]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={11} fill={NEGRO} stroke={NEGRO2} strokeWidth={2} />)}
      <ellipse cx={30} cy={-24} rx={21} ry={10} transform="rotate(-28 30 -24)" fill={NEGRO} stroke={NEGRO2} strokeWidth={2} />
    </g> : <g>
      {[[52, -15], [56, 1], [52, 17]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={17} ry={11} fill={NEGRO} stroke={NEGRO2} strokeWidth={2} />)}
      <ellipse cx={32} cy={-26} rx={22} ry={11} transform="rotate(-22 32 -26)" fill={NEGRO} stroke={NEGRO2} strokeWidth={2} />
    </g>}
  </g>
);

// brazo cónico (hombro S → muñeca W, con codo) + puño de la manga
export const Brazo: React.FC<{ sx: number; sy: number; wx: number; wy: number; manga: string; puno?: string; ancho?: number }> = ({ sx, sy, wx, wy, manga, puno = "#e9dcc0", ancho = 1 }) => {
  const dx = wx - sx, dy = wy - sy, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const cx = (sx + wx) / 2 + nx * L * 0.1, cy = (sy + wy) / 2 + ny * L * 0.1;
  const pts: { x: number; y: number; w: number }[] = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18, u = 1 - t;
    const x = u * u * sx + 2 * u * t * cx + t * t * wx, y = u * u * sy + 2 * u * t * cy + t * t * wy;
    pts.push({ x, y, w: (74 - 32 * t) * ancho });
  }
  const tang = (i: number) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const l = Math.hypot(b.x - a.x, b.y - a.y) || 1; return { x: (b.x - a.x) / l, y: (b.y - a.y) / l }; };
  const lado = (sg: number) => pts.map((p, i) => { const t = tang(i); return `${(p.x - t.y * sg * p.w / 2).toFixed(1)},${(p.y + t.x * sg * p.w / 2).toFixed(1)}`; });
  const d = "M" + lado(1).join(" L") + " L" + lado(-1).reverse().join(" L") + " Z";
  const e = pts[pts.length - 3], t2 = tang(pts.length - 3);
  const anguloPuno = Math.atan2(t2.y, t2.x) * 180 / Math.PI;
  return (
    <g>
      <path d={d} fill={manga} stroke="rgba(14,10,18,0.55)" strokeWidth={3} strokeLinejoin="round" />
      <g transform={`translate(${e.x},${e.y}) rotate(${anguloPuno})`}><rect x={-12} y={-27 * ancho} width={24} height={54 * ancho} rx={8} fill={puno} stroke="rgba(14,10,18,0.55)" strokeWidth={3} /></g>
    </g>
  );
};

// Mano con marcador (mundo): brazo con manga desde arriba-derecha que garabatea / tacha en (x,y) entre f0 y f1
export const ManoMarcador: React.FC<{ x: number; y: number; f0: number; f1: number; color?: string; manga?: string; tam?: number; lado?: 1 | -1 }> = ({ x, y, f0, f1, color = "#c0352c", manga = "#8a6b3e", tam = 1, lado = 1 }) => {
  const f = useF();
  if (f < f0 - 8 || f > f1 + 12) return null;
  const entra = ap(f, f0 - 8, 8) * (1 - ap(f, f1 + 2, 10));
  const g = f - f0;
  const px = x + Math.sin(g * 0.9) * 26 * tam + lado * (1 - entra) * 520 * tam, py = y + Math.cos(g * 1.3) * 14 * tam - (1 - entra) * 700 * tam;
  const sx = x + lado * 760 * tam, sy = y - 980 * tam;
  const d = Math.hypot(px - sx, py - sy) || 1, ux = (px - sx) / d, uy = (py - sy) / d;
  const L = 112 * tam;
  return (
    <g opacity={Math.min(1, entra * 3)}>
      <Brazo sx={sx} sy={sy} wx={px - ux * L} wy={py - uy * L} manga={manga} ancho={tam} />
      <ManoDedos x={px - ux * L} y={py - uy * L} ang={Math.atan2(uy, ux) * 180 / Math.PI} modo="pinza" tam={tam} punta={color} />
    </g>
  );
};

// Vaho / vapor del aliento o de la olla: bolitas que suben y se apagan
export const Vaho: React.FC<{ x: number; y: number; n?: number; color?: string; r?: number; alto?: number; lado?: number; vel?: number }> = ({ x, y, n = 5, color = "#f3f0ea", r = 16, alto = 80, lado = 0, vel = 0.03 }) => {
  const f = useF();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const u = (f * vel + i / n) % 1;
        return <circle key={i} cx={x + lado * u * 40 + Math.sin(u * 6 + i) * 10} cy={y - u * alto} r={r * (0.5 + u)} fill={color} opacity={0.65 * (1 - u)} />;
      })}
    </g>
  );
};

export const Chispas: React.FC<{ x: number; y: number; f0: number; n?: number; color?: string; radio?: number }> = ({ x, y, f0, n = 9, color = "#ffd34a", radio = 120 }) => {
  const f = useF();
  const t = f - f0;
  if (t < 0 || t > 14) return null;
  return (
    <g>
      <Halo x={x} y={y} r={160} color="#ffcf6e" fuerza={0.6 * (1 - t / 14)} />
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + i, d = radio * (t / 14) * (0.6 + (i % 3) * 0.3);
        return <rect key={i} x={x + Math.cos(a) * d - 3} y={y + Math.sin(a) * d - 3 + t * t * 0.4} width={7} height={14} fill={color} opacity={1 - t / 14} transform={`rotate(${a * 57} ${x + Math.cos(a) * d} ${y + Math.sin(a) * d})`} />;
      })}
    </g>
  );
};

export const Salpica: React.FC<{ x: number; y: number; f0: number; color?: string }> = ({ x, y, f0, color = "#bfe6ff" }) => {
  const f = useF();
  const t = f - f0;
  if (t < 0 || t > 22) return null;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={30 + t * 8} ry={6 + t} fill="none" stroke={color} strokeWidth={5} opacity={1 - t / 22} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = -Math.PI * (0.1 + 0.8 * (i / 9)), v = 16 + (i % 3) * 5;
        return <circle key={i} cx={x + Math.cos(a) * v * t * 0.7} cy={y + Math.sin(a) * v * t * 0.7 + t * t * 0.55} r={7 - t * 0.2} fill={color} opacity={Math.max(0, 1 - t / 20)} />;
      })}
    </g>
  );
};

// Rueda de válvula (mundo)
export const Rueda: React.FC<{ x: number; y: number; r?: number; ang: number; color?: string }> = ({ x, y, r = 60, ang, color = "#c0352c" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-8} y={0} width={16} height={r * 1.6} fill="#4a4e58" />
    <g transform={`rotate(${ang})`}>
      <circle r={r} fill="none" stroke={color} strokeWidth={12} />
      {[0, 60, 120].map((a) => <rect key={a} x={-r} y={-4} width={r * 2} height={8} fill={color} transform={`rotate(${a})`} />)}
      <circle r={13} fill="#2a2e38" />
    </g>
  </g>
);

// Manómetro (HUD o mundo): v 0..1
export const Manometro: React.FC<{ x: number; y: number; v: number; r?: number; texto?: string }> = ({ x, y, v, r = 90, texto }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r + 10} fill="#2a2e38" /><circle r={r} fill="#f1ecdc" />
    {Array.from({ length: 11 }).map((_, i) => { const a = (-125 + i * 25) * Math.PI / 180; return <line key={i} x1={Math.sin(a) * r * 0.78} y1={-Math.cos(a) * r * 0.78} x2={Math.sin(a) * r * 0.92} y2={-Math.cos(a) * r * 0.92} stroke={i > 8 ? "#c0352c" : "#2a2e38"} strokeWidth={5} />; })}
    <line x1={0} y1={0} x2={Math.sin((-125 + v * 250) * Math.PI / 180) * r * 0.78} y2={-Math.cos((-125 + v * 250) * Math.PI / 180) * r * 0.78} stroke="#c0352c" strokeWidth={7} strokeLinecap="round" />
    <circle r={9} fill="#2a2e38" />
    {texto && <text y={r * 0.55} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={r * 0.28} fill="#2a2e38">{texto}</text>}
  </g>
);

// Calendario HUD con N días que se tachan
export const Hojas: React.FC<{ x: number; y: number; texto: string; desde: number; dia?: number; w?: number }> = ({ x, y, texto, desde, dia = 0, w = 420 }) => {
  const f = useF();
  const s = ap(f, desde, 10);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translateX(-50%) scale(${(0.8 + 0.2 * s) * 1.5})`, transformOrigin: "50% 0", opacity: s, background: "#f6ecd2", border: "6px solid #c0352c", borderRadius: 14, padding: "10px 16px", fontFamily: F_HUD, textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.35)" }}>
      <div style={{ fontSize: 34, fontWeight: 600, color: "#c0352c", letterSpacing: 3 }}>{texto}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 6 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: i < dia ? "#c0352c" : "#d8ccb0", opacity: i < dia ? 0.9 : 0.6 }} />
        ))}
      </div>
    </div>
  );
};

// Mano con la punta (dedo o lápiz) en (x,y) del mundo; el brazo con manga viene desde la derecha-abajo
export const ManoPunta: React.FC<{ x: number; y: number; op?: number; manga?: string; lapiz?: boolean; lado?: 1 | -1; tam?: number }> = ({ x, y, op = 1, manga = "#2f9aa0", lapiz, lado = 1, tam = 1 }) => {
  if (op <= 0.01) return null;
  const sx = x + lado * 300 * tam, sy = y + 780 * tam;
  const d = Math.hypot(x - sx, y - sy) || 1, ux = (x - sx) / d, uy = (y - sy) / d;
  const L = (lapiz ? 112 : 98) * tam;
  return (
    <g opacity={op}>
      <Brazo sx={sx} sy={sy} wx={x - ux * L} wy={y - uy * L} manga={manga} ancho={tam} />
      <ManoDedos x={x - ux * L} y={y - uy * L} ang={Math.atan2(uy, ux) * 180 / Math.PI} modo={lapiz ? "pinza" : "dedo"} tam={tam} punta="#17131a" cuerpo="#e8c040" />
    </g>
  );
};

// Cifra HUD: rótulo legible (blanco) + valor que pega un golpe de escala en cada cuadro de `golpes`; fondo oscuro propio
export const Cifra: React.FC<{ x: number; y: number; rotulo: string; valor: string | number; color?: string; tam?: number; desde?: number; hasta?: number; golpes?: number[]; rotuloTam?: number }> = ({ x, y, rotulo, valor, color = "#ffcf6e", tam = 100, desde = 0, hasta, golpes = [], rotuloTam }) => {
  const f = useF();
  if (f < desde) return null;
  const a = ap(f, desde, 8) * (hasta ? 1 - ap(f, hasta - 10, 10) : 1);
  const g = golpes.filter((q) => f >= q).pop();
  const pop = g === undefined ? 1 : 1 + 0.28 * Math.exp(-(f - g) / 4.5) * Math.cos((f - g) * 0.5);
  const rt = rotuloTam ?? Math.max(26, tam * 0.3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.85 + 0.15 * a})`, opacity: a, textAlign: "center", fontFamily: F_HUD, fontWeight: 600, whiteSpace: "nowrap",
      background: "rgba(14,10,18,0.86)", borderRadius: 22, padding: `${rt * 0.35}px ${rt * 0.9}px ${rt * 0.2}px` }}>
      <div style={{ fontSize: rt, letterSpacing: rt * 0.08, color: "#ffffff", WebkitTextStroke: "3px rgba(14,10,18,0.9)", paintOrder: "stroke fill" }}>{rotulo}</div>
      <div style={{ fontSize: tam, lineHeight: 1.05, color, transform: `scale(${pop})`, WebkitTextStroke: `${Math.max(4, tam * 0.07)}px rgba(14,10,18,0.92)`, paintOrder: "stroke fill" }}>{valor}</div>
    </div>
  );
};

// Pastilla HUD: texto blanco sobre fondo oscuro opaco, centrada en x (top = y)
export const Pastilla: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; tam?: number; color?: string }> = ({ texto, x, y, desde, hasta, tam = 48, color = "#ffffff" }) => {
  const f = useF();
  if (f < desde || (hasta !== undefined && f > hasta)) return null;
  const a = ap(f, desde, 6) * (hasta !== undefined ? 1 - ap(f, hasta - 6, 6) : 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.9 + 0.1 * a})`, opacity: a, whiteSpace: "nowrap", fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: tam * 0.06, color,
      background: "rgba(14,10,18,0.86)", borderRadius: tam * 0.45, padding: `${tam * 0.18}px ${tam * 0.55}px ${tam * 0.12}px`, WebkitTextStroke: "3px rgba(14,10,18,0.9)", paintOrder: "stroke fill" }}>{texto}</div>
  );
};
