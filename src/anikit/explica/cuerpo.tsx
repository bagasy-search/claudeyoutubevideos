// CorteCuerpo: silueta con los órganos adentro → el órgano del tema se enciende → un círculo de ZOOM sale de él
// (sale DESDE el órgano, con resorte) y lo muestra grande y vivo: el corazón late, los pulmones respiran, el cerebro
// dispara chispas, el estómago burbujea. Rótulo + dato abajo del zoom. Va en el hud (coordenadas de pantalla).
import React from "react";
import { interpolate } from "remotion";
import { F_HUD } from "../pantalla";
import { clamp, Cue, cue, Sombra, useReloj } from "./comun";

export type Organo = "corazon" | "pulmones" | "cerebro" | "estomago" | "higado";
export type CorteCuerpoProps = {
  x: number; y: number; s?: number; organo: Organo; desde: number; hasta?: number;
  acento?: string; rotulo?: string; dato?: string; lado?: 1 | -1; // hacia dónde sale el zoom
  dañado?: number; // 0..1 manchas oscuras en el órgano (fumar, alcohol…)
  piel?: string; contorno?: string;
};

// dibujos de cada órgano centrados en (0,0), tamaño ~1 = radio 100
const CORAZON = "M0,-38 C22,-95 98,-80 92,-18 C88,30 40,62 0,96 C-40,62 -88,30 -92,-18 C-98,-80 -22,-95 0,-38 Z";
const PULMON = "M14,-96 C58,-104 92,-28 88,48 C86,92 46,104 18,84 C10,40 6,-30 14,-96 Z";
const ESTOMAGO = "M-46,-74 C-20,-96 14,-70 10,-36 C6,-6 58,-14 76,20 C94,62 34,96 -14,80 C-66,62 -62,6 -46,-74 Z";
const HIGADO = "M-96,-24 C-70,-62 46,-70 98,-46 C108,-22 66,22 14,42 C-42,62 -100,32 -96,-24 Z";
const CEREBRO: [number, number, number][] = [[-48, -10, 46], [-14, -36, 48], [26, -32, 46], [56, 0, 40], [30, 30, 42], [-16, 30, 44], [-52, 26, 34], [8, -2, 52]];

const colorOrg: Record<Organo, string> = { corazon: "#e2483a", pulmones: "#f08a8a", cerebro: "#f3a6b6", estomago: "#f0a95a", higado: "#9b3a2e" };
// dónde va cada órgano dentro de la silueta (local, cuerpo de ~620 de alto) y su escala chica
const lugar: Record<Organo, { x: number; y: number; k: number }> = {
  cerebro: { x: 0, y: -236, k: 0.5 }, pulmones: { x: 0, y: -56, k: 0.58 }, corazon: { x: 10, y: -40, k: 0.3 },
  higado: { x: -26, y: 46, k: 0.42 }, estomago: { x: 34, y: 58, k: 0.4 },
};

const pulsoLatido = (f: number) => {
  // lub-dub cada 26 cuadros (~70 lpm): dos golpes que se apagan rápido
  const k = ((f % 26) + 26) % 26;
  return Math.exp(-k / 2.6) * 1 + (k >= 7 ? Math.exp(-(k - 7) / 2.6) * 0.6 : 0);
};

const DibujoOrgano: React.FC<{ o: Organo; f: number; grande?: boolean; color?: string; dañado?: number; contorno: string }> = ({ o, f, grande, color, dañado = 0, contorno }) => {
  const c = color ?? colorOrg[o];
  const sw = grande ? 5 : 3;
  const manchas = dañado > 0 && [[-30, -10, 16], [24, 18, 12], [6, -40, 9], [-12, 40, 11], [40, -22, 8]].map(([mx, my, r], i) => (
    <circle key={i} cx={mx} cy={my} r={r * (0.6 + dañado * 0.6)} fill="#2a1a18" opacity={0.55 * dañado} />
  ));
  if (o === "corazon") {
    const b = grande ? 1 + 0.07 * pulsoLatido(f) : 1;
    return (
      <g transform={`scale(${b})`}>
        {grande && <path d="M-18,-60 C-22,-110 20,-126 44,-104 M18,-66 C16,-96 54,-100 66,-80" stroke={contorno} strokeWidth={22} fill="none" strokeLinecap="round" />}
        {grande && <path d="M-18,-60 C-22,-110 20,-126 44,-104 M18,-66 C16,-96 54,-100 66,-80" stroke="#c8392e" strokeWidth={14} fill="none" strokeLinecap="round" />}
        <path d={CORAZON} fill={c} stroke={contorno} strokeWidth={sw} strokeLinejoin="round" />
        {grande && <path d="M-60,-40 C-58,-62 -36,-70 -22,-58" stroke="#fff" strokeOpacity={0.5} strokeWidth={9} fill="none" strokeLinecap="round" />}
        {grande && <path d="M8,-30 C2,10 20,40 4,80" stroke="#a82a22" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />}
        {manchas}
      </g>
    );
  }
  if (o === "pulmones") {
    const b = grande ? 1 + 0.045 * Math.sin((f / 30) * Math.PI * 2 * 0.28) : 1;
    return (
      <g transform={`scale(${b},${1 + (b - 1) * 1.3})`}>
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`scale(${sd},1)`}>
            <path d={PULMON} fill={c} stroke={contorno} strokeWidth={sw} strokeLinejoin="round" />
            {grande && <path d="M4,-104 L8,-60 Q20,-20 46,6 M8,-60 Q30,-50 52,-56 M14,-20 Q30,30 30,64 M30,8 Q54,26 66,52" stroke="#c45a5a" strokeWidth={4} fill="none" strokeLinecap="round" />}
            {grande && <path d="M30,-70 C44,-76 58,-56 62,-36" stroke="#fff" strokeOpacity={0.45} strokeWidth={8} fill="none" strokeLinecap="round" />}
          </g>
        ))}
        {grande && <path d="M0,-130 L0,-100" stroke={contorno} strokeWidth={14} strokeLinecap="round" />}
        {manchas}
      </g>
    );
  }
  if (o === "cerebro") {
    // chispas: puntos que recorren 3 caminos (neuronas disparando), cada uno con su período
    const caminos = [[[-60, -10], [-20, -40], [30, -30], [60, 0]], [[-50, 30], [-10, 10], [30, 30]], [[-20, -50], [0, 0], [-10, 40]]];
    return (
      <g>
        {CEREBRO.map(([x, y, r], i) => <circle key={"o" + i} cx={x} cy={y} r={r + sw} fill={contorno} />)}
        {CEREBRO.map(([x, y, r], i) => <circle key={"i" + i} cx={x} cy={y} r={r} fill={c} />)}
        <g stroke="#c9748a" strokeWidth={grande ? 4 : 2.5} fill="none" strokeLinecap="round">
          <path d="M0,-80 C-6,-40 6,0 -4,60" /><path d="M-60,-30 Q-40,-20 -46,4 Q-52,26 -30,34" /><path d="M30,-62 Q12,-40 30,-20 Q48,0 34,24" />
          <path d="M-30,-60 Q-24,-46 -36,-34" /><path d="M58,-24 Q42,-10 54,10" /><path d="M-6,40 Q10,50 8,70" />
        </g>
        {grande && caminos.map((cm, i) => {
          const per = 34 + i * 9, u = (((f + i * 11) % per) + per) % per / per;
          const seg = u * (cm.length - 1), k = Math.floor(seg), t = seg - k;
          const a = cm[k], b = cm[Math.min(k + 1, cm.length - 1)];
          const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t;
          return (
            <g key={i}>
              <polyline points={cm.map((p) => p.join(",")).join(" ")} stroke="#fff3a0" strokeOpacity={0.35} strokeWidth={3} fill="none" />
              <circle cx={px} cy={py} r={9} fill="#fff3a0" opacity={0.45} /><circle cx={px} cy={py} r={4.5} fill="#ffffff" />
            </g>
          );
        })}
        {manchas}
      </g>
    );
  }
  if (o === "estomago") {
    const ola = (x: number) => 20 + 6 * Math.sin(x / 14 + f / 6);
    const liq = "M-70," + ola(-70) + Array.from({ length: 15 }, (_, i) => { const x = -70 + i * 11; return ` L${x},${ola(x).toFixed(1)}`; }).join("") + " L100,120 L-70,120 Z";
    return (
      <g>
        <defs><clipPath id={`est${grande ? "g" : "c"}`}><path d={ESTOMAGO} /></clipPath></defs>
        <path d={ESTOMAGO} fill={c} stroke={contorno} strokeWidth={sw} strokeLinejoin="round" />
        {grande && (
          <g clipPath="url(#estg)">
            <path d={liq} fill="#d7e05a" opacity={0.8} />
            {[0, 1, 2, 3, 4].map((i) => { const per = 40 + i * 7, u = ((f + i * 13) % per) / per; return <circle key={i} cx={-30 + i * 18} cy={70 - u * 50} r={4 + (i % 2) * 3} fill="#f4f7b0" opacity={1 - u} />; })}
          </g>
        )}
        <path d={ESTOMAGO} fill="none" stroke={contorno} strokeWidth={sw} strokeLinejoin="round" />
        {manchas}
      </g>
    );
  }
  return (
    <g>
      <path d={HIGADO} fill={c} stroke={contorno} strokeWidth={sw} strokeLinejoin="round" />
      {grande && <path d="M-20,-50 C-10,-10 0,10 14,40" stroke="#7a2a20" strokeWidth={4} fill="none" strokeLinecap="round" />}
      {grande && <path d="M-70,-30 C-56,-48 -20,-54 6,-52" stroke="#fff" strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />}
      {manchas}
    </g>
  );
};

export const CorteCuerpo: React.FC<CorteCuerpoProps> = ({ x, y, s = 1, organo, desde, hasta, acento = "#ffc93c", rotulo, dato, lado = 1, dañado = 0, piel = "#f4ece0", contorno = "#2a2220" }) => {
  const { f, ent, suave, salida } = useReloj(desde, hasta);
  if (f < 0) return null;
  const eC = ent(0, { damping: 14 });
  const L = lugar[organo];
  const orden: Organo[] = ["cerebro", "pulmones", "corazon", "higado", "estomago"];
  const brillo = interpolate(f, [40, 50], [0, 1], clamp);
  // zoom: sale del órgano y viaja al costado; R = radio del círculo grande
  const R = 190, zx = lado * 400, zy = -120;
  const eZ = ent(56, { damping: 11, stiffness: 90 });
  const cxZ = L.x + (zx - L.x) * eZ, cyZ = L.y + (zy - L.y) * eZ, rZ = 30 + (R - 30) * eZ;
  const linea = suave(56, 16);
  const eT = ent(78);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: salida }}>
      <g transform={`translate(${x},${y}) scale(${s})`}>
        {/* silueta (cuerpo en corte): cabeza, cuello, torso con hombros */}
        <g transform={`translate(0,${(1 - eC) * 40}) scale(${0.92 + 0.08 * eC})`} opacity={Math.min(1, eC * 1.4)}>
          <Sombra dy={10} o={0.25}>
            <circle cx={0} cy={-236} r={92} /><path d="M-150,-120 Q-160,-150 -110,-150 L110,-150 Q160,-150 150,-120 L120,220 Q0,250 -120,220 Z" />
          </Sombra>
          {/* brazos: la silueta se lee como persona y no como vasija */}
          {[-1, 1].map((sd) => <g key={sd}><path d={`M${sd * 128},-118 Q${sd * 196},-60 ${sd * 186},150`} stroke={contorno} strokeWidth={66} strokeLinecap="round" fill="none" /><path d={`M${sd * 128},-118 Q${sd * 196},-60 ${sd * 186},150`} stroke={piel} strokeWidth={56} strokeLinecap="round" fill="none" /></g>)}
          <path d="M-150,-120 Q-160,-150 -110,-150 L110,-150 Q160,-150 150,-120 L120,220 Q0,250 -120,220 Z" fill={piel} stroke={contorno} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-34} y={-168} width={68} height={36} fill={piel} />
          <circle cx={0} cy={-236} r={92} fill={piel} stroke={contorno} strokeWidth={5} />
          <path d="M-34,-150 L34,-150" stroke={piel} strokeWidth={8} />
          {/* costillas apenas marcadas */}
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M-104,${-112 + i * 30} Q0,${-92 + i * 30} 104,${-112 + i * 30}`} stroke={contorno} strokeOpacity={0.12} strokeWidth={4} fill="none" />)}
          {orden.map((o, i) => {
            const e = ent(12 + i * 5, { damping: 10, stiffness: 160 });
            const p = lugar[o];
            const foco = o === organo;
            const atenuar = foco ? 1 : 1 - 0.55 * brillo;
            return (
              <g key={o} transform={`translate(${p.x},${p.y}) scale(${p.k * e})`} opacity={atenuar}>
                <DibujoOrgano o={o} f={f} contorno={contorno} dañado={foco ? dañado : 0} />
              </g>
            );
          })}
          {/* anillo que marca el órgano del tema */}
          {brillo > 0 && [0, 1].map((k) => {
            const u = (((f - 40 + k * 14) % 28) + 28) % 28 / 28;
            return <circle key={k} cx={L.x} cy={L.y} r={L.k * 100 + 10 + u * 40} fill="none" stroke={acento} strokeWidth={6 * (1 - u)} opacity={brillo * (1 - u)} />;
          })}
          {/* conector del callout: dos tangentes del órgano al círculo grande */}
          {linea > 0 && (() => {
            const dx = cxZ - L.x, dy = cyZ - L.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, r0 = L.k * 100 + 8;
            return <path d={`M${L.x + nx * r0},${L.y + ny * r0} L${cxZ + nx * rZ},${cyZ + ny * rZ} M${L.x - nx * r0},${L.y - ny * r0} L${cxZ - nx * rZ},${cyZ - ny * rZ}`} stroke={acento} strokeWidth={4} strokeDasharray="10 8" opacity={linea * 0.9} />;
          })()}
          {/* círculo de zoom */}
          {eZ > 0.01 && (
            <g>
              <circle cx={cxZ} cy={cyZ + 10} r={rZ} fill="#000" opacity={0.25} />
              <circle cx={cxZ} cy={cyZ} r={rZ} fill="#fbf6ec" stroke={acento} strokeWidth={8} />
              <defs><clipPath id={`zc${organo}${desde}`}><circle cx={cxZ} cy={cyZ} r={rZ - 4} /></clipPath></defs>
              <g clipPath={`url(#zc${organo}${desde})`}>
                {/* fondo de tejido: anillos suaves concéntricos */}
                {[0.9, 0.7, 0.5].map((k, i) => <circle key={i} cx={cxZ} cy={cyZ} r={rZ * k} fill={colorOrg[organo]} opacity={0.06} />)}
                <g transform={`translate(${cxZ},${cyZ}) scale(${(rZ / R) * 1.45})`}>
                  <DibujoOrgano o={organo} f={f} grande contorno={contorno} dañado={dañado} />
                </g>
              </g>
            </g>
          )}
          {/* rótulo y dato bajo el zoom */}
          {(rotulo || dato) && (
            <g transform={`translate(${zx + lado * 90},${zy + R + 70}) scale(${0.8 + 0.2 * eT})`} opacity={Math.min(1, eT)} fontFamily={F_HUD} textAnchor="middle">
              <rect x={-230} y={-50} width={460} height={dato ? 168 : 74} rx={30} fill="#141018" opacity={0.86} />
              {rotulo && <text y={0} fontSize={44} fontWeight={600} fill="#f6f1e6" stroke="#000" strokeOpacity={0.45} strokeWidth={8} paintOrder="stroke" letterSpacing={2}>{rotulo}</text>}
              {dato && <text y={92} fontSize={84} fontWeight={600} fill={acento} stroke="#000" strokeOpacity={0.45} strokeWidth={8} paintOrder="stroke">{dato}</text>}
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

// foley: entrada, un pop por órgano, el anillo, el zoom y (corazón) cada latido mientras se ve
export const foleyCorteCuerpo = (p: Pick<CorteCuerpoProps, "desde" | "organo" | "hasta">): Cue[] => {
  const d = p.desde;
  const c: Cue[] = [cue(d, "whoosh", -8), ...[0, 1, 2, 3, 4].map((i) => cue(d + 12 + i * 5, "pop", -10)), cue(d + 40, "ding", -8), cue(d + 56, "zoom", -6)];
  if (p.organo === "corazon") for (let k = d + 70; k < (p.hasta ?? d + 180); k += 26) c.push(cue(k, "heart", -4));
  return c;
};
