// tz02 · utilería y componentes-concepto propios (no tocan anikit ni tenzo).
// Mundo = coordenadas del set (van en medio/frente de la Escena). Pantalla = 1920x1080 (van en hud).
import React from "react";
import { interpolate, random, spring, useVideoConfig } from "remotion";
import { useF } from "../anikit/camara";
import { F_HUD, F_MANO } from "../anikit/pantalla";
import { ACENTO } from "../tenzo/elenco";

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const lerp = (f: number, a: number, b: number, v0: number, v1: number) => interpolate(f, [a, b], [v0, v1], cl);
export const suave = (t: number) => t * t * (3 - 2 * t);
export const usePop = (desde: number, d = 15, k = 140) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return spring({ frame: f - desde, fps, config: { damping: d, stiffness: k } });
};
// cuadros por ciclo → seno 0..1
export const osc01 = (f: number, per: number, fase = 0) => 0.5 + 0.5 * Math.sin((f / per) * 2 * Math.PI + fase);
// lienzo de pantalla
export const Lienzo: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: o, overflow: "visible" }}>{children}</svg>
);
// endereza un objeto en la mano (anula el giro del antebrazo): ang = h + tronco + c del brazo
export const Recto: React.FC<{ ang: number; children: React.ReactNode; dx?: number; dy?: number }> = ({ ang, children, dx = 0, dy = 0 }) => <g transform={`rotate(${ang}) translate(${dx},${dy})`}>{children}</g>;

// ================= UTILERÍA DEL PALACIO (mundo) =================
export const Divan: React.FC<{ x: number; piso: number }> = ({ x, piso }) => (
  <g transform={`translate(${x},${piso})`}>
    <rect x={-170} y={-70} width={340} height={56} rx={22} fill="#a8322c" stroke="#5a1a14" strokeWidth={4} />
    <path d="M-175,-60 Q-200,-150 -140,-160 Q-120,-120 -120,-70 Z" fill="#c8403a" stroke="#5a1a14" strokeWidth={4} />
    <rect x={-150} y={-90} width={300} height={26} rx={13} fill="#e0b040" />
    {[-120, 0, 120].map((d) => <circle key={d} cx={d} cy={-77} r={7} fill="#fff2c8" />)}
    <rect x={-160} y={-16} width={14} height={16} fill="#6a4020" /><rect x={146} y={-16} width={14} height={16} fill="#6a4020" />
    <ellipse cx={-120} cy={-104} rx={44} ry={20} fill="#f2c14a" stroke="#8a5a2a" strokeWidth={3} />
  </g>
);
// racimo de uvas / fruta (en mano: centrado)
export const Uvas: React.FC<{ s?: number; n?: number }> = ({ s = 1, n = 7 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,-14 q4,-10 10,-12" stroke="#5a7a2a" strokeWidth={3} fill="none" />
    {[[0, 0], [-8, 6], [8, 6], [0, 12], [-5, 18], [5, 18], [0, 24]].slice(0, n).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill={i % 2 ? "#8a4aa0" : "#a060b8"} stroke="#4a2050" strokeWidth={1.5} />)}
  </g>
);
export const Uva: React.FC<{ x?: number; y?: number }> = ({ x = 0, y = 0 }) => <circle cx={x} cy={y} r={7} fill="#a060b8" stroke="#4a2050" strokeWidth={2} />;
// bandeja de frutas (en mano, plana: se endereza con Recto)
export const Bandeja: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={0} rx={52} ry={10} fill="#e0b040" stroke="#8a5a2a" strokeWidth={3} />
    <circle cx={-26} cy={-12} r={13} fill="#ff8a3a" /><circle cx={-4} cy={-16} r={14} fill="#e8c43a" /><circle cx={22} cy={-12} r={12} fill="#c8403a" />
    <g transform="translate(6,-26)"><Uvas s={0.8} n={5} /></g>
  </g>
);
// instrumentos (mundo, al lado del músico sentado)
export const Sitar: React.FC<{ x: number; y: number; vibra?: number }> = ({ x, y, vibra = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(-38)`}>
    <ellipse cx={0} cy={0} rx={34} ry={30} fill="#a8642a" stroke="#5a3418" strokeWidth={3} />
    <ellipse cx={0} cy={-4} rx={12} ry={10} fill="#5a3418" />
    <rect x={-6} y={-170} width={12} height={150} rx={4} fill="#8a5a2a" stroke="#5a3418" strokeWidth={2} />
    {[-3, 0, 3].map((d) => <line key={d} x1={d + vibra * Math.sin(d)} y1={-165} x2={d} y2={18} stroke="#f2e2c0" strokeWidth={1.2} />)}
    <circle cx={0} cy={-176} r={9} fill="#e0b040" />
  </g>
);
export const Tambor: React.FC<{ x: number; y: number; golpe?: number }> = ({ x, y, golpe = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-38,-60 L38,-60 L30,0 L-30,0 Z" fill="#8a3a2a" stroke="#4a1a10" strokeWidth={3} />
    {[-24, -8, 8, 24].map((d) => <line key={d} x1={d * 1.2} y1={-58} x2={d} y2={-2} stroke="#e0b040" strokeWidth={2} />)}
    <ellipse cx={0} cy={-60 + golpe * 2} rx={38} ry={9} fill="#f2e2c0" stroke="#4a1a10" strokeWidth={3} />
    {golpe > 0.6 && [0, 1, 2].map((k) => <path key={k} d={`M${-50 - k * 12},${-80 - k * 6} q-8,-6 -16,-2`} stroke="#fff2c8" strokeWidth={3} fill="none" opacity={golpe} />)}
  </g>
);
export const Flauta: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><rect x={-4} y={-6} width={8} height={90} rx={4} fill="#c8a060" stroke="#6a4a2a" strokeWidth={2} />{[20, 34, 48, 62].map((y) => <circle key={y} cx={0} cy={y} r={2} fill="#3a2414" />)}</g>
);
// nota musical que sube y se apaga (mundo)
export const Notas: React.FC<{ x: number; y: number; f: number; n?: number; color?: string }> = ({ x, y, f, n = 3, color = "#fff2c8" }) => (
  <g>{Array.from({ length: n }).map((_, k) => {
    const t = ((f + k * 22) % 66) / 66;
    return <g key={k} transform={`translate(${x + Math.sin(t * 6 + k) * 18 + k * 20},${y - t * 120})`} opacity={Math.sin(t * Math.PI)}><circle r={7} fill={color} /><path d="M6,0 L6,-26 L18,-20" stroke={color} strokeWidth={3} fill="none" /></g>;
  })}</g>
);
// guirnalda de flores (en mano: cuelga hacia abajo) y la que se pone al cuello (mundo)
export const Guirnalda: React.FC<{ s?: number; r?: number }> = ({ s = 1, r = 34 }) => (
  <g transform={`scale(${s})`}>{Array.from({ length: 14 }).map((_, k) => { const a = (k / 13) * Math.PI; return <circle key={k} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 1.4} r={7} fill={k % 2 ? "#ffb03a" : "#f2e2c0"} stroke="#c8603a" strokeWidth={1.5} />; })}</g>
);
export const GuirnaldaColgante: React.FC<{ x0: number; x1: number; y: number; caida?: number; f: number }> = ({ x0, x1, y, caida = 1, f }) => {
  const n = 18;
  return (
    <g transform={`translate(0,${(1 - caida) * -500})`}>
      <path d={`M${x0},${y} Q${(x0 + x1) / 2},${y + 120} ${x1},${y}`} stroke="#5a7a2a" strokeWidth={3} fill="none" />
      {Array.from({ length: n }).map((_, k) => {
        const t = k / (n - 1);
        const px = x0 + (x1 - x0) * t, py = y + 4 * 120 * t * (1 - t) * 0.5 * 2 / 2 + Math.sin(f / 20 + k) * 2;
        return <circle key={k} cx={px} cy={py + 120 * 2 * t * (1 - t)} r={10} fill={k % 3 === 0 ? "#ff8a3a" : k % 3 === 1 ? "#ffd06a" : "#f2e2c0"} stroke="#c8603a" strokeWidth={2} />;
      })}
    </g>
  );
};
// escoba (en mano, cuelga)
export const Escoba: React.FC = () => (
  <g><rect x={-3} y={-60} width={6} height={150} rx={3} fill="#8a5a2a" /><path d="M-22,90 L22,90 L30,140 L-30,140 Z" fill="#d9b060" stroke="#8a6a2a" strokeWidth={2} /></g>
);
// flor marchita (mundo): en maceta; `arrancada` 0..1 la saca
export const FlorMarchita: React.FC<{ x: number; piso: number; arrancada?: number }> = ({ x, piso, arrancada = 0 }) => (
  <g transform={`translate(${x},${piso})`}>
    <path d="M-34,0 L-42,-60 L42,-60 L34,0 Z" fill="#c8703a" />
    {arrancada < 1 && <g opacity={1 - arrancada} transform={`translate(0,${-arrancada * 40})`}><path d="M0,-60 Q6,-110 26,-120" stroke="#7a7a4a" strokeWidth={4} fill="none" /><circle cx={30} cy={-112} r={13} fill="#8a7a6a" /><path d="M24,-106 l-6,14 M34,-104 l4,16" stroke="#6a5a4a" strokeWidth={3} /></g>}
    {[-20, 20].map((d) => <g key={d}><path d={`M${d},-60 L${d},-110`} stroke="#5a8a3a" strokeWidth={4} /><circle cx={d} cy={-118} r={14} fill={d < 0 ? "#f4a8a0" : "#ffd06a"} /></g>)}
  </g>
);
export const FlorMuertaMano: React.FC = () => <g><path d="M0,0 Q6,40 20,52" stroke="#7a7a4a" strokeWidth={4} fill="none" /><circle cx={22} cy={58} r={12} fill="#8a7a6a" /></g>;
// bebé en brazos (en mano, se endereza con Recto)
export const BebeMano: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse rx={46} ry={22} fill="#fff2dc" stroke="#d9c4a0" strokeWidth={3} />
    <circle cx={-30} cy={-10} r={20} fill="#e2ad78" />
    <path d="M-40,-12 q4,3 8,0 M-28,-12 q4,3 8,0" stroke="#3a2618" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <path d="M-34,-1 q4,3 8,0" stroke="#a8503a" strokeWidth={2} fill="none" />
  </g>
);
// el bebé en la cuna con un bracito que se estira (0..1) y agarra
export const BebeVivo: React.FC<{ x: number; piso: number; brazo?: number; ojos?: number }> = ({ x, piso, brazo = 0, ojos = 0 }) => (
  <g transform={`translate(${x},${piso - 128})`}>
    <ellipse rx={58} ry={26} fill="#fff2dc" stroke="#d9c4a0" strokeWidth={3} />
    <circle cx={-34} cy={-14} r={24} fill="#e2ad78" />
    {ojos > 0.5 ? <g><circle cx={-42} cy={-17} r={3.4} fill="#3a2618" /><circle cx={-27} cy={-17} r={3.4} fill="#3a2618" /><path d="M-40,-5 q6,5 12,0" stroke="#a8503a" strokeWidth={2.5} fill="none" /></g>
      : <path d="M-44,-16 q5,4 10,0 M-30,-16 q5,4 10,0" stroke="#3a2618" strokeWidth={3} fill="none" strokeLinecap="round" />}
    <path d={`M-10,-6 Q${0 + brazo * 10},${-30 - brazo * 40} ${4 + brazo * 26},${-36 - brazo * 70}`} stroke="#e2ad78" strokeWidth={10} fill="none" strokeLinecap="round" />
    <circle cx={4 + brazo * 26} cy={-36 - brazo * 70} r={8} fill="#e2ad78" stroke="#c8905a" strokeWidth={2} />
  </g>
);
// lágrimas que caen de un punto (mundo)
export const Lagrimas: React.FC<{ x: number; y: number; f: number; desde?: number; dx?: number }> = ({ x, y, f, desde = 0, dx = 22 }) => (
  <g>{f > desde && [0, 1, 2, 3].map((k) => {
    const t = ((f - desde + k * 11) % 44) / 44;
    return [-1, 1].map((sd) => <path key={`${k}${sd}`} d="M0,-8 Q6,0 0,6 Q-6,0 0,-8 Z" fill="#8fd0ff" stroke="#4a8ac0" strokeWidth={1.5} transform={`translate(${x + sd * dx},${y + t * 90})`} opacity={1 - t} />);
  })}</g>
);
// vaho de la boca (mundo)
export const Vaho: React.FC<{ x: number; y: number; f: number; dir?: 1 | -1; desde?: number }> = ({ x, y, f, dir = 1, desde = 0 }) => (
  <g>{f > desde && [0, 1, 2].map((k) => {
    const t = ((f - desde + k * 9) % 27) / 27;
    return <circle key={k} cx={x + dir * t * 70} cy={y - t * 30} r={10 + t * 26} fill="#eef2f6" opacity={0.55 * (1 - t)} />;
  })}</g>
);
// ondas de fiebre que suben (mundo)
export const Calor: React.FC<{ x: number; y: number; f: number; w?: number }> = ({ x, y, f, w = 160 }) => (
  <g>{[0, 1, 2, 3].map((k) => {
    const t = ((f + k * 12) % 48) / 48;
    const xx = x - w / 2 + (k / 3) * w;
    return <path key={k} d={`M${xx},${y - t * 140} q10,-14 0,-28 q-10,-14 0,-28`} stroke="#ff6a3a" strokeWidth={4} fill="none" opacity={0.7 * Math.sin(t * Math.PI)} />;
  })}</g>
);
// auto de Chicago (mundo), de perfil
export const Auto: React.FC<{ x: number; piso: number; color?: string; dir?: 1 | -1; luces?: boolean }> = ({ x, piso, color = "#3a4a5a", dir = 1, luces = true }) => (
  <g transform={`translate(${x},${piso}) scale(${dir},1)`}>
    <path d="M-200,-40 L-190,-90 L-90,-100 L-40,-150 L90,-150 L140,-100 L200,-90 L205,-40 Z" fill={color} stroke="#14161a" strokeWidth={4} />
    <path d="M-30,-140 L80,-140 L120,-100 L-70,-100 Z" fill="#9fb4c8" opacity={0.6} />
    {[-120, 120].map((d) => <g key={d}><circle cx={d} cy={-34} r={34} fill="#14161a" /><circle cx={d} cy={-34} r={14} fill="#8a9098" /></g>)}
    {luces && <ellipse cx={205} cy={-70} rx={10} ry={8} fill="#fff2c8" />}
  </g>
);
// flor que brota en una ventana (mundo): p 0..1
export const FlorVentana: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <g transform={`translate(${x},${y}) scale(${p})`} opacity={Math.min(1, p * 2)}>
    <rect x={-34} y={0} width={68} height={22} rx={4} fill="#c8703a" />
    {[-24, -8, 8, 24].map((d, k) => <circle key={d} cx={d} cy={-10 - (k % 2) * 12} r={13} fill={["#f4a8a0", "#ffd06a", "#fff2dc", "#ff8a6a"][k]} />)}
  </g>
);
// silueta del palacio (dibujo de 200 px de ancho, centrado en 0,0, base en y=60)
export const MiniPalacio: React.FC<{ s?: number; color?: string; techo?: string }> = ({ s = 1, color = "#e8c08a", techo = "#e0b040" }) => (
  <g transform={`scale(${s})`}>
    <rect x={-100} y={-20} width={200} height={80} fill={color} stroke="#8a5a2a" strokeWidth={3} />
    {[-80, -40, 0, 40, 80].map((d) => <rect key={d} x={d - 6} y={-14} width={12} height={74} fill="#f0d2a0" stroke="#8a5a2a" strokeWidth={1.5} />)}
    <path d="M-110,-20 L0,-70 L110,-20 Z" fill={techo} stroke="#8a5a2a" strokeWidth={3} />
    <path d="M-30,-70 Q0,-120 30,-70 Z" fill={techo} stroke="#8a5a2a" strokeWidth={3} />
    <rect x={-14} y={22} width={28} height={38} rx={14} fill="#8a5a2a" />
    {[-90, 90].map((d) => <g key={d}><rect x={d - 12} y={-60} width={24} height={40} fill={color} stroke="#8a5a2a" strokeWidth={2} /><path d={`M${d - 16},-60 Q${d},-90 ${d + 16},-60 Z`} fill={techo} /></g>)}
  </g>
);

// ================= PANTALLA =================
// burbuja (pensamiento / recuerdo) en pantalla: x,y centro, r radio; cola hacia (cx, cy). children dibujan en -100..100
export const Burbuja: React.FC<{ x: number; y: number; r?: number; desde: number; hasta?: number; cx?: number; cy?: number; fondo?: string; borde?: string; children?: React.ReactNode }> = ({ x, y, r = 170, desde, hasta = 1e9, cx, cy, fondo = "#fbf6ea", borde = "#2a2420", children }) => {
  const f = useF();
  const s = usePop(desde, 12, 170);
  if (f < desde) return null;
  const o = interpolate(f, [hasta - 10, hasta], [1, 0], cl);
  const pts = cx !== undefined && cy !== undefined ? [0.55, 0.75, 0.9].map((t) => ({ x: x + (cx - x) * t, y: y + (cy - y) * t })) : [];
  const id = `bb${desde}${Math.round(x)}`;
  return (
    <Lienzo o={o}>
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={(18 - i * 5) * s} fill={fondo} stroke={borde} strokeWidth={4} />)}
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <defs><clipPath id={id}><circle r={r - 6} /></clipPath></defs>
        <circle r={r} fill={fondo} stroke={borde} strokeWidth={6} />
        <g clipPath={`url(#${id})`}><g transform={`scale(${r / 110})`}>{children}</g></g>
      </g>
    </Lienzo>
  );
};
// rótulo chico bajo una burbuja / tarjeta
export const Etiqueta: React.FC<{ texto: string; x: number; y: number; desde: number; hasta?: number; color?: string; tam?: number }> = ({ texto, x, y, desde, hasta = 1e9, color = "#f4efe6", tam = 40 }) => {
  const f = useF();
  const s = usePop(desde);
  if (f < desde) return null;
  const o = Math.min(s, interpolate(f, [hasta - 10, hasta], [1, 0], cl));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * s})`, opacity: o, fontFamily: F_HUD, fontWeight: 600, fontSize: tam, letterSpacing: 3, color, whiteSpace: "nowrap", textShadow: "0 3px 10px rgba(0,0,0,0.75)" }}>{texto}</div>;
};
// el celular en pantalla con contenido propio (pantalla útil 476x956). vib = px de vibración
export const TelMarco: React.FC<{ x?: number; y?: number; s?: number; vib?: number; halo?: number; rot?: number; o?: number; children?: React.ReactNode; fondo?: string }> = ({ x = 960, y = 540, s = 0.9, vib = 0, halo = 1, rot = 0, o = 1, children, fondo = "#22262d" }) => {
  const f = useF();
  const W = 520, H = 1000;
  const dx = vib ? Math.sin(f * 2.7) * vib : 0;
  return (
    <div style={{ position: "absolute", left: x - W / 2 + dx, top: y - H / 2, width: W, height: H, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: "50% 50%", opacity: o }}>
      {halo > 0 && <div style={{ position: "absolute", left: -260, top: -260, width: W + 520, height: H + 520, borderRadius: "50%", background: `radial-gradient(closest-side, ${ACENTO}${Math.round(0x55 * halo).toString(16).padStart(2, "0")}, transparent)` }} />}
      <div style={{ position: "absolute", inset: 0, borderRadius: 70, background: "#15171c", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 22, top: 22, right: 22, bottom: 22, borderRadius: 52, overflow: "hidden", background: fondo }}>
        {children}
        <div style={{ position: "absolute", left: "50%", top: 18, width: 120, height: 32, marginLeft: -60, borderRadius: 16, background: "#0b0c0f" }} />
      </div>
    </div>
  );
};
// íconos simples (svg 0..100) para el feed y las cadenas
export const Icono: React.FC<{ t: "cara" | "cuerpo" | "comida" | "trabajo" | "mapa" | "chat" | "musica" | "abuela" | "noticia" | "corazon"; c?: string }> = ({ t, c = "#f4efe6" }) => {
  switch (t) {
    case "cara": return <g><circle cx={50} cy={50} r={34} fill="#f2c08a" /><circle cx={38} cy={44} r={5} fill="#2a1a10" /><circle cx={62} cy={44} r={5} fill="#2a1a10" /><path d="M32,58 Q50,78 68,58" stroke="#2a1a10" strokeWidth={5} fill="#fff" /><path d="M16,40 Q20,8 50,10 Q80,8 84,40 Q70,22 50,24 Q30,22 16,40 Z" fill="#6a3a1a" /></g>;
    case "cuerpo": return <g><circle cx={50} cy={20} r={12} fill="#e8b080" /><path d="M24,40 Q50,30 76,40 L70,70 Q50,76 30,70 Z" fill="#e8b080" /><circle cx={18} cy={44} r={10} fill="#e8b080" /><circle cx={82} cy={44} r={10} fill="#e8b080" /><rect x={34} y={70} width={32} height={26} rx={6} fill="#3a6ad8" /></g>;
    case "comida": return <g><path d="M14,56 Q50,10 86,56 Z" fill="#e8a040" /><rect x={12} y={56} width={76} height={10} rx={4} fill="#5a3a1a" /><rect x={10} y={66} width={80} height={8} rx={4} fill="#6ab04a" /><path d="M14,74 L86,74 Q86,90 50,90 Q14,90 14,74 Z" fill="#e8a040" />{[30, 50, 70].map((x) => <circle key={x} cx={x} cy={36} r={2.5} fill="#fff2c8" />)}</g>;
    case "trabajo": return <g><rect x={16} y={34} width={68} height={48} rx={8} fill={c} /><rect x={38} y={22} width={24} height={14} rx={4} fill="none" stroke={c} strokeWidth={6} /><rect x={16} y={50} width={68} height={6} fill="#2a2e36" /></g>;
    case "mapa": return <g><path d="M50,88 Q20,52 20,38 A30,30 0 0 1 80,38 Q80,52 50,88 Z" fill={c} /><circle cx={50} cy={38} r={11} fill="#2a2e36" /></g>;
    case "chat": return <g><path d="M14,20 L86,20 Q90,20 90,26 L90,64 Q90,70 84,70 L40,70 L22,86 L24,70 L16,70 Q10,70 10,64 L10,26 Q10,20 14,20 Z" fill={c} />{[32, 50, 68].map((x) => <circle key={x} cx={x} cy={45} r={5} fill="#2a2e36" />)}</g>;
    case "musica": return <g><path d="M38,74 L38,22 L80,12 L80,64" stroke={c} strokeWidth={8} fill="none" /><circle cx={30} cy={74} r={12} fill={c} /><circle cx={72} cy={64} r={12} fill={c} /></g>;
    case "abuela": return <g><circle cx={50} cy={50} r={34} fill="#b8aea4" /><circle cx={38} cy={48} r={4} fill="#3a3430" /><circle cx={62} cy={48} r={4} fill="#3a3430" /><path d="M36,66 Q50,58 64,66" stroke="#3a3430" strokeWidth={4} fill="none" /><path d="M16,46 Q14,10 50,12 Q86,10 84,46 Q76,24 50,26 Q24,24 16,46 Z" fill="#e8e4dc" /><circle cx={38} cy={48} r={10} fill="none" stroke="#3a3430" strokeWidth={2.5} /><circle cx={62} cy={48} r={10} fill="none" stroke="#3a3430" strokeWidth={2.5} /></g>;
    case "noticia": return <g><rect x={16} y={16} width={68} height={68} rx={6} fill="#9aa0a8" /><rect x={24} y={24} width={52} height={10} fill="#5a606b" />{[44, 56, 68].map((y) => <rect key={y} x={24} y={y} width={52} height={6} fill="#6a707b" />)}</g>;
    case "corazon": return <path d="M50,84 L18,52 Q4,36 18,22 Q34,10 50,28 Q66,10 82,22 Q96,36 82,52 Z" fill={c} />;
  }
};
// tarjeta de feed con ícono vivo (pantalla útil del TelMarco): k decide qué muestra
export const TarjetaIcono: React.FC<{ y: number; t: React.ComponentProps<typeof Icono>["t"]; likes: number; triste?: boolean }> = ({ y, t, likes, triste }) => (
  <div style={{ position: "absolute", left: 22, top: y, width: 432, height: 400, borderRadius: 26, background: triste ? "#4a4d52" : "#353a43", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 22, top: 20, width: 50, height: 50, borderRadius: 25, background: triste ? "#6a6d72" : ACENTO }} />
    <div style={{ position: "absolute", left: 88, top: 28, width: 170, height: 14, borderRadius: 7, background: "#6a707b" }} />
    <div style={{ position: "absolute", left: 22, top: 86, width: 388, height: 240, borderRadius: 18, background: triste ? "#5a5d62" : "#2a2e36", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={200} height={200} viewBox="0 0 100 100" style={{ filter: undefined }}><Icono t={t} c={triste ? "#c8c8c8" : "#f4efe6"} /></svg>
    </div>
    <div style={{ position: "absolute", left: 22, bottom: 18, display: "flex", alignItems: "center", gap: 10, fontFamily: F_HUD, fontSize: 30, color: triste ? "#a0a0a0" : "#f4efe6" }}>
      <svg width={36} height={36} viewBox="0 0 100 100"><Icono t="corazon" c={triste ? "#8a8a8a" : ACENTO} /></svg>{likes.toLocaleString("en-US")}
    </div>
  </div>
);
// manos (pantalla): mano de piel con manga, apuntando hacia `ang` (0 = hacia arriba)
export const ManoGrande: React.FC<{ x: number; y: number; ang?: number; piel?: string; manga?: string; palma?: boolean; s?: number; largo?: number }> = ({ x, y, ang = 0, piel = "#e2ad78", manga = "#2a2c33", palma, s = 1, largo = 600 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang}) scale(${s})`}>
    <rect x={-70} y={40} width={140} height={largo} rx={50} fill={manga} stroke="#121316" strokeWidth={8} />
    <rect x={-58} y={-40} width={116} height={110} rx={50} fill={piel} stroke="#3a2618" strokeWidth={8} />
    {palma ? <><path d="M-58,-10 Q-110,-60 -96,-110 Q-84,-120 -70,-100 L-40,-40" fill={piel} stroke="#3a2618" strokeWidth={8} strokeLinejoin="round" />{[-34, -8, 18, 42].map((d, k) => <rect key={d} x={d - 13} y={-118 + Math.abs(k - 1.5) * 10} width={26} height={90} rx={13} fill={piel} stroke="#3a2618" strokeWidth={7} />)}<path d="M-30,10 Q0,30 34,8" stroke="#c8905a" strokeWidth={5} fill="none" /></>
      : <>{[-34, -8, 18].map((d) => <rect key={d} x={d - 14} y={-70} width={28} height={64} rx={14} fill={piel} stroke="#3a2618" strokeWidth={7} />)}<rect x={36} y={-50} width={28} height={70} rx={14} fill={piel} stroke="#3a2618" strokeWidth={7} transform="rotate(-30 50 -20)" /></>}
  </g>
);
// el celu de pantalla en svg (para manos y ventanas): w x h, prendido 0..1, reflejo 0..1
export const TelSvg: React.FC<{ x: number; y: number; w?: number; ang?: number; prendido?: number; reflejo?: number; children?: React.ReactNode }> = ({ x, y, w = 200, ang = 0, prendido = 1, reflejo = 0, children }) => {
  const h = w * 1.95;
  return (
    <g transform={`translate(${x},${y}) rotate(${ang})`}>
      {prendido > 0 && <><defs><radialGradient id="telHalo"><stop offset="0" stopColor={ACENTO} stopOpacity={0.35} /><stop offset="1" stopColor={ACENTO} stopOpacity={0} /></radialGradient></defs><circle r={w * 1.5} fill="url(#telHalo)" opacity={prendido} /></>}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#15171c" stroke="#3a3d44" strokeWidth={6} />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={w * 0.1} fill="#0b0c0f" />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={w * 0.1} fill={ACENTO} opacity={0.85 * prendido} />
      {prendido > 0 && [0, 1, 2, 3].map((k) => <rect key={k} x={-w / 2 + 26} y={-h / 2 + 60 + k * (h / 5)} width={w - 52} height={h / 7} rx={10} fill="#ffd2b8" opacity={0.5 * prendido} />)}
      {reflejo > 0 && <g opacity={reflejo * 0.45}><circle cx={0} cy={-h * 0.08} r={w * 0.3} fill="none" stroke="#c8d0dc" strokeWidth={5} /><circle cx={-w * 0.1} cy={-h * 0.1} r={6} fill="#c8d0dc" /><circle cx={w * 0.1} cy={-h * 0.1} r={6} fill="#c8d0dc" /><path d={`M${-w * 0.08},${-h * 0.02} q${w * 0.08},-${w * 0.05} ${w * 0.16},0`} stroke="#c8d0dc" strokeWidth={4} fill="none" /><path d={`M${-w / 2 + 14},${-h / 2 + 30} L${w / 2 - 40},${h / 2 - 20}`} stroke="#fff" strokeWidth={14} opacity={0.12} /></g>}
      {children}
    </g>
  );
};
// retrato (cara) que envejece: edad 0..1 · tipo decide pelo/barba/accesorios
export const Retrato: React.FC<{ x: number; y: number; r?: number; tipo: "rey" | "esposa" | "sidd" | "viejo36" | "mama" | "leo" | "nino"; edad?: number; cara?: "feliz" | "triste" | "neutral" }> = ({ x, y, r = 80, tipo, edad = 0, cara = "neutral" }) => {
  const piel = { rey: "#d9a273", esposa: "#cf9468", sidd: "#dfa877", viejo36: "#d9b896", mama: "#e2b48a", leo: "#e8c4a0", nino: "#dfa877" }[tipo];
  const pelo0 = { rey: "#2a1a10", esposa: "#1e1410", sidd: "#22160e", viejo36: "#d9d6d0", mama: "#7a4a2a", leo: "#16141a", nino: "#22160e" }[tipo];
  const canas = "#e9e6e0";
  const mez = (a: string, b: string, t: number) => { const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
  const pelo = mez(pelo0, canas, Math.min(1, edad * 1.2));
  const boca = cara === "feliz" ? `M-24,28 Q0,${46 - edad * 10} 24,28` : cara === "triste" ? "M-22,38 Q0,24 22,38" : "M-20,32 L20,32";
  return (
    <g transform={`translate(${x},${y}) scale(${r / 80})`}>
      <circle r={80} fill="#2a2e36" stroke="#f4efe6" strokeWidth={5} />
      {(tipo === "esposa" || tipo === "mama") && <path d="M-64,10 Q-74,-70 0,-74 Q74,-70 64,10 L56,70 L-56,70 Z" fill={pelo} />}
      <ellipse cx={0} cy={6} rx={50} ry={56} fill={piel} stroke="#2a2622" strokeWidth={5} />
      {tipo !== "viejo36" && <path d={tipo === "esposa" || tipo === "mama" ? "M-52,-6 Q-40,-62 0,-60 Q40,-62 52,-6 Q30,-36 0,-34 Q-30,-36 -52,-6 Z" : tipo === "leo" ? "M-54,-4 L-44,-60 L-24,-44 L-10,-70 L6,-46 L24,-68 L36,-42 L54,-50 L52,-4 Q30,-32 0,-30 Q-30,-32 -54,-4 Z" : "M-50,-10 Q-44,-60 0,-58 Q44,-60 50,-10 Q28,-34 0,-32 Q-28,-34 -50,-10 Z"} fill={pelo} />}
      {tipo === "viejo36" && <path d="M-56,-18 Q-50,-64 0,-64 Q50,-64 56,-18 L64,-14 L-64,-14 Z" fill="#3a3d42" />}
      {(tipo === "rey" || tipo === "viejo36" || (tipo === "sidd" && edad > 0.4)) && <path d={`M-46,14 Q-40,${70 + edad * 30} 0,${74 + edad * 34} Q40,${70 + edad * 30} 46,14 Q30,40 0,42 Q-30,40 -46,14 Z`} fill={tipo === "sidd" ? mez("#22160e", canas, edad) : pelo} opacity={tipo === "sidd" ? Math.min(1, (edad - 0.4) * 3) : 1} />}
      {tipo === "rey" && <path d="M-40,-56 L-30,-92 L-14,-66 L0,-98 L14,-66 L30,-92 L40,-56 Z" fill="#e0b040" stroke="#8a5a2a" strokeWidth={3} />}
      {tipo === "esposa" && <circle cx={0} cy={-24} r={5} fill="#c8403a" />}
      <circle cx={-18} cy={2} r={6} fill="#2a1a10" /><circle cx={18} cy={2} r={6} fill="#2a1a10" />
      <path d={boca} stroke="#2a1a10" strokeWidth={5} fill="none" strokeLinecap="round" />
      {edad > 0.25 && <g opacity={Math.min(1, (edad - 0.25) * 2)} stroke="#8a5a3a" strokeWidth={3} fill="none" strokeLinecap="round"><path d="M-30,-22 q14,-6 28,0 M2,-22 q14,-6 28,0" /><path d="M-38,12 q-6,8 -2,16 M38,12 q6,8 2,16" /><path d="M-30,-34 q30,-8 60,0" /></g>}
      {tipo === "mama" && <path d="M-60,40 q-18,10 -10,30" stroke="#f4efe6" strokeWidth={4} fill="none" />}
    </g>
  );
};
// la reina de las cuentas regresivas: 24:00:00 bajando (pantalla)
export const Cuenta: React.FC<{ x: number; y: number; desde: number; seg0: number; vel?: number; tam?: number; rotulo?: string }> = ({ x, y, desde, seg0, vel = 60, tam = 76, rotulo }) => {
  const f = useF();
  const s = usePop(desde);
  if (f < desde) return null;
  const t = Math.max(0, seg0 - ((f - desde) / 30) * vel);
  const hh = Math.floor(t / 3600), mm = Math.floor((t % 3600) / 60), ss = Math.floor(t % 60);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.8 + 0.2 * s})`, opacity: s, textAlign: "center", fontFamily: F_HUD }}>
      <div style={{ fontWeight: 600, fontSize: tam, color: ACENTO, letterSpacing: 2, fontVariantNumeric: "tabular-nums", textShadow: `0 0 24px ${ACENTO}88, 0 3px 0 rgba(0,0,0,0.5)` }}>{p(hh)}:{p(mm)}:{p(ss)}</div>
      {rotulo && <div style={{ fontWeight: 500, fontSize: tam * 0.36, letterSpacing: 5, color: "#f4efe6", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{rotulo}</div>}
    </div>
  );
};
// trazo que se dibuja (pantalla): d = path, p 0..1
export const Trazo: React.FC<{ d: string; p: number; color?: string; w?: number; largo?: number; guiones?: boolean }> = ({ d, p, color = "#f4efe6", w = 8, largo = 3000, guiones }) => (
  <g>
    <defs><mask id={`m${d.length}${w}`}><path d={d} stroke="#fff" strokeWidth={w + 6} fill="none" strokeDasharray={largo} strokeDashoffset={largo * (1 - p)} strokeLinecap="round" /></mask></defs>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={guiones ? `${w * 2.2} ${w * 2}` : undefined} mask={`url(#m${d.length}${w})`} />
  </g>
);
// letra a mano grande en svg (para dentro de lienzos)
export const TxtSvg: React.FC<{ x: number; y: number; t: string; tam?: number; color?: string; mano?: boolean; o?: number; anchor?: "start" | "middle" | "end" }> = ({ x, y, t, tam = 40, color = "#f4efe6", mano, o = 1, anchor = "middle" }) => (
  <text x={x} y={y} fontFamily={mano ? F_MANO : F_HUD} fontWeight={600} fontSize={tam} fill={color} textAnchor={anchor} opacity={o} letterSpacing={mano ? 0 : 2}>{t}</text>
);
// copos/estrellas de hielo que crecen (pantalla) sobre un rect
export const Hielo: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => (
  <g opacity={Math.min(1, p * 1.5)}>
    <rect x={x} y={y} width={w} height={h} rx={20} fill="#bfe6ff" opacity={0.22 * p} />
    {Array.from({ length: 14 }).map((_, k) => {
      const cx = x + random(`hx${k}`) * w, cy = y + random(`hy${k}`) * h, r = (16 + random(`hr${k}`) * 30) * Math.min(1, p * 1.4 - random(`hd${k}`) * 0.4);
      if (r <= 0) return null;
      return <g key={k} transform={`translate(${cx},${cy}) rotate(${k * 23})`} stroke="#e8f6ff" strokeWidth={3} strokeLinecap="round">{[0, 60, 120].map((a) => <g key={a} transform={`rotate(${a})`}><line x1={-r} y1={0} x2={r} y2={0} /><line x1={r * 0.5} y1={0} x2={r * 0.75} y2={-r * 0.22} /><line x1={-r * 0.5} y1={0} x2={-r * 0.75} y2={r * 0.22} /></g>)}</g>;
    })}
  </g>
);
// anillos de llamada que salen de un punto (pantalla)
export const Anillos: React.FC<{ x: number; y: number; f: number; color?: string; n?: number; r0?: number }> = ({ x, y, f, color = ACENTO, n = 3, r0 = 120 }) => (
  <g>{Array.from({ length: n }).map((_, k) => { const t = ((f + k * 12) % 36) / 36; return <circle key={k} cx={x} cy={y} r={r0 + t * 260} fill="none" stroke={color} strokeWidth={10 * (1 - t)} opacity={1 - t} />; })}</g>
);
// la hoja de calendario que se arranca (pantalla). n = número que muestra
export const HojaCal: React.FC<{ x: number; y: number; n: string; sub?: string; caida?: number; tam?: number }> = ({ x, y, n, sub = "DAYS AGO", caida = 0, tam = 1 }) => (
  <g transform={`translate(${x + caida * 260},${y + caida * caida * 500}) rotate(${caida * 50}) scale(${tam})`} opacity={1 - caida * 0.6}>
    <rect x={-180} y={-200} width={360} height={400} rx={24} fill="#f4efe6" stroke="#2a2622" strokeWidth={6} />
    <rect x={-180} y={-200} width={360} height={90} rx={24} fill={ACENTO} />
    <rect x={-180} y={-130} width={360} height={20} fill={ACENTO} />
    {[-110, -40, 40, 110].map((d) => <circle key={d} cx={d} cy={-200} r={12} fill="#2a2622" />)}
    <text x={0} y={70} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={190} fill="#2a2622">{n}</text>
    <text x={0} y={150} textAnchor="middle" fontFamily={F_HUD} fontWeight={500} fontSize={40} letterSpacing={6} fill="#5a5450">{sub}</text>
  </g>
);
// portón que se abre (dibujo de burbuja, -100..100): a 0..1
export const PortonDib: React.FC<{ a: number; cielo?: string }> = ({ a, cielo = "#ffd9a0" }) => (
  <g>
    <rect x={-120} y={-120} width={240} height={240} fill="#d9a86e" />
    <path d="M-50,90 L-50,-10 Q0,-70 50,-10 L50,90 Z" fill={cielo} />
    <path d="M-20,90 L20,90 L60,120 L-60,120 Z" fill="#e8c890" />
    <circle cx={0} cy={10} r={14} fill="#fff2c8" opacity={a} />
    {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 50},90 L${sd * 50},-10 Q${sd * 25},-45 0,-48 L0,90 Z`} fill="#8a5a2a" stroke="#5a3418" strokeWidth={3} transform={`translate(${sd * 50},0) scale(${1 - a * 0.85},1) translate(${-sd * 50},0)`} />)}
    {Array.from({ length: 6 }).map((_, k) => <line key={k} x1={-120} y1={-100 + k * 30} x2={-60} y2={-100 + k * 30} stroke="#b07c4a" strokeWidth={2} />)}
  </g>
);
// lago con un celu que se hunde (dibujo de burbuja)
export const LagoDib: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-120} y={-120} width={240} height={110} fill="#c8d8e8" />
    <path d="M-120,-30 L-70,-60 L-20,-35 L30,-70 L80,-40 L120,-55 L120,-10 L-120,-10 Z" fill="#8a9aaa" />
    <rect x={-120} y={-10} width={240} height={130} fill="#4a7aa8" />
    {[0, 1, 2].map((k) => <ellipse key={k} cx={10} cy={30} rx={20 + ((t * 60 + k * 20) % 60)} ry={6 + ((t * 20 + k * 7) % 20)} fill="none" stroke="#bfe0ff" strokeWidth={3} opacity={t > 0.4 ? 1 - ((t * 60 + k * 20) % 60) / 60 : 0} />)}
    <g transform={`translate(${-60 + t * 70},${-90 + t * 120 + (t > 0.4 ? (t - 0.4) * 40 : 0)}) rotate(${t * 300})`} opacity={t > 0.75 ? 1 - (t - 0.75) * 4 : 1}><rect x={-12} y={-22} width={24} height={44} rx={5} fill="#15171c" /><rect x={-8} y={-17} width={16} height={34} rx={3} fill={ACENTO} /></g>
  </g>
);
// bici (dibujo simple, -100..100)
export const BiciDib: React.FC<{ color?: string; jinete?: boolean; t?: number }> = ({ color = "#c8403a", jinete, t = 0 }) => (
  <g transform={`translate(${Math.sin(t) * 6},0)`}>
    {[-46, 46].map((d) => <g key={d}><circle cx={d} cy={40} r={32} fill="none" stroke="#2a2622" strokeWidth={6} /><line x1={d} y1={40} x2={d + 30 * Math.cos(t * 4)} y2={40 + 30 * Math.sin(t * 4)} stroke="#2a2622" strokeWidth={3} /></g>)}
    <path d="M-46,40 L-14,-10 L32,-10 L46,40 M-14,-10 L0,40 L32,-10 M32,-10 L36,-26 M-18,-22 L-6,-22" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {jinete && <g><circle cx={10} cy={-78} r={18} fill="#16141a" /><path d="M6,-60 L-6,-18 M2,-50 L34,-26 M-6,-18 L0,40" stroke="#16141a" strokeWidth={9} strokeLinecap="round" fill="none" /></g>}
  </g>
);
// el viejo de la parada (dibujo de burbuja)
export const ViejoDib: React.FC = () => <g><rect x={-120} y={30} width={240} height={90} fill="#3a3d44" /><rect x={-90} y={30} width={180} height={10} fill="#6a707b" /><Retrato x={0} y={-20} r={56} tipo="viejo36" cara="triste" /></g>;
export const MamaDib: React.FC = () => <g><rect x={-120} y={-120} width={240} height={240} fill="#e8d8c0" /><Retrato x={0} y={-6} r={60} tipo="mama" cara="triste" /><path d="M48,-40 q16,-6 22,6 M58,-56 q20,-8 28,8" stroke="#8a5a3a" strokeWidth={4} fill="none" /></g>;
// pétalos / papel picado que caen (pantalla): desde = cuadro en que arrancan
export const Petalos: React.FC<{ f: number; desde: number; n?: number; colores?: string[] }> = ({ f, desde, n = 34, colores = ["#f2c14a", "#e85a6a", "#fff2c8", "#e8833a"] }) => {
  const t = f - desde;
  if (t < 0) return null;
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n }).map((_, k) => {
        const x0 = ((k * 397) % 1920), v = 9 + (k % 5) * 2.2, y = -40 - (k % 7) * 60 + t * v;
        const x = x0 + Math.sin(t / 9 + k) * 30;
        return <ellipse key={k} cx={x} cy={y} rx={11} ry={6} fill={colores[k % colores.length]} transform={`rotate(${(t * 7 + k * 40) % 360} ${x} ${y})`} />;
      })}
    </svg>
  );
};
// bebé alzado y despierto (en mano): pataleta y bracitos que se agitan con f
export const BebeAlzado: React.FC<{ s?: number; f: number }> = ({ s = 1, f }) => {
  const a = Math.sin(f / 4) * 14, p = Math.sin(f / 3.3) * 10;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M-14,30 l${-6 + p * 0.4},26 M14,30 l${6 - p * 0.4},26`} stroke="#e2ad78" strokeWidth={9} strokeLinecap="round" />
      <path d="M-30,-8 Q-34,30 0,40 Q34,30 30,-8 Q0,-24 -30,-8 Z" fill="#fff2dc" stroke="#d9c4a0" strokeWidth={3} />
      <path d={`M-26,0 q-18,${-10 + a} -26,${-24 + a}`} stroke="#e2ad78" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M26,0 q18,${-10 - a} 26,${-24 - a}`} stroke="#e2ad78" strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-34} r={26} fill="#e2ad78" stroke="#c8905a" strokeWidth={2} />
      <circle cx={-9} cy={-37} r={3.6} fill="#3a2618" /><circle cx={9} cy={-37} r={3.6} fill="#3a2618" />
      <path d="M-8,-24 q8,7 16,0" stroke="#a8503a" strokeWidth={3} fill="none" strokeLinecap="round" />
      <circle cx={-16} cy={-28} r={4} fill="#e88a7a" opacity={0.6} /><circle cx={16} cy={-28} r={4} fill="#e88a7a" opacity={0.6} />
    </g>
  );
};
// reloj de pared (pantalla o mundo): h/m en horas y minutos, brillo 0..1
export const RelojDig: React.FC<{ x: number; y: number; t: string; s?: number; parpadeo?: boolean }> = ({ x, y, t, s = 1, parpadeo }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-120} y={-52} width={240} height={104} rx={18} fill="#121418" stroke="#2c3038" strokeWidth={5} />
    <circle cx={0} cy={0} r={150} fill="#ff4a3d" opacity={0.08} />
    <text x={0} y={26} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={74} fill="#ff4a3d" opacity={parpadeo ? 0.55 : 1}>{t}</text>
  </g>
);
